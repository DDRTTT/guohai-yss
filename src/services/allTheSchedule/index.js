import request from '@/utils/request';
import { stringify } from 'qs';

const uri = '/yss-lifecycle-flow';

// 任务列表
export async function getTableDataList(params) {
  return request.get(`${uri}/task-query/task-list-page`, {
    // method: 'POST',
    params,
  });
}

// 流程类型
export async function getAllProcessNameApi(params) {
  return request.get(`${uri}/process-module/query/all-process-name?${stringify(params)}`);
}

// 产品名称
export async function getAllProductNameApi(params) {
  return request.get(`${uri}/product/review/productEnum/search?${stringify(params)}`);
}

// 任务概况统计
export function getproTypeList(params) {
  return request(`${uri}/task-query/over-view-statistics?${stringify(params)}`);
}

// 对办理和未提交进行筛选API
export async function getLinkRouterAPI(params) {
  return request('/yss-lifecycle-flow/common/checkTypeForRouter', {
    method: 'POST',
    data: params,
  });
}

// 我发起 传阅下拉
export function authUserInfoApi(params) {
  return request(`${uri}/strategy/query/auth-user-info?${stringify(params)}`);
}

// 我发起 传阅提交
export async function circulateTaskBatchApi(params) {
  return request(`/api/billow-diplomatic/todo-task/circulate-history-task-batch`, {
    method: 'POST',
    data: params,
  });
}
// 我发起 已传阅
export function circulateHistoryUsersApi(params) {
  return request(
    `/api/billow-diplomatic/todo-task/circulate-history-users/processInstanceId/${params}`,
  );
}
