/**
 *Create on 2020/9/22.
 */

import request from '@/utils/request';
import * as type from '@/services/type';
import { stringify } from 'qs';

interface tasksParams {
  userId: string; // 用户Id
  limit: number; // 每页条数
  page: number; // 页码
}

interface toDoParams {
  limit: number; // 每页条数
  page: number; // 页码
  templateIds: string[]; // 流程id
  emergencyState: number; // 流程id
}

interface screenParams {
  processDefinitionId: number;
  processInstanceId: number;
  taskDefinitionKey: number;
  taskId: number;
}

// 我待办的任务:根据用户Id获取任务(分页)  获取用户待办的任务
export async function getTodoTasksAPI(params: toDoParams): Promise<any> {
  // return request('/api/yss-base-billows/task-query/page/user-id', {
  return request('/yss-lifecycle-flow/common/todo-task/list', {
    method: 'POST',
    data: params,
  });
}

// 我参与的任务：获取指定用户的已经办流程的任务(分页)
export async function getParticipateTasksAPI(params: tasksParams): Promise<any> {
  return request('/api/yss-base-billows/task-query/page/handle', {
    method: 'POST',
    data: params,
  });
}

// 我发起的任务：获取指定发起人或发起组的任务(分页)
export async function getInitiatedTasksAPI(params: tasksParams): Promise<any> {
  return request('/api/yss-base-billows/task-query/page/initiate', {
    method: 'POST',
    data: params,
  });
}

// 获取非底稿任务流程
export async function getProductCenterFlowIdAPI(): Promise<any> {
  return request('/yss-lifecycle-flow/process-module/query/all-process-key');
}

// 对办理和未提交进行筛选API
export async function getLinkRouterAPI(params: screenParams): Promise<any> {
  return request('/yss-lifecycle-flow/common/checkTypeForRouter', {
    method: 'POST',
    data: params,
  });
}

// 已办理的任务
export async function getHandledTasksAPI(params: any) {
  // return request(`/yss-lifecycle-flow/task-query/task-list-page?pageNum=${params.pageNum}&pageSize=${params.pageSize}&taskType=${params.taskType}`);
  return request(
    `/yss-lifecycle-flow/common/home-page/task-list?pageNum=${params.pageNum}&pageSize=${params.pageSize}&taskType=T001_5`,
  );
}

// 传阅的任务
export async function getTransmitTasksAPI(params: any) {
  // return request(`/yss-lifecycle-flow/task-query/task-list-page?pageNum=${params.pageNum}&pageSize=${params.pageSize}&taskType=${params.taskType}`);
  return request(
    `/yss-lifecycle-flow/common/home-page/task-list?pageNum=${params.pageNum}&pageSize=${params.pageSize}&taskType=T001_6`,
  );
}

// 词汇字典
export async function DATA_DICTIONARY_API(params: { codeList: string }) {
  return request(`${type.DATA_DICTIONARY_API}?${stringify(params)}`);
}

// 根据用户的sysId查询对应系统的映射信息
export async function GET_SYS_USER_INFO_API(params: { sysId: string }) {
  return request(`${type.GET_SYS_USER_INFO_API}?${stringify(params)}`);
}

// 获取用户拥有的系统
export async function GET_USER_SYSID_API() {
  return request(`${type.GET_USER_SYSID_API}`);
}
