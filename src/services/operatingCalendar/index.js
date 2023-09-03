import request from '@/utils/request';
import { deletNUllProperty } from '@/utils/utils';

// const uri = '/ams-base-admin';
// const uri = '/gl';
const uri = '/yss-base-calendar';
const uriLife = '/yss-lifecycle-flow';
const uriBase = '/yss-base-admin';

// 象限视图列表
export function queryQuadrant(params) {
  deletNUllProperty(params);
  return request.post(`${uri}/notice/queryQuadrant`, {
    data: params,
  });
}

/**
 * 运营日历 象限视图 新接口
 */
// export function queryQuadrant(params) {
//   console.log(JSON.stringify(params));

//   deletNUllProperty(params);
//   return request.get(
//     `${uriLife}/task-query/quadrant-calendar?executeTime=${params['executeTime']}&gradeList=${params['gradeList']}`,
//   );
// }
/**
 * 获取日历的筛选条件
 */
export function getFilter(params) {
  deletNUllProperty(params);
  return request.get(`${uri}/notice/getFilter`, {
    params,
  });
}
/**
 * 获取任务类型的字典
 */
export function getAllSubInfo(params) {
  deletNUllProperty(params);
  return request.get(`${uri}/calendarClassify/getAllSubInfo`, {
    params,
  });
}
/**
 * 获取二级任务类型的字典
 * 参数名：code  值：customItems
 */
export function getSecSubInfo(params) {
  deletNUllProperty(params);
  return request.get(`${uri}/calendarClassify/getSubInfo`, {
    params,
  });
}
/**
 * 获取订阅列表
 */
export function getInfoByUser(params) {
  deletNUllProperty(params);
  return request.get(`${uri}/calendarSubscribe/getInfoByUser`, {
    params,
  });
}
/**
 * 修改订阅状态
 */
export function subscribeChange(params) {
  deletNUllProperty(params);
  return request.post(`${uri}/calendarSubscribe/add`, {
    data: params,
  });
}

/**
 * 获取分类的任务列表
 */
export function queryInfoListByCode(params) {
  return request.post(`${uri}/notice/queryInfoListByCode`, {
    data: params,
  });
}

/**
 * 获取三个tab的值
 */
export function getTabList(params) {
  deletNUllProperty(params);
  return request.get(`${uri}/calendarClassify/getFirst`, {
    params,
  });
}
// 查询待办任务通知
export function querylist(params) {
  deletNUllProperty(params);
  return request.post(`${uri}/notice/queryMsgListByTime`, {
    data: params,
  });
}
// 查询交易所休息日
export function getHoliday(params) {
  deletNUllProperty(params);
  return request.post(`${uri}/holiday/getHoliday`, {
    data: params,
  });
}
// 添加任务
export function addTask(params) {
  deletNUllProperty(params);
  let userList = null;
  if (params['userList']) {
    userList = params['userList'];
    delete params['userList'];
  }
  return request.post(`${uri}/bell/addTask${userList ? '?userList=' + userList : ''}`, {
    data: params,
  });
}
// 完成/取消完成任务
export function updateHandleSchedul(params) {
  deletNUllProperty(params);
  return request.post(`${uri}/notice/updateHandleSchedul?flag=${params.flag}`, {
    data: [params.ids],
  });
}
// 获取产品视图的接口
export function stackedBarChart(params) {
  deletNUllProperty(params);
  return request.get(`${uriLife}/task-query/stackedBarChart`, { params });
}
// 通过id去查询单条消息详情
export function queryMsgById(params) {
  deletNUllProperty(params);
  return request.get(`${uri}/notice/queryMsgById?id=${params.id}`);
}
// 修改任务
export function updateTask(params) {
  deletNUllProperty(params);
  return request.post(`${uri}/bell/updateTask`, {
    data: params,
  });
}

// 获取产品名称下拉列表
export function getProductEnum(params) {
  return request.get(`${uriLife}/product/review/productEnum/search`, { params });
}
// 获取当前机构全部用户
export function getperson(params) {
  return request.get(`${uriBase}/user/getperson`, { params });
}

// 开放日设置列表
export function queryProductPeriodInfoList(params) {
  return request.post(`${uri}/productPeriodInfo/list`, {
    data: params,
  });
}

// 开放日设置新增
export function addProductPeriodInfo(params) {
  return request.post(`${uri}/productPeriodInfo/add`, {
    data: params,
  });
}

// 开放日设置删除
export function delProductPeriodInfo(id) {
  return request.get(`${uri}/productPeriodInfo/delLogic?id=${id}`);
}

// 产品全称/代码下拉列表
export async function getProNameAndCodeAPI() {
  return request(`${uriLife}/product/review/productEnum/search`);
}

// 请求 项目类型 下拉列表项
export function getProTypeListAPI() {
  return request(`/ams-base-parameter/datadict/queryInfo?fcode=K001`);
}