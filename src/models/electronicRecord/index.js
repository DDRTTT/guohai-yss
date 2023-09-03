import {
  handleGetTreeAPI,
  handleAddTreeAPI,
  handleEditeTreeAPI,
  handleGetAllTreeAPI,
  handleGetListAPI,
  handleModuleCodeAPI,
  handlePropertyNameAPI,
  handleRemarkAPI,
  handleFileTypeAddAPI,
  handleFileTypeAlterAPI,
  handleAddListAPI,
  handleEditeListAPI,
  handleDeleteListAPI,
  handleNoFileTypeAPI,
  handleTrueRemarksAPI,
  handleWordDictionaryFetchAPI,
} from '@/services/electronicRecord';
import { message } from 'antd';
import { cloneDeep } from 'lodash';

/**
 *处理接口返回的树数据，符合树结构
 *
 * @param {*} data 接口数据
 * @param {*} code
 * @param {*} label
 * @returns
 */
function handleNewTreeData(data, code, label) {
  data.forEach(item => {
    let tempCode = item[code],
      tempLabel = item[label];
    item.key = tempCode;
    item.value = tempCode;
    item.title = tempLabel;
    if (item.children) {
      handleNewTreeData(item.children, code, label);
    }
  });
  return data;
}

//合并数组单元格
function createNewArr(data) {
  return data
    .reduce((result, item) => {
      //首先将moduleCode字段作为新数组result取出
      if (result.indexOf(item.moduleName) < 0) {
        result.push(item.moduleName);
      }
      return result;
    }, [])
    .reduce((result, moduleName) => {
      //将moduleCode相同的数据作为新数组取出，并在其内部添加新字段**rowSpan**
      const children = data.filter(item => item.moduleName === moduleName);
      result = result.concat(
        children.map((item, index) => ({
          ...item,
          rowSpan: index === 0 ? children.length : 0, //将第一行数据添加rowSpan字段
        })),
      );
      return result;
    }, []);
}
export default {
  namespace: 'electronicRecord',
  state: {
    saveTreeData: [],
    saveAllTreeData: [],
    cascadeList: {
      result: [],
      total: 0,
    },
    moduleCodeList: [],
    propertyList: [],
    fileTypeList: [],
    fileTypeListAll: [],
    remarkListAll: [],
    propertyListAll: [],
    remarkList: [],
    saveWordDictionaryFetch: {},
  },

  effects: {
    // 文档类型树分级查询
    *handleGetTreeInfo({ payload }, { call, put }) {
      const response = yield call(handleGetTreeAPI, payload);
      let newData = [];
      if (response && response.status === 200) {
        if (response.data) {
          const data = cloneDeep(response.data);
          newData = handleNewTreeData(data, 'id', 'fileTypeName');
        }
        yield put({
          type: 'saveTreeData',
          payload: newData,
        });
      } else {
        message.warn(response.message);
      }
    },
    // 文档类型树整个
    *handleGetAllTreeInfo({ payload }, { call, put }) {
      const response = yield call(handleGetAllTreeAPI, payload);
      let newData = [];
      if (response && response.status === 200) {
        if (response.data) {
          const data = cloneDeep(response.data);
          newData = handleNewTreeData(data, 'id', 'fileTypeName');
        }
        yield put({
          type: 'saveAllTreeData',
          payload: newData,
        });
      } else {
        message.warn(response.message);
      }
    },
    // 文档类型树子节点查询
    *handleGetTreeNodesInfo({ payload }, { call, put }) {
      const response = yield call(handleGetTreeAPI, payload);
      let newData = [];
      if (response && response.status === 200) {
        if (response.data) {
          const data = cloneDeep(response.data);
          newData = handleNewTreeData(data, 'id', 'fileTypeName');
        }
      }
      return newData;
    },
    // 添加
    *handleAddTreeInfo({ payload }, { call, put }) {
      const response = yield call(handleAddTreeAPI, payload);
      let flag = false;
      if (response && response.status === 200) {
        message.success('操作成功');
        flag = true;
      } else {
        message.warn(response.message);
        flag = false;
      }
      return flag;
    },
    // 修改
    *handleEditeTreeInfo({ payload }, { call, put }) {
      const response = yield call(handleEditeTreeAPI, payload);
      let flag = false;
      if (response && response.status === 200) {
        message.success('操作成功');
        flag = true;
      } else {
        message.warn(response.message);
        flag = false;
      }
      return flag;
    },

    /******************************级联关系*************** */
    // 级联关系列表
    *handleGetListInfo({ payload }, { call, put }) {
      const response = yield call(handleGetListAPI, payload);
      if (response && response.status === 200) {
        let newData = createNewArr(response.data.result);
        yield put({
          type: 'cascadeList',
          payload: { result: newData, total: response.data.total },
        });
      } else {
        message.warn(response.message);
      }
    },
    // 业务模块定义下拉
    *handleGetModuleCodeInfo({ payload }, { call, put }) {
      const response = yield call(handleModuleCodeAPI, payload);
      if (response && response.status === 200) {
        yield put({
          type: 'moduleCodeList',
          payload: response.data,
        });
      } else {
        message.warn(response.message);
      }
    },
    // 业务模块业务属性
    *handleGetPropertyInfo({ payload }, { call, put }) {
      const response = yield call(handlePropertyNameAPI, payload);
      if (response && response.status === 200) {
        // 筛除没有property或propertyName
        const newData = response.data.filter(item => {
          return item.property && item.propertyName;
        });
        if (!payload.moduleCode) {
          yield put({
            type: 'propertyListAll',
            payload: newData,
          });
        } else {
          yield put({
            type: 'propertyList',
            payload: newData,
          });
        }
      } else {
        message.warn(response.message);
      }
      return true;
    },
    // 置空propertyList
    *handleEmptyPropertyList({ payload }, { call, put }) {
      put({
        type: 'propertyList',
        payload: [],
      });
    },
    // 属性业务值
    *handleGetRemarkInfo({ payload }, { call, put }) {
      let response = yield call(handleRemarkAPI, payload);
      if (response && response.status === 200) {
        // 筛除没有valueName或propertyValue的选项
        const newData = response.data.filter(item => {
          return item.valueName && item.propertyValue;
        });
        yield put({
          type: 'remarkList',
          payload: newData,
        });
      } else {
        message.warn(response.message);
      }
      return true;
    },
    // 属性业务值All
    *handleGetRemarkInfoAll({ payload }, { call, put }) {
      let response = yield call(handleRemarkAPI, payload);
      if (response && response.status === 200) {
        // 筛除没有valueName或propertyValue的选项
        const newData = response.data.filter(item => {
          return item.valueName && item.propertyValue;
        });
        yield put({
          type: 'remarkListAll',
          payload: newData,
        });
      } else {
        message.warn(response.message);
      }
      return true;
    },
    // 新增时，关联文件类型
    *handleGetFileTypeInfoADD({ payload }, { call, put }) {
      let response = yield call(handleFileTypeAddAPI, payload);
      if (response && response.status === 200) {
        yield put({
          type: 'fileTypeList',
          payload: response.data,
        });
      } else {
        message.warn(response.message);
      }
    },
    // 新增修改时，关联文件类型
    *handleGetFileTypeInfoADD({ payload }, { call, put }) {
      let response = yield call(handleFileTypeAddAPI, payload);
      if (response && response.status === 200) {
        yield put({
          type: 'fileTypeList',
          payload: response.data,
        });
      } else {
        message.warn(response.message);
      }
    },
    // 关联文件类型，高级搜索中全部选项
    *handleGetFileTypeInfoAlter({ payload }, { call, put }) {
      let response = yield call(handleFileTypeAlterAPI, payload);
      if (response && response.status === 200) {
        yield put({
          type: 'fileTypeListAll',
          payload: response.data,
        });
      } else {
        message.warn(response.message);
      }
    },
    // 查询未建立关系的文件类型
    *handleGetNoFileTypeInfo({ payload }, { call, put }) {
      let response = yield call(handleNoFileTypeAPI, payload);
      if (response && response.status === 200) {
        yield put({
          type: 'fileTypeList',
          payload: response.data,
        });
      } else {
        message.warn(response.message);
      }
      return true;
    },
    // 新增弹框，根据1,2,3目录查出具体remarks
    *handleGetTrueRemarksInfo({ payload }, { call, put }) {
      let response = yield call(handleTrueRemarksAPI, payload);
      let newData;
      if (response && response.status === 200) {
        newData = response.data;
      } else {
        message.warn(response.message);
      }
      return newData;
    },

    // 新增/修改
    *handleAddOrEditeInfo({ payload }, { call, put }) {
      let response;
      if (payload.opType === 'add') {
        response = yield call(handleAddListAPI, payload);
      } else {
        response = yield call(handleEditeListAPI, payload);
      }
      let flag = false;
      if (response && response.status === 200) {
        flag = true;
        message.success('操作成功');
      } else if (response.status === 12345678) {
        message.warn(response.message);
      } else {
        message.warn(response.message);
      }
      return flag;
    },
    // 删除
    *handleDeleteInfo({ payload }, { call, put }) {
      const response = yield call(handleDeleteListAPI, payload);
      let flag = false;
      if (response && response.status === 200) {
        flag = true;
        message.success('操作成功');
      } else {
        message.warn(response.message);
      }
      return flag;
    },
    *handleWordDictionaryFetch({ payload }, { call, put }) {
      let response = yield call(handleWordDictionaryFetchAPI, payload);
      if (response && response.status === 200) {
        yield put({
          type: 'saveWordDictionaryFetch',
          payload: response.data,
        });
      } else {
        message.warn(response.message);
      }
    },
  },

  reducers: {
    saveTreeData(state, { payload }) {
      return {
        ...state,
        saveTreeData: payload,
      };
    },
    saveAllTreeData(state, { payload }) {
      return {
        ...state,
        saveAllTreeData: payload,
      };
    },
    cascadeList(state, { payload }) {
      return {
        ...state,
        cascadeList: payload,
      };
    },
    moduleCodeList(state, { payload }) {
      return {
        ...state,
        moduleCodeList: payload,
      };
    },
    propertyList(state, { payload }) {
      return {
        ...state,
        propertyList: payload,
      };
    },
    propertyListAll(state, { payload }) {
      return {
        ...state,
        propertyListAll: payload,
      };
    },
    remarkList(state, { payload }) {
      return {
        ...state,
        remarkList: payload,
      };
    },
    remarkListAll(state, { payload }) {
      return {
        ...state,
        remarkListAll: payload,
      };
    },
    fileTypeList(state, { payload }) {
      return {
        ...state,
        fileTypeList: payload,
      };
    },
    fileTypeListAll(state, { payload }) {
      return {
        ...state,
        fileTypeListAll: payload,
      };
    },
    saveWordDictionaryFetch(state, { payload }) {
      return {
        ...state,
        saveWordDictionaryFetch: payload,
      };
    },
  },
};
