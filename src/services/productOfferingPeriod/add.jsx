import { stringify } from 'qs';
import request from '@/utils/request';

const uri = '/yss-lifecycle-flow';
// const uri = 'wz';

// 新增页面  产品名称下拉
export async function handleProductEnumSearchAPI(params) {
  return request(`${uri}/product/review/productEnum/search?${stringify(params)}`);
}

// 根据产品名称回显信息
export async function handleRaiseDateAdjustmentProductAPI(params) {
  return request(`${uri}/raiseDateAdjustment/product/get?${stringify(params)}`);
}

// 字典
export async function handleWordDictionaryFetchAPI(parameter) {
  return request(`/ams-base-parameter/datadict/queryInfoByList?${stringify(parameter)}`);
}

// 保存
export async function handleSaveByAddAPI(params) {
  return request(`${uri}/raiseDateAdjustment/add`, {
    method: 'POST',
    data: params,
  });
}

// 提交
export async function handleSubmitAPI(params) {
  return request(`${uri}/raiseDateAdjustment/commit`, {
    method: 'POST',
    data: params,
  });
}
