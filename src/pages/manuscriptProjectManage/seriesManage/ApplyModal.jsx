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
import styles from './applyModal.less';
import moment from 'moment';
import request from '@/utils/request';

const Option = Select.Option;
const ApplyModalForm = Form.create({ name: 'form_in_modal' })(
  class extends React.Component {
      state = {
        applyList: [],
        tradingPlaces: '',
        otherTradingPlaces: '',
        declareTime: '',
        flag: 'add',
        modifyIndex: -1,
        columns:[
          {
            key: 'tradingPlaces',
            title: '交易场所',
            dataIndex: 'tradingPlaces',
            align: 'center',
            ellipsis: {
              showTitle: false,
            },
            render: tradingPlaces => this.getTradingPlaces(tradingPlaces),
          },
          {
            key: 'otherTradingPlaces',
            title: '其他交易场所',
            dataIndex: 'otherTradingPlaces',
            align: 'center',
            ellipsis: {
              showTitle: false,
            },
            render: (otherTradingPlaces, record) => (
              <Tooltip
                placement="topLeft"
                title={record.tradingPlaces === '2007' ? otherTradingPlaces : ''}
              >
                <span>{record.tradingPlaces === '2007' ? otherTradingPlaces : ''}</span>
              </Tooltip>
            ),
          },
          {
            key: 'declareTime',
            title: '申报受理日期',
            dataIndex: 'declareTime',
            width: 130,
            align: 'center',
            render: declareTime => <span>{declareTime.slice(0, 10)}</span>,
          },
        ],
        columnsCopy:[
          {
            key: 'tradingPlaces',
            title: '交易场所',
            dataIndex: 'tradingPlaces',
            align: 'center',
            ellipsis: {
              showTitle: false,
            },
            render: tradingPlaces => this.getTradingPlaces(tradingPlaces),
          },
          {
            key: 'otherTradingPlaces',
            title: '其他交易场所',
            dataIndex: 'otherTradingPlaces',
            align: 'center',
            ellipsis: {
              showTitle: false,
            },
            render: (otherTradingPlaces, record) => (
              <Tooltip
                placement="topLeft"
                title={record.tradingPlaces === '2007' ? otherTradingPlaces : ''}
              >
                <span>{record.tradingPlaces === '2007' ? otherTradingPlaces : ''}</span>
              </Tooltip>
            ),
          },
          {
            key: 'declareTime',
            title: '申报受理日期',
            dataIndex: 'declareTime',
            width: 130,
            align: 'center',
            render: declareTime => <span>{declareTime.slice(0, 10)}</span>,
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
                <Button onClick={() => this.modifyApplyInfo(record)} type="link" size="small">
                  修改
                </Button>
                <Button onClick={() => this.deleteApplyInfo(record)} type="link" size="small">
                  删除
                </Button>
              </>
            ),
          },
        ],
      };


    getTradingPlaces = tradingPlaces => {
      const { tradingPlacesList } = this.props.data;
      const tradingPlacesName =
        tradingPlacesList &&
        tradingPlacesList.filter(item => {
          return item.code === tradingPlaces;
        })[0];
      return (
        <Tooltip placement="topLeft" title={tradingPlacesName.name}>
          <span>{tradingPlacesName.name}</span>
        </Tooltip>
      );
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

    addApplyInfo = () => {
      const {
        form: { validateFields, getFieldsValue },
      } = this.props;
      const { applyList, flag, modifyIndex } = this.state;
      validateFields((err, values) => {
        if (!err) {
          values.declareTime = moment(values.declareTime._d).format('YYYY-MM-DD 00:00:00');

          if (flag === 'add') {
            this.setState({
              applyList: [
                ...applyList,
                {
                  tradingPlaces: values.tradingPlaces,
                  otherTradingPlaces:
                    values.tradingPlaces === '2007' ? values.otherTradingPlaces : '',
                  declareTime: values.declareTime,
                },
              ],
            });
          } else {
            applyList.forEach((item, index) => {
              if (index === modifyIndex) {
                item.tradingPlaces = values.tradingPlaces;
                item.otherTradingPlaces =
                  values.tradingPlaces === '2007' ? values.otherTradingPlaces : '';
                item.declareTime = values.declareTime;
              }
            });
          }
          this.props.form.resetFields();
          this.setState({
            tradingPlaces: '',
            flag: 'add',
          });
        }
      });
    };

    modifyApplyInfo = record => {
      this.props.form.setFieldsValue({
        tradingPlaces: record.tradingPlaces,
        otherTradingPlaces: record.otherTradingPlaces,
        declareTime: moment(record.declareTime),
      });
      this.setState({
        flag: 'modify',
        tradingPlaces: record.tradingPlaces,
        modifyIndex: this.state.applyList.indexOf(record),
      });
    };

    deleteApplyInfo = record => {
      const newapplyList = this.state.applyList.filter(item => {
        return item !== record;
      });
      this.setState(
        {
          applyList: newapplyList,
        },
        () => {
          this.props.form.resetFields();
          this.setState({
            tradingPlaces: '',
            flag: 'add',
          });
        },
      );
    };

    render() {
      const { applyList, tradingPlaces, columns, flag, columnsCopy } = this.state;
      const { visible, onCancel, onCreate, form, data,seriesCode } = this.props;
      const { productFilterOption, tradingPlacesList } = data;
      const { getFieldDecorator } = form;
      const layout = {
        labelAlign: 'right',
        labelCol: { span: 7 },
        wrapperCol: { span: 15 },
      };

      return (
        <Modal
          width={900}
          id="applyModal"
          visible={visible}
          title="补录信息"
          // okText="确定"
          onCancel={onCancel}
          // onOk={() => onCreate(applyList)}
          footer={seriesCode?[
            <Button onClick={onCancel}>
              取消
            </Button>,
          ]:[
            <Button onClick={onCancel}>
              取消
            </Button>,
            <Button type="primary" onClick={() => onCreate(applyList)}>
              确定
            </Button>,
          ]}

        >
          {this.props.seriesCode?null:<Form {...layout} className={styles.applyForm}>
            <Row>
              <Col span={12}>
                <Form.Item label="交易场所:">
                  {getFieldDecorator('tradingPlaces', {
                    rules: [{ required: true, message: '交易场所是必选项' }],
                  })(
                    <Select
                      placeholder="请选择"
                      showArrow
                      onChange={val => this.setState({ tradingPlaces: val })}
                    >
                      {tradingPlacesList &&
                        tradingPlacesList.map(item => (
                          <Option key={item.code} value={item.code}>
                            {item.name}
                          </Option>
                        ))}
                    </Select>,
                  )}
                </Form.Item>
              </Col>
              <Col
                span={12}
                style={{ display: tradingPlaces === '2007' ? 'inline-block' : 'none' }}
              >
                <Form.Item name="otherTradingPlaces" label="其它交易场所:">
                  {getFieldDecorator('otherTradingPlaces', {
                    rules: [
                      { required: tradingPlaces === '2007', message: '其他交易场所是必选项' },
                    ],
                  })(<Input placeholder="请输入" maxLength={50} />)}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="申报受理日期">
                  {getFieldDecorator('declareTime', {
                    rules: [{ required: true, message: '申报受理日期是必填项' }],
                  })(<DatePicker placeholder="请选择" />)}
                </Form.Item>
              </Col>
            </Row>
          </Form>}
          {
            this.props.seriesCode?null:<Button
            type="primary"
            onClick={this.addApplyInfo}
            style={{ float: 'right', marginBottom: 10, zIndex: 999 }}
          >
            {flag === 'add' ? '添加一条申报信息' : '修改'}
          </Button>
          }

          <Table
            columns={seriesCode?columns:columnsCopy}
            dataSource={applyList}
            // scroll={{ x: 1100 }}
            bordered
            pagination={false}
          />
        </Modal>
      );
    }
  },
);

