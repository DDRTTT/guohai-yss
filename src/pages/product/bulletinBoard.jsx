import React, { Component } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { errorBoundary } from '@/layouts/ErrorBoundary';
import { Form, Modal, Row, Col, Button, Pagination } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import styles from './bulletinBoard.less';
import { tableRowConfig, eutrapelia } from '@/pages/investorReview/func';
import moment from 'moment';

import { Table } from '@/components';
import List from '@/components/List';
import History from './component/history';

const uesrInfo = JSON.parse(sessionStorage.getItem('USER_INFO')) || {};

class Index extends Component {
  state = {
    keyWords: '',
    page: 1,
    limit: '10',
    visible: false,
    proCode: '',
    proStage: '',
    columns: [
      {
        title: '序号',
        dataIndex: 'orderNumber',
        key: 'orderNumber',
        width: 100,
        align: 'center',
        render: (val, record, index) => {
          const { page, limit } = this.state;
          return `${index + 1 + (page - 1) * limit}`;
        },
      },
      {
        title: '产品名称',
        dataIndex: 'proName',
        key: 'proName',
        ...tableRowConfig,
        sorter: false,
      },
      {
        title: '产品代码',
        dataIndex: 'proCode',
        key: 'proCode',
        ...tableRowConfig,
        sorter: false,
      },
      {
        title: '组合大类',
        dataIndex: 'combCategory',
        key: 'combCategory',
        ...tableRowConfig,
        sorter: false,
        render: text => {
          return eutrapelia(this.handeColumnsForCombination(text));
        },
      },
      {
        title: '组合子类',
        dataIndex: 'combSubclass',
        key: 'combSubclass',
        ...tableRowConfig,
        sorter: false,
        render: (text, record) => {
          return eutrapelia(this.handeColumnsForCombination(record?.combCategory, text));
        },
      },
      {
        title: '产品成立日',
        dataIndex: 'proCdate',
        key: 'proCdate',
        ...tableRowConfig,
        sorter: false,
      },
      {
        title: '产品到期日',
        dataIndex: 'proSdate',
        key: 'proSdate',
        ...tableRowConfig,
        sorter: false,
      },
      {
        title: '产品阶段',
        dataIndex: 'proStage',
        key: 'proStage',
        ...tableRowConfig,
        sorter: false,
        render: text => {
          return eutrapelia(this.handleColumns('TG_product_stage', text));
        },
      },
      {
        title: '产品状态',
        dataIndex: 'proStatus',
        key: 'proStatus',
        ...tableRowConfig,
        sorter: false,
        render: text => {
          return eutrapelia(this.handleColumns('tgProductStatus', text));
        },
      },
      {
        title: '运营行',
        dataIndex: 'operBank',
        key: 'operBank',
        ...tableRowConfig,
        sorter: false,
        render: text => {
          return eutrapelia(this.handleColumnsFororgNameList(text));
        },
      },
      {
        title: '营销行',
        dataIndex: 'market',
        key: 'market',
        ...tableRowConfig,
        sorter: false,
        render: text => {
          return eutrapelia(this.handleColumnsFororgNameList(text));
        },
      },
      {
        title: '管理人',
        dataIndex: 'proCustodian',
        key: 'proCustodian',
        ...tableRowConfig,
        sorter: false,
        render: text => {
          return eutrapelia(this.handleColumnsForParam(text));
        },
      },
      {
        title: '创建人',
        dataIndex: 'creatorId',
        key: 'creatorId',
        ...tableRowConfig,
        sorter: false,
        render: text => {
          return eutrapelia(this.handleColumnsForCreatorId(text));
        },
      },
      {
        title: '操作',
        dataIndex: 'id',
        align: 'center',
        fixed: 'right',
        render: (val, record) => {
          return (
            <div>
              <a
                style={{ marginRight: 10 }}
                onClick={() => {
                  this.openInfo(record);
                }}
              >
                预览
              </a>
              {String(uesrInfo.id) === record?.creatorId && (
                <a
                  style={{ marginRight: 10 }}
                  disabled={
                    record.proStatus === 'PS001_8' ||
                    record.proStatus === 'TGPS001_6' ||
                    record.proStatus === 'TGPS001_7' ||
                    record.proStatus === 'PS001_9'
                  }
                  onClick={() => this.handleStop(record, '0')}
                >
                  终止
                </a>
              )}
              {String(uesrInfo.id) === record?.creatorId && (
                <a
                  style={{ marginRight: 10 }}
                  onClick={() => this.handleUrge(record, record?.urgentStatus !== '1' ? '1' : '0')}
                >
                  {record?.urgentStatus !== '1' ? '加急' : '取消加急'}
                </a>
              )}

              <a
                style={{ marginRight: 10 }}
                onClick={() => {
                  this.setState({
                    proCode: record?.proCode,
                    proStage: record.proStage,
                    visible: true,
                  });
                }}
              >
                历史流转
              </a>
            </div>
          );
        },
      },
    ],
    seachData: {},
    keyWords: '',

    subclassList: [],
    stageList: [],
    stageActive: '',
  };

