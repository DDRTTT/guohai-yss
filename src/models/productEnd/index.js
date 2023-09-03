import {
  getProductEndList,
  getDictsAPI,
  getProductList,
  getRevokeAPI,
  deleteInfoAPI,
  batchSubm,
  productTypeAPI
} from '@/services/productEnd';
import { message } from 'antd';

const model = {
  namespace: 'productEnd',
  state: {
    dataSource: {
      total: 0,
      rows: [],
    },
    dicts: {
      A002List: [],
      S001List: [],
    },
    // 产品名称/产品代码
    productList: [],
    //加了定向之后的产品类型
    productType:[]
  },
  effects: {
    *queryTableList({ payload }, { call, put }) {
      const response = yield call(getProductEndList, payload.params);
      let flag = false;
      if (response.status === 200) {
        flag = true;
        yield put({
          type: 'updateTableList',
          payload: {
            dataSource: response.data,
          },
        });
      }
      return flag;
    },
    *getDicts({ payload }, { call, put }) {
      const response = yield call(getDictsAPI, payload.codeList);
      if (response.status === 200) {
        yield put({
          type: 'updateDicts',
          payload: {
            dicts: response.data,
          },
        });
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
    //批量提交
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
    updateTableList(state, action) {
      return {
        ...state,
        dataSource: action.payload.dataSource,
      };
    },
    updateDicts(state, action) {
      const dicts = {
        A002List: action.payload.dicts.A002 ? action.payload.dicts.A002 : [],
        S001List: action.payload.dicts.S001 ? action.payload.dicts.S001 : [],
      };
      // 'A002' 资产类型, 'S001':流程状态
      return {
        ...state,
        dicts,
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
