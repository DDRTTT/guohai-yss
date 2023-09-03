import {
  handleGetListAPI,
  handleProductEnumSearchAPI,
  handleWordDictionaryFetchAPI,
} from '@/services/informationExportManage';
import { message } from 'antd';

export default {
  namespace: 'informationExportManage',
  state: {
    saveListFetch: {
      total: '',
      rows: [],
    },
    saveWordDictionaryFetch: {},
  },

  effects: {
    // 列表
    *handleGetListInfo({ payload }, { call, put }) {
      const response = yield call(handleGetListAPI, payload);
      if (response && response.status === 200) {
        yield put({
          type: 'saveListFetch',
          payload: response.data,
        });
      }
    },

    // 字典查询
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
