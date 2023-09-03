/**
 *Create on 2020/6/20.
 */

import React, { useEffect, useState } from 'react';
import router from 'umi/router';
import { connect } from 'dva';
import { Button, Calendar, Col, Icon, Row, Spin, Table } from 'antd';
import { getAuthToken, setSession, SYSID } from '@/utils/session';
import loginEnv from '@/utils/loginenv';
import Empile from './empile';
import styles from './index.less';
import ic_right from '@/assets/workspace/right.svg';
import { Card } from '@/components';

// 解决 跳转某菜单返回 样式问题（菜单样式是 rem）
const _html = document.querySelector('html');
_html.style.fontSize = '16px';

const Index = ({
  dispatch,
  workSpace: {
    saveTodoTasks,
    saveHandledTasks,
    saveTransmitTasks,
    saveParticipateTasks,
    saveInitiatedTasks,
    saveProductCenterFlowId,
    GET_USER_SYSID,
    SAVE_DATA_DICTIONARY: { SSOUrl = [], attributionSystem = [] },
  },
  currentUser: { id },
  loading,
  swiperLoading,
  pageLoading,
}) => {
  const [tabKey, setTabKey] = useState('todo');

  const [limitTodoTasks, setLimitTodoTasks] = useState(10);
  const [pageTodoTasks, setPageTodoTasks] = useState(1);

  const [limitHandledTasks, setLimitHandledTasks] = useState(10);
  const [pageHandledTasks, setPageHandledTasks] = useState(1);

  const [limitTransmitTasks, setLimitTransmitTasks] = useState(10);
  const [pageTransmitTasks, setPageTransmitTasks] = useState(1);

  const [limitParticipateTasks, setLimitParticipateTasks] = useState(10);
  const [pageParticipateTasks, setPageParticipateTasks] = useState(1);

  const [limitInitiatedTasks, setLimitInitiatedTasks] = useState(10);
  const [pageInitiatedTasks, setPageInitiatedTasks] = useState(1);

  const [hover, setHover] = useState(null);

  const [keyAndSysId, setKeyAndSysId] = useState([]); // 所有流程key和sysId 对应关系集合

  const sysIdArr = GET_USER_SYSID?.split(',');

  document.title = `${loginEnv.LOGINTITLE}`;

  const handleGetSSOUrl = () => {
    if (dispatch) {
      dispatch({
        type: 'workSpace/DATA_DICTIONARY_FETCH',
        payload: {
          codeList: 'SSOUrl,attributionSystem',
        },
      });
    }
  };

  // 获取用户拥有的系统
  const handleGetUserSys = () => {
    if (dispatch) {
      dispatch({
        type: 'workSpace/GET_USER_SYSID_FETCH',
      });
    }
  };

  // 我待办的任务:根据用户Id获取任务(分页)  获取用户待办的任务
  const handleTodoTasks = () => {
    if (dispatch) {
      dispatch({
        type: 'workSpace/getTodoTasks',
        payload: {
          // userId: id, // 用户Id
          limit: limitTodoTasks, // 每页条数
          page: pageTodoTasks, // 页码
          templateIds: saveProductCenterFlowId,
          emergencyState: 0,
        },
      });
    }
  };

  // 我已办理的任务：获取已办理的任务(分页)
  const handleHandledTasks = () => {
    if (dispatch) {
      dispatch({
        type: 'workSpace/getHandledTasks',
        payload: {
          pageNum: pageHandledTasks,
          pageSize: limitHandledTasks,
          taskType: 'T001_5',
        },
      });
    }
  };

  // 我传阅的任务：获取传阅的任务(分页)
  const handleTransmitTasks = () => {
    if (dispatch) {
      dispatch({
        type: 'workSpace/getTransmitTasks',
        payload: {
          pageNum: pageTransmitTasks,
          pageSize: limitTransmitTasks,
          taskType: 'T001_6',
        },
      });
    }
  };

  // 我参与的任务：获取指定用户的已经办流程的任务(分页)
  const handleParticipateTasks = () => {
    if (dispatch) {
      dispatch({
        type: 'workSpace/getParticipateTasks',
        payload: {
          userId: id, // 用户Id
          limit: limitParticipateTasks, // 每页条数
          page: pageParticipateTasks, // 页码
          processDefinitionKeys: saveProductCenterFlowId,
        },
      });
    }
  };

  // 我发起的任务：获取指定发起人或发起组的任务(分页)
  const handleInitiatedTasks = () => {
    if (dispatch) {
      dispatch({
        type: 'workSpace/getInitiatedTasks',
        payload: {
          userId: id, // 用户Id
          limit: limitInitiatedTasks, // 每页条数
          page: pageInitiatedTasks, // 页码
          processDefinitionKeys: saveProductCenterFlowId,
        },
      });
    }
  };

  // 获取非底稿任务流程  /base/processCenterHome 产品中心 1
  const handleProductCenterFlowId = () => {
    if (dispatch) {
      dispatch({
        type: 'workSpace/getProductCenterFlowId',
      });
    }
  };

  const tabListNoTitle = [
    {
      key: 'todo',
      tab: '我待办',
    },
    {
      key: 'handled',
      tab: '已办理',
    },
    {
      key: 'transmit',
      tab: '传阅',
    },
  ];
  const goMore = tabKeys => {
    // 从首页我待办/已办理/传阅等不同tab 点击更多 进入流程管理对应tab页面。
    const path = `/taskCenter/allTheSchedule?tabKey=${tabKeys}`;
    dispatch({
      type: 'user/handleGetMenu',
      payload: { sysId: 1 },
      callBack: () => router.push(path),
    });
    setSession('t', '/base/processCenterHome');
    setSession('d', '产品中心');
  };

  const columns1 = [
    {
      title: '任务名称',
      dataIndex: 'taskName',
      key: 'taskName',
      render: (text, record) => {
        const taskName = record.taskName ? record.taskName : '';
        const productContractAbbreviation = record.productContractAbbreviation
          ? record.productContractAbbreviation
          : '';
        if (taskName && productContractAbbreviation) {
          return `${taskName}/${productContractAbbreviation}`;
        }
        return `${taskName}${productContractAbbreviation}`;
      },
    },
    {
      title: '任务到达时间',
      dataIndex: 'taskArrivalTime',
      key: 'taskArrivalTime',
      align: 'right',
    },
  ];

  const onPanelChange = () => {
    dispatch({
      type: 'user/handleGetMenu',
      payload: { sysId: 1 },
      callBack: () => router.push('/taskCenter/operatingCalendar/index'),
    });
    setSession('t', '/base/processCenterHome');
    setSession('d', '产品中心');
  };

  // 分页
  const handleStandardTableChange = ({ current, pageSize }) => {
    if (tabKey === 'todo') {
      setPageTodoTasks(current);
      setLimitTodoTasks(pageSize);
    }
    if (tabKey === 'participate') {
      setPageParticipateTasks(current);
      setLimitParticipateTasks(pageSize);
    }
    if (tabKey === 'initiated') {
      setPageInitiatedTasks(current);
      setLimitInitiatedTasks(pageSize);
    }
    if (tabKey === 'handled') {
      setPageHandledTasks(current);
      setLimitHandledTasks(pageSize);
    }
    if (tabKey === 'transmit') {
      setPageTransmitTasks(current);
      setLimitTransmitTasks(pageSize);
    }
  };

  // 跳转到办理
  const handleJumpToTodo = record => {
    const params = {
      taskId: record.taskId,
      processDefinitionId: record.processDefinitionId,
      processInstanceId: record.processInstanceId,
      taskDefinitionKey: record.taskDefinitionKey,
      formKey: record.formKey,
    };

    dispatch({
      type: 'workSpace/getLinkRouter',
      payload: params,
    });
  };

  const handleJump = record => {
    const Len = attributionSystem.length;
    const arr = [];
    for (let i = 0; i < Len; i++) {
      const obj = {
        sysId: attributionSystem[i]?.code,
        title: attributionSystem[i]?.name,
      };
      arr.push(obj);
    }
    const allList = arr.filter(item => sysIdArr.includes(item.sysId));
    // 更新系统菜单
    const resultArr = keyAndSysId.filter(item => item.processKey == record.processDefinitionKey);
    const targetSysId = resultArr[0].sysId;
    const filterObj = allList.filter(i => i.sysId == targetSysId)[0];
    // 渲染目标sysId对应的左侧菜单
    dispatch({
      type: 'user/handleGetMenu',
      payload: { sysId: filterObj.sysId },
    });
    setSession('d', filterObj.title);
    setSession('sysId', filterObj.sysId);

    if (tabKey === 'todo') {
      handleJumpToTodo(record);
    }
    if (tabKey === 'handled') {
      router.push(
        `/processCenter/processDetail?processInstanceId=${record.processInstanceId}&nodeId=${record.taskDefinitionKey}&taskId=${record.taskId}`,
      );
    }
    if (tabKey === 'transmit') {
      router.push(
        `/processCenter/processDetail?processInstanceId=${record.processInstanceId}&nodeId=${record.taskDefinitionKey}&taskId=${record.taskId}`,
      );
    }
  };

  const handleGenerateTable = () => {
    let data;
    switch (tabKey) {
      case 'todo':
        data = saveTodoTasks;
        break;
      case 'participate':
        data = saveParticipateTasks;
        break;
      case 'initiated':
        data = saveInitiatedTasks;
        break;
      case 'handled':
        data = saveHandledTasks;
        break;
      case 'transmit':
        data = saveTransmitTasks;
        break;
      default:
        data = saveTodoTasks;
    }

    let pageNum;
    let pageSize;
    if (tabKey === 'todo') {
      pageNum = pageTodoTasks;
      pageSize = limitTodoTasks;
    }
    if (tabKey === 'participate') {
      pageNum = pageParticipateTasks;
      pageSize = limitParticipateTasks;
    }
    if (tabKey === 'initiated') {
      pageNum = pageInitiatedTasks;
      pageSize = limitInitiatedTasks;
    }
    if (tabKey === 'handled') {
      pageNum = pageHandledTasks;
      pageSize = limitHandledTasks;
    }
    if (tabKey === 'transmit') {
      pageNum = pageTransmitTasks;
      pageSize = limitTransmitTasks;
    }

    const handlePagination = {
      showSizeChanger: true,
      showQuickJumper: true,
      current: pageNum,
      pageSize,
      total: data.total,
      showTotal: total => `共 ${total} 条`,
    };

    return (
      <Table
        dataSource={data.rows}
        pagination={handlePagination}
        columns={columns1}
        showHeader={false}
        loading={loading}
        onChange={handleStandardTableChange}
        bordered={false}
        rowKey="id"
        onRow={record => {
          return {
            onClick: event => handleJump(record, event), // 点击行
          };
        }}
        style={{ height: sysIdArr.length <= 1 ? '500px' : 'auto' }}
      />
    );
  };

  const getMapping = sysId => {
    return dispatch({
      type: 'workSpace/GET_SYS_USER_INFO_FETCH',
      payload: { sysId },
    });
  };

  // 直接跳转到子项目
  const handleLink = (link, title, sysId) => {
    dispatch({
      type: 'user/handleGetMenu',
      payload: { sysId },
      callBack: () => {
        setSession('d', title);
        setSession('sysId', sysId);
        router.push(link);
      },
    });
  };

  /**
   * 报表世界 调度系统
   * 报表世界使用token
   * 调度系统在sessionStorage中使用SingleId,在获取用户信息的时候存了SingleId到sessionStorage中
   */
  const handleDirectToSSO = _linkTo => (window.location.href = _linkTo);

  /**
   * 头寸系统
   * 头寸系统使用token
   * 头寸系统在url中取token,
   */
  const handleDirectToSSOWithToken = _linkTo =>
    (window.location.href = `${_linkTo}token=${getAuthToken()}&url=${window.location.href}`);

  /**
   * 数据中台
   * 数据中台使用SingleId，放在url中，需要先查映射关系再跳转
   */
  const handleIndirectToSSO = (_linkTo, _, sysId) => {
    getMapping(sysId).then(res => {
      if (res && res.mapId) {
        window.location.href = `${_linkTo}${res.mapId}`;
      }
    });
  };

  const handleToSSO = (_linkTo, _title, sysId, flag) => {
    // 点击便捷导航
    setSession(SYSID, sysId);
    switch (flag) {
      case '0':
        handleIndirectToSSO(_linkTo, _title, sysId);
        break;
      case '1':
        handleLink(_linkTo, _title, sysId);
        break;
      case '2':
        handleDirectToSSO(_linkTo, _title, sysId);
        break;
      case '3':
        handleDirectToSSOWithToken(_linkTo, _title, sysId);
        break;
      default:
        handleLink(_linkTo, _title, sysId);
        break;
    }
  };

  const handleTaskTabs = key => {
    setTabKey(key);
    switch (key) {
      case 'todo':
        handleTodoTasks();
        break;
      case 'participate':
        handleParticipateTasks();
        break;
      case 'initiated':
        handleInitiatedTasks();
        break;
      case 'handled':
        handleHandledTasks();
        break;
      case 'transmit':
        handleTransmitTasks();
        break;
      default:
        handleTodoTasks();
    }
  };

  // 获取所有流程key和sysId
  function getAllProcessKeyAndSysId() {
    dispatch({
      type: 'workSpace/getAllProcessKeyAndSysId',
    }).then(res => {
      setKeyAndSysId(res);
    });
  }

  // 获取非底稿任务流程
  useEffect(() => {
    sessionStorage.removeItem('breadcrumb') 
    handleProductCenterFlowId();
    handleGetSSOUrl();
    handleGetUserSys();
    getAllProcessKeyAndSysId();
  }, []);

  // 我待办的任务
  useEffect(() => {
    if (id) {
      handleTodoTasks();
    }
  }, [limitTodoTasks, pageTodoTasks, id, saveProductCenterFlowId]);

  // 我参与的任务
  useEffect(() => {
    if (id) {
      handleParticipateTasks();
    }
  }, [limitParticipateTasks, pageParticipateTasks, id, saveProductCenterFlowId]);

  // 我发起的任务
  useEffect(() => {
    if (id) {
      handleInitiatedTasks();
    }
  }, [limitInitiatedTasks, pageInitiatedTasks, id, saveProductCenterFlowId]);

  // 我已办理的任务
  useEffect(() => {
    if (id && tabKey === 'handled') {
      handleHandledTasks();
    }
  }, [limitHandledTasks, pageHandledTasks, id, saveProductCenterFlowId]);

  // 我传阅的任务
  useEffect(() => {
    if (id && tabKey === 'transmit') {
      handleTransmitTasks();
    }
  }, [limitTransmitTasks, pageTransmitTasks, id, saveProductCenterFlowId]);

  const handEnterHover = index => setHover(index);

  const handLeaveHover = () => setHover(null);

  // 获取词汇信息
  function list() {
    const colorList = [
      // 颜色
      { color: '#f0f4ff', hoverColor: '#e2eaff' },
      { color: '#fefbeb', hoverColor: '#fcf6d5' },
      { color: '#eff9fa', hoverColor: '#d2f4f8' },
      { color: '#f4f3fe', hoverColor: '#e3e1ff' },
      { color: '#fde2e1', hoverColor: '#ffcbc9' },
      { color: '#f0f4fd', hoverColor: '#e2ebff' },
    ];
    const Len = attributionSystem.length;
    const arr = [];
    for (let i = 0; i < Len; i++) {
      const c_i = parseInt(i % colorList.length, 10);
      const obj = {
        sysId: attributionSystem[i]?.code,
        linkTo: SSOUrl[i]?.name,
        title: attributionSystem[i]?.name,
        describe: attributionSystem[i]?.remarks,
        handleFun: handleToSSO,
        color: colorList[c_i]?.color,
        hoverColor: colorList[c_i]?.hoverColor,
        flag: SSOUrl[i]?.remarks,
      };
      arr.push(obj);
    }
    return arr.filter(item => sysIdArr.includes(item.sysId));
  }

  // 判断导航列宽度
  const widthFn = () => {
    switch (sysIdArr.length) {
      case 1:
        return '100%';
      case 2:
        return '50%';
      case 3:
        return '33%';
      case 4:
        return '25%';
      default:
        return '';
    }
  };
  return (
    <Spin spinning={!!pageLoading}>
      <div className={styles.main}>
        <Row gutter={24} className={styles.content}>
          <Col span={19} className={styles.leftContent}>
            <Card
              title="便捷导航"
              loading={swiperLoading}
              style={{
                marginBottom: 12,
                display: sysIdArr.length > 4 ? 'block' : 'none',
              }}
            >
              {sysIdArr.length > 4 && list().length && <Empile list={list()} />}
            </Card>
            <Card
              title="便捷导航"
              loading={swiperLoading}
              style={{
                marginBottom: 12,
                display: sysIdArr.length <= 4 && sysIdArr.length > 1 ? 'block' : 'none',
              }}
            >
              <div className={styles.menuBlock}>
                {list() &&
                  list().map((item, index) => {
                    return (
                      <div
                        key={item.title}
                        className={styles.blockItem}
                        onClick={() =>
                          item.handleFun(item.linkTo, item.title, item.sysId, item.flag)
                        }
                        onMouseEnter={() => handEnterHover(index)}
                        onMouseLeave={handLeaveHover}
                        style={{
                          background: index === hover ? item.hoverColor : item.color,
                          paddingRight: index === hover ? '150px' : '0',
                          marginLeft: index >= 1 ? '20px' : '',
                          width: widthFn(),
                        }}
                      >
                        <span className={styles.blockItemText}>{item.title}</span>
                        <img
                          style={{ display: index === hover ? 'block' : 'none' }}
                          src={ic_right}
                          className={styles.ri}
                          alt={'right'}
                        />
                      </div>
                    );
                  })}
              </div>
            </Card>
            <Card
              className={styles.todo}
              style={{ width: '100%' }}
              tabList={tabListNoTitle}
              activeTabKey={tabKey}
              // tabBarExtraContent={<a href="#">{'更多>>'}</a>}
              tabBarExtraContent={
                <Button type="link" onClick={() => goMore(tabKey)}>
                  {'更多>>'}
                </Button>
              }
              onTabChange={key => handleTaskTabs(key)}
            >
              {handleGenerateTable()}
            </Card>
          </Col>
          <Col span={5} style={{ paddingLeft: '0' }}>
            <Card
              title="便捷导航"
              loading={swiperLoading}
              style={{
                marginBottom: '16px',
                display: GET_USER_SYSID && sysIdArr.length <= 1 ? 'block' : 'none',
              }}
            >
              {sysIdArr.length <= 1 &&
                list().map((item, index) => {
                  return (
                    <div
                      key={item.title}
                      className={styles.navR}
                      onClick={() => item.handleFun(item.linkTo, item.title, item.sysId, item.flag)}
                      onMouseEnter={() => handEnterHover(index)}
                      onMouseLeave={handLeaveHover}
                      style={{
                        background: index === hover ? item.hoverColor : item.color,
                        paddingRight: index === hover ? '150px' : '0',
                      }}
                    >
                      <span className={styles.blockItemText}>{item.title}</span>
                      <img
                        style={{ display: index === hover ? 'block' : 'none' }}
                        src={ic_right}
                        className={styles.ri}
                        alt={'right'}
                      />
                    </div>
                  );
                })}
            </Card>
            <Card
              bordered={false}
              title="办公日历"
              extra={
                <a>
                  <Icon type="more" />
                </a>
              }
            >
              <Calendar
                className="ant-radio-group-wrapper"
                fullscreen={false}
                onSelect={onPanelChange}
              />
            </Card>
          </Col>
        </Row>
      </div>
    </Spin>
  );
};

export default connect(({ workSpace, user, loading }) => ({
  workSpace,
  currentUser: user.currentUser,
  user,
  loading:
    loading.effects['workSpace/getTodoTasks'] ||
    loading.effects['workSpace/getHandledTasks'] ||
    loading.effects['workSpace/getTransmitTasks'] ||
    loading.effects['workSpace/getParticipateTasks'] ||
    loading.effects['workSpace/getInitiatedTasks'] ||
    loading.effects['workSpace/getLinkRouter'],
  swiperLoading:
    loading.effects['workSpace/DATA_DICTIONARY_FETCH'] ||
    loading.effects['workSpace/GET_USER_SYSID_FETCH'],
  pageLoading: loading.effects['user/handleGetMenu'],
}))(Index);
