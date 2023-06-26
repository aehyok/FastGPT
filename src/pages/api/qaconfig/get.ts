import type { NextApiRequest, NextApiResponse } from 'next';
import { jsonRes } from '@/service/response';
import { connectToDatabase, QaConfig } from '@/service/mongo';
import { authToken } from '@/service/utils/auth';

/* 获取历史记录 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { code } = req.query as {
      code: string;
    };

    const userId = await authToken(req);

    await connectToDatabase();
    console.log(userId, code);
    const data = await QaConfig.findOne(
      {
        userId,
        code
      },
      '_id name code prompt'
    );

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