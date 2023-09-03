import request from '@/utils/request';
import { stringify } from 'qs';

const uri = '/yss-lifecycle-flow';
/* const uri = ''; */

/* 合同用印列表 */
export function getTableDataList(params) {
  return request(`${uri}/contractSeal/fuzzy/getTaskList`, {
    method: 'POST',
    data: params,
  });
}

// 投资经理人
export function getInvestManageChangeList() {
  return request(`/ams-base-parameter/employee/investmentManagerPullDown?roleCode=E002_1`);
}

// 托管人
export function getproTrusBankList(params) {
  return request(`/ams-base-parameter/organization/getOrgNameList?${stringify(params)}`);
}

// 产品类型
export function getproTypeList(params) {
  return request(`${uri}/common/allAssetType?${stringify(params)}`);
}

// 产品下拉框
export function getProductList() {
  return request(`/yss-lifecycle-flow/product/review/productEnum/search`);
}

/* 词汇字典（状态） */
export function getDicList(params) {
  return request(`/ams-base-parameter/datadict/queryInfoByList?${stringify(params)}`);
}

// 撤销
export async function getRevokeAPI(params) {
  return request(`${uri}/common/revoke?processInstId=${params}`);
}

// 删除
export async function getDeleteAPI(params) {
  return request(`${uri}/contractSeal/batchDeleteByIds`, {
    method: 'POST',
    data: params.split(","),
  });
}

// 批量提交
export const getBatchSubmitByProCodeApi = params =>
  request(`${uri}/contractSeal/batchSubmitByIds`, {
    method: 'POST',
    data: params,
  });
