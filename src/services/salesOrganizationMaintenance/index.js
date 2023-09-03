import request from '@/utils/request';
import { deletNUllProperty } from '@/utils/utils';

const uri = '/yss-lifecycle-flow';
// 查询维护销售协议流程的表格数据
export function queryTableList(params) {
  deletNUllProperty(params);
  return request.post(`${uri}/salesOrgContract/fuzzySelectTaskList`, {
    data: params,
  });
}
// 获取销售机构下拉列表
export function getSalesOrgList() {
  return request.get(`${uri}/salesOrgMaintain/getSalesOrgList`);
}
//删除待提交
export function batchDelete(ids) {
  return request.get(`${uri}/salesOrgContract/batchDelete`, {
    params: {
      ids: [ids],
    },
  });
}
//批量提交
export function batchCommit(ids) {
  return request.get(`${uri}/salesOrgContract/batchCommit?ids=${ids}`);
}
