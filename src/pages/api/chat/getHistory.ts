import type { NextApiRequest, NextApiResponse } from 'next';
import { jsonRes } from '@/service/response';
import { connectToDatabase, Chat, Company } from '@/service/mongo';
import { authToken } from '@/service/utils/auth';

/* 获取历史记录 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const userId = await authToken(req);

    await connectToDatabase();

    console.log(Chat, 'chat---111');

    // const list = await Company.find({});
    // console.log('list', list);
    // console.log('结束')

    const data = await Chat.find(
      {
        userId
      },
      '_id title modelId updateTime latestChat product'
    )
      .sort({ updateTime: -1 })
      .limit(20);

    console.log(data, 'data-------');
    jsonRes(res, {
      data
    });
  } catch (err) {
    jsonRes(res, {
      code: 500,
      error: err
    });
  }
}
