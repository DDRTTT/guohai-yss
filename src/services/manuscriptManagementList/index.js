import request from '@/utils/request';
import { stringify } from 'qs';
import { download } from '@/utils/download';

const uri = '/yss-awp-server';

// 根据产品名称下拉筛选API(或获取文件列表支持排序)
export const getFileListAbleSortApi = params =>
  request(`${uri}/productFile/getFileDetailList`, {
    method: 'POST',
    data: params,
  });
// 文件名称下拉树API
export const getFileNameListApi = params =>
  request(`${uri}/productFile/getFileNameList`, {
    method: 'POST',
    data: params,
  });
// 下载
export const getFileDownLoadApi = fileNumber =>
  download(`/ams/yss-awp-server/path/downloadFile`, {
    method: 'POST',
    body: fileNumber,
  });

// 获取项目基础信息详情API
export const getProjectBaseInfoDetailApi = params =>
  request(`${uri}/product/getDetail?${stringify(params)}`);
// 获取项目类型字典项API
export const getDicsByFcodeApi = params =>
  request(`/ams-base-parameter/datadict/queryInfo?${stringify(params)}`);
// 左侧目录树API
export const getSysTreeApi = params => request(`${uri}/path/getAllSysTree?${stringify(params)}`);
