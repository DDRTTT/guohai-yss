import { stringify } from 'qs';
import request from '@/utils/request';

const uri = '/yss-lifecycle-flow';

// 获取列表数据
export async function handleGetCapitalVerificationListAPI(params) {
  return request(`${uri}/verifyAsset/taskList`, {
    method: 'POST',
    data: params,
  });
}

// 词汇字典
export async function handleWordDictionaryFetchAPI(parameter) {
  return request(`/ams-base-parameter/datadict/queryInfoByList?${stringify(parameter)}`);
}

// 产品下拉回显
export async function handleRaiseDateAdjustmentProductAPI(params) {
  return request(`${uri}/verifyAsset/getProInfo?${stringify(params)}`);
}

// 产品下拉列表
export async function handleProductEnumSearchAPI(params) {
  return request(`${uri}/product/review/productEnum/search?${stringify(params)}`);
}
// 验资机构下拉列表
export async function handleOrganizationSearchAPI(params) {
  return request(`/ams-base-parameter/organization/getOrgNameList?${stringify(params)}`);
}

// 提交
export async function handleSubmitAPI(params) {
  return request(`${uri}/verifyAsset/commit`, {
    method: 'POST',
    data: params,
  });
}

// 批量提交
export async function handleBatchSubmitAPI(params) {
  return request(`${uri}/verifyAsset/batchSubmitByProCode`, {
    method: 'POST',
    data: params,
  });
}

//  撤销
export function revokeAPI(params) {
  return request.get(`${uri}/common/revoke`, { params });
}
// 删除
export function deleteAPI(params) {
  return request(`${uri}/verifyAsset/delete`, {
    method: 'POST',
    data: params,
  });
}

// 投资经理下拉框
export function getInvestManagerNameListAPI(params) {
  return request(`/ams-base-parameter/employee/investmentManagerPullDown?${stringify(params)}`);
}
