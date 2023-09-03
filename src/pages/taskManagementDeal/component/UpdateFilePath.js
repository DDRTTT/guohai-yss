import { Button, Modal, Form, TreeSelect, message } from 'antd';
import { connect } from 'dva';
import treeNodeCustomize from './treeNodeCustomize';

const CollectionCreateForm = Form.create({ name: 'form_in_modal' })(
  class extends React.Component {
    render() {
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
                  dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                  placeholder="请选择新的文件所属目录!"
                  allowClear
                  treeDefaultExpandAll
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
    } = this.formRef;
    const { dispatch, record, handleGetSysTreeData, handleGetTableData } = this.props;
    const ableUseFileIds = record.filter(item => item.operStatus === '0');

    if (ableUseFileIds.length === 0) {
      return message.warn('您所选择的文档中没有待提交的文档，不可进行文档目录移动~');
    }

    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      const { pathId } = values;
      const fileIds = ableUseFileIds.filter(item => item.awpCode !== pathId).map(item => item.id);

      if (!pathId) {
        return;
      }

      if (fileIds.length === 0) {
        message.warn('目录未改变，请选择移动不同的目录');
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
