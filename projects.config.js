const v = sessionStorage.getItem('project_time') || new Date().getTime();

module.exports = [
  {
    name: 'processCenter',
    main: `/processCenter/js/app.js?v=${v}`,
    // main: 'http://localhost:8082/js/app.js', // 本地调试
    url: '',
    store: '',
    base: false,
    path: ['/processCenter', '/sysSupport', '/dynamicPage'],
  },
  //   {
  //     name: 'multipleCheck',
  //     dependencies: [
  //       '/multipleCheck/vendors.js',
  //       '/multipleCheck/vendors.css',
  //       '/multipleCheck/index.spa.css',
  //     ],
  //     main: '/multipleCheck/index.spa.js',
  //     url: '',
  //     store: '',
  //     base: false,
  //     path: ['/multipleCheck'],
  //   },
  // 多路校验项目
  // 多路校验项目--国海现场测试环境
  {
    name: 'multipleCheck',
    dependencies: [
      'http://172.16.11.10:8084/vendors.js',
      'http://172.16.11.10:8084/vendors.css',
      'http://172.16.11.10:8084/index.spa.css',
    ], // 国海测试环境
    main: 'http://172.16.11.10:8084/index.spa.js', // 国海测试环境版本
    url: '',
    store: '',
    base: false,
    path: ['/multipleCheck'],
  },
  // 多路校验项目--国海生产环境
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

  // 调度中心项目
  // 调度中心项目--公司环境
  // {
  //   name: 'schedulerApp',
  //   main: 'http://192.168.100.73:6789/scheduler/v2/ui/js/home/index.js',
  //   url: '',
  //   store: '',
  //   base: false,
  //   path: ['/dispatch'],
  // },
  // 调度中心项目--国海现场测试环境
  {
    name: 'schedulerApp',
    main: 'http://172.16.11.20:6789/scheduler/v2/ui/js/home/index.js',
    url: '',
    store: '',
    base: false,
    path: ['/dispatch'],
  },
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
  // {
  //   name: 'dataSource',
  //   dependencies: [
  //     'http://192.168.100.157:8282/dataSource/vendors.js',
  //     'http://192.168.100.157:8282/dataSource/vendors.css',
  //     'http://192.168.100.157:8282/dataSource/index.spa.css',
  //   ],
  //   main: 'http://192.168.100.157:8282/dataSource/index.spa.js',
  //   url: '',
  //   store: '',
  //   base: false,
  //   path: ['/dataSource'],
  // },
  // 数据中心项目--国海现场测试环境
  {
    name: 'dataSource',
    dependencies: [
      'http://172.16.11.21:8080/dataSource/vendors.js',
      'http://172.16.11.21:8080/dataSource/vendors.css',
      'http://172.16.11.21:8080/dataSource/index.spa.css',
    ],
    main: 'http://172.16.11.21:8080/dataSource/index.spa.js',
    url: '',
    store: '',
    base: false,
    path: ['/dataSource'],
  },
    // 数据中心项目--国海现场生产环境
  // {
  //   name: 'dataSource',
  //   dependencies: [
  //     'http://10.188.3.167:8080/dataSource/vendors.js',
  //     'http://10.188.3.167:8080/dataSource/vendors.css',
  //     'http://10.188.3.167:8080/dataSource/index.spa.css',
  //   ],
  //   main: 'http://10.188.3.167:8080/dataSource/index.spa.js',
  //   url: '',
  //   store: '',
  //   base: false,
  //   path: ['/dataSource'],
  // },
  // {
  //   name: 'awp',
  //   dependencies: ['/awp/umi.css'],
  //   main: 'http://180.167.198.186:18001/awp/umi.js',
  //   url: '',
  //   store: '',
  //   base: false,
  //   path: ['/manuscriptSystem', '/projectManagement', '/manuscriptManagementOperationLog'],
  // },
];
