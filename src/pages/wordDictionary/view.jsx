import React, { Component } from 'react';
import { PageContainers } from '@/components';
import { connect } from 'dva';
import { Button, Card, Col, Form, Input, message, Popconfirm, Row, Tooltip } from 'antd';
import { errorBoundary } from '@/layouts/ErrorBoundary';
import styles from './index.less';
import { parse } from 'qs';
import TwoStep from './Twostep';
import { router } from 'umi';
import { cloneDeep } from 'lodash';

const { TextArea } = Input;
const FormItem = Form.Item;

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

@errorBoundary
@Form.create()
@connect(({ wordDictionary, loading }) => ({
  wordDictionary,
  listLoadings: loading.effects['wordDictionary/fetchOneList'],
  updateWordLoadings: loading.effects['wordDictionary/updateWord'],
}))
class Index extends Component {
  constructor(props) {
    super(props);
  }
  state = {
    pageType: 'view',
  };

  componentWillMount() {
    this.inquiryOneList();
    const {
      location: {
        query: { pageType },
      },
    } = this.props;
    this.setState({ pageType });
  }

  // 机构查询方法
  inquiryOneList = () => {
    const par = parse(location.search, { ignoreQueryPrefix: true });
    const { dispatch } = this.props;
    const fcode = par.dicCode;
    const fid = par.dicId;
    // 查询列表
    dispatch({
      type: 'wordDictionary/fetchOneList',
      payload: { fcode },
    });

    // 查询详情
    dispatch({
      type: 'wordDictionary/fetchOne',
      payload: { fid },
    });
  };

  // 查询表单
  renderAdvancedForm = () => {
    const {
      wordDictionary: { one },
      form: { getFieldDecorator },
    } = this.props;
    const { pageType } = this.state;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="字典代码">
              {pageType === 'modify'
                ? getFieldDecorator('code', {
                    initialValue: one.code,
                    rules: [{ required: true, message: '请输入词汇代码' }],
                  })(<Input placeholder="请输入" disabled />)
                : one.code}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="字典名称">
              {pageType === 'modify'
                ? getFieldDecorator('name', {
                    initialValue: one.name,
                    rules: [{ required: true, message: '请输入词汇名称' }],
                  })(<Input placeholder="请输入" />)
                : one.name}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="描述信息">
              {pageType === 'modify' ? (
                getFieldDecorator('remark', {
                  initialValue: one.remark,
                  rules: [{ validator: this.handleRemarkValidator }],
                })(<TextArea placeholder="请输入" />)
              ) : (
                <span
                  style={{
                    overflow: 'hidden',
                    whiteSpace: 'nowrap',
                    textOverflow: 'ellipsis',
                    display: 'inline-block',
                    width: '180px',
                  }}
                >
                  <Tooltip title={one.remark}>{one.remark}</Tooltip>
                </span>
              )}
            </FormItem>
          </Col>
        </Row>
      </Form>
    );
  };
  dataSource = [];

  //   表格添加数据的回调
  updataDataSourceHandler = value => {
    this.dataSource = value;
  };

  //   保存
  save = () => {
    const { dataSource } = this;
    this.props.form.validateFields((err, fieldsValue) => {
      const replaceList = [];
      if (dataSource.length === 0) {
        message.warn('字典数据不能为空');
        return;
      }
      dataSource.forEach(index => {
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
      const tempData = cloneDeep(dataSource);
      tempData.map(item => {
        if ((item?.id + '')?.indexOf('fe') != -1) {
          delete item.id;
        }
      });
      this.props.dispatch({
        type: 'wordDictionary/updateWord',
        payload: {
          ...fieldsValue,
          datadict: tempData,
        },
      });
    });
  };

  // 查询表按钮
  lookAction = () => {
    const { updateWordLoadings } = this.props;
    const { pageType } = this.state;
    return (
      <div>
        <Button
          type="primary"
          style={{ marginRight: 16 }}
          onClick={() =>
            pageType === 'modify' ? this.save() : this.setState({ pageType: 'modify' })
          }
          disabled={updateWordLoadings}
        >
          {pageType === 'modify' ? '保存' : '编辑'}
        </Button>
        {/*        {status === 'edit' && (
          <Button
            style={{ width: 86, height: 26, marginRight: 16 }}
            onClick={() => this.changeState('look', status)}
          >
            取消编辑
          </Button>
        )} */}
        <Button style={{ marginRight: 16 }} onClick={() => router.goBack()}>
          返回列表
        </Button>
      </div>
    );
  };
  render() {
    const { pageType } = this.state;
    const {
      listLoadings,
      wordDictionary: { oneList },
    } = this.props;

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
            title: pageType === 'modify' ? '修改' : '查看',
            url: '',
          },
        ]}
      >
        <Card
          bordered={false}
          title="词汇信息"
          extra={this.lookAction()}
          style={{ marginTop: 16, minHeight: 50 }}
        >
          <div className={styles.tableListForm}>{this.renderAdvancedForm()}</div>
        </Card>
        <Card
          bordered={false}
          title="字典列表"
          style={{ marginTop: 16, minHeight: 260, position: 'relative' }}
          loading={listLoadings}
        >
          <TwoStep
            isEdit={pageType === 'modify'}
            dataSource={oneList}
            updataDataSource={this.updataDataSourceHandler}
            // columns={pageType === 'modify' ? [...baseColumns, ...actionCol] : baseColumns}
            // dictategoryId={this.getId(oneList)}
            // dispatch={dispatch}
            // type="changeOneList"
            inquiryOneList={this.inquiryOneList}
          />
        </Card>
      </PageContainers>
    );
  }
}

export default Index;
