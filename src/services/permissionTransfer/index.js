import request from '@/utils/request';
import { stringify } from 'qs';

const uri = '/yss-lifecycle-flow';

// 对办理和未提交进行筛选API
export async function getLinkRouterAPI(params) {
  return request('/yss-lifecycle-flow/common/checkTypeForRouter', {
    method: 'POST',
    data: params,
  });
}

// 获取权限委托编号
export function getTurnoverNum(params) {
  return request(`/yss-base-product/auth-turnover/gen-turnover-num`);
}
// 权限收回
export function getAuthDraw(params) {
  return request(`/yss-base-product/auth-turnover/auth-withdraw`);
}
// 查询用户岗位信息
export function getUserVoByUserId(params) {
  return request(`/yss-base-admin/user/queryMember`, { params });
}
// 根据岗位查询用户集合
export function queryMemberByDept(params) {
  return request(`/yss-base-admin/user/queryMemberByDept`, { params });
}
// 根据用户id查询部门领导人
export function getDeptLeaderByUserId(params) {
  return request(`/ams-base-parameter/organization/getDeptLeaderByUserId`, { params });
}
// 查询用户下的任务列表
export function taskListPage(params) {
  return request(`/yss-lifecycle-flow/task-query/task-list-page`, { params });
}
// 字典
export function dictQueryInfo(params) {
  return request(`/ams-base-parameter/datadict/queryInfo`, { params });
}
// 查询用户下的产品列表
export function getProductEnumList(params) {
  return request(`/yss-base-admin/user/auth-products`, { params });
}

// 添加任务
export function addTask(params) {
  return request(`/yss-base-product/auth-turnover/add`, { data: params, method: 'POST' });
}
// 修改任务
export function updateTask(params) {
  return request(`/yss-base-product/auth-turnover/update`, { data: params, method: 'POST' });
}
// 查询详情
export function querybyid(params) {
  return request(`/yss-base-product/auth-turnover/querybyid`, {
    params,
    method: 'GET',
  });
}
// 生成主键id
export function getSeq(params) {
  return request(`/yss-lifecycle-manage/productElement/getSeq`, {
    params,
    method: 'GET',
  });
}
// 当前机构全量用户id-name
export function getAllUser(params) {
  return request(`/yss-base-admin/user/users-all`, {
    params,
    method: 'GET',
  });
}
