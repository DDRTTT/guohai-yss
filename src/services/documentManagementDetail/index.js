import request from '@/utils/request';
import { stringify } from 'qs';

const uri = '/yss-awp-server';

// 获取版本历史记录
export const getFileHistoryApi = params =>
  request(`${uri}/awp/getFileHistory?${stringify(params)}`);
