import React, { Component } from 'react';
import { connect } from 'dva';
import { errorBoundary } from '@/layouts/ErrorBoundary';
import SparkMD5 from 'spark-md5';
import { Icon, message, Progress, Tooltip, Form, Button } from 'antd';
import styles from './index.less';

let progressMap = [];
class Index extends Component {
  state = {
    loading: false,
    progress: 0,
    progressMap: [],
  };

  setFile = () => {
    progressMap = [];
    this.setState({ progressMap: [] });
    const uploadFileInfo = this.fileInput.files;
    const setProgressMap = uploadFileList => {
      const arr = [];
      Object.keys(uploadFileList).forEach(item => {
        arr.push({
          fileName: uploadFileList[item].name,
          progress: 0,
          status: 'normal',
          isLast: 0,
        });
      });
      return arr;
    };

    if (!uploadFileInfo.length) return false;
    progressMap = setProgressMap(uploadFileInfo);
    if (typeof this.props.beforeUpload === 'function') {
      this.setState({ loading: true });
      message.info('文件信息检测中...');
      this.props.beforeUpload(uploadFileInfo).then(res => {
        if (typeof res === 'boolean' && !res) {
          this.setState({ loading: false });
          progressMap = [];
          this.fileInput.value = null;
          return;
        }

        if (typeof res === 'object') {
          progressMap = setProgressMap(res.needUploadFileList);
          this.nextBigFile(0, res.needUploadFileList);
          return;
        }
        this.nextBigFile(0, uploadFileInfo);
      });
      return;
    }
    this.nextBigFile(0, uploadFileInfo);
  };

  nextBigFile = (i, uploadFileInfo) => {
    let j = i;
    let l = uploadFileInfo.length;
    if (j < l) {
      const { sectionSize } = this.props;
      const bytesPerPiece = (sectionSize || 1) * 1024 * 1024;
      const file = uploadFileInfo[i];
      const fileType = /\.[^\.]+$/.exec(file.name)[0];
      let start = 0;
      let end = 0;
      let index = 0;
      let md5Num = '';
      let fileTotalSize = file.size;
      let resolveSize = bytesPerPiece;
      let totalPieces = Math.ceil(file.size / bytesPerPiece);
      const sparkMD5 = new SparkMD5.ArrayBuffer();
      const reader = new FileReader();
      reader.readAsArrayBuffer(file);
      reader.onload = e => {
        sparkMD5.append(e.target.result);
        md5Num = sparkMD5.end().toUpperCase();
        j++;
        this.nextBigFile(j, uploadFileInfo);
        this.cutFile(
          bytesPerPiece,
          fileType,
          md5Num,
          file,
          file.name,
          start,
          end,
          index,
          totalPieces,
          i,
          fileTotalSize,
          resolveSize,
          '',
        );
      };
    }
  };

