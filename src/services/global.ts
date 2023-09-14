/**
 *Create on 2020/9/7.
 */

import request from '@/utils/request';
import * as type from '@/services/type';
import { stringify } from 'qs';

const uri = '/yss-awp-server/path';

// 交换token
export async function handleTokenExchangeAPI() {
  return request('/yss-base-admin/jwt/sysToken', {
    method: 'POST',
  });
}

// 获取IP
export async function getNginxIP() {
  return request(`${uri}/getnginxip`);
}

// 单点登录系统返回/workspace的时候，根据其他系统返回用户userid和所在系统sysid，获取新的token
export async function GET_REFRESH_TOKEN_API(params: { sysId: string; userId: string }) {
  return request(`${type.GET_REFRESH_TOKEN_API}?${stringify(params)}`);
}

// 每次跳回到工作台都请求一次token，为了兼容单点登录到其他系统时间过长，token过期问题,userIc为当前用户id
export async function GET_REFRESH_TOKEN_WITH_USERID_API(params: { userId: string }) {
  return request(`${type.GET_REFRESH_TOKEN_WITH_USERID_API}?${stringify(params)}`, {
    method: 'POST',
  });
}

// ES对比日期查询
export async function GET_ES_BOOL_LIST_API(params: { fid: string; ids: string }) {
  return request(`${type.GET_ES_BOOL_LIST_API}`, {
    method: 'POST',
    data: params,
  });
}
// ES对比查询
export async function GET_ES_QUERY_BY_ID_API(params: { fid: string; ids: string }) {
  return request(`${type.GET_ES_QUERY_BY_ID_API}`, {
    method: 'POST',
    data: params,
  });
}

// ES对比查询
export async function GET_ENCRYPTION_API() {
  return request(`${type.GET_ENCRYPTION_API}`);
}
