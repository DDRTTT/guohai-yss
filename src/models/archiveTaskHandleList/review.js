import { message } from 'antd';
import {
  getTableListApi,
  getFileDownLoadApi,
  getReviewApi,
  getProcessAuditApi,
  getAuditNoPassedApi,
  getFileRevokeApi,
  getHandleInfoFileNamesApi,
  getSendReminderApi,
  getFileDeleteHandleApi,
  getFileDeleteNotPassHandleApi,
  getFileDeleteFileDelReasonByFileIdApi,
} from '@/services/archiveTaskHandleList/review';
import { getNginxIP } from '@/services/global';

const appendJs = src => {
  const head = document.head || document.getElementsByTagName('head')[0];
  const script = document.createElement('script');
  script.setAttribute('src', src);
  head.appendChild(script);
};

const model = {
  namespace: 'review',
  state: {
    tableList: {
      total: 0,
      rows: [],
    },
    reviewList: [], // 审核意见
    saveIP: {},
    fileNames: [],
  },
  effects: {
    // table表格
    *getTableListReq({ payload, callback }, { call, put }) {
      const res = yield call(getTableListApi, payload);
      if (res && res.status === 200) {
        yield put({
          type: 'updateTableList',
          payload: {
            tableList: res.data ? res.data : [],
          },
        });
        callback && callback();
      } else {
        message.error(res.message);
      }
    },

    // 文件下载
    *getFileDownLoadReq({ payload }, { call, put }) {
      const res = yield call(getFileDownLoadApi, payload);
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

    // 审核通过
    *getProcessAuditReq({ payload, callback }, { call }) {
      const res = yield call(getProcessAuditApi, payload);
      return res;
    },

    // 审核拒绝
    *getAuditNoPassedReq({ payload, callback }, { call }) {
      const res = yield call(getAuditNoPassedApi, payload);
      return res;
    },

    // 文件撤销
    *getFileRevokeReq({ payload, callback }, { call, put }) {
      const res = yield call(getFileRevokeApi, payload);
      if (res && res.status === 200) {
        message.success('文档撤销成功~');
        callback && callback(res);
      } else {
        message.error(res.message);
      }
    },

    // 获取IP
    *handleGetNginxIP({ payload }, { call, put }) {
      const res = yield call(getNginxIP, payload);
      if (res && res.status === 200) {
        yield put({
          type: 'saveIP',
          payload: res.data,
        });
        appendJs(res.data.jsApi);
      }
    },

    // 文档名称
    *getHandleInfoFileNamesReq({ payload }, { call, put }) {
      const res = yield call(getHandleInfoFileNamesApi, payload);
      if (res && res.status === 200) {
        yield put({
          type: 'updateFileNames',
          payload: {
            fileNames: res.data ? res.data : [],
          },
        });
      } else {
        message.error(res.message);
      }
    },

    // 待审核文档 催办
    *getSendReminderReq({ payload }, { call }) {
      const res = yield call(getSendReminderApi, payload);
      if (res && res.status === 200) {
        message.success('催办成功~');
      } else {
        message.error(res.message);
      }
    },

    *getFileDeleteHandleReq({ payload }, { call }) {
      const res = yield call(getFileDeleteHandleApi, payload);
      return res;
    },

    *getFileDeleteNotPassHandleReq({ payload }, { call }) {
      const res = yield call(getFileDeleteNotPassHandleApi, payload);
      return res;
    },

    *getFileDeleteFileDelReasonByFileIdReq({ payload, callback }, { call }) {
      const res = yield call(getFileDeleteFileDelReasonByFileIdApi, payload);
      if (res && res.status === 200) {
        callback(res);
      } else {
        message.error(res.message);
      }
    },
  },

  reducers: {
    // 表格
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

    // 获取IP
    saveIP(state, { payload }) {
      return {
        ...state,
        saveIP: payload,
      };
    },

    // 文档名称
    updateFileNames(state, { payload }) {
      return {
        ...state,
        fileNames: payload.fileNames,
      };
    },
  },
};

export default model;
