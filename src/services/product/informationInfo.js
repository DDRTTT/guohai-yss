import request from '@/utils/request';

const uri = '/yss-base-product';

// 产品管理-信息管理-详情 / 合同详情 / 客户基本信息
export async function getInfoAPI(params) {
  return request(`${uri}/biProductInfo/smartbi/dynamicQuery`, {
    method: 'POST',
    data: params,
  });
}

// 产品管理-信息管理/ 账户详情/ 产品考核参数列表
export async function getInfoForAccountAPI(params) {
  return request(`${uri}/biProductInfo/smartbi/query`, {
    method: 'POST',
    data: params,
  });
}
