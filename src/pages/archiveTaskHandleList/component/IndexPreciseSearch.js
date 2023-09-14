/**
 * 精确搜索
 * author: jiaqiuhua
 * * */
import React from 'react';
import { Button, Col, Row, Form, Select, Icon, Breadcrumb, DatePicker } from 'antd';
import { handleFilterOption, rangPickerFormat } from '@/pages/archiveTaskHandleList/util';
import styles from '../index.less';

const { RangePicker } = DatePicker;
const PreciseSearch = ({
  props: {
    form: { getFieldDecorator, resetFields, validateFields },
    initParams,
    proCode,
    taskType,
    taskName,
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
              <Select.Option
                key={`${item.code || item.id || item.name}`}
                title={item.name || item.value}
              >
                {item.name || item.value}
              </Select.Option>
            ))}
        </Select>,
      )}
    </Form.Item>
  );
  // select下拉数据源
  const formSelectDataObject = {
    priority: [
      {
        code: '0',
        name: '低',
      },
      {
        code: '1',
        name: '中',
      },
      {
        code: '2',
        name: '高',
      },
    ],
    checked: [
      {
        code: '0',
        name: '未提交',
      },
      {
        code: '1',
        name: '办理中',
      },
      {
        code: '3',
        name: '未归档',
      },
      {
        code: '4',
        name: '已归档',
      },
    ],
    proCode,
    taskType,
    taskName,
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
      name: 'taskType',
    },
    {
      label: '任务名称',
      name: 'taskName',
    },
    {
      label: '优先级',
      name: 'priority',
    },
    {
      label: '任务状态',
      name: 'checked',
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
        startTime: rangPickerFormat(fieldsValue['startTime']),
        endTime: rangPickerFormat(fieldsValue['endTime']),
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
            <Breadcrumb.Item>项目任务管理</Breadcrumb.Item>
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
        <Col span={6} className={styles.FormPicker}>
          <Form.Item label="开始时间：" {...formItemLayout}>
            {getFieldDecorator('startTime')(<RangePicker placeholder={['起', '止']} />)}
          </Form.Item>
        </Col>
        <Col span={6} className={styles.FormPicker}>
          <Form.Item label="截止时间" {...formItemLayout}>
            {getFieldDecorator('endTime')(<RangePicker placeholder={['起', '止']} />)}
          </Form.Item>
        </Col>
        <Col md={6} style={{ textAlign: 'right', float: 'right', paddingTop: 5 }}>
          <Button type="primary" onClick={handleSearch}>
            查询
          </Button>
          <Button style={{ margin: '0 10px' }} onClick={handleReset}>
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
