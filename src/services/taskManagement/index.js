import request from '@/utils/request';
import { stringify } from 'qs';
import { download } from '@/utils/download';

const uri = '/yss-awp-server';
// 项目任务列表
export function getTaskListAPI(params) {
  return request(`${uri}/awp/task/list`, {
    method: 'POST',
    data: params,
  });
}
// 项目任务类型数据字典
export function getTaskCodeAPI() {
  return request(`/ams-base-parameter/datadict/queryInfo?fcode=awp_task_type`);
}
// 项目阶段数据字典
export function getproStageAPI(params) {
  return request(`/ams-base-parameter/datadict/queryInfo?fcode=awp_pro_state`, {
    method: 'GET',
  });
}
// 项目类型数据字典
export function getProTypeAPI(params) {
  return request(`/ams-base-parameter/datadict/queryInfo?fcode=awp_pro_type`, {
    method: 'GET',
  });
}
// 项目区域数据字典
export function getProAreaAPI(params) {
  return request(`/ams-base-parameter/datadict/queryInfo?fcode=awp_pro_loca`, {
    method: 'GET',
  });
}

// 项目名称数据字典
export function getproNameAPI(params) {
  if (params) {
    return request(`${uri}/awp/common/project/option?type=${params.type}`, {
      method: 'GET',
    });
  } else {
    return request(`${uri}/awp/common/project/option`, {
      method: 'GET',
    });
  }
}
// 获取所有回显数据
export function getDateAPI(params) {
  return request(`${uri}/awp/common/project/info?projectId=${params}`, {
    method: 'GET',
  });
}
// 获取详情数据
export function getDetailAPI(params) {
  return request(`${uri}/awp/task/info?id=${params}`, {
    method: 'GET',
  });
}
// 任务名称
export function getTaskNameAPI(params) {
  return request(`/ams-base-parameter/datadict/queryInfo?fcode=${params}`, {
    method: 'GET',
  });
}
// 保存
export function onSaveAPI(params) {
  return request(`${uri}/awp/task/save`, {
    method: 'POST',
    data: params,
  });
}
// 提交
export function onSubmitAPI(params) {
  return request(`${uri}/awp/task/commit`, {
    method: 'POST',
    data: params,
  });
}
// 列表提交
export function listSubmitAPI(params) {
  return request(`${uri}/awp/task/commitById?id=${params.id}`, {
    method: 'POST',
    data: {},
  });
}
// 获取字列表
export function getChildrenListAPI(params) {
  return request(`${uri}/awp/task/handleInfo?id=${params}`, {
    method: 'GET',
  });
}
// 删除
export function deleteAPI(params) {
  return request(`${uri}/awp/task/delete/batch`, {
    method: 'POST',
    data: params,
  });
}
// 获取项目树
export function getSysTreeReqAPI(params) {
  return request(`${uri}/path/getSysTree?code=${params}`, {
    method: 'GET',
  });
}
//审核与反审核（批量）
export function auditAndDeAuditAPI(params) {
  return request(`${uri}/awp/task/process/audit`, {
    method: 'POST',
    data: params,
  });
}
//底稿归档任务办理列表提交
export function autoMaticAPI(params) {
  return request(`${uri}/awp/task/process/launch/automatic`, {
    method: 'POST',
    data: params,
  });
}
// 下载
export const getFileDownLoadApi = fileNumber => {
  download(`/ams${uri}/path/downloadFile`, {
    method: 'POST',
    data: fileNumber,
  });
};
// 归档任务完成
export const taskEndApi = params => {
  return request(`${uri}/awp/task/process/automaticEnd?id=${params}`, {
    method: 'GET',
  });
};
// 常规任务完成
export const taskCommenEndApi = params => {
  return request(`${uri}//awp/task/conventionalEnd?id=${params}`, {
    method: 'POST',
  });
};
// 获取审核意见
export const getOpinionApi = params => {
  return request(`${uri}//awp/task/process/getOpinion?processInstanceId=${params}`, {
    method: 'GET',
  });
};