  componentDidMount() {
    this.handleGetDicts();
    this.handleGetCombination();
    this.handleGetTableList();
  }

  // 列表项回显
  handleColumns = (item, code) => {
    const { productForbulletinBoard } = this.props;
    const { dicts, subclass } = productForbulletinBoard || {};
    const text = dicts[item]?.find(value => value?.code === code);
    return (text && text?.name) || '-';
  };

  // 列表项回显 管理人
  handleColumnsForParam = code => {
    const { productForbulletinBoard } = this.props;
    const { listByParam } = productForbulletinBoard || [];
    const text = listByParam?.find(value => value?.id === code);
    console.log(text);
    return (text && text?.clientName) || '-';
  };

  // 列表项回显 组合大类、组合小类
  handeColumnsForCombination = (parent, child) => {
    const { seachData } = this.state;
    const { productForbulletinBoard } = this.props;
    const { combination } = productForbulletinBoard || [];
    const text = combination.find(item => item.value === parent);
    if (!child) return (text && text?.label) || '-';
    const childrenList = text?.children || [];
    const textForChild = childrenList.find(item => item.value === child);
    return (textForChild && textForChild?.label) || '-';
  };

  // 列表项回显 创建人
  handleColumnsForCreatorId = code => {
    const { productForInfo } = this.props;
    const { userList = [] } = productForInfo;
    const text = userList.find(item => item.id === code);
    return text?.username;
  };

  // 列表项回显 运营行 营销行
  handleColumnsFororgNameList = code => {
    const { productForbulletinBoard } = this.props;
    const { orgNameList = [] } = productForbulletinBoard;
    const text = orgNameList.find(item => item.id === code);
    return text?.orgName;
  };

  /**
   * 初始化表格数据
   */
  handleGetTableList = () => {
    const { dispatch } = this.props;
    const { page, limit, seachData, keyWords } = this.state;
    const keyWordsData = keyWords
      ? {
          likeBizViewId: 'I8aaa8285017e483748371242017f061fc3cc3087',
          keyWords: keyWords,
        }
      : {};
    dispatch({
      type: 'productForbulletinBoard/getList',
      payload: {
        bizViewId: 'I8aaa8285017e483748371242017f05e8bbf22fed',
        isPage: '1',
        page: page,
        size: limit,
        returnType: 'LIST',
        isAuth: '1',
        ...seachData,
        ...keyWordsData,
      },
    });
  };

  getInfo = item => {
    const { dispatch } = this.props;
    return new Promise(resolve => {
      dispatch({
        type: 'productForbulletinBoard/getSimpleQuery',
        payload: {
          bizViewId: 'I8aaa8285017e483748371242017f06c9f1bc44bb',
          FPRO_STAGE: item?.code,
          returnType: 'OBJECT',
        },
      })
        .then(result => {
          resolve({ name: item?.name, code: item?.code, num: result?.COUNT });
        })
        .catch(() => {
          resolve({});
        });
    });
  };

  // 获取字典数据
  handleGetDicts = () => {
    const { dispatch } = this.props;
    const _this = this;
    // 数据字典
    dispatch({
      type: 'productForbulletinBoard/getDicts',
      payload: 'tgProductStatus,TG_product_stage',
    }).then(res => {
      const arr = [];
      const datas = res?.TG_product_stage || [];
      const list = [];
      datas.map(item => {
        const temp = _this.getInfo(item);
        list.push(temp);
      });
      Promise.all(list).then(res => {
        //res为返回的接口数据，数组形式
        console.log(res);
        _this.setState({ stageList: res });
      });
    });

    // 创建人
    dispatch({
      type: 'productForInfo/getUserList',
      payload: {},
    });

    // 产品名称下啦数据
    dispatch({
      type: 'productForbulletinBoard/getProductEnum',
      payload: {
        bizViewId: 'I8aaa8285017e483748371242017f05e8bbf22fed',
        returnType: 'LIST',
        isAuth: '1',
      },
    });
    // 获取管理人下啦数据
    dispatch({
      type: 'productForbulletinBoard/getListByParam',
      payload: { deleted: 0 },
    });
    // 运营行 营销行
    dispatch({
      type: 'productForbulletinBoard/getOrgNameList',
      payload: { type: 0, qualifyType: 'J001_4' },
    });
  };

