import React, { SetStateAction, useEffect, useState, useCallback, ReactNode } from 'react';
import { Dispatch } from 'redux';
import { errorBoundary } from '@/layouts/ErrorBoundary';
import { Form, Modal, Switch, Select } from 'antd';
import { connect } from 'dva';
import { MessageTodoState } from '@/models/messageTodo';
import { handleTableCss } from '@/utils/utils';
import { handleMapSelectOption } from '../util';
import { ResizeableTable } from '@/components';
import styles from '../index.less';

const { Option } = Select;

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

interface ReminderStrategyProps {
  dispatch: Dispatch;
  listLoading?: boolean;
  messageTodo: MessageTodoState;
  handleBatchBtnState: Function;
  handleEditModalState: Function;
  form: any;
}

const ReminderStrategy = ({
  listLoading,
  messageTodo: { saveList },
  dispatch,
  form: { getFieldDecorator },
  handleBatchBtnState,
  handleEditModalState,
}: ReminderStrategyProps) => {
  // 分页 hook
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState(10);
  // 选中列 hook
  const [selectedRows, setSelectedRows] = useState<any[]>([]);
  // 选中列key hook
  const [selectedRowKeys, setSelectedRowKeys] = useState<number[]>([]);
  // 查询字符串 hook
  const [queryStr, setQueryStr] = useState<string>('');
  // 查询表单 hook
  const [searchForm, setSearchForm] = useState<any>({});
  // 编辑弹框 hook
  const [editModal, setEditModal] = useState<boolean>(false);

  /**
   * 是否启用switch onchange
   * @param {} item
   */
  const handleSwitchOchange = (item: any) => {
    console.log('item', item);
  };

  /**
   * 点击编辑开启弹框
   */
  const handleEdit = (record: any) => {
    // setEditModal(true);
    handleEditModalState(record);
  };

  // table columns
  const columns = [
    {
      title: '事项名称',
      dataIndex: 'name',
      key: 'name',
      width: 200,
      render: (text: string) => handleTableCss(text),
    },
    {
      title: '事项分类',
      dataIndex: 'type',
      key: 'type',
      align: 'center',
      width: 100,
      render: (text: string) => handleTableCss(text),
    },
    {
      title: '提醒内容',
      dataIndex: 'content',
      key: 'content',
      width: 250,
      render: (text: string) => handleTableCss(text),
    },
    {
      title: '触发机制(T)',
      dataIndex: 'mechanism',
      key: 'mechanism',
      width: 120,
      align: 'center',
    },
    {
      title: '开始提醒',
      dataIndex: 'stime',
      key: 'stime',
      align: 'center',
      width: 100,
      render: (text: string) => handleTableCss(text),
    },
    {
      title: '结束提醒',
      dataIndex: 'etime',
      key: 'etime',
      align: 'center',
      width: 100,
    },
    {
      title: '提醒方式',
      dataIndex: 'method',
      key: 'method',
      align: 'center',
      width: 100,
      render: (text: string) => handleTableCss(text),
    },
    {
      title: '提醒频率',
      dataIndex: 'frequency',
      key: 'frequency',
      align: 'center',
      width: 100,
      render: (text: string) => handleTableCss(text),
    },
    {
      title: '是否启用', // 0close 1 open 2 Forced open
      dataIndex: 'whether',
      key: 'whether',
      align: 'center',
      width: 100,
      render: (text: string, record: any): ReactNode => {
        if (record.whether === 2) {
          return <Switch onChange={handleSwitchOchange} disabled={true} defaultChecked />;
        }
        if (record.whether === 1) {
          return <Switch onChange={handleSwitchOchange} />;
        }
        if (record.whether === 0) {
          return <Switch onChange={handleSwitchOchange} />;
        }
        return '';
      },
    },
    {
      title: '操作',
      dataIndex: 'operating',
      key: 'operating',
      width: '150px',
      align: 'center',
      fixed: 'right',
      render: (text: string, record: any) => {
        return (
          <span>
            <span style={{ margin: 5 }} onClick={() => handleEdit(record)}>
              <a>编辑</a>
            </span>
            <span style={{ margin: 5 }}>
              <a style={{ color: '#D9001B' }}>删除</a>
            </span>
          </span>
        );
      },
    },
  ];

  // 列表请求
  const handleList = useCallback(() => {
    dispatch({
      type: `messageTodo/fetch`,
      payload: {
        currentPage,
        pageSize,
        queryStr,
        ...searchForm,
      },
    });
  }, [currentPage, dispatch, pageSize, queryStr, searchForm]);

  useEffect(() => {
    handleList();
  }, [currentPage, handleList, pageSize, queryStr, searchForm]);

  // checkbox框
  const rowSelection = {
    selectedRowKeys,
    onChange: (
      selectedRowKeys: SetStateAction<number[]>,
      selectedRows: SetStateAction<any[]>,
    ): void => {
      console.log('selectedRowKeys', selectedRowKeys);
      console.log('selectedRows', selectedRows);
      setSelectedRowKeys(selectedRowKeys);
      setSelectedRows(selectedRows);
      handleBatchBtnState(selectedRowKeys.length > 0 ? false : true);

    },
  };

  // 分页
  const handleStandardTableChange = ({
    current,
    pageSize,
  }: {
    current: number;
    pageSize: number;
  }) => {
    setCurrentPage(current);
    setPageSize(pageSize);
  };

  // 分页
  const handlePagination = {
    showSizeChanger: true,
    showQuickJumper: true,
    current: currentPage,
    total: saveList!.total,
    showTotal: (total: any): string => `共 ${total} 条数据`,
  };

  // TODO: 占位空数组，有数据时要替换掉
  const saveGetDept: Array<any> = [];
  return [
    <div className={styles.subscriptionStrategy}>
      <ResizeableTable
        columns={columns}
        rowSelection={rowSelection}
        loading={listLoading}
        dataSource={saveList!.rows}
        onChange={handleStandardTableChange}
        pagination={handlePagination}
        scroll={{ x: columns.length * 200 - 400 }}
      />
    </div>,
    <Modal
      title={'编辑提醒策略'}
      visible={editModal}
      onCancel={() => setEditModal(false)}
      onOk={() => setEditModal(false)}
    >
      <Form {...formItemLayout}>
        <Form.Item label="事项类型" id="area">
          {getFieldDecorator('email', {
            rules: [
              {
                required: true,
                message: 'Please input your E-mail!',
              },
            ],
          })(
            <Select
              placeholder="请选择"
              allowClear
              getPopupContainer={(): HTMLElement => document.getElementById('area') as HTMLElement}
            >
              {handleMapSelectOption(saveGetDept, Option, () => ({}), 'id', 'id', 'orgName')}
            </Select>,
          )}
        </Form.Item>
        <Form.Item label="二级事项">
          {getFieldDecorator('email', {
            rules: [
              {
                type: 'email',
                message: 'The input is not valid E-mail!',
              },
              {
                required: true,
                message: 'Please input your E-mail!',
              },
            ],
          })(
            <Select
              placeholder="请选择"
              allowClear
              getPopupContainer={(): HTMLElement => document.getElementById('area') as HTMLElement}
            >
              {handleMapSelectOption(saveGetDept, Option, () => ({}), 'id', 'id', 'orgName')}
            </Select>,
          )}
        </Form.Item>
        <Form.Item label="事项类别">
          {getFieldDecorator('email', {
            rules: [
              {
                type: 'email',
                message: 'The input is not valid E-mail!',
              },
              {
                required: true,
                message: 'Please input your E-mail!',
              },
            ],
          })(
            <Select
              placeholder="请选择"
              allowClear
              getPopupContainer={(): HTMLElement => document.getElementById('area') as HTMLElement}
            >
              {handleMapSelectOption(saveGetDept, Option, () => ({}), 'id', 'id', 'orgName')}
            </Select>,
          )}
        </Form.Item>
        <Form.Item label="事项名称">
          {getFieldDecorator('email', {
            rules: [
              {
                type: 'email',
                message: 'The input is not valid E-mail!',
              },
              {
                required: true,
                message: 'Please input your E-mail!',
              },
            ],
          })(
            <Select
              placeholder="请选择"
              allowClear
              getPopupContainer={(): HTMLElement => document.getElementById('area') as HTMLElement}
            >
              {handleMapSelectOption(saveGetDept, Option, () => ({}), 'id', 'id', 'orgName')}
            </Select>,
          )}
        </Form.Item>
        <Form.Item label="提醒内容">
          {getFieldDecorator('email', {
            rules: [
              {
                type: 'email',
                message: 'The input is not valid E-mail!',
              },
              {
                required: true,
                message: 'Please input your E-mail!',
              },
            ],
          })(
            <Select
              placeholder="请选择"
              allowClear
              getPopupContainer={(): HTMLElement => document.getElementById('area') as HTMLElement}
            >
              {handleMapSelectOption(saveGetDept, Option, () => ({}), 'id', 'id', 'orgName')}
            </Select>,
          )}
        </Form.Item>
        <Form.Item label="开始时间">
          {getFieldDecorator('email', {
            rules: [
              {
                type: 'email',
                message: 'The input is not valid E-mail!',
              },
              {
                required: true,
                message: 'Please input your E-mail!',
              },
            ],
          })(
            <Select
              placeholder="请选择"
              allowClear
              getPopupContainer={(): HTMLElement => document.getElementById('area') as HTMLElement}
            >
              {handleMapSelectOption(saveGetDept, Option, () => ({}), 'id', 'id', 'orgName')}
            </Select>,
          )}
        </Form.Item>
        <Form.Item label="提醒时间">
          {getFieldDecorator('email', {
            rules: [
              {
                type: 'email',
                message: 'The input is not valid E-mail!',
              },
              {
                required: true,
                message: 'Please input your E-mail!',
              },
            ],
          })(
            <Select
              placeholder="请选择"
              allowClear
              getPopupContainer={(): HTMLElement => document.getElementById('area') as HTMLElement}
            >
              {handleMapSelectOption(saveGetDept, Option, () => ({}), 'id', 'id', 'orgName')}
            </Select>,
          )}
        </Form.Item>
        <Form.Item label="提醒方式">
          {getFieldDecorator('email', {
            rules: [
              {
                type: 'email',
                message: 'The input is not valid E-mail!',
              },
              {
                required: true,
                message: 'Please input your E-mail!',
              },
            ],
          })(
            <Select
              placeholder="请选择"
              allowClear
              getPopupContainer={(): HTMLElement => document.getElementById('area') as HTMLElement}
            >
              {handleMapSelectOption(saveGetDept, Option, () => ({}), 'id', 'id', 'orgName')}
            </Select>,
          )}
        </Form.Item>
        <Form.Item label="提醒频率">
          {getFieldDecorator('email', {
            rules: [
              {
                type: 'email',
                message: 'The input is not valid E-mail!',
              },
              {
                required: true,
                message: 'Please input your E-mail!',
              },
            ],
          })(
            <Select
              placeholder="请选择"
              allowClear
              getPopupContainer={(): HTMLElement => document.getElementById('area') as HTMLElement}
            >
              {handleMapSelectOption(saveGetDept, Option, () => ({}), 'id', 'id', 'orgName')}
            </Select>,
          )}
        </Form.Item>
        <Form.Item label="提醒用户">
          {getFieldDecorator('email', {
            rules: [
              {
                type: 'email',
                message: 'The input is not valid E-mail!',
              },
              {
                required: true,
                message: 'Please input your E-mail!',
              },
            ],
          })(
            <Select
              placeholder="请选择"
              allowClear
              getPopupContainer={(): HTMLElement => document.getElementById('area') as HTMLElement}
            >
              {handleMapSelectOption(saveGetDept, Option, () => ({}), 'id', 'id', 'orgName')}
            </Select>,
          )}
        </Form.Item>
        <Form.Item label="启用本策略">
          {getFieldDecorator('email', {
            rules: [
              {
                type: 'email',
                message: 'The input is not valid E-mail!',
              },
              {
                required: true,
                message: 'Please input your E-mail!',
              },
            ],
          })(
            <Select
              placeholder="请选择"
              allowClear
              getPopupContainer={(): HTMLElement => document.getElementById('area') as HTMLElement}
            >
              {handleMapSelectOption(saveGetDept, Option, () => ({}), 'id', 'id', 'orgName')}
            </Select>,
          )}
        </Form.Item>
      </Form>
    </Modal>,
  ];
};

export default errorBoundary(
  Form.create()(
    connect(
      ({
        messageTodo,
        loading,
      }: {
        messageTodo: MessageTodoState;
        loading: { effects: Record<string, boolean> };
      }) => ({
        listLoading: loading.effects['messageTodo/fetch'],
        messageTodo,
      }),
      // @ts-ignore
    )(ReminderStrategy),
  ),
);
