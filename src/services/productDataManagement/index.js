import request from '@/utils/request';

const uri = '/yss-lifecycle-flow';
const urlPar = '/ams-base-parameter';
const long = '/yss-product-element';

// 数据字典
export const getDictsAPI = codeList => {
  return request(`${urlPar}/datadict/queryInfoByList?codeList=${codeList.toString()}`);
};

// 表格
export const getTableAPI = data => {
  return request(`${long}/productelement/pagelist`, {
    method: 'POST',
    data: data,
  });
};
