/**
 *  产品数据管理/【项目/系列删除信息查询】
 */
import React, { Component } from 'react';
import {
  Breadcrumb,
  Button,
  Card,
  Col,
  DatePicker,
  Form,
  Icon,
  Input,
  Pagination,
  Radio,
  Row,
  Select,
  Table,
  Tooltip,
} from 'antd';
import moment from 'moment';
import { connect } from 'dva';
import router from 'umi/router';
import { errorBoundary } from '@/layouts/ErrorBoundary';
import Action, { linkHoc } from '@/utils/hocUtil';
import { download } from '@/utils/download';

const { Option } = Select;
const { Search } = Input;
const { RangePicker } = DatePicker;

const layout = {
  labelAlign: 'right',
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

@Form.create()
class Index extends Component {
  state = {
    keyWords: '',
    expand: false,
    tabKey: '1',
    projectData: [],
    searchData: {},
    pageNum: 1,
    pageSize: 10,
    direction: '',
    field: '',
  };

  componentDidMount() {
    this.getOptions();
    this.getTableList();
  }

  getOptions = () => {
    const { dispatch } = this.props;
    const { tabKey } = this.state;
    // 文件列表任务名称下拉
    dispatch({
      type: 'documentFileDeleteLog/getTask',
      payload: {
        type: Number(tabKey), //type是区分项目和系列的  1项目  0系列
      },
    });
    // 文件列表项目名称下拉
    dispatch({
      type: 'documentFileDeleteLog/getProject',
      payload: {
        type: Number(tabKey), //type是区分项目和系列的  1项目  0系列
      },
    });
  };

  // 模糊查询
  seachTableData = val => {
    this.setState({ keyWords: val, pageNum: 1, pageSize: 10 }, () => {
      this.getTableList();
    });
  };

  // 精准查询
  searchBtn = () => {
    const { dispatch, form } = this.props;
    const formItems = form.getFieldsValue();

    if (formItems.projectPeriod) {
      formItems.startDelTime = this.formatDate(formItems.projectPeriod[0]);
      formItems.endDelTime = this.formatDate(formItems.projectPeriod[1]);
      delete formItems.projectPeriod;
    }
    this.setState({ searchData: formItems, pageNum: 1, pageSize: 10 }, () => {
      this.getTableList();
    });
  };

  // 获取列表接口
  getTableList = () => {
    const { dispatch, form } = this.props;
    const { searchData, pageNum, pageSize, tabKey, keyWords, field, direction } = this.state;
    // 获取详情基础信息
    dispatch({
      type: 'documentFileDeleteLog/getList',
      payload: {
        type: Number(tabKey), //type是区分项目和系列的  1项目  0系列
        pageNum: pageNum,
        pageSize: 10,
        direction: direction,
        field: field,
        keyWords: keyWords,
        ...searchData,
      },
    });
  };

  //  handleSetPage 切换页数的时候触发
  handleSetPage = (page, pageSize) => {
    console.log(page);
    this.setState({ pageNum: page, pageSize }, () => this.getTableList());
  };

  // table change
  changeTable = (pagination, filters, sorter) => {
    this.setState(
      {
        keyWords: '',
        searchData: {},
        direction: sorter.order ? (sorter.order === 'ascend' ? 'asc' : 'desc') : '',
        field: sorter.order ? (sorter.field === 'seriesName' ? 'seriesCode' : sorter.field) : '',
      },
      () => this.getTableList(),
    );
  };

  // tabs 切换
  changeTabs = e => {
    const { form } = this.props;
    form.resetFields();
    this.setState(
      {
        tabKey: e.target.value,
        pageNum: 1,
        pageSize: 10,
        direction: '',
        field: '',
        searchData: {},
        keyWords: '',
      },
      () => {
        this.getOptions();
        this.getTableList();
      },
    );
  };

  // 切换查询
  toggle = () => {
    const { expand } = this.state;
    const { form } = this.props;
    form.resetFields();
    this.setState({ expand: !expand, keyWords: '', searchData: {} });
  };

  // 时间格式转换·
  formatDate(date, type) {
    return date ? moment(date).format('YYYY-MM-DD') : '';
  }

  productFilterOption = (input, option) => {
    const label = option.props.children.toLowerCase();
    const value = option.props.value.toLowerCase();
    const ipt = input.toLowerCase();
    return label.includes(ipt) || value.includes(ipt);
  };

  // 更新表头
  updateColumns = columns => {
    const { tabKey } = this.state;
    let newColumns = [];
    if (tabKey === '1') {
      newColumns = [
        ...[
          {
            key: 'proName',
            title: '项目名称',
            dataIndex: 'proName',
            sorter: true,
            width: 200,
            ellipsis: {
              showTitle: false,
            },
            render: proName => {
              return (
                <Tooltip placement="topLeft" title={proName}>
                  <span>{proName}</span>
                </Tooltip>
              );
            },
          },
          {
            key: 'proCode',
            title: '项目编码',
            dataIndex: 'proCode',
            sorter: true,
            width: 200,
            ellipsis: {
              showTitle: false,
            },
            render: proCode => {
              return (
                <Tooltip placement="topLeft" title={proCode}>
                  <span>{proCode}</span>
                </Tooltip>
              );
            },
          },
        ],
        ...columns,
      ];
    } else {
      newColumns = [
        ...[
          {
            key: 'proName',
            title: '系列名称',
            dataIndex: 'proName',
            sorter: true,
            width: 200,
            ellipsis: {
              showTitle: false,
            },
            render: proName => {
              return (
                <Tooltip placement="topLeft" title={proName}>
                  <span>{proName}</span>
                </Tooltip>
              );
            },
          },
          {
            key: 'proCode',
            title: '系列编码',
            dataIndex: 'proCode',
            sorter: true,
            width: 200,
            ellipsis: {
              showTitle: false,
            },
            render: proCode => {
              return (
                <Tooltip placement="topLeft" title={proCode}>
                  <span>{proCode}</span>
                </Tooltip>
              );
            },
          },
        ],
        ...columns,
      ];
    }
    return newColumns;
  };

  // 下载
  handleContentsExport = ({ proName, proCode }) => {
    download(`/ams/yss-awp-server/product/export/path-file?proCode=${proCode}`, {
      method: 'GET',
      name: `${proName}_${proCode}`,
    });
  };

  // 流转历史
  handleCanLocationHistory = record => {
    const url = `/processCenter/processHistory?processInstanceId=${record.processInstanceId}&taskId=${record.taskId}`;
    router.push(url);
  };

  render() {
    const {
      documentFileDeleteLog: { taksList, projectList, list, listForSeries, seriesList },
      loading,
      form: { getFieldDecorator, resetFields },
    } = this.props;
    const { keyWords, expand, tabKey, projectData, pageNum, pageSize } = this.state;

    const columns = [
      {
        key: 'taskName',
        title: '任务名称',
        dataIndex: 'taskName',
        sorter: true,
        width: 200,
        ellipsis: {
          showTitle: false,
        },
        render: taskName => {
          return (
            <Tooltip placement="topLeft" title={taskName}>
              <span>{taskName}</span>
            </Tooltip>
          );
        },
      },
      {
        key: 'awpName',
        title: '文件名称',
        dataIndex: 'awpName',
        sorter: true,
        width: 200,
        ellipsis: {
          showTitle: false,
        },
        render: awpName => {
          return (
            <Tooltip placement="topLeft" title={awpName}>
              <span>{awpName}</span>
            </Tooltip>
          );
        },
      },
      {
        key: 'awpPathName',
        title: '文件目录',
        dataIndex: 'awpPathName',
        sorter: true,
        width: 200,
        ellipsis: {
          showTitle: false,
        },
        render: awpPathName => {
          return (
            <Tooltip placement="topLeft" title={awpPathName}>
              <span>{awpPathName}</span>
            </Tooltip>
          );
        },
      },
      {
        key: 'deleteTime',
        title: '删除时间',
        dataIndex: 'deleteTime',
        sorter: true,
        width: 200,
        ellipsis: {
          showTitle: false,
        },
        render: deleteTime => {
          return (
            <Tooltip placement="topLeft" title={deleteTime}>
              <span>{deleteTime}</span>
            </Tooltip>
          );
        },
      },
      {
        key: 'deletorName',
        title: '申请人',
        dataIndex: 'deletorName',
        sorter: true,
        width: 200,
        ellipsis: {
          showTitle: false,
        },
        render: deletorName => {
          return (
            <Tooltip placement="topLeft" title={deletorName}>
              <span>{deletorName}</span>
            </Tooltip>
          );
        },
      },
      {
        key: 'id',
        dataIndex: 'id',
        title: '操作',
        fixed: 'right',
        width: 150,
        render: (text, record) => {
          return (
            <>
              <Button
                type="link"
                size="small"
                onClick={() => this.handleCanLocationHistory(record)}
              >
                流转历史
              </Button>
              {/* </Action> */}
              <Button
                type="link"
                size="small"
                onClick={() => {
                  this.handleContentsExport(record);
                }}
              >
                下载
              </Button>
            </>
          );
        },
      },
    ];

    return (
      <>
        <Card
          style={{
            marginBottom: 10,
          }}
        >
          <Form {...layout}>
            <Row gutter={24}>
              <Col md={12} sm={12}>
                <Breadcrumb>
                  <Breadcrumb.Item>产品数据管理</Breadcrumb.Item>
                  <Breadcrumb.Item>项目/系列删除信息查询</Breadcrumb.Item>
                </Breadcrumb>
              </Col>
              <Col
                gutter={12}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                }}
              >
                <Search
                  placeholder={tabKey === '1' ? '请输入项目名称/编码' : '请输入系列名称/编码'}
                  onSearch={val => this.seachTableData(val)}
                  onChange={ev => this.setState({ keyWords: ev.target.value })}
                  value={keyWords}
                  style={{
                    display: this.state.expand ? 'none' : 'block',
                    width: 220,
                  }}
                />
                <Button
                  style={{
                    display: this.state.expand ? 'none' : 'block',
                    marginLeft: 23,
                    fontSize: 14,
                  }}
                  onClick={this.toggle}
                  type="link"
                >
                  展开搜索
                  <Icon type="down" />
                </Button>
              </Col>
            </Row>
            <Row
              gutter={24}
              style={{ display: this.state.expand ? 'block' : 'none', marginTop: 20 }}
            >
              <Col span={8}>
                {tabKey === '1' && (
                  <Form.Item name="proCodes" label="项目名称:">
                    {getFieldDecorator('proCodes')(
                      <Select
                        placeholder="请选择"
                        mode="multiple"
                        showArrow
                        filterOption={this.productFilterOption}
                      >
                        {projectList &&
                          Object.keys(projectList).map((obj, idx) => (
                            <Option key={idx} value={obj}>
                              {projectList[obj]}
                            </Option>
                          ))}
                      </Select>,
                    )}
                  </Form.Item>
                )}
                {tabKey === '0' && (
                  <Form.Item name="proCodes" label="系列名称:">
                    {getFieldDecorator('proCode')(
                      <Select
                        placeholder="请选择"
                        mode="multiple"
                        showArrow
                        filterOption={this.productFilterOption}
                      >
                        {seriesList &&
                          seriesList.map(item => (
                            <Option key={item.code} value={item.code}>
                              {item.name}
                            </Option>
                          ))}
                      </Select>,
                    )}
                  </Form.Item>
                )}
              </Col>
              <Col span={8}>
                <Form.Item name="taskNames" label="任务名称:">
                  {getFieldDecorator('taskNames')(
                    <Select
                      placeholder="请选择"
                      mode="multiple"
                      showArrow
                      filterOption={this.productFilterOption}
                    >
                      {taksList &&
                        taksList.map((item, index) => (
                          <Option key={index} value={item}>
                            {item}
                          </Option>
                        ))}
                    </Select>,
                  )}
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="文件名称">
                  {getFieldDecorator('fileName')(<Input placeholder="请输入" />)}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24} style={{ display: this.state.expand ? 'block' : 'none' }}>
              <Col span={8}>
                <Form.Item label="删除时间">
                  {getFieldDecorator('projectPeriod')(
                    <RangePicker placeholder={['开始日期', '结束日期']} format="YYYY-MM-DD" />,
                  )}
                </Form.Item>
              </Col>
              <Col span={8} style={{ textAlign: 'right', float: 'right', marginTop: 10 }}>
                <Button
                  type="primary"
                  onClick={() => this.searchBtn()}
                  style={{
                    display: this.state.expand ? 'inline-block' : 'none',
                    marginRight: '10px',
                  }}
                >
                  查询
                </Button>
                <Button
                  onClick={() => resetFields()}
                  style={{ display: this.state.expand ? 'inline-block' : 'none', marginLeft: 8 }}
                >
                  重置
                </Button>
                <Button style={{ marginLeft: 5 }} onClick={this.toggle} type="link">
                  收起
                  <Icon type="up" />
                </Button>
              </Col>
            </Row>
          </Form>
        </Card>
        <Card>
          <Radio.Group
            style={{ marginBottom: '20px' }}
            buttonStyle="solid"
            defaultValue="project"
            value={tabKey}
            onChange={this.changeTabs}
          >
            <Radio.Button value="1">项目信息</Radio.Button>
            <Radio.Button value="0">系列信息</Radio.Button>
          </Radio.Group>

          <>
            <Table
              dataSource={list?.rows}
              columns={this.updateColumns(columns)}
              scroll={{ x: columns.length * 200 }}
              rowKey={(r, i) => i}
              loading={loading}
              pagination={false}
              onChange={this.changeTable}
            />
            <Pagination
              style={{
                marginTop: 20,
                textAlign: 'right',
              }}
              current={pageNum}
              pageSize={pageSize}
              onChange={this.handleSetPage}
              onShowSizeChange={this.handleSetPage}
              total={list?.total}
              showTotal={() => `共 ${list?.total || 0} 条数据`}
              showSizeChanger
              showQuickJumper={list?.total > pageSize}
            />
          </>
        </Card>
      </>
    );
  }
}

const WrappedSingleForm = errorBoundary(
  linkHoc()(
    Form.create()(
      connect(({ documentFileDeleteLog, loading }) => ({
        documentFileDeleteLog,
        loading: loading.effects['documentFileDeleteLog/getList'],
      }))(Index),
    ),
  ),
);
export default WrappedSingleForm;
