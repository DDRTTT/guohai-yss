import request from '@/utils/request';
import { stringify } from 'qs';

const uri = '/yss-lifecycle-flow';

// 账户开户流程表格数据 查询
export function handleGetTableData(params) {
  return request(`${uri}/contractCheck/taskList`, {
    method: 'POST',
    data: params,
  });
}

// 根据多个code批量查询字典
export const getDicsByTypes = async (queryDictList = []) => {
  return request(
    `/ams-base-parameter/datadict/queryInfoByList?codeList=${queryDictList.join(',')}`,
  );
};
// 获取托管人
export function getTrustee(params) {
  return request(`/ams-base-parameter/organization/getOrgNameList?orgType=${params.orgType}`);
}
// 获取产品列表
export function getProductType() {
  return request(`${uri}/common/allAssetType`);
}

// 产品下拉框
export function productEnum() {
  return request(`/yss-lifecycle-flow/product/review/productEnum/search`);
}

// 撤销
export function revoke(params) {
  return request(`/yss-lifecycle-flow/common/revoke?processInstId=${params.processInstanceId}`);
}

// 删除
export function deleteTask(params) {
  return request(
    `/yss-lifecycle-flow/contractCheck/delete/batch?ids=${params.ids}&processInstanceIds=${params.processInstanceIds}`,
    { method: 'POST' },
  );
}

// 批量提交
export function commitBatchAPI(params) {
  return request(`${uri}/contractCheck/commit/batch?ids=${params.ids}`, {
    method: 'POST',
  });
}
