import React, { useEffect } from 'react';
import { errorBoundary } from '@/layouts/ErrorBoundary';
import { connect } from 'dva';
import { Card, Timeline } from 'antd';
import styles from './index.less';
import { PageContainers } from '@/components';

const Index = props => {
  const { dispatch, saveRecordList } = props;

  useEffect(() => {
    const { fileSerialNumber } = props.location.query;
    if (fileSerialNumber) handleGetRecord(fileSerialNumber);
  }, []);

  // 流转历史
  const handleGetRecord = fileSerialNumber => {
    dispatch({
      type: 'lifeCyclePRD/handleGetRecordListMsg',
      payload: { fileSerialNumber },
    });
  };

  const timeLine = () => {
    return (
      <Timeline>
        {saveRecordList.map(item => {
          return (
            <Timeline.Item key={item.startTime}>
              {`${item.startTime} `}&nbsp;&nbsp;&nbsp;
              {`${item.name} `}&nbsp;&nbsp;&nbsp;
              {`操作人：${item.startUserName}`}
            </Timeline.Item>
          );
        })}
      </Timeline>
    );
  };

  return (
    <PageContainers
      breadcrumb={[
        {
          title: '电子档案管理',
          url: '',
        },
        {
          title: '文档管理',
          url: '/electronic/electronicRecord',
        },
        {
          title: '流转记录',
          url: '',
        },
      ]}
    >
      <Card className={styles.searchForm}>
        <div>{timeLine()}</div>
      </Card>
    </PageContainers>
  );
};

const WrappedIndexForm = state => {
  const {
    dispatch,
    lifeCyclePRD: { saveRecordList },
  } = state;
  return {
    dispatch,
    saveRecordList,
  };
};

export default errorBoundary(connect(WrappedIndexForm)(Index));
