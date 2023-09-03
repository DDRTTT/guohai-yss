import request from '@/utils/request';
import { stringify } from 'qs';

interface listParams {
  currentPage: number; // 当前页码
  pageSize: number; // 每页条数
  like: string; // 模糊查询字符串
  deptId: number; // 模糊查询字符串
  sysId: number; // 模糊查询字符串
}

// const uri = '/yss-base-admin/rolecom';

// 列表
export async function fetchListAPIAPI(listParams: listParams) {
  return request<Record<any, any>>(
    `/yss-base-admin/positionInfo/getPositionFlowInfos?${stringify(listParams)}`,
  );
}

// 流程节点列
export async function fetchProcessNodeListAPI(params: { id: string }) {
  return request(`/yss-base-admin/user/ResetPwd/${params.id}`);
}

// 词汇字典
export async function handleGetDictsAPI(codeList: Array<any>) {
  return request(`/ams-base-parameter/datadict/queryInfoByList?codeList=${codeList.toString()}`);
}

// 提醒策略列表
export async function queryRemindDataAPI(params: any) {
  return request(`/yss-base-calendar-lxp/issue-setting/page?${stringify(params.query)}`, {
    method: 'POST',
    body: params.body
  })
}

// 获取事项类型树
export async function queryMatterTreeAPI() {
  return request(`/yss-base-calendar-lxp/calendar-classify/classify-tree`)
}

// 根据parentId获取子级事项
export async function getMatterByParentIdAPI(params: any) {
  return request.get(`/yss-base-calendar-lxp/calendar-classify/query-with-pid?${stringify(params)}`)
}

