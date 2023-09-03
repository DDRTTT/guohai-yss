import Mock from 'mockjs';
// 生成mock的数据
function tableList() {
  let arr = [];
  let i = 0;
  while (i < 10) {
    i++;
    arr.push(
      Mock.mock({
        'clientType|1-1000': 1000,
        'id|1-100': 100,
        'taskId|1-100': 100,
        'instanceId|1-100': 100,
        clientName: '@first',
        'isProfessInvestor|1': ['是', '否'],
        creditCode: '@natural',
        reviewProduct: '审查产品',
        'auditItems|1': ['合格性', '适当性', '反洗钱'],
        missionArrivalTime: '@date',
        'checked|1': ['已审核', '未审核'],
        buniessId: '@natural',
      }),
    );
  }
  return arr;
}
export default {
  //获取table的数据
  'POST /ams/wangxinnone/investorExamine/taskCount': {
    status: 200,
    message: '成功',
    data: {
      rows: tableList(),
      total: 10,
    },
  },
};
