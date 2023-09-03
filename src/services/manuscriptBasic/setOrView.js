import { stringify } from 'qs';
import request from '@/utils/request';

const uri = '/yss-awp-server';

// 生命周期树形
export async function handleGetTreeAPI(params) {
  return request(`${uri}/commonPath/getAllSysTree?${stringify(params)}`);
}

// 添加
export async function handleAddTreeAPI(params) {
  return request(`${uri}/commonPath/${params.opType}`, {
    method: 'POST',
    data: params,
  });
}
// 删除
export async function handleDeleteTreeAPI(params) {
  return request(`${uri}/commonPath/delete`, {
    method: 'POST',
    data: params,
  });
}

// 词汇字典
export async function handleWordDictionaryFetchAPI(parameter) {
  return request(`/ams-base-parameter/datadict/queryInfoByList?${stringify(parameter)}`);
}
