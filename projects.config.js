module.exports = [
  {
    name: 'processCenter',
    // main: '/processCenter/js/app.js',
    main: 'http://localhost:8082/js/app.js', // 本地
    url: '',
    store: '',
    base: false,
    path: ['/processCenter', '/sysSupport', '/dynamicPage'],
  },
  {
    name: 'multipleCheck',
    dependencies: [
      'http://172.16.11.10:8084/vendors.js',
      'http://172.16.11.10:8084/vendors.css',
      'http://172.16.11.10:8084/index.spa.css',
    ], // 国海测试环境
    main: 'http://172.16.11.10:8084/index.spa.js', // 国海测试环境
    url: '',
    store: '',
    base: false,
    path: ['/multipleCheck'],
  },
  // {
  //   name: 'multipleCheck',
  //   dependencies: [
  //     'http://10.188.3.136:8084/vendors.js',
  //     'http://10.188.3.136:8084/vendors.css',
  //     'http://10.188.3.136:8084/index.spa.css',
  //   ],
  //   main: 'http://10.188.3.136:8084/index.spa.js', // 国海生产环境版本
  //   url: '',
  //   store: '',
  //   base: false,
  //   path: ['/multipleCheck'],
  // },
  {
    name: 'assessment',
    // dependencies: ['http://localhost:8001/assessment/umi.css'],
    // main: 'http://localhost:8001/assessment/umi.js',
    dependencies: ['/assessment/umi.css'],
    main: '/assessment/umi.js',
    url: '',
    store: '',
    base: false,
    path: ['/assessment'],
  },
  {
    name: 'contract',
    //本地ta
    dependencies: ['http://localhost:8001/contract/umi.css'],
    main: 'http://localhost:8001/contract/umi.js',
    //线上
    // dependencies: ['/contract/umi.css'],
    // main: '/contract/umi.js',
    url: '',
    store: '',
    base: false,
    path: ['/contract'],
  },

  // 调度中心项目
  // 调度中心项目--公司环境
  {
    name: 'schedulerApp',
    main: 'http://192.168.100.73:6789/scheduler/v2/ui/js/home/index.js',
    url: '',
    store: '',
    base: false,
    path: ['/dispatch'],
  },
  // 调度中心项目--国海现场测试环境
  // {
  //   name: 'schedulerApp',
  //   main: 'http://172.16.11.20:6789/scheduler/v2/ui/js/home/index.js',
  //   url: '',
  //   store: '',
  //   base: false,
  //   path: ['/dispatch'],
  // },
  // 调度中心项目--国海现场生产环境
  // {
  //   name: 'schedulerApp',
  //   main: 'http://10.188.3.141:6789/scheduler/v2/ui/js/home/index.js',
  //   url: '',
  //   store: '',
  //   base: false,
  //   path: ['/dispatch'],
  // },

  // 数据中心项目
  // 数据中心项目--公司环境
  {
    name: 'dataSource',
    dependencies: [
      'http://192.168.100.157:8282/dataSource/vendors.js',
      'http://192.168.100.157:8282/dataSource/vendors.css',
      'http://192.168.100.157:8282/dataSource/index.spa.css',
    ],
    main: 'http://192.168.100.157:8282/dataSource/index.spa.js',
    url: '',
    store: '',
    base: false,
    path: ['/dataSource'],
  },
  // 数据中心项目--国海现场测试环境
  // {
  //   name: 'dataSource',
  //   dependencies: [
  //     'http://172.16.11.21:8080/dataSource/vendors.js',
  //     'http://172.16.11.21:8080/dataSource/vendors.css',
  //     'http://172.16.11.21:8080/dataSource/index.spa.css',
  //   ],
  //   main: 'http://172.16.11.21:8080/dataSource/index.spa.js',
  //   url: '',
  //   store: '',
  //   base: false,
  //   path: ['/dataSource'],
  // },
  // 数据中心项目--国海现场生产环境
  // {
  //   name: 'dataSource',
  //   dependencies: [
  //     'http://10.188.3.168:30000/dataSource/vendors.js',
  //     'http://10.188.3.168:30000/dataSource/vendors.css',
  //     'http://10.188.3.168:30000/dataSource/index.spa.css',
  //   ],
  //   main: 'http://10.188.3.168:30000/dataSource/index.spa.js',
  //   url: '',
  //   store: '',
  //   base: false,
  //   path: ['/dataSource'],
  // },

  // 对客服务平台（赢管家）
  {
    name: 'boHaiPOC',
    // dependencies: ['http://192.168.107.138:8001/boHai/umi.css'],
    // main: 'http://192.168.107.138:8001/boHai/umi.js',
    // dependencies: ['http://localhost:8001/boHai/umi.css'],
    // main: 'http://localhost:8001/boHai/umi.js',
    dependencies: ['/boHai/umi.css'],
    main: '/boHai/umi.js',
    url: '',
    store: '',
    base: false,
    path: [
      '/file',
      '/accessBase',
      '/commandManagement',
      '/investorManage',
      '/dataLicense',
      '/testQuestion',
      '/personalCenter',
      '/TAReportService',
      '/reportService',
      '/registrationFiling',
      '/product',
      '/accountdetail',
      '/processManage',
      '/workBench',
      '/productRedemption',
      '/productPurchase',
      '/accountQuery',
      '/commInformManagement',
      '/financialOfferManagement',
      '/financialProducts',
      '/contractConfirmAuthor',
      '/assessment',
      '/informationDisclosure',
      '/Outside',
      '/taskScheduling',
      '/registrationReview',
      '/wechat',
      '/dashboard',
      '/accessContractManage',
    ],
  },
];
