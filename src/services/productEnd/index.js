import request from '@/utils/request';

const uri = '/yss-lifecycle-flow/product/termination';
const mockUri = '/mock/productTermination';
// 获取产品终止-列表
export async function getProductEndList(queryList) {
  return request(`${uri}/fuzzy/getTaskList`, {
    method: 'POST',
    data: {
      ...queryList,
    },
  });
}

// 获取产品终止-详情
export async function getProductEndDetail(queryList) {
  return request(`${uri}/queryDFromOPtions`, {
    method: 'POST',
    data: {
      queryList,
    },
  });
}
// 发起产品终止流程的产品数据信息回显
export async function getProductDetail(queryList) {
  return request(`${uri}/queryDFromOPtions`, {
    method: 'POST',
    data: {
      queryList,
    },
  });
}

// 修改产品岗经办人发起产品终止流程

// 产品岗审核人进行审核

// 词汇字典
export function getDictsAPI(codeList) {
  return request(`/ams-base-parameter/datadict/queryInfoByList?codeList=${codeList.toString()}`);
}

// 产品名称/产品代码查询
export function getProductList() {
  return request(`/yss-lifecycle-flow/product/review/productEnum/search`);
}

//撤销
export async function getRevokeAPI(id) {
  return request(`/yss-lifecycle-flow/common/revoke?processInstId=${id.toString()}`);
}

//删除
export async function deleteInfoAPI(params) {
  return request(`/yss-lifecycle-flow/product/termination/batchDeleteByIds`,{
    method: 'POST',
    data: params.split(","),
  });
}
//批量提交
export async function batchSubm(params) {
  return request(`/yss-lifecycle-flow/product/termination/batchSubmitByIds`,{
    method: 'POST',
    data:params
  });
}

//后来加了定向的产品类型
export function productTypeAPI() {
  return request(`/yss-lifecycle-flow/common/allAssetType`);
}
