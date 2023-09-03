import request from '@/utils/request';

const url = '/yss-lifecycle-flow';
const base = '/ams-base-parameter';

// 数据字典
export function getDictsAPI(codeList) {
  return request(`/ams-base-parameter/datadict/queryInfoByList?codeList=${codeList.toString()}`);
}

// 产品类型
export function getProType() {
  return request(`${url}/common/allAssetType`);
}

// 产品全称/代码下拉列表
export function getProNameAndCodeAPI(isAccountCancel) {
  if (isAccountCancel) {// 剔除销户的账户和托管户销户的产品(资金运用部分优化)
    return request(`${url}/product/review/productEnum/search?isAccountCancel=${isAccountCancel}`);
  } else {
    return request(`${url}/product/review/productEnum/search`);
  }
}

// 分页任务列表
export async function getListAPI(params) {
  return request(`${url}/transfer/transferList `, {
    method: 'POST',
    data: params,
  });
}

// 划款指令，撤回接口
export async function withdraw(params) {
  return request(`${url}/transfer/withdraw `, {
    method: 'POST',
    data: params,
  });
}

// 投资经理下拉列表
export async function getInvestmentManagerAPI() {
  return request(`${base}/employee/investmentManagerPullDown?roleCode=E002_1`);
}

// 删除
export async function getDeleteAPI(params) {
  return request(`${url}/productOpenPeriodChange/batchDelete`, {
    method: 'POST',
    data: params,
  });
}

// 撤销
export function getRevokeAPI(data) {
  return request.post(`${url}/transfer/audit/status/callback`, {
    data,
  });
}

// 批量提交
export function batchCommit(data) {
  return request.post(`${uri}/productOpenPeriodChange/batchCommit`, {
    data,
  });
}

// 批量办理
export function checksAPI(data) {
  return request.post(`${url}/transfer/audit-batch/pass`, {
    data,
  });
}

// 批量上传
export function uploadsAPI(data) {
  return request.post(`${url}/transfer/batch-upload/contract/archives`, {
    data,
  });
}

// 请求 根据类目code 获取下拉列表项
export function getProTypeListAPI(code) {
  return request(`/ams-base-parameter/datadict/queryInfo?fcode=${code}`);
}

// 查询费用列表数据
export function getReceiptList(params) {
  return request(
    `${url}/receipt/list?currentPage=${params.currentPage}&pageSize=${params.pageSize} `,
    {
      method: 'POST',
      data: params,
    },
  );
}

// 获取数据中心数据
export function getReceiptData(tradeDay) {
  return request(`${url}/receipt/saveReceipt?tradeDay=${tradeDay}`);
}
