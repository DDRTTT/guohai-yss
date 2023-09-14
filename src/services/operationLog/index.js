import { stringify } from 'qs';
import request from '@/utils/request';

const uri = '/yss-base-log/log';

// 模块操作总数量统计
export async function handleStatislog(params) {
  return request(`${uri}/statislog`, {
    method: 'POST',
    data: params,
  });
}

// 折线图
export async function handleLineChart(params) {
  return request(`${uri}/statislinelog`, {
    method: 'POST',
    data: params,
  });
}

// 饼图
export async function handlePieChart(params) {
  return request(`${uri}/statispielog`, {
    method: 'POST',
    data: params,
  });
}

// 模块操作总数量统计
export async function handlehandleServiceModule(par) {
  return request(`${uri}/LogQuery-api/serviceModule?code=${par}`);
}

// 维度
export async function handleVocabularyDictionary(par) {
  return request(`/ams-base-parameter/datadict/queryInfo?fcode=${par}`);
}

// 第一页table
export async function handleSearchGroup(params) {
  return request(`${uri}/searchgroup`, {
    method: 'POST',
    data: params,
  });
}

//
export async function searchBusGroup(params) {
  return request(`${uri}/searchBusGroup`, {
    method: 'POST',
    data: params,
  });
}

export async function searchStackGroup(params) {
  return request(`${uri}/searchStackGroup`, {
    method: 'POST',
    data: params,
  });
}

// 新建页面table
export async function handleSearchtimevaguedata(params) {
  return request(`${uri}/searchtimevaguedata`, {
    method: 'POST',
    data: params,
  });
}

export async function handleSearchtimevaguedata2(params) {
  return request(`${uri}/searchBusLogList`, {
    method: 'POST',
    data: params,
  });
}

// 日志详情
export async function handleLogDetails(params) {
  return request(`${uri}/querybyid?${stringify(params)}`, {
    method: 'POST',
    data: params,
  });
}

// 日志详情
export async function handleLogDetails2(params) {
  return request(`${uri}/searchBusLogById?${stringify(params)}`, {
    method: 'POST',
    data: params,
  });
}

// 堆栈日志
export async function handleLogStack(params) {
  return request(`${uri}/searchstacklog`, {
    method: 'POST',
    data: params,
  });
}

// 堆栈日志
export async function handleLogStack2(params) {
  return request(`${uri}/searchStackLog`, {
    method: 'POST',
    data: params,
  });
}
