import request from '@/utils/request';

const url = '/yss-lifecycle-flow';
const urlFile = '/ams-file-service';
const urlPar = '/ams-base-parameter';
const urlPro = '/ams-base-product';

export async function getMenuListAPI() {
  return request(`${url}/productBoard/getAllMenus`);
}

// 表格:产品基本信息
export async function getProductTableAPI(params) {
  return request(`${url}/productBoard/query/proInfoList`, {
    method: 'POST',
    data: params,
  });
}

// 表格:系列基本信息
export async function getSerivcesTableAPI(params) {
  return request(`${url}/productBoard/query/seriesInfoList`, {
    method: 'POST',
    data: params,
  });
}

// 表格:产品数据信息
export async function getProductInfoTableAPI(params) {
  return request(`${url}/productBoard/getProDataManagePage`, {
    method: 'POST',
    data: params,
  });
}
