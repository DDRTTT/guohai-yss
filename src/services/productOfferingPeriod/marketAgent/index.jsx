import { stringify } from 'qs';
import request from '@/utils/request';

// 获取 模板名称
export async function handleGetProductRaisingPeriodAdjustmentFetchAPI(parameter) {
  return request(`/raiseDateAdjustment/taskList`, {
    method: 'POST',
    data: parameter,
  });
}

// 词汇字典
export async function handleWordDictionaryFetchAPI(parameter) {
  return request(`/common/dict/item/search?${stringify(parameter)}`);
}
