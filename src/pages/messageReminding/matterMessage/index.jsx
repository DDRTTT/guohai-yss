// 事项消息
import React, { useEffect, useRef, useState } from 'react';
import { Button, Form, message, Modal, Tabs, Tag } from 'antd';
import { connect } from 'dva';
import router from 'umi/router';
import { errorBoundary } from '@/layouts/ErrorBoundary';
import { handleAddHeard, tableRender } from '../baseFunc';
import styles from '../index.less';
import { Table } from '@/components';
import List from '@/components/List';

const { confirm } = Modal;
const { TabPane } = Tabs;

const Index = ({
                 dispatch,
                 listLoading,
                 getReadsFuncLoading,
                 form: { setFieldsValue },
                 messageReminding: {
                   productTableInfo,
                   mPageNum,
                   mTaskTypeCode,
                   mPageSize,
                   mType,
                   mCeateTime,
                   mIsHandle,
                   mMsgTitle,
                   mOnAndOff,
                   mShowSearch,
                   mMsgProCodeList,
                   mProcessPageSize,
                   mProcessPageNum,
                 },
                 currentUser: { id: userId },
                 processMailTotal,
                 processMail,
                 queryMailLoading,
                 productEnum = [],
               }) => {
  const [onAndOff, setOnAndOff] = useState(mOnAndOff); // 高级搜索框显示隐藏控制
  const [showSearch, setShowSearch] = useState(mShowSearch); // 高级搜索框显示隐藏控制
  const total = useRef(0); // 总数据条数
  const [pageNum, setPageNum] = useState(mPageNum); // 当前页
  const [pageSize, setPageSize] = useState(mPageSize); // 页大小
  const [type, setType] = useState(mType); // 事项类型
  const [createTime, setCreateTime] = useState(mCeateTime); // 消息时间
  const [isHandle, setIsHandle] = useState(mIsHandle); // 消息状态
  const [msgTitle, setMsgTitle] = useState(mMsgTitle); // 消息标题
  const [msgProCodeList, setMsgProCodeList] = useState(mMsgProCodeList); // 产品名称
  const [multi, setMulti] = useState([]); // 多选框选中项
  const [multiNum, setMultiNum] = useState(0); // 多选框选中项个数
  const [alertTitle, setAlertTitle] = useState(''); // 提示信息文字内容
  const [process, setProcess] = useState(''); // 消息删除选中项

  const [processPageSize, setProcessPageSize] = useState(mProcessPageSize); // 页大小
  const [processPageNum, setProcessPageNum] = useState(mProcessPageNum); // 当前页
  const [taskTypeCode, setTaskTypeCode] = useState(mTaskTypeCode); // 当前页

  const [triggerTime, setTriggerTime] = useState(''); // 调用接口的触发器

  // 请求:表格数据
  const handleGetListData = () => {
    dispatch({
      type: 'messageReminding/getProductInfoTableFunc',
      payload: {
        isHandle, // 消息状态
        currentPage: pageNum, // 当前页
        pageSize, // 页展示量
        type, // 事项类型
        title: msgTitle,
        proCodeList: msgProCodeList,
      },
      callback: res => {
        total.current = res.total;
      },
    });
  };

  // // 请求:所有流程阶段
  // const handleGetDicts = () => {
  //   dispatch({
  //     type: 'messageReminding/getDictsFunc',
  //     payload: { codeList: ['M001'] },
  //   });
  // };

  // 请求:已读:单条
  const handleGetRead = id => {
    if (taskTypeCode == 'lifecycle') {
      dispatch({
        type: 'messageReminding/getReadsFunc',
        payload: [id],
        callback: () => {
          handleGetListData();
        },
      });
    } else {
      dispatch({
        type: 'user/updateOneRead',
        payload: id,
      }).then(res => {
        getProcessMail();
      });
    }
  };

  // 置为已读
  const handleGetReads = data => {
    if (taskTypeCode == 'lifecycle') {
      dispatch({
        type: 'messageReminding/getReadsFunc',
        payload: data,
        callback: () => {
          // message.success('操作成功');
          handleGetListData();
        },
      });
    } else {
      dispatch({
        type: 'user/updateSomeRead',
        payload: data,
      }).then(res => {
        getProcessMail();
      });
    }
  };

  // 请求:已读:全部
  const handleGetReadAll = () => {
    if (taskTypeCode == 'lifecycle') {
      dispatch({
        type: 'messageReminding/handleAsRead',
        callback: () => {
          handleGetListData();
        },
      });
    } else {
      dispatch({
        type: 'user/updateAllRead',
      }).then(res => {
        getProcessMail();
      });
    }
  };

  const processColumns = [
    {
      title: '收信人姓名',
      dataIndex: 'receiveName',
      ...tableRender,
    },
    {
      title: '信息',
      dataIndex: 'message',
      ...tableRender,
    },
    {
      title: '发件人姓名',
      dataIndex: 'sendeName',
      ...tableRender,
    },
    {
      title: '消息状态',
      dataIndex: 'isHandle',
      render: val => {
        return val == 2 ? <Tag color="green">已读</Tag> : <Tag color="red">未读</Tag>;
      },
    },
    {
      title: '发送时间',
      dataIndex: 'sendeTime',
      ...tableRender,
    },
    {
      title: '操作',
      dataIndex: '操作',
      fixed: 'right',
      render: (_, record) => {
        return (
          <>
            <Button type="link" size="small"
              onClick={() => {
                const temp = {
                  title: '流程消息',
                  content: record.message,
                  createTime: record.sendeTime,
                  id: record.id,
                };
                handleCheck(temp);
                // handleGetReads([record.id]);
              }}
            >
              查看
            </Button>
            {/*            <Button type="link" onClick={() => handleGetRead(record.id)}>
              已读
            </Button> */}
            {/* <a style={{ marginLeft: '10px' }} onClick={() => handleCanShares(record.id)}>
              删除
            </a> */}
          </>
        );
      },
    },
  ];

  // 表头
  const columns = [
    {
      title: '标题',
      dataIndex: 'title',
      ...tableRender,
      width: 450,
    },
    {
      title: '业务状态',
      dataIndex: 'completeName',
      ...tableRender,
    },
    // {
    //   title: '事项类型',
    //   dataIndex: 'typeName',
    //   ...tableRender,
    // },
    // {
    //   title: '二级事项类型',
    //   dataIndex: 'typeCodeName',
    //   ...tableRender,
    // },
    {
      title: '消息状态',
      dataIndex: 'isHandle',
      render: val => {
        return val ? <Tag color="green">已读</Tag> : <Tag color="red">未读</Tag>;
      },
    },
    {
      title: '消息时间',
      dataIndex: 'createTime',
      ...tableRender,
    },
    {
      title: '是否不再提醒',
      dataIndex: 'remindState',
      width: 140,
      render: val => {
        return val == 3 ? <div className="success">是</div> : <div className="error">否</div>;
      },
    },
    {
      title: '操作',
      dataIndex: '操作',
      fixed: 'right',
      render: (_, record) => {
        return (
          <>
            <Button type="link" size="small"
              onClick={() => {
                handleCheck(record);
              }}
            >
              查看
            </Button>
            {/*            <Button type="link" onClick={() => handleGetRead(record.id)}>
              已读
            </Button> */}
            <Button type="link" size="small" onClick={() => handleCanShares(record.id)}>
              删除
            </Button>
            {record.remindState == 3 && (
              <Button type="link" size="small" onClick={() => restoreToRemind(record.id)}>
                恢复提醒
              </Button>
            )}
          </>
        );
      },
    },
  ];

  // 页码回调
  const handleChangePages = page => {
    if (page) {
      setPageNum(page.current);
      setPageSize(page.pageSize);
    }
  };

  // 流程引擎页码切换
  const processHandleChangePages = page => {
    setProcessPageNum(page.current);
    setProcessPageSize(page.pageSize);
  };

  // 页码属性设置(产品看板)
  const pages = {
    showSizeChanger: true,
    showQuickJumper: true,
    current: pageNum,
    total: total.current,
    showTotal: () => {
      return `共 ${total.current} 条数据`;
    },
  };

  // 流程引擎的页码属性设置
  const processPages = {
    showSizeChanger: true,
    showQuickJumper: true,
    current: processPageNum,
    total: processMailTotal,
    showTotal: () => {
      return `共 ${processMailTotal} 条数据`;
    },
  };

  // 复选框
  const rowSelection = {
    onChange: (_, record) => {
      const arr = [];
      for (const i of record) {
        arr.push(i.id);
      }
      setMulti(arr);
      setMultiNum(arr.length);
    },
    selectedRowKeys: multi,
  };

  // 条件查询
  const handlerSearch = fieldsValue => {
    setMulti([]);
    setPageNum(1);
    setPageSize(10);
    if (fieldsValue) {
      setIsHandle(fieldsValue.status);
      setType(fieldsValue.type);
      setCreateTime(
        fieldsValue.time
          ? [fieldsValue.time[0].format('YYYY-MM-DD'), fieldsValue.time[1].format('YYYY-MM-DD')]
          : '',
      );
      setMsgProCodeList(fieldsValue.proCodeList);
      setMsgTitle(fieldsValue.title);
    }
    setTriggerTime(new Date());

  };

  const handleReset = () => {
    setMulti([]);
    setPageNum(1);
    setPageSize(10);
    setIsHandle('');
    setType('');
    setCreateTime('');
    setMsgProCodeList([]);
    setMsgTitle('');
    setTriggerTime(new Date());
  }

  // 表格按钮(查看)
  const handleCheck = data => {
    sessionStorage.setItem('messageData', JSON.stringify(data));
    sessionStorage.setItem('messagePath', '事项消息');
    router.push(`/messageReminding/matterMessage/detail?id=${data.id}&messageType=${taskTypeCode}`);
  };

  // 按钮事件(已读)
  const handleRead = () => {
    handleGetReads(multi);
  };

  // 按钮事件(全部已读)
  const handleReadAll = () => {
    handleGetReadAll();
  };

  // 按钮事件(批量删除)
  const handleCanShares = id => {
    const par = id ? [id] : multi;
    confirm({
      title: '请确认是否删除?',
      okText: '确认',
      cancelText: '取消',
      onOk() {
        dispatch({
          type: 'messageReminding/handleDelBatch',
          payload: par,
          callback: () => {
            setMulti([]);
            // setAlertTitle(`已删除消息 ${par.length} 项`);
            setMultiNum(0);
            handleGetListData();
            return message.success(`已删除消息 ${par.length} 项`);
          },
        });
      },
    });
  };

  // 恢复提醒
  const restoreToRemind = ids => {
    dispatch({
      type: 'user/feedback',
      payload: {
        taskIds: Array.isArray(ids) ? ids : [ids],
        remindState: 2,
        isHandle: '1',
      },
    }).then(res => {
      handleGetListData();
    });
  };

  // 获取流程引擎的消息列表
  const getProcessMail = () => {
    dispatch({
      type: 'user/queryMail',
      payload: { page: processPageNum, limit: processPageSize, receiveId: userId },
    });
  };

  // 切换tab的事件
  const changeTab = _key => {
    setMulti([]);
    setMultiNum(0);
    dispatch({
      type: 'messageReminding/setNormalProperty',
      payload: {
        mShowSearch: onAndOff,
        mOnAndOff: _key == 'lifecycle' ? showSearch : undefined,
      },
    });
    setShowSearch(onAndOff);
    setOnAndOff(_key == 'lifecycle' ? showSearch : undefined);
    setTaskTypeCode(_key);
  };

  useEffect(() => {
    // handleGetDicts();
    dispatch({
      type: 'operatingCalendar/getProductEnum',
    });
    console.log('-------');
    console.log(mPageNum);
    setFieldsValue({
      status: mIsHandle,
      type: mType,
      title: mMsgTitle,
      proCodeList: mMsgProCodeList,
    });
  }, []);

  useEffect(() => {
    setMulti([]);
    setMultiNum(0);
    dispatch({
      type: 'messageReminding/setNormalProperty',
      payload: {
        mPageNum: pageNum,
        mTaskTypeCode: taskTypeCode,
        mPageSize: pageSize,
        mType: type,
        mCeateTime: createTime,
        mIsHandle: isHandle,
        mMsgTitle: msgTitle,
        mProcessPageSize: processPageSize,
        mProcessPageNum: processPageNum,
        mMsgProCodeList: msgProCodeList,
      },
    });
    // handleChangePages();
    if (taskTypeCode == 'lifecycle') {
      handleGetListData();
    } else {
      getProcessMail();
    }
  }, [
    pageNum,
    pageSize,
    createTime,
    isHandle,
    type,
    taskTypeCode,
    msgTitle,
    msgProCodeList,
    triggerTime,
    processPageSize,
    processPageNum,
  ]);

  useEffect(() => {
    if (taskTypeCode != 'lifecycle') {
      getProcessMail();
    }
  }, [processPageNum, processPageSize]);

  const warpSetOnAndOff = val => {
    setOnAndOff(val);
    dispatch({
      type: 'messageReminding/setNormalProperty',
      payload: {
        mOnAndOff: val,
      },
    });
  };
  // 菜单配置
  const formItemData = [
    {
      name: 'type',
      label: '事项类型',
      type: 'select',
      readSet: { name: 'name', code: 'code' },
      option: [
        { name: '流程事项', code: 'processMatters' },
        { name: '产品事项', code: 'productMatters' },
        { name: '业务事项', code: 'businessMatters' },
        { name: '自定义事项', code: 'customItems' },
        { name: '系统事项', code: 'systemIssues' },
      ],
    },
    {
      name: 'status',
      label: '消息状态',
      type: 'select',
      readSet: { name: 'name', code: 'code' },
      option: [
        { name: '未读', code: 0 },
        { name: '已读', code: 1 },
      ],
    },
    {
      name: 'title',
      label: '标题',
      type: 'input',
    },
    {
      name: 'proCodeList',
      label: '产品名称',
      type: 'select',
      readSet: { name: 'proName', code: 'proCode' },
      config: { mode: 'multiple' },
      option: productEnum,
    },
  ];
  return (
    <>
      <List
         formItemData={formItemData}
         advancSearch={handlerSearch}
         resetFn={handleReset}
         searchInputWidth="300"
          fuzzySearchBool={false}
          extra={
            <div className={styles.tabExtraDiv}>
              {taskTypeCode === 'lifecycle' && (
                <Button onClick={() => handleCanShares()} disabled={!multiNum}>
                  删除
                </Button>
              )}
              <Button
                disabled={!multiNum}
                onClick={() => {
                  restoreToRemind(multi);
                }}
              >
                恢复提醒
              </Button>
              <Button loading={getReadsFuncLoading} onClick={handleRead} disabled={!multiNum}>
                标记已读
              </Button>
              <Button type="primary" onClick={handleReadAll}>
                全部已读
              </Button>
            </div>
          }
          tableList={(<>
            {taskTypeCode === 'lifecycle' && 
            <>
              <Table
                  pagination={pages} // 分页栏
                  rowSelection={rowSelection}
                  loading={listLoading} // 加载中效果
                  rowKey={record => record.id} // key值
                  dataSource={productTableInfo.voList} // 表数据源
                  columns={columns} // 表头数据
                  onChange={handleChangePages}
                  scroll={{ x: true }}
                />
            </>}
            {taskTypeCode === 'process' && <>
              <Table
                pagination={processPages} // 分页栏
                rowSelection={rowSelection}
                loading={queryMailLoading} // 加载中效果
                rowKey={record => record.id} // key值
                dataSource={processMail} // 表数据源
                columns={processColumns} // 表头数据
                onChange={processHandleChangePages}
                scroll={{ x: true }}
              />
            </>}
          </>)}
        />
    </>
  );
};

const WrappedIndexForm = errorBoundary(
  Form.create()(
    connect(
      ({
         messageReminding,
         loading,
         operatingCalendar: { productEnum },
         user: { processMail, processMailTotal, currentUser },
       }) => ({
        messageReminding,
        listLoading: loading.effects['messageReminding/getProductInfoTableFunc'],
        asReadLoading: loading.effects['messageReminding/handleAsRead'],
        getReadsFuncLoading: loading.effects['messageReminding/getReadsFunc'],
        processMail,
        processMailTotal,
        currentUser,
        productEnum,
        queryMailLoading: loading.effects['user/queryMail'],
      }),
    )(Index),
  ),
);

export default WrappedIndexForm;
