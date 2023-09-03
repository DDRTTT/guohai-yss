/**
 *Create on 2020/7/13.
 */

import { stringify } from 'qs';
import request from '../../utils/request';
import { basicResources, getUserMenu } from '../../common/basicResources';

const uri = '/yss-base-admin/role';

export async function query({ current, pageSize, queryParameters }) {
  return request(
    `${uri}/query?${stringify({
      start: current,
      length: pageSize,
      ...queryParameters,
    })}`,
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
  return request(`${uri}/actions/init/${payload.id}`, {
    method: 'POST',
    data: payload,
  });
}

export async function getAuthorizeById(id) {
  return request(`${uri}/actions/query/${id}`);
}

export async function getAllAuthorizeById(id) {
  return request(`${uri}/getrolebyroleid/${id}`);
}

export async function roleType() {
  return request(`/ams-base-parameter/datadict/queryInfo?fcode=roletype`);
}

// 权限树
export async function allmenutree(code) {
  return request(`/yss-base-admin/user/allmenutree?sysId=${code}`);
}

export async function menuTree(queryParameters) {
  return getUserMenu(queryParameters);
}

export async function emptyRole() {
  return request(`/yss-base-admin/role/returnstructure`);
}

export async function addRoleCtrl(payload) {
  return request(`${uri}/addrole`, {
    method: 'POST',
    data: payload,
  });
}
