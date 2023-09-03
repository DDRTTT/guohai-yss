import request from '@/utils/request';
import { stringify } from 'qs';

const uri = '/yss-lifecycle-flow';

// 获取募集公告任务列表
export function getTaskList(params) {
  return request(`${uri}/investorConference/taskList`, {
    method: 'POST',
    data: params,
  });
}
// 产品名称/产品代码查询
export function getProductList() {
  return request(`${uri}/product/review/productEnum/search`);
}

// 词汇字典
export function getDicsByTypes(params) {
  return request(`/ams-base-parameter/datadict/queryInfoByList?${stringify(params)}`);
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
  return request(`${uri}/investorConference/commit/batch?ids=${params.ids}`, {
    method: 'POST',
  });
}
// 删除
export function deleteTableAPI(params) {
  return request(
    `/yss-lifecycle-flow/investorConference/delete/batch?ids=${params.ids}&processInstanceIds=${params.processInstanceIds}`,
    {
      method: 'POST',
      data: {},
    },
  );
}

// 撤销
export function revokeTableAPI(params) {
  return request(`/yss-lifecycle-flow/common/revoke?processInstId=${params.processInstanceId}`);
}

// 高级搜索-产品类型下拉列表
export function productTypeListAPI() {
  return request(`/yss-lifecycle-flow/common/allAssetType`);
}
