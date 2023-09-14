/**
 * 项目底稿报送查询
 * author: jiaqiuhua
 * * */
import React, { Component } from 'react';
import { connect } from 'dva';
import Action, { linkHoc } from '@/utils/hocUtil';
import { errorBoundary } from '@/layouts/ErrorBoundary';
import { Form, Card, Tooltip, Radio } from 'antd';
import { Table } from '@/components';
import { handleClearQuickJumperValue } from '@/pages/archiveTaskHandleList/util';
import FuzzySearch from './component/FuzzySearch';
import PreciseSearch from './component/PreciseSearch';
import styles from './index.less';

const fuzzySearchRef = React.createRef();
const initParams = {
  keyWords: '',
  pageNum: 1,
  pageSize: 10,
  direction: 'DESC',
  field: 'fcreateTime',
  type: 1,
};

@Form.create()
class Agent extends Component {
  state = {
    columns: [
      {
        key: 'proName',
        title: '项目名称',
        width: 150,
        align: 'center',
        dataIndex: 'proName',
        sorter: true,
        ellipsis: {
          showTitle: false,
        },
        render: text => (
          <Tooltip title={text}>
            <span>{text}</span>
          </Tooltip>
        ),
      },
      {
        key: 'proType',
        title: '项目类型',
        width: 130,
        align: 'center',
        dataIndex: 'proType',
        sorter: true,
        ellipsis: {
          showTitle: false,
        },
        render: text => (
          <Tooltip title={text}>
            <span>{text}</span>
          </Tooltip>
        ),
      },
      {
        key: 'logsType',
        title: '报送类型',
        width: 150,
        align: 'center',
        dataIndex: 'logsType',
        sorter: true,
        ellipsis: {
          showTitle: false,
        },
        render: text => {
          const dicMap = {
            '1': '项目报送',
            '2': '文件报送',
            '3': '底稿范围外项目报送',
            '4': '底稿范围外文件报送',
          };
          return (
            <Tooltip title={dicMap[text]}>
              <span>{dicMap[text]}</span>
            </Tooltip>
          );
        },
      },
      {
        key: 'responseMsg',
        title: '报送结果',
        width: 150,
        align: 'center',
        dataIndex: 'responseMsg',
        sorter: true,
        ellipsis: {
          showTitle: false,
        },
        render: text => (
          <Tooltip title={text}>
            <span>{text}</span>
          </Tooltip>
        ),
      },
      {
        key: 'fcreatorId',
        title: '经办人',
        width: 120,
        align: 'center',
        sorter: true,
        dataIndex: 'fcreatorId',
        ellipsis: {
          showTitle: false,
        },
        render: (text, record) => (
          <Tooltip title={record.creatorName}>
            <span>{record.creatorName}</span>
          </Tooltip>
        ),
      },
      {
        key: 'fcreateTime',
        title: '更新报送时间',
        width: 200,
        align: 'center',
        dataIndex: 'fcreateTime',
        sorter: true,
        ellipsis: {
          showTitle: false,
        },
        render: text => (
          <Tooltip title={text}>
            <span>{text}</span>
          </Tooltip>
        ),
      },
    ],
    params: {
      keyWords: '',
      pageNum: 1,
      pageSize: 10,
      direction: 'DESC',
      field: 'fcreateTime',
      type: 1,
    },
    expand: false,
    curClickBatchNumber: '',
  };

  /**
   * @method componentDidMount 生命周期
   */
  componentDidMount() {
    const { dispatch } = this.props;
    // table表格数据请求
    this.handleMasterTableData(this.state.params);
    // 项目编码
    this.handleProCodeData();
    // 项目类型下拉
    dispatch({
      type: 'manuscriptManagementReportResult/getDictsReq',
      payload: {
        fcode: 'awp_pro_type',
      },
    });
  }

