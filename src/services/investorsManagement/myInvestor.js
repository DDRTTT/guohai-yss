/**
 *Create on 2020/9/29.
 */
import { stringify } from 'qs';
import request from '../../utils/request';

const uri = '/ams-investor-service';

export async function getData(parameter) {
  // investor/selectall?currentPage=1&pageSize=10&investorType=1
  return request(`${uri}/investor/selectall?${stringify(parameter.parameter)}`, {
    method: 'POST',
    data: parameter.body,
  });
}

//获取产品类型（下拉数据）
export async function getProType() {
  return request(`/ams-base-parameter/assettype/producttypetree`);
}

//交易账号 查询
export async function getDealTable(parameter) {
  return request(`${uri}/investoraccount/querybyinvestorid?${stringify(parameter.par)}`, {
    method: 'POST',
    data: parameter.body,
  });
}

//交易账号 查询（过滤后的）
export async function getFilterDealTable(parameter) {
  return request(`${uri}/investoraccount/queeffeinfo?${stringify(parameter)}`);
}

export async function getQueryCriteria(parameter) {
  return request(`/ams-base-parameter/datadict/queryInfoByList?${stringify(parameter)}`);
}

//交易账号 修改
export async function dealUpdate(parameter) {
  return request(`${uri}/investoraccount/update`, {
    method: 'PUT',
    data: parameter,
  });
}

//交易账号 新增
export async function dealAdd(parameter) {
  return request(`${uri}/investoraccount/add`, {
    method: 'POST',
    data: parameter.body,
  });
}

//交易账号 删除
export async function dealDel(parameter) {
  return request(`${uri}/investoraccount/remove?${stringify(parameter)}`, {
    method: 'DELETE',
  });
}

//交易账号 撤消
export async function dealUndo(parameter) {
  return request(`${uri}/investoraccounttra/accountdeleteapply?${stringify(parameter)}`, {
    method: 'POST',
  });
}

//交易账号 登记
export async function dealRegister(parameter) {
  return request(`${uri}/investoraccounttra/accountregisteapply?${stringify(parameter)}`, {
    method: 'POST',
  });
}

//初始化销售机构列表
export async function initFdistributorcode(parameter) {
  return request(`/ams-data-center/dictionaries/queryorg?${stringify(parameter)}`);
}

//获取基金账户信息
export async function fundAccount(parameter) {
  return request(`${uri}/investoraccount/queryfundaccount?${stringify(parameter)}`);
}

//根据id获取投资人信息
export async function getDataById(parameter) {
  return request(`${uri}/investor/selectbyid?${stringify(parameter)}`);
}

//根据证件类型和证件号码查持仓余额
export async function getFundBalance(parameter) {
  return request(`${uri}/investor/quefungbalance`, {
    method: 'POST',
    data: parameter.body,
  });
}

//修改投资人信息
export async function investorUpdate(parameter) {
  return request(`${uri}/investor/update`, {
    method: 'PUT',
    data: parameter,
  });
}

//切换 显示账户信息后 根据证件类型证类号码获取持仓余额
export async function gitBalanceByCard(parameter) {
  return request(`${uri}/investor/quefungbalance?${stringify(parameter.par)}`, {
    method: 'POST',
    data: parameter.body,
  });
}

//银行下拉  √
export async function getBank() {
  return request(`/ams-base-parameter/pubbkinf/querybank`);
}

//申请开立碁金账户
export async function applyAccount(parameter) {
  return request(`${uri}/investoraccounttra/accountopenapply`, {
    method: 'POST',
    data: parameter,
  });
}

//重载TA数据
export async function overloadInv() {
  return request(`${uri}/investor/overloadinv`);
}

//根据投资人查询交易账户（不分页）
export async function seeDealList(parameter) {
  return request(`${uri}/investoraccount/querybyinvestor?${stringify(parameter)}`);
}

//修改 附件信息
export async function updateAccessories(parameter) {
  return request(`${uri}/accessory/update`, {
    method: 'PUT',
    data: parameter,
  });
}

//获取 管理人名称、产品托管人(管理人机构)
export async function getOrgData(parameter) {
  return request(`/ams-base-parameter/institution/orgtypebylist?${stringify(parameter)}`);
}

// 投资人信息删除/批量删除
export async function investorDel(parameter) {
  return request(`${uri}/investor/delete?${stringify(parameter)}`, {
    method: 'DELETE',
  });
}

//投资人信息审核/批量审核
export async function investorReview(parameter) {
  return request(`${uri}/investor/status?${stringify(parameter)}`, {
    method: 'PUT',
  });
}

//获取机构类型
export async function getOrgType(parameter) {
  return request(`/ams-base-parameter/datadict/queryInfo?${stringify(parameter)}`);
}

//操作记录
export async function getOperationRecord(parameter) {
  return request(`${uri}/investoraccounttra/quetra?${stringify(parameter)}`);
}

//获取产品备案机构
export async function getProductRecordingAgency(parameter) {
  return request(`/ams-base-parameter/datadict/queryInfo?${stringify(parameter)}`);
}

