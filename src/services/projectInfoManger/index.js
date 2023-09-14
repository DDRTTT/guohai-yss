import request from '@/utils/request';
import { stringify } from 'qs';

//获取列表数据
export function getTableDataList(params) {
  return request(`/yss-awp-server/product/getProductPage`, {
    method: 'POST',
    data: params,
  });
}

//获取项目流程列表数据
export function getProductListAPI(params) {
  return request(`/yss-awp-server/process/product/list`, {
    method: 'POST',
    data: params,
  });
}

// 请求 项目编码/所属部门 下拉列表项
export function getProcodeAndProDeptListAPI(type) {
  return request(`/yss-awp-server/product/getQueryParamList?type=${type}`);
}

// 删除 可批量
export function deleteAPI(params) {
  return request(`/yss-awp-server/process/product/delete`, {
    method: 'POST',
    data: params.instanceIds,
  });
}

// 项目发行
export function projectPublishAPI(params) {
  return request(`/yss-awp-server/product/productPublish`, {
    method: 'POST',
    data: params,
  });
}

// 判断项目是否可终止
export function checkTerminationAPI(params) {
  return request(`/yss-awp-server/product/checkTermination?${stringify(params)}`);
}

// 项目终止
export function projectTerminationAPI(params) {
  return request(`/yss-awp-server/process/product/terminate`, {
    method: 'POST',
    data: params,
  });
}