  /**
   * 项目编码
   * **/
  handleProCodeData = (type = 1) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'archiveTaskHandleList/getProCodeReq',
      payload: {
        type,
      },
    });
  };

  /**
   * 主表格查询
   */
  handleMasterTableData = params => {
    const { dispatch } = this.props;
    const { expand } = this.state;
    const payload = { ...params };
    expand && delete payload.keyWords;
    dispatch({
      type: 'manuscriptManagementReportResult/getTableLogsMasterReq',
      payload,
      callback: () => {
        this.state.params = payload;
        handleClearQuickJumperValue();
      },
    });
  };

  /**
   * 切换
   * **/
  handleToggle = () => {
    this.setState(({ expand }) => ({ expand: !expand }));
  };

  /**
   * 子表格查询
   * * */
  handleSubTableData({ proCode, batchNumber, logsType }) {
    const {
      dispatch,
      manuscriptManagementReportResult: { allSubTableListObj },
    } = this.props;
    dispatch({
      type: 'manuscriptManagementReportResult/getTableLogsSubReq',
      payload: {
        proCode,
        batchNumber,
        logsType,
        allSubTableListObj,
      },
    });
  }

  /**
   * @method  sortChange 切换条数的时候触发
   */
  sortChange = ({ current, pageSize }, field, sorter) => {
    this.state.params.pageNum = current;
    this.state.params.pageSize = pageSize;
    const { params } = this.state;
    params.field = sorter.field;
    switch (sorter.order) {
      case 'ascend':
        params.direction = 'ASC';
        break;
      case 'descend':
        params.direction = 'DESC';
        break;
      default:
        params.direction = '';
        params.field = '';
    }
    this.handleMasterTableData(params);
  };

  /**
   * 主表格点击展开图标时触发
   * * */
  handleExpand = (expanded, record) => {
    if (expanded) {
      this.setState(
        () => ({
          curClickBatchNumber: record.batchNumber,
        }),
        () => {
          this.handleSubTableData(record);
        },
      );
    }
  };

  /**
   * tab切换
   * type:1项目,2系列
   * **/
  handleRadioChange = e => {
    const type = e.target.value;
    const columns = this.state.columns.map(item => {
      if (type === 0 && item.title.includes('项目')) {
        item.title = item.title.replace('项目', '系列');
      }
      if (type === 1 && item.title.includes('系列')) {
        item.title = item.title.replace('系列', '项目');
      }
      return item;
    });

    initParams.type = type;
    this.setState({ columns, expand: false });
    fuzzySearchRef.current && fuzzySearchRef.current.handleReset();
    this.handleProCodeData(type);
    this.handleMasterTableData(initParams);
  };

  /**
   * 二级表格
   * **/
  expandedRowRender = item => {
    const {
      subLoading,
      manuscriptManagementReportResult: { allSubTableListObj },
    } = this.props;
    const columns = [
      {
        key: 'proName',
        title: '文档名称',
        width: 150,
        align: 'center',
        dataIndex: 'proName',
        ellipsis: {
          showTitle: false,
        },
        render: text => (
          <Tooltip>
            <span>{text}</span>
          </Tooltip>
        ),
      },
      {
        key: 'fileSize',
        title: '文件大小(MB)',
        width: 150,
        align: 'center',
        dataIndex: 'fileSize',
        ellipsis: {
          showTitle: false,
        },
        render: text => (
          <Tooltip>
            <span>{text}</span>
          </Tooltip>
        ),
      },
      {
        key: 'fileSign',
        title: '文件签名值',
        width: 150,
        align: 'center',
        dataIndex: 'fileSign',
        ellipsis: {
          showTitle: false,
        },
        render: text => (
          <Tooltip>
            <span>{text}</span>
          </Tooltip>
        ),
      },
      {
        key: 'responseMsg',
        title: '报送结果',
        width: 150,
        align: 'center',
        dataIndex: 'responseMsg',
        ellipsis: {
          showTitle: false,
        },
        render: text => (
          <Tooltip>
            <span>{text}</span>
          </Tooltip>
        ),
      },
    ];

    return (
      <Card bordered={false}>
        <Table
          columns={columns}
          dataSource={allSubTableListObj[`batchNumber_${item.batchNumber}`]}
          pagination={false}
          loading={subLoading}
        />
      </Card>
    );
  };

  render() {
    const {
      expand,
      columns,
      params: { pageSize, pageNum },
    } = this.state;
    const {
      loading,
      form,
      manuscriptManagementReportResult: { masterTableList, awpProType, logsType },
      archiveTaskHandleList: { proCode },
    } = this.props;

    return (
      <div className={styles.manuscriptManagementReportResult}>
        {/* 高级搜索 */}
        <Card bordered={false}>
          {expand ? (
            <PreciseSearch
              props={{
                form,
                proCode,
                proType: awpProType,
                logsType,
                initParams,
              }}
              handleToggle={this.handleToggle}
              handleGetTableData={this.handleMasterTableData}
            />
          ) : (
            <FuzzySearch
              props={{
                form,
                initParams,
              }}
              handleToggle={this.handleToggle}
              handleGetTableData={this.handleMasterTableData}
              ref={fuzzySearchRef}
            />
          )}
        </Card>
        <Card style={{ marginTop: '12px' }} bordered={false}>
          <Radio.Group
            style={{ marginBottom: '20px' }}
            buttonStyle="solid"
            defaultValue={1}
            onChange={this.handleRadioChange}
          >
            <Action code="manuscriptManagementReportResult:projectReport">
              <Radio.Button value={1}>项目报送</Radio.Button>
            </Action>
            <Action code="manuscriptManagementReportResult:seriesReport">
              <Radio.Button value={0}>系列报送</Radio.Button>
            </Action>
          </Radio.Group>
          <Table
            rowKey={(record, index) => index}
            loading={loading}
            columns={columns}
            dataSource={masterTableList.rows}
            expandedRowRender={this.expandedRowRender}
            onExpand={this.handleExpand}
            onChange={this.sortChange}
            pagination={{
              showSizeChanger: true,
              showQuickJumper: true,
              current: pageNum,
              pageSize: pageSize,
              total: masterTableList.total,
              showTotal: total => `共 ${total} 条数据`,
            }}
          />
        </Card>
      </div>
    );
  }
}

export default errorBoundary(
  linkHoc()(
    Form.create()(
      connect(({ manuscriptManagementReportResult, archiveTaskHandleList, loading, router }) => ({
        manuscriptManagementReportResult,
        archiveTaskHandleList,
        router,
        loading: loading.effects['manuscriptManagementReportResult/getTableLogsMasterReq'],
        subLoading: loading.effects['manuscriptManagementReportResult/getTableLogsSubReq'],
      }))(Agent),
    ),
  ),
);
