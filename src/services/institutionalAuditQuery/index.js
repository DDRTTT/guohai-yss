import { stringify } from 'qs';
import request from '@/utils/request';

const uri = '';

// 获取注册机构列表/
export async function handleList(val) {
  return request(`/ams-base-admin/registuser/queryOrg?${stringify(val)}`);
}

// 新增用户
export async function handleAddUser(params) {
  console.log(params, 'params参数');
  return request(`/ams-base-admin/registuser/add`, {
    method: 'POST',
    data: params,
  });
}

// 查询机构
export async function handleSearchCompany(params) {
  return request('/registrationReview/search', {
    method: 'POST',
    data: params,
  });
}

// 通过/驳回
export async function handleReview(params) {
  let val = {
    checkMsg: params.checkMsg,
    desc: params.desc,
    username: params.username,
  };
  return request(`/ams-base-admin/registuser/status?list=${params.list}&status=${params.status}`, {
    method: 'PUT',
    data: val,
  });
}

// 模糊查询
export async function handleCompanyQuery(val) {
  return request(`/institution/query?${stringify(val)}`);
}

// 机构类型查询
export async function handleCompanyTypeQuery() {
  return request(`/ams-base-parameter/datadict/queryInfo?fcode=orgType`);
}

// 用户信息详情
export function handleCompanyInfo(val) {
  return request(`/ams-base-admin/registuser/queryById/${val}`);
}

// 驳回原因 字典
export async function handleCheckType() {
  return request(`/ams-base-parameter/datadict/queryInfo?fcode=checkType`);
}
