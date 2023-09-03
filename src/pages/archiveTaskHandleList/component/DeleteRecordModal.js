import { useEffect } from 'react';
import { connect } from 'dva';
import { Modal, Table, Tooltip } from 'antd';

const DeleteRecordModal = ({
  dispatch,
  archiveTaskHandleList: { deleteRecordList },
  visible,
  handleOk,
  handleCancel,
  id,
}) => {
  const columns = [
    {
      dataIndex: 'proName',
      key: 'proName',
      title: '项目/系列名称',
      width: 250,
      ellipsis: {
        showTitle: false,
      },
      render: text => (
        <Tooltip title={text}>
          <span>{text}</span>
        </Tooltip>
      ),
    },
    {
      dataIndex: 'taskName',
      key: 'taskName',
      title: '任务名称',
      width: 150,
      ellipsis: {
        showTitle: false,
      },
      render: text => (
        <Tooltip title={text}>
          <span>{text}</span>
        </Tooltip>
      ),
    },
    {
      dataIndex: 'awpName',
      key: 'awpName',
      title: '文件名称',
      ellipsis: {
        showTitle: false,
      },
      render: text => (
        <Tooltip title={text}>
          <span>{text}</span>
        </Tooltip>
      ),
    },
    {
      dataIndex: 'awpPathName',
      key: 'awpPathName',
      title: '文件目录',
      ellipsis: {
        showTitle: false,
      },
      render: text => (
        <Tooltip title={text}>
          <span>{text}</span>
        </Tooltip>
      ),
    },
    {
      dataIndex: 'deleteTime',
      key: 'deleteTime',
      title: '删除时间',
      width: 200,
      ellipsis: {
        showTitle: false,
      },
      render: text => (
        <Tooltip title={text}>
          <span>{text}</span>
        </Tooltip>
      ),
    },
    {
      dataIndex: 'deletorName',
      key: 'deletorName',
      title: '操作人',
      width: 120,
      ellipsis: {
        showTitle: false,
      },
      render: text => (
        <Tooltip title={text}>
          <span>{text}</span>
        </Tooltip>
      ),
    },
  ];

  useEffect(() => {
    if (id) {
      dispatch({
        type: 'archiveTaskHandleList/getDeleteRecordReq',
        payload: {
          taskId: id,
          pageNum: 1,
          pageSize: 10000,
        },
      });
    }
  }, [visible]);

  return (
    <Modal
      width={'60vw'}
      title="删除历史记录"
      visible={visible}
      onOk={handleOk}
      onCancel={handleCancel}
    >
      <Table rowKey={r => r.id} dataSource={deleteRecordList.rows} columns={columns} />
    </Modal>
  );
};

export default connect(({ archiveTaskHandleList }) => ({ archiveTaskHandleList }))(
  DeleteRecordModal,
);
