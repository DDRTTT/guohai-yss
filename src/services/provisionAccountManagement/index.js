import request from '@/utils/request';
const flow = '/yss-lifecycle-flow';

// 列表查询
export const getTableDatasApi = data => {
  return request(
    `${flow}/provisionAccount/list?currentPage=${data.pageNum}&pageSize=${data.pageSize}`,
    {
      method: 'POST',
      data,
    },
  );
};

// 删除
export const deleteProvisionAccount = data => {
  return request(`${flow}/provisionAccount/del`, {
    method: 'POST',
    data,
  });
};

// 审核/反审核
export const reviewProvisionAccount = data => {
  return request(`${flow}/provisionAccount/review?type=${data.type}`, {
    method: 'POST',
    data,
  });
};

// 获取备付金账号名称
export function provisionAccountNameApi(fcode) {
  return request(`/ams-base-parameter/datadict/queryInfo?fcode=${fcode}`);
}

// 获取开户行下拉选项
export function getOpeningInstitutionList(type) {
  return request(`/ams-base-parameter/organization/getOpeningInstitutionList?type=${type}`);
}

// 产品全称/代码下拉列表
export function getProNameAndCodeAPI() {
  return request(`${flow}/product/review/queryAllPro/search`);
}
