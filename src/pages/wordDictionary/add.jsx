import React from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import { Button, Card, Col, Form, Input, message, Row, Steps } from 'antd';
import BaseCrudComponent from '@/components/BaseCrudComponent';
import { errorBoundary } from '@/layouts/ErrorBoundary';
import { handleValidator } from '@/utils/utils';
import styles from './index.less';
import TwoStep from './Twostep';
import { PageContainers } from '@/components';

const FormItem = Form.Item;
const { Step } = Steps;
const { TextArea } = Input;

@errorBoundary
@Form.create()
@connect(({ wordDictionary, loading }) => ({
  wordDictionary,
  loading: loading.effects['wordDictionary/addWord'],
}))
export default class TableList extends BaseCrudComponent {
  state = {
    current: 0,
    formValue: {},
    dataList: [],
  };

  componentWillReceiveProps(nextProps) {
    this.setState({
      dataList: nextProps.wordDictionary.newList,
    });
  }

  componentWillMount() {
    const { dispatch } = this.props;
    // 清空数据
    dispatch({
      type: 'wordDictionary/newList',
      payload: [],
    });
    dispatch({
      type: 'wordDictionary/forMoment',
      payload: [],
    });
  }

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

  handleRemarkValidator = (rule, value, callback) => {
    handleValidator(value, callback, 400, '描述信息长度过长');
  };

  firstStep = () => {
    const {
      form: { getFieldDecorator },
    } = this.props;
    // 反显第一步的数据
    const { formValue } = this.state;
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
        <Form {...formItemLayout} style={{paddingRight: 25}}>
          <Row>
            <Col md={8} sm={24}>
              <FormItem label="字典代码">
                {getFieldDecorator('code', {
                  initialValue: formValue.code,
                  rules: [{ required: true, message: '请输入字典代码', whitespace: true }],
                })(<Input placeholder="请输入" style={{ width: 320 }} />)}
              </FormItem>
            </Col>
            <Col md={8} sm={24}>
              <FormItem label="字典名称">
                {getFieldDecorator('name', {
                  initialValue: formValue.name,
                  rules: [{ required: true, message: '请输入字典名称', whitespace: true }],
                })(<Input placeholder="请输入" style={{ width: 320 }} />)}
              </FormItem>
            </Col>
            <Col md={8} sm={24}>
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

  secondStep = () => {
    const {
      wordDictionary: { newList },
      dispatch,
    } = this.props;

    return (
      <div>
        <TwoStep edit data={newList} deleteParam dispatch={dispatch} type="changeNewList" />
      </div>
    );
  };

  // 判断数组是否重复 有重复返回false 没有重复返回true
  isRepeat = arr => {
    const hash = {};
    for (const i in arr) {
      if (hash[arr[i]]) {
        return false;
      }
      hash[arr[i]] = true;
    }
    return true;
  };

  save = () => {
    const {
      dispatch,
      wordDictionary: { forMoment },
    } = this.props;
    const { formValue } = this.state;

    let param = true;
    const replaceList = [];
    const that = this;
    const a = commitAdd();
    a.next();
    function* commitAdd() {
      // 存储添加数据字典列表
      // const forMoment = JSON.parse(sessionStorage.getItem('addWordList'));
      if (forMoment.length === 0) {
        message.warn('字典数据不能为空');
        param = false;
        return false;
      }
      forMoment.forEach(index => {
        if (index.code === '') {
          message.warn('请输入字典代码');
          param = false;
          return false;
        }
        if (index.name === '') {
          message.warn('请输入字典名称');
          param = false;
          return false;
        }
        replaceList.push(index.code);
      });
      if (param) {
        param = that.isRepeat(replaceList);
        if (!param) {
          message.warn('有重复数据');
        }
      }
      if (param) {
        yield dispatch({
          type: 'wordDictionary/addWord',
          payload: {
            ...formValue,
            datadict: forMoment,
          },
        });
      }
    }
  };

  // 点击取消按钮
  lookPage = () => {
    const { dispatch } = this.props;
    router.push('/base/wordDictionary');
    // 清空数据
    dispatch({
      type: 'wordDictionary/newList',
      payload: [],
    });
  };

  render() {
    const { loading } = this.props;
    const { current } = this.state;

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

          {/* 按钮组 */}
          <div style={{ bottom: 20, textAlign: 'right' }}>
            {current < steps.length - 1 && (
              <div>
                <Button type="primary" onClick={this.next} style={{ marginRight: 10 }}>
                  下一步
                </Button>
                <Button onClick={() => this.lookPage()}>取消</Button>
              </div>
            )}
            {current > 0 && (
              <Button style={{ marginRight: 10, textAlign: 'right' }} onClick={this.prev}>
                上一步
              </Button>
            )}
            {current === steps.length - 1 && (
              <div style={{ float: 'right' }}>
                <Button
                  type="primary"
                  onClick={this.save}
                  style={{ marginRight: 10 }}
                  disabled={!!loading}
                >
                  保存
                </Button>
                <Button onClick={this.lookPage}>取消</Button>
              </div>
            )}
          </div>
        </Card>
      </PageContainers>
    );
  }
}
