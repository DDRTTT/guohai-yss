/**
 * 精确搜索
 * author: jiaqiuhua
 * * */
import React from 'react';
import { Button, Col, Row, Form, Select, Icon } from 'antd';
import { handleFilterOption } from '@/pages/archiveTaskHandleList/util';

const PreciseSearch = ({
  props: {
    form: { getFieldDecorator, resetFields, validateFields },
    fileNames,
    initParams,
  },
  handleToggle,
  handleGetTableData,
}) => {
  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 8 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 16 },
    },
  };
  // select简单封装
  const FormSelect = ({
    mode = 'multiple',
    showArrow = true,
    allowClear = true,
    name = '',
    data = [],
    label = '',
  }) => (
    <Form.Item label={label} {...formItemLayout}>
      {getFieldDecorator(name)(
        <Select
          placeholder={`请选择${label}`}
          mode={mode}
          showArrow={showArrow}
          allowClear={allowClear}
          filterOption={handleFilterOption}
        >
          {name &&
            data.map(item => (
              <Select.Option key={`${item.code || item.id}`} title={item.name || item.value}>
                {item.name || item.value}
              </Select.Option>
            ))}
        </Select>,
      )}
    </Form.Item>
  );
  // select下拉数据源
  const formSelectDataObject = {
    needUseSeal: [
      {
        code: '0',
        name: '否',
      },
      {
        code: '1',
        name: '是',
      },
    ],
    useSeal: [
      {
        code: '0',
        name: '否',
      },
      {
        code: '1',
        name: '是',
      },
    ],
    processType: [
      {
        code: 'gtasksFile',
        name: '待办理',
      },
      {
        code: 'completedFile',
        name: '已办理',
      },
      {
        code: 'readOnly',
        name: '只读',
      },
    ],
    fileStates: [
      {
        code: '1',
        name: '审批中',
      },
      {
        code: '2',
        name: '已审批',
      },
      {
        code: '3',
        name: '待归档',
      },
      {
        code: '4',
        name: '归档中',
      },
      {
        code: '5',
        name: '已归档',
      },
    ],
    fileNames,
  };
  // select 表单所传参数name及中文名
  const formSelectData = [
    {
      label: '文档名称',
      name: 'fileNames',
    },
    {
      label: '办理状态',
      name: 'processType',
    },
    {
      label: '是否需要用印',
      name: 'needUseSeal',
    },
    {
      label: '是否用印文档',
      name: 'useSeal',
    },
    {
      label: '文档状态',
      name: 'fileStates',
    },
  ];
  // 表单重置
  const handleReset = () => {
    resetFields();
    handleGetTableData({
      ...initParams,
    });
  };
  // 精确搜索
  const handleSearch = e => {
    e.preventDefault();
    validateFields((err, values) => {
      handleGetTableData({
        ...initParams,
        ...values,
      });
    });
  };

  return (
    <Form>
      <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
        {formSelectData.map((item, index) => (
          <Col span={8} key={index}>
            <FormSelect
              label={item.label}
              name={item.name}
              data={formSelectDataObject[item.name]}
            />
          </Col>
        ))}
      </Row>
      <Row
        gutter={{ md: 8, lg: 24, xl: 48 }}
        type="flex"
        justify="end"
        style={{ marginBottom: '24px' }}
      >
        <Col md={8} style={{ textAlign: 'right' }}>
          <Button type="primary" onClick={handleSearch}>
            查询
          </Button>
          <Button style={{ margin: '0 23px 0 10px' }} onClick={handleReset}>
            重置
          </Button>
          <a onClick={handleToggle}>
            收起
            <Icon type="up" />
          </a>
        </Col>
      </Row>
    </Form>
  );
};

export default PreciseSearch;
