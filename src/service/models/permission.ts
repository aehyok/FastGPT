import { Schema, model, models, Model } from 'mongoose';
import { PermissionModelSchema } from '@/types/mongoSchema';
const PermissionSchema = new Schema({
  roleId: {
    type: Schema.Types.ObjectId,
    ref: 'role',
    required: true
  },
  menuId: {
    type: Schema.Types.ObjectId,
    ref: 'menu',
    required: true
  },
  isDelete: {
    type: Boolean,
    default: false
  },
  createTime: {
    type: Date,
    default: () => new Date()
  },
  updateTime: {
    type: Date
  },
  createBy: {
    type: Schema.Types.ObjectId,
    ref: 'user',
    required: true
  },
  updateBy: {
    type: Schema.Types.ObjectId,
    ref: 'user',
    required: false
  }
});

export const Permission: Model<PermissionModelSchema> =
  models['permission'] || model('permission', PermissionSchema);
