import Mock from 'mockjs';

// 生成mock的数据
function tableList() {
  const itemObj = Mock.mock({
    proName: '@cparagraph(1)',
    proCode: '@first',
    investmentManager: '@name',
    raiseSdate: "@date('yyyy-MM-dd')",
    raiseEdateExpect: "@date('yyyy-MM-dd')",
    clientName: '@first',
    taskArriveTime: '@datetime',
    'auditItems|1': ['合格性', '适当性', '反洗钱'],
    missionArrivalTime: '@date',
    'taskStatus|1': ['已审核', '未审核'],
    id: '@id',
  });
  return Array(10).fill(itemObj);
}
export default {
  // 获取table的数据
  'POST /ams/raiseAnnouncement/taskList': {
    status: 200,
    message: '成功',
    data: tableList(),
    total: 200,
  },
};
