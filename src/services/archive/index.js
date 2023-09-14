import request from '@/utils/request';
import { stringify } from 'qs';
/* 档案归档所有方法 */
const uri = '/yss-base-product';
// ====================================档案整理接口=========================================
// 列表数据
export async function getTableDataListAPI(params) {
  return request(`${uri}/biProductElement/smartbi/query`, {
    method: 'POST',
    data: params,
  });
}
// 档案整理保存（通用接口）
export async function preservationAPI(params) {
  return request(`/yss-base-product/physicalFiling/add`, {
    method: 'POST',
    data: params,
  });
}
// 档案整理修改(通用接口)
export async function updateAPI(params) {
  return request(`/yss-base-product/physicalFiling/update`, {
    method: 'POST',
    data: params,
  });
}
// 档案整理详情
export async function detailsAPI(params) {
  return request(`/yss-base-product/biProductElement/smartbi/query`, {
    method: 'POST',
    data: params,
  });
}
// 档案整理整理、送批接口(flag 0 整理  1送批)
export async function arrangementAPI(params) {
  return request(`/yss-base-product/physicalFiling/updateByIds?ids=${params.ids}&flag=${params.flag}`, {
    method: 'GET',
  });
}
// 档案整理删除、审核
export async function deleteAPI(params) {
  return request(`/yss-base-product/physicalFiling/checkOrDelByIds?ids=${params.ids}&flag=${params.flag}`, {
    method: 'GET',
  });
}
// 档案大类
export async function archivesCategoryAPI(params) {
  return request(`/ams-base-parameter/fileType/queryArchives`, {
    method: 'GET',
    data: params,
  });
}
// 文档类型
export async function documentTypeAPI(params) {
  return request(`/ams-base-parameter/fileType/queryDocType?archiveTypeCode=${params}`, {
    method: 'GET',
  });
}
// 文件类型
export async function fileTypeAPI(params) {
  return request(`/ams-base-parameter/fileType/queryDocType?archiveTypeCode=${params}`, {
    method: 'GET',
  });
}
// 数据字典
export function getCodeList(codeList) {
  return request(`/ams-base-parameter/datadict/queryInfoByList?codeList=${codeList.toString()}`);
}
// 档案室、档案架、档案位置、档案盒
export function archivesCenterAPI(params) {
  return request(`/yss-base-product/achivesManagement/queryArchives?parentId=${params}`);
}

// ======================================档案库接口=========================================
// 档案库树结构
export function archivesTreeAPI(params) {
  return request(`/yss-base-product/achivesManagement/queryArchivesTree`);
}
//档案库列表数据
export async function archivesListAPI(params) {
  return request(`/yss-base-product/biProductElement/smartbi/query`, {
    method: 'POST',
    data: params,
  });
}
//档案库菜单新增、修改
export async function menuAddAPI(params) {
  return request(`/yss-base-product/achivesManagement/add`, {
    method: 'POST',
    data: params,
  });
}
//档案库菜单删除
export async function menuDeleteAPI(params) {
  return request(`/yss-base-product/achivesManagement/deleteByIds?ids=${params}`, {
    method: 'GET',
  });
}


