/**
 * 底稿--下载文件（支持批量）
 * buttonType：按钮类型 参考antd Button组件
 * resetButtonStyle：为按钮添加新的样式
 * record：参数 单个下载为操作列表record值;批量下载为多选框选中的值;
 * 参数 body:[流水号@文件名,流水号@文件名]
 * success：批量下载需清空checkbox选中值
 * author: jiaqiuhua
 * * */
import React from 'react';
import { Button, message } from 'antd';
import { download } from '@/utils/download';

const DownloadFile = ({
  buttonType = 'button',
  resetButtonStyle = {},
  buttonText = '下载',
  record = [],
  success,
}) => {
  const handleDownloadFile = () => {
    const body = record.map(({ awpFileNumber, awpName }) => `${awpFileNumber}@${awpName}`);
    if (record.length === 0) {
      message.warn('请选择需要批量下载的文档~');
      return;
    }
    message.loading('下载中...', 3, () => {
      success && success();
    });
    download(`/ams/yss-awp-server/path/downloadFile`, {
      method: 'POST',
      body,
    });
  };

  return (
    <Button size="small" type={buttonType} style={resetButtonStyle} onClick={handleDownloadFile}>
      {buttonText}
    </Button>
  );
};

export default DownloadFile;
