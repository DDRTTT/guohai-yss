import {
  queryTableList,
  getDicsByTypes,
  getProductEnum,
  getFindAllInvest,
  batchCommit,
} from '@/services/investorReview/index';
import { message } from 'antd';

// tabs的数组
const tabList = [
  {
    tab: '我待办',
    key: 'T001_1',
  },
  // 暂时先不显示我参与
  // {
  //   tab: '我参与',
  //   key: 'T001_2',
  // },
  {
    tab: '我发起',
    key: 'T001_3',
  },
  {
    tab: '未提交',
    key: 'T001_4',
  },
  {
    tab: '已办理',
    key: 'T001_5',
  },
];
export default {
  namespace: 'investorReview',
  state: {
    // 列表的数据
    tableList: [],
    // 搜索下拉字典的数据
    codeList: {},
    // tabs的数据
    tabList,
    // 产品名称的列表(下拉框)
    productList: [],
    // 客户名称下拉列表
    allInvestList: [],
  },
  reducers: {
    /**
     * 同步列表的数据
     */
    setTableList(state, { payload }) {
      return {
        ...state,
        tableList: payload,
      };
    },
    /**
     * 同步code对应的名称
     */
    setCodeList(state, { payload }) {
      return {
        ...state,
        codeList: payload,
      };
    },
    /**
     * 同步产品名称列表
     */
    setProductEnum(state, { payload }) {
      return {
        ...state,
        productList: payload,
      };
    },
    /**
     * 同步客户名称列表
     */
    setAllInvest(state, { payload }) {
      return {
        ...state,
        allInvestList: payload,
      };
    },
  },
  effects: {
    /**
     * 获取表格的数据
     */
    *getTableList({ payload }, { put, call }) {
      const res = yield call(queryTableList, payload);
      if (res && res.status === 200) {
        yield put({
          type: 'setTableList',
          payload: res.data,
        });
      } else {
        message.error(res.message);
      }
    },
    /**
     * 根据code获取code对应的数据
     */
    *getDicsByTypes({ payload, callBack }, { put, call }) {
      const res = yield call(getDicsByTypes, payload);
      if (res && res.status === 200) {
        yield put({
          type: 'setCodeList',
          payload: res.data,
        });
        callBack && callBack(res.data);
      } else {
        message.error(res.message);
      }
    },
    /**
     * 获取产品全称的枚举
     */
    *getProductEnum({ payload }, { put, call }) {
      const res = yield call(getProductEnum, { proType: 'A002_1,A002_4' });
      if (res && res.status === 200) {
        yield put({
          type: 'setProductEnum',
          payload: res.data,
        });
      } else {
        message.error(res.message);
      }
    },
    /**
     * 获取客户名称下拉列表
     */
    *getFindAllInvest({ payload }, { put, call }) {
      const res = yield call(getFindAllInvest);
      if (res && res.status === 200) {
        yield put({
          type: 'setAllInvest',
          payload: res.data,
        });
      } else {
        message.error(res.message);
      }
    },
    /**
     * 批量提交
     */
    *batchCommit({ payload, callback }, { put, call }) {
      const res = yield call(batchCommit, payload);
      if (res && res.status === 200) {
        message.success('提交成功');
        callback && callback();
      } else {
        message.error(res.message);
      }
    },
  },
};
