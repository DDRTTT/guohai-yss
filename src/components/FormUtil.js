import React from 'react';

import {
  Button,
  Cascader,
  Col,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Radio,
  Row,
  Select,
  TreeSelect,
} from 'antd';
import * as types from '@/utils/FormItemType';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const { Option } = Select;
const { RangePicker } = DatePicker;

const DEFAULT_COLUMN_NUM = 3;

/**
 * 基本表单项生成器
 * 默认以三列为一行生成表单项，在移动浏览器中则展示为一列为一行
 * 按钮3个以内按1项处理
 * 函数构建目标（当前未实现）：1、每一行列数自由配置；2、列宽自由配置
 * @param fields
 */
export const formItemCreate = (getFieldDecorator, fields, colNum) => {
  let buttonField = null;
  let buttonIndex = null;
  for (let i = 0; i < fields.length; i++) {
    if (fields[i].type === types.BUTTON) {
      buttonIndex = i;
      break;
    }
  }

  if (buttonIndex !== null) {
    const tempFields = [...fields];
    buttonField = tempFields.splice(buttonIndex, 1);
    return renderFormFieldsAndButtons(tempFields, colNum, getFieldDecorator, buttonField);
  }

  return renderFormFields(fields, colNum, getFieldDecorator);
};

const renderFormFields = (fields, colNum, getFieldDecorator, butrow) => {
  let num = DEFAULT_COLUMN_NUM;
  if (colNum) {
    num = colNum;
  }

  const total = fields.length;
  let rowNum = parseInt(total / num);
  const mod = total % num;
  if (mod !== 0) {
    // 如果有余数，则多加一行
    rowNum++;
  }

  // 定义临时行遍历数组
  const rows = new Array(rowNum);
  for (let i = 0; i < rowNum; i++) {
    rows[i] = i;
  }

  // 定义临时列遍历数组
  const cols = new Array(num);
  for (let i = 0; i < num; i++) {
    cols[i] = i;
  }

  let colSpan;
  if (butrow) {
    colSpan = 11;
  } else {
    colSpan = 24 / num;
  }

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

  const formItemLayout2 = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 4 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 20 },
    },
  };

  return (
    <div style={{ margin: '0px', padding: '0px', borderSize: '0px' }}>
      {rows.map(rowItem => {
        // 循环输出行
        return (
          <Row key={`$fr${rowItem}`}>
            {cols.map(colItem => {
              // 循环输出列
              const index = rowItem * num + colItem;
              if (fields.length > index) {
                const item = fields[index];
                if (item) {
                  // 根据组件类型生成指定的表单
                  return (
                    <Col
                      key={`$fc${index}`}
                      xxl={item.label == 'uri' ? 24 : colSpan}
                      md={24}
                      sm={24}
                    >
                      <FormItem
                        {...(item.label == 'uri' ? formItemLayout2 : formItemLayout)}
                        label={item.label}
                        colon={false}
                        key={item.key}
                      >
                        {item.ignoreValue
                          ? createItem(item)
                          : getFieldDecorator(item.key, item.options)(createItem(item))}
                      </FormItem>
                    </Col>
                  );
                }
              }
            })}
          </Row>
        );
      })}
    </div>
  );
};

const renderFormFieldsAndButtons = (fields, colNum, getFieldDecorator, buttonField) => {
  return (
    <Row type="flex" justify="space-between" align="bottom">
      <Col span={22}>{renderFormFields(fields, colNum, getFieldDecorator, true)}</Col>
      <Col span={2} style={{ textAlign: 'center' }}>
        {buttonField[0].buttons.map(btn => (
          <Button
            {...btn.extra}
            style={{
              width: '86px',
              margin: '4px 10px 10px 8px',
              float: 'right',
              height: 28,
            }}
            type="primary"
            ghost={btn.text === '重置'}
          >
            {btn.text}
          </Button>
        ))}
      </Col>
    </Row>
  );
};

/**
 * 根据数据项配置生成指定类型的表单项
 * @param obj
 * @returns {XML}
 */
const createItem = obj => {
  switch (obj.type) {
    case types.INPUT:
      return <Input placeholder={obj.placeholder} {...obj.extra} />;

    case types.SELECTOR:
      return (
        <Select placeholder={obj.placeholder} {...obj.extra}>
          {obj.data.map(option => {
            return <Option key={option.value}>{option.text}</Option>;
          })}
        </Select>
      );

    case types.DATE:
      return <DatePicker {...obj.extra} style={{ width: '100%' }} />;

    case types.NUMBER:
      return <InputNumber {...obj.extra} style={{ width: '100%' }} />;

    case types.DATE_RANGE:
      return <RangePicker {...obj.extra} style={{ width: '100%' }} />;

    case types.RADIO_GROUP:
      return (
        <RadioGroup>
          {obj.radios.map(option => {
            return (
              <Radio key={option.value} value={option.value}>
                {option.text}
              </Radio>
            );
          })}
        </RadioGroup>
      );

    case types.Cascader:
      return (
        <Cascader options={obj.data} fieldNames={obj.fieldNames} placeholder="Please select" />
      );

    case types.SIMPLE_MOHU_TREE:
      return (
        <TreeSelect
          allowClear
          value={obj.initdata}
          dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
          treeData={obj._data}
          treeDefaultExpandAll={false}
          onChange={obj.onChange}
        />
      );
  }
};
