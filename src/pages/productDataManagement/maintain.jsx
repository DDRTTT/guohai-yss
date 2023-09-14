// 产品要素库/产品要素项维护
import React, { useEffect, useRef, useState } from 'react';
import { Button, Form, message, Upload } from 'antd';
import { connect } from 'dva';
import { errorBoundary } from '@/layouts/ErrorBoundary';
import { tableRowConfig } from '@/pages/investorReview/func';
import { handleAddTable, handleChangeYesAndNo, handleGetTime, handleTableRender } from './baseFunc';
import { download } from '@/utils/download';
import { Table } from '@/components';
import user from '@/models/user';
import List from '@/components/List';

const Index = ({ dispatch, listLoading }) => {
  const [token, setToken] = useState('');
  const [onAndOff, setOnAndOff] = useState(false);
  const [pageNum, setPageNum] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [rowKeys, setRowKeys] = useState([]);
  const [sort, setSort] = useState({});
  const [total, setTotal] = useState(0);
  const [dataSource, setDataSource] = useState([]);
  const [dataSubjectList, setDataSubjectList] = useState([]);
  const [dataThemeLevelOneList, setDataThemeLevelOneList] = useState([]);
  const [dataThemeLevelTwoList, setDataThemeLevelTwoList] = useState([]);
  const [dataThemeLevelThreeList, setDataThemeLevelThreeList] = useState([]);
  const bizDataName = useRef('');
  const dataSubject = useRef('');
  const dataThemeLevelOne = useRef('');
  const dataThemeLevelTwo = useRef('');
  const dataThemeLevelThree = useRef('');

  // 表头数据
  const columns = [
    {
      title: '数据主体',
      dataIndex: 'dataSubject',
      key: 'dataSubject',
      ...tableRowConfig,
    },
    {
      title: '业务数据名称',
      dataIndex: 'bizDataName',
      key: 'bizDataName',
      ...tableRowConfig,
    },
    {
      title: '字段标识',
      dataIndex: 'attributeName',
      key: 'attributeName',
      ...tableRowConfig,
    },
    {
      title: '主题一级分类',
      dataIndex: 'dataThemeLevelOne',
      key: 'dataThemeLevelOne',
      ...tableRowConfig,
    },
    {
      title: '主题二级分类',
      dataIndex: 'dataThemeLevelTwo',
      key: 'dataThemeLevelTwo',
      ...tableRowConfig,
    },
    {
      title: '主题三级分类',
      dataIndex: 'dataThemeLevelThree',
      key: 'dataThemeLevelThree',
      ...tableRowConfig,
    },
    {
      title: '业务场景',
      dataIndex: 'bizScene',
      key: 'bizScene',
      ...tableRowConfig,
    },
    {
      title: '业务分类',
      dataIndex: 'bizClass',
      key: 'bizClass',
      ...tableRowConfig,
    },
    {
      title: '是否必填',
      dataIndex: 'required',
      key: 'required',
      width: 200,
      sorter: true,
      render: text => {
        return handleTableRender(handleChangeYesAndNo(text));
      },
    },
    {
      title: '组件类型',
      dataIndex: 'widgetType',
      key: 'widgetType',
      ...tableRowConfig,
    },
    {
      title: '是否为扩展字段',
      dataIndex: 'extended',
      key: 'extended',
      width: 200,
      sorter: true,
      render: text => {
        return handleTableRender(handleChangeYesAndNo(text));
      },
    },
    {
      title: '业务主表名',
      dataIndex: 'masterTableName',
      key: 'masterTableName',
      ...tableRowConfig,
    },
    {
      title: '数据库字段名称',
      dataIndex: 'columnName',
      key: 'columnName',
      ...tableRowConfig,
    },
    {
      title: '数据库字段类型',
      dataIndex: 'columnType',
      key: 'columnType',
      ...tableRowConfig,
    },
    {
      title: '归属机构',
      dataIndex: 'orgId',
      key: 'orgId',
      ...tableRowConfig,
    },
    {
      title: '归属系统',
      dataIndex: 'sysId',
      key: 'sysId',
      ...tableRowConfig,
    },
    {
      title: '数据推送(系统)',
      dataIndex: 'pushSystem',
      key: 'pushSystem',
      ...tableRowConfig,
    },
    {
      title: '数据推送(场景)',
      dataIndex: 'pushScene',
      key: 'pushScene',
      ...tableRowConfig,
    },
    {
      title: '要素变更方式',
      dataIndex: 'changeMode',
      key: 'changeMode',
      ...tableRowConfig,
    },
    {
      title: '数据来源',
      dataIndex: 'source',
      key: 'source',
      ...tableRowConfig,
    },
    {
      title: '数据分级',
      dataIndex: 'dataLevel',
      key: 'dataLevel',
      ...tableRowConfig,
    },
    // {
    //   title: '操作',
    //   dataIndex: 'id',
    //   key: 'id',
    //   width: 150,
    //   fixed: 'right',
    //   render: (text, record) => {
    //     return (
    //       <>
    //         <a style={{ marginRight: '10px' }}>查看</a>
    //         <a style={{ marginRight: '10px' }}>修改</a>
    //       </>
    //     );
    //   },
    // },
  ];

  // 查询参数
  const params = {
    conditions: [
      {
        name: 'bizDataName',
        operator: 'LIKE',
        value: '',
      },
      {
        name: 'dataSubject',
        operator: 'LIKE',
        value: '',
      },
      {
        name: 'dataThemeLevelOne',
        operator: 'LIKE',
        value: '',
      },
      {
        name: 'dataThemeLevelTwo',
        operator: 'LIKE',
        value: '',
      },
      {
        name: 'dataThemeLevelThree',
        operator: 'LIKE',
        value: '',
      },
    ],
    pagination: {
      page: pageNum,
      size: pageSize,
    },
    sort: sort,
  };

  const formItemData = [
    {
      name: 'dataSubject',
      label: '数据主体',
      type: 'select',
      readSet: { name: 'name', code: 'code' },
      config: { mode: 'multiple', maxTagCount: 1 },
      option: dataSubjectList,
    },
    {
      name: 'dataThemeLevelOne',
      label: '主题一级',
      type: 'select',
      readSet: { name: 'name', code: 'code' },
      config: { mode: 'multiple', maxTagCount: 1 },
      option: dataThemeLevelOneList,
    },
    {
      name: 'dataThemeLevelTwo',
      label: '主题二级',
      type: 'select',
      readSet: { name: 'name', code: 'code' },
      config: { mode: 'multiple', maxTagCount: 1 },
      option: dataThemeLevelTwoList,
    },
    {
      name: 'dataThemeLevelThree',
      label: '主题三级',
      type: 'select',
      readSet: { name: 'name', code: 'code' },
      config: { mode: 'multiple', maxTagCount: 1 },
      option: dataThemeLevelThreeList,
    },
  ];

  // 表格功能数据
  const tableData = {
    key: 'id',
    columns: columns,
    dataSource: dataSource,
    listLoading: listLoading,
    onChange: (a, b, data) =>
      setSort(data.order ? { [data.field]: data.order?.replace('end', '') } : {}),
    pagination: {
      showSizeChanger: true,
      onShowSizeChange: (num, size) => [setPageNum(num), setPageSize(size)],
      showQuickJumper: true,
      onChange: (num, size) => [setPageNum(num), setPageSize(size)],
      current: pageNum,
      total: total,
      showTotal: () => `共 ${total} 条数据`,
    },
    rowSelection: {
      onChange: (keys, rows) => setRowKeys(keys),
    },
    button() {
      const style = { float: 'right', marginRight: '8px' };
      return (
        <div style={{ height: '30px' }}>
          <Button style={style} onClick={() => handleExportAll()}>
            全部导出
          </Button>
          <Button
            type="primary"
            disabled={+rowKeys === 0 ? true : false}
            style={style}
            onClick={() => handleExport()}
          >
            导出
          </Button>
          <div style={style}>
            <Upload
              name="file"
              action="/ams/yss-product-element/productelement/import"
              showUploadList={false}
              headers={{ Token: token }}
              onChange={info => {
                if (info.file.response) {
                  info.file.response.status === 200
                    ? message.success('导入成功 !')
                    : message.error(`导入失败 ! , 错误信息 : ${info.file.response.message}`);
                }
              }}
            >
              <Button type="upload">导入</Button>
            </Upload>
          </div>
        </div>
      );
    },
  };

  // 接口 : 表格查询
  const handleGetTableDataAPI = data => {
    data.conditions[0].value = bizDataName.current;
    data.conditions[1].value = dataSubject.current;
    data.conditions[2].value = dataThemeLevelOne.current;
    data.conditions[3].value = dataThemeLevelTwo.current;
    data.conditions[4].value = dataThemeLevelThree.current;
    dispatch({
      type: 'productDataManagement/getTableFunc',
      payload: data,
      callback: res => {
        setDataSource(res.content);
        setTotal(res.totalElements);
      },
    });
  };

  // 模糊查询
  const fuzzySearch = val => {
    bizDataName.current = val;
    handleGetTableDataAPI(params);
  };

  // 接口 : 字典下拉列表
  const handleGetDictsAPI = () => {
    dispatch({
      type: 'productDataManagement/getDictsFunc',
      payload: {
        codeList: ['dataSubject', 'dataThemeLevelOne', 'dataThemeLevelTwo', 'dataThemeLevelThree'],
      },
      callback: res => {
        setDataSubjectList(res?.dataSubject || '');
        setDataThemeLevelOneList(res?.dataThemeLevelOne || '');
        setDataThemeLevelTwoList(res?.dataThemeLevelTwo || '');
        setDataThemeLevelThreeList(res?.dataThemeLevelThree || '');
      },
    });
  };

  // 接口 : 部分导出
  const handleExport = () => {
    download('/ams/yss-product-element/productelement/exportbyid', {
      body: rowKeys,
      name: `产品要素库部分导出_${handleGetTime()}`,
      method: 'POST',
      fileType: '.xlsx',
    });
  };

  // 接口 : 全部导出
  const handleExportAll = () => {
    download('/ams/yss-product-element/productelement/exportbycondition', {
      body: { conditions: [] },
      name: `产品要素库全部导出_${handleGetTime()}`,
      method: 'POST',
      fileType: '.xlsx',
    });
  };

  useEffect(() => {
    setToken(window.sessionStorage.getItem('auth_token'));
    handleGetDictsAPI();
  }, []);

  useEffect(() => {
    handleGetTableDataAPI(params);
  }, [pageNum, pageSize, sort]);

  // 字符串转换
  const handleAnyToString = data => {
    if (data && typeof data === 'string') {
      return data;
    } else if (data && Array.isArray(data)) {
      return data.toString();
    } else return '';
  };

  // 处理查询参数
  const handleCheckParams = filedValue => {
    bizDataName.current = filedValue?.bizDataName || '';
    dataSubject.current = handleAnyToString(filedValue?.dataSubject) || '';
    dataThemeLevelOne.current = handleAnyToString(filedValue?.dataThemeLevelOne) || '';
    dataThemeLevelTwo.current = handleAnyToString(filedValue?.dataThemeLevelTwo) || '';
    dataThemeLevelThree.current = handleAnyToString(filedValue?.dataThemeLevelThree) || '';
  };

  return (
    <>
      <List
        formItemData={formItemData}
        // 查询按钮
        advancSearch={filedValue => [handleCheckParams(filedValue), handleGetTableDataAPI(params)]}
        resetFn={() => [handleCheckParams(), handleGetTableDataAPI(params)]}
        searchPlaceholder="请输入关键字"
        // 模糊查询
        fuzzySearch={fuzzySearch}
        extra={tableData.button() ? tableData.button() : ''}
        tableList={
          <>
            <Table
              rowSelection={tableData.rowSelection} // checkbox多选框
              pagination={tableData.pagination} // 分页栏
              loading={tableData.listLoading} // 加载中效果
              rowKey={tableData.key} // key值
              dataSource={tableData.dataSource} // 表数据源
              columns={tableData.columns} // 表头数据
              onChange={tableData.onChange}
              scroll={{ x: true }}
            />
          </>
        }
      />
    </>
  );
};

const WrappedIndexForm = errorBoundary(
  Form.create()(
    connect(({ loading }) => ({
      listLoading: loading.effects['productDataManagement/getTableFunc'],
    }))(Index),
  ),
);

export default WrappedIndexForm;
