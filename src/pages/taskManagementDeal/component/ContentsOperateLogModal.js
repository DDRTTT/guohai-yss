import { useState } from 'react';
import { Button, Modal, Tag } from 'antd';
import { connect } from 'dva';

const ContentsOperateLogModal = ({
  dispatch,
  taskManagementDeal: {
    contentOperateLog: { applicatbility, newPath },
  },
  params,
}) => {
  const [visible, setVisible] = useState(false);

  const handleContentsOperateLog = () => {
    setVisible(true);
    dispatch({
      type: 'taskManagementDeal/withStandardCatalogueReq',
      payload: params,
    });
  };

  const handleHide = () => {
    setVisible(false);
  };

  return (
    <>
      <Button size={'small'} onClick={handleContentsOperateLog}>
        目录变更记录
      </Button>
      <Modal
        title="目录变更记录"
        width={'60vw'}
        visible={visible}
        onOk={handleHide}
        onCancel={handleHide}
      >
        <div style={{ height: '70vh', overflow: 'auto' }}>
          <p>与标准目录比较</p>
          {applicatbility &&
            applicatbility.map((item, index) => (
              <p key={index}>
                {index + 1}：<Tag color="magenta">目录不适用</Tag>
                {item}
              </p>
            ))}
          {newPath &&
            newPath.map((item, index) => (
              <p key={index}>
                {index + 1}：<Tag color="blue">目录增加</Tag>
                {item}
              </p>
            ))}
        </div>
      </Modal>
    </>
  );
};

export default connect(({ taskManagementDeal }) => ({ taskManagementDeal }))(
  ContentsOperateLogModal,
);
