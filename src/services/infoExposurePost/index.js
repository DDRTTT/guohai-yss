import request from '@/utils/request';
import { stringify } from 'qs';

const uri = '/yss-lifecycle-flow';

// 获取[我的产品数]
export function reqMyProducts(params) {
  return request(`${uri}/productBoard/query/proViewList`, {
    method: 'POST',
    data: params,
  });
}
