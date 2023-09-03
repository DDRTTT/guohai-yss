import { institutionalDetailInfo } from '../../services/dataLicense';

const model = {
  namespace: 'institutionalDetails',
  state: {
    modalShow: {},
    userInfo: {},
    loading: true,
  },
  effects: {
    *fetch({ payload }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(institutionalDetailInfo, payload);
      yield put({
        type: 'save',
        payload: response.data,
      });
      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        modalShow: action.payload,
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
