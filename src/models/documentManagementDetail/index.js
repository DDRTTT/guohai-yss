import { message } from 'antd';
import { getFileHistoryApi } from '@/services/documentManagementDetail';

const model = {
  namespace: 'documentManagementDetail',
  state: {
    fileHistory: [],
  },
  effects: {
    // 获取历史记录
    *getFileHistoryReq({ payload }, { put, call }) {
      const res = yield call(getFileHistoryApi, payload);
      if (res && res.status === 200) {
        yield put({
          type: 'updateFileHistory',
          payload: {
            fileHistory: res.data ? res.data : [],
          },
        });
      } else {
        message.error(res.message);
      }
    },
  },
  reducers: {
    // 项目列表table action
    updateFileHistory(state, { payload }) {
      return {
        ...state,
        fileHistory: payload.fileHistory,
      };
    },
  },
};

export default model;
