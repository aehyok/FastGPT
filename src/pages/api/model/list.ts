import type { NextApiRequest, NextApiResponse } from 'next';
import { jsonRes } from '@/service/response';
import { connectToDatabase, Collection, Model } from '@/service/mongo';
import { authToken } from '@/service/utils/auth';
import type { ModelListResponse } from '@/api/response/model';

/* 获取模型列表 */
export default async function handler(req: NextApiRequest, res: NextApiResponse<any>) {
  try {
    // 凭证校验
    const userId = await authToken(req);

    await connectToDatabase();

    // 根据 userId 获取模型信息
    const [myModels, myCollections] = await Promise.all([
      Model.find(
        {
          userId
        },
        '_id avatar remark name chat.systemPrompt'
      ).sort({
        _id: -1
      }),
      Collection.find({ userId })
        .populate({
          path: 'modelId',
          select: '_id avatar remark name chat.systemPrompt',
          match: { 'share.isShare': true }
        })
        .then((res) => res.filter((item) => item.modelId))
    ]);

    jsonRes<ModelListResponse>(res, {
      data: {
        myModels: myModels.map((item) => ({
          _id: item._id,
          name: item.name,
          remark: item.remark,
          avatar: item.avatar,
          systemPrompt: item.chat.systemPrompt
        })),
        myCollectionModels: myCollections
          .map((item: any) => ({
            _id: item.modelId?._id,
            name: item.modelId?.name,
            remark: item.modelId?.remark,
            avatar: item.modelId?.avatar,
            systemPrompt: item.modelId?.chat.systemPrompt
          }))
          .filter((item) => !myModels.find((model) => String(model._id) === String(item._id))) // 去重
      }
    });
  } catch (err) {
    jsonRes(res, {
      code: 500,
      error: err
    });
  }
}
