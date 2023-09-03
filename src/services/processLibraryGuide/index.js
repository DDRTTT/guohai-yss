import request from '@/utils/request';

const uri = '/yss-lifecycle-flow';
// 获取流程数据
export function getStageCell(params) {
  return request.post(`${uri}/controlCell/getStageCell?proCode=${params.proCode}`);
}

// 获取所有阶段
export function getAllStages(params) {
  return request.post(`${uri}/controlCell/getAllStages?proCode=${params.proCode}`);
}
// 获取所有阶段的待办任务
export function proStageTask(params) {
  return request.post(`${uri}/taskCount/getTodoTask/proStage`, {
    data: params,
  });
}
// 获取特别的节点
export function proTypeAndCode(params) {
  params.currentUserTask = 0;
  return request.post(`${uri}/taskCount/getTodoTaskCount`, {
    data: params,
  });
}
