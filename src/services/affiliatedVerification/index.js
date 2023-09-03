import request from '@/utils/request';
import { stringify } from 'qs';

const uri = '/yss-lifecycle-flow';

// 任务列表
export async function getTaskList(params) {
  return request(`${uri}/relatedParty/taskCount`, {
    method: 'POST',
    data: params,
  });
}

// 词汇字典
export function getDictsAPI(params) {
  return request(`/ams-base-parameter/datadict/queryInfoByList?${stringify(params)}`);
}

// 产品类型
export function getproTypeList(params) {
  return request(`${uri}/common/allAssetType?${stringify(params)}`);
}

// 产品下拉框
export function getProductList() {
  return request(`/yss-lifecycle-flow/product/review/productEnum/search`);
}

// 撤销
export async function getRevokeAPI(params) {
  return request(`${uri}/common/revoke?processInstId=${params}`);
}

// 删除
export async function getDeleteAPI(params) {
  return request(`${uri}/relatedParty/batchDelete`,{
    method: 'POST',
    data: params.split(","),
  });
}

// 批量提交
export const getBatchSubmitByProCodeApi = params =>
  request(`${uri}/relatedParty/batchCommit`, {
    method: 'POST',
    data: params,
  });