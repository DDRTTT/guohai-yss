/**
 * 日志详情
 */

import React, { useEffect } from 'react';
import { connect, Dispatch } from 'dva';
import { Button, Col, Form, Input, Row } from 'antd';
import { formatJson } from '@/utils/utils';
import styles from './operationLog.less';
import { errorBoundary } from '@/layouts/ErrorBoundary';
import { LogBase, Operator, saveLogDetails } from './data.d';
import router from 'umi/router';
import { AnyAction } from 'redux';
import { Card, PageContainers } from '@/components';
import Gird from '@/components/Gird';

const { TextArea } = Input;

interface locationProps {
  query: {
    startTime: string;
    id: string;
  };
}

const Index: React.FC<{
  dispatch: Dispatch<AnyAction>;
  operationLog: {
    saveLogDetails: saveLogDetails;
  };
  fetchLogDetailsLoading: boolean;
  location: locationProps;
}> = ({
  dispatch,
  operationLog: { saveLogDetails },
  fetchLogDetailsLoading,
  location: { query },
}) => {
  useEffect(() => {
    const { id, startTime } = query;
    dispatch({
      type: `operationLog/fetchLogDetails`,
      payload: { id, startTime },
    });
  }, []);

  // 日志基本信息
  const logBaseInformation = (item: LogBase) => {
    const drawerConfig = [
      { label: '服务名', value: 'service' },
      { label: '主机名', value: 'host' },
      { label: '端口号', value: 'port' },
      { label: '日志级别', value: 'severity' },
      { label: '线程', value: 'thread' },
      { label: '进程号', value: 'pid' },
      { label: '终端请求方式', value: 'type' },
      { label: '操作人ID', value: 'userId' },
      { label: '用户归属机构ID', value: 'orgId' },
      { label: '操作人终端IP', value: 'userHost' },
      { label: '用户归属系统ID', value: 'fsysId' },
    ]
    return (
      <>
        <Gird config={drawerConfig} info={item}/>
      </>
    )
  };

  // 操作信息
  const operatorInformation = (item: Operator) => {
    const drawerConfig = [
      { label: '请求类名', value: 'className' },
      { label: '请求类名描述', value: 'swaggerApi' },
      { label: '请求方法', value: 'classMethod' },
      { label: '请求方法描述', value: 'swaggerApiOperation' },
      { label: '请求方式', value: 'method' },
      { label: '请求路径', value: 'url' },
      { label: '请求终端IP', value: 'clientIp' },
      { label: '请求sessionId', value: 'sessionId' },
      { label: '请求开始时间', value: 'startTime' },
      { label: '请求结束时间', value: 'endTime' },
      { label: '接口返回时间', value: 'returnTime' },
      { label: '请求耗时', value: 'timeConsuming' },
      { label: '响应码', value: 'httpStatusCode' },
    ]
    return (
      <>
        <Gird config={drawerConfig} info={item}/>
      </>
    )
  };

  return (
    <PageContainers
      breadcrumb={[
        {
          title: '系统日志管理',
          url: '',
        },
        {
          title: '业务操作日志',
          url: '/LogQuery/logList',
        },
        {
          title: '详情',
          url: '',
        },
      ]}
    >
      <Card
        bordered={false}
        title="日志基本信息"
        style={{ minHeight: 50 }}
        loading={fetchLogDetailsLoading}
        extra={<Button onClick={() => router.go(-1)}>取消</Button>}
      >
        {logBaseInformation(saveLogDetails)}
      </Card>

      <Card
        bordered={false}
        title="操作信息"
        style={{ minHeight: 50, marginTop: 24, marginBottom: 24 }}
        loading={fetchLogDetailsLoading}
      >
        {operatorInformation(saveLogDetails)}
      </Card>

      <div style={{ marginTop: 24, marginBottom: 24 }} className={styles.logList}>
        <Row gutter={24}>
          <Col xl={12} lg={24} md={24} sm={24} xs={24}>
            <Card loading={fetchLogDetailsLoading} bordered={false} title="输入信息">
              <TextArea
                disabled
                value={formatJson(saveLogDetails.requestData)}
                className={styles.area}
              />
            </Card>
          </Col>

          <Col xl={12} lg={24} md={24} sm={24} xs={24}>
            <Card loading={fetchLogDetailsLoading} bordered={false} title="输出信息">
              <TextArea
                disabled
                value={formatJson(saveLogDetails.responseData)}
                className={styles.area}
              />
            </Card>
          </Col>
        </Row>
      </div>
    </PageContainers>
  );
};

// @ts-ignore
export default errorBoundary(
  Form.create()(
    connect(
      ({
        operationLog,
        loading,
      }: {
        operationLog: {
          saveLogDetails: saveLogDetails;
        };
        loading: { effects: Record<string, boolean> };
      }) => ({
        operationLog,
        fetchLogDetailsLoading: loading.effects['operationLog/fetchLogDetails'],
      }),
    )(Index),
  ),
);
