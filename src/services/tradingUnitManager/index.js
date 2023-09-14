import request from '@/utils/request';
import { deletNUllProperty } from '@/utils/utils';

const uri = '/yss-lifecycle-flow';
// 查询表格数据
export function queryTableList(params) {
  deletNUllProperty(params);
  return request.post(`${uri}/productManagement/tradingBooth/list`, {
    data: params,
  });
}
// 查询托管行
export function queryHosting(params) {
  deletNUllProperty(params);
  // return request.get(`${uri}/organization/queryDropValueByQualifyType`, {
  return request.get(`/ams-base-parameter/organization/getOrgNameList`, {
    params,
  });
}
// 获取交易单元管理的详情
export function trandingBoothInfo(params) {
  deletNUllProperty(params);
  return request.get(`${uri}/productManagement/tradingBooth/info`, {
    params,
  });
}
