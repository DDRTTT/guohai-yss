import Mock from 'mockjs';
const tableData = () => {
  let tableData = [];
  for (let i = 0; i < 13; i++) {
    let row = Mock.mock({
      'id|1-100': 100,
      proName: '@first',
      proCode: '@natural',
      'assetTypeName|1': ['单一', '小集合', '大集合'],
      proSdate: '@date',
      causeTermination: '@first',
      taskTime: '@date',
      'status|1': ['待提交', '流程中', '已结束'],
      'checked|1': ['S001_1', 'S001_2', 'S001_3'],
    });
    tableData.push(row);
  }
  return tableData;
};

const getTableData = (req, res) => {
  const data = {
    status: 200,
    message: null,
    data: {
      total: 13,
      rows: tableData(),
    },
  };

  res.json(data);
};

// 产品终止流程 列表页
export default {
  'POST /ams/mock/productTermination/getList': getTableData,
};
