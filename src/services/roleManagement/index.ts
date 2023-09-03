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
  roleComIds: number[]; // 批量审核时以英文逗号分割
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
  dataStrategies: { strategyCode: string }[];
  positions: { id: number }[];
  functions: { id: number }[];
}

interface getPositionsTreeParams {
  processKeys?: string; // 流程key
  positionIds?: string; // 岗位id
  sysId: string; // 归属系统
}

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

// 创建角色
export async function createRole(params: createRoleParams) {
  return request<Record<any, any>>(`${uri}/add`, {
    method: 'POST',
    data: params,
  });
}

// 更新角色
export async function updateRole(params: createRoleParams) {
  return request<Record<any, any>>(`${uri}/update`, {
    method: 'POST',
    data: params,
  });
}

// 岗位列表
export async function getPositionsList(sysId: any) {
  return request<Record<any, any>>(`/yss-base-admin/positionInfo/getPositionByUser?sysId=${sysId}`);
}

// 功能组件权限树查询
export async function getRoleTree(params: any) {
  return request<Record<any, any>>(`/yss-base-admin/user/allmenutree?sysId=${params}`);
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

// 校验角色是否被使用
export async function checkRole({ roleComIds }: roleReviewParams) {
  return request<Record<any, any>>(`${uri}/delVerify?${stringify({ roleComIds })}`);
}

// 删除角色
export async function roleDelete({ roleComIds, check }: roleReviewParams) {
  return request<Record<any, any>>(`${uri}/delete?${stringify({ roleComIds, check })}`);
}

// 角色详情
export async function getRoleDetail(id: any) {
  return request<Record<any, any>>(`${uri}/detail?${stringify({ id })}`);
}

// 岗位组件权限树查询
export async function getPositionsTree({
  sysId,
  positionIds,
  processKeys,
}: getPositionsTreeParams) {
  return request<Record<any, any>>(
    `/yss-base-admin/positionInfo/getPositionFlowInfos?${stringify({
      sysId,
      positionIds,
      processKeys,
    })}`,
  );
}

// 重置密码
export async function restUserCode(params: { id: string }) {
  return request(`/yss-base-admin/user/ResetPwd/${params.id}`);
}

// 查询返显数据
export async function getSummary(id: any) {
  return request<Record<any, any>>(`${uri}/getSummary?id=${id}`);
}

// 获取产品类树
export async function GET_PRO_TREE_FUN() {
  return request(`${type.GET_PRO_TREE_API}`);
}

// 获取我的产品分组
export async function GET_PRO_GROUP_FUN() {
  return request<Record<any, any>>(`${type.GET_PRO_GROUP_API}`);
}

// 条件查询产品-分页
export async function GET_PRO_PAGINATION_FUN(params: { currentPage: number; pageSize: number }) {
  return request<Record<any, any>>(`${type.GET_PRO_PAGINATION_API}`, {
    method: 'POST',
    data: params,
  });
}

// 校验分组下是否有产品
export async function CHECK_GROUP_FUN(groupId: { parentGroupId: string }) {
  return request<Record<any, any>>(`${type.CHECK_GROUP_API}?${stringify({ groupId })}`);
}

// 添加/修改分组
export async function ADD_GROUP_FUN(productGroup: { groupName: string; parentId: string }) {
  return request<Record<any, any>>(`${type.ADD_GROUP_API}`, {
    method: 'POST',
    data: productGroup,
  });
}

// 获取全部产品code
export async function GET_ALL_PRO_CODE_FUN(params: any) {
  return request<Record<any, any>>(`${type.GET_ALL_PRO_CODE_API}`, {
    method: 'POST',
    data: params,
  });
}

// 删除分组
export async function DELETE_GROUP_FUN(params: string) {
  return request(`${type.DELETE_GROUP_API}/${params}`, {
    method: 'DELETE',
  });
}

// 查询分组中产品
export async function GET_GROUP_PRO_FUN(groupId: { groupId: string }) {
  return request<Record<any, any>>(`${type.GET_GROUP_PRO_API}?${stringify(groupId)}`);
}

// 查询底稿类型树
export async function GET_DG_PRO_TREE_FUN() {
  return request(`${type.GET_DG_PRO_TREE_API}`);
}

// 查询底稿类中产品
export async function GET_DG_PRO_PAGINATION_FUN(params: {
  currentPage: number;
  pageSize: number;
  proType: string;
  keyWords: string;
}) {
  return request<Record<any, any>>(`${type.GET_DG_PRO_PAGINATION_API}?${stringify(params)}`);
}
