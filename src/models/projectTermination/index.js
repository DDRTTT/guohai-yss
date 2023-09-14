import {
  getTableDataList,
  getProNameAPI,
  getProcodeAndProDeptListAPI,
  getProTypeListAPI,
} from '@/services/projectTermination';
import { message } from 'antd';

export default {
  namespace: 'projectTermination',
  state: {
    // 表格数据
    dataList: [],
    proTypeList: [],
    proCodeList: [],
    proDeptList: [],
    total: 0,
    loading: false,
  },
  effects: {
    *getTableData({ payload }, { call, put }) {
      // yield put({
      //   type: 'saveDataList',
      //   payload: {
      //     dataList: [],
      //     total: 0,
      //     loading: true,
      //   },
      // });
      const response = yield call(getTableDataList, payload);
      if (response && response.status === 200) {
        yield put({
          type: 'saveDataList',
          payload: response.data,
          loading: false,
        });
      } else {
        yield put({
          type: 'updeteLoading',
          payload: {
            loading: false,
          },
        });
        message.error(response.message);
      }
    },
    //系列下拉列表项
    *getSeriesName({ payload }, { call, put }) {
      const response = yield call(getProNameAPI, payload);

      if (response.status === 200) {
        yield put({
          type: 'updateProName',
          payload: {
            proName: response.data,
          },
        });
        return response;
      }
    },
    // 请求 项目编码/所属部门 下拉列表项
    *getProcodeAndProDept({ payload }, { call, put }) {
      const response = yield call(getProcodeAndProDeptListAPI, payload.type);
      if (response && response.status === 200) {
        yield put({
          type: 'updateProcodeAndProDeptList',
          payload: response.data,
          key: payload.type,
        });
      } else {
        message.error(response.message);
      }
    },
    *getProTypeList({ payload }, { call, put }) {
      const response = yield call(getProTypeListAPI, payload.fcode);

      if (response && response instanceof Array) {
        yield put({
          type: 'updateProTypeList',
          payload: response,
        });
      }
    },
  },

  reducers: {
    saveDataList(state, { payload }) {
      return {
        ...state,
        dataList: payload.rows,
        total: payload.total,
        loading: payload.loading,
      };
    },
    updateProName(state, { payload }) {
      return {
        ...state,
        proCodeList: payload.proName,
      };
    },
    updateProcodeAndProDeptList(state, { payload, key }) {
      if (key === 1) {
        return {
          ...state,
          proCodeList: payload,
        };
      }
      if (key === 2) {
        return {
          ...state,
          proDeptList: payload,
        };
      }
    },
    updateProTypeList(state, { payload }) {
      return {
        ...state,
        proTypeList: payload,
      };
    },
    updeteLoading(state, { payload }) {
      return {
        ...state,
        loading: payload.loading,
      };
    },
  },
};
