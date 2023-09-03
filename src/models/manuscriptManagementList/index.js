import { message } from 'antd';
import {
  getSysTreeApi,
  getFileListAbleSortApi,
  getFileNameListApi,
  getFileDownLoadApi,
  getDicsByFcodeApi,
  getProjectBaseInfoDetailApi,
} from '@/services/manuscriptManagementList';
import { cloneDeep } from 'lodash';

// 左侧树增处理后台返回数据字段名
function handleNewTreeData(data) {
  data.forEach(item => {
    item.key = item.code;
    item.value = item.code;
    item.title = item.name;
    if (item.children) {
      handleNewTreeData(item.children);
    }
  });
  return data;
}

const model = {
  namespace: 'manuscriptManagementList',
  state: {
    tableList: {
      total: 0,
      rows: [],
    },
    saveTreeData: [], // 左侧树
    awpProType: [],
    proCode: [],
    proName: [],
    fileNameList: [], // 文件名称下拉
    documentStatus: [], // 文档状态
    baseInfo: {},
  },
  effects: {
    // 详情基本信息
    *getProjectBaseInfoDetailReq({ payload }, { call, put }) {
      const res = yield call(getProjectBaseInfoDetailApi, payload);
      if (res && res.status === 200) {
        yield put({
          type: 'updateBaseInfo',
          payload: {
            baseInfo: res.data ? res.data : {},
          },
        });
      } else {
        message.error(res.message);
      }
    },

    // 获取左侧目录树
    *getSysTreeReq({ payload }, { call, put }) {
      const res = yield call(getSysTreeApi, payload);
      if (res && res.status === 200) {
        const newData =
          res.data && res.data.children ? handleNewTreeData(cloneDeep(res.data.children)) : [];
        yield put({
          type: 'updateSysTree',
          payload: {
            saveTreeData: newData,
          },
        });
      } else {
        message.error(res.message);
      }
    },

    // 获取全部文件列表，或者根据左侧选择目录查询文件列表支持排序
    *handleQueryTableReq({ payload, callback }, { call, put }) {
      const res = yield call(getFileListAbleSortApi, payload);
      if (res && res.status === 200) {
        yield put({
          type: 'updateTableList',
          payload: {
            tableList: res.data
              ? res.data
              : {
                  total: 0,
                  rows: [],
                },
          },
        });
        callback && callback();
      } else {
        message.error(res.message);
      }
    },

    // 获取文件名称列表下拉
    *getFileNameListReq({ payload }, { call, put }) {
      const res = yield call(getFileNameListApi, payload);
      if (res && res.status === 200) {
        yield put({
          type: 'updateFileNameList',
          payload: {
            fileNameList: res.data ? res.data : [],
          },
        });
      } else {
        message.error(res.message);
      }
    },

    // 文件下载
    *getFileDownLoadReq({ payload }, { call, put }) {
      yield call(getFileDownLoadApi, payload);
    },

    // 文档状态
    *getDicsDocumentStatusReq({ payload }, { call, put }) {
      const res = yield call(getDicsByFcodeApi, payload);
      yield put({
        type: 'updateDocumentStatus',
        payload: {
          documentStatus: res ? res : [],
        },
      });
    },
  },
  reducers: {
    // 详情基本信息action
    updateBaseInfo(state, { payload }) {
      return {
        ...state,
        baseInfo: payload.baseInfo,
      };
    },

    // 左侧树action
    updateSysTree(state, { payload }) {
      return {
        ...state,
        saveTreeData: payload.saveTreeData,
      };
    },

    // 文件列表action
    updateTableList(state, { payload }) {
      return {
        ...state,
        tableList: payload.tableList,
      };
    },

    // 文件名称下拉
    updateFileNameList(state, { payload }) {
      return {
        ...state,
        fileNameList: payload.fileNameList,
      };
    },

    // 文档状态
    updateDocumentStatus(state, { payload }) {
      return {
        ...state,
        documentStatus: payload.documentStatus,
      };
    },
  },
};

export default model;
