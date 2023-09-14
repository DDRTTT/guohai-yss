import {
  getTableDataListAPI,
  archivesCategoryAPI,
  documentTypeAPI,
  fileTypeAPI,
  preservationAPI,
  getCodeList,
  archivesCenterAPI,
  updateAPI,
  detailsAPI,
  arrangementAPI,
  deleteAPI,
  archivesTreeAPI,
  archivesListAPI,
  menuDeleteAPI,
  menuAddAPI,
} from '@/services/archive';
import { message } from 'antd';

export default {
  namespace: 'archive',
  state: {
    // 档案整理列表数据
    tableDateList: [],
    // 档案大类数据
    archivesCategoryData: [],
    // 文档类型数据
    documentTypeData: [],
    // 文件类型数据
    fileTypeData: [],
    //词汇字典
    codeList: [],
    //档案室
    archivesCenterList: [],
    //档案架
    fileRackList: [],
    // 档案位置
    fileLocationList: [],
    // 档案盒
    fileBoxList: [],
    //档案库树形数据
    archivesTreeData: [],
    //档案库右侧列表数据
    archivesList: []
  },

  effects: {
    // 获取档案整理列表
    *getTableList({ payload }, { call, put }) {
      const response = yield call(getTableDataListAPI, payload);
      if (response && response.status === 200) {
        yield put({
          type: 'setTableList',
          payload: response.data,
        });
      } else {
        message.error('查询失败');
      }
    },
    // 档案大类
    *archivesCategory({ payload }, { call, put }) {
      const response = yield call(archivesCategoryAPI, payload);
      if (response && response.status === 200) {
        yield put({
          type: 'setarchivesCategory',
          payload: response.data,
        });
      } else {
        // message.error('查询失败');
      }
    },
    // 文档类型
    *documentType({ payload }, { call, put }) {
      const response = yield call(documentTypeAPI, payload);
      if (response && response.status === 200) {
        yield put({
          type: 'setdocumentType',
          payload: response.data,
        });
      } else {
        // message.error('查询失败');
      }
    },
    // 文件类型
    *fileType({ payload }, { call, put }) {
      const response = yield call(fileTypeAPI, payload);
      if (response && response.status === 200) {
        yield put({
          type: 'setfileType',
          payload: response.data,
        });
      } else {
        // message.error('查询失败');
      }
    },
    //档案整理保存接口
    *preservation({ payload }, { call, put }) {
      console.log(payload, 'payload')
      const response = yield call(preservationAPI, payload);
      let flag = false;
      if (response && response.status === 200) {
        message.success('保存成功');
        flag = true;
      } else {
        message.error(response.message);
      }
      return { flag };
    },
    //档案整理修改接口
    *update({ payload }, { call, put }) {
      const response = yield call(updateAPI, payload);
      let flag = false;
      if (response && response.status === 200) {
        message.success('保存成功');
        flag = true;
      } else {
        message.error(response.message);
      }
      return { flag };
    },
    //档案整理详情接口
    *details({ payload }, { call, put }) {
      const response = yield call(detailsAPI, payload);
      if (response && response.status === 200) {
      } else {
        message.error('查询失败');
      }
      return { data: response.data };
    },
    // 词汇字典
    *getCodeList({ payload }, { call, put }) {
      const response = yield call(getCodeList, payload);
      if (response && response.status === 200) {
        yield put({
          type: 'setCodeList',
          payload: response.data,
        });
      } else {
        message.error('查询失败');
      }
    },
    // 档案室
    *getArchivesCenter({ payload }, { call, put }) {
      const response = yield call(archivesCenterAPI, payload);
      if (response && response.status === 200) {
        yield put({
          type: 'setArchivesCenter',
          payload: response.data,
        });
      } else {
        // message.error('查询失败');
      }
    },
    // 档案架
    *getFileRack({ payload }, { call, put }) {
      const response = yield call(archivesCenterAPI, payload);
      if (response && response.status === 200) {
        yield put({
          type: 'setFileRack',
          payload: response.data,
        });
      } else {
        // message.error('查询失败');
      }
    },
    // 档案位置
    *getFileLocation({ payload }, { call, put }) {
      const response = yield call(archivesCenterAPI, payload);
      if (response && response.status === 200) {
        yield put({
          type: 'setFileLocation',
          payload: response.data,
        });
      } else {
        // message.error('查询失败');
      }
    },
    // 档案盒
    *getFileBox({ payload }, { call, put }) {
      const response = yield call(archivesCenterAPI, payload);
      if (response && response.status === 200) {
        yield put({
          type: 'setFileBox',
          payload: response.data,
        });
      } else {
        // message.error('查询失败');
      }
    },
    // 档案整理、送批
    *arrangement({ payload }, { call, put }) {
      const response = yield call(arrangementAPI, payload);
      let flag = false;
      if (response && response.status === 200) {
        message.success('操作成功');
        flag = true
      } else {
        mmessage.error(response.message);
      }
      return flag
    },
    // 档案整理、送批
    *delete({ payload }, { call, put }) {
      const response = yield call(deleteAPI, payload);
      let flag = false;
      if (response && response.status === 200) {
        message.success('操作成功');
        flag = true
      } else {
        message.error(response.message);
      }
      return flag
    },
    // 档案库树形数据
    *getArchivesTree({ payload }, { call, put }) {
      const response = yield call(archivesTreeAPI, payload);
      let flag = false;
      if (response && response.status === 200) {
        yield put({
          type: 'setArchivesTree',
          payload: response.data,
        });
        flag = true
      } else {
        message.error('查询失败');
      }
      return { flag, data: response.data }
    },
    // 获取档案库列表信息
    *getArchivesList({ payload }, { call, put }) {
      const response = yield call(archivesListAPI, payload);
      if (response && response.status === 200) {
        yield put({
          type: 'setArchivesList',
          payload: response.data,
        });
      } else {
        message.error('查询失败');
      }
    },
    // 档案库菜单新增、修改
    *menuAdd({ payload }, { call, put }) {
      const response = yield call(menuAddAPI, payload);
      let flag = false;
      if (response && response.status === 200) {
        message.success('保存成功');
        flag = true
      } else {
        message.error(response.message);
      }
      return flag
    },
    // 档案库菜单删除
    *menuDelete({ payload }, { call, put }) {
      const response = yield call(menuDeleteAPI, payload);
      let flag = false;
      if (response && response.status === 200) {
        flag = true
      } else {
        message.error(response.message);
      }
      return flag
    },
  },
  reducers: {
    setTableList(state, { payload }) {
      return {
        ...state,
        tableDateList: payload,
      };
    },
    setarchivesCategory(state, { payload }) {
      return {
        ...state,
        archivesCategoryData: payload,
      };
    },
    setdocumentType(state, { payload }) {
      return {
        ...state,
        documentTypeData: payload,
      };
    },
    setfileType(state, { payload }) {
      return {
        ...state,
        fileTypeData: payload,
      };
    },
    setCodeList(state, { payload }) {
      return {
        ...state,
        codeList: payload,
      };
    },
    setArchivesCenter(state, { payload }) {
      return {
        ...state,
        archivesCenterList: payload,
      };
    },
    setFileRack(state, { payload }) {
      return {
        ...state,
        fileRackList: payload,
      };
    },
    setFileLocation(state, { payload }) {
      return {
        ...state,
        fileLocationList: payload,
      };
    },
    setFileBox(state, { payload }) {
      return {
        ...state,
        fileBoxList: payload,
      };
    },
    setArchivesTree(state, { payload }) {
      return {
        ...state,
        archivesTreeData: payload,
      };
    },
    setArchivesList(state, { payload }) {
      return {
        ...state,
        archivesList: payload,
      };
    },
  },
};
