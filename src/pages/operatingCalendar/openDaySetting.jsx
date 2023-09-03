import React, { useEffect, useState } from 'react';
import {
  Form,
  Row,
  Col,
  Select,
  Button,
  DatePicker,
  Divider,
  Table,
  Pagination,
  Modal,
} from 'antd';
import { connect } from 'dva';
import router from 'umi/router';
import { errorBoundary } from '@/layouts/ErrorBoundary';
import { Card, PageContainers } from '@/components';
import moment from 'moment';

const Index = ({
  dispatch,
  listLoading,
  productAllNameList,
  openStateList,
  currentUser: { id, username },
  form: { getFieldDecorator, validateFields, resetFields, getFieldValue, setFieldsValue },
}) => {
  // 获取列表接口入参
  const [pagination, setPagination] = useState({
    pageNum: 1,
    pageSize: 10,
  });
  // 列表数据总条数
  const [pageTotal, setTotal] = useState(0);
  // 列表数据
  const [dataSource, setDataSource] = useState([]);

  // 获取产品全称下拉列表
  const getProNameAndCodeList = () => {
    dispatch({
      type: 'operatingCalendar/getProNameAndCodeList',
    });
  };

  // 获取开放状态下拉列表
  const getOpenStateList = () => {
    dispatch({
      type: 'operatingCalendar/getOpenStateList',
    });
  };

  // 获取表格列表数据
  const getTableList = () => {
    setTotal(0);
    dispatch({
      type: 'operatingCalendar/queryProductPeriodInfoList',
      payload: pagination,
      callback: res => {
        const { list, total } = res.data;
        setDataSource(list || []);
        setTotal(total || 0);
      },
    });
  };

  // 表单重置
  const handleReset = () => {
    resetFields();
  };

  // 刷新列表数据
  const refreshTableData = () => {
    if (pagination.pageNum === 1) {
      getTableList();
    } else {
      setPagination({
        ...pagination,
        pageNum: 1,
      });
    }
  };

  // 开放日设置新增
  const addProductPeriodInfo = formData => {
    const params = { ...formData, creatorId: id, creatorName: username };
    params.openStartDate = moment(params.openStartDate).format('YYYY-MM-DD');
    params.openEndDate = moment(params.openEndDate).format('YYYY-MM-DD');
    dispatch({
      type: 'operatingCalendar/addProductPeriodInfo',
      payload: params,
      callback: () => {
        // 新增成功后重置表单
        handleReset();
        // 新增成功后，刷新表格列表数据
        refreshTableData();
      },
    });
  };

  // 调用接口，删除表格数据
  const deleteOperation = record => {
    dispatch({
      type: 'operatingCalendar/delProductPeriodInfo',
      payload: record.id,
      callback: () => {
        // 新增成功后，刷新表格列表数据
        refreshTableData();
      },
    });
  };

  // 删除数据时进行示框
  const deleteRow = record => {
    Modal.confirm({
      title: '请确认是否删除？',
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        deleteOperation(record);
      },
    });
  };

  // 点击不同页码
  const changePageNum = page => {
    setPagination({
      ...pagination,
      pageNum: page,
    });
  };

  // 切换分页
  const changePageSize = size => {
    setPagination({
      ...pagination,
      pageNum: 1,
      pageSize: size,
    });
  };

  // 点击确定按钮
  const confirm = e => {
    e.preventDefault();
    validateFields((err, values) => {
      // 表单校验成功后，调用新增接口
      if (!err) {
        addProductPeriodInfo(values);
      }
    });
  };

  // 开放截至日期，必须小于开放起始日期
  const disabledOpenEndDate = current => {
    const openStartDate = getFieldValue('openStartDate');
    if (openStartDate) {
      const currentDate = moment(current).format('YYYY-MM-DD');
      const startDate = moment(openStartDate).format('YYYY-MM-DD');
      return currentDate && currentDate <= startDate;
    } else {
      return false;
    }
  };

  // 开放起始日期如果大于开放截至日期时，清空开放截至日期
  const onChangeOpenStartDate = current => {
    const openEndDate = getFieldValue('openEndDate');
    if (openEndDate && moment(openEndDate) <= moment(current)) {
      setFieldsValue({ openEndDate: null });
    }
  };

  // 初始化时调用下拉列表接口
  useEffect(() => {
    getProNameAndCodeList();
    getOpenStateList();
  }, []);

  // 获取表格数据
  useEffect(() => {
    getTableList();
  }, [pagination.pageNum, pagination.pageSize]);

  // 表头数据
  const columns = [
    {
      title: '产品全称',
      dataIndex: 'proName',
      key: 'proName',
      align: 'center',
      width: 400,
      fixed: 'left',
    },
    {
      title: '开放状态',
      dataIndex: 'openState',
      key: 'openState',
      align: 'center',
    },
    {
      title: '开放起始日期',
      dataIndex: 'openStartDate',
      key: 'openStartDate',
      align: 'center',
    },
    {
      title: '开放截至日期',
      dataIndex: 'openEndDate',
      key: 'openEndDate',
      align: 'center',
    },
    {
      title: '操作人员',
      dataIndex: 'creatorName',
      key: 'creatorName',
      align: 'center',
    },
    {
      title: '操作时间',
      dataIndex: 'createTime',
      key: 'time',
      align: 'createTime',
    },
    {
      title: '操作',
      key: 'del',
      width: '60',
      align: 'center',
      render: record => {
        return <a onClick={() => deleteRow(record)}>删除</a>;
      },
    },
  ];

  return (
    <PageContainers
      breadcrumb={[
        {
          title: '系统任务中心',
          url: '',
        },
        {
          title: '运营日历',
          url: '/taskCenter/operatingCalendar/index',
        },
        {
          title: '开放日设置',
          url: '',
        },
      ]}
    >
      <Card title="开放日设置">
        <Form labelAlign="right" labelCol={{ span: 7 }} wrapperCol={{ span: 16 }}>
          <Row gutter={24}>
            <Col span={8}>
              <Form.Item label="产品全称">
                {getFieldDecorator('proCode', {
                  rules: [{ required: true, message: '请选择产品全称' }],
                })(
                  <Select
                    placeholder="请选择产品全称"
                    allowClear
                    showSearch
                    optionFilterProp="children"
                  >
                    {productAllNameList.map(item => {
                      return (
                        <Select.Option
                          title={`${item.proName}(${item.proCode})`}
                          key={item.proCode}
                          value={item.proCode}
                        >
                          {item.proName}({item.proCode})
                        </Select.Option>
                      );
                    })}
                  </Select>,
                )}
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="开放期状态">
                {getFieldDecorator('openState', {
                  rules: [{ required: true, message: '请选择开放期状态' }],
                })(
                  <Select placeholder="请选择开放期状态" allowClear>
                    {openStateList.map(item => {
                      return (
                        <Select.Option title={`${item.name}`} key={item.code} value={item.code}>
                          {item.name}
                        </Select.Option>
                      );
                    })}
                  </Select>,
                )}
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="开放起始日期">
                {getFieldDecorator('openStartDate', {
                  rules: [{ required: true, message: '请选择开放起始日期' }],
                })(
                  <DatePicker
                    onChange={onChangeOpenStartDate}
                    format="YYYY-MM-DD"
                    style={{ width: '100%' }}
                  />,
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={27}>
            <Col span={8}>
              <Form.Item label="开放截至日期">
                {getFieldDecorator('openEndDate', {
                  rules: [{ required: true, message: '请选择开放截至日期' }],
                })(
                  <DatePicker
                    format="YYYY-MM-DD"
                    disabledDate={disabledOpenEndDate}
                    style={{ width: '100%' }}
                  />,
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={27}>
            <Col span={24} style={{ textAlign: 'center' }}>
              <Button type="primary" onClick={confirm}>
                确定
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={() => router.goBack()}>
                取消
              </Button>
            </Col>
          </Row>
        </Form>
        <Divider style={{ margin: '16px 0 12px' }} />
        <p>开放日设置列表</p>
        <Table
          rowKey="id"
          rowClassName={(record, index) => {
            let className = '';
            if (index % 2 === 1) className = 'bgcFBFCFF';
            return className;
          }}
          pagination={false}
          bordered
          dataSource={dataSource}
          columns={columns}
          loading={listLoading}
        />
        <div className="pagination-wrapper">
          <Pagination
            showSizeChanger
            style={{ marginTop: '16px', float: 'right' }}
            total={pageTotal}
            showTotal={total => `共 ${total} 条数据`}
            pageSize={pagination.pageSize}
            current={pagination.pageNum}
            onChange={page => changePageNum(page)}
            onShowSizeChange={(current, size) => changePageSize(size)}
          />
        </div>
      </Card>
    </PageContainers>
  );
};

export default errorBoundary(
  Form.create()(
    connect(
      ({ user, loading, dispatch, operatingCalendar: { productAllNameList, openStateList } }) => ({
        dispatch,
        productAllNameList,
        openStateList,
        currentUser: user.currentUser,
        listLoading: loading.effects['operatingCalendar/getProNameAndCodeList'],
      }),
    )(Index),
  ),
);
