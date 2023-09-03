import {
  getMenuListAPI,
  getProductTableAPI,
  getSerivcesTableAPI,
  getProductInfoTableAPI,
} from '@/services/productInformationBase/index';

export default {
  namespace: 'productInformationBase',

  state: {
    menuList: {},
    productTable: { rows: [], total: '' },
    servicesTable: { rows: [], total: '' },
    productTableInfo: { rows: [], total: '' },
  },

  effects: {
    // 菜单
    *getMenuListFunc({ payload, callback }, { call, put }) {
      const response = yield call(getMenuListAPI, payload);
      if (response && response.status === 200) {
        yield put({
          type: 'menuList',
          payload: response.data,
        });
        if (callback) callback(response.data);
      } else {
      }
    },

    // 表格:产品基本信息
    *getProductTableFunc({ payload, callback }, { call, put }) {
      const response = yield call(getProductTableAPI, payload);
      if (response && response.status === 200) {
        yield put({
          type: 'productTable',
          payload: response.data,
        });
        if (callback) callback(response.data);
      } else {
      }
    },

    // 表格:系列基本信息
    *getServicesTableFunc({ payload, callback }, { call, put }) {
      const response = yield call(getSerivcesTableAPI, payload);
      if (response && response.status === 200) {
        yield put({
          type: 'servicesTable',
          payload: response.data,
        });
        if (callback) callback(response.data);
      } else {
      }
    },

    // 表格:产品数据信息
    *getProductInfoTableFunc({ payload, callback }, { call, put }) {
      const response = yield call(getProductInfoTableAPI, payload);
      if (response && response.status === 200) {
        yield put({
          type: 'productTableInfo',
          payload: response.data,
        });
        if (callback) callback(response.data);
      } else {
      }
    },
  },
  reducers: {
    menuList(state, { payload }) {
      return {
        ...state,
        menuList: payload,
      };
    },

    productTable(state, { payload }) {
      return {
        ...state,
        productTable: payload,
      };
    },

    servicesTable(state, { payload }) {
      return {
        ...state,
        servicesTable: payload,
      };
    },

    productTableInfo(state, { payload }) {
      return {
        ...state,
        productTableInfo: payload,
      };
    },
  },
};
