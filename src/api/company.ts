import { GET, POST, PUT } from './request';

type listParameterType = {
  limit: number;
  page: number;
};

/**
 * 根据 ID 更新模型
 */
export const getCompanyList = (data: listParameterType) => POST(`/company/list`, data);
