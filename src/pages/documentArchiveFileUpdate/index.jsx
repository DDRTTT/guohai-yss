import React, { Component } from 'react';
import { connect } from 'dva';
import { linkHoc } from '@/utils/hocUtil';
import { errorBoundary } from '@/layouts/ErrorBoundary';
import { routerRedux } from 'dva/router';
import { Button, Col, Row, Table, Form, Icon, Card, message, Tag, Tooltip } from 'antd';
import Preview from '@/components/Preview';
import UploadSection from '@/components/UploadSection';

@Form.create()
class Agent extends Component {
  state = {
    successColumn: [
      {
        key: 'awpName',
        title: '文档名称',
        dataIndex: 'awpName',
        ellipsis: {
          showTitle: false,
        },
        render: (text, record) => {
          return (
            <Tooltip placement="topLeft" title={record.awpName}>
              <span>{record.awpName}</span>
            </Tooltip>
          );
        },
      },
      {
        key: 'operStatus',
        title: '文档状态',
        dataIndex: 'operStatus',
        render: (text, record) => <Tag>{record.statusName}</Tag>,
      },
      {
        key: 'taskName',
        title: '所属流程',
        dataIndex: 'taskName',
      },
      {
        key: 'updateType',
        title: '变更标识',
        dataIndex: 'updateType',
        sorter: true,
        ellipsis: {
          showTitle: false,
        },
        render: (text, record) => {
          return (
            <Tooltip placement="topLeft" title={record.updateType}>
              <span>
                {record.updateType &&
                  {
                    move: '文件移动',
                    update: '文件更新',
                    'update,move': '文件更新移动',
                    'move,update': '文件移动更新',
                  }[record.updateType]}
              </span>
            </Tooltip>
          );
        },
      },
      {
        key: 'creatorName',
        title: '操作人',
        dataIndex: 'creatorName',
        render: text => <span>{text}</span>,
      },
      {
        key: 'createTime',
        title: '创建时间',
        dataIndex: 'createTime',
      },
      {
        key: 'version',
        title: '版本号',
        dataIndex: 'version',
      },
    ],
    checkFailureColumn: [
      {
        key: 'fileName',
        title: '文档名称',
        dataIndex: 'fileName',
      },
      {
        key: 'reason',
        title: '失败原因',
        dataIndex: 'reason',
      },
    ],
    checkFailure: [],
    successTableList: [],
    firstUpload: true,
    uploadCompleted: false,
    selectedRowKeys: [],
    selectedRows: [],
    uploadFilePathObj: null,
    preRegisterInfo: [],
    previewShow: false,
  };

  componentDidMount() {
    this.setState({
      successTableList: JSON.parse(sessionStorage.getItem('tableList')),
    });
  }

  componentWillUnmount() {
    sessionStorage.removeItem('tableList');
  }

  /**
   * 刷新数据
   * * */
  handleReupload = () => {
    const { firstUpload } = this.state;
    if (!firstUpload) {
      this.setState({ uploadCompleted: false });
    }
  };

  /**
   * 大文件切割上传前
   * * */
  handleBigFileBeforeUpload = async uploadFileInfo => {
    const { dispatch } = this.props;
    const { selectedRowKeys } = this.state;
    const bool = await dispatch({
      type: 'documentArchiveFileUpdate/getUpdateFilePreInspectReq',
      payload: {
        fileIds: selectedRowKeys,
        newFileNames: Object.keys(uploadFileInfo).map(key => uploadFileInfo[key].name),
      },
    }).then(res => {
      if (res && res.status === 200) {
        const {
          data: { checkFailure = [], checkSuccess = [], preRegisterInfo = [] },
        } = res;
        const uploadFilePath = {};
        checkSuccess.forEach(item => {
          uploadFilePath[item.fileName] = item.uploadFilePath;
        });

        this.setState({
          checkFailure,
          uploadFilePathObj: uploadFilePath,
          preRegisterInfo,
        });

        const needUploadFileList = Array.from(uploadFileInfo).filter(item => {
          return checkSuccess.findIndex(cItem => cItem.fileName === item.name) > -1;
        });
        return checkSuccess.length === 0
          ? false
          : {
              needUploadFileList,
            };
      }
      message.error(res.message);
      return false;
    });

    return bool;
  };

  /**
   * 文件上传失败后的回调
   * * */
  handleUploadFailureAfter = uploadFailureBackInfo => {
    this.setState({
      checkFailure: [...this.state.checkFailure, ...uploadFailureBackInfo],
    });
  };

