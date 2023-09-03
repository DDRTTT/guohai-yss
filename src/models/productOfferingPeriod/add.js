import {
  handleProductEnumSearchAPI,
  handleRaiseDateAdjustmentProductAPI,
  handleWordDictionaryFetchAPI,
  handleSaveByAddAPI,
  handleSubmitAPI,
} from '@/services/productOfferingPeriod/add';
import { routerRedux } from 'dva/router';
import { message } from 'antd';
import { cloneDeep } from 'lodash';

// 处理产品全称
function handleGetNewProduct(params) {
  params.forEach(item => {
    item.proName = `${item.proName}(${item.proCode})`;
  });
  return params;
}

export default {
  namespace: 'productOfferingPeriodAdd',
  state: {
    saveProductSelection: [],
    saveBackMsgByAdd: {},
    saveWordDictionaryFetch: [],
  },

  effects: {
    // 新增页面 产品名称下拉框查询
    *handleProductSearch({ payload }, { call, put }) {
      const response = yield call(handleProductEnumSearchAPI, payload);
      const temp = cloneDeep(response.data);
      const newData = handleGetNewProduct(temp);
      if (response && response.status === 200) {
        yield put({
          type: 'saveProductSelection',
          payload: newData,
        });
      } else {
        message.warn(response.message);
      }
    },
    // 根据产品名称回显信息
    *handleGetBackMsgByAdd({ payload }, { call, put }) {
      const response = yield call(handleRaiseDateAdjustmentProductAPI, payload);
      if (response) {
        yield put({
          type: 'saveBackMsgByAdd',
          payload: response.data,
        });
      } else {
        message.warn(response.message);
      }
      return response.data;
    },
    // 字典
    *handleWordDictionaryFetch({ payload }, { call, put }) {
      const response = yield call(handleWordDictionaryFetchAPI, payload);
      if (response && response.status === 200) {
        yield put({
          type: 'saveWordDictionaryFetch',
          payload: response.data,
        });
      } else {
        message.warn(response.message);
      }
    },
    // 保存
    *handleSaveByAddAPI({ payload }, { call, put }) {
      const response = yield call(handleSaveByAddAPI, payload);
      if (response && response.status === 200) {
        call(
          routerRedux.push({
            pathname: '/productOfferingPeriod/productOfferingPeriod',
          }),
        );
        yield put({
          type: 'saveMsg',
          payload: response.data,
        });
      } else {
        message.warn(response.message);
      }
    },
    // 提交
    *handleSubmitAPI({ payload }, { call, put }) {
      const response = yield call(handleSubmitAPI, payload);
      let flag = '';
      if (response && response.status === 200) {
        flag = true;
        yield put({
          type: 'submitMsg',
          payload: response.data,
        });
        message.success('提交成功');
        return flag;
      }
      message.warn(response.message);
    },
  },
  reducers: {
    saveProductSelection(state, { payload }) {
      return {
        ...state,
        saveProductSelection: payload,
      };
    },
    saveBackMsgByAdd(state, { payload }) {
      return {
        ...state,
        saveBackMsgByAdd: payload,
      };
    },
    saveWordDictionaryFetch(state, { payload }) {
      return {
        ...state,
        saveWordDictionaryFetch: payload,
      };
    },
  },
};
