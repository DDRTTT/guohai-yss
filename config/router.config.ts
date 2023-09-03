// 调度
const SchedulingRouter = [
  {
    name: '调度仪表盘',
    path: '/dispatch/home',
  },
  {
    name: '项目管理',
    path: '/dispatch/projects/list',
  },
  {
    name: '资源中心',
    path: '/scheduler/v2/ui',
    routes: [
      {
        name: '文件管理',
        path: 'resource/file',
        component: './subApp',
      },
      {
        name: '调度日历管理',
        path: 'resource/calendar',
        component: './subApp',
      },
      {
        name: '第三方平台管理',
        path: 'resource/platform',
        component: './subApp',
      },
      {
        name: 'UDF资源管理',
        path: 'resource/udf',
        component: './subApp',
      },
      {
        name: 'UDF函数管理',
        path: 'resource/func',
        component: './subApp',
      },
    ],
  },
  {
    name: '数据源中心',
    path: '/dispatch/datasource/list',
  },
  {
    name: '监控中心',
    path: '/scheduler/v2/ui',
    routes: [
      {
        name: 'Master',
        path: 'monitor/servers/master',
        component: './subApp',
      },
      {
        name: 'Worker',
        path: 'monitor/servers/worker',
        component: './subApp',
      },
      {
        name: 'Zookeeper',
        path: 'monitor/servers/zookeeper',
        component: './subApp',
      },
      {
        name: 'DB',
        path: 'monitor/servers/db',
        component: './subApp',
      },
      {
        name: 'Statistics',
        path: 'monitor/servers/statistics',
        component: './subApp',
      },
    ],
  },
  {
    name: '安全中心',
    path: '/dispatch',
    routes: [
      {
        name: '租户管理',
        path: 'security/tenant',
        component: './subApp',
      },
      {
        name: '用户管理',
        path: 'security/users',
        component: './subApp',
      },
      {
        name: '告警组管理',
        path: 'security/warning-groups',
        component: './subApp',
      },
      {
        name: 'Worker分组管理',
        path: 'security/worker-groups',
        component: './subApp',
      },
      {
        name: '队列管理',
        path: 'security/queue',
        component: './subApp',
      },
      {
        name: '令牌管理',
        path: 'security/token',
        component: './subApp',
      },
    ],
  },
];

// 数据中心
const dataCenterRouter = [
  {
    name: '查询服务及数据源',
    path: '/dataSource',
    routes: [
      {
        name: '数据链接',
        path: 'dataConn',
        component: './subApp',
      },
      {
        name: '应用系统名录',
        path: 'system',
        component: './subApp',
      },
      {
        name: '标签管理',
        path: 'label',
        component: './subApp',
      },
      {
        name: '数据视图',
        path: 'tableview',
        component: './subApp',
      },
      {
        name: '数据主题',
        path: 'datamodel',
        component: './subApp',
      },
      {
        name: '标准服务',
        path: 'standardService',
        component: './subApp',
      },
      {
        name: '数据推送',
        path: 'dataPushing',
        component: './subApp',
      },
    ],
  },
];

// 头寸
const PositionRouter = [
  {
    name: '数据权限',
    path: 'basic-service-front/dfbp/basic-service-front',
    component: './subApp',
  },
];

