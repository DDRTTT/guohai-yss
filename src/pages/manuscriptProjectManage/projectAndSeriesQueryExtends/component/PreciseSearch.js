/**
 * 精确搜索
 * author: jiaqiuhua
 * * */
import React from 'react';
import { Button, Col, Row, Form, Select, Icon, Input, Tooltip } from 'antd';
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
        <Col span={8}>
          <Form.Item label="文档名称" {...formItemLayout}>
            {getFieldDecorator('fileNames')(
              <Select
                placeholder={`请选择文档名称`}
                showArrow
                allowClear
                mode="multiple"
                filterOption={handleFilterOption}
              >
                {fileNames &&
                  fileNames.map(item => (
                    <Select.Option key={`${item.name}`}>
                      <Tooltip placement="rightBottom" title={item.name}>
                        {item.name}
                      </Tooltip>
                    </Select.Option>
                  ))}
              </Select>,
            )}
          </Form.Item>
        </Col>
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
