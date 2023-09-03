import React, { SetStateAction, useEffect, useState, useCallback, ReactNode } from 'react';
import { Dispatch, AnyAction } from 'redux';
import { errorBoundary } from '@/layouts/ErrorBoundary';
import { Form, Modal, Switch, Select, Checkbox, Row, Col, Icon, Tooltip, Pagination } from 'antd';
import { connect } from 'dva';
import { MessageTodoState } from '@/models/messageTodo';
import { handleMapSelectOption } from '../util';
import styles from '../index.less';
import { ResizeableTable } from '@/components';

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
  dispatch: Dispatch<AnyAction>;
  listLoading?: boolean;
  messageTodo: MessageTodoState;
  form: { getFieldDecorator: any };
  listOrCard: string;
  handleBatchBtnState: Function;
  handleEditModalState: Function;
  tabKey: string;
}

// const SubscriptionStrategy: ({
//                                listLoading,
//                                messageTodo: { saveList },
//                                dispatch,
//                                form: { getFieldDecorator },
//                                listOrCard,
//                              }: ReminderStrategyProps) => [JSX.Element, JSX.Element] = ({
//                                                                                           listLoading,
//                                                                                           messageTodo: { saveList },
//                                                                                           dispatch,
//                                                                                           form: { getFieldDecorator },
//                                                                                           listOrCard,
//                                                                                         }) => {

