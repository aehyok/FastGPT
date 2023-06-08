import type { NextApiRequest, NextApiResponse } from 'next';
import { jsonRes } from '@/service/response';
import { connectToDatabase, Chat, Company } from '@/service/mongo';
import { authToken } from '@/service/utils/auth';

/* 获取企业列表 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { limit = 10, page = 1 } = req.body as {
      limit?: number;
      page?: number;
    };
    const userId = await authToken(req);

    await connectToDatabase();
    const total = await Company.countDocuments();
    const pages = Math.ceil(total / limit);
    const docs = await Company.find({})
      .sort({ createAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    console.log(docs, 'data-------');
    jsonRes(res, {
      data: {
        docs,
        total,
        page,
        pages
      }
    });
  } catch (err) {
    jsonRes(res, {
      code: 500,
      error: err
    });
  }
}
