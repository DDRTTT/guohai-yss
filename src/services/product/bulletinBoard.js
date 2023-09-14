import request from '@/utils/request';
import { stringify } from 'qs';

const uri = '/yss-base-product';
const urlPar = '/ams-base-parameter';
const flowUrl = '/yss-lifecycle-flow';

// 产品管理-产品看板列表
export async function getListAPI(params) {
  return request(`${uri}/biProductElement/smartbi/query`, {
    method: 'POST',
    data: params,
  });
}

// 数据字典
export async function getDictsAPI(codeList) {
  return request(`${urlPar}/datadict/queryInfoByList?codeList=${codeList.toString()}`);
}

// 数据字典-组合大类级联
export async function getCombinationAPI(codeList) {
  return request(`${urlPar}/datadict/getListTree?fcode=${codeList.toString()}`);
}

// 运营行 营销行
export async function getOrgNameListAPI(params) {
  return request(`${urlPar}/organization/getOrgNameList??${stringify(params)}`);
}


// 催办接口
export async function updateUrgeAPI(params) {
  return request(`${uri}/product/commonUpdate?key=${params?.queryData}`, {
    method: 'POST',
    data: params?.data,
  });
}

// 获取时间轴
export async function getTimeAxisAPI(params) {
  return request(`${flowUrl}/productBoard/timeAxis?proCode=${params}`);
}

// 管理人下啦数据
export async function getListByParamAPI(payload) {
  return request(`${uri}/proInvestor/getListByParam`, {
    method: 'POST',
    data: payload,
  });
}

// 产品名称下啦数据
export async function getProductEnumAPI(payload) {
  return request(`${uri}/biProductElement/smartbi/query`, {
    method: 'POST',
    data: payload,
  })
}

// 阶段统计数据查询
export async function getSimpleQueryAPI(payload) {
  return request(`${uri}/biProduct/smartbi/simpleQuery`, {
    method: 'POST',
    data: payload,
  });
}
