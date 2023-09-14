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

export async function redisInitAccess() {
  return request('/boHai/yss-base-admin/user/proinfoaddredis', {
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

// ------------------------对客平台--------------------------------------------------------------
// 获取验证码
export async function getFakeCaptchaCode(scene, mobile, flag) {
  // flag=1是否要求先验证手机号是否在系统中存在
  return request(
    `/yss-base-admin/message/getLoginMassage?scene=${scene}&fmobile=${mobile}&flag=${flag}`,
  );
}
// 手机登录
export async function mobileLogin(code, mobile) {
  return request(`/yss-base-admin/message/messageLogin?code=${code}&fmobile=${mobile}`);
}
// 忘记密码，验证手机和验证码是否正确
export async function forgotPassword(code, mobile) {
  return request(`/ams-base-admin/message/checkMessage?code=${code}&fmobile=${mobile}`);
}
// 忘记密码，修改密码
export async function handleForgetUpdatePasswordAPI(password, mobile) {
  return request(`/yss-base-admin/user/updateByMobile?password=${password}&mobile=${mobile}`);
}
// 便捷查询，开户列表
export async function proAccountOutlets(params) {
  return request('/yss-base-product/proAccountOutlets/query?coreModule=TProAccountOutlets', {
    method: 'POST',
    data: params,
  });
}
// 便捷查询，城市列表 cityList
export async function cityListAPI() {
  return request(
    `/ams-base-parameter/datadict/queryInfoByChInitials?fcode=prefectures&initials=ABCDEFGHIJKLMNOPQRSTUVWXYZ`,
  );
}
// 便捷查询，银行列表 bankList
export async function bankListAPI() {
  return request(
    `/ams-base-parameter/datadict/queryInfoByChInitials?fcode=bankNO&initials=ABCDEFGHIJKLMNOPQRSTUVWXYZ`,
  );
}
