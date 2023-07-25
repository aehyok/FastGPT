import { Schema, model, models, Model as MongoModel } from 'mongoose';
import { ModelSchema as ModelType } from '@/types/mongoSchema';

const QaConfigSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'user',
    required: true
  },
  code: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  prompt: {
    type: String,
    required: true
  },
  remark: {
    type: String
  }
});

export const QaConfig: MongoModel<ModelType> =
  models['qaconfig'] || model('qaconfig', QaConfigSchema);
