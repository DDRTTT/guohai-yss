import { Button, Icon, Menu, notification } from 'antd';
import React, { useEffect, useState } from 'react';
import { connect } from 'dva';
import Avatar from './AvatarDropdown';
import styles from './index.less';
import NoticeIcon from '../NoticeIcon';
import { WEBSOCKET } from '@/utils/webSocket';
import bellIcon from '@/assets/header/bell.svg';
import messageIcon from '@/assets/header/message.svg';
import router from 'umi/router';
import { uuid } from '@/utils/utils';
import SingleCustomerEvents from '@/utils/SingleCustomerEvents';

const ENVTagColor = {
  dev: 'orange',
  test: 'green',
  pre: '#87d068',
};

let infoArr = [];

// 所有消息的个数
let allMsgNum = 0;

const GlobalHeaderRight = ({
  saveUnreadMsgListLoading,
  dispatch,
  theme,
  layout,
  processMail,
  currentUser: { id },
  saveUnreadMsgList,
  processMailLoading,
}) => {
  const [count, setCount] = useState(0);
  const [typeCode, setTypeCode] = useState(0);
  const [popupVisible, setPopupVisible] = useState(false);
  /**
   * 消息关闭时调用的函数
   * 收到消息以后给后端的反馈
   * @param {*} id 任务id
   * @param {*} status 任务状态 0正常 1已收到 2下次提醒
   * @param {*} websocket websocket实例
   */
  const msgCloseHandler = (id, status, websocket) => {
    const tempIndex = infoArr.indexOf(id);
    if (~tempIndex) {
      infoArr.splice(tempIndex, 1);
    }
    allMsgNum--;
    dispatch({
      type: 'user/feedback',
      payload: {
        taskIds: [id],
        remindState: status,
        isComplete: status == 3 ? '1' : '0',
        isHandle: '1',
      },
    }).then(res => {});
    websocket && websocket.sendMessage('/aloneRequest', id);
  };

  useEffect(() => {
    SingleCustomerEvents.getInstance().addEventListener('logout', () => {
      clearAllInfo(null);
    });
  }, []);
  /**
   * 清除所有消息
   */
  const clearAllInfo = e => {
    if (e) {
      e.stopPropagation();
    }
    infoArr.map(item => {
      notification.close(item);
    });
    infoArr = [];
  };
  /**
   * 关闭按钮的下拉菜单
   */
  const closeMenu = (
    <Menu>
      <Menu.Item>
        <a onClick={clearAllInfo}>清除全部</a>
      </Menu.Item>
    </Menu>
  );
  /**
   * 弹出消息狂
   * @param {*} id 消息id
   * @param {*} content 消息内容
   * @param {*} title 消息标题
   * @param {*} websocket websocket实例
   */
  const showNotification = (key, id, title, content, websocket) => {
    infoArr.push(key);
    const currentNum = allMsgNum++;
    notification.open({
      message: title,
      className: styles.notification,
      description: (
        <>
          <p className="customNotifactiondesc" dangerouslySetInnerHTML={{ __html: content }} />
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
            <Button
              type="link"
              style={{ color: '#95a4bc' }}
              onClick={e => {
                e.stopPropagation();
                msgCloseHandler(id, 3, websocket);
                notification.close(key);
              }}
            >
              不再提醒
            </Button>
            <Button
              type="link"
              onClick={e => {
                e.stopPropagation();
                msgCloseHandler(id, 2, websocket);
                notification.close(key);
              }}
            >
              下次提醒
            </Button>
          </div>
        </>
      ),
      duration: (() => {
        return 600 + currentNum * 5;
      })(),
      key,
      icon: <Icon type="info-circle" theme="twoTone" />,
      style: { padding: '12px 8px 0' },
      btn: (
        // <Dropdown overlay={closeMenu}>
        <Icon
          type="close"
          className="ant-notification-notice-close"
          onClick={e => {
            e.stopPropagation();
            msgCloseHandler(id, 1, websocket);
            notification.close(key);
          }}
        />
        // </Dropdown>
      ),
      onClick: () => {
        allMsgNum--;
        notification.close(key);
        const tempIndex = infoArr.indexOf(id);
        if (~tempIndex) {
          infoArr.splice(tempIndex, 1);
        }
        router.push(`/messageReminding/detail?id=${id}&messageType=lifecycle`);
      },
    });
  };

  const key = `open${Date.now()}`;
  useEffect(() => {
    const tempFlag = sessionStorage.getItem('isLogin');
    if (id) {
      if (tempFlag) return;
      sessionStorage.setItem('isLogin', 1);
      msgInit();
      try {
        const lifecycleWebsocket = new WEBSOCKET(`/ws/ams-base-admin/ws-start`);
        lifecycleWebsocket.init().then(() => {
          lifecycleWebsocket.getMessage(`/user/${id}/msg`, msg => {
            const { content, title, count, taskId } = msg;
            Promise.resolve().then(() => {
              if (title && content) {
                showNotification(uuid(), taskId, title, content, lifecycleWebsocket);
              }
              setCount(count);
            });
          });
        });
      } catch (e) {
        console.info(e);
      }
      try {
        const token = sessionStorage.getItem('auth_token');
        const processWebsocket = new WEBSOCKET(
          `/api/amc-message-center/socketServer?token=${token}`,
        );
        // const websocket = new WEBSOCKET(`/api/gl/socketServer?token=${token}`);
        processWebsocket.init().then(() => {
          processWebsocket.getMessage(`/user/${id}/message`, msg => {
            if (Array.isArray(msg)) {
              msg.forEach(msg => {
                const localUuid = uuid();
                const currentNum = allMsgNum++;
                notification.open({
                  message: '通知',
                  className: styles.notification,
                  description: <p className="showAllDesc">{msg.message}</p>,
                  duration: (() => {
                    return 600 + currentNum * 5;
                  })(),
                  key: localUuid,
                  icon: <Icon type="info-circle" theme="twoTone" />,
                  style: { padding: '12px 8px 0' },
                  btn: (
                    <Icon
                      type="close"
                      className="ant-notification-notice-close"
                      onClick={e => {
                        e.stopPropagation();
                        allMsgNum--;
                        notification.close(localUuid);
                        processWebsocket &&
                          processWebsocket.sendMessage('/aloneRequest', msg.messageId);
                      }}
                    />
                  ),
                  onClick: () => {
                    allMsgNum--;
                    notification.close(key);
                    router.push(
                      `/messageReminding/matterMessage/detail?id=${msg.messageId}&messageType=process`,
                    );
                  },
                });
              });
            } else {
              const { content, title, count, messageId } = msg;
              Promise.resolve().then(() => {
                if (title && content) {
                  const currentNum = allMsgNum++;
                  const localUuid = uuid();
                  notification.open({
                    message: title,
                    className: styles.notification,
                    description: <p className="showAllDesc">{content}</p>,
                    duration: (() => {
                      return 600 + currentNum * 5;
                    })(),
                    key: localUuid,
                    style: { padding: '12px 8px 0' },
                    icon: <Icon type="info-circle" theme="twoTone" />,
                    btn: (
                      <Icon
                        type="close"
                        className="ant-notification-notice-close"
                        onClick={e => {
                          e.stopPropagation();
                          allMsgNum--;
                          processWebsocket &&
                            processWebsocket.sendMessage('/aloneRequest', messageId);
                          notification.close(localUuid);
                        }}
                      />
                    ),
                    onClick: () => {
                      allMsgNum--;
                      notification.close(key);
                      router.push(
                        `/messageReminding/matterMessage/detail?id=${messageId}&messageType=process`,
                      );
                    },
                  });
                }
                setCount(count);
              });
            }
          });
        });
      } catch (e) {
        console.info(e);
      }
    }
    dispatch({
      type: 'user/handleGetCountUnread',
    }).then(count => {
      if (count) {
        setCount(count);
      }
    });
  }, [id]);

  const handleGetCountUnread = item => {
    dispatch({
      type: 'user/handleGetCountUnread',
    }).then(count => {
      if (count) {
        setCount(count);
      }
    });
  };
  const handleGetUnreadMsgList = () => {
    dispatch({
      type: 'user/handleGetUnreadMsgList',
      payload: { isHandle: 0 },
    }).then(count => {
      if (count) setCount(count.length);
    });
  };

  const processMsgList = () => {
    dispatch({
      type: 'user/queryMail',
      payload: { page: 1, limit: 5, receiveId: id },
    });
  };
  const msgInit = () => {
    dispatch({
      type: 'operatingCalendar/getRemindList',
    }).then(res => {
      dispatch({
        type: 'user/msgInit',
        payload: { isHandle: 0 },
      }).then(res => {
        if (!res || !res.length) return;
        res.map((item, index) => {
          const { id, content, title } = item;
          showNotification(uuid(), id, title, content);
        });
      });
    });
  };

  let className = styles.right;

  if (theme === 'dark' && layout === 'topmenu') {
    className = `${styles.right}  ${styles.dark}`;
  }
  /**
   * 根据类型,将未读消息置为已读
   * @method  handleNoticeClear
   * @param {string} typeName 消息类型名称
   * @param {number} type 消息类型
   */
  const handleNoticeClear = (typeName, type) => {
    switch (type) {
      case 'lifecycle':
        dispatch({
          type: 'user/handleAsRead',
          callback: () => handleGetUnreadMsgList(),
        });
        break;
      default:
        dispatch({
          type: 'user/updateAllRead',
          payload: data,
        }).then(res => {
          processMsgList();
        });
    }
  };

  /**
   * 消息查看更多
   * @method  handleNoticeMore
   * @param   type
   * @return
   */
  const handleNoticeMore = type => {
    switch (type) {
      case '事项消息':
        router.push(`/messageReminding/matterMessage`);
        break;
      default:
        router.push(`/messageReminding/matterMessage`);
    }
  };

  /**
   * 获取全部消息列表
   * @method handleNoticeVisibleChange
   */
  const handleNoticeVisibleChange = visible => {
    if (!count && visible) {
      const reg = /\/messageReminding\/matterMessage/;
      if (!reg.test(location.pathname)) {
        router.push('/messageReminding/matterMessage');
      }
      return;
    }
    setPopupVisible(visible);
    if (visible) {
      if (typeCode == 0) {
        handleGetUnreadMsgList();
      } else {
        processMsgList();
      }
    }
  };

  const onTabChange = e => {
    setTypeCode(e.substr(e.length - 1, 1));
    if (e.substr(e.length - 1, 1) == 0) {
      handleGetUnreadMsgList();
    } else {
      processMsgList();
    }
  };

  return (
    <div className={className}>
      {/*      <HeaderSearch
       className={`${styles.action} ${styles.search}`}
       placeholder={formatMessage({
         id: 'component.globalHeader.search',
       })}
       defaultValue="umi ui"
       dataSource={[
         formatMessage({
           id: 'component.globalHeader.search.example1',
         }),
         formatMessage({
           id: 'component.globalHeader.search.example2',
         }),
         formatMessage({
           id: 'component.globalHeader.search.example3',
         }),
       ]}
       onSearch={() => {}}
       onPressEnter={() => {}}
      /> */}
      <NoticeIcon
        className={styles.action} // count={currentUser.notifyCount}
        count={count}
        onItemClick={(item, tabProps) => {
          console.log(item, tabProps);
          // 存详情
          sessionStorage.setItem('messagePath', '事项消息');
          if (tabProps.type == 'lifecycle') {
            sessionStorage.setItem('messageData', JSON.stringify(item));
            dispatch({
              type: 'messageReminding/saveMessageDel',
              payload: JSON.stringify(item),
            });
            // 标记为已读，然后请求接口列表
            dispatch({
              type: 'messageReminding/getReadsFunc',
              payload: [item.id],
              callback: () => {
                // 刷新列表
                handleGetUnreadMsgList();
              },
            });
          } else {
            const temp = {
              title: '流程消息',
              content: item.message,
              createTime: item.sendeTime,
            };
            sessionStorage.setItem('messageData', JSON.stringify(temp));
            dispatch({
              type: 'user/updateOneRead',
              payload: item.id,
            }).then(res => {
              // 刷新列表
              // handleGetUnreadMsgList();
              processMsgList();
            });
          }
          router.push(
            `/messageReminding/matterMessage/detail?id=${item.id}&messageType=${tabProps.type}`,
          );
        }}
        onClear={handleNoticeClear}
        onMore={handleNoticeMore}
        onPopupVisibleChange={handleNoticeVisibleChange} // loading={fetchingNotices}
        popupAlign={{
          offset: [20, -16],
        }}
        popupVisible={popupVisible}
        onTabChange={onTabChange}
      >
        <NoticeIcon.Tab
          type="lifecycle"
          list={saveUnreadMsgList || []} // list={noticeData['通知']}
          title="待办事项"
          emptyText="你已查看所有事项消息"
          emptyImage={bellIcon}
          loading={saveUnreadMsgListLoading}
        />
        <NoticeIcon.Tab
          type="process"
          list={processMail || []} // list={noticeData['消息']}
          title="消息"
          emptyText="您已读完所有消息"
          emptyImage={messageIcon}
          loading={processMailLoading}
        />
        {/*        <NoticeIcon.Tab
          type={2}
          list={[]} // list={noticeData['消息']}
          title="计划"
          emptyText="您已读完所有计划"
          emptyImage={messageIcon}
        />
        <NoticeIcon.Tab
          type={3}
          list={[]} // list={noticeData['待办']}
          title="消息"
          emptyText="你已完成所有消息"
          emptyImage={todoIcon}
        />
        <NoticeIcon.Tab
          type={3}
          list={[]} // list={noticeData['待办']}
          title="OA消息"
          emptyText="你已完成所有消息"
          emptyImage={todoIcon}
        /> */}
      </NoticeIcon>
      {/*      <Tooltip title="使用文档">
        <a
          target="_blank"
          // href="https://pro.ant.design/docs/getting-started"
          rel="noopener noreferrer"
          className={styles.action}
        >
          <Icon
            type="question-circle-o"
            style={{
              fontSize: 20,
              color: '#fff',
            }}
          />
        </a>
      </Tooltip> */}
      <Avatar />
      {/*      {REACT_APP_ENV && <Tag color={ENVTagColor[REACT_APP_ENV]}>{REACT_APP_ENV}</Tag>}
      <SelectLang className={styles.action} /> */}
    </div>
  );
};

export default connect(({ user, settings, loading }) => ({
  theme: settings.navTheme,
  currentUser: user.currentUser,
  layout: settings.layout,
  saveCountUnread: user.saveCountUnread,
  saveUnreadMsgList: user.saveUnreadMsgList,
  processMail: user.processMail,
  saveUnreadMsgListLoading: loading.effects['user/handleGetUnreadMsgList'],
  processMailLoading: loading.effects['user/queryMail'],
}))(GlobalHeaderRight);
