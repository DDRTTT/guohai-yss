import request from '@/utils/request';

const url = '/ams-base-contract';

/*
* 模板条款管理列表页接口
*/ 
export const getListApi = params =>
  request(`${url}/clause/queryAll?currentPage=${params.page}&pageSize=${params.pageSize}`,{
    method: 'POST',
    data: {}
  });

export const getTempListApi = params => 
  request(`/ams-file-service/template/getTemplateByLabel`,{
    method: 'POST',
    data: { labelName: params.labelName }
  });

export const deleteItemApi = params => 
  request(`${url}/clause/delete`,{
    method: 'POST',
    data: params.payload
  })


/*
* 模板条款管理查看页接口
*/ 
export const getTableListApi = params =>
  request(`${url}/clause/queryById?currentPage=${params.page}&pageSize=${params.pageSize}`,{
    method: 'POST',
    data: params.data
  });

export const getLabelListApi = () => 
  request(`${url}/directory/getLabelList`);
