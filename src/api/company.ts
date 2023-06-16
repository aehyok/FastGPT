import { GET, POST, PUT } from './request';

type listParameterType = {
  limit: number;
  page: number;
};

/**
 * 企业列表
 */
export const getCompanyList = (data: listParameterType) => POST(`/company/list`, data);

/**
 * 添加编辑
 */
export const saveCompanyData = (data: { [key: string]: any }) => POST(`/company/save`, data);
