import { stringify } from 'qs';
import request from '../../utils/request';

const uri = '/ams-base-admin';

// 获取卡片列表数据
export async function userLicenseList(params) {
  return request(`${uri}/dataauth/queauthorg?${stringify(params)}`);
}

// 获取用户信息
export async function userLicenseInfo() {
  return request(`${uri}/dataauth/getApper`);
}

// 申请授权
export async function commitApplicate(params) {
  return request(`${uri}/dataauth/addappauth`, {
    method: 'POST',
    data: params,
  });
}

// 审核数据授权申请
export async function checkApplicate(params) {
  return request(`${uri}/dataauth/rejectappauth?${stringify(params)}`, {
    method: 'PUT',
  });
}

// 查询已申请列表
export async function fetchHasLicenseList(params) {
  return request(`${uri}/dataauth/queappedauth?${stringify(params)}`);
}

// 查询已申请详情
export async function institutionalDetailInfo(params) {
  return request(`${uri}/dataauth/queappauthbyid/${params}`);
}
