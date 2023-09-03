import request from '@/utils/request';
import { stringify } from 'qs';

const uri = '/yss-lifecycle-flow';

export function getTableDataList(params) {
  return request(`${uri}/bondTradeDeviateReport/tasklist/search`, {
    method: 'POST',
    data: params,
  });
}

// 词汇字典
export function getDictList(params) {
  return request(`/ams-base-parameter/datadict/queryInfoByList?${stringify(params)}`);
}

// 撤销
export async function getRevokeAPI(params) {
  return request(`${uri}/common/revoke?processInstId=${params}`);
}

// 删除
export async function getDeleteAPI(params) {
  return request(`${uri}/bondTradeDeviateReport/delete?id=${params}`)
  // return request(`${uri}/bondTradeDeviateReport/delete`,{
  //   method: 'POST',
  //   data: params,
  // })
}

// 批量提交
export const getBatchSubmitByProCodeApi = params =>
  request(`${uri}/bondTradeDeviateReport/batchCommit`, {
    method: 'POST',
    data: params,
  });