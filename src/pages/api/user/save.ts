import type { NextApiRequest, NextApiResponse } from 'next';
import { jsonRes } from '@/service/response';
import { ChatItemType } from '@/types/chat';
import { connectToDatabase, Chat } from '@/service/mongo';
import { authModel } from '@/service/utils/auth';
import { authToken } from '@/service/utils/auth';
import mongoose, { isObjectIdOrHexString } from 'mongoose';
import { UserModelSchema } from '@/types/mongoSchema';
import { User } from '@/service/mongo';

/* 聊天内容存存储 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const user: UserModelSchema = req.body;
    const userId = await authToken(req);
    console.log(user, user._id, 'company');
    if (user._id) {
      const filter = { _id: new mongoose.Types.ObjectId(user._id) };
      const response = await User.findByIdAndUpdate(filter, {
        ...user,
        _id: new mongoose.Types.ObjectId(user._id)
      });
      return jsonRes(res, {
        data: user._id
      });
    } else {
      // 已经有记录，追加入库
      await User.create({
        ...user,
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
