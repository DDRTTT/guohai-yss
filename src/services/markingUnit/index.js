import request from '@/utils/request';

const url = '/yss-lifecycle-flow';
const urlPar = '/ams-base-parameter';

// 数据字典
export function getDictsAPI(codeList) {
  return request(`/ams-base-parameter/datadict/queryInfoByList?codeList=${codeList.toString()}`);
}

// 机构下拉字典
export async function getOrgDictsAPI(orgType) {
  return request(`${urlPar}/organization/getOrgNameList?orgType=${orgType.toString()}`);
}

// 分页任务列表
export async function getListAPI(params) {
  return request(`${url}/marketingUnitMaintain/fuzzy/getTaskList`, {
    method: 'POST',
    data: params,
  });
}

// 删除
export async function getDeleteAPI(params) {
  return request(`${url}/marketingUnitMaintain/batchDeleteByIds`, {
    method: 'POST',
    data: params,
  });
}

// 撤销
export async function getRevokeAPI(processInstanceId) {
  return request(`${url}/common/revoke?processInstId=${processInstanceId.toString()}`);
}
