import request from '@/utils/request';

const url = '/yss-lifecycle-flow';

// 数据字典
export function getDictsAPI(codeList) {
  return request(`/ams-base-parameter/datadict/queryInfoByList?codeList=${codeList.toString()}`);
}

// 产品全称/代码下拉列表
export function getProNameAndCodeAPI() {
  return request(`${url}/product/review/productEnum/search`);
}

// 分页任务列表
export async function getListAPI(params) {
  return request(`${url}/accountCancel/query/taskListByTab`, {
    method: 'POST',
    data: params,
  });
}

// 删除
export async function getDeleteAPI(params) {
  return request(`${url}/accountCancel/delete`, {
    method: 'POST',
    data: params,
  });
}

// 撤销
export async function getRevokeAPI(id) {
  return request(`${url}/common/revoke?processInstId=${id.toString()}`);
}
