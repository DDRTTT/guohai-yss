import { message } from 'antd';
import {
  getBankInfo,
  getDeleteAPI,
  getDicList,
  getExamineAPI,
  getFileType,
  getListDicList,
  getProDetails,
  getProDetailsList,
  getProInfo,
  getProtocolInfo,
  getTableDataList,
  getTypeList,
  salesAdd,
  salesUpdte,
} from '@/services/salesOrgManagement';

const model = {
  namespace: 'salesOrgManagement',
  state: {
    /* 表格列表 */
    tableList: [],
    // 销售商类型
    sellerList: [],
    // 销售渠道类型
    channelList: [],
    // 中登
    zdSettleList: [],
    // 销售信息列表
    salesDetailsList: [],
    productDataInfo: {
      salesOrgInfoElement: {},
      sellerAccountInfoParamList: [],
    },
    // 费用品种
    rateCategoryList: [],
    // 费率类型
    rateTypeList: [],
    // 付费频率
    rateMonList: [],
    // 列表页展开搜索渠道类型
    channelTypeList: {},
    // 文档类型
    filesTypeList: [],
    // 字典返回的数据
    dicList: [],
  },
  effects: {
    /* 查询任务列表 */
    *handleTableDataList({ payload }, { call }) {
      const response = yield call(getTableDataList, payload);
      if (response && response.status === 200) {
        return response;
      }
      message.error(response.message);
    },
    /* 销售渠道类型 */
    *queryCriteria({ payload }, { call }) {
      const response = yield call(getDicList, payload);
      if (response) {
        return response;
      } else {
        message.error('查询失败');
      }
    },
    /* 列表渠道类型 */
    *queryListCriteria({ payload }, { call, put }) {
      const response = yield call(getListDicList, payload);
      if (response) {
        yield put({
          type: 'channelType',
          payload: response,
        });
      } else {
        message.error('查询失败');
      }
    },
    // 销售商，中登
    *queryTypeList({ payload }, { call, put }) {
      const response = yield call(getTypeList, payload);
      if (response) {
        yield put({
          type: 'setDicList',
          payload: response.data,
        });
        yield put({
          type: 'sellerType',
          payload: response,
        });
        yield put({
          type: 'zdSettlePlace',
          payload: response,
        });
        yield put({
          type: 'rateCategory',
          payload: response,
        });
        yield put({
          type: 'rateType',
          payload: response,
        });
        yield put({
          type: 'rateMon',
          payload: response,
        });
      } else {
        message.error('查询失败');
      }
    },
    // 新增保存
    *querysalesAdd({ payload }, { call }) {
      const response = yield call(salesAdd, payload);
      if (response && response.status === 200) {
        return response;
      } else {
        message.error(response.message);
      }
    },
    // 新增页面修改，详情反显
    *handleProInfo({ payload }, { call, put }) {
      const response = yield call(getProInfo, payload);
      if (response.status === 200) {
        // yield put({
        //   type: 'prodectInfo',
        //   payload: response,
        // });
        return response;
      }
      message.warn(response.message);
    },
    // 修改保存
    *querysalesUpdate({ payload }, { call }) {
      const response = yield call(salesUpdte, payload);
      if (response && response.status === 200) {
        return response;
      } else {
        message.error(response.message);
      }
    },
    // 批量审核、反审核
    *queryExamineAPI({ payload }, { call }) {
      const response = yield call(getExamineAPI, payload);
      let flag = false;
      if (response.status === 200) {
        flag = true;
        message.success('成功');
      } else {
        message.warn(response.message);
      }
      return flag;
    },
    // 删除
    *getDeleteFunc({ payload }, { call }) {
      const response = yield call(getDeleteAPI, payload);
      let flag = false;
      if (response.status === 200) {
        flag = true;
        message.success('删除成功');
      } else {
        message.warn(response.message);
      }
      return flag;
    },
    // 销售信息列表
    *handleProDetailsList({ payload }, { call }) {
      const response = yield call(getProDetailsList, payload);
      if (response && response.status === 200) {
        return response;
      }
      message.warn(response.message);
    },
    // 销售信息列表详情
    *handleProDetails({ payload }, { call }) {
      const response = yield call(getProDetails, payload);
      if (response && response.status === 200) {
        return response;
      }
      message.warn(response.message);
    },
    // 协议信息
    *handleProtocolInfo({ payload }, { call }) {
      const response = yield call(getProtocolInfo, payload);
      if (response && response.status === 200) {
        return response;
      }
      message.warn(response.message);
    },
    // 开户行
    *queryBankInfo({ payload }, { call, put }) {
      const response = yield call(getBankInfo, payload);
      if (response) {
        return response;
      }
      message.warn(response.message);
    },
    // 文件类型
    *handleFileType({ payload }, { call, put }) {
      const response = yield call(getFileType, payload);
      if (response && response.status === 200) {
        yield put({
          type: 'filesType',
          payload: response,
        });
      }
      // message.error('查询失败');
    },
  },
  reducers: {
    setDicList(state, { payload }) {
      return {
        ...state,
        dicList: payload,
      };
    },
    sellerType(state, action) {
      return {
        ...state,
        sellerList: action.payload.data.X001,
      };
    },
    zdSettlePlace(state, action) {
      return {
        ...state,
        zdSettleList: action.payload.data.X003,
      };
    },
    rateCategory(state, action) {
      return {
        ...state,
        rateCategoryList: action.payload.data.X006,
      };
    },
    rateType(state, action) {
      return {
        ...state,
        rateTypeList: action.payload.data.X007,
      };
    },
    rateMon(state, action) {
      return {
        ...state,
        rateMonList: action.payload.data.X004,
      };
    },
    channelType(state, action) {
      return {
        ...state,
        channelTypeList: action.payload.data,
      };
    },
    filesType(state, action) {
      return {
        ...state,
        filesTypeList: action.payload.data,
      };
    },
    // bankType(state, action) {
    //   console.log(action)
    //   return {
    //     ...state,
    //     bankList: action.payload.data,
    //   };
    // },
  },
};

export default model;
