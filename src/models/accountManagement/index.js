import { getListAPI, getProNameAndCodeAPI, getDictsAPI } from '@/services/accountManagement/index';

export default {
  namespace: 'accountManagement',
  state: {
    dicts: {},
    proNameAndCodeData: [],
    accountManagementTableData: {
      total: '',
      rows: [],
    },
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

    // 获取产品全称/代码下拉列表数据
    *getProNameAndCodeFunc({}, { call, put }) {
      const response = yield call(getProNameAndCodeAPI);
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
      if (response.status === 200) {
        yield put({
          type: 'accountManagementTableData',
          payload: response.data,
        });
        if (callback) callback(response.data);
      } else {
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

    proNameAndCodeData(state, { payload }) {
      return {
        ...state,
        proNameAndCodeData: payload,
      };
    },

    accountManagementTableData(state, { payload }) {
      return {
        ...state,
        accountManagementTableData: payload,
      };
    },
  },
};
