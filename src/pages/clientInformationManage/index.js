import React, { useEffect, useState } from 'react';
import {
  Button,
  Card,
  Col,
  Dropdown,
  Form,
  Icon,
  Input,
  Menu,
  Row,
  Select,
} from 'antd';
import { Table } from '@/components';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect } from 'dva';
import { errorBoundary } from '@/layouts/ErrorBoundary';
import ActionButton from 'antd/lib/modal/ActionButton';
import styles from './index.less';

const { Search } = Input;
const FormItem = Form.Item;
const routerPath = {
  toSave: '/dynamicPage/4028e7b6733bcfb401733c0e764d0004/新增-投资者审查',
};

const Index = ({
  form: { getFieldDecorator, getFieldsValue, resetFields },
  dispatch,
  listLoading,
  clientInformationManage: { saveListFetch },
}) => {
  // 展开/收起
  const [seniorType, setSeniorType] = useState(false);
  // 每页数据条数
  const [pageSize, setPageSize] = useState(10);
  // 页码
  const [pageNum, setPageNum] = useState(1);
  // 批量选中数据
  const [selectData, setSelectData] = useState([]);
  // 批量操作按钮集合
  const [btnList, setBtnList] = useState(['审核', '反审核', '删除']);

  // 列表
  useEffect(() => {
    handleGetTemplateListFetch(10, 1);
  }, []);

  const paginationProps = {
    showSizeChanger: true,
    showQuickJumper: true,
    current: pageNum,
    total: saveListFetch.total,
    showTotal: total => `共 ${total} 条数据`,
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
  // table组件
  const tableCom = () => {
    return (
      <Table
        loading={listLoading}
        dataSource={saveListFetch.taskList}
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
      title: '客户编号',
      dataIndex: 'clientCode',
      key: 'clientCode',
      sorter: true,
    },
    {
      title: '客户类型',
      dataIndex: 'clientTypeName',
      key: 'clientType',
      sorter: true,
    },
    {
      title: '客户名称',
      dataIndex: 'clientName',
      key: 'clientName',
      sorter: true,
      width: 400
    },
    {
      title: '是否专业投资者',
      dataIndex: 'isMajorInvestor',
      key: 'isMajorInvestor',
      sorter: true,
    },
    {
      title: '是否是金融客户',
      dataIndex: 'isFinanceClient',
      key: 'isFinanceClient',
      sorter: true,
    },
    {
      title: '非自然人客户类型',
      dataIndex: 'customerType',
      key: 'customerType',
      sorter: true,
    },
    {
      title: '状态',
      dataIndex: 'checkedName',
      key: 'checkedName',
      sorter: true,
    },
    {
      title: '审查状态',
      dataIndex: 'reviewStatus',
      key: 'reviewStatus',
      sorter: true,
    },
    {
      title: '审查时间',
      dataIndex: 'reviewTime',
      key: 'reviewTime',
      sorter: true,
    },
    {
      title: '操作',
      dataIndex: '',
      key: '',
      align: 'center',
      fixed: 'right',
      render: record => {
        const btnList = ['查看', '修改', '审核', '反审核', '删除', '投资者审查'];
        return <ActionButton buttonList={btnList} handleBack={handleEdit} record={record} />;
      },
    },
  ];

  // 展开搜索表单创建
  const searchFrom = () => {
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
            <FormItem label="客户编号">
              {getFieldDecorator('clientCode')(<Input placeholder="请输入客户编号" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="客户类型">
              {getFieldDecorator('clientType')(handleMapList([], 'code', 'name', 'multiple'))}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="客户名称">
              {getFieldDecorator('clientName')(<Input placeholder="请输入客户编号" />)}
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

  /** 列表查询
   * handleGetTemplateListFetch
   * @param {number} pageSize
   * @param {number} pageNum
   * @param {string} field
   * @param {string} direction
   * @param {object} formData
   */
  const handleGetTemplateListFetch = (
    pageSize = pageSize,
    pageNum = pageNum,
    field = field,
    direction = direction,
    formData,
  ) => {
    dispatch({
      type: 'clientInformationManage/handleListFetch',
      payload: {
        pageSize,
        pageNum,
        field,
        direction,
        ...formData,
      },
    });
  };

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
   * @param  {boolean}       showLabel select的label值展示
   */
  const handleMapList = (data, code, name, mode = false, fnBoole = false, fn, showLabel) => {
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
          labelInValue={showLabel}
          optionFilterProp="children"
          onChange={fnBoole ? fn : ''}
        >
          {children}
        </Select>
      );
    }
  };

  // 操作列表按钮
  const ActionButton = props => {
    const { btnList } = props;
    const child = btnList.map((item, index) => {
      const button = (
        <a
          style={{ marginRight: 8 }}
          onClick={() => {
            props.handlerBack(item, props.record);
          }}
        >
          {item.label}
        </a>
      );
      return <span key={index}>{button}</span>;
    });
  };

  // 为操作列表按钮，绑定事件
  const handleEdit = (label, record) => {
    switch (label) {
      case '查看':
        break;
      case '修改':
        break;
      case '审核':
        break;
      case '反审核':
        break;
      case '删除':
        break;
        break;
      case '投资者审查':
    }
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
    setPageSize(pagination.pageSize);
    setPageNum(pagination.current);

    const values = getFieldsValue();
    handleGetListFetch(tabs, pagination.pageSize, pagination.current, field, direction, values);
  };

  // 展开搜索收起 查询
  const blurSearch = value => {
    value = { keyWords: value };
    handleGetListFetch(tabs, 10, 1, '', '', value);
  };

  // 收起搜索，查询
  const handleGetSearchFetch = () => {
    validateFields(values => {
      if (!values) {
        values = getFieldsValue();
      }
      values = beforeFormFata(values);
      handleGetListFetch(tabs, pageSize, pageNum, '', '', values);
    });
  };

  /**
   * 重置表单按钮
   * @method  handleFormReset
   */
  const handleFormReset = () => {
    resetFields();
  };

  // 批量操作按钮
  const dropdownBtn = btnList => {
    const menu = (
      <Menu>
        {btnList.map((item, index) => {
          return (
            <Menu.Item key={index}>
              <a
                onClick={() => {
                  batchOperation(item);
                }}
              >
                {item}
              </a>
            </Menu.Item>
          );
        })}
      </Menu>
    );
    const button = (
      <Dropdown overlay={menu} trigger={['click']}>
        <a
          className="ant-dropdown-link"
          onClick={e => {
            e.preventDefault();
          }}
        >
          <Button>批量操作</Button>
        </a>
      </Dropdown>
    );
    return button;
  };
  return (
    <PageHeaderWrapper title="产品数据管理/客户信息管理" breadcrumb={{}}>
      <div style={{ display: seniorType ? '' : 'none' }} className={styles.searchForm}>
        {searchFrom()}
      </div>
      <Form {...formItemLayout}>
        <div className={styles.list} style={{ display: seniorType ? 'none' : '' }}>
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
                <div className={styles.seniorsearch}>
                  <Search
                    placeholder="请输入客户编号或客户名称"
                    onSearch={value => blurSearch(value)}
                    style={{
                      width: 242,
                      marginRight: 20,
                      height: 32,
                    }}
                  />
                <Button
                  className={styles.searchLabel}
                  onClick={() => setSeniorType(true)}
                  type="link">展开搜索<Icon type="down" />
                </Button>
                </div>
              </Col>
            </Row>
          </Card>
        </div>
        <Card>
          <div className={styles.wrapButton}>
            <Button type="primary" href={routerPath.toSave}>
              新增
            </Button>
          </div>
          <div style={{ marginTop: '50px' }}> {tableCom()}</div>
        </Card>
      </Form>
      <div className={styles.batchBtn}>{dropdownBtn(btnList)}</div>
    </PageHeaderWrapper>
  );
};

const WrappendIndexForm = errorBoundary(
  Form.create()(
    connect(({ clientInformationManage, loading }) => ({
      clientInformationManage,
      listLoading: loading.effects['clientInformationManage/handleListFetch'],
    }))(Index),
  ),
);

export default WrappendIndexForm;
