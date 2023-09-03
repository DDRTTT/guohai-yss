import request from '@/utils/request';
import { stringify } from 'qs';

const uri = '/yss-lifecycle-flow';

// 信披流程表格数据 查询
// export function handleGetTableData(params) {
//   return request(`${uri}/publishInfo/fuzzySelectTaskList`, {
//     method: 'POST',
//     data: params,
//   });
// }
export function handleGetTableData(params) {
  return request(`${uri}/publishInfoBatch/fuzzySelectTaskList`, {
    method: 'POST',
    data: params,
  });
}
// 产品名称/产品代码查询
export function getProductList() {
  return request(`${uri}/product/review/productEnum/search`);
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

// 投资经理
export function getInvestmentManagerDropList() {
  // return request(`/ams-base-parameter/employee/getDropDownList?roleCode=E002_1`);
  return request(`/ams-base-parameter/employee/investmentManagerPullDown?roleCode=E002_1`);
}

// 产品下拉框
export function productEnum(params) {
  // return request(`/yss-lifecycle-flow/product/review/productEnum/search?${stringify(params)}`);
  return request(`/yss-lifecycle-flow/product/review/productEnum/search`);
}

// 批量提交
// export function commitBatchAPI(params) {
//   console.log(params);
//   return request(`${uri}/publishInfo/batchCommit?ids=${params.ids}`);
// }
export function commitBatchAPI(params) {
  console.log(params);
  return request(`${uri}/publishInfoBatch/batchCommit?ids=${params.ids}`);
}

// 删除
// export function deleteTableAPI(params) {
//   return request(`/yss-lifecycle-flow/publishInfo/batchDelete?ids=${params.ids}`, {
//   });
// }
export function deleteTableAPI(params) {
  return request(`/yss-lifecycle-flow/publishInfoBatch/batchDelete?ids=${params.ids}`, {
  });
}

// 撤销
export function revokeTableAPI(params) {
  return request(`/yss-lifecycle-flow/common/revoke?processInstId=${params.processInstanceId}`);
}

// 高级搜索-产品类型下拉列表
export function productTypeListAPI() {
  return request(`/yss-lifecycle-flow/common/allAssetType`);
}
