/**
 *  项目信息详情
 */
import React, { Component } from 'react';
import {
  Table,
  Form,
  Select,
  Button,
  Row,
  Col,
  Input,
  Card,
  DatePicker,
  Icon,
  Menu,
  Dropdown,
  message,
  Radio,
  Tooltip,
  Divider,
  Popover,
  InputNumber,
  Breadcrumb,
} from 'antd';
const { TextArea } = Input;
import moment from 'moment';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import router from 'umi/router';
import { errorBoundary } from '@/layouts/ErrorBoundary';
import Action, { linkHoc } from '@/utils/hocUtil';
import request from '@/utils/request';
import CustomerInfoChildrenForm from '../../components/CustomerInfoChildrenForm';

const FormItem = Form.Item;
const { Option } = Select;
const { Search } = Input;
const ButtonGroup = Button.Group;

@Form.create()
class ProjectInfoDetail extends Component {
  state = {
    localProParticipantList: [], //全量参与人类型数据
    newProParticipantList: [], //部分参与人类型数据
    reportColumns: [
      {
        key: 'tradingPlacesName',
        title: '交易场所',
        dataIndex: 'tradingPlacesName',
        align: 'center',
        width: 260,
      },
      {
        key: 'otherTradingPlaces',
        title: '其它交易场所',
        dataIndex: 'otherTradingPlaces',
        align: 'center',
        width: 260,
        render: (otherTradingPlaces, record) => (
          <span>{record.tradingPlaces === '2007' ? otherTradingPlaces : ''}</span>
        ),
      },
      {
        key: 'declareTime',
        title: '申报日期',
        width: 140,
        dataIndex: 'declareTime',
        align: 'center',
        render: declareTime => <span>{this.formatDate(declareTime)}</span>,
      },
    ],
    publishColumns: [
      {
        key: 'stockCode',
        title: '证券代码',
        dataIndex: 'stockCode',
        width: 240,
        align: 'center',
      },
      {
        key: 'stockShortName',
        title: '证券简称',
        dataIndex: 'stockShortName',
        align: 'center',
        width: 260,
      },
      {
        key: 'issueTime',
        title: '上市/挂牌时间',
        width: 140,
        dataIndex: 'issueTime',
        align: 'center',
        render: issueTime => <span>{this.formatDate(issueTime)}</span>,
      },
    ],
    columns: [
      {
        key: 'proRole',
        title: '参与人类型',
        dataIndex: 'proRole',
        width: 200,
        align: 'center',
        render: proRole => {
          const { newProParticipantList } = this.state;
          return (
            <Select disabled={true} style={{ width: '100%' }} value={`${proRole}`}>
              {newProParticipantList &&
                newProParticipantList.map(item => <Option key={item.code}>{item.name}</Option>)}
            </Select>
          );
        },
      },
      {
        key: 'membeName',
        title: '参与人名称',
        dataIndex: 'membeName',
        width: 200,
        align: 'center',
        ellipsis: {
          showTitle: false,
        },
        render: membeName => (
          <Tooltip placement="topLeft" title={membeName}>
            <span>{membeName}</span>
          </Tooltip>
        ),
      },
    ],
    memberColumn: [
      {
        key: 'membeName',
        title: '姓名',
        dataIndex: 'membeName',
        width: 150,
        align: 'center',
        ellipsis: {
          showTitle: false,
        },
        render: membeName => (
          <Tooltip placement="topLeft" title={membeName}>
            <span>{membeName}</span>
          </Tooltip>
        ),
      },
      {
        key: 'sex',
        title: '性别',
        dataIndex: 'sex',
        width: 150,
        align: 'center',
        render: (sex, record) => <span>{sex === '0' ? '男' : '女'}</span>,
      },
      {
        key: 'idType',
        title: '证件类型',
        dataIndex: 'idType',
        width: 230,
        align: 'center',
        render: idType => {
          const { idTypeList } = this.props.addProjectInfo;
          return (
            <Select disabled={true} style={{ width: '100%' }} value={`${idType}`}>
              {idTypeList &&
                idTypeList.map(item => (
                  <Option key={item.code} value={item.code}>
                    {item.name}
                  </Option>
                ))}
            </Select>
          );
        },
      },
      // {
      //   key: 'idName',
      //   title: '其他证件类型',
      //   dataIndex: 'idName',
      //   width: 200,
      //   align: 'center',
      //   render: (idName, record) => <span>{idName}</span>,
      // },
      {
        key: 'idCard',
        title: '证件号码',
        dataIndex: 'idCard',
        width: 220,
        align: 'center',
        render: (idCard, record) => <span>{idCard}</span>,
      },
      {
        key: 'department',
        title: '部门',
        dataIndex: 'department',
        width: 200,
        ellipsis: {
          showTitle: false,
        },
        align: 'center',
        render: (department, record) => (
          <Tooltip placement="topLeft" title={department}>
            <span>{department}</span>
          </Tooltip>
        ),
      },
      {
        key: 'job',
        title: '职位',
        dataIndex: 'job',
        width: 200,
        align: 'center',
        ellipsis: {
          showTitle: false,
        },
        render: (job, record) => (
          <Tooltip placement="topLeft" title={job}>
            <span>{job}</span>
          </Tooltip>
        ),
      },
      {
        key: 'proRole',
        title: '项目角色',
        dataIndex: 'proRole',
        width: 220,
        align: 'center',
        render: (proRole, record) => <span>{proRole}</span>,
      },
      {
        key: 'email',
        title: '邮箱',
        dataIndex: 'email',
        width: 220,
        align: 'center',
        render: (email, record) => <span>{email}</span>,
      },
      {
        key: 'mobile',
        title: '联系电话',
        dataIndex: 'mobile',
        width: 200,
        align: 'center',
        render: (mobile, record) => <span>{mobile}</span>,
      },
      {
        key: 'remark',
        title: '备注',
        dataIndex: 'remark',
        width: 320,
        align: 'center',
        ellipsis: {
          showTitle: false,
        },
        render: (remark, record) => (
          <Tooltip placement="topLeft" title={remark}>
            <span>{remark}</span>
          </Tooltip>
        ),
      },
    ],
    pageInfo: {},
    isIframe: false,
  };

