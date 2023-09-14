/**
 *Create on 2020/7/22.
 */

import { stringify } from 'qs';
import request from '../../utils/request';

const uri = 'ams-base-parameter/fileType';

// 借阅人
export async function getPersonList(params) {
  return request(`/yss-base-admin/user/getperson`);
}

// 所属部门
export async function getPersonOrg(orgId) {
  return request(`/ams-base-parameter/organization/getDepTreeByOrgId?needRoot=0&orgId=${orgId}`);
}

// 请求借阅状态
export function getDictsAPI(codeList) {
  return request(`/ams-base-parameter/datadict/queryInfoByList?codeList=${codeList.toString()}`);
}

// 档案大类
export function fileClass() {
  return request(`/${uri}/queryArchives`);
}

// 文档类型 / 文件类型
export function fileType(code) {
  return request(`/${uri}/queryDocType?archiveTypeCode=${code}`);
}

// 档案借阅申请
export function makeApply(params) {
  return request(`/yss-base-product/archivesLibrary/add`, {
    method: 'POST',
    data: params,
  });
}

// 档案借阅列表
export function applyList(params) {
  return request(`/yss-base-product/archivesLibrary/queryList`, {
    method: 'POST',
    data: params,
  });
}

// 档案借阅列表删除
export function delApply(ids) {
  return request(`/yss-base-product/archivesLibrary/deleteByIds?ids=${ids}`);
}

// 借阅单列表
export function orderList(params) {
  return request(`/yss-base-product/biProductElement/smartbi/query`, {
    method: 'POST',
    data: params,
  });
}

// 文件类型转换
export function fileTypeTrans(params) {
  return request(`/ams-base-parameter/fileType/query/file-type-list/map`, {
    method: 'POST',
    data: params,
  });
}

// 借阅状态修改
export function modifyApply(params) {
  return request(`/yss-base-product/archivesLibrary/checkAndDelayById`, {
    method: 'POST',
    data: params,
  });
}
