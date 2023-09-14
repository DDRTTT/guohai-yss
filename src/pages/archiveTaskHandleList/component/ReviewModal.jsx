/**
 * 项目管理--审核弹框
 * 审批通过，审批拒绝
 * author: jiaqiuhua
 * * */
import React, { Component } from 'react';
import { connect } from 'dva';
import Action from '@/utils/hocUtil';
import { Button, Col, Row, Modal, Input, message } from 'antd';

const { TextArea } = Input;

class ReviewModal extends Component {
  state = {
    show: false,
    opinion: '',
    awpProductFile: [],
  };

  /**
   * 显示模态框
   * * */
  handleModalShow = () => {
    this.setState({
      show: true,
    });
  };

  /**
   * 隐藏模态框
   * **/
  handleModalHide = () => {
    this.setState({
      show: false,
      loading: false,
    });
  };

  /**
   * 审批按钮
   * 审批包括单个审批和批量审批(根据payload数组长度判断)
   * 批量审批时需要至少选中一个可审批项
   * **/
  handleReviewOperate = () => {
    const { payload } = this.props;
    const awpProductFile = payload
      .filter(item => item.processType === 'gtasksFile')
      .map(({ id, processInstanceId, awpFileNumber, awpName, processTaskId } = item) => ({
        id,
        processInstanceId,
        awpFileNumber,
        awpName,
        processTaskId,
      }));

    this.state.awpProductFile = awpProductFile;
    this.handleModalShow();
  };

  /**
   * 审批接口(包括审批通过接口、审批拒绝接口)
   * 注：审批通过和审批拒绝仅接口地址不同参数及成功后的回调相同，故封装为一个方法
   * apiFnName：所调接口的方法名
   * 审批通过: getProcessAuditReq
   * 审批拒绝：getAuditNoPassedReq
   *
   * **/
  handleReview = apiFnName => {
    const { dispatch, payload } = this.props;
    const { opinion, awpProductFile } = this.state;

    if (awpProductFile.length === 0) {
      message.warn('仅待办理的可进行审批~');
      return;
    }

    if (!opinion) {
      message.warn('请输入审核意见~');
      return;
    }

    this.setState({ loading: true });
    dispatch({
      type: `review/${apiFnName}`,
      payload: {
        awpProductFile,
        opinion,
        taskId: payload[0].taskId,
      },
      callback: () => {
        this.setState({ opinion: '', loading: false });
        message.success('审批成功~');
        this.handleModalHide();
        typeof this.props.success === 'function' && this.props.success();
      },
    });
  };

  /**
   * textarea
   * **/
  handleChange = e => {
    this.setState({
      opinion: e.target.value,
    });
  };

  render() {
    const { show, opinion, loading } = this.state;
    const { resetButtonStyle = {}, buttonText = '审批', buttonType = 'button' } = this.props;
    return (
      <span>
        <Button
          size="small"
          style={resetButtonStyle}
          type={buttonType}
          onClick={this.handleReviewOperate}
        >
          {buttonText}
        </Button>
        <Modal
          bodyStyle={{
            height: '240px',
            overflowY: 'auto',
          }}
          title="审核意见"
          content="确定删除吗？"
          visible={show}
          onCancel={this.handleModalHide}
          footer={[
            <Action code="archiveTaskHandleList:reviewNoPass">
              <Button disabled={loading} onClick={() => this.handleReview('getAuditNoPassedReq')}>
                审批拒绝
              </Button>
            </Action>,
            <Button
              type="primary"
              disabled={loading}
              onClick={() => this.handleReview('getProcessAuditReq')}
            >
              审批通过
            </Button>,
          ]}
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

export default connect(({ review }) => ({
  review,
}))(ReviewModal);
