import type { NextApiRequest, NextApiResponse } from 'next';
import { jsonRes } from '@/service/response';
import { connectToDatabase, getPagedList, User } from '@/service/mongo';
import { authToken } from '@/service/utils/auth';
import mongoose from 'mongoose';

/* 获取企业列表 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const {
      limit = 10,
      page = 1,
      companyId
    } = req.body as {
      limit?: number;
      page?: number;
      companyId: string;
    };
    const userId = await authToken(req);

    await connectToDatabase();

    console.log('company', companyId);
    const pageModel = await getPagedList(
      User,
      {
        companyId: '6476ea34fd117297480babd1',
        inviterId: '646223d83ff54980f9e16e6d'
      },
      limit,
      page
    );

    console.log(req.body, pageModel, 'data-------');
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
