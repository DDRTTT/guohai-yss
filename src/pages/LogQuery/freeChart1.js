/**
 * 日志详情
 */

import React, { Component } from 'react';
import { connect } from 'dva';
import { Button, Card, Col, DatePicker, Divider, Form, Input, Row, Tag } from 'antd';
import { DragDropContext, DragSource, DropTarget } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import styles from './freeChart.less';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import { nsHoc } from '../../utils/hocUtil';
// import update from 'immutability-helper';

const { RangePicker } = DatePicker;
const FormItem = Form.Item;
const { TextArea } = Input;
const dateFormat = 'YYYY-MM-DD';

function dragDirection(
  dragIndex,
  hoverIndex,
  initialClientOffset,
  clientOffset,
  sourceClientOffset,
) {
  const hoverMiddleY = (initialClientOffset.y - sourceClientOffset.y) / 2;
  const hoverClientY = clientOffset.y - sourceClientOffset.y;
  if (dragIndex < hoverIndex && hoverClientY > hoverMiddleY) {
    return 'downward';
  }
  if (dragIndex > hoverIndex && hoverClientY < hoverMiddleY) {
    return 'upward';
  }
}

class BodyRow extends React.Component {
  handleTag = item => {
    const items = item.map((item, index) => {
      return (
        <Tag key={index} value={item.code}>
          {item.name}
        </Tag>
      );
    });
    return <div>{items}</div>;
  };

  render() {
    const {
      isOver,
      connectDragSource,
      connectDropTarget,
      moveRow,
      dragRow,
      clientOffset,
      sourceClientOffset,
      initialClientOffset,
      operationLog: { saveServiceModuleSelect },
      ...restProps
    } = this.props;
    const style = { ...restProps.style, cursor: 'move' };

    let { className } = restProps;
    if (isOver && initialClientOffset) {
      const direction = dragDirection(
        dragRow.index,
        restProps.index,
        initialClientOffset,
        clientOffset,
        sourceClientOffset,
      );
      if (direction === 'downward') {
        className += ' drop-over-downward';
      }
      if (direction === 'upward') {
        className += ' drop-over-upward';
      }
    }

    return connectDragSource(
      connectDropTarget(<div className={className}>{this.handleTag(saveServiceModuleSelect)}</div>),
    );
  }
}

const rowSource = {
  beginDrag(props) {
    return {
      index: props.index,
    };
  },
};

const rowTarget = {
  drop(props, monitor) {
    const dragIndex = monitor.getItem().index;
    const hoverIndex = props.index;

    // Don't replace items with themselves
    if (dragIndex === hoverIndex) {
      return;
    }

    // Time to actually perform the action
    props.moveRow(dragIndex, hoverIndex);

    // Note: we're mutating the monitor item here!
    // Generally it's better to avoid mutations,
    // but it's good here for the sake of performance
    // to avoid expensive index searches.
    monitor.getItem().index = hoverIndex;
  },
};

const DragableBodyRow = DropTarget('Text', rowTarget, (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver(),
  sourceClientOffset: monitor.getSourceClientOffset(),
}))(
  DragSource('Text', rowSource, (connect, monitor) => ({
    connectDragSource: connect.dragSource(),
    dragRow: monitor.getItem(),
    clientOffset: monitor.getClientOffset(),
    initialClientOffset: monitor.getInitialClientOffset(),
  }))(BodyRow),
);

@nsHoc({ namespace: 'operationLog' })
@Form.create()
@connect(state => ({
  operationLog: state.operationLog,
}))
class freeChart extends Component {
  state = {
    formValues: {
      groupName1: '',
      groupName2: '',
      groupName3: '',
    },
  };

  handleSearch = e => {
    e.preventDefault();
    const { dispatch, form, namespace } = this.props;
    form.validateFields((err, fieldsValue) => {
      console.log('fieldsValue', fieldsValue);
      // if (err) return;
      if (fieldsValue.date !== undefined) {
        fieldsValue.startDate = fieldsValue.date[0].format('YYYY-MM-DD');
        fieldsValue.endDate = fieldsValue.date[1].format('YYYY-MM-DD');
      }

      const values = {
        ...fieldsValue,
      };
      this.setState({
        formValues: values,
      });

      const group = [];
      if (fieldsValue.groupName1) {
        group.push({
          groupName: fieldsValue.groupName1,
          groupLeve: 1,
        });
      }
      if (fieldsValue.groupName2) {
        group.push({
          groupName: fieldsValue.groupName2,
          groupLeve: 2,
        });
      }
      if (fieldsValue.groupName3) {
        group.push({
          groupName: fieldsValue.groupName3,
          groupLeve: 3,
        });
      }

      const par = {
        startDate: fieldsValue.startDate,
        endDate: fieldsValue.endDate,
        group,
      };

      // console.log('par', par);

      dispatch({
        type: `${namespace}/searchgroupFreeChart`,
        payload: par,
      });
    });
  };

