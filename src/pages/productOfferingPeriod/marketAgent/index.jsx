/**
 *Create on 2020/6/10.
 */

import React, { useEffect, useState } from 'react';
import {
  Button,
  Card,
  Col,
  Divider,
  Form,
  Icon,
  Input,
  Row,
  Select,
  Tag,
  Tabs,
} from 'antd';
import { Table } from '@/components';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect } from 'dva';
import { errorBoundary } from '@/layouts/ErrorBoundary';
import styles from './index.less';

const { TabPane } = Tabs;
const { Search } = Input;
const FormItem = Form.Item;

const Index = ({
  form: { getFieldDecorator, resetFields, validateFields },
  dispatch,
  listLoading,
  marketAgent: { saveListFetch, saveWordDictionaryFetch },
}) => {
  // 展开/收起
  const [seniorType, setSeniorType] = useState(false);
  // 每页数据条数
  const [pageSize, setPageSize] = useState(10);
  // 页码
  const [pageNum, setPageNum] = useState(1);
  // tabs code
  const [tabs, setTabs] = useState('T001_1');

  // 产品募集期调整 列表
  useEffect(() => {
    handleGetTemplateListFetch(1, 10, 'T001_1');
    handleWordDictionaryFetch('S001,A002,T001');
  }, []);

  const columns = [
    {
      title: '产品名称',
      dataIndex: 'proName',
      key: 'proName',
      fixed: 'left',
    },
    {
      title: '产品代码',
      dataIndex: 'proCode',
      key: 'proCode',
      fixed: 'left',
    },
    {
      title: '资产类型',
      dataIndex: 'proType',
      key: 'proType',
    },
    {
      title: '投资经理',
      dataIndex: 'investmentManager',
      key: 'investmentManager',
    },
    {
      title: '募集开始日',
      dataIndex: 'raiseSdate',
      key: 'raiseSdate',
    },
    {
      title: '募集计划结束日',
      dataIndex: 'adjustEndDate',
      key: 'adjustEndDate',
    },
    {
      title: '调整类型',
      dataIndex: 'adjustmentType',
      key: 'adjustmentType',
      render: text => (text === 1 ? <Tag color="green">提前</Tag> : <Tag color="red">延后</Tag>),
    },
    {
      title: '任务到达时间/办理时间',
      dataIndex: 'taskArriveTime',
      key: 'taskArriveTime',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
    },
    {
      title: '操作',
      dataIndex: 'opeator',
      key: 'opeator',
      align: 'center',
      fixed: 'right',
      render: (text, record) => (
        <div>
          <a>修改</a>
          <Divider type="vertical" />
          <a>提交</a>
          <Divider type="vertical" />
          <a>流程图</a>
        </div>
      ),
    },
  ];

  /**
   * 方法说明 循环生成select
   * @method  handleMapList
   * @return {void}
   * @param  {Object[]}       data 数据源
   * @param  {string}         name   select的name
   * @param  {string}         code  select的code
   * @param  {boolean|string} mode  是否可以多选(设置 Select 的模式为多选或标签)
   * @param  {boolean}        fnBoole 选择时函数控制
   * @param  {function}       fn 控制函数
   */
  const handleMapList = (data, name, code, mode = false, fnBoole = false, fn) => {
    if (!data) {
      data = {};
      data.data = [];
    }
    const e = data;
    if (e) {
      const children = [];
      for (const key of e) {
        const keys = key[code];
        const values = key[name];
        children.push(
          <Select.Option key={keys} value={keys}>
            {values}
          </Select.Option>,
        );
      }
      return (
        <Select
          maxTagCount={1}
          mode={mode}
          style={{ width: '100%' }}
          placeholder="请选择"
          optionFilterProp="children"
          onChange={fnBoole ? fn : ''}
        >
          {children}
        </Select>
      );
    }
  };

  /**
   * 查询按钮
   * @method  handleGetSearchFetch
   */
  const handleGetSearchFetch = () => {
    validateFields((err, values) => {
      if (err) return;
      handleGetTemplateListFetch(tabs, pageSize, pageNum, values);
    });
  };

  /**
   * 词汇字典
   * @method  handleWordDictionaryFetch
   * @param dictCode {string} 词汇代码
   */
  const handleWordDictionaryFetch = dictCode => {
    dispatch({
      type: 'marketAgent/handleWordDictionaryFetch',
      payload: { dictCode },
    });
  };

  /**
   * 重置表单按钮
   * @method  handleFormReset
   */
  const handleFormReset = () => {
    resetFields();
  };

  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 6 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 16 },
    },
  };

  // 高级搜索表单创建
  const seniorSearchForm = () => {
    return (
      <Form>
        <Row
          gutter={{
            md: 8,
            lg: 24,
            xl: 48,
          }}
        >
          <Col md={8} sm={24}>
            <FormItem label="产品名称">
              {getFieldDecorator('proName')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>

          <Col md={8} sm={24}>
            <FormItem label="产品代码">
              {getFieldDecorator('proCode')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            {/* 词汇字典 A002 */}
            <FormItem label="资产类型">
              {getFieldDecorator('proType')(
                handleMapList(saveWordDictionaryFetch.A002 || [], 'name', 'code', 'multiple'),
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            {/* todo: 单独接口，后端未完成 */}
            <FormItem label="投资经理">
              {getFieldDecorator('investmentManager')(
                handleMapList([], 'name', 'code', 'multiple'),
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="调整类型">
              {getFieldDecorator('adjustmentType')(
                handleMapList(
                  [
                    {
                      code: '0',
                      name: '提前',
                    },
                    {
                      code: '1',
                      name: '延后',
                    },
                  ],
                  'name',
                  'code',
                ),
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            {/* 词汇字典 S001 */}
            <FormItem label="状态">
              {getFieldDecorator('status')(
                handleMapList(saveWordDictionaryFetch.S001 || [], 'name', 'code', 'multiple'),
              )}
            </FormItem>
          </Col>
        </Row>
        <div style={{ textAlign: 'right' }}>
          <span className="submitButtons" style={{ marginRight: 10 }}>
            <Button
              htmlType="submit"
              type="primary"
              style={{
                marginRight: '10px',
                height: 28,
              }}
              onClick={handleGetSearchFetch}
            >
              查询
            </Button>
            <Button style={{ height: 28 }} onClick={handleFormReset}>
              重置
            </Button>
          </span>
          <span className={styles.searchLabel} onClick={() => setSeniorType()}>
            收起
            <Icon type="up" />
          </span>
        </div>
      </Form>
    );
  };

  /**
   * 方法说明 列表（搜索）
   * @method  handleGetTemplateListFetch
   * @return {Object}
   * @param taskType {string} 页数/当前页
   * @param pageSize {number} 每页大小
   * @param pageNum  {number} 流程节点id
   * @param formData {Object} 表单项
   */
  const handleGetTemplateListFetch = (
    taskType = tabs,
    pageSize = pageSize,
    pageNum = pageNum,
    formData,
  ) => {
    dispatch({
      type: 'marketAgent/handleListFetch',
      payload: {
        taskType,
        pageSize,
        pageNum,
        ...formData,
      },
    });
  };

  const paginationProps = {
    showSizeChanger: true,
    showQuickJumper: true,
    current: pageNum,
    total: saveListFetch.total,
    showTotal: total => `共 ${total} 条数据`,
  };

  /**
   * 分页
   * @method  handlePaginationChange
   */
  const handlePaginationChange = pagination => {
    validateFields((err, values) => {
      if (err) return;
      setPageSize(pagination.pageSize);
      setPageNum(pagination.current);
      handleGetTemplateListFetch(tabs, pagination.pageSize, pagination.current, values);
    });
  };

  /**
   * table组件
   * @method  tableCom
   */
  const tableCom = () => {
    return (
      <Table
        loading={listLoading}
        dataSource={saveListFetch.rows}
        columns={columns}
        pagination={paginationProps}
        onChange={handlePaginationChange}
        scroll={{ x: columns.length * 200 + 500 }}
      />
    );
  };

  /**
   * tabs callback
   * @method   handleTabsChanges
   * @param key {string}
   */
  const handleTabsChanges = key => {
    setTabs(key);
    validateFields((err, values) => {
      if (err) return;
      handleGetTemplateListFetch(key, pageSize, pageNum, values);
    });
  };

  return (
    <PageHeaderWrapper>
      <Form {...formItemLayout}>
        <div className={styles.list}>
          <Card
            style={{
              marginBottom: 20,
              paddingTop: 20,
              paddingBottom: 20,
            }}
          >
            <Row
              gutter={{
                md: 8,
                lg: 24,
                xl: 48,
              }}
            >
              <Col md={12} sm={24} />
              <Col md={12} sm={24}>
                <div className={styles.seniorsearch} style={{ display: seniorType ? 'none' : '' }}>
                  <Search
                    placeholder="请输入产品名称称或产品代码"
                    onSearch={value => this.blurSearch(value)}
                    style={{
                      width: 242,
                      marginRight: 20,
                      height: 32,
                    }}
                  />
                  <span className={styles.searchLabel} onClick={() => setSeniorType(true)}>
                    高级搜索
                    <Icon type="down" />
                  </span>
                </div>
              </Col>
              <Col
                md={24}
                sm={24}
                style={{ display: seniorType ? '' : 'none' }}
                className={styles.searchForm}
              >
                {seniorSearchForm()}
              </Col>
            </Row>
          </Card>
        </div>
        <Card>
          <Tabs defaultActiveKey="T001_1" onChange={handleTabsChanges} animated={false}>
            <TabPane tab="我待办" key="T001_1">
              {tableCom()}
            </TabPane>
            <TabPane tab="我参与" key="T001_2">
              {tableCom()}
            </TabPane>
            <TabPane tab="我发起" key="T001_3">
              {tableCom()}
            </TabPane>
            <TabPane tab="未提交" key="T001_4">
              {tableCom()}
            </TabPane>
            <TabPane tab="已办理" key="T001_5">
              {tableCom()}
            </TabPane>
          </Tabs>
        </Card>
      </Form>
    </PageHeaderWrapper>
  );
};

const WrappedIndexForm = errorBoundary(
  Form.create()(
    connect(({ marketAgent, loading }) => ({
      marketAgent,
      listLoading: loading.effects['marketAgent/handleListFetch'],
    }))(Index),
  ),
);

export default WrappedIndexForm;
