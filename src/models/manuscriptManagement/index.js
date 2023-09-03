import { message } from 'antd';
import {
  getDicsByFcodeApi,
  getProjectBaseInfoApi,
  getProjectInfoListApi,
  submitWpDictDeliverApi,
  submitWpItemUpdateApi,
  submitFileApi,
  submitWpDictDeliverOosApi,
  submitWpFileUploadWithoutDictApi,
  getProcodeInfoAPI,
  getWpDictDeliverPreviewApi,
  getWpFileUploadPreviewApi,
  getWpDictDeliverOosPreviewApi,
  getWpFileUploadWithoutDictPreviewApi,
} from '@/services/manuscriptManagement';
import { cloneDeep } from 'lodash';

function handleNewTreeData(data) {
  const dfs = function(arr, parentId = '') {
    for (let i = 0; i < arr.length; i++) {
      const id = parentId ? `${parentId}-${i}` : `${i}`;
      arr[i].key = id;
      arr[i].value = id;
      arr[i].title = arr[i].name;
      arr[i].children = arr[i].child;
      delete arr[i].child;
      if (arr[i].children) {
        dfs(arr[i].children, id);
      }
    }
  };
  dfs(data, '');
  return data;
}

const model = {
  namespace: 'manuscriptManagement',
  state: {
    tableList: {
      total: 0,
      rows: [],
    },
    proCode: [], // 项目编码
    awpProType: [], // 项目类型字典
    proDept: [], // 所属部门
    previewInfo: {
      param: {
        apiParam: {},
      },
      wpDict: [],
      pathMap: [],
    },
  },
  effects: {
    // 查询项目基本信息列表API
    *getQueryTableReq({ payload }, { call, put }) {
      const res = yield call(getProjectInfoListApi, payload);
      if (res && res.status === 200) {
        yield put({
          type: 'updateTableList',
          payload: res.data
            ? res.data
            : {
                total: 0,
                rows: [],
              },
        });
      } else {
        message.error(res.message);
      }
    },
    // 获取项目类型字典
    *getDictsReq({ payload }, { put, call }) {
      const res = yield call(getDicsByFcodeApi, payload);
      yield put({
        type: 'updateAwpProType',
        payload: {
          awpProType: res ? res : [],
        },
      });
    },
    // 获取项目基本信息接口
    *getProjectBaseInfoReq({ payload }, { put, call }) {
      const res = yield call(getProjectBaseInfoApi, payload);
      if (res && res.status === 200) {
        yield put({
          type: 'updateProjectBaseInfo',
          payload: {
            projectBaseInfo: res.data ? res.data : [],
            ...payload,
          },
        });
      } else {
        message.error(res.message);
      }
    },
    // 获取项目系列编码
    *getProcodeInfoReq({ payload }, { put, call }) {
      const res = yield call(getProcodeInfoAPI, payload);
      if (res?.status === 200) {
        yield put({
          type: 'updateProcodeInfo',
          payload: {
            data: res.data || [],
          },
        });
      } else {
        message.error(res.message);
      }
    },
    // 目录报送
    *submitWpDictDeliverReq({ payload }, { call }) {
      return yield call(submitWpDictDeliverApi, payload);
    },
    // 人员报送
    *submitWpItemUpdateReq({ payload }, { call }) {
      return yield call(submitWpItemUpdateApi, payload);
    },
    // 文件报送提交文件
    *submitFileReq({ payload }, { call }) {
      return yield call(submitFileApi, payload);
    },
    // 底稿范围外项目报送
    *submitWpDictDeliverOosReq({ payload }, { call }) {
      return yield call(submitWpDictDeliverOosApi, payload);
    },
    // 底稿范围外文件报送
    *submitWpFileUploadWithoutDictReq({ payload }, { call }) {
      return yield call(submitWpFileUploadWithoutDictApi, payload);
    },

    // 0：项目报送、1：文件报送、2：底稿范围外项目报送、3：底稿范围外文件报送
    *getReportPreviewReq({ payload }, { call, put }) {
      const map = {
        0: getWpDictDeliverPreviewApi,
        1: getWpFileUploadPreviewApi,
        2: getWpDictDeliverOosPreviewApi,
        3: getWpFileUploadWithoutDictPreviewApi,
      };
      const params = {
        proCode: payload.proCode,
        projectState: payload.projectState,
      };
      const res = yield call(map[payload.reportTypeKey], params);
      if (res?.status === 200) {
        if (res.data.wpDict && res.data.wpDict.length) {
          res.data.wpDict = handleNewTreeData(cloneDeep(res.data.wpDict));
        }
        if (res.data.pathMap && res.data.pathMap.length) {
          res.data.pathMap = handleNewTreeData(cloneDeep(res.data.pathMap));
        }
        yield put({
          type: 'updatePreviewInfo',
          payload: {
            previewInfo: res.data || {},
          },
        });
      } else {
        message.error(res.message);
      }
    },
  },
  reducers: {
    // 项目信息table action
    updateTableList(state, action) {
      return {
        ...state,
        tableList: action.payload,
      };
    },
    // 项目类型action
    updateAwpProType(state, { payload }) {
      return {
        ...state,
        awpProType: payload.awpProType,
      };
    },
    // 项目基本信息action
    updateProjectBaseInfo(state, { payload }) {
      // type:1项目编码;2所属部门
      const projectBaseInfoKey = payload.type === 1 ? 'proCode' : 'proDept';
      return {
        ...state,
        [projectBaseInfoKey]: payload.projectBaseInfo,
      };
    },
    // 项目或系列编码action
    updateProcodeInfo(state, { payload }) {
      return {
        ...state,
        proCode: payload.data,
      };
    },

    updatePreviewInfo(state, { payload }) {
      return {
        ...state,
        previewInfo: payload.previewInfo,
      };
    },
  },
};

export default model;
