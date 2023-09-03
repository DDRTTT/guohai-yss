import {
  handleGetProductRaisingPeriodAdjustmentFetchAPI,
  handleWordDictionaryFetchAPI,
} from '@/services/productOfferingPeriod/marketAgent';
import { message } from 'antd';

export default {
  namespace: 'marketAgent',

  state: {
    saveListFetch: {
      total: '',
      rows: [],
    },
    saveWordDictionaryFetch: {},
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
        message.warn(response.message);
      }
    },

    *handleWordDictionaryFetch({ payload }, { call, put }) {
      const response = yield call(handleWordDictionaryFetchAPI, payload);
      if (response && response.status === 200) {
        yield put({
          type: 'saveWordDictionaryFetch',
          payload: response.data,
        });
      } else {
        message.warn(response.message);
      }
    },
  },

  reducers: {
    saveListFetch(state, { payload }) {
      return {
        ...state,
        saveListFetch: payload,
      };
    },
    saveWordDictionaryFetch(state, { payload }) {
      return {
        ...state,
        saveWordDictionaryFetch: payload,
      };
    },
  },
};
