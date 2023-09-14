import {
  savaDataAPI,
  getProcodeAndProDeptListAPI,
  getProTypeListAPI,
  getProCodeAPI,
  getPageInfoAPI,
  checkProductAPI,
  updateProductInfoAPI,
  getSeriesCodeAPI,
} from '@/services/addProjectSeries';
import { message } from 'antd';

export default {
  namespace: 'addProjectSeries',
  state: {
    proTradeList: [],
    proLocaList: [],
    proTypeList: [],
    proCodeList: [],
    proDeptList: [],
    proPlateList: [],
    proParticipantList: [],
    idTypeList: [],
    tradingPlacesList: [],
    capitalCurrencyList: [],
  },
  effects: {
    //保存系列信息
    *savaData({ payload }, { call }) {
      const response = yield call(savaDataAPI, payload);
      return response;
    },
    //获取生成系列编码
    *getSeriesCode({ payload }, { call }) {
      const response = yield call(getSeriesCodeAPI, payload.proType);
      return response;
    },
    //获取系列信息
    *getPageInfo({ payload }, { call, put }) {
      const response = yield call(getPageInfoAPI, payload.proCode);
      return response;
    },
    *checkProduct({ payload }, { call }) {
      const response = yield call(checkProductAPI, {
        ids: [payload.proCode],
        checked: 1,
      });
      return response;
    },
    //修改系列信息
    *updateProductInfo({ payload }, { call }) {
      const response = yield call(updateProductInfoAPI, payload);
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
      } else {
        message.error(response.message);
      }
    },
    *getProCode({ payload }, { call, put }) {
      const response = yield call(getProCodeAPI, payload.proType);
      if (response && response.status === 200) {
        yield put({
          type: 'updateProcode',
          payload: response.data,
        });
      } else {
        message.error(response.message);
      }
    },
    *getProTypeList({ payload }, { call, put }) {
      const response = yield call(getProTypeListAPI, payload.fcode);

      if (response && response instanceof Array) {
        if (payload.fcode === 'awp_pro_type') {
          yield put({
            type: 'updateProTypeList',
            payload: response,
          });
        } else if (payload.fcode === 'awp_pro_trade') {
          yield put({
            type: 'updateProTradeList',
            payload: response,
          });
        } else if (payload.fcode === 'awp_pro_loca') {
          yield put({
            type: 'updateProLocaList',
            payload: response,
          });
        } else if (payload.fcode === 'awp_list_plate') {
          yield put({
            type: 'updateProPlateList',
            payload: response,
          });
        } else if (payload.fcode === 'awp_id_type') {
          yield put({
            type: 'updateIdTypeList',
            payload: response,
          });
        } else if (payload.fcode === 'awp_trad_place') {
          yield put({
            type: 'updateTradPlaceList',
            payload: response,
          });
        } else if (payload.fcode === 'C001') {
          yield put({
            type: 'updateCapitalCurrencyList',
            payload: response,
          });
        }
      }
    },
  },

  reducers: {
    updateProcodeAndProDeptList(state, { payload, key }) {
      if (key === 1) {
        return {
          ...state,
          proCodeList: payload,
        };
      } else if (key === 2) {
        return {
          ...state,
          proDeptList: payload,
        };
      }
    },
    updateProcode(state, { payload }) {
      return {
        ...state,
        proCode: payload,
      };
    },
    updateProTypeList(state, { payload }) {
      return {
        ...state,
        proTypeList: payload,
      };
    },
    updateProTradeList(state, { payload }) {
      return {
        ...state,
        proTradeList: payload,
      };
    },
    updateProLocaList(state, { payload }) {
      return {
        ...state,
        proLocaList: payload,
      };
    },
    updateProPlateList(state, { payload }) {
      return {
        ...state,
        proPlateList: payload,
      };
    },
    updateProParticipantList(state, { payload }) {
      return {
        ...state,
        proParticipantList: payload,
      };
    },
    updateIdTypeList(state, { payload }) {
      return {
        ...state,
        idTypeList: payload,
      };
    },
    updateTradPlaceList(state, { payload }) {
      return {
        ...state,
        tradingPlacesList: payload,
      };
    },
    updateCapitalCurrencyList(state, { payload }) {
      return {
        ...state,
        capitalCurrencyList: payload,
      };
    },
  },
};