  handleFormResetForm = () => {
    const { form } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    });
  };

  componentDidMount() {
    const { dispatch } = this.props;

    const logTime = sessionStorage.getItem('logTime');
    const logId = sessionStorage.getItem('logId');

    const par = {
      id: logId,
      startTime: logTime,
    };

    dispatch({
      type: `operationLog/fetchLogDetails`,
      payload: par,
    });
    dispatch({
      type: `operationLog/serviceModuleSelect`,
      payload: 'dimensionDic',
    });
  }

  render() {
    const {
      operationLog: { saveSearchgroupFreeChart, loading, saveServiceModuleSelect },
      form: { getFieldDecorator },
    } = this.props;

    const {
      formValues: { groupName1, groupName2, groupName3 },
    } = this.state;

    return (
      <PageHeaderLayout father_url="/LogQuery/operationLog">
        <div style={{ marginTop: 24, marginBottom: 24 }} className={styles.freeChart}>
          <Row gutter={24}>
            <Col xl={12} lg={24} md={24} sm={24} xs={24}>
              <Card loading={loading} bordered={false} title="输入信息">
                <table border="1">
                  <thead>
                    <tr>
                      <th>服务模块</th>
                      <th>操作类型</th>
                      <th>用户</th>
                      <th>访问量</th>
                    </tr>
                  </thead>

                  {/*                  <tr>
                    <td rowSpan="4">系统登录</td>
                    <td rowSpan="2">登录</td>
                    <td>张三</td>
                    <td>111</td>
                  </tr>
                  <tr>
                    <td>李四</td>
                    <td>222</td>
                  </tr>

                  <tr>
                    <td rowSpan="2">登出</td>
                    <td>张三</td>
                    <td>333</td>
                  </tr>
                  <tr>
                    <td>李四</td>
                    <td>444</td>
                  </tr> */}

                  {/*                  <tr>
                    <td rowSpan="2">serviceName1</td>
                    <td rowSpan="2">swaggerApi1</td>
                    <td>鉴权接口1</td>
                    <td>11471</td>
                  </tr>
                  <tr>
                    <td>机构信息管理1</td>
                    <td>288</td>
                  </tr> */}
                  <tbody>
                    <tr>
                      <td rowSpan="4">swaggerApi2-1</td>
                      <td rowSpan="2">swaggerApi2-1</td>
                      <td>鉴权接口2-1</td>
                      <td>11471</td>
                    </tr>
                    <tr>
                      <td>机构信息管理2-1</td>
                      <td>288</td>
                    </tr>

                    <tr>
                      <td rowSpan="2">swaggerApi2-2</td>
                      <td>鉴权接口2-2</td>
                      <td>11471</td>
                    </tr>
                    <tr>
                      <td>机构信息管理2-2</td>
                      <td>288</td>
                    </tr>
                  </tbody>

                  <tbody>
                    <tr>
                      <td rowSpan="4">serviceName2</td>
                      <td rowSpan="2">swaggerApi2-1</td>
                      <td>鉴权接口2-1</td>
                      <td>11471</td>
                    </tr>
                    <tr>
                      <td>机构信息管理2-1</td>
                      <td>288</td>
                    </tr>

                    <tr>
                      <td rowSpan="2">swaggerApi2-2</td>
                      <td>鉴权接口2-2</td>
                      <td>11471</td>
                    </tr>
                    <tr>
                      <td>机构信息管理2-2</td>
                      <td>288</td>
                    </tr>
                  </tbody>
                </table>
              </Card>
            </Col>

            <Col xl={12} lg={24} md={24} sm={24} xs={24}>
              <Card
                // loading={loading}
                bordered={false}
                title=""
              >
                <div>
                  <div className={styles.head}>图表数据配置</div>
                  <div style={{ display: 'flex' }}>
                    <div className={styles.flexLeft}>
                      <Form onSubmit={this.handleSearch}>
                        维度一:
                        <Col xs={24} md={24} sm={24}>
                          <FormItem label="">{getFieldDecorator('groupName1')(<Input />)}</FormItem>
                        </Col>
                        <Divider dashed />
                        维度二：
                        <Col md={24} sm={24}>
                          <FormItem label="">{getFieldDecorator('groupName2')(<Input />)}</FormItem>
                        </Col>
                        <Divider dashed />
                        维度三：
                        <Col md={24} sm={24}>
                          <FormItem label="">{getFieldDecorator('groupName3')(<Input />)}</FormItem>
                        </Col>
                        <Divider dashed />
                        操作时间：
                        <Col md={24} sm={24}>
                          <FormItem label="">
                            {getFieldDecorator('date', {
                              // initialValue: [Moment(logDate['startDate'], dateFormat), Moment(logDate['endDate'], dateFormat)],
                              rules: [
                                {
                                  required: true,
                                  message: '请选择选择日期',
                                },
                              ],
                            })(<RangePicker />)}
                          </FormItem>
                        </Col>
                        <Divider dashed />
                        默认加载行数：
                        <Col md={24} sm={24}>
                          <FormItem label="">{getFieldDecorator('line')(<Input />)}</FormItem>
                        </Col>
                        <Col md={24} sm={24}>
                          <Button.Group>
                            <Button onClick={this.handleFormResetForm}>重置</Button>
                            <Button type="primary" htmlType="submit">
                              生成
                            </Button>
                          </Button.Group>
                        </Col>
                      </Form>
                    </div>
                    <div style={{ flex: 1, background: '#f1f1f1' }} className={styles.flexRight}>
                      <div className={styles.freehead}>可配置模块</div>
                      <DragableBodyRow {...this.props} />
                    </div>
                  </div>
                </div>
              </Card>
            </Col>
          </Row>
        </div>
      </PageHeaderLayout>
    );
  }
}

export default DragDropContext(HTML5Backend)(freeChart);
