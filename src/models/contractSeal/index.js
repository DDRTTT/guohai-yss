import { message } from 'antd';
import {
  getTableDataList,
  getproTrusBankList,
  getProductList,
  getDicList,
  getproTypeList,
  getInvestManageChangeList,
  getRevokeAPI,
  getDeleteAPI,
  getBatchSubmitByProCodeApi,
} from '@/services/contractSeal';

const model = {
  namespace: 'contractSeal',
  state: {
    /* 表格列表 */
    tableList: [],
    // 产品名称/产品代码
    productList: [],
    /* 资产类型 */
    proTypeList: [],
    /* 状态 */
    statusList: [],
    /* 投资经理 */
    investmentManagerList: [],
    /* 托管人 */
    proTrusBankList: [],
  },
  effects: {
    /* 查询合同用印列表 */
    *handleTableDataList({ payload }, { call }) {
      const response = yield call(getTableDataList, payload);
      if (response && response.status === 200) {
        return response;
      }
      message.error('查询失败');
    },
    // 托管人查询
    *handlproTrusBankList({ payload }, { call, put }) {
      const response = yield call(getproTrusBankList, payload);
      if (response && response.status === 200) {
        yield put({
          type: 'proTrusBank',
          payload: response,
        });
      } else {
        message.error('查询失败');
      }
    },
    // 投资经理查询
    *handlInvestManagerList({ payload }, { call, put }) {
      const response = yield call(getInvestManageChangeList, payload);
      if (response && response.status === 200) {
        yield put({
          type: 'investManager',
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
      const response = yield call(getDicList, payload);
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
    tableChangeList(state, action) {
      return {
        ...state,
        tableList: action.payload.data,
      };
    },
    productListDict(state, action) {
      return {
        ...state,
        productList: action.payload.productDropList,
      };
    },
    proTrusBank(state, action) {
      return {
        ...state,
        proTrusBankList: action.payload.data,
      };
    },
    investManager(state, action) {
      return {
        ...state,
        investmentManagerList: action.payload.data,
      };
    },
    proType(state, action) {
      return {
        ...state,
        proTypeList: action.payload.data,
      };
    },
    status(state, action) {
      return {
        ...state,
        statusList: action.payload.data.S001,
      };
    },
    /* investmentManager(state, action) {
            return {
                ...state,
                investmentManagerList: action.payload.data.J004_2

            }
        } */
  },
};

export default model;
