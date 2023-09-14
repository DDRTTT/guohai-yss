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
    fileStatus,
    fileName,
    creatorIds,
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
              <Select.Option key={`${item.code || item.key}`} title={item.name || item.value}>
                {item.name || item.value}
              </Select.Option>
            ))}
        </Select>,
      )}
    </Form.Item>
  );
  // select下拉数据源
  const formSelectDataObject = {
    fileStatus,
    fileName,
    creatorIds,
  };
  // select 表单所传参数name及中文名
  const formSelectData = [
    {
      label: '文档状态',
      name: 'fileStatus',
    },
    {
      label: '文档名称',
      name: 'fileName',
    },
    {
      label: '操作用户',
      name: 'creatorIds',
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
      if (err) return;
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
      <Row gutter={{ md: 8, lg: 24, xl: 48 }} type="flex" justify="end">
        <Col>
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
