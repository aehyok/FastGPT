import { GET, POST, PUT } from './request';

export const getQaconfig = (code: string) => GET(`/qaconfig/get?code=${code}`);
