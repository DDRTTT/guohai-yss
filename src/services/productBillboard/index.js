import request from '@/utils/request';
import requestCopy from 'umi-request'

const url = '/yss-lifecycle-flow';
const urlFile = '/ams-file-service';
const urlPar = '/ams-base-parameter';
const urlPro = '/ams-base-product';
const urlDataCenter = '/api/yss-data-diplomatic';

// 数据字典
export async function getDictsAPI(codeList) {
  return request(`${urlPar}/datadict/queryInfoByList?codeList=${codeList.toString()}`);
}

// 产品类型选项值
export async function getProTypeAPI() {
  return request(`${url}/common/allAssetType`);
}

// 机构下拉字典
export async function getOrgDictsAPI(orgType) {
  return request(`${urlPar}/organization/getOrgNameList?orgType=${orgType.toString()}`);
}

// 机构下拉字典(看板专用)
export async function getAllOrgDictsAPI() {
  return request(`${urlPar}/organization/queryByOrgTypeList`, {
    method: 'POST',
    data: [],
  });
}

// 委托人下拉
export async function getProConsignerAPI() {
  return request(`${url}/productManagement/customer/option`);
}

// 产品归属部门下拉字典
export async function getOrgBelongAPI() {
  return request(`${urlPar}/organization/getOrgDeptNameList?parentId=''`);
}

// 栅格概述信息(产品看板)
export async function getProductStageAPI() {
  return request(`${url}/productBoard/statistical/proStage`);
}

// 表格(产品看板)
export async function getListAPI(params) {
  return request(`${url}/productBoard/query/proViewList`, {
    method: 'POST',
    data: params,
  });
}

// 表格(系列看板-父级)
export async function getListNewAPI(params) {
  return request(`${url}/productBoard/query/seriesViewList`, {
    method: 'POST',
    data: params,
  });
}

// 表格(系列看板-子级)
export async function getListNewChildAPI(params) {
  return request(`${url}/productBoard/query/AllProUnderTheSeries`, {
    method: 'POST',
    data: params,
  });
}

// 产品看板-产品信息-概述信息
export async function getProductOverviewAPI(proCode) {
  return request(`${url}/productBoard/query/ProPublicField?proCode=${proCode.toString()}`);
}

// 产品看板-系列信息-概述信息
export async function getSeriesOverviewAPI(proCode) {
  return request(`${url}/productBoard/query/SeriesPublicField?proCode=${proCode.toString()}`);
}

// 产品/系列看板-删除
export async function getDeleteProAndSerAPI(params) {
  return request(`${url}/product/review/batchDeleteByIds`, {
    method: 'POST',
    data: params,
  });
}

// 产品看板-产品关联表格
export async function getProLinkTableAPI(proCode) {
  return request(`${urlPro}/product/selectbyprocode?proCode=${proCode.toString()}`);
}

// 产品看板-产品关联列表-产品名称下拉列表
export async function getProLinkNameListAPI(type) {
  return request(`${urlPro}/product/selectProbyprobustypes?probusTypes=${type.toString()}`);
}

// 产品看板-代码映射表格
export async function getCodeLinkTableAPI(proCode) {
  return request(`${urlPro}/product/selectproduct/${proCode.toString()}`);
}

// 产品看板-产品关联列表-修改
export async function getProLinkUpdateAPI(params) {
  return request(`${urlPro}/product/updateproduct`, {
    method: 'PUT',
    data: params,
  });
}

// 产品看板-代码映射列表-修改
export async function getCodeLinkUpdateAPI(params) {
  return request(`${urlPro}/product/updateoutproduct`, {
    method: 'PUT',
    data: params,
  });
}

// 产品看板-产品信息-修改
export async function getProductDataUpdateAPI(params) {
  return request(`${url}/productBoard/update/proSeriesInfo`, {
    method: 'POST',
    data: params,
  });
}

// 产品看板-产品信息-产品数据-修改
export async function getProductDataUpMessageDataAPI(payload) {
  return request(
    `${url}/productBoard/productInfo/update?proCode=${payload.proCode.toString()}&type=${payload.type.toString()}`,
    {
      method: 'POST',
      data: payload.params,
    },
  );
}

// 产品全称/代码下拉列表
export async function getProNameAndCodeAPI() {
  return request(`${url}/product/review/queryAllPro/search`);
}

// 系列名称/号下拉列表
export async function getSeriesNameCodeAPI() {
  return request(`${url}/product/review/queryAllSeries/search`);
}

// 投资经理下拉列表
export async function getInvestmentManagerAPI() {
  return request(`${urlPar}/employee/investmentManagerPullDown?roleCode=E002_1`);
}

// 获取流程连线图的数据
export async function getProcessTreeAPI(params) {
  return request.get(`${url}/controlInfo/getProcessTree`, {
    params,
  });
}

