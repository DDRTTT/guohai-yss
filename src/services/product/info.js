import request from '@/utils/request';
import { stringify } from 'qs';

const uri = '/yss-base-product';
const urlFile = '/ams-file-service';
const urlPar = '/ams-base-parameter';
const urlManage = '/yss-lifecycle-manage';
const urlCalendar = '/yss-base-calendar';

// 产品看板-产品文档
export async function getProductFileAPI(params) {
  return request(`${urlFile}/businessArchive/selectElectronicFile`, {
    method: 'POST',
    data: params,
  });
}

// 产品看板-产品文档-文档类型下拉列表
export async function getProductFileListAPI() {
  return request(`${urlPar}/fileType/queryDocType`);
}

// 产品看板-产品文档-明细分类下拉列表
export async function getProductFileTypeAPI(params) {
  return request(`${urlPar}/fileType/query/file-type-list/map`, {
    method: 'POST',
    data: params,
  });
}

// 产品看板-流程发起人下啦数据表
export async function getUserListAPI() {
  return request(`/api/yss-base-billows/user/list`);
}

// 时间轴
export async function getTimeAxisAPI(params) {
  return request.get(`${urlManage}/productBoard/timeAxis?proCode=${params}`);
}

// 产品看板-任务列表
export async function getNodeTodoTaskAPI(params) {
  return request(`${urlManage}/productBoard/getNodeTodoTask`, {
    method: 'POST',
    data: params,
    headers: {
      userId: '620',
    },
  });
}

// 产品看板-产品生命周期阶段
export async function getHistoricalByProCodeAPI(params) {
  return request(`${urlManage}/productBoard/getHistoricalByProCode?${stringify(params)}`);
}

// 产品看板-产品数据- 费用与业绩报酬信息 / 信息披露 / 终止清算 / 估值运营
export async function getInfoListAPI(params) {
  return request(`${uri}/biProductInfo/smartbi/dynamicQuery`, {
    method: 'POST',
    data: params,
  });
}

// 产品看板-流程名称下拉
export async function getProcessNameAPI() {
  return request(`${urlManage}/productBoard/query/all-process-name`);
}

// 产品看板-任务名称 (流程名称下拉级联)
export async function getTaskNameAPI(params) {
  return request(`/api/billow-diplomatic/todo-task/node-info?processDefinitionKeys=${params}`);
}

// 产品看板-催办接口
export async function addTaskAPI(params) {
  return request(`${urlCalendar}/bell/addTask?userList=${params.queryData}`, {
    method: 'POST',
    data: params?.data,
  });
}

// mvp二期 首页产品信息列表接口
export async function getProductListApi(params) {
  return request(`${uri}/product/query?coreModule=${params.queryData}`, {
    method: 'POST',
    data: params?.data,
  });
}

export async function getProductListApiv2(data) {
  return request(`${uri}/biProductElement/smartbi/query`, {
    method: 'POST',
    data,
  });
}
