import React, { useEffect, useState } from 'react';
import { connect } from 'dva';
import { Form, Radio, Tooltip, Card, Button, Row, Col, Calendar, Icon } from 'antd';
import { Card as Cardcustom } from '@/components';
import { errorBoundary } from '@/layouts/ErrorBoundary';
import router from 'umi/router';
import { Table } from '@/components';
import List from '@/components/List';
import styles from './index.less';
import TabHeader from './components/TabHeader';
import { setSession } from '@/utils/session';
import { eutrapelia } from '@/pages/investorReview/func';
import { getSession } from '@/utils/session';

// card
import orangeCard from './images/card_orange.png';
import greenCard from './images/card_green.png';
import blueCard from './images/card_blue.png';
import grayCard from './images/card_gray.png';

// const RadioGroup = Radio.Group;

const extraPrarms = {
  bizViewId: 'I8aaa82aa0180166d166dc0ef0180411cfccd566e',
  isPage: '1',
  returnType: 'LIST',
  isAuth: '1',
  likeBizViewId: 'I8aaa82aa0180166d166dc0ef018041077459559a',
  FPRO_CUSTODIAN: getSession('loginOrgId'),
};

const Index = ({
  dispatch,
  taskLoading,
  listLoading,
  customerIndex: {
    tasks: { rows: taskList, total: tasksTotal },
    products: { rows: products, total },
  },
  workSpace: { saveProductCenterFlowId },
  customerIndex,
  productForbulletinBoard,
}) => {
  const [formValues, setFormValues] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);

  useEffect(() => {
    // 底稿
    dispatch({
      type: 'workSpace/getProductCenterFlowId',
    });
    // 产品信息列表
    const basic = {
      page: currentPage,
      size: limit,
      ...extraPrarms,
    };
    dispatch({
      type: 'customerIndex/fetchProducts',
      payload: basic,
    });
    // 获取组合大类、组合子类级联数据
    dispatch({
      type: 'productForbulletinBoard/getCombination',
      payload: 'TG004',
    });
    // 数据字典 产品状态
    dispatch({
      type: 'productForbulletinBoard/getDicts',
      payload: 'tgProductStatus,TG_product_stage',
    });
  }, []);

  useEffect(() => {
    // 待办列表
    if (saveProductCenterFlowId.length) {
      console.log(saveProductCenterFlowId.length);
      dispatch({
        type: 'customerIndex/fetchTask',
        payload: {
          currentPage: 1,
          pageSize: 10,
          emergencyState: 0,
          templateIds: saveProductCenterFlowId,
        },
      });
    }
  }, [saveProductCenterFlowId]);

  // 待办
  const goMore = tabKeys => {
    // 从首页我待办/已办理/传阅等不同tab 点击更多 进入流程管理对应tab页面。
    const path = `/taskCenter/allTheSchedule?tabKey=${tabKeys}`;
    router.push(path);
  };

  const handleJump = record => {
    const params = {
      taskId: record.taskId,
      processDefinitionId: record.processDefinitionId,
      processInstanceId: record.processInstanceId,
      taskDefinitionKey: record.taskDefinitionKey,
    };

    dispatch({
      type: 'workSpace/getLinkRouter',
      payload: params,
    });
  };

  const taskColumns = [
    {
      title: '名称',
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
      title: '日期',
      dataIndex: 'taskArrivalTime',
      key: 'taskArrivalTime',
      align: 'center',
    },
    {
      title: '操作',
      align: 'center',
      fixed: 'right',
      width: 80,
      render: (text, record) => (
        <el-button type="text" size="small" onClick={event => handleJump(record, event)}>
          <span className={styles.viewText}>查看</span>
        </el-button>
      ),
    },
  ];

  // 日历
  const onPanelChange = () => {
    dispatch({
      type: 'user/handleGetMenu',
      payload: { sysId: 1 },
      callBack: () => router.push('/taskCenter/operatingCalendar/index'),
    });
    setSession('t', '/base/processCenterHome');
    setSession('d', '产品中心');
  };

  // 产品信息
  const paginationProps = {
    showSizeChanger: true,
    showQuickJumper: true,
    current: currentPage,
    total,
    showTotal: total => `共 ${total} 条数据`,
  };

  // 列表项回显 组合大类、组合小类
  const handeColumnsForCombination = (parent, child) => {
    const { combination } = productForbulletinBoard || [];
    const text = combination.find(item => item.value === parent);
    if (!child) return (text && text?.label) || '-';
    const childrenList = text?.children || [];
    const textForChild = childrenList.find(item => item.value === child);
    return (textForChild && textForChild?.label) || '-';
  };

  // 列表项回显 产品状态
  const handleColumns = (item, code) => {
    const { dicts } = productForbulletinBoard || {};
    const text = dicts[item]?.find(value => value?.code === code);
    return (text && text?.name) || '-';
  };

  const columns = [
    {
      title: '产品代码',
      dataIndex: 'proCode',
    },
    {
      title: '产品名称',
      dataIndex: 'proName',
    },
    {
      title: '产品状态',
      dataIndex: 'proStatus',
      render: text => {
        return eutrapelia(handleColumns('tgProductStatus', text));
      },
    },
    {
      title: '组合大类',
      dataIndex: 'combCategory',
      render: text => {
        return eutrapelia(handeColumnsForCombination(text));
      },
    },
    {
      title: '组合子类',
      dataIndex: 'combSubclass',
      render: (text, record) => {
        return eutrapelia(handeColumnsForCombination(record?.combCategory, text));
      },
    },
    {
      title: '运作方式',
      dataIndex: 'operationWay',
      align: 'center',
    },
    {
      title: '产品成立日',
      dataIndex: 'proCdate',
      align: 'center',
    },
    {
      title: '产品到期日',
      dataIndex: 'proSdate',
      align: 'center',
    },
    {
      title: '预计成立规模(万元)',
      dataIndex: 'expEstablScale',
      align: 'center',
    },
    {
      title: '操作',
      dataIndex: 'urlType',
      align: 'center',
      fixed: 'right',
      width: 80,
      render: (text, record) => (
        <el-button type="text" size="small" onClick={() => handleDetail(record)}>
          <span className={styles.viewText}>查看</span>
        </el-button>
      ),
    },
  ];

  // 搜索/状态卡片点击
  const handleSearch = (data, noset = false) => {
    const params = {
      ...formValues,
      page: 1,
      size: limit,
      ...data,
      ...extraPrarms,
    };
    console.log(data, params);
    if (!noset) {
      setCurrentPage(1);
      setFormValues({ ...formValues, ...data });
    }

    dispatch({
      type: 'customerIndex/fetchProducts',
      payload: params,
    });
  };

  const handleStandardTableChange = ({ current: page, pageSize: size }) => {
    console.log(page, size);
    if (size !== limit) {
      handleSearch({ page: 1, size }, true);
      setCurrentPage(1);
      setLimit(size);
    } else {
      handleSearch({ page, size }, true);
      setCurrentPage(page);
    }
  };

  const handleDetail = record => {
    // console.log(historry);
    router.push(
      `/dynamicPage/pages/客户服务管理/8aaa80918044dcde0180f8d070850060/查看?type=view&id=${record.proCode}`,
    );
  };

  return (
    <>
      {/* 待办事项和消息提醒 */}
      <Row gutter={12}>
        <Col span={12}>
          {/* 待办事项 */}
          <Cardcustom
            bordered={false}
            title="待办事项"
            extra={
              <a onClick={() => goMore('todo')}>
                <Icon type="more" />
              </a>
            }
          >
            {/* dataSource={[{ id: 1, taskName: '认购期设置-adfa', taskArrivalTime: '2022-04-14' }]} */}
            <Table
              style={{ height: '318.8px' }}
              rowKey="id"
              columns={taskColumns}
              loading={taskLoading}
              dataSource={taskList}
              pagination={false}
            />
          </Cardcustom>
        </Col>
        <Col span={12}>
          {/* 消息提醒 列表式 */}
          {/* <Card className={['listCard', styles.Card]}>
            <TabHeader title="消息提醒" isMore moreUrl=""></TabHeader>
            <Table
              style={{ minHeight: '290px' }}
              columns={[
                {
                  title: '名称',
                  dataIndex: 'name',
                },
                {
                  title: '状态',
                  dataIndex: 'type',
                  render: type => (
                    <>
                      <span
                        className={
                          styles.status +
                          ' ' +
                          (type == 1
                            ? styles.statusOrange
                            : type == 2
                            ? styles.statusRed
                            : styles.statusGreen)
                        }
                      ></span>
                      {type == 1 ? '待办' : type == 2 ? '已办' : '未提交'}
                    </>
                  ),
                },
                {
                  title: '提醒时间',
                  dataIndex: 'date',
                  align: 'center',
                },
              ]}
              loading={listLoading}
              dataSource={[
                { id: 1, name: '认购期设置-adfa', date: '2022-03-14 14:00:00', type: 1 },
                { id: 1, name: '认购期设置-adfa', date: '2022-03-14 14:00:00', type: 2 },
                { id: 1, name: '认购期设置-adfa', date: '2022-03-14 14:00:00', type: 3 },
                { id: 1, name: '认购期设置-adfa', date: '2022-03-14 14:00:00', type: 2 },
                { id: 1, name: '认购期设置-adfa', date: '2022-03-14 14:00:00', type: 3 },
              ]}
              pagination={false}
            />
          </Card> */}
          <Cardcustom
            bordered={false}
            title="办公日历"
            extra={
              <a>
                <Icon type="more" />
              </a>
            }
          >
            <Calendar fullscreen={false} onSelect={onPanelChange} />
          </Cardcustom>
        </Col>
      </Row>
      {/* 状态卡片 */}
      <div className={styles.cardWrap}>
        <Row gutter={24}>
          <Col className="gutter-row" span={6}>
            <div onClick={() => handleSearch({ FPRO_STATUS: '1' })}>
              <img src={orangeCard} alt="立项中" />
            </div>
          </Col>
          <Col className="gutter-row" span={6}>
            <div onClick={() => handleSearch({ FPRO_STATUS: '2' })}>
              <img src={greenCard} alt="已立项" />
            </div>
          </Col>
          <Col className="gutter-row" span={6}>
            <div onClick={() => handleSearch({ FPRO_STATUS: '6' })}>
              <img src={blueCard} alt="运营中" />
            </div>
          </Col>
          <Col className="gutter-row" span={6}>
            <div onClick={() => handleSearch({ FPRO_STATUS: '8' })}>
              <img src={grayCard} alt="已下线" />
            </div>
          </Col>
        </Row>
      </div>
      {/* 底部列表 */}
      <Card className={['listCard', styles.Card]} bordered={false}>
        <TabHeader
          title="产品信息"
          isSearch
          searchAction={keyWords => handleSearch({ keyWords })}
        ></TabHeader>
        <Table
          columns={columns}
          loading={listLoading}
          dataSource={products}
          rowKey="proCode"
          onChange={handleStandardTableChange}
          currentPage={currentPage}
          pagination={paginationProps}
        />
      </Card>
    </>
  );
};

const WrappedIndexForm = errorBoundary(
  Form.create()(
    connect(({ customerIndex, productForbulletinBoard, workSpace, loading }) => ({
      customerIndex,
      productForbulletinBoard,
      workSpace,
      taskLoading: loading.effects['customerIndex/fetchTask'],
      listLoading: loading.effects['customerIndex/fetchProducts'],
    }))(Index),
  ),
);

export default WrappedIndexForm;
