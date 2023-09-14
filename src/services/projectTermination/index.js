import request from '@/utils/request';
import { stringify } from 'qs';

// 项目名称数据字典
export function getProNameAPI(params) {
  return request(
    `/yss-awp-server/awp/common/projects?type=${params.type}&projectState=${params.projectState}&checked=${params.checked}`,
    {
      method: 'GET',
    },
  );
}

export function getTableDataList(params) {
  return request(`/yss-awp-server/termination/getProductPageChecked`, {
    method: 'POST',
    data: params,
  });
}
// 请求 项目编码/所属部门 下拉列表项
export function getProcodeAndProDeptListAPI(type) {
  return request(`/yss-awp-server/product/getQueryParamListChecked?type=${type}`);
}

// 请求 项目类型 下拉列表项
export function getProTypeListAPI(fcode) {
  return request(`/ams-base-parameter/datadict/queryInfo?fcode=${fcode}`);
}
