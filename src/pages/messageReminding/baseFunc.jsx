import {
  Alert,
  Button,
  Card,
  Col,
  DatePicker,
  Form,
  Icon,
  Input,
  Row,
  Select,
  Table,
  Tooltip,
} from 'antd';
import styles from './index.less';
import PageContainer from '@/components/PageContainers';
import {filterOption} from '@/utils/utils';

const FormItem = Form.Item;
const { RangePicker } = DatePicker;

const gutter = { md: 8, lg: 24, xl: 48 };

/**
 * 面包屑导航
 * @param {Array} breadcrumb 导航名称数组
 * @param {String} onAndOff 展开收起值
 * @param {Function} setOnAndOff 展开收起值变化方法
 * @param search
 * @param getFieldDecorator
 * @param resetFields
 * @param submit
 * @param action
 */
export const handleAddHeard = (
  breadcrumb,
  onAndOff,
  setOnAndOff,
  search,
  getFieldDecorator,
  resetFields,
  submit,
  action,
) => {
  return (
    <>
      <PageContainer />
      <Card style={{ paddingBottom: '16px' }}>
        <Row gutter={{ ...gutter }}>
          {onAndOff === undefined ? (
            ''
          ) : (
            <>
              <Col md={24} sm={24}>
                <div className={styles.seniorSearch} style={{ display: onAndOff ? 'none' : '' }}>
                  <Button
                    className={styles.searchLabel}
                    onClick={() => setOnAndOff(true)}
                    type="link"
                  >
                    展开搜索
                    <Icon type="down" />
                  </Button>
                </div>
              </Col>
              <Col md={24} sm={24}>
                <Form onSubmit={submit} style={{ display: onAndOff ? '' : 'none' }}>
                  <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                    {search ? handleAddSearch(search, getFieldDecorator) : ''}
                    <Col md={6} sm={24} style={{ float: 'right' }}>
                      <div className={styles.searchDiv}>
                        <span className={styles.submitButtons}>
                          {/* <Action code={`${action}:query`}> */}
                          <Button
                            htmlType="submit"
                            type="primary"
                            style={{
                              marginRight: '10px',
                            }}
                          >
                            查询
                          </Button>
                          {/* </Action> */}
                          <Button onClick={() => resetFields()}>重置</Button>
                        </span>
                        <Button
                          className={styles.searchLabelOff}
                          onClick={() => {
                            resetFields();
                            setOnAndOff(false);
                          }}
                          type="link"
                        >
                          收起&nbsp;
                          <Icon type="up" />
                        </Button>
                      </div>
                    </Col>
                  </Row>
                </Form>
              </Col>
            </>
          )}
        </Row>
      </Card>
    </>
  );
};

// 搜索框
export const handleAddSearch = (data, getFieldDecorator) => {
  const arr = [];
  for (const i in data) {
    const option = [];
    if (data[i].type === 'select') {
      for (const j of data[i].data) {
        const readSet = data[i].readSet || null;
        option.push(
          <Select.Option
            key={readSet ? j[readSet.code] : j.id}
            value={readSet ? j[readSet.code] : j.id}
          >
            {readSet ? j[readSet.name] : j.name}
          </Select.Option>,
        );
      }
      arr.push(
        <Col md={6} sm={24} key={i} className={styles.textAlign}>
          <FormItem>
            <span>{`${data[i].label} : `}</span>
            {getFieldDecorator(i, {
              initialValue: data[i].initialValue,
            })(
              <Select className={styles.searchInput} showArrow allowClear {...data[i].config} filterOption={filterOption}>
                {option}
              </Select>,
            )}
          </FormItem>
        </Col>,
      );
    } else if (data[i].type === 'rangePicker') {
      arr.push(
        <Col md={6} sm={24} key={i} className={styles.textAlign}>
          <FormItem>
            <span>{`${data[i].label} : `}</span>
            {getFieldDecorator(i)(<RangePicker className={styles.searchInput} />)}
          </FormItem>
        </Col>,
      );
    } else if (data[i].type === 'input') {
      arr.push(
        <Col md={6} sm={24} key={i} className={styles.textAlign}>
          <FormItem>
            <span>{`${data[i].label} : `}</span>
            {getFieldDecorator(i)(<Input className={styles.searchInput} />)}
          </FormItem>
        </Col>,
      );
    }
  }
  return arr;
};

/**
 * 表格
 * @param {Array} columns 表头
 * @param {Array} data 表格数据
 * @param {Object} pages 页码
 * @param {Object} rowSelection 复选框
 * @param {Function} onChange 变化回调
 * @param {String} loading 加载状态
 * @param handleAddButtons
 * @param alert
 * @param alertButton
 * @param setAlertTitle
 */
export const handleAddTable = (
  columns,
  data,
  pages,
  rowSelection,
  onChange,
  loading,
  handleAddButtons,
  alert,
  alertButton,
  setAlertTitle,
) => {
  return (
    <Card style={{ backgroundColor: '#fff', marginTop: '16px' }}>
      {handleAddButtons ? handleAddButtons() : ''}
      {alert ? handleAddAlert(alert, alertButton, setAlertTitle) : ''}
      <Table
        className={styles.controlButtonDiv}
        pagination={pages} // 分页栏
        rowSelection={rowSelection}
        loading={loading} // 加载中效果
        rowKey={record => record.id} // key值
        dataSource={data} // 表数据源
        columns={columns} // 表头数据
        onChange={onChange}
        scroll={{ x: true }}
      />
    </Card>
  );
};

// 提示卡
export const handleAddAlert = (alert, alertButton, setAlertTitle) => {
  return (
    <>
      <Alert
        description={[alert, alertButton()]}
        closable
        onClose={() => setAlertTitle('')}
        type="success"
        showIcon
        style={{ margin: '0px 0px 15px 0px' }}
      />
    </>
  );
};

// 表格字段提示信息
export const tableRender = {
  render: val => {
    return handleAddCustomTooltip(val, 20);
  },
};

// 下拉框渲染
export const handleAddSelect = (data, set) => {
  const arr = [];
  if (data) {
    for (const i in data) {
      arr.push(
        <Select.Option value={data[i].code} key={data[i].code}>
          {data[i].name}
        </Select.Option>,
      );
    }
    return (
      <div style={{ width: '300px' }}>
        <span>流程名称 : </span>
        <Select allowClear onChange={val => set(val)} showArrow style={{ width: '60%' }}>
          {arr}
        </Select>
      </div>
    );
  }
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
    }
    return val;
  }
  if (Array.isArray(val)) {
    const str = val.toLocaleString();
    if (str.length > num) {
      return (
        <Tooltip title={str}>
          <span>{str.substr(0, num - 2)}...</span>
        </Tooltip>
      );
    }
    return str;
  }
};