// 获取统计的数据
export async function getStatisticsAPI(params) {
  return request(`${url}/taskCount/getTodoTaskCount`, {
    method: 'POST',
    data: params,
  });
}

// 表格(产品看板-产品信息-产品生命周期)
export async function getLifeCycleTableAPI(params) {
  return request(`${url}/productBoard/getNodeTodoTask`, {
    method: 'POST',
    data: params,
  });
}

// 产品看板-产品数据-栅格信息
export async function getProductOverviewMessageAPI(param) {
  return request(
    `${url}/productBoard/getProductInfo?proCode=${param.proCode.toString()}&type=${param.type.toString()}`,
  );
}

// 产品看板-产品数据-表格信息
export async function getProductOverviewTableAPI(payload) {
  return request(
    `${url}/productBoard/getProInfoPage?proCode=${payload.proCode.toString()}&pageNum=${payload.pageNum.toString()}&pageSize=${payload.pageSize.toString()}&type=${payload.type.toString()}`,
  );
}

// 产品看板-产品文档
export async function getProductFileAPI(params) {
  return request(`${urlFile}/businessArchive/selectElectronicFile`, {
    method: 'POST',
    data: params,
  });
}

// 产品看板-产品文档-文档类型下拉列表
export async function getProductFileListAPI() {
  return request(`${urlPar}/fileType/queryDocType`);
}

// 产品看板-产品文档-明细分类下拉列表
export async function getProductFileTypeAPI(params) {
  return request(`${urlPar}/fileType/query/file-type-list/map`, {
    method: 'POST',
    data: params,
  });
}

// 产品看板-产品文档-下载
export async function getProductFileDownloadAPI(getFile) {
  return request(`${urlFile}/fileServer/downloadUploadFile?getFile=${getFile.toString()}`);
}

// 产品看板-时间轴
export async function getProductTimeLineAPI(proCode) {
  return request(`${url}/productBoard/timeAxis?proCode=${proCode.toString()}`);
}

// 产品看板-账户
export async function getAccountDataAPI(params) {
  return request(`${url}/productManagement/account/list`, {
    method: 'POST',
    data: params,
  });
}

// 产品看板-交易确认
export async function getDealConfirmAPI(proCode) {
  return request(`${url}/singleInvestFundPayDraw/getTradeConfirm?proCode=${proCode.toString()}`);
}

// 产品看板-信披
export async function getInformationDisclosureAPI(proCode) {
  return request(`${url}/publishInfo/getListByProCode?proCode=${proCode.toString()}`);
}

// 产品/系列看板-评审记录
export async function getReviewRecordAPI(code) {
  return request(`${url}/product/review/review_info/query?code=${code.toString()}`);
}

// 系列看板-下级系列
export async function getSubordinateSeriesAPI(params) {
  return request(`${url}/productBoard/query/subordinate/seriesList`, {
    method: 'POST',
    data: params,
  });
}

// 系列看板-系列产品
export async function getSeriesProductAPI(params) {
  return request(`${url}/productBoard/query/AllProUnderTheSeries`, {
    method: 'POST',
    data: params,
  });
}

// 产品看板-定期报告
export async function getPeriodicReportDataAPI(params) {
  return request(`${url}/productManagement/periodicReport/list`, {
    method: 'POST',
    data: params,
  });
}

// 产品看板-分红明细
export async function getBonusOfDetailAPI(proCode) {
  return requestCopy(
    `${urlDataCenter}/adsPlmPfBonusDetail/productBoard/query?proCode=${proCode.toString()}`,
  );
}

// 产品看板-投资者
export async function getInvestorAPI(proCode) {
  return requestCopy(
    `${urlDataCenter}/adsPlmInvestInfo/productBoard/query?proCode=${proCode.toString()}`,
  );
}

// 产品看板-干系人
export async function getStakeholderAPI(proCode) {
  return request(`${url}/stakeholderInfo/getInfoByPro?proCode=${proCode.toString()}`);
}

// 产品看板-销售机构管理
export async function getSalesOrganizationAPI(proCode) {
  return request(`${url}/salesOrgMaintain/getListByProCode?proCode=${proCode.toString()}`);
}

// 产品看板-地铁图查看进度
export async function getNodeStatusAPI(data) {
  return request.post(`${url}/productBoard/getNodeStatus`, { data });
}

// 产品看板-产品数据-参数设置详情
export async function getASAPI(proCode) {
  return request(
    `${url}/productBoard/getProductInfo?proCode=${proCode.toString()}&type=paramSetting`,
  );
}

// 产品看板-产品数据-监管要素详情
export async function getRCAPI(proCode) {
  return request(
    `${url}/productBoard/getProductInfo?proCode=${proCode.toString()}&type=chargeItem`,
  );
}
