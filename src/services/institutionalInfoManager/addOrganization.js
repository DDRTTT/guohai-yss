import { stringify } from 'qs';
import request from '@/utils/request';

const uri = '/ams-base-parameter';
// 数据字典
export function getDictsAPI(codeList) {
  return request(`${uri}/datadict/queryInfoByList?codeList=${codeList.toString()}`);
}

// 新增机构保存按钮
export function addOrg(params) {
  return request(`${uri}/organization/save`, {
    method: 'POST',
    data: params,
  });
}

// 上级机构
export function superiorOrg(innerFlag) {
  return request(`${uri}/organization/getOrgNameForTree?type=${innerFlag}`);
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

//机构内码
export async function ascriptionAPI(params) {
  return request(`${uri}/organization/query/userOrgBaseInfo`);
}

export async function queryimgAPI(params) {
  return request(`/ams/ams-file-service/fileServerApi/getFileByCode?code=${params}`);
}

