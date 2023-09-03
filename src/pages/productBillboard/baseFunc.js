import { Form, Row, Col, Select, Input, DatePicker, Tooltip } from 'antd';
import moment from 'moment/moment';
import styles from './index.less';

export const handleAddAllData = (title, name, data, wordChange) => {
  const rowColData = [];
  for (const key in name) {
    rowColData.push(
      <Col span={6} className={styles.rowColBody}>
        <span className={styles.dataName}>{handleAddCustomTooltip(name[key], 15)} : </span>
        {data[key] === undefined
          ? ''
          : handleAddCustomTooltip(wordChange(data[key], name[key]), 15)}
      </Col>,
    );
  }
  return (
    <div className={styles.dataTitle}>
      <Row>
        <h3 style={{ fontSize: '20px', paddingBottom: '10px', fontWeight: 'bold' }}>{title}</h3>
        {rowColData}
      </Row>
    </div>
  );
};
// 全量表格的页码
export const pagination = {
  showSizeChanger: true,
  showQuickJumper: true,
  showTotal: total => {
    return `共 ${total} 条数据`;
  },
};

// 成功/失败
export const winAndLoss = [
  {
    code: '1',
    name: '失败',
  },
  {
    code: '0',
    name: '成功',
  },
];

// 是/否
export const yseAndNo = [
  {
    code: '1',
    name: '是',
  },
  {
    code: '0',
    name: '否',
  },
];

// 悬浮框样式
export const tooltipStyle = {
  width: '180px',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  display: 'inline-block',
  paddingTop: '5px',
};

// 金额render
export const moneyRender = {
  render: label => {
    return (
      <Tooltip title={label} placement="topLeft">
        <span style={{ ...tooltipStyle }}>{handleChangeThousands(label)}</span>
      </Tooltip>
    );
  },
};

// 双精度数字转换
export const handleChangeNumberToFloat = val => {
  if (val) {
    return val.toFixed(2).toString();
  } else if (val === 0) {
    return val.toFixed(2).toString();
  }
};

// 双精度数字转换(百分比转换)
export const handleChangeNumberToFloat100 = val => {
  if (val) {
    return (val * 100).toFixed(2).toString();
  } else if (val === 0) {
    return val.toFixed(2).toString();
  }
};

// 表格label异常时展示项
export const handleChangeLabel = val => {
  return val ? val.toString().replace(/null/g, '-') : val == 0 ? 0 : '-';
};

// 千分位展示(双精度)
export const handleChangeThousands = val => {
  if (typeof val === 'number') {
    return val.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
  } else if (typeof val === 'string') {
    if (val) {
      return parseFloat(val)
        .toFixed(2)
        .replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
    } else return '-';
  } else return val ? val.toString().replace(/null/g, '-') : val == 0 ? 0 : '-';
};

// 添加悬浮框
export const handleAddTooltip = label => {
  return (
    <Tooltip title={label} placement="topLeft">
      <span style={{ ...tooltipStyle }}>{label}</span>
    </Tooltip>
  );
};

// 字符过长省略(自定义 - 包含数组类型)
export const handleAddCustomTooltip = (val, num) => {
  if (typeof val === 'string') {
    if (val.length > num) {
      return (
        <Tooltip title={val}>
          <span>{val.substr(0, num - 2)}...</span>
        </Tooltip>
      );
    } else return val;
  } else if (Array.isArray(val)) {
    let str = val.toLocaleString();
    if (str.length > num) {
      return (
        <Tooltip title={str}>
          <span>{str.substr(0, num - 2)}...</span>
        </Tooltip>
      );
    } else return str;
  }
};

/**
 * 筛选项下拉列表
 * @param {Array} data 下拉数据源
 * @param {String} inputName 下拉内容提示
 * @param {Function} func onChange方法名
 */
export const handleAddStageSlecct = (data, inputName, func) => {
  let arr = [];
  if (typeof data !== 'undefined') {
    for (let key of data) {
      arr.push(
        <Select.Option value={key.code} key={key.name}>
          {handleAddCustomTooltip(key.name, 9)}
        </Select.Option>,
      );
    }
  }
  return (
    <Select
      mode="multiple"
      placeholder={inputName}
      style={{ width: '10%', margin: '0 0 15px 5%' }}
      onChange={func}
      filterOption={(input, option) => option.key.toLowerCase().indexOf(input.toLowerCase()) >= 0}
    >
      {arr}
    </Select>
  );
};

