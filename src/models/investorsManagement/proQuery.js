/**
 *Create on 2020/9/29.
 */
import { message } from 'antd';
import {
  getProduct,
  getSubSystem,
  getSystem,
  handleDelProMapping,
  handleProMapping,
  handleSaveCodeMapping,
  handleSaveProMapping,
  procheck,
  prodel,
  queryforgtype,
  queryOne,
  queryRule,
  queryRuleJG,
  roleProduct,
  getOrgType,
} from '@/services/investorsManagement/product';

let model = {
  namespace: 'proQuery',
  state: {
    data: {
      data: {
        total: 0,
      },
      status: 0,
    },
    fprotype: [],
    loading: true,
    fprobank: [],
    fproGL: [],
    modal2Visible: false,
    proSomeone: {},
    saveProCode: null,
    saveProMapping: [],
    saveOrgType: [],
    saveGetProduct: [],
    saveRoleProduct: [],
    saveSubSystem: [],
    saveDefaultSystem: [],
    saveDefaultProductAssociation: { rows: [] },
    currentPage: 1,
    saveEditingKey: undefined,
    saveRoleKey: null,
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(queryRule, payload);

      if (response && response.status === 200) {
        yield put({
          type: 'save',
          payload: response,
        });
        if (response.data) {
          yield put({
            type: 'pageChange',
            payload: payload.currentPage,
          });
        }
      }

      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },
    *fetchforgtype(_, { call, put }) {
      const response = yield call(queryforgtype);
      yield put({
        type: 'savefprotype',
        payload: response.data,
      });
    },
    *check({ payload }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(procheck, payload);
      const basic = { currentPage: 1, pageSize: 10, fchecked: 1 };
      yield put({ type: 'fetch', payload: basic });
      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },
    *del({ payload }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(prodel, payload);
      const basic = { currentPage: 1, pageSize: 10, fchecked: 1 };
      yield put({ type: 'fetch', payload: basic });
      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },
    *action({ payload }, { put }) {
      yield put({
        type: 'actioninint',
        payload: true,
      });
    },
    *getfprobank({ payload }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      let valTG = 'TG';
      const resquery = yield call(queryRuleJG, valTG);
      yield put({
        type: 'savebank',
        payload: resquery.response.data,
      });
      let valGL = 'GL';
      const res = yield call(queryRuleJG, valGL);
      yield put({
        type: 'saveGL',
        payload: res.response.data,
      });
      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },
    *lookproduct({ payload }, { call, put }) {
      const response = yield call(queryOne, payload);
      yield put({
        type: 'proSomeone',
        payload: response.data[0],
      });
      yield put({
        type: 'updateModal',
        payload: true,
      });
    },
    *closeModal({ payload }, { put }) {
      yield put({
        type: 'updateModal',
        payload: false,
      });
    },

    // 查询'产品关联'信息
    *queryProMapping({ payload }, { call, put, select }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });

      let code = payload.code;
      let proBustype = payload.proBustype;
      const response = yield call(handleProMapping, code);

      yield put({
        type: 'saveProCode',
        payload: code,
      });
      yield put({
        type: 'saveRoleKey',
        payload: proBustype,
      });

      let item = yield select(state => state.proQuery.saveRoleKey);
      let key = item || payload.proBustype;

      let res = [...response.data];
      let len = res.length;
      let resArr = [];
      for (let i = 0; i < len; i++) {
        if (res[i]['proBustype'] && res[i]['proBustype'] === key) {
          res[i]['operation'] = true;
        }

        if (res[i]) {
          resArr.push(res[i]);
        }
      }

      yield put({
        type: 'saveProMapping',
        payload: resArr,
      });

      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },

    // 产品角色select
    *getOrgType({ payload }, { call, put }) {
      const response = yield call(getOrgType);
      yield put({
        type: 'saveOrgType',
        payload: response,
      });
    },

    // 获取映射平台select
    *getSubSystem({ payload }, { call, put }) {
      const response = yield call(getSubSystem);
      yield put({
        type: 'saveSubSystem',
        payload: response,
      });
    },

    // 获取默认映射平台
    *getDefaultSystem({ payload }, { call, put }) {
      const response = yield call(getSystem, payload);

      yield put({
        type: 'saveDefaultSystem',
        payload: response.data,
      });
    },

    // 保存'代码映射'信息
    *handleSaveCodeMapping({ payload }, { call, put, select }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      let proCode = yield select(state => state.proQuery.saveProCode);

      if (payload.len === '1' && payload.type === 'del' && payload.item.length === 1) {
        let obj = { ...payload.item[0] };
        for (var key in obj) {
          if (obj.hasOwnProperty(key) && key !== 'insProCode') {
            obj[key] = '';
          }
        }
        payload.item = [obj];
      }
      payload.item.map(item => {
        if (item.key) {
          delete item.key;
        }
        item.insProCode = proCode;
      });

      const response = yield call(handleSaveCodeMapping, payload.item);

      if (response.rel === true && response.message === 'success' && response.status === 200) {
        if (payload.type === 'del') {
          message.success('删除成功');
        } else {
          message.success('保存成功');
        }
        yield put({
          type: 'getDefaultSystem',
          payload: proCode,
        });
      } else if (response.status === 10065001) {
        message.warn(response.message);
      }

      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },

    // 角色和产品代码关联select 词汇字典
    *roleProduct({ payload }, { call, put }) {
      const response = yield call(roleProduct);
      yield put({
        type: 'saveRoleProduct',
        payload: response,
      });
    },

    // 产品名称select
    *getProduct({ payload }, { call, put }) {
      const response = yield call(getProduct, payload);
      yield put({
        type: 'saveGetProduct',
        payload: response.data,
      });
    },

    // 编辑状态
    *editingKey({ payload }, { put }) {
      yield put({
        type: 'saveEditingKey',
        payload: payload,
      });
    },

    // 保存'产品关联'信息
    *handleSaveProMapping({ payload }, { call, put, select }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      let proCode = yield select(state => state.proQuery.saveProCode);

      const response = yield call(handleSaveProMapping, { ...payload, proCode });
      let proBustype = yield select(state => state.proQuery.saveRoleKey);
      if (response.rel === true && response.message === 'success' && response.status === 200) {
        message.success('保存成功');
        yield put({
          type: 'queryProMapping',
          payload: { code: proCode, proBustype },
        });
      }

      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },

    // 删除'产品关联'信息
    *handleDelProMapping({ payload }, { call, put, select }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      let proCode = yield select(state => state.proQuery.saveProCode);

      const response = yield call(handleDelProMapping, { ...payload, proCode });
      let proBustype = yield select(state => state.proQuery.saveRoleKey);
      if (response.rel === true && response.message === 'success' && response.status === 200) {
        message.success('删除成功');
        yield put({
          type: 'queryProMapping',
          payload: { code: proCode, proBustype },
        });
      }

      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },

    // 保存添加Clm
    *handleAddClm({ payload }, { put }) {
      yield put({
        type: 'saveProMapping',
        payload: payload,
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
    changeLoading(state, action) {
      return {
        ...state,
        loading: action.payload,
      };
    },
    savefprotype(state, action) {
      return {
        ...state,
        fprotype: action.payload,
      };
    },
    actioninint(state, action) {
      return {
        ...state,
        data: action.payload,
      };
    },
    savebank(state, action) {
      return {
        ...state,
        fprobank: action.payload,
      };
    },
    saveGL(state, action) {
      return {
        ...state,
        fproGL: action.payload,
      };
    },
    updateModal(state, action) {
      return {
        ...state,
        modal2Visible: action.payload,
      };
    },
    proSomeone(state, action) {
      return {
        ...state,
        proSomeone: action.payload,
      };
    },
    pageChange(state, action) {
      return {
        ...state,
        currentPage: action.payload,
      };
    },
    saveProMapping(state, action) {
      return {
        ...state,
        saveProMapping: action.payload,
      };
    },
    saveOrgType(state, action) {
      return {
        ...state,
        saveOrgType: action.payload,
      };
    },
    saveRoleProduct(state, action) {
      return {
        ...state,
        saveRoleProduct: action.payload,
      };
    },
    saveSubSystem(state, action) {
      return {
        ...state,
        saveSubSystem: action.payload,
      };
    },
    saveDefaultSystem(state, action) {
      return {
        ...state,
        saveDefaultSystem: action.payload,
      };
    },
    saveDefaultProductAssociation(state, action) {
      return {
        ...state,
        saveDefaultProductAssociation: action.payload,
      };
    },
    saveProCode(state, action) {
      return {
        ...state,
        saveProCode: action.payload,
      };
    },
    saveGetProduct(state, action) {
      return {
        ...state,
        saveGetProduct: action.payload,
      };
    },
    saveEditingKey(state, action) {
      return {
        ...state,
        saveEditingKey: action.payload,
      };
    },
    saveRoleKey(state, action) {
      return {
        ...state,
        saveRoleKey: action.payload,
      };
    },
  },
};

export default model;
