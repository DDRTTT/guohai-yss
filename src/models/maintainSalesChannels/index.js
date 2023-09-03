import { message } from 'antd';
import {
  getTableDataList,
  getProductList,
  getDicList,
  getproTypeList,
  getRevokeAPI,
  deleteInfoAPI,
  batchSubm,
} from '@/services/maintainSalesChannels';

const model = {
  namespace: 'maintainSalesChannels',
  state: {
    /* 表格列表 */
    tableList: [],
    // 产品名称/产品代码
    productList: [],
    /* 资产类型 */
    proType: [],
    /* 状态 */
    statusList: [],
  },
  effects: {
    /* 查询销售渠道维护列表 */
    *handleTableDataList({ payload }, { call }) {
      const response = yield call(getTableDataList, payload);
      if (response && response.status === 200) {
        return response;
      }
      message.error('查询失败');
    },
    // 产品名称/产品代码 查询
    // *queryProductList({ payload }, { call, put }) {
    //   const response = yield call(getProductList, payload);
    //   if (response && response.status === 200) {
    //     console.log('走进了吗')
    //     yield put({
    //       type: 'productListDict',
    //       payload: response,
    //     });
    //   } else {
    //     message.error('查询失败');
    //   }
    // },
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
    /* 词汇字典 */
    *queryCriteria({ payload }, { call, put }) {
      const response = yield call(getDicList, payload);
      if (response && response.status === 200) {
        yield put({
          type: 'statusCodes',
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
  },
  reducers: {
    tableChangeList(state, action) {
      return {
        ...state,
        tableList: action.payload.data,
      };
    },
    // productListDict(state, action) {
    //   return {
    //     ...state,
    //     productList: action.payload.data,
    //   };
    // },
    proType(state, action) {
      return {
        ...state,
        proTypeList: action.payload.data,
      };
    },
    statusCodes(state, action) {
      return {
        ...state,
        statusList: action.payload.data.S001,
      };
    },

    productListDict(state, action) {
      return {
        ...state,
        productList: action.payload.data,
      };
    },
  },
};

export default model;