  componentDidMount() {
    if (document.getElementsByClassName('ant-layout') > 1) {
      document.getElementsByClassName('ant-layout')[2].scrollTop = 0;
    }
    this.getDropLists();

    window.parent.postMessage(
      {
        code: '200',
        type: 'onReady',
        data: {
          iframItemKey: 'businessData',
        },
      },
      '*',
    );

    window.onmessage = this.messageHandle;
    this.getPageData();
  }

  componentWillUnmount() {
    window.onmessage = null;
  }

  messageHandle = event => {
    const eventData = event.data;
    if (eventData.code === '200' && eventData.type === 'dataDispatched') {
      if (
        eventData.data.formData &&
        eventData.data.formData.businessData &&
        JSON.stringify(eventData.data.formData.businessData) !== '{}'
      ) {
        this.props.dispatch({
          type: 'projectInfoManger/getMemberInfoByCodeReq',
          payload: {
            proCode: eventData.data.formData.businessData.proCode,
          },
          callback: result => {
            eventData.data.formData.businessData.proMembers = result.data;
            this.setState({
              pageInfo: eventData.data.formData.businessData,
              isIframe: true,
            });
          },
        });
      }
    }
  };

  getDropLists() {
    const { dispatch } = this.props;
    // 项目系列下拉框数据获取
    dispatch({
      type: 'addProjectInfo/getproName',
      payload: {
        type: 0,
      },
    });
    // 项目类型下拉框数据获取
    dispatch({
      type: 'addProjectInfo/getProTypeList',
      payload: {
        fcode: 'awp_pro_type',
      },
    });
    // 所属行业下拉框数据获取
    dispatch({
      type: 'addProjectInfo/getProTypeList',
      payload: {
        fcode: 'awp_pro_trade',
      },
    });
    // 项目区域下拉框数据获取
    dispatch({
      type: 'addProjectInfo/getProTypeList',
      payload: {
        fcode: 'awp_pro_loca',
      },
    });
    // 上市板块下拉框数据获取
    dispatch({
      type: 'addProjectInfo/getProTypeList',
      payload: {
        fcode: 'awp_list_plate',
      },
    });
    // 项目参与人类型下拉框数据获取
    dispatch({
      type: 'addProjectInfo/getProTypeList',
      payload: {
        fcode: 'awp_pro_participant',
      },
    }).then(res => {
      if (res) {
        this.setState({
          newProParticipantList: res,
          localProParticipantList: res,
        });
      }
    });
    // 证件类型下拉框数据获取
    dispatch({
      type: 'addProjectInfo/getProTypeList',
      payload: {
        fcode: 'awp_id_type',
      },
    });
    // 交易场所下拉框数据获取
    dispatch({
      type: 'addProjectInfo/getProTypeList',
      payload: {
        fcode: 'awp_trad_place',
      },
    });
    // 币种下拉框数据获取
    dispatch({
      type: 'addProjectInfo/getProTypeList',
      payload: {
        fcode: 'C001',
      },
    });
    // 成员姓名下拉框数据获取
    dispatch({
      type: 'addProjectInfo/getMemberNameList',
    });
  }

