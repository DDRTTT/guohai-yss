import { stringify } from 'qs';
import request from '../../utils/request';
import { formatParams } from '../../utils/utils';

const uri = '/ams-investor-service';
const ditUri = '/ams-base-parameter/datadict/queryInfo?fcode=';

// 自然人证件类型
// 经办人证件类型
// 法人证件类型
// 参数不同，请求数据不同
export async function handleTA_IDTPTP(params) {
  return request(`${ditUri}${params}`);
}

// 机构证件类型
export async function handleTA_IDTP() {
  return request(`${ditUri}TA_IDTP`);
}

// 产品证件类型
export async function handleTA_PROTP() {
  return request(`${ditUri}TA_PROTP`);
}

// 投资者风险等级
export async function handleInvestorRiskLevel() {
  return request(`${ditUri}InvestorRiskLevel`);
}

// 受理方式
export async function handleTA_ACCPTMD() {
  return request(`${ditUri}TA_ACCPTMD`);
}

// 账单寄送方式
export async function handleTA_STATEMENTFLAG() {
  return request(`${ditUri}TA_STATEMENTFLAG`);
}

// 账单寄送频率
export async function handleTA_DELIVERTYPE() {
  return request(`${ditUri}TA_DELIVERTYPE`);
}

// 产品托管人
export async function handleCustodian() {
  return request(`/ams-base-parameter/institution/queorgtype?orgType=TG`);
}

// '投资者'tabel 高级查询
export async function handleSearch(params) {
  return request(`${uri}/investor/selectall?${stringify(params.page)}`, {
    method: 'POST',
    data: formatParams(params.par),
  });
}

// '投资者'tabel 高级查询(持仓)
export async function handleAccountManagement(params) {
  return request(`${uri}/investor/quefungbalance`, {
    method: 'POST',
    data: {
      par: formatParams(params.par),
      arr: params.arr,
    },
  });
}

// 审核
export async function handleReview(params) {
  return request(`${uri}/investor/status?status=${params.status}&id=${params.id}`, {
    method: 'PUT',
  });
}

// '投资者'基本信息保存
export async function handleBaseInfoSave(params) {
  return request(`${uri}/investor/add`, {
    method: 'POST',
    data: params,
  });
}

// 根据id查询'投资者'信息接口
export async function handleInvestorSelectById(params) {
  return request(`${uri}/investor/selectbyid?id=${params}`);
}

// 根据id查询'交易账户'接口
export async function handleInvestoraccountQuerytById(params) {
  return request(`${uri}/investoraccount/querybyid?id=${params}`);
}

// '投资者'信息删除接口
export async function handleInvestorDelete(params) {
  return request(`${uri}/investor/delete`, {
    method: 'DELETE',
    data: params,
  });
}

// '投资者'交易账户删除接口
export async function handleInvestoraccountRemove(params) {
  return request(`${uri}/investoraccount/remove?idList=${params}`, {
    method: 'DELETE',
  });
}

// '投资者'信息修改接口
export async function handleInvestorUpdate(params) {
  return request(`${uri}/investor/update`, {
    method: 'PUT',
    data: params,
  });
}

// '投资者'基金账户资料修改
export async function handleInvestoraccounttraAccountupdateapply(params) {
  return request(`${uri}/investoraccounttra/accountupdateapply`, {
    method: 'POST',
    data: params,
  });
}

// Excel导入投资人
export async function handleInvestorAddByExcel(params) {
  return request(`${uri}/investor/importinvestor`, {
    method: 'POST',
    data: params,
  });
}

// 根据投资人id查询附件接口
export async function handleAccessoryQueryByInvestor(params) {
  return request(`${uri}/accessory/querybyinvestor?investorId=${params}`);
}

// 投资者交易账户保存
export async function handleInvestorAccountSave(params) {
  return request(`${uri}/investoraccount/add`, {
    method: 'POST',
    data: params,
  });
}

// 批量上传预览
export async function handleInvestorPreviewinv(params) {
  return request(
    `${uri}/investor/previewinv?currentPage=${params.currentPage}&pageSize=${params.pageSize}`,
    {
      method: 'POST',
      data: params.par,
    },
  );
}

// 批量上传预览
export async function handleInvestorTempupdate(params) {
  return request(`${uri}/investor/tempupdate`, {
    method: 'PUT',
    data: params,
  });
}

// 预览删除单条
export async function handleDel(params) {
  return request(`${uri}/investor/deletetemp?${stringify(params)}`, {
    method: 'DELETE',
  });
}

// 模板重新上传（临时表删除API）
export async function handleReupload() {
  return request(`${uri}/investor/reupload`);
}

// 模板数据保存
export async function handleExceladd() {
  return request(`${uri}/investor/exceladd`);
}

// 销售机构下拉
export async function salesAgency(params) {
  return request(`/ams-view-report/dictionaries/querylist?${stringify(params)}`);
}

// 开户银行下拉
export async function accountOpenBankDropDown() {
  return request(`/ams-base-parameter/pubbkinf/querybank`);
}

// 数据字典下拉
export async function dictBatchQuery(params) {
  return request(`/ams-base-parameter/datadict/queryInfoByList?${stringify(params)}`);
}

// 数据字典下拉 name+code
export async function dictNameAndCodeBatchQuery(params) {
  return request(`/ams-base-parameter/datadict/querycodenamebylist?${stringify(params)}`);
}

//初始化销售机构列表
export async function initFdistributorcode(parameter) {
  return request(`/ams-data-center/dictionaries/queryorg?${stringify(parameter)}`);
}
