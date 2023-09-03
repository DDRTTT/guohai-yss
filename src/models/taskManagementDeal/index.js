import { message } from 'antd';
import {
  getSysTreeApi,
  getFileDownLoadApi,
  getFileListAbleSortApi,
  getConventionalApi,
  getAutomaticApi,
  getUploadFileRevokeApi,
  getReviewApi,
  getFileRevokeApi,
  getUsersByProAndTaskApi,
  getFileCheckedApi,
  getFileRegisteredApi,
  getTaskPathAddApi,
  getTaskPathEditApi,
  getNoPathTreeApi,
  getTaskPathDeleteApi,
  getFileStateByPathApi,
  getUpdateFilePathApi,
  getCurrentNodeIdByProcessIdsApi,
  updateNeedUseSealOrUseSealApi,
  withStandardCatalogueApi,
} from '@/services/taskManagementDeal';
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
  namespace: 'taskManagementDeal',
  state: {
    tableList: {
      rows: [],
      total: 0,
    },
    saveTreeData: [], // 左侧树
    reviewList: [], //审核意见
    creatorList: [], // 操作用户
    noUsedTreeList: [], // 不适用目录树
    contentOperateLog: {},
  },
  effects: {
    // 获取左侧目录树
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

    // 文件下载
    *getFileDownLoadReq({ payload }, { call, put }) {
      yield call(getFileDownLoadApi, payload);
    },

    // 获取文件列表
    *getFileListAbleSortReq({ payload, callback }, { call, put }) {
      if ('tableList' in payload) {
        yield put({
          type: 'updateTableList',
          payload: {
            tableList: payload.tableList,
          },
        });
        callback && callback();
      } else {
        const res = yield call(getFileListAbleSortApi, payload);
        if (res && res.status === 200) {
          yield put({
            type: 'updateTableList',
            payload: {
              tableList: res.data
                ? res.data
                : {
                    rows: [],
                    total: 0,
                  },
            },
          });
          callback && callback(res);
        } else {
          message.error(res.message);
        }
      }
    },

    // 常规任务提交
    *getConventionalReq({ payload }, { call, put }) {
      const res = yield call(getConventionalApi, payload);
      return res;
    },

    // 归档流程提交
    *getAutomaticReq({ payload }, { call, put }) {
      const res = yield call(getAutomaticApi, payload);
      if (res && res.status === 200) {
        message.success('提交成功~');
      } else {
        message.error(res.message);
      }
    },

    // 删除文件关联关系
    *getUploadFileRevokeReq({ payload, callback }, { call, put }) {
      const res = yield call(getUploadFileRevokeApi, payload);
      if (res && res.status === 200) {
        message.success('删除当前文档成功~');
        callback && callback();
      } else {
        message.error(res.message);
      }
    },

    // 审核意见列表
    *getReviewReq({ payload }, { call, put }) {
      const res = yield call(getReviewApi, payload);
      if (res && res.status === 200) {
        yield put({
          type: 'updateReview',
          payload: {
            reviewList: res.data ? res.data : [],
          },
        });
      } else {
        message.error(res.message);
      }
    },

    // 撤销接口
    *getFileRevokeReq({ payload, callback }, { call }) {
      const res = yield call(getFileRevokeApi, payload);
      if (res && res.status === 200) {
        message.success('撤销当前文档成功~');
        callback && callback();
      } else {
        message.error(res.message);
      }
    },

    // 操作用户
    *getUsersByProAndTaskReq({ payload }, { call, put }) {
      const res = yield call(getUsersByProAndTaskApi, payload);
      yield put({
        type: 'updateCreatorList',
        payload: {
          creatorList: res.data ? res.data : [],
        },
      });
    },

    // 大文件上传前文件名重复检测
    *getFileCheckedReq({ payload }, { call }) {
      const res = yield call(getFileCheckedApi, payload);
      return res;
    },

    // 大文件上传后信息登记
    *getFileRegisteredReq({ payload, callback }, { call }) {
      const res = yield call(getFileRegisteredApi, payload);
      if (res && res.status === 200) {
        callback && callback();
      } else {
        message.error(res.message);
      }
    },

    // 目录树：删除
    *getTaskPathDeleteReq({ payload, callback }, { call }) {
      const res = yield call(getTaskPathDeleteApi, payload);
      if (res && res.status === 200) {
        callback && callback();
      } else {
        message.error(res.message);
      }
    },

    // 目录树：新增
    *getTaskPathAddReq({ payload, callback }, { call }) {
      const res = yield call(getTaskPathAddApi, payload);
      if (res && res.status === 200) {
        callback && callback();
      } else {
        message.error(res.message);
      }
    },

    // 目录树：修改
    *getTaskPathEditReq({ payload, callback }, { call }) {
      const res = yield call(getTaskPathEditApi, payload);
      if (res && res.status === 200) {
        callback && callback();
      } else {
        message.error(res.message);
      }
    },

    /**
     * 获取不适用目录树数据
     * **/
    *getNoPathTreeReq({ payload, callback }, { call, put }) {
      const res = yield call(getNoPathTreeApi, payload);
      if (res && res.status === 200) {
        const data = res.data;
        const noUsedTreeList = data ? handleNewTreeData(cloneDeep(data)) : [];
        yield put({
          type: 'updateNoUsedTreeList',
          payload: {
            noUsedTreeList,
          },
        });
        callback && callback(noUsedTreeList);
      } else {
        message.error(res.message);
      }
    },

    // 判断当前父目录下是否有文件
    *getFileStateByPathReq({ payload }, { call }) {
      const res = yield call(getFileStateByPathApi, payload);
      if (res && res.status === 200) {
        return res;
      } else {
        message.error(res.message);
      }
    },

    // 文件批量迁移到新的目录
    *getUpdateFilePathReq({ payload, callback }, { call }) {
      const res = yield call(getUpdateFilePathApi, payload);
      if (res && res.status === 200) {
        callback && callback(res);
      } else {
        message.error(res.message);
      }
    },

    // 获取流转历史所需的taskId
    *getCurrentNodeIdByProcessIdsReq({ payload, callback }, { call }) {
      const res = yield call(getCurrentNodeIdByProcessIdsApi, payload);
      if (res && res.status === 200) {
        callback && callback(res);
      } else {
        message.error(res.message);
      }
    },

    // 是否用印、是否需要用印
    *updateNeedUseSealOrUseSealReq({ payload, callback }, { call }) {
      const res = yield call(updateNeedUseSealOrUseSealApi, payload);
      if (res && res.status === 200) {
        callback && callback(res);
      } else {
        message.error(res.message);
      }
    },

    *withStandardCatalogueReq({ payload }, { call, put }) {
      const res = yield call(withStandardCatalogueApi, payload);
      if (res?.status === 200) {
        yield put({
          type: 'updateContentOperateLog',
          payload: {
            contentOperateLog: res?.data || {},
          },
        });
      } else {
        message.error(res.message);
      }
    },
  },
  reducers: {
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

    // 审核意见列表
    updateReview(state, { payload }) {
      return {
        ...state,
        reviewList: payload.reviewList,
      };
    },

    // 操作人列表action
    updateCreatorList(state, { payload }) {
      return {
        ...state,
        creatorList: payload.creatorList,
      };
    },

    // 不适用目录树action
    updateNoUsedTreeList(state, { payload }) {
      return {
        ...state,
        noUsedTreeList: payload.noUsedTreeList,
      };
    },

    updateContentOperateLog(state, { payload }) {
      return {
        ...state,
        contentOperateLog: payload.contentOperateLog,
      };
    },
  },
};

export default model;
