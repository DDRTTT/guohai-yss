import { stringify } from 'qs';
import request from '@/utils/request';
import { getUserMenu } from '@/common/basicResources';
import * as type from '../type';

export async function menuTree(queryParameters: any) {
  return getUserMenu(queryParameters);
}

export async function allmenutree() {
  return request(`/yss-base-admin/user/allmenutree`);
}

export async function menuMTree(queryParameters: any) {
  return request(`/yss-base-admin/menu/menutree?${stringify(queryParameters)}`);
}

export async function query({
  current,
  pageSize,
  queryParameters,
}: {
  current: any;
  pageSize: any;
  queryParameters: any;
}) {
  return request(
    `/yss-base-admin/menu/querySecondMenu?${stringify({
      currentPage: current,
      pageSize,
      id: queryParameters.id,
    })}`,
  );
}

export async function add(menu: any) {
  return request(`/yss-base-admin/menu/addMenu`, {
    method: 'POST',
    data: menu,
  });
}

export async function edit(values: any) {
  return request(`/yss-base-admin/menu/editMenu`, {
    method: 'PUT',
    data: values,
  });
}

export async function del(id: any) {
  return request(`/yss-base-admin/menu/delMenu?id=${id}`, {
    method: 'DELETE',
    // data: {fid:id}
  });
}

export async function save(menu: any) {
  return request(`/yss-base-admin/menu/saveorder`, {
    method: 'POST',
    data: menu,
  });
}

export async function init(parameter: any) {
  return request(`/yss-base-admin/menu/initsystemmenu?sysId=${parameter.sysId}`, {
    method: 'POST',
    data: { menuVoList: parameter.menuVoList },
  });
}

// 导出菜单
export async function EXPORT_MENU_API(parameters: { id: string | number; sysId: string | number }) {
  return request(`${type.EXPORT_MENU_API}?${stringify(parameters)}`);
}
