import { handleClientInformationListAPI } from '@/services/clientInformationManage';
import { message } from 'antd';

export default {
  namespace: 'clientInformationManage',
  state: {
    saveListFetch: {
      total: '',
      taskList: [],
    },
  },

  effects: {
    // 列表查询
    *handleListFetch({ payload }, { call, put }) {
      const response = yield call(handleClientInformationListAPI, payload);
      if (response && response.status === 200) {
        yield put({
          type: 'saveListFetch',
          payload: response.data,
        });
      } else {
        message.warn(response.message);
      }
    },
  },

  reducers: {
    saveListFetch(state, { payload }) {
      return {
        ...state,
        saveListFetch: payload,
      };
    },
  },
};
