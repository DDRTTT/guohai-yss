import { getPageInfoAPI } from '@/services/projectTerminationDetail';
import { message } from 'antd';

export default {
  namespace: 'projectTerminationDetail',
  state: {
    pageInfo: {},
  },
  effects: {
    *getPageInfo({ payload }, { call, put }) {
      const response = yield call(getPageInfoAPI, payload.proCode);
      if (response && response.status === 200) {
        yield put({
          type: 'updatePageInfo',
          payload: response.data,
        });
      } else {
        message.error(response.message);
      }
    },
  },

  reducers: {
    updatePageInfo(state, { payload }) {
      return {
        pageInfo: payload,
      };
    },
  },
};
