import request from '@/utils/request';

const uri = '/yss-lifecycle-flow/product/review';

export function submitForm(formData) {
  return request(`${uri}/seriesOrProduct/commit`, {
    method: 'POST',
    data: {
      ...formData,
    },
  });
}
// 任务列表表格数据
export function queryTableList(params) {
  return request(`${uri}/fuzzy/task/list`, {
    method: 'POST',
    data: params,
  });
}

// 数据字典查询
export function getDict(codeList) {
  return request(`/ams-base-parameter/datadict/queryInfoByList?codeList=${codeList.toString()}`);
}

// 资产类型下拉框
export function getProductType() {
  return request(`/yss-lifecycle-flow/common/allAssetType`);
}

// 产品下拉框
export function productEnum() {
  return request(`/yss-lifecycle-flow/product/review/proSeries/search`);
}
// 投资经理
export function getInvestmentManagerDropList() {
  return request(`/ams-base-parameter/employee/investmentManagerPullDown?roleCode=E002_1`);
}

// 撤销
export function revoke(params) {
  return request(`/yss-lifecycle-flow/common/revoke?processInstId=${params.processInstanceId}`);
}

// 删除
export function deleteTask(ids) {
  return request(`/yss-lifecycle-flow/product/review/batchDeleteByIds`, {
    method: 'POST',
    data: ids,
  });
}

// 批量提交
export const getBatchSubmitByProCodeApi = params =>
  request(`${uri}/batchSubmitByProCode`, {
    method: 'POST',
    data: params,
  });
