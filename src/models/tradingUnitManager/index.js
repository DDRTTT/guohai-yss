import {
  queryTableList,
  queryHosting,
  trandingBoothInfo,
} from '@/services/tradingUnitManager/index';
import { message } from 'antd';

export default {
  namespace: 'tradingUnitManager',
  state: {
    // 表格数据
    tableList: [],
    // 干系人类别列表
    stakeholdersTypeList: [],
    // 托管行列表
    hostingList: [],
    // 详情数据
    detailInfo: [],
    // 券商列表
    brokerList: [],
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
     * 同步干系人类别列表
     */
    setStakeholdersTypeList(state, { payload }) {
      return {
        ...state,
        stakeholdersTypeList: payload,
      };
    },
    /**
     * 同步托管行列表
     */
    setHostingList(state, { payload }) {
      return {
        ...state,
        hostingList: payload,
      };
    },
    /**
     * 同步详情数据
     */
    setTrandingBoothInfo(state, { payload }) {
      return {
        ...state,
        detailInfo: payload,
      };
    },
    /**
     * 同步券商
     */
    setBrokerList(state, { payload }) {
      return {
        ...state,
        brokerList: payload,
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
     * 获取干系人类别列表
     */
    *getStakeholdersTypeList({ payload }, { put, call }) {
      const res = yield call(queryType, payload);
      if (res && res.status === 200) {
        yield put({
          type: 'setStakeholdersTypeList',
          payload: res.data,
        });
      } else {
        message.error(res.message);
      }
    },
    /**
     * 获取托管人列表
     */
    *getHostingList({ payload }, { put, call }) {
      const res = yield call(queryHosting, payload);
      if (res && res.status === 200) {
        yield put({
          type: 'setHostingList',
          payload: res.data,
        });
      } else {
        message.error(res.message);
      }
    },
    /**
     * 获取托管人列表
     */
    *getBrokerList({ payload }, { put, call }) {
      const res = yield call(queryHosting, payload);
      if (res && res.status === 200) {
        yield put({
          type: 'setBrokerList',
          payload: res.data,
        });
      } else {
        message.error(res.message);
      }
    },
    /**
     * 获取详情数据
     */
    *getTrandingBoothInfo({ payload }, { put, call }) {
      const res = yield call(trandingBoothInfo, payload);
      if (res && res.status === 200) {
        yield put({
          type: 'setTrandingBoothInfo',
          payload: res.data,
        });
      } else {
        message.error(res.message);
      }
    },
  },
};
