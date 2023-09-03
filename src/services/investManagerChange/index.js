import request from '@/utils/request';
import { stringify } from 'qs';

const uri = '/yss-lifecycle-flow';
/* const uri = ''; */

/* 投资经理变更流程任务列表 */
// export function getTableDataList(params) {
//   return request(`${uri}/investManagerChange/queryTask`, {
//     method: 'POST',
//     data: params,
//   });
// }
export function getTableDataList(params) {
  return request(`${uri}/investManagerChangeBatch/fuzzySelectTaskList`, {
    method: 'POST',
    data: params,
  });
}

// 产品类型
export function getproTypeList(params) {
  return request(`${uri}/common/allAssetType?${stringify(params)}`);
}

/* 词汇字典（状态） */
export function getDicList(params) {
  return request(`/ams-base-parameter/datadict/queryInfoByList?${stringify(params)}`);
}

// 产品名称/产品代码查询
export function getProductList() {
  return request(`/yss-lifecycle-flow/product/review/proSeries/search`);
}

// 撤销
export function getRevokeAPI(params) {
  return request(`${uri}/common/revoke?processInstId=${params}`);
}

// 删除
// export function getDeleteAPI(params) {
//   return request(`${uri}/investManagerChange/delete/batch?ids=${params.ids}&processInstanceIds=${params.processInstanceIds}`, {
//     method: 'POST',
//     data: {},
//   });
// }
export function getDeleteAPI(params) {
  return request(`${uri}/investManagerChangeBatch/batchDelete?ids=${params.ids}`);
}

// 批量提交
// export const getBatchSubmitByProCodeApi = params =>
//   request(`${uri}/investManagerChange/commit/batch`, {
//     method: 'POST',
//     data: params,
//   });
export const getBatchSubmitByProCodeApi = params =>
  request(`${uri}/investManagerChangeBatch/batchCommit?ids=${params.ids}`);

// 原投资经理/拟任投资经理
export function getInvestManagerList() {
  return request(`/ams-base-parameter/employee/investmentManagerPullDown?roleCode=E002_1`);
}
