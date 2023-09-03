import request from '@/utils/request';

// 系列名称数据字典
export function getSeriesNameAPI(params) {
  return request(
    `/yss-awp-server/awp/common/projects?type=${params.type}&projectState=${params.projectState}`,
  );
}

// 获取子表格数据API
export function getSubTableListAPI(params) {
  return request(`/yss-awp-server/product/getProductBySeries`, {
    method: 'POST',
    data: params,
  });
}

// 项目申报
export function projectReportAPI(params) {
  return request(`/yss-awp-server/product/projectReport`, {
    method: 'POST',
    data: params,
  });
}
