import {
  getDictsAPI,
  getDetailsAPI,
  preservationAPI,
  positionTypeAPI,
  departmentAPI,
  getPositionAPI
} from '@/services/institutionalInfoManager/addEmployees';
import { message } from 'antd';

export default {
  namespace: 'addEmployees',
  state: {
    codeList: [],
    detailsLists: [],
    positionTypeList: [],
    // 部门
    department: [],
    // 岗位
    setPosition: [],
  },

  effects: {
    *getCodeList({ payload }, { call, put }) {
      const response = yield call(getDictsAPI, payload);
      if (response && response.status === 200) {
        yield put({
          type: 'setCodeList',
          payload: response.data,
        });
      } else {
        message.error('查询失败');
      }
    },

    *getDetails({ payload }, { call, put }) {
      const response = yield call(getDetailsAPI, payload);
      let flag = false;
      if (response && response.status === 200) {
        flag = true;
        yield put({
          type: 'setDetails',
          payload: response.data,
        });
      } else {
        message.error('查询失败');
      }
      return flag;
    },

    *getPreservation({ payload }, { call }) {
      const response = yield call(preservationAPI, payload);
      let flag = false;
      if (response && response.status === 200) {
        message.success('保存成功');
        flag = true;
      } else {
        message.error(response.message);
      }
      return flag;
    },

    // 职务类型
    *getPositionType({ payload }, { call, put }) {
      const response = yield call(positionTypeAPI, payload);
      if (response && response.status === 200) {
        yield put({
          type: 'setPositionType',
          payload: response.data,
        });
      } else {
        message.error('获取失败');
      }
    },

    // 获取机构部门
    *getDepartment({ payload }, { call, put }) {
      const response = yield call(departmentAPI, payload);
      if (response && response.status === 200 && response.data) {
        yield put({
          type: 'setDepartment',
          payload: response.data,
        });
      } else {
        message.error('查询失败');
      }
    },

    // 获取岗位
    *getPosition({ payload }, { call, put }) {
      const response = yield call(getPositionAPI, payload);
      if (response && response.status === 200 && response.data) {
        yield put({
          type: 'setPosition',
          payload: response.data,
        });
      } else {
        message.error('查询失败');
      }
    },
  },
  reducers: {
    setCodeList(state, { payload }) {
      return {
        ...state,
        codeList: payload,
      };
    },
    setDetails(state, { payload }) {
      return {
        ...state,
        detailsLists: payload,
      };
    },
    setPositionType(state, { payload }) {
      return {
        ...state,
        positionTypeList: payload,
      };
    },
    setDepartment(state, { payload }) {
      return {
        ...state,
        department: payload,
      };
    },
    setPosition(state, { payload }) {
      return {
        ...state,
        setPosition: payload,
      };
    },
  },
};
