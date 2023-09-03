import { message } from 'antd';
import {
  approverListAPI,
  getDetail,
  getDetailForSpecifyBatch,
  getItemsList,
  getModuleList,
  getOAPersonList,
  getPersonList,
  getProductList,
  getStatusList,
  getTableData,
  getTableList,
  getUnitsList,
  resend2OA,
  sealNameListAPI,
  sealTypeListAPI,
  sendOAagin,
} from '@/services/useRegistrate';

const model = {
  namespace: 'useRegistrate',
  state: {
    total: 0,
    tableList: [],
    productList: [],
    statusList: [],
    detailInfo: {
      sealRegisterRemark: '',
      usingFileList: [],
      usingRegistrationInfoList: [],
    },
    // 账户类型
    accountTypeList: [],
    sealTypeList: [],
    sealNameList: [],
    contractTypeList: [],
    payTypeList: [],
    lookform: {},
    processStateList: [],
    useUnitList: [],
    personList: [],
    OAPersonList: [],
    moduleList: [],
    approverList: [],
  },
  effects: {
    // 新版用印登记-查看批次详情
    *getDetailForSpecifyBatch({ payload, callback }, { call, put }) {
      const response = yield call(getDetailForSpecifyBatch, payload);
      callback && callback(response);
      if (response && response.status === 200) {
        yield put({
          type: 'updateDetailInfo',
          payload: response,
        });
      } else {
        message.error(response.message);
      }
    },

    // 新版用印登记-重新发送OA
    *resend2OA({ payload, callback }, { call, put }) {
      const response = yield call(resend2OA, payload);
      callback && callback(response);
      if (response && response.status === 200) {
        message.success('重新发送成功!');
      } else {
        message.error(response.message);
      }
    },

    // 新版用印登记-产品下拉列表查询
    *getProductList({ payload }, { call, put }) {
      const response = yield call(getProductList, payload);
      if (response && response.status === 200) {
        yield put({
          type: 'updateProductList',
          payload: response,
        });
      } else {
        message.error(response.message);
      }
    },

    // 新版用印登记列表查询
    *getTableList({ payload, callback }, { call, put }) {
      const response = yield call(getTableList, payload);
      callback && callback(response);
      if (response && response.status === 200) {
        yield put({
          type: 'updateTableList',
          payload: response,
        });
      } else {
        message.warn(response.message);
      }
    },

    // 列表信息 查询
    *queryTableData({ payload }, { call }) {
      const response = yield call(getTableData, payload);
      if (response && response.status === 200) {
        return response;
      } else {
        message.error(response.message);
      }
    },

    // 用印登记各下拉框 查询
    *queryItemsList({ payload }, { call, put }) {
      const response = yield call(getItemsList, payload);
      if (response && response.status === 200) {
        yield put({
          type: 'useSealTypeList',
          payload: response,
        });
      } else {
        message.error('查询失败');
      }
    },

    // 数据详情
    *queryDetailForm({ payload }, { call, put }) {
      const response = yield call(getDetail, payload);
      if (response && response.status === 200) {
        return response;
      }
      message.error('查询失败');
    },

    // 用印状态-获取流程名称
    *queryStatusList({ payload }, { call, put }) {
      const response = yield call(getStatusList, payload);
      if (response && response.status === 200) {
        yield put({
          type: 'getStatusList',
          payload: response,
        });
      } else {
        message.error('查询失败');
      }
    },
    // 用印单位
    *queryUnitList({ payload }, { call, put }) {
      const response = yield call(getUnitsList, payload);
      if (response && response.status === 200) {
        yield put({
          type: 'getUnitsList',
          payload: response,
        });
      }
    },

    // 发送OA
    *sendOA({ payload, callback }, { call, put }) {
      const response = yield call(sendOAagin, payload);
      if (response && response.status === 200) {
        message.success('发送成功');
        callback && callback();
      } else {
        message.error('发送失败');
      }
    },

    // 获取当前机构全部用户列表(全部)
    *getPersonList({ payload }, { call, put }) {
      const response = yield call(getPersonList, payload);
      if (response && response.status === 200) {
        yield put({
          type: 'updatePersonList',
          payload: response,
        });
      }
    },
    // 获取当前机构全部用户列表（OA）
    *getOAPersonList({ payload }, { call, put }) {
      const response = yield call(getOAPersonList, payload);
      if (response && response.status === 200) {
        yield put({
          type: 'updateOAPersonList',
          payload: response,
        });
      }
    },
    // 获取审批人下拉列表
    *getApproverList({ payload }, { call, put }) {
      const response = yield call(approverListAPI, payload);
      if (response) {
        yield put({
          type: 'updateApproverList',
          payload: response,
        });
      }
    },
    // 获取产品实名注册子流程模块代码和名称的映射关系
    *getModuleList({ payload }, { call, put }) {
      const response = yield call(getModuleList, payload);
      if (response) {
        yield put({
          type: 'updateModuleList',
          payload: response,
        });
      }
    },
    // 获取印章种类列表（全部）
    *getSealTypeList({ payload }, { call, put }) {
      const response = yield call(sealTypeListAPI, payload);
      if (response && response.status === 200) {
        yield put({
          type: 'updateSealTypeList',
          payload: response,
        });
      }
    },
    // 获取印章名列表（全部）
    *getSealNameList({ payload }, { call, put }) {
      const response = yield call(sealNameListAPI, payload);
      if (response && response.status === 200) {
        yield put({
          type: 'updateSealNameList',
          payload: response,
        });
      }
    },
  },

  reducers: {
    useSealTypeList(state, action) {
      const { data } = action.payload;
      return {
        ...state,
        // sealTypeList: data.useSealType,
        // sealNameList: data.sealName,
        contractTypeList: data.usingContractType,
        payTypeList: data.paymentType,
      };
    },

    detailForm(state, action) {
      return {
        ...state,
        lookform: action.payload.data,
      };
    },
    getStatusList(state, action) {
      return {
        ...state,
        statusList: action.payload.data,
      };
    },
    getUnitsList(state, action) {
      return {
        ...state,
        useUnitList: action.payload.data,
      };
    },
    updatePersonList(state, action) {
      return {
        ...state,
        personList: action.payload.data,
      };
    },
    updateOAPersonList(state, action) {
      return {
        ...state,
        OAPersonList: action.payload.data,
      };
    },
    updateApproverList(state, action) {
      return {
        ...state,
        approvalList: action.payload,
      };
    },
    updateModuleList(state, action) {
      console.log(action.payload);
      return {
        ...state,
        moduleList: action.payload,
      };
    },
    updateSealTypeList(state, action) {
      return {
        ...state,
        sealTypeList: action.payload.data,
      };
    },
    updateSealNameList(state, action) {
      return {
        ...state,
        sealNameList: action.payload.data,
      };
    },
    updateTableList(state, action) {
      return {
        ...state,
        tableList: action.payload.data.resultItemList || [],
        total: action.payload.data.total || 0,
      };
    },
    updateProductList(state, action) {
      return {
        ...state,
        productList: action.payload.data || [],
      };
    },
    updateDetailInfo(state, action) {
      return {
        ...state,
        detailInfo: action.payload.data,
      };
    },
  },
};

export default model;
