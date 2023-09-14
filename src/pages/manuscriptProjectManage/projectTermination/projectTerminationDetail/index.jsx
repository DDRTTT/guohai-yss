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
  Divider,
  Popover,
  InputNumber,
} from 'antd';
const { TextArea } = Input;
import moment from 'moment';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import router from 'umi/router';
import { errorBoundary } from '@/layouts/ErrorBoundary';
import Action, { linkHoc } from '@/utils/hocUtil';

const FormItem = Form.Item;
const { Option } = Select;
const { Search } = Input;
const { RangePicker } = DatePicker;
const ButtonGroup = Button.Group;

@Form.create()
class ProjectTerminationDetail extends Component {
  state = {
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
        align: 'center',
        width: 240,
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
        title: '发行日期',
        width: 140,
        dataIndex: 'issueTime',
        align: 'center',
        render: issueTime => <span>{this.formatDate(issueTime)}</span>,
      },
    ],
  };
  componentDidMount() {
    if (document.getElementsByClassName('ant-layout')) {
      document.getElementsByClassName('ant-layout')[2].scrollTop = 0;
    }
    this.props.dispatch({
      type: 'projectTerminationDetail/getPageInfo',
      payload: {
        proCode: window.location.href.split('=')[1],
      },
    });
  }

  /**
   * 格式化日期
   * @param {时间} date
   */
  formatDate(date) {
    if (date) {
      return date.slice(0, 10);
    }
    return '';
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
  render() {
    const { pageInfo } = this.props.projectTerminationDetail;
    const { getFieldDecorator } = this.props.form;
    const { reportColumns, publishColumns } = this.state;
    const layout = {
      labelAlign: 'right',
      labelCol: { span: 9 },
      wrapperCol: { span: 15 },
    };

    const columns = [
      {
        key: 'proRole',
        title: '参与人类型',
        dataIndex: 'proRole',
        width: 200,
        align: 'center',
        render: (proRole, record) => <span>{record.proRoleName}</span>,
      },
      {
        key: 'membeName',
        title: '参与人名称',
        dataIndex: 'membeName',
        width: 200,
        align: 'center',
        render: (membeName, record) => <span>{membeName}</span>,
      },
    ];
    const memberColumn = [
      {
        key: 'membeName',
        title: '姓名',
        dataIndex: 'membeName',
        width: 150,
        align: 'center',
        render: (membeName, record) => <span>{membeName}</span>,
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
        render: (idType, record) => <span>{record.idTypeName}</span>,
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
        align: 'center',
        render: (department, record) => <span>{department}</span>,
      },
      {
        key: 'job',
        title: '职位',
        dataIndex: 'job',
        width: 200,
        align: 'center',
        render: (job, record) => <span>{job}</span>,
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
        render: (remark, record) => <span>{remark}</span>,
      },
    ];
    return (
      <>
        <Card
          style={{
            marginBottom: 10,
          }}
        >
          <Row gutter={24}>
            <Col span={12}>
              <span style={{ color: 'rgba(149, 163, 187, 1)' }}>项目管理</span> /
              <span style={{ color: 'rgba(71,75,91,1)' }}> 项目终止详情</span>
            </Col>
            <Col span={12}>
              <Button
                style={{ float: 'right' }}
                onClick={() => {
                  router.go(-1);
                }}
              >
                取消
              </Button>
            </Col>
          </Row>
        </Card>
        <Card
          style={{
            height: 'calc(100vh - 210px)',
            overflowY: 'auto',
          }}
        >
          <Form {...layout}>
            <div style={{ padding: '20px 0 10px', color: '#333', fontSize: '16px' }}>项目信息</div>
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
                  <Input value={pageInfo.proTypeName} disabled />
                </Form.Item>
              </Col>
              {/* <Col span={8}>
                <Form.Item name="otherProType" label="其他项目类型:">
                  <Input value={pageInfo.otherProType} disabled />
                </Form.Item>
              </Col> */}
              <Col span={8}>
                <Form.Item label="项目区域:">
                  <Input value={pageInfo.proAreaName} disabled />
                </Form.Item>
              </Col>
            </Row>
            <Row>
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
                <Form.Item name="proDept" label="所属部门:">
                  <Input value={pageInfo.proDept} disabled />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name="proCDate" label="开始日期">
                  <Input value={this.formatDate(pageInfo.proCDate)} disabled />
                  {/* <DatePicker
                    defaultValue={
                      pageInfo.proCDate ? moment(this.formatDate(pageInfo.proCDate)) : ''
                    }
                    disabled
                  /> */}
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
              <Col span={24}>
                <Form.Item label="项目描述" labelCol={{ span: 3 }} wrapperCol={{ span: 21 }}>
                  <TextArea rows={4} allowClear value={pageInfo.proDesc} disabled />
                </Form.Item>
              </Col>
            </Row>
            <div style={{ padding: '20px 0 10px', color: '#333', fontSize: '16px' }}>终止原因</div>
            <Row>
              <Col span={8}>
                <Form.Item label="终止日期">
                  <Input value={this.formatDate(pageInfo.terminationDate)} disabled />
                  {/* <DatePicker
                    defaultValue={
                      pageInfo.terminationDate
                        ? moment(this.formatDate(pageInfo.terminationDate))
                        : ''
                    }
                    disabled
                  /> */}
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item label="终止原因" labelCol={{ span: 3 }} wrapperCol={{ span: 21 }}>
                  <TextArea rows={4} allowClear value={pageInfo.terminationReason} disabled />
                </Form.Item>
              </Col>
            </Row>
            <div style={{ padding: '20px 0 10px', color: '#333', fontSize: '16px' }}>客户信息</div>
            <Row>
              <Col span={8}>
                <Form.Item label="客户名称:">
                  <Input value={pageInfo.customerName} disabled />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="客户简称:">
                  <Input value={pageInfo.customerShortName} disabled />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="客户类型:">
                  <Radio.Group value={pageInfo.customerType} disabled>
                    <Radio value="1">机构</Radio>
                    <Radio value="0">自然人</Radio>
                  </Radio.Group>
                </Form.Item>
              </Col>
            </Row>
            <div style={{ display: pageInfo.customerType === '1' ? 'block' : 'none' }}>
              <Row>
                <Col span={8}>
                  <Form.Item label="统一社会信用代码:">
                    <Input value={pageInfo.customerCode} disabled />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="所属行业:">
                    <Input value={pageInfo.industryInvolvedName} disabled />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="成立时间">
                    <Input value={this.formatDate(pageInfo.setUpTime)} disabled />

                    {/* <DatePicker
                      defaultValue={
                        pageInfo.setUpTime
                          ? moment(this.formatDate(pageInfo.setUpTime), 'YYYY-MM-DD')
                          : ''
                      }
                      disabled
                    /> */}
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col span={8}>
                  <Form.Item label="上市板块:">
                    <Input value={pageInfo.publicSectorName} disabled />
                  </Form.Item>
                </Col>
                <Col
                  span={8}
                  style={{ display: pageInfo.publicSector !== '1006' ? 'inline-block' : 'none' }}
                >
                  <Form.Item label="上市时间">
                    <Input value={this.formatDate(pageInfo.publicTime)} disabled />
                    {/* <DatePicker
                      defaultValue={
                        pageInfo.publicTime
                          ? moment(this.formatDate(pageInfo.publicTime), 'YYYY-MM-DD')
                          : ''
                      }
                      disabled
                    /> */}
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="法人代表:">
                    <Input value={pageInfo.legalRepresentative} disabled />
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col span={8}>
                  <Form.Item label="注册资本(万):">
                    {/* <Input value={this.moneyFormat(pageInfo.registeredCapital)} disabled /> */}
                    <InputNumber
                      style={{ width: '100%' }}
                      formatter={value => this.moneyFormat(value)}
                      parser={value => value.replace(/\$\s?|(,*)/g, '')}
                      value={pageInfo.registeredCapital}
                      disabled
                    />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="币种:">
                    <Input value={pageInfo.registeredCapitalCurrencyName} disabled />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="联系人:">
                    <Input value={pageInfo.contact} disabled />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="联系电话:">
                    <Input value={pageInfo.contactNumber} disabled />
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item label="经营范围:" labelCol={{ span: 3 }} wrapperCol={{ span: 21 }}>
                    <TextArea
                      rows={4}
                      value={pageInfo.businessScope}
                      disabled
                      allowClear
                      autoSize={{ minRows: 3, maxRows: 6 }}
                    />
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item label="备注:" labelCol={{ span: 3 }} wrapperCol={{ span: 21 }}>
                    <TextArea
                      rows={4}
                      value={pageInfo.remark}
                      disabled
                      allowClear
                      autoSize={{ minRows: 3, maxRows: 6 }}
                    />
                  </Form.Item>
                </Col>
              </Row>
            </div>
            <div style={{ display: pageInfo.customerType === '1' ? 'none' : 'block' }}>
              <Row>
                <Col span={8}>
                  <Form.Item label="证件类型:">
                    <Input value={pageInfo.idTypeName} disabled />
                  </Form.Item>
                </Col>
                <Col
                  span={8}
                  style={{ display: pageInfo.idType === '1007' ? 'inline-block' : 'none' }}
                >
                  <Form.Item label="其他证件类型:">
                    <Input value={pageInfo.otherIdType} disabled />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="证件号码:">
                    <Input value={pageInfo.idNumber} disabled />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="性别:">
                    <Input
                      value={pageInfo.sex ? (pageInfo.sex === '0' ? '男' : '女') : ''}
                      disabled
                    />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="邮箱:">
                    <Input value={pageInfo.email} disabled />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="联系电话:">
                    <Input value={pageInfo.contactNumber} disabled />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="备注:">
                    <Input value={pageInfo.remark} disabled />
                  </Form.Item>
                </Col>
              </Row>
            </div>
            <div style={{ padding: '20px 0 10px', color: '#333', fontSize: '16px' }}>
              项目申报信息
            </div>
            <Table
              columns={reportColumns}
              dataSource={pageInfo.proReportList}
              bordered
              pagination={false}
            />
            <div style={{ padding: '20px 0 10px', color: '#333', fontSize: '16px' }}>
              项目发行信息
            </div>
            <Table
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
        </Card>
      </>
    );
  }
}

const WrappedSingleForm = errorBoundary(
  linkHoc()(
    Form.create()(
      connect(({ projectTerminationDetail, loading }) => ({
        projectTerminationDetail,
        loading: loading.effects['projectTerminationDetail/searchTableData'],
      }))(ProjectTerminationDetail),
    ),
  ),
);
export default WrappedSingleForm;
