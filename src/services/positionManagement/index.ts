import request from '@/utils/request';
import { stringify } from 'qs';

interface listParams {
  currentPage: number;
  pageSize: number;
  orgId?: number;
  deptId?: number;
  code?: string;
  name?: string;
  sysId?: number;
}

interface roleReviewParams {
  ids: Array<number>; // 批量审核时以英文逗号分割
  check: number; // 1:审核，0:反审核
}

interface codeListParams {
  codeList: string;
}

interface addParams {
  orgId: number; //归属机构
  sysId: number; //归属系统
  deptId: number; //归属机构
  name: string; //名称
  code?: string; //部门编码
  remark?: string; //备注
}

const uri = '/yss-base-admin/positionInfo';

// 角色列表
export async function getPositionLists(payload: listParams) {
  return request<Record<any, any>>(`${uri}/queryPage`, {
    method: 'POST',
    data: { ...payload },
  });
}

// 复核，反复核
export async function positionReview({ ids, check }: roleReviewParams) {
  return request<Record<any, any>>(
    `${uri}/checkList?${stringify({
      ids,
      check,
    })}`,
  );
}

// 归属系统词汇
export async function getDictList(codeList: codeListParams) {
  return request(`/ams-base-parameter/datadict/queryInfoByList?${stringify(codeList)}`);
}

// 获取当前用户有的岗位列表
export async function getRoleList(sysId: string) {
  return request(`/yss-base-admin/positionInfo/getPositionByUser?sysId=${sysId}`);
}

// 岗位删除
export async function handleDelPosition(id: string) {
  return request(`${uri}/delList?ids=${id}`);
}

// 岗位详情
export async function detailPosition(params: string) {
  return request(`${uri}/detail?${stringify(params)}`);
}

// 岗位新增
export async function addPosition(params: addParams) {
  return request(`${uri}/add`, {
    method: 'POST',
    data: params,
  });
}

// 修改岗位
export async function updatePosition(params: addParams) {
  return request(`${uri}/update`, {
    method: 'POST',
    data: params,
  });
}
