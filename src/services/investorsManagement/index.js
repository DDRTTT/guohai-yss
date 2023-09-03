import { stringify } from 'qs';
import request from '@/utils/request';

const uri = '/yss-lifecycle-flow';

// 数据字典
export function getQueryCriteriaAPI(codeList) {
  return request(`/ams-base-parameter/datadict/queryInfoByList?codeList=${codeList.toString()}`);
}

// 数据字典
export function getDictsAPI(codeList) {
  return request(`/ams-base-parameter/datadict/queryInfoByList?codeList=${codeList.toString()}`);
}

// 列表
export async function getData(parameter) {
  return request(`${uri}/productManagement/customer/list`, {
    method: 'POST',
    data: parameter,
  });
}

// 获取文件类型下拉列表
export function getFileTypeDictsAPI() {
  return request(`/ams-base-parameter/fileType/queryFileTypeByDocType?docTypeCode=customerInfo`);
}

// 机构下拉字典
export async function getOrgDictsAPI(orgType) {
  return request(`/ams-base-parameter/organization/getOrgNameList?orgType=${orgType.toString()}`);
}

// 客户文档信息列表
export async function getCustomDocumentListAPI(params) {
  return request(`/ams-file-service/businessArchive/selectElectronicFile`, {
    method: 'POST',
    data: params,
  });
}

// 交易确认信息列表
export async function getTradeConfirmListAPI(params) {
  return request(`/yss-lifecycle-flow/singleInvestFundPayDraw/tradeConfirmList/search`, {
    method: 'POST',
    data: params,
  });
}

// 获取投资产品信息列表
export async function getInvestProductListAPI(params) {
  return request(`/yss-lifecycle-flow/investorExamine/getSelectProByInvestId`, {
    method: 'POST',
    data: params,
  });
}

// 获取审查信息
export async function getInvesReviewResultAPI(params) {
  return request(
    `/yss-lifecycle-flow/investorExamine/getExamineByInvestId?investorId=${params.investorId}`,
  );
}

// 审核/反审核
export async function handleCheckedAPI(parameter) {
  return request(
    `${uri}/productManagement/customer/audit?ids=${parameter.ids}&checked=${parameter.checked}`,
    {
      method: 'POST',
    },
  );
}

// 删除
export async function handleDeleteAPI(params) {
  return request(`${uri}/productManagement/customer/delete?ids=${params.ids}`, {
    method: 'POST',
  });
}

// 【新增】客户信息
export async function handleAddAPI(parameter) {
  return request(`${uri}/productManagement/customer/save`, {
    method: 'POST',
    data: parameter,
  });
}

// 客户信息反显详情
export async function handleDetailAPI(params) {
  return request(`${uri}/productManagement/customer/getInfo?id=${params.id}`);
}

// 补录：提交
export async function handleAdditionalRecordAPI(parameter) {
  return request(`${uri}/productManagement/customer/additionalRecord`, {
    method: 'POST',
    data: parameter,
  });
}

// 补录：详情
export async function handleGetAdditionalRecordAPI(params) {
  return request(`${uri}/productManagement/customer/getAdditionalRecord?id=${params.id}`);
}

// 获取有联动关系的数据字典
export async function getQueryByLinkageAPI(params) {
  return request(`/ams-base-parameter/datadict/queryByLinkage?${stringify(params)}`);
}
