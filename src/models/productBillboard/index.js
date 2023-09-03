import {
  getAccountDataAPI,
  getAllOrgDictsAPI,
  getASAPI,
  getBonusOfDetailAPI,
  getCodeLinkTableAPI,
  getCodeLinkUpdateAPI,
  getDealConfirmAPI,
  getDeleteProAndSerAPI,
  getDictsAPI,
  getInformationDisclosureAPI,
  getInvestmentManagerAPI,
  getInvestorAPI,
  getLifeCycleTableAPI,
  getListAPI,
  getListNewAPI,
  getListNewChildAPI,
  getNodeStatusAPI,
  getOrgBelongAPI,
  getOrgDictsAPI,
  getPeriodicReportDataAPI,
  getProcessTreeAPI,
  getProConsignerAPI,
  getProductDataUpdateAPI,
  getProductDataUpMessageDataAPI,
  getProductFileAPI,
  getProductFileDownloadAPI,
  getProductFileListAPI,
  getProductFileTypeAPI,
  getProductOverviewAPI,
  getProductOverviewMessageAPI,
  getProductOverviewTableAPI,
  getProductStageAPI,
  getProductTimeLineAPI,
  getProLinkNameListAPI,
  getProLinkTableAPI,
  getProLinkUpdateAPI,
  getProNameAndCodeAPI,
  getProTypeAPI,
  getRCAPI,
  getReviewRecordAPI,
  getSalesOrganizationAPI,
  getSeriesNameCodeAPI,
  getSeriesOverviewAPI,
  getSeriesProductAPI,
  getStakeholderAPI,
  getStatisticsAPI,
  getSubordinateSeriesAPI,
  reqRegulatoryElements,
  reqAllUsers,
} from '@/services/productBillboard/index';
import { message } from 'antd';

