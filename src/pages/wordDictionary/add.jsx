import React, { Component } from 'react';
import { PageContainers } from '@/components';
import { Card, Steps, Form, Input, Button, Row, Col } from 'antd';
import styles from './index.less';
import { errorBoundary } from '@/layouts/ErrorBoundary';
import { router } from 'umi';
import { connect } from 'dva';
import TwoStep from './Twostep';
import { cloneDeep } from 'lodash';

const FormItem = Form.Item;
const { Step } = Steps;
const { TextArea } = Input;

// 判断数组是否重复 有重复返回false 没有重复返回true
const isRepeat = arr => {
  const hash = {};
  for (const i in arr) {
    if (hash[arr[i]]) {
      return false;
    }
    hash[arr[i]] = true;
  }
  return true;
};

const steps = [
  {
    title: '编辑基本信息',
    content: '1',
  },
  {
    title: '编辑字典词汇',
    content: '2',
  },
];

@errorBoundary
@Form.create()
@connect(({ wordDictionary, loading }) => ({
  wordDictionary,
  loading: loading.effects['wordDictionary/addWord'],
}))
export default class Index extends Component {
  state = {
    current: 0,
    formValue: {},
  };
  tableData = [];

  //   表格添加数据的回调
  updataDataSourceHandler = value => {
    this.tableData = value;
  };

  //   第一步展示的组件
  firstStep = () => {
    const {
      form: { getFieldDecorator },
    } = this.props;
    // 反显第一步的数据
    const { formValue = {} } = this.state;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 10 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 14 },
      },
    };
    return (
      <div>
        <Form {...formItemLayout}>
          <Row>
            <Col md={24} sm={24}>
              <FormItem label="字典代码">
                {getFieldDecorator('code', {
                  initialValue: formValue.code,
                  rules: [{ required: true, message: '请输入字典代码', whitespace: true }],
                })(<Input placeholder="请输入" style={{ width: 320 }} />)}
              </FormItem>
            </Col>
            <Col md={24} sm={24}>
              <FormItem label="字典名称">
                {getFieldDecorator('name', {
                  initialValue: formValue.name,
                  rules: [{ required: true, message: '请输入字典名称', whitespace: true }],
                })(<Input placeholder="请输入" style={{ width: 320 }} />)}
              </FormItem>
            </Col>
            <Col md={24} sm={24}>
              <FormItem label="描述信息">
                {getFieldDecorator('remark', {
                  initialValue: formValue.remark,
                  rules: [{ whitespace: true }, { validator: this.handleRemarkValidator }],
                })(<TextArea style={{ width: 320 }} className={styles.likeInput} />)}
              </FormItem>
            </Col>
          </Row>
        </Form>
      </div>
    );
  };
  // 第二部展示的组件
  secondStep = () => {
    return (
      <div>
        <TwoStep isEdit updataDataSource={this.updataDataSourceHandler} />
      </div>
    );
  };

  save = () => {
    const { formValue } = this.state;
    const replaceList = [];
    if (this.tableData.length === 0) {
      message.warn('字典数据不能为空');
      return;
    }
    this.tableData.forEach(index => {
      if (index.code.length == 0 || index.code == '-') {
        message.warn('请输入字典代码');
        return;
      }
      if (index.name.length == 0 || index.name == '-') {
        message.warn('请输入字典名称');
        return;
      }
      replaceList.push(index.code);
    });

    if (!isRepeat(replaceList)) {
      message.warn('有重复数据');
      return;
    }
    const tempData = cloneDeep(this.tableData);
    tempData.map(item => {
      delete item.id;
    });
    this.props.dispatch({
      type: 'wordDictionary/addWord',
      payload: {
        ...formValue,
        datadict: tempData,
      },
    });
  };

  next = () => {
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.setState(
          {
            formValue: { ...values },
          },
          () => {
            const current = this.state.current + 1;
            this.setState({ current });
          },
        );
      }
    });
  };
  prev = () => {
    const current = this.state.current - 1;
    this.setState({ current });
  };

  //   取消
  cancelHandler = () => {
    router.goBack();
  };

  render() {
    const { current } = this.state;
    const { loading } = this.props;
    return (
      <PageContainers
        breadcrumb={[
          {
            title: '系统运营管理',
            url: '',
          },
          {
            title: '词汇字典',
            url: '/base/wordDictionary',
          },
          {
            title: '新增',
            url: '',
          },
        ]}
      >
        <Card bordered={false} style={{ marginTop: 14 }}>
          <Steps current={current}>
            {steps.map(item => (
              <Step key={item.title} title={item.title} />
            ))}
          </Steps>

          {/* 表格组 */}
          <div className={styles.stepContent}>
            {steps[current].content === '1' ? this.firstStep() : this.secondStep()}
          </div>

          <div style={{ bottom: 20, textAlign: 'right' }}>
            {current < steps.length - 1 && (
              <Button
                type="primary"
                onClick={() => {
                  this.next();
                }}
                style={{ marginRight: 10 }}
              >
                下一步
              </Button>
            )}
            {current > 0 && (
              <Button style={{ marginRight: 10, textAlign: 'right' }} onClick={this.prev}>
                上一步
              </Button>
            )}
            {current === steps.length - 1 && (
              <Button
                type="primary"
                onClick={this.save}
                style={{ marginRight: 10 }}
                disabled={!!loading}
              >
                保存
              </Button>
            )}
            <Button onClick={this.cancelHandler}>取消</Button>
          </div>
        </Card>
      </PageContainers>
    );
  }
}
