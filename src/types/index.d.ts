import type { Mongoose } from 'mongoose';
import type { RedisClientType } from 'redis';
import type { Agent } from 'http';
import type { Pool } from 'pg';

declare global {
  var mongodb: Mongoose | string | null;
  var redisClient: RedisClientType | null;
  var pgClient: Pool | null;
  var generatingQA: boolean;
  var generatingAbstract: boolean;
  var generatingVector: boolean;
  var QRCode: any;
  var httpsAgent: Agent;
  var particlesJS: any;

  interface Window {
    ['pdfjs-dist/build/pdf']: any;
  }
}

export type PagingData<T> = {
  pageNum;
  pageSize;
  data: T[];
  total;
};

interface RequsetListType {
  docs: T[];
  page: number;
  pages: number;
  total: number;
}

export type NewPagingData<T> = {
  code;
  data: RequsetListType;
  statusText;
};

interface AddEditformType {
  type: string;
  name: string;
  label: string;
}

export type OperatingButtonType = {
  type: string;
  name: string;
  onClickType: string;
  fields?: AddEditformType[];
  dialogTitle: (val: { [key: string]: string }) => ReactNode | string;
  dialogDescription: (val: { [key: string]: string }) => ReactNode | string;
  render?: (...args: any[]) => string;
};

export type RequestPaging = { pageNum: number; pageSize: number; [key]: any };