  getPageData = () => {
    const { proCode, taskId } = this.props.location.query;
    this.setState({
      radioType: this.props.location.query.radioType,
    });
    if (taskId) {
      request(`/api/billow-diplomatic/todo-task/processInfo?taskId=${taskId}`).then(res => {
        if (res?.status === 200) {
          this.setState({
            pageInfo: res.data.formData.businessData,
          });
        } else {
          message.warn(res.message);
        }
      });
    } else if (proCode) {
      this.props
        .dispatch({
          type: 'addProjectInfo/getPageInfo',
          payload: {
            proCode,
          },
        })
        .then(res => {
          if (res && res.status === 200) {
            this.setState({
              pageInfo: res.data,
            });
          } else {
            message.warn(res.message);
          }
        });
    }
  };

  /**
   * 格式化日期
   * @param {时间} date
   */
  formatDate(date) {
    return date ? moment(date).format('YYYY-MM-DD') : '';
  }
  /**
   * 格式金额
   * @param {} num
   */
  moneyFormat(num) {
    if (!num) return '';

    const dotIndex = num.indexOf('.');
    if (dotIndex !== -1 && num.length - dotIndex - 1 > 6) {
      num = num.substr(0, dotIndex + 7);
      while (num.charAt(num.length - 1) === '0') {
        num = num.substr(0, num.length - 1);
      }
    }
    var array = new Array();
    array = num.split('.');

    var re = /(-?\d+)(\d{3})/;
    while (re.test(array[0])) {
      array[0] = array[0].replace(re, '$1,$2');
    }

    var returnV = array[0];
    for (var i = 1; i < array.length; i++) {
      returnV += '.' + array[i];
    }
    return returnV;
  }

  // 返回上一页
  handleBackPage = () => {
    if (this.props.location.query.comeFrom) {
      router.go(-1);
    } else {
      this.props.dispatch(
        routerRedux.push({
          pathname: '/projectManagement/projectAndSeriesQuery',
          query: {
            radioType: this.props.router.location.query.radioType,
          },
        }),
      );
    }
  };

