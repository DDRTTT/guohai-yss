import { message } from 'antd';
import { commitApplicate, userLicenseInfo, userLicenseList } from '../../services/dataLicense';

const model = {
  namespace: 'userLicense',
  state: {
    data: {
      data: {
        rows: [],
        total: 0,
      },
    },
    userInfo: {},
    loading: true,
    addResult: 0,
    userResult: 0,
  },
  effects: {
    *fetch({ payload }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(userLicenseList, payload);
      if (response && response.status === 200) {
        yield put({
          type: 'save',
          payload: response,
        });
        if (response.data.total === 1) {
          const orgInfo = {
            name: response.data.rows[0].appedOrgName,
            code: response.data.rows[0].typeState[0].appedOrgId,
            total: response.data.total,
          };
          sessionStorage.setItem('applyOrgInfo', JSON.stringify(orgInfo));
        }
        yield put({
          type: 'userResult',
          payload: 1,
        });
      }
      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },
    *dataChange({ payload }, { call, put }) {
      const { data } = payload;
      const { index } = payload;
      if (data.data.typeState[index].ctrlStyle == 0 || !data.data.typeState[index].ctrlStyle) {
        data.data.typeState[index].ctrlStyle = 1;
      } else {
        data.data.typeState[index].ctrlStyle = 0;
      }
      yield put({
        type: 'saveUserInfo',
        payload: data,
      });
    },
    *fetchUserInfo({ payload }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(userLicenseInfo);
      Object.keys(payload).forEach(function(key) {
        response.data[key] = payload[key];
      });
      yield put({
        type: 'saveUserInfo',
        payload: response,
      });
      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },
    *commitApplication({ payload }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(commitApplicate, payload);
      if (response.rel) {
        message.success('申请授权已经提交');
        yield put({
          type: 'add',
          payload: 1,
        });
      }
      yield put({
        type: 'saveUserInfo',
        payload: response,
      });
      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },
    *changeUserResult({ payload }, { call, put }) {
      yield put({
        type: 'userResult',
        payload,
      });
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        data: action.payload,
      };
    },
    saveUserInfo(state, action) {
      return {
        ...state,
        userInfo: action.payload,
      };
    },
    add(state, action) {
      return {
        ...state,
        addResult: action.payload,
      };
    },
    userResult(state, action) {
      return {
        ...state,
        userResult: action.payload,
      };
    },
    changeLoading(state, action) {
      return {
        ...state,
        loading: action.payload,
      };
    },
  },
};

export default model;
