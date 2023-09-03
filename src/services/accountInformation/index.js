/**
 *Create on 2020/7/22.
 */

import { stringify } from 'qs';
import request from '../../utils/request';

// const uri = '';

// 获取个人信息
export async function getPersonal() {
  return request(`/yss-base-admin/userdetail/getUserDetailById`);
  // return request(`/ams/datumServer-api/datumServer/getPersonal?${stringify(val)}`);
}

// 获取名人名言
export async function getCelebritymotto(val) {
  return request(`/yss-base-admin/celebritymotto/getCelebritymotto?${stringify(val)}`);
}

// 保存个人信息
export async function saveDatum(params) {
  return request(`/yss-base-admin/userdetail/userDetailUpdate/1`, {
    method: 'POST',
    data: params,
  });
}

// 上传头像
export async function uploadPhoto(params) {
  return request(`/yss-base-admin/userdetail/ftpUploadImg`, {
    method: 'POST',
    data: params,
  });
}

// 保存企业信息
export async function saveCompany(params) {
  return request(`/yss-base-admin/userdetail/userDetailUpdate/2`, {
    method: 'POST',
    data: params,
  });
}

// 修改个人密码
export async function revisePassword(val) {
  return request(`/yss-base-admin/user/updateByUser?${stringify(val)}`);
}

// 给手机发送验证码
export async function verificationCode(val) {
  return request(`/ams-base-admin/message/getLoginMassage?${stringify(val)}`);
}

// 核对手机验证码
export async function checkPhoneCode(val) {
  return request(`/ams-base-admin/message/checkMessage?${stringify(val)}`);
}

// 测试此手机号数据库是否存在
export async function isPhoneExist(val) {
  return request(`/ams-base-admin/message/checkUser?${stringify(val)}`);
}

// 绑定手机号
export async function clickBind(val) {
  return request(`/yss-base-admin/userdetail/updateEmailOrMobile/2?${stringify(val)}`);
}

// 给邮箱发送验证码
export async function sendCode(val) {
  return request(`/ams-base-admin/email/sendEmail?${stringify(val)}`);
}

// 核对邮箱验证码
export async function mailboxCode(val) {
  return request(`/ams-base-admin/email/checkEmailCode?${stringify(val)}`);
}

// 绑定邮箱
export async function clickBindEmail(val) {
  return request(`/yss-base-admin/userdetail/updateEmailOrMobile/1?${stringify(val)}`);
}
