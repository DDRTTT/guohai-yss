import { stringify } from 'qs';
import request from '@/utils/request';

const uri = '/ams-base-parameter';
// 数据字典
export function getDictsAPI(codeList) {
  return request(`${uri}/datadict/queryInfoByList?codeList=${codeList.toString()}`);
}
// 删除
export function getDetailsAPI(params) {
  return request(`${uri}/employee/getEmployeeInfoById?id=${params}`);
}
// 新增/修改
export function preservationAPI(params) {
  return request(`${uri}/employee/saveOrUpdate`, {
    method: 'POST',
    data: params,
  });
}
// 职务类型
export function positionTypeAPI() {
  return request(`${uri}/datadict/getListTree?fcode=J010`);
}

// 机构部门
export async function departmentAPI(orgId) {
  return request(`${uri}/organization/getDepTreeByOrgId?orgId=${orgId}`);
}

// 获取岗位
export async function getPositionAPI() {
  return request(`/yss-base-admin/positionInfo/selectAllPositionByOrg`);
}
