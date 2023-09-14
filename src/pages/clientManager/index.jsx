import React, { useEffect, useState } from 'react';
import router from 'umi/router';
import { connect } from 'dva';
import { Avatar, Button, Col, Icon, Row, Table, Spin, Tooltip } from 'antd';
import loginEnv from '@/utils/loginenv';
import { getSession } from '@/utils/session';
import { thousandthFormatter } from '@/utils/utils';
import Empile from '@/pages/workSpace/empile';
import styles from '@/pages/workSpace/index.less';
import ic_right from '@/assets/workspace/right.svg';
import { Card } from '@/components';
// 解决 跳转某菜单返回 样式问题（菜单样式是 rem）
const _html = document.querySelector('html');
_html.style.fontSize = '16px';

const Index = ({
  dispatch,
  detailsList, // 部门信息
  currentUser, // 获取用户头像用
}) => {
  const [pageSize, setPageSize] = useState(10);
  const [pageNum, setPageNum] = useState(1);
  const [hover, setHover] = useState(null);
  const [data, setData] = useState({ rows: [], total: 0 }); // 待办理数据
  const [doneData, setDoneData] = useState(0); // 已办理数据
  const [clientNum, setClientNum] = useState(0); // 我的客户数
  const [spinLoading, setSpinLoading] = useState(true);
  const [posiNames, setPosiNames] = useState([]); // 岗位名称

  // 获取部门名称
  useEffect(() => {
    getDeptName();
  }, []);

  // 获取岗位信息
  useEffect(() => {
    getPosiNames();
  }, []);

  // 获取[我的客户数]
  useEffect(() => {
    getPosition();
  }, []);

  // 获取待办任务
  useEffect(() => {
    getTableDataList();
  }, [pageNum, pageSize]);

  // 获取已办理条数
  useEffect(() => {
    getDoneData();
  }, [pageNum, pageSize]);

  // 客户经理-已办理数据
  function getDoneData() {
    const params = {
      pageNum: 1,
      pageSize: 1,
      taskType: 'T001_5', // 已办理
    };
    dispatch({
      type: `allTheSchedule/handleTableDataList`,
      payload: params,
    }).then(res => {
      if (res && res.data && res.data.total) {
        setDoneData(res.data.total);
      }
    });
  }

  // 客户经理-待办事项表格
  function getTableDataList() {
    setSpinLoading(true);
    const params = {
      pageNum,
      pageSize,
      taskType: 'T001_1', // 待办理
    };
    dispatch({
      type: `allTheSchedule/handleTableDataList`,
      payload: params,
    }).then(res => {
      if (res && res.data && res.data.rows) {
        const userName = getTarget('username'); // 需求说：责任人这一列展示登录的用户名（意义不大，建议去掉）
        const rows = res.data.rows;
        rows.map(item => (item.userName = userName));
        const data = {
          rows,
          total: res.data.total,
        };
        setData(data);
      }
      setSpinLoading(false);
    });
  }

  // 根据 username 获取[我的客户数]
  function getPosition() {
    const userName = getTarget('username');
    const params = {
      bizViewId: 'I8aaa8285017e483748371242017f3fa9f2386d0a',
      FCUSTOMER_MANAGER: userName,
      returnType: 'OBJECT',
    };
    dispatch({
      type: `clientManager/getPosition`,
      payload: params,
    }).then(res => {
      if (res && res.data && res.data.NUM) {
        const cnum = res.data.NUM;
        setClientNum(cnum);
      }
      setSpinLoading(false);
    });
  }

  // 查询岗位名称
  function handlePosiNames(id) {
    dispatch({
      type: `memberManagement/handlePosiNames`,
      payload: { id },
    }).then(res => {
      const posiName = res.data.name; // 岗位名称
      setPosiNames(() => {
        posiNames.push(posiName);
        return [...posiNames];
      });
    });
  }

  // 查询部门名称
  function getDeptName() {
    const deptId = getTarget('deptId');
    if (!deptId) {
      console.log('该用户无所属部门！');
      return;
    }
    dispatch({
      type: `details/getDetails`,
      payload: deptId,
    });
  }

  // 将岗位id转为name
  function getPosiNames() {
    const userJobs = getTarget('userJobs'); // 数组
    if (!userJobs) {
      console.log('该用户没有关联岗位！');
      return;
    }
    userJobs.forEach(item => {
      handlePosiNames(item);
    });
  }

  function getTarget(key) {
    // 获取缓存对象
    const USER_INFO = JSON.parse(getSession('USER_INFO'));
    return USER_INFO[key];
  }

  // 分页
  const handleStandardTableChange = ({ current, pageSize }) => {
    setPageNum(current);
    setPageSize(pageSize);
  };

  // 页面基本信息部分
  const renderBasicInfo = () => {
    const userName = getTarget('username');
    const todoTotals = data.total; // 待办任务
    const totals = doneData + todoTotals; // 任务总数
    const todos = thousandthFormatter(todoTotals);
    const compare = `${thousandthFormatter(doneData)}/${thousandthFormatter(totals)}`;
    const percent =
      doneData === 0 && totals === 0 ? `0%` : `${(doneData / totals).toFixed(2) * 100}%`;
    const cNum = thousandthFormatter(clientNum);
    let basicData = [
      // content 根据后台接口返回数据，处理得到---待联调
      { title: '待办总数', content: todos },
      { title: '已办理/任务总数', content: compare },
      { title: '办理进度百分比', content: percent },
      { title: '我的客户数', content: cNum },
    ];
    const posiNamesStr = posiNames.length > 0 ? posiNames.join('，') : '';
    let avatarTitle = '';
    if (detailsList.orgName && posiNamesStr) {
      avatarTitle = `${detailsList.orgName}-${posiNamesStr}`;
    } else {
      avatarTitle = detailsList.orgName && !posiNamesStr ? detailsList.orgName : posiNamesStr;
    }

    return (
      <Spin spinning={spinLoading}>
        <Row style={{ padding: '20px 0 10px 0' }}>
          <Col span={8} style={{ verticalAlign: 'middle' }}>
            <Avatar
              src={currentUser.photoUrl}
              style={{
                margin: !detailsList.orgName && !posiNamesStr ? '-8px 10px 0 0' : '-30px 10px 0 0',
              }}
            />
            <div style={{ display: 'inline-block', paddingTop: 10, width: 'calc(100% - 50px)' }}>
              <Tooltip title={avatarTitle}>
                <h3
                  style={{
                    width: '100%',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {avatarTitle}
                </h3>
              </Tooltip>
              <div>{userName}</div>
            </div>
          </Col>
          {basicData.map(item => (
            <Col span={4}>
              <dl style={{ textAlign: 'center', paddingTop: 10 }}>
                <dt style={{ paddingBottom: 8, fontSize: '15px' }}>{item.title}</dt>
                <dd>{item.content}</dd>
              </dl>
            </Col>
          ))}
        </Row>
      </Spin>
    );
  };

  // 跳转到办理
  const handleJump = record => {
    console.log('handleJump');
  };

  // 点击卡片，跳转对应页面
  const jumpToPage = linkTo => {
    router.push(linkTo);
  };

  const handEnterHover = index => setHover(index);

  const handLeaveHover = () => setHover(null);

  const list = () => {
    // 卡片数据

    const urls = [
      // 配置目标页面路由
      {
        path:
          '/dynamicPage/params/客户信息管理/5d605de5-d95d-4fe6-bdad-b1b6f10db626/客户信息管理?isFocusClient=0',
        code: 1,
        name: '我的客户',
      },
      {
        path:
          '/dynamicPage/params/客户信息管理/5d605de5-d95d-4fe6-bdad-b1b6f10db626/客户信息管理?isFocusClient=1',
        code: 2,
        name: '我的重点客户',
      },
      {
        path: '/dynamicPage/params/客户舆情管理/d533d117-d0a3-4a79-b816-eeb556bdc56e/客户舆情管理',
        code: 3,
        name: '舆情维护',
      },
      {
        path: '/dynamicPage/params/产品管理/00a2c0fc-0629-4881-89db-9db87c8d7ec0/TG-客户尽调流程',
        code: 4,
        name: '发起客户尽调',
      },
    ];

    const colorList = [
      // 颜色
      { color: '#f0f4ff', hoverColor: '#e2eaff' },
      { color: '#fefbeb', hoverColor: '#fcf6d5' },
      { color: '#eff9fa', hoverColor: '#d2f4f8' },
      { color: '#f4f3fe', hoverColor: '#e3e1ff' },
      { color: '#fde2e1', hoverColor: '#ffcbc9' },
      { color: '#f0f4fd', hoverColor: '#e2ebff' },
    ];

    const Len = urls.length;
    let resultArr = [];
    for (let i = 0; i < Len; i++) {
      const c_i = parseInt(i % colorList.length, 10);
      const obj = {
        sysId: urls[i].code,
        linkTo: urls[i].path,
        title: urls[i].name,
        handleFun: jumpToPage,
        color: colorList[c_i]?.color,
        hoverColor: colorList[c_i]?.hoverColor,
      };
      resultArr.push(obj);
    }
    // console.log(resultArr)
    return resultArr;
  };

  // 判断导航列宽度
  const widthFn = () => {
    const len = list().length;
    switch (len) {
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

  const handleGenerateTable = () => {
    const columns = [
      {
        title: '序号',
        dataIndex: 'orderNumber',
        key: 'orderNumber',
        width: 100,
        align: 'center',
        render: (text, record, index) => <span>{index + 1 + (pageNum - 1) * pageSize}</span>,
      },
      {
        title: '待办事项',
        dataIndex: 'taskName',
        key: 'taskName',
        render: (text, record) => {
          if (text && record.productContractAbbreviation) {
            return <span>{`${text}/${record.productContractAbbreviation}`}</span>;
          }
          return (
            <span>
              {`${text}`}
            </span>
          );
        },
      },
      {
        title: '责任人',
        dataIndex: 'userName',
        key: 'userName',
        width: 150,
        align: 'center',
      },
      {
        title: '任务截止时间',
        dataIndex: 'taskArrivalTime',
        key: 'taskArrivalTime',
        width: 180,
        align: 'center',
      },
      {
        title: '操作',
        dataIndex: 'operation',
        key: 'operation',
        width: 120,
        align: 'center',
        render: (text, record) => (
          <a
            onClick={() => {
              const params = {
                taskId: record.taskId,
                processDefinitionId: record.processDefinitionId,
                processInstanceId: record.processInstanceId,
                taskDefinitionKey: record.taskDefinitionKey,
              };
              dispatch({
                type: 'allTheSchedule/getLinkRouter',
                payload: params,
              });
            }}
          >
            去办理
          </a>
        ),
      },
    ];

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
        columns={columns}
        loading={spinLoading}
        onChange={handleStandardTableChange}
        bordered={true}
        rowKey="id"
        style={{ padding: '20px 0', minHeight: 'calc(100vh - 450px)' }}
      />
    );
  };

  const listArr = list();
  const listLen = listArr.length;

  return (
    <div className={styles.main}>
      <Row gutter={24} className={styles.content}>
        <Col span={24}>
          <Card style={{ marginBottom: 12 }}>{renderBasicInfo()}</Card>
        </Col>
      </Row>
      <Row gutter={24} className={styles.content}>
        <Col span={24} className={styles.leftContent}>
          <Card
            title="便捷导航"
            defaultTitle
            style={{
              marginBottom: 12,
              display: listLen.length > 4 ? 'block' : 'none',
            }}
          >
            {listLen > 4 && <Empile list={listArr} />}
          </Card>
          <Card
            title="便捷导航"
            defaultTitle
            style={{
              marginBottom: 12,
              display: listLen <= 4 && listLen > 1 ? 'block' : 'none',
            }}
          >
            <div className={styles.menuBlock}>
              {listArr &&
                listArr.map((item, index) => {
                  return (
                    <div
                      key={item.title}
                      className={styles.blockItem}
                      onClick={() => item.handleFun(item.linkTo)}
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
          <Card className={styles.todo} style={{ width: '100%' }}>
            {handleGenerateTable()}
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default connect(({ user, details }) => ({
  detailsList: details.detailsList, // 部门信息
  currentUser: user.currentUser, // 获取用户头像
}))(Index);
