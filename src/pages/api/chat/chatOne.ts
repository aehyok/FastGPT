import type { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase } from '@/service/mongo';
import { modelServiceToolMap } from '@/service/utils/chat';
import { ChatItemSimpleType } from '@/types/chat';
import { jsonRes } from '@/service/response';
import { PassThrough } from 'stream';
import { ChatModelMap, OpenAiChatEnum } from '@/constants/model';
import { resStreamResponse } from '@/service/utils/chat';

/* 翻译和总结共用的api 预定义的提示词由前端定义，后期可以做一个系统设置参数列表 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  let step = 0; // step=1时，表示开始了流响应
  const stream = new PassThrough();
  stream.on('error', () => {
    console.log('error: ', 'stream error');
    stream.destroy();
  });
  res.on('close', () => {
    stream.destroy();
  });
  res.on('error', () => {
    console.log('error: ', 'request error');
    stream.destroy();
  });

  try {
    const { prompt } = req.body as {
      prompt: ChatItemSimpleType;
    };

    await connectToDatabase();
    let startTime = Date.now();

    const modelConstantsData = ChatModelMap[OpenAiChatEnum.GPT35];

    // 计算温度
    const temperature = 0;

    console.log('temperature温度:', temperature);
    console.log('messages:', prompt);
    // 发出请求
    const { streamResponse } = await modelServiceToolMap[
      modelConstantsData.chatModel
    ].chatCompletion({
      apiKey: process.env.OPENAIKEY as string,
      temperature: +temperature,
      messages: [prompt],
      stream: true,
      res
    });

    console.log('api response time:', `${(Date.now() - startTime) / 1000}s`);

    step = 1;

    await resStreamResponse({
      model: OpenAiChatEnum.GPT35,
      res,
      stream,
      chatResponse: streamResponse,
      prompts: [prompt],
      systemPrompt: ''
    });
  } catch (err: any) {
    if (step === 1) {
      // 直接结束流
      console.log('error，结束');
      stream.destroy();
    } else {
      res.status(500);
      jsonRes(res, {
        code: 500,
        error: err
      });
    }
  }
}
