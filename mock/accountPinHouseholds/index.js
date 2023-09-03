const getTableData = (req, res) => {
  const data = {
    status: 200,
    message: null,
    data: {
      total: 10,
      rows: [
        {
          processInstanceId: 'b4a751a5-c347-11ea-91e7-0a580a2a0a01',
          processDefinitionId: '37bd121b-c2ad-11ea-a703-0a580a2a0a01',
          taskId: 'b536e7cb-c347-11ea-91e7-0a580a2a0a01',
          taskDefinitionKey: 'Activity_0iwxwz1',
          taskTime: '2020-07-11T15:25:33.859',
        },
        {
          processInstanceId: '98f48fe3-c347-11ea-91e7-0a580a2a0a01',
          processDefinitionId: '37bd121b-c2ad-11ea-a703-0a580a2a0a01',
          taskId: '99eafd29-c347-11ea-91e7-0a580a2a0a01',
          taskDefinitionKey: 'Activity_0iwxwz1',
          taskTime: '2020-07-11T15:24:48.063',
        },
        {
          id: '4028b2817328a558017328b8168b000c',
          processInstanceId: '3ec4d566-c038-11ea-88d4-0a580a2a0a01',
          processDefinitionId: 'ba46d60f-c037-11ea-88d4-0a580a2a0a01',
          taskId: '1be461e5-c330-11ea-a703-0a580a2a0a01',
          taskDefinitionKey: 'Activity_0omrs1o',
          accountStatus: '已生效',
          taskTime: '2020-07-11T12:36:38.201',
          status: '待复核',
        },
        {
          id: '4028b2817328a558017328b8168b000c',
          processInstanceId: '3ec4d566-c038-11ea-88d4-0a580a2a0a01',
          processDefinitionId: 'ba46d60f-c037-11ea-88d4-0a580a2a0a01',
          taskId: '1be461e5-c330-11ea-a703-0a580a2a0a01',
          taskDefinitionKey: 'Activity_0omrs1o',
          accountStatus: '已生效',
          taskTime: '2020-07-11T12:36:38.201',
          status: '待复核',
        },
        {
          processInstanceId: '217733b3-c1b6-11ea-a703-0a580a2a0a01',
          processDefinitionId: 'ba46d60f-c037-11ea-88d4-0a580a2a0a01',
          taskId: '070631a2-c275-11ea-a703-0a580a2a0a01',
          taskDefinitionKey: 'Activity_0iwxwz1',
          taskTime: '2020-07-10T14:17:27.303',
        },
        {
          id: '4028b28173375129017337567d440000',
          processInstanceId: '48cd415b-c273-11ea-a703-0a580a2a0a01',
          processDefinitionId: 'ba46d60f-c037-11ea-88d4-0a580a2a0a01',
          taskId: '4991f036-c273-11ea-a703-0a580a2a0a01',
          taskDefinitionKey: 'Activity_0iwxwz1',
          accountStatus: '已生效',
          taskTime: '2020-07-10T14:04:59.955',
          status: '待复核',
        },
        {
          id: '4028e6ea7331b72b017332a099cd000c',
          processInstanceId: '47c43f32-c1bb-11ea-a703-0a580a2a0a01',
          processDefinitionId: 'ba46d60f-c037-11ea-88d4-0a580a2a0a01',
          taskId: '482439e3-c1bb-11ea-a703-0a580a2a0a01',
          taskDefinitionKey: 'Activity_0iwxwz1',
          needRecord: '否',
          accountStatus: '已生效',
          taskTime: '2020-07-09T16:07:50.16',
          status: '待复核',
        },
        {
          id: '4028e6ea7331b72b0173328870800009',
          processInstanceId: '97ef74e1-c1b7-11ea-a703-0a580a2a0a01',
          processDefinitionId: 'ba46d60f-c037-11ea-88d4-0a580a2a0a01',
          taskId: '986122d6-c1b7-11ea-a703-0a580a2a0a01',
          taskDefinitionKey: 'Activity_0iwxwz1',
          needRecord: '否',
          accountStatus: '已生效',
          accountName: 'test产品的托管账户',
          taskTime: '2020-07-09T15:41:26.79',
          status: '待复核',
          accountNo: '000001',
          openingInstitution: '1',
        },
        {
          processInstanceId: 'b5d64310-c100-11ea-98f2-0a580a2a0a01',
          processDefinitionId: 'ba46d60f-c037-11ea-88d4-0a580a2a0a01',
          taskId: 'b5d69149-c100-11ea-98f2-0a580a2a0a01',
          taskDefinitionKey: 'Activity_161uwx7',
          taskTime: '2020-07-08T17:52:18.312',
        },
        {
          processInstanceId: '14ca3868-c038-11ea-88d4-0a580a2a0a01',
          processDefinitionId: 'ba46d60f-c037-11ea-88d4-0a580a2a0a01',
          taskId: '14cb22e1-c038-11ea-88d4-0a580a2a0a01',
          taskDefinitionKey: 'Activity_161uwx7',
          taskTime: '2020-07-07T17:56:08.778',
        },
      ],
    },
  };

  res.json(data);
};
const getAccountList = (req, res) => {
  const data = {
    status: 200,
    message: null,
    data: [
      {
        id: '01',
        name: '0001',
      },
      {
        id: '02',
        name: '0002',
      },
    ],
  };
  res.json(data);
};
const getProductList = (req, res) => {
  const data = {
    status: 200,
    message: null,
    data: [
      {
        code: '01',
        name: '0001',
      },
      {
        code: '02',
        name: '0002',
      },
    ],
  };

  res.json(data);
};

// 产品募集期调整 列表（搜索）
export default {
  'POST /ams/accountCancellationProcess/selectAccountCancellationTaskList': getTableData,
};
