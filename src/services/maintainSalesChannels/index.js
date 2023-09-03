import request from '@/utils/request';
import { stringify } from 'qs';

const uri = '/yss-lifecycle-flow';
/* const uri = ''; */

/* 销售渠道维护列表 */
export function getTableDataList(params) {
  return request(`${uri}/salesChannel/fuzzySelectTaskList`, {
    method: 'POST',
    data: params,
  });
}

// 产品名称/产品代码查询
// export function getProductList(params) {
//   return request(`/ams-base-product/product/getProductList?${stringify(params)}`);
// }

// 产品类型
export function getproTypeList(params) {
  return request(`${uri}/common/allAssetType?${stringify(params)}`);
}

/* 词汇字典（状态） */
export function getDicList(params) {
  return request(`/ams-base-parameter/datadict/queryInfoByList?${stringify(params)}`);
}

// 产品名称/产品代码下拉框
export function getProductList() {
  return request(`${uri}/product/review/productEnum/search`);
}

//撤销
export async function getRevokeAPI(params) {
  return request(`${uri}/common/revoke?processInstId=${params}`);
}

//删除
export async function deleteInfoAPI(params) {
  return request(`${uri}/salesChannel/batchDelete?ids=${params.split(',')}`);
}

//批量提交
export async function batchSubm(params) {
  return request(`${uri}/salesChannel/batchCommit?ids=${params}`);
}
