import { stringify } from 'qs';
import request from '@/utils/request';

const uri = '/ams-base-parameter';

// 文件类型树形分级查询
export async function handleGetTreeAPI(params) {
  return request(`${uri}/fileTypeInfo/selListByParentId?${stringify(params)}`);
}

// 文件类型整个树
export async function handleGetAllTreeAPI() {
  return request(`${uri}/fileTypeInfo/selAllTree`);
}

// 文件类型树形--添加树目录
export async function handleAddTreeAPI(params) {
  return request(`${uri}/fileTypeInfo/insInfoInParentId?${stringify(params)}`);
}
// 文件类型树形--修改树目录
export async function handleEditeTreeAPI(params) {
  return request(`${uri}/fileTypeInfo/updInfoById?${stringify(params)}`);
}
/*-------------级联关系---- */
export async function handleGetListAPI(params) {
  return request(`${uri}/fileTypeQuery/selAllToSmallTree`, {
    method: 'POST',
    data: params,
  });
}

// 级联关系-业务模块定义下拉
export async function handleModuleCodeAPI(params) {
  return request(`${uri}/fileTypeQuery/selModuleCodeDist?${stringify(params)}`);
}
// 级联关系-模块业务属性
export async function handlePropertyNameAPI(params) {
  return request(`${uri}/fileTypeQuery/selPropertyNameDistinct?${stringify(params)}`);
}
// 级联关系-属性业务值
export async function handleRemarkAPI(params) {
  return request(`${uri}/fileTypeQuery/selValueNameDistinct?${stringify(params)}`);
}
// 级联关系--关联文件类型 （新增修改用同一个）
export async function handleFileTypeAddAPI(params) {
  return request(`${uri}/fileTypeInfo/selAllLeaf?${stringify(params)}`);
}
// 级联关系-关联文件类型 （高级搜索）
export async function handleFileTypeAlterAPI(params) {
  return request(`${uri}/fileTypeInfo/selListAll?${stringify(params)}`);
}
// 级联关系-未与当前模块建立联系的关联文件类型
export async function handleNoFileTypeAPI(params) {
  return request(`${uri}/fileTypeQuery/selFreeFileTypeOfThisModule?${stringify(params)}`);
}
// 级联关系--新增弹框，根据1,2,3目录查询remarks
export async function handleTrueRemarksAPI(params) {
  return request(`${uri}/fileTypeQuery/selFileTypeNameDistinct?${stringify(params)}`);
}
// 级联关系-批量新增
export async function handleAddListAPI(params) {
  return request(`${uri}/fileTypeQuery/insBatchModuleToFileType`, {
    method: 'POST',
    data: params,
  });
}
// 级联关系-批量修改
export async function handleEditeListAPI(params) {
  return request(`${uri}/fileTypeQuery/updBatchModuleToFileType`, {
    method: 'POST',
    data: params,
  });
}
// 级联关系-删除
export async function handleDeleteListAPI(params) {
  return request(`${uri}/fileTypeQuery/delete-batch-id`, {
    method: 'POST',
    data: params,
  });
}
// 字典
export async function handleWordDictionaryFetchAPI(parameter) {
  return request(`/ams-base-parameter/datadict/queryInfoByList?${stringify(parameter)}`);
}
