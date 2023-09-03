import request from '@/utils/request';
import { stringify } from 'qs';

const uri = '/yss-lifecycle-flow';

// 销售机构管理任务列表 
export function getTableDataList(params) {
  return request(`${uri}/salesOrgMaintain/getInfoListByCondition`, {
    method: 'POST',
    data: params,
  });
}

// 词汇字典（销售商类型，中登结算地点）
export function getTypeList(params) {
  return request(`/ams-base-parameter/datadict/queryInfoByList?${stringify(params)}`);
}

// 词汇字典（销售商类型）
export function getListDicList(params) {
  return request(`/ams-base-parameter/datadict/queryInfoByList?${stringify(params)}`);
}

// 词汇字典（渠道类型）
export function getDicList(params) {
  return request(`/ams-base-parameter/datadict/queryInfo?${stringify(params)}`);
}

// 新增保存
export function salesAdd(params) {
  return request(`${uri}/salesOrgMaintain/addSalesOrgInfo`, {
    method: 'POST',
    data: params,
  });
}

// 修改保存
export function salesUpdte(params) {
  return request(`${uri}/salesOrgMaintain/updateSalesOrgInfo`, {
    method: 'POST',
    data: params,
  });
}

// 批量审核／反审核
export async function getExamineAPI(params) {
  // return request(`${uri}/salesOrgMaintain/batchReviewSalesOrgInfo?${stringify(params)}`);
  return request(`${uri}/salesOrgMaintain/batchReviewSalesOrgInfo?ids=${params.ids}&flag=${params.flag}`, {
    method: 'GET',
    data: {},
  });
}

// 删除
export async function getDeleteAPI(params) {
  return request(`${uri}/salesOrgMaintain/batchDelete?ids=${params.ids}`, {
    method: 'GET',
    data: {},
  });
}

// 销售产品信息列表
export function getProDetailsList(params) {
  return request(`${uri}/salesOrgMaintain/getSalesProductInfosById?${stringify(params)}`);
}

// 销售产品信息详情
export function getProDetails(params) {
  return request(`${uri}/salesOrgMaintain/detailsByProCode?id=${params.id}&proCode=${params.proCode}`);
}

// 协议信息
export function getProtocolInfo(params) {
  return request(`${uri}/salesOrgMaintain/getContractInfosById?${stringify(params)}`);
}

// 新增信息反显
export function getProInfo(id) {
  return request(`${uri}/salesOrgMaintain/getSalesOrgDetailsById?id=${id}`);
}

// 文件类型
export function getFileType(params) {
  return request(`/ams-base-parameter/fileType/query/file-type-list/map`, {
    method: 'POST',
    data: params,
  });
}

// 开户行
export function getBankInfo(params) {
  return request(`/ams-base-parameter/organization/getOrgNameList?${stringify(params)}`);
}


