import request from '@/utils/request';
import { stringify } from 'qs';
import { download } from '@/utils/download';

const uri = '/yss-awp-server';

// 获取表格数据API
export const getTableListApi = params =>
  request(`${uri}/awp/task/list`, {
    method: 'POST',
    data: params,
  });

//列表任务提交
export const getCommitByIdApi = params =>
  request(`${uri}/awp/task/commitById?id=${params.id}`, {
    method: 'POST',
    data: {},
  });

//列表任务删除
export const getDeleteApi = params =>
  request(`${uri}/awp/task/delete/batch?ids=${params.ids}`, {
    method: 'POST',
    data: {},
  });

// 下载
export const getFileDownLoadApi = fileNumber =>
  download(`/ams/yss-awp-server/path/downloadFile`, {
    method: 'POST',
    body: fileNumber,
  });

// 办理中结束任务
export const getConventionalEndApi = params => {
  return request(`${uri}/awp/task/conventionalEnd?id=${params.id}`, {
    method: 'POST',
  });
};

// 一级任务撤销
export const getTaskRevokeApi = params => {
  return request(`${uri}/awp/task/taskRevoke?ids=${params.ids}`, {
    method: 'POST',
    data: {},
  });
};

//项目编码
export const getProCodeApi = params => request(`${uri}/awp/common/projects?${stringify(params)}`);

// 通过fcode获取字典项API
export const getDicsByFcodeApi = params =>
  request(`/ams-base-parameter/datadict/queryInfo?${stringify(params)}`);

// 任务名称
export const getTaskNameApi = params =>
  request(`${uri}/awp/common/getTaskName?${stringify(params)}`);

// 获取审核意见
export const getReviewApi = params =>
  request(`${uri}/awp/task/process/getOpinion?${stringify(params)}`);

// 获取任务完成的文件数量(数量大于0可以完成任务)
export const getFileSizeApi = params => request(`${uri}/awp/task/getFileSize?${stringify(params)}`);

// 删除的历史记录
export const getDeleteRecordApi = data => {
  return request(`${uri}/awp/task/process/deleteDocumentRecord`, {
    method: 'POST',
    data,
  });
};

export async function getCheckedUseSealFileApi(params) {
  return request(`${uri}/awp/task/checkedUseSealFile?${stringify(params)}`);
}

export async function getFileDeleteBatchRevokeApi(params) {
  return request(`${uri}/awp/task/process/fileDelete/batchRevoke`, {
    method: 'POST',
    data: params,
  });
}
