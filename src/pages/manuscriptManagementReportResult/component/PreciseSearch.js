/**
 * 精确搜索
 * author: jiaqiuhua
 * * */
import React from 'react';
import { Breadcrumb, Button, Col, Row, Form, Select, Icon, DatePicker } from 'antd';
import { handleFilterOption, datePickerFormat } from '@/pages/archiveTaskHandleList/util';
import styles from './index.less';

/**
 * 组件：表单精确搜索
 * **/
const PreciseSearch = ({
  props: {
    form: { getFieldDecorator, resetFields, validateFields },
    proCode,
    proType,
    logsType,
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
    proCode,
    proType,
    logsType,
  };
  const proOrSeries = `${initParams.type ? '项目' : '系列'}`;
  // select 表单所传参数name及中文名
  const formSelectData = [
    {
      label: `${proOrSeries}名称`,
      name: 'proCode',
    },
    {
      label: `${proOrSeries}类型`,
      name: 'proType',
    },
    {
      label: '报送类型',
      name: 'logsType',
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
    validateFields((err, fieldsValue) => {
      if (err) return;
      const values = {
        ...fieldsValue,
        beginTime: datePickerFormat(fieldsValue['beginTime'], 'YYYY-MM-DD 00:00:00'),
        endTime: datePickerFormat(fieldsValue['endTime'], 'YYYY-MM-DD 00:00:00'),
      };
      handleGetTableData({
        ...initParams,
        ...values,
      });
    });
  };

  return (
    <Form>
      <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
        <Col>
          <Breadcrumb>
            <Breadcrumb.Item>底稿项目管理</Breadcrumb.Item>
            <Breadcrumb.Item>项目底稿报送查询</Breadcrumb.Item>
          </Breadcrumb>
        </Col>
        {formSelectData.map((item, index) => (
          <Col span={6} key={index}>
            <FormSelect
              label={item.label}
              name={item.name}
              data={formSelectDataObject[item.name]}
            />
          </Col>
        ))}
        <Col span={6}>
          <Form.Item label="开始日期：" {...formItemLayout} className={styles.FormDatePicker}>
            {getFieldDecorator('beginTime')(<DatePicker />)}
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item label="结束日期：" {...formItemLayout} className={styles.FormDatePicker}>
            {getFieldDecorator('endTime')(<DatePicker />)}
          </Form.Item>
        </Col>
        <Col span={6} style={{ float: 'right', textAlign: 'right', paddingTop: 5 }}>
          <Button type="primary" onClick={handleSearch}>
            查询
          </Button>
          <Button style={{ marginLeft: 10 }} onClick={handleReset}>
            重置
          </Button>
          <Button type="link" onClick={handleToggle}>
            收起
            <Icon type="up" />
          </Button>
        </Col>
      </Row>
    </Form>
  );
};

export default PreciseSearch;