export default {
  namespace: 'productBillboard',
  state: {
    dicts: {},
    proTypeDatas: [],
    orgDicts: [],
    allOrgDicts: [],
    proConsignerData: [],
    proLinkNameListData: {},
    proLinkTableData: [],
    codeLinkTableData: [],
    orgBelongData: [],
    proNameAndCodeData: [],
    productStageData: [],
    productBillboardInvestmentManagerData: [],
    seriesNameData: [],
    canvasData: [],
    canvasMessage: [],
    lifeCycleTableData: { total: '', rows: [] },
    productBillboardTableData: { total: '', rows: [] },
    productBillboardNewTableData: { total: '', rows: [] },
    productBillboardNewTabsData: { total: '', rows: [] },
    productBillboardProductOverview: { data: {} },
    productBillboardServicesOverview: { data: {} },
    productOverviewMessage: { total: '', data: {} },
    productOverviewTable: { data: {} },
    productFileData: { total: '', fileInfoList: [] },
    productFileListDocType: [],
    productFileListFileType: [],
    productTimeLine: { total: '', rows: [] },
    accountData: { total: '', rows: [] },
    dealConfirmData: [],
    informationDisclosureData: [],
    reviewRecordData: [],
    subordinateSeriesData: { total: '', rows: [] },
    seriesProductData: { total: '', rows: [] },
    periodicReportData: { total: '', rows: [] },
    salesOrganizationData: [],
    bonusOfDetailData: [],
    investorData: [],
    stakeholderData: [],
    nodeStatusList: [],
    RC: {},
    AS: {},
  },

  effects: {
    // 获取词汇字典数据
    *getDicts({ payload, callback }, { call, put }) {
      const response = yield call(getDictsAPI, payload.codeList);
      if (response && response.status === 200) {
        yield put({
          type: 'dicts',
          payload: response.data,
        });
        if (callback) callback(response.data);
      } else {
      }
    },

    *getProTypeFunc({ }, { call, put }) {
      const response = yield call(getProTypeAPI);
      if (response && response.status === 200) {
        yield put({
          type: 'proTypeDatas',
          payload: response.data,
        });
      } else {
      }
    },

    // 获取机构下拉字典数据
    *getOrgDictsFunc({ payload, callback }, { call, put }) {
      const response = yield call(getOrgDictsAPI, payload);
      if (response && response.status === 200) {
        yield put({
          type: 'orgDicts',
          payload: response.data,
        });
        if (callback) callback(response.data);
      } else {
      }
    },

    // 获取机构下拉字典数据(看板专用)
    *getAllOrgDictsFunc({ payload, callback }, { call, put }) {
      const response = yield call(getAllOrgDictsAPI, payload);
      if (response && response.status === 200) {
        yield put({
          type: 'allOrgDicts',
          payload: response.data,
        });
        if (callback) callback(response.data);
      } else {
      }
    },

    // 获取产品归属部门下拉数据
    *getOrgBelongFunc({ payload, callback }, { call, put }) {
      const response = yield call(getOrgBelongAPI, payload);
      if (response && response.status === 200) {
        yield put({
          type: 'orgBelongData',
          payload: response.data,
        });
        if (callback) callback(response.data);
      } else {
      }
    },

    // 获取委托人下拉列表
    *getProConsignerFunc({ callback }, { call, put }) {
      const response = yield call(getProConsignerAPI);
      if (response && response.status === 200) {
        yield put({
          type: 'proConsignerData',
          payload: response.data,
        });
        if (callback) callback(response.data);
      } else {
      }
    },

    // 获取产品全称/代码下拉列表数据
    *getProNameAndCodeFunc({ }, { call, put }) {
      const response = yield call(getProNameAndCodeAPI);
      if (response && response.status === 200) {
        yield put({
          type: 'proNameAndCodeData',
          payload: response.data,
        });
      } else {
      }
    },

    // 获取系列全称/号下拉列表数据
    *getSeriesNameFunc({ }, { call, put }) {
      const response = yield call(getSeriesNameCodeAPI);
      if (response && response.status === 200) {
        yield put({
          type: 'seriesNameData',
          payload: response.data,
        });
      } else {
      }
    },

    // 获取产品看板阶段概述信息
    *getProductStageFunc({ }, { call, put }) {
      const response = yield call(getProductStageAPI);
      if (response && response.status === 200) {
        yield put({
          type: 'productStageData',
          payload: response.data,
        });
      } else {
      }
    },

    // 获取投资经理下拉列表
    *getInvestmentManagerFunc({ callback }, { call, put }) {
      const response = yield call(getInvestmentManagerAPI);
      if (response && response.status === 200) {
        yield put({
          type: 'productBillboardInvestmentManagerData',
          payload: response.data,
        });
        if (callback) callback(response.data);
      } else {
      }
    },

    // 表格(产品视图)
    *fetch({ payload, callback }, { call, put }) {
      const response = yield call(getListAPI, payload);
      if (response && response.status === 200) {
        yield put({
          type: 'productBillboardTableData',
          payload: response.data,
        });
        if (callback) callback(response.data);
      } else {
      }
    },

    // 表格(系列视图-父级)
    *newFetch({ payload, callback }, { call, put }) {
      const response = yield call(getListNewAPI, payload);
      if (response && response.status === 200) {
        yield put({
          type: 'productBillboardNewTabsData',
          payload: response.data,
        });
        if (callback) callback(response.data);
      } else {
      }
    },

    // 表格(系列视图-子级)
    *newChildFetch({ payload, callback }, { call, put }) {
      const response = yield call(getListNewChildAPI, payload);
      if (response && response.status === 200) {
        yield put({
          type: 'productBillboardNewTableData',
          payload: response.data,
        });
        if (callback) callback(response.data);
      } else {
      }
    },

    // 表格:产品看板-产品关联表格
    *proLinkNameListFunc({ payload, callback }, { call, put }) {
      const response = yield call(getProLinkNameListAPI, payload);
      if (response && response.status === 200) {
        yield put({
          type: 'proLinkNameListData',
          payload: response.data,
        });
        if (callback) callback(response.data);
      } else {
      }
    },

    // 表格:产品看板-产品关联表格
    *proLinkTableDataFunc({ payload, callback }, { call, put }) {
      const response = yield call(getProLinkTableAPI, payload);
      if (response && response.status === 200) {
        yield put({
          type: 'proLinkTableData',
          payload: response.data,
        });
        if (callback) callback(response.data);
      } else {
      }
    },

    // 表格:产品看板-代码映射表格
    *codeLinkTableDataFunc({ payload, callback }, { call, put }) {
      const response = yield call(getCodeLinkTableAPI, payload);
      if (response && response.status === 200) {
        yield put({
          type: 'codeLinkTableData',
          payload: response.data,
        });
        if (callback) callback(response.data);
      } else {
      }
    },

    // 请求:产品看板-产品关联保存修改
    *proLinkUpdateFunc({ payload, callback }, { call }) {
      const response = yield call(getProLinkUpdateAPI, payload);
      if (response && response.status === 200) {
        message.success(response.message);
        if (callback) callback(response.data);
      } else {
        message.error(response.message);
      }
    },

    // 请求:产品看板-代码映射保存修改
    *codeLinkUpdateFunc({ payload, callback }, { call }) {
      const response = yield call(getCodeLinkUpdateAPI, payload);
      if (response && response.status === 200) {
        message.success('修改成功!', 1);
        if (callback) callback(response.data);
      } else {
        message.success(`修改成功!  提示信息 : ${response.message}`, 1);
      }
    },

    // 产品/系列看板 - 删除
    *deleteProAndSerFunc({ payload, callback }, { call }) {
      const response = yield call(getDeleteProAndSerAPI, payload);
      if (response && response.status === 200) {
        message.success('删除成功', 1);
        if (callback) callback();
      } else {
        message.warn('删除失败', 1);
        message.warn(response.message);
      }
    },

    // 获取产品信息概述
    *overview({ payload, callback }, { call, put }) {
      const response = yield call(getProductOverviewAPI, payload);
      if (response && response.status === 200) {
        yield put({
          type: 'productBillboardProductOverview',
          payload: response.data,
        });
        if (callback) callback(response.data);
      } else {
      }
    },

    // 获取系列信息概述
    *newOverview({ payload, callback }, { call, put }) {
      const response = yield call(getSeriesOverviewAPI, payload);
      if (response && response.status === 200) {
        yield put({
          type: 'productBillboardServicesOverview',
          payload: response.data,
        });
        if (callback) callback(response.data);
      } else {
      }
    },

    // 修改产品信息概述
    *getProductDataUpdateFunc({ payload, callback }, { call }) {
      const response = yield call(getProductDataUpdateAPI, payload);
      if (response && response.status === 200) {
        if (callback) callback();
        message.success('修改成功 ! ', 1);
      } else {
        message.warn('修改失败 !', 1);
        message.warn(response.message);
      }
    },

    // 修改产品信息-产品数据
    *getProductDataUpdateMessageDataFunc({ payload, callback }, { call }) {
      const response = yield call(getProductDataUpMessageDataAPI, payload);
      if (response && response.status === 200) {
        if (callback) callback();
        message.success('修改成功 ! ', 1);
      } else {
        message.warn('修改失败 !', 1);
        message.warn(response.message);
      }
    },

    // 获取canvas数据
    *getProcessTreeFunc({ payload, callback }, { put, call }) {
      const response = yield call(getProcessTreeAPI, payload);
      if (response && response.status === 200) {
        yield put({
          type: 'canvasData',
          payload: response.data,
        });
        callback(response.data.stageList);
      } else {
      }
    },

    // 获取节点任务数统计数据
    *getStatisticsFunc({ payload, callback }, { put, call }) {
      const response = yield call(getStatisticsAPI, payload);
      if (response && response.status === 200) {
        yield put({
          type: 'canvasMessage',
          payload: response.data,
        });
        if (callback) {
          callback(response.data);
        }
      } else {
      }
    },
    // 获取节点状态
    *getNodeStatus({ payload, callback }, { put, call }) {
      const response = yield call(getNodeStatusAPI, payload);
      if (response && response.status === 200) {
        yield put({
          type: 'setNodeStatusList',
          payload: response.data,
        });
        if (callback) {
          callback(response.data);
        }
      } else {
      }
    },

    // 获取生命周期表格
    *getLifeCycleTableFunc({ payload, callback }, { put, call }) {
      const response = yield call(getLifeCycleTableAPI, payload);
      if (response && response.status === 200) {
        yield put({
          type: 'lifeCycleTableData',
          payload: response.data,
        });
        if (callback) {
          callback(response.data);
        }
      } else {
      }
    },

    // 获取产品数据:栅格信息
    *overviewMessageListData({ payload, callback }, { call, put }) {
      const response = yield call(getProductOverviewMessageAPI, payload);
      if (response && response.status === 200) {
        yield put({
          type: 'productOverviewMessage',
          payload: response.data,
        });
        if (callback) callback(response.data);
      } else {
      }
    },

    // 获取产品数据:表格信息
    *overviewMessageTableData({ payload }, { call, put }) {
      const response = yield call(getProductOverviewTableAPI, payload);
      if (response && response.status === 200) {
        yield put({
          type: 'productOverviewTable',
          payload: response.data,
        });
      } else {
      }
    },

    // 获取产品文档信息(表格信息)
    *productFileDataFunc({ payload, callback }, { call, put }) {
      const response = yield call(getProductFileAPI, payload);
      if (response && response.status === 200) {
        yield put({
          type: 'productFileData',
          payload: response.data,
        });
        if (callback) callback(response.data);
      } else {
      }
    },

    // 获取产品文档下拉框列表数据(文档类型)
    *getProductFileListDocTypeFunc({ payload }, { call, put }) {
      const response = yield call(getProductFileListAPI, payload);
      if (response && response.status === 200) {
        yield put({
          type: 'productFileListDocType',
          payload: response.data,
        });
      } else {
      }
    },

    // 获取产品文档下拉框列表数据(明细分类)
    *getProductFileListFileTypeFunc({ payload }, { call, put }) {
      const response = yield call(getProductFileTypeAPI, payload);
      if (response && response.status === 200) {
        yield put({
          type: 'productFileListFileType',
          payload: response.data,
        });
      } else {
      }
    },

    // 下载产品文档
    *productFileDownloadFunc({ payload }, { call }) {
      const response = yield call(getProductFileDownloadAPI, payload);
      if (response && response.status === 200) {
        console.log('下载成功');
      } else {
        console.log('下载失败');
      }
    },

    // 获取时间轴信息(表格信息)
    *timeLineData({ payload, callback }, { call, put }) {
      const response = yield call(getProductTimeLineAPI, payload);
      if (response && response.status === 200) {
        yield put({
          type: 'productTimeLine',
          payload: response.data,
        });
        if (callback) callback(response.data);
      } else {
      }
    },

    // 获取账户信息(表格信息)
    *accountDataFunc({ payload, callback }, { call, put }) {
      const response = yield call(getAccountDataAPI, payload);
      if (response && response.status === 200) {
        yield put({
          type: 'accountData',
          payload: response.data,
        });
        if (callback) callback(response.data);
      } else {
      }
    },

    // 获取交易确认信息(表格信息)
    *dealConfirmFunc({ payload, callback }, { call, put }) {
      const response = yield call(getDealConfirmAPI, payload);
      if (response && response.status === 200) {
        yield put({
          type: 'dealConfirmData',
          payload: response.data,
        });
        if (callback) callback(response.data);
      } else {
      }
    },

    // 获取信披信息(表格信息)
    *informationDisclosureFunc({ payload, callback }, { call, put }) {
      const response = yield call(getInformationDisclosureAPI, payload);
      if (response && response.status === 200) {
        yield put({
          type: 'informationDisclosureData',
          payload: response.data,
        });
        if (callback) callback(response.data);
      } else {
      }
    },

    // 获取评审记录信息(表格信息)
    *reviewRecordFunc({ payload, callback }, { call, put }) {
      const response = yield call(getReviewRecordAPI, payload);
      if (response && response.status === 200) {
        yield put({
          type: 'reviewRecordData',
          payload: response.data,
        });
        if (callback) callback(response.data);
      } else {
      }
    },

    // 获取下级系列信息(表格信息)
    *subordinateSeriesFunc({ payload, callback }, { call, put }) {
      const response = yield call(getSubordinateSeriesAPI, payload);
      if (response && response.status === 200) {
        yield put({
          type: 'subordinateSeriesData',
          payload: response.data,
        });
        if (callback) callback(response.data);
      } else {
      }
    },

    // 获取系列产品信息(表格信息)
    *seriesProductFunc({ payload, callback }, { call, put }) {
      const response = yield call(getSeriesProductAPI, payload);
      if (response && response.status === 200) {
        yield put({
          type: 'seriesProductData',
          payload: response.data,
        });
        if (callback) callback(response.data);
      } else {
      }
    },

    // 获取定期报告信息(表格信息)
    *periodicReportDataFunc({ payload, callback }, { call, put }) {
      const response = yield call(getPeriodicReportDataAPI, payload);
      if (response && response.status === 200) {
        yield put({
          type: 'periodicReportData',
          payload: response.data,
        });
        if (callback) callback(response.data);
      } else {
      }
    },

    // 获取分红明细信息(表格信息 - 数据中心)
    *getBonusOfDetailFunc({ payload, callback }, { call, put }) {
      const response = yield call(getBonusOfDetailAPI, payload);
      if (response && response.status === 200) {
        yield put({
          type: 'bonusOfDetailData',
          payload: response.data,
        });
        if (callback) callback(response.data);
      } else {
      }
    },

    // 获取投资者信息(表格信息 - 数据中心)
    *getInvestorFunc({ payload, callback }, { call, put }) {
      const response = yield call(getInvestorAPI, payload);
      if (response && response.status === 200) {
        yield put({
          type: 'investorData',
          payload: response.data,
        });
        if (callback) callback(response.data);
      } else {
      }
    },

    // 获取干系人信息(表格信息)
    *stakeholderDataFunc({ payload, callback }, { call, put }) {
      const response = yield call(getStakeholderAPI, payload);
      if (response && response.status === 200) {
        yield put({
          type: 'stakeholderData',
          payload: response.data,
        });
        if (callback) callback(response.data);
      } else {
      }
    },

    // 获取销售机构管理信息(表格信息)
    *salesOrganizationDataFunc({ payload, callback }, { call, put }) {
      const response = yield call(getSalesOrganizationAPI, payload);
      if (response && response.status === 200) {
        yield put({
          type: 'salesOrganizationData',
          payload: response.data,
        });
        if (callback) callback(response.data);
      } else {
      }
    },

    // 产品数据(参数设置详情)
    *getASFunc({ payload }, { call, put }) {
      const response = yield call(getASAPI, payload);
      if (response && response.status === 200) {
        yield put({
          type: 'AS',
          payload: response.data,
        });
      } else {
      }
    },

    // 产品数据(要素补录详情)
    *getRCFunc({ payload }, { call, put }) {
      const response = yield call(getRCAPI, payload);
      if (response && response.status === 200) {
        yield put({
          type: 'RC',
          payload: response.data,
        });
      } else {
      }
    },

    // 获取监管要素(表格信息)
    *getRegulatoryElements({ payload, callback }, { call, put }) {
      const res = yield call(reqRegulatoryElements, payload);
      if (res && res.status === 200) {
        return res.data
      } else {
        if (res.message) {
          message.warn(res.message);
        } else {
          message.warn('监管要素查询失败')
        }
      }
    },

    // 获取所有用户信息-监管要素操作人id转name
    *getAllUsers({ payload, callback }, { call, put }) {
      const res = yield call(reqAllUsers, payload);
      if (res && res.status === 200) {
        return res.data
      } else {
        if (res.message) {
          message.warn(res.message);
        } else {
          console.log('接口yss-base-admin/user/users-all请求失败')
        }
      }
    },


  },

  reducers: {
    // 更新canvas节点的进度
    setNodeStatusList(state, { payload }) {
      return {
        ...state,
        nodeStatusList: payload,
      };
    },

    dicts(state, { payload }) {
      return {
        ...state,
        dicts: payload,
      };
    },

    proTypeDatas(state, { payload }) {
      return {
        ...state,
        proTypeDatas: payload,
      };
    },

    orgDicts(state, { payload }) {
      return {
        ...state,
        orgDicts: payload,
      };
    },

    allOrgDicts(state, { payload }) {
      return {
        ...state,
        allOrgDicts: payload,
      };
    },

    orgBelongData(state, { payload }) {
      return {
        ...state,
        orgBelongData: payload,
      };
    },

    proConsignerData(state, { payload }) {
      return {
        ...state,
        proConsignerData: payload,
      };
    },

    proNameAndCodeData(state, { payload }) {
      return {
        ...state,
        proNameAndCodeData: payload,
      };
    },

    proLinkNameListData(state, { payload }) {
      return {
        ...state,
        proLinkNameListData: payload,
      };
    },

    proLinkTableData(state, { payload }) {
      return {
        ...state,
        proLinkTableData: payload,
      };
    },

    codeLinkTableData(state, { payload }) {
      return {
        ...state,
        codeLinkTableData: payload,
      };
    },

    productStageData(state, { payload }) {
      return {
        ...state,
        productStageData: payload,
      };
    },

    productBillboardInvestmentManagerData(state, { payload }) {
      return {
        ...state,
        productBillboardInvestmentManagerData: payload,
      };
    },

    seriesNameData(state, { payload }) {
      return {
        ...state,
        seriesNameData: payload,
      };
    },

    canvasData(state, { payload }) {
      return {
        ...state,
        canvasData: payload,
      };
    },

    canvasMessage(state, { payload }) {
      return {
        ...state,
        canvasMessage: payload,
      };
    },

    lifeCycleTableData(state, { payload }) {
      return {
        ...state,
        lifeCycleTableData: payload,
      };
    },

    productBillboardTableData(state, { payload }) {
      return {
        ...state,
        productBillboardTableData: payload,
      };
    },

    productBillboardNewTableData(state, { payload }) {
      return {
        ...state,
        productBillboardNewTableData: payload,
      };
    },

    productBillboardNewTabsData(state, { payload }) {
      return {
        ...state,
        productBillboardNewTabsData: payload,
      };
    },

    productBillboardProductOverview(state, { payload }) {
      return {
        ...state,
        productBillboardProductOverview: payload,
      };
    },

    productBillboardServicesOverview(state, { payload }) {
      return {
        ...state,
        productBillboardServicesOverview: payload,
      };
    },

    productOverviewMessage(state, { payload }) {
      return {
        ...state,
        productOverviewMessage: payload,
      };
    },

    productOverviewTable(state, { payload }) {
      return {
        ...state,
        productOverviewTable: payload,
      };
    },

    productFileData(state, { payload }) {
      return {
        ...state,
        productFileData: payload,
      };
    },

    productFileListDocType(state, { payload }) {
      return {
        ...state,
        productFileListDocType: payload,
      };
    },

    productFileListFileType(state, { payload }) {
      return {
        ...state,
        productFileListFileType: payload,
      };
    },

    productTimeLine(state, { payload }) {
      return {
        ...state,
        productTimeLine: payload,
      };
    },

    accountData(state, { payload }) {
      return {
        ...state,
        accountData: payload,
      };
    },

    dealConfirmData(state, { payload }) {
      return {
        ...state,
        dealConfirmData: payload,
      };
    },

    informationDisclosureData(state, { payload }) {
      return {
        ...state,
        informationDisclosureData: payload,
      };
    },

    reviewRecordData(state, { payload }) {
      return {
        ...state,
        reviewRecordData: payload,
      };
    },

    subordinateSeriesData(state, { payload }) {
      return {
        ...state,
        subordinateSeriesData: payload,
      };
    },

    seriesProductData(state, { payload }) {
      return {
        ...state,
        seriesProductData: payload,
      };
    },

    periodicReportData(state, { payload }) {
      return {
        ...state,
        periodicReportData: payload,
      };
    },

    bonusOfDetailData(state, { payload }) {
      return {
        ...state,
        bonusOfDetailData: payload,
      };
    },

    investorData(state, { payload }) {
      return {
        ...state,
        investorData: payload,
      };
    },

    stakeholderData(state, { payload }) {
      return {
        ...state,
        stakeholderData: payload,
      };
    },

    salesOrganizationData(state, { payload }) {
      return {
        ...state,
        salesOrganizationData: payload,
      };
    },

    AS(state, { payload }) {
      return {
        ...state,
        AS: payload,
      };
    },

    RC(state, { payload }) {
      return {
        ...state,
        RC: payload,
      };
    },
  },
};
