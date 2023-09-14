import React, { Component } from 'react';
import { connect } from 'dva';
import { errorBoundary } from '@/layouts/ErrorBoundary';
// import { hex_md5 } from '@/utils/MD5';
import SparkMD5 from 'spark-md5';
import { Icon, message, Progress, Tooltip, Form, Button } from 'antd';
import styles from './index.less';

let progressMap = [];

/**
 * extraParams 上传所需的其他参数 Object
 * sectionSize 每个文件切片大小 整数 单位MB String
 * accept 上传文件类型 String
 * btnName 上传按钮名称 String
 * buttonType 默认default 类型可传primary、ghost、dashed、link、text、default
 * defaultIcon 默认图标upload 其他可自定义 不需要时组件传""
 * uploadFilePath 文件的保存目录(默认无)，或传字符串("filePath")、对象({fileName:'filePath'})
 * isMultiple 默认上传多个 Boolean
 * isDisabled 文件是否禁选(默认可选) Boolean
 * beforeUpload 文件上传前 回调函数
 * uploadSuccessAfter 单个文件上传成功后 回调函数
 * uploadFailureAfter 单个文件上传失败后 回调函数
 * onClose 所有文件上传成功后 回调函数
 * allUploadCompleted 所有文件上传结束后(已无在传文件) 回调函数
 **/
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
    // 进度条
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

    // 上传前文件信息校验
    if (typeof this.props.beforeUpload === 'function') {
      this.setState({ loading: true });
      message.info('文件信息检测中...');
      this.props.beforeUpload(uploadFileInfo).then(res => {
        if (typeof res === 'boolean' && !res) {
          this.setState({ loading: false });
          progressMap = [];
          this.fileInput.value = null;
          // document.querySelector("input[type='file']").value = '';
          return;
        }

        // 如果需要根据检测接口返回的数据对上传的数据做过滤 则传入的数据类型是Object
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
    let j = i,
      l = uploadFileInfo.length;
    if (j < l) {
      const { sectionSize } = this.props;
      const bytesPerPiece = (sectionSize || 1) * 1024 * 1024; // 每个文件切片大小
      const file = uploadFileInfo[i];
      const fileType = /\.[^\.]+$/.exec(file.name)[0];
      let start = 0;
      let end = 0;
      let index = 0;
      let md5Num = '';
      let fileTotalSize = file.size;
      let resolveSize = bytesPerPiece;
      let totalPieces = Math.ceil(file.size / bytesPerPiece); //计算文件切片总数
      const reader = new FileReader();
      reader.readAsBinaryString(file); //对文件转二进制字符串
      reader.onload = e => {
        // 解决.txt类型的文件内容为空时页面报错
        if (!e.target.result) {
          this.setState({ loading: false });
          progressMap.splice(j, 1);
          message.error(`${file.name}文件内容为空，请重新上传~`);
          this.fileInput.value = null;
          // document.querySelector("input[type='file']").value = '';
          return false;
        }

        j++;
        this.nextBigFile(j, uploadFileInfo);
        let sparkMD5 = new SparkMD5();
        // 生成大文件(没有切分之前的文件)的 MD5编码
        sparkMD5.appendBinary(e.target.result);
        md5Num = sparkMD5.end().toUpperCase();
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

        // 获取上传记录
        // let isRenewalObj = JSON.parse(sessionStorage.getItem(md5Num));
        // if (isRenewalObj) {
        //   // 是否续传
        //   index = +isRenewalObj.index + 1;
        //   start = isRenewalObj.end;
        //   message.info(`${file.name}继续上传....`);
        //   this.cutFile(
        //     bytesPerPiece,
        //     fileType,
        //     md5Num,
        //     file,
        //     file.name,
        //     start,
        //     end,
        //     index,
        //     totalPieces,
        //     i,
        //     fileTotalSize,
        //     resolveSize,
        //     isRenewalObj.serialNum,
        //   );
        // } else {
        //   this.cutFile(
        //     bytesPerPiece,
        //     fileType,
        //     md5Num,
        //     file,
        //     file.name,
        //     start,
        //     end,
        //     index,
        //     totalPieces,
        //     i,
        //     fileTotalSize,
        //     resolveSize,
        //     '',
        //   );
        // }
      };
    }
  };

  // 切分文件 上传
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
    reader.readAsDataURL(file.slice(start, end)); //对切割文件后的文件转base64字符串
    reader.onload = e => {
      // 每片文件的内容
      chunk = e.target.result;
      // 去掉特殊符号后的文件内容
      _chunk = chunk
        .replace(/\r\n/g, '_r')
        .replace(/\//g, '_a')
        .replace(/\+/g, '_b')
        .replace(/\=/g, '_c')
        .replace(/\n/g, '_n')
        .split('base64,')[1];
      // smallMd5Num  小文件(切分后的一片文件)的MD5编码
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
        // smallMd5Num: hex_md5(_chunk).toUpperCase(),
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
          // sparkMD5.destroy(); //释放缓存
          this.setState({ loading: true });
          const data = res.data ? res.data : {};
          const { hash, size } = data;
          serialNum = data.serialNum ? data.serialNum : '';
          // 上传记录 用于续传 每成功一次 覆盖一次
          // sessionStorage.setItem(md5Num, JSON.stringify({ fileName, serialNum, index, end }));

          if (
            progressMap[fileIndex].isLast === 1 &&
            typeof this.props.uploadSuccessAfter === 'function'
          ) {
            const uploadSuccessBackInfo = { fileName, hash, serialNum, size };
            // 一次上传操作,一个切片文件上传成功的回调
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
                  // 一次上传操作,文件全部上传成功的回调
                  typeof this.props.onClose === 'function' && this.props.onClose();
                });
              }

              // 完成后清除掉上传记录
              // sessionStorage.removeItem(md5Num);
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
            // 一次上传操作,上传失败的回调
            this.props.uploadFailureAfter(uploadFailureBackInfo);
          }
          message.error(res.message);
        }

        // 所有上传结束的标识(无正在进行中的文件，且包含上传失败的文件)
        const existRequestingApi = progressMap.some(item => item.status === 'normal');
        if (!existRequestingApi) {
          this.fileInput.value = null;
          this.setState({ loading: false });
          typeof this.props.allUploadCompleted === 'function' && this.props.allUploadCompleted();
        }

        // document.querySelector("input[type='file']").value = '';
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
