import { stringify } from 'qs';
import request from '@/utils/request';

// const uri = '/jsz';
const uri = '/yss-lifecycle-flow';

// 获取列表
export async function handleGetListInfoAPI(params) {
  return request(`${uri}/lifecycleLayout/queryPage`, {
    method: 'POST',
    data: params,
  });
}

// 删除
export async function handleDeleteProductAPI(params) {
  return request(`${uri}/lifecycleLayout/del?${stringify(params)}`);
}

// 发布、取消发布
export async function handlePublishProductAPI(params) {
  return request(`${uri}/lifecycleLayout/check?${stringify(params)}`);
}

// 词汇字典
export async function handleWordDictionaryFetchAPI(parameter) {
  return request(`/ams-base-parameter/datadict/queryInfoByList?${stringify(parameter)}`);
}
