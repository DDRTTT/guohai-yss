// 验资页面
import React, { useEffect, useRef, useState } from 'react';
import { errorBoundary } from '@/layouts/ErrorBoundary';
import { connect } from 'dva';
import { Button, Dropdown, Form, Icon, Menu, message, Modal, Select, Tabs, Tooltip } from 'antd';
import { routerRedux } from 'dva/router';
import Action, { linkHoc } from '@/utils/hocUtil';
import { cloneDeep } from 'lodash';
import MoreOperation from '@/components/moreOperation';
import { isNullObj } from '@/pages/investorReview/func';
import styles from './index.less';
import { handleShowTransferHistory } from '@/utils/transferHistory';
import { Table } from '@/components';
import List from '@/components/List';

const { TabPane } = Tabs;

const Index = ({
  fnLink,
  form: { setFieldsValue },
  dispatch,
  listLoading,
  capitalVerificationProcess: {
    saveListFetch,
    saveWordDictionaryFetch,
    saveProductSelection,
    saveOrganization,
    investManagerNameList,
  },
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
  const keyWordsValue = useRef('');
  const [searchData, setSearchData] = useState({});
  const [field, setField] = useState({});
  const [direction, setDirection] = useState({});

  // 表格表头
  const [columns, setColumns] = useState([
    {
      title: '产品全称',
      dataIndex: 'proName',
      key: 'proName',
      sorter: true,
      width: 400,
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
    },
    {
      title: '产品类型',
      dataIndex: 'proTypeName',
      key: 'proType',
      sorter: true,
      render: text => {
        return handleTableCss(text);
      },
    },
    {
      title: '投资经理',
      dataIndex: 'investmentManager',
      key: 'investmentManager',
      sorter: true,
      render: text => {
        return handleTableCss(text);
      },
    },
    {
      title: '实际募集结束日',
      dataIndex: 'raiseEdateActual',
      key: 'raiseEdateActual',
      sorter: true,
      render: text => {
        return handleTableCss(text);
      },
    },
    {
      title: '取得验资报告日',
      dataIndex: 'assetVerifiedDate',
      key: 'assetVerifiedDate',
      sorter: true,
      render: text => {
        return handleTableCss(text);
      },
    },
    {
      title: '验资机构名称',
      dataIndex: 'orgName',
      key: 'orgName',
      sorter: true,
      render: text => {
        return handleTableCss(text);
      },
    },
    {
      title: '成立规模',
      dataIndex: 'establishScale',
      key: 'establishScale',
      sorter: true,
      align: 'right',
      render: text => {
        return handleTableCss(text);
      },
    },
    {
      title: '产品成立日',
      dataIndex: 'proCdate',
      key: 'proCdate',
      sorter: true,
      render: text => {
        return handleTableCss(text);
      },
    },
    {
      title: '任务到达时间',
      dataIndex: tabs === 'T001_4' ? 'createTime' : 'taskArriveTime',
      key: tabs === 'T001_4' ? 'createTime' : 'taskArriveTime',
      sorter: true,
      render: text => {
        return handleTableCss(text);
      },
    },
    {
      title: '状态',
      dataIndex: 'operStatusName',
      key: 'operStatus',
      sorter: true,
      width: 100,
    },
    {
      title: '操作',
      dataIndex: 'opeator',
      key: 'opeator',
      align: 'left',
      fixed: 'right',
      render: (text, record) => {
        const actionBtnList = getActionBtn(record, taskTypeCodeRef.current);
        return (
          <>
            <ActionButton buttonList={actionBtnList} handlerBack={handleEdit} record={record} />
            <MoreOperation
              record={record}
              opertations={{ tabs: taskTypeCodeRef.current, status: record.operStatus }}
              fn={handleGetSearchFetch}
            />
          </>
        );
      },
    },
  ]);

  let taskTypeCodeRef = useRef(publicTas);
  // 验资 列表
  useEffect(() => {
    handleGetListFetch(taskTypeCodeRef.current, 10, 1);
    handleWordDictionaryFetch('S001,A002,T001');
    //handleProductSelection('A002_2,A002_3');
    handleProductSelection('');
    handleOrgnaization('J004_25');
    handleGetManagerList('E002_1');
  }, []);

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
            width: '180px',
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

  // 投资经理
  const handleGetManagerList = roleCode => {
    dispatch({
      type: 'capitalVerificationProcess/getInvestManagerNameList',
      payload: { roleCode },
    });
  };

  // 验资机构下拉
  const handleOrgnaization = orgType => {
    dispatch({
      type: 'capitalVerificationProcess/handleOrganization',
      payload: { orgType },
    });
  };
  // 产品名称下拉框
  const handleProductSelection = proType => {
    dispatch({
      type: 'capitalVerificationProcess/handleProductSearch',
      payload: { proType },
    });
  };

  /**
   * 词汇字典
   * @method  handleWordDictionaryFetch
   * @param codeList {string} 词汇代码
   */
  const handleWordDictionaryFetch = codeList => {
    dispatch({
      type: 'capitalVerificationProcess/handleWordDictionaryFetch',
      payload: { codeList },
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
   * @param  {string}        lableName 占位符名称
   */
  const handleMapList = (
    data,
    code,
    name,
    mode = false,
    fnBoole = false,
    fn,
    showLabel = false,
    lableName,
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
          showArrow
          style={{ width: '100%' }}
          placeholder={`请选择`}
          labelInValue={showLabel}
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
  const handlerSearch = fieldsValue => {
    setPageNum(1);
    setSearchData(fieldsValue);
    handleGetListFetch(taskTypeCodeRef.current, pageSize, 1, field, direction, fieldsValue);
  };

  // 重置
  const handleReset = () => {
    setPageNum(1);
    setSearchData({});
    keyWordsValue.current = '';
    handleGetListFetch(taskTypeCodeRef.current, pageSize, 1, '', '', {});
  };

  const handleGetSearchFetch = data => {
    handleGetListFetch(
      taskTypeCodeRef.current,
      pageSize,
      data ? data : pageNum,
      '',
      '',
      searchData,
    );
  };
  /**
   * 方法说明 列表（搜索）
   * @method  handleGetListFetch
   * @return {Object}
   * @param taskTypeCode {string} 任务类型
   * @param pageSize {number} 每页大小
   * @param pageNum  {number} 页数/当前页
   * @param field  {string} 排序字段
   * @param direction  {string} 排序方式
   * @param formData {Object} 表单项
   */
  const handleGetListFetch = (
    taskTypeCode = taskTypeCodeRef.current,
    pageSize = pageSize,
    pageNum = pageNum,
    field,
    direction,
    formData,
  ) => {
    dispatch({
      type: 'capitalVerificationProcess/handleListFetch',
      payload: {
        taskTypeCode,
        pageSize,
        pageNum,
        field,
        direction,
        ...formData,
        keyWords: keyWordsValue.current,
      },
    });
  };

  /**
   * table 回调
   * @param {*} key
   */
  const handleTabsChanges = key => {
    dispatch({
      type: 'publicModel/setPublicTas',
      payload: key,
    });
    setTabs(key);
    taskTypeCodeRef.current = key;
    // 隐藏任务到达时间
    console.log('--', key);
    handleReset();
  };


  /**
   * rowSelection 回调
   */
  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
      setSelectData(selectedRows);
      setSelectedRowKeys(selectedRowKeys);
      setBatchObj({ ...batchObj, [pageNum]: selectedRows });
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
    setField(field);
    setDirection(direction);
    handleGetListFetch(
      taskTypeCodeRef.current,
      pagination.pageSize,
      pagination.current,
      field,
      direction,
      searchData,
    );
  };

  // 批量操作
  const batchOperation = btn => {
    console.log('选中数据', selectData);
    const idList = [];
    selectData.forEach(item => {
      idList.push(item.id);
    });
    switch (btn) {
      case '提交':
        dispatch({
          type: 'capitalVerificationProcess/handleBatchSubmitByIndex',
          payload: idList,
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
      type: 'capitalVerificationProcess/handleBatchSubmitByIndex',
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

  // 展开搜索收起 查询
  const blurSearch = value => {
    keyWordsValue.current = value;
    handleGetListFetch(taskTypeCodeRef.current, 10, 1, '', '', searchData);
  };

  // 转换数组类型
  const transformData = (values, data) => {
    if (values[data] && !Array.isArray(values[data])) {
      values[data] = values[data].split(',');
    }
    return values;
  };

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
            <a
              style={{ marginRight: 10 }}
              onClick={() => {
                props.handlerBack(item.label, props.record);
              }}
            >
              {item.label}
            </a>
          );
        } else {
          button = (
            <Action code={item.code}>
              <a
                style={{ marginRight: 10 }}
                onClick={() => {
                  props.handlerBack(item.label, props.record);
                }}
              >
                {item.label}
              </a>
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
            <a
              className="ant-dropdown-link"
              onClick={e => {
                e.preventDefault();
              }}
            >
              更多
              <Icon type="caret-right" />
            </a>
          </Dropdown>
        );
      }
      return <span key={index}>{button}</span>;
    });
    return child;
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
      type: 'capitalVerificationProcess/handleGetBackMsg',
      payload: { proCode },
    }).then(data => {
      setFieldsValue({
        proCode: data.proCode,
      });
    });
  };

  /**
   * 根据不同的tabs生成不同的按钮
   * @param {*} record
   */
  const getActionBtn = (record, tabsCurrent) => {
    let buttonList = [];
    const { operStatusName } = record;
    switch (tabsCurrent) {
      case 'T001_1':
      case 'T001_4':
        switch (operStatusName) {
          case '待提交':
            buttonList = [
              { label: '修改', code: 'capitalVerificationProcess:edit' },
              { label: '复制', code: 'capitalVerificationProcess:copy' },
              { label: '提交', code: 'capitalVerificationProcess:submit' },
              // { label: '流程图', code: 'capitalVerificationProcess:chart' },
            ];
            break;
          case '流程中':
            buttonList = [
              { label: '办理', code: 'capitalVerificationProcess:handle' },
              { label: '流转历史', code: 'capitalVerificationProcess:history' },
              // {
              //   label: '更多',
              //   code: 'capitalVerificationProcess:more',
              //   type: 'more',
              //   list: ['认领', '委托', '退回', '移交', '传阅', '撤销'],
              // },
            ];
            break;
          case '已结束':
            buttonList = [
              {
                label: '详情',
                code: 'capitalVerificationProcess:view',
              },
              {
                label: '流转历史',
                code: 'capitalVerificationProcess:history',
              },
            ];
            break;
        }
        break;
      default:
        buttonList = [
          {
            label: '详情',
            code: 'capitalVerificationProcess:view',
          },
          {
            label: '流转历史',
            code: 'capitalVerificationProcess:history',
          },
        ];

        break;
    }
    if (operStatusName === '流程中') {
      if (record.revoke + '' === '1') {
        buttonList.push({ label: '撤销', code: 'capitalVerificationProcess:cancel' });
      }
    }
    if (operStatusName === '待提交') {
      buttonList.push({ label: '删除', code: 'capitalVerificationProcess:delete' });
    }
    if (tabsCurrent === 'T001_1' && record.circulateFlag === '0') {
      buttonList = [{ label: '审阅', code: 'lookOver' }];
    }
    return buttonList;
  };

  /**
   * 为操作列表按钮，绑定事件
   * @param {*} label
   * @param {*} record
   */
  const handleEdit = (label, record) => {
    const { id } = record;
    const { proCode } = record;
    const { taskId, processDefinitionId, processInstanceId, taskDefinitionKey } = record;
    const params = {
      taskId,
      processDefinitionId,
      processInstanceId,
      taskDefinitionKey,
      mode: 'modify',
      id,
      proCode,
    };

    const url = `/processCenter/processHistory?processInstanceId=${record.processInstanceId}`;
    switch (label) {
      case '详情':
        const info = { processInstanceId, nodeId: params.taskDefinitionKey, taskId };
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
        // dispatch();
        // routerRedux.push({
        //   pathname: routerPath.toSave,
        //   query: { processInstanceId, proCode },
        // }),
        fnLink(
          'capitalVerificationProcess:edit',
          `?processInstanceId=${processInstanceId}&proCode=${proCode}`,
        );
        break;
      case '复制':
        // dispatch();
        // routerRedux.push({
        //   pathname: routerPath.toSave,
        //   query: { processInstanceId, proCode },
        // }),
        fnLink('capitalVerificationProcess:copy', `?processInstanceId=${record.processInstanceId}`);
        break;
      case '提交':
        // dispatch(
        //   routerRedux.push({
        //     pathname: routerPath.toSave,
        //     query: { processInstanceId, proCode },
        //   }),
        // );
        fnLink(
          'capitalVerificationProcess:submit',
          `?processInstanceId=${processInstanceId}&proCode=${proCode}`,
        );
        break;
      case '办理':
        if (
          !record.id ||
          !record.taskId ||
          !record.processDefinitionId ||
          !record.processInstanceId ||
          !record.taskDefinitionKey ||
          !record.proCode
        ) {
          message.warning('数据不正确，无法跳转');
          return;
        }
        params.mode = 'deal';
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
              type: 'capitalVerificationProcess/handleRevoke',
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
        Modal.confirm({
          title: '请确认是否删除?',
          okText: '确认',
          cancelText: '取消',
          onOk: () => {
            dispatch({
              type: 'capitalVerificationProcess/handleDelete',
              payload: record.id.split(','),
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

  /**
   * table组件
   */
  const tableCom = () => {
    return (
      <Table
        rowKey={'id'}
        loading={listLoading}
        dataSource={saveListFetch.taskList}
        columns={columns}
        pagination={paginationProps}
        onChange={handlePaginationChange}
        scroll={{ x: columns.length * 200 + 200 }}
        rowSelection={{
          type: 'checkbox',
          selectedRowKeys: selectedRowKeys,
          ...rowSelection,
        }}
      />
    );
  };

  // 发起流程
  const extractContent = () => {
    return (
      <Action code="capitalVerificationProcess:link">
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

  //
  const linkToAdd = () => {
    // dispatch(
    //   routerRedux.push({
    //     pathname: routerPath.toSave,
    //   }),
    // );
    fnLink('capitalVerificationProcess:link', '');
  };
  // 条件查询配置
  const formItemData = [
    {
      name: 'proCode',
      label: '产品全称',
      type: 'select',
      readSet: { name: 'proName', code: 'proCode', bracket: 'proCode' },
      config: { mode: 'multiple', maxTagCount: 1 },
      option: saveProductSelection,
    },
    {
      name: 'proType',
      label: '产品类型',
      type: 'select',
      readSet: { name: 'name', code: 'code' },
      config: { mode: 'multiple', maxTagCount: 1 },
      option: saveWordDictionaryFetch.A002,
    },
    {
      name: 'investmentManager',
      label: '投资经理',
      type: 'select',
      readSet: { name: 'name', code: 'empNo' },
      config: { mode: 'multiple', maxTagCount: 1 },
      option: investManagerNameList,
    },
    {
      name: 'orgId',
      label: '验资机构名称',
      type: 'select',
      readSet: { name: 'orgName', code: 'id', bracket: 'id' },
      config: { mode: 'multiple', maxTagCount: 1 },
      option: saveOrganization,
    },
    {
      name: 'status',
      label: '状态',
      type: 'select',
      readSet: { name: 'name', code: 'code' },
      config: { mode: 'multiple', maxTagCount: 1 },
      option: saveWordDictionaryFetch.S001,
    },
  ];

  const callBackHandler=(value)=>{
    setColumns(value);
  }
  return (
    <>
      <List
        pageCode="capitalVerificationProcess"
        dynamicHeaderCallback={callBackHandler}
        columns={columns}
        taskTypeCode={publicTas}
        taskArrivalTimeKey={publicTas === 'T001_4' ? 'createTime' : 'taskArriveTime'}
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
            {tabs === 'T001_1' && <> {tableCom()} </>}
            {tabs === 'T001_3' && <> {tableCom()} </>}
            {tabs === 'T001_4' && <> {tableCom()} </>}
            {tabs === 'T001_5' && <> {tableCom()} </>}
            <div className={styles.batchBtn}>
              <MoreOperation
                opertations={{
                  tabs: taskTypeCodeRef.current,
                  statusKey: 'operStatus',
                }}
                batchStyles={{ marginLeft: '38px', marginTop: '-77px', float: 'left' }}
                fn={handleGetSearchFetch}
                type="batch"
                batchList={selectData}
                submitCallback={handlerBatchSubmit}
                successCallback={handlerSuccessCallback}
              />
            </div>
          </>
        }
      />
    </>
  );
};

const WrappedIndexForm = errorBoundary(
  linkHoc()(
    Form.create()(
      connect(({ capitalVerificationProcess, loading, publicModel: { publicTas } }) => ({
        capitalVerificationProcess,
        publicTas,
        listLoading: loading.effects['capitalVerificationProcess/handleListFetch'],
      }))(Index),
    ),
  ),
);

export default WrappedIndexForm;
