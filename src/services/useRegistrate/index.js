import record from '@/pages/lifeCyclePRD/record';
import request from '@/utils/request';
import { stringify } from 'qs';

const uri = '/yss-lifecycle-flow';
// const uri = 'http://10.10.90.56:3000/mock/20';
// const uri = '';

// 新版用印登记-查看批次详情
export function getDetailForSpecifyBatch(params) {
  return request(`${uri}/usingRegistration/getDetailForSpecifyBatch?busId=${params.busId}&processInstanceId=${params.processInstanceId}&taskId=${params.taskId}`);
}

// 新版用印登记-重新发送OA
export function resend2OA(params) {
  return request(`${uri}/usingRegistration/resend2OA?busId=${params.busId}&processInstanceId=${params.processInstanceId}&taskId=${params.taskId}`);
}

// 新版用印登记-获取产品下拉列表
export function getProductList(params) {
  return request(`${uri}/product/review/productEnum/search`);
}

// 新版用印登记-获取表格数据
export function getTableList(params) {
  return request(`${uri}/usingRegistration/getProcessBatchInfoList`, {
    method: 'POST',
    data: params,
  });
}

// 用印登记流程表格数据 查询
export function getTableData(params) {
  return request(`${uri}/usingRegistration/getUsingList`, {
    method: 'POST',
    data: params,
  });
}

// 表单详情数据查询
export function getDetail(params) {
  return request(`${uri}/usingRegistration/getinfo?${stringify(params)}`, {
    method: 'POST',
  });
}

// 下拉框数据 查询
export function getItemsList(params) {
  return request(`${uri}/usingRegistration/getXiaLa?${stringify(params)}`);
}

// 用印状态 下拉框
export function getStatusList() {
  return request(`${uri}/usingRegistration/getUsingChecked`);
}

// 用印单位
export function getUnitsList(params) {
  return request(`/ams-base-parameter/organ/gethang?${stringify(params)}`);
}

// 发送OA
export function sendOAagin(params) {
  // return request(`${uri}/usingRegistration/usingApply?${stringify(params)}`);
  return request(`${uri}/usingRegistration/usingApplyFail?${stringify(params)}`);
}
// 词汇字典
export function getDictList(params) {
  return request(`/ams-base-parameter/datadict/queryInfoByList?${stringify(params)}`);
}

// 获取当前机构全部用户列表(全部)
export function getPersonList() {
  return request(`/yss-base-admin/user/getperson`);
}

// 获取当前机构全部用户列表（OA）
export function getOAPersonList() {
  return request(`/yss-base-admin/user/getOAUserPerson`);
}

// 获取产品实名注册子流程模块代码和名称的映射关系
export function getModuleList() {
  return request(`/ams-base-parameter/datadict/queryInfo?fcode=M001`);
}

//获取印章种类列表（全部）
export function sealTypeListAPI() {
  return request(`/yss-lifecycle-flow/usingRegistration/getSealType?flag=`);
}

//获取印章名列表（全部）
export function sealNameListAPI() {
  return request(`/yss-lifecycle-flow/usingRegistration/getSealName?sealType=`);
}

// 获取审批人下拉列表
export function approverListAPI() {
  return request(`/ams-base-parameter/datadict/queryInfo?fcode=approverName`);
}

