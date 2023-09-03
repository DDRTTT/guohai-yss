import { Modal, Form, Select, Tag } from 'antd';
import { handleFilterOption } from '@/pages/archiveTaskHandleList/util';
import { connect } from 'dva';

const CollectionCreateForm = Form.create({ name: 'form_in_modal' })(
  class extends React.Component {
    render() {
      const {
        visible,
        onCancel,
        onCreate,
        form,
        circulateHistoryUsers,
        authUserInfo,
        confirmLoading,
      } = this.props;
      const { getFieldDecorator } = form;

      return (
        <Modal
          visible={visible}
          title="传阅"
          okText="保存"
          onCancel={onCancel}
          onOk={onCreate}
          confirmLoading={confirmLoading}
        >
          <div style={{ marginBottom: '24px', display: 'flex' }}>
            <span style={{ width: '120px' }}>已传阅：</span>
            <span>
              {circulateHistoryUsers &&
                circulateHistoryUsers.map((item, index) => (
                  <Tag key={index} style={{ margin: '0 10px 10px 0' }}>
                    {item.username}
                  </Tag>
                ))}
            </span>
          </div>
          <Form layout="vertical">
            <Form.Item>
              {getFieldDecorator('circulateUser', {
                rules: [
                  {
                    required: true,
                    message: '请选择传阅',
                  },
                ],
              })(
                <Select
                  mode="multiple"
                  allowClear
                  placeholder="请选择传阅"
                  filterOption={handleFilterOption}
                >
                  {authUserInfo &&
                    authUserInfo.map(item => (
                      <Option value={item.id} key={item.id}>
                        {item.username}
                      </Option>
                    ))}
                </Select>,
              )}
            </Form.Item>
          </Form>
        </Modal>
      );
    }
  },
);

export default CollectionCreateForm;
