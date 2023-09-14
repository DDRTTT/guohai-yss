import { message } from 'antd';
import {
  getListAPI,
  getDictsAPI,
  getCombinationAPI,
  updateUrgeAPI,
  getTimeAxisAPI,
  getListByParamAPI,
  getProductEnumAPI,
  getSimpleQueryAPI,
  getOrgNameListAPI,
} from '@/services/product/bulletinBoard';

export default {
  namespace: 'productForbulletinBoard',
  state: {
    list: [], //列表数据
    dicts: {}, //字典数据
    subclass: [], //子类字典数据
    combination: [], //组合大类、组合子类级联数据
    timeAxis: [], //时间轴数据
    listByParam: [], //管理人下啦数据
    productEnum: [], //产品名称下啦数据
    orgNameList: [], //运营行 营销行
    statusList: [
      { name: '运营中', code: '6' },
      { name: '清算中', code: '7' },
      { name: '已下线', code: '8' },
    ],
    sourceList:[
      { name: '手工录入', code: '1' },
      { name: '文件导入', code: '2' },
      { name: '同步数据', code: '3' },
    ]
  },
  effects: {
    // 获取列表数据
    *getList({ payload, status }, { call, put }) {
      const response = yield call(getListAPI, payload);
      if (response && response.status === 200) {
        yield put({
          type: 'setList',
          payload: response.data,
        });
      } else {
        message.error(response.message);
      }
    },
    // 获取字典数据
    *getDicts({ payload }, { call, put }) {
      const response = yield call(getDictsAPI, payload);
      if (response && response.status === 200) {
        yield put({
          type: 'setDicts',
          payload: response.data,
        });
        return response.data;
      } else {
        message.error(response.message);
      }
    },
    // 获取根据大类查询子类字典数据
    *getCombination({ payload }, { call, put }) {
      const response = yield call(getCombinationAPI, payload);
      if (response && response.status === 200) {
        yield put({
          type: 'setCombination',
          payload: response.data,
        });
      } else {
        message.error(response.message);
      }
    },
    // 获取根据大类查询子类字典数据/
    *getUrge({ payload }, { call, put }) {
      const response = yield call(updateUrgeAPI, payload);
      if (response && response.status === 200) {
        return true;
      } else {
        message.error(response.message);
      }
    },
    // 获取时间轴
    *getTimeAxis({ payload }, { call, put }) {
      const response = yield call(getTimeAxisAPI, payload);
      if (response && response.status === 200) {
        yield put({
          type: 'setTimeAxis',
          payload: response.data,
        });
      } else {
        message.error(response.message);
      }
    },
    // 管理人下啦数据
    *getListByParam({ payload }, { call, put }) {
      const response = yield call(getListByParamAPI, payload);
      if (response && response.status === 200) {
        yield put({
          type: 'setListByParam',
          payload: response.data,
        });
      } else {
        message.error(response.message);
      }
    },
    // 产品名称下啦
    *getProductEnum({ payload }, { call, put }) {
      const response = yield call(getProductEnumAPI, payload);
      if (response && response.status === 200) {
        yield put({
          type: 'setProductEnum',
          payload: response.data,
        });
      } else {
        message.error(response.message);
      }
    },
    // 阶段统计数据查询
    *getSimpleQuery({ payload }, { call, put }) {
      const response = yield call(getSimpleQueryAPI, payload);
      if (response && response.status === 200) {
        return response.data;
      } else {
        message.error(response.message);
      }
    },
    // 运营行 营销行
    *getOrgNameList({ payload }, { call, put }) {
      const response = yield call(getOrgNameListAPI, payload);
      if (response && response.status === 200) {
        yield put({
          type: 'setOrgNameList',
          payload: response.data,
        });
      } else {
        message.error(response.message);
      }
    },
  },
  reducers: {
    setList(state, { payload }) {
      return {
        ...state,
        list: payload,
      };
    },
    setDicts(state, { payload }) {
      return {
        ...state,
        dicts: payload,
      };
    },
    setCombination(state, { payload }) {
      return {
        ...state,
        combination: payload,
      };
    },
    setTimeAxis(state, { payload }) {
      return {
        ...state,
        timeAxis: payload,
      };
    },
    setListByParam(state, { payload }) {
      return {
        ...state,
        listByParam: payload,
      };
    },
    setProductEnum(state, { payload }) {
      return {
        ...state,
        productEnum: payload,
      };
    },
    setOrgNameList(state, { payload }) {
      return {
        ...state,
        orgNameList: payload,
      };
    },
  },
};
