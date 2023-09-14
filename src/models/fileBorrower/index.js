import {
  getPersonList,
  getDictsAPI,
  getPersonOrg,
  fileClass,
  fileType,
  makeApply,
  orderList,
  fileTypeTrans,
  applyList,
  delApply,
  modifyApply,
} from '@/services/fileBorrower';
import { message } from 'antd';

export default {
  namespace: 'fileBorrower',
  state: {
    persons: [],
    dicts: {
      borrowingStatus: [], //借阅状态
    },
    orgs: [],
    _class: [], //档案大类
    types: [], //文档类型
    subTypes: [], //文件类型
    orderList: {
      //借阅单集合
      rows: [],
      total: 0,
    },
    selectedOrderList: {
      //选择的借阅单集合
      rows: [],
      total: 0,
    },
    applyList: {
      rows: [],
      total: 0,
    },
    //列表上字典转换
    tranDicts: [],
    transFiles: [],
  },
  effects: {
    // 借阅人
    *getPersons({ payload }, { call, put }) {
      const response = yield call(getPersonList, payload);
      if (response && response.status === 200) {
        yield put({
          type: 'savePersons',
          payload: response.data,
        });
      } else {
        message.warn(response.message);
      }
    },
    // 字典
    *getDictsFunc({ payload }, { call, put }) {
      const response = yield call(getDictsAPI, payload.codeList);
      if (response && response.status === 200) {
        yield put({
          type: 'saveDicts',
          payload: { ...response.data, ...{ key: payload.key } },
        });
      } else {
        message.warn(response.message);
      }
    },
    // 所属部门
    *getPersonOrg({ payload }, { call, put }) {
      const response = yield call(getPersonOrg, payload);
      if (response && response.status === 200) {
        yield put({
          type: 'saveOrgs',
          payload: response.data,
        });
      } else {
        message.warn(response.message);
      }
    },
    // 档案大类
    *getClass({ payload }, { call, put }) {
      const response = yield call(fileClass, payload);
      if (response && response.status === 200) {
        yield put({
          type: 'saveClass',
          payload: response.data,
        });
      } else {
        message.warn(response.message);
      }
    },
    // 文档类型
    *getTypes({ payload }, { call, put }) {
      const response = yield call(fileType, payload.val);
      if (response && response.status === 200) {
        yield put({
          type: payload.isSub ? 'saveSubTypes' : 'saveTypes', //如果isSub为true，查询的文件类型，否则为文档类型
          payload: response.data,
        });
      } else {
        message.warn(response.message);
      }
    },
    // 借阅申请
    *makeApply({ payload }, { call, put }) {
      const response = yield call(makeApply, payload);
      if (response && response.status === 200) {
        message.success(payload.id ? '修改成功' : '添加成功');
      } else {
        message.warn(response.message);
      }
    },
    *fetchApplyList({ payload }, { call, put }) {
      console.log('fetchApplyList', payload);
      const response = yield call(applyList, payload);
      console.log(response);
      if (response && response.status === 200) {
        yield put({
          type: 'saveApplyList',
          payload: response.data,
        });
      } else {
        message.warn(response.message);
      }
    },
    // 借阅单列表
    *getorderList({ payload }, { call, put }) {
      const params = { ...payload };
      params.IS_SELECTED && delete params.IS_SELECTED;
      const response = yield call(orderList, params);
      if (response && response.status === 200) {
        yield put({
          type: 'saveOrderList',
          payload: payload.IS_SELECTED ? { IS_SELECTED: true, data: response.data } : response.data,
        });
      } else {
        message.warn(response.message);
      }
    },
    //列表上字典转换
    *getTranDicts({ payload }, { call, put }) {
      const response = yield call(orderList, payload);
      if (response && response.status === 200) {
        yield put({
          type: 'saveTranDicts',
          payload: response.data,
        });
      } else {
        message.warn(response.message);
      }
    },
    *getFileTypes({ payload }, { call, put }) {
      const response = yield call(fileTypeTrans, payload);
      if (response && response.status === 200) {
        yield put({
          type: 'saveTransFiles',
          payload: response.data,
        });
      } else {
        message.warn(response.message);
      }
    },
    *fetchDelApply({ payload }, { call, put }) {
      const response = yield call(delApply, payload);
      if (response && response.status === 200) {
        message.success('删除成功');
      } else {
        message.warn(response.message);
      }
    },
    *fetModifyApply({ payload }, { call, put }) {
      const response = yield call(modifyApply, payload);
      if (response && response.status === 200) {
        message.success('操作成功');
      } else {
        message.warn(response.message);
      }
    },
  },
  reducers: {
    savePersons(state, { payload }) {
      return {
        ...state,
        persons: payload,
      };
    },
    saveDicts(state, { payload }) {
      const dicts = { ...state.dicts };
      dicts[payload.key] = payload[payload.key];
      return { ...state, dicts };
    },
    saveOrgs(state, { payload }) {
      return {
        ...state,
        orgs: payload,
      };
    },
    saveClass(state, { payload }) {
      return {
        ...state,
        _class: payload,
      };
    },
    saveTypes(state, { payload }) {
      return {
        ...state,
        types: payload,
      };
    },
    saveSubTypes(state, { payload }) {
      return {
        ...state,
        subTypes: payload,
      };
    },
    saveOrderList(state, { payload }) {
      let params = payload.IS_SELECTED ? payload.data : payload;
      const data = {
        total: Array.isArray(params) ? params.length : params.total,
        rows: Array.isArray(params) ? params : params.rows,
      };
      return payload.IS_SELECTED
        ? {
            ...state,
            selectedOrderList: data,
          }
        : {
            ...state,
            orderList: data,
          };
    },
    saveApplyList(state, { payload }) {
      return {
        ...state,
        applyList: payload,
      };
    },
    saveTranDicts(state, { payload }) {
      return {
        ...state,
        tranDicts: payload,
      };
    },
    saveTransFiles(state, { payload }) {
      return {
        ...state,
        transFiles: payload,
      };
    },
  },
};
