import { message } from 'antd';

import { getInfoAPI, getInfoForAccountAPI } from '@/services/product/informationInfo';
export default {
  namespace: 'productForInformationInfo',
  state: {
    info: [], //详情数据
    infoDataList: [], //
    accountList: [], //账户列表数据
  },

  effects: {
    // 获取详情数据
    *getInfo({ payload, status }, { call, put }) {
      const response = yield call(getInfoAPI, payload);
      if (response && response.status === 200) {
        yield put({
          type: 'setInfo',
          payload: response.data,
        });
        return response.data;
      } else {
        message.error(response.message);
      }
    },
    // 获取详情数据
    *getInfos({ payload, status }, { call, put }) {
      const response = yield call(getInfoAPI, payload);
      if (response && response.status === 200) {
        yield put({
          type: 'setInfoList',
          payload: response.data,
        });
      } else {
        message.error(response.message);
      }
    },
    // 获取账户详情数据
    *getInfoForAccount({ payload, status }, { call, put }) {
      const response = yield call(getInfoForAccountAPI, payload);
      if (response && response.status === 200) {
        yield put({
          type: 'setAccountList',
          payload: response.data,
        });
        return response.data;
      } else {
        message.error(response.message);
      }
    },
  },

  reducers: {
    setInfo(state, { payload }) {
      return {
        ...state,
        info: payload,
      };
    },
    setInfoList(state, { payload }) {
      return {
        ...state,
        infoDataList: payload,
      };
    },
    setAccountList(state, { payload }) {
      return {
        ...state,
        accountList: payload,
      };
    },
  },
};
