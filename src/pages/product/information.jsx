import React, { Component } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { errorBoundary } from '@/layouts/ErrorBoundary';
import { Form, Modal, Row, Col, Button, Pagination, Tooltip } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import styles from './bulletinBoard.less';
import { tableRowConfig, eutrapelia } from '@/pages/investorReview/func';
import moment from 'moment';

import { Card, Table } from '@/components';
import Gird from '@/components/Gird';
import List from '@/components/List';

const uesrInfo = sessionStorage.getItem('USER_INFO') || {};
class Index extends Component {
  state = {
    keyWords: '',
    page: 1,
    limit: 10,
    total: 11,
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
        title: '产品代码',
        dataIndex: 'proCode',
        key: 'proCode',
        ...tableRowConfig,
        sorter: false,
      },
      {
        title: '产品名称',
        dataIndex: 'proName',
        key: 'proName',
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
        title: '数据来源',
        dataIndex: 'source',
        key: 'source',
        ...tableRowConfig,
        sorter: false,
        render: text => {
          return eutrapelia(this.handleColumnsForSources(text));
        },
      },
      {
        title: '产品状态',
        dataIndex: 'proStatus',
        key: 'proStatus',
        ...tableRowConfig,
        sorter: false,
        render: text => {
          return eutrapelia(this.handleColumnsForStatus(text));
        },
      },
      // {
      //   title: '审核状态',
      //   dataIndex: 'checked',
      //   key: 'checked',
      //   ...tableRowConfig,
      //   sorter: false,
      //   render: text => {
      //     return eutrapelia(this.handleColumnForStatus(text));
      //   },
      // },
      // {
      //   title: '最后操作日期',
      //   dataIndex: 'lastEditTime',
      //   key: 'lastEditTime',
      //   ...tableRowConfig,
      //   sorter: false,
      // },
      // {
      //   title: '最后操作人',
      //   dataIndex: 'lastEditorId',
      //   key: 'lastEditorId',
      //   ...tableRowConfig,
      //   sorter: false,
      // },
      {
        title: '操作',
        dataIndex: 'id',
        align: 'center',
        fixed: 'right',
        render: (val, record) => {
          return (
            <div>
              <a
                onClick={() => {
                  this.openInfo(record);
                }}
              >
                查看
              </a>
            </div>
          );
        },
      },
    ],
    seachData: {},

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

  // 列表项回显 产品状态
  handleColumnsForStatus = code => {
    const { productForbulletinBoard } = this.props;
    const { statusList } = productForbulletinBoard;
    const text = statusList.find(value => value?.code === code);
    return (text && text?.name) || '-';
  };

  // 列表项回显 数据来源
  handleColumnsForSources = code => {
    if (['1', '2', '3'].includes(code)) return '数据迁移';
    return '流程同步';
  };

  // 列表项回显 审核状态
  handleColumnForStatus = code => {
    const { productForInformation } = this.props;
    const { auditStatus } = productForInformation || {};
    const text = auditStatus?.find(value => value?.code === code);
    return (text && text?.name) || '-';
  };

  // 列表项回显 管理人
  handleColumnsForParam = code => {
    const { productForbulletinBoard } = this.props;
    const { listByParam } = productForbulletinBoard || [];
    const text = listByParam?.find(value => value?.id === code);
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
          likeBizViewId: 'I8aaa829a017fad20ad208ef80180080f6c0914d7',
          keyWords: keyWords,
        }
      : {};
    dispatch({
      type: 'productForInformation/getList',
      payload: {
        bizViewId: 'I8aaa829a017fad20ad208ef8018007f050701455',
        isPage: '1',
        page: page,
        size: limit,
        returnType: 'LIST',
        ...seachData,
        ...keyWordsData,
      },
    });
  };

  // 获取字典数据
  handleGetDicts = () => {
    const { dispatch } = this.props;
    // 数据字典
    dispatch({
      type: 'productForbulletinBoard/getDicts',
      payload: 'tgProductStatus,TG_product_stage,YX,YY,productDataSource',
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

    this.setState({ keyWords: '', seachData: { ...values, ...{ FPRO_CDATE, FPRO_SDATE } } }, () => {
      this.handleGetTableList();
    });
  };

  // 重置
  handleReset = () => {
    this.setState({ subclassList: [], keyWords: '', page: 1, limit: 10, seachData: {} }, () => {
      this.handleGetTableList();
    });
  };

  // M模糊查询
  changekeyWords = val => {
    this.setState({ keyWords: val, seachData: {} }, () => {
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

  // 预览
  openInfo = val => {
    const { dispatch } = this.props;
    dispatch(
      routerRedux.push({
        pathname: '/product/informationInfo',
        query: {
          proCode: val?.proCode,
          proName: val?.proName,
        },
      }),
    );
  };

  render() {
    const { page, limit, total, columns, isKanban, subclassList } = this.state;
    const { listLoading, productForbulletinBoard, productForInformation, form } = this.props;
    const {
      dicts,
      subclass,
      combination,
      listByParam,
      productEnum,
      orgNameList,
      statusList,
    } = productForbulletinBoard;
    const { auditStatus, list } = productForInformation;

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
        option: orgNameList,
      },
      {
        name: 'FMARKET',
        label: '营销行',
        type: 'select',
        readSet: { name: 'orgName', code: 'id' },
        config: { maxTagCount: 1 },
        option: orgNameList,
      },
      // {
      //   name: 'FPRO_STAGE',
      //   label: '审核状态',
      //   type: 'select',
      //   readSet: { name: 'name', code: 'code' },
      //   config: { maxTagCount: 1 },
      //   option: auditStatus,
      // },
      {
        name: 'FPRO_STATUS',
        label: '产品状态',
        type: 'select',
        readSet: { name: 'name', code: 'code' },
        config: { maxTagCount: 1 },
        option: statusList,
      },
    ];

    return (
      <>
        <List
          form={form}
          loading={listLoading}
          pageCode="productForInformation"
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
          tableList={
            <>
              <Table
                bordered
                className="components-table-demo-nested"
                loading={listLoading}
                pagination={false}
                columns={columns}
                dataSource={list?.rows || []}
                scroll={{ x: columns.length * 200 }}
              />
              <Pagination
                style={{ textAlign: 'right', marginTop: 15 }}
                onChange={this.changePage}
                onShowSizeChange={this.changePage}
                total={list?.total || 0}
                pageSize={limit}
                current={page}
                showTotal={this.showTotal}
                showSizeChanger
                showQuickJumper
              />
            </>
          }
        />
      </>
    );
  }
}

const WrappedIndexForm = errorBoundary(
  Form.create()(
    connect(({ productForInformation, productForbulletinBoard, loading }) => ({
      productForbulletinBoard,
      productForInformation,
      listLoading: loading.effects['productForInformation/getList'],
    }))(Index),
  ),
);

export default WrappedIndexForm;
