import React from 'react';
import { connect } from 'dva';
import { parse } from 'qs';
import router from 'umi/router';
import { nsHoc } from '@/utils/hocUtil';
import { Button, Col, Form, Input, message, Popconfirm, Row, Tooltip } from 'antd';
import BaseCrudComponent from '@/components/BaseCrudComponent';
import { errorBoundary } from '@/layouts/ErrorBoundary';
import { handleTableCss, handleValidator } from '@/utils/utils';
import styles from './index.less';
import Twostep from './Twostep';
import { Card, PageContainers } from '@/components';
import Gird from '@/components/Gird';

const FormItem = Form.Item;
const { TextArea } = Input;

@errorBoundary
@nsHoc({ namespace: 'wordDictionary' })
@Form.create()
@connect(state => ({
  wordDictionary: state.wordDictionary,
}))
@connect(({ wordDictionary, loading }) => ({
  wordDictionary,
  listLoadings: loading.effects['wordDictionary/fetchOneList'],
  updateWordLoadings: loading.effects['wordDictionary/updateWord'],
}))
export default class TableList extends BaseCrudComponent {
  state = {
    modalVisible: false,
    selectedRows: [],
    status: 1,
    // 控制模态框的显示
    modal: {
      visible: false,
    },
    count: 2,
    dataSource: [],
  };

  componentDidMount() {
    this.inquiryOneList();
  }

