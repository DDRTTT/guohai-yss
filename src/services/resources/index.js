import { stringify } from 'qs';
import request from '@/utils/request';

export async function queryRule(params) {
  return request(`/yss-base-admin/resource/getByConditions?${stringify(params)}`);
}

export async function queryRule2(params) {
  return request(`/yss-base-admin/resource/query?${stringify(params)}`);
}

export async function putdata(params) {
  return request(`/yss-base-admin/resource/updateUriType`, {
    method: 'POST',
    data: params,
  });
}
