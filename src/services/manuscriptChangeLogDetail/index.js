import request from '@/utils/request';
import { stringify } from 'qs';

const uri = '/yss-awp-server';

// 操作日志table表格API
export const getTAwpLogListApi = params =>
  request(`${uri}/tAwpLog/list`, {
    method: 'POST',
    data: params,
  });

// 获取项目基础信息详情API
export const getProjectBaseInfoDetailApi = params =>
  request(`${uri}/product/getDetail?${stringify(params)}`);
// 操作对象下拉列表API
export const getOptObjApi = () => request(`${uri}/tAwpLog/getObjectList`);
// 操作人下拉列表API
// export const getPersonApi = () => request(`/yss-base-admin/user/getperson`);
export const getPersonApi = () => request(`${uri}/tAwpLog/userList`,{
  method: 'POST',
});
