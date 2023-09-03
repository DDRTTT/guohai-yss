import request from '@/utils/request';

const url = '/yss-lifecycle-flow';

// 数据字典
export function getDictsAPI(codeList) {
  return request(`/ams-base-parameter/datadict/queryInfoByList?codeList=${codeList.toString()}`);
}

// 产品全称/代码下拉列表
export function getProNameAndCodeAPI() {
  return request(`${url}/product/review/productEnum/search`);
}

// 分页任务列表
export async function getListAPI(params) {
  return request(`${url}/productManagement/account/list`, {
    method: 'POST',
    data: params,
  });
}
