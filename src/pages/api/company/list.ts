import type { NextApiRequest, NextApiResponse } from 'next';
import { jsonRes } from '@/service/response';
import { connectToDatabase, getPagedList, Company } from '@/service/mongo';
import { authToken } from '@/service/utils/auth';
import { Model } from 'mongoose';

/* 获取企业列表 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { limit = 10, page = 1 } = req.body as {
      limit?: number;
      page?: number;
    };
    const userId = await authToken(req);

    await connectToDatabase();

    const pageModel = await getPagedList(Company, {}, limit, page);

    console.log(pageModel, 'data-------');
    jsonRes(res, {
      data: {
        ...pageModel
      }
    });
  } catch (err) {
    jsonRes(res, {
      code: 500,
      error: err
    });
  }
}
