import {
  getTableDatasApi,
  provisionAccountNameApi,
  deleteProvisionAccount,
  reviewProvisionAccount,
  getOpeningInstitutionList,
  getProNameAndCodeAPI,
} from '@/services/provisionAccountManagement';

export default {
  namespace: 'provisionAccountManagement',
  effects: {
    // 获取词汇字典数据
    *getTableDatasApi({ payload, callback }, { call }) {
      const response = yield call(getTableDatasApi, payload);
      if (response && response.status === 200) {
        if (callback) callback(response.data);
      }
    },

    // 删除
    *deleteProvisionAccount({ payload, callback }, { call }) {
      const response = yield call(deleteProvisionAccount, payload);
      if (response && response.status === 200) {
        if (callback) callback(response.data);
      }
    },

    // 审核/反审核
    *reviewProvisionAccount({ payload, callback }, { call }) {
      const response = yield call(reviewProvisionAccount, payload);
      if (response && response.status === 200) {
        if (callback) callback(response.data);
      }
    },

    // 获取备付金账号名称
    *provisionAccountNameApi({ payload, callback }, { call }) {
      const response = yield call(provisionAccountNameApi, payload);
      if (response) {
        if (callback) callback(response);
      }
    },

    // 获取开户行下拉选项
    *getOpeningInstitutionList({ payload, callback }, { call }) {
      const response = yield call(getOpeningInstitutionList, payload);
      if (response && response.status === 200) {
        if (callback) callback(response.data);
      }
    },

    // 获取产品全称/代码下拉列表数据
    *getProNameAndCodeAPI({ callback }, { call }) {
      const response = yield call(getProNameAndCodeAPI);
      if (response && response.status === 200) {
        if (callback) callback(response.data);
      }
    },
  },
};
