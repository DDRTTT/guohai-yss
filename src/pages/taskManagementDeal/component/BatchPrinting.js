import { Modal, Form, Radio, Button, message } from 'antd';

const CollectionCreateForm = Form.create({ name: 'batch_printing_modal' })(
  class extends React.Component {
    state = {
      disabled: true,
    };

    handleRadioChange = e => {
      const {
        form: { getFieldValue, setFieldsValue },
      } = this.props;
      const value = e.target.value;

      setFieldsValue({
        useSeal: value === 0 ? 0 : getFieldValue('useSeal'),
      });

      this.setState({
        disabled: value === 0,
      });
    };

    render() {
      const { visible, onCancel, onCreate, form } = this.props;
      const { getFieldDecorator, getFieldValue } = form;
      const { disabled } = this.state;

      return (
        <Modal visible={visible} title="批量用印" okText="确定" onCancel={onCancel} onOk={onCreate}>
          <Form layout="vertical">
            <Form.Item label="是否需要用印">
              {getFieldDecorator('needUseSeal', {
                initialValue: 0,
              })(
                <Radio.Group onChange={this.handleRadioChange}>
                  <Radio value={1}>是</Radio>
                  <Radio value={0}>否</Radio>
                </Radio.Group>,
              )}
            </Form.Item>
            <Form.Item label="是否用印文档">
              {getFieldDecorator('useSeal', {
                initialValue: 0,
              })(
                <Radio.Group disabled={disabled}>
                  <Radio value={1}>是</Radio>
                  <Radio value={0}>否</Radio>
                </Radio.Group>,
              )}
            </Form.Item>
          </Form>
        </Modal>
      );
    }
  },
);

class BatchPrinting extends React.Component {
  state = {
    visible: false,
  };

  showModal = () => {
    this.setState({ visible: true });
  };

  handleCancel = () => {
    this.setState({ visible: false });
  };

  handleCreate = () => {
    const { form } = this.formRef.props;
    const { batchOperationParams, handleRadioChange } = this.props;

    if (batchOperationParams.length === 0) {
      message.warn('请选择需要批量用印的文档~');
      return;
    }

    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      const params = batchOperationParams.map(item => {
        return {
          id: item.id,
          ...values,
        };
      });

      handleRadioChange(params);
      // 有问题：重置了子组件state中的数据，disabled的初始值变成了false
      // form.resetFields();
      this.setState({ visible: false });
    });
  };

  saveFormRef = formRef => {
    this.formRef = formRef;
  };

  render() {
    return (
      <div>
        <Button size="small" type="link" style={{ color: '#666' }} onClick={this.showModal}>
          批量用印
        </Button>
        <CollectionCreateForm
          wrappedComponentRef={this.saveFormRef}
          visible={this.state.visible}
          onCancel={this.handleCancel}
          onCreate={this.handleCreate}
        />
      </div>
    );
  }
}

export default BatchPrinting;
