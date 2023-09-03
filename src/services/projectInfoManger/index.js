import request from '@/utils/request';
import { stringify } from 'qs';

const uri = `/yss-awp-server`;

//获取列表数据
export function getTableDataList(params) {
  return request(`${uri}/product/getProductPage`, {
    method: 'POST',
    data: params,
  });
}

//获取项目流程列表数据
export function getProductListAPI(params) {
  return request(`${uri}/process/product/list`, {
    method: 'POST',
    data: params,
  });
}

// 请求 项目编码/所属部门 下拉列表项
export function getProcodeAndProDeptListAPI(type) {
  return request(`${uri}/product/getQueryParamList?type=${type}`);
}

// 删除 可批量
export function deleteAPI(params) {
  return request(`${uri}/process/product/delete`, {
    method: 'POST',
    data: params.instanceIds,
  });
}

// 项目发行
export function projectPublishAPI(params) {
  return request(`${uri}/product/productPublish`, {
    method: 'POST',
    data: params,
  });
}

// 判断项目是否可终止
export function checkTerminationAPI(params) {
  return request(`${uri}/product/checkTermination?${stringify(params)}`);
}

// 项目终止
export function projectTerminationAPI(params) {
  return request(`${uri}/process/product/terminate`, {
    method: 'POST',
    data: params,
  });
}

export function getMemberInfoByCodeApi(params) {
  return request(`${uri}/product/getMemberInfoByCode?${stringify(params)}`);
}

export async function getProSetUpTimeInfoApi(params) {
  return request(`${uri}/projectSetUp/getProSetUpTimeInfo?${stringify(params)}`);
}

export async function updateDelSaveProSetUpTimeInfoApi(params) {
  return request(`${uri}/projectSetUp/updateDelSaveProSetUpTimeInfo`, {
    method: 'POST',
    data: params
  });
}
