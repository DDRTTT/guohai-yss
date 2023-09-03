export const dict = {
  S001: [
    {
      code: 'dolor sunt laborum aliqua',
      name: 'cillum nostrud magna',
    },
    {
      code: 'dolor',
      name: 'Duis',
    },
    {
      code: 'ut sint',
      name: 'qui pariatur eu velit',
    },
    {
      code: 'non do',
      name: 'in deserunt dolore',
    },
    {
      code: 'nostrud ipsum et consequat aliqua',
      name: 'dolore Ut dolore',
    },
  ],
  A002: [
    {
      code: 'dolor sunt laborum aliqua',
      name: 'cillum nostrud magna',
    },
    {
      code: 'dolor',
      name: 'Duis',
    },
    {
      code: 'ut sint',
      name: 'qui pariatur eu velit',
    },
    {
      code: 'non do',
      name: 'in deserunt dolore',
    },
    {
      code: 'nostrud ipsum et consequat aliqua',
      name: 'dolore Ut dolore',
    },
  ],
  T001: [
    {
      code: 'dolor sunt laborum aliqua',
      name: 'cillum nostrud magna',
    },
    {
      code: 'dolor',
      name: 'Duis',
    },
    {
      code: 'ut sint',
      name: 'qui pariatur eu velit',
    },
    {
      code: 'non do',
      name: 'in deserunt dolore',
    },
    {
      code: 'nostrud ipsum et consequat aliqua',
      name: 'dolore Ut dolore',
    },
  ],
};

export const getTaskList = (req, res) => {
  let data = {
    status: 200,
    message: null,
    data: {
      total: 2,
      rows: [
        {
          id: '8a8abf2872b735640172b73dd2870000',
          taskId: null,
          procInsId: null,
          proName: '托管发行22',
          proCode: 'SIF0000006',
          proType: 'SIF',
          investmentManager: '杰瑞',
          raiseSdate: '2010-04-01',
          adjustEndDate: '5020-04-12',
          adjustmentType: '1',
          taskArriveTime: '2020-06-15 17:09:41',
          status: '待提交',
        },
        {
          id: '8a8abf28727d0fce01727d1004100002',
          taskId: null,
          procInsId: null,
          proName: '凯联安享新机遇私募投资基金',
          proCode: 'PSIF000005',
          proType: 'PSIF',
          investmentManager: null,
          raiseSdate: null,
          adjustEndDate: '2020-06-24',
          adjustmentType: '1',
          taskArriveTime: '2020-06-06 00:00:00',
          status: '待提交',
        },
      ],
    },
  };

  res.json(data);
};

export const getDict = (req, res) => {
  let obj = {};
  let query = req.query.dictCode.split(',');
  for (let i = 0; i < query.length; i++) {
    obj[query[i]] = dict[query[i]];
  }
  let data = {
    status: 200,
    message: 'success',
    data: obj,
  };

  res.json(data);
};
