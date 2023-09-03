import { stringify } from 'qs';
import request from '@/utils/request';

const uri = '/yss-product-element';

// 列表查询 高级查询
export async function query() {
  return request(`${uri}/table/pageList/advancedQuery`, {
    method: 'POST',
    data: {}
  })
}

// 列表查询
export async function getList(params) {
  return request(`${uri}/table/pageList`, {
    method: 'POST',
    data: params
  });
}

// 新增表结构
export async function add(params) {
  return request(`${uri}/table`, {
    method: 'POST',
    data: params
  })
}

// 修改表结构
export async function update(params) {
  return request(`${uri}/table`, {
    method: 'PUT',
    data: params
  })
}

// 删除表结构
export async function del(params) {
  return request(`${uri}/table/${params.id}`, {
    method: 'DELETE'
  })
}

// 获取业务要素匹配列表data
export async function getElements() {
  return request(`${uri}/productElementBiz/findAll`)
}

// 生成表
export async function createTable(params) {
  return request(`${uri}/table/createTable`, {
    method: 'POST',
    data: params,
  })
}

// 生成系统级别字段
export async function createField() {// 之前唯一的参数 dataSourceType 后台已去掉，无需传参
  return request(`${uri}/column/createSystemLevelColumn`)
}

// 批量初始化 提交
export async function fieldSubmit(params) {
  return request(`${uri}/column/batchSaveColumns`, {
    method: 'POST',
    data: params
  })
}

// 业务字段标识映射成表字段
export async function eleChange(params) {
  return request(`${uri}/column/batchInit`, {
    method: 'POST',
    data: params
  })
}

// 根据表Id显示列信息
export async function getColumn(params) {
  return request(`${uri}/column/${params.id}`)
}

// 高级查询表结构列表
export async function advancSearch(params) {
  return request(`${uri}/table/pageList/advancedQuery`, {
    method: 'POST',
    data: params
  })
}

export async function productElementsQuery(params) {
  return request(`${uri}/productElementBiz/findByCondition`, {
    method: 'POST',
    data: params
  })
}

// 下载实体亠件
export async function _downloadFile(params) {
  return request(`${uri}/javaCreate`, {
    method: 'POST',
    data: params,
    responseType: 'blob'
  })
}

// 表结构管理（后更名为数据模型设计管理）-导出所选项
export async function exportItems(params) {
  return request(`${uri}/table/exportByIdList`, {
    method: 'POST',
    data: params,
    responseType: 'blob'
  });
}

// 表结构管理（后更名为数据模型设计管理）-导出全部
export async function exportAll() {
  return request(`${uri}/table/exportAll`, {
    responseType: 'blob',
  });
}

// 校验表结构是否绑定映射关系
export async function checkTableStructure(params) {
  return request(`${uri}/table/check`, {
    method: 'POST',
    data: params
  })
}

// 保存列字段校验是否绑定映射关系接口
export async function checkColumn(params) {
  return request(`${uri}/column/check`, {
    method: 'POST',
    data: params
  })
}

// 获取数据库类型
export async function getDataSourceType() {
  return request(`${uri}/table/getDataSourceType`);
}
