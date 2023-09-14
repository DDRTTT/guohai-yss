import { constant } from 'lodash';

export const tranDictsFun = (key, arr) => {
  if (!key) return '-';
  let tg = arr.find(item => item.id === key);
  return tg?.name || '-';
};
export const transFilesFun = (key, arr) => {
  if (!key) return '-';
  let tg = arr.find(item => item.code === key);
  return tg?.name || '-';
};

export const commonColumns = (transFiles, tranDicts, handlerDo) => {
  return [
    {
      title: '文件名称',
      dataIndex: 'fileName',
      width: 200,
      fixed: 'left',
    },
    {
      title: '档案号',
      dataIndex: 'fileNo',
      width: 200,
      align: 'center',
    },
    {
      title: '档案大类',
      dataIndex: 'fileCategories',
      width: 150,
      align: 'center',
      render: key => {
        return transFilesFun(key, transFiles);
      },
    },
    {
      title: '文档类型',
      dataIndex: 'fileType',
      width: 120,
      align: 'center',
      render: key => {
        return transFilesFun(key, transFiles);
      },
    },
    {
      title: '明细分类',
      dataIndex: 'detailClass',
      width: 200,
      align: 'center',
      render: key => {
        return transFilesFun(key, transFiles);
      },
    },
    {
      title: '文档载体',
      dataIndex: 'fileCarrier',
      width: 200,
      align: 'center',
    },
    {
      title: '档案室',
      dataIndex: 'fileRoom',
      width: 120,
      align: 'center',
      render: key => {
        return tranDictsFun(key, tranDicts);
      },
    },
    {
      title: '档案架',
      dataIndex: 'fileRack',
      width: 120,
      align: 'center',
      render: key => {
        return tranDictsFun(key, tranDicts);
      },
    },
    {
      title: '档案位置',
      dataIndex: 'fileLocation',
      width: 120,
      align: 'center',
      render: key => {
        return tranDictsFun(key, tranDicts);
      },
    },
    {
      title: '档案盒',
      dataIndex: 'fileBox',
      width: 120,
      align: 'center',
      render: key => {
        return tranDictsFun(key, tranDicts);
      },
    },
    {
      title: '保管期限',
      dataIndex: 'storageTime',
      width: 120,
      align: 'center',
    },
    {
      title: '操作',
      dataIndex: 'id',
      align: 'center',
      fixed: 'right',
      width: 100,
      render: handlerDo ? handlerDo : () => '',
    },
  ];
  // [
  //   {
  //     title: '文件名称',
  //     dataIndex: 'name',
  //     width: 200,
  //   },
  //   {
  //     title: '档案号',
  //     dataIndex: 'number',
  //     width: 80,
  //     align: 'center',
  //   },
  //   {
  //     title: '档案大类',
  //     dataIndex: 'test',
  //     width: 150,
  //     align: 'center',
  //   },
  //   {
  //     title: '文档类型',
  //     dataIndex: 'test1',
  //     width: 120,
  //     align: 'center',
  //   },
  //   {
  //     title: '明细分类',
  //     dataIndex: 'test2',
  //     width: 120,
  //     align: 'center',
  //   },
  //   {
  //     title: '文档载体',
  //     dataIndex: 'test3',
  //     width: 120,
  //     align: 'center',
  //   },
  //   {
  //     title: '档案室',
  //     dataIndex: 'test4',
  //     width: 80,
  //     align: 'center',
  //   },
  //   {
  //     title: '档案架',
  //     dataIndex: 'test5',
  //     width: 120,
  //     align: 'center',
  //   },
  //   {
  //     title: '档案位置',
  //     dataIndex: 'test6',
  //     width: 120,
  //     align: 'center',
  //   },
  //   {
  //     title: '档案盒',
  //     dataIndex: 'test7',
  //     width: 120,
  //     align: 'center',
  //   },
  //   {
  //     title: '保管期限',
  //     dataIndex: 'test8',
  //     width: 120,
  //     align: 'center',
  //   },
  //   {
  //     title: '操作',
  //     dataIndex: 'urlType',
  //     align: 'center',
  //     fixed: 'right',
  //     width: 360,
  //     render: (urlType, record) => (
  //       <div className={styles.handlers}>
  //         <Button type="link">查看</Button>
  //         <Button type="link">修改</Button>
  //         <Button type="link">审核</Button>
  //         <Button type="link">延期</Button>
  //         <Button type="link">归还</Button>
  //         <Button type="link">确认归还</Button>
  //         <Button type="link">催还</Button>
  //         <Button type="link">删除</Button>
  //       </div>
  //     ),
  //   },
  // ];
};

// 状态常量
export const constantStatus = [
  {
    key: 'save',
    code: 'D001_1',
    title: '保存',
  },
  {
    key: 'submit',
    code: 'D001_2',
    title: '提交',
  },
];

export const getStatus = key => {
  return constantStatus.find(item => item.key === key).code;
};

// 操作常量
export const handlerCodes = [
  {
    key: 'check',
    code: '1',
    title: '审核',
  },
  {
    key: 'late',
    code: '2',
    title: '延期',
  },
  {
    key: 'return',
    code: '3',
    title: '归还',
  },
  {
    key: 'confirm',
    code: '4',
    title: '确认',
  },
  {
    key: 'urge',
    code: '5',
    title: '催还',
  },
];

export const getHandlerCode = key => {
  return handlerCodes.find(item => item.key === key).code;
};
