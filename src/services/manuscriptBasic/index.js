import { stringify } from 'qs';
import request from '@/utils/request';

const uri = '/yss-awp-server';

// 生命周期树形
export async function handleGetTreeAPI(params) {
  return request(`${uri}/businessArchive/lifeTree?${stringify(params)}`);
}
// 审核：1/反审核：0
export async function handleAuditAPI(params) {
  return request(`${uri}/commonPath/checked?${stringify(params)}`);
}

// 列表信息
export async function handleGetListAPI(params) {
  return request(`${uri}/commonPath/getPathList`, {
    method: 'POST',
    data: params,
  });
}
