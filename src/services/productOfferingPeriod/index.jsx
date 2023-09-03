import { stringify } from 'qs';
import request from '@/utils/request';

const uri = '/yss-lifecycle-flow';
// const uri = '/wz';

// 获取 模板名称
export async function handleGetProductRaisingPeriodAdjustmentFetchAPI(parameter) {
  return request(`${uri}/raiseDateAdjustment/taskList`, {
    method: 'POST',
    data: parameter,
  });
}

// 词汇字典
export async function handleWordDictionaryFetchAPI(parameter) {
  return request(`/ams-base-parameter/datadict/queryInfoByList?${stringify(parameter)}`);
}
// 投资经理
export async function handleGetManagerAPI(parameter) {
  return request(`/ams-base-parameter/employee/investmentManagerPullDown?${stringify(parameter)}`);
}

// 提交
export async function handleSubmitAPI(params) {
  return request(`${uri}/raiseDateAdjustment/commit`, {
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
  return request(`${uri}/raiseDateAdjustment/batchDelete`, {
    method: 'POST',
    data: params,
  });
}
// 批量提交
export async function handleBatchSubmitAPI(params) {
  return request(`${uri}/raiseDateAdjustment/batchCommit`, {
    method: 'POST',
    data: params,
  });
}
