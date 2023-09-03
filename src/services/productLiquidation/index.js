import request from '@/utils/request';
import { stringify } from 'qs';

const uri = '/yss-lifecycle-flow';

// 获取产品清盘任务列表
export function getTaskListAPI(params) {
  return request(`${uri}/productLiquidation/fuzzySelectTaskList`, {
    method: 'POST',
    data: params,
  });
}

// 请求（产品类型-已废除）/托管人/状态 下拉列表项
export function getDictsAPI(codeList) {
  return request(`/ams-base-parameter/datadict/queryInfoByList?codeList=${codeList.toString()}`);
}

// 请求产品类型下拉列表
export function getProTypeAPI() {
  return request(`/yss-lifecycle-flow/common/allAssetType`);
}

// 产品下拉框
export function productEnum(params) {
  // return request(`/yss-lifecycle-flow/productLiquidation/getValidProductList`);
  return request(`/yss-lifecycle-flow/product/review/productEnum/search`);
}
// 批量提交
export function commitBatchAPI(params) {
  return request(`${uri}/productLiquidation/batchCommit?ids=${params.ids}`);
}

// 删除
export function deleteTableAPI(params) {
  return request(`/yss-lifecycle-flow/productLiquidation/batchDelete?ids=${params.ids}`, {
  });
}

// 撤销
export function revokeTableAPI(params) {
  return request(`/yss-lifecycle-flow/common/revoke?processInstId=${params.processInstanceId}`);
}
