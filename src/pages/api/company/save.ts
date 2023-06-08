import type { NextApiRequest, NextApiResponse } from 'next';
import { jsonRes } from '@/service/response';
import { ChatItemType } from '@/types/chat';
import { connectToDatabase, Chat } from '@/service/mongo';
import { authModel } from '@/service/utils/auth';
import { authToken } from '@/service/utils/auth';
import mongoose, { isObjectIdOrHexString } from 'mongoose';
import { CompanyModelSchema } from '@/types/mongoSchema';
import { Company } from '@/service/mongo';

/* 聊天内容存存储 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const company: CompanyModelSchema = req.body;
    const userId = await authToken(req);
    console.log(company, company._id, 'company');
    if (company._id) {
      const filter = { _id: new mongoose.Types.ObjectId(company._id) };
      const response = await Company.findByIdAndUpdate(filter, {
        ...company,
        _id: new mongoose.Types.ObjectId(company._id)
      });
      return jsonRes(res, {
        data: company._id
      });
    } else {
      // 已经有记录，追加入库
      await Company.create({
        ...company,
        _id: undefined,
        createBy: new mongoose.Types.ObjectId(userId)
      });
    }
    jsonRes(res);
  } catch (err) {
    jsonRes(res, {
      code: 500,
      error: err
    });
  }
}