  cutFile = (
    bytesPerPiece,
    fileType,
    md5Num,
    file,
    fileName,
    start,
    end,
    index,
    totalPieces,
    i,
    fileTotalSize,
    resolveSize,
    serialNum,
  ) => {
    const { uploadFilePath, extraParams = {}, dispatch } = this.props,
      reader = new FileReader();
    let chunk = '';
    let _chunk = '';
    const fileIndex = progressMap.findIndex(item => item.fileName === fileName);

    end = start + bytesPerPiece;
    if (end >= file.size) {
      end = file.size;
      progressMap[fileIndex].isLast = 1;
    }
    reader.readAsDataURL(file.slice(start, end));
    reader.onload = e => {
      chunk = e.target.result;
      _chunk = chunk
        .replace(/\r\n/g, '_r')
        .replace(/\//g, '_a')
        .replace(/\+/g, '_b')
        .replace(/\=/g, '_c')
        .replace(/\n/g, '_n')
        .split('base64,')[1];
      if (!_chunk) {
        this.setState({ loading: false });
        progressMap = [];
        this.fileInput.value = null;
        message.warn('文件内容为空，请重新上传！');
        return;
      }
      const payload = {
        fileType,
        md5Num,
        fileName,
        isLast: progressMap[fileIndex].isLast,
        fileTotalSize,
        resolveSize,
        uploadFilePath:
          typeof uploadFilePath === 'object' ? uploadFilePath[fileName] : uploadFilePath,
        serialNum,
        transferMode: '1',
        resolveIndexNum: index,
        fileContent: _chunk,
        smallMd5Num: SparkMD5.hashBinary(_chunk).toUpperCase(),
        resolveCount: totalPieces,
        uploadType: 1,
      };

      dispatch({
        type: 'uploadSection/getFilecutuploadReq',
        payload: {
          ...payload,
          ...extraParams,
        },
      }).then(res => {
        if (res && res.status === 200) {
          this.setState({ loading: true });
          const data = res.data ? res.data : {};
          const { hash, size } = data;
          serialNum = data.serialNum ? data.serialNum : '';

          if (
            progressMap[fileIndex].isLast === 1 &&
            typeof this.props.uploadSuccessAfter === 'function'
          ) {
            const uploadSuccessBackInfo = { fileName, hash, serialNum, size };
            this.props.uploadSuccessAfter(uploadSuccessBackInfo);
          }

          if (progressMap[fileIndex].isLast == 0) {
            start = end;
            index++;
          } else {
            start = 0;
            index = 0;
          }

          progressMap.forEach(item => {
            if (item.fileName === fileName) {
              item.progress = item.isLast === 0 ? +((index * 100) / totalPieces).toFixed(4) : 100;
              item.status = item.isLast === 0 ? 'normal' : 'success';
            }
          });

          this.setState({ progressMap: JSON.parse(JSON.stringify(progressMap)) }, () => {
            if (progressMap[fileIndex].isLast === 1) {
              message.success(`${fileName} 上传完成！`);

              const existUploadFailed = progressMap.some(item => item.status !== 'success');
              if (!existUploadFailed) {
                message.success('全部文件已上传完成！');
                progressMap = [];
                this.setState({ progressMap: [] }, () => {
                  typeof this.props.onClose === 'function' && this.props.onClose();
                });
              }
            } else {
              this.cutFile(
                bytesPerPiece,
                fileType,
                md5Num,
                file,
                fileName,
                start,
                end,
                index,
                totalPieces,
                i,
                fileTotalSize,
                resolveSize,
                serialNum,
              );
            }
          });
        } else {
          progressMap.forEach(item => {
            if (item.fileName === fileName) {
              item.status = 'exception';
              item.reason = res.message;
            }
          });

          this.setState({ progressMap: JSON.parse(JSON.stringify(progressMap)) });
          if (typeof this.props.uploadFailureAfter === 'function') {
            const uploadFailureBackInfo = progressMap.filter(item => item.status === 'exception');
            this.props.uploadFailureAfter(uploadFailureBackInfo);
          }
          message.error(res.message);
        }

        const existRequestingApi = progressMap.some(item => item.status === 'normal');
        if (!existRequestingApi) {
          this.fileInput.value = null;
          this.setState({ loading: false });
          typeof this.props.allUploadCompleted === 'function' && this.props.allUploadCompleted();
        }
      });
    };
  };

  render() {
    const {
      accept,
      buttonType = 'default',
      btnName = '上传文档',
      isMultiple = true,
      isDisabled = false,
      defaultIcon = 'upload',
    } = this.props;
    const { loading, progressMap, reset } = this.state;
    const opts = {};
    if (isMultiple) opts['multiple'] = 'multiple';
    if (isDisabled) opts['disabled'] = 'disabled';
    return (
      <>
        <Button type={buttonType} loading={loading} {...opts} className={styles.uploadBorder}>
          <>
            <input
              type="file"
              accept={accept}
              {...opts}
              ref={input => (this.fileInput = input)}
              onChange={this.setFile}
            />
            <Icon type={defaultIcon} style={{ marginRight: defaultIcon ? '8px' : '0px' }} />
            {btnName}
          </>
        </Button>
        {/* 以下为显示进度条 */}
        {progressMap.length > 0 && (
          <ul className={styles.progressBox}>
            {progressMap.map(item => (
              <li key={item.fileName}>
                <Tooltip placement="left" title={item.fileName}>
                  <span className={styles.progress}>{item.fileName}</span>
                </Tooltip>
                <Progress
                  percent={item.progress}
                  status={item.status}
                  size={'small'}
                  style={{ width: 200 }}
                />
              </li>
            ))}
          </ul>
        )}
      </>
    );
  }
}

const UploadSection = errorBoundary(
  Form.create()(
    connect(({ uploadSection }) => ({
      uploadSection,
    }))(Index),
  ),
);

export default UploadSection;
