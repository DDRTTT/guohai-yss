/**
 *Create on 2020/7/22.
 */

import { stringify } from 'qs';
import request from '@/utils/request';
import { getAuthToken } from '@/utils/session';

const uri = '/yss-base-admin/user';

export async function query({ current, pageSize, queryParameters }) {
  return request(
    `${uri}/query?${stringify({ start: current, length: pageSize, ...queryParameters })}`,
  );
}

export async function add(values) {
  return request(`${uri}/add`, {
    method: 'POST',
    data: values,
  });
}

export async function edit(values) {
  return request(`${uri}/edit/${values.id}`, {
    method: 'PUT',
    data: values,
  });
}

export async function del(id) {
  return request(`${uri}/del/${id}`, {
    method: 'DELETE',
  });
}

export async function authorize(payload) {
  return request(`${uri}/authorize/${payload.id}`, {
    method: 'POST',
    data: payload,
  });
}

export async function getUserRolesById(id) {
  return request(`${uri}/roles/query/${id}`);
}

export async function getProductTree(id) {
  return request(`/ams-base-parameter/assettype/producttree`);
}

export async function getUserCreatRolesById() {
  return request(`${uri}/roles/queryCreat`);
}

export async function queryCurrent() {
  return request(`/yss-base-admin/jwt/userInfo?token=${getAuthToken()}`);
}

export async function userType() {
  return request(`/ams-base-parameter/datadict/queryInfo?fcode=userType`);
}

export async function allmenutree() {
  return request(`/yss-base-admin/user/allmenutree`);
}

export async function getInitprodata(val) {
  return request(`/yss-base-admin/user/getUserProduct/${val}`);
}

export async function getProduct(val) {
  return request(`/test/user/product`);
}

export async function putpro(payload) {
  const list = { fproList: payload.fproList.split(',') };
  return request(`/yss-base-admin/user/give/${payload.id}`, {
    method: 'POST',
    data: list,
  });
}

export async function queryRuleJG() {
  return request(`/ams-base-parameter/institution/allOrgTree`);
}

export async function restUserCode(params) {
  return request(`/yss-base-admin/user/ResetPwd/${params.id}`);
}
