import request from '@/utils/request';
import { stringify } from 'qs';
import { download } from '@/utils/download';

const uri = '/yss-awp-server';

// 获取表格数据API
export const getTableListApi = params =>
  request(`${uri}/awp/task/handleInfoPage`, {
    method: 'POST',
    data: params,
  });

// 下载
export const getFileDownLoadApi = fileNumber =>
  download(`/ams/yss-awp-server/path/downloadFile`, {
    method: 'POST',
    body: fileNumber,
  });

// 审核通过
export const getProcessAuditApi = params =>
  request(`${uri}/awp/task/process/audit`, {
    method: 'POST',
    data: params,
  });

// 审核拒绝
export const getAuditNoPassedApi = params =>
  request(`${uri}/awp/task/process/audit/notPassed`, {
    method: 'POST',
    data: params,
  });

// 二级文档撤销操作
export const getFileRevokeApi = params =>
  request(`${uri}/awp/task/process/fileRevoke?${stringify(params)}`, {
    method: 'POST',
    data: {},
  });

// 获取审核意见
export const getReviewApi = params =>
  request(`${uri}/awp/task/process/getOpinion?${stringify(params)}`);

// 文档名称
export const getHandleInfoFileNamesApi = params =>
  request(`${uri}/awp/common/getHandleInfoFileNames?${stringify(params)}`);

// 待审核文档 催办
export const getSendReminderApi = params =>
  request(`${uri}/productFile/sendReminder`, {
    method: 'POST',
    data: params,
  });
