import { Button, Modal, Form, TreeSelect, message } from 'antd';
import { connect } from 'dva';
import treeNodeCustomize from './treeNodeCustomize';

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

  checkFilePathMoveFn = (payload = {}) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'documentManagementDetail/getCheckFilePathMoveReq',
      payload,
      callback: res => {
        if (res.data) {
          this.updatePathFn(payload);
        } else {
          Modal.confirm({
            title: `提示`,
            content: `当前移动的目录在之前的移动操作中已存在，是否继续？`,
            onOk: () => {
              this.updatePathFn(payload);
            },
          });
        }
      },
    });
  };

  updatePathFn = (payload = {}) => {
    const { dispatch, handleGetSysTreeData, handleGetTableData, handleClearVal } = this.props;
    dispatch({
      type: 'documentManagementDetail/getUpdatePathReq',
      payload,
      callback: () => {
        this.setState({ visible: false });
        handleClearVal();
        handleGetSysTreeData();
        handleGetTableData();
      },
    });
  };

  handleCreate = () => {
    const {
      form: { validateFields },
      record,
    } = this.props;
    const ableUseFileIds = record.filter(
      item =>
        item.operStatus === '0' ||
        item.operStatus === '2' ||
        item.operStatus === '3' ||
        item.operStatus === '5',
    );

    if (ableUseFileIds.length === 0) {
      message.warn('仅待提交、已审批、待归档、已归档的文件可进行目录移动~');
      return;
    }

    validateFields((err, values) => {
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

      this.checkFilePathMoveFn({ pathId, fileIds });
    });
  };

  saveFormRef = formRef => {
    this.formRef = formRef;
  };

  render() {
    const { visible } = this.state;
    const {
      saveTreeData,
      form: { getFieldDecorator },
    } = this.props;

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
        <Modal
          visible={visible}
          width={'50vw'}
          title="批量移动文件目录"
          okText="确定"
          onCancel={this.handleCancel}
          onOk={this.handleCreate}
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
      </div>
    );
  }
}

export default connect()(Form.create({ name: 'form_in_modal' })(CollectionsPage));
