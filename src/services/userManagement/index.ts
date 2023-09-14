import request from '@/utils/request';
import { stringify } from 'qs';
import * as type from '@/services/type';

interface listParams {
  currentPage: number; // 当前页码
  pageSize: number; // 每页条数
  like: string; // 模糊查询字符串
  deptId: number; // 模糊查询字符串
  sysId: number; // 模糊查询字符串
}

interface roleReviewParams {
  roleComIds: Array<number>; // 批量审核时以英文逗号分割
  check: number; // 1:审核，0:反审核
}

interface createRoleParams {
  id?: number; // 角色id
  orgId?: number; // 归属机构
  sysId: number; // 归属系统
  remark?: string; // 备注
  code: string; // 组件代码
  deptId: number; // 归属部门
  name?: string; // 组件名称
  type: number; // 角色类型0：授权 1：功能
  roleComIds: number; // 角色[id]
  dataStrategies: Array<{ strategyCode: string }>;
  positions: Array<{ id: number }>;
  functions: Array<{ id: number }>;
}

const baseUri = '/yss-base-admin';
const uri = '/yss-base-admin/rolecom';

// 角色列表
export async function getRoleList({ currentPage, pageSize, like, deptId, sysId }: listParams) {
  return request<Record<any, any>>(
    `${uri}/queryPage?${stringify({
      currPage: currentPage,
      pageSize,
    })}`,
    {
      method: 'POST',
      data: {
        like,
        deptId,
        sysId,
      },
    },
  );
}

// 查看用户权限详情
// @ts-ignore
export async function getuserauthed({ orgAuthedId, userAuthedId, sysId }) {
  return request<Record<any, any>>(
    // `${uri}/userproduct/getuserauthed?sysId=${sysId}&orgAuthedId=${orgAuthedId}&userAuthedId=${userAuthedId}`,
    `${baseUri}/userproduct/getGLAuserauthed?sysId=${sysId}&orgAuthedId=${orgAuthedId}&userAuthedId=${userAuthedId}`,
  );
}

// 更新用户信息
export async function updateUserInfo(params: any) {
  return request<Record<any, any>>(`${baseUri}/user/edit/${params.userId}`, {
    method: 'put',
    data: params,
  });
}

//角色变更
export async function modifyRole({ sysId, id, roleComIds }: createRoleParams) {
  return request<Record<any, any>>(`${uri}/modify?sysId=${sysId}`, {
    method: 'POST',
    data: {
      id,
      roleComIds,
    },
  });
}

// 创建角色
export async function createRole(params: createRoleParams) {
  return request<Record<any, any>>(`${uri}/add`, {
    method: 'POST',
    data: params,
  });
}

// 更新角色
export async function updateRole(params: createRoleParams) {
  return request<Record<any, any>>(`${baseUri}/update`, {
    method: 'POST',
    data: params,
  });
}

// 创建用户并授权
export async function authorize(params: any) {
  return request<Record<any, any>>(`${uri}/authorize`, {
    method: 'POST',
    data: params,
  });
}

// 查询用户被授权的角色组建id集合
// @ts-ignore
export async function queryRoleComByUser({ userId, sysId }) {
  return request<Record<any, any>>(`${uri}/queryRoleComByUser?userId=${userId}&sysId=${sysId}`);
}

// 根据归属系统查询可用角色组件集合
export async function queryBySys(params: any) {
  return request<Record<any, any>>(`${uri}/queryBySys?sysIds=${params}`);
}

// 岗位列表
export async function getPositionsList(sysId: any) {
  return request<Record<any, any>>(`${baseUri}/positionInfo/getPositionByUser?sysId=${sysId}`);
}

// 功能组件权限树查询
export async function getRoleTree(params: any) {
  return request<Record<any, any>>(`${baseUri}/user/allmenutree?sysId=${params}`);
}

// 复核，反复核
export async function roleReview({ roleComIds, check }: roleReviewParams) {
  return request<Record<any, any>>(
    `${uri}/check?${stringify({
      roleComIds,
      check,
    })}`,
  );
}

// 删除
export async function roleDelete({ roleComIds, check }: roleReviewParams) {
  return request<Record<any, any>>(
    `${uri}/delete?${stringify({
      roleComIds,
      check,
    })}`,
  );
}

// 角色详情
export async function getRoleDetail(id: any) {
  return request<Record<any, any>>(`${uri}/detail?${stringify({ id })}`);
}

// 根据归属系统查询可用角色组件集合
export async function getRoleSetBySysId(sysId: any) {
  return request<Record<any, any>>(`${uri}/queryBySys?sysIds=${sysId}`);
}

// ----------------------------------

// 根据用户名查询用户信息
export async function getInfoByUserName(name: string) {
  return request<Record<any, any>>(`${uri}/getEmployeeByName?${stringify({ name })}`);
}

// 冻结/解冻
export async function fetchUserFreeze({ userIds, freeze }: { userIds: string; freeze: number }) {
  return request<Record<any, any>>(`${baseUri}/user/freeze?${stringify({ userIds, freeze })}`);
}

// 注销用户
export async function fetchUserLogout({ list }: { list: string }) {
  return request<Record<any, any>>(`${baseUri}/user/delMember?${stringify({ list })}`, {
    method: 'DELETE',
  });
}

// 机构列表下拉
export async function getOrgList() {
  return request<Record<any, any>>(`/ams-base-parameter/institution/getOrgSpinner`);
}

// 便捷授权保存
export async function SAVE_QUICK_AUTH_API(params: any) {
  return request(`${type.SAVE_QUICK_AUTH_API}`, {
    method: 'POST',
    data: params,
  });
}

export async function getAllAuthorizeById(id: any) {
  return request(`/yss-base-admin/role/getrolebyroleid/${id}`);
}
export async function getPositionsTree(params: any) {
  return request(`/yss-base-admin/positionInfo/getPositionFlowInfos?${params}`);
}

// 便捷授权详情
export async function QUICK_AUTH_DETAIL_API({
  orgAuthedId,
  userAuthedId,
  sysId,
}: {
  orgAuthedId: any;
  userAuthedId: any;
  sysId: any;
}) {
  return request(
    `${type.QUICK_AUTH_DETAIL_API}&sysId=${sysId}&orgAuthedId=${orgAuthedId}&userAuthedId=${userAuthedId}`,
  );
}
