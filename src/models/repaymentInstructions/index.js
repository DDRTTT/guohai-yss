import {
  getListAPI,
  getProType,
  getProNameAndCodeAPI,
  getDictsAPI,
  getInvestmentManagerAPI,
  getRevokeAPI,
  getDeleteAPI,
  batchCommit,
  checksAPI,
  uploadsAPI,
  getProTypeListAPI,
  getReceiptList,
  getReceiptData,
  withdraw
} from '@/services/repaymentInstructions/index';
import { message } from 'antd';

export default {
  namespace: 'repaymentInstructions',
  state: {
    dicts: {},
    proTypeDatas: [],
    investmentManagerDataList: [],
    proNameAndCodeData: [],
    riseOverTableData: {
      total: '',
      rows: [],
    },
    revokeData: {},
    paymentTypeList: [],
    otherPaymentTypeList: [],
    expenseListPaymentTypeList: [],
    pdfPaymentTypeList: []
  },

  effects: {
    // 获取数据字典
    *getDicts({ payload }, { call, put }) {
      const response = yield call(getDictsAPI, payload.codeList);
      if (response && response.status === 200) {
        yield put({
          type: 'dicts',
          payload: response.data,
        });
      } else {
      }
    },

    *getProTypeFunc({ }, { call, put }) {
      const response = yield call(getProType);
      if (response && response.status === 200) {
        yield put({
          type: 'proTypeDatas',
          payload: response.data,
        });
      } else {
      }
    },

    // 获取产品全称/代码下拉列表数据
    *getProNameAndCodeFunc({ payload }, { call, put }) {
      const response = yield call(getProNameAndCodeAPI, payload?.isAccountCancel);
      if (response && response.status === 200) {
        yield put({
          type: 'proNameAndCodeData',
          payload: response.data,
        });
      } else {
      }
    },

    // 获取分页列表数据
    *fetch({ payload, callback }, { call, put }) {
      const response = yield call(getListAPI, payload);
      if (response && response.status === 200) {
        yield put({
          type: 'riseOverTableData',
          payload: response.data,
        });
        if (callback) callback(response.data);
      } else {
        yield put({
          type: 'riseOverTableData',
          payload: [],
        });
        message.error(response.message, 1);
      }
    },

    // 获取投资经理下拉列表
    *getInvestmentManagerFunc({ }, { call, put }) {
      const response = yield call(getInvestmentManagerAPI);
      if (response && response.status === 200) {
        yield put({
          type: 'investmentManagerDataList',
          payload: response.data,
        });
      } else {
      }
    },

    // 删除
    *getDeleteFunc({ payload, callback }, { call }) {
      const response = yield call(getDeleteAPI, payload);
      if (response && response.status === 200) {
        message.success(' 删除成功 ! ', 1);
        if (callback) callback();
      } else {
        message.error(' 删除失败 ! ', 1);
      }
    },

    // 撤销
    *getRevokeFunc({ payload, callback }, { call }) {
      const response = yield call(getRevokeAPI, payload);
      if (response && response.status === 200) {
        message.success(' 撤销成功 ! ', 1);
        if (callback) callback();
      } else {
        message.error(' 撤销失败 ! ', 1);
      }
    },

    // 批量提交
    *handleGetBatchCommitFunc({ payload, callback }, { call }) {
      const response = yield call(batchCommit, payload);
      if (response && response.status === 200) {
        message.success('提交成功');
        if (callback) callback();
      } else {
        message.warn(response.message);
      }
    },

    // 批量办理
    *handleGetChecksFunc({ payload, callback }, { call }) {
      const response = yield call(checksAPI, payload);
      if (response && response.status === 200) {
        message.success('批量办理成功');
        if (callback) callback();
      } else {
        message.warn(response.message);
      }
    },

    // 批量上传
    *handleGetUploadsFunc({ payload, callback }, { call }) {
      const response = yield call(uploadsAPI, payload);
      if (response && response.status === 200) {
        message.success('批量上传成功');
      } else {
        message.warn(response.message);
      }
      if (callback) callback();
    },

    // 请求 费用类型 下拉列表
    *getProTypeListAPI({ }, { call, put }) {
      const response = yield call(getProTypeListAPI, 'expensePaymentType');
      if (response) {
        yield put({
          type: 'setPaymentTypeList',
          payload: response || [],
        });
      }
    },

    // 获取 费用列表页面 费用类型下拉值
    *getExpenseListPaymentType({ }, { call, put }) {
      const response = yield call(getProTypeListAPI, 'expenseListPaymentType');
      if (response) {
        yield put({
          type: 'setExpenseListPaymentTypeList',
          payload: response || [],
        });
      }
    },

    // 请求 款项类型 下拉列表
    *getOtherProTypeListAPI({ }, { call, put }) {
      const response = yield call(getProTypeListAPI, 'transferOrdPayType');
      if (response) {
        yield put({
          type: 'setOtherPaymentTypeList',
          payload: response || [],
        });
      }
    },

    // 划款指令，撤回
    *handleWithdraw({payload, callback}, {call, put}) {
      const response = yield call(withdraw, payload);
      if (response && response.status === 200) {
        if (callback) callback(response.data);
      }
    },

    // 导入PDF生成划款指令弹框 费用类型 获取
    *getPdfPaymentTypeListApi({ }, { call, put }) {
      const response = yield call(getProTypeListAPI, 'pdfPaymentType');
      if (response) {
        yield put({
          type: 'setPdfPaymentTypeList',
          payload: response || [],
        });
      }
    },

    // 查询费用列表数据
    *getReceiptList({ payload, callback }, { call }) {
      const response = yield call(getReceiptList, payload);
      if (response && response.status === 200) {
        if (callback) callback(response.data);
      }
    },

    *getReceiptData({ payload, callback }, { call }) {
      const response = yield call(getReceiptData, payload);
      if (!response) {
        if (callback) callback();
      } else {
        message.warn('您选择的日期暂无数据');
      }
    },
  },

  reducers: {
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

    proNameAndCodeData(state, { payload }) {
      return {
        ...state,
        proNameAndCodeData: payload,
      };
    },

    investmentManagerDataList(state, { payload }) {
      return {
        ...state,
        investmentManagerDataList: payload,
      };
    },

    riseOverTableData(state, { payload }) {
      return {
        ...state,
        riseOverTableData: payload,
      };
    },

    setPaymentTypeList(state, { payload }) {
      return {
        ...state,
        paymentTypeList: payload,
      };
    },

    setExpenseListPaymentTypeList(state, { payload }) {
      return {
        ...state,
        expenseListPaymentTypeList: payload,
      };
    },

    setOtherPaymentTypeList(state, { payload }) {
      return {
        ...state,
        otherPaymentTypeList: payload,
      };
    },

    setPdfPaymentTypeList(state, { payload }) {
      return {
        ...state,
        pdfPaymentTypeList: payload,
      };
    },
  },
};
