/**
 * 操作日志
 */

import React, { Component } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Button, Card, Col, DatePicker, Form, Radio, Row, Spin, Table } from 'antd';
import Moment from 'moment';
import Action from '@/utils/hocUtil';
import { getDateStr } from '@/utils/utils';
import styles from './operationLog.less';
import { errorBoundary } from '@/layouts/ErrorBoundary';

const FormItem = Form.Item;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const { RangePicker } = DatePicker;

const dateFormat = 'YYYY-MM-DD';

@errorBoundary
@Form.create()
@connect(state => ({
  operationLog: state.operationLog,
}))
export default class operationLog extends Component {
  state = {
    dimensionValue: '',
    startDate: getDateStr(-7),
    endDate: getDateStr(0),
    value: 'weekday',
  };

  handleMiddle = date => {
    const {
      dispatch,
      operationLog: { saveDimensionChild, saveDimensionDicCode },
    } = this.props;

    this.setState({
      startDate: date.startDate,
      endDate: date.endDate,
    });

    // 模块操作总数量统计
    dispatch({
      type: `operationLog/fetchStatislog`,
      payload: {
        ...date,
        group: [
          {
            groupName: 'count',
          },
          {
            groupName: 'service',
          },
          {
            groupName: 'userId',
          },
          {
            groupName: 'type',
          },
        ],
      },
    });

    // tabel
    const values = {
      ...date,
      group: [
        {
          groupName: 'service',
          groupLeve: 1,
        },
      ],
    };
    this.handleTableOrder(values);

    const vals = {
      ...date,
      attrName: saveDimensionDicCode,
      group: saveDimensionChild,
    };
    // Line
    this.handLine(vals);
    // Pie
    this.handlePie(vals);
  };

  // Radio-onChange Date
  RadioGroupOnChange = e => {
    const { value } = e.target;
    let val;
    switch (value) {
      case 'today':
        val = {
          startDate: getDateStr(0),
          endDate: getDateStr(0),
        };
        break;
      case 'yesterday':
        val = {
          startDate: getDateStr(-1),
          endDate: getDateStr(-1),
        };
        break;
      case 'weekday':
        val = {
          startDate: getDateStr(-7),
          endDate: getDateStr(0),
        };
        break;
      case 'monthday':
        val = {
          startDate: getDateStr(-30),
          endDate: getDateStr(0),
        };
        break;
      default:
    }
    const date = {
      startDate: val.startDate,
      endDate: val.endDate,
    };

    this.setState({
      value,
    });

    this.handleMiddle(date, value, val);
  };

