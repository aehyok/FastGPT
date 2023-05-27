import { PgClient } from '@/service/pg';
import { ModelDataStatusEnum, ModelVectorSearchModeEnum, ChatModelMap } from '@/constants/model';
import { ModelSchema } from '@/types/mongoSchema';
import { openaiCreateEmbedding } from '../utils/chat/openai';
import { ChatRoleEnum } from '@/constants/chat';
import { modelToolMap } from '@/utils/chat';
import { ChatItemSimpleType } from '@/types/chat';

/**
 *  use openai embedding search kb
 */
export const searchKb = async ({
  userOpenAiKey,
  prompts,
  similarity = 0.2,
  model,
  userId
}: {
  userOpenAiKey?: string;
  prompts: ChatItemSimpleType[];
  model: ModelSchema;
  userId: string;
  similarity?: number;
}): Promise<{
  code: 200 | 201;
  searchPrompts: {
    obj: ChatRoleEnum;
    value: string;
  }[];
}> => {
  async function search(textArr: string[] = []) {
    const limitMap: Record<ModelVectorSearchModeEnum, number> = {
      [ModelVectorSearchModeEnum.hightSimilarity]: 3,
      [ModelVectorSearchModeEnum.noContext]: 3,
      [ModelVectorSearchModeEnum.lowSimilarity]: 3
    };
    // 获取提示词的向量
    const { vectors: promptVectors } = await openaiCreateEmbedding({
      userOpenAiKey,
      userId,
      textArr
    });

    const searchRes = await Promise.all(
      promptVectors.map((promptVector) =>
        PgClient.select<{ id: string; q: string; a: string }>('modelData', {
          fields: ['id', 'q', 'a'],
          where: [
            ['status', ModelDataStatusEnum.ready],
            'AND',
            ['model_id', model._id],
            'AND',
            `vector <=> '[${promptVector}]' < ${similarity}`
          ],
          order: [{ field: 'vector', mode: `<=> '[${promptVector}]'` }],
          limit: limitMap[model.chat.searchMode]
        }).then((res) => {
          console.log('res.rows', res.rows);
          return res.rows;
        })
      )
    );

    // Remove repeat record
    const idSet = new Set<string>();
    const filterSearch = searchRes.map((search) =>
      search.filter((item) => {
        if (idSet.has(item.id)) {
          return false;
        }
        idSet.add(item.id);
        return true;
      })
    );

    return filterSearch.map((item) =>
      item
        .map((item, index) => `第${index + 1}段:\n问题：${item.q}\n\n答案：${item.a}`)
        .join('\n\n')
    );
  }
  const modelConstantsData = ChatModelMap[model.chat.chatModel];

  // search three times
  const userPrompts = prompts.filter((item) => item.obj === 'Human');

  const searchArr: string[] = [
    userPrompts[userPrompts.length - 1].value,
    userPrompts[userPrompts.length - 2]?.value
  ].filter((item) => item);
  const systemPrompts = await search(searchArr);

  // filter system prompts.
  const filterRateMap: Record<number, number[]> = {
    1: [1],
    2: [0.7, 0.3]
  };
  const filterRate = filterRateMap[systemPrompts.length] || filterRateMap[0];
  console.log(filterRate, 'filterrate');
  // 计算固定提示词的 token 数量
  const fixedPrompts = [
    ...(model.chat.systemPrompt
      ? [
          {
            obj: ChatRoleEnum.System,
            value: model.chat.systemPrompt
          }
        ]
      : []),
    ...(model.chat.searchMode === ModelVectorSearchModeEnum.noContext
      ? [
          {
            obj: ChatRoleEnum.System,
            value: `上下文是关于"${model.name}"的内容,根据上下文内容回答问题,如果与上下文有关，直接输出上下文中的答案进行回答问题，如果问题与上面的上下文不相关，则先回答不相关三个字，再换行根据您的理解抛开上下文来回答问题即可.`
          }
        ]
      : [
          {
            obj: ChatRoleEnum.System,
            value: `玩一个问答游戏,规则为:
1.你完全忘记你已有的知识
2.你只回答关于"${model.name}"的问题
3.你只从资料库中选择内容进行回答
4.如果问题不在资料库中,你会回答:"我不知道。"
请务必遵守规则`
          }
        ])
  ];
  console.log(fixedPrompts, 'fixedPrompts');
  const fixedSystemTokens = modelToolMap[model.chat.chatModel].countTokens({
    messages: fixedPrompts
  });
  const maxTokens = modelConstantsData.systemMaxToken - fixedSystemTokens;

  const filterSystemPrompt = filterRate
    .map((rate, i) =>
      modelToolMap[model.chat.chatModel].sliceText({
        text: systemPrompts[i],
        length: Math.floor(maxTokens * rate)
      })
    )
    .join('\n')
    .trim();

  console.log(filterSystemPrompt, 'filterSystemPrompt');
  console.log(model.chat.searchMode, 'model.chat.searchMode');
  /* 高相似度+不回复 */
  if (!filterSystemPrompt && model.chat.searchMode === ModelVectorSearchModeEnum.hightSimilarity) {
    return {
      code: 201,
      searchPrompts: [
        {
          obj: ChatRoleEnum.System,
          value: '对不起，你的问题不在资料库中。'
        }
      ]
    };
  }
  /* 高相似度+无上下文，不添加额外知识,仅用系统提示词 */
  if (!filterSystemPrompt && model.chat.searchMode === ModelVectorSearchModeEnum.noContext) {
    return {
      code: 200,
      searchPrompts: model.chat.systemPrompt
        ? [
            {
              obj: ChatRoleEnum.System,
              value: model.chat.systemPrompt
            }
          ]
        : []
    };
  }

  /* 有匹配 */
  return {
    code: 200,
    searchPrompts: [
      {
        obj: ChatRoleEnum.System,
        value: `上下文信息:\n${filterSystemPrompt}`
      },
      ...fixedPrompts
    ]
  };
};
