import { message } from 'antd';

import { getListAPI } from '@/services/product/information';
export default {
  namespace: 'productForInformation',
  state: {
    auditStatus: [
      // 审核状态
      { name: '未审核', code: 'D001_1' },
      { name: '已审核', code: 'D001_2' },
    ],
    list: [], //列表数据
  },

  effects: {
    // 获取列表数据
    *getList({ payload, status }, { call, put }) {
      const response = yield call(getListAPI, payload);
      if (response && response.status === 200) {
        yield put({
          type: 'setList',
          payload: response.data,
        });
      } else {
        message.error(response.message);
      }
    },
  },

  reducers: {
    setList(state, { payload }) {
      return {
        ...state,
        list: payload,
      };
    },
  },
};
