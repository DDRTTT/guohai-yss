import request from '@/utils/request';

// 接口:产品名称/代码下拉列表
export function getProNameAndCodeAPI() {
  return request('/yss-lifecycle-flow/product/review/productEnum/search');
}

// 接口:列表数据
export function getTableListAPI(params) {
  return request('/yss-lifecycle-manage/assQuarReport/query?coreModule=TAssQuarReport', {
    method: 'POST',
    data: params,
  });
}

// 接口:根据主键查询附件的标签内容
export async function getFileDetailsAPI(id) {
  return request(`/yss-lifecycle-manage/assQuarReport/queryOne?id=${id}`);
}

// 校验：查看的路径是否可用
export function reqCheckUrl(url) {
  return request(`/yss-lifecycle-manage/assQuarReport/checkWeb?url=${url}`);
}
