import { Effect } from 'dva';
import { Reducer } from 'redux';
import {
  handlehandleServiceModule,
  // handleLineChart,
  handleLogDetails,
  handleLogDetails2,
  handleLogStack,
  handleLogStack2,
  // handlePieChart,
  handleSearchGroup,
  searchBusGroup,
  searchStackGroup,
  handleSearchtimevaguedata,
  handleSearchtimevaguedata2,
  // handleStatislog,
  handleVocabularyDictionary,
} from '@/services/operationLog';
import { queryRule, queryRule2 } from '@/services/resources';
import { getOrgDropDownListAPI } from '@/services/institutionalInfoManager/modify';
import { message } from 'antd';
// import { getDateStr, isEmptyObject } from '../../utils/utils';
export interface DataState {
  requestData: string;
  responseData: string;
}

export interface saveSearchGroupState {
  total: string;
  rows: [];
}
export interface saveStackLogState {
  total: string;
  rows: string;
}

export interface ModalState {
  saveLogDetails: {
    data: DataState;
  };
  saveSearchGroup: saveSearchGroupState;
  saveStackGroup: saveSearchGroupState;
  saveNewTable: saveSearchGroupState;
  saveBusTable: saveSearchGroupState;
  saveStackLog: saveStackLogState;
  saveBusGroup: saveStackLogState;
  saveServiceModuleSelect: [];
  saveVocabularyDic: [];
  resourceData: { rows: []; total: number };
  departLeaderList: [];
}

export interface ModelType {
  namespace: string;
  state: ModalState;
  effects: {
    logListTable: Effect;
    serviceModuleSelect: Effect;
    vocabularyDic: Effect;
    searchgroup2: Effect;
    searchBusGroupList: Effect;
    searchStackGroupList: Effect;
    fetchLogDetails: Effect;
    fetchStackLog: Effect;
    fetchStackLog2: Effect;
    getResourceData: Effect;
    getResourceData2: Effect;
    getOrgDropDownList: Effect;
    logListTable2: Effect;
    fetchLogDetails2: Effect;
  };
  reducers: {
    saveNewTable: Reducer<ModalState>;
    saveBusTable: Reducer<ModalState>;
    saveServiceModuleSelect: Reducer<ModalState>;
    saveVocabularyDic: Reducer<ModalState>;
    saveSearchGroup: Reducer<ModalState>;
    saveStackGroup: Reducer<ModalState>;
    saveBusGroup: Reducer<ModalState>;
    saveLogDetails: Reducer<ModalState>;
    saveStackLog: Reducer<ModalState>;
    saveListFetch: any;
    setDepartLeaderList: any;
  };
}

