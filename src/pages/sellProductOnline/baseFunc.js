import { Form, Select } from 'antd';
import styles from './index.less';

const { Option } = Select;
const FormItem = Form.Item;

/**
 * 下拉框渲染
 * @param {String} spanName 标签名
 * @param {Array} data 数据源
 * @param {String} bindKey 标签绑定值
 * @param {String} name 下拉项name
 * @param {String} id 下拉项id
 * @param {String} placeholder 提示内容
 * @param {Function} getFieldDecorator 表单方法
 */
export const handleAddSelect = (
  spanName,
  data,
  bindKey,
  name,
  id,
  placeholder,
  getFieldDecorator,
) => {
  const arr = [];
  if (data !== []) {
    for (const key of data) {
      arr.push(<Select.Option value={key[id]}>{key[name]}</Select.Option>);
    }
  }
  return (
    <FormItem>
      <span>{spanName}</span>
      {getFieldDecorator(bindKey)(
        <Select mode="multiple" className={styles.searchInput} placeholder={placeholder} showArrow>
          {arr}
        </Select>,
      )}
    </FormItem>
  );
};
