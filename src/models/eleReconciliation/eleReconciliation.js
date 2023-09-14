import { message } from 'antd';
import {
  getOrganization,
  getRecRecordType,
  getRecRecordList,
  add,
  detail,
  update,
  del,
  getTableList,
} from '@/services/eleReconciliation';

const model = {
  namespace: 'eleReconciliation',
  state: {},
  effects: {
    // 新增、修改、详情界面，管理人
    *getOrganization({ payload }, { call }) {
      const res = yield call(getOrganization);
      if (res?.status === 200) {
        return res.data;
      } else {
        message.warn(res?.message);
        return false;
      }
    },
    // 新增、修改、详情界面，对账类型
    *getRecRecordType({ payload }, { call }) {
      const res = yield call(getRecRecordType);
      if (res?.status === 200) {
        return res.data;
      } else {
        message.warn(res?.message);
        return false;
      }
    },
    // 新增、修改、详情界面，根据对账类型，返回对应字段集合
    *getRecRecordList({ payload }, { call }) {
      const res = yield call(getRecRecordList, payload.datadictCode);
      if (res?.status === 200) {
        if (res && res.data && Object.values(res.data) && Object.values(res.data).length > 0) {
          return Object.values(res.data)[0];
        } else {
          return [];
        }
      } else {
        message.warn(res?.message);
        return false;
      }
    },
    // 新增，保存
    *add({ payload }, { call }) {
      const res = yield call(add, payload);
      if (res?.status === 200) {
        return true;
      } else {
        message.warn(res?.message);
        return false;
      }
    },
    // 详情
    *detail({ payload }, { call }) {
      const res = yield call(detail, payload.id);
      if (res?.status === 200) {
        return res.data;
      } else {
        message.warn(res?.message);
        return false;
      }
    },
    // 修改，保存
    *update({ payload }, { call }) {
      const res = yield call(update, payload);
      if (res?.status === 200) {
        return true;
      } else {
        message.warn(res?.message);
        return false;
      }
    },
    // 删除
    *del({ payload }, { call }) {
      const res = yield call(del, payload.id);
      if (res?.status === 200) {
        return true;
      } else {
        message.warn(res?.message);
        return false;
      }
    },
    // 列表
    *getTableList({ payload }, { call }) {
      const res = yield call(getTableList, payload);
      if (res?.status === 200) {
        /*
                    {
                        "status": 200,
                        "message": "success",
                        "data": {
                            "total": 2,
                            "rows": [
                                {
                                    "deleted": 0,
                                    "lastEditorId": 0,
                                    "createTime": "2022-05-25 00:00:34",
                                    "creatorId": 0,
                                    "id": "20220525120034000001",
                                    "titleRow": "4",
                                    "lastEditTime": "2022-05-25 00:00:34",
                                    "customId": "1",
                                    "typeCode-value": "余额表",
                                    "typeCode": "02"
                                },
                                {
                                    "deleted": 0,
                                    "lastEditorId": 0,
                                    "createTime": "2022-05-24 16:05:18",
                                    "creatorId": 0,
                                    "id": "20220524160517000001",
                                    "titleRow": "4",
                                    "lastEditTime": "2022-05-24 16:05:18",
                                    "customId": "1",
                                    "typeCode-value": "估值表",
                                    "typeCode": "01"
                                }
                            ]
                        }
                    }
                 */
        return res.data;
      } else {
        message.warn(res?.message);
        return false;
      }
    },
  },
  reducers: {},
};

export default model;
