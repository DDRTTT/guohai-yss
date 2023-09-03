import {
  handleGetFlowNodeAPI,
  handleGetAttrListAPI,
  handleAddControllInfoAPI,
  handleSubmitAPI,
  handleWordDictionaryFetchAPI,
  handleGetFlowInfoByIdAPI,
  handleAuthorityAPI,
} from '@/services/flow';
import { message } from 'antd';

export default {
  namespace: 'flow',
  state: {
    saveFlowNodeMsg: [],
    saveFlowStageMsg: [],
    saveFlowCommonMsg: [],
    saveFlowAttrMsg: [],
    saveOriginMsg: [],
    saveWordDictionaryFetch: {},
    saveAuthorityProduct: [],
    saveFlowInfo: { id: '', proCode: '', lifecycleNode: '' },
  },
  effects: {
    // 所有信息
    *handleGetAttrListMsg({ payload }, { call, put }) {
      const response = yield call(handleGetAttrListAPI, payload);
      if (response && response.status === 200) {
        if (response.data.stage && response.data.stage.controlCellList) {
          response.data.stage.controlCellList.forEach(item => {
            item.typeClass = 'stageType';
          });
          yield put({
            type: 'saveFlowStageMsg',
            payload: response.data.stage.controlCellList,
          });
        }
        if (response.data.lifecycleNode && response.data.lifecycleNode.controlCellList) {
          yield put({
            type: 'saveFlowNodeMsg',
            payload: response.data.lifecycleNode.controlCellList,
          });
        }
        if (response.data.lifecycleNode && response.data.lifecycleNode.controlAttrList) {
          yield put({
            type: 'saveFlowAttrMsg',
            payload: response.data.lifecycleNode.controlAttrList,
          });
        }
        if (response.data.common && response.data.common.controlCellList) {
          yield put({
            type: 'saveFlowCommonMsg',
            payload: response.data.lifecycleNode.controlCellList,
          });
        }
        if (response.data.origin && response.data.origin.controlAttrList) {
          yield put({
            type: 'saveOriginMsg',
            payload: response.data.origin.controlAttrList,
          });
        }
      } else {
        message.warn(response.message);
      }
    },

    // 添加
    *handleAddControllInfo({ payload }, { call, put }) {
      const response = yield call(handleAddControllInfoAPI, payload);
      if (response && response.status === 200) {
        message.success('添加成功');
      } else {
        message.error(response.message);
      }
    },
    // 提交
    *handleSubmitControllInfo({ payload }, { call, put }) {
      const response = yield call(handleSubmitAPI, payload);
      let flag = true;
      if (response && response.status === 200) {
        if (payload.uri === 'submitProcessTree') {
          message.success('提交成功');
        } else {
          message.success('保存成功');
        }
        flag = true;
      } else {
        message.error(response.message);
        flag = false;
      }
      return flag;
    },
    // 产品类型
    *handleWordDictionaryFetch({ payload }, { call, put }) {
      const response = yield call(handleWordDictionaryFetchAPI, payload);
      if (response && response.status === 200) {
        yield put({
          type: 'saveWordDictionaryFetch',
          payload: response.data,
        });
      } else {
        message.warn(response.message);
      }
    },

    // 权限产品
    *handleAuthorityProduct({ payload }, { call, put }) {
      const response = yield call(handleAuthorityAPI, payload);
      if (response && response.status === 200) {
        yield put({
          type: 'saveAuthorityProduct',
          payload: response.data,
        });
      } else {
        message.warn(response.message);
      }
    },

    // 根据id查询信息
    *handleGetFlowInfo({ payload }, { call, put }) {
      const response = yield call(handleGetFlowInfoByIdAPI, payload);
      if (response && response.status === 200) {
        // nodeData中的id和elementId互换
        response.data.nodeData.forEach(item => {
          let temp;
          temp = item.elementId;
          item.elementId = item.id;
          item.id = temp;
        });
        const newVisoData = {
          nodeData: response.data.nodeData,
          connectionData: response.data.connectionData,
          regionConfig: response.data.regionConfig,
        };
        localStorage.setItem('visoData', JSON.stringify(newVisoData));
        yield put({
          type: 'saveFlowInfo',
          payload: response.data,
        });
      }
    },

    *handleEmptyData({ payload }, { call, put }) {
      // const newData = JSON.parse(localStorage.getItem('newData'));
      yield put({
        type: 'saveFlowInfo',
        payload: {
          id: '',
          // proType: newData.proType,
          // proCode: newData.proCode,
          // lifecycleNode: newData.lifecycleNode,
        },
      });
    },
  },
  reducers: {
    saveFlowNodeMsg(state, { payload }) {
      return {
        ...state,
        saveFlowNodeMsg: payload,
      };
    },
    saveFlowStageMsg(state, { payload }) {
      return {
        ...state,
        saveFlowStageMsg: payload,
      };
    },
    saveFlowCommonMsg(state, { payload }) {
      return {
        ...state,
        saveFlowCommonMsg: payload,
      };
    },
    saveFlowAttrMsg(state, { payload }) {
      return {
        ...state,
        saveFlowAttrMsg: payload,
      };
    },
    saveOriginMsg(state, { payload }) {
      return {
        ...state,
        saveOriginMsg: payload,
      };
    },
    saveWordDictionaryFetch(state, { payload }) {
      return {
        ...state,
        saveWordDictionaryFetch: payload,
      };
    },
    saveAuthorityProduct(state, { payload }) {
      return {
        ...state,
        saveAuthorityProduct: payload,
      };
    },
    saveFlowInfo(state, { payload }) {
      return {
        ...state,
        saveFlowInfo: payload,
      };
    },
  },
};