/**
 * 修改:下拉框change
 * @param val 下拉选中项value
 * @param 改变选中项该输入框对应的数据
 */
export const handleChangeSelectOption = (val, refData) => {
  refData(val);
};

/**
 * 修改:下拉框
 * @param {Object} data 字段选项数据源
 * @param {String} name span名称
 * @param {String} value 当前数据选中项
 * @param {Object} refData ref赋值项
 * @param {Bollean} disabled 只读布尔值
 * @param {String} more 多选属性是否开启
 * @param {Bollean} rulesShow 是否必填
 * @param {Object} rules 自定义规则方法
 */
export const handleAddModalColSelect = (
  getFieldDecorator,
  data,
  name,
  value,
  refData,
  disabled,
  code,
  codeName,
  more,
  rulesShow,
  rules,
) => {
  let arr = [];
  if (data) {
    for (let key of data) {
      arr.push(
        <Select.Option value={key[code]}>
          {handleAddCustomTooltip(key[codeName], 10)}
        </Select.Option>,
      );
    }
    if (rules) {
      return (
        <Col span={8} style={{ marginBottom: '15px' }}>
          <Form.Item className={styles.dataName} label={handleAddCustomTooltip(name, 10)}>
            {getFieldDecorator(name, {
              initialValue: value,
              rules: [
                { required: rulesShow, message: `请按照规则填写正确的${name} !` },
                { validator: rules },
              ],
            })(
              <Select
                placeholder="请选择"
                allowClear="true"
                disabled={disabled}
                onChange={val => handleChangeSelectOption(val, refData)}
                mode={more}
              >
                {arr}
              </Select>,
            )}
          </Form.Item>
        </Col>
      );
    } else
      return (
        <Col span={8} style={{ marginBottom: '15px' }}>
          <Form.Item className={styles.dataName} label={handleAddCustomTooltip(name, 10)}>
            {getFieldDecorator(name, {
              initialValue: value,
              rules: [{ required: rulesShow, message: `请按照规则填写正确的${name} !` }],
            })(
              <Select
                placeholder="请选择"
                allowClear="true"
                disabled={disabled}
                onChange={val => handleChangeSelectOption(val, refData)}
                mode={more}
              >
                {arr}
              </Select>,
            )}
          </Form.Item>
        </Col>
      );
  }
};

/**
 * 修改:输入框change
 * @param e 变化的输入框
 * @param refData 该输入框对应的数据
 */
export const handleChangeInputValue = (e, refData) => {
  if (e.target.value) {
    refData(e.target.value);
  }
};

/**
 * 修改:输入框(文本)
 * @param {Object} data 数据源
 * @param {String} name 标签span名
 * @param {String} value input值
 * @param {String} refData 标签数据绑定源
 * @param {Bollean} disabled 只读布尔值
 * @param {Bollean} rulesShow 是否必填
 * @param {Object} rules 自定义规则方法
 */
export const handleAddModalColInput = (
  getFieldDecorator,
  data,
  name,
  value,
  refData,
  disabled,
  rulesShow,
  rules,
) => {
  if (data) {
    if (rules) {
      return (
        <Col span={8} style={{ marginBottom: '15px' }}>
          <Form.Item className={styles.dataName} label={handleAddCustomTooltip(name, 10)}>
            {getFieldDecorator(name, {
              initialValue: data[value],
              rules: [
                { required: rulesShow, message: `请按照规则填写正确的${name} !` },
                { validator: rules },
              ],
            })(
              <Input
                placeholder="请输入"
                disabled={disabled}
                onChange={e => {
                  handleChangeInputValue(e, refData);
                }}
              />,
            )}
          </Form.Item>
        </Col>
      );
    } else
      return (
        <Col span={8} style={{ marginBottom: '15px' }}>
          <Form.Item className={styles.dataName} label={handleAddCustomTooltip(name, 10)}>
            {getFieldDecorator(name, {
              initialValue: data[value],
              rules: [{ required: rulesShow, message: `请按照规则填写正确的${name} !` }],
            })(
              <Input
                placeholder="请输入"
                disabled={disabled}
                onChange={e => {
                  handleChangeInputValue(e, refData);
                }}
              />,
            )}
          </Form.Item>
        </Col>
      );
  }
};

/**
 * 修改:输入框(数字)
 * @param {Object} data 数据源
 * @param {String} name 标签span名
 * @param {String} value input值
 * @param {String} refData 标签数据绑定源
 * @param {Bollean} disabled 只读布尔值
 * @param {Bollean} rulesShow 是否必填
 * @param {Object} rules 自定义规则方法
 */
