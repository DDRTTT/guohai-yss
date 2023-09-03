/**
 *Create on 2020/7/7.
 */

// 基础信息（登录 获取个人信息）
import { getToken, getUserDetailById } from './global';
// 产品募集期调整 列表（搜索）
import { getDict, getTaskList } from './marketAgent';
// 词汇列表
import { getDictategoryQuery, getByConditions, menutree } from './baseInfo';

export default {
  // 登录
  'POST /mock/ams/yss-base-admin/jwt/token': getToken,

  // 词汇字典获取
  'GET /mock/ams/common/dict/item/search': getDict,

  // 产品募集期调整 列表（搜索）
  'POST /mock/ams/raiseDateAdjustment/taskList': getTaskList,

  // 获取个人信息
  'GET /mock/ams/yss-base-admin/userdetail/getUserDetailById': getUserDetailById,

  // 词汇列表
  'GET /mock/ams/ams-base-parameter/dictategory/query': getDictategoryQuery,
  // 资源详情
  'GET /mock/ams/yss-base-admin/resource/getByConditions': getByConditions,

  // 菜单树
  'GET /mock/ams/yss-base-admin/menu/menutree?needAction=true&queryStr=': menutree,
};
