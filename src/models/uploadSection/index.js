import { message } from 'antd';
import { getFilecutuploadApi } from '@/services/uploadSection';

const model = {
  namespace: 'uploadSection',
  state: {},
  effects: {
    // 上传文件
    *getFilecutuploadReq({ payload }, { call, put }) {
      const res = yield call(getFilecutuploadApi, payload);
      return res;
    },
  },
  reducers: {},
};

export default model;
