import { message } from 'antd';
import {
  getUnUseSealFileApi,
  getUpdatedFileApi,
  getUsersByProAndTaskApi,
  getFileNamesApi,
  launchArchiveApi,
  getUploadFileRevokeApi,
  getFileRevokeApi,
  getReviewApi,
  getUploadBeforeCheckedApi,
  getUploadAfterRegisterApi,
} from '@/services/archiveTaskHandleListUploadPrinting';

const model = {
  namespace: 'archiveTaskHandleListUploadPrinting',
  state: {
    successTableList: [], // 待归档文档列表
    successTableListTotal: 0, // 待归档文档列表总数
    failTableList: [], // 失败文档列表
    fileNameList: [],
    creatorList: [],
    taskId: '',
    reviewList: [],
  },
  effects: {
    // 获取待归档文档API - 项目/任务
    *getUnUseSealFileReq({ payload }, { call, put }) {
      const res = yield call(getUnUseSealFileApi, payload);
      if (res && res.status === 200) {
        yield put({
          type: 'updateSuccessTableList',
          payload: {
            successTableList: res.data.rows ? res.data.rows : [],
            successTableListTotal: res.data.total,
            taskId: res.data.taskIdArchive,
          },
        });
        yield put({
          type: 'updateFailTableList',
          payload: {
            failTableList: [],
          },
        });

        return res;
      } else {
        message.error(res.message);
      }
    },

    // 获取待归档文档API - 更新
    *getUpdatedFileReq({ payload }, { call, put }) {
      const res = yield call(getUpdatedFileApi, payload);
      if (res && res.status === 200) {
        yield put({
          type: 'updateSuccessTableList',
          payload: {
            successTableList: res.data.rows ? res.data.rows : [],
            successTableListTotal: res.data.total,
            taskId: res.data.taskIdArchive,
          },
        });
        yield put({
          type: 'updateFailTableList',
          payload: {
            failTableList: [],
          },
        });

        return res;
      } else {
        message.error(res.message);
      }
    },

    // 操作人
    *getUsersByProAndTaskReq({ payload }, { call, put }) {
      const res = yield call(getUsersByProAndTaskApi, payload);
      console.log(res);
      if (res && res.status === 200) {
        yield put({
          type: 'updateCreatorList',
          payload: {
            creatorList: res.data ? res.data : [],
          },
        });
      } else {
        message.error(res.message);
      }
    },

    // 根据项目和任务查询文档的名称下拉
    *getFileNamesReq({ payload }, { call, put }) {
      const res = yield call(getFileNamesApi, payload);
      if (res && res.status === 200) {
        yield put({
          type: 'updateFileNamesList',
          payload: {
            fileNameList: res.data ? res.data : [],
          },
        });
      } else {
        message.error(res.message);
      }
    },

    // 归档文件提交 - 项目/任务
    *launchArchiveReq({ payload }, { call }) {
      const res = yield call(launchArchiveApi, payload);
      return res;
    },

    // 文件删除接口
    *getUploadFileRevokeReq({ payload, callback }, { call }) {
      const res = yield call(getUploadFileRevokeApi, payload);
      if (res && res.status === 200) {
        callback && callback();
      } else {
        message.error(res.message);
      }
    },

    // 文件撤销接口
    *getFileRevokeReq({ payload, callback }, { call }) {
      const res = yield call(getFileRevokeApi, payload);
      if (res && res.status === 200) {
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

    // 大文件上传前文件名重复检测
    *getUploadBeforeCheckedReq({ payload }, { call, put }) {
      const res = yield call(getUploadBeforeCheckedApi, payload);
      if (res && res.status === 200) {
        const { failure = [] } = res.data ? res.data : {};
        yield put({
          type: 'updateFailTableList',
          payload: {
            failTableList: failure,
          },
        });
        return res;
      } else {
        message.error(res.message);
        return false;
      }
    },

    // 大文件上传后信息登记
    *getUploadAfterRegisterReq({ payload }, { call, put }) {
      const res = yield call(getUploadAfterRegisterApi, payload);
      if (res && res.status === 200) {
        const { rows = [], total = 0, taskIdArchive = null, failure = [] } = res.data
          ? res.data
          : {};
        yield put({
          type: 'updateSuccessTableList',
          payload: {
            successTableList: rows,
            successTableListTotal: total,
            taskId: taskIdArchive,
          },
        });
        yield put({
          type: 'updateFailTableList',
          payload: {
            failTableList: failure,
          },
        });
        return res;
      } else {
        message.error(res.message, '请重新上传~');
      }
    },
  },
  reducers: {
    // 成功文档action
    updateSuccessTableList(state, { payload }) {
      const { successTableList, successTableListTotal, taskId } = payload;
      return {
        ...state,
        successTableList,
        successTableListTotal,
        taskId,
      };
    },

    // 失败文档action
    updateFailTableList(state, { payload }) {
      const { failTableList = [], uploadFailureBackInfo = [] } = payload;
      return {
        ...state,
        failTableList: [...failTableList, ...uploadFailureBackInfo] || [],
      };
    },

    // 文档名称下拉列表
    updateFileNamesList(state, { payload }) {
      return {
        ...state,
        fileNameList: payload.fileNameList,
      };
    },

    // 审核意见列表
    updateReview(state, { payload }) {
      return {
        ...state,
        reviewList: payload.reviewList,
      };
    },

    // 操作人下拉框
    updateCreatorList(state, { payload }) {
      return {
        ...state,
        creatorList: payload.creatorList,
      };
    },
  },
};

export default model;
