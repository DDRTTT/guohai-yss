import { handleGetTreeAPI, handleGetListAPI, handleAuditAPI } from '@/services/manuscriptBasic';
import { message } from 'antd';

export default {
  namespace: 'manuscriptBasic',
  state: {
    saveManuscriptListInfo: {
      total: 0,
      pathList: [],
    },
    saveTreeData: [],
  },

  effects: {
    // 列表信息
    *handleGetListMsg({ payload }, { call, put }) {
      const response = yield call(handleGetListAPI, payload);
      if (response && response.status === 200) {
        yield put({
          type: 'saveManuscriptListInfo',
          payload: response.data,
        });
      } else {
        message.warn(response.message);
      }
      const backData = response.data ? response.data : [];
      return backData;
    },

    // 审核/反审核
    *handleAudit({ payload }, { call, put }) {
      const response = yield call(handleAuditAPI, payload);
      let flag = true;
      if (response && response.status === 200) {
        flag = true;
        message.success('操作成功');
      } else {
        flag = false;
        message.warn(response.message);
      }
      return flag;
    },
  },

  reducers: {
    saveTreeData(state, { payload }) {
      return {
        ...state,
        saveTreeData: payload,
      };
    },
    saveManuscriptListInfo(state, { payload }) {
      return {
        ...state,
        saveManuscriptListInfo: payload,
      };
    },
  },
};
