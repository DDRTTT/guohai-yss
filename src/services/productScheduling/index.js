import request from '@/utils/request';
import {
  deletNUllProperty
} from '@/utils/utils';
import { stringify } from 'qs';

const uri = '/yss-lifecycle-flow';
const uri1 = '/ams-base-parameter';
/* const uri = ''; */

// 产品排期表列表
export function getTableDataList(params) {
  return request(`${uri}/productPublishPlan/list`, {
    method: 'POST',
    data: params,
  });
}

// 产品名称/产品代码查询
export function getProductList() {
  return request(`${uri}/customizeMatter/getProInfo`);
  // return request(`${uri}/product/review/productEnum/search`);
}

// 产品发布计划产品名称查询
export function getProductReleaseList() {
  return request(`${uri}/customizeMatter/getProInfo`);
  // return request(`${uri}/product/review/productEnum/search`);
}

// 产品发布计划产品名称回显信息
export function getProductInfoView(params) {
  return request(`${uri}/productPublishPlan/getProInfo?${stringify(params)}`);
}

// 获取机构全部用户抄送
export function getUsersList() {
  return request(`${uri}/productPublishPlan/getMemberInfo`);
}

// 产品计划发布新增保存
export function getProductSave(params) {
  return request(`${uri}/productPublishPlan/add`, {
    method: 'POST',
    data: params,
  });
}

// 产品计划发布修改保存
export function getProductUpdateSave(params) {
  return request(`${uri}/productPublishPlan/update`, {
    method: 'POST',
    data: params,
  });
}

// 产品类型
export function getproTypeList(params) {
  return request(`${uri}/common/allAssetType?${stringify(params)}`);
} 

// 获取产品归属部门
export function getProBeDepList() {
  return request(`${uri1}/organization/getUserDeptNameList`);
}

// 新增事项类型
export function getmatterLebelAdd(params) {
  return request(`${uri}/customizeMatterLebel/add`,{
    method: 'POST',
    data: params,
  });
}

// 查询事项类型列表
export function getmatterLebel() {
  return request(`${uri}/customizeMatterLebel/list`);
}

// 日历列表
export function getCalendarDataList(params) {
  deletNUllProperty(params);
  return request(`${uri}/productBizRemind/list`, {
    method: 'POST',
    data: params,
  });
}

// 产品计划发布删
export function getProductDel(id) {
  return request(`${uri}/productPublishPlan/delete?id=${id}`,{
    method: 'POST',
  });
}

// 发行计划查询
export function getProductInfo(id) {
  return request(`${uri}/productPublishPlan/getInfo?id=${id}`);
}

// 审核／反审核
export async function getExamineAPI(params) {
  // return request(`${uri}/salesOrgMaintain/batchReviewSalesOrgInfo?${stringify(params)}`);
  return request(`${uri}/productPublishPlan/check`, {
    method: 'POST',
    data: params,
  });
}

// 获取备案联系人
export function getRecordUsersList(params) {
  return request(`/ams-base-parameter/employee/fuzzySelectInfoList`,{
    method: 'POST',
    data: params,
  });
}
