/**
 * request 网络请求工具
 * 更详细的 api 文档: https://github.com/umijs/umi-request
 */
import { extend } from 'umi-request';
import { message } from 'antd';
import { ENCRYPTION, getAuthToken, getSys, MOCK } from '@/utils/session';
import { ENV } from './env';
import { decryptText } from '@/utils/encryption';
import { ENCRYPTED_PASSWORD } from '@/utils/Code';

let tempData;

const codeMessage = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。',
};
/**
 * 异常处理程序
 */
const errorHandler = error => {
  const { response, data } = error;
  if (response && response.status) {
    const errorText = codeMessage[response.status] || response.statusText;
    const { status, url } = response;
    // notification.error({
    //   message: `请求错误 ${status}: ${url}`,
    //   description: errorText,
    // });
    if (data.message && /[\u4e00-\u9fa5]/.test(data.message)) {
      message.error(data.message);
    } else {
      console.log(`请求错误 ${status}: ${url}`, errorText);
    }
  } else if (!response) {
    // notification.error({
    //   description: '您的网络发生异常，无法连接服务器',
    //   message: '网络异常',
    // });
    console.log(`您的网络发生异常，无法连接服务器,网络异常`);
  }

  return response;
};

/**
 * 配置request请求时的默认参数
 */
const prefix = ENV === MOCK ? '/mock/ams' : '/ams';

const request = extend({
  prefix,
  errorHandler, // 默认错误处理
  credentials: 'include', // 默认请求是否带上cookie
});

// get参数转化为路径
function transObjToUrl(params, isFirst){
  let paramsUrl = '';
  let counter = 0;
  for(let key in params){
    const prefix = (isFirst && counter === 0) ? '?' :'&';
    paramsUrl = paramsUrl + prefix + key + '=' + params[key];
    counter++;
  }
  return paramsUrl;
}
// 服务替换及get参数拼写
function urlReplace(url, options){
  let urlNew = '';
  if (url.includes('/dynamicRoute/sysConfig')) {
    urlNew = url.replace(/\/ams/, '');
  } else if(url.includes('/api') || url.includes('/zuul')){
    urlNew = url.replace(/\/ams/, '');
  } else if(url.includes('/boHai')){
    urlNew = url.replace('/ams/boHai', '/boHaiAms/ams');
  } else {
    urlNew = url;
  }

  if(options && (!options.method || options.method === 'get') && options.data){
    // 将参数拼入路径
    urlNew = urlNew + transObjToUrl(options.data,url.indexOf('?') === -1);

    delete options.data;
  }
  return urlNew;
}

request.interceptors.request.use((url, options) => {
  const urlNew = urlReplace(url, options);
  const token = getAuthToken() || '';
  options.headers = {
    ...options.headers,
    Token: token == null ? '' : token,
    Accept: 'application/json;charset=UTF-8',
    Data: new Date().getTime(),
    Sys: getSys() ?? 1,
    SingleId: 1,
    PageUrl: window?.location?.pathname ?? '/',
  };

  return { url: urlNew, options };
});

// response拦截器, 处理response
request.interceptors.response.use(async response => {
  const uri = response.url || response.config.url;
  if (uri.includes('/dynamicRoute/sysConfig')) {
    await response.clone().json();
    return response;
  }
  let tempData = JSON.parse(sessionStorage.getItem('ENCRYPTION')) || {
    data: { responseEncryFlag: false },
  };
  const {
    data: { responseEncryFlag = false, nuEncryUrl = [] },
  } = tempData;

  // 过滤到不需要加密的服务
  const matchUnEncry = nuEncryUrl.some(item => {
    return uri.includes(item);
  });

  if (tempData && JSON.parse(responseEncryFlag) && !matchUnEncry && response.status == 200) {
    try {
      return response
        .clone()
        .text()
        .then(d => JSON.parse(decryptText(d, ENCRYPTED_PASSWORD())));
    } catch (e) {
      return response;
    }
  }
  return response;
});

export default request;
