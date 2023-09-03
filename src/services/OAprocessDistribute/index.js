import request from '@/utils/request';
// const uri = '/ams-base-product';
// 通过上级系列获取评审信息已经评审记录

// export function searchTableData(page, limit) {
//   return request(`/yss-lifecycle-flow/taskpools/queryByTime?currentPage=${page}&pageSize=${limit}`,{
//     method: 'POST',
//     data: {currentPage: page, pageSize: limit}
//   });
// }

export function searchTableDataAPI(params) {
  return request(
    `/yss-lifecycle-flow/taskpools/getAllTitle?currentPage=${params.currentPage}&pageSize=${params.pageSize}`,
    {
      method: 'POST',
      data: {
        time: params.time,
        isHandle: params.isHandle,
        direction: params.direction,
        field: params.field,
        title: params.title,
        classification: params.classification,
        keyWords:params.keyWords,
      },
    },
  );
}

export function getFileInfo(params) {
  return request(`/yss-lifecycle-flow/taskpools/queryfileinfo`, {
    method: 'POST',
    data: { id: params.id, currentPage: params.currentPage, pageSize: params.pageSize },
  });
}

export function updateHandleState(oaTaskpoolsID) {
  return request(`/yss-lifecycle-flow/taskpools/updateHandleState `, {
    method: 'POST',
    data: oaTaskpoolsID,
  });
}

// 获取业务分类
export function getBusinessType() {
  return request(`/ams-base-parameter/datadict/queryInfoByList?codeList=O006`);
}
