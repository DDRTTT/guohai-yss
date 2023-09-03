/**
 *Create on 2020/9/24.
 */

import { message } from 'antd';
import {
  // 认领
  handleDealClaimAPI,
  // 委托
  handleDealDelegationAPI,
  // 结束
  handleDealEndAPI,
  // 移交
  handleDealTransferAPI,
  // 退回
  handleDealRejectAPI,
  // 传阅
  handleDealCirculateAPI,
  // 跳过
  handleDealSkipAPI,
  // 可跳过节点查询
  handleDealCanSkipListAPI,
  // 可退回节点查询
  handleQueryCanRejectListAPI,
  // 可委托人列表
  handleQueryDelegationUserListAPI,
  // 批量认领
  batchTaskClaim,
  // 批量委托
  batchTaskEntrust,
  // 批量移交
  batchTaskTransfer,
  // 批量退回
  batchTaskReject,
  // 批量传阅
  batchTaskCirculate,
} from '@/services/moreOperation';

export default {
  namespace: 'moreOperation',
  state: {
    saveList: [],
    // 可跳过节点查询
    skipList: [],
  },
  effects: {
    // 认领
    *handleDealClaim({ payload, callback, action }, { call }) {
      const res = yield call(handleDealClaimAPI, payload);
      if (res && res.status === 200) {
        message.success(`${action}成功`);
        callback && callback();
      } else {
        message.error(res.message);
      }
    },

    // 委托
    *handleDealDelegation({ payload, callback, action }, { call, put }) {
      const res = yield call(handleDealDelegationAPI, payload);
      if (res && res.status === 200) {
        message.success(`${action}成功`);
        callback && callback();
      } else {
        message.error(res.message);
      }
    },

    // 结束
    *handleDealEnd({ payload, callback, action }, { call, put }) {
      const res = yield call(handleDealEndAPI, payload);
      if (res && res.status === 200) {
        message.success(`${action}成功`);
        callback && callback();
      } else {
        message.error(res.message);
      }
    },

    // 移交
    *handleDealTransfer({ payload, callback, action }, { call, put }) {
      const res = yield call(handleDealTransferAPI, payload);
      if (res && res.status === 200) {
        message.success(`${action}成功`);
        callback && callback();
      } else {
        message.error(res.message);
      }
    },

    // 退回
    *handleDealReject({ payload, callback, action }, { call, put }) {
      const res = yield call(handleDealRejectAPI, payload);
      if (res && res.status === 200) {
        message.success(`${action}成功`);
        callback && callback();
      } else {
        message.error(res.message);
      }
    },

    // 传阅
    *handleDealCirculate({ payload, callback, action }, { call, put }) {
      const res = yield call(handleDealCirculateAPI, payload);
      if (res && res.status === 200) {
        message.success(`${action}成功`);
        callback && callback();
      } else {
        message.error(res.message);
      }
    },
    // 跳过
    *handleDealSkip({ payload, callback, action }, { call, put }) {
      const res = yield call(handleDealSkipAPI, payload);
      if (res && res.status === 200) {
        message.success(`${action}成功`);
        callback && callback();
      } else {
        message.error(res.message);
      }
    },

    // 可退回节点列表[{}]
    *handleDealCanSkipList({ payload }, { call, put }) {
      console.log('payload', payload);
      const res = yield call(handleDealCanSkipListAPI, payload);
      if (res && res.status === 200) {
        yield put({
          type: 'setSkipList',
          payload: res.data,
        });
      } else {
        message.error(res.message);
      }
    },
    // 可跳过节点列表[{}]
    *handleQueryCanRejectList({ payload }, { call, put }) {
      console.log('payload', payload);
      const res = yield call(handleQueryCanRejectListAPI, payload);
      if (res && res.status === 200) {
        yield put({
          type: 'saveList',
          payload: res.data,
        });
      } else {
        message.error(res.message);
      }
    },

    // 可委托/移交/传阅   人列表[{}]
    *handleGetUserList(_, { call, put }) {
      const res = yield call(handleQueryDelegationUserListAPI);
      if (res && res.status === 200) {
        yield put({
          type: 'saveList',
          payload: res.data,
        });
      } else {
        message.error(res.message);
      }
    },

    // 批量认领
    *handlerBatchTaskClaim({ payload, callback, action }, { call, put }) {
      const res = yield call(batchTaskClaim, payload);
      if (res && res.status === 200) {
        message.success(`${action}成功`);
        callback && callback();
      } else {
        message.error(res.message);
      }
    },

    // 批量委托
    *handlerBatchTaskEntrust({ payload, callback, action }, { call, put }) {
      const res = yield call(batchTaskEntrust, payload);
      if (res && res.status === 200) {
        message.success(`${action}成功`);
        callback && callback();
      } else {
        message.error(res.message);
      }
    },

    // 批量传阅
    *handlerBatchTaskCirculate({ payload, callback, action }, { call, put }) {
      const res = yield call(batchTaskCirculate, payload);
      if (res && res.status === 200) {
        message.success(`${action}成功`);
        callback && callback();
      } else {
        message.error(res.message);
      }
    },

    // 批量退回
    *handlerBatchTaskReject({ payload, callback, action }, { call, put }) {
      const res = yield call(batchTaskReject, payload);
      if (res && res.status === 200) {
        message.success(`${action}成功`);
        callback && callback();
      } else {
        message.error(res.message);
      }
    },

    // 批量移交
    *handlerBatchTaskTransfer({ payload, callback, action }, { call, put }) {
      const res = yield call(batchTaskTransfer, payload);
      if (res && res.status === 200) {
        message.success(`${action}成功`);
        callback && callback();
      } else {
        message.error(res.message);
      }
    },
  },
  reducers: {
    saveList(state, { payload }) {
      return {
        ...state,
        saveList: payload,
      };
    },
    setSkipList(state, { payload }) {
      return {
        ...state,
        skipList: payload,
      };
    },
  },
};
