// 策略的接口文件
import request from '@/utils/request';
import { deletNUllProperty } from '@/utils/utils';
const uri = '/yss-base-calendar';
// const uri = '/gl';
const uriLife = '/yss-lifecycle-flow';
const uriBase = '/yss-base-admin';

/**
 * 获取系统设置目录
 */
export function getSetPath(params) {
  deletNUllProperty(params);
  return request.get(`${uri}/notice/getSetPath`, {
    params,
  });
}
/**
 * 获取办理策略列表
 */
export function getHandleStrategyList(params) {
  deletNUllProperty(params);
  return request.get(`${uri}/calendarClassify/getHandleStrategyList`, {
    params,
  });
}

// 获取用户所有的日历策略
export function getAllByUser(params) {
  deletNUllProperty(params);
  return request.get(`${uri}/scheduleStrategy/getAllByUser`, {
    params,
  });
}
// 新增或修改日历策略
export function scheduleStrategyAdd(params) {
  deletNUllProperty(params);
  return request.post(`${uri}/scheduleStrategy/add`, {
    data: params,
  });
}
// 删除日程策略
export function scheduleStrategyDelete(params) {
  deletNUllProperty(params);
  return request.get(`${uri}/scheduleStrategy/deleteById`, {
    params,
  });
}
// 全量获取样式设置的数据
export function getAllSys(params) {
  deletNUllProperty(params);
  return request.get(`${uri}/calendarColor/getAllSys`, {
    params,
  });
}
// 添加系统颜色模版设置
export function addBatchSys(params) {
  return request.post(`${uri}/calendarColor/addBatchSys`, {
    data: params,
  });
}
// 删除模版
export function deleteByName(params) {
  return request.post(`${uri}/calendarColor/deleteByName`, {
    data: params,
  });
}
// 获取用户目前的颜色设置
export function getPer(params) {
  return request.get(`${uri}/calendarColor/getPer`, {
    params,
  });
}
// 批量新增或修改个人颜色
export function addBatchPer(params) {
  return request.post(`${uri}/calendarColor/addBatchPer`, {
    data: params,
  });
}

// 获取用户的提醒策略列表
export function getRemindList(params) {
  return request.get(`${uri}/remindStrategy/getRemindList`, {
    params,
  });
}

// 新增会修改个人提醒策略
export function addPeople(params) {
  return request.post(`${uri}/remindStrategy/addPeople`, {
    data: params,
  });
}
// 删除提醒策略
export function deleteById(params) {
  return request.get(`${uri}/remindStrategy/deleteById`, {
    params,
  });
}
// 获取用户的办理列表
export function getHandleList(params) {
  return request.get(`${uri}/handleStrategy/getHandleList`, {
    params,
  });
}
// 获取用户的办理列表
export function handleStrategyAdd(params) {
  return request.post(`${uri}/handleStrategy/add`, {
    data: params,
  });
}
// 获取用户的办理列表
export function handleStrategyDeleteById(params) {
  return request.get(`${uri}/handleStrategy/deleteById`, {
    params,
  });
}
// 获取当前用户目前已经启用的日历策略
export function getEnableByUser(params) {
  return request.get(`${uri}/scheduleStrategy/getEnableByUser`, {
    params,
  });
}
// 新增或修改办理状态
export function taskHandleAdd(params) {
  return request.post(`${uri}/taskHandle/add`, {
    data: params,
  });
}
