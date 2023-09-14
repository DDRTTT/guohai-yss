// const uri = 'http://180.167.198.186:17000/'; // 外网:国海开发
// const uri = 'http://180.167.198.186:18001/'; // 外网:国海测试
// const uri = 'http://180.167.198.186:18000/'; // 外网:国海版本
// const uri = 'http://192.168.102.105:18000/'; // 外网:研发开发
// const uri = 'http://192.168.105.47:18000/'; // 外网:研发测试
const uri = 'http://10.10.10.104:18000//'; // 外网:研发测试

export default {
  '/ams': {
    target: uri,
    changeOrigin: true,
    pathRewrite: {
      '/ams': '/ams',
    },
    ws: true,
  },
  //
  //
  // '/ams/yss-contract-server': {
  //   target: 'http://10.10.63.107:18289',
  //   changeOrigin: true,
  //   pathRewrite: {
  //     '/ams/yss-contract-server': '/',
  //   },
  //   ws: true,
  // },

  '/dynamicRoute': {
    target: uri,
    changeOrigin: true,
    pathRewrite: {
      '': '',
    },
    ws: true,
  },
  // 渤海POC使用
  '/boHaiAms': {
    target: 'http://103.85.168.163:30003/', // 产品生命周期开发
    changeOrigin: true,
    pathRewrite: {
      '': '',
    },
  },
  '/ws': {
    target: 'http://192.168.102.105:18003', // 邮储环境网关
    // target: 'http://192.168.103.79:18000/',  // 内网测试
    // target: 'http://219.141.235.67:43000/',  // 内网外网
    changeOrigin: true,
    pathRewrite: {
      '': '',
    },
    ws: true,
  },
  // 数据中心
  '/yapi': {
    target: 'http://192.168.101.84:30180',
    changeOrigin: true,
    pathRewrite: {
      '^/yapi': '',
    },
  },
  // 数据字典网关
  '/v1': {
    target: 'http://open.tlrobot.com/', // 智能搜索代理
    changeOrigin: true,
    pathRewrite: {
      '': '',
    },
  },
  '/ams/api': {
    target: uri,
    changeOrigin: true,
    pathRewrite: {
      '^/ams/api': '/api',
    },
  },
  '/api': {
    target: uri,
    changeOrigin: true,
    pathRewrite: {
      '^/api': '/api',
    },
  },
  '/api/ams': {
    target: uri,
    changeOrigin: true,
    pathRewrite: {
      '^/api/ams': '/ams',
    },
  },
  '/viwereport': {
    target: 'http://192.168.98.209:7711',
    changeOrigin: true,
  },
  '/zuul': {
    target: uri,
    changeOrigin: true,
  },
  '/wechatApp': {
    target: 'http://192.168.103.99:18003',
    changeOrigin: true,
  },
  '/img': {
    target: uri,
    changeOrigin: true,
  },
};
