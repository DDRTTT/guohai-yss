import request from '@/utils/request';
import { stringify } from 'qs';

const uriMock = '/mock/CapitalVerificationLetter';

// 请求（产品类型-已废除）/托管人/状态 下拉列表项
export function getDictsAPI(codeList) {
  return request(`/ams-base-parameter/datadict/queryInfoByList?codeList=${codeList.toString()}`);
}

// 请求产品类型下拉列表
export function getProTypeAPI() {
  return request(`/yss-lifecycle-flow/common/allAssetType`);
}

// 请求表格列表
export function searchTableDataAPI(params) {
  return request(`/yss-lifecycle-flow/capitalVerifyLetter/tasklist/search`, {
    method: 'POST',
    data: params,
  });
}

// 更多操作--退回
export function rejectTask(params) {
  return request(`/billow-diplomatic/todo-task/reject-task`, {
    method: 'POST',
    data: params,
  });
}

// 产品下拉框
export function productEnum(params) {
  // return request(`/yss-lifecycle-flow/product/review/productEnum/search?${stringify(params)}`);
  return request(`/yss-lifecycle-flow/product/review/productEnum/search`);
}

// 托管人下拉框
export function trusteeEnum(params) {
  // return request(`/yss-lifecycle-flow/organization/queryDropValueByQualifyType?type=${'J004_2'}`);
  return request(`/ams-base-parameter/organization/getOrgNameList?orgType=${'J004_2'}`);
}
// 投资经理下拉框
export function getInvestManagerNameListAPI(params) {
  // return request(`/yss-lifecycle-flow/stakeholderInfo/queryInvestmentManager`);
  // return request(`/ams-base-parameter/employee/investmentManagerPullDown?roleCode=E002_1`);
  return request(`/ams-base-parameter/employee/investmentManagerPullDown?roleCode=E002_1`);
}

// 批量提交
export function commitBatchAPI(params) {
  return request(`/yss-lifecycle-flow/capitalVerifyLetter/batchCommit`, {
    method: 'POST',
    data: params.ids,
  });
}

// 删除
export function deleteTableAPI(params) {
  return request(`/yss-lifecycle-flow/capitalVerifyLetter/delete`, {
    method: 'POST',
    data: params
  });
}

// 撤销
export function revokeTableAPI(params) {
  return request(`/yss-lifecycle-flow/common/revoke?processInstId=${params.processInstanceId}`);
}
