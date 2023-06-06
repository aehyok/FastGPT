import type { NextApiRequest, NextApiResponse } from 'next';
import { jsonRes } from '@/service/response';
import { connectToDatabase, Chat, Company } from '@/service/mongo';
import { authToken } from '@/service/utils/auth';

/* 获取企业列表 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // const { name } = req.body as {
    //   name: string;
    // };
    const userId = await authToken(req);

    await connectToDatabase();

    const data = await Company.find({}).sort({ createAt: -1 }).limit(20);

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
