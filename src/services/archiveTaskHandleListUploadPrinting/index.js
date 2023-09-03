import request from '@/utils/request';
import { stringify } from 'qs';

const uri = '/yss-awp-server';

// 获取待归档文档API - 项目/任务
export function getUnUseSealFileApi(params) {
  return request(`${uri}/task/fileUpdate/archiveHandle`, {
    method: 'POST',
    data: params,
  });
}

// 获取待归档文档API - 更新
export function getUpdatedFileApi(params) {
  return request(`${uri}/task/fileUpdate/updateHandle`, {
    method: 'POST',
    data: params,
  });
}

// 归档文件提交API - 项目/任务
export function launchArchiveApi(params) {
  return request(`${uri}/awp/task/process/launch/archive`, {
    method: 'POST',
    data: params,
  });
}

// 根据项目和任务查询文档的名称下拉
export function getFileNamesApi(params) {
  return request(`${uri}/awp/common/getFileNames?${stringify(params)}`);
}

// 获取操作人下拉API
export function getUsersByProAndTaskApi(params) {
  return request(`${uri}/awp/common/getUsersByProAndTask?${stringify(params)}`);
}

// 上传文档
export function uploadUseSealFileApi(params) {
  return request(`/ams${uri}/task/fileUpdate/uploadUseSealFile?${stringify(params.query)}`, {
    method: 'POST',
    data: params.formData,
  });
}
// 更新 上传文档
export function uploadUpdateFileApi(params) {
  return request(`/ams${uri}/task/fileUpdate/uploadUpdateFile?${stringify(params.query)}`, {
    method: 'POST',
    data: params.formData,
  });
}

// 删除文件关联关系
export const getUploadFileRevokeApi = params =>
  request(`${uri}/awp/task/process/uploadFileRevoke`, {
    method: 'POST',
    data: params,
  });

// 撤销已提交文件
export function getFileRevokeApi(params) {
  return request(`${uri}/awp/task/process/fileRevoke?${stringify(params)}`, {
    method: 'POST',
  });
}

// 获取审批意见
export function getReviewApi(params) {
  return request(`${uri}/awp/task/process/getOpinion?${stringify(params)}`);
}

/**
 * 大文件上传前文件重复检测
 * 注:批量上传和单个上传检测接口不同，方法使用一个
 * bool值true:单个上传 false:批量上传
 * **/
export const getUploadBeforeCheckedApi = ({ urlParams, fileName }) => {
  const bool = 'fileId' in urlParams;
  const apiUrl = bool
    ? `task/fileUpdate/uploadUpdateFilePreInspect`
    : 'task/fileUpdate/uploadUseSealFilePreInspect';
  const data = bool ? fileName[0] : fileName;

  return request(`${uri}/${apiUrl}?${stringify(urlParams)}`, {
    method: 'POST',
    data,
  });
};

/**
 * 大文件上传后信息登记
 * 注:批量上传和单个上传信息登记接口不同，方法使用一个
 * 'fileId' in urlParams true单个上传;false批量上传
 * **/
export const getUploadAfterRegisterApi = ({ urlParams, bodyParams }) => {
  const apiUrl =
    'fileId' in urlParams
      ? `task/fileUpdate/uploadUpdateFileRegister`
      : `task/fileUpdate/uploadUseSealFileRegister`;

  return request(`${uri}/${apiUrl}?${stringify(urlParams)}`, {
    method: 'POST',
    data: bodyParams,
  });
};
