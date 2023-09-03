import { Button, Modal, Form, Row, Col, Input, Select, DatePicker, message } from 'antd';
import ModalWin from './ModalWin.jsx';
import styles from './ReportModal.less';

const deChineseReg = /^[a-zA-Z0-9_]{0,}$/; //不能包含特殊字符和中文校验
const CollectionForm = Form.create({ name: 'form_in_modal' })(
  class extends React.Component {
    state = {
      tradingPlaces: '',
    };
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
    render() {
      const { tradingPlaces } = this.state;
      const {
        visible,
        onCancel,
        onCreate,
        form,
        data: { productFilterOption, tradingPlacesList },
      } = this.props;
      const { getFieldDecorator } = form;

      return (
        <ModalWin
          id="proMemberModal"
          title={'项目申报信息'}
          visible={visible}
          okText="确定"
          onCancel={onCancel}
          onOk={onCreate}
        >
          <Form layout="vertical" className={styles.reportModalForm}>
            <Row>
              <Col>
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
              <Col style={{ display: tradingPlaces === '2007' ? 'block' : 'none' }}>
                <Form.Item name="otherTradingPlaces" label="其它交易场所:">
                  {getFieldDecorator('otherTradingPlaces', {
                    rules: [
                      { required: tradingPlaces === '2007', message: '其他交易场所是必选项' },
                    ],
                  })(<Input placeholder="请输入" maxLength={50} />)}
                </Form.Item>
              </Col>
              <Col>
                <Form.Item label="申报受理日期">
                  {getFieldDecorator('declareTime', {
                    rules: [{ required: true, message: '申报受理日期是必填项' }],
                  })(<DatePicker placeholder="请选择" />)}
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </ModalWin>
      );
    }
  },
);

class ReportModal extends React.Component {
  state = {
    visible: false,
  };

  showModal = () => {
    this.formRef.props.form.resetFields();
    this.setState({ visible: true });
  };

  handleCancel = () => {
    this.setState({ visible: false });
  };

  formatDate(date) {
    const Y = date.getFullYear();
    const M = date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1;
    const D = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate();
    return `${Y}-${M}-${D} 00:00:00`;
  }

  handleCreate = () => {
    const { form } = this.formRef.props;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      values.declareTime = this.formatDate(values.declareTime._d);

      this.props.onConfirm(values);
      form.resetFields();
      this.setState({ visible: false });
    });
  };

  saveFormRef = formRef => {
    this.formRef = formRef;
  };

  render() {
    const { data } = this.props;

    return (
      <>
        <Button
          type="primary"
          onClick={this.showModal}
          style={{ float: 'right', marginBottom: 10 }}
        >
          添加申报信息
        </Button>
        <CollectionForm
          wrappedComponentRef={this.saveFormRef}
          visible={this.state.visible}
          onCancel={this.handleCancel}
          onCreate={this.handleCreate}
          data={data}
        ></CollectionForm>
      </>
    );
  }
}

export default ReportModal;
