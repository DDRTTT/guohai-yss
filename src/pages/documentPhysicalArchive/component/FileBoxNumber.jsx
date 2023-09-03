import React, { Component } from 'react';
import { connect } from 'dva';
import { Button, Modal, Input, message } from 'antd';

class ReviewModal extends Component {
  state = {
    show: false,
    fileBoxNum: '',
  };

  handleModalShow = () => {
    this.setState({
      show: true,
      fileBoxNum: '',
    });
  };

  handleModalHide = () => {
    this.setState({
      show: false,
      loading: false,
    });
  };

  handleReview = () => {
    const { dispatch, record, updateTable } = this.props;
    const { fileBoxNum, loading } = this.state;
    const fileIds = record.map(item => item.id);

    if (!fileBoxNum) {
      message.warn('请输入档案盒号~');
      return;
    }

    if (loading) {
      return;
    }

    this.setState({ loading: true });
    dispatch({
      type: `documentPhysicalArchive/getRealTimeSaveReq`,
      payload: {
        fileIds,
        fileBoxNum,
      },
      callback: res => {
        if (res && res.status === 200) {
          message.success('录入成功~');
          this.handleModalHide();
          updateTable();
        } else {
          message.error(res.message);
        }

        this.setState({ loading: false });
      },
    });
  };

  handleChange = e => {
    this.setState({
      fileBoxNum: e.target.value,
    });
  };

  render() {
    const { record = [] } = this.props;
    const { show, fileBoxNum } = this.state;

    return (
      <span>
        <Button
          type="primary"
          style={{ marginRight: '12px' }}
          disabled={record.length === 0}
          onClick={this.handleModalShow}
        >
          档案盒号录入
        </Button>
        <Modal
          bodyStyle={{
            height: '240px',
            overflowY: 'auto',
          }}
          title="档案盒号"
          visible={show}
          onOk={this.handleReview}
          onCancel={this.handleModalHide}
        >
          <Input
            placeholder="请输入档案盒号"
            value={fileBoxNum}
            maxLength={32}
            onChange={this.handleChange}
          />
        </Modal>
      </span>
    );
  }
}

export default connect(({ documentPhysicalArchive }) => ({
  documentPhysicalArchive,
}))(ReviewModal);
