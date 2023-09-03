import { message } from 'antd';
import {
  getUpdateFilePreInspectApi,
  getUpdateFileRegisterApi,
  getFileInfoByFileIdsAndCodeApi,
} from '@/services/documentArchiveFileUpdate';

const model = {
  namespace: 'documentArchiveFileUpdate',
  state: {},
  effects: {
    // 文件上传前置接口
    *getUpdateFilePreInspectReq({ payload }, { call }) {
      const res = yield call(getUpdateFilePreInspectApi, payload);
      return res;
    },

    // 文件上传后置接口
    *getUpdateFileRegisterReq({ payload, callback }, { call }) {
      const res = yield call(getUpdateFileRegisterApi, payload);
      return res;
    },

    // 更新上传后的文件列表
    *getFileInfoByFileIdsAndCodeReq({ payload }, { call }) {
      const res = yield call(getFileInfoByFileIdsAndCodeApi, payload);
      return res;
    },
  },
  reducers: {},
};

export default model;
