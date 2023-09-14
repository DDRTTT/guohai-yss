import request from '@/utils/request';

// 请求 项目信息详情页数据
export function getPageInfoAPI(proCode) {
  return request(`/yss-awp-server/termination/getDetail?proCode=${proCode}`);
}
