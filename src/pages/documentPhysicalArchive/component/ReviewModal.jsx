import React, { Component } from 'react';
import { connect } from 'dva';
import { Button, Modal, Input, message } from 'antd';

const { TextArea } = Input;

class ReviewModal extends Component {
  state = {
    show: false,
    opinion: '',
    loading: false,
  };

  handleModalShow = () => {
    this.setState({
      show: true,
    });
  };

  handleModalHide = () => {
    this.setState({
      show: false,
      opinion: '',
      loading: false,
    });
  };

  handleReview = () => {
    const { dispatch, taskId, updateTable } = this.props;
    const { opinion, loading } = this.state;

    if (!opinion) {
      message.warn('请输入审核意见~');
      return;
    }

    if (loading) {
      return;
    }

    this.setState({ loading: true });
    dispatch({
      type: `documentPhysicalArchive/getFileHandleReq`,
      payload: {
        opinion,
        taskId,
      },
      callback: res => {
        if (res && res.status === 200) {
          message.success('审批成功~');
          this.handleModalHide();
          updateTable();
        } else {
          message.error(res.message);
          this.setState({ loading: false });
        }
      },
    });
  };

  handleChange = e => {
    this.setState({
      opinion: e.target.value,
    });
  };

  render() {
    const { show, opinion } = this.state;
    return (
      <span>
        <Button type="primary" style={{ marginRight: '12px' }} onClick={this.handleModalShow}>
          审批
        </Button>
        <Modal
          bodyStyle={{
            height: '240px',
            overflowY: 'auto',
          }}
          title="审核意见"
          visible={show}
          onOk={this.handleReview}
          onCancel={this.handleModalHide}
        >
          <TextArea
            rows={6}
            placeholder="请输入审核意见~"
            value={opinion}
            maxLength={200}
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
