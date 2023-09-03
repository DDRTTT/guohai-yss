import request from '@/utils/request';
import { stringify } from 'qs';

const uri = '/yss-awp-server';

// 获取版本历史记录
export const getFileHistoryApi = params =>
  request(`${uri}/awp/getFileHistory?${stringify(params)}`);

export const getUpdatePathApi = params => {
  return request(`${uri}/task/fileUpdate/updatePath`, {
    method: 'POST',
    data: params,
  });
};

export const getCheckFilePathMoveApi = params => {
  return request(`${uri}/task/fileUpdate/checkFilePathMove`, {
    method: 'POST',
    data: params,
  });
};

// 删除待提交的文件
export const getFileUpdateApi = params =>
  request(`${uri}/task/fileUpdate/updateDelete`, {
    method: 'POST',
    data: params,
  });
// 提交
export const getUpdateCommitApi = params =>
  request(`${uri}/task/fileUpdate/updateCommit`, {
    method: 'POST',
    data: params,
  });

// 文件名称下拉树API
export const getFileNameListApi = params =>
  request(`${uri}/productFile/docManagementFileNameList`, {
    method: 'POST',
    data: params,
  });

// 根据产品名称下拉筛选API(或获取文件列表支持排序)
export const getFileListAbleSortApi = params =>
  request(`${uri}/productFile/docManagementFileList`, {
    method: 'POST',
    data: params,
  });

// 所属任务
export const getTaskNameListApi = params => {
  return request(`${uri}/productFile/getTaskNameList`, {
    method: 'POST',
    data: params,
  });
};

// 风控岗删已审核、待归档、已归档文件
export async function getFileDeleteApi(params) {
  return request(`${uri}/awp/task/process/fileDelete/commit`, {
    method: 'POST',
    data: params
  })
}

// 文件批量更新提示校验
export async function getFileTipsApi(params) {
  return request(`${uri}/task/fileUpdate/fileBatchUpdateTips`, {
    method: 'POST',
    data: params
  })
}
