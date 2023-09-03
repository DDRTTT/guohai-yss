import request from '@/utils/request';
import { stringify } from 'qs';

const uri = '/yss-awp-server';

// 获取表格数据API
export const getTableApi = params =>
  request(`${uri}/contractCheck/taskList`, {
    method: 'POST',
    data: params,
  });
// 查询项目信息列表API
export const getProjectInfoListApi = params =>
  request(`${uri}/product/getProductPageChecked`, {
    method: 'POST',
    data: params,
  });

// 获取项目或者系列编码
export function getProcodeInfoAPI(params) {
  return request(`/yss-awp-server/awp/common/projects?type=${params.type}`, {
    method: 'GET',
  });
}

// 通过fcode获取字典项API
export const getDicsByFcodeApi = params =>
  request(`/ams-base-parameter/datadict/queryInfo?${stringify(params)}`);
// 获取项目基本信息API
export const getProjectBaseInfoApi = params =>
  request(`${uri}/product/getQueryParamList?${stringify(params)}`);
// 目录报送
export const submitWpDictDeliverApi = params =>
  request(`${uri}/remote/wpDictDeliver?${stringify(params)}`);
// 人员报送
export const submitWpItemUpdateApi = params =>
  request(`${uri}/remote/wpItemUpdate?${stringify(params)}`);
// 文件报送
export const submitFileApi = params => request(`${uri}/remote/wpFileUpload?${stringify(params)}`);
// 底稿范围外项目报送
export const submitWpDictDeliverOosApi = params => {
  return request(`${uri}/remote/wpDictDeliverOos?${stringify(params)}`);
};
// 底稿范围外文件报送
export const submitWpFileUploadWithoutDictApi = params => {
  return request(`${uri}/remote/wpFileUploadWithoutDict?${stringify(params)}&fileCode`);
};

// 目录报送预览
export const getWpDictDeliverPreviewApi = params => {
  return request(`${uri}/remote/wpDictDeliverPreview?${stringify(params)}`);
};

// 文件报送预览
export const getWpFileUploadPreviewApi = params => {
  return request(`${uri}/remote/wpFileUploadPreview?${stringify(params)}`);
};

// 底稿范围外项目报送预览
export const getWpDictDeliverOosPreviewApi = params => {
  return request(`${uri}/remote/wpDictDeliverOosPreview?${stringify(params)}`);
};

// 底稿范围外文件报送预览
export const getWpFileUploadWithoutDictPreviewApi = params => {
  return request(`${uri}/remote/wpFileUploadWithoutDictPreview?${stringify(params)}&fileCode`);
};
