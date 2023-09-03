import { getTableDataList, getDictList,getRevokeAPI,getDeleteAPI,getBatchSubmitByProCodeApi,} from '@/services/divergence';
import { message } from 'antd';

export default {
  namespace: 'diverGence',
  state: {
    // 表格数据
    dataList: [],
    // 状态类型
    statusList: [],
    total: 0,
    loading: false,
  },
  effects: {
    *searchTableData({ payload }, { call, put }) {
      const response = yield call(getTableDataList, payload);
      if (response && response.status === 200) {
        yield put({
          type: 'saveDataList',
          payload: response.data,
        });
      } else {
        message.warn(response.message);
      }
    },
    // 词汇字典 查询
    *queryCriteria({ payload }, { call, put }) {
      const response = yield call(getDictList, payload);
      if (response && response.status === 200) {
        yield put({
          type: 'dictList',
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
    saveDataList(state, { payload }) {
      return {
        ...state,
        dataList: payload.rows,
        total: payload.total,
      };
    },

    dictList(state, action) {
      return {
        ...state,
        statusList: action.payload.data.S001,
      };
    },
  },
};
