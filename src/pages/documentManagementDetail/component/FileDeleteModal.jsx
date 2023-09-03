import { Button, Modal, Form, Input } from 'antd';
const { TextArea } = Input;

const FileDeleteModal = Form.create({ name: 'form_in_modal' })(
    class extends React.Component {
        render() {
            const { visible, loading, onCancel, onCreate, form } = this.props;
            const { getFieldDecorator } = form;
            return (
                <Modal
                    visible={ visible }
                    title="删除信息"
                    onCancel={ onCancel }
                    onOk={ onCreate }
                    confirmLoading={ loading }
                >
                    <Form layout="vertical">
                        <Form.Item label="删除原因">
                            { getFieldDecorator('delReason', {
                                rules: [{ required: true, message: '请输入删除原因...' }],
                            })(<TextArea rows={ 4 } maxLength={ 500 } />) }
                        </Form.Item>
                    </Form>
                </Modal>
            );
        }
    },
);

export default FileDeleteModal;