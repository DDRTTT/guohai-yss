import { message } from 'antd';
import {
    reqPosition,
} from '@/services/clientManager';

const model = {
    namespace: 'clientManager',
    state: {},
    effects: {
        // 根据 username 查询[我的客户数]
        *getPosition({ payload }, { call, put }) {
            const response = yield call(reqPosition, payload);
            if (response && response.status === 200) {
                return response;
            } else {
                if (response.message) {
                    message.warn(response.message);
                }
            }
        },
    },
    reducers: {},
};

export default model;
