import request from '@/utils/request';

const url = '/yss-lifecycle-flow';

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
  return request(`${url}/productLineSell/queryProNameList`);
}

// 分页任务列表
export async function getListAPI(params) {
  return request(`${url}/productLineSell/query/taskListByTab`, {
    method: 'POST',
    data: params,
  });
}

// 新增提交
export async function submitFormAPI(params) {
  return request(`${url}/productLineSell/commit`, {
    method: 'POST',
    data: params,
  });
}

// 删除
export async function getDeleteAPI(id) {
  return request(`${url}/productLineSell/delete?id=${id}`);
}

// 撤销
export async function getRevokeAPI(processInstId) {
  return request(`${url}/common/revoke?processInstId=${processInstId.toString()}`);
}

// 产品名称下拉列表
export async function getProNameAPI() {
  return request(`${url}/productLineSell/queryProNameList`);
}

// 根据产品名称回显数据
export async function getProNameDataAPI(proCode) {
  return request(`${url}/productLineSell/queryByCode?${proCode.toString()}`);
}

// 保存
export async function getProductDataSaveAPI(params) {
  return request(`${url}/productLineSell/save`, {
    method: 'POST',
    data: params,
  });
}
