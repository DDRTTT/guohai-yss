import React, { PureComponent } from "react";
import { connect } from "dva";
import { Button, Form, message, Modal, Tabs } from "antd";
import FileStandard from "../../../../components/JSXlsx/index";
import { stringify } from "qs";
import { download } from "../../../../utils/download";

const dateFormat = 'YYYY/MM/DD';
const TabPane = Tabs.TabPane;
@Form.create()
@connect(state => ({
  investorOpenAccounts: state.investorOpenAccounts,
}))
export default class ExportFile extends PureComponent {
  state = {
    optCtrl: true,
    btnState: false,
    importFileData: {},
    cancelText: '关闭',
    okText: '提交',
    commitDisabled: true,
    key: '1',
  };
  changeTab = (key) => {
    this.setState({
      key,
    });
  };
  //关闭弹窗
  cancelModal = () => {
    this.props.closeModal();
    this.props.form.resetFields();
  };
  //提交
  exoprtFileOk = () => {
    const { dispatch } = this.props;
    let data = this.state.dataUse;

    if (data) {
      data = JSON.parse(data);
      let allData = this.props.importFile;
      let title;
      for (let i = 0; i < allData.length; i++) {
        if (allData[i].remark == data.title) {
          title = allData[i].code;
        }
      }

      if (title) {
        dispatch({
          type: `${this.props.namespace}/uploadFile`,
          payload: { data, title },
        });
      } else {
        message.error('请添加正确模板');
      }
    }
    else {
      message.error('请选择要上传的文件');
    }
  };
  getData = (data) => {
    this.setState({
      dataUse: data,
      commitDisabled: false,
    });
  };
  //生成模板列表
  renderList = (data) => {
    if (data) {
      return data.map((info) => {
        return (
          <div>
            <a onClick={this.exportExcel.bind(this, info.name)}>{info.name}</a>
          </div>
        );
      });
    }
  };
  //下载报表
  exportExcel = (e) => {
    let val = {
      name: e,
    };
    download(`/ams/yss-itc-admin/bususer/downloadfile?${stringify(val)}`, val);
  };
  handleCancel = () => {
    this.props.closeModal();
    this.props.form.resetFields();
  };
  asd = (key) => {
    if (key === '1') {
      return (
        <div>
          <Button key="back" onClick={this.cancelModal}>取消</Button>
          <Button key="submit" type="primary" onClick={this.exoprtFileOk} disabled={this.state.commitDisabled}>
            提交
          </Button>
        </div>
      );
    } else {
      return (
        <div/>
      );
    }
  };

  componentWillReceiveProps(nextProps) {
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const FormItem = Form.Item;

    let useExcel = [];
    if (this.props.importFile) {
      for (let i = 0; i < this.props.importFile.length; i++) {
        useExcel[i] = {};
        useExcel[i].name = this.props.importFile[i].remark;
      }
    }

    return (
      <Modal
        visible={this.props.visible}
        width={800}
        onCancel={this.handleCancel}
        onOk={this.exoprtFileOk}
      >
        <Tabs defaultActiveKey="1" onChange={this.changeTab}>
          <TabPane tab="导入文件" key="1">
            <FileStandard
              sheet={useExcel}
              startStop={[0]}
              getData={this.getData}
              object={''}
            />
          </TabPane>
          <TabPane tab="下载模板" key="2">
            {this.renderList(this.props.importFile)}
          </TabPane>
        </Tabs>
      </Modal>
    );
  }
}
