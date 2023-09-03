import {
  getDictsAPI,
  addOrg,
  superiorOrg,
  details,
} from '@/services/institutionalInfoManager/details';
import { message } from 'antd';

export default {
  namespace: 'details',
  state: {
    codeList: [],
    SuperiorOrgs: [],
    detailsList: [],
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
    //保存
    *preservation({ payload }, { call, put }) {
      const response = yield call(addOrg, payload);
      let flag = false;
      if (response && response.status === 200) {
        message.success('保存成功');
        flag = true;
      } else {
        message.error('查询失败');
      }
      return flag;
    },
    *superiorOrgList({ payload }, { call, put }) {
      const response = yield call(superiorOrg, payload);
      if (response && response.status === 200) {
        yield put({
          type: 'getSuperiorOrg',
          payload: response.data,
        });
      } else {
        message.error('查询失败');
      }
    },
    //查看详情
    *getDetails({ payload }, { call, put }) {
      const response = yield call(details, payload);
      let flag = false;
      if (response && response.status === 200) {
        console.log(response, '详情信息');
        flag = true;
        yield put({
          type: 'setDetails',
          payload: response.data,
        });
      } else {
        // message.error('详情查询失败');
      }
      return { flag: flag, data: response.data };
    },
    //所属组织机构
    *superiorOrgList({ payload }, { call, put }) {
      const response = yield call(superiorOrg, payload);
      if (response && response.status === 200) {
        yield put({
          type: 'getSuperiorOrg',
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
        detailsList: payload ? payload : [],
      };
    },
    getSuperiorOrg(state, { payload }) {
      return {
        ...state,
        SuperiorOrgs: payload,
      };
    },
  },
};
