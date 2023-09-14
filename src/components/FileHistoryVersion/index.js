/**
 * 底稿--查看文件历史版本
 * fileId：操作列id
 * author: jiaqiuhua
 * * */
import React, { Component } from 'react';
import { connect } from 'dva';
import { Button, Col, Row, Modal, Table } from 'antd';
import DownloadFile from '@/components/DownloadFile';
import Preview from '@/components/Preview';
import record from '@/pages/lifeCyclePRD/record';

class FileHistoryVersion extends Component {
  state = {
    columns: [
      {
        key: 'awpName',
        title: '文件名称',
        dataIndex: 'awpName',
        align: 'center',
      },
      {
        key: 'version',
        title: '文件版本',
        dataIndex: 'version',
        align: 'center',
      },
      {
        key: 'createTime',
        title: '上传时间',
        dataIndex: 'createTime',
        align: 'center',
      },
      {
        key: 'creatorName',
        title: '操作用户',
        dataIndex: 'creatorName',
        align: 'center',
      },
      {
        title: '操作',
        fixed: 'right',
        width: 150,
        align: 'center',
        render: (text, record) => {
          return (
            <>
              <DownloadFile buttonType="link" record={[record]} />
              <Button type="link" size="small" onClick={() => this.handlePreview(record)}>
                查看
              </Button>
            </>
          );
        },
      },
    ],
    show: false,
    previewShow: false,
  };

  /**
   * 隐藏模态框
   * **/
  handleModalHide = () => {
    this.setState({
      show: false,
    });
  };

  /**
   * 查看历史版本
   * **/
  handleLookHistoryVersion = () => {
    const { dispatch, fileId } = this.props;
    this.setState({ show: true });
    dispatch({
      type: 'documentManagementDetail/getFileHistoryReq',
      payload: {
        fileId,
      },
    });
  };

  /**
   * 显示预览框
   * **/
  handlePreview = record => {
    this.setState(
      {
        previewShow: true,
      },
      () => {
        this.previewChild.handlePreview(record);
      },
    );
  };

  render() {
    const {
      documentManagementDetail: { fileHistory = [] },
      loading,
      resetButtonStyle,
      buttonType = 'link',
      buttonText,
    } = this.props;
    const { show, previewShow, columns } = this.state;

    return (
      <span>
        {/* 文档预览modal */}
        {previewShow ? (
          <Preview id="fileHistoryVersion" onRef={ref => (this.previewChild = ref)} />
        ) : null}
        <Button
          size="small"
          style={resetButtonStyle}
          type={buttonType}
          onClick={this.handleLookHistoryVersion}
        >
          {buttonText}
        </Button>
        <Modal
          width="60vw"
          bodyStyle={{
            height: '400px',
            overflowY: 'auto',
            textAlign: 'center',
          }}
          title="历史版本"
          visible={show}
          onOk={this.handleModalHide}
          onCancel={this.handleModalHide}
          zIndex={10}
        >
          <Table
            rowKey={record => record.id}
            columns={columns}
            dataSource={fileHistory}
            loading={loading}
            pagination={false}
          />
        </Modal>
      </span>
    );
  }
}

export default connect(({ documentManagementDetail, loading }) => ({
  documentManagementDetail,
  loading: loading.effects['documentManagementDetail/getFileHistoryReq'],
}))(FileHistoryVersion);
