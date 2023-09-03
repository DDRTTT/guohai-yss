import {
  handleGetListInfoAPI,
  handleDeleteProductAPI,
  handlePublishProductAPI,
} from '@/services/flow/list';
import { message } from 'antd';

export default {
  namespace: 'flowList',
  state: {
    saveFlowListInfo: {
      rows: [],
      total: '',
    },
  },
  effects: {
    // 所有信息
    *handleGetListMsg({ payload }, { call, put }) {
      const response = yield call(handleGetListInfoAPI, payload);
      if (response && response.status === 200) {
        yield put({
          type: 'saveFlowListInfo',
          payload: response.data,
        });
      } else {
        message.warn(response.message);
      }
    },

    // 删除
    *handleDeleteProductFetch({ payload }, { call }) {
      const response = yield call(handleDeleteProductAPI, payload);
      let flag = false;
      if (response && response.status === 200) {
        message.success('删除成功');
        flag = true;
      } else {
        message.warn(response.message);
        flag = false;
      }
      return flag;
    },

    // 发布、取消发布 status： 1》发布；0》撤回
    *handlePublishProductFetch({ payload }, { call }) {
      const response = yield call(handlePublishProductAPI, payload);
      let flag = false;
      if (response && response.status === 200) {
        message.success('操作成功');
        flag = true;
      } else {
        message.warn(response.message);
        flag = false;
      }
      return flag;
    },
  },
  reducers: {
    saveFlowListInfo(state, { payload }) {
      return {
        ...state,
        saveFlowListInfo: payload,
      };
    },
  },
};
