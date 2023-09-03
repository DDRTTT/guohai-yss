/**
 * 回执编码申请审核
 * * */

import { stringify } from "qs";
import request from "@/utils/request";

const uri = "/ams-base-admin";

// 列表
export async function queryReceiptList(params) {
  return request(`${uri}/applyInfo/selectlistpage?${stringify(params.basic)}`, {
    method: "POST",
    data: params.payload.selectParams
  });
}

// 查看详情
export async function queryReceiptDetail(params) {
  return request(`${uri}/applyInfo/selectbyid?${stringify(params)}`);
}

// 删除
export async function serviceReceiptDel(params) {
  return request(`${uri}/applyInfo/delete?${stringify(params)}`);
}

// 反审核
export async function serviceReceiptCheck(params) {
  return request(`${uri}/applyInfo/inverse?${stringify(params)}`);
}

// 驳回&通过&修改
export async function serviceReceiptHandle(params) {
  return request(`${uri}/applyInfo/approval`, {
    method: "POST",
    data: params
  });
}

// 延长许可证
export async function extendTime(params) {
  return request(`${uri}/keyinfo/updateexpiredate`, {
    method: "POST",
    data: params
  });
}

// 白名单列表
export async function queryWhiteList(params) {
  return request(`${uri}/whiteList/selectlistpage?${stringify(params.basic)}`, {
    method: "POST",
    data: params.payload.selectParams
  });
}

// 查看白名单
export async function queryWhiteDetail(params) {
  return request(`${uri}/whiteList/selectbyid?${stringify(params)}`);
}

// 白名单新增
export async function serviceWhiteAdd(params) {
  return request(`${uri}/whiteList/add`, {
    method: "POST",
    data: params
  });
}

// 白名单修改
export async function serviceWhitePut(params) {
  return request(`${uri}/whiteList/update`, {
    method: "POST",
    data: params
  });
}

// 白名单删除
export async function serviceWhiteDel(params) {
  return request(`${uri}/whiteList/delete?${stringify(params)}`);
}

// 切换状态
export async function serviceWhiteSwitch(params) {
  return request(`${uri}/whiteList/approval?${stringify(params)}`);
}