  updateTableList = (oldId, newId) => {
    const {
      dispatch,
      location: {
        query: { proCode },
      },
    } = this.props;
    dispatch({
      type: 'documentArchiveFileUpdate/getFileInfoByFileIdsAndCodeReq',
      payload: {
        proCode,
        id: newId,
      },
    }).then(res => {
      if (res && res.status === 200) {
        const { data } = res;
        const successTableList = this.state.successTableList.map(item => {
          if (item.id === oldId) {
            item = {
              ...item,
              ...data[0],
            };
          }
          return item;
        });

        this.setState(
          {
            successTableList,
          },
          () => {
            sessionStorage.setItem('tableList', JSON.stringify(successTableList));
          },
        );
      } else {
        message.error(res.message);
      }
    });
  };

  /**
   * 大文件上传后信息登记
   * * */
  handleUploadSuccessAfter = uploadSuccessBackInfo => {
    const { dispatch } = this.props;
    const { preRegisterInfo } = this.state;

    this.setState({ uploadCompleted: false, selectedRowKeys: [], selectedRows: [] });
    const uploadAfterRegisterCallback = dispatch({
      type: 'documentArchiveFileUpdate/getUpdateFileRegisterReq',
      payload: {
        preRegisterInfo,
        updateInfos: [uploadSuccessBackInfo],
      },
    }).then(res => {
      if (res && res.status === 200) {
        this.updateTableList(preRegisterInfo[uploadSuccessBackInfo.fileName], res.data);
      }
    });

    return uploadAfterRegisterCallback;
  };

  /**
   * 取消：返回上一页面
   * * */
  handleBackPage = () => {
    const { dispatch } = this.props;
    dispatch(routerRedux.goBack());
  };

  /**
   * @method handleRowSelectChange checkbox触发
   * @param {*selectedRowKeys} 序号ID
   * @param {*selectedRows} 选中的行
   */
  handleRowSelectChange = (selectedRowKeys, selectedRows) => {
    this.setState({
      selectedRowKeys,
      selectedRows,
    });
  };

  render() {
    const {
      selectedRowKeys,
      successColumn,
      checkFailureColumn,
      uploadCompleted,
      uploadFilePathObj,
      previewShow,
      checkFailure,
      successTableList,
    } = this.state;
    const { loading } = this.props;

    return (
      <>
        {previewShow ? (
          <Preview
            onRef={ref => {
              this.previewChild = ref;
            }}
          />
        ) : null}
        <Card
          bordered={false}
          title={'用印文件归档'}
          extra={<Button onClick={this.handleBackPage}>取消</Button>}
        >
          <Row type="flex" justify="center">
            <Col span={4}>
              {uploadCompleted ? (
                <Button onClick={this.handleReupload}>
                  <Icon type="reload" />
                  刷新数据
                </Button>
              ) : (
                <UploadSection
                  sectionSize={2}
                  btnName="上传文件"
                  uploadFilePath={uploadFilePathObj}
                  isDisabled={successTableList.length === 0 || selectedRowKeys.length === 0}
                  beforeUpload={this.handleBigFileBeforeUpload}
                  uploadSuccessAfter={this.handleUploadSuccessAfter}
                  uploadFailureAfter={this.handleUploadFailureAfter}
                />
              )}
            </Col>
          </Row>
        </Card>
        <div style={{ height: 'calc(100vh - 242px)', overflowY: 'auto' }}>
          <Card title="文档清单" bordered={false}>
            <Table
              rowKey={r => r.id}
              columns={successColumn}
              dataSource={successTableList}
              rowSelection={{
                selectedRowKeys,
                onChange: this.handleRowSelectChange,
              }}
              loading={loading}
              scroll={{ x: successColumn.length * 160 }}
            />
            <Button
              type="link"
              style={{
                float: 'left',
                marginTop: '-40px',
                display: successTableList && successTableList.length === 0 ? 'none' : 'block',
              }}
            >
              已勾选 {this.state.selectedRowKeys.length} 个
            </Button>
          </Card>
          <Card title="文档名称错误原因" bordered={false}>
            <Table
              rowKey={(r, i) => i}
              columns={checkFailureColumn}
              dataSource={checkFailure}
              pagination={false}
            />
          </Card>
        </div>
      </>
    );
  }
}

export default errorBoundary(
  linkHoc()(
    Form.create()(
      connect(
        ({
          archiveTaskHandleListUploadPrinting,
          manuscriptManagementList,
          archiveTaskHandleList,
          loading,
          documentManagementDetail,
        }) => ({
          archiveTaskHandleListUploadPrinting,
          manuscriptManagementList,
          archiveTaskHandleList,
          documentManagementDetail,
          loading:
            loading.effects['archiveTaskHandleListUploadPrinting/getUnUseSealFileReq'] ||
            loading.effects['archiveTaskHandleListUploadPrinting/getUpdatedFileReq'],
        }),
      )(Agent),
    ),
  ),
);
