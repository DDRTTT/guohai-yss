import {
  savaDataAPI,
  resavaDataAPI,
  recommitDataAPI,
  commitAPI,
  recommitAPI,
  getproNameAPI,
  getProTypeListAPI,
  getMemberNameListAPI,
  getProCodeAPI,
  getPageInfoAPI,
  updateProductInfoAPI,
  getMemberInfoAPI,
} from '@/services/addProjectInfo';
import { message } from 'antd';

export default {
  namespace: 'addProjectInfo',
  state: {
    proName: [],
    proTradeList: [], // 所属行业
    proLocaList: [], // 项目区域
    proTypeList: [], // 项目类型
    proPlateList: [], // 上市板块
    proParticipantList: [],
    idTypeList: [], // 证件类型
    tradingPlacesList: [], // 交易场所
    capitalCurrencyList: [], // 币种
    memberNameList: [], // 成员姓名
    processProjectList: [], // 项目流程类型
    processSeriesList: [], // 系列流程类型
  },
  effects: {
    //保存项目信息
    *savaData({ payload }, { call }) {
      const response = yield call(savaDataAPI, payload);
      return response;
    },
    // 变更保存
    *resave({ payload }, { call }) {
      const response = yield call(resavaDataAPI, payload);
      return response;
    },
    // 变更提交
    *recommit({ payload }, { call }) {
      const response = yield call(recommitDataAPI, payload);
      return response;
    },
    //提交项目信息
    *commitData({ payload }, { call }) {
      const response = yield call(commitAPI, payload);
      return response;
    },
    //再次提交项目信息
    *recommitData({ payload }, { call }) {
      const response = yield call(recommitAPI, payload);
      return response;
    },
    //获取 项目/系列详情页数据
    *getPageInfo({ payload }, { call, put }) {
      const response = yield call(getPageInfoAPI, payload.proCode);
      return response;
    },
    *getproName({ payload }, { call, put }) {
      const response = yield call(getproNameAPI, payload);
      if (response.status === 200) {
        yield put({
          type: 'updateProName',
          payload: {
            proName: response.data,
          },
        });
      }
    },
    //修改项目信息
    *updateProductInfo({ payload }, { call }) {
      const response = yield call(updateProductInfoAPI, payload);
      return response;
    },
    // 获取项目/系列编码
    *getProCode({ payload }, { call, put }) {
      const response = yield call(getProCodeAPI, payload.proType);
      if (response && response.status === 200) {
        return response;
      } else {
        message.error(response.message);
      }
    },
    //获取字典数据
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
        } else if (payload.fcode === 'awp_pro_participant') {
          yield put({
            type: 'updateProParticipantList',
            payload: response,
          });
          return response;
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
        } else if (payload.fcode === 'awp_process_project') {
          yield put({
            type: 'updateProcessProjectList',
            payload: response,
          });
        } else if (payload.fcode === 'awp_process_series') {
          yield put({
            type: 'updateProcessSeriesList',
            payload: response,
          });
        }
      }
    },
    *getMemberNameList({}, { call, put }) {
      const response = yield call(getMemberNameListAPI);
      if (response && response.status === 200) {
        yield put({
          type: 'updateMemberNameList',
          payload: response.data,
        });
        return response;
      }
    },
    *getMemberInfoReq({ payload, callback }, { call, put }) {
      const response = yield call(getMemberInfoAPI, payload);
      if (response && response.status === 200) {
        callback && callback(response);
      } else {
        message.error(response.message);
      }
    },
  },

  reducers: {
    updateProName(state, { payload }) {
      return {
        ...state,
        proName: payload.proName,
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
    updateMemberNameList(state, { payload }) {
      return {
        ...state,
        memberNameList: payload,
      };
    },
    updateProcessProjectList(state, { payload }) {
      return {
        ...state,
        processProjectList: payload,
      };
    },
    updateProcessSeriesList(state, { payload }) {
      return {
        ...state,
        processSeriesList: payload,
      };
    },
  },
};
