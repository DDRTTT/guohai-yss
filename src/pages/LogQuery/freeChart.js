/**
 * 日志详情
 */

import React, { Component } from 'react';
import { connect } from 'dva';
import {
  Button,
  Card,
  Col,
  DatePicker,
  Divider,
  Form,
  Input,
  Row,
  Select,
  Tag,
  Tooltip,
} from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { nsHoc } from '@/utils/hocUtil';
import { isEmptyObject } from '@/utils/utils';
import Moment from 'moment';
import { errorBoundary } from '@/layouts/ErrorBoundary';
import styles from './freeChart.less';

const { RangePicker } = DatePicker;
const FormItem = Form.Item;
const { TextArea } = Input;
const dateFormat = 'YYYY-MM-DD';
const { Option } = Select;

@errorBoundary
@nsHoc({ namespace: 'operationLog' })
@Form.create()
@connect(state => ({
  operationLog: state.operationLog,
}))
export default class freeChart extends Component {
  state = {
    formValues: {
      groupName1: '',
      groupName2: '',
      groupName3: '',
    },
  };

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

  handleSearch = e => {
    e.preventDefault();
    const { dispatch, form, namespace } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
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

  // 渲染下拉函数
  getforgtype = (e, type, name = 'name', code = 'code') => {
    const children = [];
    for (const key of e) {
      children.push(
        <Option key={key[code]} value={key[code]}>
          {key[name]}
        </Option>,
      );
    }
    return (
      <Select style={{ width: '100%' }} showSearch optionFilterProp="children">
        {children}
      </Select>
    );
  };

  // 不可选日期范围
  disabledDate = current => {
    return current && current > Moment().endOf('day');
  };

  // 表单
  renderAdvancedForm = () => {
    const {
      operationLog: { saveVocabularyDic },
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch}>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          维度一:
          <Col xs={24} md={24} sm={24}>
            <FormItem>
              {getFieldDecorator('groupName1', {
                rules: [{ required: true, message: '请选择维度一' }],
              })(this.getforgtype(saveVocabularyDic, '', 'name', 'code'))}
            </FormItem>
          </Col>
          <Divider dashed />
          维度二：
          <Col md={24} sm={24}>
            <FormItem>
              {getFieldDecorator('groupName2', {
                rules: [{ required: true, message: '请选择维度二' }],
              })(this.getforgtype(saveVocabularyDic, '', 'name', 'code'))}
            </FormItem>
          </Col>
          <Divider dashed />
          维度三：
          <Col md={24} sm={24}>
            <FormItem>
              {getFieldDecorator('groupName3')(
                this.getforgtype(saveVocabularyDic, '', 'name', 'code'),
              )}
            </FormItem>
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
              })(<RangePicker disabledDate={this.disabledDate} />)}
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
        </Row>
      </Form>
    );
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
      type: `operationLog/vocabularyDic`,
      payload: 'dimensionDic',
    });
  }

  render() {
    const {
      operationLog: { saveSearchgroupFreeChart, loading, saveVocabularyDic, saveGroup },
    } = this.props;
    const { groupName1, groupName2, groupName3 } = this.state.formValues;

    function f2(items) {
      let aaa;
      let bbb;
      let ccc;
      if (saveGroup && saveGroup[0] && saveGroup[0].groupName && !isEmptyObject(items)) {
        aaa = items[saveGroup[0].groupName].buckets.map((item, index) => {
          if (saveGroup[1] && ssaveGroup[1].groupName && item[saveGroup[1].groupName]) {
            const items = item[saveGroup[1].groupName].buckets;
            bbb = items.map((itemz, index) => {
              if (
                !isEmptyObject(saveGroup[2]) &&
                saveGroup[2].groupName &&
                itemz[saveGroup[2].groupName]
              ) {
                const it = itemz[saveGroup[2].groupName].buckets;
                ccc = it.map((items, index) => {
                  return (
                    <tr key={index}>
                      <td width="200" style={{ borderTop: 'none', borderLeft: 'none' }}>
                        <Tooltip title={items.key}>
                          <span className={styles.ellipsis}>{items.key}</span>
                        </Tooltip>
                      </td>
                      <td width="50" style={{ borderTop: 'none', borderLeft: 'none' }}>
                        {items.doc_count}
                      </td>
                    </tr>
                  );
                });
                return (
                  <tr key={index}>
                    <td width="200" style={{ borderTop: 'none', borderLeft: 'none' }}>
                      <Tooltip title={itemz.key}>
                        <span className={styles.ellipsis}>{itemz.key}</span>
                      </Tooltip>
                    </td>
                    {ccc}
                  </tr>
                );
              }
              return (
                <tr key={index}>
                  <td width="200" style={{ borderTop: 'none', borderLeft: 'none' }}>
                    <Tooltip title={itemz.key}>
                      <span className={styles.ellipsis}>{itemz.key}</span>
                    </Tooltip>
                  </td>
                  <td width="50" style={{ borderTop: 'none', borderLeft: 'none' }}>
                    {itemz.doc_count}
                  </td>
                </tr>
              );
            });
            return (
              <tr key={index}>
                <td style={{ borderTop: 'none' }}>
                  <Tooltip title={item.key}>
                    <span className={styles.ellipsis}>{item.key}</span>
                  </Tooltip>
                </td>
                {bbb}
              </tr>
            );
          }
          return (
            <tr key={index}>
              <td width="200" style={{ borderTop: 'none' }}>
                <Tooltip title={item.key}>
                  <span className={styles.ellipsis}>{item.key}</span>
                </Tooltip>
              </td>
              {bbb}
            </tr>
          );
        });
      }
      return [
        <tr>
          <thead style={{ textAlign: 'center' }}>
            <tr style={{ background: '#f2f2f2' }}>
              {saveGroup && saveGroup[0] && saveGroup[0].groupName ? (
                <td width="200" style={{ border: '1px solid #CCC', borderRight: 'none' }}>
                  {saveGroup[0].groupName}
                </td>
              ) : (
                ''
              )}
              <tr>
                {saveGroup && saveGroup[1] && saveGroup[1].groupName ? (
                  <td width="200" style={{ border: '1px solid #CCC', borderRight: 'none' }}>
                    {saveGroup[1].groupName}
                  </td>
                ) : (
                  ''
                )}
                {saveGroup && saveGroup[2] && saveGroup[2].groupName ? (
                  <td width="200" style={{ border: '1px solid #CCC', borderRight: 'none' }}>
                    {saveGroup[2].groupName}
                  </td>
                ) : (
                  ''
                )}
                {(saveGroup && saveGroup[0] && saveGroup[0].groupName) ||
                (saveGroup && saveGroup[1] && saveGroup[1].groupName) ||
                (saveGroup && saveGroup[2] && saveGroup[2].groupName) ? (
                  <td width="50" style={{ border: '1px solid #CCC' }}>
                    数量
                  </td>
                ) : (
                  ''
                )}
              </tr>
            </tr>
          </thead>
          <tbody style={{ textAlign: 'center' }}>{aaa}</tbody>
        </tr>,
      ];
    }

    return (
      <PageHeaderWrapper father_url="/LogQuery/operationLog">
        <div style={{ marginTop: 24, marginBottom: 24 }} className={styles.freeChart}>
          <Row gutter={24}>
            <Col xl={12} lg={24} md={24} sm={24} xs={24}>
              <div className={styles.head}>图表</div>
              <Card loading={loading} bordered={false}>
                <div style={{ minHeight: '200' }}>
                  <table border="1" cellSpacing="0" cellPadding="0" style={{ margin: '20px auto' }}>
                    {f2(saveSearchgroupFreeChart)}
                  </table>
                </div>
              </Card>
            </Col>

            <Col xl={12} lg={24} md={24} sm={24} xs={24}>
              <Card bordered={false}>
                <div>
                  <div className={styles.head}>图表数据配置</div>
                  <div style={{ display: 'flex' }}>
                    <div className={styles.flexLeft}>{this.renderAdvancedForm()}</div>
                    <div style={{ flex: 1, background: '#f1f1f1' }} className={styles.flexRight}>
                      <div className={styles.freehead}>可配置模块</div>
                      {this.handleTag(saveVocabularyDic)}
                    </div>
                  </div>
                </div>
              </Card>
            </Col>
          </Row>
        </div>
      </PageHeaderWrapper>
    );
  }
}
