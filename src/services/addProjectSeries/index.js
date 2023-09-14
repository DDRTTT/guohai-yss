import request from '@/utils/request';
import { stringify } from 'qs';

//请求 系列信息详情页数据
export function getPageInfoAPI(proCode) {
  return request(`/yss-awp-server/product/getDetail?proCode=${proCode}`);
}

// 获取生成系列编码
export function getSeriesCodeAPI(proType) {
  // return request(`/yss-awp-server/product/getSeriesCode`);
  return request(`/yss-awp-server/product/getProCode?proType=${proType}`);
}
// 请求 所属部门 下拉列表项
export function getProcodeAndProDeptListAPI(type) {
  return request(`/yss-awp-server/product/getQueryParamList?type=${type}`);
}

// 请求 项目编码
export function getProCodeAPI(proType) {
  return request(`/yss-awp-server/product/getProCode?proType=${proType}`);
}

// 请求 项目类型 下拉列表项
export function getProTypeListAPI(fcode) {
  return request(`/ams-base-parameter/datadict/queryInfo?fcode=${fcode}`);
}

// 保存数据
export function savaDataAPI(params) {
  return request(`/yss-awp-server/product/addProduct`, {
    method: 'POST',
    data: params,
  });
}

// 项目名称数据字典
export function getproNameAPI(params) {
  return request(`/yss-awp-server/awp/common/project/option?type=${params.type}`, {
    method: 'GET',
  });
}

// 修改系列信息
export function updateProductInfoAPI(params) {
  return request(`/yss-awp-server/product/updateProductNew`, {
    method: 'POST',
    data: params,
  });
}
// 审核
export function checkProductAPI(params) {
  return request(
    `/yss-awp-server/product/batchCheckProduct?ids=${params.ids}&checked=${params.checked}`,
    {
      method: 'POST',
    },
  );
}
