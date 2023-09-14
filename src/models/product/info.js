import { message } from 'antd';
import {
  getProductFileAPI,
  getProductFileListAPI,
  getProductFileTypeAPI,
  getUserListAPI,
  getInfoListAPI,
  getProcessNameAPI,
  getTaskNameAPI,
  getHistoricalByProCodeAPI,
  getNodeTodoTaskAPI,
  getTimeAxisAPI,
  addTaskAPI
} from '@/services/product/info';

// 时间轴数据组装
const handleData = val => {
  try {
    let arr = [];
    val.forEach(item => {
      let list = JSON.parse(JSON.stringify(item.list));
      list.unshift({ yearAndMoth: item.yearAndMoth });
      arr = [...arr, ...list];
    });

    return arr;
  } catch (error) {
    return [];
  }
};

export default {
  namespace: 'productForInfo',
  state: {
    productFileData: {}, //看板文档列表
    productFileListDocType: [], //文档类型
    productFileListFileType: [], //明细分类
    timeAxis: [], // 时间轴列表数据
    userList: [], //流程发起人
    nodeTodoTask: [], //任务列表
    historicalByProCode: [], // 产品生命周期阶段
    infoList: [], //费用与业绩报酬信息 / 信息披露 / 终止清算
    processNameList: [], //流程名称下拉
    taskNameList: [], //任务名称
  },
  effects: {
    // 获取产品文档信息(表格信息)
    *productFileDataFunc({ payload, callback }, { call, put }) {
      const response = yield call(getProductFileAPI, payload);
      if (response && response.status === 200) {
        yield put({
          type: 'productFileData',
          payload: response.data,
        });
        if (callback) callback(response.data);
      } else {
        message.error(response.message);
      }
    },

    // 获取产品文档下拉框列表数据(文档类型)
    *getProductFileListDocTypeFunc({ payload }, { call, put }) {
      const response = yield call(getProductFileListAPI, payload);
      if (response && response.status === 200) {
        yield put({
          type: 'productFileListDocType',
          payload: response.data,
        });
      } else {
        message.error(response.message);
      }
    },

    // 获取产品文档下拉框列表数据(明细分类)
    *getProductFileListFileTypeFunc({ payload }, { call, put }) {
      const response = yield call(getProductFileTypeAPI, payload);
      if (response && response.status === 200) {
        yield put({
          type: 'productFileListFileType',
          payload: response.data,
        });
      } else {
        message.error(response.message);
      }
    },
    // 获取时间轴列表
    *getTimeAxis({ payload }, { call, put }) {
      const response = yield call(getTimeAxisAPI, payload);
      if (response && response.status === 200) {
        yield put({
          type: 'setTimeAxis',
          payload: handleData(response.data),
        });
      } else {
        message.error(response.message);
      }
    },
    // 获取流程发起人下啦数据
    *getUserList({ payload }, { call, put }) {
      const response = yield call(getUserListAPI, payload);
      if (response && response.status === 200) {
        yield put({
          type: 'setUserList',
          payload: response.data,
        });
      } else {
        message.error(response.message);
      }
    },
    // 任务列表
    *getNodeTodoTask({ payload }, { call, put }) {
      const response = yield call(getNodeTodoTaskAPI, payload);
      if (response && response.status === 200) {
        yield put({
          type: 'setNodeTodoTask',
          payload: response.data,
        });
      } else {
        message.error(response.message);
      }
    },
    // 产品生命周期阶段
    *getHistoricalByProCode({ payload }, { call, put }) {
      const response = yield call(getHistoricalByProCodeAPI, payload);
      if (response && response.status === 200) {
        yield put({
          type: 'setHistoricalByProCode',
          payload: response.data,
        });
      } else {
        message.error(response.message);
      }
    },
    // 产品看板-产品数据- 费用与业绩报酬信息 / 信息披露 / 终止清算
    *getInfoList({ payload }, { call, put }) {
      const response = yield call(getInfoListAPI, payload);
      if (response && response.status === 200) {
        yield put({
          type: 'setInfoList',
          payload: response.data,
        });
        return response.data;
      } else {
        message.error(response.message);
      }
    },
    // 产品看板-流程名称下拉
    *getProcessName({ payload }, { call, put }) {
      const response = yield call(getProcessNameAPI, payload);
      if (response && response.status === 200) {
        yield put({
          type: 'setProcessName',
          payload: response.data,
        });
        return response.data;
      } else {
        message.error(response.message);
      }
    },
    // 产品看板-任务名称
    *getTaskName({ payload }, { call, put }) {
      const response = yield call(getTaskNameAPI, payload);
      if (response && response.status === 200) {
        yield put({
          type: 'setTaskName',
          payload: response.data,
        });
        return response.data;
      } else {
        message.error(response.message);
      }
    },
    // 产品看板-任务名称
    *addTask({ payload }, { call, put }) {
      const response = yield call(addTaskAPI, payload);
      if (response && response.status === 200) {
        return response.rel;
      } else {
        message.error(response.message);
      }
    },
  },
  reducers: {
    productFileData(state, { payload }) {
      return {
        ...state,
        productFileData: payload,
      };
    },
    productFileListDocType(state, { payload }) {
      return {
        ...state,
        productFileListDocType: payload,
      };
    },
    productFileListFileType(state, { payload }) {
      return {
        ...state,
        productFileListFileType: payload,
      };
    },
    setTimeAxis(state, { payload }) {
      return {
        ...state,
        timeAxis: payload,
      };
    },
    setUserList(state, { payload }) {
      return {
        ...state,
        userList: payload,
      };
    },
    setNodeTodoTask(state, { payload }) {
      return {
        ...state,
        nodeTodoTask: payload,
      };
    },
    setHistoricalByProCode(state, { payload }) {
      return {
        ...state,
        historicalByProCode: payload,
      };
    },
    setInfoList(state, { payload }) {
      return {
        ...state,
        infoList: payload,
      };
    },
    setProcessName(state, { payload }) {
      return {
        ...state,
        processNameList: payload,
      };
    },
    setTaskName(state, { payload }) {
      return {
        ...state,
        taskNameList: payload,
      };
    },
  },
};
