import { stringify } from 'qs';
import request from '@/utils/request';

const uri = '/yss-product-element';

// 条件查询
export async function query(params) {
  return request(`${uri}/productElementBiz/findByCondition`, {
    method: 'POST',
    data: params,
  });
}

// 产品要素 业务列表
export async function getBusinessList(params) {
  return request(`${uri}/productElementBiz/pagelist`, {
    method: 'POST',
    data: params,
  });
}

// 导出所选项产品要素
export async function exportBusiness(params) {
  return request(`${uri}/productElementBiz/exportbyid`, {
    method: 'POST',
    data: params,
    responseType: 'blob',
  });
}

// 全量导出产品要素
export async function exportBusinessAll() {
  return request(`${uri}/productElementBiz/exportBiz`, {
    responseType: 'blob',
  });
}

// 一键匹配列表
export async function oneKeyMatchList(params) {
  return request(`${uri}/productElementBiz/oneKeyMatch`, {
    method: 'POST',
    data: params,
  });
}

// 一键匹配
export async function oneKeyMatch(params) {
  return request(`${uri}/productElementBiz/saveBusiColumnMapping`, {
    method: 'POST',
    data: params,
  });
}

// 匹配规则校验
export async function matchCheck(params) {
  return request(`${uri}/productElementBiz/matchCheck?${stringify(params)}`);
}

// 产品要素 业务新增
export async function businessAdd(params) {
  return request(`${uri}/productElementBiz/add`, {
    method: 'POST',
    data: params,
  });
}

// 产品要素 业务修改
export async function businessUpdate(params) {
  return request(`${uri}/productElementBiz/update`, {
    method: 'PUT',
    data: params,
  });
}

// 产品要素 业务详情
export async function getBusiness(params) {
  return request(`${uri}/productElementBiz/${params}`, {
    method: 'GET',
  });
}

// 产品要素 业务删除
export async function deleteBusiness(params) {
  return request(`${uri}/productElementBiz/${params}`, {
    method: 'DELETE',
  });
}

// 关联管理列表
export async function getColumnList(params) {
  return request(`${uri}/column/list`, {
    method: 'POST',
    data: params,
  });
}

// 保存产品要素业务和表结构映射 关联接口
export async function saveBusiColumnMapping(params) {
  return request(`${uri}/productElementBiz/saveBusiColumnMapping`, {
    method: 'POST',
    data: params,
  });
}

// 表结构列表
export async function getTableStructureList(params) {
  return request(`${uri}/productElementBiz/getTableStructureList`, {
    method: 'POST',
    data: params,
  });
}

// 选择归属机构和系统查询表信息接口
export async function getTableList(params) {
  return request(`${uri}/table/list`, {
    method: 'POST',
    data: params,
  });
}

// 迁出
export async function emigration(params) {
  return request(`${uri}/productElementBiz/emigration?${stringify(params)}`, {
    method: 'GET',
  });
}
