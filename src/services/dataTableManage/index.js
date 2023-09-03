import { stringify } from 'qs';
import request from '@/utils/request';

const uri = '/yss-product-element';

// 新增和修改界面下拉显示表信息
export async function getTableList(params) {
  return request(`${uri}/table/list`, {
    method: 'POST',
    data: params
  })
}

// 新增和修改界面选择下拉框之后 选择表名 显示列信息
export async function getColumns(params) {
  return request(`${uri}/column/${params.id}`)
}

// 保存映射关系
export async function mapSave(params) {
  return request(`${uri}/tablecolumnmapping`, {
    method: 'POST',
    data: params
  })
}

// 删除
export async function del(params) {
  return request(`${uri}/tablemapping/${params.id}`, {
    method: 'DELETE'
  })
}

// 高级查询
export async function query(params) {
  return request(`${uri}/tablemapping/pagelist`, {
    method: 'POST',
    data: params
  })
}

// 修改 回显数据
export async function getDetails(params) {
  return request(`${uri}/tablemapping/getcolums/${params.id}`)
}

// 审核/反审核
export async function checkOr(params) {
  return request(`${uri}/tablecolumnmapping/checkOr`, {
    method: 'POST',
    data: params
  })
}

// 根据Id查询单条表映射记录详情
export async function getMapping(params) {
  return request(`${uri}/tablemapping/${params.id}`)
}

// 点击表名查询表关系
export async function getTableRelationship(params) {
  return request(`${uri}/tablemapping/getcolummapping`, {
    method: 'POST',
    data: params
  })
}

// 模糊查询
export async function fuzzySearch(params) {
  return request(`${uri}/tablemapping/obscurepagelist`, {
    method: 'POST',
    data: params
  })
}