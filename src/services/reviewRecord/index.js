import request from '@/utils/request';
import { stringify } from 'qs';

const url = '/yss-lifecycle-flow';
const base = '/ams-base-parameter';

// 数据字典
// export function reqDictsAPI(codeList) {
//     return request(`${base}/datadict/queryInfoByList?codeList=${codeList.toString()}`);
// }

// 系列/产品全称
export function reqProSeries() {
    return request(`${url}/product/review/proSeries/search`);
}

// 评审记录管理列表
export function reqReviewRecord(params) {
    return request(`${url}/productBoard/reviewRecord`, {
        method: 'POST',
        data: params
    })
}

// 评审记录查询列表（包含系列信息和产品信息tabs）
export function reqReviewDetail(params) {
    return request(`${url}/productBoard/reviewDetail?${stringify(params)}`);
}
