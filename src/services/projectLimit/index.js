import { stringify } from 'qs';
import request from '@/utils/request';

const uri = '/yss-awp-server';
//const uri = '/yss-awp-server-jc';

// 列表信息
export async function handleGetListAPI(params) {
  return request(`${uri}/product/getQueryParamList?type=${params}`);
}

// 生命周期树形
export async function handleGetTreeAPI(params) {
  return request(`${uri}/path/getAllPathTree?${stringify(params)}`);
}
