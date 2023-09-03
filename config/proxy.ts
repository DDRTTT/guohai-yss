// const uri = 'http://180.167.198.186:17000/'; // 外网:国海开发
const uri = 'http://180.167.198.186:18000/'; // 
// const uri = 'http://180.167.198.186:18000/'; // 外网:国海版本验证

export default {
  '/ams': {
    target: uri,
    changeOrigin: true,
    pathRewrite: {
      '/ams': '/ams',
    },
    ws: true,
  },

  '/ams/gl': {
    target: 'http://192.168.129.84:18024',
    changeOrigin: true,
    pathRewrite: {
      '^/ams/gl': '',
    },
  },
  '/ams/zq': {
    target: 'http://192.168.129.83:18086',
    changeOrigin: true,
    pathRewrite: {
      '^/ams/zq': '',
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
  '/ams/dics': {
    target: 'http://192.168.102.105:18016',
    changeOrigin: true,
    pathRewrite: {
      '^/ams/dics': '',
    },
  },
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
