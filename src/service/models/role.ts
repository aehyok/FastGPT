import { Schema, model, models, Model } from 'mongoose';
import { RoleModelSchema } from '@/types/mongoSchema';
const RoleSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  code: {
    type: String
  },
  isSystem: {
    type: Number
  },

  phone: {
    type: String,
    required: true
  },
  createAt: {
    type: Date,
    default: () => new Date()
  },
  updateAt: {
    type: Date
  },
  createBy: {
    type: Schema.Types.ObjectId,
    ref: 'user',
    required: true
  },
  updateBy: {
    type: Schema.Types.ObjectId,
    ref: 'user'
  }
});

export const Role: Model<RoleModelSchema> = models['role'] || model('role', RoleSchema);
