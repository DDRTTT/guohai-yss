/**
 *Create on 2020/6/10. 产品募集期调整页面
 */

import React, { useEffect, useRef, useState } from 'react';
import {
  Button,
  Col,
  Dropdown,
  Form,
  Icon,
  Menu,
  Modal,
  Row,
  Select,
  Tabs,
  Tag,
  Tooltip,
} from 'antd';
import { routerRedux } from 'dva/router';
import { connect } from 'dva';
import Action, { linkHoc } from '@/utils/hocUtil';
import { isArray } from '@/utils/utils';
import { errorBoundary } from '@/layouts/ErrorBoundary';
import { cloneDeep } from 'lodash';
import MoreOperation from '@/components/moreOperation';
import { isNullObj } from '@/pages/investorReview/func';
import styles from './index.less';
import { handleShowTransferHistory } from '@/utils/transferHistory';
import { Table } from '@/components';
import List from '@/components/List';

const { TabPane } = Tabs;
const FormItem = Form.Item;

const Index = ({
  fnLink,
  form: { getFieldDecorator, setFieldsValue, resetFields },
  dispatch,
  listLoading,
  productOfferingPeriod: { saveListFetch, saveWordDictionaryFetch, saveManagerFetch },
  productOfferingPeriodAdd: { saveProductSelection },
  publicTas,
}) => {
  // 展开/收起
  const [seniorType, setSeniorType] = useState(false);
  // 每页数据条数
  const [pageSize, setPageSize] = useState(10);
  // 页码
  const [pageNum, setPageNum] = useState(1);
  // tabs code
  const [tabs, setTabs] = useState(publicTas);
  // 批量选中数据
  const [selectData, setSelectData] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [batchObj, setBatchObj] = useState({});
  const [searchData, setSearchData] = useState({});
  const [direction, setDirection] = useState({});
  const [field, setFfield] = useState({});
  // 表格表头
  const [columns, setColumns] = useState([
    {
      title: '产品简称',
      dataIndex: 'proFname',
      key: 'proFname',
      sorter: true,
      width: 280,
      render: text => {
        return (
          <Tooltip title={text}>
            <span>
              {text
                ? text.toString().replace(/null/g, '-')
                : text === '' || text === undefined
                  ? '-'
                  : 0}
            </span>
          </Tooltip>
        );
      },
      ellipsis: true,
    },
    {
      title: '产品代码',
      dataIndex: 'proCode',
      key: 'proCode',
      sorter: true,
      render: text => {
        return handleTableCss(text);
      },
      width: 130,
    },
    {
      title: '产品类型',
      dataIndex: 'proTypeName',
      key: 'proType',
      sorter: true,
      render: text => {
        return handleTableCss(text);
      },
      width: 140,
    },
    {
      title: '投资经理',
      dataIndex: 'investmentManager',
      key: 'investmentManager',
      sorter: true,
      render: text => {
        return handleTableCss(text);
      },
      width: 200,
    },
    {
      title: '募集开始日',
      dataIndex: 'raiseSdate',
      key: 'raiseSdate',
      sorter: true,
      render: text => {
        return handleTableCss(text);
      },
      width: 150,
    },
    {
      title: '募集计划结束日',
      dataIndex: 'adjustEndDate',
      key: 'adjustEndDate',
      sorter: true,
      render: text => {
        return handleTableCss(text);
      },
      width: 180,
    },
    {
      title: '调整类型',
      dataIndex: 'adjustmentType',
      key: 'adjustmentType',
      render: text =>
        text === '0' ? <div className="success">提前</div> : <div className="error">延后</div>,
      sorter: true,
      width: 150,
    },
    {
      title: '任务到达时间',
      dataIndex: 'taskArriveTime',
      key: 'taskArriveTime',
      sorter: true,
      render: text => {
        return handleTableCss(text);
      },
      width: 170,
    },
    {
      title: '状态',
      dataIndex: 'statusName',
      key: 'status',
      sorter: true,
      width: 140,
    },
    {
      title: '操作',
      dataIndex: 'opeator',
      key: 'opeator',
      align: 'center',
      fixed: 'right',
      render: (text, record) => {
        const actionBtnList = getActionBtn(record, taskTypeCodeRef.current);
        return (
          <>
            <ActionButton buttonList={actionBtnList} handlerBack={handleEdit} record={record} />
            <MoreOperation
              record={record}
              opertations={{ tabs: taskTypeCodeRef.current, status: record.status }}
              fn={handleGetSearchFetch}
            />
          </>
        );
      },
    },
  ]);
  let taskTypeCodeRef = useRef(publicTas);
  // 产品募集期调整 列表
  useEffect(() => {
    handleGetTemplateListFetch(taskTypeCodeRef.current, 10, 1);
    handleWordDictionaryFetch('S001,A002,T001');
    handleProductSelection('');
    handleGetManagerFetch('E002_1');
  }, []);

  // 处理分页以后的数据
  useEffect(() => {
    if (!isNullObj(batchObj)) {
      let tempList = [];
      for (const key in batchObj) {
        if (batchObj.hasOwnProperty(key)) {
          const element = batchObj[key];
          tempList = tempList.concat(element);
        }
      }
      setSelectData(tempList);
    }
  }, [batchObj]);

  // 产品名称下拉框
  const handleProductSelection = proStage => {
    dispatch({
      type: 'productOfferingPeriodAdd/handleProductSearch',
      payload: { proStage },
    });
  };

  // 处理table列样式
  const handleTableCss = text => {
    return (
      <Tooltip title={text} placement="topLeft">
        <span
          style={{
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis',
            display: 'inline-block',
            paddingTop: '5px',
          }}
        >
          {text
            ? text.toString().replace(/null/g, '-')
            : text === '' || text === undefined
              ? '-'
              : 0}
        </span>
      </Tooltip>
    );
  };

  // 投资经理下拉
  const handleGetManagerFetch = roleCode => {
    dispatch({
      type: 'productOfferingPeriod/handleManagerFetch',
      payload: { roleCode },
    });
  };
  /**
   * 方法说明 列表（搜索）
   * @method  handleGetTemplateListFetch
   * @return {Object}
   * @param pageSize {number} 每页大小
   * @param pageNum  {number} 页数/当前页
   * @param field  {string} 排序字段
   * @param direction  {string} 排序方式
   * @param formData {Object} 表单项
   * @param taskTypeCode {string} 任务类型
   */
  const handleGetTemplateListFetch = (
    taskTypeCode = taskTypeCodeRef.current,
    pageSize = pageSize,
    pageNum = pageNum,
    field,
    direction,
    formData,
  ) => {
    dispatch({
      type: 'productOfferingPeriod/handleListFetch',
      payload: {
        taskTypeCode,
        pageSize,
        pageNum,
        field,
        direction,
        ...formData,
      },
    });
  };

  /**
   * 词汇字典
   * @method  handleWordDictionaryFetch
   * @param codeList {string} 词汇代码
   */
  const handleWordDictionaryFetch = codeList => {
    dispatch({
      type: 'productOfferingPeriod/handleWordDictionaryFetch',
      payload: { codeList },
    });
  };

  /**
   * 根据不同的tabs生成不同的按钮
   * @param {*} record
   */
  const getActionBtn = (record, tabsCurrent) => {
    let buttonList = [];
    const statusName = record.statusName;
    switch (tabsCurrent) {
      case 'T001_1':
      case 'T001_4':
        switch (statusName) {
          case '待提交':
            buttonList = [
              { label: '修改', code: 'productOfferingPeriod:edit' },
              { label: '复制', code: 'productOfferingPeriod:copy' },
              { label: '提交', code: 'productOfferingPeriod:submit' },
              // { label: '流程图', code: 'productOfferingPeriod:chart' },
            ];
            break;
          case '流程中':
            buttonList = [
              { label: '办理', code: 'productOfferingPeriod:handle' },
              { label: '流转历史', code: 'productOfferingPeriod:history' },
              // {
              //   label: '更多',
              //   code: 'productOfferingPeriod:more',
              //   type: 'more',
              //   list: ['认领', '委托', '退回', '移交', '传阅', '撤销'],
              // },
            ];
            break;
          case '已结束':
            buttonList = [
              {
                label: '详情',
                code: 'productOfferingPeriod:view',
              },
              {
                label: '流转历史',
                code: 'productOfferingPeriod:history',
              },
            ];
            break;
        }
        break;
      default:
        buttonList = [
          {
            label: '详情',
            code: 'productOfferingPeriod:view',
          },
          {
            label: '流转历史',
            code: 'productOfferingPeriod:history',
          },
        ];

        break;
    }
    if (statusName === '流程中') {
      if (record.revoke + '' === '1') {
        buttonList.push({ label: '撤销', code: 'productOfferingPeriod:cancel' });
      }
    }
    if (statusName === '待提交') {
      buttonList.push({ label: '删除', code: 'productOfferingPeriod:delete' });
    }
    if (tabsCurrent === 'T001_1' && record.circulateFlag === '0') {
      buttonList = [{ label: '审阅', code: 'lookOver' }];
    }
    return buttonList;
  };

  // 选择产品名称 回显信息
  const chosseProName = data => {
    const result = cloneDeep(data);
    result.forEach(item => {
      let temp;
      temp = item.key;
      item.key = item.label;
      item.label = temp;
    });
    setFieldsValue({ proCode: result });
  };

  const chooseProCode = data => {
    const result = cloneDeep(data);
    result.forEach(item => {
      let temp;
      temp = item.key;
      item.key = item.label;
      item.label = temp;
    });
    setFieldsValue({ proName: result });
  };

  // 根据产品名称回显信息
  const handleBackMsg = proCode => {
    dispatch({
      type: 'productOfferingPeriodAdd/handleGetBackMsgByAdd',
      payload: { proCode },
    }).then(data => {
      setFieldsValue({
        proCode: data.proCode,
      });
    });
  };

  /**
   * 操作列表按钮
   *
   */
  const ActionButton = props => {
    const { buttonList } = props;
    const child = buttonList.map((item, index) => {
      let button;
      if (item.type !== 'more') {
        // 审阅按钮
        if (item.label === '审阅') {
          button = (
            <Button
              type="link"
              size="small"
              onClick={() => {
                props.handlerBack(item.label, props.record);
              }}
            >
              {item.label}
            </Button>
          );
        } else {
          button = (
            <Action code={item.code}>
              <Button
                type="link"
                size="small"
                onClick={() => {
                  props.handlerBack(item.label, props.record);
                }}
              >
                {item.label}
              </Button>
            </Action>
          );
        }
      } else {
        const menu = (
          <Menu>
            {item.list.map((item, index) => {
              return (
                <Menu.Item key={index}>
                  <a
                    onClick={() => {
                      props.handlerBack(item, props.record);
                    }}
                  >
                    {item}
                  </a>
                </Menu.Item>
              );
            })}
          </Menu>
        );
        button = (
          <Dropdown overlay={menu} trigger={['click']}>
            <Button
              type="link"
              size="small"
              className="ant-dropdown-link"
              onClick={e => {
                e.preventDefault();
              }}
            >
              更多
              <Icon type="caret-right" />
            </Button>
          </Dropdown>
        );
      }
      return <span key={index}>{button}</span>;
    });
    return child;
  };

  // 为操作列表按钮，绑定事件
  const handleEdit = (label, record) => {
    const { id } = record;
    const { proCode, taskId } = record;
    const { processInstanceId } = record;
    const nodeId = record.taskDefinitionKey;
    const url = `/processCenter/processHistory?processInstanceId=${record.processInstanceId}`;
    switch (label) {
      case '详情':
        const info = { processInstanceId, nodeId, taskId };
        dispatch(
          routerRedux.push({
            pathname: '/processCenter/processDetail',
            query: { ...info },
          }),
        );
        break;
      case '审阅':
        dispatch(
          routerRedux.push({
            pathname: '/processCenter/taskDeal',
            query: {
              id: record.taskId,
              taskId: record.taskId,
              processInstanceId: record.processInstanceId,
              processDefinitionId: record.processDefinitionId,
              taskDefinitionKey: record.taskDefinitionKey,
              mode: 'review',
            },
          }),
        );
        break;
      case '修改':
        // dispatch(
        //   routerRedux.push({
        //     pathname: '/dynamicPage/4028e7b67443dc6e01747cfd4dd20052/产品募集期调整v1修改',
        //     query: { id, proCode },
        //   }),
        // );
        fnLink(
          'productOfferingPeriod:edit',
          `?id=${id}&proCode=${proCode}&processInstanceId=${record.processInstanceId}&processInstId=${record.processInstanceId}`,
        );
        break;
      case '复制':
        // dispatch(
        //   routerRedux.push({
        //     pathname: '/dynamicPage/pages/4028e7b67443dc6e01747cfd4dd20052/产品募集期调整v1修改',
        //   }),
        // );
        fnLink('productOfferingPeriod:copy', `?processInstId=${record.processInstanceId}`);
        break;
      case '复制':
        // dispatch(
        //   routerRedux.push({
        //     pathname: '/dynamicPage/4028e7b67443dc6e01747cfd4dd20052/产品募集期调整v1修改',
        //     query: { id, proCode },
        //   }),
        // );
        fnLink(
          'productOfferingPeriod:copy',
          `?id=${id}&proCode=${proCode}&processInstanceId=${record.processInstanceId}&processInstId=${record.processInstanceId}`,
        );
        break;
      case '提交':
        // dispatch(
        //   routerRedux.push({
        //     pathname: '/dynamicPage/4028e7b67443dc6e01747cfd4dd20052/产品募集期调整v1提交',
        //     query: { id, proCode },
        //   }),
        // );
        fnLink(
          'productOfferingPeriod:submit',
          `?id=${id}&proCode=${proCode}&processInstanceId=${record.processInstanceId}&processInstId=${record.processInstanceId}`,
        );
        break;
      case '办理':
        const params = {
          id: record.id,
          proCode: record.proCode,
          taskId: record.taskId,
          processDefinitionId: record.processDefinitionId,
          processInstanceId: record.processInstanceId,
          taskDefinitionKey: record.taskDefinitionKey,
          mode: 'deal',
        };
        dispatch(
          routerRedux.push({
            pathname: '/processCenter/taskDeal',
            query: { ...params },
          }),
        );
        break;
      case '认领':
        break;
      case '委托':
        break;
      case '退回':
        break;
      case '移交':
        break;
      case '传阅':
        break;
      case '撤销':
        Modal.confirm({
          title: '请确认是否撤销?',
          okText: '确认',
          cancelText: '取消',
          onOk: () => {
            dispatch({
              type: 'productOfferingPeriod/handleRevoke',
              payload: { processInstId: processInstanceId },
            }).then(data => {
              if (data) {
                handleGetSearchFetch();
              }
            });
          },
        });

        break;
      case '删除':
        const option = record.id.split(',');
        Modal.confirm({
          title: '请确认是否删除?',
          okText: '确认',
          cancelText: '取消',
          onOk: () => {
            dispatch({
              type: 'productOfferingPeriod/handleDelete',
              payload: option,
            }).then(data => {
              if (data) {
                handleGetSearchFetch();
              }
            });
          },
        });
        break;
      case '流程图':
        break;
      case '流转历史':
        handleShowTransferHistory(record);
        break;
      default:
        throw new Error('没有该按钮的处理方法');
    }
  };

  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
      setSelectData(selectedRows);
      setSelectedRowKeys(selectedRowKeys);
      setBatchObj({ ...batchObj, [pageNum]: selectedRows });
    },
    getCheckboxProps: record => ({
      disabled: record.name === 'Disabled User',
      name: record.name,
    }),
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
   * @param   {string}        labelName 所属对象名称
   */
  const handleMapList = (
    data,
    name,
    code,
    mode = false,
    fnBoole = false,
    fn,
    labelName,
    showLabel,
  ) => {
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
          placeholder={`请选择${labelName}`}
          optionFilterProp="children"
          onChange={fnBoole ? fn : ''}
        >
          {children}
        </Select>
      );
    }
  };

  // 转换数组类型
  const transformData = (values, data) => {
    if (values[data] && !isArray(values[data])) {
      values[data] = values[data].split(',');
    }
    return values;
  };

  // 使用form data之前数据处理
  const beforeFormFata = values => {
    // 处理proName和proCode的值
    if (values.proName || values.proCode) {
      const temp = [];
      const temp1 = [];
      values.proName.forEach(item => {
        temp.push(item.key);
        temp1.push(item.label);
      });
      values.proName = temp1;
      values.proCode = temp;
    }
    // proType,investmentManager,orgId,不是数组的转换为数组
    if (values.proType && !isArray(values.proType)) {
      values = transformData(values, 'proType');
    }
    if (values.investmentManager && !isArray(values.investmentManager)) {
      values = transformData(values, 'proType');
    }
    if (values.orgId && !isArray(values.orgId)) {
      values = transformData(values, 'orgId');
    }
    if (values.status && !isArray(values.status)) {
      values = transformData(values, 'status');
    }

    return values;
  };

  /**
   * 查询按钮
   * @method  handleGetSearchFetch
   */
  const handlerSearch = fieldsValue => {
    setPageNum(1);
    setSearchData(fieldsValue);
    handleGetTemplateListFetch(taskTypeCodeRef.current, pageSize, 1, field, direction, fieldsValue);
  };

  // 重置
  const handleReset = () => {
    setPageNum(1);
    setSearchData({});
    setDirection('');
    setFfield('');
    handleGetTemplateListFetch(taskTypeCodeRef.current, pageSize, 1, '', '', {});
  };

  const handleGetSearchFetch = data => {
    const values = searchData;
    handleGetTemplateListFetch(
      taskTypeCodeRef.current,
      pageSize,
      data ? data : pageNum,
      '',
      '',
      values,
    );
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

  // 发起流程
  const extractContent = () => {
    return (
      <Action code="productOfferingPeriod:link">
        <Button
          type="primary"
          onClick={() => {
            linkToAdd();
          }}
        >
          发起流程
        </Button>
      </Action>
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
   * 分页
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
    setDirection(direction);
    setFfield(field);
    const values = searchData;
    handleGetTemplateListFetch(
      taskTypeCodeRef.current,
      pagination.pageSize,
      pagination.current,
      field,
      direction,
      values,
    );
  };

  /**
   * table组件
   * @method  tableCom
   */
  const tableCom = () => {
    return (
      <Table
        rowKey={taskTypeCodeRef.current === 'T001_1' ? 'processInstanceId' : 'id'}
        loading={listLoading}
        dataSource={saveListFetch.rows}
        columns={columns}
        pagination={paginationProps}
        onChange={handlePaginationChange}
        scroll={{ x: true }}
        rowSelection={{
          type: 'checkbox',
          selectedRowKeys: selectedRowKeys,
          ...rowSelection,
        }}
      />
    );
  };
  /**
   * tabs callback
   * @method   handleTabsChanges
   * @param key {string}
   */
  const handleTabsChanges = key => {
    dispatch({
      type: 'publicModel/setPublicTas',
      payload: key,
    });
    setTabs(key);
    taskTypeCodeRef.current = key;
    handleReset();
  };

  /**
   * @description 隐藏任务到达时间
   * @param {String} tabKey 当前tab
   * @param {Array} conditions  隐藏tab条件
   * @param {Array} arr column数组
   * @param {String} key  删除的key
   * @param {Object} obj  添加的key
   */
  const hideTaskArriveTime = (tabKey, conditions, arr, key, obj) => {
    // 已办理和我发起不显示任务到达时间
    const hideTaskTime = conditions;
    const index = arr.findIndex(item => item.dataIndex == key);
    if (hideTaskTime.includes(tabKey) && ~index) {
      arr.splice(index, 1);
    } else if (!hideTaskTime.includes(tabKey)) {
      if (~index) {
      } else {
        arr.splice(8, 0, obj);
      }
    }
    setColumns(arr);
  };

  // 模糊查询
  const blurSearch = value => {
    value = { keyWords: value };
    setPageNum(1);
    setPageSize(10);
    handleGetTemplateListFetch(taskTypeCodeRef.current, 10, 1, '', '', value);
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

  // 批量操作方法
  const batchOperation = btn => {
    console.log('选中数据', selectData);
    let idList = [];
    selectData.forEach(item => {
      idList.push(item.id);
    });
    switch (btn) {
      case '提交':
        dispatch({
          type: 'productOfferingPeriod/handleBatchSubmitByIndex',
          payload: { id: idList },
        }).then(data => {
          if (data) {
            handleGetSearchFetch();
          }
        });
        break;
    }
  };

  // 批量提交
  const handlerBatchSubmit = () => {
    const idList = [];
    selectData.forEach(item => {
      idList.push(item.id);
    });
    dispatch({
      type: 'productOfferingPeriod/handleBatchSubmitByIndex',
      payload: idList,
      callback: () => {
        handlerSuccessCallback();
        handleGetSearchFetch();
      },
    });
  };
  /**
   * 批量处理接口调用成功以后的回调
   */
  const handlerSuccessCallback = () => {
    setBatchObj({});
    setSelectedRowKeys([]);
  };
  //
  const linkToAdd = () => {
    // dispatch(
    //   routerRedux.push({
    //     pathname: '/dynamicPage/4028e7b67360924901739358ef490046/新增产品募集期调整v1',
    //   }),
    // );
    fnLink('productOfferingPeriod:link', '');
  };

  // 条件查询配置
  const formItemData = [
    {
      name: 'proCode',
      label: '产品全称',
      type: 'select',
      readSet: { name: 'proName', code: 'proCode', bracket: 'proCode' },
      config: { mode: 'multiple' },
      option: saveProductSelection,
    },
    {
      name: 'proType',
      label: '产品类型',
      type: 'select',
      readSet: { name: 'name', code: 'code', bracket: 'code' },
      config: { mode: 'multiple' },
      option: saveWordDictionaryFetch.A002,
    },
    {
      name: 'investmentManager',
      label: '投资经理',
      type: 'select',
      readSet: { name: 'name', code: 'empNo', bracket: 'empNo' },
      config: { mode: 'multiple' },
      option: saveManagerFetch,
    },
    {
      name: 'adjustmentType',
      label: '调整类型',
      type: 'select',
      readSet: { name: 'name', code: 'code', bracket: 'code' },
      option: [
        { code: '0', name: '提前' },
        { code: '1', name: '延后' },
      ],
    },
    {
      name: 'status',
      label: '状态',
      type: 'select',
      readSet: { name: 'name', code: 'code', bracket: 'code' },
      config: { mode: 'multiple' },
      option: saveWordDictionaryFetch.S001,
    },
  ];

  const callBackHandler = value => {
    setColumns(value);
  };
  return (
    <>
      <List
        pageCode="productOfferingPeriod"
        dynamicHeaderCallback={callBackHandler}
        columns={columns}
        taskTypeCode={publicTas}
        taskArrivalTimeKey="taskArriveTime"
        title={false}
        formItemData={formItemData}
        advancSearch={handlerSearch}
        resetFn={handleReset}
        searchPlaceholder="请输入产品全称/产品代码"
        fuzzySearch={blurSearch}
        tabs={{
          tabList: [
            { key: 'T001_1', tab: '我待办' },
            { key: 'T001_3', tab: '我发起' },
            { key: 'T001_4', tab: '未提交' },
            { key: 'T001_5', tab: '已办理' },
          ],
          activeTabKey: publicTas,
          onTabChange: handleTabsChanges,
        }}
        extra={extractContent()}
        tableList={
          <>
            {publicTas === 'T001_1' && <> {tableCom()} </>}
            {publicTas === 'T001_3' && <> {tableCom()} </>}
            {publicTas === 'T001_4' && <> {tableCom()} </>}
            {publicTas === 'T001_5' && <> {tableCom()} </>}
            {/* <div className={styles.batchBtn}> */}
            <MoreOperation
              opertations={{
                tabs: taskTypeCodeRef.current,
                statusKey: 'status',
              }}
              batchStyles={{ marginLeft: '38px', position: 'relative', top: '-40px' }}
              fn={handleGetSearchFetch}
              type="batch"
              batchList={selectData}
              submitCallback={handlerBatchSubmit}
              successCallback={handlerSuccessCallback}
            />
            {/* </div> */}
          </>
        }
      />
    </>
  );
};

const WrappedIndexForm = errorBoundary(
  linkHoc()(
    Form.create()(
      connect(
        ({
          productOfferingPeriod,
          productOfferingPeriodAdd,
          loading,
          publicModel: { publicTas },
        }) => ({
          productOfferingPeriod,
          productOfferingPeriodAdd,
          publicTas,
          listLoading: loading.effects['productOfferingPeriod/handleListFetch'],
        }),
      )(Index),
    ),
  ),
);

export default WrappedIndexForm;
