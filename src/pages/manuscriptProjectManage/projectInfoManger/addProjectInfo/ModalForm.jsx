import { Button, Modal, Select, Form, Input, Radio } from 'antd';
import ModalWin from './ModalWin.jsx';

const ParticipantForm = Form.create({ name: 'form_in_modal' })(
  class extends React.Component {
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

    render() {
      const { visible, onCancel, onCreate, form, data } = this.props;
      const { proParticipantList } = data;
      const { getFieldDecorator } = form;
      return (
        <ModalWin
          id="participantModal"
          visible={visible}
          title="添加参与人"
          okText="确定"
          onCancel={onCancel}
          onOk={onCreate}
        >
          <Form layout="vertical">
            <Form.Item label="参与人类型">
              {getFieldDecorator('proRole', {
                rules: [
                  {
                    required: true,
                    message: '参与人类型不得为空',
                  },
                ],
              })(
                <Select
                  style={{ display: 'block' }}
                  placeholder="请选择参与人类型"
                  showSearch
                  filterOption={(input, option) =>
                    option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {proParticipantList &&
                    proParticipantList.map(item => (
                      <Option key={item.code} value={item.code}>
                        {item.name}
                      </Option>
                    ))}
                </Select>,
              )}
            </Form.Item>
            <Form.Item label="参与人名称">
              {getFieldDecorator('membeName', {
                rules: [
                  {
                    required: true,
                    message: '参与人名称不得为空',
                  },
                  {
                    validator: this.removetrim,
                  },
                ],
              })(<Input placeholder="请输入参与人名称" maxLength={25} />)}
            </Form.Item>
          </Form>
        </ModalWin>
      );
    }
  },
);

class CollectionsPage extends React.Component {
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

  handleCreate = () => {
    const { form } = this.formRef.props;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
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
          添加参与人
        </Button>
        <ParticipantForm
          wrappedComponentRef={this.saveFormRef}
          visible={this.state.visible}
          onCancel={this.handleCancel}
          onCreate={this.handleCreate}
          data={data}
        />
      </>
    );
  }
}

export default CollectionsPage;