  // 头部
  header = () => {
    const {
      operationLog: { loading },
    } = this.props;

    const { startDate } = this.state;
    const { endDate } = this.state;

    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={3} sm={24}>
            快速查看
          </Col>
          <Col md={7} sm={24}>
            <Spin spinning={loading}>
              <Action key="operationLog:query" code="operationLog:query">
                <RadioGroup value={this.state.value} onChange={this.RadioGroupOnChange}>
                  <RadioButton value="today">今日</RadioButton>
                  <RadioButton value="yesterday">昨日</RadioButton>
                  <RadioButton value="weekday">近七日</RadioButton>
                  <RadioButton value="monthday">近30日</RadioButton>
                </RadioGroup>
              </Action>
            </Spin>
          </Col>
          <Col md={7} sm={24}>
            <FormItem label="选择日期">
              <RangePicker
                onChange={this.RangePickerOnChange}
                disabledDate={this.disabledDate}
                value={[Moment(startDate, dateFormat), Moment(endDate, dateFormat)]}
              />
            </FormItem>
          </Col>
          <Col md={7} sm={24}>
            <Button
              type="primary"
              htmlType="submit"
              style={{ width: 86, height: 26, float: 'right' }}
              onClick={this.jumpPage}
            >
              自由图标
            </Button>
          </Col>
        </Row>
      </Form>
    );
  };

  // 跳转
  jumpPage = () => {
    const { dispatch } = this.props;
    dispatch(routerRedux.push('/LogQuery/freeChart'));
  };

  // RangePicker-onChange["2018-11-02", "2018-11-02"]
  RangePickerOnChange = (date, dateString) => {
    const par = {
      startDate: dateString[0],
      endDate: dateString[1],
    };
    this.setState({
      ...par,
      value: '',
    });
    this.handleMiddle(par);
  };

  // 跳转
  handleToDetail = () => {
    const { dispatch } = this.props;
    const { startDate, endDate } = this.state;
    const logDate = {
      startDate,
      endDate,
    };

    sessionStorage.setItem('logDate', JSON.stringify(logDate));
    dispatch(routerRedux.push('/LogQuery/logList'));
  };

  // 存储维度
  handleRadioDimensionChange = e => {
    const {
      dispatch,
      operationLog: { saveDimensionChild },
    } = this.props;
    const dimensionValue = e.target.value;
    this.setState({
      dimensionValue,
    });
    const date = {
      startDate: this.state.startDate,
      endDate: this.state.endDate,
    };

    const val = {
      ...date,
      group: [
        {
          groupName: dimensionValue,
          groupLeve: 1,
        },
      ],
    };

    // 维度子集
    dispatch({
      type: `operationLog/searchgroup`,
      payload: val,
    });

    const vals = {
      ...date,
      attrName: dimensionValue,
      group: saveDimensionChild,
    };
    // Line
    this.handLine(vals);
    // Pie
    this.handlePie(vals);
  };

  // 维度选择
  dimensionItem = () => {
    const {
      operationLog: { saveDimensionDic, saveDimensionDicCode },
    } = this.props;

    const ads = saveDimensionDicCode || this.state.dimensionValue;
    const radioItem = saveDimensionDic.map((item, index) => {
      return (
        <RadioButton key={index} value={item.code}>
          {item.name}
        </RadioButton>
      );
    });
    return (
      <Action key="operationLog:query" code="operationLog:query">
        <RadioGroup onChange={this.handleRadioDimensionChange} value={ads}>
          {radioItem}
        </RadioGroup>
      </Action>
    );
  };

  // 不可选日期范围
  disabledDate = current => {
    return current && current > Moment().endOf('day');
  };

  // 模块操作总数量统计
  handleStatislog = item => {
    return (
      <div
        style={{ display: 'flex', justifyContent: 'space-between', marginTop: 24 }}
        onClick={this.handleToDetail}
      >
        <div className={styles.cardBox}>
          <p className={styles.title}>总访问量</p>
          <p className={styles.num}>{item.count}</p>
        </div>
        <div className={styles.cardBox}>
          <p className={styles.title}>操作服务模块</p>
          <p className={styles.num}>{item.service}</p>
        </div>
        <div className={styles.cardBox}>
          <p className={styles.title}>操作人数</p>
          <p className={styles.num}>{item.userId}</p>
        </div>
        <div className={styles.cardBox}>
          <p className={styles.title}>操作类型</p>
          <p className={styles.num}>{item.type}</p>
        </div>
      </div>
    );
  };

  // table
  handleTableOrder = parameter => {
    const { dispatch } = this.props;
    dispatch({
      type: 'operationLog/searchgroup2',
      payload: parameter,
    });
  };

  // Pie
  handlePie = parameter => {
    const { dispatch } = this.props;
    // table
    dispatch({
      type: 'operationLog/fetchPieChart',
      payload: parameter,
    });
  };

  // Line
  handLine = parameter => {
    const { dispatch } = this.props;
    // table
    dispatch({
      type: 'operationLog/fetchLineChart',
      payload: parameter,
    });
  };

  componentDidMount = () => {
    const { dispatch } = this.props;
    const val = {
      startDate: getDateStr(-7),
      endDate: getDateStr(0),
    };

    // 维度 - 词汇字典
    dispatch({
      type: `operationLog/dimensionDic`,
      payload: 'dimensionDic',
    });

    // 数量--------------------------------------
    const par = {
      ...val,
      group: [
        {
          groupName: 'count',
        },
        {
          groupName: 'service',
        },
        {
          groupName: 'userId',
        },
        {
          groupName: 'type',
        },
      ],
    };
    dispatch({
      type: `operationLog/fetchStatislog`,
      payload: par,
    });

    // table---------------------------------------
    const value = {
      startDate: getDateStr(-7),
      endDate: getDateStr(0),
      group: [
        {
          groupName: 'serviceName',
          groupLeve: 1,
        },
      ],
    };
    this.handleTableOrder(value);
  };

  render() {
    const {
      operationLog: { saveStatislog, saveSearchGroup, loading },
    } = this.props;

    const columns = [
      // {
      //   title: '排名',
      //   dataIndex: 'order',
      //   key: 'order',
      // },
      {
        title: '项目',
        dataIndex: 'key',
        key: 'key',
        render: text => <a>{text}</a>,
        align: 'center',
      },
      {
        title: '次数',
        dataIndex: 'doc_count',
        key: 'doc_count',
        align: 'right',
      },
    ];

    return (
      <div>
        <Card bordered={false} title="操作日志" style={{ minHeight: 50 }}></Card>

        {this.handleStatislog(saveStatislog)}

        <div style={{ marginTop: 24, marginBottom: 24 }}>
          <Card
            loading={loading}
            className={styles.salesCard}
            bordered={false}
            bodyStyle={{ padding: 24 }}
            style={{ marginTop: 24, minHeight: 500 }}
          >
            <div>
              维度选择：
              {this.dimensionItem()}
            </div>
          </Card>
          <Row gutter={24}>
            <Col xl={12} lg={24} md={24} sm={24} xs={24}>
              <Card
                loading={loading}
                className={styles.salesCard}
                bordered={false}
                title="操作设备"
                bodyStyle={{ padding: 24 }}
                style={{ marginTop: 24, minHeight: 500 }}
              ></Card>
            </Col>

            <Col xl={12} lg={24} md={24} sm={24} xs={24}>
              <Card loading={loading} bordered={false} title="服务模块" style={{ marginTop: 24 }}>
                <Table
                  rowKey={record => record.index}
                  size="small"
                  columns={columns}
                  dataSource={saveSearchGroup.rows}
                  pagination={false}
                />
              </Card>
            </Col>
          </Row>
        </div>
      </div>
    );
  }
}
