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

// 资金运用
const fundApplication = [
  {
    id: 101,
    code: 'orderManagement',
    name: '划款指令管理',
    title: '划款指令管理',
    icon: '',
    description: '',
    children: [
      {
        id: 101001,
        code: 'repaymentInstructions',
        path: 'orderManagement/repaymentInstructions',
        name: '划款指令',
        title: '划款指令',
        icon: '',
        href: '',
        description: '',
        actions: [
          {
            id: 101001001,
            code: 'repaymentInstructions:query',
            name: '任务列表查询',
            method: 'POST',
            type: 'btn',
            description: '任务列表查询',
            uri: '/transfer/transferList',
            uriFlag: '/yss-lifecycle-flow',
          },
          {
            id: 101001002,
            code: 'repaymentInstructions:check',
            name: '办理',
            method: 'GET',
            type: 'btn',
            description: '办理',
            uri: '/taskDeal',
            uriFlag: '/processCenter',
          },
          {
            id: 101001003,
            code: 'repaymentInstructions:transferHistory',
            name: '流转历史',
            method: 'GET',
            type: 'uri',
            description: '流转历史',
            uri: '/processHistory',
            uriFlag: '/processCenter',
          },
          {
            id: 101001004,
            code: 'repaymentInstructions:details',
            name: '详情',
            method: 'POST',
            type: 'uri',
            description: '详情',
            uri: '/processDetail',
            uriFlag: '/processCenter',
          },
          {
            id: 101001005,
            code: 'repaymentInstructions:revoke',
            name: '撤销',
            method: 'POST',
            type: 'btn',
            description: '撤销',
            uri: '/transfer/audit/status/callback',
            uriFlag: '/yss-lifecycle-flow',
          },
          {
            id: 101001006,
            code: 'repaymentInstructions:checks',
            name: '批量办理',
            method: 'POST',
            type: 'btn',
            description: '批量办理',
            uri: '/transfer/audit-batch/pass',
            uriFlag: '/yss-lifecycle-flow',
          },
          {
            id: 101001007,
            code: 'repaymentInstructions:uploads',
            name: '批量上传',
            method: 'POST',
            type: 'btn',
            description: '批量上传',
            uri: '/transfer/batch-upload/contract/archives',
            uriFlag: '/yss-lifecycle-flow',
          },
          {
            id: 101001008,
            code: 'repaymentInstructions:export',
            name: '导入PDF生成费用划款指令',
            method: 'POST',
            type: 'btn',
            description: '导入PDF生成费用划款指令',
            uri: '/transfer/uploadInstructionfile',
            uriFlag: '/yss-lifecycle-flow',
          },
          {
            id: 101001009,
            code: 'repaymentInstructions:add',
            name: '新增费用划款指令',
            method: 'POST',
            type: 'uri',
            description: '新增费用划款指令',
            uri: '/费用划款指令/8aaa817e7fda71a9017ffcf5893c0001/新增费用划款指令',
            uriFlag: '/dynamicPage/pages',
          },
          {
            id: 1010010010,
            code: 'repaymentInstructions:recall',
            name: '撤回',
            method: 'POST',
            type: 'uri',
            description: '撤回',
            uri: '/transfer/withdraw',
            uriFlag: '/yss-lifecycle-flow',
          },
        ],
      },
      {
        id: 101002,
        code: 'expenseList',
        path: 'orderManagement/expenseList',
        name: '费用列表',
        title: '费用列表',
        icon: '',
        href: '',
        description: '',
        actions: [
          {
            id: 101002001,
            code: 'expenseList:query',
            name: '列表查询',
            method: 'POST',
            type: 'btn',
            description: '列表查询',
            uri: '/receipt/list',
            uriFlag: '/yss-lifecycle-flow',
          },
          {
            id: 101002002,
            code: 'expenseList:check',
            name: '获取余额',
            method: 'GET',
            type: 'btn',
            description: '获取余额',
            uri: '/receipt/saveReceipt',
            uriFlag: '/yss-lifecycle-flow',
          },
          {
            id: 101002003,
            code: 'expenseList:create',
            name: '生成费用划款指令',
            method: 'GET',
            type: 'uri',
            description: '生成费用划款指令',
            uri: '/费用划款指令/8aaa82777faabb58017fd368bfe00001/新增费用划款指令',
            uriFlag: '/dynamicPage/pages',
          },
        ],
      },
    ],
    actions: [],
    path: '',
  },
  {
    id: 102,
    code: 'fundUtilizationManagement',
    name: '资金运用管理',
    title: '资金运用管理',
    icon: '',
    description: '',
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
      data: fundApplication,
    };
  }
  // if (getMenu()) {
  //   return JSON.parse(getMenu());
  // }
  return request(`/yss-base-admin/user/menutree?${stringify(queryParameters)}`);
}

export default fundApplication;
