import request from '@/utils/request';

export async function accountLogin(params) {
  return request('/yss-base-admin/jwt/token', {
    method: 'POST',
    data: params,
  });
}
export async function getFakeCaptcha(mobile) {
  return request(`/api/login/captcha?mobile=${mobile}`);
}

// 重置redis缓存
export async function redisInit() {
  return request('/yss-base-admin/user/proinfoaddredis', {
    method: 'POST',
    data: {},
  });
}

export async function handleCheckPassowrdAPI() {
  return request(`/yss-base-admin/pwdRecord/isForcedChangeInitPwd`);
}

export async function handleUpdatePasswordAPI(params) {
  return request(
    `/yss-base-admin/user/updateByUser?newPassword=${params.newPassword}&password=${params.password}&sureNewPassWord=${params.sureNewPassWord}`,
  );
}
