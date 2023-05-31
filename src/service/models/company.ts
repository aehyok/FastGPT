import { Schema, model, models, Model } from 'mongoose';
import { CompanyModelSchema } from '@/types/mongoSchema';
const CompanySchema = new Schema({
  shortName: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },

  logo: {
    type: String,
    default: '/icon/human.png'
  },
  intro: {
    type: String,
    default: ''
  },
  address: {
    type: String,
    default: ''
  },
  email: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  createTime: {
    type: Date,
    default: () => new Date()
  },
  createBy: {
    type: Schema.Types.ObjectId,
    ref: 'user',
    required: true
  }
});

export const Company: Model<CompanyModelSchema> =
  models['company'] || model('company', CompanySchema);
