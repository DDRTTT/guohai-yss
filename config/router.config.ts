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
const DataCenterRouter = [
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

// 对客服务平台（赢管家）
const AccessManagerResources = [
  {
    name: '基础信息',
    path: '/accessBase',
    routes: [
      {
        name: '指令模板',
        path: 'transferTemplateQuery',
        component: './subApp',
      },
      {
        name: '指令模板操作',
        path: 'transferTemplateInfo',
        component: './subApp',
      },
      {
        name: '报表模板',
        path: 'reportTemplate',
        component: './subApp',
      },
      {
        name: '机构注册',
        path: 'institutionalAuditQuery',
        component: './subApp',
      },
      {
        name: '用户信息',
        path: 'userInfo',
        component: './subApp',
      },
      {
        name: '添加用户',
        path: 'addUser',
        component: './subApp',
      },
    ],
  },
  {
    name: '数据授权',
    path: '/dataLicense',
    routes: [
      {
        name: '数据授权审核',
        path: 'licenseChecked',
        component: './subApp',
      },
      {
        name: '数据权限申请',
        path: 'userLicense',
        component: './subApp',
      },
      {
        name: '机构详情',
        path: 'licenseDetail',
        component: './subApp',
      },
    ],
  },
  {
    name: '报告报表',
    path: '/file',
    routes: [
      {
        name: '报告查询',
        path: 'fileQuery',
        component: './subApp',
      },
      {
        name: '报表下载',
        path: 'valuationFile',
        component: './subApp',
      },
      {
        name: '报告上传',
        path: 'fileupload',
        component: './subApp',
      },
      {
        name: '综合文档管理',
        path: 'multipleManage',
        component: './subApp',
      },
      {
        name: '产品文档',
        path: 'proDoc',
        component: './subApp',
      },
      {
        name: '产品详情',
        path: 'proInfo',
        component: './subApp',
      },
    ],
  },
  {
    name: '账户明细',
    path: '/accountdetail',
    routes: [
      {
        name: '账户查询',
        path: 'accQuery',
        component: './subApp',
      },
      {
        name: '账户详情',
        path: 'accDetail',
        component: './subApp',
      },
      {
        name: '流水详情',
        path: 'turnoverDetail',
        component: './subApp',
      },
      {
        name: '账户添加',
        path: 'accAdd',
        component: './subApp',
      },
      {
        name: '账户修改',
        path: 'accUpdate',
        component: './subApp',
      },
    ],
  },
  {
    name: '产品服务',
    path: '/product',
    routes: [
      {
        name: '产品查询',
        path: 'proQuery',
        component: './subApp',
      },
      {
        name: '产品信息',
        path: 'proInfo',
        component: './subApp',
      },
      {
        name: '产品查询(外)',
        path: 'proQuery_WBR',
        component: './subApp',
      },
      {
        name: '产品查询(通用测试)',
        path: 'proQueryAll',
        component: './subApp',
      },
      {
        name: '产品新增(外)',
        path: 'proQueryAdd_WBR',
        component: './subApp',
      },
      {
        name: '产品编辑(外)',
        path: 'proQueryUpdate_WBR',
        component: './subApp',
      },
      {
        name: '查看详情(外)',
        path: 'proQueryDetail',
        component: './subApp',
      },
      {
        name: '查看详情(托)',
        path: 'proQueryDetail_TGR',
        component: './subApp',
      },
      {
        name: '产品查询(托)',
        path: 'proQuery_TGR',
        component: './subApp',
      },
      {
        name: '产品新增(托)',
        path: 'proQueryAdd_TGR',
        component: './subApp',
      },
      {
        name: '产品编辑(托)',
        path: 'proQueryUpdate_TGR',
        component: './subApp',
      },
      {
        name: '查看详情(管)',
        path: 'proQueryDetail_GLR',
        component: './subApp',
      },
      {
        name: '产品查询(管)',
        path: 'proQuery_GLR',
        component: './subApp',
      },
      {
        name: '产品新增(管)',
        path: 'proQueryAdd_GLR',
        component: './subApp',
      },
      {
        name: '产品编辑(管)',
        path: 'proQueryUpdate_GLR',
        component: './subApp',
      },
      {
        name: '阳光私募',
        path: 'recoPro',
        component: './subApp',
      },
      {
        name: '公司详情',
        path: 'recoProCom',
        component: './subApp',
      },
      {
        name: '经理详情',
        path: 'recoProMan',
        component: './subApp',
      },
      {
        name: '产品详情',
        path: 'recoProDetail',
        component: './subApp',
      },
      {
        name: '产品发行',
        path: 'distributionList',
        component: './subApp',
      },
      {
        name: '产品操作',
        path: 'newProduct',
        component: './subApp',
      },
      {
        name: '产品详情',
        path: 'productDetail',
        component: './subApp',
      },
      {
        name: '账户开立',
        path: 'accountOpen',
        component: './subApp',
      },
      {
        name: '产品分红',
        path: 'productDividend',
        component: './subApp',
      },
      {
        name: '编辑产品分红',
        path: 'dividendAdd',
        component: './subApp',
      },
      {
        name: '分红详情',
        path: 'dividendDetails',
        component: './subApp',
      },
      {
        name: '公告',
        path: 'dividendNotice',
        component: './subApp',
      },
      {
        name: '产品清盘',
        path: 'productSellOutList',
        component: './subApp',
      },
      {
        name: '查看详情',
        path: 'productSellOutDetail',
        component: './subApp',
      },
      {
        name: '新增清盘方案',
        path: 'productSellOutAdd',
        component: './subApp',
      },
      {
        name: '清盘公告',
        path: 'productSellOutNotice',
        component: './subApp',
      },
    ],
  },
  {
    name: '登记备案',
    path: '/registrationFiling',
    routes: [
      {
        name: '登记备案查询',
        path: 'filingList',
        component: './subApp',
      },
      {
        name: '登记备案详情',
        path: 'filingDetail',
        component: './subApp',
      },
    ],
  },
  {
    name: '估值运营',
    path: '/reportService',
    routes: [
      {
        name: '估值表',
        path: 'valuationTable',
        component: './subApp',
      },
      {
        name: '净资产变动表',
        path: 'netAssetChangeTable',
        component: './subApp',
      },
      {
        name: '利润表',
        path: 'profitTable',
        component: './subApp',
      },
      {
        name: '资产负债表',
        path: 'assetsLiabilitiesTable',
        component: './subApp',
      },
      {
        name: '两费净值报表',
        path: 'netCostTable',
        component: './subApp',
      },
      {
        name: '科目余额表',
        path: 'accountBalanceTable',
        component: './subApp',
      },
      {
        name: '凭证表',
        path: 'certificateTable',
        component: './subApp',
      },
      {
        name: '成交清算日报表',
        path: 'transactionSettlementDateReportTable',
        component: './subApp',
      },
      {
        name: '行情补录',
        path: 'quotation',
        component: './subApp',
      },
      {
        name: '资产行情配置查看',
        path: 'quotationDetail',
        component: './subApp',
      },
    ],
  },
  {
    name: 'TA运营',
    path: '/TAReportService',
    routes: [
      {
        name: '账户基本信息',
        path: 'accountFundInformationTable',
        component: './subApp',
      },
      {
        name: '账户对应关系',
        path: 'accountCorrespondenceTable',
        component: './subApp',
      },
      {
        name: '账户确认明细信息',
        path: 'accountConfirmationDetailsTable',
        component: './subApp',
      },
      {
        name: '交易确认明细信息',
        path: 'transactionConfirmationDetailsTable',
        component: './subApp',
      },
      {
        name: '持仓余额信息',
        path: 'positionBalanceInformationTable',
        component: './subApp',
      },
      {
        name: '权益登记信息',
        path: 'equityRegistrationInformationTable',
        component: './subApp',
      },
      {
        name: '余额明细信息',
        path: 'balanceDetailsTable',
        component: './subApp',
      },
      {
        name: '历史基金余额信息',
        path: 'historicalFundBalanceInformationTable',
        component: './subApp',
      },
      {
        name: '开放申赎确认明细',
        path: 'openRedemptionConfirmationDetailsTable',
        component: './subApp',
      },
      {
        name: '认购确认明细信息',
        path: 'subscriptionConfirmationDetailsTable',
        component: './subApp',
      },
      {
        name: '产品认申购',
        path: 'proSubscription',
        component: './subApp',
      },
      {
        name: '基金转换申请',
        path: 'fundConversionApplication',
        component: './subApp',
      },
      {
        name: '新增基金转换申请',
        path: 'addFundConversionApplication',
        component: './subApp',
      },
      {
        name: '基金转换申请详情',
        path: 'fundConversionDetail',
        component: './subApp',
      },
      {
        name: '基金转换申请修改',
        path: 'editFundConversion',
        component: './subApp',
      },
      {
        name: '强制赎回申请',
        path: 'mandatoryRedemptionApplication',
        component: './subApp',
      },
      {
        name: '新增强制赎回申请',
        path: 'addMandatoryRedemptionApplication',
        component: './subApp',
      },
      {
        name: '强制赎回申请详情',
        path: 'mandatoryRedemptionApplicationDetail',
        component: './subApp',
      },
      {
        name: '强制赎回申请修改',
        path: 'editMandatoryRedemptionApplication',
        component: './subApp',
      },
      {
        name: '申请产品认申购',
        path: 'addProSubscription',
        component: './subApp',
      },
      {
        name: '修改产品认申购',
        path: 'updateProSubscription',
        component: './subApp',
      },
      {
        name: '查看产品认申购详情',
        path: 'openProSubscriptionDetail',
        component: './subApp',
      },
      {
        name: '产品赎回',
        path: 'proRedemption',
        component: './subApp',
      },
      {
        name: '申请产品赎回',
        path: 'addProRedemption',
        component: './subApp',
      },
      {
        name: '修改产品赎回',
        path: 'updateProRedemption',
        component: './subApp',
      },
      {
        name: '查看产品赎回详情',
        path: 'openProRedemptionDetail',
        component: './subApp',
      },
      {
        name: '交易申请明细',
        path: 'transactionApplicationDetails',
        component: './subApp',
      },
      {
        name: '管理人业绩报酬',
        path: 'managerPerformanceRem',
        component: './subApp',
      },
    ],
  },
  {
    name: '投资者管理',
    path: '/investorManage',
    routes: [
      {
        name: '冷静期回访',
        path: 'returnPeriod',
        component: './subApp',
      },
      {
        name: '冷静期回访详情',
        path: 'returnPeriodDetail',
        component: './subApp',
      },
      {
        name: '新客办理',
        path: 'newCustomerHandling',
        component: './subApp',
      },
      {
        name: '新增投资人',
        path: 'newInvestor',
        component: './subApp',
      },
      {
        name: '信息编辑',
        path: 'editInformation',
        component: './subApp',
      },
      {
        name: '批量添加',
        path: 'addInBatches',
        component: './subApp',
      },
      {
        name: '批量预览',
        path: 'batchPreview',
        component: './subApp',
      },
      {
        name: '注册邀请',
        path: 'registerInvite',
        component: './subApp',
      },
      {
        name: '我的投资人',
        path: 'myInvestor',
        component: './subApp',
      },
      {
        name: '查看详情',
        path: 'myInvestorInfo',
        component: './subApp',
      },
      {
        name: '适当性管理',
        path: 'appropriateManagement',
        component: './subApp',
      },
      {
        name: '基金产品详情',
        path: 'checkFundProducts',
        component: './subApp',
      },
      {
        name: '投资者详情',
        path: 'investorsDetails',
        component: './subApp',
      },
      {
        name: '投诉跟踪',
        path: 'complaintsTracking',
        component: './subApp',
      },
      {
        name: '投诉跟踪详情',
        path: 'complaintsTrackingDetails',
        component: './subApp',
      },
      {
        name: '信息发布',
        path: 'informationRelease',
        component: './subApp',
      },
      {
        name: '查看',
        path: 'informationReleaseView',
        component: './subApp',
      },
      {
        name: '新增公告',
        path: 'newAnnouncement',
        component: './subApp',
      },
    ],
  },
  {
    name: '投诉建议',
    path: '/personalCenter',
    routes: [
      {
        name: '投诉建议',
        path: 'complaintSuggestion',
        component: './subApp',
      },
      {
        name: '基本信息',
        path: 'bacisInformation',
        component: './subApp',
      },
      {
        name: '信息详情',
        path: 'basicDetail',
        component: './subApp',
      },
      {
        name: '安全设置',
        path: 'securitySetting',
        component: './subApp',
      },
      {
        name: '我的账户',
        path: 'myAccount',
        component: './subApp',
      },
      {
        name: '订阅服务',
        path: 'readService',
        component: './subApp',
      },
      {
        name: '新增',
        path: 'complaintAdd',
        component: './subApp',
      },
      {
        name: '消息提醒',
        path: 'messageReminder',
        component: './subApp',
      },
    ],
  },
  {
    name: '题库管理',
    path: '/testQuestion',
    routes: [
      {
        name: '试卷设置',
        path: 'questionSetUp',
        component: './subApp',
      },
      {
        name: '试卷编辑',
        path: 'testPageAdd',
        component: './subApp',
      },
      {
        name: '试题库',
        path: 'itemBank',
        component: './subApp',
      },
      {
        name: '模板录入识别',
        path: 'inputRecognition',
        component: './subApp',
      },
      {
        name: '试卷管理',
        path: 'testManage',
        component: './subApp',
      },
      {
        name: '试卷查看',
        path: 'testView',
        component: './subApp',
      },
      {
        name: '题库添加试卷',
        path: 'questionBankTest',
        component: './subApp',
      },
      {
        name: '随机生成试卷',
        path: 'randomTest',
        component: './subApp',
      },
      {
        name: '评分规则设置',
        path: 'gradeRule',
        component: './subApp',
      },
      {
        name: '评分规则',
        path: 'codePoint',
        component: './subApp',
      },
    ],
  },
  {
    name: '指令管理',
    path: '/commandManagement',
    icon: 'solution',
    routes: [
      {
        name: '指令查询',
        path: 'instructionQuery',
        component: './subApp',
      },
      {
        name: '指令详情',
        path: 'detailQuery',
        component: './subApp',
      },
      {
        name: '指令列表',
        path: 'instructionList',
        component: './subApp',
      },
      {
        name: '指令操作',
        path: 'instructionOne',
        component: './subApp',
      },
      {
        name: '批量指令操作',
        path: 'instructionMore',
        component: './subApp',
      },
      {
        name: '指令详情',
        path: 'detailList',
        component: './subApp',
      },
    ],
  },
  {
    name: '流程管理',
    path: '/processManage',
    icon: 'hdd',
    routes: [
      {
        name: '节点网关配置',
        path: 'nodeGatewaySet',
        component: './subApp',
      },
      {
        name: '用户组配置',
        path: 'userGroupSet',
        component: './subApp',
      },
      {
        name: '流程配置',
        path: 'processSet',
        component: './subApp',
      },
    ],
  },
  {
    name: '我的工作台',
    path: '/workBench',
    icon: 'solution',
    routes: [
      {
        name: '账户列表',
        path: 'accountList',
        component: './subApp',
      },
      {
        name: '账户总览',
        path: 'accountOverview',
        component: './subApp',
      },
      {
        name: '持仓产品',
        path: 'positionProduct',
        component: './subApp',
      },
      {
        name: '查看更多',
        path: 'positionProList',
        component: './subApp',
      },
      {
        name: '基金产品详情',
        path: 'positionProDetailPage',
        component: './subApp',
      },
      {
        name: '全部产品',
        path: 'allProduct',
        component: './subApp',
      },
      {
        name: '基金产品详情',
        path: 'allProDetailPage',
        component: './subApp',
      },
      {
        name: '交易记录',
        path: 'transactionRecord',
        component: './subApp',
      },
    ],
  },
  {
    name: '我的账户',
    icon: 'calculator',
    path: '/dashboard',
    routes: [
      {
        name: '账户首页',
        path: 'portal',
        icon: 'pay-circle',
        component: './subApp',
      },
      {
        name: '账户首页',
        path: 'portalTZR',
        // invisible: true,
        icon: 'pay-circle',
        component: './subApp',
      },
      {
        name: '首页',
        path: 'homePage',
        icon: 'pay-circle',
        component: './subApp',
      },
      {
        name: '产品生命周期',
        path: '/dashboard/index',
        component: './subApp',
      },
      {
        name: '产品概况',
        path: 'productOverview',
        component: './subApp',
      },
      {
        name: '产品干系人',
        path: 'productStakeholders',
        component: './subApp',
      },
      {
        name: '产品干系人详情',
        path: 'productStakeholdersDetail',
        component: './subApp',
      },
      {
        name: '产品文档',
        path: 'prodoc',
        icon: 'pay-circle',
        component: './subApp',
      },
      {
        name: '文档详情',
        path: 'prodocdetail',
        icon: 'pay-circle',
        component: './subApp',
      },
      {
        name: '产品运营日历',
        path: 'proopecal',
        icon: 'pay-circle',
        component: './subApp',
      },
      {
        name: '消息提醒',
        path: 'messageReminder',
        icon: 'pay-circle',
        component: './subApp',
      },
      {
        name: '列表',
        path: 'taskMore',
        icon: 'pay-circle',
        component: './subApp',
      },
      {
        name: '提醒策略设置',
        path: 'remindMore',
        icon: 'pay-circle',
        component: './subApp',
      },
      {
        name: '操作指引',
        path: 'operationGuide',
        icon: '',
        component: './subApp',
      },
    ],
  },
  {
    name: '微信设置',
    path: '/wechat',
    icon: 'user',
    routes: [
      {
        name: '公众号管理',
        path: 'publicNum',
        component: './subApp',
      },
      {
        name: '公众号操作',
        path: 'publicOperate',
        component: './subApp',
      },
      {
        name: '菜单管理',
        path: 'menuMan',
        component: './subApp',
      },
      {
        name: '消息模板',
        path: 'mesMould',
        component: './subApp',
      },
      {
        name: '新增模板',
        path: 'newMould',
        component: './subApp',
      },
      {
        name: '用户列表',
        path: 'userList',
        component: './subApp',
      },
    ],
  },
  {
    name: '机构管理',
    path: '/registrationReview',
    icon: 'hdd',
    routes: [
      {
        name: '机构查询',
        path: 'orgQuery',
        component: './subApp',
      },
      {
        name: '机构操作',
        path: 'orgInfo',
        component: './subApp',
      },
    ],
  },
  {
    name: '调度管理',
    icon: 'schedule',
    path: '/taskScheduling',
    routes: [
      {
        name: '调度任务管理',
        path: 'taskManager',
        component: './subApp',
      },
      {
        name: '调度日志',
        path: 'jobLog',
        component: './subApp',
      },
      {
        name: '执行器管理',
        path: 'actManager',
        component: './subApp',
      },
    ],
  },
  {
    name: '场外投资',
    path: '/Outside',
    icon: 'solution',
    routes: [
      {
        name: '场外投资',
        path: 'outside',
        component: './subApp',
      },
      {
        name: '开户查询',
        path: 'openAccount',
        component: './subApp',
      },
      {
        name: '交易查询',
        path: 'transaction',
        component: './subApp',
      },
      {
        name: '订单详情',
        path: 'orderDetail',
        component: './subApp',
      },
      {
        name: '持仓详情',
        path: 'positionDetail',
        component: './subApp',
      },
      {
        name: '分红详情',
        path: 'bonusDetail',
        component: './subApp',
      },
      {
        name: '附件归档',
        path: 'fileEnclosure',
        component: './subApp',
      },
    ],
  },
  {
    name: '信披管理',
    path: '/informationDisclosure',
    icon: 'solution',
    routes: [
      {
        name: '信披服务申请/审核',
        path: 'applicationAudit',
        component: './subApp',
      },
      {
        name: '信披服务办理',
        path: 'handleEntrance',
        component: './subApp',
      },
      {
        name: '信披服务已申请详情',
        path: 'applyHasDetail',
        component: './subApp',
      },
      {
        name: '信披服务待申请详情',
        path: 'applyNoHasDetail',
        component: './subApp',
      },
      {
        name: '外包机构选择',
        path: 'chooseOrgan',
        component: './subApp',
      },
      {
        name: '新增服务',
        path: 'addService',
        component: './subApp',
      },
      {
        name: '信披服务已审核详情',
        path: 'auditHasDetail',
        component: './subApp',
      },
      {
        name: '新增披露',
        path: 'addDisclosure',
        component: './subApp',
      },
      {
        name: '查看服务详情',
        path: 'serviceDetail',
        component: './subApp',
      },
      {
        name: '历史信披报告',
        path: 'disclosureQuery',
        component: './subApp',
      },
      {
        name: '查看详情',
        path: 'disclosureInfo',
        component: './subApp',
      },
      {
        name: '披露类型',
        path: 'disclosureType',
        component: './subApp',
      },
      {
        name: '新增类型',
        path: 'disclosureAdd',
        component: './subApp',
      },
      {
        name: '已办理查看详情（管理人）',
        path: 'handleManagerDetail',
        component: './subApp',
      },
      {
        name: '已办理查看详情（经办人）',
        path: 'handleTransactorDetail',
        component: './subApp',
      },
      {
        name: '待办理查看详情（经办人）',
        path: 'noHandleTransactorDetail',
        component: './subApp',
      },
      {
        name: '服务详情查看',
        path: 'serviceDetail',
        component: './subApp',
      },
    ],
  },
  {
    name: '合同管理',
    path: '/accessContractManage',
    icon: 'hdd',
    routes: [
      {
        name: '全部合同',
        path: 'contractList',
        component: './subApp',
      },
      {
        name: '合同审核',
        path: 'contractCheck',
        component: './subApp',
      },
      {
        name: '合同编辑',
        path: 'contractAdd',
        component: './subApp',
      },
      {
        name: '选择模板',
        path: 'selectTemplate',
        component: './subApp',
      },
      {
        name: '智能撰写',
        path: 'intelligentWrite',
        component: './subApp',
      },
      {
        name: '基础信息表单',
        path: 'basicDataForm',
        component: './subApp',
      },
      {
        name: '版本比对',
        path: 'contractEdition',
        component: './subApp',
      },
      {
        name: '模板设置',
        path: 'templateSet',
        component: './subApp',
      },
      {
        name: '合同签订',
        path: 'contractSign',
        component: './subApp',
      },
      {
        name: '查看合同',
        path: 'contractView',
        component: './subApp',
      },
      // {
      //   name: '智能模型',
      //   path: 'pageTemplate1',
      //   component: './subApp/index',
      // },
    ],
  },
  {
    name: '绩效考核',
    path: '/assessment',
    icon: 'hdd',
    routes: [
      {
        name: '绩效考核',
        path: 'performAppraisal',
        component: './subApp',
      },
      {
        name: '收入分配',
        path: 'incomeDistribution',
        component: './subApp',
      },
      {
        name: '基础运营数据管理',
        path: 'dataMaintenance',
        component: './subApp',
      },
      {
        name: '导入数据查询',
        path: 'importData',
        component: './subApp',
      },
      {
        name: '产品对应关系',
        path: 'correspondingRelation',
        component: './subApp',
      },
      {
        name: '产品对应关系查看',
        path: 'correspondingRelationView',
        component: './subApp',
      },
      {
        name: '组织架构',
        path: 'organizationalStructure',
        component: './subApp',
      },
      {
        name: '组织架构查看',
        path: 'organizationalStructureView',
        component: './subApp',
      },
      {
        name: '新增组织架构',
        path: 'organizationalStructureAdd',
        component: './subApp',
      },
    ],
  },
  {
    name: '实名认证与签章授权',
    path: '/contractConfirmAuthor',
    icon: 'hdd',
    routes: [
      {
        name: '实名认证',
        path: 'RealConfirm',
        component: './subApp',
      },
    ],
  },
  {
    name: '理财产品',
    path: '/financialProducts',
    icon: 'hdd',
    routes: [
      {
        name: '产品系列',
        path: 'productLine',
        component: './subApp',
      },
      {
        name: '产品系列操作',
        path: 'productLineDetail',
        component: './subApp',
      },
      {
        name: '产品创设',
        path: 'productCreate',
        component: './subApp',
      },
      {
        name: '产品新增',
        path: 'productAdd',
        component: './subApp',
      },
      {
        name: '查看操作记录及文件上传',
        path: 'applicationTable',
        component: './subApp',
      },
      {
        name: '风险评级',
        path: 'riskRating',
        component: './subApp',
      },
      {
        name: '产品决议',
        path: 'productResolution',
        component: './subApp',
      },
    ],
  },
  {
    name: '理财报价管理',
    path: '/financialOfferManagement',
    icon: 'hdd',
    routes: [
      {
        name: '理财报价申请',
        path: 'financialOfferApply',
        component: './subApp',
      },
      {
        name: '录入报价',
        path: 'addOffer',
        component: './subApp',
      },
      {
        name: '查看详情',
        path: 'offerDetail',
        component: './subApp',
      },
      {
        name: '理财报价库',
        path: 'financialOfferStore',
        component: './subApp',
      },
      {
        name: '试算',
        path: 'preCalculate',
        component: './subApp',
      },
    ],
  },
  {
    name: '指令信息管理',
    path: '/commInformManagement',
    icon: 'hdd',
    routes: [
      {
        name: '指令信息管理',
        path: 'informManagement',
        component: './subApp',
      },
      {
        name: '指令录入',
        path: 'commEnter',
        hidden: true,
        component: './subApp',
      },
      {
        name: '查看',
        path: 'commDetail',
        hidden: true,
        component: './subApp',
      },
      {
        name: '修改',
        path: 'commModify',
        hidden: true,
        component: './subApp',
      },
    ],
  },
  {
    name: '账户信息查询',
    path: '/accountQuery',
    icon: 'hdd',
    routes: [
      {
        name: '账户信息查询',
        path: 'accountInformationQuery',
        component: './subApp',
      },
      {
        name: '账户信息管理',
        path: 'accountInformationManage',
        component: './subApp',
      },
      {
        name: '查看',
        path: 'showDetails',
        component: './subApp',
      },
      {
        name: '惠华OA系统自动登录跳转页面',
        path: 'oaTodo',
        component: './subApp',
      },
    ],
  },
  {
    name: '产品申购',
    path: '/productPurchase',
    icon: 'hdd',
    routes: [
      {
        name: '申购交易管理',
        path: 'purchaseTransacteManagement',
        component: './subApp',
      },
      {
        name: '发起申购',
        path: 'initPurchase',
        component: './subApp',
      },
      {
        name: '查看',
        path: 'purchaseDetail',
        component: './subApp',
      },
    ],
  },
  {
    name: '产品赎回',
    path: '/productRedemption',
    icon: 'hdd',
    routes: [
      {
        name: '详情',
        path: 'redemptionTransactionRecord',
        component: './subApp',
      },
      {
        name: '账户持仓明细',
        path: 'accountPositionDetails',
        component: './subApp',
      },
      {
        name: '赎回交易管理',
        path: 'redemptionTransactionManagement',
        component: './subApp',
      },
      {
        name: '查看详情',
        path: 'showDetails',
        component: './subApp',
      },
    ],
  },
  {
    name: '新一代资产托管系统',
    path: '/acs',
    icon: 'hdd',
    routes: [
      {
        name: '指令信息查询',
        path: 'acs-command/transferCommand.ctrl',
        component: './subApp',
      },
      {
        name: '产品信息查询',
        path: 'acs-parameters/product.ctrl',
        component: './subApp',
      },
    ],
  },
  {
    name: '资金指令',
    path: '/sofa',
    icon: 'hdd',
    routes: [
      {
        name: '文件分拣信息管理',
        path: 'acs-commandcenter/commandemail.ctrl',
        component: './subApp',
      },
      {
        name: '指令待办',
        path: 'acs-commandcenter/backlog.ctrl',
        component: './subApp',
      },
      {
        name: '流程业务配置',
        path: 'acs-commandcenter/flowBusiness.ctrl',
        component: './subApp',
      },
    ],
  },
  {
    name: '印章管理',
    path: '/sofa',
    icon: 'hdd',
    routes: [
      {
        name: '电子印鉴信息管理',
        path: 'acs-electronicsealcenter/electronicseal.ctrl',
        component: './subApp',
      },
      {
        name: '电子印鉴业务流程管理中心',
        path: 'acs-electronicsealcenter/electronicBusinessSeal.ctrl',
        component: './subApp',
      },
      {
        name: '报表印鉴批量申请设置中心',
        path: 'acs-electronicsealcenter/reportBatch.ctrl',
        component: './subApp',
      },
      {
        name: '用印信息查询',
        path: 'acs-electronicsealcenter/seaLinformation.ctrl',
        component: './subApp',
      },
    ],
  },
];

const CustomerServicesRouter = [
  {
    name: '对客二期',
    path: '/customer',
    routes: [
      {
        name: '首页',
        path: 'index',
        component: './customerIndex',
      },
      {
        name: '电子档案管理',
        path: 'electronicFile',
        component: './electronicFile',
      },
      {
        name: '便捷查询',
        path: 'find',
        component: './userCustomer/loginCustomer/find',
      },
    ],
  },
  {
    name: '电子对账模板设置',
    path: '/eleReconciliation/list',
    component: './eleReconciliation',
  }
];

const fileBorrower = [
  {
    name: '档案借阅',
    path: '/fileBorrower',
    routes: [
      {
        name: '列表',
        path: 'list',
        component: './fileBorrower',
      },
      {
        name: '查看',
        path: 'view',
        component: './fileBorrower/view',
      },
      {
        name: '审核',
        path: 'check',
        component: './fileBorrower/check',
      },
      {
        name: '延期',
        path: 'late',
        component: './fileBorrower/late',
      },
      {
        name: '借阅申请',
        path: 'apply',
        component: './fileBorrower/apply',
      },
    ],
  },
];

// 产品盘点系统
const ProductInventoryResources = [
  {
    name: '盘点系统',
    path: '/tkpd',
    routes: [
      {
        name: '标签库管理',
        path: 'tk/label/manage',
        component: './subApp',
      },
      {
        name: '产品分类管理',
        path: 'tk/classify/200',
        component: './subApp',
      },
      {
        name: '产品策略管理',
        path: 'tk/classify/300',
        component: './subApp',
      },
      {
        name: '客户分类管理',
        path: 'tk/classify/400',
        component: './subApp',
      },

      {
        id: 102001,
        code: '公司领航',
        path:
          '/tk/smartbi?url=..%2Fsmartbix%2F%3Fintegrated%3Dtrue%26showheader%3Dfalse%26l%3Dzh_CN%26nodeid%3DI2c918082018017161716854a0180449008c337a7%26commandid%3Da3af3b9e-0efb-7d65-c4ee-1508b3298412%23%2Fpage%2Fe558edb3f071d5e7e091d4afe5fb7759', // 菜单路径
        title: '公司领航',
        icon: '',
        name: '公司领航',
        component: './subApp',
        description: '',
        actions: [
          {
            id: 102001001,
            code: '公司领航:查看',
            name: '公司领航:查看',
            method: 'GET',
            type: 'btn',
            tabUri: '//',
            description: '',
            uri: '/user/del/{$id}',
            uriFlag: '/yss-base-admin',
          },
        ],
      },
      {
        id: 102002,
        code: '资管产品领航',
        path:
          '/tk/smartbi?url=..%2Fsmartbix%2F%3Fintegrated%3Dtrue%26showheader%3Dfalse%26l%3Dzh_CN%26nodeid%3DI2c918082018017161716854a0180449008c337a7%26commandid%3D18829de2-cf98-4869-5cd9-8d2078127eb2%23%2Fpage%2F1ef9d0af99372c72d89a5cd87d302415',
        title: '资管产品领航',
        icon: '',
        name: '资管产品领航',
        component: './subApp',
        description: '',
        actions: [
          {
            id: 102002001,
            code: '资管产品领航:查看',
            name: '资管产品领航:查看',
            method: 'GET',
            type: 'btn',
            tabUri: '//',
            description: '',
            uri: '/user/del/{$id}',
            uriFlag: '/yss-base-admin',
          },
        ],
      },
      {
        id: 102003,
        code: '投连专户领航',
        path:
          '/tk/smartbi?url=..%2Fsmartbix%2F%3Fintegrated%3Dtrue%26showheader%3Dfalse%26l%3Dzh_CN%26nodeid%3DI2c918082018017161716854a0180449008c337a7%26commandid%3D4fe784a8-159b-fe22-da6d-9f6667c98ff3%23%2Fpage%2Fab64a7c1120aa31bd391666a6dd4c60d',
        title: '投连专户领航',
        icon: '',
        name: '投连专户领航',
        component: './subApp',
        description: '',
        actions: [
          {
            id: 102002001,
            code: '投连专户领航:查看',
            name: '投连专户领航:查看',
            method: 'GET',
            type: 'btn',
            tabUri: '//',
            description: '',
            uri: '/user/del/{$id}',
            uriFlag: '/yss-base-admin',
          },
        ],
      },
      {
        id: 102004,
        code: '三方保险专户领航',
        path:
          '/tk/smartbi?url=..%2Fsmartbix%2F%3Fintegrated%3Dtrue%26showheader%3Dfalse%26l%3Dzh_CN%26nodeid%3DI2c918082018017161716854a0180449008c337a7%26commandid%3D6bc0acc2-69b0-dd76-79bb-2b6a731c914d%23%2Fpage%2F5c4e449f96dfc4aaa8bc81c2b4251a54', // 菜单路径
        title: '三方保险专户领航',
        icon: '',
        name: '三方保险专户领航',
        component: './subApp',
        description: '',
        actions: [
          {
            id: 102002001,
            code: '三方保险专户领航:查看',
            name: '三方保险专户领航:查看',
            method: 'GET',
            type: 'btn',
            tabUri: '//',
            description: '',
            uri: '/user/del/{$id}',
            uriFlag: '/yss-base-admin',
          },
        ],
      },
      {
        id: 102005,
        code: '养老金产品领航',
        path:
          '/tk/smartbi?url=..%2Fsmartbix%2F%3Fintegrated%3Dtrue%26showheader%3Dfalse%26l%3Dzh_CN%26nodeid%3DI2c918082018017161716854a0180449008c337a7%26commandid%3Dee328ea3-f2d0-ea62-c385-faacd03002d6%23%2Fpage%2F9e1b644a0070b5dba341b33850d70fed', // 菜单路径
        title: '养老金产品领航',
        icon: '',
        name: '养老金产品领航',
        component: './subApp',
        description: '',
        actions: [
          {
            id: 102002001,
            code: '养老金产品领航:查看',
            name: '养老金产品领航:查看',
            method: 'GET',
            type: 'btn',
            tabUri: '//',
            description: '',
            uri: '/user/del/{$id}',
            uriFlag: '/yss-base-admin',
          },
        ],
      },
      {
        id: 102006,
        code: '养老专户领航',
        path:
          '/tk/smartbi?url=..%2Fsmartbix%2F%3Fintegrated%3Dtrue%26showheader%3Dfalse%26l%3Dzh_CN%26nodeid%3DI2c918082018017161716854a0180449008c337a7%26commandid%3D5c8dec44-8ea0-be4d-bda9-43351e4a2fc4%23%2Fpage%2F40a52b3a2249d91fcf2c108ad5dfc949', // 菜单路径
        title: '养老专户领航',
        icon: '',
        name: '养老专户领航',
        component: './subApp',
        description: '',
        actions: [
          {
            id: 102002001,
            code: '养老专户领航:查看',
            name: '养老专户领航:查看',
            method: 'GET',
            type: 'btn',
            tabUri: '//',
            description: '',
            uri: '/user/del/{$id}',
            uriFlag: '/yss-base-admin',
          },
        ],
      },
      {
        id: 102007,
        code: 'TOF领航',
        path:
          '/tk/smartbi?url=..%2Fsmartbix%2F%3Fintegrated%3Dtrue%26showheader%3Dfalse%26l%3Dzh_CN%26nodeid%3DI2c918082018017161716854a0180449008c337a7%26commandid%3Dec647439-d697-3d2f-17bc-a316b14ea50f%23%2Fpage%2F74afc93d02a7b86e85933ac1cd1bc551', // 菜单路径
        title: 'TOF领航',
        icon: '',
        name: 'TOF领航',
        component: './subApp',
        description: '',
        actions: [
          {
            id: 102002001,
            code: 'TOF领航:查看',
            name: 'TOF领航:查看',
            method: 'GET',
            type: 'btn',
            tabUri: '//',
            description: '',
            uri: '/user/del/{$id}',
            uriFlag: '/yss-base-admin',
          },
        ],
      },

      {
        id: 101007,
        code: '产品列表',
        path:
          '/tk/smartbi?url=..%2Fsmartbix%2F%3Fintegrated%3Dtrue%26showheader%3Dfalse%26l%3Dzh_CN%26nodeid%3DI2c9180820180609360939cd40180a696f05a3e19%26commandid%3D3eb373da-b43c-fbdf-c5ad-f423a88cfd01%23%2Fpage%2Fccfaa9c00f719316c9e13e89920becf7', // 菜单路径
        title: '产品列表',
        icon: '',
        name: '产品列表',
        component: './subApp',
        description: '',
        actions: [
          {
            id: 102002001,
            code: '产品列表:查看',
            name: '产品列表:查看',
            method: 'GET',
            type: 'btn',
            tabUri: '//',
            description: '',
            uri: '/user/del/{$id}',
            uriFlag: '/yss-base-admin',
          },
        ],
      },
      {
        id: 101007,
        code: '产品360',
        path:
          '/tk/smartbi?url=..%2Fsmartbix%2F%3Fintegrated%3Dtrue%26showheader%3Dfalse%26l%3Dzh_CN%26nodeid%3DI2c9180820180609360939cd40180a696f05a3e19%26commandid%3Dd2ce889f-e379-747e-36cb-6f01f2b7936d%23%2Fpage%2Fc2e8bc61353cedf1add568dd9a1146d4', // 菜单路径
        title: '产品360',
        icon: '',
        name: '产品360',
        component: './subApp',
        description: '',
        actions: [
          {
            id: 102002001,
            code: '产品360:查看',
            name: '产品360:查看',
            method: 'GET',
            type: 'btn',
            tabUri: '//',
            description: '',
            uri: '/user/del/{$id}',
            uriFlag: '/yss-base-admin',
          },
        ],
      },
      {
        id: 101007,
        code: '产品净值',
        path:
          '/tk/smartbi?url=..%2Fsmartbix%2F%3Fintegrated%3Dtrue%26showheader%3Dfalse%26l%3Dzh_CN%26nodeid%3DI2c9180820180609360939cd40180a696f05a3e19%26commandid%3D3eb373da-b43c-fbdf-c5ad-f423a88cfd01%23%2Fpage%2Fccfaa9c00f719316c9e13e89920becf7', // 菜单路径
        title: '产品净值',
        icon: '',
        name: '产品净值',
        component: './subApp',
        description: '',
        actions: [
          {
            id: 102002001,
            code: '产品净值:查看',
            name: '产品净值:查看',
            method: 'GET',
            type: 'btn',
            tabUri: '//',
            description: '',
            uri: '/user/del/{$id}',
            uriFlag: '/yss-base-admin',
          },
        ],
      },
      {
        id: 101007,
        code: '策略分类汇总',
        path: '/tk/smartbi?url=openresource.jsp?resid=I2c9180820180609360939cd401807359f860105d', // 菜单路径
        title: '策略分类汇总',
        icon: '',
        name: '策略分类汇总',
        component: './subApp',
        description: '',
        actions: [
          {
            id: 102002001,
            code: '策略分类汇总:查看',
            name: '策略分类汇总:查看',
            method: 'GET',
            type: 'btn',
            tabUri: '//',
            description: '',
            uri: '/user/del/{$id}',
            uriFlag: '/yss-base-admin',
          },
        ],
      },
      {
        id: 101007,
        code: '产品策略360',
        path: '/tk/smartbi?url=openresource.jsp?resid=I2c9180820180609360939cd40180b6b933b15a75', // 菜单路径
        title: '产品策略360',
        icon: '',
        name: '产品策略360',
        component: './subApp',
        description: '',
        actions: [
          {
            id: 102002001,
            code: '产品策略360:查看',
            name: '产品策略360:查看',
            method: 'GET',
            type: 'btn',
            tabUri: '//',
            description: '',
            uri: '/user/del/{$id}',
            uriFlag: '/yss-base-admin',
          },
        ],
      },
      {
        id: 101007,
        code: '产品策略列表',
        path: '/tk/smartbi?url=openresource.jsp?resid=I2c918082018017161716854a01803b7bcb31126f', // 菜单路径
        title: '产品策略列表',
        icon: '',
        name: '产品策略列表',
        component: './subApp',
        description: '',
        actions: [
          {
            id: 102002001,
            code: '产品策略列表:查看',
            name: '产品策略列表:查看',
            method: 'GET',
            type: 'btn',
            tabUri: '//',
            description: '',
            uri: '/user/del/{$id}',
            uriFlag: '/yss-base-admin',
          },
        ],
      },
      {
        id: 101007,
        code: '产品分类360',
        path: '/tk/smartbi?url=openresource.jsp?resid=I2c9180820180609360939cd40180b6c393935def', // 菜单路径
        title: '产品分类360',
        icon: '',
        name: '产品分类360',
        component: './subApp',
        description: '',
        actions: [
          {
            id: 102002001,
            code: '产品分类360:查看',
            name: '产品分类360:查看',
            method: 'GET',
            type: 'btn',
            tabUri: '//',
            description: '',
            uri: '/user/del/{$id}',
            uriFlag: '/yss-base-admin',
          },
        ],
      },
      {
        id: 101007,
        code: '产品分类汇总',
        path: '/tk/smartbi?url=openresource.jsp?resid=I2c9180820180609360939cd401807337ca3003e0', // 菜单路径
        title: '产品分类汇总',
        icon: '',
        name: '产品分类汇总',
        component: './subApp',
        description: '',
        actions: [
          {
            id: 102002001,
            code: '产品分类汇总:查看',
            name: '产品分类汇总:查看',
            method: 'GET',
            type: 'btn',
            tabUri: '//',
            description: '',
            uri: '/user/del/{$id}',
            uriFlag: '/yss-base-admin',
          },
        ],
      },
      {
        id: 101007,
        code: '产品分类交易汇总',
        path: '/tk/smartbi?url=openresource.jsp?resid=I2c9180820180609360939cd40180737308ce1793', // 菜单路径
        title: '产品分类交易汇总',
        icon: '',
        name: '产品分类交易汇总',
        component: './subApp',
        description: '',
        actions: [
          {
            id: 102002001,
            code: '产品分类交易汇总:查看',
            name: '产品分类交易汇总:查看',
            method: 'GET',
            type: 'btn',
            tabUri: '//',
            description: '',
            uri: '/user/del/{$id}',
            uriFlag: '/yss-base-admin',
          },
        ],
      },
      {
        id: 101007,
        code: '产品分类列表',
        path: '/tk/smartbi?url=openresource.jsp?resid=I2c918082018017161716854a018045e271895c6a', // 菜单路径
        title: '产品分类列表',
        icon: '',
        name: '产品分类列表',
        component: './subApp',
        description: '',
        actions: [
          {
            id: 102002001,
            code: '产品分类列表:查看',
            name: '产品分类列表:查看',
            method: 'GET',
            type: 'btn',
            tabUri: '//',
            description: '',
            uri: '/user/del/{$id}',
            uriFlag: '/yss-base-admin',
          },
        ],
      },
      {
        id: 101007,
        code: '产品分类收入汇总',
        path: '/tk/smartbi?url=openresource.jsp?resid=I2c9180820180609360939cd4018073bf25ba24bc', // 菜单路径
        title: '产品分类收入汇总',
        icon: '',
        name: '产品分类收入汇总',
        component: './subApp',
        description: '',
        actions: [
          {
            id: 102002001,
            code: '产品分类收入汇总:查看',
            name: '产品分类收入汇总:查看',
            method: 'GET',
            type: 'btn',
            tabUri: '//',
            description: '',
            uri: '/user/del/{$id}',
            uriFlag: '/yss-base-admin',
          },
        ],
      },
      {
        id: 101007,
        code: '产品交易汇总',
        path: '/tk/smartbi?url=openresource.jsp?resid=I2c9180820180609360939cd40180736b247114c8', // 菜单路径
        title: '产品交易汇总',
        icon: '',
        name: '产品交易汇总',
        component: './subApp',
        description: '',
        actions: [
          {
            id: 102002001,
            code: '产品交易汇总:查看',
            name: '产品交易汇总:查看',
            method: 'GET',
            type: 'btn',
            tabUri: '//',
            description: '',
            uri: '/user/del/{$id}',
            uriFlag: '/yss-base-admin',
          },
        ],
      },
      {
        id: 101007,
        code: '产品收入汇总',
        path: '/tk/smartbi?url=openresource.jsp?resid=I2c9180820180609360939cd4018073b9e94722e1', // 菜单路径
        title: '产品收入汇总',
        icon: '',
        name: '产品收入汇总',
        component: './subApp',
        description: '',
        actions: [
          {
            id: 102002001,
            code: '产品收入汇总:查看',
            name: '产品收入汇总:查看',
            method: 'GET',
            type: 'btn',
            tabUri: '//',
            description: '',
            uri: '/user/del/{$id}',
            uriFlag: '/yss-base-admin',
          },
        ],
      },
      {
        id: 101007,
        code: '矩阵分析',
        path:
          '/tk/smartbi?url=../smartbix/?integrated=true&showheader=false&l=zh_CN&nodeid=I2c918082018017161716854a018044bbad153e3f&commandid=b6965674-42e1-bdb8-a96e-b91629c124b0#/page/74d708cfffbb0cdcebe0c6b918dda96e', // 菜单路径
        title: '矩阵分析',
        icon: '',
        name: '矩阵分析',
        component: './subApp',
        description: '',
        actions: [
          {
            id: 102002001,
            code: '矩阵分析:查看',
            name: '矩阵分析:查看',
            method: 'GET',
            type: 'btn',
            tabUri: '//',
            description: '',
            uri: '/user/del/{$id}',
            uriFlag: '/yss-base-admin',
          },
        ],
      },

      {
        id: 101007,
        code: '客户持有汇总',
        path: '/tk/smartbi?url=openresource.jsp?resid=I2c918082018017161716854a018046487c776c85', // 菜单路径
        title: '客户持有汇总',
        icon: '',
        name: '客户持有汇总',
        component: './subApp',
        description: '',
        actions: [
          {
            id: 102002001,
            code: '客户持有汇总:查看',
            name: '客户持有汇总:查看',
            method: 'GET',
            type: 'btn',
            tabUri: '//',
            description: '',
            uri: '/user/del/{$id}',
            uriFlag: '/yss-base-admin',
          },
        ],
      },
      {
        id: 101007,
        code: '客户分类360',
        path: '/tk/smartbi?url=openresource.jsp?resid=I2c9180820180609360939cd40180b6c184b75cf8', // 菜单路径
        title: '客户分类360',
        icon: '',
        name: '客户分类360',
        component: './subApp',
        description: '',
        actions: [
          {
            id: 102002001,
            code: '客户分类360:查看',
            name: '客户分类360:查看',
            method: 'GET',
            type: 'btn',
            tabUri: '//',
            description: '',
            uri: '/user/del/{$id}',
            uriFlag: '/yss-base-admin',
          },
        ],
      },
      {
        id: 101007,
        code: '客户分类持有汇总',
        path: '/tk/smartbi?url=openresource.jsp?resid=I2c918082018017161716854a018046532b9f6f64', // 菜单路径
        title: '客户分类持有汇总',
        icon: '',
        name: '客户分类持有汇总',
        component: './subApp',
        description: '',
        actions: [
          {
            id: 102002001,
            code: '客户分类持有汇总:查看',
            name: '客户分类持有汇总:查看',
            method: 'GET',
            type: 'btn',
            tabUri: '//',
            description: '',
            uri: '/user/del/{$id}',
            uriFlag: '/yss-base-admin',
          },
        ],
      },
      {
        id: 101007,
        code: '客户分类交易日汇总',
        path: '/tk/smartbi?url=openresource.jsp?resid=I2c918082018017161716854a0180465d211e7412',
        title: '客户分类交易日汇总',
        icon: '',
        name: '客户分类交易日汇总',
        component: './subApp',
        description: '',
        actions: [
          {
            id: 102002001,
            code: '客户分类交易日汇总:查看',
            name: '客户分类交易日汇总:查看',
            method: 'GET',
            type: 'btn',
            tabUri: '//',
            description: '',
            uri: '/user/del/{$id}',
            uriFlag: '/yss-base-admin',
          },
        ],
      },
      {
        id: 101007,
        code: '客户分类收入汇总列表',
        path: '/tk/smartbi?url=openresource.jsp?resid=I2c918082018017161716854a01804ae2bced35f9', // 菜单路径
        title: '客户分类收入汇总列表',
        icon: '',
        name: '客户分类收入汇总列表',
        component: './subApp',
        description: '',
        actions: [
          {
            id: 102002001,
            code: '客户分类收入汇总列表:查看',
            name: '客户分类收入汇总列表:查看',
            method: 'GET',
            type: 'btn',
            tabUri: '//',
            description: '',
            uri: '/user/del/{$id}',
            uriFlag: '/yss-base-admin',
          },
        ],
      },
      {
        id: 101007,
        code: '客户交易明细',
        path: '/tk/smartbi?url=openresource.jsp?resid=I2c918082018017161716854a01804663463e7510', // 菜单路径
        title: '客户交易明细',
        icon: '',
        name: '客户交易明细',
        component: './subApp',
        description: '',
        actions: [
          {
            id: 102002001,
            code: '客户交易明细:查看',
            name: '客户交易明细:查看',
            method: 'GET',
            type: 'btn',
            tabUri: '//',
            description: '',
            uri: '/user/del/{$id}',
            uriFlag: '/yss-base-admin',
          },
        ],
      },
      {
        id: 101007,
        code: '客户交易日汇总',
        path: '/tk/smartbi?url=openresource.jsp?resid=I2c918082018017161716854a0180466ec82e78c6', // 菜单路径
        title: '客户交易日汇总',
        icon: '',
        name: '客户交易日汇总',
        component: './subApp',
        description: '',
        actions: [
          {
            id: 102002001,
            code: '客户交易日汇总:查看',
            name: '客户交易日汇总:查看',
            method: 'GET',
            type: 'btn',
            tabUri: '//',
            description: '',
            uri: '/user/del/{$id}',
            uriFlag: '/yss-base-admin',
          },
        ],
      },
      {
        id: 101007,
        code: '客户类型-产品类型持有分类汇总',
        path: '/tk/smartbi?url=openresource.jsp?resid=I2c918082018017161716854a01804675aea07cc1', // 菜单路径
        title: '客户类型-产品类型持有分类汇总',
        icon: '',
        name: '客户类型-产品类型持有分类汇总',
        component: './subApp',
        description: '',
        actions: [
          {
            id: 102002001,
            code: '客户类型-产品类型持有分类汇总:查看',
            name: '客户类型-产品类型持有分类汇总:查看',
            method: 'GET',
            type: 'btn',
            tabUri: '//',
            description: '',
            uri: '/user/del/{$id}',
            uriFlag: '/yss-base-admin',
          },
        ],
      },
      {
        id: 101007,
        code: '客户类型-产品类型分类汇总',
        path: '/tk/smartbi?url=openresource.jsp?resid=I2c918082018017161716854a01804b26ef903b64', // 菜单路径
        title: '客户类型-产品类型分类汇总',
        icon: '',
        name: '客户类型-产品类型分类汇总',
        component: './subApp',
        description: '',
        actions: [
          {
            id: 102002001,
            code: '客户类型-产品类型分类汇总:查看',
            name: '客户类型-产品类型分类汇总:查看',
            method: 'GET',
            type: 'btn',
            tabUri: '//',
            description: '',
            uri: '/user/del/{$id}',
            uriFlag: '/yss-base-admin',
          },
        ],
      },
      {
        id: 101007,
        code: '客户类型-产品类型交易分类汇总',
        path: '/tk/smartbi?url=openresource.jsp?resid=I2c918082018017161716854a01804b2d9b103da9', // 菜单路径
        title: '客户类型-产品类型交易分类汇总',
        icon: '',
        name: '客户类型-产品类型交易分类汇总',
        component: './subApp',
        description: '',
        actions: [
          {
            id: 102002001,
            code: '客户类型-产品类型交易分类汇总:查看',
            name: '客户类型-产品类型交易分类汇总:查看',
            method: 'GET',
            type: 'btn',
            tabUri: '//',
            description: '',
            uri: '/user/del/{$id}',
            uriFlag: '/yss-base-admin',
          },
        ],
      },
      {
        id: 101007,
        code: '客户列表',
        path: '/tk/smartbi?url=openresource.jsp?resid=I2c9180820180609360939cd40180984f2509106b', // 菜单路径
        title: '客户列表',
        icon: '',
        name: '客户列表',
        component: './subApp',
        description: '',
        actions: [
          {
            id: 102002001,
            code: '客户列表:查看',
            name: '客户列表:查看',
            method: 'GET',
            type: 'btn',
            tabUri: '//',
            description: '',
            uri: '/user/del/{$id}',
            uriFlag: '/yss-base-admin',
          },
        ],
      },
      {
        id: 101007,
        code: '客户收入汇总列表',
        path: '/tk/smartbi?url=openresource.jsp?resid=I2c918082018017161716854a01804b4ad1934150', // 菜单路径
        title: '客户收入汇总列表',
        icon: '',
        name: '客户收入汇总列表',
        component: './subApp',
        description: '',
        actions: [
          {
            id: 102002001,
            code: '客户收入汇总列表:查看',
            name: '客户收入汇总列表:查看',
            method: 'GET',
            type: 'btn',
            tabUri: '//',
            description: '',
            uri: '/user/del/{$id}',
            uriFlag: '/yss-base-admin',
          },
        ],
      },

      {
        id: 101007,
        code: '整体情况',
        path: '/tk/smartbi?url=openresource.jsp?resid=I2c918082018017161716854a0180456a17ca4aef', // 菜单路径
        title: '整体情况',
        icon: '',
        name: '整体情况',
        component: './subApp',
        description: '',
        actions: [
          {
            id: 102002001,
            code: '整体情况:查看',
            name: '整体情况:查看',
            method: 'GET',
            type: 'btn',
            tabUri: '//',
            description: '',
            uri: '/user/del/{$id}',
            uriFlag: '/yss-base-admin',
          },
        ],
      },
      {
        id: 101007,
        code: '规模：市占率对标保险资管TOP10',
        path: '/tk/smartbi?url=openresource.jsp?resid=I2c918082018017161716854a0180457af8a14ff9', // 菜单路径
        title: '规模：市占率对标保险资管TOP10',
        icon: '',
        name: '规模：市占率对标保险资管TOP10',
        component: './subApp',
        description: '',
        actions: [
          {
            id: 102002001,
            code: '规模：市占率对标保险资管TOP10:查看',
            name: '规模：市占率对标保险资管TOP10:查看',
            method: 'GET',
            type: 'btn',
            tabUri: '//',
            description: '',
            uri: '/user/del/{$id}',
            uriFlag: '/yss-base-admin',
          },
        ],
      },
      {
        id: 101007,
        code: '规模：增长率①对标保险资管（TOP10）',
        path: '/tk/smartbi?url=openresource.jsp?resid=I2c918082018017161716854a0180458b8325545e', // 菜单路径
        title: '规模：增长率①对标保险资管（TOP10）',
        icon: '',
        name: '规模：增长率①对标保险资管（TOP10）',
        component: './subApp',
        description: '',
        actions: [
          {
            id: 102002001,
            code: '规模：增长率①对标保险资管（TOP10）:查看',
            name: '规模：增长率①对标保险资管（TOP10）:查看',
            method: 'GET',
            type: 'btn',
            tabUri: '//',
            description: '',
            uri: '/user/del/{$id}',
            uriFlag: '/yss-base-admin',
          },
        ],
      },
      {
        id: 101007,
        code: '规模：增长率②对标公募专户',
        path: '/tk/smartbi?url=openresource.jsp?resid=I2c918082018017161716854a018045992113575a', // 菜单路径
        title: '规模：增长率②对标公募专户',
        icon: '',
        name: '规模：增长率②对标公募专户',
        component: './subApp',
        description: '',
        actions: [
          {
            id: 102002001,
            code: '规模：对标公募专户:查看',
            name: '规模：对标公募专户:查看',
            method: 'GET',
            type: 'btn',
            tabUri: '//',
            description: '',
            uri: '/user/del/{$id}',
            uriFlag: '/yss-base-admin',
          },
        ],
      },
      {
        id: 101007,
        code: '资管产品收入结构',
        path: '/tk/smartbi?url=openresource.jsp?resid=I2c918082018017161716854a018045d942235b0a', // 菜单路径
        title: '资管产品收入结构',
        icon: '',
        name: '资管产品收入结构',
        component: './subApp',
        description: '',
        actions: [
          {
            id: 102002001,
            code: '资管产品收入结构:查看',
            name: '资管产品收入结构:查看',
            method: 'GET',
            type: 'btn',
            tabUri: '//',
            description: '',
            uri: '/user/del/{$id}',
            uriFlag: '/yss-base-admin',
          },
        ],
      },
      {
        id: 101007,
        code: '资管产品投资者结构',
        path: '/tk/smartbi?url=openresource.jsp?resid=I2c918082018017161716854a018045f1dd8661bb', // 菜单路径
        title: '资管产品投资者结构',
        icon: '',
        name: '资管产品投资者结构',
        component: './subApp',
        description: '',
        actions: [
          {
            id: 102002001,
            code: '资管产品投资者结构:查看',
            name: '资管产品投资者结构:查看',
            method: 'GET',
            type: 'btn',
            tabUri: '//',
            description: '',
            uri: '/user/del/{$id}',
            uriFlag: '/yss-base-admin',
          },
        ],
      },
      {
        id: 101007,
        code: '资管产品业绩表现',
        path: '/tk/smartbi?url=openresource.jsp?resid=I2c918082018017161716854a01804616185b66b8', // 菜单路径
        title: '资管产品业绩表现',
        icon: '',
        name: '资管产品业绩表现',
        component: './subApp',
        description: '',
        actions: [
          {
            id: 102002001,
            code: '资管产品业绩表现:查看',
            name: '资管产品业绩表现:查看',
            method: 'GET',
            type: 'btn',
            tabUri: '//',
            description: '',
            uri: '/user/del/{$id}',
            uriFlag: '/yss-base-admin',
          },
        ],
      },
      {
        id: 101007,
        code: '业绩分布区间①对标公募',
        path: '/tk/smartbi?url=openresource.jsp?resid=I2c918082018017161716854a018044907fec37b5', // 菜单路径
        title: '业绩分布区间①对标公募',
        icon: '',
        name: '业绩分布区间①对标公募',
        component: './subApp',
        description: '',
        actions: [
          {
            id: 102002001,
            code: '业绩分布区间①对标公募:查看',
            name: '业绩分布区间①对标公募:查看',
            method: 'GET',
            type: 'btn',
            tabUri: '//',
            description: '',
            uri: '/user/del/{$id}',
            uriFlag: '/yss-base-admin',
          },
        ],
      },
      {
        id: 101007,
        code: '业绩分布区间对标保险资管1',
        path: '/tk/smartbi?url=openresource.jsp?resid=I2c918082018017161716854a0180460104f063c3', // 菜单路径
        title: '业绩分布区间对标保险资管1',
        icon: '',
        name: '业绩分布区间对标保险资管1',
        component: './subApp',
        description: '',
        actions: [
          {
            id: 102002001,
            code: '业绩分布区间对标保险资管1:查看',
            name: '业绩分布区间对标保险资管1:查看',
            method: 'GET',
            type: 'btn',
            tabUri: '//',
            description: '',
            uri: '/user/del/{$id}',
            uriFlag: '/yss-base-admin',
          },
        ],
      },
      {
        id: 101007,
        code: '业绩分布区间对标保险资管2',
        path: '/tk/smartbi?url=openresource.jsp?resid=I2c918082018017161716854a018046002a716370', // 菜单路径
        title: '业绩分布区间对标保险资管2',
        icon: '',
        name: '业绩分布区间对标保险资管2',
        component: './subApp',
        description: '',
        actions: [
          {
            id: 102002001,
            code: '业绩分布区间对标保险资管2:查看',
            name: '业绩分布区间对标保险资管2:查看',
            method: 'GET',
            type: 'btn',
            tabUri: '//',
            description: '',
            uri: '/user/del/{$id}',
            uriFlag: '/yss-base-admin',
          },
        ],
      },
      {
        id: 101007,
        code: '资产配置：对标保险资管',
        path: '/tk/smartbi?url=openresource.jsp?resid=I2c918082018017161716854a018045eb76de5fc7', // 菜单路径
        title: '资产配置：对标保险资管',
        icon: '',
        name: '资产配置：对标保险资管',
        component: './subApp',
        description: '',
        actions: [
          {
            id: 102002001,
            code: '资产配置：对标保险资管:查看',
            name: '资产配置：对标保险资管:查看',
            method: 'GET',
            type: 'btn',
            tabUri: '//',
            description: '',
            uri: '/user/del/{$id}',
            uriFlag: '/yss-base-admin',
          },
        ],
      },
      {
        id: 101007,
        code: '规模、收入',
        path: '/tk/smartbi?url=openresource.jsp?resid=I2c9180820180609360939cd40180a7d1f94e50fa', // 菜单路径
        title: '规模、收入',
        icon: '',
        name: '规模、收入',
        component: './subApp',
        description: '',
        actions: [
          {
            id: 102002001,
            code: '规模、收入:查看',
            name: '规模、收入:查看',
            method: 'GET',
            type: 'btn',
            tabUri: '//',
            description: '',
            uri: '/user/del/{$id}',
            uriFlag: '/yss-base-admin',
          },
        ],
      },
      {
        id: 101007,
        code: '规模：市占率对标同业（TOP10）',
        path: '/tk/smartbi?url=openresource.jsp?resid=I2c9180820180609360939cd40180742f7f7d4d55', // 菜单路径
        title: '规模：市占率对标同业（TOP10）',
        icon: '',
        name: '规模：市占率对标同业（TOP10）',
        component: './subApp',
        description: '',
        actions: [
          {
            id: 102002001,
            code: '规模：市占率对标同业（TOP10）:查看',
            name: '规模：市占率对标同业（TOP10）:查看',
            method: 'GET',
            type: 'btn',
            tabUri: '//',
            description: '',
            uri: '/user/del/{$id}',
            uriFlag: '/yss-base-admin',
          },
        ],
      },
      {
        id: 101007,
        code: '规模：增长率对标同业（TOP10）',
        path: '/tk/smartbi?url=openresource.jsp?resid=I2c9180820180609360939cd40180925708c30b39', // 菜单路径
        title: '规模：增长率对标同业（TOP10）',
        icon: '',
        name: '规模：增长率对标同业（TOP10）',
        component: './subApp',
        description: '',
        actions: [
          {
            id: 102002001,
            code: '规模：增长率对标同业（TOP10）:查看',
            name: '规模：增长率对标同业（TOP10）:查看',
            method: 'GET',
            type: 'btn',
            tabUri: '//',
            description: '',
            uri: '/user/del/{$id}',
            uriFlag: '/yss-base-admin',
          },
        ],
      },
      {
        id: 101007,
        code: '养老金产品收入结构',
        path: '/tk/smartbi?url=openresource.jsp?resid=I2c9180820180609360939cd40180a7cd82ca5035', // 菜单路径
        title: '养老金产品收入结构',
        icon: '',
        name: '养老金产品收入结构',
        component: './subApp',
        description: '',
        actions: [
          {
            id: 102002001,
            code: '养老金产品收入结构:查看',
            name: '养老金产品收入结构:查看',
            method: 'GET',
            type: 'btn',
            tabUri: '//',
            description: '',
            uri: '/user/del/{$id}',
            uriFlag: '/yss-base-admin',
          },
        ],
      },
      {
        id: 101007,
        code: '养老金产品投资者结构',
        path: '/tk/smartbi?url=openresource.jsp?resid=I2c9180820180599d599db03101805abdb69516d3', // 菜单路径
        title: '养老金产品投资者结构',
        icon: '',
        name: '养老金产品投资者结构',
        component: './subApp',
        description: '',
        actions: [
          {
            id: 102002001,
            code: '养老金产品投资者结构:查看',
            name: '养老金产品投资者结构:查看',
            method: 'GET',
            type: 'btn',
            tabUri: '//',
            description: '',
            uri: '/user/del/{$id}',
            uriFlag: '/yss-base-admin',
          },
        ],
      },
      {
        id: 101007,
        code: '养老金产品业绩表现',
        path: '/tk/smartbi?url=openresource.jsp?resid=I2c918082018017161716854a01802764eb1b5cc7', // 菜单路径
        title: '养老金产品业绩表现',
        icon: '',
        name: '养老金产品业绩表现',
        component: './subApp',
        description: '',
        actions: [
          {
            id: 102002001,
            code: '养老金产品业绩表现:查看',
            name: '养老金产品业绩表现:查看',
            method: 'GET',
            type: 'btn',
            tabUri: '//',
            description: '',
            uri: '/user/del/{$id}',
            uriFlag: '/yss-base-admin',
          },
        ],
      },
      {
        id: 101007,
        code: '产品线完整线①策略分布（产品线完整性）',
        path: '/tk/smartbi?url=openresource.jsp?resid=I2c918082018017161716854a01802199377b3495', // 菜单路径
        title: '产品线完整线①策略分布（产品线完整性）',
        icon: '',
        name: '产品线完整线①策略分布（产品线完整性）',
        component: './subApp',
        description: '',
        actions: [
          {
            id: 102002001,
            code: '产品线完整线①策略分布（产品线完整性）:查看',
            name: '产品线完整线①策略分布（产品线完整性）:查看',
            method: 'GET',
            type: 'btn',
            tabUri: '//',
            description: '',
            uri: '/user/del/{$id}',
            uriFlag: '/yss-base-admin',
          },
        ],
      },
      {
        id: 101007,
        code: '产品线完整性②客群覆盖（产品线完整性）',
        path: '/tk/smartbi?url=openresource.jsp?resid=I2c918082018017161716854a0180465a774d73da', // 菜单路径
        title: '产品线完整性②客群覆盖（产品线完整性）',
        icon: '',
        name: '产品线完整性②客群覆盖（产品线完整性）',
        component: './subApp',
        description: '',
        actions: [
          {
            id: 102002001,
            code: '产品线完整性②客群覆盖（产品线完整性）:查看',
            name: '产品线完整性②客群覆盖（产品线完整性）:查看',
            method: 'GET',
            type: 'btn',
            tabUri: '//',
            description: '',
            uri: '/user/del/{$id}',
            uriFlag: '/yss-base-admin',
          },
        ],
      },
      {
        id: 101007,
        code: '产品矩阵-集合产品（竞争力分析）',
        path: '/tk/smartbi?url=openresource.jsp?resid=I2c918082018017161716854a01804b9800674ac7', // 菜单路径
        title: '产品矩阵-集合产品（竞争力分析）',
        icon: '',
        name: '产品矩阵-集合产品（竞争力分析）',
        component: './subApp',
        description: '',
        actions: [
          {
            id: 102002001,
            code: '产品矩阵-集合产品（竞争力分析）:查看',
            name: '产品矩阵-集合产品（竞争力分析）:查看',
            method: 'GET',
            type: 'btn',
            tabUri: '//',
            description: '',
            uri: '/user/del/{$id}',
            uriFlag: '/yss-base-admin',
          },
        ],
      },
      {
        id: 101007,
        code: '附：规模区间-对标同业（竞争力分析）',
        path: '/tk/smartbi?url=openresource.jsp?resid=I2c9180820180609360939cd4018069ddc0845898', // 菜单路径
        title: '附：规模区间-对标同业（竞争力分析）',
        icon: '',
        name: '附：规模区间-对标同业（竞争力分析）',
        component: './subApp',
        description: '',
        actions: [
          {
            id: 102002001,
            code: '附：规模区间-对标同业（竞争力分析）:查看',
            name: '附：规模区间-对标同业（竞争力分析）:查看',
            method: 'GET',
            type: 'btn',
            tabUri: '//',
            description: '',
            uri: '/user/del/{$id}',
            uriFlag: '/yss-base-admin',
          },
        ],
      },
      {
        id: 101007,
        code: '附：客户画像（竞争力分析）',
        path: '/tk/smartbi?url=openresource.jsp?resid=I2c918082018017161716854a01801c45e3970b4a', // 菜单路径
        title: '附：客户画像（竞争力分析）',
        icon: '',
        name: '附：客户画像（竞争力分析）',
        component: './subApp',
        description: '',
        actions: [
          {
            id: 102002001,
            code: '附：客户画像（竞争力分析）:查看',
            name: '附：客户画像（竞争力分析）:查看',
            method: 'GET',
            type: 'btn',
            tabUri: '//',
            description: '',
            uri: '/user/del/{$id}',
            uriFlag: '/yss-base-admin',
          },
        ],
      },
      {
        id: 101007,
        code: '客户定制产品：基石TOP10（竞争力分析）',
        path: '/tk/smartbi?url=openresource.jsp?resid=I2c918082018017161716854a01804f2f6edd57a9', // 菜单路径
        title: '客户定制产品：基石TOP10（竞争力分析）',
        icon: '',
        name: '客户定制产品：基石TOP10（竞争力分析）',
        component: './subApp',
        description: '',
        actions: [
          {
            id: 102002001,
            code: '客户定制产品：基石TOP10（竞争力分析）:查看',
            name: '客户定制产品：基石TOP10（竞争力分析）:查看',
            method: 'GET',
            type: 'btn',
            tabUri: '//',
            description: '',
            uri: '/user/del/{$id}',
            uriFlag: '/yss-base-admin',
          },
        ],
      },
      {
        id: 101007,
        code: '客户定制产品：战略TOP10（竞争力分析）',
        path: '/tk/smartbi?url=openresource.jsp?resid=I2c918082018017161716854a01804f30e6de57da', // 菜单路径
        title: '客户定制产品：战略TOP10（竞争力分析）',
        icon: '',
        name: '客户定制产品：战略TOP10（竞争力分析）',
        component: './subApp',
        description: '',
        actions: [
          {
            id: 102002001,
            code: '客户定制产品：战略TOP10（竞争力分析）:查看',
            name: '客户定制产品：战略TOP10（竞争力分析）:查看',
            method: 'GET',
            type: 'btn',
            tabUri: '//',
            description: '',
            uri: '/user/del/{$id}',
            uriFlag: '/yss-base-admin',
          },
        ],
      },
      {
        id: 101007,
        code: '投连专户业绩检视',
        path: '/tk/smartbi?url=openresource.jsp?resid=I2c918082018017161716854a018020b73d282acf', // 菜单路径
        title: '投连专户业绩检视',
        icon: '',
        name: '投连专户业绩检视',
        component: './subApp',
        description: '',
        actions: [
          {
            id: 102002001,
            code: '投连专户业绩检视:查看',
            name: '投连专户业绩检视:查看',
            method: 'GET',
            type: 'btn',
            tabUri: '//',
            description: '',
            uri: '/user/del/{$id}',
            uriFlag: '/yss-base-admin',
          },
        ],
      },
      {
        id: 101007,
        code: '年金受托直投产品情况',
        path: '/tk/smartbi?url=openresource.jsp?resid=I2c918082018017161716854a018022637b223c35', // 菜单路径
        title: '年金受托直投产品情况',
        icon: '',
        name: '年金受托直投产品情况',
        component: './subApp',
        description: '',
        actions: [
          {
            id: 102002001,
            code: '年金受托直投产品情况:查看',
            name: '年金受托直投产品情况:查看',
            method: 'GET',
            type: 'btn',
            tabUri: '//',
            description: '',
            uri: '/user/del/{$id}',
            uriFlag: '/yss-base-admin',
          },
        ],
      },
      {
        id: 101007,
        code: '竞争力分析',
        path: '/tk/smartbi?url=openresource.jsp?resid=I2c9180820180609360939cd40180a7dc9dd15149', // 菜单路径
        title: '竞争力分析',
        icon: '',
        name: '竞争力分析',
        component: './subApp',
        description: '',
        actions: [
          {
            id: 102002001,
            code: '竞争力分析:查看',
            name: '竞争力分析:查看',
            method: 'GET',
            type: 'btn',
            tabUri: '//',
            description: '',
            uri: '/user/del/{$id}',
            uriFlag: '/yss-base-admin',
          },
        ],
      },
      {
        id: 101007,
        code: '产品竞争力分析',
        path: '/tk/smartbi?url=openresource.jsp?resid=I2c9180820180609360939cd401806a46dfd36561', // 菜单路径
        title: '产品竞争力分析',
        icon: '',
        name: '产品竞争力分析',
        component: './subApp',
        description: '',
        actions: [
          {
            id: 102002001,
            code: '产品竞争力分析:查看',
            name: '产品竞争力分析:查看',
            method: 'GET',
            type: 'btn',
            tabUri: '//',
            description: '',
            uri: '/user/del/{$id}',
            uriFlag: '/yss-base-admin',
          },
        ],
      },

      {
        id: 101007,
        code: '月整体情况',
        path: '/tk/smartbi?url=openresource.jsp?resid=I2c918082018017161716854a01804ed8fbcf4d4f', // 菜单路径
        title: '月整体情况',
        icon: '',
        name: '月整体情况',
        component: './subApp',
        description: '',
        actions: [
          {
            id: 102002001,
            code: '月整体情况:查看',
            name: '月整体情况:查看',
            method: 'GET',
            type: 'btn',
            tabUri: '//',
            description: '',
            uri: '/user/del/{$id}',
            uriFlag: '/yss-base-admin',
          },
        ],
      },
      {
        id: 101007,
        code: '投连产品-资金流情况',
        path: '/tk/smartbi?url=openresource.jsp?resid=I2c918082018017161716854a01804f4a14125aa0', // 菜单路径
        title: '投连产品-资金流情况',
        icon: '',
        name: '投连产品-资金流情况',
        component: './subApp',
        description: '',
        actions: [
          {
            id: 102002001,
            code: '投连产品-资金流情况:查看',
            name: '投连产品-资金流情况:查看',
            method: 'GET',
            type: 'btn',
            tabUri: '//',
            description: '',
            uri: '/user/del/{$id}',
            uriFlag: '/yss-base-admin',
          },
        ],
      },
      {
        id: 101007,
        code: '资管产品：（1） 固收：月固收纯债类产品整体盘点',
        path: '/tk/smartbi?url=openresource.jsp?resid=I2c918082018017161716854a01803a7139a60c24r', // 菜单路径
        title: '资管产品：（1） 固收：月固收纯债类产品整体盘点',
        icon: '',
        name: '资管产品：（1） 固收：月固收纯债类产品整体盘点',
        component: './subApp',
        description: '',
        actions: [
          {
            id: 102002001,
            code: '资管产品：（1） 固收：月固收纯债类产品整体盘点:查看',
            name: '资管产品：（1） 固收：月固收纯债类产品整体盘点:查看',
            method: 'GET',
            type: 'btn',
            tabUri: '//',
            description: '',
            uri: '/user/del/{$id}',
            uriFlag: '/yss-base-admin',
          },
        ],
      },
      {
        id: 101007,
        code: '资管产品：（2） 固收+：集合固收+',
        path: '/tk/smartbi?url=openresource.jsp?resid=I2c918082018017161716854a01803a7447210c4a', // 菜单路径
        title: '资管产品：（2） 固收+：集合固收+',
        icon: '',
        name: '资管产品：（2） 固收+：集合固收+',
        component: './subApp',
        description: '',
        actions: [
          {
            id: 102002001,
            code: '资管产品：（2） 固收+：集合固收+:查看',
            name: '资管产品：（2） 固收+：集合固收+:查看',
            method: 'GET',
            type: 'btn',
            tabUri: '//',
            description: '',
            uri: '/user/del/{$id}',
            uriFlag: '/yss-base-admin',
          },
        ],
      },
      {
        id: 101007,
        code: '资管产品：（2） 固收+：定制固收+',
        path: '/tk/smartbi?url=openresource.jsp?resid=I2c918082018017161716854a01803a756fad0c68', // 菜单路径
        title: '资管产品：（2） 固收+：定制固收+',
        icon: '',
        name: '资管产品：（2） 固收+：定制固收+',
        component: './subApp',
        description: '',
        actions: [
          {
            id: 102002001,
            code: '资管产品：（2） 固收+：定制固收+:查看',
            name: '资管产品：（2） 固收+：定制固收+:查看',
            method: 'GET',
            type: 'btn',
            tabUri: '//',
            description: '',
            uri: '/user/del/{$id}',
            uriFlag: '/yss-base-admin',
          },
        ],
      },
      {
        id: 101007,
        code: '资管产品：（2） 固收+：打新产品',
        path: '/tk/smartbi?url=openresource.jsp?resid=I2c918082018017161716854a01803a76c4050cad', // 菜单路径
        title: '资管产品：（2） 固收+：打新产品',
        icon: '',
        name: '资管产品：（2） 固收+：打新产品',
        component: './subApp',
        description: '',
        actions: [
          {
            id: 102002001,
            code: '资管产品：（2） 固收+：打新产品:查看',
            name: '资管产品：（2） 固收+：打新产品:查看',
            method: 'GET',
            type: 'btn',
            tabUri: '//',
            description: '',
            uri: '/user/del/{$id}',
            uriFlag: '/yss-base-admin',
          },
        ],
      },
      {
        id: 101007,
        code: '资管产品：（2） 固收+：其他产品',
        path: '/tk/smartbi?url=openresource.jsp?resid=I2c918082018017161716854a01803a770a9b0cb0', // 菜单路径
        title: '资管产品：（2） 固收+：其他产品',
        icon: '',
        name: '资管产品：（2） 固收+：其他产品',
        component: './subApp',
        description: '',
        actions: [
          {
            id: 102002001,
            code: '资管产品：（2） 固收+：其他产品:查看',
            name: '资管产品：（2） 固收+：其他产品:查看',
            method: 'GET',
            type: 'btn',
            tabUri: '//',
            description: '',
            uri: '/user/del/{$id}',
            uriFlag: '/yss-base-admin',
          },
        ],
      },
      {
        id: 101007,
        code: '资管产品 （3）权益',
        path: '/tk/smartbi?url=openresource.jsp?resid=I2c918082018017161716854a01803aa05cd30d5a', // 菜单路径
        title: '资管产品 （3）权益',
        icon: '',
        name: '资管产品 （3）权益',
        component: './subApp',
        description: '',
        actions: [
          {
            id: 102002001,
            code: '资管产品 （3）权益:查看',
            name: '资管产品 （3）权益:查看',
            method: 'GET',
            type: 'btn',
            tabUri: '//',
            description: '',
            uri: '/user/del/{$id}',
            uriFlag: '/yss-base-admin',
          },
        ],
      },
      {
        id: 101007,
        code: '资管产品：（3）权益：无主题产品',
        path: '/tk/smartbi?url=openresource.jsp?resid=I2c9180820180504f504f95d80180506e061e0702', // 菜单路径
        title: '资管产品：（3）权益：无主题产品',
        icon: '',
        name: '资管产品：（3）权益：无主题产品',
        component: './subApp',
        description: '',
        actions: [
          {
            id: 102002001,
            code: '资管产品：（3）权益：无主题产品:查看',
            name: '资管产品：（3）权益：无主题产品:查看',
            method: 'GET',
            type: 'btn',
            tabUri: '//',
            description: '',
            uri: '/user/del/{$id}',
            uriFlag: '/yss-base-admin',
          },
        ],
      },
      {
        id: 101007,
        code: '资管产品：（3）权益：主题策略产品',
        path: '/tk/smartbi?url=openresource.jsp?resid=I2c9180820180609360939cd4018069f221f45ab2', // 菜单路径
        title: '资管产品：（3）权益：主题策略产品',
        icon: '',
        name: '资管产品：（3）权益：主题策略产品',
        component: './subApp',
        description: '',
        actions: [
          {
            id: 102002001,
            code: '资管产品：（3）权益：主题策略产品:查看',
            name: '资管产品：（3）权益：主题策略产品:查看',
            method: 'GET',
            type: 'btn',
            tabUri: '//',
            description: '',
            uri: '/user/del/{$id}',
            uriFlag: '/yss-base-admin',
          },
        ],
      },

      {
        id: 101007,
        code: '产品推荐-业绩回顾（混合型）',
        path: '/tk/smartbi?url=openresource.jsp?resid=I2c9180820180609360939cd4018069f6a5a55b0e', // 菜单路径
        title: '产品推荐-业绩回顾（混合型）',
        icon: '',
        name: '产品推荐-业绩回顾（混合型）',
        component: './subApp',
        description: '',
        actions: [
          {
            id: 102002001,
            code: '产品推荐-业绩回顾（混合型）:查看',
            name: '产品推荐-业绩回顾（混合型）:查看',
            method: 'GET',
            type: 'btn',
            tabUri: '//',
            description: '',
            uri: '/user/del/{$id}',
            uriFlag: '/yss-base-admin',
          },
        ],
      },
      {
        id: 101007,
        code: '产品推荐-业绩回顾（固收型）',
        path: '/tk/smartbi?url=openresource.jsp?resid=I2c9180820180609360939cd4018069f75ce55b32', // 菜单路径
        title: '产品推荐-业绩回顾（固收型）',
        icon: '',
        name: '产品推荐-业绩回顾（固收型）',
        component: './subApp',
        description: '',
        actions: [
          {
            id: 102002001,
            code: '产品推荐-业绩回顾（固收型）:查看',
            name: '产品推荐-业绩回顾（固收型）:查看',
            method: 'GET',
            type: 'btn',
            tabUri: '//',
            description: '',
            uri: '/user/del/{$id}',
            uriFlag: '/yss-base-admin',
          },
        ],
      },
      {
        id: 101007,
        code: '产品规模&客群分布1',
        path: '/tk/smartbi?url=openresource.jsp?resid=I2c9180820180599d599db03101805a05f7a40469', // 菜单路径
        title: '产品规模&客群分布',
        icon: '',
        name: '产品规模&客群分布',
        component: './subApp',
        description: '',
        actions: [
          {
            id: 102002001,
            code: '产品规模&客群分布1:查看',
            name: '产品规模&客群分布1:查看',
            method: 'GET',
            type: 'btn',
            tabUri: '//',
            description: '',
            uri: '/user/del/{$id}',
            uriFlag: '/yss-base-admin',
          },
        ],
      },
      {
        id: 101007,
        code: '规模变化对比',
        path: '/tk/smartbi?url=openresource.jsp?resid=I2c918082018017161716854a01803a8b65060d33', // 菜单路径
        title: '规模变化对比',
        icon: '',
        name: '规模变化对比',
        component: './subApp',
        description: '',
        actions: [
          {
            id: 102002001,
            code: '规模变化对比:查看',
            name: '规模变化对比:查看',
            method: 'GET',
            type: 'btn',
            tabUri: '//',
            description: '',
            uri: '/user/del/{$id}',
            uriFlag: '/yss-base-admin',
          },
        ],
      },
      {
        id: 101007,
        code: '市场观察',
        path: '/tk/smartbi?url=openresource.jsp?resid=I2c9180820180599d599db03101805a17b9c908f7', // 菜单路径
        title: '市场观察',
        icon: '',
        name: '市场观察',
        component: './subApp',
        description: '',
        actions: [
          {
            id: 102002001,
            code: '市场观察:查看',
            name: '市场观察:查看',
            method: 'GET',
            type: 'btn',
            tabUri: '//',
            description: '',
            uri: '/user/del/{$id}',
            uriFlag: '/yss-base-admin',
          },
        ],
      },
      {
        id: 101007,
        code: '投管人业绩排名',
        path: '/tk/smartbi?url=openresource.jsp?resid=I2c918082018017161716854a01803a954daa0d43', // 菜单路径
        title: '投管人业绩排名',
        icon: '',
        name: '投管人业绩排名',
        component: './subApp',
        description: '',
        actions: [
          {
            id: 102002001,
            code: '投管人业绩排名:查看',
            name: '投管人业绩排名:查看',
            method: 'GET',
            type: 'btn',
            tabUri: '//',
            description: '',
            uri: '/user/del/{$id}',
            uriFlag: '/yss-base-admin',
          },
        ],
      },
      {
        id: 101007,
        code: '新发统计',
        path: '/tk/smartbi?url=openresource.jsp?resid=I2c918082018017161716854a01803aa8e2de0d6c', // 菜单路径
        title: '新发统计',
        icon: '',
        name: '新发统计',
        component: './subApp',
        description: '',
        actions: [
          {
            id: 102002001,
            code: '新发统计:查看',
            name: '新发统计:查看',
            method: 'GET',
            type: 'btn',
            tabUri: '//',
            description: '',
            uri: '/user/del/{$id}',
            uriFlag: '/yss-base-admin',
          },
        ],
      },

      {
        id: 101007,
        code: '三方总体情况',
        path: '/tk/smartbi?url=openresource.jsp?resid=I2c9180820180599d599db03101805a32f0850c65', // 菜单路径
        title: '三方总体情况',
        icon: '',
        name: '三方总体情况',
        component: './subApp',
        description: '',
        actions: [
          {
            id: 102002001,
            code: '三方总体情况:查看',
            name: '三方总体情况:查看',
            method: 'GET',
            type: 'btn',
            tabUri: '//',
            description: '',
            uri: '/user/del/{$id}',
            uriFlag: '/yss-base-admin',
          },
        ],
      },
      {
        id: 101007,
        code: '集合产品：年业绩检视',
        path: '/tk/smartbi?url=openresource.jsp?resid=I2c918082018017161716854a01803b71c884125d', // 菜单路径
        title: '集合产品：年业绩检视',
        icon: '',
        name: '集合产品：年业绩检视',
        component: './subApp',
        description: '',
        actions: [
          {
            id: 102002001,
            code: '集合产品：年业绩检视:查看',
            name: '集合产品：年业绩检视:查看',
            method: 'GET',
            type: 'btn',
            tabUri: '//',
            description: '',
            uri: '/user/del/{$id}',
            uriFlag: '/yss-base-admin',
          },
        ],
      },
      {
        id: 101007,
        code: '集合产品：业绩检视（旗舰）',
        path: '/tk/smartbi?url=openresource.jsp?resid=I2c918082018017161716854a01803ab5046a0d97', // 菜单路径
        title: '集合产品：业绩检视（旗舰）',
        icon: '',
        name: '集合产品：业绩检视（旗舰）',
        component: './subApp',
        description: '',
        actions: [
          {
            id: 102002001,
            code: '集合产品：业绩检视（旗舰）:查看',
            name: '集合产品：业绩检视（旗舰）:查看',
            method: 'GET',
            type: 'btn',
            tabUri: '//',
            description: '',
            uri: '/user/del/{$id}',
            uriFlag: '/yss-base-admin',
          },
        ],
      },
      {
        id: 101007,
        code: '集合产品：业绩检视（潜力）',
        path: '/tk/smartbi?url=openresource.jsp?resid=I2c918082018017161716854a01803ab5519c0d9a', // 菜单路径
        title: '集合产品：业绩检视（潜力）',
        icon: '',
        name: '集合产品：业绩检视（潜力）',
        component: './subApp',
        description: '',
        actions: [
          {
            id: 102002001,
            code: '集合产品：业绩检视（潜力）:查看',
            name: '集合产品：业绩检视（潜力）:查看',
            method: 'GET',
            type: 'btn',
            tabUri: '//',
            description: '',
            uri: '/user/del/{$id}',
            uriFlag: '/yss-base-admin',
          },
        ],
      },
      {
        id: 101007,
        code: '集合产品：业绩检视（业绩待复兴）',
        path: '/tk/smartbi?url=openresource.jsp?resid=I2c918082018017161716854a01803ab5a36d0d9d', // 菜单路径
        title: '集合产品：业绩检视（业绩待复兴）',
        icon: '',
        name: '集合产品：业绩检视（业绩待复兴）',
        component: './subApp',
        description: '',
        actions: [
          {
            id: 102002001,
            code: '集合产品：业绩检视（业绩待复兴）:查看',
            name: '集合产品：业绩检视（业绩待复兴）:查看',
            method: 'GET',
            type: 'btn',
            tabUri: '//',
            description: '',
            uri: '/user/del/{$id}',
            uriFlag: '/yss-base-admin',
          },
        ],
      },
      {
        id: 101007,
        code: '业绩检视（具体产品）（旗舰产品）',
        path: '/tk/smartbi?url=openresource.jsp?resid=I2c9180820180609360939cd4018094a0a7fc4f4e', // 菜单路径
        title: '业绩检视（具体产品）（旗舰产品）',
        icon: '',
        name: '业绩检视（具体产品）（旗舰产品）',
        component: './subApp',
        description: '',
        actions: [
          {
            id: 102002001,
            code: '业绩检视（具体产品）（旗舰产品）:查看',
            name: '业绩检视（具体产品）（旗舰产品）:查看',
            method: 'GET',
            type: 'btn',
            tabUri: '//',
            description: '',
            uri: '/user/del/{$id}',
            uriFlag: '/yss-base-admin',
          },
        ],
      },
      {
        id: 101007,
        code: '业绩检视（具体产品）（潜力）',
        path: '/tk/smartbi?url=openresource.jsp?resid=I2c918082018017161716854a01803b1c887f0e80', // 菜单路径
        title: '业绩检视（具体产品）（潜力）',
        icon: '',
        name: '业绩检视（具体产品）（潜力）',
        component: './subApp',
        description: '',
        actions: [
          {
            id: 102002001,
            code: '业绩检视（具体产品）（潜力）:查看',
            name: '业绩检视（具体产品）（潜力）:查看',
            method: 'GET',
            type: 'btn',
            tabUri: '//',
            description: '',
            uri: '/user/del/{$id}',
            uriFlag: '/yss-base-admin',
          },
        ],
      },
      {
        id: 101007,
        code: '业绩检视（具体产品）（业绩待复兴）',
        path: '/tk/smartbi?url=openresource.jsp?resid=I2c918082018017161716854a01803b1cdea30e83', // 菜单路径
        title: '业绩检视（具体产品）（业绩待复兴）',
        icon: '',
        name: '业绩检视（具体产品）（业绩待复兴）',
        component: './subApp',
        description: '',
        actions: [
          {
            id: 102002001,
            code: '业绩检视（具体产品）（业绩待复兴）:查看',
            name: '业绩检视（具体产品）（业绩待复兴）:查看',
            method: 'GET',
            type: 'btn',
            tabUri: '//',
            description: '',
            uri: '/user/del/{$id}',
            uriFlag: '/yss-base-admin',
          },
        ],
      },
      {
        id: 101007,
        code: '定制产品、专户：年业绩检视',
        path: '/tk/smartbi?url=openresource.jsp?resid=I2c918082018017161716854a01803b5f96481240', // 菜单路径
        title: '定制产品、专户：年业绩检视',
        icon: '',
        name: '定制产品、专户：年业绩检视',
        component: './subApp',
        description: '',
        actions: [
          {
            id: 102002001,
            code: '定制产品、专户：年业绩检视:查看',
            name: '定制产品、专户：年业绩检视:查看',
            method: 'GET',
            type: 'btn',
            tabUri: '//',
            description: '',
            uri: '/user/del/{$id}',
            uriFlag: '/yss-base-admin',
          },
        ],
      },
      {
        id: 101007,
        code: '定制产品（具体产品）',
        path: '/tk/smartbi?url=openresource.jsp?resid=I2c9180820180609360939cd40180974e2b386561', // 菜单路径
        title: '定制产品（具体产品）',
        icon: '',
        name: '定制产品（具体产品）',
        component: './subApp',
        description: '',
        actions: [
          {
            id: 102002001,
            code: '定制产品（具体产品）:查看',
            name: '定制产品（具体产品）:查看',
            method: 'GET',
            type: 'btn',
            tabUri: '//',
            description: '',
            uri: '/user/del/{$id}',
            uriFlag: '/yss-base-admin',
          },
        ],
      },
      {
        id: 101007,
        code: '客户360-业绩检视：基石客户',
        path: '/tk/smartbi?url=openresource.jsp?resid=I2c918082018017161716854a01804fa68c9d5c30', // 菜单路径
        title: '客户360-业绩检视：基石客户',
        icon: '',
        name: '客户360-业绩检视：基石客户',
        component: './subApp',
        description: '',
        actions: [
          {
            id: 102002001,
            code: '客户360-业绩检视：基石客户:查看',
            name: '客户360-业绩检视：基石客户:查看',
            method: 'GET',
            type: 'btn',
            tabUri: '//',
            description: '',
            uri: '/user/del/{$id}',
            uriFlag: '/yss-base-admin',
          },
        ],
      },
      {
        id: 101007,
        code: '客户360-业绩检视：战略客户',
        path: '/tk/smartbi?url=openresource.jsp?resid=I2c9180820180609360939cd401806a066d585d56', // 菜单路径
        title: '客户360-业绩检视：战略客户',
        icon: '',
        name: '客户360-业绩检视：战略客户',
        component: './subApp',
        description: '',
        actions: [
          {
            id: 102002001,
            code: '客户360-业绩检视：战略客户:查看',
            name: '客户360-业绩检视：战略客户:查看',
            method: 'GET',
            type: 'btn',
            tabUri: '//',
            description: '',
            uri: '/user/del/{$id}',
            uriFlag: '/yss-base-admin',
          },
        ],
      },
      {
        id: 101007,
        code: '客户360-重点关注：泰康系',
        path: '/tk/smartbi?url=openresource.jsp?resid=I2c918082018017161716854a01804ff7679c7341', // 菜单路径
        title: '客户360-重点关注：泰康系',
        icon: '',
        name: '客户360-重点关注：泰康系',
        component: './subApp',
        description: '',
        actions: [
          {
            id: 102002001,
            code: '客户360-重点关注：泰康系:查看',
            name: '客户360-重点关注：泰康系:查看',
            method: 'GET',
            type: 'btn',
            tabUri: '//',
            description: '',
            uri: '/user/del/{$id}',
            uriFlag: '/yss-base-admin',
          },
        ],
      },
      {
        id: 101007,
        code: '客户360-重点关注：保险（三方）',
        path: '/tk/smartbi?url=openresource.jsp?resid=I2c9180820180609360939cd401806a08c6a85dce', // 菜单路径
        title: '客户360-重点关注：保险（三方）',
        icon: '',
        name: '客户360-重点关注：保险（三方）',
        component: './subApp',
        description: '',
        actions: [
          {
            id: 102002001,
            code: '客户360-重点关注：保险（三方）:查看',
            name: '客户360-重点关注：保险（三方）:查看',
            method: 'GET',
            type: 'btn',
            tabUri: '//',
            description: '',
            uri: '/user/del/{$id}',
            uriFlag: '/yss-base-admin',
          },
        ],
      },
      {
        id: 101007,
        code: '客户360-重点关注：银行及理财子',
        path: '/tk/smartbi?url=openresource.jsp?resid=I2c9180820180609360939cd401806a080fcf5db3', // 菜单路径
        title: '客户360-重点关注：银行及理财子',
        icon: '',
        name: '客户360-重点关注：银行及理财子',
        component: './subApp',
        description: '',
        actions: [
          {
            id: 102002001,
            code: '客户360-重点关注：银行及理财子:查看',
            name: '客户360-重点关注：银行及理财子:查看',
            method: 'GET',
            type: 'btn',
            tabUri: '//',
            description: '',
            uri: '/user/del/{$id}',
            uriFlag: '/yss-base-admin',
          },
        ],
      },
      {
        id: 101007,
        code: '客户360-重点关注：银行及理财子（具体客户）',
        path: '/tk/smartbi?url=openresource.jsp?resid=I2c9180820180609360939cd401806a080fcf5db3', // 菜单路径
        title: '客户360-重点关注：银行及理财子（具体客户）',
        icon: '',
        name: '客户360-重点关注：银行及理财子（具体客户）',
        component: './subApp',
        description: '',
        actions: [
          {
            id: 102002001,
            code: '客户360-重点关注：银行及理财子（具体客户）:查看',
            name: '客户360-重点关注：银行及理财子（具体客户）:查看',
            method: 'GET',
            type: 'btn',
            tabUri: '//',
            description: '',
            uri: '/user/del/{$id}',
            uriFlag: '/yss-base-admin',
          },
        ],
      },
      {
        id: 101007,
        code: '客户360-重点关注：财富',
        path: '/tk/smartbi?url=openresource.jsp?resid=I2c9180820180504f504f95d801805052b6060038', // 菜单路径
        title: '客户360-重点关注：财富',
        icon: '',
        name: '客户360-重点关注：财富',
        component: './subApp',
        description: '',
        actions: [
          {
            id: 102002001,
            code: '客户360-重点关注：财富:查看',
            name: '客户360-重点关注：财富:查看',
            method: 'GET',
            type: 'btn',
            tabUri: '//',
            description: '',
            uri: '/user/del/{$id}',
            uriFlag: '/yss-base-admin',
          },
        ],
      },
      {
        id: 101007,
        code: '三方业绩检视',
        path: '/tk/smartbi?url=openresource.jsp?resid=I2c9180820180599d599db03101805aad267315c4', // 菜单路径
        title: '三方业绩检视',
        icon: '',
        name: '三方业绩检视',
        component: './subApp',
        description: '',
        actions: [
          {
            id: 102002001,
            code: '三方业绩检视:查看',
            name: '三方业绩检视:查看',
            method: 'GET',
            type: 'btn',
            tabUri: '//',
            description: '',
            uri: '/user/del/{$id}',
            uriFlag: '/yss-base-admin',
          },
        ],
      },

      {
        id: 101007,
        code: '财富',
        path: '/tk/smartbi?url=openresource.jsp?resid=I2c9180820180609360939cd40180b7647bb8237e', // 菜单路径
        title: '财富',
        icon: '',
        name: '财富',
        component: './subApp',
        description: '',
        actions: [
          {
            id: 102002001,
            code: '财富:查看',
            name: '财富:查看',
            method: 'GET',
            type: 'btn',
            tabUri: '//',
            description: '',
            uri: '/user/del/{$id}',
            uriFlag: '/yss-base-admin',
          },
        ],
      },
      {
        id: 101007,
        code: '投连专户业绩检视1',
        path: '/tk/smartbi?url=openresource.jsp?resid=I2c9180820180609360939cd40180b764b75f2385', // 菜单路径
        title: '投连专户业绩检视',
        icon: '',
        name: '投连专户业绩检视',
        component: './subApp',
        description: '',
        actions: [
          {
            id: 102002001,
            code: '投连专户业绩检视1:查看',
            name: '投连专户业绩检视1:查看',
            method: 'GET',
            type: 'btn',
            tabUri: '//',
            description: '',
            uri: '/user/del/{$id}',
            uriFlag: '/yss-base-admin',
          },
        ],
      },

      {
        id: 101007,
        code: '年金客群业绩情况',
        path: '/tk/smartbi?url=openresource.jsp?resid=I2c9180820180609360939cd40180937a9c73371c', // 菜单路径
        title: '年金客群业绩情况',
        icon: '',
        name: '年金客群业绩情况',
        component: './subApp',
        description: '',
        actions: [
          {
            id: 102002001,
            code: '年金客群业绩情况:查看',
            name: '年金客群业绩情况:查看',
            method: 'GET',
            type: 'btn',
            tabUri: '//',
            description: '',
            uri: '/user/del/{$id}',
            uriFlag: '/yss-base-admin',
          },
        ],
      },
      {
        id: 101007,
        code: '年金组合整体业绩情况',
        path: '/tk/smartbi?url=openresource.jsp?resid=I2c918082018017161716854a01804fe65f766dc3', // 菜单路径
        title: '年金组合整体业绩情况',
        icon: '',
        name: '年金组合整体业绩情况',
        component: './subApp',
        description: '',
        actions: [
          {
            id: 102002001,
            code: '年金组合整体业绩情况:查看',
            name: '年金组合整体业绩情况:查看',
            method: 'GET',
            type: 'btn',
            tabUri: '//',
            description: '',
            uri: '/user/del/{$id}',
            uriFlag: '/yss-base-admin',
          },
        ],
      },
      {
        id: 101007,
        code: '同业交流信息：行业分布',
        path: '/tk/smartbi?url=openresource.jsp?resid=I2c9180820180599d599db03101805a6afc0c1369', // 菜单路径
        title: '同业交流信息：行业分布',
        icon: '',
        name: '同业交流信息：行业分布',
        component: './subApp',
        description: '',
        actions: [
          {
            id: 102002001,
            code: '同业交流信息：行业分布:查看',
            name: '同业交流信息：行业分布:查看',
            method: 'GET',
            type: 'btn',
            tabUri: '//',
            description: '',
            uri: '/user/del/{$id}',
            uriFlag: '/yss-base-admin',
          },
        ],
      },
      {
        id: 101007,
        code: '产品规模&客群分布',
        path: '/tk/smartbi?url=openresource.jsp?resid=I2c918082018017161716854a01804ed944014d55', // 菜单路径
        title: '产品规模&客群分布',
        icon: '',
        name: '产品规模&客群分布',
        component: './subApp',
        description: '',
        actions: [
          {
            id: 102002001,
            code: '产品规模&客群分布:查看',
            name: '产品规模&客群分布:查看',
            method: 'GET',
            type: 'btn',
            tabUri: '//',
            description: '',
            uri: '/user/del/{$id}',
            uriFlag: '/yss-base-admin',
          },
        ],
      },
      {
        id: 101007,
        code: '产品业绩对标',
        path: '/tk/smartbi?url=openresource.jsp?resid=I2c918082018017161716854a01802af57f7d653f', // 菜单路径
        title: '产品业绩对标',
        icon: '',
        name: '产品业绩对标',
        component: './subApp',
        description: '',
        actions: [
          {
            id: 102002001,
            code: '产品业绩对标:查看',
            name: '产品业绩对标:查看',
            method: 'GET',
            type: 'btn',
            tabUri: '//',
            description: '',
            uri: '/user/del/{$id}',
            uriFlag: '/yss-base-admin',
          },
        ],
      },
      {
        id: 101007,
        code: '规模增量',
        path: '/tk/smartbi?url=openresource.jsp?resid=I2c9180820180609360939cd4018069f91d8e5bb0', // 菜单路径
        title: '规模增量',
        icon: '',
        name: '规模增量',
        component: './subApp',
        description: '',
        actions: [
          {
            id: 102002001,
            code: '规模增量:查看',
            name: '规模增量:查看',
            method: 'GET',
            type: 'btn',
            tabUri: '//',
            description: '',
            uri: '/user/del/{$id}',
            uriFlag: '/yss-base-admin',
          },
        ],
      },
      {
        id: 101007,
        code: '养老金产品业绩情况（固收产品）',
        path: '/tk/smartbi?url=openresource.jsp?resid=I2c9180820180609360939cd40180647fcac11ee7', // 菜单路径
        title: '养老金产品业绩情况（固收产品）',
        icon: '',
        name: '养老金产品业绩情况（固收产品）',
        component: './subApp',
        description: '',
        actions: [
          {
            id: 102002001,
            code: '养老金产品业绩情况（固收产品）:查看',
            name: '养老金产品业绩情况（固收产品）:查看',
            method: 'GET',
            type: 'btn',
            tabUri: '//',
            description: '',
            uri: '/user/del/{$id}',
            uriFlag: '/yss-base-admin',
          },
        ],
      },
      {
        id: 101007,
        code: '养老金产品业绩情况（含权产品）',
        path: '/tk/smartbi?url=openresource.jsp?resid=I2c9180820180599d599db0310180601c0f5058fe', // 菜单路径
        title: '养老金产品业绩情况（含权产品）',
        icon: '',
        name: '养老金产品业绩情况（含权产品）',
        component: './subApp',
        description: '',
        actions: [
          {
            id: 102002001,
            code: '养老金产品业绩情况（含权产品）:查看',
            name: '养老金产品业绩情况（含权产品）:查看',
            method: 'GET',
            type: 'btn',
            tabUri: '//',
            description: '',
            uri: '/user/del/{$id}',
            uriFlag: '/yss-base-admin',
          },
        ],
      },

      {
        id: 101007,
        code: '年金后端账户产品配置',
        path: '/tk/smartbi?url=openresource.jsp?resid=I2c918082018017161716854a01804fb6c5a65ea0', // 菜单路径
        title: '年金后端账户产品配置',
        icon: '',
        name: '年金后端账户产品配置',
        component: './subApp',
        description: '',
        actions: [
          {
            id: 102002001,
            code: '年金后端账户产品配置:查看',
            name: '年金后端账户产品配置:查看',
            method: 'GET',
            type: 'btn',
            tabUri: '//',
            description: '',
            uri: '/user/del/{$id}',
            uriFlag: '/yss-base-admin',
          },
        ],
      },
      {
        id: 101007,
        code: '附:养老金产品业绩情况（含权产品）',
        path: '/tk/smartbi?url=openresource.jsp?resid=I2c918082018017161716854a01804f2c4b825798', // 菜单路径
        title: '附:养老金产品业绩情况（含权产品）',
        icon: '',
        name: '附:养老金产品业绩情况（含权产品）',
        component: './subApp',
        description: '',
        actions: [
          {
            id: 102002001,
            code: '附:养老金产品业绩情况（含权产品）:查看',
            name: '附:养老金产品业绩情况（含权产品）:查看',
            method: 'GET',
            type: 'btn',
            tabUri: '//',
            description: '',
            uri: '/user/del/{$id}',
            uriFlag: '/yss-base-admin',
          },
        ],
      },
      {
        id: 101007,
        code: '附养老金产品业绩情况（固收产品）',
        path: '/tk/smartbi?url=openresource.jsp?resid=I2c9180820180609360939cd4018092ea1b0014b4', // 菜单路径
        title: '附养老金产品业绩情况（固收产品）',
        icon: '',
        name: '附养老金产品业绩情况（固收产品）',
        component: './subApp',
        description: '',
        actions: [
          {
            id: 102002001,
            code: '附养老金产品业绩情况（固收产品）:查看',
            name: '附养老金产品业绩情况（固收产品）:查看',
            method: 'GET',
            type: 'btn',
            tabUri: '//',
            description: '',
            uri: '/user/del/{$id}',
            uriFlag: '/yss-base-admin',
          },
        ],
      },
      {
        id: 101007,
        code: '年金后端账户配置产品情况',
        path: '/tk/smartbi?url=openresource.jsp?resid=I2c918082018017161716854a01803a8015690d1a', // 菜单路径
        title: '年金后端账户配置产品情况',
        icon: '',
        name: '年金后端账户配置产品情况',
        component: './subApp',
        description: '',
        actions: [
          {
            id: 102002001,
            code: '年金后端账户配置产品情况:查看',
            name: '年金后端账户配置产品情况:查看',
            method: 'GET',
            type: 'btn',
            tabUri: '//',
            description: '',
            uri: '/user/del/{$id}',
            uriFlag: '/yss-base-admin',
          },
        ],
      },

      {
        id: 101007,
        code: '客户目标模板',
        path: '/tk/smartbi?url=openresource.jsp?resid=I2c9180820180609360939cd401806ebc4f1211ba', // 菜单路径
        title: '客户目标模板',
        icon: '',
        name: '客户目标模板',
        component: './subApp',
        description: '',
        actions: [
          {
            id: 102002001,
            code: '客户目标模板:查看',
            name: '客户目标模板:查看',
            method: 'GET',
            type: 'btn',
            tabUri: '//',
            description: '',
            uri: '/user/del/{$id}',
            uriFlag: '/yss-base-admin',
          },
        ],
      },
      {
        id: 101007,
        code: '组合行情规模模板',
        path: '/tk/smartbi?url=openresource.jsp?resid=I2c9180820180609360939cd401806ee0ed011923', // 菜单路径
        title: '组合行情规模模板',
        icon: '',
        name: '组合行情规模模板',
        component: './subApp',
        description: '',
        actions: [
          {
            id: 102002001,
            code: '组合行情规模模板:查看',
            name: '组合行情规模模板:查看',
            method: 'GET',
            type: 'btn',
            tabUri: '//',
            description: '',
            uri: '/user/del/{$id}',
            uriFlag: '/yss-base-admin',
          },
        ],
      },
      {
        id: 101007,
        code: '管理人规模模板',
        path: '/tk/smartbi?url=openresource.jsp?resid=I2c9180820180609360939cd401806ef008881d02', // 菜单路径
        title: '管理人规模模板',
        icon: '',
        name: '管理人规模模板',
        component: './subApp',
        description: '',
        actions: [
          {
            id: 102002001,
            code: '管理人规模模板:查看',
            name: '管理人规模模板:查看',
            method: 'GET',
            type: 'btn',
            tabUri: '//',
            description: '',
            uri: '/user/del/{$id}',
            uriFlag: '/yss-base-admin',
          },
        ],
      },
      {
        id: 101007,
        code: '持仓资产分析模板',
        path: '/tk/smartbi?url=openresource.jsp?resid=I2c9180820180609360939cd401806ef79fb91e79',
        title: '持仓资产分析模板',
        icon: '',
        name: '持仓资产分析模板',
        component: './subApp',
        description: '',
        actions: [
          {
            id: 102002001,
            code: '持仓资产分析模板:查看',
            name: '持仓资产分析模板:查看',
            method: 'GET',
            type: 'btn',
            tabUri: '//',
            description: '',
            uri: '/user/del/{$id}',
            uriFlag: '/yss-base-admin',
          },
        ],
      },
      {
        id: 101007,
        code: '持仓资产类型分布模板',
        path: '/tk/smartbi?url=openresource.jsp?resid=I2c9180820180609360939cd401806efca3f61f6b',
        title: '持仓资产类型分布模板',
        icon: '',
        name: '持仓资产类型分布模板',
        component: './subApp',
        description: '',
        actions: [
          {
            id: 102002001,
            code: '持仓资产类型分布模板:查看',
            name: '持仓资产类型分布模板:查看',
            method: 'GET',
            type: 'btn',
            tabUri: '//',
            description: '',
            uri: '/user/del/{$id}',
            uriFlag: '/yss-base-admin',
          },
        ],
      },
      {
        id: 101007,
        code: '产品业绩模板',
        path: '/tk/smartbi?url=openresource.jsp?resid=I2c9180820180609360939cd401806f00a7bf2008',
        title: '产品业绩模板',
        icon: '',
        name: '产品业绩模板',
        component: './subApp',
        description: '',
        actions: [
          {
            id: 102002001,
            code: '产品业绩模板:查看',
            name: '产品业绩模板:查看',
            method: 'GET',
            type: 'btn',
            tabUri: '//',
            description: '',
            uri: '/user/del/{$id}',
            uriFlag: '/yss-base-admin',
          },
        ],
      },
      {
        id: 101007,
        code: '投资人分析模板1',
        path: '/tk/smartbi?url=openresource.jsp?resid=I2c9180820180609360939cd401806f0ca9ec2223',
        title: '投资人分析模板1',
        icon: '',
        name: '投资人分析模板1',
        component: './subApp',
        description: '',
        actions: [
          {
            id: 102002001,
            code: '投资人分析模板1:查看',
            name: '投资人分析模板1:查看',
            method: 'GET',
            type: 'btn',
            tabUri: '//',
            description: '',
            uri: '/user/del/{$id}',
            uriFlag: '/yss-base-admin',
          },
        ],
      },
      {
        id: 101007,
        code: '投资人分析模板2',
        path: '/tk/smartbi?url=openresource.jsp?resid=I2c9180820180609360939cd401806f10975122db',
        title: '投资人分析模板2',
        icon: '',
        name: '投资人分析模板2',
        component: './subApp',
        description: '',
        actions: [
          {
            id: 102002001,
            code: '投资人分析模板2:查看',
            name: '投资人分析模板2:查看',
            method: 'GET',
            type: 'btn',
            tabUri: '//',
            description: '',
            uri: '/user/del/{$id}',
            uriFlag: '/yss-base-admin',
          },
        ],
      },
      {
        id: 101007,
        code: '不同管理规模管理人投资人结构分析模板',
        path: '/tk/smartbi?url=openresource.jsp?resid=I2c9180820180609360939cd401806f13d2c7235c',
        title: '不同管理规模管理人投资人结构分析模板',
        icon: '',
        name: '不同管理规模管理人投资人结构分析模板',
        component: './subApp',
        description: '',
        actions: [
          {
            id: 102002001,
            code: '不同管理规模管理人投资人结构分析模板:查看',
            name: '不同管理规模管理人投资人结构分析模板:查看',
            method: 'GET',
            type: 'btn',
            tabUri: '//',
            description: '',
            uri: '/user/del/{$id}',
            uriFlag: '/yss-base-admin',
          },
        ],
      },
      {
        id: 101007,
        code: '公募专户行业调研规模模板',
        path: '/tk/smartbi?url=openresource.jsp?resid=I2c9180820180609360939cd401806f1a5868248c',
        title: '公募专户行业调研规模模板',
        icon: '',
        name: '公募专户行业调研规模模板',
        component: './subApp',
        description: '',
        actions: [
          {
            id: 102002001,
            code: '公募专户行业调研规模模板:查看',
            name: '公募专户行业调研规模模板:查看',
            method: 'GET',
            type: 'btn',
            tabUri: '//',
            description: '',
            uri: '/user/del/{$id}',
            uriFlag: '/yss-base-admin',
          },
        ],
      },
      {
        id: 101007,
        code: '养老进产品收益情况汇总模板',
        path: '/tk/smartbi?url=openresource.jsp?resid=I2c9180820180609360939cd40180a6a6a3683e64',
        title: '养老进产品收益情况汇总模板',
        icon: '',
        name: '养老进产品收益情况汇总模板',
        component: './subApp',
        description: '',
        actions: [
          {
            id: 102002001,
            code: '养老进产品收益情况汇总模板:查看',
            name: '养老进产品收益情况汇总模板:查看',
            method: 'GET',
            type: 'btn',
            tabUri: '//',
            description: '',
            uri: '/user/del/{$id}',
            uriFlag: '/yss-base-admin',
          },
        ],
      },
      {
        id: 101007,
        code: '养老金产品收益情况明细模板',
        path: '/tk/smartbi?url=openresource.jsp?resid=I2c9180820180609360939cd40180a6a6cdc23e6e',
        title: '养老金产品收益情况明细模板',
        icon: '',
        name: '养老金产品收益情况明细模板',
        component: './subApp',
        description: '',
        actions: [
          {
            id: 102002001,
            code: '养老金产品收益情况明细模板:查看',
            name: '养老金产品收益情况明细模板:查看',
            method: 'GET',
            type: 'btn',
            tabUri: '//',
            description: '',
            uri: '/user/del/{$id}',
            uriFlag: '/yss-base-admin',
          },
        ],
      },
      {
        id: 101007,
        code: '养老进产品信息一览表模板',
        path: '/tk/smartbi?url=openresource.jsp?resid=I2c9180820180609360939cd40180a6a6eeae3e71',
        title: '养老进产品信息一览表模板',
        icon: '',
        name: '养老进产品信息一览表模板',
        component: './subApp',
        description: '',
        actions: [
          {
            id: 102002001,
            code: '养老进产品信息一览表模板:查看',
            name: '养老进产品信息一览表模板:查看',
            method: 'GET',
            type: 'btn',
            tabUri: '//',
            description: '',
            uri: '/user/del/{$id}',
            uriFlag: '/yss-base-admin',
          },
        ],
      },
      {
        id: 101007,
        code: '产品收入模板',
        path: '/tk/smartbi?url=openresource.jsp?resid=I2c9180820180609360939cd40180a6a63cfd3e49',
        title: '产品收入模板',
        icon: '',
        name: '产品收入模板',
        component: './subApp',
        description: '',
        actions: [
          {
            id: 102002001,
            code: '产品收入模板:查看',
            name: '产品收入模板:查看',
            method: 'GET',
            type: 'btn',
            tabUri: '//',
            description: '',
            uri: '/user/del/{$id}',
            uriFlag: '/yss-base-admin',
          },
        ],
      },
      {
        id: 101007,
        code: '大类资产归因表',
        path: '/tk/smartbi?url=openresource.jsp?resid=I2c9180820180609360939cd40180a6a673993e61',
        title: '大类资产归因表',
        icon: '',
        name: '大类资产归因表',
        component: './subApp',
        description: '',
        actions: [
          {
            id: 102002001,
            code: '大类资产归因表:查看',
            name: '大类资产归因表:查看',
            method: 'GET',
            type: 'btn',
            tabUri: '//',
            description: '',
            uri: '/user/del/{$id}',
            uriFlag: '/yss-base-admin',
          },
        ],
      },
      {
        id: 101007,
        code: '同业信息录入模板',
        path: '/tk/smartbi?url=openresource.jsp?resid=I2c9180820180609360939cd401806ee6079119db',
        title: '同业信息录入模板',
        icon: '',
        name: '同业信息录入模板',
        component: './subApp',
        description: '',
        actions: [
          {
            id: 102002001,
            code: '同业信息录入模板:查看',
            name: '同业信息录入模板:查看',
            method: 'GET',
            type: 'btn',
            tabUri: '//',
            description: '',
            uri: '/user/del/{$id}',
            uriFlag: '/yss-base-admin',
          },
        ],
      },
      {
        id: 101007,
        code: '人社部信息录入',
        path: '/tk/smartbi?url=openresource.jsp?resid=I2c9180820180609360939cd401806eed14061c0d',
        title: '人社部信息录入',
        icon: '',
        name: '人社部信息录入',
        component: './subApp',
        description: '',
        actions: [
          {
            id: 102002001,
            code: '人社部信息录入:查看',
            name: '人社部信息录入:查看',
            method: 'GET',
            type: 'btn',
            tabUri: '//',
            description: '',
            uri: '/user/del/{$id}',
            uriFlag: '/yss-base-admin',
          },
        ],
      },
      {
        id: 101007,
        code: '人社部信息录入1',
        path: '/tk/smartbi?url=openresource.jsp?resid=I2c9180820180609360939cd40180b22037e30fa0',
        title: '人社部信息录入1',
        icon: '',
        name: '人社部信息录入1',
        component: './subApp',
        description: '',
        actions: [
          {
            id: 102002001,
            code: '人社部信息录入1:查看',
            name: '人社部信息录入1:查看',
            method: 'GET',
            type: 'btn',
            tabUri: '//',
            description: '',
            uri: '/user/del/{$id}',
            uriFlag: '/yss-base-admin',
          },
        ],
      },
      {
        id: 101007,
        code: '人社部信息录入2',
        path: '/tk/smartbi?url=openresource.jsp?resid=I2c9180820180609360939cd40180b238104e12b4',
        title: '人社部信息录入2',
        icon: '',
        name: '人社部信息录入2',
        component: './subApp',
        description: '',
        actions: [
          {
            id: 102002001,
            code: '人社部信息录入2:查看',
            name: '人社部信息录入2:查看',
            method: 'GET',
            type: 'btn',
            tabUri: '//',
            description: '',
            uri: '/user/del/{$id}',
            uriFlag: '/yss-base-admin',
          },
        ],
      },
      {
        id: 101007,
        code: 'Brinson归因录入',
        path: '/tk/smartbi?url=openresource.jsp?resid=I2c9180820180609360939cd401806ef742a11e6d',
        title: 'Brinson归因录入',
        icon: '',
        name: 'Brinson归因录入',
        component: './subApp',
        description: '',
        actions: [
          {
            id: 102002001,
            code: 'Brinson归因录入:查看',
            name: 'Brinson归因录入:查看',
            method: 'GET',
            type: 'btn',
            tabUri: '//',
            description: '',
            uri: '/user/del/{$id}',
            uriFlag: '/yss-base-admin',
          },
        ],
      },
      {
        id: 101007,
        code: '行业及top10归因合并录入',
        path: '/tk/smartbi?url=openresource.jsp?resid=I2c9180820180609360939cd401806efa092f1ec0',
        title: '行业及top10归因合并录入',
        icon: '',
        name: '行业及top10归因合并录入',
        component: './subApp',
        description: '',
        actions: [
          {
            id: 102002001,
            code: '行业及top10归因合并录入:查看',
            name: '行业及top10归因合并录入:查看',
            method: 'GET',
            type: 'btn',
            tabUri: '//',
            description: '',
            uri: '/user/del/{$id}',
            uriFlag: '/yss-base-admin',
          },
        ],
      },
      {
        id: 101007,
        code: '导航台持仓结构信息录入',
        path: '/tk/smartbi?url=openresource.jsp?resid=I2c9180820180609360939cd40180b242b9f9149f',
        title: '导航台持仓结构信息录入',
        icon: '',
        name: '导航台持仓结构信息录入',
        component: './subApp',
        description: '',
        actions: [
          {
            id: 102002001,
            code: '导航台持仓结构信息录入:查看',
            name: '导航台持仓结构信息录入:查看',
            method: 'GET',
            type: 'btn',
            tabUri: '//',
            description: '',
            uri: '/user/del/{$id}',
            uriFlag: '/yss-base-admin',
          },
        ],
      },
      {
        id: 101007,
        code: '权益策略指标',
        path: '/tk/smartbi?url=openresource.jsp?resid=I2c9180820180609360939cd40180b24696bc1502',
        title: '权益策略指标',
        icon: '',
        name: '权益策略指标',
        component: './subApp',
        description: '',
        actions: [
          {
            id: 102002001,
            code: '权益策略指标:查看',
            name: '权益策略指标:查看',
            method: 'GET',
            type: 'btn',
            tabUri: '//',
            description: '',
            uri: '/user/del/{$id}',
            uriFlag: '/yss-base-admin',
          },
        ],
      },
      {
        id: 101007,
        code: '固收策略指标',
        path: '/tk/smartbi?url=openresource.jsp?resid=I2c9180820180609360939cd40180b268b2c22082',
        title: '固收策略指标',
        icon: '',
        name: '固收策略指标',
        component: './subApp',
        description: '',
        actions: [
          {
            id: 102002001,
            code: '固收策略指标:查看',
            name: '固收策略指标:查看',
            method: 'GET',
            type: 'btn',
            tabUri: '//',
            description: '',
            uri: '/user/del/{$id}',
            uriFlag: '/yss-base-admin',
          },
        ],
      },
      {
        id: 101007,
        code: '固收策略指标-信用等级',
        path: '/tk/smartbi?url=openresource.jsp?resid=I2c9180820180609360939cd40180b26db7ba2180',
        title: '固收策略指标-信用等级',
        icon: '',
        name: '固收策略指标-信用等级',
        component: './subApp',
        description: '',
        actions: [
          {
            id: 102002001,
            code: '固收策略指标-信用等级:查看',
            name: '固收策略指标-信用等级:查看',
            method: 'GET',
            type: 'btn',
            tabUri: '//',
            description: '',
            uri: '/user/del/{$id}',
            uriFlag: '/yss-base-admin',
          },
        ],
      },
    ],
  },
];

export default [
  {
    // 对客，登录前
    path: '/userCustomer',
    component: '../layouts/UserCustomerLayout',
    routes: [
      {
        name: '登录',
        path: '/userCustomer/login',
        component: './userCustomer/loginCustomer',
      },
      {
        name: '忘记密码',
        path: '/userCustomer/forget',
        component: './userCustomer/loginCustomer/forget',
      },
      {
        name: '首页',
        path: '/userCustomer/home',
        component: './userCustomer/loginCustomer/home',
      },
      {
        name: '资产托管',
        path: '/userCustomer/assety',
        component: './userCustomer/loginCustomer/assety',
      },
      {
        name: '便捷查询',
        path: '/userCustomer/find',
        component: './userCustomer/loginCustomer/find',
      },
      {
        name: '联系我们',
        path: '/userCustomer/contact',
        component: './userCustomer/loginCustomer/contact',
      },
    ],
  },
  {
    path: '/user',
    component: '../layouts/UserCustomerLayout',
    routes: [
      {
        name: '登录',
        path: '/user/login',
        component: './userCustomer/loginCustomer',
      },
    ],
  },
  {
    name: '三方登录',
    path: '/thirdUser',
    routes: [
      {
        name: '登录',
        path: '/thirdUser/thirdHtml',
        component: './user/thirdHtml',
      },
    ],
  },
  {
    name: '注册',
    path: '/register',
    component: './user/register',
  },
  {
    name: '注册结果',
    path: '/registerResult',
    component: './user/registerResult',
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
                name: '招募说明书设置主页',
                path: 'prospectuSetHome',
                component: './prospectuSetHome',
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
              {
                name: '注册审核授权',
                path: 'institutionalAuditQuery',
                routes: [
                  {
                    name: '注册审核授权',
                    path: 'index',
                    component: './institutionalAuditQuery/index',
                  },
                  {
                    name: '用户信息',
                    path: 'userInfo',
                    component: './institutionalAuditQuery/userInfo',
                  },
                  {
                    name: '添加用户',
                    path: 'addUser',
                    component: './institutionalAuditQuery/addUser',
                  },
                ],
              },
              {
                name: '数据权限申请',
                path: 'userLicense',
                component: './dataLicense/userLicense/userLicense',
              },
              {
                name: '数据授权审核',
                path: 'licenseChecked',
                component: './dataLicense/licenseChecked/licenseChecked',
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
              }, {
                name: '年度投资申报',
                path: 'investmentDetails',
                component: './annualInvestment/investmentDetails',

              },
              {
                name: '运营数据采集导入',
                path: 'importFile',
                component: './dataAcquisition/importFile',
              },
              {
                name: '运营数据采集更新',
                path: 'update',
                component: './dataAcquisition/updateData',
              },
              {
                name: '运营数据采集增量更新',
                path: 'updateNew',
                component: './dataAcquisition/updateNewData',
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
                name: '动态页面模板',
                path: '/dynamicPage/pages/:dynamicPageId/:dynamicPageTitle/:title',
                component: './subApp',
              },
              {
                name: '动态应用管理',
                path: '/dynamicPage/params/:dynamicPageId/:dynamicPageTitle/:title',
                component: './subApp',
              },
              {
                name: '动态工作台',
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
                    path: 'index/productData',
                    component: './productBillboard/productData.jsx',
                  },
                  {
                    name: '系列视图查看页',
                    path: 'index/seriesData',
                    component: './productBillboard/seriesData.jsx',
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
            ],
          },
          {
            name: '产品数据管理',
            path: '/productDataManage',
            routes: [
              {
                name: '产品账户台账',
                path: 'accountParameter',
                component: './accountParameter/index',
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
                    name: '干系人信息详情修改',
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
              {
                name: '新机构信息管理',
                path: 'orgInfoManagement',
                routes: [
                  {
                    name: '机构信息管理',
                    path: 'index',
                    component: './orgInfoManagement/index',
                  },
                  {
                    name: '新建机构',
                    path: 'addExternalOrg',
                    component: './orgInfoManagement/addExternalOrg',
                  },
                  {
                    name: '机构修改/查看',
                    path: 'orgmodify',
                    component: './orgInfoManagement/orgmodify',
                  },
                  {
                    name: '黑名单',
                    path: 'blacklist',
                    component: './orgInfoManagement/blacklist',
                  },
                ],
              },
              {
                name: '权限交接详情',
                path: 'permissionTransfer',
                component: './permissionTransfer/detail',
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
          {
            name: '实物档案管理',
            path: '/physicalArchives',
            routes: [
              {
                name: '档案归档',
                path: 'archive',
                routes: [
                  {
                    name: '档案管理',
                    path: 'fileAngement',
                    routes: [
                      {
                        name: '档案管理',
                        path: 'index',
                        component: './archive/fileAngement/index',
                      },
                      {
                        name: '新增',
                        path: 'add',
                        component: './archive/fileAngement/add',
                      },
                      {
                        name: '查看',
                        path: 'details',
                        component: './archive/fileAngement/details',
                      },
                    ],
                  },
                  {
                    name: '档案库',
                    path: 'archives',
                    routes: [
                      {
                        name: '档案库',
                        path: 'index',
                        component: './archive/archives/index',
                      },
                      {
                        name: '查看页',
                        path: 'details',
                        component: './archive/archives/details',
                      },
                      {
                        name: '修改页',
                        path: 'modify',
                        component: './archive/archives/modify',
                      },
                    ],
                  },
                ],
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
                path: 'detail',
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
          {
            name: '招募说明书',
            path: 'prospectus',
            routes: [
              // {
              //   name: '招募说明书设置',
              //   path: 'prospectusConfig',
              //   component: './prospectusConfig'
              // },
              {
                name: '招募说明书设置查看',
                path: 'prospectusConfig/view',
                component: './prospectusConfig/pages/view'
              },
              {
                name: '招募说明书设置修改',
                path: 'prospectusConfig/edit',
                component: './prospectusConfig/pages/EditConfig'
              },

              {
                name: '招募说明书-标准模板',
                path: 'enlistStandardTpl',
                component: './enlistStandardTpl',
              },
              {
                name: '招募说明书设置',
                path: 'prospectusConfigIndex',
                component: './prospectusConfigIndex'
              },
              {
                name: '招募说明书看板',
                path: 'prospectusBoard',
                component: './prospectusBoard',
              },
              {
                name: '招募说明书产品类型模板',
                path: 'prospectusProductTypeTemplate',
                component: './prospectusProductTypeTemplate',
              },
              {
                name: '招募说明书标准模板',
                path: 'standardTemplateProspectus',
                component: './standardTemplateProspectus',
              },
              // 重构办理内容将置于子项目contract中
              {
                name: '招募说明书办理',
                path: 'processFlow',
                component: './processFlow/list',
              },
              {
                name: '招募说明书-编辑',
                path: 'processFlow/process',
                component: './processFlow/process',
              },
              {
                name: '招募说明书-新增临时更新',
                path: 'processFlow/addTmp',
                component: './processFlow/add',
              },
              {
                name: '招募说明书-新增全部更新',
                path: 'processFlow/addAll',
                component: './processFlow/add',
              },
            ]
          },
          {
            name: '基本信息管理项',
            path: 'baseInfoManagement',
            routes: [

              {
                name: '机构管理',
                path: 'institutionalManage',
                component: './institutionalManage',
              },
              {
                name: '机构信息',
                path: 'institutionalManage/organizationInformation',
                component: './institutionalManage/organizationInformation',
              },
              {
                name: '产品相关服务机构',
                path: 'productServiceOrganizations',
                component: './productServiceOrganizations',
              },
              {
                name: '产品基本信息',
                path: 'basicProductInformation',
                component: './basicProductInformation',
              },
              {
                name: '其他应披露事项',
                path: 'otherMattersDisclosed',
                component: './otherMattersDisclosed',
              },
              {
                name: '产品经理人任职情况',
                path: 'positionProductManager',
                component: './positionProductManager',
              },
              {
                name: '产品经理人简介',
                path: 'productManagerProfile',
                component: './productManagerProfile',
              },
              {
                name: '基金业绩',
                path: 'fundPerformance',
                component: './fundPerformance',
              },
              {
                name: '基金业绩注解',
                path: 'notesFundPerformance',
                component: './notesFundPerformance',
              },
            ],
          },
          {
            name: '产品管理',
            path: 'product',
            routes: [
              {
                name: '产品看板',
                path: 'bulletinBoard',
                component: './product/bulletinBoard',
              },
              {
                name: '产品详情',
                path: 'bulletinBoardInfo',
                component: './product/info',
              },
              {
                name: '信息管理',
                path: 'information',
                component: './product/information',
              },
              {
                name: '信息详情',
                path: 'informationInfo',
                component: './product/informationInfo',
              },
            ],
          },
          {
            name: '消息代办',
            path: 'messageTodo',
            component: './messageTodo',
          },
          {
            name: '绩效考核',
            path: '/assessment',
            icon: 'hdd',
            routes: [
              {
                name: '绩效考核',
                path: 'performAppraisal',
                component: './subApp',
              },
              {
                name: '收入分配',
                path: 'incomeDistribution',
                component: './subApp',
              },
              {
                name: '基础运营数据管理',
                path: 'dataMaintenance',
                component: './subApp',
              },
              {
                name: '导入数据查询',
                path: 'importData',
                component: './subApp',
              },
              {
                name: '产品对应关系',
                path: 'correspondingRelation',
                component: './subApp',
              },
              {
                name: '产品对应关系查看',
                path: 'correspondingRelationView',
                component: './subApp',
              },
              {
                name: '组织架构',
                path: 'organizationalStructure',
                component: './subApp',
              },
              {
                name: '组织架构查看',
                path: 'organizationalStructureView',
                component: './subApp',
              },
              {
                name: '新增组织架构',
                path: 'organizationalStructureAdd',
                component: './subApp',
              },
            ],
          },
          {
            name: '智能撰写',
            path: '/contract',
            icon: 'hdd',
            routes: [
              {
                name: '招募说明书主流程',
                path: 'prospectuSetHome',
                component: './subApp',
              },
              {
                name: '模板设置',
                path: 'templateSet',
                component: './subApp',
              },
              {
                name: '招募说明书设置',
                path: 'prospectuSet',
                component: './subApp',
              },
              {
                name: '投资组合报告',
                path: 'portfolioReport',
                component: './subApp',
              },
              {
                name: '投资组合报告-查看',
                path: 'portfolioReport/viewTable',
                component: './subApp',
              },
              {
                name: '招募说明书标准模板',
                path: 'standardTpl',
                component: './subApp',
              },
              {
                name: '招募说明书看板',
                path: 'instructionsBoard',
                component: './subApp',
              },
              {
                name: '招募说明书产品模板',
                path: 'productSet',
                component: './subApp',
              },
              {
                name: '招募说明书干预',
                path: 'prospectusIntervention',
                component: './subApp',
              },
              {
                name: '招募说明书干预-表单',
                path: 'prospectusIntervention/form',
                component: './subApp'
              },
              {
                name: '招募说明书干预-岗位表单',
                path: 'prospectusIntervention/formPositions',
                component: './subApp'
              },
              {
                name: '招募说明书干预-文档修改',
                path: 'interventionDefect/cxConfig',
                component: './subApp',
              },
              {
                name: '在线编辑',
                path: 'contractManage',
                component: './subApp',
              },
              {
                name: '模板管理',
                path: 'templateManage',
                component: './subApp',
              },
              {
                name: '合同管理',
                path: 'contractList',
                component: './subApp',
              },
              {
                name: '模板条款管理',
                path: 'templateClauseManage',
                component: './subApp',
              },
              // {
              //   name: '模板条款管理',
              //   path: 'prospectusConfigIndex',
              //   component: './subApp',
              // },

              {
                name: '招募说明书设置',
                path: 'prospectusConfigIndex',
                component: './subApp',
              },
              {
                name: '招募说明书设置查看',
                path: 'prospectusConfig/view',
                component: './subApp',
              },
              {
                name: '招募说明书设置修改',
                path: 'prospectusConfig/edit',
                component: './subApp',
              },
              {
                name: 'FormDemo',
                path: 'FormDemo',
                component: './subApp'
              },
              {
                name: '招募说明书标准模板',
                path: 'standardTemplateProspectus',
                component: './subApp',
              },
              //测试移植
              {
                name: '产品相关服务机构',
                path: 'productServiceOrganizations',
                component: './subApp',
              },
              {
                name: '产品相关服务机构-表单',
                path: 'productServiceOrganizations/form',
                component: './subApp',
              },

              {
                name: '产品基本信息',
                path: '/contract/basicProductInformation',
                component: './subApp',
              },
              {
                name: '产品基本信息-表单',
                path: '/contract/basicProductInformation/form',
                component: './subApp',
              },

              {
                name: '其他应披露事项',
                path: 'otherMattersDisclosed',
                component: './subApp/',
              },
              {
                name: '其他应披露事项-表单',
                path: 'otherMattersDisclosed/form',
                component: './subApp/',
              },
              {
                name: '产品经理人任职情况',
                path: '/contract/positionProductManager',
                component: './subApp/',
              },
              {
                name: '产品经理人任职情况-表单',
                path: '/contract/positionProductManager/form',
                component: './subApp/',
              },
              {
                name: '产品经理人简介',
                path: '/contract/productManagerProfile',
                component: './subApp/',
              },
              {
                name: '产品经理人简介-表单',
                path: '/contract/productManagerProfile/form',
                component: './subApp/',
              },
              {
                name: '机构管理',
                path: 'institutionalManage',
                component: './subApp/',
              },
              {
                name: '机构管理-表单',
                path: 'institutionalManage/form',
                component: './subApp/',
              },
              {
                name: '机构信息',
                path: 'institutionalManage/organizationInformation',
                component: './subApp/',
              },
              {
                name: '机构信息-表单',
                path: 'institutionalManage/organizationInformation/form',
                component: './subApp/',
              },
              {
                name: '基金业绩',
                path: '/contract/fundPerformance',
                component: './subApp/',
              },
              {
                name: '基金业绩-表单',
                path: '/contract/fundPerformance/form',
                component: './subApp/',
              },
              {
                name: '基金业绩注解',
                path: '/contract/notesFundPerformance',
                component: './subApp/',
              },
              {
                name: '基金业绩注解-表单',
                path: '/contract/notesFundPerformance/form',
                component: './subApp/',
              },
              {
                name: '投委会管理',
                path: '/contract/investmentCommittee',
                component: './subApp'
              },
              {
                name: '干预-修改文档',
                path: '/contract/interventionDefect',
                component: './subApp'
              },
            ],
          },
          {
            name: '工作台',
            path: '/workplace',
            icon: 'hdd',
            routes: [
              {
                name: '职能看板',
                path: 'functionalBoard',
                routes: [
                  {
                    name: '客户经理',
                    path: 'clientManager',
                    component: './clientManager/index.jsx',
                  },
                  {
                    name: '信披岗',
                    path: 'infoExposurePost',
                    component: './infoExposurePost/index.jsx',
                  },
                ],
              },
            ],
          },
          {
            name: '微信设置',
            path: '/wechat',
            icon: 'user',
            routes: [
              {
                name: '公众号管理',
                path: 'publicNum',
                component: './Wechat/publicNum/publicNum',
              },
              {
                name: '公众号操作',
                path: 'publicOperate',
                component: './Wechat/publicNum/publicOperate',
              },
              {
                name: '菜单管理',
                path: 'menuMan',
                component: './Wechat/publicNum/menuMan',
              },
              {
                name: '消息模板',
                path: 'mesMould',
                component: './Wechat/publicNum/mesMould',
              },
              {
                name: '新增模板',
                path: 'newMould',
                component: './Wechat/publicNum/menuSon/newMould',
              },
              {
                name: '用户列表',
                path: 'userList',
                component: './Wechat/publicNum/userList',
              },
            ],
          },
          ...SchedulingRouter,
          ...DataCenterRouter,
          ...PositionRouter,
          ...ReportWorldRouter,
          ...AccessManagerResources,
          ...CustomerServicesRouter,
          ...fileBorrower,
          ...ProductInventoryResources,
          // {
          //   component: './404',
          // },
        ],
      },
      // {
      //   component: './404',
      // },
    ],
  },
  // {
  //   component: './404',
  // },
];
