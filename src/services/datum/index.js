/**
 *Create on 2020/7/22.
 */

import { stringify } from 'qs';
import request from '@/utils/request';

const uri = '/yss-base-admin/user';

// 删除成员
export async function handleDelete(val) {
  return request(`${uri}/delMember?${stringify(val)}`, {
    method: 'DELETE',
  });
}

// 获取成员列表+查询
export async function handleMemberManagementList(val) {
  return request(`${uri}/queryMember?${stringify(val)}`);
}

// 获取'当前成员产品'权限列表
export async function handleMemberPartialPermissions(val) {
  return request(
    `${uri}/getUserAllProduct/${val.id}?currentPage=${val.currentPage}&pageSize=${val.pageSize}`,
  );
}

// 获取'当前成员产品'权限列表 分页的
export async function handleMemberPermissionsPage(val) {
  const par = { ...val };
  delete par.id;
  return request(`${uri}/queryProductPageById/${val.id}`, {
    method: 'POST',
    data: par,
  });
}

// 获取'当前登录的用户产品'权限列表
export async function handleMemberAllPermissions(val) {
  return request(`${uri}/getProductAll?${stringify(val)}`);
}

// '删除'成员
export async function handleMemberDel(params) {
  return request(`${uri}/delMember?list=${params}`, {
    method: 'DELETE',
  });
}

// 保存成员
export async function handleMemberAdd(params) {
  return request(`${uri}/addMember`, {
    method: 'POST',
    data: params,
  });
}

// 成员详情
export async function handleMemberInfo(params) {
  return request(`${uri}/queryMemberById/${params}`);
}

// 更新成员详情
export async function handleUpdateMember(params) {
  return request(`${uri}/updateMember`, {
    method: 'PUT',
    data: params,
  });
}

// 获取产品类分组
export async function handleProductClassGroup() {
  return request(`/yss-base-admin/handleProductClassGroup`);
}

// 获取我的分组
export async function handleMyGroups() {
  return request(`/yss-base-admin/productgroup/getprogroup`);
}

// 添加/修改分组
export async function handleAddGroup(params) {
  return request(`/yss-base-admin/productgroup/saveprogroup`, {
    method: 'POST',
    data: params,
  });
}

// 删除分组
export async function handleDelGroup(params) {
  return request(`/yss-base-admin/productgroup/delprogroup/${params}`, {
    method: 'DELETE',
  });
}

// 组授权
export async function handleAuthorization(params) {
  return request(`/yss-base-admin/userproduct/groupgive/${params.memberId}`, {
    method: 'POST',
    data: params.par,
  });
}

// 取消授权
export async function handleCancelAuthorization(params) {
  return request(`/yss-base-admin/userproduct/groupgiveup/${params.memberId}`, {
    method: 'POST',
    data: params.par,
  });
}

// 单一授权
export async function handleOneAuthorization(params) {
  return request(`/yss-base-admin/userproduct/givesingle/${params.id}`, {
    method: 'POST',
    data: {
      proCode: params.proCode,
      fproList: params.fproList,
    },
  });
}

// 保存到组
export async function handleSaveToGroup(params) {
  return request(`/yss-base-admin/productgroupinfo/savetogroup`, {
    method: 'POST',
    data: params,
  });
}

// 获取已授权数组
export async function handleAuthorized(params) {
  return request(`/yss-base-admin/user/getUserProduct/${params}`);
}

// 获取产品类
export async function handlePermissionClass() {
  return request(`/ams-base-product/product/getauthorizprotypetree`);
}

// 获取角色
export async function handleClassRole(sysId) {
  return request(`/yss-base-admin/role/getroleinfo?sysId=${sysId}`);
}

// 条件查询产品
export async function handlePermissionsByCondition(params) {
  return request(`/yss-base-admin/userproduct/selectpro`, {
    method: 'POST',
    data: params,
  });
}

// 条件查询产品代码
export async function handlePermissionsByConditionForAllCode(params) {
  return request(`/yss-base-admin/userproduct/selectprocode`, {
    method: 'POST',
    data: params,
  });
}

// 角色功能点修改
export async function handleRoleModify(params) {
  return request(`/yss-base-admin/role/actions/init/${params.id}`, {
    method: 'POST',
    data: { actions: params.actions },
  });
}

// 操作权限授权
export async function handleOperationAuthority(params) {
  return request(`/yss-base-admin/role/setAuth`, {
    method: 'POST',
    data: params,
  });
}

