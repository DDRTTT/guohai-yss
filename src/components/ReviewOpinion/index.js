import React, { Component } from 'react';
import { connect } from 'dva';
import { Button, Col, Row, Modal, List } from 'antd';

class ReviewOpinion extends Component {
  state = {
    show: false,
  };

  handleModalShow = () => {
    this.setState({
      show: true,
    });
  };

  handleModalHide = () => {
    this.setState({
      show: false,
    });
  };

  /**
   * 审核意见
   * * */
  handleReviewOpinion = () => {
    const { dispatch, processInstanceId } = this.props;
    this.handleModalShow();
    dispatch({
      type: 'review/getReviewReq',
      payload: {
        processInstanceId,
      },
    });
  };

  render() {
    const { show } = this.state;
    const {
      loading,
      review: { reviewList },
    } = this.props;

    return (
      <span>
        <Button size="small" type="link" onClick={this.handleReviewOpinion}>
          审核意见
        </Button>
        <Modal
          bodyStyle={{
            height: '350px',
            overflowY: 'auto',
          }}
          title="审核意见"
          visible={show}
          onOk={this.handleModalHide}
          onCancel={this.handleModalHide}
        >
          <List
            loading={loading}
            itemLayout="horizontal"
            dataSource={reviewList}
            renderItem={(item, index) => (
              <List.Item key={index}>
                <List.Item.Meta
                  title={
                    <Row type="flex">
                      <Col span={8}>{item.reviewer}</Col>
                      <Col span={16}>{item.createTime}</Col>
                    </Row>
                  }
                  description={item.opinion}
                />
              </List.Item>
            )}
          />
        </Modal>
      </span>
    );
  }
}

export default connect(({ review, loading }) => ({
  review,
  loading: loading.effects['review/getReviewReq'],
}))(ReviewOpinion);
