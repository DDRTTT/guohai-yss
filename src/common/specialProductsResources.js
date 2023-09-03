import { stringify } from 'qs';
import { MOCK } from '@/utils/session';
import { ENV } from '@/utils/env';
import request from '@/utils/request';

/*
 * 项目级别 ——————所有路径资源统一管理
 **************************必读********************
 *
 * 按钮管理功能管理：
 *    新增：     add
 *    删除：     delete
 *    修改：     update
 *    查询：     query
 *    审核：     check
 *    跳转：     link
 *    其他：     根据实际情况自定义
 *
 * 字段说明：
 *    code      菜单代码
 *    name      菜单名称
 *    icon      菜单对应的图标
 *    parent    父级菜单id
 *    order     同级别菜单顺序号
 *    children  子级菜单信息
 *    actions   功能按钮信息
 *    ｛
 *        code      按钮功能代码   例如  父级菜单:add
 *        name      按钮名称             资源新增
 *        url       资源地址             /ams....
 *        type      类型 but url         现在默认为btn
 *        method    请求类型 GET POST PUT DELETE  ---注意全部大写    POST
 *    ｝
 *
 *    说明：现菜单树开发过程中无特殊情况默认为二级菜单
 *    一级菜单说明：
 *    id 编写规则 默认为3位  101 起依次递增
 *    code  为菜单的唯一标识，不可重读，添加的时候必须坚持该code是否已经存在。
 *
 *    二级菜单说明：
 *    id 编写规则 默认为6位 前3位为父级id 如 ： 101001 依次递增
 *    code  为菜单的唯一标识，不可重读，添加的时候必须坚持该code是否已经存在。
 *    actions 为该菜单下的功能点，
 *    {
 *        id        编写规则 默认为9位 前6位为父级id 如 ： 101001001 依次递增
 *        code      按钮功能代码   例如  父级菜单:add      不可以重复
 *        name      按钮名称             资源新增
 *        url       资源地址             /ams....
 *        type      类型 but url         现在默认为btn
 *        method    请求类型 GET POST PUT DELETE  ---注意全部大写    POST
 *    }
 * */

/**
 * 说明： 一级菜单一定要加path字段值为''(空字符串)
 */

// 专项产品
const specialProductsResources = [
  {
    id: 101,
    code: 'specialProducts',
    name: '专项产品',
    title: '专项产品',
    icon: '',
    description: '',
    children: [],
    actions: [],
    path: '',
  },
];

/**
 * 左侧菜单控制，统一入口
 * @method  getUserMenu
 * @return  {object}
 * @param queryParameters {string}
 */
export function getUserMenu(queryParameters) {
  if (ENV === MOCK) {
    return {
      status: 200,
      data: specialProductsResources,
    };
  }
  // if (getMenu()) {
  //   return JSON.parse(getMenu());
  // }
  return request(`/yss-base-admin/user/menutree?${stringify(queryParameters)}`);
}

export default specialProductsResources;
