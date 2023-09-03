// 项目底稿目录管理页面
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
  Radio,
  Select,
  Table,
  DatePicker,
  Layout,
  Breadcrumb,
  Tooltip,
} from 'antd';
import { routerRedux } from 'dva/router';
import Action, { linkHoc } from '@/utils/hocUtil';
import { handleTableCss } from '@/pages/manuscriptBasic/func.js';
import { getUrlParams } from '@/utils/utils';
import styles from './index.less';

const { Search } = Input;
const FormItem = Form.Item;
const { RangePicker } = DatePicker;
const { Content } = Layout;
const selectTreeValue = [];
const routerPath = {
  linkAd: '/manuscriptSystem/manuscriptManageDetail',
};
const checkList = [
  { code: '0', name: '未审核' },
  { code: '1', name: '已审核' },
];

let initalTableCurrent = '';

const Index = ({
  form: { getFieldsValue, getFieldDecorator, resetFields, validateFields },
  dispatch,
  listLoading,
  manuscriptManage: { saveManuscriptManageListInfo, saveProductList, saveWordDictionaryFetch },
}) => {
  // 展开/收起
  const [seniorType, setSeniorType] = useState(false);
  // 每页数据条数
  const [pageSize, setPageSize] = useState(10);
  // 页码
  const [pageNum, setPageNum] = useState(1);
  // 批量选中数据
  const [selectData, setSelectData] = useState([]);
  // 目录切换
  const [mode, setMode] = useState(null);

  let controlFlag = useRef(false);
  let keyWordsInput = useRef(null);

  // 生命周期文档 列表
  useEffect(() => {
    const modeData = getUrlParams('mode') || 'project';
    setMode(modeData);
    handleGetDictFetch('awp_pro_type');
    handleGetListFetch(10, 1, modeData);
  }, []);

  // 产品名称下拉
  useEffect(() => {
    if (mode) {
      const type = mode === 'project' ? 1 : 0;
      dispatch({
        type: 'manuscriptManage/handleGetProductListMsg',
        payload: { type },
      });
    }
  }, [mode]);

  // 产品名称下拉
  // const handleGetProductList = () => {
  //   const type = mode === 'project' ? 1 : 0;
  //   dispatch({
  //     type: 'manuscriptManage/handleGetProductListMsg',
  //     payload: { type },
  //   });
  // };

  /** ******************************************************************************** */

  // 字典
  const handleGetDictFetch = codeList => {
    dispatch({
      type: 'manuscriptManage/handleWordDictionaryFetch',
      payload: { codeList },
    });
  };

  /**
   * 方法说明 列表（搜索）
   * @method  handleGetListFetch
   * @return {Object}
   * @param pageSize {number} 每页大小
   * @param pageNum  {number} 页数/当前页
   * @param mode  {string} 项目目录/系列目录
   * @param field  {string} 排序字段
   * @param direction  {string} 排序方式
   * @param formData {Object} 表单项
   */
  const handleGetListFetch = (
    pageSize = pageSize,
    pageNum = pageNum,
    mode = mode,
    field,
    direction,
    formData,
  ) => {
    dispatch({
      type: 'manuscriptManage/handleGetListMsg',
      payload: {
        pageSize,
        pageNum,
        mode,
        field,
        type: mode === 'project' ? 1 : 0,
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
              <Breadcrumb.Item>项目底稿目录管理</Breadcrumb.Item>
            </Breadcrumb>
          </Col>
          <Col span={6}>
            <FormItem label={mode === 'project' ? '项目名称' : '系列名称'}>
              {getFieldDecorator('proCode')(
                handleMapList(saveProductList || [], 'proCode', 'proName', 'multiple', false),
              )}
            </FormItem>
          </Col>
          <Col span={6}>
            {/*  字典 */}
            <FormItem label="项目类型">
              {getFieldDecorator('proType')(
                handleMapList(
                  saveWordDictionaryFetch['awp_pro_type'] || [],
                  'code',
                  'name',
                  'multiple',
                  false,
                ),
              )}
            </FormItem>
          </Col>
          <Col span={6}>
            {/* 0:未审核；1：已审核 */}
            <FormItem label="审核状态">
              {getFieldDecorator('checked')(handleMapList(checkList, 'code', 'name', false, false))}
            </FormItem>
          </Col>
          <Col span={6} style={{ float: 'right', textAlign: 'right', paddingTop: 5 }}>
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
    total: saveManuscriptManageListInfo.total,
    showTotal: total => `共 ${total} 条数据`,
  };

  /**
   * 分页回调
   * @method  handlePaginationChange
   */
  const handlePaginationChange = (pagination, filters, sorter, extra) => {
    let field = sorter.columnKey;
    if (field === 'proCodeName') {
      field = 'proCode';
    }
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
      handleGetListFetch(pagination.pageSize, pagination.current, mode, field, direction, values);
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
        rowKey="proCode"
        dataSource={saveManuscriptManageListInfo.pathList}
        columns={columns}
        pagination={paginationProps}
        onChange={handlePaginationChange}
        scroll={{ x: columns.length }}
        rowSelection={{
          type: 'checkbox',
          ...rowSelection,
        }}
      />
    );
  };

  const columns = [
    {
      title: mode === 'project' ? '项目名称' : '系列名称',
      dataIndex: 'proCodeName',
      key: 'proCodeName',
      sorter: true,
      width: 200,
      ellipsis: true,
      render: text => (
        <Tooltip title={text}>
          <span>{text}</span>
        </Tooltip>
      ),
    },
    {
      title: mode === 'project' ? '项目编码' : '系列编码',
      dataIndex: 'proCode',
      key: 'proCode',
      sorter: true,
      width: 200,
      render: text => {
        return handleTableCss(text);
      },
    },
    {
      title: '项目类型',
      dataIndex: 'typeName',
      key: 'proType',
      sorter: true,
      width: 200,
      render: text => {
        return handleTableCss(text);
      },
    },
    {
      title: '审核状态',
      dataIndex: 'checked',
      key: 'checked',
      width: 200,
      render: text => <span>{text == '0' ? '未审核' : '已审核'}</span>,
      sorter: true,
    },
    {
      title: '经办人',
      dataIndex: 'creatorName',
      key: 'creatorId',
      sorter: true,
      width: 200,
      render: text => {
        return handleTableCss(text);
      },
    },
    {
      title: '更新时间',
      dataIndex: 'lastEditTime',
      key: 'lastEditTime',
      sorter: true,
      width: 200,
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

    switch (operStatusName + '') {
      case '0':
        buttonList = [
          { label: '查看', code: 'manuscriptManage:check' },
          { label: '审核', code: 'manuscriptManage:audit' },
        ];
        break;
      case '1':
        buttonList = [
          { label: '查看', code: 'manuscriptManage:check' },
          { label: '反审核', code: 'manuscriptManage:reAudit' },
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
    const values = getFieldsValue();
    const { proCode } = record;
    let status = '';
    switch (label) {
      case '审核':
        status = 1;
        dispatch({
          type: 'manuscriptManage/handleAudit',
          payload: { proCode, status, type: mode === 'project' ? 1 : 0 },
        }).then(data => {
          if (data) {
            handleGetListFetch(pageSize, pageNum, mode);
          }
        });
        break;
      case '反审核':
        status = 0;
        dispatch({
          type: 'manuscriptManage/handleAudit',
          payload: { proCode, status, type: mode === 'project' ? 1 : 0 },
        }).then(data => {
          if (data) {
            handleGetListFetch(pageSize, pageNum, mode);
          }
        });
        break;
      case '查看':
        dispatch(
          routerRedux.push({
            pathname: routerPath.linkAd,
            query: { proCode, checked: record.checked, mode },
          }),
        );
        break;

      default:
        throw new Error('没有该按钮的处理方法');
    }
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

  // 日期选择
  const onChangeRangeTime = (value, dateString) => {
    console.log(value, dateString);
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
    const values = getFieldsValue();
    handleGetListFetch(pageSize, data ? data : pageNum, mode, '', '', values);
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
      sm: { span: 8 },
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
    handleGetListFetch(10, 1, mode, '', '', value);
  };

  // 树
  const onChangeTree = values => {
    console.log(values);
  };

  // 批量导入
  const handleImportByList = () => {};

  // 切换目录change
  const handleModeChange = e => {
    const value = e.target.value;
    setMode(value);
    resetFields();
    keyWordsInput.current.input.state.value = '';
    handleGetListFetch(10, 1, value);
    setPageNum(1);
    setPageSize(10);
  };
  return (
    <>
      <Card style={{ display: seniorType ? '' : 'none' }} className={styles.searchForm}>
        <div>{searchFrom()}</div>
      </Card>
      <Form {...formItemLayout}>
        <div className={styles.list}>
          <Card
            style={{
              marginBottom: 16,
              paddingBottom: 16,
            }}
            style={{ display: seniorType ? 'none' : '' }}
          >
            <Row type="flex" align="middle" justify="space-between">
              <Col>
                <Breadcrumb>
                  <Breadcrumb.Item>底稿目录管理</Breadcrumb.Item>
                  <Breadcrumb.Item>项目底稿目录管理</Breadcrumb.Item>
                </Breadcrumb>
              </Col>
              <Col>
                <Search
                  placeholder={mode === 'project' ? '请输入项目名称' : '请输入系列名称'}
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
            {/* <div className={styles.wrapButton}>
              <Button type="primary" onClick={handleImportByList}>
                批量导入
              </Button>
            </div> */}
            <div>
              <Radio.Group
                onChange={handleModeChange}
                defaultValue="project"
                value={mode}
                style={{ marginBottom: '20px' }}
                buttonStyle="solid"
              >
                <Radio.Button value="project">项目目录</Radio.Button>
                <Radio.Button value="series">系列目录</Radio.Button>
              </Radio.Group>
              {tableCom()}
            </div>
          </Card>
        </div>
      </Form>
    </>
  );
};

const WrappedIndexForm = errorBoundary(
  linkHoc()(
    Form.create()(
      connect(({ manuscriptManage, loading }) => ({
        manuscriptManage,
        listLoading: loading.effects['manuscriptManage/handleGetListMsg'],
      }))(Index),
    ),
  ),
);

export default WrappedIndexForm;
