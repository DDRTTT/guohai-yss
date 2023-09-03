import { stringify } from 'qs';
import request from '@/utils/request';

const uri = '/yss-awp-server';
//const uri = '/yss-awp-server-jc';

// 列表信息
export async function handleGetListAPI(params) {
  return request(`${uri}/path/getPathList`, {
    method: 'POST',
    data: params,
  });
}
// // 系列列表信息
// export async function handleGetSeriesListAPI(params) {
//   return request(`${uri}/product/getProductPageChecked`, {
//     method: 'POST',
//     data: params,
//   });
// }

// 项目名称下拉
export async function handleGetProductListAPI(params) {
  return request(`${uri}/path/getProductList?${stringify(params)}`);
}
// 适用性修改
export async function handleSetPathAPI(params) {
  return request(`${uri}/path/setPath`, {
    method: 'POST',
    data: params,
  });
}
// 审核：1/反审核：0
export async function handleAuditAPI(params) {
  return request(`${uri}/path/checked?${stringify(params)}`);
}

// 根据proCode查详情
export async function handleGetInfoByProCodeAPI(params) {
  return request(`${uri}/product/getDetail?proCode=${params}`);
}

// 生命周期树形
export async function handleGetTreeAPI(params) {
  return request(`${uri}/path/getAllPathTree?${stringify(params)}`);
}
// 词汇字典
export async function handleWordDictionaryFetchAPI(parameter) {
  return request(`/ams-base-parameter/datadict/queryInfoByList?${stringify(parameter)}`);
}

// 不适用目录树
export async function handleGetNoPathTreeAPI(params) {
  return request(`${uri}/path/getNoPathTree?code=${params}`);
}

// 拖动树
export async function handleDragTreeAPI(params) {
  return request(`${uri}/path/updatePathOrder`, {
    method: 'POST',
    data: params,
  });
}
