import type { NextApiRequest, NextApiResponse } from 'next';
import { jsonRes } from '@/service/response';
import { ChatItemType } from '@/types/chat';
import { connectToDatabase, Chat } from '@/service/mongo';
import { authModel } from '@/service/utils/auth';
import { authToken } from '@/service/utils/auth';

/* 添加邮件的 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { modelId, product, title } = req.body as {
      title: string;
      product: string;
      modelId: string;
      prompts: [ChatItemType, ChatItemType];
    };

    const userId = await authToken(req);

    await connectToDatabase();

    const content: any = [];

    await authModel({ modelId, userId, authOwner: false });

    // 没有 chatId, 创建一个对话
    const { _id } = await Chat.create({
      _id: undefined,
      userId,
      modelId,
      content,
      title,
      product
    });
    return jsonRes(res, {
      data: _id
    });
  } catch (err) {
    jsonRes(res, {
      code: 500,
      error: err
    });
  }
}
