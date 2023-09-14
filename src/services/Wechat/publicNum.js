import { stringify } from "qs";
import request from "../../utils/request";

const uri = '/yss-itc-admin/wechatapp';
const uri2 = '/yss-itc-admin/wechattempconfig';
const uri3 = '/yss-itc-admin/bususer';
const uri4 = '/yss-itc-admin/wechatuser';


/** 公众号管理 */
//公众号查询列表
export async function publicList(val) {
  return request(`${uri}/quewechatapp?${stringify(val)}`);
}

//添加公众号
export async function addPublic(val) {
  console.log('content-type',val);
  return request(`${uri}/addwechatapp`,{
    method: 'POST',
    data: val
  });
}

//公众号修改
export async function publicUpdate(val) {
  return request(`${uri}/updatewechatapp`,{
    method: 'POST',
    data: val
  });
}

//公众号菜单查询
export async function publicMenu(val) {
  return request(`${uri}/queappmenu?${stringify(val)}`);
}

//公众号菜单添加
export async function publicMenuAdd(val) {
  return request(`${uri}/addappmenu`,{
    method: 'POST',
    data: val
  });
}

//公众号菜单修改
export async function publicMenuUpdate(val) {
  return request(`${uri}/updateappmenu`,{
    method: 'POST',
    data: val
  });
}

//公众号菜单发布
export async function publicMenuPublic(val) {
  return request(`${uri}/createmenu`, {
    method: 'POST',
    data: val
  });
}

//公众号父级菜单下拉
export async function parentList(val) {
  return request(`${uri}/queparentmenu?${stringify(val)}`);
}

//公众号菜单删除
export async function publicMenuDelete(val) {
  return request(`${uri}/delappmenu?id=${(val.id)}`,{
    method: 'DELETE',
  });
}

//消息模板查询
export async function mesMouldList(val) {
  return request(`${uri2}/quemsgtempcon?${stringify(val)}`);
}

//消息模板预览
export async function mesMouldPreview(val) {
  return request(`${uri2}/previewtempconfig?${stringify(val)}`);
}

//消息模板添加
export async function mesMouldAdd(val) {
  return request(`${uri2}/addtempconfig`,{
    method: 'POST',
    data: val
  });
}

//消息模板详情
export async function mesMouldLook(val) {
  return request(`${uri2}/querybyid?${stringify(val)}`);
}

//消息模板修改
export async function mesMouldUpdate(val) {
  return request(`${uri2}/updatetempconfig`,{
    method: 'POST',
    data: val
  });
}

//消息模板状态切换
export async function mesMouldSwith(val) {
  return request(`${uri2}/changestatus`,{
    method: 'POST',
    data: val
  });
}

//消息模板删除
export async function mesMouldDelete(val) {
  return request(`${uri2}/deltempconfig?id=${(val.id)}`,{
    method: 'DELETE',
  });
}

//用户列表查询 微信用户
export async function wechatListQue(val) {
  return request(`${uri4}/quewechatuser?${stringify(val)}`);
}


//用户列表查询 业务用户
export async function userListQue(val) {
  return request(`${uri3}/querybususer?${stringify(val)}`);
}

//微信用户 查详情
export async function wechatDetail(val) {
  return request(`${uri4}/quebyid?${stringify(val)}`);
}

//微信用户 刷新
export async function wechatReStart(val) {
  return request(`${uri}/getSubscribeUser?${stringify(val)}`);
}

//业务用户 查详情
export async function userDetail(val) {
  return request(`${uri3}/quebyid?${stringify(val)}`);
}

//业务用户添加
export async function userListAdd(val) {
  return request(`${uri3}/addbususer`, {
    method: 'POST',
    data: val
  });
}

//业务用户修改
export async function userListUpdate(val) {
  return request(`${uri3}/update`, {
    method: 'PUT',
    data: val
  });
}

//业务用户删除
export async function userListDelete(val) {
  return request(`${uri3}/delwechatbususer?${stringify(val)}`,{
    method:'DELETE',
  });
}

//判断业务用户是否绑定微信用户
export async function userListBind(val) {
  return request(`${uri3}/selectindinguser?${stringify(val)}`);
}

//公众号刪除
export async function publicUntie(val) {
  return request(`${uri}/delwechatapp?${stringify(val)}`,{
    method:'DELETE',
  });
}

//词汇字典
export async function getSelectList(val) {
  return request(`/ams-base-parameter/datadict/queryInfo?${stringify(val)}`);
}


//文件导入
export async function investorOpenFileUpload(params) {
  return request(`/yss-itc-admin/bususer/importbususer`, {
    method: 'POST',
    body: params,
  });
}



