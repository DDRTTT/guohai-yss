import request from '@/utils/request';
import { stringify } from 'qs';

const uri = '/yss-awp-server';

// 获取主表格数据API
export const getTableLogsMasterApi = params =>
  request(`${uri}/remote/remoteLogsMaster`, {
    method: 'POST',
    data: params,
  });
// 查询项目信息列表API
export const getProjectInfoListApi = params =>
  request(`${uri}/product/getProductPageChecked`, {
    method: 'POST',
    data: params,
  });

// 通过fcode获取字典项API
export const getDicsByFcodeApi = params =>
  request(`/ams-base-parameter/datadict/queryInfo?${stringify(params)}`);
// 获取项目基本信息API
export const getProjectBaseInfoApi = params =>
  request(`${uri}/product/getQueryParamList?${stringify(params)}`);
// 获取子表单数据API
export const getTableLogsSubApi = params =>
  request(`${uri}/remote/remoteLogsSub?${stringify(params)}`);

