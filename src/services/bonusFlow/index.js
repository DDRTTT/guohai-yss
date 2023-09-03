import request from '@/utils/request';

const uri = '/yss-lifecycle-flow';

// 分红流程表格数据 查询
export function handleGetTableData(params) {
  return request(`${uri}/dividendProcess/taskList`, {
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
//后来加了定向的产品类型
export function productTypeAPI() {
  return request(`${uri}/common/allAssetType`);
}
// 产品名称/产品代码查询
export function getProductList() {
  return request(`${uri}/product/review/productEnum/search`);
}
//撤销
export async function getRevokeAPI(id) {
  return request(`${uri}/common/revoke?processInstId=${id.toString()}`);
}

//删除
export async function deleteInfoAPI(params) {
  return request(`${uri}/dividendProcess/deleteDividendPlans`, {
    method: 'POST',
    data: { id: params },
  });
}
//批量提交
export async function batchSubm(params) {
  return request(`${uri}/dividendProcess/batchCommitDividendPlans`, {
    method: 'POST',
    data: params,
  });
}
