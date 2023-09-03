import request from '@/utils/request';
import { stringify } from 'qs';

const uri = '/yss-awp-server';

// 文件列表任务名称下拉
export const getTaskApi = params =>
  request(`${uri}/awp/task/process/fileDelete/fileListTaskNameDown?${stringify(params)}`);

// 文件列表项目名称下拉
export const getProjectApi = params =>
  request(`${uri}/awp/task/process/fileDelete/fileListProNameDown?${stringify(params)}`);

// 文件删除列表
export const getListApi = params => {
  return request(`${uri}/awp/task/process/fileDelete/fileList`, {
    method: 'POST',
    data: params,
  });
};
