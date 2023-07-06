import type { NextApiRequest, NextApiResponse } from 'next';
import { jsonRes } from '@/service/response';
import { connectToDatabase, Chat } from '@/service/mongo';
import { authToken } from '@/service/utils/auth';
import mongoose from 'mongoose';

/* 获取历史记录 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const userId = await authToken(req);

    await connectToDatabase();

    // _id title modelId updateTime latestChat

    const data = await Chat.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId)
        }
      },
      {
        $lookup: {
          from: 'models',
          localField: 'modelId',
          foreignField: '_id',
          as: 'modelInfo'
        }
      },
      {
        $project: {
          _id: 1, // 设置为 0 表示不显示
          title: 1, // 设置为 1 表示显示
          modelId: 1, // 设置为 1 表示显示
          updateTime: 1, // 设置为 1 表示显示
          latestChat: 1,
          'modelInfo.name': 1,
          'modelInfo.remark': 1
        }
      },
      { $sort: { updateTime: -1 } },
      { $limit: 5 }
    ]);

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
