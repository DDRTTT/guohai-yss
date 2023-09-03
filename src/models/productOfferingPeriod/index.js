import {
  handleGetProductRaisingPeriodAdjustmentFetchAPI,
  handleWordDictionaryFetchAPI,
  handleBatchSubmitAPI,
  revokeAPI,
  deleteAPI,
  handleGetManagerAPI,
} from '@/services/productOfferingPeriod';
import { handleRaiseDateAdjustmentAPI } from '@/services/productOfferingPeriod/update';
import { message } from 'antd';

export default {
  namespace: 'productOfferingPeriod',

  state: {
    saveListFetch: {
      total: '',
      rows: [],
    },
    saveWordDictionaryFetch: {},
    saveMsgByUpdate: {},
    saveManagerFetch: [],
  },

  effects: {
    // 产品募集期调整 列表（搜索）
    *handleListFetch({ payload }, { call, put }) {
      const response = yield call(handleGetProductRaisingPeriodAdjustmentFetchAPI, payload);
      if (response && response.status === 200) {
        yield put({
          type: 'saveListFetch',
          payload: response.data,
        });
      } else {
        yield put({
          type: 'saveListFetch',
          payload: {
            total: '',
            rows: [],
          },
        });
        message.warn(response.message);
      }
    },

    *handleWordDictionaryFetch({ payload }, { call, put }) {
      const response = yield call(handleWordDictionaryFetchAPI, payload);
      if (response && response.status === 200) {
        // 去掉A002下的单一
        const newA002 = [];
        response.data.A002 &&
          response.data.A002.forEach(item => {
            if (item.code !== 'A002_1') {
              newA002.push(item);
            }
          });
        response.data.A002 = newA002;
        yield put({
          type: 'saveWordDictionaryFetch',
          payload: response.data,
        });
      } else {
        message.warn(response.message);
      }
    },
    // 投资经理
    *handleManagerFetch({ payload }, { call, put }) {
      const response = yield call(handleGetManagerAPI, payload);
      if (response && response.status === 200) {
        yield put({
          type: 'saveManagerFetch',
          payload: response.data,
        });
      } else {
        message.warn(response.message);
      }
    },

    // 修改页面查询详情
    *handleMsgByUpdate({ payload }, { call, put }) {
      const response = yield call(handleRaiseDateAdjustmentAPI, payload);
      if (response) {
        yield put({
          type: 'saveMsgByUpdate',
          payload: response.data,
        });
      } else {
        message.warn(response.message);
      }
    },
    // 撤销
    *handleRevoke({ payload }, { call }) {
      const response = yield call(revokeAPI, payload);
      let flag = false;
      if (response && response.status === 200) {
        flag = true;
        message.success('撤销成功');
      } else {
        message.warn(response.message);
      }
      return flag;
    },
    // 删除
    *handleDelete({ payload }, { call }) {
      const response = yield call(deleteAPI, payload);
      let flag = false;
      if (response && response.status === 200) {
        flag = true;
        message.success('删除成功');
      } else {
        message.warn(response.message);
      }
      return flag;
    },
    // 批量提交
    *handleBatchSubmitByIndex({ payload }, { call, put }) {
      const response = yield call(handleBatchSubmitAPI, payload);
      let flag = false;
      if (response && response.status === 200) {
        flag = true;
        message.success('提交成功');
      } else {
        message.warn(response.message);
      }
      return flag;
    },
  },

  reducers: {
    saveListFetch(state, { payload }) {
      return {
        ...state,
        saveListFetch: payload,
      };
    },
    saveManagerFetch(state, { payload }) {
      return {
        ...state,
        saveManagerFetch: payload,
      };
    },
    saveWordDictionaryFetch(state, { payload }) {
      return {
        ...state,
        saveWordDictionaryFetch: payload,
      };
    },
    saveMsgByUpdate(state, { payload }) {
      return {
        ...state,
        saveMsgByUpdate: payload,
      };
    },
  },
};
