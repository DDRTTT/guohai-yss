import { stringify } from 'qs';
import request from '@/utils/request';

const uri = '/yss-lifecycle-flow';

// 获取列表数据
export async function handleClientInformationListAPI(params) {
  return request(`${uri}/productManagement/customer/list`, {
    method: 'POST',
    data: params,
  });
}
