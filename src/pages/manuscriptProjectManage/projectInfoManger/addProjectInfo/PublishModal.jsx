import { Button, Modal, Form, Row, Col, Input, Select, DatePicker, message } from 'antd';
import ModalWin from './ModalWin.jsx';
import styles from './publishModal.less';

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
      const { visible, onCancel, onCreate, form } = this.props;
      const { getFieldDecorator } = form;

      return (
        <ModalWin
          id="proMemberModal"
          title={'项目发行信息'}
          visible={visible}
          okText="确定"
          onCancel={onCancel}
          onOk={onCreate}
        >
          <Form className={styles.publishModalForm}>
            <Row>
              <Col>
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
              <Col>
                <Form.Item label="证券简称:">
                  {getFieldDecorator('stockShortName', {
                    rules: [{ required: true, message: '证券简称是必填项' }],
                  })(<Input placeholder="请输入" maxLength={12} />)}
                </Form.Item>
              </Col>
              <Col>
                <Form.Item label="挂牌日期">
                  {getFieldDecorator('issueTime', {
                    rules: [{ required: true, message: '挂牌日期是必填项' }],
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

class PublishModal extends React.Component {
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

      values.issueTime = this.formatDate(values.issueTime._d);

      this.props.onConfirm(values);
      form.resetFields();
      this.setState({ visible: false });
    });
  };

  saveFormRef = formRef => {
    this.formRef = formRef;
  };

  render() {
    return (
      <>
        <Button
          type="primary"
          onClick={this.showModal}
          style={{ float: 'right', marginBottom: 10 }}
        >
          添加发行信息
        </Button>
        <CollectionForm
          wrappedComponentRef={this.saveFormRef}
          visible={this.state.visible}
          onCancel={this.handleCancel}
          onCreate={this.handleCreate}
        ></CollectionForm>
      </>
    );
  }
}

export default PublishModal;