export const handleAddModalColNumber = (
  getFieldDecorator,
  data,
  name,
  value,
  refData,
  disabled,
  rulesShow,
  rules,
) => {
  if (data) {
    if (rules) {
      return (
        <Col span={8} style={{ marginBottom: '15px' }}>
          <Form.Item className={styles.dataName} label={handleAddCustomTooltip(name, 10)}>
            {getFieldDecorator(name, {
              initialValue: data[value],
              rules: [
                { required: rulesShow, message: `请按照规则填写正确的${name} !` },
                { validator: rules },
              ],
            })(
              <Input
                placeholder="请输入"
                type="number"
                disabled={disabled}
                onChange={e => {
                  handleChangeInputValue(e, refData);
                }}
              />,
            )}
          </Form.Item>
        </Col>
      );
    } else
      return (
        <Col span={8} style={{ marginBottom: '15px' }}>
          <Form.Item className={styles.dataName} label={handleAddCustomTooltip(name, 10)}>
            {getFieldDecorator(name, {
              initialValue: data[value],
              rules: [{ required: rulesShow, message: `请按照规则填写正确的${name} !` }],
            })(
              <Input
                placeholder="请输入"
                type="number"
                disabled={disabled}
                onChange={e => {
                  handleChangeInputValue(e, refData);
                }}
              />,
            )}
          </Form.Item>
        </Col>
      );
  }
};

/**
 * 修改:日期框change
 * @param {Object} date 变化的时间框
 * @param {String} dateString 输入框日期String
 * @param {Object} refData 该输入框对应的数据
 */
export const handleChangeDatePickerValue = (date, dateString, refData) => {
  if (dateString) {
    refData.current = dateString;
  } else refData.current = '';
};

/**
 * 修改:日期框
 * @param {Object} data 数据源
 * @param {String} name 标签span名
 * @param {String} value input值
 * @param {string} refData 标签数据绑定源
 * @param {Bollean} rulesShow 是否必填
 * @param {Object} rules 自定义规则方法
 */
export const handleAddModalColDate = (
  getFieldDecorator,
  data,
  name,
  value,
  refData,
  rulesShow,
  rules,
) => {
  if (data) {
    if (rules) {
      return (
        <Col span={8} style={{ marginBottom: '15px' }}>
          <Form.Item className={styles.dataName} label={handleAddCustomTooltip(name, 10)}>
            {getFieldDecorator(name, {
              initialValue: data[value] ? moment(data[value]) : '',
              rules: [
                { required: rulesShow, message: `请按照规则填写正确的${name} !` },
                { validator: rules },
              ],
            })(
              <DatePicker
                placeholder="请选择"
                format="YYYY-MM-DD"
                className={styles.dateInput}
                onChange={(date, dateString) => {
                  handleChangeDatePickerValue(date, dateString, refData);
                }}
              />,
            )}
          </Form.Item>
        </Col>
      );
    } else
      return (
        <Col span={8} style={{ marginBottom: '15px' }}>
          <Form.Item className={styles.dataName} label={handleAddCustomTooltip(name, 10)}>
            {getFieldDecorator(name, {
              initialValue: data[value] ? moment(data[value]) : '',
              rules: [{ required: rulesShow, message: `请按照规则填写正确的${name} !` }],
            })(
              <DatePicker
                placeholder="请选择"
                format="YYYY-MM-DD"
                className={styles.dateInput}
                onChange={(date, dateString) => {
                  handleChangeDatePickerValue(date, dateString, refData);
                }}
              />,
            )}
          </Form.Item>
        </Col>
      );
  }
};

export const handleShowTableRedner = {
  render: (label) => {
    return (
      <Tooltip title={label} placement="topLeft">
        <span
          style={{
            width: '380px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            display: 'inline-block',
            paddingTop: '5px',
          }}
        >
          {label
            ? label.toString().replace(/null/g, '-')
            : label === '' || label === undefined
              ? '-'
              : 0}
        </span>
      </Tooltip>
    )
  }
}

export const handleShowTableSmallRedner = {
  render: (label) => {
    return (
      <Tooltip title={label} placement="topLeft">
        <span
          style={{
            width: '120px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            display: 'inline-block',
            paddingTop: '5px',
          }}
        >
          {label
            ? label.toString().replace(/null/g, '-')
            : label === '' || label === undefined
              ? '-'
              : 0}
        </span>
      </Tooltip>
    )
  }
}
