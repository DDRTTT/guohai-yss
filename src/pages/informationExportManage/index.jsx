import React, { useEffect, useState } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { errorBoundary } from '@/layouts/ErrorBoundary';
import { connect } from 'dva';
import {
  Button,
  Card,
  Col,
  Form,
  Icon,
  Input,
  Menu,
  Row,
  Select,
  Table,
  message,
  Checkbox,
  DatePicker,
  TreeSelect,
  Layout,
} from 'antd';
import { routerRedux } from 'dva/router';
import styles from './index.less';

const { Search } = Input;
const FormItem = Form.Item;
const { RangePicker } = DatePicker;
const { Sider, Content } = Layout;
const selectTreeValue = [];

const Index = ({
  form: { getFieldsValue, getFieldDecorator, resetFields },
  dispatch,
  listLoading,
  informationExportManage: { saveListFetch, saveWordDictionaryFetch },
}) => {
  // 展开/收起
  const [seniorType, setSeniorType] = useState(false);
  // 每页数据条数
  const [pageSize, setPageSize] = useState(10);
  // 页码
  const [pageNum, setPageNum] = useState(1);
  // 批量选中数据
  const [selectData, setSelectData] = useState([]);

  // 生命周期文档 列表
  useEffect(() => {
    handleGetListFetch(10, 1);
    handleWordDictionaryFetch('X011,X012');
  }, []);

  /**
   * 词汇字典
   * @method  handleWordDictionaryFetch
   * @param codeList {string} 词汇代码
   */
  const handleWordDictionaryFetch = codeList => {
    dispatch({
      type: 'informationExportManage/handleWordDictionaryFetch',
      payload: { codeList },
    });
  };

  /**
   * 方法说明 列表（搜索）
   * @method  handleGetListFetch
   * @return {Object}
   * @param pageSize {number} 每页大小
   * @param pageNum  {number} 页数/当前页
   * @param field  {string} 排序字段
   * @param direction  {string} 排序方式
   * @param formData {Object} 表单项
   */
  const handleGetListFetch = (
    pageSize = pageSize,
    pageNum = pageNum,
    field,
    direction,
    formData,
  ) => {
    dispatch({
      type: 'informationExportManage/handleGetListInfo',
      payload: {
        pageSize,
        pageNum,
        field,
        direction,
        ...formData,
      },
    });
  };

  // 展开搜索表单创建
  const searchFrom = () => {
    return (
      <Form {...formItemLayout} style={{ padding: '10px' }}>
        <Row
          gutter={{
            md: 8,
            lg: 24,
            xl: 48,
          }}
        >
          <Col md={8} sm={24}>
            <FormItem label="产品全称">
              {getFieldDecorator('proName')(<Input placeholder="请输入产品全称" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="产品代码">
              {getFieldDecorator('proCode')(<Input placeholder="请输入产品代码" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            {/* X011 */}
            <FormItem label="信披事项">
              {getFieldDecorator('infoPublishItem')(
                handleMapList(
                  saveWordDictionaryFetch.X011 || [],
                  'name',
                  'code',
                  'multiple',
                  false,
                  '',
                  false,
                ),
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="披露对象">
              {getFieldDecorator('publishTarget')(
                handleMapList(
                  saveWordDictionaryFetch.X012 || [],
                  'name',
                  'code',
                  'multiple',
                  false,
                  '',
                  false,
                ),
              )}
            </FormItem>
          </Col>

          <Col md={8} sm={24}>
            <FormItem label="披露结果">
              {getFieldDecorator('publishResult')(<Input placeholder="请输入披露结果" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="归档时间">
              {getFieldDecorator('dateString')(
                <RangePicker
                  showTime={{ format: 'YYYY-MM-DD HH:mm' }}
                  format="YYYY-MM-DD HH:mm"
                  placeholder={['开始时间', '结束时间']}
                  onChange={onChangeRangeTime}
                />,
              )}
            </FormItem>
          </Col>
        </Row>
        <div style={{ textAlign: 'right' }}>
          <Button
            className={styles.searchLabel}
            onClick={() => setSeniorType()}
            type="link">收起<Icon type="up" />
          </Button>
          <span className="submitButtons" style={{ marginLeft: 10 }}>
            <Button
              htmlType="submit"
              type="primary"
              style={{
                marginLeft: '10px',
                height: 28,
              }}
              onClick={handleGetSearchFetch}
            >
              查询
            </Button>
            <Button
              style={{ height: 28, marginLeft: '10px', color: '#1890ff' }}
              onClick={handleFormReset}
            >
              重置
            </Button>
          </span>
        </div>
      </Form>
    );
  };

  const paginationProps = {
    showSizeChanger: true,
    showQuickJumper: true,
    current: pageNum,
    total: saveListFetch.total,
    showTotal: total => `共 ${total} 条数据`,
  };

  /**
   * 分页回调
   * @method  handlePaginationChange
   */
  const handlePaginationChange = (pagination, filters, sorter, extra) => {
    const field = sorter.columnKey;
    let direction;
    switch (sorter.order) {
      case 'ascend':
        direction = 'asc';
        break;
      case 'descend':
        direction = 'desc';
        break;
      default:
        direction = '';
        break;
    }
    validateFields(values => {
      setPageSize(pagination.pageSize);
      setPageNum(pagination.current);

      if (!values) {
        values = getFieldsValue();
      }
      values = beforeFormFata(values);
      handleGetListFetch(pagination.pageSize, pagination.current, field, direction, values);
    });
  };

  /**
   * rowSelection 回调
   */
  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
      setSelectData(selectedRows);
    },
  };

  /**
   * table组件
   */
  const tableCom = () => {
    return (
      <Table
        loading={listLoading}
        dataSource={saveListFetch.rows}
        columns={columns}
        pagination={paginationProps}
        onChange={handlePaginationChange}
        scroll={{ x: columns.length * 200 }}
        rowSelection={{
          type: 'checkbox',
          ...rowSelection,
        }}
      />
    );
  };

  const columns = [
    {
      title: '产品全称',
      dataIndex: 'proName',
      key: 'proName',
      sorter: true,
      width: 400,
    },
    {
      title: '产品代码',
      dataIndex: 'proCode',
      key: 'proCode',
    },

    {
      title: '信披事项',
      dataIndex: 'infoPublishItem',
      key: 'infoPublishItem',
    },
    {
      title: '披露对象',
      dataIndex: 'publishTargetName',
      key: 'publishTargetName',
    },
    {
      title: '预计披露日期',
      dataIndex: 'predictPublishDate',
      key: 'predictPublishDate',
    },
    {
      title: '披露结果',
      dataIndex: 'publishResult',
      key: 'publishResult',
    },
    {
      title: '实际披露日期',
      dataIndex: 'actualPublishDate',
      key: 'actualPublishDate',
    },
    {
      title: '操作',
      dataIndex: 'operator',
      key: 'operator',
      align: 'center',
      fixed: 'right',
      render: (text, record) => {
        return (
          <span>
            <a href="">查看</a>
          </span>
        );
      },
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

  // 日期选择
  const onChangeRangeTime = (value, dateString) => {
    console.log(value, dateString);
  };

  /**
   * 查询按钮
   * @method  handleGetSearchFetch
   */
  const handleGetSearchFetch = () => {
    let values;
    values = getFieldsValue();
    handleGetListFetch(pageSize, pageNum, '', '', values);
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

  // 用印文档改变触发事件
  const onChangeSeal = e => {
    console.log(e.target.checked);
  };

  // 模糊搜索
  const blurSearch = value => {
    value = { keyWords: value };
    handleGetListFetch(10, 1, '', '', value);
  };

  const handleDownLoad = () => {};
  const handleCheck = () => {};
  const handleVersion = () => {};
  const handleRecord = () => {};
  const handleSyncManage = () => {};

  return (
    <PageHeaderWrapper className={styles.parentBox} title="信披管理" breadcrumb={{}}>
      <Card
        className={styles.list}
        style={{ display: seniorType ? '' : 'none', marginBottom: '10px' }}
      >
        {searchFrom()}
      </Card>
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
                    placeholder="请输入产品全称/产品代码"
                    onSearch={value => blurSearch(value)}
                    style={{
                      width: 242,
                      marginRight: 20,
                      height: 32,
                    }}
                  />
                <Button
                  className={styles.searchLabel}
                  style={{marginLeft:10}}
                  onClick={() => setSeniorType(true)}
                  type="link">展开搜索<Icon type="down" />
                </Button>
                </div>
              </Col>
            </Row>
          </Card>
        </div>
        <Card>{tableCom()}</Card>
      </Form>
      {/* <div className={styles.batchBtn}>{dropdownBtn(btnList)}</div> */}
    </PageHeaderWrapper>
  );
};

const WrappedIndexForm = errorBoundary(
  Form.create()(
    connect(({ informationExportManage, loading }) => ({
      informationExportManage,
      listLoading: loading.effects['informationExportManage/handleListFetch'],
    }))(Index),
  ),
);

export default WrappedIndexForm;
