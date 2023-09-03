// 业务提醒
import React, { useEffect, useRef, useState } from 'react';
import { Button, Form, Tag } from 'antd';
import { connect } from 'dva';
import router from 'umi/router';
import { errorBoundary } from '@/layouts/ErrorBoundary';
import { handleAddHeard, handleAddTable, tableRender } from './baseFunc';
import styles from './index.less';

const FormItem = Form.Item;

const Index = ({
  dispatch,
  listLoading,
  form: { getFieldDecorator, resetFields, validateFields },
  messageReminding: { dicts, productTableInfo },
}) => {
  const [onAndOff, setOnAndOff] = useState(false); // 高级搜索框显示隐藏控制
  const dataObj = useRef({}); // 请求参数对象
  const total = useRef(0); // 总数据条数
  const [pageNum, setPageNum] = useState(1); // 当前页
  const [pageSize, setPageSize] = useState(10); // 页大小
  const [createTime, setCreateTime] = useState([]); // 消息时间
  const [isHandle, setIsHandle] = useState(''); // 状态
  const [multi, setMulti] = useState([]); // 多选框选中项
  const [multiNum, setMultiNum] = useState(0); // 多选框选中项个数
  const [alertTitle, setAlertTitle] = useState(''); // 提示信息文字内容
  const [process, setProcess] = useState(''); // 消息删除选中项

  const search = {
    status: {
      label: '状态',
      type: 'select',
      data: [
        { name: '未读', id: 0 },
        { name: '已读', id: 1 },
      ],
    },
    time: {
      label: '时间',
      type: 'rangePicker',
    },
  };

  // 请求:表格数据
  const handleGetListData = () => {
    handleUpdateData();
    dispatch({
      type: 'messageReminding/getProductInfoTableFunc',
      payload: dataObj.current,
      callback: res => {
        total.current = res.total;
      },
    });
  };

  // 请求:流程阶段
  const handleGetDicts = () => {
    dispatch({
      type: 'messageReminding/getDictsFunc',
      payload: { codeList: ['M001'] },
    });
  };

  // 请求:已读:单条
  const handleGetRead = id => {
    dispatch({
      type: 'messageReminding/getReadFunc',
      payload: id,
      callback: () => {
        handleGetListData();
      },
    });
  };

  // 请求:已读:多条
  const handleGetReads = data => {
    dispatch({
      type: 'messageReminding/getReadsFunc',
      payload: data,
      callback: () => {
        handleGetListData();
      },
    });
  };

  // 请求:已读:全部
  const handleGetReadAll = () => {
    dispatch({
      type: 'messageReminding/getReadAllFunc',
      callback: () => {
        handleGetListData();
      },
    });
  };

  // 表头
  const columns = [
    {
      title: '标题',
      dataIndex: 'title',
      ...tableRender,
    },
    {
      title: '状态',
      dataIndex: 'isHandle',
      render: val => {
        return val ? <Tag color="green">已读</Tag> : <Tag color="red">未读</Tag>;
      },
    },
    {
      title: '消息时间',
      dataIndex: 'createTime',
    },
    {
      title: '操作',
      dataIndex: '操作',
      fixed: 'right',
      render: (_, record) => {
        return (
          <>
            <Button type="link" onClick={() => [handleCheck(record), handleGetRead(record.id)]}>
              查看
            </Button>
            <Button type="link" onClick={() => handleGetRead(record.id)}>
              已读
            </Button>
            <Button type="link" onClick={() => handleDelete()}>
              删除
            </Button>
          </>
        );
      },
    },
  ];

  // 参数更新
  const handleUpdateData = () => {
    dataObj.current = {
      taskClassify: 1,
      createTime, // 消息时间
      isHandle, // 消息状态
      currentPage: pageNum, // 当前页
      pageSize, // 页展示量
    };
  };

  // 页码回调
  const handleChangePages = page => {
    if (page) {
      setPageNum(page.current);
      setPageSize(page.pageSize);
    }
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
  };

  // 查询方法
  const handleSubmit = e => {
    e.preventDefault();
    validateFields((err, values) => {
      if (!err) {
        setPageNum(1);
        setPageSize(10);
        setIsHandle(values.status === undefined ? '' : values.status);
        setCreateTime(
          values.time
            ? [values.time[0].format('YYYY-MM-DD'), values.time[1].format('YYYY-MM-DD')]
            : '',
        );
        handleUpdateData();
      }
    });
  };

  // 表格按钮(查看)
  const handleCheck = data => {
    sessionStorage.setItem('messageData', JSON.stringify(data));
    sessionStorage.setItem('messagePath', '业务提醒');
    router.push('/messageReminding/matterMessage/detail');
  };

  // 表格按钮(删除)
  const handleDelete = () => {
    setAlertTitle(`已删除消息 1 项`);
  };

  // 按钮事件(删除)
  const handleCanShare = () => {
    console.log(multi);
    setAlertTitle(`已删除消息 ${multiNum} 项`);
  };

  // 按钮事件(已读)
  const handleRead = () => {
    console.log(multi);
    handleGetReads(multi);
  };

  // 按钮事件(全部已读)
  const handleReadAll = () => {
    handleGetReadAll();
  };

  // 按钮事件(批量删除)
  const handleCanShares = () => {
    setAlertTitle(`已批量删除消息 ${multiNum} 项`);
  };

  // 按钮渲染
  const handleAddButtons = () => {
    return (
      <>
        <Button
          type="primary"
          className={styles.buttons}
          onClick={handleCanShare}
          disabled={!multiNum}
        >
          删除
        </Button>
        <Button
          type="primary"
          className={styles.buttons}
          onClick={handleRead}
          disabled={!multiNum}
        >
          标记已读
        </Button>
        <Button type="primary" className={styles.buttons} onClick={handleReadAll}>
          全部已读
        </Button>
        <Button
          type="primary"
          className={styles.buttons}
          onClick={handleCanShares}
          disabled={!multiNum}
        >
          批量删除
        </Button>
      </>
    );
  };

  // 撤销按钮点击事件
  const handleCanBackOut = () => {
    console.log('触发撤销事件');
  };

  // 撤销按钮渲染
  const handleAddAlertButton = () => {
    return (
      <Button size="small" type="link" style={{ color: 'green' }} onClick={handleCanBackOut}>
        撤销
      </Button>
    );
  };

  useEffect(() => {
    handleGetDicts();
  }, []);

  useEffect(() => {
    handleChangePages();
    handleGetListData();
  }, [pageNum, pageSize, createTime, isHandle]);

  return (
    <>
      {handleAddHeard(
        ['消息通知', '业务提醒'],
        onAndOff,
        setOnAndOff,
        search,
        getFieldDecorator,
        resetFields,
        handleSubmit,
        'businessMessage',
      )}
      {handleAddTable(
        columns,
        productTableInfo.voList,
        pages,
        rowSelection,
        handleChangePages,
        listLoading,
        handleAddButtons,
        alertTitle,
        handleAddAlertButton,
        setAlertTitle,
      )}
    </>
  );
};

const WrappedIndexForm = errorBoundary(
  Form.create()(
    connect(({ messageReminding, loading }) => ({
      messageReminding,
      listLoading: loading.effects['messageReminding/getProductInfoTableFunc'],
    }))(Index),
  ),
);

export default WrappedIndexForm;
