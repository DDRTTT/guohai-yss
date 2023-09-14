import { stringify } from 'qs';
import request from '@/utils/request';
import { getUserMenu } from '@/common/basicResources';

const uri = '/yss-base-admin/menu';

export async function init(menuTrees: any) {
  return request(`${uri}/init`, {
    method: 'POST',
    data: menuTrees,
  });
}

export async function menuTree(queryParameters: any) {
  return getUserMenu(queryParameters);
}

export async function allmenutree() {
  return request(`/yss-base-admin/user/allmenutree`);
}

export async function menuMTree(queryParameters: any) {
  return request(`/yss-base-admin/menu/menutree?${stringify(queryParameters)}`);
}

export async function geturi(queryParameters: any) {
  return request(`/yss-base-admin/resource/getByUrlAndType?${stringify(queryParameters)}`);
}

export async function AddAuthPointToAdmin(value: any) {
  return request(`/yss-base-admin/role/addAuthPointToAdmin`, {
    method: 'POST',
    data: value,
  });
}

export async function GetUserTYPE() {
  return request(`/test/ams/user/type`);
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
    `/yss-base-admin/resource/getMenuResource?${stringify({
      currentPage: current,
      pageSize,
      menuId: queryParameters.id,
    })}`,
  );
}

export async function add({ action }: { action: any }) {
  return request(`/yss-base-admin/resource/groupUriToMenu`, {
    method: 'PUT',
    data: action,
  });
}

export async function edit(values: any) {
  return request(`/yss-base-admin/resource/groupUriToMenu`, {
    method: 'PUT',
    data: values,
  });
}

export async function del(id: any) {
  return request(`/yss-base-admin/resource/delMenuUri?id=${id}`, {
    method: 'DELETE',
  });
}
