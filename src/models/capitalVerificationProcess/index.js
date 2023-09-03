import {
  handleGetCapitalVerificationListAPI,
  handleWordDictionaryFetchAPI,
  handleProductEnumSearchAPI,
  handleRaiseDateAdjustmentProductAPI,
  handleOrganizationSearchAPI,
  handleSubmitAPI,
  getInvestManagerNameListAPI,
  handleBatchSubmitAPI,
  revokeAPI,
  deleteAPI,
} from '@/services/capitalVerificationProcess';
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
  namespace: 'capitalVerificationProcess',
  state: {
    saveListFetch: {
      total: '',
      taskList: [],
    },
    saveWordDictionaryFetch: {},
    saveProductSelection: [],
    saveOrganization: [],
    investManagerNameList: [],
  },

  effects: {
    // 列表查询
    *handleListFetch({ payload }, { call, put }) {
      const response = yield call(handleGetCapitalVerificationListAPI, payload);
      if (response && response.status === 200) {
        yield put({
          type: 'saveListFetch',
          payload: response.data,
        });
      } else {
        message.warn(response.message ? response.message : '查询失败');
      }
    },

    // 字典查询
    *handleWordDictionaryFetch({ payload }, { call, put }) {
      const response = yield call(handleWordDictionaryFetchAPI, payload);
      if (response && response.status === 200) {
        // 验资，筛选掉单一A002_1；
        let temp;
        const result = cloneDeep(response.data);
        if (response.data.A002 && response.data.A002.length) {
          temp = response.data.A002.filter(item => {
            return item.code != 'A002_1';
          });
        }
        result.A002 = temp;
        yield put({
          type: 'saveWordDictionaryFetch',
          payload: result,
        });
      } else {
        message.warn(response.message ? response.message : '查询失败');
      }
    },

    // 产品名称下拉框查询
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
        message.warn(response.message ? response.message : '查询失败');
      }
    },
    //  产品回显
    *handleGetBackMsg({ payload }, { call, put }) {
      const response = yield call(handleRaiseDateAdjustmentProductAPI, payload);
      if (response && response.status === 200) {
        yield put({
          type: 'saveBackMsg',
          payload: response.data,
        });
      } else {
        message.warn(response.message);
      }
      return response.data;
    },

    // 验资机构下拉
    *handleOrganization({ payload }, { call, put }) {
      const response = yield call(handleOrganizationSearchAPI, payload);
      if (response && response.status === 200) {
        yield put({
          type: 'saveOrganization',
          payload: response.data,
        });
      } else {
        message.warn(response.message);
      }
    },

    // 撤销
    *handleRevoke({ payload }, { call, put }) {
      const response = yield call(revokeAPI, payload);
      let flag = false;
      if (response && response.status === 200) {
        flag = true;
        message.success('撤销成功');
      } else {
        message.warn(response.message);
      }
      return flag;
    },
    // 删除
    *handleDelete({ payload }, { call, put }) {
      const response = yield call(deleteAPI, payload);
      let flag = false;
      if (response && response.status === 200) {
        flag = true;
        message.success('删除成功');
      } else {
        message.warn(response.message);
      }
      return flag;
    },
    // 批量提交
    *handleBatchSubmitByIndex({ payload }, { call, put }) {
      const response = yield call(handleBatchSubmitAPI, payload);
      let flag = false;
      if (response && response.status === 200) {
        flag = true;
        message.success('提交成功');
      } else {
        message.warn(response.message);
      }
      return flag;
    },
    // 投资经理
    *getInvestManagerNameList({ payload }, { call, put }) {
      const response = yield call(getInvestManagerNameListAPI, payload);
      if (response.status === 200) {
        yield put({
          type: 'investManagerNameList',
          payload: response.data,
        });
      }
    },
  },

  reducers: {
    saveListFetch(state, { payload }) {
      return {
        ...state,
        saveListFetch: payload,
      };
    },
    saveWordDictionaryFetch(state, { payload }) {
      return {
        ...state,
        saveWordDictionaryFetch: payload,
      };
    },
    saveProductSelection(state, { payload }) {
      return {
        ...state,
        saveProductSelection: payload,
      };
    },
    saveOrganization(state, { payload }) {
      return {
        ...state,
        saveOrganization: payload,
      };
    },
    investManagerNameList(state, { payload }) {
      return {
        ...state,
        investManagerNameList: payload,
      };
    },
  },
};
