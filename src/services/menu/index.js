import { stringify } from 'qs';
import request from '../../utils/request';
import { getUserMenu } from '../../common/basicResources';

const uri = '/yss-base-admin/menu';

export async function menuTree(queryParameters) {
  return getUserMenu(queryParameters);
}

export async function allmenutree() {
  return request(`/yss-base-admin/user/allmenutree`);
}

export async function menuMTree(queryParameters) {
  return request(`/yss-base-admin/menu/menutree?${stringify(queryParameters)}`);
}

export async function query({ current, pageSize, queryParameters }) {
  return request(
    `/yss-base-admin/menu/querySecondMenu?${stringify({
      currentPage: current,
      pageSize,
      id: queryParameters.id,
    })}`,
  );
}

export async function add(menu) {
  return request(`/yss-base-admin/menu/addMenu`, {
    method: 'POST',
    data: menu,
  });
}

export async function edit(values) {
  return request(`/yss-base-admin/menu/editMenu`, {
    method: 'PUT',
    data: values,
  });
}

export async function del(id) {
  return request(`/yss-base-admin/menu/delMenu?id=${id}`, {
    method: 'DELETE',
    // data: {fid:id}
  });
}

export async function save(menu) {
  return request(`/yss-base-admin/menu/saveorder`, {
    method: 'POST',
    data: menu,
  });
}

export async function init(parameter) {
  return request(`/yss-base-admin/menu/initsystemmenu?sysId=${parameter.sysId}`, {
    method: 'POST',
    data: { menuVoList: parameter.menuVoList },
  });
}

// 导出菜单
export async function EXPORT_MENU_API(parameters) {
  return request(`${type.EXPORT_MENU_API}?${stringify(parameters)}`);
}
