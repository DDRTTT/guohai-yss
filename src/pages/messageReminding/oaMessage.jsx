// OA消息
import React, { useEffect, useRef, useState } from 'react';
import { Form, Button, Alert, Tag } from 'antd';
import { connect } from 'dva';
import router from 'umi/router';
import { errorBoundary } from '@/layouts/ErrorBoundary';
import {
  handleAddHeard,
  handleAddTable,
  tableRender,
  handleAddModal,
  handleAddSelect,
} from './baseFunc';
import styles from './index.less';

const FormItem = Form.Item;

const Index = ({
  dispatch,
  listLoading,
  form: { getFieldDecorator, resetFields, validateFields },
  messageReminding: { dicts, productTableInfo },
}) => {
  const [onAndOff, setOnAndOff] = useState(false); // 高级搜索框显示隐藏控制
  const [showAndOff, setShowAndOff] = useState(false); // 对话框显示隐藏控制
  const dataObj = useRef({}); // 请求参数对象
  const total = useRef(0); // 总数据条数
  const [pageNum, setPageNum] = useState(1); // 当前页
  const [pageSize, setPageSize] = useState(10); // 页大小
  const [proCode, setProCode] = useState(''); // 产品代码
  const [multi, setMulti] = useState([]); // 多选框选中项
  const [multiNum, setMultiNum] = useState(0); // 多选框选中项个数
  const [alertTitle, setAlertTitle] = useState(''); // 提示信息文字内容
  const search = {
    proName: {
      label: '产品名称',
      type: 'select',
      data: [
        { name: '多少啊', id: 'dsa' },
        { name: '阿萨德', id: 'asd' },
      ],
    },
    proCode: {
      label: '产品代码',
      type: 'select',
      data: [
        { name: 'LXPTEST003', id: 'LXPTEST003' },
        { name: '嘿嘿', id: 'heihei' },
      ],
    },
    proType: {
      label: '产品类型',
      type: 'select',
      data: [
        { name: '啊啊', id: 'aa' },
        { name: '试试', id: 'ss' },
      ],
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

  // 请求:表格数据
  const handleGetDicts = () => {
    dispatch({
      type: 'messageReminding/getDictsFunc',
      payload: { codeList: ['M001'] },
    });
  };

  // 参数更新
  const handleUpdateData = () => {
    dataObj.current = {
      queryTypeCode: 'productInfo',
      keyWords: proCode,
      pageNum: pageNum, // 当前页
      pageSize: pageSize, // 页展示量
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
        arr.push(i.proCode);
      }
      setMulti(arr);
      setMultiNum(arr.length);
    },
  };

  // 分发
  const handleCanShare = () => {
    setAlertTitle(`已分发消息 1 项`);
    setShowAndOff(false);
  };

  const handleCanShares = () => {
    setAlertTitle(`已批量分发消息 ${multiNum} 项`);
  };

  // 表头
  const columns = [
    {
      title: '产品名称',
      dataIndex: 'proName',
      ...tableRender,
    },
    {
      title: '产品代码',
      dataIndex: 'proCode',
      ...tableRender,
    },
    {
      title: '运作方式',
      dataIndex: 'operationWay',
      ...tableRender,
    },
    {
      title: '产品归属部门',
      dataIndex: 'proBelongDepartment',
      ...tableRender,
    },
    {
      title: '是否结构化产品',
      dataIndex: 'isStructpro',
      ...tableRender,
      render: val => {
        return val === '是' ? <Tag color="green">{val}</Tag> : <Tag color="red">{val}</Tag>;
      },
    },
    {
      title: '客户类型',
      dataIndex: 'customerType',
      ...tableRender,
    },
    {
      title: '操作',
      dataIndex: '操作',
      fixed: 'right',
      render: (_, record) => {
        return (
          <>
            <Button type="link">查看</Button>
            <Button type="link" onClick={() => setShowAndOff(true)}>
              分发
            </Button>
          </>
        );
      },
    },
  ];

  // 查询方法
  const handleSubmit = e => {
    e.preventDefault();
    validateFields((err, values) => {
      if (!err) {
        setPageNum(1), setPageSize(10), setProCode(values.proCode);
        handleUpdateData();
      }
    });
  };

  // 按钮事件(删除)
  const handleDelete = () => {
    console.log(multi);
  };

  // 按钮事件(已读)
  const handleRead = () => {
    console.log(multi);
  };

  // 按钮事件(全部已读)
  const handleReadAll = () => {
    console.log('全部已读接口触发');
  };

  // 按钮渲染
  const handleAddButtons = () => {
    return (
      <>
        <Button
          type="primary"
          className={styles.buttons}
          onClick={handleDelete}
          disabled={multiNum ? false : true}
        >
          删除
        </Button>
        <Button
          type="primary"
          className={styles.buttons}
          onClick={handleRead}
          disabled={multiNum ? false : true}
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
          disabled={multiNum ? false : true}
        >
          批量分发
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
  }, [pageNum, pageSize, proCode]);

  return (
    <>
      {handleAddModal(showAndOff, setShowAndOff, handleCanShare, dicts.M001 || '')}
      {handleAddHeard(
        '消息通知',
        'OA消息',
        onAndOff,
        setOnAndOff,
        search,
        getFieldDecorator,
        resetFields,
        handleSubmit,
      )}
      {handleAddTable(
        columns,
        productTableInfo.rows,
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
