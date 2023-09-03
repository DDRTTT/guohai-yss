import request from '@/utils/request';
import { stringify } from 'qs';

const uri = '/yss-lifecycle-flow';
// const uri = '';

// 账户开户流程表格数据 查询
export function getTableData(params) {
  return request(`${uri}/baseAccount/query/taskListByTab`, {
    method: 'POST',
    data: params,
  });
}

// 账户开户流程提交
export function accountCommit(params) {
  return request(`${uri}/baseAccount/edit/commit`, {
    method: 'POST',
    data: params,
  });
}

// 产品名称/产品代码查询
export function getProductList() {
  return request(`${uri}/product/review/productEnum/search`);
}

// 词汇字典
export function getDictList(params) {
  return request(`/ams-base-parameter/datadict/queryInfoByList?${stringify(params)}`);
}

// 撤销
export async function getRevokeAPI(processInstanceId) {
  return request(`/yss-lifecycle-flow/common/revoke?processInstId=${processInstanceId.toString()}`);
}

// 删除
export function deleteTask(params) {
  return request(`/yss-lifecycle-flow/baseAccount/delete`, {
    method: 'POST',
    data: params,
  });
}

// 批量提交
export const getCommitBatchApi = params =>
  request(`${uri}/baseAccount/edit/commitBatch`, {
    method: 'POST',
    data: params,
  });

// 任务节点下拉框
export async function getNodeListAPI() {
  return request(`/api/yss-base-billows/bpmn/bpmn-userNode/ib30ea93a2164a05995347e3e24be4b0`);
}

