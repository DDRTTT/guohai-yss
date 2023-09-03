import { message } from 'antd';

export default {
  namespace: 'publicModel',
  state: {
    // 公用的tab选项
    publicTas: 'T001_1',
  },
  reducers: {
    /**
     * 同步公用的tab选项
     */
    setPublicTas(state, { payload }) {
      return {
        ...state,
        publicTas: payload,
      };
    },
  },
  effects: {},
};
