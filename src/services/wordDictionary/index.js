import { stringify } from 'qs';
import request from '@/utils/request';

/** 字典类目 */
// 字典类目查询列表
export async function handleList(val) {
  return request(`/ams-base-parameter/dictategory/query?${stringify(val)}`);
}

// 获取字典类目详情
export async function handleOne(val) {
  return request(`/ams-base-parameter/dictategory/queryById/${val.fid}`);
}

// 新增 (字典类目+数据字典)
export async function handleAddUser(params) {
  return request(`/ams-base-parameter/dictategory/adddatadict`, {
    method: 'POST',
    data: params,
  });
}

// 编辑 (字典类目+数据字典)
export async function handleEditUser(params) {
  return request(`/ams-base-parameter/dictategory/updatedatadict`, {
    method: 'PUT',
    data: params,
  });
}

// 删除字典类目
export async function handleDeleteUser(params) {
  return request(`/ams-base-parameter/dictategory/deleteById/${params.id}`, {
    method: 'DELETE',
    // data: params,
  });
}

/** 数据字典 */
// 数据字典查询列表
export async function handleOneList(val) {
  return request(`/ams-base-parameter/datadict/queryInfoNew?${stringify(val)}`);
}

export async function handleDownloadAPI(params) {
  return request(`/ams-base-parameter/datadict/expDict`, {
    method: 'POST',
    data: params,
    headers: { 'Content-Type': 'application/json;charset=utf-8' },
  });
}

export async function getDropDownListApi() {
  return request(`/ams-base-parameter/dictategory/getDropDownList`);
}

export async function updateByLinkageApi(params) {
  return request(`/ams-base-parameter/datadict/updateByLinkage`, {
    method: 'PUT',
    data: params,
  });
}

export async function queryInfoByLinkageApi(params) {
  return request(`/ams-base-parameter/datadict/queryInfoByLinkage?${stringify(params)}`);
}
