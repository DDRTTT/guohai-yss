import request from '@/utils/request';
import { stringify } from 'qs';

const uri = '/yss-awp-server';

// 项目任务列表API
export function getTableListApi(params) {
  return request(`${uri}/productFile/getFilePageChecked`, {
    method: 'POST',
    data: params,
  });
}
// 文件名称下拉树API
export const getFileNameListApi = params =>
  request(`${uri}/productFile/getFileNameList`, {
    method: 'POST',
    data: params,
  });

// 项目编码API
export const getProCodeApi = params =>
  request(`${uri}/product/getQueryParamListChecked?${stringify(params)}`);

// 获取项目或者系列编码
export function getProcodeInfoAPI(params) {
  return request(`/yss-awp-server/awp/common/projects?type=${params.type}`, {
    method: 'GET',
  });
}
