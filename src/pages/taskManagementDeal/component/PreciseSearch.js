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
    <Form.Item label={ label } { ...formItemLayout }>
      { getFieldDecorator(name)(
        <Select
          placeholder={ `请选择${label}` }
          mode={ mode }
          showArrow={ showArrow }
          allowClear={ allowClear }
          filterOption={ handleFilterOption }
        >
          { name &&
            data.map(item => (
              <Select.Option key={ `${item.code || item.key}` } title={ item.name || item.value }>
                { item.name || item.value }
              </Select.Option>
            )) }
        </Select>,
      ) }
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
      <Row gutter={ { md: 8, lg: 24, xl: 48 } }>
        { formSelectData.map((item, index) => (
          <Col span={ 8 } key={ index }>
            <FormSelect
              label={ item.label }
              name={ item.name }
              data={ formSelectDataObject[item.name] }
            />
          </Col>
        )) }
        <Col span={ 8 }>
          <Form.Item label="是否需要用印" { ...formItemLayout }>
            { getFieldDecorator('needUseSeals')(
              <Select
                placeholder={ `请选择是否需要用印` }
                showArrow
                allowClear
                mode="multiple"
                filterOption={ handleFilterOption }
              >
                <Select.Option key={ 1 } value={ 1 }>
                  是
                </Select.Option>
                <Select.Option key={ 0 } value={ 0 }>
                  否
                </Select.Option>
              </Select>,
            ) }
          </Form.Item>
        </Col>
        <Col span={ 8 }>
          <Form.Item label="是否用印文档" { ...formItemLayout }>
            { getFieldDecorator('archives')(
              <Select
                placeholder={ `请选择是否用印文档` }
                showArrow
                allowClear
                mode="multiple"
                filterOption={ handleFilterOption }
              >
                <Select.Option key={ 1 } value={ 1 }>
                  是
                </Select.Option>
                <Select.Option key={ 0 } value={ 0 }>
                  否
                </Select.Option>
              </Select>,
            ) }
          </Form.Item>
        </Col>
        <Col span={ 8 }>
          <Button type="primary" onClick={ handleSearch }>
            查询
          </Button>
          <Button style={ { margin: '0 23px 0 10px' } } onClick={ handleReset }>
            重置
          </Button>
          <a onClick={ handleToggle }>
            收起
            <Icon type="up" />
          </a>
        </Col>
      </Row>
    </Form>
  );
};

export default PreciseSearch;
