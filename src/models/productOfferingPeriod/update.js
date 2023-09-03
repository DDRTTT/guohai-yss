import {
  handleRaiseDateAdjustmentAPI,
  handleRaiseDateAdjustmentProductAPI,
  handleProductEnumSearchAPI,
  handleWordDictionaryFetchAPI,
} from '@/services/productOfferingPeriod/update';
import { message } from 'antd';

export default {
  namespace: 'productOfferingPeriodUpdate',

  state: {
    saveMsgByUpdate: {},
    saveWordDictionaryFetch: {},
    saveBackMsgByUpdate: {},
    saveProductSelection: [],
    saveRiskDictionaryFetch: [],
    saveTypeDictionaryFetch: [],
  },
  effects: {
    // 产品名称下拉框查询
    *handleProductSearch({ payload }, { call, put }) {
      const response = yield call(handleProductEnumSearchAPI, payload);
      if (response && response.status === 200) {
        yield put({
          type: 'saveProductSelection',
          payload: response.data,
        });
      } else {
        message.warn(response.message);
      }
    },
    // 根据产品名称回显信息
    *handleGetBackMsgByAdd({ payload }, { call, put }) {
      const response = yield call(handleRaiseDateAdjustmentProductAPI, payload);
      if (response && response.status === 200) {
        yield put({
          type: 'data',
          payload: response.data,
        });
        return response.data;
      }
      message.warn(response.message);
      return false;
    },
    // 修改页面 查询详情 根据id
    *handleMsgByUpdate({ payload }, { call, put }) {
      const response = yield call(handleRaiseDateAdjustmentAPI, payload);
      if (response && response.status === 200) {
        yield put({
          type: 'saveMsgByUpdate',
          payload: response.data,
        });
      }
      message.warn(response.message);
    },
    // 修改页面 回显信息 根据ProCode
    *handleGetBackMsgByUpdate({ payload }, { call, put }) {
      const response = yield call(handleRaiseDateAdjustmentProductAPI, payload);
      if (response && response.status === 200) {
        yield put({
          type: 'saveBackMsgByUpdate',
          payload: response.data,
        });
        return response.data;
      }
      message.warn(response.message);
      return false;
    },
    // 字典
    *handleWordDictionaryFetch({ payload }, { call, put }) {
      const response = yield call(handleWordDictionaryFetchAPI, payload);
      if (response && response.status === 200) {
        if (payload.type === 'risk') {
          yield put({
            type: 'saveRiskDictionaryFetch',
            payload: response,
          });
        } else {
          yield put({
            type: 'saveTypeDictionaryFetch',
            payload: response,
          });
        }
      } else {
        message.warn(response.message);
      }
    },
  },

  reducers: {
    saveProductSelection(state, { payload }) {
      return {
        ...state,
        saveProductSelection: payload,
      };
    },
    saveBackMsgByAdd(state, { payload }) {
      return {
        ...state,
        saveBackMsgByAdd: payload,
      };
    },
    saveMsgByUpdate(state, { payload }) {
      return {
        ...state,
        saveMsgByUpdate: payload,
      };
    },
    saveWordDictionaryFetch(state, { payload }) {
      return {
        ...state,
        saveWordDictionaryFetch: payload,
      };
    },
    saveBackMsgByUpdate(state, { payload }) {
      return {
        ...state,
        saveBackMsgByUpdate: payload,
      };
    },
    saveRiskDictionaryFetch(state, { payload }) {
      return {
        ...state,
        saveRiskDictionaryFetch: payload,
      };
    },
    saveTypeDictionaryFetch(state, { payload }) {
      return {
        ...state,
        saveTypeDictionaryFetch: payload,
      };
    },
  },
};
