// 产品看板 - 产品信息 - 时间轴
import React, { useContext, useEffect, useState } from 'react';
import { Timeline, Button, Anchor, message, Spin } from 'antd';
import { errorBoundary } from '@/layouts/ErrorBoundary';
import { connect, routerRedux } from 'dva';
import router from 'umi/router';
import styles from './index.less';
import MyContext from './myContext';
import { handleAddStageSlecct } from './baseFunc';
import { handleShowTransferHistory } from '@/utils/transferHistory';

const { Link } = Anchor;

const TimeLine = ({ dispatch, productBillboard: { dicts, productTimeLine } }) => {
  const { proCodeArguments } = useContext(MyContext); // 子组件接受的数据
  const [loadingData, setLoadingData] = useState(true);

  /**
   * 获取流程阶段字典
   */
  const handleGetDictsData = () => {
    dispatch({
      type: 'productBillboard/getDicts',
      payload: { codeList: ['M001'] },
    });
  };

  // 获取时间轴信息
  const handleGetTimeLineData = () => {
    dispatch({
      type: 'productBillboard/timeLineData',
      payload: proCodeArguments,
      callback: () => {
        setLoadingData(false);
      },
    });
  };

  // 流转历史
  const handleCanLocationHistory = record => {
    const url = `/processCenter/processHistory?processInstanceId=${record.processInstanceId}`;
    router.push(url);
  };

  const handleChangeVlue = val => {
    return val.replace(/lifecycle_/, '产品生命周期');
  };

  // 创建时间轴
  const handleAddTimeLine = () => {
    const timeLineItem = [];
    let timeLineItemChild = [];
    for (const key of productTimeLine.rows) {
      for (const childKey in key) {
        const ruleData = ['startUserName'];
        const ruleTwoData = ['processStatusName'];
        const ruleNewData = ['startTime', 'endTime', 'processName', 'productContractAbbreviation'];
        if (ruleData.includes(childKey)) {
          timeLineItemChild.push(<span className={styles.timeLineSpan}>{key[childKey]}</span>);
        } else if (ruleTwoData.includes(childKey)) {
          timeLineItemChild.push(
            <span className={styles.timeLineSpan} style={{ float: 'right' }}>
              {key[childKey]}
            </span>,
          );
        } else if (ruleNewData.includes(childKey)) {
          timeLineItemChild.push(
            <span className={styles.timeLineSpan}>{handleChangeVlue(key[childKey])}</span>,
          );
        }
      }
      timeLineItem.push(
        <Timeline.Item key={key.processInstanceId}>
          <Button
            type="link"
            style={{ float: 'right', position: 'relative', bottom: '5px' }}
            onClick={() => {
              handleShowTransferHistory(key);
            }}
          >
            流转历史
          </Button>
          {timeLineItemChild}
        </Timeline.Item>,
      );
      timeLineItemChild = [];
    }
    return <Timeline style={{ marginRight: '15%' }}>{timeLineItem}</Timeline>;
  };

  const handleAddButton = () => {
    return (
      <Button type="primary" onClick={() => handleExportFile(productTimeLine.rows)}>
        导出
      </Button>
    );
  };

  const tableToExcel = data => {
    const base64 = s => window.btoa(unescape(encodeURIComponent(s)));

    let str =
      '<tr><td>流程名称</td><td>开始时间</td><td>结束时间</td><td>流程状态</td><td>用户名称</td><td>processInstanceId</td><td>startUserId</td></tr>';
    for (let i = 0; i < data.length; i++) {
      str += '<tr>';
      for (const key in data[i]) {
        str += `<td>${data[i][key] + '\t'}</td>`;
      }
      str += '</tr>';
    }
    const worksheet = '产品生命周期 - 时间轴';
    const uri = 'data:application/vnd.ms-excel;base64,';
    const template = `<html xmlns:o="urn:schemas-microsoft-com:office:office"
    xmlns:x="urn:schemas-microsoft-com:office:excel"
    xmlns="http://www.w3.org/TR/REC-html40">
    <head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet>
    <x:Name>${worksheet}</x:Name>
    <x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet>
    </x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]-->
    </head><body><table>${str}</table></body></html>`;
    window.location.href = uri + base64(template);
  };

  const handleExportFile = data => {
    const arr = [];
    for (const i of data) {
      arr.push({
        流程名称: handleChangeVlue(i.processName),
        开始时间: i.startTime || '',
        结束时间: i.endTime || '',
        流程状态: i.processStatusName,
        用户名称: i.startUserName,
        processInstanceId: i.processInstanceId,
        startUserId: i.startUserId,
      });
    }
    tableToExcel(arr);
  };

  useEffect(() => {
    handleGetDictsData();
    handleGetTimeLineData();
  }, [proCodeArguments]);

  return (
    <Spin spinning={loadingData}>
      <div style={{ height: '30px' }}>
        {/* {handleAddStageSlecct(dicts.M001, '所有流程阶段')} */}
        {handleAddButton()}
      </div>
      <div style={{ width: '96%', position: 'relative', left: '2%', top: '10px' }}>
        {handleAddTimeLine()}
      </div>
    </Spin>
  );
};

const WrappedIndexForm = errorBoundary(
  connect(({ productBillboard }) => ({
    productBillboard,
  }))(TimeLine),
);

export default WrappedIndexForm;
