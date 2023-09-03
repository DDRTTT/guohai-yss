/**
 *Create on 2021/6/16.
 */

const dataSource = [
  {
    id: 1,
    name: '账户开户111111111',
    type: '待办事项',
    content: 'XXX产品托管人XXX账户开户',
    time: '当天',
    method: '站内信',
    frequency: '每天',
    whether: 0,
  },
  {
    id: 2,
    name: '账户开户',
    type: '待办事项',
    content: 'XXX产品托管人XXX账户开户',
    time: '当天',
    method: '站内信',
    frequency: '每天',
    whether: 1,
  },
  {
    id: 3,
    name: '账户开户',
    type: '待办事项',
    content: 'XXX产品托管人XXX账户开户',
    time: '当天',
    method: '站内信',
    frequency: '每天',
    whether: 2,
  },
  {
    id: 4,
    name: '账户开户',
    type: '待办事项',
    content: 'XXX产品托管人XXX账户开户',
    time: '当天',
    method: '站内信',
    frequency: '每天',
    whether: 1,
  },
  {
    id: 5,
    name: '账户开户',
    type: '待办事项',
    content: 'XXX产品托管人XXX账户开户',
    time: '当天',
    method: '站内信',
    frequency: '每天',
    whether: 1,
  },
  {
    id: 6,
    name: '账户开户',
    type: '待办事项',
    content: 'XXX产品托管人XXX账户开户',
    time: '当天',
    method: '站内信',
    frequency: '每天',
    whether: 2,
  },
  {
    id: 7,
    name: '账户开户',
    type: '待办事项',
    content: 'XXX产品托管人XXX账户开户',
    time: '当天',
    method: '站内信',
    frequency: '每天',
    whether: 1,
  },
  {
    id: 8,
    name: '账户开户',
    type: '待办事项',
    content: 'XXX产品托管人XXX账户开户',
    time: '当天',
    method: '站内信',
    frequency: '每天',
    whether: 1,
  },
  {
    id: 9,
    name: '账户开户',
    type: '待办事项',
    content: 'XXX产品托管人XXX账户开户',
    time: '当天',
    method: '站内信',
    frequency: '每天',
    whether: 2,
  },
  {
    id: 10,
    name: '账户开户',
    type: '待办事项',
    content: 'XXX产品托管人XXX账户开户',
    time: '当天',
    method: '站内信',
    frequency: '每天',
    whether: 1,
  },
  {
    id: 11,
    name: '账户开户',
    type: '待办事项',
    content: 'XXX产品托管人XXX账户开户',
    time: '当天',
    method: '站内信',
    frequency: '每天',
    whether: 1,
  },
  {
    id: 12,
    name: '账户开户',
    type: '待办事项',
    content: 'XXX产品托管人XXX账户开户',
    time: '当天',
    method: '站内信',
    frequency: '每天',
    whether: 2,
  },
  {
    id: 13,
    name: '账户开户',
    type: '待办事项',
    content: 'XXX产品托管人XXX账户开户',
    time: '当天',
    method: '站内信',
    frequency: '每天',
    whether: 1,
  },
  {
    id: 14,
    name: '账户开户',
    type: '待办事项',
    content: 'XXX产品托管人XXX账户开户',
    time: '当天',
    method: '站内信',
    frequency: '每天',
    whether: 2,
  },
];
const saveProcessNodeList = [
  {
    name: '立项阶段子流程',
    value: 1,
  },
  {
    name: '立项阶段子流程',
    value: 2,
  },
  {
    name: '立项阶段子流程',
    value: 3,
  },
  {
    name: '立项阶段子流程',
    value: 4,
  },
  {
    name: '立项阶段子流程',
    value: 5,
  },
  {
    name: '立项阶段子流程',
    value: 6,
  },
  {
    name: '立项阶段子流程',
    value: 7,
  },
  {
    name: '立项阶段子流程',
    value: 8,
  },
  {
    name: '立项阶段子流程',
    value: 9,
  },
  {
    name: '立项阶段子流程',
    value: 10,
  },
  {
    name: '立项阶段子流程',
    value: 11,
  },
  {
    name: '立项阶段子流程',
    value: 12,
  },
  {
    name: '立项阶段子流程',
    value: 13,
  },
  {
    name: '立项阶段子流程',
    value: 14,
  },
];

import { Reducer } from 'redux';
import { Effect } from 'dva';
import { AnyAction } from 'redux';
import { message } from 'antd';
import { fetchListAPIAPI, fetchProcessNodeListAPI, queryRemindDataAPI, queryMatterTreeAPI, getMatterByParentIdAPI } from '@/services/messageTodo';

export interface MessageTodoState {
  saveList?: {
    rows: Array<any>;
    total: undefined | number;
  };
  saveProcessNodeList?: any[];
}

export interface MessageTodoModelType {
  namespace: string;
  state: MessageTodoState;
  effects: {
    fetch: Effect;
    fetchProcessNodeList: Effect;
    queryRemindData: Effect;
    queryMatterTree: Effect;
    getParent: Effect;
    getSecondaryMenu: Effect;
  };
  reducers: {
    saveList: Reducer<MessageTodoState>;
    saveProcessNodeList: Reducer<MessageTodoState>;
  };
}

const MessageTodoModel: MessageTodoModelType = {
  namespace: 'messageTodo',
  state: {
    saveList: {
      rows: [],
      total: 0,
    },
    // saveProcessNodeList: [],
    saveProcessNodeList: saveProcessNodeList,
  },
  effects: {
    // 列表
    *fetch({ payload }, { call, put }) {
      // const res = yield call(fetchListAPIAPI, payload);
      // if (res && res.status === 200) {
      yield put({
        type: 'saveList',
        // payload: res.data,
        payload: {
          rows: dataSource,
          total: dataSource.length,
        },
      });
      // } else {
      //   message.error(res.message);
      // }
    },

    // 流程节点列
    *fetchProcessNodeList({ payload }, { call, put }) {
      const res = yield call(fetchProcessNodeListAPI, payload);
      if (res && res.status === 200) {
        yield put({
          type: 'saveProcessNodeList',
          payload: saveProcessNodeList,
        });
      } else {
        message.error(res.message);
      }
    },

    // 提醒策略列表
    *queryRemindData({ payload }, { call, put }) {
      console.log('into model queryRemindData');
      const res = yield call(queryRemindDataAPI, payload);
      if (res?.status === 200) {
        console.log('res0', res.data);
      }
    },

    // 获取事项类型树
    *queryMatterTree(_, { call, put }) {
      console.log('into model tree');
      const res = yield call(queryMatterTreeAPI);
      console.log('intooo', res);
      if (res?.status === 200) {
        console.log(res);
        return res.data;
      }
    },

    // 根据parentId获取子级事项
    *getMatterByParentId({ payload }, { call, put }) {
      const res = yield call(getMatterByParentIdAPI, payload);
      if (res?.status === 200) {
        return res.data
      }
    },

  },
  reducers: {
    saveList(state: MessageTodoState | undefined, { payload }: AnyAction) {
      console.log('payload', payload);
      return {
        ...state,
        saveList: payload,
      };
    },
    saveProcessNodeList(state: MessageTodoState | undefined, { payload }) {
      return {
        ...state,
        saveProcessNodeList: payload,
      };
    },
  },
};

export default MessageTodoModel;
