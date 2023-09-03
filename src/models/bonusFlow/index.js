import { message } from 'antd';
import {
  handleGetTableData,
  getDicsByTypes,
  getProductList,
  getRevokeAPI,
  deleteInfoAPI,
  batchSubm,
  productTypeAPI,
} from '@/services/bonusFlow';

const model = {
  namespace: 'bonusFlow',
  state: {
    tableList: {
      total: 0,
      rows: [],
    },
    // 各种类型下拉
    opts: {},
    productList: [],
    //加了定向的产品类型
    productType: [],
  },
  effects: {
    // 获取分红流程列表
    *handleQueryTableData({ payload }, { call, put }) {
      const response = yield call(handleGetTableData, payload);
      if (response && response.status === 200) {
        yield put({
          type: 'handleSetTableList',
          payload: response.data,
        });
      } else {
        message.error('查询失败');
      }
    },

    // 产品名称/产品代码 查询
    *queryProductList({ payload }, { call, put }) {
      const response = yield call(getProductList, payload);
      if (response && response.status === 200) {
        yield put({
          type: 'productListDict',
          payload: response,
        });
      } else {
        message.error('查询失败');
      }
    },
    // 查询模块下拉的字典
    *getDicts({ payload }, { put, call }) {
      const res = yield call(getDicsByTypes, payload);
      if (res && res.status === 200) {
        yield put({
          type: 'initSelects',
          payload: {
            opts: res.data || {},
          },
        });
      }
    },
    // 撤销
    *getRevokeFunc({ payload }, { call }) {
      const response = yield call(getRevokeAPI, payload);
      let flag = false;
      if (response.status === 200) {
        flag = true;
        message.success('撤销成功');
      } else {
        message.warn(response.message);
      }
      return flag;
    },
    // 删除
    *getDeleteFunc({ payload }, { call }) {
      const response = yield call(deleteInfoAPI, payload);
      let flag = false;
      if (response.status === 200) {
        flag = true;
        message.success('删除成功');
      } else {
        message.warn(response.message);
      }
      return flag;
    },

    *batchSubm({ payload }, { call }) {
      const response = yield call(batchSubm, payload);
      let flag = false;
      if (response.status === 200) {
        flag = true;
        message.success('操作成功');
      } else {
        message.warn(response.message);
      }
      return flag;
    },
    *batchSubm({ payload }, { call }) {
      const response = yield call(batchSubm, payload);
      let flag = false;
      if (response.status === 200) {
        flag = true;
        message.success('操作成功');
      } else {
        message.warn(response.message);
      }
      return flag;
    },
    *productType({ payload }, { call, put }) {
      const response = yield call(productTypeAPI, payload);
      if (response && response.status === 200) {
        yield put({
          type: 'saveproductType',
          payload: response.data,
        });
      } else {
        message.error('查询失败');
      }
    },
  },

  reducers: {
    handleSetTableList(state, action) {
      return {
        ...state,
        tableList: action.payload,
      };
    },
    // 查询条件下拉值集合
    initSelects(state, { payload }) {
      return {
        ...state,
        opts: payload.opts,
      };
    },

    productListDict(state, action) {
      return {
        ...state,
        productList: action.payload.data,
      };
    },
    saveproductType(state, action) {
      return {
        ...state,
        productType: action.payload,
      };
    },
  },
};

export default model;