const SubscriptionStrategy = ({
  listLoading,
  messageTodo: { saveList },
  dispatch,
  form: { getFieldDecorator },
  listOrCard,
  handleBatchBtnState,
  handleEditModalState,
  tabKey,
}: ReminderStrategyProps): [JSX.Element, JSX.Element] => {
  // 分页 hook
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState(10);
  // 选中列 hook
  const [selectedRows, setSelectedRows] = useState<any[number]>([]);
  // 选中列key hook
  const [selectedRowKeys, setSelectedRowKeys] = useState<any[number]>([]);
  // 查询字符串 hook
  const [queryStr, setQueryStr] = useState<string>('');
  // 查询表单 hook
  const [searchForm, setSearchForm] = useState<any>({});
  // 编辑弹框 hook
  const [editModal, setEditModal] = useState<boolean>(false);
  // 选中卡片
  const [cardList, setCardList] = useState<any[]>([]);

  let card: any[] = [];


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
  }

  // table columns
  const columns = [
    {
      title: '事项名称',
      dataIndex: 'name',
      key: 'name',
      width: 200,
      fixed: 'left',
    },
    {
      title: '事项分类',
      dataIndex: 'type',
      key: 'type',
      align: 'center',
      width: 100,
    },
    {
      title: '提醒内容',
      dataIndex: 'content',
      key: 'content',
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
    },
    {
      title: '提醒频率',
      dataIndex: 'frequency',
      key: 'frequency',
      align: 'center',
      width: 100,
    },
    {
      title: '是否启用', // 0close 1 open 2 Forced open
      dataIndex: 'whether',
      key: 'whether',
      align: 'center',
      width: 120,
      render: (text: string, record: any): ReactNode => {
        if (record.whether === 2) {
          return [
            <Switch
              checkedChildren="开"
              unCheckedChildren="关"
              onChange={handleSwitchOchange}
              disabled={true}
              defaultChecked
              style={{ background: '#F66F6A ' }}
            />,
            <span style={{ position: 'relative' }}>
              <Tooltip
                title={[<Icon type="exclamation-circle" />, ' 强制开启，如需关闭请在 编辑中操作']}
              >
                <Icon
                  type="question-circle"
                  style={{ position: 'absolute', left: 4, top: 5, width: 16, height: 16 }}
                />
              </Tooltip>
            </span>,
          ];
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
      width: '180px',
      align: 'center',
      fixed: 'right',
      render: (text: string, record: any) => {
        return (
          <span>
            <span style={{ margin: 5 }} onClick={() => handleEdit(record)}>
              <a>编辑</a>
            </span>
            {tabKey !== '2' && <span style={{ margin: 5 }}>
              <a style={{ color: '#D9001B' }}>删除</a>
            </span>}
          </span>
        );
      },
    },
  ];

  // 列表请求
  const handleList = useCallback(() => {
    // 获取列表
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
    console.log('into- lalalala');
    handleList();
  }, [currentPage, handleList, pageSize, queryStr, searchForm]);

  useEffect(() => {
    setSelectedRowKeys([]);
    setSelectedRows([]);
  }, [listOrCard])

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
  const handleStandardCardChange = (page: number, pageSize: number) => {
    setCurrentPage(page);
    setPageSize(pageSize);
  };
  const onShowSizeChange = (current: number, size: number) => {
    setCurrentPage(current);
    setPageSize(size);
  };

  // 选择
  const handleCheckBox = (e: any, row: any, index: number) => {
    if (e.target.checked) {
      card.push(row);
    } else {
      console.log(row.id);
      card = card.filter(item => item.id !== row.id);
    }

    handleBatchBtnState(card.length > 0 ? false : true);


  }

  /**
   * 根据数据不同显示不同的强制开启样式
   * @param {number} key
   */
  const handleSwitch = (key: number): ReactNode => {
    // 0 关close 1 开open 2 强制开Forced open
    if (key === 2) {
      return (
        <>
          <span style={{ color: '#F66F6A' }}>强制开启</span>
          <Tooltip
            title={[<Icon type="exclamation-circle" />, ' 强制开启，如需关闭请在编辑中操作']}
          >
            <Icon type="question-circle" />
          </Tooltip>
        </>
      );
    }
    if (key === 1 || key === 0)
      return [
        <Switch
          defaultChecked={key === 1}
          size="small"
          style={{ marginBottom: 1 }}
          className={styles.cardItemOptionItemInner}
        />,
        <div className={styles.cardItemOptionItemInnerText}>
          {key === 1 && '启用'}
          {key === 0 && '关闭'}
        </div>,
      ];

    return '';
  };

  // card
  const handleCard = () => {

    return (
      <div className={styles.cardList}>
        <Row gutter={[16, 16]}>
          {saveList!.rows.map((row, index) => (
            <Col span={8} key={index}>
              <div className={styles.cardContent}>
                <div className={styles.verticalLine} />
                <Checkbox className={styles.cardItemCheckbox} onChange={(e) => handleCheckBox(e, row, index)} />
                <div className={styles.cardItem}>
                  <div className={styles.cardItemTitle}>
                    <div className={styles.cardItemTitleLeft}>自有资产参与日 | 待办事项</div>
                    <div className={styles.cardItemTitleRight}>提醒事项</div>
                  </div>
                  <div className={styles.cardItemContent}>
                    所属TA-XXX产品自有资金参与日为X月X日，距离X天
                  </div>
                  <div className={styles.cardItemDetails} style={{ marginBottom: 0 }}>
                    <div>
                      <span className={styles.cardItemDetailsKey} style={{ color: '#8a8e99' }}>触发机制(T)：</span>
                      <span className={styles.cardItemDetailsValue} style={{ color: '#252b3a' }}>账户开户日</span>
                    </div>
                  </div>
                  <div className={styles.cardItemDetails} style={{ marginBottom: 0, marginTop: 0 }}>
                    <div className={styles.cardItemDetailItem}>
                      <div>
                        <span className={styles.cardItemDetailsKey}>开始提醒：</span>
                        <span className={styles.cardItemDetailsValue}>当天</span>
                      </div>
                      <div>
                        <span className={styles.cardItemDetailsKey}>结束提醒</span>
                        <span className={styles.cardItemDetailsValue}>当天</span>
                      </div>
                    </div>
                    <div className={styles.cardItemDetailItem}>
                      <div>
                        <span className={styles.cardItemDetailsKey}>提醒频率：</span>
                        <span className={styles.cardItemDetailsValue}>登录提醒</span>
                      </div>
                      <div>
                        <span className={styles.cardItemDetailsKey}>提醒方式：</span>
                        <span className={styles.cardItemDetailsValue}>站内信</span>
                      </div>
                    </div>

                  </div>
                  <div className={styles.cardItemDetails} style={{ marginTop: 0 }}>
                    <div>
                      <span className={styles.cardItemDetailsKey} style={{ color: '#8a8e99' }}>流程办理：</span>
                      <span className={styles.cardItemDetailsValue} style={{ color: '#252b3a' }}>募集流程|信披流程</span>
                    </div>
                  </div>
                  <div className={styles.cardItemOptions}>
                    <div className={styles.cardItemOptionItem}>{handleSwitch(row.whether)}</div>
                    <div className={styles.cardItemOptionItem} onClick={() => handleEdit(row)}>
                      <div className={styles.cardItemOptionItemInner}>
                        <Icon type="edit" />
                        编辑
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Col>
          ))}
        </Row>
        <div className={styles.paginationBox}>
          <Pagination
            total={saveList!.total}
            showTotal={total => `共${total}条数据`}
            current={currentPage}
            defaultCurrent={1}
            defaultPageSize={12}
            showSizeChanger
            showQuickJumper
            pageSizeOptions={['12', '24', '48', '96']}
            // @ts-ignore
            onChange={handleStandardCardChange}
            onShowSizeChange={onShowSizeChange}
          />
        </div>
      </div>
    );
  };

  // 分页蚕食 pagination
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
      {listOrCard === 'list' && (
        <ResizeableTable
          columns={columns}
          rowSelection={rowSelection}
          loading={listLoading}
          dataSource={saveList!.rows}
          onChange={handleStandardTableChange}
          pagination={handlePagination}
          scroll={{ x: columns.length * 200 - 500 }}
        />
      )}
      {listOrCard === 'card' && handleCard()}
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
    )(SubscriptionStrategy),
  ),
);