class ApplyModal extends React.Component {
  state = {
    visible: false
  };

  showModal = () => {
    this.formRef.props.form.resetFields();
    request(
      `/yss-awp-server/product/getReportOrPublish?proCode=${this.props.proCode}&type=report`,
    ).then(res => {
      if (res?.status === 200) {
        if (res.data){
          this.formRef.setState({
            applyList: res.data,
          });
          if (!res.data.length&&this.props.seriesCode){
            message.warn('由于项目关联的系列未维护申报数据，目前暂时无法获取相关信息')
          }
        }
      } else {
        message.warn(res.message);
      }
      if (this.props.seriesCode&&!res.data.length){
        this.setState({ visible: false });
      }else{
        this.setState({ visible: true });
      }
    });
  };

  handleCancel = () => {
    this.setState({ visible: false });
  };

  handleCreate = applyList => {
    if (!applyList.length) {
      return message.warning('请至少添加一条申报信息');
    }
    this.props
      .dispatch({
        type: 'seriesManage/projectReport',
        payload: {
          proReportList: applyList,
          proCode: this.props.proCode,
        },
      })
      .then(res => {
        if (res && res.status === 200) {
          message.success('申报成功!');
          this.formRef.setState({
            applyList: [],
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
    const { data,seriesCode } = this.props;

    return (
      <>
        <Button type="link" size="small" onClick={this.showModal}>
          申报
        </Button>
        <ApplyModalForm
          wrappedComponentRef={this.saveFormRef}
          visible={this.state.visible}
          onCancel={this.handleCancel}
          onCreate={this.handleCreate}
          data={data}
          seriesCode={seriesCode}
        />
      </>
    );
  }
}

export default ApplyModal;
