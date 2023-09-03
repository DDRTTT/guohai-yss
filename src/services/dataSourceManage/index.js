import { stringify } from 'qs';
import request from '@/utils/request';

const uri = '/yss-product-element';

// 新增mysql数据源
export async function mysql(params) {
  return request(`${uri}/datasource/mysql`, {
    method: 'POST',
    data: params,
  })
}

// 新增oracle数据源
export async function oracle(params) {
  return request(`${uri}/datasource/oracle`, {
    method: 'POST',
    data: params,
  })
}

// 修改mysql数据源
export async function mysqlUpdate(params) {
  return request(`${uri}/datasource/mysql/${params.code}`, {
    method: 'POST',
    data: params
  })
}

// 修改oracle数据源
export async function oracleUpdate(params) {
  return request(`${uri}/datasource/oracle/${params.code}`, {
    method: 'POST',
    data: params
  })
}

// 测试连通性-mysql
export async function mysqlTest(params) {
  return request(`${uri}/datasource/mysql/test`, {
    method: 'POST',
    data: params,
  })
}

// 测试连通性 -oracle
export async function oracleTest(params) {
  return request(`${uri}/datasource/oracle/test`, {
    method: 'POST',
    data: params,
  })
}

// 列表查询 高级查询
export async function query(params) {
  return request(`${uri}/datasource/pageList/advancedQuery`, {
    method: 'POST',
    data: params,
  })
}

// 列表查询 模糊查询
export async function like(params) {
  return request(`${uri}/datasource/pageList/fuzzyQuery`, {
    method: 'POST',
    data: params,
  })
}

// 列表查询
export async function getList() {
  return request(`${uri}/datasource/list`)
}

// 数据源下拉 
export async function getSelectList() {
  return request(`${uri}/datasource/selectList`)
}

// 删除数据源
export async function del(params) {
  return request(`${uri}/datasource/${params.code}`, {
    method: 'DELETE',
  })
}

// 获取所有的机构
export async function getOrgData(params) {
  return request(`/ams-base-parameter/organization/orgInfoPageQuery`, {
    method: 'POST',
    data: params
  })
}

// 获取下拉框的值(公共接口：字典批量查询)
export async function getDropdownData(params) {
  return request(`/ams-base-parameter/datadict/queryInfoByList?${stringify(params)}`)
}

// 审核/反审核
export async function examine(params) {
  return request(`${uri}/datasource/checkOrUn`, {
    method: 'POST',
    data: params
  })
}

export async function getListCondition(params) {
  return request(`${uri}/datasource/list/advancedQuery`, {
    method: 'POST',
    data: params,
  })
}

// 查详情
export async function getDetails(params) {
  return request(`${uri}/datasource/${params.id}`)
}