// 报表中心
const ReportWorldRouter = [
  {
    name: '风险准备金明细表(月报)',
    path: 'masterDataManagement/01us4ddgr54dsbam',
    component: './subApp',
  },
  {
    name: '风险准备金明细表(年报)',
    path: 'masterDataManagement/pnig2n37vhhtcy9o',
    component: './subApp',
  },
  {
    name: '风险准备金资产构成情况(月报)',
    path: 'masterDataManagement/8pgkunz2l599uqmb',
    component: './subApp',
  },
  {
    name: '风险准备金资产构成情况(年报)',
    path: 'masterDataManagement/5w3crgycz4drx5bf',
    component: './subApp',
  },
  {
    name: '固有资金资产构成情况',
    path: 'masterDataManagement/vafvja3jrt1bww36',
    component: './subApp',
  },
  {
    name: '风险准备金投资明细',
    path: 'masterDataManagement/qti2qyzp2w0oyxpl',
    component: './subApp',
  },
  {
    name: '固有资金投资明细',
    path: 'masterDataManagement/npmhdldgb1kzbesg',
    component: './subApp',
  },
  {
    name: '固有资金交易明细',
    path: 'masterDataManagement/eaz1x8j32fjuelgf',
    component: './subApp',
  },
  {
    name: '监管与自律措施',
    path: 'masterDataManagement/0utxbc2r79septwr',
    component: './subApp',
  },
  {
    name: '监管与自律措施主体信息',
    path: 'masterDataManagement/k8k979jodphdp92h',
    component: './subApp',
  },
  {
    name: '行政处罚',
    path: 'masterDataManagement/mpdzetiyxfybso02',
    component: './subApp',
  },
  {
    name: '行政处罚主体信息',
    path: 'masterDataManagement/s986u2zmp7qnygeb',
    component: './subApp',
  },
  {
    name: '清算总账户资金明细表',
    path: 'masterDataManagement/rkl0np4rmznrvh41',
    component: './subApp',
  },
  {
    name: '风险准备金专户信息',
    path: 'masterDataManagement/61kdn9fboqllvyoi',
    component: './subApp',
  },
  {
    name: '风险准备金提取明细',
    path: 'masterDataManagement/erun5mt2sj0es5hc',
    component: './subApp',
  },
  {
    name: '风险准备金使用明细',
    path: 'masterDataManagement/31jouldwh39xbkbj',
    component: './subApp',
  },
  {
    name: '风险监测监管表',
    path: 'masterDataManagement/k1qzyoln324lmm3r',
    component: './subApp',
  },
  {
    name: '净资本计算表(月报)',
    path: 'masterDataManagement/0wa57uwa0rp62es4',
    component: './subApp',
  },
  {
    name: '净资本计算表(年报)',
    path: 'masterDataManagement/fsyt04wvxs2h5nck',
    component: './subApp',
  },
  {
    name: '风险资本准备计算表(月报)',
    path: 'masterDataManagement/cwsxl4hgt8etycfs',
    component: './subApp',
  },
  {
    name: '风险控制指标监管表(月报)',
    path: 'masterDataManagement/dqyktzd0weazcbpq',
    component: './subApp',
  },
  {
    name: '风险资本准备计算表(年报)',
    path: 'masterDataManagement/sw8g6p6m1xawz767',
    component: './subApp',
  },
  {
    name: '风险控制指标监管表(年报)',
    path: 'masterDataManagement/xp3odz6lkgwfwqha',
    component: './subApp',
  },
  {
    name: '香港互认基金信息',
    path: 'masterDataManagement/yxuuz6lrv6gkzhmj',
    component: './subApp',
  },
  {
    name: '香港互认基金内地销售情况',
    path: 'masterDataManagement/jtfzsjw158azsn4f',
    component: './subApp',
  },
  {
    name: '数据填报',
    path: 'dataMonitor/workfill',
    component: './subApp',
  },
  {
    name: '组合信息',
    path: 'masterDataManagement/combinationCode',
    component: './subApp',
  },
  {
    name: '基础数据导入日志',
    path: 'masterDataManagement/3idgaeo375w18u9a',
    component: './subApp',
  },
  {
    name: '报表报送',
    path: 'reportingManagement/reportSubmitted',
    component: './subApp',
  },
  {
    name: '报表导出',
    path: 'reportingManagement/reportDerived',
    component: './subApp',
  },
  {
    name: '报表明细',
    path: 'reportingManagement/reportDetails',
    component: './subApp',
  },
  {
    name: '报送文件下载方式',
    path: 'reportingManagement/xuk1f9e0judykeuu',
    component: './subApp',
  },
  {
    name: '基础数据导入日志',
    path: 'checkManagement/basicDataImportLog',
    component: './subApp',
  },
  {
    name: '软性校验结果',
    path: 'checkManagement/softCheckResult',
    component: './subApp',
  },
  {
    name: '生成前校验',
    path: 'checkManagement/preGenerationCheck',
    component: './subApp',
  },
  {
    name: '校验规则管理',
    path: 'checkManagement/1t63zuncrvzj1iav',
    component: './subApp',
  },
  {
    name: '提示类校验管理',
    path: 'checkManagement/8gxnhahwxd4k6nvy',
    component: './subApp',
  },
  {
    name: '报表生成校验结果',
    path: 'checkManagement/bmss2ub50ymrykb2',
    component: './subApp',
  },
  {
    name: 'ETL取数校验结果',
    path: 'checkManagement/7n4exi7ru8momxdi',
    component: './subApp',
  },
  {
    name: 'ETL取数校验指标配置',
    path: 'checkManagement/ryau3ontipu0lzc6',
    component: './subApp',
  },
  {
    name: 'ETL取数校验关系配置',
    path: 'checkManagement/oa2hvxhk38o2g5wz',
    component: './subApp',
  },
  {
    name: '用户管理',
    path: 'authorityManage/newUserManage',
    component: './subApp',
  },
  {
    name: '角色管理',
    path: 'authorityManage/newRoleManage',
    component: './subApp',
  },
  {
    name: '部门管理',
    path: 'authorityManage/departMent',
    component: './subApp',
  },
  {
    name: '系统操作日志',
    path: 'authorityManage/operationLog',
    component: './subApp',
  },
  {
    name: '功能授权',
    path: 'authorityManage/funcAuthorization',
    component: './subApp',
  },
  {
    name: '系统参数管理',
    path: 'authorityManage/systemParameterManage',
    component: './subApp',
  },
  {
    name: '数据字典',
    path: 'authorityManage/dataDictory',
    component: './subApp',
  },
  {
    name: '菜单管理',
    path: 'authorityManage/menuManage2',
    component: './subApp',
  },
  {
    name: '报表部署',
    path: 'authorityManage/1d2ulgelexj3dmra',
    component: './subApp',
  },
  {
    name: '系统日志文件下载',
    path: 'authorityManage/efhsfwbispavd32i',
    component: './subApp',
  },
  {
    name: '任务调度中心',
    path: 'timingTaskManage/TaskCenter',
    component: './subApp',
  },
  {
    name: '场景配置',
    path: 'mailServer/mailConfiguration',
    component: './subApp',
  },
  {
    name: '通知历史',
    path: 'mailServer/myMessage',
    component: './subApp',
  },
  {
    name: '公司信息',
    path: 'masterDataManagement/companyInformation',
    component: './subApp',
  },
  {
    name: '证券信息',
    path: 'masterDataManagement/securitiesInformation',
    component: './subApp',
  },
  {
    name: '证券指标信息',
    path: 'masterDataManagement/securitiesIndexInformation',
    component: './subApp',
  },
  {
    name: '交易对手方',
    path: 'masterDataManagement/counterpartyInformation',
    component: './subApp',
  },
  {
    name: '金融机构',
    path: 'masterDataManagement/financialInstitutions',
    component: './subApp',
  },
  {
    name: '金融机构下属产品',
    path: 'masterDataManagement/financialInstitutionProducts',
    component: './subApp',
  },
  {
    name: '银行净资产',
    path: 'masterDataManagement/bankEquity',
    component: './subApp',
  },
  {
    name: '证劵评级',
    path: 'masterDataManagement/bondRating',
    component: './subApp',
  },
  {
    name: '回购加权利率信息',
    path: 'masterDataManagement/InterestRateInformation',
    component: './subApp',
  },
  {
    name: '持仓信息',
    path: 'masterDataManagement/positionInformation',
    component: './subApp',
  },
  {
    name: '交易信息',
    path: 'masterDataManagement/transactionInformation',
    component: './subApp',
  },
  {
    name: '损益信息',
    path: 'masterDataManagement/profitLossInformation',
    component: './subApp',
  },
  {
    name: '余额信息',
    path: 'masterDataManagement/balanceInformation',
    component: './subApp',
  },
  {
    name: '贷款基本信息',
    path: 'masterDataManagement/loanBasicInformation',
    component: './subApp',
  },
  {
    name: '质押证券',
    path: 'masterDataManagement/pledgedSecurityDetail',
    component: './subApp',
  },
  {
    name: '期货台账',
    path: 'masterDataManagement/futuresAccountDetail',
    component: './subApp',
  },
  {
    name: '组合净值',
    path: 'masterDataManagement/combinedWorthInformation',
    component: './subApp',
  },
  {
    name: '子组合净值',
    path: 'masterDataManagement/subfundNetInformation',
    component: './subApp',
  },
  {
    name: '证券行情',
    path: 'masterDataManagement/stockInformation',
    component: './subApp',
  },
  {
    name: '证券付息日',
    path: 'masterDataManagement/bondPaymentDay',
    component: './subApp',
  },
  {
    name: '产品基本信息',
    path: 'masterDataManagement/basicProductInformation',
    component: './subApp',
  },
  {
    name: '产品分红信息',
    path: 'masterDataManagement/productBonusInformation',
    component: './subApp',
  },
  {
    name: '科目代码配置',
    path: 'masterDataManagement/d8p7euvlc6sc5ha7',
    component: './subApp',
  },
  {
    name: 'TA代码映射',
    path: 'masterDataManagement/taCode',
    component: './subApp',
  },
  {
    name: 'TA份额信息',
    path: 'masterDataManagement/taShareTable',
    component: './subApp',
  },
  {
    name: 'TA账户信息',
    path: 'masterDataManagement/taAccountInformation',
    component: './subApp',
  },
  {
    name: 'TA交易确认',
    path: 'masterDataManagement/taTransactionTable',
    component: './subApp',
  },
  {
    name: 'TA分红信息',
    path: 'masterDataManagement/taBonusTable',
    component: './subApp',
  },
  {
    name: 'TA净值信息',
    path: 'masterDataManagement/taNetTable',
    component: './subApp',
  },
  {
    name: 'TA基金参数',
    path: 'masterDataManagement/taFundTable',
    component: './subApp',
  },
  {
    name: 'TA清盘方案',
    path: 'masterDataManagement/taLiquidationPlan',
    component: './subApp',
  },
  {
    name: '机构和产品交易账户',
    path: 'masterDataManagement/tradingAccountInformation',
    component: './subApp',
  },
  {
    name: '公共文件上传',
    path: 'masterDataManagement/fileUpload',
    component: './subApp',
  },
  {
    name: '客户信息表',
    path: 'masterDataManagement/4lmqc2snm8ecqabc',
    component: './subApp',
  },
  {
    name: '交易确认表',
    path: 'masterDataManagement/1dn74kah3kqirjgf',
    component: './subApp',
  },
  {
    name: '份额表',
    path: 'masterDataManagement/h4dcm8gtma79aopb',
    component: './subApp',
  },
  {
    name: '分红数据表',
    path: 'masterDataManagement/myu70szk09owf5wa',
    component: './subApp',
  },
  {
    name: '销售服务费率表',
    path: 'masterDataManagement/xcjv8f607my73ffc',
    component: './subApp',
  },
  {
    name: '尾随佣金费率表',
    path: 'masterDataManagement/3lw2kvp6b6b54eto',
    component: './subApp',
  },
  {
    name: '行情表',
    path: 'masterDataManagement/akeu345xt42z2e7o',
    component: './subApp',
  },
  {
    name: '基金基本信息表',
    path: 'masterDataManagement/ylehjbs66dykq2fu',
    component: './subApp',
  },
  {
    name: '交易申请表',
    path: 'masterDataManagement/v96z1fodycz869vk',
    component: './subApp',
  },
  {
    name: '统计模板产品数据信息',
    path: 'masterDataManagement/centralBankProductDataInfo',
    component: './subApp',
  },
  {
    name: '市场代码映射',
    path: 'masterDataManagement/marketCode',
    component: './subApp',
  },
  {
    name: '持仓信息',
    path: 'masterDataManagement/positionInformationData',
    component: './subApp',
  },
  {
    name: '交易信息',
    path: 'masterDataManagement/transactionInformationData',
    component: './subApp',
  },
  {
    name: '证券付息日',
    path: 'masterDataManagement/bondPaymentDayData',
    component: './subApp',
  },
  {
    name: '集市层资产映射关系',
    path: 'masterDataManagement/martLayerAssetMapping',
    component: './subApp',
  },
  {
    name: '集市层数据明细',
    path: 'masterDataManagement/marketLayerData',
    component: './subApp',
  },
  {
    name: '公司财务信息',
    path: 'masterDataManagement/companyFinancialInformation',
    component: './subApp',
  },
  {
    name: '资管产品资产负债信息',
    path: 'masterDataManagement/liabilities',
    component: './subApp',
  },
  {
    name: '收益权转让基础资产信息',
    path: 'masterDataManagement/transferOfUsufruct',
    component: './subApp',
  },
  {
    name: '资产证券化产品资产信息',
    path: 'masterDataManagement/assetBacked',
    component: './subApp',
  },
  {
    name: '除回购和拆借外贷款投资信息',
    path: 'masterDataManagement/loanInvestment',
    component: './subApp',
  },
  {
    name: '资管产品资产负债剩余期限情况',
    path: 'masterDataManagement/liabilityRemaining',
    component: './subApp',
  },
  {
    name: '特定目的载体交易对手明细信息',
    path: 'masterDataManagement/counterpartyDetails',
    component: './subApp',
  },
  {
    name: '资管产品终止信息',
    path: 'masterDataManagement/termination',
    component: './subApp',
  },
  {
    name: '非标资产基本信息',
    path: 'masterDataManagement/centralProductsInformation',
    component: './subApp',
  },
  {
    name: '产品剩余期限信息',
    path: 'masterDataManagement/productRemainingInformation',
    component: './subApp',
  },
  {
    name: '交易账户信息',
    path: 'masterDataManagement/r2aa45mvlcfi5wdg',
    component: './subApp',
  },
  {
    name: '产品数据信息',
    path: 'masterDataManagement/associationProductInformation',
    component: './subApp',
  },
  {
    name: '债券违约情况',
    path: 'masterDataManagement/bondDefaultAssociation',
    component: './subApp',
  },
  {
    name: '产品数据信息',
    path: 'masterDataManagement/chinaFoundAssociProductDataInfo',
    component: './subApp',
  },
  {
    name: '交易账户信息',
    path: 'masterDataManagement/rrtdb8gxf1ul7ovu',
    component: './subApp',
  },
  {
    name: '非标资产基本信息',
    path: 'masterDataManagement/g1478dj99xk7pdyy',
    component: './subApp',
  },
  {
    name: '销售商信息',
    path: 'masterDataManagement/j172b78rvsi43s9d',
    component: './subApp',
  },
  {
    name: '联系人',
    path: 'masterDataManagement/yduiijh5n20h6b9r',
    component: './subApp',
  },
  {
    name: '债券违约情况',
    path: 'masterDataManagement/defaultBonds',
    component: './subApp',
  },
  {
    name: '未挂牌上市债券信息',
    path: 'masterDataManagement/ctdh7albd8wq3qqa',
    component: './subApp',
  },
  {
    name: '产品涉诉及扶贫信息',
    path: 'masterDataManagement/f33dkiauq9vl95bu',
    component: './subApp',
  },
  {
    name: '投资关联方证券信息',
    path: 'masterDataManagement/4j53ohsibd2vq7o0',
    component: './subApp',
  },
  {
    name: '股票质押情况',
    path: 'masterDataManagement/0bavdnk4pd5h99kt',
    component: './subApp',
  },
  {
    name: '融资类项目延付本息情况',
    path: 'masterDataManagement/1md4dcv2uli2jxdw',
    component: './subApp',
  },
  {
    name: '业务收入信息',
    path: 'masterDataManagement/businessIncome',
    component: './subApp',
  },
  {
    name: '产品数据信息',
    path: 'masterDataManagement/csrcFispProductDataInfo',
    component: './subApp',
  },
  {
    name: '单一、定向产品交易账户',
    path: 'masterDataManagement/yso3syk8jhr3r96s',
    component: './subApp',
  },
  {
    name: '集合产品交易账户',
    path: 'masterDataManagement/b1j7k4sznztxixa7',
    component: './subApp',
  },
  {
    name: '产品文件信息',
    path: 'masterDataManagement/productInformation',
    component: './subApp',
  },
  {
    name: '关联方信息',
    path: 'masterDataManagement/relevanPartyInfo',
    component: './subApp',
  },
  {
    name: '分级基金信息',
    path: 'masterDataManagement/structuredFundInformation',
    component: './subApp',
  },
  {
    name: '非标资产基本信息',
    path: 'masterDataManagement/csrcFispAssetProductsInfor',
    component: './subApp',
  },
  {
    name: '产品投资比例限制信息',
    path: 'masterDataManagement/productRatioLimitInformation',
    component: './subApp',
  },
  {
    name: '基金经理信息',
    path: 'masterDataManagement/fundManagerInformation',
    component: './subApp',
  },
  {
    name: '产品封闭期信息',
    path: 'masterDataManagement/productClosureInformation',
    component: './subApp',
  },
  {
    name: '产品风险准备金',
    path: 'masterDataManagement/productRiskReserve',
    component: './subApp',
  },
  {
    name: '产品份额折算信息',
    path: 'masterDataManagement/productConversionInformation',
    component: './subApp',
  },
  {
    name: '系统来源信息',
    path: 'masterDataManagement/systemSourceInformation',
    component: './subApp',
  },
  {
    name: '投资者与产品关系',
    path: 'masterDataManagement/investorProductRelationship',
    component: './subApp',
  },
  {
    name: '产品多层嵌套投资信息',
    path: 'masterDataManagement/productInvestmentInformation',
    component: './subApp',
  },
  {
    name: '产品最终投向信息',
    path: 'masterDataManagement/productDestinationInformation',
    component: './subApp',
  },
  {
    name: '土地业务信息',
    path: 'masterDataManagement/landBusinessInformation',
    component: './subApp',
  },
  {
    name: '涉诉情况',
    path: 'masterDataManagement/litigationSituation',
    component: './subApp',
  },
  {
    name: '数据批量导入',
    path: 'masterDataManagement/rt806h8ao3pjnvwv',
    component: './subApp',
  },
  {
    name: '产品数据信息',
    path: 'masterDataManagement/cispProductDataInfo',
    component: './subApp',
  },
  {
    name: '交易账户信息',
    path: 'masterDataManagement/2gnn17l8g7p5lcxc',
    component: './subApp',
  },
  {
    name: '非标资产基本信息',
    path: 'masterDataManagement/cispProductsInformation',
    component: './subApp',
  },
  {
    name: '行使回售权债券信息',
    path: 'masterDataManagement/exerciseBondInformation',
    component: './subApp',
  },
  {
    name: '土地业务信息',
    path: 'masterDataManagement/cispLandBusinessInformation',
    component: './subApp',
  },
  {
    name: '涉诉情况',
    path: 'masterDataManagement/cispLitigationSituation',
    component: './subApp',
  },
  {
    name: '销售商信息',
    path: 'masterDataManagement/lt218nh2daem114z',
    component: './subApp',
  },
  {
    name: '非法人产品信息',
    path: 'masterDataManagement/orderUnincorporatedProducts',
    component: './subApp',
  },
  {
    name: '产品数据信息',
    path: 'masterDataManagement/zhongbaoDengProductDataInfo',
    component: './subApp',
  },
  {
    name: '交易账户信息',
    path: 'masterDataManagement/0ftdrlaaff3o7ccm',
    component: './subApp',
  },
  {
    name: '资产全称与机构代码映射关系',
    path: 'masterDataManagement/mappingRelationshipAssets',
    component: './subApp',
  },
  {
    name: '产品数据信息',
    path: 'masterDataManagement/businessProductDataInfo',
    component: './subApp',
  },
  {
    name: '资管业务日常监测联络表',
    path: 'masterDataManagement/dailyContactBusinessTable',
    component: './subApp',
  },
  {
    name: '不合规产品表',
    path: 'masterDataManagement/nonConformingProductList',
    component: './subApp',
  },
  {
    name: '产品数据信息',
    path: 'masterDataManagement/preserveAssetsProductInfo',
    component: './subApp',
  },
  {
    name: '交易账户信息',
    path: 'masterDataManagement/t3vzet8xwh1zf2gj',
    component: './subApp',
  },
  {
    name: '产品数据信息',
    path: 'masterDataManagement/csrcMonthlyProductDataInfo',
    component: './subApp',
  },
  {
    name: '业务联系人情况',
    path: 'masterDataManagement/businessContacts',
    component: './subApp',
  },
  {
    name: '多维数据表维护页',
    path: 'masterDataManagement/analyzeDataTable',
    component: './subApp',
  },
  {
    name: '产品数据信息',
    path: 'masterDataManagement/8vb3m7lqqb5jvopi',
    component: './subApp',
  },
  {
    name: '交易账户信息',
    path: 'masterDataManagement/fcfv1cjlrkz3m1rb',
    component: './subApp',
  },
  {
    name: '产品数据信息',
    path: 'masterDataManagement/bxpht0xib1av2tfu',
    component: './subApp',
  },
  {
    name: '产品最终投资者信息',
    path: 'masterDataManagement/productEndInvestorInformation',
    component: './subApp',
  },
  {
    name: '销售商保有份额明细表',
    path: 'masterDataManagement/pbst8wsi7su0iqep',
    component: './subApp',
  },
  {
    name: '销售商信息表',
    path: 'masterDataManagement/x9gepfdar1j19g8j',
    component: './subApp',
  },
  {
    name: '交易账户信息',
    path: 'masterDataManagement/ku10dddxizjei5ym',
    component: './subApp',
  },
  {
    name: '模拟场景设定',
    path: 'masterDataManagement/fxr564qx1clepcrw',
    component: './subApp',
  },
  {
    name: '产品开放周期信息',
    path: 'masterDataManagement/n70cqshsny0e81pe',
    component: './subApp',
  },
  {
    name: '产品代销商维护费率信息',
    path: 'masterDataManagement/4yhm14jbzc9lp7cb',
    component: './subApp',
  },
  {
    name: '产品资产评估信息',
    path: 'masterDataManagement/8i569xuw7j7yruc8',
    component: './subApp',
  },
  {
    name: '关联方信息',
    path: 'masterDataManagement/fzh9gsc48qbqrjez',
    component: './subApp',
  },
  {
    name: '标准券折算率信息',
    path: 'masterDataManagement/a300x67bzvzjikyz',
    component: './subApp',
  },
  {
    name: '场外回购质押券信息',
    path: 'masterDataManagement/zd06bgy65avowqhd',
    component: './subApp',
  },
  {
    name: '交易账户信息',
    path: 'masterDataManagement/00abmzasz8epby77',
    component: './subApp',
  },
  {
    name: '证券投资基金估值表_穿透',
    path: 'masterDataManagement/g7flc3nek6vi6hso',
    component: './subApp',
  },
  {
    name: '交易账户信息',
    path: 'masterDataManagement/t87ftrme3u8dyatg',
    component: './subApp',
  },
  {
    name: '产品风险情况',
    path: 'masterDataManagement/djjsyw4gt0pu2vzx',
    component: './subApp',
  },
  {
    name: '产品数据信息',
    path: 'masterDataManagement/gx8diyu96jhvyj4v',
    component: './subApp',
  },
  {
    name: '关联交易信息',
    path: 'masterDataManagement/sqq3vg8fcsrabfz7',
    component: './subApp',
  },
  {
    name: '从业人员信息',
    path: 'masterDataManagement/4ddvqaufxw8f6b2m',
    component: './subApp',
  },
  {
    name: '非标资产基本信息',
    path: 'masterDataManagement/bawod0mr0m02qgv5',
    component: './subApp',
  },
  {
    name: '债券违约情况',
    path: 'masterDataManagement/acqv201v1vop0mv6',
    component: './subApp',
  },
  {
    name: '资金来源（最终）_产品穿透比例',
    path: 'masterDataManagement/pcohasckpbaqx25i',
    component: './subApp',
  },
  {
    name: '整改台账-产品',
    path: 'masterDataManagement/6nu4d6uyfprisj4z',
    component: './subApp',
  },
  {
    name: '服务机构信息',
    path: 'masterDataManagement/h8wf04k4medsm7gd',
    component: './subApp',
  },
  {
    name: '机构信息',
    path: 'masterDataManagement/h22qdns2gmwmey2w',
    component: './subApp',
  },
  {
    name: '产品基础信息表联系人信息',
    path: 'masterDataManagement/gwrv1veu4jfxrvmw',
    component: './subApp',
  },
  {
    name: '产品数据信息',
    path: 'masterDataManagement/mifywi52dzrr16xo',
    component: './subApp',
  },
  {
    name: '投资者与产品关系',
    path: 'masterDataManagement/cngy2nak4mcucd6f',
    component: './subApp',
  },
  {
    name: '低履约保障合约信息',
    path: 'masterDataManagement/4zqtw6e3hro6dn0o',
    component: './subApp',
  },
  {
    name: '产品数据信息',
    path: 'masterDataManagement/d1ffmlcgn7tecpxk',
    component: './subApp',
  },
  {
    name: '基金托管人信息',
    path: 'masterDataManagement/xyxsjp5bedsk1awq',
    component: './subApp',
  },
  {
    name: '债券违约行为信息',
    path: 'masterDataManagement/3sbuqukqc2297qyu',
    component: './subApp',
  },
  {
    name: '运作及份额转让数据信息',
    path: 'masterDataManagement/dq4p65u1ppwjown5',
    component: './subApp',
  },
  {
    name: '产品分红周期信息',
    path: 'masterDataManagement/lkjc01paajxge68g',
    component: './subApp',
  },
  {
    name: '产品分红数据信息',
    path: 'masterDataManagement/i762ftg80vci0w6a',
    component: './subApp',
  },
  {
    name: '报表基本信息',
    path: 'reportingManagement/reportbaseinfoManage',
    component: './subApp',
  },
  {
    name: '报表分组信息',
    path: 'reportingManagement/reportingGrouping',
    component: './subApp',
  },
  {
    name: '报表数据集',
    path: 'reportingManagement/reportdataManagement',
    component: './subApp',
  },
  {
    name: '报表中心',
    path: 'reportingManagement/jyiw83t8m4cwf5e1',
    component: './subApp',
  },
  {
    name: '公司基本信息',
    path: 'masterDataManagement/w16oha0las0krow9',
    component: './subApp',
  },
  {
    name: '公司分支机构信息',
    path: 'masterDataManagement/qjq5rbnqbocv6wjn',
    component: './subApp',
  },
  {
    name: '公司股东信息',
    path: 'masterDataManagement/dof00kn1ykyj59bm',
    component: './subApp',
  },
  {
    name: '公司实际控制人信息',
    path: 'masterDataManagement/dvr034the3oaoc3x',
    component: './subApp',
  },
  {
    name: '公司证照信息',
    path: 'masterDataManagement/b1p415susr3vx3hw',
    component: './subApp',
  },
  {
    name: '公司人员情况',
    path: 'masterDataManagement/kcoeppg7bb9junlv',
    component: './subApp',
  },
  {
    name: '数据报送人员',
    path: 'masterDataManagement/jwiazdl4k2seg1nl',
    component: './subApp',
  },
  {
    name: '公司资产负债表',
    path: 'masterDataManagement/sczkiibbqftgy5qh',
    component: './subApp',
  },
  {
    name: '合并及公司资产负债表',
    path: 'masterDataManagement/lhfba3zrjz8h9xoo',
    component: './subApp',
  },
  {
    name: '公司利润表',
    path: 'masterDataManagement/127qtqs4lc6tw78g',
    component: './subApp',
  },
  {
    name: '合并及公司利润表',
    path: 'masterDataManagement/51m9mfy0oz5c14fo',
    component: './subApp',
  },
  {
    name: '公司现金流量表',
    path: 'masterDataManagement/pdvo35grsx9947t5',
    component: './subApp',
  },
  {
    name: '合并及公司现金流量表',
    path: 'masterDataManagement/8kqls8pqfo4ygxpf',
    component: './subApp',
  },
  {
    name: '公司所有者权益变动表',
    path: 'masterDataManagement/8m31naii957164ve',
    component: './subApp',
  },
  {
    name: '合并所有者权益变动表',
    path: 'masterDataManagement/vpls5trplz4rjlqt',
    component: './subApp',
  },
  {
    name: '收入明细表',
    path: 'masterDataManagement/n98orsdps9k9w5uw',
    component: './subApp',
  },
  {
    name: '业务及管理费明细表',
    path: 'masterDataManagement/qnleww95sjb4q9kb',
    component: './subApp',
  },
  {
    name: '销售费用明细表',
    path: 'masterDataManagement/2mhvgqr5vas5h3ne',
    component: './subApp',
  },
  {
    name: '专业服务费用明细表',
    path: 'masterDataManagement/w2jw9azbzjsnjw65',
    component: './subApp',
  },
  {
    name: '应收应付明细表',
    path: 'masterDataManagement/sbwbf9k3kqmakhka',
    component: './subApp',
  },
  {
    name: '增值税补充信息',
    path: 'masterDataManagement/sglnik96jyonnm1q',
    component: './subApp',
  },
  {
    name: '直销中心资金明细表',
    path: 'masterDataManagement/czjbouh8owiw79zo',
    component: './subApp',
  },
  {
    name: '公司持牌业务信息',
    path: 'masterDataManagement/avbyeigf1vj8ylj8',
    component: './subApp',
  },
];