  componentWillUnmount() {
    sessionStorage.removeItem('dicCode');
    sessionStorage.removeItem('dicId');
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      dataSource: nextProps.wordDictionary.oneList,
    });
  }

  // 机构查询方法
  inquiryOneList = () => {
    const par = parse(location.search, { ignoreQueryPrefix: true });
    const { dispatch } = this.props;
    const fcode = sessionStorage.getItem('dicCode') || par.dicCode;
    const fid = sessionStorage.getItem('dicId') || par.dicId;
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

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { formValues } = this.state;
    this.handleStandardTabpage(pagination, filtersArg, sorter, formValues);
    for (const i in filtersArg) {
      if (i === 'fchecked') {
        this.setstatus(filtersArg.fchecked[0]);
      }
    }
  };

  handleRemarkValidator = (rule, value, callback) => {
    handleValidator(value, callback, 400, '描述信息长度过长');
  };

  // 已审核或未审核
  setstatus = e => {
    const { dispatch } = this.props;
    this.setState({
      status: e.key,
    });
    const basic = {
      currentPage: 1,
      pageSize: 10,
      checked: e.key,
    };
    dispatch({
      type: 'wordDictionary/fetch',
      payload: basic,
    });
  };

  // 查询表单
  renderAdvancedForm = () => {
    const {
      wordDictionary: { one, status },
      form: { getFieldDecorator },
    } = this.props;
    const drawerConfig = [
      { label: '字典代码', value: 'code' },
      { label: '字典名称', value: 'name' },
      { label: '描述信息', value: 'remark', proportion: true },
    ];
    return (
      <>
        {status === 'edit' ? (
          <Form onSubmit={this.handleSearch} layout="inline">
            <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
              <Col md={8} sm={24}>
                <FormItem label="字典代码">
                  {status === 'edit'
                    ? getFieldDecorator('code', {
                        initialValue: one.code,
                        rules: [{ required: true, message: '请输入词汇代码' }],
                      })(<Input placeholder="请输入" disabled />)
                    : one.code}
                </FormItem>
              </Col>
              <Col md={8} sm={24}>
                <FormItem label="字典名称">
                  {status === 'edit'
                    ? getFieldDecorator('name', {
                        initialValue: one.name,
                        rules: [{ required: true, message: '请输入词汇名称' }],
                      })(<Input placeholder="请输入" />)
                    : one.name}
                </FormItem>
              </Col>
              <Col md={8} sm={24}>
                <FormItem label="描述信息">
                  {status === 'edit' ? (
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
        ) : (
          <Gird config={drawerConfig} info={one} />
        )}
      </>
    );
  };

  // 查询表按钮
  lookAction = () => {
    const {
      wordDictionary: { status },
      updateWordLoadings,
    } = this.props;
    return (
      <div>
        <Button
          type="primary"
          style={{ marginRight: 16 }}
          onClick={() => this.changeState('edit', status)}
          disabled={updateWordLoadings}
        >
          {status === 'edit' ? '保存' : '编辑'}
        </Button>
        {/*        {status === 'edit' && (
          <Button
            style={{ width: 86, height: 26, marginRight: 16 }}
            onClick={() => this.changeState('look', status)}
          >
            取消编辑
          </Button>
        )} */}
        <Button style={{ marginRight: 16 }} onClick={() => router.push('/base/wordDictionary')}>
          返回列表
        </Button>
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

  // 转换状态
  changeState = (state, status) => {
    const _this = this;
    const {
      dispatch,
      form,
      wordDictionary: { forMoment },
    } = this.props;
    const replaceList = [];
    const basic = {
      state,
    };
    dispatch({
      type: 'wordDictionary/state',
      payload: basic,
    });

    if (status === 'edit' && state === 'edit') {
      let param = true;
      form.validateFields((err, fieldsValue) => {
        function* commitAdd() {
          const list = JSON.parse(sessionStorage.getItem('addWordList'));
          const data = forMoment.length !== 0 ? forMoment : list;
          if (list.length === 0) {
            message.warn('字典数据不能为空');
            param = false;
            return false;
          }

          forMoment.map(index => {
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
            param = _this.isRepeat(replaceList);
            if (!param) {
              message.warn('有重复数据');
            }
          }

          dispatch({
            type: 'wordDictionary/changeOneList',
            payload: {
              list,
            },
          });

          if (param) {
            yield dispatch({
              type: 'wordDictionary/updateWord',
              payload: {
                ...fieldsValue,
                datadict: data,
              },
            });
          }
        }

        if (!err) {
          const a = commitAdd();
          a.next();
        }
      });
      // 点击取消
    } else if (status === 'edit' && state === 'look') {
      this.inquiryOneList();
    }
  };

  // 点击删除处理
  handleDelete = record => {
    const { dispatch } = this.props;

    const dataSource = [...this.state.dataSource];
    this.setState({ dataSource: dataSource.filter(item => item.id !== record.id) }, () => {
      dispatch({
        type: 'wordDictionary/changeOneList',
        payload: {
          list: this.state.dataSource,
        },
      });
    });
  };

  getId = list => {
    let id;
    if (list && Array.isArray(list)) {
      list.map((index, i) => {
        if (i === 0) {
          id = index.dictategoryId;
        }
      });
      return id;
    }
  };

  render() {
    const {
      wordDictionary: { oneList, data, forgtype, currentpage, modalShow, status },
      dispatch,
      listLoadings,
    } = this.props;
    const { selectedRows, modalVisible, dataSource } = this.state;
    const columns = [
      {
        title: '字典代码',
        dataIndex: 'code',
        editable: status === 'edit',
        width: 450,
        render: text => handleTableCss(text),
      },
      {
        title: '字典名称',
        dataIndex: 'name',
        editable: status === 'edit',
        width: 450,
        render: text => handleTableCss(text),
      },
      {
        title: '备注',
        dataIndex: 'remark',
        editable: status === 'edit',
        width: 450,
        render: text => handleTableCss(text),
      },
      {
        title: '操作',
        dataIndex: 'id',
        width: '150px',
        align: 'center',
        // fixed: 'right',
        render: (text, record) => {
          if (status === 'edit') {
            return (
              <Popconfirm title="确定要删除吗?" onConfirm={() => this.handleDelete(record)}>
                <a>删除</a>
              </Popconfirm>
            );
          }
          return '';
        },
      },
    ];

    const columns2 = [
      {
        title: '字典代码',
        dataIndex: 'code',
        // editable: status === 'edit',
        render: text => handleTableCss(text),
      },
      {
        title: '字典名称',
        dataIndex: 'name',
        // editable: status === 'edit',
        render: text => handleTableCss(text),
      },
      {
        title: '备注',
        dataIndex: 'remark',
        // editable: status === 'edit',
        render: text => handleTableCss(text),
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
            title: status === 'edit' ? '修改' : '查看',
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
          <Twostep
            edit={status === 'edit'}
            columns={status === 'edit' ? columns : columns2}
            data={oneList}
            dictategoryId={this.getId(oneList)}
            dispatch={dispatch}
            type="changeOneList"
            inquiryOneList={this.inquiryOneList}
          />
        </Card>
      </PageContainers>
    );
  }
}
