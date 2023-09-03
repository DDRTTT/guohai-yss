import { message } from 'antd';
import { add, update, del, query, getList, getElements, createTable, createField, fieldSubmit, eleChange, getColumn, advancSearch, productElementsQuery, _downloadFile, exportItems, exportAll, checkTableStructure, checkColumn, getDataSourceType } from '@/services/tableStructureManage';
import { downloadFile } from '@/utils/download';

const model = {
  namespace: 'tableStructure',
  state: {},
  effects: {
    * query(_, { call }) {
      const res = yield call(query);
      if (res?.status === 200) {
        return res.data;
      } else {
        message.warn(res?.message);
        return false;
      }
    },
    * getList({ payload }, { call }) {
      const res = yield call(getList, payload);
      if (res?.status === 200) {
        return res.data;
      } else {
        message.warn(res?.message);
        return false;
      }
    },
    * add({ payload }, { call }) {
      const res = yield call(add, payload);
      if (res?.status === 200) {
        return true;
      } else {
        message.warn(res?.message);
        return false
      }
    },
    * update({ payload }, { call }) {
      const res = yield call(update, payload);
      if (res?.status === 200) {
        return true;
      } else {
        message.warn(res?.message);
        return false;
      }
    },
    * del({ payload }, { call }) {
      const res = yield call(del, payload);
      if (res?.status === 200) {
        return true;
      } else {
        message.warn(res?.message);
        return false;
      }
    },
    * getElements(_, { call }) {
      const res = yield call(getElements);
      if (res?.status === 200) {
        return res.data;
      } else {
        message.warn(res?.message);
        return false;
      }
    },
    * createTable({ payload }, { call }) {
      const res = yield call(createTable, payload);
      if (res?.status === 200) {
        return true;
      } else {
        message.warn(res?.message);
        return false;
      }
    },
    * createField({ payload }, { call }) {
      const res = yield call(createField, payload);
      if (res?.status === 200) {
        return res.data;
      } else {
        message.warn(res?.message);
        return false
      }
    },
    * eleChange({ payload }, { call }) {
      const res = yield call(eleChange, payload);
      if (res?.status === 200) {
        return res.data;
      } else {
        message.warn(res?.message);
        return false
      }
    },
    // 批量初始化 提交
    * fieldSubmit({ payload }, { call }) {
      const res = yield call(fieldSubmit, payload);
      if (res?.status === 200) {
        return true
      } else {
        message.warn(res?.message);
        return false
      }
    },
    * getColumn({ payload }, { call }) {
      const res = yield call(getColumn, payload);
      if (res?.status === 200) {
        return res.data;
      } else {
        message.warn(res?.message);
        return false
      }
    },
    * advancSearch({ payload }, { call }) {
      const res = yield call(advancSearch, payload);
      if (res?.status === 200) {
        return res.data;
      } else {
        message.warn(res?.message);
        return false;
      }
    },
    * productElementsQuery({ payload }, { call }) {
      const res = yield call(productElementsQuery, payload);
      if (res?.status === 200) {
        return res.data;
      } else {
        message.warn(res?.message);
        return false
      }
    },
    * _downloadFile({ payload }, { call }) {
      const res = yield call(_downloadFile, payload);
      if (res) {
        downloadFile(res, 'data', 'application/zip');
        return true
      } else {
        message.warn(res?.message || '下载实体文件失败，请稍后再试');
        return false
      }
    },
    *exportItems({ payload }, { call }) {
      return yield call(exportItems, payload);
    },
    *exportAll({}, { call }) {
      return yield call(exportAll);
    },
    * checkTableStructure({ payload }, { call }) {
      const res = yield call(checkTableStructure, payload);
      return res;
    },
    * checkColumn({ payload }, { call }) {
      const res = yield call(checkColumn, payload);
      return res;
    },
    * getDataSourceType({ payload }, { call }) {
    const res = yield call(getDataSourceType, payload);
    return res;
  },
  },
  reducers: {

  },
};

export default model;