  render() {
    const {
      form: { getFieldDecorator },
      addProjectInfo: {
        proTypeList,
        proTradeList,
        proLocaList,
        proPlateList,
        idTypeList,
        capitalCurrencyList,
      },
    } = this.props;
    const {
      columns,
      memberColumn,
      reportColumns,
      publishColumns,
      pageInfo,
      radioType,
      isIframe,
    } = this.state;
    const layout = {
      labelAlign: 'right',
      labelCol: { span: 9 },
      wrapperCol: { span: 15 },
    };

    return (
      <Card
        style={{
          marginBottom: isIframe ? 0 : 10,
        }}
        title={
          isIframe ? (
            ''
          ) : (
            <Breadcrumb>
              <Breadcrumb.Item>
                {this.props.location.query.comeFrom ? '项目信息管理' : '项目/系列信息查询'}
              </Breadcrumb.Item>
              <Breadcrumb.Item>项目信息详情</Breadcrumb.Item>
            </Breadcrumb>
          )
        }
        extra={isIframe ? '' : <Button onClick={this.handleBackPage}>取消</Button>}
      >
        <div
          style={{
            height: 'calc(100vh - 210px)',
            overflowY: 'auto',
          }}
        >
          <Form {...layout}>
            <div
              style={{
                display: pageInfo.terminationDate ? 'block' : 'none',
              }}
            >
              <div style={{ paddingBottom: '10px', color: '#333', fontSize: '16px' }}>终止原因</div>
              <Row>
                <Col>
                  <Form.Item label="终止原因:" labelCol={{ span: 3 }} wrapperCol={{ span: 21 }}>
                    <TextArea
                      rows={4}
                      allowClear
                      autoSize={{ minRows: 3, maxRows: 6 }}
                      value={pageInfo.terminationReason}
                      disabled
                    />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="终止日期">
                    <Input value={this.formatDate(pageInfo.terminationDate)} disabled />
                  </Form.Item>
                </Col>
              </Row>
            </div>
            <div style={{ paddingBottom: '10px', color: '#333', fontSize: '16px' }}>系列信息</div>
            <Row>
              <Col span={8}>
                <Form.Item label="系列名称:">
                  <Input value={pageInfo.seriesName} disabled />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="系列编号:">
                  <Input value={pageInfo.seriesCode} disabled />
                </Form.Item>
              </Col>
            </Row>
            <div style={{ padding: '10px 0', color: '#333', fontSize: '16px' }}>项目信息</div>
            <Row>
              <Col span={8}>
                <Form.Item label="项目编码:">
                  <Input value={pageInfo.proCode} disabled />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="项目名称:">
                  <Input value={pageInfo.proName} disabled />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="项目简称:">
                  <Input value={pageInfo.proShortName} disabled />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="项目类型:">
                  {getFieldDecorator('proType', {
                    initialValue: `${pageInfo.proType}`,
                  })(
                    <Select placeholder="请选择" showArrow disabled>
                      {proTypeList &&
                        proTypeList.map(item => (
                          <Option key={item.code} value={item.code}>
                            {item.name}
                          </Option>
                        ))}
                    </Select>,
                  )}
                </Form.Item>
              </Col>
              {/* <Col span={8}>
                  <Form.Item name="otherProType" label="其他项目类型:">
                    <Input value={pageInfo.otherProType} disabled />
                  </Form.Item>
                </Col> */}
              <Col span={8}>
                <Form.Item label="项目区域:">
                  {getFieldDecorator('proArea', {
                    initialValue: `${pageInfo.proArea}`,
                  })(
                    <Select placeholder="请选择" disabled={true}>
                      {proLocaList &&
                        proLocaList.map(item => (
                          <Option key={item.code} value={item.code}>
                            {item.name}
                          </Option>
                        ))}
                    </Select>,
                  )}
                </Form.Item>
              </Col>
              <Col
                span={8}
                style={{ display: pageInfo.proArea === '900000' ? 'inline-block' : 'none' }}
              >
                <Form.Item label="境外区域名称:">
                  <Input value={pageInfo.overseasProArea} disabled />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="项目期次:">
                  <Input value={pageInfo.productPeriod} disabled />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="所属部门:">
                  <Input value={pageInfo.proDept} disabled />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="开始日期">
                  <Input value={this.formatDate(pageInfo.proCDate)} disabled />
                  {/* <DatePicker defaultValue={moment(pageInfo.proCDate)} disabled /> */}
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="项目分类:">
                  <Radio.Group value={pageInfo.proBusType} disabled>
                    <Radio value="1">管理人项目</Radio>
                    <Radio value="0">非管理人项目</Radio>
                  </Radio.Group>
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="是否招投标">
                  <Radio.Group name="biddingFlag" value={pageInfo.biddingFlag} disabled>
                    <Radio value={1}>是</Radio>
                    <Radio value={0}>否</Radio>
                  </Radio.Group>
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col>
                <Form.Item label="项目描述" labelCol={{ span: 3 }} wrapperCol={{ span: 21 }}>
                  <TextArea rows={4} allowClear value={pageInfo.proDesc} disabled />
                </Form.Item>
              </Col>
            </Row>
            {/* 客户信息：可增加多个 */}
            <CustomerInfoChildrenForm
              form={this.props.form}
              data={{
                idTypeList,
                proTradeList,
                proPlateList,
                moneyFormat: this.moneyFormat,
                capitalCurrencyList,
                pageInfo,
                dis: true,
              }}
            />
            <div
              style={{
                display:
                  pageInfo.proReportList && JSON.stringify(pageInfo.proReportList) !== '[]'
                    ? 'block'
                    : 'none',
                padding: '20px 0 10px',
                color: '#333',
                fontSize: '16px',
              }}
            >
              项目申报信息
            </div>
            <Table
              style={{
                display:
                  pageInfo.proReportList && JSON.stringify(pageInfo.proReportList) !== '[]'
                    ? 'block'
                    : 'none',
              }}
              columns={reportColumns}
              dataSource={pageInfo.proReportList}
              bordered
              pagination={false}
            />
            <div
              style={{
                display: pageInfo.publishTime ? 'block' : 'none',
                padding: '20px 0 10px',
                color: '#333',
                fontSize: '16px',
              }}
            >
              项目发行信息
            </div>
            <div
              style={{
                display: pageInfo.publishTime ? 'block' : 'none',
              }}
            >
              发行时间：{this.formatDate(pageInfo.publishTime)}
            </div>
            <div
              style={{
                display:
                  pageInfo.proPublishInfoList &&
                  JSON.stringify(pageInfo.proPublishInfoList) !== '[]'
                    ? 'block'
                    : 'none',
                padding: '20px 0 10px',
                color: '#333',
                fontSize: '16px',
              }}
            >
              上市/挂牌信息
            </div>
            <Table
              style={{
                display:
                  pageInfo.proPublishInfoList &&
                  JSON.stringify(pageInfo.proPublishInfoList) !== '[]'
                    ? 'block'
                    : 'none',
              }}
              columns={publishColumns}
              dataSource={pageInfo.proPublishInfoList}
              bordered
              pagination={false}
            />
            <div style={{ padding: '20px 0 10px', color: '#333', fontSize: '16px' }}>
              项目参与人
            </div>
            <Table
              columns={columns}
              dataSource={pageInfo.proParticipants}
              bordered
              pagination={false}
            />
            <div style={{ marginTop: 15, padding: '20px 0 10px', color: '#333', fontSize: '16px' }}>
              项目成员信息
            </div>
            <Table
              columns={memberColumn}
              scroll={{ x: 1300 }}
              dataSource={pageInfo.proMembers}
              bordered
              pagination={false}
            />
          </Form>
        </div>
      </Card>
    );
  }
}

const WrappedSingleForm = errorBoundary(
  linkHoc()(
    Form.create()(
      connect(({ router, addProjectInfo }) => ({ router, addProjectInfo }))(ProjectInfoDetail),
    ),
  ),
);
export default WrappedSingleForm;
