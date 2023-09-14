import {
  Button,
  Table,
  Modal,
  Select,
  Form,
  Input,
  Radio,
  Row,
  Col,
  DatePicker,
  message,
  Tooltip,
} from 'antd';
import styles from './publish.less';
import moment from 'moment';
import request from '@/utils/request';

const Option = Select.Option;
const deChineseReg = /^[a-zA-Z0-9_]{0,}$/; //不能包含特殊字符和中文校验
const PublishModalForm = Form.create({ name: 'form_in_modal' })(
  class extends React.Component {
    state = {
      publishList: [],
      stockCode: '',
      stockShortName: '',
      issueTime: '',
      flag: 'add',
      modifyIndex: -1,
      columns: [
        {
          key: 'stockCode',
          title: '证券代码',
          dataIndex: 'stockCode',
          align: 'center',
          ellipsis: {
            showTitle: false,
          },
          render: stockCode => {
            return (
              <Tooltip placement="topLeft" title={stockCode}>
                <span>{stockCode}</span>
              </Tooltip>
            );
          },
        },
        {
          key: 'stockShortName',
          title: '证券简称',
          dataIndex: 'stockShortName',
          align: 'center',
          ellipsis: {
            showTitle: false,
          },
          render: stockShortName => {
            return (
              <Tooltip placement="topLeft" title={stockShortName}>
                <span>{stockShortName}</span>
              </Tooltip>
            );
          },
        },
        {
          key: 'issueTime',
          title: '挂牌日期',
          dataIndex: 'issueTime',
          width: 130,
          align: 'center',
          render: issueTime => <span>{issueTime.slice(0, 10)}</span>,
        },
        {
          key: 'id',
          title: '操作',
          dataIndex: 'id',
          width: 125,
          align: 'center',
          fixed: 'right',
          render: (id, record) => (
            <>
              <Button onClick={() => this.modifyPublishInfo(record)} type="link" size="small">
                修改
              </Button>
              <Button onClick={() => this.deletePublishInfo(record)} type="link" size="small">
                删除
              </Button>
            </>
          ),
        },
      ],
    };

    // 校验空格
    removetrim = (rule, value, callback) => {
      if (value) {
        if (value.length != value.trim().length) {
          callback('请删除前后端多余空格');
        } else {
          callback();
        }
      } else {
        callback();
      }
    };
    formatDate(date) {
      const Y = date.getFullYear();
      const M = date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1;
      const D = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate();
      return `${Y}-${M}-${D} 00:00:00`;
    }

    addPublishInfo = () => {
      const {
        form: { validateFields, getFieldsValue },
      } = this.props;
      const { publishList, flag, modifyIndex } = this.state;
      validateFields((err, values) => {
        if (!err) {
          values.issueTime = this.formatDate(values.issueTime._d);

          if (flag === 'add') {
            this.setState({
              publishList: [
                ...publishList,
                {
                  stockCode: values.stockCode,
                  stockShortName: values.stockShortName,
                  issueTime: values.issueTime,
                },
              ],
            });
          } else {
            publishList.forEach((item, index) => {
              if (index === modifyIndex) {
                item.stockCode = values.stockCode;
                item.stockShortName = values.stockShortName;
                item.issueTime = values.issueTime;
              }
            });
          }
          this.props.form.resetFields();
          this.setState({
            flag: 'add',
          });
        }
      });
    };

    modifyPublishInfo = record => {
      this.props.form.setFieldsValue({
        stockCode: record.stockCode,
        stockShortName: record.stockShortName,
        issueTime: moment(record.issueTime),
      });
      this.setState({
        flag: 'modify',
        modifyIndex: this.state.publishList.indexOf(record),
      });
    };

    deletePublishInfo = record => {
      const newPublishList = this.state.publishList.filter(item => {
        return item !== record;
      });
      this.setState(
        {
          publishList: newPublishList,
        },
        () => {
          this.props.form.resetFields();
          this.setState({
            flag: 'add',
          });
        },
      );
    };

    render() {
      const { publishList, columns, flag } = this.state;
      const { visible, onCancel, onCreate, form, data } = this.props;
      const { getFieldDecorator } = form;
      const layout = {
        labelAlign: 'right',
        labelCol: { span: 7 },
        wrapperCol: { span: 15 },
      };

      return (
        <Modal
          width={900}
          id="publishModal"
          visible={visible}
          title="补录信息"
          okText="确定"
          onCancel={onCancel}
          onOk={() => onCreate(publishList)}
        >
          <Form {...layout} className={styles.publishForm}>
            <Row>
              <Col span={12}>
                <Form.Item label="证券代码:">
                  {getFieldDecorator('stockCode', {
                    rules: [
                      { required: true, message: '证券代码是必填项' },
                      {
                        validator: (rule, value, callback) => {
                          if (value && !deChineseReg.test(value)) {
                            callback('证券代码中不能包含汉字及特殊字符!');
                          } else {
                            callback();
                          }
                        },
                      },
                    ],
                  })(<Input placeholder="请输入" maxLength={20} />)}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="证券简称:">
                  {getFieldDecorator('stockShortName', {
                    rules: [{ required: true, message: '证券简称是必填项' }],
                  })(<Input placeholder="请输入" maxLength={12} />)}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="挂牌日期">
                  {getFieldDecorator('issueTime', {
                    rules: [{ required: true, message: '挂牌日期是必填项' }],
                  })(<DatePicker placeholder="请选择" />)}
                </Form.Item>
              </Col>
            </Row>
          </Form>
          <Button
            type="primary"
            onClick={this.addPublishInfo}
            style={{ float: 'right', marginBottom: 10, zIndex: 999 }}
          >
            {flag === 'add' ? '添加一条发行信息' : '修改'}
          </Button>
          <Table columns={columns} dataSource={publishList} bordered pagination={false} />
        </Modal>
      );
    }
  },
);

class PublishModal extends React.Component {
  state = {
    visible: false,
  };

  showModal = () => {
    this.formRef.props.form.resetFields();
    request(
      `/yss-awp-server/product/getReportOrPublish?proCode=${this.props.proCode}&type=publish`,
    ).then(res => {
      if (res?.status === 200) {
        if (res.data)
          this.formRef.setState({
            publishList: res.data,
          });
      } else {
        message.warn(res.message);
      }
    });
    this.setState({ visible: true });
  };

  handleCancel = () => {
    this.setState({ visible: false });
  };

  handleCreate = publishList => {
    if (!publishList.length) {
      return message.warning('请至少添加一条发行信息');
    }
    this.props
      .dispatch({
        type: 'projectInfoManger/projectPublish',
        payload: {
          proPublishInfoList: publishList,
          proCode: this.props.proCode,
        },
      })
      .then(res => {
        if (res && res.status === 200) {
          message.success('项目发行成功!');
          this.formRef.setState({
            publishList: [],
          });
          this.setState({ visible: false });
          this.props.onConfirm();
        } else {
          message.error(res.message);
        }
      });
  };

  saveFormRef = formRef => {
    this.formRef = formRef;
  };

  render() {
    return (
      <>
        <Button type="link" size="small" onClick={this.showModal}>
          发行
        </Button>
        <PublishModalForm
          wrappedComponentRef={this.saveFormRef}
          visible={this.state.visible}
          onCancel={this.handleCancel}
          onCreate={this.handleCreate}
        />
      </>
    );
  }
}

export default PublishModal;
