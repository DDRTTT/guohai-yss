import request from '@/utils/request';
import { stringify } from 'qs';

const uri = '/yss-awp-server';

// 左侧目录树API
export const getSysTreeApi = params => request(`${uri}/path/getSysTree?${stringify(params)}`);

// 获取版本历史记录
export const getFileHistoryApi = params =>
  request(`${uri}/awp/getFileHistory?${stringify(params)}`);

// 获取流转历史所需的taskId
export const getCurrentNodeIdByProcessIdsApi = params =>
  request(`/api/yss-base-billows/history-task-query/getCurrentNodeIdByProcessIds`, {
    method: 'POST',
    data: params,
  });

// 根据流程实例Id获取任务
export const getTaskQueryProcessIdApi = params =>
  request(`/api/yss-base-billows/task-query/process-id`, {
    method: 'POST',
    data: params,
  });

// 获取已归档文件列表
export const getFileListApi = params =>
  request(`${uri}/awp/task/process/warehousing/fileList`, {
    method: 'POST',
    data: params,
  });

// 获取已归档文件提交
export const getFileCommitApi = params =>
  request(`${uri}/awp/task/process/warehousing/commit`, {
    method: 'POST',
    data: params,
  });

// 审核
export const getFileHandleApi = params =>
  request(`${uri}/awp/task/process/warehousing/handle`, {
    method: 'POST',
    data: params,
  });

// 档案盒号实时录入
export const getRealTimeSaveApi = params =>
  request(`${uri}/awp/task/process/warehousing/realTimeSave`, {
    method: 'POST',
    data: params,
  });

// 归档入库撤销
export const getBatchRevokeApi = params =>
  request(`${uri}/awp/task/process/warehousing/batchRevoke`, {
    method: 'POST',
    data: params,
  });
