import request from '@/utils/request';
import { stringify } from 'qs';
import { download } from '@/utils/download';

const uri = '/yss-awp-server';

// 下载
export const getFileDownLoadApi = fileNumber =>
  download(`/ams/yss-awp-server/path/downloadFile`, {
    method: 'POST',
    body: fileNumber,
  });
// 根据产品名称下拉筛选API(或获取文件列表支持排序)
export const getFileListAbleSortApi = params =>
  request(`${uri}/productFile/getFileDetailList`, {
    method: 'POST',
    data: params,
  });
// 常规任务提交
export const getConventionalApi = params =>
  request(`${uri}/awp/task/process/launch/conventional`, {
    method: 'POST',
    data: params,
  });
// 归档流程提交
export const getAutomaticApi = params =>
  request(`${uri}/awp/task/process/launch/automatic`, {
    method: 'POST',
    data: params,
  });
// 删除文件关联关系
export const getUploadFileRevokeApi = params =>
  request(`${uri}/awp/task/process/uploadFileRevoke`, {
    method: 'POST',
    data: params,
  });
// 二级文档撤销操作
export const getFileRevokeApi = params =>
  request(`${uri}/awp/task/process/fileRevoke?${stringify(params)}`, {
    method: 'POST',
    data: {},
  });
// 大文件上传前文件重复检测
export const getFileCheckedApi = params =>
  request(`${uri}/awp/task/process/fileChecked`, {
    method: 'POST',
    data: params,
  });
// 大文件上传后信息登记
export const getFileRegisteredApi = params =>
  request(`${uri}/awp/task/process/fileRegistered`, {
    method: 'POST',
    data: params,
  });
// 目录树：删除
export const getTaskPathDeleteApi = params =>
  request(`${uri}/task/path/delete`, {
    method: 'POST',
    data: params,
  });
// 目录树：新增
export const getTaskPathAddApi = params =>
  request(`${uri}/task/path/add`, {
    method: 'POST',
    data: params,
  });
// 目录树：编辑
export const getTaskPathEditApi = params =>
  request(`${uri}/task/path/edit`, {
    method: 'POST',
    data: params,
  });
// 文件批量迁移到新的目录
export const getUpdateFilePathApi = params =>
  request(`${uri}/awp/updateFilePath`, {
    method: 'POST',
    data: params,
  });
// 获取流转历史所需的taskId
export const getCurrentNodeIdByProcessIdsApi = params =>
  request(`/api/yss-base-billows/history-task-query/getCurrentNodeIdByProcessIds`, {
    method: 'POST',
    data: params,
  });

// 是否用印，是否需要用印
export const updateNeedUseSealOrUseSealApi = params =>
  request(`${uri}/awp/updateNeedUseSealOrUseSeal`, {
    method: 'POST',
    data: params,
  });

// 左侧目录树API
export const getSysTreeApi = params => request(`${uri}/path/getSysTree?${stringify(params)}`);
// 获取审核意见
export const getReviewApi = params =>
  request(`${uri}/awp/task/process/getOpinion?${stringify(params)}`);
// 操作用户
export const getUsersByProAndTaskApi = params =>
  request(`${uri}/awp/common/getUsersByProAndTask?${stringify(params)}`);
// 目录树：不适用的数据
export const getNoPathTreeApi = params =>
  request(`${uri}/task/path/getNoPathTree?${stringify(params)}`);
// 目录树：判断当前父节点下是否有文件
export const getFileStateByPathApi = params =>
  request(`${uri}/task/path/getFileStateByPath?${stringify(params)}`);

export async function withStandardCatalogueApi(params) {
  return request(`${uri}/path/comparison/withStandardCatalogue`, {
    method: 'POST',
    data: params,
  });
}
