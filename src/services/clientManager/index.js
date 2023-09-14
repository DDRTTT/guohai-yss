import request from '@/utils/request';
import { stringify } from 'qs';

const uri = '/yss-base-product';

// 根据 username 查询【我的客户数】
export function reqPosition(params) {
  return request(`${uri}/biProduct/smartbi/simpleQuery`, {
    method: 'POST',
    data: params,
  });
}