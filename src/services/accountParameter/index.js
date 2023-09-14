import request from '@/utils/request';

const flow = '/yss-lifecycle-flow';
const par = '/ams-base-parameter';
const pro = '/yss-product-element';

// 数据字典
export const getDictsAPI = codeList => {
  return request(`${par}/datadict/queryInfoByList?codeList=${codeList.toString()}`);
};

// 产品全称/代码下拉列表
export async function getProNameAndCodeAPI() {
  return request(`${flow}/product/review/queryAllPro/search`);
}

// 表格
export const getTableAPI = data => {
  return request(
    `${flow}/baseAccount/query/findAccountList?currentPage=${data.pageNum}&pageSize=${data.pageSize}`,
    {
      method: 'POST',
      data: data,
    },
  );
};

// 导出
export const handleExportAPI = data => {
  return request(`${flow}/baseAccount/export/accountList`, {
    method: 'POST',
    data: data,
  });
};
