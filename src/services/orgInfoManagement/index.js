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

// //上级机构
// export function superiorOrg(params) {
//   return request(`${uri}/organization/getOrgNameList`);
// }
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
// 为了区分内部机构 - 组织架构删除增加参数(同其他机构删除相同但是增加flag=0进行进行区分);
export async function orgtionDeleteAPI(params) {
  return request(`${uri}/organization/deleteBatch?flag=0`, {
    method: 'POST',
    data: params,
  });
}
// 内部组织架构撤销
export async function revokeAPI(params) {
  return request(`${uri}/organization/undo`, {
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

// 数据字典
export function getCodeList(codeList) {
  return request(`${uri}/datadict/queryInfoByList?codeList=${codeList.toString()}`);
}
// 上级机构
export function superiorOrg(innerFlag) {
  return request(`${uri}/organization/getOrgNameForTree?type=${innerFlag}`);
}

//机构部门(组织架构)
export async function departmentAPI(params) {
  // return request(`${uri}/organization/getDepTreeByOrgId?orgId=${params}`);
  return request(
    `${uri}/organization/getDepTreeByOrgId?needRoot=${params.needRoot}&orgId=${params.orgId}`,
  );
}
//联系人列表
export async function contactsAPI(params) {
  return request(`${uri}/linker/getPage`, {
    method: 'POST',
    data: params,
  });
}
//联系人删除
export async function contactDeleteAPI(params) {
  return request(`${uri}/linker/deleteLinkerInfoById?id=${params}`);
}
//员工列表
export async function staffListAPI(params) {
  return request(`${uri}/employee/fuzzySelectInfoList`, {
    method: 'POST',
    data: params,
  });
}

//新增员工信息处还在使用
export async function employOrgAPI(params) {
  return request(`${uri}/organization/getDepTreeByOrgId?orgId=${params}`);
}

// 查看信息
export function details(params) {
  return request(`${uri}/organization/query/baseInfo?orgId=${params}`);
}
// 机构新增、修改
export function addOrg(params) {
  return request(`${uri}/organization/save`, {
    method: 'POST',
    data: params,
  });
}
//机构内码
export async function ascriptionAPI(params) {
  return request(`${uri}/organization/query/userOrgBaseInfo`);
}
//移入、移除黑名单接口
export async function blacklistAPI(params) {
  return request(`${uri}/organization/update/setBlacks?isBlack=${params.isBlack}`, {
    method: 'POST',
    data: params.idArr,
  });
}
//联系人保存/修改
export async function contactSaveAPI(params) {
  return request(`${uri}/linker/saveOrUpdate`, {
    method: 'POST',
    data: params,
  });
}
// 职务类型
export function positionTypeAPI() {
  return request(`${uri}/datadict/getListTree?fcode=J010`);
}
// 获取岗位
export async function getPositionAPI() {
  return request(`/yss-base-admin/positionInfo/selectAllPositionByOrg`);
}
// 员工-新增/修改
export function preservationAPI(params) {
  return request(`${uri}/employee/saveOrUpdate`, {
    method: 'POST',
    data: params,
  });
}
// 员工信息详情
export function getDetailsAPI(params) {
  return request(`${uri}/employee/getEmployeeInfoById?id=${params}`);
}
//员工列表删除
export async function employeeDeleteAPI(params) {
  return request(`${uri}/employee/batchDelete?ids=${params}`);
}
//机构人员列表
export async function getDepartLeaderAPI() {
  return request(`${uri}/employee/getDropDownList`);
}
