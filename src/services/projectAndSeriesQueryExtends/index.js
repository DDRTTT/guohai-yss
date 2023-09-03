import request from '@/utils/request';
import { stringify } from 'qs';

const uri = '/yss-awp-server';

// 左侧目录树API
export const getSysTreeApi = params => request(`${uri}/path/getSysTree?${stringify(params)}`);

// 获取已归档文件列表
export const getFileListApi = params =>
  request(`${uri}/productFile/querySeriesArchivedFile`, {
    method: 'POST',
    data: params,
  });

// 全部继承、添加继承
export const batchExtendArchivedFileApi = params =>
  request(`${uri}/productFile/batchExtendArchivedFile`, {
    method: 'POST',
    data: params,
  });

// 全部移除、移除继承
export const batchDelProExtendArchivedFileApi = params =>
  request(`${uri}/productFile/batchDelProExtendArchivedFile`, {
    method: 'POST',
    data: params,
  });

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

// 获取下载错误excel
export const downloadError = params => 
  request(`${uri}/productFile/downloadPost`,{
    data:params,
    method:'POST',
    responseType:'blob',
  });

  
