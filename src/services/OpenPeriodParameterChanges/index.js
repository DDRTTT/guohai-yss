import request from '@/utils/request';

const url = '/yss-lifecycle-flow';
const base = '/ams-base-parameter';

// 数据字典
export function getDictsAPI(codeList) {
  return request(`/ams-base-parameter/datadict/queryInfoByList?codeList=${codeList.toString()}`);
}

// 产品类型
export function getProType() {
  return request(`${url}/common/allAssetType`);
}

// 产品全称/代码下拉列表
export function getProNameAndCodeAPI() {
  return request(`${url}/product/review/productEnum/search`);
}

// 分页任务列表
export async function getListAPI(params) {
  return request(`${url}/productOpenPeriodChange/taskList `, {
    method: 'POST',
    data: params,
  });
}

// 投资经理下拉列表
export async function getInvestmentManagerAPI() {
  return request(`${base}/employee/investmentManagerPullDown?roleCode=E002_1`);
}

// 删除
export async function getDeleteAPI(params) {
  return request(`${url}/productOpenPeriodChange/batchDelete`, {
    method: 'POST',
    data: params,
  });
}

// 撤销
export async function getRevokeAPI(processInstanceId) {
  return request(`${url}/common/revoke?processInstId=${processInstanceId.toString()}`);
}

// 批量提交
export function batchCommit(data) {
  return request.post(`${uri}/productOpenPeriodChange/batchCommit`, {
    data,
  });
}
