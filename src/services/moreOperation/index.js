/**
 *Create on 2020/9/24.
 */

import request from '@/utils/request';

const serverUrl = apiName => {
  return `/api${apiName}`;
};
const serverPre = serverUrl;
const serverName = '/billow-diplomatic';

// 认领
export async function handleDealClaimAPI(params) {
  return request(serverPre(`${serverName}/todo-task/claim-task`), {
    method: 'POST',
    data: params,
  });
}

// 委托
export async function handleDealDelegationAPI(params) {
  return request(serverPre(`${serverName}/todo-task/entrust-task`), {
    method: 'POST',
    data: params,
  });
}

// 结束
export async function handleDealEndAPI(params) {
  return request(serverPre(`${serverName}/todo-task/end-task`), {
    method: 'POST',
    data: params,
  });
}

// 移交
export async function handleDealTransferAPI(params) {
  return request(serverPre(`${serverName}/todo-task/transfer-task`), {
    method: 'POST',
    data: params,
  });
}

// 退回
export async function handleDealRejectAPI(params) {
  return request(serverPre(`${serverName}/todo-task/reject-task`), {
    method: 'POST',
    data: params,
  });
}

// 传阅
export async function handleDealCirculateAPI(params) {
  return request(serverPre(`${serverName}/todo-task/circulate-task`), {
    method: 'POST',
    data: params,
  });
}

// 跳过
export async function handleDealSkipAPI(params) {
  return request(serverPre(`${serverName}/task-track/skip`), {
    method: 'POST',
    data: params,
  });
}

// 可跳过节点查询
export async function handleDealCanSkipListAPI(params) {
  return request(serverPre(`${serverName}/task-track/skip-task-nodes`), {
    method: 'get',
    params,
  });
}

// 可退回节点查询
export async function handleQueryCanRejectListAPI(taskId) {
  console.log('taskId', taskId);
  return request(serverPre(`${serverName}/todo-task/reject-nodes/${taskId}`));
}

// 传阅列表查询
export async function queryCirculateListAPI(params) {
  return request(serverPre(`${serverName}/todo-task/circulate-list`), {
    method: 'POST',
    data: params,
  });
}

// 取回
export async function dealWithdrawAPI(taskId) {
  return request(serverPre(`${serverName}/task-track/withdraw-task?taskId=${taskId}`), {
    method: 'POST',
    data: params,
  });
}

// 任务跟踪
// 接手
export async function dealTakeOverAPI(taskId) {
  return request(serverPre(`${serverName}/task-track/take-task?taskId=${taskId}`));
}

// 可委托人列表
export async function handleQueryDelegationUserListAPI() {
  // return request(serverPre(`/auth-user-center/user/dicts`));
  return request(serverPre(`/yss-base-billows/user/list`));
}

// 批量认领
export async function batchTaskClaim(params) {
  return request(serverPre(`${serverName}/todo-task/claim-task-batch`), {
    method: 'POST',
    data: params.taskIds,
  });
}

// 批量委托
export async function batchTaskEntrust(params) {
  return request(serverPre(`${serverName}/todo-task/entrust-task-batch`), {
    method: 'POST',
    data: params,
  });
}

// 批量传阅
export async function batchTaskCirculate(params) {
  return request(serverPre(`${serverName}/todo-task/circulate-task-batch`), {
    method: 'POST',
    data: params,
  });
}

// 批量退回
export async function batchTaskReject(params) {
  return request(serverPre(`${serverName}/todo-task/reject-task-batch`), {
    method: 'POST',
    data: params,
  });
}

// 批量移交
export async function batchTaskTransfer(params) {
  return request(serverPre(`${serverName}/todo-task/transfer-task-batch`), {
    method: 'POST',
    data: params,
  });
}
