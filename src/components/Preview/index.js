import React, { Component } from 'react';
import { connect } from 'dva';
import { Button, message, Spin } from 'antd';
import { filePreviewWithBlobUrl } from '@/utils/download';
import { uuid, launchIntoFullscreen } from '@/utils/utils';
import OnlineEdit, { getDocumentType } from '@/components/OnlineEdit';
import ModalWin from '@/pages/manuscriptProjectManage/projectInfoManger/addProjectInfo/ModalWin';
import styles from './index.less';

const IMGs =
  'webp.dubmp.pcx.zhitif.gif.jpg.jpeg.tga.exif.fpx.svg.psd.cdr.pcd.dxf.ufo.eps.ai.png.hdri.raw.wmf.flic.emf.ico';

class Preview extends Component {
  state = {
    show: false,
    IMG: false,
    blobUrl: '',
    awpFileNumber: '',
    fileType: '',
  };

  componentDidMount() {
    if (typeof this.props.onRef === 'function') {
      this.props.onRef(this);
    }
  }

  /**
   * 隐藏模态框
   * * */
  handleModalHide = () => {
    this.setState({
      show: false,
      IMG: false,
      blobUrl: '',
    });
  };

  /**
   * 查看
   * * */
  handlePreview = record => {
    const { awpFileNumber, awpName } = record;
    const arr = awpName.split('.');
    const fileType = awpName.split('.')[arr.length - 1];

    if (IMGs.includes(fileType)) {
      this.setState({
        show: true,
        IMG: true,
      });
      filePreviewWithBlobUrl(
        `/ams/ams-file-service/fileServer/downloadUploadFile?getFile=${awpFileNumber}@${awpName}`,
        blobUrl => {
          this.setState({
            blobUrl,
          });
        },
      );
    } else {
      if (!getDocumentType(fileType)) {
        message.warn('目前不支持预览该格式的文件');
        return;
      }
      this.setState({
        show: true,
        awpFileNumber,
        fileType,
      });
    }
  };

  render() {
    const { show, IMG, awpFileNumber, blobUrl, fileType } = this.state;
    const {
      global: {
        saveIP: { gateWayIp },
      },
      id = '',
    } = this.props;
    const url = `${gateWayIp}/ams/ams-file-service/fileServer/downloadUploadFile?getFile=${awpFileNumber}`;
    const key = uuid();

    return (
      <ModalWin
        id={id}
        width="80vw"
        resetContentHeight={true}
        hideModalFooter={true}
        denominator={10}
        visible={show}
        title="文件预览"
        okText="确定"
        onOk={this.handleModalHide}
        onCancel={this.handleModalHide}
      >
        <Button
          onClick={launchIntoFullscreen}
          style={{ margin: '20px 0', float: 'right', zIndex: 10 }}
        >
          全屏
        </Button>
        {IMG ? (
          <Spin tip="加载中..." spinning={!blobUrl.length} wrapperClassName={styles.iframeContent}>
            <iframe width="100%" height="100%" src={blobUrl} title="预览文件" id="preview" />
          </Spin>
        ) : (
          <OnlineEdit fileType={fileType} _key={key} title="预览文件" url={url} />
        )}
      </ModalWin>
    );
  }
}

export default connect(({ review, global }) => ({
  review,
  global,
}))(Preview);
