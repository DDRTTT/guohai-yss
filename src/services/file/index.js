/**
 *Create on 2020/7/22.
 */

import { stringify } from 'qs';
import request from '../../utils/request';

const uri = '/ams-base-product/product';

export async function queryRule(params) {
  return request(`${uri}?${stringify(params)}`);
}

export async function queryOne(params) {
  return request(`${uri}/productbyid/${params}`);
}

export async function queryforgtype() {
  return request(`/ams-base-parameter/assettype/assettypealltree`);
}

export async function queryDropDownNameCode(params) {
  return request(`/ams-base-product/product/getProductList?${stringify(params)}`);
}

export async function queryforgtypeNew() {
  return request(`/ams-base-parameter/assettype/producttypetree`);
}

export async function proadd(params) {
  return request(`${uri}`, {
    method: 'POST',
    data: params,
  });
}

export async function procheck(params) {
  return request(`${uri}/status?list=${params.list}&status=${params.status}`, {
    method: 'PUT',
  });
}

export async function prodel(params) {
  return request(`${uri}?list=${params}`, {
    method: 'DELETE',
  });
}

export async function proup(params) {
  return request(`${uri}`, {
    method: 'PUT',
    data: params,
  });
}

// 外包人
export async function querywbr(params) {
  return request(`/ams-base-product/pbProduct/query?${stringify(params)}`);
}

export async function querywbrdetail(params) {
  return request(`/ams-base-product/pbProduct/queryById/${params}`);
}

// 批量删除
export async function proWBRdel(params) {
  return request(`/ams-base-product/pbProduct/del?${stringify(params)}`, {
    method: 'DELETE',
  });
}

// 批量审核
export async function proWBRexamine(params) {
  return request(`/ams-base-product/pbProduct/status?${stringify(params)}`, {
    method: 'PUT',
  });
}

// 添加产品
export async function commitAddWBR(params) {
  return request(`/ams-base-product/pbProduct/add`, {
    method: 'POST',
    data: params,
  });
}

// 修改产品
export async function commitUPDATEWBR(params) {
  return request(`/ams-base-product/pbProduct/update`, {
    method: 'PUT',
    data: params,
  });
}

/**  托管人  * */
export async function querytgr(params) {
  return request(`/ams-base-product/custProduct/query?${stringify(params)}`);
}

export async function querytgrdetail(params) {
  return request(`/ams-base-product/custProduct/queryById/${params}`);
}

// org下拉
export async function dropDownOrg(params) {
  return request(`/ams-base-parameter/institution/orgtypebylist?${stringify(params)}`);
}

// type下拉
export async function dropDownType(params) {
  return request(`/ams-base-parameter/datadict/queryInfoByList?${stringify(params)}`);
}

// 批量删除
export async function proTGRdel(params) {
  return request(`/ams-base-product/custProduct/del?${stringify(params)}`, {
    method: 'DELETE',
  });
}

// 批量审核
export async function proTGRexamine(params) {
  return request(`/ams-base-product/custProduct/status?${stringify(params)}`, {
    method: 'PUT',
  });
}

// 添加产品
export async function commitAddTGR(params) {
  return request(`/ams-base-product/custProduct/add`, {
    method: 'POST',
    data: params,
  });
}

// 修改产品
export async function commitUPDATETGR(params) {
  return request(`/ams-base-product/custProduct/update`, {
    method: 'PUT',
    data: params,
  });
}

/**  管理人  * */
export async function queryglr(params) {
  return request(`/ams-base-product/manageProduct/query?${stringify(params)}`);
}

export async function queryglrdetail(params) {
  return request(`/ams-base-product/manageProduct/queryById/${params}`);
}

// 批量删除
export async function proGLRdel(params) {
  return request(`/ams-base-product/manageProduct/del?${stringify(params)}`, {
    method: 'DELETE',
  });
}

// 批量审核
export async function proGLRexamine(params) {
  return request(`/ams-base-product/manageProduct/status?${stringify(params)}`, {
    method: 'PUT',
  });
}

// 添加产品
export async function commitAddGLR(params) {
  return request(`/ams-base-product/manageProduct/add`, {
    method: 'POST',
    data: params,
  });
}

// 修改产品
export async function commitUPDATEGLR(params) {
  return request(`/ams-base-product/manageProduct/update`, {
    method: 'PUT',
    data: params,
  });
}

export async function queryRuleJG(params) {
  return request(`/ams-base-parameter/institution/queorgtype?orgType=${params}`);
}

export async function querySingle(params) {
  return request(`${uri}/productsingle`);
}

export async function queryDetail(params) {
  return request(`${uri}/getproductDetail`);
}

export async function queryDetailCode(params) {
  return request(`${uri}/getproductDetailCode`);
}

export async function queryDropDownWBR(params) {
  return request(`${uri}/getproductDropDown`);
}

export async function queryDetail_TGR(params) {
  return request(`${uri}/getproductDetail_TGR`);
}

export async function queryDropDownTGR(params) {
  return request(`${uri}/getproductDropDown_TGR`);
}

export async function queryDetail_GLR(params) {
  return request(`${uri}/getproductDetail_GLR`);
}

export async function queryDropDownGLR(params) {
  return request(`${uri}/getproductDropDown_GLR`);
}

export async function valProductName(params) {
  return request(`${uri}/getvalProductName`);
}

export async function valProductCode(params) {
  return request(`${uri}/getvalProductCode`);
}

export async function commitAdd(params) {
  return request(`${uri}/getproductCommitAdd`);
}

// 查询产品关联信息
export async function handleProMapping(params) {
  return request(`${uri}/selectbyprocode?proCode=${params}`);
}

// 查询映射平台
export async function getSubSystem() {
  return request(`/ams-base-parameter/datadict/queryInfo?fcode=subSystem`);
}

// 获取默认映射平台
export async function getSystem(params) {
  return request(`/ams-base-product/product/selectproduct/${params}`);
}

// 保存'代码映射'信息
export async function handleSaveCodeMapping(params) {
  return request(`/ams-base-product/product/updateoutproduct`, {
    method: 'PUT',
    data: params,
  });
}

// 保存'产品关联'信息
export async function handleSaveProMapping(params) {
  return request(`/ams-base-product/product/updateproduct`, {
    method: 'PUT',
    data: params,
  });
}

// 删除'产品关联'信息
export async function handleDelProMapping(params) {
  return request(`/ams-base-product/product/deleteproduct`, {
    method: 'PUT',
    data: params,
  });
}

// 获取默认产品关联
export async function getDefaultProductAssociation(params) {
  return request(`/ams-base-product/getDefaultProductAssociation`);
}

// 角色和产品代码关联 词汇字典
export async function roleProduct(val) {
  return request(`/ams-base-parameter/datadict/queryInfo?fcode=roleProduct`);
}

// 产品名称select
export async function getProduct(params) {
  return request(`/ams-base-product/product/selectbyprobustype?${stringify(params)}`);
}
