import { stringify } from 'qs';
import request from '@/utils/request';

const uri = '/yss-lifecycle-flow';

// 列表查询
export async function handleGetListAPI(params) {
  return request(`${uri}/productManagement/informationDisclosure/list`, {
    method: 'POST',
    data: params,
  });
}

// 词汇字典
export async function handleWordDictionaryFetchAPI(parameter) {
  return request(`/ams-base-parameter/datadict/queryInfoByList?${stringify(parameter)}`);
}
