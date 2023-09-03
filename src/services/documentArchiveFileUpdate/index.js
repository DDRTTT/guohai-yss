import request from '@/utils/request';
import { stringify } from 'qs';

const uri = '/yss-awp-server';

// 批量更新前置接口
export const getUpdateFilePreInspectApi = params =>
  request(`${uri}/task/fileUpdate/updateFilePreInspect`, {
    method: 'POST',
    data: params,
  });
// 批量更新后置接口
export const getUpdateFileRegisterApi = params =>
  request(`${uri}/task/fileUpdate/updateFileRegister`, {
    method: 'POST',
    data: params,
  });

// 更新用印更新后的列表
export const getFileInfoByFileIdsAndCodeApi = params =>
  request(`${uri}/task/fileUpdate/fileInfoByFileIdsAndCode`, {
    method: 'POST',
    data: params,
  });
