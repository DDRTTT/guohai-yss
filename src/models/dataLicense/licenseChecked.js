import { message } from 'antd';
import { checkApplicate, fetchHasLicenseList } from '@/services/dataLicense';

const model = {
  namespace: 'licenseChecked',
  state: {
    data: {
      total: 1,
      rows: [],
    },
    dataHasList: {
      data: {
        total: 1,
        rows: [],
      },
    },
    institutionDetailData: {},
    backResultData: 0,
  },
  effects: {
    *fetchHasList({ payload }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(fetchHasLicenseList, payload);
      yield put({
        type: 'saveHas',
        payload: response,
      });
      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },
    *opt({ payload }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(checkApplicate, payload.opt);
      if (response) {
        if (payload.opt.status != 2) {
          message.success('驳回成功');
        }
        yield put({
          type: 'backResult',
          payload: payload.opt.status == 2 ? 2 : 1,
        });
        const response = yield call(fetchHasLicenseList, payload.fetch);
        yield put({
          type: 'saveHas',
          payload: response,
        });
      } else {
        message.success(payload.opt.status == 2 ? '授权失败' : '驳回失败');
        yield put({
          type: 'backResult',
          payload: payload.opt.status == 2 ? 3 : 3,
        });
      }
      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },
    *back({ payload }, { call, put }) {
      yield put({
        type: 'backResult',
        payload: response,
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
    saveHas(state, action) {
      return {
        ...state,
        dataHasList: action.payload,
      };
    },
    // 接口回调统一处理
    backResult(state, action) {
      return {
        ...state,
        backResultData: action.payload,
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
