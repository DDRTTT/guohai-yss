import request from '@/utils/request';
import { getUserMenu } from '@/common/basicResources';

// 收到消息以后的反馈
export async function feedback(parameters) {
  return request('/yss-base-calendar/taskHandle/updateRemindStatus', {
    method: 'POST',
    data: parameters,
  });
}
// 消息初始化接口
export async function msgInit(parameters) {
  return request('/yss-base-calendar/bell/getInitMsgList', {
    method: 'get',
    params: parameters,
  });
}
// 消息初始化接口
export async function getTaskDetail(parameters) {
  return request.get(`/yss-base-calendar/bell/getDetail?id=${parameters.id}`);
}

// 获取流程引擎未读消息列表
export async function queryMail(parameters) {
  return request('/api/amc-message-center/mail_info/queryMail', {
    method: 'post',
    data: parameters,
  });
}

// 流程引擎单条标记已读
export async function updateOneRead(messageId) {
  return request(`/api/amc-message-center/mail_info/updateAlreadyRead/${messageId}`, {
    method: 'get',
  });
}

// 流程引擎全部标记已读
export async function updateAllRead() {
  return request.get(`/api/amc-message-center/mail_info/updateAllRead`);
}
// 流程引擎批量标记已读
export async function updateSomeRead(params) {
  return request.post(`/api/amc-message-center/mail_info/updateBatchRead`, { data: params });
}

export async function query() {
  return request('/api/users');
}

export async function queryCurrent() {
  return request('/yss-base-admin/userdetail/getUserDetailById');
}

export async function queryNotices() {
  return request('/api/notices');
}

export async function checktoken() {
  return request('/yss-base-admin/jwt/verify');
}

export async function tokenRefresh() {
  return request('/yss-base-admin/jwt/refresh');
}

export async function handleGetMenuAPI(parameters) {
  return getUserMenu(parameters);
}

// 获取未读消息数量
export async function getCountUnreadAPI() {
  return request('/yss-base-calendar/bell/getUnreadMsgCount');
}

// 将未读消息全部标为已读
export async function getAsReadAPI() {
  return request('/yss-base-calendar/taskHandle/updateAllUserTaskReadState');
}

// 消息列表查询
export async function getUnreadMsgListAPI(parameters) {
  return request('/yss-base-calendar/bell/getUnreadMsgList', {
    method: 'POST',
    data: parameters,
  });
}


// 动态列保存
export async function dynamicColumnSave(params) {
  return request('/ams-base-admin/dynamic/column/save', {
    method: 'POST',
    data: params,
  });
}
// 动态列获取
export async function dynamicColumnList(pageCode) {
  return request('/ams-base-admin/dynamic/column/list?pageCode=' + pageCode, {
    method: 'GET',
  });
}
// 动态列删除
export async function dynamicColumnDelete(pageCode) {
  return request('/ams-base-admin/dynamic/column/delete?pageCode=' + pageCode, {
    method: 'DELETE',
  });
}
