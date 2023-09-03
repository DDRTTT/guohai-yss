import { message } from 'antd';
import {
  getProjectBaseInfoDetailApi,
  getSysTreeApi,
  submitWpFileUploadWithoutDictApi,
} from '@/services/manuscriptManagementSpotCheckReport';
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
  namespace: 'manuscriptManagementSpotCheckReport',
  state: {
    baseInfo: {}, // 详情基本信息
    allSysTreeList: [], // 全部目录树
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
      }
    },
    // 获取全部目录树
    *getSysTreeReq({ payload }, { call, put }) {
      const res = yield call(getSysTreeApi, payload);
      if (res && res.status === 200) {
        const newData = res.data ? handleNewTreeData(cloneDeep(res.data)) : [];
        yield put({
          type: 'updateAllSysTree',
          payload: {
            allSysTreeList: newData,
          },
        });
      } else {
        message.error(res.message);
      }
    },
    // 抽查报送
    *submitWpFileUploadWithoutDictReq({ payload }, { call, put }) {
      const res = yield call(submitWpFileUploadWithoutDictApi, payload);
      if (res && res.status === 200) {
        message.success(res.data);
      } else {
        message.error(res.message);
      }
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
    // 获取全部目录action
    updateAllSysTree(state, { payload }) {
      return {
        ...state,
        allSysTreeList: payload.allSysTreeList,
      };
    },
  },
};

export default model;