const Model: ModelType = {
  namespace: 'operationLog',
  state: {
    // saveLineChart: [],
    // savePieChart: [],
    // saveTable: {
    //   total: '',
    //   rows: [],
    // },
    // saveDimensionDic: [{ code: '' }],
    // saveDimensionDicCode: null,
    // saveStatislog: {
    //   count: '',
    //   service: '',
    //   userId: '',
    //   type: '',
    // },
    // saveDimensionChild: [],
    // saveSearchgroupFreeChart: {},
    // saveGroup: [{ groupName: '' }, { groupName: '' }, { groupName: '' }],
    // currentPage: 1,

    saveVocabularyDic: [],
    saveSearchGroup: {
      total: '',
      rows: [],
    },
    saveStackGroup: {
      total: '',
      rows: [],
    },
    saveBusGroup: {
      total: '',
      rows: [],
    },
    saveServiceModuleSelect: [],
    saveLogDetails: {
      data: {
        requestData: '',
        responseData: '',
      },
    },
    saveNewTable: {
      total: '',
      rows: [],
    },
    saveBusTable: {
      total: '',
      rows: [],
    },
    saveStackLog: {
      total: '',
      rows: '',
    },
    resourceData: {
      rows: [],
      total: 0,
    },
    departLeaderList: [],
  },

  effects: {
    // // 数量
    // *fetchStatislog({ payload }, { call, put }) {
    //
    //   const res = yield call(handleStatislog, payload);
    //
    //   if (res && res.data && res.status === 200 && res.message === 'success') {
    //     yield put({
    //       type: 'saveStatislog',
    //       payload: res.data,
    //     });
    //   }
    //
    // },
    //
    // // todo: 饼图和折线图：文档中，数据结构不完整，返回数据为空时未兼容
    // // 折线图
    // *fetchLineChart({ payload }, { call, put }) {
    //   const res = yield call(handleLineChart, payload);
    //   if (res && res.data && res.status === 200 && res.message === 'success') {
    //     yield put({
    //       type: 'saveLineChart',
    //       payload: res.data,
    //     });
    //   }
    // },
    //
    // // 饼图
    // *fetchPieChart({ payload }, { call, put }) {
    //   const res = yield call(handlePieChart, payload);
    //   if (res && res.data && res.status === 200 && res.message === 'success') {
    //     yield put({
    //       type: 'savePieChart',
    //       payload: res.data,
    //     });
    //   }
    // },
    //获取机构人员列表
    *getOrgDropDownList({ payload }, { call, put }) {
      const response = yield call(getOrgDropDownListAPI, payload);
      if (response && response.status === 200) {
        yield put({
          type: 'setDepartLeaderList',
          payload: response.data,
        });
      } else {
        message.error('查询失败');
      }
    },

    *getResourceData({ payload }, { call, put, select }) {
      const response = yield call(queryRule, payload);
      if (response && response.status === 200) {
        yield put({
          type: 'saveListFetch',
          payload: response.data,
        });
      }
    },

    *getResourceData2({ payload }, { call, put, select }) {
      const response = yield call(queryRule2, payload);
      if (response && response.status === 200) {
        yield put({
          type: 'saveListFetch',
          payload: response.data,
        });
      }
    },

    // 服务模块
    *logListTable({ payload }, { call, put }) {
      const res = yield call(handleSearchtimevaguedata, payload);
      if (res && res.status === 200 && res.message === 'success') {
        yield put({
          type: 'saveNewTable',
          payload: res.data,
        });
      }
    },

    // 操作日志列表
    *logListTable2({ payload }, { call, put }) {
      const res = yield call(handleSearchtimevaguedata2, payload);
      if (res && res.status === 200 && res.message === 'success') {
        yield put({
          type: 'saveBusTable',
          payload: res.data,
        });
      }
    },

    *serviceModuleSelect({ payload }, { call, put }) {
      const res = yield call(handlehandleServiceModule, payload);
      if (res && res.data && res.status === 200 && res.message === 'success') {
        const dimension = res[0].code;

        yield put({
          type: 'init',
          payload: dimension,
        });

        yield put({
          type: 'saveServiceModuleSelect',
          payload: res,
        });
      }
    },
    //
    // // 维度 - 词汇字典
    // *dimensionDic({ payload }, { call, put }) {
    //   const res = yield call(handleVocabularyDictionary, payload);
    //
    //   if (res && res.length !== 0) {
    //     yield put({
    //       type: 'saveDimensionDic',
    //       payload: res,
    //     });
    //
    //     if (res[0].code) {
    //       yield put({
    //         type: 'saveDimensionDicCode',
    //         payload: res[0].code,
    //       });
    //       const val = {
    //         startDate: getDateStr(-7),
    //         endDate: getDateStr(0),
    //         // startDate: '2018-08-01',
    //         // endDate: '2018-08-31',
    //         group: [
    //           {
    //             groupName: res[0].code,
    //             groupLeve: 1,
    //           },
    //         ],
    //       };
    //       yield put({
    //         type: 'searchgroup',
    //         payload: val,
    //       });
    //     }
    //   }
    // },

    // 操作类型 - 词汇字典
    *vocabularyDic({ payload }, { call, put }) {
      const res = yield call(handleVocabularyDictionary, payload);
      if (res) {
        yield put({
          type: 'saveVocabularyDic',
          payload: res,
        });
      }
    },

    // // 维度子集
    // *searchgroup({ payload }, { call, put }) {
    //   const res = yield call(handleSearchGroup, payload);
    //
    //   const name = payload.group[0].groupName;
    //
    //   yield put({
    //     type: 'saveDimensionDicCode',
    //     payload: name,
    //   });
    //   if (res && res.status === 200 && res.message === 'success') {
    //     const arr = [];
    //
    //     if (!isEmptyObject(res.data)) {
    //       const item = res.data[name].buckets;
    //
    //       for (let i = 0; i < item.length; i++) {
    //         const obj = {};
    //         obj.groupValue = item[i].key;
    //         arr.push(obj);
    //       }
    //
    //       yield put({
    //         type: 'saveDimensionChild',
    //         payload: arr,
    //       });
    //
    //       if (arr.length !== 0) {
    //         const par = {
    //           group: arr,
    //           attrName: name,
    //           startDate: payload.startDate,
    //           endDate: payload.endDate,
    //         };
    //         yield put({ type: 'fetchLineChart', payload: par });
    //         yield put({ type: 'fetchPieChart', payload: par });
    //       }
    //     }
    //   }
    // },

    // 首页tableOrder
    *searchgroup2({ payload }, { call, put }) {
      const res = yield call(handleSearchGroup, payload);
      const name = payload.group[0].groupName;
      if (res && res.data && res.data[name]) {
        const item = res.data[name];
        item.rows = res.data[name].buckets;
        item.total = res.data[name].buckets.length;

        yield put({
          type: 'saveSearchGroup',
          payload: item,
        });
      }
    },

    // 操作日志
    *searchBusGroupList({ payload }, { call, put }) {
      const res = yield call(searchBusGroup, payload);
      const name = payload.group[0].groupName;
      if (res && res.data && res.data[name]) {
        const item = res.data[name];
        item.rows = res.data[name].buckets;
        item.total = res.data[name].buckets.length;

        yield put({
          type: 'saveBusGroup',
          payload: item,
        });
      }
    },

    *searchStackGroupList({ payload }, { call, put }) {
      const res = yield call(searchStackGroup, payload);
      const name = payload.group[0].groupName;
      if (res && res.data && res.data[name]) {
        const item = res.data[name];
        item.rows = res.data[name].buckets;
        item.total = res.data[name].buckets.length;

        yield put({
          type: 'saveStackGroup',
          payload: item,
        });
      }
    },

    *fetchLogDetails({ payload }, { call, put }) {
      const res = yield call(handleLogDetails, payload);
      if (res.data) {
        yield put({
          type: 'saveLogDetails',
          payload: res.data,
        });
      }
    },

    *fetchLogDetails2({ payload }, { call, put }) {
      const res = yield call(handleLogDetails2, payload);
      if (res.data) {
        yield put({
          type: 'saveLogDetails',
          payload: res.data,
        });
      }
    },

    *fetchStackLog({ payload }, { call, put }) {
      const res = yield call(handleLogStack, payload);
      if (res && res.data && res.status === 200 && res.message === 'success') {
        yield put({
          type: 'saveStackLog',
          payload: res.data,
        });
      }
    },
    *fetchStackLog2({ payload }, { call, put }) {
      const res = yield call(handleLogStack2, payload);
      if (res && res.data && res.status === 200 && res.message === 'success') {
        yield put({
          type: 'saveStackLog',
          payload: res.data,
        });
      }
    },
    //
    // *dic({ payload }, { call, put }) {
    //   const res = yield call(handleLogStack, payload);
    //   if (res && res.data && res.status === 200 && res.message === 'success') {
    //     yield put({
    //       type: 'saveStackLog',
    //       payload: res.data,
    //     });
    //   }
    // },
    //
    // // 自由图表
    // *searchgroupFreeChart({ payload }, { call, put }) {
    //   const res = yield call(handleSearchGroup, payload);
    //   if (res && res.data && res.status === 200 && res.message === 'success') {
    //     yield put({
    //       type: 'saveClean',
    //       payload: {
    //         saveSearchgroupFreeChart: {},
    //         saveGroup: [{ groupName: '' }, { groupName: '' }, { groupName: '' }],
    //       },
    //     });
    //
    //     yield put({
    //       type: 'saveSearchgroupFreeChart',
    //       payload: res.data,
    //     });
    //
    //     yield put({
    //       type: 'saveGroup',
    //       payload: payload.group,
    //     });
    //   }
    // },
    //
    // // 操作类型
    // *operationType({ payload }, { call, put }) {
    //   const res = yield call(handleSearchGroup, payload);
    //   if (res && res.data && res.status === 200 && res.message === 'success') {
    //     yield put({
    //       type: 'saveSearchgroupFreeChart',
    //       payload: res.data,
    //     });
    //   }
    // },
  },

  reducers: {
    setDepartLeaderList(state: any, { payload }: any) {
      return {
        ...state,
        departLeaderList: payload,
      };
    },
    saveListFetch(state: any, action: { payload: any }) {
      return {
        ...state,
        resourceData: action.payload,
      };
    },
    saveNewTable(state, { payload }) {
      return {
        ...(state as ModalState),
        saveNewTable: payload,
      };
    },
    saveBusTable(state, { payload }) {
      return {
        ...(state as ModalState),
        saveBusTable: payload,
      };
    },
    saveVocabularyDic(state, { payload }) {
      return {
        ...(state as ModalState),
        saveVocabularyDic: payload,
      };
    },
    saveSearchGroup(state, { payload }) {
      return {
        ...(state as ModalState),
        saveSearchGroup: payload,
      };
    },
    saveStackGroup(state, { payload }) {
      return {
        ...(state as ModalState),
        saveStackGroup: payload,
      };
    },
    saveBusGroup(state, { payload }) {
      return {
        ...(state as ModalState),
        saveBusGroup: payload,
      };
    },
    saveLogDetails(state, { payload }) {
      return {
        ...(state as ModalState),
        saveLogDetails: payload,
      };
    },
    saveServiceModuleSelect(state, { payload }) {
      return {
        ...(state as ModalState),
        saveServiceModuleSelect: payload,
      };
    },
    saveStackLog(state, { payload }) {
      return {
        ...(state as ModalState),
        saveStackLog: payload,
      };
    },

    saveStatislog(state, action) {
      return {
        ...state,
        saveStatislog: action.payload,
      };
    },
    saveLineChart(state, action) {
      return {
        ...state,
        saveLineChart: action.payload,
      };
    },
    savePieChart(state, action) {
      return {
        ...state,
        savePieChart: action.payload,
      };
    },
    saveTable(state, action) {
      return {
        ...state,
        saveTable: action.payload,
      };
    },
    saveDimensionDic(state, action) {
      return {
        ...state,
        saveDimensionDic: action.payload,
      };
    },
    saveDimensionDicCode(state, action) {
      return {
        ...state,
        saveDimensionDicCode: action.payload,
      };
    },
    saveDimensionChild(state, action) {
      return {
        ...state,
        saveDimensionChild: action.payload,
      };
    },
    saveSearchgroupFreeChart(state, action) {
      return {
        ...state,
        saveSearchgroupFreeChart: action.payload,
      };
    },
    saveGroup(state, action) {
      return {
        ...state,
        saveGroup: action.payload,
      };
    },
    saveClean(state, action) {
      return {
        ...state,
        saveSearchgroupFreeChart: action.payload.saveSearchgroupFreeChart,
        saveGroup: action.payload.saveGroup,
      };
    },
  },
};

export default Model;
