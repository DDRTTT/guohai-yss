// 数据中心
const DataCenterResources = [
  {
    id: '101',
    code: 'dataAnalysisInquiryService',
    title: '查询服务',
    icon: 'tool',
    name: '查询服务',
    href: '',
    description: '',
    actions: [],
    path: '',
    children: [
      {
        id: 101001,
        code: 'tableview',
        path: '/dataSource/tableview',
        title: '数据视图',
        icon: '',
        name: '数据视图',
        href: '',
        description: '',
        actions: [
          {
            id: 101001001,
            code: 'tableview:del',
            name: '删除',
            method: 'DELETE',
            type: 'btn',
            tabUri: '///',
            description: '',
            uri: '/dataAnalysisInquiryService/tableview/del/{$id}',
            uriFlag: '/yss-datamiddle-dataservice-query',
          },
        ],
      },
      {
        id: 101002,
        code: 'datamodel',
        path: '/dataSource/datamodel',
        title: '数据主题',
        icon: '',
        name: '数据主题',
        href: '',
        description: '',
        actions: [
          {
            id: 101002001,
            code: 'datamodel:del',
            name: '删除',
            method: 'DELETE',
            type: 'btn',
            tabUri: '///',
            description: '',
            uri: '/dataAnalysisInquiryService/datamodel/del/{$id}',
            uriFlag: '/yss-datamiddle-dataservice-query',
          },
        ],
      },
      {
        id: 101003,
        code: 'standardService',
        path: '/dataSource/standardService',
        title: '数据服务',
        icon: '',
        name: '数据服务',
        href: '',
        description: '',
        actions: [
          {
            id: 101003001,
            code: 'standardService:del',
            name: '删除',
            method: 'DELETE',
            type: 'btn',
            tabUri: '///',
            description: '',
            uri: '/dataAnalysisInquiryService/standardService/del/{$id}',
            uriFlag: '/yss-datamiddle-dataservice-query',
          },
        ],
      },
      {
        id: 101004,
        code: 'dataPushing',
        path: '/dataSource/dataPushing',
        title: '数据推送',
        icon: '',
        name: '数据推送',
        href: '',
        description: '',
        actions: [
          {
            id: 101004001,
            code: 'dataPushing:del',
            name: '删除',
            method: 'DELETE',
            type: 'btn',
            tabUri: '///',
            description: '',
            uri: '/dataAnalysisInquiryService/dataPushing/del/{$id}',
            uriFlag: '/yss-datamiddle-dataservice-query',
          },
        ],
      },
    ],
  },
  {
    id: '102',
    code: 'dataSource',
    title: '数据源',
    icon: 'tool',
    name: '数据源',
    href: '',
    description: '',
    actions: [],
    path: '',
    children: [
      {
        id: 102001,
        code: 'dataConn',
        path: '/dataSource/dataConn',
        title: '数据连接',
        icon: '',
        name: '数据连接',
        href: '',
        description: '',
        actions: [
          {
            id: 102001001,
            code: 'dataSource:dataConn',
            name: '数据连接',
            method: 'Edit',
            type: 'btn',
            tabUri: '///',
            description: '',
            uri: '/dataSource/labelEdit',
            uriFlag: '/yss-datamiddle-dataservice-query',
          },
        ],
      },
      {
        id: 102002,
        code: 'label',
        path: '/dataSource/label',
        title: '标签管理',
        icon: '',
        name: '标签管理',
        href: '',
        description: '',
        actions: [
          {
            id: 102001001,
            code: 'labelEdit:edit',
            name: '标签编辑',
            method: 'Edit',
            type: 'btn',
            tabUri: '///',
            description: '',
            uri: '/dataSource/labelEdit',
            uriFlag: '/yss-datamiddle-dataservice-query',
          },
        ],
      },
      {
        id: 102003,
        code: 'system',
        path: '/dataSource/system',
        title: '应用系统名录',
        icon: '',
        name: '应用系统名录',
        href: '',
        description: '',
        actions: [
          {
            id: 104003001,
            code: 'systemEdit:edit',
            name: '应用系统编辑',
            method: 'EDIT',
            type: 'btn',
            tabUri: '///',
            description: '',
            uri: '/dataSource/systemEdit',
            uriFlag: '/yss-datamiddle-dataservice-query',
          },
          {
            id: 104003002,
            code: 'systemInfo:query',
            name: '应用系统详情',
            method: 'QUERY',
            type: 'btn',
            tabUri: '///',
            description: '',
            uri: '/dataSource/systemInfo',
            uriFlag: '/yss-datamiddle-dataservice-query',
          },
        ],
      },
      {
        id: 102004,
        code: 'dataPushing',
        path: '/dataSource/dataPushing',
        title: '数据推送',
        icon: '',
        name: '数据推送',
        href: '',
        description: '',
        actions: [
          {
            id: 104003001,
            code: 'dataPushing:edit',
            name: '数据推送',
            method: 'EDIT',
            type: 'btn',
            tabUri: '///',
            description: '',
            uri: '/dataSource/systemEdit',
            uriFlag: '/yss-datamiddle-dataservice-query',
          },
        ],
      },
    ],
  },
];

export default DataCenterResources;