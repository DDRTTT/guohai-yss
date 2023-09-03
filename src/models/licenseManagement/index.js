/**
 * 回执编码申请审核
 * * */
import { message } from 'antd';
import {
  extendTime,
  queryReceiptDetail,
  queryReceiptList,
  serviceReceiptCheck,
  serviceReceiptDel,
  serviceReceiptHandle,
} from '@/services/licenseManagement';

const model = {
  namespace: 'licenseManagement',

  state: {
    currentPage: 1,

    receiptListDate: {
      total: 0,
      rows: [],
    },

    // 存储签章详情数据
    receiptDetailData: {},
  },

  effects: {
    // 列表
    *receiptListWay({ payload }, { call, put }) {
      const response = yield call(queryReceiptList, payload);
      if (response && response.status === 200) {
        yield put({
          type: 'receiptListDate',
          payload: response.data,
        });
      }
    },

    // 详情
    *receiptDetail({ payload }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });

      const response = yield call(queryReceiptDetail, payload);

      yield put({
        type: 'receiptDetailData',
        payload: response.data,
      });

      yield put({
        type: 'changeLoading',
        payload: false,
      });

      return response;
    },

    // 删除
    *receiptDelete({ payload }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });

      const response = yield call(serviceReceiptDel, payload.deleteparams);

      if (response.status === 200) {
        message.success('删除成功');

        yield put({
          type: 'receiptListWay',
          payload: payload.payload,
        });
      } else {
        message.error(response.message);
      }

      yield put({
        type: 'changeLoading',
        payload: false,
      });

      return response;
    },

    // 反审核
    *receiptCheck({ payload }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });

      const response = yield call(serviceReceiptCheck, payload.deleteparams);

      if (response.status === 200) {
        message.success('反审核成功');

        yield put({
          type: 'receiptListWay',
          payload: payload.payload,
        });
      } else {
        message.error(response.message);
      }

      yield put({
        type: 'changeLoading',
        payload: false,
      });

      return response;
    },

    // 驳回&通过&修改
    *DismissPass({ payload }, { call, put }) {
      return yield call(serviceReceiptHandle, payload);
    },

    // 延期
    *setUpTime({ payload }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });

      const response = yield call(extendTime, payload);

      yield put({
        type: 'changeLoading',
        payload: false,
      });

      return response;
    },
  },

  reducers: {
    changeLoading(state, action) {
      return {
        ...state,
        loading: action.payload,
      };
    },

    pageChange(state, action) {
      return {
        ...state,
        currentPage: action.payload,
      };
    },

    receiptListDate(state, action) {
      return {
        ...state,
        receiptListDate: action.payload,
      };
    },

    receiptDetailData(state, action) {
      return {
        ...state,
        receiptDetailData: action.payload,
      };
    },
  },
};

export default model;
