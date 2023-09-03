// 底稿标准目录配置页面
import React, { useEffect, useState, useRef } from 'react';
import { errorBoundary } from '@/layouts/ErrorBoundary';
import { connect } from 'dva';
import {
  Button,
  Card,
  Col,
  Form,
  Icon,
  Input,
  Row,
  Select,
  Table,
  DatePicker,
  Layout,
  Breadcrumb,
} from 'antd';
import { routerRedux } from 'dva/router';
import Action, { linkHoc } from '@/utils/hocUtil';
import { handleTableCss } from './func';
import styles from './index.less';

const { Search } = Input;
const FormItem = Form.Item;
const { RangePicker } = DatePicker;
const { Content } = Layout;
const selectTreeValue = [];
const routerPath = {
  linkAd: '/manuscriptSystem/manuscriptBasic/manuscriptBasicSov',
};

let initalTableCurrent = '';
const Index = ({
  form: { getFieldsValue, getFieldDecorator, resetFields, validateFields },
  dispatch,
  listLoading,
  manuscriptBasic: { saveManuscriptListInfo },
  manuscriptBasicSov: { saveWordDictionaryFetch },
}) => {
  // 展开/收起
  const [seniorType, setSeniorType] = useState(false);
  // 每页数据条数
  const [pageSize, setPageSize] = useState(10);
  // 页码
  const [pageNum, setPageNum] = useState(1);
  // 批量选中数据
  const [selectData, setSelectData] = useState([]);

  let controlFlag = useRef(false);
  let keyWordsInput = useRef(null);

  // 底稿目录配置列表
  useEffect(() => {
    handleGetDictFetch('awp_pro_type');
    handleGetListFetch(10, 1);
  }, []);

  // 字典
  const handleGetDictFetch = codeList => {
    dispatch({
      type: 'manuscriptBasicSov/handleWordDictionaryFetch',
      payload: { codeList },
    });
  };

  /**
   * 收起按钮
   * @method  handleSeniorType
   */
  const handleSeniorType = () => {
    resetFields();
    keyWordsInput.current.input.state.value = '';
    return setSeniorType();
  };

  // 展开搜索表单创建
  const searchFrom = () => {
    return (
      <Form {...formItemLayout}>
        <Row
          gutter={{
            md: 8,
            lg: 24,
            xl: 48,
          }}
        >
          <Col>
            <Breadcrumb>
              <Breadcrumb.Item>底稿目录管理</Breadcrumb.Item>
              <Breadcrumb.Item>底稿标准目录配置</Breadcrumb.Item>
            </Breadcrumb>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="业务类型">
              {getFieldDecorator('proCode')(
                handleMapList(
                  saveWordDictionaryFetch['awp_pro_type'] || [],
                  'code',
                  'name',
                  'multiple',
                  false,
                  '',
                  false,
                ),
              )}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="审核状态">
              {getFieldDecorator('checked')(
                handleMapList(
                  [
                    { proName: '已审核', proCode: '1' },
                    { proName: '未审核', proCode: '0' },
                  ],
                  'proCode',
                  'proName',
                  false,
                  false,
                  '',
                  false,
                ),
              )}
            </FormItem>
          </Col>
          <Col md={6} sm={24} style={{ textAlign: 'right', float: 'right', paddingTop: 5 }}>
            <Button htmlType="submit" type="primary" onClick={handleCheck}>
              查询
            </Button>
            <Button style={{ marginLeft: '10px' }} onClick={handleFormReset}>
              重置
            </Button>
            <Button className={styles.searchLabel} onClick={handleSeniorType} type="link">
              收起
              <Icon type="up" />
            </Button>
          </Col>
        </Row>
      </Form>
    );
  };

  const paginationProps = {
    showSizeChanger: true,
    showQuickJumper: true,
    current: pageNum,
    total: saveManuscriptListInfo.total,
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
      if (
        pageSize != pagination.pageSize ||
        (initalTableCurrent && pageNum != pagination.current)
      ) {
        controlFlag.current = true;
      } else {
        controlFlag.current = false;
      }
      initalTableCurrent = pagination.current;
      setPageSize(pagination.pageSize);
      setPageNum(pagination.current);

      if (!values) {
        values = getFieldsValue();
      }
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
        rowKey="proCode"
        loading={listLoading}
        dataSource={saveManuscriptListInfo.pathList}
        columns={columns}
        pagination={paginationProps}
        onChange={handlePaginationChange}
        scroll={{ x: columns }}
        rowSelection={{
          type: 'checkbox',
          ...rowSelection,
        }}
      />
    );
  };

  const columns = [
    {
      title: '业务类型',
      dataIndex: 'proCodeName',
      key: 'proCode',
      sorter: true,
      width: 400,
      render: text => {
        return handleTableCss(text);
      },
    },
    {
      title: '审核状态',
      dataIndex: 'checked',
      key: 'checked',
      width: 200,
      render: (text, record) => {
        return <span>{record.checked}</span>;
      },
      sorter: true,
    },
    {
      title: '更新时间',
      dataIndex: 'lastEditTime',
      key: 'lastEditTime',
      sorter: true,
      width: 400,
      render: text => {
        return handleTableCss(text);
      },
    },
    {
      title: '操作',
      dataIndex: 'opeator',
      key: 'opeator',
      align: 'left',
      fixed: 'right',
      width: 150,
      render: (text, record) => {
        const actionBtnList = getActionBtn(record.checked);
        return <ActionButton buttonList={actionBtnList} handlerBack={handleEdit} record={record} />;
      },
    },
  ];

  /**
   * 操作列表按钮
   *
   */
  const ActionButton = props => {
    const { buttonList } = props;
    const child = buttonList.map((item, index) => {
      const button = (
        <Action code={item.code}>
          <a
            style={{ marginRight: 8 }}
            onClick={() => {
              props.handlerBack(item.label, props.record);
            }}
          >
            {item.label}
          </a>
        </Action>
      );
      return <span key={index}>{button}</span>;
    });
    return child;
  };

  /**
   * 生成不同的按钮
   * @param {*} operStatusName
   */
  const getActionBtn = operStatusName => {
    let buttonList = [];

    switch (operStatusName) {
      case '未审核':
        buttonList = [
          { label: '查看', code: 'manuscriptBasic:check' },
          { label: '审核', code: 'manuscriptBasic:audit' },
        ];
        break;
      case '已审核':
        buttonList = [
          { label: '查看', code: 'manuscriptBasic:check' },
          { label: '反审核', code: 'manuscriptBasic:reAudit' },
        ];
        break;
    }

    return buttonList;
  };

  /**
   * 为操作列表按钮，绑定事件
   * @param {*} label
   * @param {*} record
   */
  const handleEdit = (label, record) => {
    const proCode = record.proCode;
    let view = '';
    let status = '';
    switch (label) {
      case '更新':
        dispatch(
          routerRedux.push({
            pathname: routerPath.linkAd,
            query: { view: 'update', proCode },
          }),
        );
        break;
      case '查看':
        record.checked === '未审核' ? (view = '') : (view = 'reverseAudit');
        dispatch(
          routerRedux.push({
            pathname: routerPath.linkAd,
            query: { view, proCode },
          }),
        );
        break;
      case '审核':
        status = 1;
        dispatch({
          type: 'manuscriptBasic/handleAudit',
          payload: { proCode, status },
        }).then(data => {
          if (data) {
            handleGetSearchFetch();
          }
        });
        break;
      case '反审核':
        status = 0;
        dispatch({
          type: 'manuscriptBasic/handleAudit',
          payload: { proCode, status },
        }).then(data => {
          if (data) {
            handleGetSearchFetch();
          }
        });
        break;

      default:
        throw new Error('没有该按钮的处理方法');
    }
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
      type: 'manuscriptBasic/handleGetListMsg',
      payload: {
        pageSize,
        pageNum,
        field,
        direction,
        ...formData,
      },
    }).then(() => {
      if (controlFlag.current) {
        document.querySelector('.ant-pagination-options-quick-jumper>input').value = '';
      }
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
   */
  const handleMapList = (data, code, name, mode = false, fnBoole = false, fn) => {
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
          showArrow
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

  const handleCheck = () => {
    setPageNum(1);
    handleGetSearchFetch(1);
  };

  /**
   * 查询按钮
   * @method  handleGetSearchFetch
   */
  const handleGetSearchFetch = data => {
    let values;
    values = getFieldsValue();
    handleGetListFetch(pageSize, data ? data : pageNum, '', '', values);
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

  const handleAddInfo = () => {
    dispatch(
      routerRedux.push({
        pathname: routerPath.linkAd,
      }),
    );
  };

  return (
    <>
      <Card style={{ display: seniorType ? '' : 'none', marginTop: '16px' }}>
        <div>{searchFrom()}</div>
      </Card>
      <Form {...formItemLayout}>
        <div className={styles.list}>
          <Card
            style={{
              paddingTop: 16,
            }}
            style={{ display: seniorType ? 'none' : '' }}
          >
            <Row type="flex" align="middle" justify="space-between">
              <Col>
                <Breadcrumb>
                  <Breadcrumb.Item>底稿目录管理</Breadcrumb.Item>
                  <Breadcrumb.Item>底稿标准目录配置</Breadcrumb.Item>
                </Breadcrumb>
              </Col>
              <Col>
                <Search
                  placeholder="请输入业务类型名称"
                  onSearch={value => blurSearch(value)}
                  ref={keyWordsInput}
                  style={{
                    width: 242,
                    marginRight: 20,
                    height: 32,
                  }}
                />
                <Button
                  className={styles.searchLabel}
                  onClick={() => setSeniorType(true)}
                  type="link"
                >
                  展开搜索
                  <Icon type="down" />
                </Button>
              </Col>
            </Row>
          </Card>
          <Card style={{ marginTop: 16 }}>
            <div className={styles.wrapButton}>
              <Action code="manuscriptBasic:add">
                <Button type="primary" onClick={handleAddInfo}>
                  新增
                </Button>
              </Action>
            </div>
            <div>{tableCom()}</div>
          </Card>
        </div>
      </Form>
    </>
  );
};

const WrappedIndexForm = errorBoundary(
  linkHoc()(
    Form.create()(
      connect(({ manuscriptBasic, manuscriptBasicSov, loading }) => ({
        manuscriptBasic,
        manuscriptBasicSov,
        listLoading: loading.effects['manuscriptBasic/handleGetListMsg'],
      }))(Index),
    ),
  ),
);

export default WrappedIndexForm;