// 操作权限授权--‘数据授权’模块使用
export async function handleOperationAuthorityForData(params) {
  return request(`/yss-base-admin/role/applysetAuth`, {
    method: 'POST',
    data: params,
  });
}

// 角色名称修改
export async function handleRoleNameModify(params) {
  return request(`/yss-base-admin/role/edit/${params.id}`, {
    method: 'PUT',
    data: { name: params.name },
  });
}

// 角色删除
export async function handleRoleDel(params) {
  return request(`/yss-base-admin/role/del/${params.id}`, {
    method: 'DELETE',
  });
}

// 岗位删除
export async function handleDelJobAPI(id) {
  return request(`/yss-base-admin/positionInfo/del?id=${id}`);
}

//----------------------------------------------------------------

// 获取指定机构信息
export async function handleOrgInfo(params) {
  return request(`/ams-base-parameter/institution/querybyid?id=${params}`);
}

// 机构类型词汇字典
export async function handleOrgTypeDictionary(par) {
  return request(`/ams-base-parameter/datadict/queryInfo?fcode=${par}`);
}

// 添加机构
export async function orgadd(params) {
  return request(`/ams-base-parameter/institution/addOrg`, {
    method: 'POST',
    data: params,
  });
}

// 查询分组下的产品信息 不分页 （当分组单独在一起时用该接口）
export async function handleGroupProduct(params) {
  return request(`/yss-base-admin/productgroupinfo/getgroupproduct?${stringify(params)}`);
}

// 查询分组下的产品信息 （当分组单独在一起时用该接口）
export async function handleGroupProduct1(params) {
  return request(`/yss-base-admin/productgroupinfo/getgrouppro?${stringify(params)}`);
}

// 获取数据包
export async function handleMobileOnly(params) {
  return request(`/yss-base-admin/user/getuserbymobile?mobile=${params}`);
}

// 查询用户权限完整数据包
export async function getAllData(params) {
  return request(`/yss-base-admin/userproduct/getuserauthed?${stringify(params)}`);
}

// 校验分组下是否有分组
export async function handleCheckChild(params) {
  return request(`/yss-base-admin/productgroup/checkchild?groupId=${params}`);
}

// 校验分组下是否有产品
export async function handleCheckGroup(params) {
  return request(`/yss-base-admin/productgroupinfo/checkgroup?groupId=${params}`);
}

// 查询全部产品，不分页
export async function handleAllProduct(params) {
  return request(`/yss-base-admin/userproduct/selectproductlist`, {
    method: 'POST',
    data: params,
  });
}

// 校验分组下是否有产品登录名是否存在
export async function handleCheckUserCode(params) {
  return request(`/yss-base-admin/user/checkusercode/${params}`);
}

// 归属系统词汇
export async function getDictList(params) {
  return request(`/ams-base-parameter/datadict/queryInfoByList?${stringify(params)}`);
}

// 根据机构类型获取结构列表
export async function getDeptAPI(params) {
  return request(`/ams-base-parameter/organ/getDept?${stringify(params)}`);
}

// 岗位新增
export async function saveJobAPI(params) {
  return request(`/yss-base-admin/positionInfo/add`, {
    method: 'POST',
    data: params,
  });
}

// 修改岗位
export async function updateJobAPI(params) {
  return request(`/yss-base-admin/positionInfo/update`, {
    method: 'POST',
    data: params,
  });
}

// 岗位详情
export async function detailJobAPI(params) {
  return request(`/yss-base-admin/positionInfo/detail?${stringify(params)}`);
}

// 获取当前用户有的岗位列表
export async function getCurrentUserJobList(sysId) {
  return request(`/yss-base-admin/positionInfo/getPositionByUser?sysId=${sysId}`);
}

// 获取岗位包含的角色
export async function getRoleByPositionsAPI(params) {
  return request(`/yss-base-admin/positionInfo/getRoleByPositions`, {
    method: 'POST',
    data: params,
  });
}

// ---------底稿------------
// 查询底稿类型树
export async function handleDGTreeAPI() {
  return request(`/yss-base-admin/user/getUserAuthProjectTypes`);
}

// 查询底稿类中产品
export async function handleDGProjectsAPI(params) {
  return request(`/yss-base-admin/user/getUserAuthProjects?${stringify(params)}`);
}

// 获取用户当前权限产品
export async function getUserAuthorityAPI(params) {
  return request(`/yss-base-admin/user/getUserProjectAuth?${stringify(params.query)}`, {
    method: 'POST',
    data: params.body,
  });
}
