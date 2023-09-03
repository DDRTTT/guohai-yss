import { stringify } from 'qs';
import request from '@/utils/request';
const uri = '/ams-base-parameter';
//员工列表
export async function staffListAPI(params) {
  return request(`${uri}/employee/fuzzySelectInfoList`, {
    method: 'POST',
    data: params,
  });
}

//机构人员列表
export async function getDepartLeaderAPI() {
  return request(`${uri}/employee/getDropDownList`);
}

//机构人员列表2
export async function getOrgDropDownListAPI(params) {
  return request(`${uri}/employee/getOrgDropDownList?${stringify(params)}`);
}

// 获取员工详情
export async function getEmployeeInfo(id) {
  return request(`${uri}/employee/getEmployeeInfoById?id=${id}`);
}

//机构部门
export async function departmentAPI(params) {
  // return request(`${uri}/organization/getDepTreeByOrgId?orgId=${params}`);
  return request(
    `${uri}/organization/getDepTreeByOrgId?needRoot=${params.needRoot}&orgId=${params.orgId}`,
  );
}

//员工新增
export async function empInfoPreseAPI(params) {
  return request(`${uri}/employee/saveOrUpdate`, {
    method: 'POST',
    data: params,
  });
}

//联系人列表
export async function contactsAPI(params) {
  return request(`${uri}/linker/getPage`, {
    method: 'POST',
    data: params,
  });
}

//机构名称
export async function organNameAPI(params) {
  return request(`${uri}/organization/getOrgNameList`);
}

//联系人保存/修改
export async function contactSaveAPI(params) {
  return request(`${uri}/linker/saveOrUpdate`, {
    method: 'POST',
    data: params,
  });
}
//联系人删除
export async function contactDeleteAPI(params) {
  return request(`${uri}/linker/deleteLinkerInfoById?id=${params}`);
}

//联系人删除
export async function employeeDeleteAPI(params) {
  return request(`${uri}/employee/batchDelete?ids=${params}`);
}

// 查看信息
export function details(params) {
  return request(`${uri}/organization/query/baseInfo?orgId=${params}`);
}

// 本家机构修改
export function updateOrg(params) {
  return request(`${uri}/organization/save`, {
    method: 'POST',
    data: params,
  });
}
//字典信息
export function getDictsAPI(codeList) {
  return request(`${uri}/datadict/queryInfoByList?codeList=${codeList.toString()}`);
}

// 所属组织机构
export function superiorOrg(innerFlag) {
  return request(`${uri}/organization/getOrgNameForTree?type=${innerFlag}`);
}

// 机构新增或是修改按钮
export function addOrg(params) {
  return request(`${uri}/organization/save`, {
    method: 'POST',
    data: params,
  });
}
