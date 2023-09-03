/**
 * 产品看板-查看产品-产品数据-费率信息
 */
import React, { useContext } from 'react';
import { Col, Divider, Row, Table } from 'antd';
import { connect } from 'dva';
import { errorBoundary } from '@/layouts/ErrorBoundary';
import MyContext from './myContext';
import styles from './index.less';
import {
  handleChangeNumberToFloat,
  handleChangeNumberToFloat100,
  handleChangeThousands,
} from './baseFunc';
import { tableRowConfig } from '@/pages/investorReview/func';

const ProductMessageRate = ({
  dispatch,
  listLoading,
  productBillboard: { productOverviewMessage },
}) => {
  const { codeListData, codeListCodeData } = useContext(MyContext); // 子组件接受的数据

  // 费率信息(栅格信息) 100%
  const rateData = {
    rateCategory: '费用品种',
    rateType: '费率类型',
    rate: '固定费率(%)',
    fixedExpenses: '固定费用(元)',
    provisionBenchmark: '费用的计提基准',
    annualOperationalDays: '费率年天数',
    guaranteedCostNeed: '是否有保底费用',
    guaranteedCost: '保底费用金额(元)',
    floatingRate: '浮动费率(%)',
  };

  // 表头数据(费率信息)
  const rateColumns = [
    {
      title: '基本费率',
      dataIndex: 'basicRate',
      key: 'basicRate',
      ...tableRowConfig,
    },
    {
      title: '基准类型',
      dataIndex: 'datumTypeName',
      key: 'datumTypeName',
      ...tableRowConfig,
    },
    {
      title: '基准下线',
      dataIndex: 'baselineLine',
      key: 'baselineLine',
      ...tableRowConfig,
      align: 'right',
    },
    {
      title: '基准上线(含)',
      dataIndex: 'baselineOnline',
      key: 'baselineOnline',
      ...tableRowConfig,
      align: 'right',
    },
    {
      title: '比率值(%)',
      dataIndex: 'ratioValue',
      key: 'ratioValue',
      ...tableRowConfig,
      align: 'right',
    },
    {
      title: '固定值',
      dataIndex: 'fixedValue',
      key: 'fixedValue',
      ...tableRowConfig,
      align: 'right',
    },
    {
      title: '最大值',
      dataIndex: 'maxinmumValue',
      key: 'maxinmumValue',
      ...tableRowConfig,
      align: 'right',
    },
    {
      title: '最小值',
      dataIndex: 'minimumValue',
      key: 'minimumValue',
      ...tableRowConfig,
      align: 'right',
    },
  ];

  /**
   * 费率信息渲染
   * @param {String} dataTitle  页标题
   * @param {Object} dataName 数据名称
   * @param {Object} data 数据源
   * @param rateColumns
   * @param wordChange
   */
  const handleAddRateCol = (dataTitle, dataName, data, rateColumns, wordChange) => {
    const rowColData = [];
    if (Array.isArray(data) && +data !== 0) {
      for (const key in data) {
        if (data[key].rateType !== 'X007_2') {
          for (const newKey in data[key]) {
            if (!Array.isArray(data[key][newKey])) {
              if (typeof dataName[newKey] !== 'undefined') {
                rowColData.push(
                  <Col span={6} className={styles.rowColBody}>
                    <span style={{ fontSize: '15px' }} className={styles.dataName}>
                      {dataName[newKey]}：
                    </span>
                    {wordChange(data[key][newKey], dataName[newKey])}
                  </Col>,
                );
              }
            }
          }
          rowColData.push(<Divider />);
        } else {
          for (const newKey in data[key]) {
            if (!Array.isArray(data[key][newKey])) {
              if (typeof dataName[newKey] !== 'undefined') {
                rowColData.push(
                  <Col span={6} className={styles.rowColBody}>
                    <span style={{ fontSize: '15px' }}>{dataName[newKey]}：</span>
                    {wordChange(data[key][newKey], dataName[newKey])}
                  </Col>,
                );
              }
            } else if (Array.isArray(data[key][newKey])) {
              rowColData.push(
                <Table
                  style={{ padding: '0 0 2% 1.4%' }}
                  loading={listLoading} // 加载中效果
                  rowKey={record => record.id} // key值
                  columns={rateColumns}
                  dataSource={data[key][newKey]}
                />,
              );
            }
          }
          rowColData.push(<Divider />);
        }
      }
    } else {
      for (const i in dataName) {
        rowColData.push(
          <Col span={6} className={styles.rowColBody}>
            <span style={{ fontSize: '15px' }}>{dataName[i]}：</span>
          </Col>,
        );
      }
    }

    return (
      <div className={styles.dataTitle}>
        <Row>
          <h3 style={{ fontSize: '20px', paddingBottom: '10px' }}>{dataTitle}</h3>
          {rowColData}
        </Row>
      </div>
    );
  };

  /**
   * 词汇替换(字典)
   * @param {String} val 词汇值
   */
  const handleUpdateNameValue = val => {
    if (Array.isArray(val)) {
      const arr = [];
      for (const key of val) {
        if (codeListCodeData.includes(key)) {
          arr.push(codeListData[key]);
        }
      }
      return arr;
    }
    if (codeListCodeData.includes(val)) {
      return codeListData[val];
    }
    return val;
  };

  /**
   * 词汇替换(是否)
   * @param {String} val 词汇值
   */
  const handleUpdateNameValueYesAndNo = val => {
    if (val === '1') {
      return '是';
    }
    if (val === '0') {
      return '否';
    }
    return val;
  };

  const arrDicts = ['费用品种', '费率类型', '费用的计提基准', '费率年天数'];

  const arrYesAndNo = ['是否有保底费用'];

  const handleChangeWords = (val, val2) => {
    if (arrDicts.includes(val2)) {
      return handleUpdateNameValue(val);
    }
    if (arrYesAndNo.includes(val2)) {
      return handleUpdateNameValueYesAndNo(val);
    }
    if (val2 === '固定费用(元)') {
      return handleChangeThousands(val);
    }
    if (val2 === '保底费用金额(元)') {
      return handleChangeThousands(val);
    }
    if (val2 === '固定费率(%)') {
      return handleChangeNumberToFloat100(val);
    }
    if (val2 === '浮动费率(%)') {
      return handleChangeNumberToFloat100(val);
    }
    if (typeof val === 'number') {
      return handleChangeNumberToFloat(val);
    }
    return val;
  };

  return (
    <>
      {handleAddRateCol(
        '费率信息',
        rateData,
        productOverviewMessage,
        rateColumns,
        handleChangeWords,
      )}
    </>
  );
};

const WrappedIndexForm = errorBoundary(
  connect(({ productBillboard, loading }) => ({
    productBillboard,
    listLoading: loading.effects['productBillboard/overviewMessageListData'],
  }))(ProductMessageRate),
);

export default WrappedIndexForm;
