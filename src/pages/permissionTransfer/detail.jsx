import React, { useEffect, useState, useRef } from 'react';
import { connect } from 'dva';
import { router } from 'umi';
import { Button, Form, Tooltip, Select, Modal, message } from 'antd';
import { Table } from '@/components';
import { Card, PageContainers } from '@/components';
import CustomFormItem from '@/components/AdvancSearch/CustomFormItem';
import { getPaginationConfig } from '@/pages/investorReview/func';
import { cloneDeep } from 'lodash';
import moment from 'moment';

const { Option } = Select;

const defaultConfig = { disabled: true, placeholder: '' };
const titleEnum = { add: '发起', modify: '修改', show: '查看' };
const Index = props => {
  const [taskPageNum, setTaskPagenum] = useState(1);
  const [taskPageSize, setTaskPageSize] = useState(10);
  const [selectedTaskRowKeys, setSelectedTaskRowKeys] = useState([]);

  const selectedTaskRowList = useRef([]);

  const [productPageNum, setProductPagenum] = useState(1);
  const [productPageSize, setProductPageSize] = useState(10);
  const [selectedProductRowKeys, setSelectedProductRowKeys] = useState([]);

  const selectedProductRowList = useRef([]);

  const [isModalVisible, setIsModalVisible] = useState(false);

  const taskPageObj = useRef({});
  const productPageObj = useRef({});

  const batchUserid = useRef('');
  const batchType = useRef('task');

  const [batchUserState, setBatchUserState] = useState('');

  const seqId = useRef('');

  const {
    form,
    dispatch,
    taskList,
    turnoverNum,
    turnoverTh,
    taskLoading,
    depUserList,
    leaderInfo,
    taskTotal,
    productTotal,
    productList,
    productLoading,
    pageDetail = {},
    location: {
      query: { type, id },
    },
    allUserList,
  } = props;

  const showConfig = { disabled: type == 'show' };

  useEffect(() => {
    if (type == 'add') {
      // 获取主键id
      dispatch({
        type: 'permissionTransfer/getSeq',
      }).then(res => {
        seqId.current = res;
      });

      // 获取交接编号
      dispatch({
        type: 'permissionTransfer/getTurnoverNum',
      });
    } else {
      // 获取详情
      dispatch({
        type: 'permissionTransfer/querybyid',
        payload: {
          id,
          coreModule: 'TAuthTurnover',
          listModule: ['TAuthTurnover', 'TTurnoverProduct', 'TTurnoverTask'].join(','),
        },
      }).then(res => {
        seqId.current = res?.TAuthTurnover?.id || '';
        res?.TTurnoverProduct?.map(item => {
          productPageObj.current[item.proCode] = {
            key: +item.receiveUser,
            obj: item,
          };
        });
        res?.TTurnoverTask?.map(item => {
          taskPageObj.current[item.taskId] = {
            key: +item.receiveUser,
            obj: item,
          };
        });
        form.setFieldsValue({
          receiveUser: getLabel(taskPageObj.current).concat(getLabel(productPageObj.current)),
        });
      });
    }
    // 获取交接事由字典
    dispatch({
      type: 'permissionTransfer/getDictQueryInfo',
      payload: {
        fcode: 'AUTH_TURNOVER_REASON',
      },
    });
    // 获取全量用户
    dispatch({
      type: 'permissionTransfer/getAllUserList',
      payload: {},
    });

    // 更具用户id获取用户信息
    const userInfo = JSON.parse(sessionStorage.getItem('USER_INFO'));
    dispatch({
      type: 'permissionTransfer/getUserVoByUserId',
      payload: {
        usercode: userInfo.usercode,
        currentPage: '1',
        pageSize: '1',
      },
    });
    // 根据部门id获取部门领导
    dispatch({
      type: 'permissionTransfer/getDeptLeaderByUserId',
      payload: {
        userId: userInfo.id,
      },
    });
  }, []);

  useEffect(() => {
    //   获取用户下的任务列表
    dispatch({
      type: 'permissionTransfer/getTaskListPage',
      payload: {
        pageNum: taskPageNum,
        pageSize: taskPageSize,
        taskType: 'T001_1',
      },
    });
  }, [taskPageNum, taskPageSize]);
  useEffect(() => {
    //   获取用户下的产品列表
    dispatch({
      type: 'permissionTransfer/getProductListPage',
      payload: {
        currPage: productPageNum,
        pageSize: productPageSize,
      },
    });
  }, [productPageNum, productPageSize]);

  const handleOk = () => {
    if (batchType.current == 'task') {
      selectedTaskRowList.current.map(item => {
        taskPageObj.current[item.taskId] = { key: batchUserid.current, obj: item };
      });
    } else {
      selectedProductRowList.current.map(item => {
        productPageObj.current[item.proCode] = { key: batchUserid.current, obj: item };
      });
    }
    form.setFieldsValue({
      receiveUser: getLabel(taskPageObj.current).concat(getLabel(productPageObj.current)),
    });
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const layout = {
    labelAlign: 'right',
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
  };

  const formItemData = [
    {
      name: 'code',
      label: '权限委托交接编号',
      type: 'input',
      width: 8,
      config: defaultConfig,
      initialValue: type == 'add' ? turnoverNum : pageDetail?.TAuthTurnover?.code,
    },
    {
      name: 'applyUser',
      label: '交接人',
      type: 'select',
      width: 8,
      config: defaultConfig,
      readSet: { name: 'username', code: 'id' },
      option: depUserList || [],
      initialValue:
        type == 'add'
          ? JSON.parse(sessionStorage.getItem('USER_INFO')).id + ''
          : pageDetail?.TAuthTurnover?.applyUser,
    },
    {
      name: 'receiveUser',
      label: '接收人',
      type: 'select',
      width: 8,
      rules: [{ required: true, message: '请选择接收人' }],
      readSet: { name: 'name', code: 'id' },
      config: { ...defaultConfig, mode: 'multiple', maxTagCount: 99 },
      option: allUserList || [],
    },
    {
      name: 'checkerId',
      label: '审批人',
      type: 'select',
      width: 8,
      readSet: { name: 'name', code: 'id' },
      config: defaultConfig,
      option: allUserList || [],
      initialValue: type == 'add' ? leaderInfo : pageDetail?.TAuthTurnover?.checkerId + '',
    },
    {
      name: 'turnoverReason',
      label: '交接事由',
      type: 'select',
      width: 8,
      rules: [{ required: true, message: '请选择交接事由' }],
      option: turnoverTh || [],
      initialValue: pageDetail?.TAuthTurnover?.turnoverReason,
      config: showConfig,
    },
    {
      name: 'turnoverDate',
      label: '交接时间',
      type: 'rangepicker',
      rules: [{ required: true, message: '请选择交接时间' }],
      width: 8,
      initialValue: [
        moment(pageDetail?.TAuthTurnover?.turnoverStartDate),
        moment(pageDetail?.TAuthTurnover?.turnoverEndDate),
      ],
      config: showConfig,
    },
  ];

  //   交接产品列表
  const productColumns = [
    // {
    //   key: 'index',
    //   dataIndex: 'index',
    //   width: 400,
    //   title: '序号',
    //   // render: columnTooltip,
    //   render: (proName, record) => {
    //     return (
    //       <Tooltip title={proName}>
    //         <span>{proName ? proName : '-'}</span>
    //       </Tooltip>
    //     );
    //   },
    //   ellipsis: true,
    //   sorter: true,
    // },
    {
      key: 'proName',
      dataIndex: 'proName',
      width: 400,
      title: '产品全称',
      // render: columnTooltip,
      render: (proName, record) => {
        return (
          <Tooltip title={proName}>
            <span>{proName ? proName : '-'}</span>
          </Tooltip>
        );
      },
      ellipsis: true,
      sorter: true,
    },
    {
      key: 'proCode',
      dataIndex: 'proCode',
      width: 400,
      title: '产品代码',
      // render: columnTooltip,
      render: (proName, record) => {
        return (
          <Tooltip title={proName}>
            <span>{proName ? proName : '-'}</span>
          </Tooltip>
        );
      },
      ellipsis: true,
      sorter: true,
    },
    {
      key: 'proTypeName',
      dataIndex: 'proTypeName',
      width: 400,
      title: '产品类型',
      // render: columnTooltip,
      render: (proName, record) => {
        return (
          <Tooltip title={proName}>
            <span>{proName ? proName : '-'}</span>
          </Tooltip>
        );
      },
      ellipsis: true,
      sorter: true,
    },
    {
      key: 'receiveUser',
      dataIndex: 'receiveUser',
      title: '接收人',
      // render: columnTooltip,
      render: (proName, record) => {
        return (
          <Select
            style={{ width: 120 }}
            allowClear
            onChange={value => {
              productUserChange(record, value);
            }}
            value={productPageObj.current[record.proCode]?.key || ''}
            {...showConfig}
          >
            {depUserList?.map(item => {
              return (
                <Option value={item.id} key={item.id}>
                  {item.username}
                </Option>
              );
            })}
          </Select>
        );
      },
    },
  ];

  //   交接任务列表
  const taskColumns = [
    {
      key: 'taskName',
      dataIndex: 'taskName',
      title: '任务名称',
      // render: columnTooltip,
      render: (proName, record) => {
        return (
          <Tooltip title={proName}>
            <span>{proName ? proName : '-'}</span>
          </Tooltip>
        );
      },
      ellipsis: true,
      sorter: true,
    },
    {
      key: 'subjectName',
      dataIndex: 'subjectName',
      title: '产品名称',
      // render: columnTooltip,
      render: (proName, record) => {
        return (
          <Tooltip title={proName}>
            <span>{proName ? proName : '-'}</span>
          </Tooltip>
        );
      },
      ellipsis: true,
      sorter: true,
    },
    {
      key: 'proName',
      dataIndex: 'proName',
      title: '任务类型',
      // render: columnTooltip,
      render: (proName, record) => {
        return (
          <Tooltip title={proName}>
            <span>{proName ? proName : '-'}</span>
          </Tooltip>
        );
      },
      ellipsis: true,
      sorter: true,
    },
    {
      key: 'taskStatus',
      dataIndex: 'taskStatus',
      title: '任务状态',
      // render: columnTooltip,
      render: (proName, record) => {
        return (
          <Tooltip title={proName}>
            <span>{proName ? proName : '-'}</span>
          </Tooltip>
        );
      },
      ellipsis: true,
      sorter: true,
    },
    {
      key: 'receiveUser',
      dataIndex: 'receiveUser',
      title: '接收人',
      // render: columnTooltip,
      render: (proName, record) => {
        return (
          <Select
            style={{ width: 120 }}
            allowClear
            onChange={value => {
              taskUserChange(record, value);
            }}
            value={taskPageObj.current[record.taskId]?.key || ''}
            {...showConfig}
          >
            {depUserList?.map(item => {
              return (
                <Option value={item.id} key={item.id}>
                  {item.username}
                </Option>
              );
            })}
          </Select>
        );
      },
    },
  ];

  /**
   *@description table选择框选择事件
   * @param {*} selectedRowKeys
   * @param rows
   */
  const onTaskSelectChange = (selectedRowKeys, rows) => {
    console.log(rows);
    setSelectedTaskRowKeys(selectedRowKeys);
    selectedTaskRowList.current = rows;
  };
  // 表格左边的选择框
  const taskRowSelection = {
    selectedRowKeys: selectedTaskRowKeys,
    onChange: onTaskSelectChange,
  };
  /**
   * @description table页码切换的回调
   * @param {object} _pagination 分页器的对象
   * @param {object} _filters 筛选的对象
   * @param {object} _sorter 排序的对象
   */
  const taskTableChange = (_pagination, _filters, _sorter) => {
    setTaskPagenum(_pagination.current);
    setTaskPageSize(_pagination.pageSize);
  };

  /**
   *@description table选择框选择事件
   * @param {*} selectedRowKeys
   * @param rows
   */
  const onProductSelectChange = (selectedRowKeys, rows) => {
    console.log(selectedRowKeys);
    setSelectedProductRowKeys(selectedRowKeys);
    selectedProductRowList.current = rows;
  };
  // 表格左边的选择框
  const productRowSelection = {
    selectedRowKeys: selectedProductRowKeys,
    onChange: onProductSelectChange,
  };
  /**
   * @description table页码切换的回调
   * @param {object} _pagination 分页器的对象
   * @param {object} _filters 筛选的对象
   * @param {object} _sorter 排序的对象
   */
  const productTableChange = (_pagination, _filters, _sorter) => {
    setProductPagenum(_pagination.current);
    setProductPageSize(_pagination.pageSize);
  };

  const getLabel = obj => {
    return Array.from(new Set(Object.values(obj).map(item => item.key + '')));
  };

  const taskUserChange = (record, selectId) => {
    taskPageObj.current[record.taskId] = { key: selectId, obj: record };
    if (!selectId) {
      delete taskPageObj.current[record.taskId];
    }

    form.setFieldsValue({
      receiveUser: getLabel(taskPageObj.current).concat(getLabel(productPageObj.current)),
    });
  };

  const productUserChange = (record, selectId) => {
    productPageObj.current[record.proCode] = { key: selectId, obj: record };
    if (!selectId) {
      delete productPageObj.current[record.proCode];
    }
    console.log(productPageObj.current);
    form.setFieldsValue({
      receiveUser: getLabel(taskPageObj.current).concat(getLabel(productPageObj.current)),
    });
  };

  const submitHandler = () => {
    form.validateFields((err, values) => {
      if (err) return;
      const tempValue = cloneDeep(values);
      tempValue.turnoverStartDate = values.turnoverDate[0].format('YYYY-MM-DD');
      tempValue.turnoverEndDate = values.turnoverDate[1].format('YYYY-MM-DD');
      delete tempValue.turnoverDate;
      tempValue.id = seqId.current;

      if (type == 'add') {
        tempValue.turnoverStatus = 3;
        tempValue.checked = 'D001_1';
      }

      tempValue.receiveUsers = getLabel(taskPageObj.current)
        .concat(getLabel(productPageObj.current))
        .join(',');

      const tempTaskList = Object.values(taskPageObj.current).map(item => {
        const {
          taskName,
          taskId,
          taskStatus,
          subjectCode,
          subjectName,
          proCode,
          proName,
        } = item.obj;
        return {
          turnoverId: seqId.current,
          taskName,
          taskId,
          taskStatus,
          taskType: '',
          receiveUser: taskPageObj.current[taskId].key,
          proCode: subjectCode || proCode,
          proName: subjectName || proName,
        };
      });
      const tempProductList = Object.values(productPageObj.current).map(item => {
        const { proCode, proName } = item.obj;
        return {
          turnoverId: seqId.current,
          receiveUser: productPageObj.current[proCode].key,
          proCode,
          proName,
        };
      });
      const tempPayload = {
        coreModule: 'TAuthTurnover',
        listModule: ['TAuthTurnover', 'TTurnoverProduct', 'TTurnoverTask'],
        ignoreTable: [],
        TAuthTurnover: { ...tempValue },
        TTurnoverProduct: tempProductList,
        TTurnoverTask: tempTaskList,
      };
      if (type == 'add') {
        dispatch({
          type: 'permissionTransfer/addTask',
          payload: tempPayload,
        }).then(res => {
          if (!res) return;
          router.goBack();
        });
      } else {
        dispatch({
          type: 'permissionTransfer/updateTask',
          payload: tempPayload,
        }).then(res => {
          if (!res) return;
          router.goBack();
        });
      }
    });
  };

  return (
    <>
      <PageContainers
        breadcrumb={[
          { title: '权限委托交接', url: '' },
          {
            title: '权限委托交接',
            url: '/productDataManage/stakeholderInfoManager/index',
          },
          { title: '交接申请' + titleEnum[type], url: '' },
        ]}
      ></PageContainers>
      <Card
        title={<p style={{ fontSize: '20px' }}>权限委托交接</p>}
        extra={
          <>
            <Button
              style={{ marginRight: '10px' }}
              onClick={() => {
                router.goBack();
              }}
            >
              取消
            </Button>
            {type != 'show' && (
              <Button type="primary" onClick={submitHandler}>
                提交
              </Button>
            )}
          </>
        }
      >
        <div style={{ display: 'block', width: '100%' }}>
          <h1 style={{ fontSize: 16, marginTop: '20px' }}>交接基本信息</h1>
          <Form {...layout}>
            <CustomFormItem formItemList={formItemData} form={form} />
          </Form>
        </div>
        <h1 style={{ fontSize: 16, marginTop: '20px', clear: 'both' }}>交接产品列表</h1>
        <Button
          style={{ float: 'right', marginBottom: '10px', zIndex: '88' }}
          onClick={() => {
            if (selectedProductRowKeys.length <= 0) {
              message.error('请先选择要交接的产品!');
              return;
            }
            batchType.current = 'product';
            batchUserid.current = null;
            setBatchUserState('');
            setIsModalVisible(true);
          }}
          {...showConfig}
        >
          批量交接
        </Button>
        <Table
          rowKey="proCode"
          rowSelection={productRowSelection}
          dataSource={productList}
          columns={productColumns}
          pagination={false}
          scroll={{ x: 1500 }}
          loading={productLoading}
          pagination={getPaginationConfig(productTotal, productPageSize, {
            current: productPageNum,
          })}
          onChange={productTableChange}
        />
        <h1 style={{ fontSize: 16, marginTop: '20px' }}>交接任务列表</h1>
        <Button
          style={{ float: 'right', marginBottom: '10px', zIndex: '88' }}
          onClick={() => {
            if (selectedTaskRowKeys.length <= 0) {
              message.error('请先选择要交接的任务!');
              return;
            }
            batchType.current = 'task';
            batchUserid.current = null;
            setBatchUserState('');
            setIsModalVisible(true);
          }}
          {...showConfig}
        >
          批量交接
        </Button>
        <Table
          rowKey="taskId"
          rowSelection={taskRowSelection}
          dataSource={taskList}
          columns={taskColumns}
          pagination={false}
          scroll={{ x: 1500 }}
          loading={taskLoading}
          pagination={getPaginationConfig(taskTotal, taskPageSize, {
            current: taskPageNum,
          })}
          onChange={taskTableChange}
        />
      </Card>
      <Modal title="批量交接" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
        <label>接收人:</label>
        <Select
          style={{ width: '85%', marginLeft: '20px' }}
          allowClear
          onChange={value => {
            batchUserid.current = value;
            setBatchUserState(value);
          }}
          destroyOnClose
          value={batchUserState}
        >
          {depUserList?.map(item => {
            return (
              <Option value={item.id} key={item.id}>
                {item.username}
              </Option>
            );
          })}
        </Select>
      </Modal>
    </>
  );
};

const data = state => {
  const {
    permissionTransfer: {
      taskList,
      turnoverNum,
      turnoverTh,
      depUserList,
      leaderInfo,
      taskTotal,
      productTotal,
      productList,
      pageDetail,
      allUserList,
    },
    dispatch,
    loading,
  } = state;
  return {
    turnoverNum,
    taskList,
    dispatch,
    turnoverTh,
    depUserList,
    leaderInfo,
    taskTotal,
    productTotal,
    productList,
    pageDetail,
    allUserList,
    taskLoading: loading.effects['permissionTransfer/getTaskListPage'],
    productLoading: loading.effects['permissionTransfer/getProductListPage'],
  };
};

export default Form.create()(connect(data)(Index));
