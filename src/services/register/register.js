import { stringify } from 'qs';
import request from '../../utils/request';

export async function getdxinfo(val) {
  return request(
    `/ams-base-admin/message/getLoginMassage?scene=${val.scene}&fmobile=${val.fmobil}`,
  );
}

export async function register(val) {
  let verCode = val.verCode;
  let par = Object.assign({}, val);
  delete par.verCode;
  return request('/ams-base-admin/registuser/add?', {
    method: 'POST',
    data: par,
  });
}

export async function registerPerson(val) {
  let verCode = val.verCode;
  let par = Object.assign({}, val);
  delete par.verCode;
  return request('/ams-base-admin/registuser/addperson?', {
    method: 'POST',
    data: par,
  });
}

export async function getOrgType(val) {
  return request(`/ams-base-parameter/datadict/queryInfo?fcode=orgType`);
}

export async function checkDX(val) {
  return request(`/ams-base-admin/message/checkMessage?fmobile=${val.mobile}&code=${val.verCode}`);
}

export async function checkCodeAndMobile(val) {
  return request('/ams-base-admin/registuser/checkUserMsg', {
    method: 'POST',
    data: val,
  });
}
