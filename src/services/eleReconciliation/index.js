// import { stringify } from 'qs';
import request from '@/utils/request';

// 新增、修改、详情界面，管理人
export async function getOrganization() {
  return request(`/ams-base-parameter/organization/getOrgNameList?orgType=JGJS01`);
}

// 新增、修改、详情界面，对账类型
export async function getRecRecordType() {
  return request(`/ams-base-parameter/datadict/getDictByLinkage?dictategoryCode=recRecordType`);
}

// 新增、修改、详情界面，根据对账类型，返回对应字段集合
export async function getRecRecordList(datadictCode) {
  // 01=估值表，02=余额表   。。。
  return request(
    `/ams-base-parameter/datadict/getDictByLinkage?dictategoryCode=recRecordType&datadictCode=${datadictCode}`,
  );
}

// 新增，保存
export async function add(params) {
  return request(`/yss-customer-server/recTemplate/add`, {
    method: 'POST',
    data: params,
  });
}

// 详情
export async function detail(id) {
  return request(
    `/yss-customer-server/recTemplate/querybyid?id=${id}&coreModule=TRecTemplate&listModule=TRecTemplate,TRecTemplateDetail&ignoreTable=`,
  );
}

// 修改，保存
export async function update(params) {
  return request(`/yss-customer-server/recTemplate/update`, {
    method: 'POST',
    data: params,
  });
}

// 删除
export async function del(id) {
  return request(
    `/yss-customer-server/recTemplate/delete?ids=${id}&coreModule=TRecTemplate&listModule=TRecTemplate,TRecTemplateDetail&ignoreTable=`,
  );
}

// 列表
export async function getTableList(params) {
  // &listModule=TRecTemplate,TRecTemplateDetail
  return request(`/yss-customer-server/recTemplate/query?coreModule=TRecTemplate`, {
    method: 'POST',
    data: params,
  });
}
