import { stringify } from 'qs';
import request from '../../utils/request';

const uri = '/ams-transfer-server/directive';
const uri2 = '/ams-transfer-server/directivebatch';
const uri3 = '/ams-transfer-server/workflow';

//获取指令详情
export async function commandOne(params) {
  return request(`${uri}/transferone?${stringify(params)}`);
}

//指令新增单个 保存并提交
export async function commandAdd(params) {
  return request(`${uri3}/flowsavestart`, {
    method: 'POST',
    data: params,
  });
}

//指令新增单个 修改接口
export async function commandUpdate(params) {
  return request(`${uri}/updatedirective`, {
    method: 'PUT',
    data: params,
  });
}

//指令新增单个 保存
export async function commandSave(params) {
  return request(`${uri}/addsingledirective`, {
    method: 'POST',
    data: params,
  });
}

//指令新增单个 保存
export async function commandCommit(params) {
  return request(`${uri}/filesave`, {
    method: 'POST',
    data: params,
  });
}

//删除接口
export async function deleteImg(e) {
  return request(`/ams-file-service/fileServer/deleteupfile?getFile=${e.fileId}@${e.reportName}`);
}

//校验产品权限
export async function tellPower(params) {
  return request(`/ams-transfer-server/directive/productcheck?${stringify(params)}`);
}

export async function queryAccMoneyNum(params) {
  return request(`/ams-transfer-server/account/querybalance?accNumber=${params}`);
}

/***
 * 下拉
 * */
//产品名称
export async function commandProName(params) {
  return request(`/ams-base-product/product/getProductList?${stringify(params)}`);
}
//划款类型
export async function commandDraw() {
  return request(`${uri}/transfertypelist`);
}
//指令模板
export async function commandMould(params) {
  return request(`${uri}/templatelist?${stringify(params)}`);
}

//获取指令模板详情
export async function mouldDetail(params) {
  return request(`${uri}/templatelistbyid?${stringify(params)}`);
}
//通用查询账户详情接口
export async function accountDetail(params) {
  return request(`${uri}/accountbypro`, {
    method: 'POST',
    data: params,
  });
}

//收款付款账户类型
export async function commandAccountType(params) {
  return request(`${uri}/transfertype?${stringify(params)}`);
}
//付款账户类型
export async function commandPayment(params) {
  return request(`${uri}/payment?${stringify(params)}`);
}
//收款开户行
export async function commandMakeBank(params) {
  return request(`${uri}/makemoneybank?${stringify(params)}`);
}
//付款开户行
export async function commandPaymentBank(params) {
  return request(`${uri}/paymentbank?${stringify(params)}`);
}
//词汇字典-汇款币种
export async function paymentCurrency(params) {
  return request(`/ams-base-parameter/datadict/queryInfo?fcode=${params.fcode}`);
}

//获取文字识别与矫正
export async function commandCorrect(params) {
  return request(`${uri}/ocrget?${stringify(params)}`);
}

//获取批量指令列表
export async function batchInstruction(params) {
  return request(`${uri2}/findbatchtransferlist?${stringify(params)}`);
}

//获取批量指令分类
export async function instructionCLass(params) {
  return request(`${uri2}/genreexcel?${stringify(params)}`);
}

//批量指令分类删除
export async function cLassDelete(params) {
  return request(`${uri2}/deltransfertem?${stringify(params)}`, {
    method: 'DELETE',
  });
}

//指令新增批量 临时保存
export async function instructionSave(params) {
  return request(`${uri2}/updatetransfertmp`, {
    method: 'PUT',
    data: params,
  });
}

//指令新增批量 添加
export async function instructionAdd(params) {
  return request(`${uri2}/committransfer?${stringify(params)}`, {
    method: 'POST',
  });
}

//划款指令管理->删除 *
export async function deleteCommand(params) {
  return request(`${uri}/deldirective?ids=${params}`, {
    method: 'PUT'
  });
}
