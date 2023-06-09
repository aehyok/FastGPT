import mongoose from 'mongoose';
import { generateQA } from './events/generateQA';
import { generateVector } from './events/generateVector';
import tunnel from 'tunnel';

/**
 * 连接 MongoDB 数据库
 */
export async function connectToDatabase(): Promise<void> {
  if (global.mongodb) {
    return;
  }

  global.mongodb = 'connecting';
  try {
    mongoose.set('strictQuery', true);
    global.mongodb = await mongoose.connect(process.env.MONGODB_URI as string, {
      bufferCommands: true,
      dbName: process.env.MONGODB_NAME,
      maxPoolSize: 5,
      minPoolSize: 1,
      maxConnecting: 5
    });
    mongoose.set('debug', true);
    console.log('mongo connected');
  } catch (error) {
    console.log('error->', 'mongo connect error');
    global.mongodb = null;
  }

  generateQA();
  generateVector(true);

  // 创建代理对象
  if (process.env.AXIOS_PROXY_HOST && process.env.AXIOS_PROXY_PORT) {
    global.httpsAgent = tunnel.httpsOverHttp({
      proxy: {
        host: process.env.AXIOS_PROXY_HOST,
        port: +process.env.AXIOS_PROXY_PORT
      }
    });
  }
}

/**
 *
 * @param model mongodb模型
 * @param query 查询对象
 * @param pageSize
 * @param pageNumber
 * @returns
 */
export async function getPagedList(
  model: mongoose.Model<any>,
  query: any,
  pageSize: number,
  pageNum: number
) {
  console.log(model.schema, 'model');
  const total = await model.countDocuments(query);
  const pages = Math.ceil(total / pageSize);
  console.log(pageNum, pageSize, total, pages);
  const docs = await model
    .find(query)
    .skip((pageNum - 1) * pageSize)
    .limit(pageSize);
  console.log('getPagedList', docs);
  return {
    docs,
    page: pageNum,
    pages,
    total
  };
}

export * from './models/authCode';
export * from './models/chat';
export * from './models/model';
export * from './models/user';
export * from './models/bill';
export * from './models/pay';
export * from './models/splitData';
export * from './models/openapi';
export * from './models/promotionRecord';
export * from './models/collection';
export * from './models/company';
export * from './models/menu';
export * from './models/role';
export * from './models/permission';
