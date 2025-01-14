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
  similarity = 0.8,
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

    console.log(promptVectors[0].length, 'promptVectors-promptVectors', promptVectors.length);
    const modelId = model._id; //'64c3beece0064bf7d27fc6a6';
    console.log(modelId, 'modelId');
    let res: any = null;
    try {
      res = await PgClient.query(
        `BEGIN;
         SET LOCAL ivfflat.probes = 10;
         select id,q,a from modelData 
         where status = '${
           ModelDataStatusEnum.ready
         }' and model_id= '${modelId}'  AND vector <#> '[${promptVectors[0]}]' < -0.8 
         order by vector <#> '[${promptVectors[0]}]' 
         limit ${limitMap[model.chat.searchMode]};
         COMMIT;`
      );
    } catch (err) {
      console.error(err);
    }

    const searchRes: any[] = [res?.[2]?.rows] || [];

    // Remove repeat record
    const idSet = new Set<string>();
    const filterSearch = searchRes.map((search) =>
      search.filter((item: any) => {
        if (idSet.has(item.id)) {
          return false;
        }
        idSet.add(item.id);
        return true;
      })
    );

    return filterSearch.map((item) =>
      item
        .map((item: any, index: any) => `第${index + 1}段:\n问题：${item.q}\n\n答案：${item.a}`)
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

  console.log(systemPrompts, 'systemPrompts--------------');
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
            value: `资料库是关于"${model.name}"的内容,根据资料库内容回答问题,如果与资料库有关，直接输出资料库中的答案进行回答问题，如果问题与上面的资料库不相关，或者资料库中没有数据，则先回答"对不起，你的问题不在资料库中。"，再换行根据您的理解抛开资料库来回答问题即可.`
          }
        ]
      : [
          {
            obj: ChatRoleEnum.System,
            value: `玩一个问答游戏,规则为:
1.你完全忘记你已有的知识
2.你只回答关于"${model.name}"的问题
3.你只从资料库中选择内容进行回答
4.如果问题不在资料库中,或者与资料库中的信息不相关。你就会回答:"对不起，你的问题不在资料库中。"，无需回复其他文字
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
          // value: '对不起，你的问题不在资料库中。'
          value:
            'Dear customer, we apologize for the inconvenience. Of course, we could offer you a replacement if you receive a faulty phone. First of all, could you please tell us more details about the problem you are having? You can also send us some photos showing the problem. Also, please send us the IMEI number of the phone you received. The IMEI can be found in Settings - General - Info. Yours sincerely'
        }
      ]
    };
  }
  /* 高相似度+无上下文，不添加额外知识,仅用系统提示词 */
  if (!filterSystemPrompt && model.chat.searchMode === ModelVectorSearchModeEnum.noContext) {
    console.log('11111111111111111111', model.chat.systemPrompt);
    return {
      code: 200,
      searchPrompts: model.chat.systemPrompt
        ? [
            {
              obj: ChatRoleEnum.System,
              value:
                model.chat.systemPrompt +
                '\n' +
                '请记得先回复"对不起，你的问题不在资料库中。"，再换行继续回复。'
            }
          ]
        : [
            {
              obj: ChatRoleEnum.System,
              value:
                '请记得先回复"对不起，你的问题不在资料库中，下面是AI的智能回复。"这几个字，再换行继续根据你的理解进行回复。'
            }
          ]
    };
  }

  /* 有匹配 */
  return {
    code: 200,
    searchPrompts: [
      {
        obj: ChatRoleEnum.System,
        value: `资料库：<${filterSystemPrompt}>`
      },
      ...fixedPrompts
    ]
  };
};
