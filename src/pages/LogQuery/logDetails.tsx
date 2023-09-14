/**
 * 日志详情
 */

import React, { useEffect } from 'react';
import { connect, Dispatch } from 'dva';
import { Button, Card, Col, Form, Input, Row } from 'antd';
import { formatJson } from '@/utils/utils';
import styles from './operationLog.less';
import { errorBoundary } from '@/layouts/ErrorBoundary';
import { LogBase, Operator, saveLogDetails } from './data.d';
import router from 'umi/router';
import { AnyAction } from 'redux';
import { PageContainers } from '@/components';

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
    const { id, startTime, index } = query;
    dispatch({
      type: `operationLog/fetchLogDetails2`,
      // payload: { id, startTime },
      payload: { id, startTime, index },
    });
  }, []);

  // 日志基本信息
  const logBaseInformation = (item: LogBase) => (
    <>
      <Row gutter={[16, 16]}>
        <Col span={2} />

        <Col span={2}>服务名:</Col>
        <Col span={4}>
          <strong className={styles.strong}>{item.service}</strong>
        </Col>
        <Col span={1} />
        <Col span={2}>主机名:</Col>
        <Col span={4}>
          <strong className={styles.strong}>{item.host}</strong>
        </Col>
        <Col span={1} />
        <Col span={2}>端口号:</Col>
        <Col span={4}>
          <strong className={styles.strong}>{item.port}</strong>
        </Col>
        <Col span={1} />

        <Col span={2} />
      </Row>

      <Row gutter={[16, 16]}>
        <Col span={2} />
        <Col span={2}>日志级别:</Col>
        <Col span={4}>
          <strong className={styles.strong}>{item.severity}</strong>
        </Col>
        <Col span={1} />
        <Col span={2}>线程:</Col>
        <Col span={4}>
          <strong className={styles.strong}>{item.thread}</strong>
        </Col>
        <Col span={1} />
        <Col span={2}>进程号:</Col>
        <Col span={4}>
          <strong className={styles.strong}>{item.pid}</strong>
        </Col>
        <Col span={3} />
      </Row>

      <Row gutter={[16, 16]}>
        <Col span={2} />
        <Col span={2}>终端请求方式:</Col>
        <Col span={4}>
          <strong className={styles.strong}>{item.type}</strong>
        </Col>
        <Col span={1} />
        <Col span={2}>操作人姓名:</Col>
        <Col span={4}>
          <strong className={styles.strong}>{item.userName}</strong>
        </Col>
        <Col span={1} />
        <Col span={2}>操作人ID:</Col>
        <Col span={4}>
          <strong className={styles.strong}>{item.userId}</strong>
        </Col>
        <Col span={3} />
      </Row>

      <Row gutter={[16, 16]}>
        <Col span={2} />
        <Col span={2}>用户归属机构ID:</Col>
        <Col span={4}>
          <strong className={styles.strong}>{item.orgId}</strong>
        </Col>
        <Col span={1} />
        <Col span={2}>操作人终端IP:</Col>
        <Col span={4}>
          <strong className={styles.strong}>{item.userHost}</strong>
        </Col>
        <Col span={1} />
        <Col span={2}>用户归属系统ID:</Col>
        <Col span={4}>
          <strong className={styles.strong}>{item.fsysId}</strong>
        </Col>
        <Col span={3} />
      </Row>
    </>
  );

  // 操作信息
  const operatorInformation = (item: Operator) => (
    <>
      <Row gutter={[16, 16]}>
        <Col span={2} />
        <Col span={2}>请求类名:</Col>
        <Col span={4}>
          <strong className={styles.strong}>{item.className}</strong>
        </Col>
        <Col span={1} />
        <Col span={2}>请求类名描述:</Col>
        <Col span={4}>
          <strong className={styles.strong}>{item.swaggerApi}</strong>
        </Col>
        <Col span={1} />
        <Col span={2}>请求方法:</Col>
        <Col span={4}>
          <strong className={styles.strong}>{item.classMethod}</strong>
        </Col>
        <Col span={3} />
      </Row>
      <Row gutter={[16, 16]}>
        <Col span={2} />
        <Col span={2}>请求方法描述:</Col>
        <Col span={4}>
          <strong className={styles.strong}>{item.swaggerApiOperation}</strong>
        </Col>
        <Col span={1} />
        <Col span={2}>请求方式:</Col>
        <Col span={4}>
          <strong className={styles.strong}>{item.method}</strong>
        </Col>
        <Col span={1} />
        <Col span={2}>请求路径:</Col>
        <Col span={4}>
          <strong className={styles.strong}>{item.url}</strong>
        </Col>
        <Col span={3} />
      </Row>
      <Row gutter={[16, 16]}>
        <Col span={2} />
        <Col span={2}>请求终端IP:</Col>
        <Col span={4}>
          <strong className={styles.strong}>{item.clientIp}</strong>
        </Col>
        <Col span={1} />
        <Col span={2}>请求sessionId:</Col>
        <Col span={4}>
          <strong className={styles.strong}>{item.sessionId}</strong>
        </Col>
        <Col span={1} />
        <Col span={2}>请求开始时间:</Col>
        <Col span={4}>
          <strong className={styles.strong}>{item.startTime}</strong>
        </Col>
        <Col span={3} />
      </Row>
      <Row gutter={[16, 16]}>
        <Col span={2} />
        <Col span={2}>请求结束时间:</Col>
        <Col span={4}>
          <strong className={styles.strong}>{item.endTime}</strong>
        </Col>
        <Col span={1} />
        <Col span={2}>接口返回时间:</Col>
        <Col span={4}>
          <strong className={styles.strong}>{item.returnTime}</strong>
        </Col>
        <Col span={1} />
        <Col span={2}>请求耗时:</Col>
        <Col span={4}>
          <strong className={styles.strong}>{item.timeConsuming}</strong>
        </Col>
        <Col span={3} />
      </Row>
      <Row gutter={[16, 16]}>
        <Col span={2} />
        <Col span={2}>响应码:</Col>
        <Col span={4}>
          <strong className={styles.strong}>{item.httpStatusCode}</strong>
        </Col>
      </Row>
    </>
  );

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
        className={styles.basicdetails}
        loading={fetchLogDetailsLoading}
        extra={<Button onClick={() => router.go(-1)}>取消</Button>}
      >
        {logBaseInformation(saveLogDetails)}
      </Card>

      <Card
        bordered={false}
        title="操作信息"
        className={styles.operationInfo}
        loading={fetchLogDetailsLoading}
      >
        {operatorInformation(saveLogDetails)}
      </Card>

      <div className={styles.logList}>
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
        fetchLogDetailsLoading: loading.effects['operationLog/fetchLogDetails2'],
      }),
    )(Index),
  ),
);
