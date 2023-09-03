import { stringify } from 'qs';
import request from '@/utils/request';

const uri = '/yss-lifecycle-flow';

// 新增页面  产品名称下拉
export async function handleProductEnumSearchAPI(params) {
  return request(`${uri}/product/review/productEnum/search?${stringify(params)}`);
}
// 修改页面 查询详情
export async function handleRaiseDateAdjustmentAPI(parameter) {
  return request(`${uri}/raiseDateAdjustment/get/${stringify(parameter)}`);
}

// 修改页面 回显信息
export async function handleRaiseDateAdjustmentProductAPI(params) {
  return request(`${uri}/raiseDateAdjustment/product/get/${stringify(params)}`);
}

// 字典
export async function handleWordDictionaryFetchAPI(parameter) {
  return request(`${uri}/common/dict/item/search?${stringify(parameter)}`);
}