export default [
  {
    path: '/user',
    component: '../layouts/UserLayout',
    routes: [
      {
        name: '登录',
        path: '/user/login',
        component: './user/login',
      },
    ],
  },
  {
    name: '项目管理',
    path: '/projectManageNew',
    routes: [
      {
        name: '新增项目信息管理',
        path: 'addInformationManagement',
        component: './manuscriptProjectManage/projectInfoManger/addProjectInfo',
      },
      {
        name: '项目信息详情',
        path: 'projectInfoDetail',
        component: './manuscriptProjectManage/projectInfoManger/projectInfoDetail',
      },
      {
        name: '新增项目系列',
        path: 'addProjectSeries',
        component: './manuscriptProjectManage/seriesManage/addProjectSeries',
      },
    ],
  },
  {
    path: '/',
    component: '../layouts/SecurityLayout',
    routes: [
      {
        path: '/',
        redirect: '/workspace',
      },
      {
        path: '/',
        component: '../layouts/BasicLayout',
        routes: [
          {
            name: '我的工作台',
            path: '/workspace',
            component: './workSpace',
          },
          {
            name: '首页',
            path: '/workbench/index',
            component: './subApp',
          },
          {
            name: '应用管理',
            path: '/workbench/applicationManage',
            component: './subApp',
          },
          {
            name: '工作台列表',
            path: '/workbench/workbenchList',
            component: './subApp',
          },
          {
            name: '工作台配置',
            path: '/workbench/workbenchList',
            component: './subApp',
          },
          {
            name: '基础信息',
            path: '/base',
            routes: [
              {
                name: '角色管理',
                path: 'role',
                component: './role',
              },
              {
                name: '词汇字典',
                path: 'wordDictionary',
                component: './wordDictionary',
              },
              {
                name: '新建字典',
                path: 'wordDictionary/add',
                component: './wordDictionary/add',
              },
              {
                name: '查看字典详情',
                path: 'wordDictionary/view',
                component: './wordDictionary/view',
              },
              {
                name: '资源展示',
                path: 'resource',
                component: './resources',
              },
              {
                name: '个性化菜单',
                path: 'personMenu',
                component: './menu',
              },
              {
                name: '许可申请',
                path: 'licenseManagement',
                component: './licenseManagement',
              },
              {
                name: 'ip白名单',
                path: 'licenseManagement/whiteList',
                component: './licenseManagement/whiteList',
              },
              {
                name: '产品中心主页',
                path: 'processCenterHome',
                component: './processCenterHome',
              },
              {
                component: './404',
              },
            ],
          },
          {
            name: '用户管理',
            path: '/datum',
            routes: [
              {
                name: '个人资料',
                path: 'presonalDatum',
                component: './presonalDatum',
              },
              {
                name: '成员管理',
                path: 'memberManagement',
                component: './memberManagement',
              },
              {
                name: '操作权限',
                path: 'memberManagement/edit',
                component: './memberManagement/memberInformationEdit',
              },
              {
                name: '添加成员',
                path: 'memberManagement/add',
                component: './memberManagement/add',
              },
            ],
          },
          {
            name: '权限管理',
            path: '/authority',
            routes: [
              {
                name: '用户权限管理',
                path: 'userManagement',
                component: './userManagement',
              },
              {
                name: '新增用户',
                path: 'userManagement/add',
                component: './userManagement/add',
              },
              {
                name: '查看用户',
                path: 'userManagement/detail',
                component: './userManagement/detail',
              },
              {
                name: '快速授权',
                path: 'userManagement/quickAuthorization',
                component: './userManagement/quickAuthorization',
              },
              {
                name: '角色管理',
                path: 'roleManagement',
                component: './roleManagement',
              },
              {
                name: '新增角色',
                path: 'roleManagement/add',
                component: './roleManagement/add',
              },
              {
                name: '岗位管理',
                path: 'positionManagement',
                component: './positionManagement',
              },
              {
                name: '功能管理',
                path: 'functionManagement',
                component: './functionManagement',
              },
              {
                name: '功能管理',
                path: 'functionManagement/detail',
                component: './functionManagement/detail',
              },
            ],
          },
          {
            name: '日志查询',
            path: '/LogQuery',
            icon: 'solution',
            routes: [
              {
                name: '操作日志',
                path: 'operationLog',
                component: './LogQuery/operationLog',
              },
              {
                name: '自由图表',
                path: 'freeChart',
                component: './LogQuery/freeChart',
              },
              {
                name: '日志列表',
                path: 'logList',
                component: './LogQuery/logList',
              },
              {
                name: '日志详情',
                path: 'logList/logDetails',
                component: './LogQuery/logDetails',
              },
              {
                name: '堆栈日志',
                path: 'stackLog',
                component: './LogQuery/stackLog',
              },
            ],
          },
          {
            name: '流程任务管理',
            path: '/processCenter',
            routes: [
              {
                name: '流程信息查询',
                path: 'processMessage',
                component: './subApp',
              },
              {
                name: '流程任务管理',
                path: 'processAssignment',
                component: './subApp',
              },
              {
                name: '历史任务查看',
                path: 'historyAssignment',
                component: './subApp',
              },
              {
                name: '任务办理',
                path: 'taskDeal',
                component: './subApp',
              },
              {
                name: '流程模板管理',
                path: 'processConfig',
                component: './subApp',
              },
              {
                name: '流程编排',
                path: 'flow',
                component: './flow/index',
              },
              {
                name: '阶段流程配置',
                path: 'flowList',
                component: './flow/list',
              },
              {
                name: '流转历史',
                path: 'processHistory',
                component: './subApp',
              },
              {
                name: '节点详情',
                path: 'processDetail',
                component: './subApp',
              },
            ],
          },
          {
            name: '动态菜单',
            path: '/dynamicPage',
            routes: [
              {
                name: '页面模板',
                path: '/dynamicPage/pages/:dynamicPageId/:dynamicPageTitle/:title',
                component: './subApp',
              },
              {
                name: '应用管理',
                path: '/dynamicPage/params/:dynamicPageTitle/:dynamicPageId/:title',
                component: './subApp',
              },
              {
                name: '工作台',
                path: '/dynamicPage/workpads/:dynamicPageId/:dynamicPageTitle',
                component: './subApp',
              },
            ],
          },
          {
            name: '系统支持',
            path: '/sysSupport',
            routes: [
              {
                name: '页面模板管理',
                path: 'pageTemplate',
                component: './subApp',
              },
              {
                name: '数据管理',
                path: 'dataService',
                routes: [
                  {
                    name: '数据视图管理',
                    path: 'viewDateManagent',
                    component: './subApp',
                  },
                  {
                    name: '数据推送服务',
                    path: 'pushService',
                    component: './subApp',
                  },
                  {
                    name: '数据推送服务编辑',
                    path: 'httpPushService',
                    component: './subApp',
                  },
                  {
                    name: 'http服务类型视图',
                    path: 'dataBaseView',
                    component: './subApp',
                  },
                  {
                    name: '视图详情',
                    path: 'detailData',
                    component: './subApp',
                  },
                  {
                    name: '文件类型视图',
                    path: 'fileView',
                    component: './subApp',
                  },
                  {
                    name: '自定义数据视图',
                    path: 'customView',
                    component: './subApp',
                  },
                  {
                    name: '连接器管理',
                    path: 'connector',
                    component: './subApp',
                  },
                ],
              },
              {
                name: '应用管理',
                path: 'applictionManage',
                component: './subApp',
              },
              {
                name: '参数应用',
                path: 'applictionTemplate',
                component: './subApp',
              },
              {
                name: '流程应用',
                path: 'flowTemplate',
                component: './subApp',
              },
              {
                name: '应用表单',
                path: 'appEditForm',
                component: './subApp',
              },
              {
                name: '工作台管理',
                path: 'workbenchList',
                component: './subApp',
              },
              {
                name: '工作台配置',
                path: 'workbenchSetting',
                component: './subApp',
              },
            ],
          },
          {
            name: '产品生命周期',
            path: '/productLifecycle',
            routes: [
              {
                name: '产品中心主页',
                path: 'processCenterHome',
                component: './processCenterHome',
              },
              {
                name: '流程库指引',
                path: 'processLibraryGuide',
                component: './processLibraryGuide',
              },
              {
                name: '产品评审任务',
                path: 'productReview',
                component: './productReview',
              },
              {
                name: '产品终止',
                path: 'productEnd',
                component: './productEnd',
              },
              {
                name: '产品募集期调整',
                path: 'productOfferingPeriod',
                component: './productOfferingPeriod',
              },
              {
                name: '持有人大会',
                path: 'investorConference',
                component: './investorConference',
              },
              {
                name: '运营参数',
                path: 'sellProductOnline',
                component: './sellProductOnline',
              },
              {
                name: '产品募集结束',
                path: 'raiseOver',
                component: './raiseOver',
              },
              {
                name: '募集公告流程',
                path: 'raiseAnnouncement',
                component: './raiseAnnouncement',
              },
              {
                name: '投资者审查',
                path: 'investorReview',
                component: './investorReview',
              },
              {
                name: '维护销售协议',
                path: 'salesOrganizationMaintenance',
                component: './salesOrganizationMaintenance',
              },
              {
                name: 'OA消息通知',
                path: 'OAprocessDistribute',
                icon: 'hdd',
                routes: [
                  {
                    name: 'OA消息列表',
                    path: 'index',
                    component: './OAprocessDistribute',
                  },
                  {
                    name: 'OA消息详情',
                    path: 'detail',
                    component: './OAprocessDistribute/detail',
                  },
                ],
              },
              {
                name: '账户开户/变更流程',
                path: 'accountOpenProcess',
                component: './accountOpenProcess',
              },
              {
                name: '验资询证函流程（经办人）',
                path: 'capitalVerificationLetter',
                component: './capitalVerificationLetter',
              },
              {
                name: '合同定稿',
                path: 'contractFinalize',
                component: './contractFinalize',
              },
              {
                name: '合同用印',
                path: 'contractSeal',
                component: './contractSeal',
              },
              {
                name: '维护销售渠道',
                path: 'maintainSalesChannels',
                component: './maintainSalesChannels',
              },
              {
                name: '关联方核查',
                path: 'affiliatedVerification',
                component: './affiliatedVerification',
              },
              {
                name: '自有资金参与划款',
                path: 'ownfunds',
                component: './ownfunds',
              },
              {
                name: '单一投资者资金缴付提取',
                path: 'payExtract',
                component: './payExtract',
              },
              {
                name: '交易单元申请',
                path: 'markingUnit',
                component: './markingUnit',
              },
              {
                name: '定期报告',
                path: 'regularReports',
                component: './regularReports',
              },
              {
                name: '债券交易偏离度报备',
                path: 'divergence',
                component: './divergence',
              },
              // 版本环境样式
              {
                name: '债券交易偏离度报备(周报)',
                path: 'divergenceWeekly',
                component: './divergenceWeekly',
              },
              {
                name: '债券交易偏离度报备(周报)',
                path: 'divergenceWeekly',
                component: './divergenceWeekly',
              },
              {
                name: '产品清盘',
                path: 'productLiquidation',
                component: './productLiquidation',
              },
              {
                name: '账户销户',
                path: 'accountPinHouseholds',
                component: './accountPinHouseholds',
              },
              {
                name: '信披流程',
                path: 'messageFlow',
                component: './messageFlow',
              },
              {
                name: '分红流程',
                path: 'bonusFlow',
                component: './bonusFlow',
              },
              {
                name: '投资经理变更',
                path: 'investManagerChange',
                component: './investManagerChange',
              },
              // {
              //   name: '自有资金参与划款',
              //   path: 'ownfunds',
              //   component: './ownfunds',
              // },
              {
                name: '验资流程',
                path: 'capitalVerificationProcess',
                component: './capitalVerificationProcess',
              },
              {
                name: '参数设置',
                path: 'argumentsSet',
                component: './argumentsSet',
              },
              {
                name: '监管要素补录',
                path: 'regulationConstituents',
                component: './regulationConstituents',
              },
              {
                name: '用印登记',
                path: 'useRegistrate',
                routes: [
                  {
                    name: '用印登记',
                    path: 'index',
                    component: './useRegistrate/index',
                  },
                  {
                    name: '查看',
                    path: 'index/OAdetail',
                    component: './useRegistrate/OAdetail',
                  },
                ],
              },
              {
                name: '产品看板',
                path: 'productBillboard',
                routes: [
                  {
                    name: '产品看板',
                    path: 'index',
                    component: './productBillboard',
                  },
                  {
                    name: '产品视图查看页',
                    path: 'productData',
                    component: './productBillboard/productData.jsx',
                  },
                  {
                    name: '系列视图查看页',
                    path: 'seriesData',
                    component: './productBillboard/seriesData.jsx',
                  },
                ],
              },
              {
                name: '开放期参数变更',
                path: 'OpenPeriodParameterChanges',
                component: './OpenPeriodParameterChanges',
              },
              {
                name: '单一业绩报酬计提基准约定书',
                path: 'accredBasisOfPerformancepay',
                component: './accredBasisOfPerformancepay',
              },
            ],
          },
          {
            name: '产品要素库',
            path: 'productData',
            routes: [
              {
                name: '产品要素信息',
                path: 'productInformationBase',
                component: './productInformationBase',
              },
              {
                name: '产品要素项维护',
                path: 'maintain',
                component: './productDataManagement/maintain',
              },
            ],
          },
          {
            name: '产品数据管理',
            path: '/productDataManage',
            routes: [
              {
                name: '评审记录管理',
                path: 'reviewRecord',
                routes: [
                  {
                    name: '评审记录管理',
                    path: 'index',
                    component: './reviewRecord/index',
                  },
                  {
                    name: '评审记录查询',
                    path: 'index/check',
                    component: './reviewRecord/check',
                  },
                ],
              },
              {
                name: '季度资产报告查询',
                path: 'quarterlyAssetReport',
                component: './quarterlyAssetReport/index',
              },
              {
                name: '产品账户台账',
                path: 'accountParameter',
                component: './accountParameter/index',
              },
              {
                name: '备付金账户管理',
                path: 'provisionAccountManagement',
                component: './provisionAccountManagement/index',
              },
              {
                name: '券商_资金账户管理',
                path: 'brokerageCapitalAccount',
                component: './brokerageCapitalAccount/index',
              },
              {
                name: '客户信息管理',
                path: 'clientInformationManage',
                component: './clientInformationManage/index',
              },
              {
                name: '干系人信息管理',
                path: 'stakeholderInfoManager',
                routes: [
                  {
                    name: '干系人信息管理',
                    path: 'index',
                    component: './stakeholderInfoManager/index',
                  },
                  {
                    name: '干系人信息详情',
                    path: 'index/detail',
                    component: './stakeholderInfoManager/detail',
                  },
                  {
                    name: '干系人信息详情',
                    path: 'index/updateInfo',
                    component: './stakeholderInfoManager/updateInfo',
                  },
                ],
              },
              {
                name: '交易单元管理',
                path: 'tradingUnitManager',
                routes: [
                  {
                    name: '交易单元管理',
                    path: 'index',
                    component: './tradingUnitManager/index',
                  },
                  {
                    name: '交易单元管理详情',
                    path: 'index/detail',
                    component: './tradingUnitManager/detail',
                  },
                ],
              },
              {
                name: '信披管理',
                path: 'informationExportManage',
                component: './informationExportManage/index',
              },
              {
                name: '机构信息管理',
                path: 'institutionalInfoManager',
                routes: [
                  {
                    name: '机构信息管理',
                    path: 'index',
                    component: './institutionalInfoManager/index',
                  },
                  {
                    name: '新增机构页',
                    path: 'index/addOrganization',
                    component: './institutionalInfoManager/addOrganization',
                  },
                  {
                    name: '修改页',
                    path: 'index/modify',
                    component: './institutionalInfoManager/modify',
                  },
                  {
                    name: '其他机构查看页',
                    path: 'index/details',
                    component: './institutionalInfoManager/details',
                  },
                  {
                    name: '员工新增页',
                    path: 'index/addEmployees',
                    component: './institutionalInfoManager/addEmployees',
                  },
                ],
              },
              // {
              //   name: '账户信息管理',
              //   path: 'accountManagement',
              //   component: './accountManagement/index',
              // },
              {
                name: '单一客户信息管理',
                path: 'myInvestor',
                component: './investorsManagement',
              },
              {
                name: '新增客户',
                path: 'myInvestor/newInvestor',
                component: './investorsManagement/created',
              },
              {
                name: '新增客户2记得删除',
                path: 'myInvestor/newInvestor2',
                component: './investorsManagement/add',
              },
              {
                name: '批量添加客户',
                path: 'myInvestor/addInBatches',
                component: './investorsManagement/addInBatches',
              },
              {
                name: '查看客户详情',
                path: 'myInvestor/info',
                component: './investorsManagement/info',
              },
              {
                name: '销售机构管理',
                path: 'salesOrgManagement',
                component: './salesOrgManagement',
              },
              {
                name: '销售机构管理新增',
                path: 'salesOrgManagement/add',
                component: './salesOrgManagement/add',
              },
              {
                name: '销售机构管理修改',
                path: 'salesOrgManagement/modify',
                component: './salesOrgManagement/modify',
              },
              {
                name: '销售机构管理详情',
                path: 'salesOrgManagement/details',
                component: './salesOrgManagement/details',
              },
            ],
          },
          {
            name: '实施配置管理',
            path: 'impConfig',
            routes: [
              {
                name: '档案类别管理管理',
                path: 'fileTypeConfig',
                component: './fileTypeConfig',
              },
              {
                name: '级联关系',
                path: 'cascadeConfig',
                component: './cascadeConfig',
              },
            ],
          },
          {
            name: '电子档案管理',
            path: 'electronic',
            routes: [
              {
                name: '文档管理',
                path: 'electronicRecord',
                component: './electronicRecord/index',
              },
              {
                name: '流转记录',
                path: 'electronicRecord/record',
                component: './electronicRecord/record',
              },
              {
                name: '模板条款管理列表',
                path: 'templateClauseManage',
                component: './templateClauseManage/index',
              },
              {
                name: '模板条款管理查看',
                path: 'templateClauseManageCheck',
                component: './templateClauseManage/check',
              },
            ],
          },
          // {
          //   name: '底稿管理',
          //   path: '/manuscriptSystem',
          //   routes: [
          //     {
          //       name: '底稿标准目录配置',
          //       path: 'manuscriptBasic',
          //       component: './subApp',
          //     },
          //     {
          //       name: '底稿标准目录配置设置/查看',
          //       path: 'manuscriptBasic/manuscriptBasicSov',
          //       component: './subApp',
          //     },
          //     {
          //       name: '底稿管理',
          //       path: 'manuscriptManagement',
          //       component: './subApp',
          //     },
          //     {
          //       name: '底稿列表',
          //       path: 'manuscriptManagementList',
          //       component: './subApp',
          //     },
          //     {
          //       name: '项目底稿目录管理',
          //       path: 'manuscriptManage',
          //       component: './subApp',
          //     },
          //     {
          //       name: '项目底稿目录管理详情',
          //       path: 'manuscriptManageDetail',
          //       component: './subApp',
          //     },
          //     {
          //       name: '抽查报送',
          //       path: 'manuscriptManagementSpotCheckReport',
          //       component: './subApp',
          //     },
          //     {
          //       name: '报送结果查询',
          //       path: 'manuscriptManagementReportResult',
          //       component: './subApp',
          //     },
          //   ],
          // },
          // {
          //   name: '项目管理',
          //   path: '/projectManagement',
          //   routes: [
          //     {
          //       name: '项目信息管理',
          //       path: 'informationManagement',
          //       component: './subApp',
          //     },
          //     {
          //       name: '新增项目信息管理',
          //       path: 'addInformationManagement',
          //       component: './subApp',
          //     },
          //     {
          //       name: '项目信息详情',
          //       path: 'projectInfoDetail',
          //       component: './subApp',
          //     },
          //     {
          //       name: '项目任务发起',
          //       path: 'taskManagementStart',
          //       component: './subApp',
          //     },
          //     {
          //       name: '项目任务管理子列表',
          //       path: 'taskManagementList',
          //       component: './subApp',
          //     },
          //     {
          //       name: '项目任务文件办理',
          //       path: 'taskManagementDeal',
          //       component: './subApp',
          //     },
          //     {
          //       name: '项目文档管理',
          //       path: 'documentManagement',
          //       component: './subApp',
          //     },
          //     {
          //       name: '项目文档查看',
          //       path: 'documentManagementDetail',
          //       component: './subApp',
          //     },
          //     {
          //       name: '物理档案入库',
          //       path: 'documentPhysicalArchive',
          //       component: './subApp',
          //     },
          //     {
          //       name: '归档文件更新',
          //       path: 'documentArchiveFileUpdate',
          //       component: './subApp',
          //     },
          //     {
          //       name: '项目任务管理',
          //       path: 'archiveTaskHandleList',
          //       routes: [
          //         {
          //           name: '项目任务管理',
          //           path: 'index',
          //           component: './subApp',
          //         },
          //         {
          //           name: '项目任务管理',
          //           path: 'review',
          //           component: './subApp',
          //         },
          //       ],
          //     },
          //     {
          //       name: '底稿归档',
          //       path: 'archiveTaskHandleListUploadPrinting',
          //       component: './subApp',
          //     },
          //     {
          //       name: '项目系列管理',
          //       path: 'seriesManage',
          //       component: './subApp',
          //     },
          //     {
          //       name: '项目/系列信息查询',
          //       path: 'projectAndSeriesQuery',
          //       component: './subApp',
          //     },
          //     {
          //       name: '新增项目系列',
          //       path: 'addProjectSeries',
          //       component: './subApp',
          //     },
          //     {
          //       name: '系列继承',
          //       path: 'projectAndSeriesQueryExtends',
          //       component: './subApp',
          //     },
          //   ],
          // },
          // {
          //   name: '操作日志',
          //   path: '/manuscriptManagementOperationLog',
          //   routes: [
          //     {
          //       name: '操作日志',
          //       path: 'manuscriptManagementOperationLogIndex',
          //       component: './subApp',
          //     },
          //     {
          //       name: '日志详情',
          //       path: 'manuscriptManagementOperationLogDetail',
          //       component: './subApp',
          //     },
          //   ],
          // },
          {
            name: '电子档案管理',
            path: 'electronic',
            routes: [
              {
                name: '文档管理',
                path: 'electronicRecord',
                component: './electronicRecord/index',
              },
              {
                name: '流转记录',
                path: 'electronicRecord/record',
                component: './electronicRecord/record',
              },
              {
                name: '模板条款管理列表',
                path: 'templateClauseManage',
                component: './templateClauseManage/index',
              },
              {
                name: '模板条款管理查看',
                path: 'templateClauseManageCheck',
                component: './templateClauseManage/check',
              },
            ],
          },
          {
            name: '底稿管理',
            path: '/manuscriptSystem',
            routes: [
              {
                name: '底稿标准目录配置',
                path: 'manuscriptBasic',
                component: './manuscriptBasic/index',
              },
              {
                name: '底稿标准目录配置设置/查看',
                path: 'manuscriptBasic/manuscriptBasicSov',
                component: './manuscriptBasic/setOrView',
              },
              {
                name: '底稿管理',
                path: 'manuscriptManagement',
                component: './manuscriptManagement/index',
              },
              {
                name: '底稿列表',
                path: 'manuscriptManagementList',
                component: './manuscriptManagementList/index',
              },
              {
                name: '项目底稿目录管理',
                path: 'manuscriptManage',
                component: './manuscriptManage/index',
              },
              {
                name: '项目底稿目录管理详情',
                path: 'manuscriptManageDetail',
                component: './manuscriptManage/details',
              },
              {
                name: '抽查报送',
                path: 'manuscriptManagementSpotCheckReport',
                component: './manuscriptManagementSpotCheckReport/index',
              },
              {
                name: '报送结果查询',
                path: 'manuscriptManagementReportResult',
                component: './manuscriptManagementReportResult/index',
              },
            ],
          },
          {
            name: '项目管理',
            path: '/projectManagement',
            routes: [
              {
                name: '项目信息管理',
                path: 'informationManagement',
                component: './manuscriptProjectManage/projectInfoManger',
              },
              {
                name: '新增项目信息管理',
                path: 'addInformationManagement',
                component: './manuscriptProjectManage/projectInfoManger/addProjectInfo',
              },
              {
                name: '项目信息详情',
                path: 'projectInfoDetail',
                component: './manuscriptProjectManage/projectInfoManger/projectInfoDetail',
              },
              // {
              //   name: '项目任务管理_old',
              //   path: 'taskManagement',
              //   component: './taskManagement',
              // },
              {
                name: '项目任务发起',
                path: 'taskManagementStart',
                component: './taskManagementStart',
              },
              {
                name: '项目任务管理子列表',
                path: 'taskManagementList',
                component: './taskManagementList',
              },
              {
                name: '项目任务文件办理',
                path: 'taskManagementDeal',
                component: './taskManagementDeal',
              },
              {
                name: '项目文档管理',
                path: 'documentManagement',
                component: './documentManagement',
              },
              {
                name: '项目文档查看',
                path: 'documentManagementDetail',
                component: './documentManagementDetail',
              },
              {
                name: '物理档案入库',
                path: 'documentPhysicalArchive',
                component: './documentPhysicalArchive',
              },
              {
                name: '归档文件更新',
                path: 'documentArchiveFileUpdate',
                component: './documentArchiveFileUpdate',
              },
              {
                name: '项目任务管理',
                path: 'archiveTaskHandleList',
                // component: './archiveTaskHandleList',
                routes: [
                  {
                    name: '项目任务管理',
                    path: 'index',
                    component: './archiveTaskHandleList/index',
                  },
                  {
                    name: '项目任务管理',
                    path: 'review',
                    component: './archiveTaskHandleList/review',
                  },
                ],
              },
              {
                name: '底稿归档',
                path: 'archiveTaskHandleListUploadPrinting',
                component: './archiveTaskHandleListUploadPrinting',
              },
              {
                name: '项目系列管理',
                path: 'seriesManage',
                component: './manuscriptProjectManage/seriesManage',
              },
              {
                name: '项目/系列信息查询',
                path: 'projectAndSeriesQuery',
                component: './manuscriptProjectManage/projectAndSeriesQuery',
              },
              {
                name: '新增项目系列',
                path: 'addProjectSeries',
                component: './manuscriptProjectManage/seriesManage/addProjectSeries',
              },
              {
                name: '系列继承',
                path: 'projectAndSeriesQueryExtends',
                component: './manuscriptProjectManage/projectAndSeriesQueryExtends',
              },
              {
                name: '项目/系列删除信息查询',
                path: 'documentFileDeleteLog',
                component: './manuscriptProjectManage/documentFileDeleteLog',
              },
            ],
          },
          {
            name: '操作日志',
            path: '/manuscriptManagementOperationLog',
            routes: [
              {
                name: '操作日志',
                path: 'manuscriptManagementOperationLogIndex',
                component: './manuscriptChangeLog',
              },
              {
                name: '日志详情',
                path: 'manuscriptManagementOperationLogDetail',
                component: './manuscriptChangeLogDetail',
              },
            ],
          },
          // {
          //   name: '底稿管理',
          //   path: '/manuscriptSystem',
          //   routes: [
          //     {
          //       name: '底稿标准目录配置',
          //       path: 'manuscriptBasic',
          //       component: './subApp',
          //     },
          //     {
          //       name: '底稿标准目录配置设置/查看',
          //       path: 'manuscriptBasic/manuscriptBasicSov',
          //       component: './subApp',
          //     },
          //     {
          //       name: '底稿管理',
          //       path: 'manuscriptManagement',
          //       component: './subApp',
          //     },
          //     {
          //       name: '底稿列表',
          //       path: 'manuscriptManagementList',
          //       component: './subApp',
          //     },
          //     {
          //       name: '项目底稿目录管理',
          //       path: 'manuscriptManage',
          //       component: './subApp',
          //     },
          //     {
          //       name: '项目底稿目录管理详情',
          //       path: 'manuscriptManageDetail',
          //       component: './subApp',
          //     },
          //     {
          //       name: '抽查报送',
          //       path: 'manuscriptManagementSpotCheckReport',
          //       component: './subApp',
          //     },
          //     {
          //       name: '报送结果查询',
          //       path: 'manuscriptManagementReportResult',
          //       component: './subApp',
          //     },
          //   ],
          // },
          // {
          //   name: '项目管理',
          //   path: '/projectManagement',
          //   routes: [
          //     {
          //       name: '项目信息管理',
          //       path: 'informationManagement',
          //       component: './subApp',
          //     },
          //     {
          //       name: '新增项目信息管理',
          //       path: 'addInformationManagement',
          //       component: './subApp',
          //     },
          //     {
          //       name: '项目信息详情',
          //       path: 'projectInfoDetail',
          //       component: './subApp',
          //     },
          //     {
          //       name: '项目任务发起',
          //       path: 'taskManagementStart',
          //       component: './subApp',
          //     },
          //     {
          //       name: '项目任务管理子列表',
          //       path: 'taskManagementList',
          //       component: './subApp',
          //     },
          //     {
          //       name: '项目任务文件办理',
          //       path: 'taskManagementDeal',
          //       component: './subApp',
          //     },
          //     {
          //       name: '项目文档管理',
          //       path: 'documentManagement',
          //       component: './subApp',
          //     },
          //     {
          //       name: '项目文档查看',
          //       path: 'documentManagementDetail',
          //       component: './subApp',
          //     },
          //     {
          //       name: '物理档案入库',
          //       path: 'documentPhysicalArchive',
          //       component: './subApp',
          //     },
          //     {
          //       name: '归档文件更新',
          //       path: 'documentArchiveFileUpdate',
          //       component: './subApp',
          //     },
          //     {
          //       name: '项目任务管理',
          //       path: 'archiveTaskHandleList',
          //       routes: [
          //         {
          //           name: '项目任务管理',
          //           path: 'index',
          //           component: './subApp',
          //         },
          //         {
          //           name: '项目任务管理',
          //           path: 'review',
          //           component: './subApp',
          //         },
          //       ],
          //     },
          //     {
          //       name: '底稿归档',
          //       path: 'archiveTaskHandleListUploadPrinting',
          //       component: './subApp',
          //     },
          //     {
          //       name: '项目系列管理',
          //       path: 'seriesManage',
          //       component: './subApp',
          //     },
          //     {
          //       name: '项目/系列信息查询',
          //       path: 'projectAndSeriesQuery',
          //       component: './subApp',
          //     },
          //     {
          //       name: '新增项目系列',
          //       path: 'addProjectSeries',
          //       component: './subApp',
          //     },
          //     {
          //       name: '系列继承',
          //       path: 'projectAndSeriesQueryExtends',
          //       component: './subApp',
          //     },
          //   ],
          // },
          // {
          //   name: '操作日志',
          //   path: '/manuscriptManagementOperationLog',
          //   routes: [
          //     {
          //       name: '操作日志',
          //       path: 'manuscriptManagementOperationLogIndex',
          //       component: './subApp',
          //     },
          //     {
          //       name: '日志详情',
          //       path: 'manuscriptManagementOperationLogDetail',
          //       component: './subApp',
          //     },
          //   ],
          // },
          {
            name: '任务中心',
            path: '/taskCenter',
            routes: [
              {
                name: '产品计划排期表-日历',
                path: 'productScheduling/calendar',
                component: './productScheduling',
              },
              {
                name: '新增产品发行计划',
                path: 'productScheduling/calendar/add',
                component: './productScheduling/add',
              },
              {
                name: '修改产品发行计划',
                path: 'productScheduling/calendar/modify',
                component: './productScheduling/modify',
              },
              {
                name: '运营日历',
                path: 'operatingCalendar',
                routes: [
                  {
                    name: '运营日历',
                    path: 'index',
                    component: './operatingCalendar',
                  },
                  {
                    name: '开放日设置',
                    path: 'index/openDaySetting',
                    component: './operatingCalendar/openDaySetting',
                  },
                  {
                    name: '系统设置',
                    path: 'index/subscribe',
                    component: './operatingCalendar/subscribe',
                  },
                  {
                    name: '添加事项',
                    path: 'index/addTask',
                    component: './operatingCalendar/addTaskPage',
                  },
                ],
              },
              {
                name: '全部日程',
                path: 'allTheSchedule',
                component: './allTheSchedule',
              },
            ],
          },
          {
            name: '项目权限配置',
            path: 'projectLimit',
            component: './projectLimit',
          },
          {
            name: '数据多路校验',
            path: '/multipleCheck',
            routes: [
              {
                name: '表分类管理',
                path: 'systemSetings/tableCategory',
                component: './subApp',
              },
              {
                name: '表校验规则配置',
                path: 'systemSetings/pTableRules',
                component: './subApp',
              },
              {
                name: '调度方案配置',
                path: 'systemSetings/executeRules',
                component: './subApp',
              },
              {
                name: '校验任务配置',
                path: 'systemSetings/taskVerification',
                component: './subApp',
              },
              {
                name: '数据源管理',
                path: 'systemSetings/dataSourceConfig',
                component: './subApp',
              },
              {
                name: '数据源表信息管理',
                path: 'systemSetings/sourceTableList',
                component: './subApp',
              },
              {
                name: '校验报告',
                path: 'dataReport/checkReport',
                component: './subApp',
              },
              {
                name: '校验监控',
                path: 'dataReport/process',
                component: './subApp',
              },
              {
                name: '差异处理',
                path: 'dataReport/checkDiff',
                component: './subApp',
              },
              {
                name: '基础详情页',
                path: 'dataReport/checkDiff/checkDiffDetail',
                component: './subApp',
              },
              {
                name: '数据事故统计',
                path: 'dataReport/quality/dataAccident',
                component: './subApp',
              },
              {
                name: '数据事故明细',
                path: 'dataReport/quality/dataAccidentInfo',
                component: './subApp',
              },
              {
                name: '任务运行日志',
                path: 'dataReport/log/runningLog',
                component: './subApp',
              },
            ],
          },
          {
            name: '消息通知',
            path: '/messageReminding',
            routes: [
              //     {
              //       name: '系统消息',
              //       path: 'systemMessage',
              //       component: './messageReminding/systemMessage',
              //     },
              //     {
              //       name: '业务提醒',
              //       path: 'businessMessage',
              //       component: './messageReminding/businessMessage',
              //     },
              {
                name: '消息详情',
                path: 'matterMessage/detail',
                component: './messageReminding/detail',
              },
              {
                name: '事项消息',
                path: 'matterMessage',
                component: './messageReminding/matterMessage',
              },
            ],
          },
          {
            name: '合同管理',
            path: 'contractManage',
            routes: [
              {
                name: '合同管理列表',
                path: 'contractList',
                component: './contractManage/contractList',
              },
            ],
          },
          {
            name: '模板管理',
            path: 'templateManage',
            routes: [
              {
                name: '模板管理列表',
                path: 'templateSet',
                component: './templateManage/templateSet',
              },
              {
                name: '模板详情',
                path: 'templateSet/templateDetails',
                component: './templateManage/templateDetails',
              },
            ],
          },
          {
            name: '产品要素库',
            path: 'productData',
            routes: [
              {
                name: '产品要素信息',
                path: 'productInformationBase',
                component: './productInformationBase',
              },
              {
                name: '产品要素项维护',
                path: 'maintain',
                component: './productDataManagement/maintain',
              },
            ],
          },
          {
            name: '划款指令管理',
            path: 'orderManagement',
            routes: [
              {
                name: '划款指令',
                path: 'repaymentInstructions',
                component: './repaymentInstructions',
              },
              {
                name: '费用列表',
                path: 'expenseList',
                component: './expenseList',
              },
            ],
          },

          {
            name: '产品要素管理',
            path: 'productEle',
            routes: [
              {
                name: '数据源管理',
                path: 'dataSourceManage',
                component: './dataSourceManage/dataSourceList',
              },
              {
                name: '数据源新增',
                path: 'dataSourceManage/dataSourceAdd',
                component: './dataSourceManage/dataSourceAdd',
              },
              {
                name: '数据源查看',
                path: 'dataSourceManage/dataSourceDetails',
                component: './dataSourceManage/dataSourceDetails',
              },
              {
                name: '数据表映射关系',
                path: 'dataTableList',
                component: './dataTableManage/dataTableList',
              },
              {
                name: '表结构管理',
                path: 'tableStructureList',
                component: 'tableStructureManage/tableStructureList',
              },
              {
                name: '产品要素管理',
                path: 'productElementsList',
                component: 'productElementsManage/productElementsList',
              },
              {
                name: '查看产品要素业务信息',
                path: 'productElementsList/businessDetails',
                component: 'productElementsManage/businessDetails',
              },
              {
                name: '新增产品要素业务信息',
                path: 'productElementsList/businessAdd',
                component: 'productElementsManage/businessAdd',
              },
              {
                name: '查看产品要素表结构信息',
                path: 'productElementsList/structureDetails',
                component: 'productElementsManage/structureDetails',
              },
              {
                name: '新增产品要素表结构信息',
                path: 'productElementsList/structureAdd',
                component: 'productElementsManage/structureAdd',
              },
            ],
          },
          ...SchedulingRouter,
          ...dataCenterRouter,
          ...ReportWorldRouter,
          ...PositionRouter,
          {
            component: './404',
          },
        ],
      },
      {
        component: './404',
      },
    ],
  },
  {
    component: './404',
  },
];
