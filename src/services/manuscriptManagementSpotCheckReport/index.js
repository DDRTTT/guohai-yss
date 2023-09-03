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
// 获取排除不适用的目录树
export const getSysTreeApi = params => request(`${uri}/path/getSysTree?${stringify(params)}`);
// 抽查报送
export const submitWpFileUploadWithoutDictApi = params =>
  request(`${uri}/remote/wpFileUploadWithoutDict?${stringify(params)}`);
