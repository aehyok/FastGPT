import { Schema, model, models, Model } from 'mongoose';
import { MenuModelSchema } from '@/types/mongoSchema';
const MenuSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  code: {
    type: String,
    default: ''
  },
  type: {
    type: String
  },
  url: {
    type: String
  },
  order: {
    type: Number,
    default: ''
  },
  fatherId: {
    type: String
  },
  remark: {
    type: String
  },
  isEnabled: {
    type: Boolean,
    default: true
  },
  isDelete: {
    type: String,
    required: false
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

export const Menu: Model<MenuModelSchema> = models['menu'] || model('menu', MenuSchema);
