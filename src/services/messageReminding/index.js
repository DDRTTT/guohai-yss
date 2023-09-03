import request from '@/utils/request';

const url = '/yss-lifecycle-flow';
const urlFile = '/ams-file-service';
const urlPar = '/ams-base-parameter';
const urlAdmin = '/ams-base-admin';
const urlPro = '/ams-base-product';

// 数据字典
export async function getDictsAPI(codeList) {
  return request(`${urlPar}/datadict/queryInfoByList?codeList=${codeList.toString()}`);
}

// 表格:消息
export async function getProductInfoTableAPI(params) {
  return request(
    `/yss-base-calendar/bell/getUnreadMsgListPage?currentPage=${params.currentPage.toString()}&pageSize=${params.pageSize.toString()}`,
    {
      method: 'POST',
      data: params,
    },
  );
}

// 置为已读
export async function getReadsAPI(params) {
  return request(`/yss-base-calendar/taskHandle/updatebatchUserTaskReadState`, {
    method: 'POST',
    data: params,
  });
}

// 删除消息
export async function getDelBatchAPI(params) {
  return request(`/yss-base-calendar/taskHandle/delbatch`, {
    method: 'POST',
    data: params,
  });
}
