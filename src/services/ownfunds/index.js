import request from '@/utils/request';
import { stringify } from 'qs';

const uri = '/yss-lifecycle-flow';
/* const uri = ''; */

/* 自有资金与划款列表 */
export function getTableDataList(params) {
  return request(`${uri}/ownfunds/taskList`, {
    method: 'POST',
    data: params,
  });
}

// 产品名称/产品代码查询
export function getProductList(params) {
  return request(`/ams-base-product/product/getProductList?${stringify(params)}`);
}

// 产品类型
export function getproTypeList(params) {
  return request(`${uri}/common/allAssetType?${stringify(params)}`);
}

/* 词汇字典（状态） */
export function getDicList(params) {
  return request(`/ams-base-parameter/datadict/queryInfoByList?${stringify(params)}`);
}

// 产品下拉框
export function productEnum(params) {
  // return request(`/yss-lifecycle-flow/product/review/productEnum/search?${stringify(params)}`);
  return request(`/yss-lifecycle-flow/product/review/productEnum/search`);
}

// 批量提交
export function commitBatchAPI(params) {
  console.log(params);
  return request(`${uri}/ownfunds/batchCommit`, {
    method: 'POST',
    data: params.ids,
  });
}

// 删除
export function deleteTableAPI(params) {
  return request(`/yss-lifecycle-flow/ownfunds/delete`, {
    method: 'POST',
    data: params,
  });
}

// 撤销
export function revokeTableAPI(params) {
  return request(`/yss-lifecycle-flow/common/revoke?processInstId=${params.processInstanceId}`);
}