  // 获取组合大类、组合子类级联数据
  handleGetCombination = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'productForbulletinBoard/getCombination',
      payload: 'TG004',
    });
  };

  // 获取子类字典数据
  handleGetSubclass = val => {
    const { seachData } = this.state;
    const { productForbulletinBoard, form } = this.props;
    const { combination } = productForbulletinBoard || [];
    form.resetFields('FCOMB_SUBCLASS');
    const list = combination.find(item => item.value === val);
    this.setState({ subclassList: list?.children || [] });
  };

  // 精准查询
  handlerSearch = values => {
    const FPRO_CDATE =
      (values.FPRO_CDATE && moment(values.FPRO_CDATE).format('YYYY-MM-DD')) || undefined;
    const FPRO_SDATE =
      (values.FPRO_SDATE && moment(values.FPRO_SDATE).format('YYYY-MM-DD')) || undefined;

    this.setState(
      {
        keyWords: '',
        page: 1,
        limit: '10',
        seachData: { ...values, ...{ FPRO_CDATE, FPRO_SDATE } },
      },
      () => {
        this.handleGetTableList();
      },
    );
  };

  // 重置
  handleReset = () => {
    this.setState({ subclassList: [], keyWords: '', page: 1, limit: '10', seachData: {} }, () => {
      this.handleGetTableList();
    });
  };

  // M模糊查询
  changekeyWords = val => {
    this.setState({subclassList: [], page: 1, limit: '10',  keyWords: val, seachData: {} }, () => {
      this.handleGetTableList();
    });
  };

  showTotal = total => {
    return `共 ${total} 条数据`;
  };

  // 切换页码（任务列表）
  changePage = (page, pageSize) => {
    this.setState({ page, limit: pageSize }, () => {
      this.handleGetTableList();
    });
  };

  callBackHandler = value => {
    this.setState({ columns: value });
  };

  handleShowProstageData = value => {
    const { seachData } = this.state;
    const data = {};
    this.setState(
      { stageActive: value, seachData: { ...seachData, ...{ FPRO_STAGE: value } } },
      () => {
        this.handleGetTableList();
      },
    );
  };

  // 预览
  openInfo = val => {
    const { dispatch } = this.props;
    dispatch(
      routerRedux.push({
        pathname: '/product/bulletinBoardInfo',
        query: {
          proCode: val?.proCode,
          proName: val?.proName,
          proStage: val?.proStage,
        },
      }),
    );
  };

  // 加急
  handleUrge = (record, status) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'productForbulletinBoard/getUrge',
      payload: {
        queryData: record.proCode,
        data: {
          coreModule: 'TAmsProduct',
          urgentStatus: status,
        },
      },
    }).then(res => {
      this.handleReset();
    });
  };

  // 终止
  handleStop = record => {
    const { dispatch } = this.props;
    dispatch({
      type: 'productForbulletinBoard/getUrge',
      payload: {
        queryData: record.proCode,
        data: {
          coreModule: 'TAmsProduct',
          proStatus: 'PS001_9',
        },
      },
    }).then(res => {
      this.handleReset();
    });
  };

  /**
   * 创建产品看板栅格
   */
  handleAddGird = () => {
    const { isKanban, stageList, stageActive } = this.state;
    return (
      <div className={styles.girdTop} style={{ display: isKanban ? '' : 'none' }}>
        <Row
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
          }}
        >
          <Col className={styles.productGrid} xs={{ span: 4 }}>
            <p>
              <span className={'text_ADB0B8'}>/ 产品生命周期阶段划分</span>
            </p>
          </Col>
          {stageList.map(item => {
            return (
              <Col
                className={`${styles.productGrid} ${styles.productGridHover} ${
                  item?.code === stageActive ? styles.bgcFFF : ''
                }`}
                xs={{ span: 4 }}
                onClick={() => {
                  this.handleShowProstageData(item?.code);
                }}
              >
                <div className={styles.girdBody}>{item?.num?.split('.')[0] || 0}</div>
                <div className={styles.girdTitle}>{item?.name}</div>
              </Col>
            );
          })}
        </Row>
        <CloseOutlined
          className={styles.closeOutlined}
          onClick={() => this.setState({ isKanban: false })}
        />
      </div>
    );
  };
  render() {
    const { page, limit, columns, isKanban, subclassList, visible, proCode, proStage } = this.state;
    const { listLoading, productForbulletinBoard, form } = this.props;
    const { dicts, subclass, list, combination, listByParam, productEnum, orgNameList } =
      productForbulletinBoard || {};
    // 条件查询菜单
    const formItemData = [
      {
        name: 'FPRO_NAME',
        label: '产品名称',
        type: 'select',
        readSet: { name: 'proName', code: 'proName' },
        config: { maxTagCount: 1 },
        option: productEnum || [],
      },
      {
        name: 'FPRO_CODE',
        label: '产品代码',
        type: 'input',
      },
      {
        name: 'FCOMB_CATEGORY',
        label: '组合大类',
        type: 'select',
        readSet: { name: 'label', code: 'value' },
        config: {
          maxTagCount: 1,
          onChange: this.handleGetSubclass,
        },
        option: combination || [],
      },
      {
        name: 'FCOMB_SUBCLASS',
        label: '组合子类',
        type: 'select',
        readSet: { name: 'label', code: 'value' },
        config: { maxTagCount: 1 },
        option: subclassList || [],
      },
      {
        name: 'FPRO_CDATE',
        label: '产品成立日',
        type: 'DatePicker',
      },
      {
        name: 'FPRO_SDATE',
        label: '产品到期日',
        type: 'DatePicker',
      },
      {
        name: 'FPRO_CUSTODIAN',
        label: '管理人',
        type: 'select',
        readSet: { name: 'clientName', code: 'id' },
        config: { maxTagCount: 1 },
        option: listByParam,
      },
      {
        name: 'FOPER_BANK',
        label: '运营行',
        type: 'select',
        readSet: { name: 'orgName', code: 'id' },
        config: { maxTagCount: 1 },
        option: orgNameList || [],
      },
      {
        name: 'FMARKET',
        label: '营销行',
        type: 'select',
        readSet: { name: 'orgName', code: 'id' },
        config: { maxTagCount: 1 },
        option: orgNameList || [],
      },
      {
        name: 'FPRO_STAGE',
        label: '产品阶段',
        type: 'select',
        readSet: { name: 'name', code: 'code' },
        config: { maxTagCount: 1 },
        option: dicts?.TG_product_stage || [],
      },
      {
        name: 'FPRO_STATUS',
        label: '产品状态',
        type: 'select',
        readSet: { name: 'name', code: 'code' },
        config: { maxTagCount: 1 },
        option: dicts?.tgProductStatus || [],
      },
    ];

    return (
      <>
        <List
          form={form}
          loading={listLoading}
          pageCode="bulletinBoards"
          dynamicHeaderCallback={this.callBackHandler}
          columns={columns}
          taskTypeCode={null}
          formItemData={formItemData}
          searchInputWidth="300"
          searchPlaceholder="请输入产品名称/产品代码"
          advancSearch={this.handlerSearch}
          resetFn={this.handleReset}
          fuzzySearch={value => {
            this.changekeyWords(value);
          }}
          extra={
            <Button
              disabled={isKanban}
              onClick={() => {
                this.setState({ isKanban: true });
              }}
              type="link"
            >
              开启产品阶段
            </Button>
          }
          tableList={
            <>
              {this.handleAddGird()}
              <Table
                bordered
                className="components-table-demo-nested"
                loading={listLoading}
                pagination={false}
                columns={columns}
                dataSource={list.rows || []}
                scroll={{ x: columns.length * 200 }}
                rowClassName={(record, index) => {
                  let className = '';
                  if (record?.urgentStatus === '1') {
                    className = 'color_fac10a';
                  } else {
                    if (index % 2 === 1) className = 'bgcFBFCFF';
                  }
                  return className;
                }}
              />
              <Pagination
                style={{ textAlign: 'right', marginTop: 15 }}
                onChange={this.changePage}
                onShowSizeChange={this.changePage}
                total={list.total || 0}
                pageSize={limit}
                current={page}
                showTotal={this.showTotal}
                showSizeChanger
                showQuickJumper
              />
            </>
          }
        />
        <Modal
          title="产品阶段"
          centered
          visible={visible}
          onOk={() => this.setState({ visible: false })}
          onCancel={() => this.setState({ visible: false })}
          width={1000}
        >
          {visible && <History proCode={proCode} proStage={proStage} />}
        </Modal>
      </>
    );
  }
}

const WrappedIndexForm = errorBoundary(
  Form.create()(
    connect(({ productForbulletinBoard, productForInfo, loading }) => ({
      productForbulletinBoard,
      productForInfo,
      listLoading: loading.effects['productForbulletinBoard/getList'],
    }))(Index),
  ),
);

export default WrappedIndexForm;
