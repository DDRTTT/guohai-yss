// 详情
import React, { useEffect, useState } from 'react';
import { Button, Card, Icon, Spin } from 'antd';
import { connect } from 'dva';
import router from 'umi/router';
import { errorBoundary } from '@/layouts/ErrorBoundary';
import styles from './index.less';
import { PageContainers } from '@/components';

const Detail = ({
  location,
  dispatch,
  getDetailLoading = false,
  queryMailLoading = false,
  currentUser: { id },
}) => {
  const [name, setName] = useState([]); // 面包屑名称
  const [messageType, setMessageType] = useState(); // 消息的类型
  const [messageData, setMessageData] = useState({}); // 消息内容

  // 身体
  const handleAddCard = data => {
    if (data) {
      return (
        <Card style={{ backgroundColor: '#fff', marginTop: '20px' }}>
          <h2 style={{ fontWeight: '700' }}>{data.title || ''}</h2>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <p style={{ color: '#969696' }}>
              <Icon type="clock-circle" />
              <span style={{ marginLeft: '10px' }}>{data.createTime || ''}</span>
              {data.typeName && <span style={{ marginLeft: '20px' }}>{data.typeName}</span>}
              {data.typeCodeName && <span>{`>${data.typeCodeName}`}</span>}
            </p>
            {data.completeName && (
              <p>
                状态:
                <span style={{ color: data.completeName === '未完成' ? 'red' : 'green' }}>
                  {data.completeName}
                </span>
              </p>
            )}
          </div>
          <hr style={{ opacity: 0.6 }} />
          <p style={{ padding: '20px', minHeight: '300px' }}>{data.content || ''}</p>
          {name[1] === '业务提醒' ? (
            <p>
              <div
                style={{
                  display: 'inline-block',
                  width: '4px',
                  height: '16px',
                  backgroundColor: '#2252a6',
                  position: 'relative',
                  top: '3px',
                  marginRight: '10px',
                }}
              />
              <span>{'流程名称'}快捷入口</span>
              <Button type="link">马上办理</Button>
            </p>
          ) : (
            ''
          )}
          <hr style={{ marginBottom: '40px', opacity: 0.6 }} />
          <div className={styles.detailBtnWrap}>
            <Button onClick={() => router.push('/messageReminding/matterMessage')}>
              返回上一级
            </Button>
            {messageType === 'lifecycle' && (
              <>
                <Button
                  type="primary"
                  onClick={() => {
                    dispatch({
                      type: 'user/feedback',
                      payload: {
                        taskIds: [Number(location.query.id)],
                        remindState: 2,
                        isHandle: '1',
                        isComplete: '0',
                      },
                    }).then(res => {
                      if (!res) return;
                      const temp = JSON.parse(JSON.stringify(messageData));
                      temp.remindState = 2;
                      setMessageData(temp);
                      router.push('/messageReminding/matterMessage');
                    });
                  }}
                  disabled={data.remindState == 2}
                >
                  下次提醒
                </Button>
                <Button
                  onClick={() => {
                    dispatch({
                      type: 'user/feedback',
                      payload: {
                        taskIds: [Number(location.query.id)],
                        remindState: 3,
                        isHandle: '1',
                        isComplete: '1',
                      },
                    }).then(res => {
                      if (!res) return;
                      const temp = JSON.parse(JSON.stringify(messageData));
                      temp.remindState = 3;
                      setMessageData(temp);
                      router.push('/messageReminding/matterMessage');
                    });
                  }}
                  disabled={data.remindState == 3}
                >
                  不再提醒
                </Button>
              </>
            )}
          </div>
        </Card>
      );
    }
  };

  // 按钮事件
  const handleGoFatherPtah = () => {
    if (name[1]) {
      switch (name[1]) {
        case '系统通知':
          return router.push('/messageReminding/systemMessage');
        case '业务提醒':
          return router.push('/messageReminding/businessMessage');
      }
    }
  };
  useEffect(() => {
    setMessageType(location.query.messageType);
    setName(['消息通知', sessionStorage.getItem('messagePath'), '消息详情']);
    if (location.query.messageType === 'lifecycle') {
      getTaskInfo();
    } else {
      // setMessageData(JSON.parse(sessionStorage.getItem('messageData')));
      getProcessMail();
    }
  }, []);

  // 根据id获取生命周期的消息详情
  const getTaskInfo = () => {
    dispatch({
      type: 'user/getQueryMsgById',
      payload: { id: location.query.id },
    }).then(res => {
      handleGetReads([location.query.id]);
      setMessageData(res);
    });
  };

  // 置为已读
  const handleGetReads = data => {
    if (location.query.messageType === 'lifecycle') {
      dispatch({
        type: 'messageReminding/getReadsFunc',
        payload: data,
      });
    } else {
      dispatch({
        type: 'user/updateSomeRead',
        payload: data,
      });
    }
  };

  const getProcessMail = () => {
    dispatch({
      type: 'user/queryMail',
      payload: { page: 1, limit: 1, receiveId: id, id: location.query.id },
    }).then(res => {
      if (!res || !res.length) return;
      const item = res[0];
      const temp = {
        title: '流程消息',
        content: item.message,
        createTime: item.sendeTime,
        id: item.id,
      };
      handleGetReads([location.query.id]);
      setMessageData(temp);
    });
  };

  return (
    <PageContainers
      breadcrumb={[
        {
          title: '消息通知',
          url: '',
        },
        {
          title: '事项消息',
          url: '/messageReminding/matterMessage',
        },
        {
          title: '消息查看',
          url: '',
        },
      ]}
    >
      <Spin spinning={getDetailLoading || queryMailLoading}>{handleAddCard(messageData)}</Spin>
    </PageContainers>
  );
};

const WrappedIndexForm = errorBoundary(
  connect(({ messageReminding, loading, user }) => ({
    messageReminding,
    listLoading: loading.effects['messageReminding/getProductInfoTableFunc'],
    getDetailLoading: loading.effects['user/getQueryMsgById'],
    queryMailLoading: loading.effects['user/queryMail'],
    currentUser: user.currentUser,
  }))(Detail),
);

export default WrappedIndexForm;
