import type { NextApiRequest, NextApiResponse } from 'next';
import { jsonRes } from '@/service/response';
import { connectToDatabase, User } from '@/service/mongo';
import { authToken } from '@/service/utils/auth';

/* 获取历史记录 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { _id } = req.body;
    const userId = await authToken(req);

    await connectToDatabase();

    const response = await User.findOneAndRemove({
      _id
    });
    console.log(response, 'response');
    jsonRes(res);
  } catch (err) {
    jsonRes(res, {
      code: 500,
      error: err
    });
  }
}
