import request from '@/utils/request';
import { deletNUllProperty } from '@/utils/utils';

const uri = '/yss-lifecycle-flow';
// 查询表格数据
export function queryTableList(params) {
  deletNUllProperty(params);
  return request.post(`${uri}/stakeholderInfo/stakeList`, {
    data: params,
  });
}
// 根据id查询员工信息详情
export function getDetailsAPI(data) {
  return request(`${uri}/stakeholderInfo/getInfoByNameId`, {
    method: 'post',
    data,
  });
}
// 根据类别获取干系人类型
export function queryType(params) {
  deletNUllProperty(params);
  return request.get(`${uri}/stakeholderInfo/queryType`, {
    params,
  });
}
// 根据搜索用的姓名列表--修复BUG，需更换接口
export function searchNameListApi(params) {
  deletNUllProperty(params);
  return request.post(`/ams-base-parameter/employee/getemployeeDetailByCon`, {
    data: params,
  });
}
// 获取产品下拉列表
export function productEnum(id) {
  return request.get(`${uri}/product/review/productEnum/search`, {
    params: [id],
  });
}
// 获取机构下拉值
export function findAgencyByType(params) {
  deletNUllProperty(params);
  return request.get(`${uri}/stakeholderInfo/findAgencyByType`, {
    params,
  });
}
// 获取干系人详情
export function queryById(params) {
  deletNUllProperty(params);
  return request.get(`${uri}/stakeholderInfo/queryById`, {
    params,
  });
}
// 机构名称的下拉
export function getOrgNameList(params) {
  deletNUllProperty(params);
  return request.get(`/ams-base-parameter/organization/getOrgNameList`, {
    params,
  });
}
// 获取内部的干系人
export function getEmployeeMap(params) {
  deletNUllProperty(params);
  return request.get(`/ams-base-parameter/employee/getDropDownList`, {
    params,
  });
}
// 获取外部的干系人
export function getOrgLinkerNameList(params) {
  deletNUllProperty(params);
  return request.get(`/ams-base-parameter/linker/getOrgLinkerNameList`, {
    params,
  });
}
// 获取产品详情
export function getProInfo(params) {
  deletNUllProperty(params);
  return request.get(`${uri}/stakeholderInfo/getProInfo`, {
    params,
  });
}

// 新增修改
export function addMap(params) {
  deletNUllProperty(params);
  return request.post(`${uri}/stakeholderInfo/addMap`, {
    data: params,
  });
}
// 审核/反审核
export function updateChecked(params) {
  deletNUllProperty(params);
  return request.post(`${uri}/stakeholderInfo/updateChecked?flag=${params.flag}`, {
    data: params.ids,
  });
}
// 删除;
export function deleteByIds(params) {
  deletNUllProperty(params);
  return request.post(`${uri}/stakeholderInfo/deleteByIds`, {
    data: params,
  });
}
