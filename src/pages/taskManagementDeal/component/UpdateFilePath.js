/**
 * author: jiaqiuhua
 * date: 2021/7/28
 * note: 文件目录迁移
 * **/

import { Button, Modal, Form, TreeSelect, message } from 'antd';
import { connect } from 'dva';
import treeNodeCustomize from './treeNodeCustomize';

const CollectionCreateForm = Form.create({ name: 'form_in_modal' })(
  class extends React.Component {
    state = {
      pathId: undefined,
    };

    onChange = (value, label, extra) => {
      this.setState({
        pathId: extra.triggerNode.props.eventKey,
      });
    };

    render() {
      const { pathId } = this.state;
      const { visible, onCancel, onCreate, form, saveTreeData } = this.props;
      const { getFieldDecorator } = form;
      return (
        <Modal
          visible={visible}
          width={'50vw'}
          title="批量移动文件目录"
          okText="确定"
          onCancel={onCancel}
          onOk={onCreate}
        >
          <Form layout="vertical">
            <Form.Item label="文件目录：">
              {getFieldDecorator('pathId', {
                rules: [{ required: true, message: '请选择新的文件所属目录!' }],
              })(
                <TreeSelect
                  showSearch
                  style={{ width: '100%' }}
                  value={pathId}
                  dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                  placeholder="请选择新的文件所属目录!"
                  allowClear
                  treeDefaultExpandAll
                  onChange={this.onChange}
                >
                  {treeNodeCustomize(saveTreeData)}
                </TreeSelect>,
              )}
            </Form.Item>
          </Form>
        </Modal>
      );
    }
  },
);

class CollectionsPage extends React.Component {
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
    const {
      props: { form },
      state: { pathId },
    } = this.formRef;
    const { dispatch, record, handleGetSysTreeData, handleGetTableData } = this.props;
    const fileIds = record.filter(item => item.operStatus === '0').map(item => item.id);

    if (fileIds.length === 0) {
      return message.warn('您所选择的文档中没有待提交的文档，不可进行文档目录移动~');
    }

    form.validateFields((err, values) => {
      if (err) {
        return;
      }

      dispatch({
        type: 'taskManagementDeal/getUpdateFilePathReq',
        payload: {
          pathId,
          fileIds,
        },
        callback: () => {
          form.resetFields();
          this.setState({ visible: false });
          handleGetSysTreeData();
          handleGetTableData();
        },
      });
    });
  };

  saveFormRef = formRef => {
    this.formRef = formRef;
  };

  render() {
    const { saveTreeData } = this.props;
    return (
      <div>
        <Button
          size="small"
          type="link"
          style={{ color: 'rgba(0, 0, 0, 0.65)' }}
          onClick={this.showModal}
        >
          批量移动
        </Button>
        <CollectionCreateForm
          wrappedComponentRef={this.saveFormRef}
          visible={this.state.visible}
          saveTreeData={saveTreeData}
          onCancel={this.handleCancel}
          onCreate={this.handleCreate}
        />
      </div>
    );
  }
}

export default connect()(CollectionsPage);
