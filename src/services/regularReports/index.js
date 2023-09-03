import request from '@/utils/request';
import { stringify } from 'qs';

const uri = '/yss-lifecycle-flow';

export function getTableDataList(params) {
  return request(`${uri}/regular-report/taskList`, {
    method: 'POST',
    data: params,
  });
}

// 词汇字典
export function getDictList(params) {
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
  return request(`${uri}/regular-report/edit/batchCommit`, {
    method: 'POST',
    data: params.ids,
  });
}
// 删除
export function deleteTableAPI(params) {
  return request(`/yss-lifecycle-flow/regular-report/edit/batchDelete`, {
    method: 'POST',
    data: params,
  });
}

// 撤销
export function revokeTableAPI(params) {
  return request(`/yss-lifecycle-flow/common/revoke?processInstId=${params.processInstanceId}`);
}

// 高级搜索-产品类型下拉列表
export function productTypeListAPI() {
  return request(`/yss-lifecycle-flow/common/allAssetType`);
}
