import { message } from 'antd';
import {
  getData,
  getQueryCriteriaAPI,
  getCustomDocumentListAPI,
  getTradeConfirmListAPI,
  getInvestProductListAPI,
  getInvesReviewResultAPI,
  handleCheckedAPI,
  handleDeleteAPI,
  handleDetailAPI,
  handleAddAPI,
  getFileTypeDictsAPI,
  getOrgDictsAPI,
  getDictsAPI,
  handleGetAdditionalRecordAPI,
  handleAdditionalRecordAPI,
  getQueryByLinkageAPI,
} from '@/services/investorsManagement';

let model = {
  namespace: 'myInvestor',

  state: {
    saveFetchList: {
      rows: [],
      total: 0,
    },
    orgDicts: [],
    dicts: [],
    fileTypeList: [],
    orgDicts: [],
    customDocumentData: {
      fileInfoList: [],
      total: 0,
    },
    tradeConfirmData: {
      tradeConfirmList: [],
      tradeConfirmTotal: 0,
    },
    investProductData: {
      investProductList: [],
      investProductTotal: 0,
    },
    invesReviewResult: {},
    saveDetail: {},
    saveDictBatchQuery: {},
    additionalRecordDetail: {},
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(getData, payload);
      if (response.status === 200) {
        yield put({
          type: 'saveFetchList',
          payload: response.data,
        });
      }
    },

    // 查询条件（词汇字典）
    *queryCriteria({ payload }, { call, put }) {
      const response = yield call(getQueryCriteriaAPI, payload);
      if (response.status === 200) {
        yield put({
          type: 'saveDictBatchQuery',
          payload: response.data,
        });
      }
    },

    // 审核/反审核
    *handleChecked({ payload }, { call, put }) {
      const response = yield call(handleCheckedAPI, payload);
      if (response.status === 200) {
        message.success('操作成功');
        return response;
      } else {
        message.error('操作失败!');
      }
    },

    // 获取数据字典
    *getDicts({ payload, callback }, { call, put }) {
      const response = yield call(getDictsAPI, payload.codeList);
      if (payload.type) {
        return response;
      }
      if (response && response.status === 200) {
        yield put({
          type: 'dicts',
          payload: response.data,
        });
        callback && callback(response);
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

    // 获取文件类型下拉列表
    *getFileTypeDicts({ payload, callback }, { call, put }) {
      const response = yield call(getFileTypeDictsAPI, payload);
      if (response && response.status === 200) {
        yield put({
          type: 'fileTypeList',
          payload: response.data,
        });
      } else {
      }
    },

    // 获取客户文档信息列表
    *getCustomDocumentList({ payload, callback }, { call, put }) {
      const response = yield call(getCustomDocumentListAPI, payload);
      if (response && response.status === 200) {
        yield put({
          type: 'customDocumentList',
          payload: response.data,
        });
        if (callback) callback(response.data);
      } else {
      }
    },

    // 获取交易确认信息列表
    *getTradeConfirmList({ payload, callback }, { call, put }) {
      const response = yield call(getTradeConfirmListAPI, payload);
      if (response && response.status === 200) {
        yield put({
          type: 'tradeConfirmList',
          payload: response.data,
        });
        if (callback) callback(response.data);
      } else {
      }
    },

    // 获取投资产品信息列表
    *getInvestProductList({ payload, callback }, { call, put }) {
      const response = yield call(getInvestProductListAPI, payload);
      if (response && response.status === 200) {
        yield put({
          type: 'investProductList',
          payload: response.data,
        });
        if (callback) callback(response.data);
      } else {
      }
    },

    // 获取审查信息
    *getInvesReviewResult({ payload, callback }, { call, put }) {
      const response = yield call(getInvesReviewResultAPI, payload);
      if (response && response.status === 200) {
        yield put({
          type: 'invesReviewResult',
          payload: response.data,
        });
      } else {
      }
      return response;
    },

    // 删除
    *handleDelete({ payload }, { call, put }) {
      const response = yield call(handleDeleteAPI, payload);
      if (response.status === 200) {
        message.success('操作成功');
        return response;
      } else {
        message.error('操作失败!');
      }
    },

    // 客户信息反显详情
    *handleDetail({ payload }, { call, put }) {
      const response = yield call(handleDetailAPI, payload);
      if (response.status === 200) {
        yield put({
          type: 'saveDetail',
          payload: response.data,
        });
        return response;
      } else {
        message.error('客户信息查询失败');
      }
    },

    // 【新增】客户信息
    *handleAdd({ payload, callback }, { call }) {
      const response = yield call(handleAddAPI, payload);
      if (response.status === 200) {
        message.success('操作成功');
      } else {
        message.error(response.message);
      }
      if (callback) callback(response);
    },

    // 补录：详情
    *handleGetAdditionalRecord({ payload }, { call, put }) {
      const response = yield call(handleGetAdditionalRecordAPI, payload);
      if (response.status === 200) {
        yield put({
          type: 'additionalRecordDetail',
          payload: response.data,
        });
        return response;
      } else {
        message.error('补录信息查询失败');
      }
    },

    // 补录：提交
    *handleAdditionalRecord({ payload }, { call, put }) {
      const response = yield call(handleAdditionalRecordAPI, payload);
      if (response.status === 200) {
        return response;
      } else {
        message.error(response.message);
      }
    },

    *handleGetQueryByLinkage({ payload, callback }, { call, put }) {
      const response = yield call(getQueryByLinkageAPI, payload);
      if (response && response.status === 200) {
        callback && callback(response);
      } else {
        message.error(res.message);
      }
    },
  },

  reducers: {
    saveDictBatchQuery(state, action) {
      return {
        ...state,
        saveDictBatchQuery: action.payload,
      };
    },
    saveFetchList(state, { payload }) {
      return {
        ...state,
        saveFetchList: payload,
      };
    },
    saveDetail(state, { payload }) {
      return {
        ...state,
        saveDetail: payload,
      };
    },
    fileTypeList(state, { payload }) {
      return {
        ...state,
        fileTypeList: payload,
      };
    },
    orgDicts(state, { payload }) {
      return {
        ...state,
        orgDicts: payload,
      };
    },
    dicts(state, { payload }) {
      return {
        ...state,
        dicts: payload,
      };
    },
    customDocumentList(state, { payload }) {
      return {
        ...state,
        customDocumentData: {
          fileInfoList: payload.fileInfoList,
          total: payload.total,
        },
      };
    },
    tradeConfirmList(state, { payload }) {
      return {
        ...state,
        tradeConfirmData: {
          tradeConfirmList: payload.rows,
          tradeConfirmTotal: payload.total,
        },
      };
    },
    investProductList(state, { payload }) {
      return {
        ...state,
        investProductData: {
          investProductList: payload.rows,
          investProductTotal: payload.total,
        },
      };
    },
    invesReviewResult(state, { payload }) {
      return {
        ...state,
        invesReviewResult: payload,
      };
    },
    additionalRecordDetail(state, { payload }) {
      return {
        ...state,
        additionalRecordDetail: payload,
      };
    },
  },
};

export default model;
