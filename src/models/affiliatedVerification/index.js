import {
  getTaskList,
  getDictsAPI,
  getproTypeList,
  getProductList,
  getRevokeAPI,
  getDeleteAPI,
  getBatchSubmitByProCodeApi,
} from '@/services/affiliatedVerification';
import { message } from 'antd';

const model = {
  namespace: 'affiliatedVerification',
  state: {
    /* 表格列表 */
    tableList: [],
    /* 状态 */
    statusList: [],
    /* 产品类型 */
    assetTypeList: [],
    productList: [],
  },
  effects: {
    *queryTableList({ payload }, { call }) {
      const response = yield call(getTaskList, payload);
      if (response && response.status === 200) {
        return response;
      }
      message.error('查询失败');
    },
    // 产品名称/产品代码 查询
    *queryProductList({ payload }, { call, put }) {
      const response = yield call(getProductList, payload);
      if (response && response.status === 200) {
        yield put({
          type: 'productListDict',
          payload: { productDropList: response.data },
        });
      } else {
        message.error('查询失败');
      }
    },
    // 产品类型 查询
    *handleProductTypeList({ payload }, { call, put }) {
      const response = yield call(getproTypeList, payload);
      if (response && response.status === 200) {
        yield put({
          type: 'proType',
          payload: response,
        });
      } else {
        message.error('查询失败');
      }
    },
    /* 词汇字典 */
    *queryCriteria({ payload }, { call, put }) {
      const response = yield call(getDictsAPI, payload);

      if (response && response.status === 200) {
        yield put({
          type: 'status',
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
      const response = yield call(getDeleteAPI, payload);
      let flag = false;
      if (response.status === 200) {
        flag = true;
        message.success('删除成功');
      } else {
        message.warn(response.message);
      }
      return flag;
    },
    // 批量提交
    *getBatchSubmitByProCodeReq({ payload }, { call, put }) {
      const response = yield call(getBatchSubmitByProCodeApi, payload);
      if (response && response.status === 200) {
        return response;
      } else {
        message.error(response.message);
      }
    },
  },
  reducers: {
    proType(state, action) {
      return {
        ...state,
        proTypeList: action.payload.data,
      };
    },
    productListDict(state, action) {
      return {
        ...state,
        productList: action.payload.productDropList,
      };
    },
    status(state, action) {
      return {
        ...state,
        statusList: action.payload.data.S001,
      };
    },
  },
};

export default model;
