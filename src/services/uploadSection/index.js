import request from '@/utils/request';

// 大文件上传
export const getFilecutuploadApi = params =>
  request(`/ams-file-service/fileServer/filecutupload`, {
    method: 'POST',
    data: params,
  });
