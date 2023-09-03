import { stringify } from 'qs';
import request from '@/utils/request';

const uri = '/ams-file-service';
//const uri = '/gl';

// 个人文件列表信息
export async function handleSelectPersonalFileAPI(params) {
  return request(`${uri}/businessArchive/selectPersonalFile`, {
    method: 'POST',
    data: params,
  });
}
// 上传人
export async function handleGetPersonAPI() {
  return request(`/yss-base-admin/user/getperson`);
}
