import React, { useEffect, useState } from 'react';
import { connect } from 'dva';
import { Form, Radio, Tooltip } from 'antd';
import { errorBoundary } from '@/layouts/ErrorBoundary';
import { Table } from '@/components';
import List from '@/components/List';

const RadioGroup = Radio.Group;

const Index = ({
  form: { validateFields },
  dispatch,
  listLoading,
  resource: {
    data: { rows, total },
  },
}) => {
  const [type, setType] = useState();
  const [formValues, setFormValues] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);

  useEffect(() => {
    const basic = {
      currentPage,
      pageSize: limit,
      urlType: type,
    };
    dispatch({
      type: 'resource/fetch',
      payload: basic,
    });
  }, []);

  /**
   * 列表查询
   * @method  handleListFetch
   */
  const handleListFetch = (pages, limits) => {
    setCurrentPage(pages);
    validateFields((err, fieldsValue) => {
      if (err) return;
      dispatch({
        type: 'resource/fetch',
        payload: {
          currentPage: pages,
          pageSize: limits,
          ...fieldsValue,
        },
      });
    });
  };

  const handleStandardTableChange = ({ current, pageSize }) => {
    if (pageSize !== limit) {
      handleListFetch(1, pageSize);
      setCurrentPage(1);
      setLimit(pageSize);
    } else {
      handleListFetch(current, pageSize);
      setCurrentPage(current);
      setLimit(pageSize);
    }
  };

  /** *
   * 查询触发
   * @param fieldsValue
   */
  const handleSearch = fieldsValue => {
    const values = {
      ...fieldsValue,
      currentPage: 1,
      pageSize: 10,
    };
    setLimit(10);
    setCurrentPage(1);
    setFormValues(values);

    dispatch({
      type: `resource/fetch`,
      payload: values,
    });
  };
  
  //重置
  const handleReset = () => {
    const values = {
      currentPage: 1,
      pageSize: 10,
    };
    setLimit(10);
    setCurrentPage(1);
    setFormValues({});

    dispatch({
      type: `resource/fetch`,
      payload: values,
    });
  }

  const putData = (e, d) => {
    const urlType = e.target.value;
    const basic = {
      urlType,
      id: d.id,
      index_type:
        formValues.urlType === undefined || formValues.urlType == null ? 0 : formValues.urlType,
    };

    dispatch({
      type: 'resource/putdata',
      payload: basic,
    });
  };

  const paginationProps = {
    showSizeChanger: true,
    showQuickJumper: true,
    current: currentPage,
    total,
    showTotal: total => `共 ${total} 条数据`,
  };

  const columns = [
    {
      title: '资源编码',
      dataIndex: 'id',
    },
    {
      title: '资源名称',
      dataIndex: 'sourceName',
    },
    {
      title: '资源路径',
      dataIndex: 'sourceUrl',
      render: (val, record) => {
        const url = `${record.headUrl} \n ${record.sourceUrl}`;
        return <Tooltip title={url}>{val}</Tooltip>;
      },
    },
    {
      title: '资源请求类型',
      dataIndex: 'sourceMethod',
    },
    {
      title: '资源类型',
      dataIndex: 'type',
      render: (val, record) => (
        <>{record.type === 'public' ? '公共' : record.type === 'btn' ? '授权' : '未处理'}</>
      ),
    },
    {
      title: '操作',
      dataIndex: 'urlType',
      align: 'center',
      fixed: 'right',
      width: 360,
      render: (urlType, record) => (
        <RadioGroup onChange={e => putData(e, record)} value={urlType}>
          <Radio value={undefined}>未处理</Radio>
          <Radio value={1}>公共</Radio>
          <Radio value={2}>授权</Radio>
        </RadioGroup>
      ),
    },
  ];

  const formItemData = [
    {
      name: 'url',
      label: '资源路径',
      type: 'input',
    },
    {
      name: 'urlType',
      label: '资源类型',
      type: 'Select',
      option: [
        {
          code: 0,
          name: '未处理',
        },
        {
          code: 1,
          name: '公共',
        },
        {
          code: 2,
          name: '授权',
        },
      ],
    },
  ];
  return (
    <>
      <List
          formItemData={formItemData}
          advancSearch={handleSearch}
          resetFn={handleReset}
          loading={listLoading}
          fuzzySearchBool={false}
          tableList={(<>
            <Table
              columns={columns}
              loading={listLoading}
              dataSource={rows}
              onChange={handleStandardTableChange}
              currentPage={currentPage}
              pagination={paginationProps}
            />
          </>)}
        />
    </>
  );
};

const WrappedIndexForm = errorBoundary(
  Form.create()(
    connect(({ resource, loading }) => ({
      resource,
      listLoading: loading.effects['resource/fetch'],
    }))(Index),
  ),
);

export default WrappedIndexForm;
