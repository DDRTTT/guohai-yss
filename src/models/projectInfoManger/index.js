import {
  getTableDataList,
  getProductListAPI,
  deleteAPI,
  getProcodeAndProDeptListAPI,
  projectPublishAPI,
  checkTerminationAPI,
  projectTerminationAPI,
} from '@/services/projectInfoManger';
import { message } from 'antd';

export default {
  namespace: 'projectInfoManger',
  state: {
    proCodeList: [],
    proDeptList: [],
  },
  effects: {
    //获取列表数据
    *getTableData({ payload }, { call, put }) {
      const response = yield call(getTableDataList, payload);
      return response;
    },
    //获取项目流程列表数据
    *getProductList({ payload }, { call, put }) {
      const response = yield call(getProductListAPI, payload);
      return response;
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
      }
    },
    //删除 可批量删除
    *delete({ payload }, { call, put }) {
      const response = yield call(deleteAPI, payload);

      if (response && response.status === 200) {
        message.success('删除成功');
      } else {
        message.error(response.message);
      }
      return response;
    },
    //项目发行
    *projectPublish({ payload }, { call, put }) {
      const response = yield call(projectPublishAPI, payload);
      return response;
    },
    // 判断项目是否可终止
    *checkTerminationReq({ payload, callback }, { call, put }) {
      const response = yield call(checkTerminationAPI, payload);
      if (response && response.status === 200) {
        callback(response);
      } else {
        message.error(response.message);
      }
    },
    //项目终止
    *projectTermination({ payload }, { call, put }) {
      const response = yield call(projectTerminationAPI, payload);
      if (response && response.status === 200) {
        message.success('发起终止任务成功!');
      } else {
        message.error(response.message);
      }
      return response;
    },
  },

  reducers: {
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
  },
};
