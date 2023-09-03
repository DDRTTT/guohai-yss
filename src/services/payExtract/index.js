import request from '@/utils/request';

const uri = '/yss-lifecycle-flow/singleInvestFundPayDraw';
// 单一投资者资金缴付提取  流程列表查询接口
export async function getTaskList(params) {
  return request(`${uri}/tasklist/search`, {
    method: 'POST',
    data: {
      ...params,
    },
    // headers: {
    //   userId: '81',
    // },
  });
}

// 词汇字典
export function getDictsAPI(codeList) {
  return request(`/ams-base-parameter/datadict/queryInfoByList?codeList=${codeList.toString()}`);
}

// 【下拉】已生效的客户（也是委托人） common/customer/option
export function getClient(codeList) {
  return request(`/yss-lifecycle-flow/common/customer/option`);
}

// 产品下拉框
export function productEnum() {
  return request(`/yss-lifecycle-flow/product/review/productNameList/search?proType=A002_1,A002_4`);
}

// 撤销
export function revoke(params) {
  return request(`/yss-lifecycle-flow/common/revoke?processInstId=${params.processInstanceId}`);
}

// 删除
export function deleteTask(id) {
  return request(`/yss-lifecycle-flow/singleInvestFundPayDraw/delete?id=${id}`);
}

// 批量提交
export const getBatchCommitApi = params =>
  request(`${uri}/batchCommit`, {
    method: 'POST',
    data: params,
  });
