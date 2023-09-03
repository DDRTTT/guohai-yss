import { stringify } from 'qs';
import request from '@/utils/request';

// const uri = '/jsz';
const uri = '/yss-lifecycle-flow';

// 根据节点类型查询
export async function handleGetFlowNodeAPI(params) {
  return request(`${uri}/lifecycleNode/getNodesByType?${stringify(params)}`);
}

// 获取全部控件类型（节点属性）
export async function handleGetAttrListAPI(params) {
  return request(`${uri}/controlInfo/getAllInfo`, {
    method: 'POST',
    data: params,
  });
}

// 控件类型新增
export async function handleAddControllInfoAPI(params) {
  return request(`${uri}/controlInfo/add`, {
    method: 'POST',
    data: params,
  });
}

// 提交/保存
export async function handleSubmitAPI(params) {
  return request(`${uri}/controlCell/${params.uri}`, {
    method: 'POST',
    data: params,
  });
}
// 词汇字典
export async function handleWordDictionaryFetchAPI(parameter) {
  return request(`/ams-base-parameter/datadict/queryInfoByList?${stringify(parameter)}`);
}

// 权限产品 menuCode 当前菜单代码
export async function handleAuthorityAPI(parameter) {
  return request(`/ams-base-product/product/getProductList?${stringify(parameter)}`);
}

// 根据id获取模板信息
export async function handleGetFlowInfoByIdAPI(parameter) {
  return request(`${uri}/controlInfo/getDetail?${stringify(parameter)}`);
}
