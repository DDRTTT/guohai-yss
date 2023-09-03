import { stringify } from 'qs';
import request from '@/utils/request';

const uri = '/yss-base-admin';

// 获取列表
export async function queryPage(params) {
  return request(`${uri}/role/queryPage`, {
    method: 'POST',
    data: params,
  });
}

// 获取角色详情
export async function getrolebyroleid(val) {
  return request(`${uri}/role/getrolebyroleid/${val}`);
}

// 添加角色
export async function addrole(params) {
  return request(`${uri}/role/addrole`, {
    method: 'POST',
    data: params,
  });
}
// 审核/反审核
export async function check({ ids, check }) {
  return request(`${uri}/role/check?ids=${ids}&check=${check}`, {
    method: 'PUT',
  });
}

// 删除角色
export async function delRole(val) {
  return request(`${uri}/role/del/${val}`, {
    method: 'DELETE',
  });
}

// 批量删除
export async function dellist(val) {
  return request(`${uri}/role/dellist?id=${val}`);
}
