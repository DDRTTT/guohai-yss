import { message } from 'antd';
import {
  getSysTreeApi,
  getFileListApi,
  batchDelProExtendArchivedFileApi,
} from '@/services/projectAndSeriesQueryExtends';
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
  namespace: 'projectAndSeriesQueryExtends',
  state: {
    saveTreeData: [],
    tableList: {
      total: 0,
      rows: [],
    },
  },
  effects: {
    // 目录树
    *getSysTreeReq({ payload }, { call, put }) {
      const res = yield call(getSysTreeApi, payload);
      if (res && res.status === 200) {
        const newData = res.data ? handleNewTreeData(cloneDeep(res.data)) : [];
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

    // 获取已归档可继承的文档
    *getFileListReq({ payload }, { call, put }) {
      const res = yield call(getFileListApi, payload);
      if (res && res.status === 200) {
        yield put({
          type: 'updateFileList',
          payload: {
            tableList: res.data
              ? res.data
              : {
                  total: 0,
                  rows: [],
                },
          },
        });
      } else {
        message.error(res.message);
      }
    },

    // 移除继承
    *batchDelProExtendArchivedFileReq({ payload, callback }, { call }) {
      const res = yield call(batchDelProExtendArchivedFileApi, payload);
      callback && callback(res);
    },
  },
  reducers: {
    updateSysTree(state, { payload }) {
      return {
        ...state,
        saveTreeData: payload.saveTreeData,
      };
    },
    updateFileList(state, { payload }) {
      return {
        ...state,
        tableList: payload.tableList,
      };
    },
  },
};

export default model;
