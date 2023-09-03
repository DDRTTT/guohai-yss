import request from '@/utils/request';
import { stringify } from 'qs';

const uri = `/yss-lifecycle-flow`;

// 获取详情页面数据API
export const detailApi = detailId => request(`${uri}/changeLog/detail?${stringify(detailId)}`);
