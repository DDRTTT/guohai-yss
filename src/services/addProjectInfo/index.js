import request from '@/utils/request';
import { stringify } from 'qs';

// 请求 项目/系列详情页数据
export function getPageInfoAPI(proCode) {
  return request(`/yss-awp-server/product/getDetail?proCode=${proCode}`);
}

// 获取 项目/系列 编码
export function getProCodeAPI(proType) {
  return request(`/yss-awp-server/product/getProCode?proType=${proType}`);
}

// 请求 项目类型 下拉列表项
export function getProTypeListAPI(fcode) {
  return request(`/ams-base-parameter/datadict/queryInfo?fcode=${fcode}`);
}

// 请求  成员姓名 下拉列表项
export function getMemberNameListAPI(sysId) {
  return request(`/yss-base-admin/user/getSysPerson?sysId=4`);
}

// 保存数据
export function savaDataAPI(params) {
  return request(`/yss-awp-server/process/product/save`, {
    method: 'POST',
    data: params,
  });
}

// 变更保存数据
export function resavaDataAPI(params) {
  return request(`/yss-awp-server/process/product/resave`, {
    method: 'POST',
    data: params,
  });
}

// 变更提交数据
export function recommitDataAPI(params) {
  return request(`/yss-awp-server/process/product/recommit`, {
    method: 'POST',
    data: params,
  });
}

// 提交数据
export function commitAPI(params) {
  return request(`/yss-awp-server/process/product/commit`, {
    method: 'POST',
    data: params,
  });
}

// 修改/变更 提交数据
export function recommitAPI(params) {
  return request(`/yss-awp-server/process/product/recommit`, {
    method: 'POST',
    data: params,
  });
}
// 项目系列数据字典
export function getproNameAPI(params) {
  return request(`/yss-awp-server/awp/common/project/option?type=${params.type}`, {
    method: 'GET',
  });
}
// 修改数据
export function updateProductInfoAPI(params) {
  return request(`/yss-awp-server/process/product/update`, {
    method: 'POST',
    data: params,
  });
}
// 添加成员信息  根据姓名回填数据
export function getMemberInfoAPI(params) {
  return request(`/yss-awp-server/product/getMemberInfo?${stringify(params)}`, {
    method: 'GET',
  });
}
