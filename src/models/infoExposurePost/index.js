import { message } from 'antd';
import {
    reqMyProducts,
} from '@/services/infoExposurePost';

const model = {
    namespace: 'infoExposurePost',
    state: {},
    effects: {
        // 查询[我的产品数]
        *getMyProducts({ payload }, { call, put }) {
            const response = yield call(reqMyProducts, payload);
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
