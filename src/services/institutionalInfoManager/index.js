import { stringify } from 'qs';
import request from '@/utils/request';
const uri = '/ams-base-parameter';

// 列表查询
export async function otherOrganInforList(params) {
  return request(`${uri}/organization/orgInfoPageQuery`, {
    method: 'POST',
    data: params,
  });
}
//本家机构
export async function myOrganInforList(params) {
  return request(`${uri}/organization/orgInfoPageQuery`, {
    method: 'POST',
    data: params,
  });
}

// 词汇字典
export function getDictsAPI(codeList) {
  return request(`/ams-base-parameter/datadict/queryInfoByList?codeList=${codeList.toString()}`);
}

//上级机构
export function superiorOrg(params) {
  return request(`${uri}/organization/getOrgNameList`);
}
//审核/反审核
export async function toExamineAPI(params) {
  return request(`${uri}/organization/checked`, {
    method: 'POST',
    data: params,
  });
}
//批量审核
export async function toExamines(params) {
  return request(`${uri}/organization/checked-batch`, {
    method: 'POST',
    data: params,
  });
}

// 批量审核／反审核
export async function getExamineAPI(params) {
  return request(`${uri}/organization/checked-batch`, {
    // return request(`${uri}/salesOrgMaintain/batchReviewSalesOrgInfo?ids=${params.ids}&flag=${params.flag}`, {
    method: 'POST',
    data: params,
  });
}

//本机机构删除
export function myOrgDeleteAPI(params) {
  return request(`${uri}/organization/delOrgan?id=${params}`);
}

//其他机构删除
export async function otherOrgDeleteAPI(params) {
  return request(`${uri}/organization/deleteBatch`, {
    method: 'POST',
    data: params,
  });
}

//本家机构文件列表文件类型
export async function fileTypeAPI(params) {
  return request(`${uri}/fileType/query/file-type-list/map`, {
    method: 'POST',
    data: params,
  });
}


export async function fileDelectAPI(params) {
  return request(`/ams-file-service/businessArchive/deleteFile`, {
    method: 'POST',
    data: params,
  });
}
