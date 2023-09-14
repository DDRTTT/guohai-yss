import request from '@/utils/request';

const uri = '/yss-base-product';

// 产品管理-信息管理-列表
export async function getListAPI(params) {
  return request(`${uri}/biProductInfo/smartbi/query`, {
    method: 'POST',
    data: params,
  });
}
