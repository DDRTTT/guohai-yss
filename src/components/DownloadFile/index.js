import React from 'react';
import { Button, message } from 'antd';
import { download } from '@/utils/download';

const DownloadFile = ({
  buttonType = 'button',
  resetButtonStyle = {},
  buttonText = '下载',
  record = [],
}) => {
  const handleDownloadFile = () => {
    const body = record.map(({ awpFileNumber, awpName }) => `${awpFileNumber}@${awpName}`);
    if (record.length === 0) {
      message.warn('请选择需要批量下载的文档~');
      return;
    }
    message.loading('下载中...', 3);
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
