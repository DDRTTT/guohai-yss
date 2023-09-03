import { stringify } from 'qs';
import request from '../../utils/request';
import { getUserMenu } from '../../common/basicResources';

const uri = '/yss-base-admin/menu';

export async function init(menuTree) {
  return request(`${uri}/init`, {
    method: 'POST',
    data: menuTree,
  });
}

export async function menuTree(queryParameters) {
  return getUserMenu(queryParameters);
}

export async function allmenutree() {
  return request(`/yss-base-admin/user/allmenutree`);
}

export async function menuMTree(queryParameters) {
  return request(`/yss-base-admin/menu/menutree?${stringify(queryParameters)}`);
}

export async function geturi(queryParameters) {
  return request(`/yss-base-admin/resource/getByUrlAndType?${stringify(queryParameters)}`);
}

export async function GetUserTYPE() {
  return request(`/test/ams/user/type`);
}

export async function query({ current, pageSize, queryParameters }) {
  return request(
    `/yss-base-admin/resource/getMenuResource?${stringify({
      currentPage: current,
      pageSize,
      menuId: queryParameters.id,
    })}`,
  );
}

export async function add({ id, action }) {
  return request(`/yss-base-admin/resource/groupUriToMenu`, {
    method: 'PUT',
    data: action,
  });
}

export async function edit(values) {
  return request(`/yss-base-admin/resource/groupUriToMenu`, {
    method: 'PUT',
    data: values,
  });
}

export async function del(id) {
  return request(`/yss-base-admin/resource/delMenuUri?id=${id}`, {
    method: 'DELETE',
  });
}
