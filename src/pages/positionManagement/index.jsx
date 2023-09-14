import React, { useEffect, useState } from 'react';
import { connect } from 'dva';
import { errorBoundary } from '@/layouts/ErrorBoundary';
import styles from './index.less';
import {
  Button,
  Col,
  Dropdown,
  Form,
  Icon,
  Input,
  Menu,
  message,
  Modal,
  Popconfirm,
  Radio,
  Row,
  Tag,
} from 'antd';
import { handleTableCss } from '@/pages/manuscriptBasic/func';
import Action, { ActionBool } from '@/utils/hocUtil';
import { utilsCodeToName } from '@/utils/utils';
import { Table } from '@/components';
import List from '@/components/List';

const dirCode = 'attributionSystem,SysUserType,authorizationStrategy,roleName';

const formItemLayout = {
  labelCol: {
    xs: { span: 4 },
    sm: { span: 4 },
  },
  wrapperCol: {
    xs: { span: 16 },
    sm: { span: 16 },
  },
};

const PositionManagement = ({
  dispatch,
  positionManagement: {
    saveList,
    saveDictList: { attributionSystem },
    savePositionDetail,
  },
  workSpace: { GET_USER_SYSID },
  fetchLoading,
  saveLoading,
  updateLoading,
  handleGetRoleLoading,
  form: { getFieldDecorator, validateFields, resetFields },
}) => {
  const [authModal, setAuthModal] = useState(false);
  const [viewType, setViewType] = useState(false);
  const [viewTitle, setViewTitle] = useState('新建岗位');
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectedRowsIdStr, setSelectedRowsIdStr] = useState([]);
  const [baseInfo, setBaseInfo] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [queryStr, setQueryStr] = useState('');
  
  useEffect(() => {
    if (dispatch) {
      dispatch({
        type: 'workSpace/GET_USER_SYSID_FETCH',
      });
      dispatch({
        type: 'positionManagement/handleGetDictList',
        payload: { codeList: dirCode },
      });
    }
  }, [dispatch]);

  useEffect(() => {
    handleList();
  }, [currentPage, pageSize, queryStr]);

  // 删除
  const handleDelete = record => {
    dispatch({
      type: `positionManagement/handleDelete`,
      payload: { sysId: record.sysId, id: record.id },
    }).then(res => {
      if (res && res.status === 200) {
        handleList();
      }
    });
  };

  const handleList = params => {
    dispatch({
      type: 'positionManagement/fetch',
      payload: {
        currentPage,
        pageSize,
        name: queryStr,
        ...params,
      },
    });
  };

  // 新建角色
  const handleNewMember = () => {
    // 查看模式
    setViewTitle('新建岗位');
    setViewType(false);
    setAuthModal(true);
    // 重置详情数据
    dispatch({
      type: 'positionManagement/savePositionDetail',
      payload: {},
    });
    dispatch({
      type: 'positionManagement/saveRoleList',
      payload: [],
    });
  };

  // 复核，反复核
  const handleReview = ({ record, check }) =>
    dispatch({
      type: 'positionManagement/handleRoleReview',
      payload: { ids: record.id, check },
    }).then(res => {
      if (res && res.status === 200) {
        handleList();
      }
    });

  // 批量操作
  const handleMenuClick = e => {
    if (selectedRows.length === 0) {
      message.warn('请至少选择一个，再进行操作');
      return;
    }
    // 删除
    if (e.key === '0') {
      handleDelete({
        id: selectedRowsIdStr,
      });
      return;
    }
    // 复核
    if (e.key === '1') {
      handleReview({
        record: {
          id: selectedRowsIdStr,
        },
        check: 1,
      });
      return;
    }
    // 反复核
    if (e.key === '2') {
      handleReview({
        record: {
          id: selectedRowsIdStr,
        },
        check: 0,
      });
      return;
    }
    handleDelete(selectedRowsIdStr);
    setSelectedRows([]);
    setSelectedRowsIdStr([]);
  };

  const handleSelectRows = rows => {
    setSelectedRows(rows);
    setSelectedRowsIdStr(rows.join());
  };

  // 修改
  const handleShowDrawer = (record, viewType) => {
    if (viewType) {
      setViewTitle('查看岗位');
    } else {
      setViewTitle('修改岗位');
    }
    // 查看模式
    setViewType(viewType);
    // 显示弹框
    setAuthModal(true);
    // 存储列数据
    setBaseInfo(record);
    // 岗位详情
    dispatch({
      type: 'positionManagement/fetchPositionDetail',
      payload: { id: record.id },
    });
  };

  // columns
  const columns = [
    {
      title: '岗位名称',
      dataIndex: 'name',
      key: 'name',
      width: 300
    },
    {
      title: '归属系统',
      dataIndex: 'sysId',
      key: 'sysId',
      render: (_, { sysId }) => handleTableCss(utilsCodeToName(attributionSystem, sysId, 'name')),
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
    },
    {
      title: '状态',
      dataIndex: 'checked',
      key: 'checked',
      render: (text, { checked }) => {
        if (checked === 0) {
          return <Tag color="red">待审核</Tag>;
        }
        if (checked === 1) {
          return <Tag color="green">已生效</Tag>;
        }
        return '-';
      },
    },
    {
      title: '操作',
      dataIndex: 'operating',
      key: 'operating',
      align: 'center',
      render: (_, record) => [
        <span key={record.id} className={styles.handleStyle }>
          <a onClick={() => handleShowDrawer(record, true)}>查看</a>
        </span>,
        <Action key="positionManagement:modify" code="positionManagement:modify">
          {record.checked === 0 && (
            <span className={styles.handleStyle }>
              <a onClick={() => handleShowDrawer(record, false)}>修改</a>
            </span>
          )}
        </Action>,
        <Action key="positionManagement:review" code="positionManagement:review">
          {record.checked === 0 && (
            <span className={styles.handleStyle }>
              <a onClick={() => handleReview({ record, check: 1 })}>复核</a>
            </span>
          )}
          {record.checked === 1 && (
            <span className={styles.handleStyle }>
              <a onClick={() => handleReview({ record, check: 0 })}>反复核</a>
            </span>
          )}
        </Action>,
        <Action key="positionManagement:delete" code="positionManagement:delete">
          {record.checked === 0 && (
            <span className={styles.handleStyle }>
              <Popconfirm title="确认删除吗?" onConfirm={() => handleDelete(record)}>
                <a>删除</a>
              </Popconfirm>
            </span>
          )}
        </Action>,
      ],
    },
  ];

  const rowSelection = {
    selectedRows,
    onChange: handleSelectRows,
  };

  const paginationProps = {
    showSizeChanger: true,
    showQuickJumper: true,
    total: saveList.total,
    current: currentPage,
    showTotal: total => {
      return `共 ${total} 条`;
    },
  };

  // 分页
  const handleStandardTableChange = ({ current, pageSize }) => {
    setCurrentPage(current);
    setPageSize(pageSize);
  };

  const handleDealSelectMap = (
    data,
    Com,
    changeHandle = () => {},
    key = 'code',
    value = 'code',
    name = 'name',
    style = {},
  ) => {
    return (
      data &&
      data.length !== 0 &&
      Array.isArray(data) &&
      data.map(i => {
        return (
          <Com key={i[key]} value={i[value]} onChange={changeHandle} style={style}>
            {i[name]}
          </Com>
        );
      })
    );
  };

  // 提交(新增/修改) 岗位
  const handleSubmit = () => {
    validateFields((err, values) => {
      if (!err) {
        // 如果存在岗位信息就是修改
        if (baseInfo.id) {
          dispatch({
            type: 'positionManagement/handleUpdatePosition',
            payload: {
              ...values,
              id: baseInfo.id,
              roleIds: values.roleIds,
              sysId: values.sysId,
            },
          }).then(res => {
            if (res && res.status === 200) {
              setAuthModal(false);
              handleList();
            }
          });
        } else {
          // 不存在岗位信息就是新增
          dispatch({
            type: 'positionManagement/handleSavePosition',
            payload: {
              sysId: values.roleIds,
              ...values,
              roleIds: values.roleIds,
            },
          }).then(res => {
            if (res && res.status === 200) {
              setAuthModal(false);
              handleList();
            }
          });
        }
      }
    });
  };

  const formItemData = [
    {
      name: 'name',
      label: '岗位名称',
      type: 'input',
    },
    {
      name: 'sysId',
      label: '归属系统',
      type: 'select',
      option: attributionSystem,
    },
  ];

  return (
    <div className={styles.base}>
      <List
        formItemData={formItemData}
        // 查询按钮
        advancSearch={handleList}
        searchPlaceholder="请输入岗位名称"
        // 模糊查询
        fuzzySearch={e => setQueryStr(e)}
        loading={fetchLoading}
        resetFn={() => {
          resetFields();
          setCurrentPage(1);
          setPageSize(10);
          setQueryStr('');
          handleList();
        }}
        extra={
          <Action key="positionManagement:add" code="positionManagement:add">
            <Button onClick={handleNewMember} type="primary">
              新建岗位
            </Button>
          </Action>
        }
        tableList={
          <>
            <Table
              rowKey={record => record.id}
              bordered={false}
              columns={columns}
              dataSource={saveList.dataList}
              loading={saveLoading || updateLoading || fetchLoading}
              onChange={handleStandardTableChange}
              rowSelection={rowSelection}
              pagination={paginationProps}
            />
            <div className={styles.addStyle }>
              <Dropdown
                overlay={
                  <Menu onClick={handleMenuClick}>
                    {ActionBool('positionManagement:delete') && (
                      <Menu.Item key="0">删除</Menu.Item>
                    )}
                    {ActionBool('positionManagement:review') && [
                      <Menu.Item key="1">复核</Menu.Item>,
                      <Menu.Item key="2">反复核</Menu.Item>,
                    ]}
                  </Menu>
                }
                placement="topLeft"
              >
                <Button className={styles.butStyle }>
                  批量操作
                  <Icon type="up" />
                </Button>
              </Dropdown>
            </div>
          </>
        }
      />

      <Modal
        title={viewTitle}
        visible={authModal}
        onOk={handleSubmit}
        onCancel={() => setAuthModal(false)}
        width={'70%'}
        destroyOnClose
        loading={handleGetRoleLoading}
      >
        <Form {...formItemLayout}>
          <Row>
            <Col md={24} sm={24}>
              <Form.Item label={<span>归属系统</span>}>
                {getFieldDecorator('sysId', {
                  initialValue: `${savePositionDetail.sysId || ''}`,
                  rules: [{ required: true, message: '请选择归属系统' }],
                })(
                  <Radio.Group disabled={viewType}>
                    {handleDealSelectMap(
                      attributionSystem?.filter(item => GET_USER_SYSID.includes(item.code)),
                      Radio,
                    )}
                  </Radio.Group>,
                )}
              </Form.Item>
            </Col>
            <Col md={24} sm={24}>
              <Form.Item label="岗位名称">
                {getFieldDecorator('name', {
                  rules: [
                    {
                      required: true,
                      message: '请输入岗位名称',
                    },
                  ],
                  initialValue: savePositionDetail.name,
                })(<Input placeholder="请输入" allowClear disabled={viewType} />)}
              </Form.Item>
            </Col>
            <Col md={24} sm={24}>
              <Form.Item label="岗位描述">
                {getFieldDecorator('remark', {
                  initialValue: savePositionDetail.remark,
                })(<Input placeholder="请输入" allowClear disabled={viewType} maxLength={50} />)}
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
};

export default errorBoundary(
  Form.create()(
    connect(({ workSpace, loading, positionManagement }) => ({
      workSpace,
      positionManagement,
      fetchLoading: loading.effects['positionManagement/fetch'],
      saveLoading: loading.effects['positionManagement/handleSavePosition'],
      updateLoading: loading.effects['positionManagement/handleUpdatePosition'],
      handleGetRoleLoading: loading.effects['positionManagement/handleGetRole'],
    }))(PositionManagement),
  ),
);
