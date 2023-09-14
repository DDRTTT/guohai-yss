import React, { useEffect, useState } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import moment from 'moment';
import { Button, Form, Radio, Tooltip, Modal } from 'antd';
import { errorBoundary } from '@/layouts/ErrorBoundary';
import { Table } from '@/components';
import Action, { linkHoc } from '@/utils/hocUtil';
import List from '@/components/List';
import ReturnDialog from './components/return';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { getHandlerCode } from './common';
import styles from './style.less';
import { makeApply } from '@/services/fileBorrower';
import { getUserInfo } from '@/utils/session';

const RadioGroup = Radio.Group;

const Index = ({
  form: { validateFields },
  dispatch,
  listLoading,
  fileBorrower: {
    persons,
    dicts: { borrowingStatus },
    applyList: { rows, total },
  },
}) => {
  const [formValues, setFormValues] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [returnVisable, setReturnVisable] = useState(false);
  const [dialogDetail, setDialogDetail] = useState({});
  const [userInfo, setuserInfo] = useState({});

  //初始化
  useEffect(() => {
    // 借阅人
    if (!persons.length) {
      dispatch({
        type: 'fileBorrower/getPersons',
      });
    }
    // 借阅状态字典
    if (!borrowingStatus.length) {
      dispatch({
        type: 'fileBorrower/getDictsFunc',
        payload: { codeList: ['borrowingStatus'], key: 'borrowingStatus' },
      });
    }
    setuserInfo(JSON.parse(getUserInfo()));
  }, []);

  useEffect(() => {
    // 关闭弹窗刷新
    handleListFetch();
  }, [returnVisable]);

  // 初始化加载列表
  useEffect(() => {
    handleListFetch();
  }, [formValues, currentPage, limit]);

  /**
   * 查询封装
   * @method  handleListFetch
   */
  const handleListFetch = () => {
    dispatch({
      type: 'fileBorrower/fetchApplyList',
      payload: {
        ...formValues,
        pageNum: currentPage,
        pageSize: limit,
      },
    });
  };

  const handleStandardTableChange = ({ current, pageSize }) => {
    if (pageSize !== limit) {
      setCurrentPage(1);
      setLimit(pageSize);
    } else {
      setCurrentPage(current);
      setLimit(pageSize);
    }
  };

  /** *
   * 搜索条件查询触发
   * @param fieldsValue
   */
  const handleSearch = fieldsValue => {
    if (fieldsValue.borrowedTime) {
      const time = fieldsValue.borrowedTime;
      fieldsValue.borrowedTime = moment(time[0]).format('YYYY-MM-DD');
      fieldsValue.returnTime = moment(time[1]).format('YYYY-MM-DD');
    }
    setLimit(10);
    setCurrentPage(1);
    setFormValues(fieldsValue);
  };

  //搜索条件重置
  const handleReset = () => {
    setLimit(10);
    setCurrentPage(1);
    setFormValues({});
  };

  // 分页参数
  const paginationProps = {
    showSizeChanger: true,
    showQuickJumper: true,
    current: currentPage,
    total,
    showTotal: total => `共 ${total} 条数据`,
  };

  // 表格列配置
  const columns = [
    {
      title: '借阅标题',
      dataIndex: 'borrowingTitle',
      width: 200,
    },
    {
      title: '借阅人',
      dataIndex: 'borrowerName',
      width: 80,
      align: 'center',
    },
    {
      title: '所属部门',
      dataIndex: 'dept',
      width: 150,
      align: 'center',
    },
    {
      title: '借阅时间',
      dataIndex: 'borrowedTime',
      width: 120,
      align: 'center',
    },
    {
      title: '归还时间',
      dataIndex: 'returnTime',
      width: 120,
      align: 'center',
    },
    {
      title: '借阅状态',
      dataIndex: 'borrowingStatus',
      width: 120,
      align: 'center',
      render: key => {
        return borrowingStatus.length && borrowingStatus.find(item => item.code === key).name;
      },
    },
    {
      title: '操作人',
      dataIndex: 'operator',
      width: 120,
      align: 'center',
    },
    {
      title: '操作时间',
      dataIndex: 'lastEditTime',
      width: 200,
      align: 'center',
    },
    {
      title: '操作',
      dataIndex: 'id',
      align: 'center',
      fixed: 'right',
      width: 360,
      render: (id, record) => (
        <div className={styles.handlers}>
          <Action code="fileBorrowerList:details">
            <Button
              type="link"
              onClick={() => {
                handlerClick('view', record);
              }}
            >
              查看
            </Button>
          </Action>
          {record.borrowingStatus === 'pending' && (
            <Action code="fileBorrowerList:modify">
              <Button
                type="link"
                onClick={() => {
                  handlerClick('edit', record);
                }}
              >
                修改
              </Button>
            </Action>
          )}
          {record.borrowingStatus === 'pending' && (
            <Action code="fileBorrowerList:check">
              <Button
                type="link"
                onClick={() => {
                  handlerClick('check', record);
                }}
              >
                审核
              </Button>
            </Action>
          )}
          {/* 借阅中和已延期可以申请延期 */}
          {(record.borrowingStatus === 'library' || record.borrowingStatus === 'overdue') && (
            <Action code="fileBorrowerList:late">
              <Button
                type="link"
                onClick={() => {
                  handlerClick('late', record);
                }}
              >
                延期
              </Button>
            </Action>
          )}
          {/* 借阅中和已延期可以申请归还 */}
          {(record.borrowingStatus === 'library' || record.borrowingStatus === 'overdue') && (
            <Action code="fileBorrowerList:return">
              <Button
                type="link"
                onClick={() => {
                  handlerClick('return', record);
                }}
              >
                归还
              </Button>
            </Action>
          )}
          {/* 借阅中和已延期 有确认归还 */}
          {(record.borrowingStatus === 'library' || record.borrowingStatus === 'overdue') &&
            userInfo.id === record.recipient && (
              <Action code="fileBorrowerList:confirm">
                <Button
                  type="link"
                  onClick={() => {
                    handlerClick('confirm', record);
                  }}
                >
                  确认归还
                </Button>
              </Action>
            )}
          {record.borrowingStatus === 'overdue' && (
            <Action code="fileBorrowerList:urge">
              <Button
                type="link"
                onClick={() => {
                  handlerClick('urge', record);
                }}
              >
                催还
              </Button>
            </Action>
          )}
          {record.borrowingStatus === 'pending' && (
            <Action code="fileBorrowerList:delete">
              <Button
                type="link"
                onClick={() => {
                  handlerClick('del', record);
                }}
              >
                删除
              </Button>
            </Action>
          )}
        </div>
      ),
    },
  ];

  const handlerClick = (key, record) => {
    switch (key) {
      case 'view':
        router.push(
          '/physicalArchives/fileBorrower/view?detail=' + encodeURI(JSON.stringify(record)),
        );
        break;
      case 'edit':
        router.push(
          '/physicalArchives/fileBorrower/apply?detail=' + encodeURI(JSON.stringify(record)),
        );
        break;
      case 'late':
        router.push(
          '/physicalArchives/fileBorrower/late?detail=' + encodeURI(JSON.stringify(record)),
        );
        break;
      case 'return':
        setReturnVisable(true);
        setDialogDetail(record);
        break;
      case 'check':
        Modal.confirm({
          title: '审核确认',
          icon: <ExclamationCircleOutlined />,
          content: '是否确认审核此申请？',
          okText: '确认',
          cancelText: '取消',
          onOk: () => {
            dispatch({
              type: 'fileBorrower/fetModifyApply',
              payload: {
                id: record.id,
                flag: getHandlerCode('check'),
              },
            }).then(() => {
              handleListFetch();
            });
          },
        });
        break;
      case 'del':
        Modal.confirm({
          title: '确认删除',
          icon: <ExclamationCircleOutlined />,
          content: '是否确认删除此申请？',
          okText: '确认',
          cancelText: '取消',
          onOk: () => {
            dispatch({
              type: 'fileBorrower/fetchDelApply',
              payload: record.id,
            }).then(() => {
              handleListFetch();
            });
          },
        });
        break;
      case 'urge':
        Modal.confirm({
          title: '确认催还',
          icon: <ExclamationCircleOutlined />,
          content: '确定给借阅人发送消息提醒催还吗？',
          okText: '确认',
          cancelText: '取消',
          onOk: () => {
            dispatch({
              type: 'fileBorrower/fetModifyApply',
              payload: {
                id: record.id,
                flag: getHandlerCode('urge'),
              },
            }).then(() => {
              handleListFetch();
            });
          },
        });
        break;
      case 'confirm':
        Modal.confirm({
          title: '确认归还',
          icon: <ExclamationCircleOutlined />,
          content: '确定已归还么？',
          okText: '确认',
          cancelText: '取消',
          onOk: () => {
            dispatch({
              type: 'fileBorrower/fetModifyApply',
              payload: {
                id: record.id,
                flag: getHandlerCode('confirm'),
              },
            }).then(() => {
              handleListFetch();
            });
          },
        });
        break;
      default:
    }
  };

  // 搜索条件配置
  const formItemData = [
    {
      name: 'borrower',
      label: '借阅人',
      type: 'Select',
      readSet: { name: 'username', code: 'id' },
      option: persons,
    },
    {
      name: 'borrowedTime',
      label: '借阅时间',
      type: 'rangepicker',
    },
    {
      name: 'borrowingStatus',
      label: '借阅状态',
      type: 'Select',
      option: borrowingStatus,
    },
  ];

  // 表格操作按钮
  const newApply = roleType => {
    router.push('/physicalArchives/fileBorrower/apply');
  };

  // 表格行选择
  const onSelectChange = rows => {
    setSelectedRowKeys(rows);
  };
  return (
    <>
      <ReturnDialog
        returnVisable={returnVisable}
        setReturnVisable={setReturnVisable}
        detail={dialogDetail}
      ></ReturnDialog>
      <List
        formItemData={formItemData}
        advancSearch={handleSearch}
        resetFn={handleReset}
        loading={listLoading}
        fuzzySearchBool={false}
        extra={
          <>
            <Action code="fileBorrowerList:add">
              <Button type="primary" onClick={newApply}>
                借阅申请
              </Button>
            </Action>
          </>
        }
        tableList={
          <>
            <Table
              scroll={{ x: 1200 }}
              columns={columns}
              loading={listLoading}
              dataSource={rows}
              onChange={handleStandardTableChange}
              currentPage={currentPage}
              pagination={paginationProps}
              rowKey="id"
              rowSelection={{ selectedRowKeys, onChange: onSelectChange }}
            />
          </>
        }
      />
    </>
  );
};

const WrappedIndexForm = errorBoundary(
  Form.create()(
    connect(({ fileBorrower, loading }) => ({
      fileBorrower,
      listLoading: loading.effects['fileBorrower/fetchApplyList'],
    }))(Index),
  ),
);

export default WrappedIndexForm;
