import request from '@/utils/request';
import { stringify } from 'qs';

const uri = '/yss-lifecycle-flow';

// 获取募集公告任务列表
export function getTaskListAPI(params) {
  return request(`${uri}/raiseAnnounce/taskList`, {
    method: 'POST',
    data: params,
  });
}

// 根据多个code批量查询字典
export const getDicsByTypes = async (queryDictList = []) => {
  return request(
    `/ams-base-parameter/datadict/queryInfoByList?codeList=${queryDictList.join(',')}`,
    {
      DontAuthToken: true,
    },
  );
};

// 请求（产品类型-已废除）/托管人/状态 下拉列表项
export function getDictsAPI(codeList) {
  return request(`/ams-base-parameter/datadict/queryInfoByList?codeList=${codeList.toString()}`);
}

// 请求产品类型下拉列表
export function getProTypeAPI() {
  return request(`/yss-lifecycle-flow/common/allAssetType`);
}
// 投资经理下拉框
export function getInvestManagerNameListAPI(params) {
  // return request(`/yss-lifecycle-flow/stakeholderInfo/queryInvestmentManager`);
  // return request(`/ams-base-parameter/employee/getDropDownList?roleCode=E002_1`);
  return request(`/ams-base-parameter/employee/investmentManagerPullDown?roleCode=E002_1`);
}
// 产品下拉框
export function productEnum(params) {
  // return request(`/yss-lifecycle-flow/product/review/productEnum/search?${stringify(params)}`);
  return request(`/yss-lifecycle-flow/product/review/productEnum/search`);
}
// 批量提交
export function commitBatchAPI(params) {
  console.log(params);
  return request(`${uri}/raiseAnnounce/commit/batch?ids=${params.ids}`, {
    method: 'POST',
  });
}
// 删除
export function deleteTableAPI(params) {
  return request(`/yss-lifecycle-flow/raiseAnnounce/delete/batch?ids=${params.ids}&processInstanceIds=${params.processInstanceIds}`, {
    method: 'POST',
    data: {},
  });
}

// 撤销
export function revokeTableAPI(params) {
  return request(`/yss-lifecycle-flow/common/revoke?processInstId=${params.processInstanceId}`);
}
