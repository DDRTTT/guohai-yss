/**
 * 项目任务管理(开发时改成相应的菜单名)
 * Create on 2020/9/14.
 */
import React, { Component } from 'react';
import { Form, Table, Button, message, Dropdown, Pagination, Menu } from 'antd';

import { connect } from 'dva';
import { errorBoundary } from '@/layouts/ErrorBoundary';
import style from './index.less';
import { setSession } from '@/utils/session';
import router from 'umi/router';
import Action, { linkHoc } from '@/utils/hocUtil';
import { filePreviewWithBlobUrl } from '@/utils/download';

@Form.create()
class Index extends Component {
  state = {
    selectedRowKeys: [],
    state: 1,
    expandedRowKeys: '',
    childrenList: [],
    selectedRows: [],
  };

  onSelectChange = (selectedRowKeys, selectedRows) => {
    this.setState({
      selectedRowKeys,
      selectedRows,
    });
  };

  onSubmit = item => {
    const { pageNum, pageSize } = this.props;
    console.log(pageNum, pageSize);
    this.props.dispatch({
      type: 'taskManagement/listSubmit',
      payload: { id: item.id },
      callback: res => {
        if (res.data) {
          message.success('提交成功');
          this.props.dispatch({
            type: 'taskManagement/getTaskList',
            payload: {
              pageNum: pageNum,
              pageSize: pageSize,
            },
          });
        } else {
          message.error(res.message);
        }
      },
    });
  };
  // 修改/编辑
  onCheck = (index, item) => {
    router.push({
      pathname: '/projectManagement/taskManagementStart',
      query: { type: index, data: item.proCode, id: item.id },
    });
  };

  taskEnd = item => {
    this.props.dispatch({
      type: 'taskManagement/taskEnd',
      payload: item.id,
      callback: res => {
        if (res.status == 200) {
          message.success(res.message);
        }
      },
    });
  };

  onDelete = item => {
    console.log(item.id);
    this.props.dispatch({
      type: 'taskManagement/batchDelete',
      payload: { ids: item.id },
      callback: res => {
        if (res.status == 200) {
          message.success(res.message);
        } else {
          message.warning(res.message);
        }
      },
    });
  };

  onExpand = (expanded, record) => {
    console.log(expanded, record);
    if (expanded) {
      this.setState({
        expandedRowKeys: record.key.toString(),
      });
      this.props.dispatch({
        type: 'taskManagement/getChildrenList',
        payload: record.id,
        callback: res => {
          console.log(res);
          this.setState({
            childrenList: res.data,
          });
        },
      });
    } else {
      this.setState({
        expandedRowKeys: '',
      });
    }
  };

  handleSetPageNum = (page, pageSize) => {
    this.props.dispatch({
      type: 'taskManagement/getTaskList',
      payload: {
        pageNum: page,
        pageSize: pageSize,
      },
    });
  };

  handleSetPageSize = (page, size) => {
    this.props.dispatch({
      type: 'taskManagement/getTaskList',
      payload: {
        pageNum: page,
        pageSize: size,
      },
    });
  };

  handleDownLoad = () => {
    this.props.dispatch({
      type: 'manuscriptManagementList/getFileDownLoadReq',
      payload: [
        '09221418439527277456@POC测试方案.docx',
        '09252008551207066288@企业微信截图_16010357111231.png',
      ],
    });
  };

  handleFilePreviewWithBlob() {
    filePreviewWithBlobUrl(
      `/ams/ams-file-service/fileServer/downloadUploadFile?getFile=09252008551207066288@企业微信截图_16010357111231.png`,
      blobUrl => {
        console.log(blobUrl);
        this.setState({
          blobUrl,
          visible: true,
        });
      },
    );
  }

  //子列表（任务办理列表 底稿归档任务办理列表）
  taskHandle = (record, index, indent, expanded) => {
    console.log(record, index, indent, expanded);
    if (record.taskType === '常规任务') {
      const columns = [
        { title: '文档名称', dataIndex: 'awpName', key: 'awpName', width: 180 },
        { title: '底稿目录', dataIndex: 'awpCode', key: 'awpCode', width: 180 },
        { title: '是否用印文档', dataIndex: 'useSeal', key: 'useSeal', width: 180 },
        { title: '是否底稿归档', dataIndex: 'useSeal', key: 'useSeal', width: 180 },
        { title: '是否原件归档', dataIndex: 'scriptFileFlag', key: 'scriptFileFlag', width: 180 },
        { title: '原件份数', dataIndex: 'scriptNum', key: 'scriptNum', width: 180 },
        { title: '档案盒号', dataIndex: 'fileBoxNum', key: 'fileBoxNum', width: 180 },
        { title: '档案物理位置', dataIndex: 'createTime', key: 'createTime', width: 180 },
        { title: '文件状态', dataIndex: 'state', key: 'state', width: 180 },
        {
          title: '操作',
          key: 'action',
          width: 250,
          // fixed:'right',
          render: (text, record) => {
            return (
              <div className={style.actionBut}>
                <Action code="taskManagement:chiDownLoadBtn">
                  <div onClick={this.handleDownLoad}>下载</div>
                </Action>
                <Action code="taskManagement:chiViewBtn">
                  <div onClick={this.handleFilePreviewWithBlob}>查看</div>
                </Action>
                <Action code="taskManagement:chiExamineBtn">
                  <div>审核意见</div>
                </Action>
              </div>
            );
          },
        },
      ];
      const data = [];
      this.state.childrenList &&
        this.state.childrenList.map((item, index) => {
          data.push({
            key: index,
            awpName: item.awpName,
            awpCode: item.awpCode,
            useSeal: item.useSeal === 0 ? '否' : '是',
            scriptFileFlag: item.scriptFileFlag === 0 ? '否' : '是',
            scriptNum: item.scriptNum,
            scriptLoca: item.scriptLoca,
            fileBoxNum: item.fileBoxNum,
            createTime: item.createTime,
            type: '文件格式',
            oad: '文件版本',
            state:
              item.state === 0
                ? '待审核'
                : item.state === 1
                ? '待复核'
                : item.state === 2
                ? '已复核'
                : item.state === 3
                ? '归档待审核'
                : item.state === 4
                ? '归档待复核'
                : item === 5
                ? '归档已复核'
                : '',
          });
        });
      return <Table width={1800} columns={columns} dataSource={data} pagination={false} />;
    } else if (record.taskType === '常规任务') {
      const columns = [
        { title: '文档名称', dataIndex: 'awpName', key: 'awpName' },
        { title: '底稿名称', dataIndex: 'awpName', key: 'awpName' },
        { title: '底稿目录', dataIndex: 'awpCode', key: 'awpCode' },
        { title: '是否用印文档', dataIndex: 'useSeal', key: 'useSeal' },
        { title: '是否原件归档', dataIndex: 'scriptFileFlag', key: 'scriptFileFlag' },
        { title: '原件份数', dataIndex: 'scriptNum', key: 'scriptNum' },
        { title: '档案物理位置', dataIndex: 'scriptLoca', key: 'scriptLoca' },
        { title: '档案盒号', dataIndex: 'fileBoxNum', key: 'fileBoxNum' },
        { title: '所属流程', dataIndex: 'oad', key: 'oad' },
        { title: '上传时间', dataIndex: 'oad', key: 'oad' },
        { title: '归档时间', dataIndex: 'oad', key: 'oad' },
        { title: '文件格式', dataIndex: 'oad', key: 'oad' },
        { title: '版本号', dataIndex: 'oad', key: 'oad' },
        { title: '更新用户', dataIndex: 'oad', key: 'oad' },
        { title: '文件状态', dataIndex: 'state', key: 'state' },
      ];

      const data = [];
      this.state.childrenList.map((item, index) => {
        data.push({
          key: index,
          awpName: item.awpName,
          awpCode: item.awpCode,
          useSeal: item.useSeal === 0 ? '否' : '是',
          scriptFileFlag: item.scriptFileFlag === 0 ? '否' : '是',
          scriptNum: item.scriptNum,
          scriptLoca: item.scriptLoca,
          fileBoxNum: item.fileBoxNum,
          createTime: item.createTime,
          type: '文件格式',
          oad: '文件版本',
          state:
            item.state === 0
              ? '待审核'
              : item.state === 1
              ? '待复核'
              : item.state === 2
              ? '已复核'
              : item.state === 3
              ? '归档待审核'
              : item.state === 4
              ? '归档待复核'
              : item === 5
              ? '归档已复核'
              : '',
        });
      });
      return <Table width={1800} columns={columns} dataSource={data} pagination={false} />;
    }
  };

  // 任务办理

  onHandle = item => {
    router.push({
      pathname: '/projectManagement/taskManagementDeal',
      query: item,
    });
  };

  HandleGetBatchMenu = () => {
    return (
      <Menu
        style={{ textAlign: 'center' }}
        onClick={key => {
          this.handleBatchOperation(key);
        }}
      >
        <Menu.Item key="1">审核</Menu.Item>
        <Menu.Item key="2">复核</Menu.Item>
        <Menu.Item key="3">删除</Menu.Item>
      </Menu>
    );
  };

  handleBatchOperation = ({ key }) => {
    console.log('===批量操作===', key);
    const { selectedRows } = this.state;
    const ids = [];

    for (let i = 0; i < selectedRows.length; i++) {
      ids.push(selectedRows[i].proCode);
    }
    console.log(ids, ids === []);
    if (selectedRows.length === 0) {
      message.warning('请先勾选项目');
    } else {
      if (key === '1' || key === '2') {
        this.props.dispatch({
          type: 'taskManagement/auditAndDeAudit',
          payload: {
            ids,
            checked: key === '1' ? 1 : 0,
          },
          callback: res => {
            message.warning(res.message);
          },
        });
      } else {
        this.props
          .dispatch({
            type: 'taskManagement/batchDelete',
            payload: { ids },
            callback: res => {
              message.warning(res.message);
            },
          })
          .then(response => {
            if (response && response.status === 200) {
              this.getTableList();
            }
          });
      }
    }
  };

  render() {
    const { selectedRowKeys } = this.state;
    const rowSelection = { selectedRowKeys, onChange: this.onSelectChange };
    const { taskManagement, handle, pageNum, pageSize } = this.props;
    console.log(pageSize, pageNum);
    const data = [];
    const columns = [
      { title: '项目编码', dataIndex: 'proCode', width: 200 },
      { title: '项目名称', dataIndex: 'proName', width: 150 },
      { title: '任务名称', dataIndex: 'taskName', width: 100 },
      { title: '任务类型', dataIndex: 'taskType', width: 100 },
      { title: '执行者', dataIndex: 'executorName', width: 80 },
      { title: '开始时间', dataIndex: 'startTime', width: 180 },
      { title: '截止时间', dataIndex: 'endTime', width: 180 },
      { title: '任务持续时间', dataIndex: 'continueTime', width: 200 },
      { title: '任务内容', dataIndex: 'taskCovers', width: 150 },
      { title: '优先级', dataIndex: 'priority', width: 80 },
      { title: '创建时间', dataIndex: 'creatorId', width: 120 },
      { title: '创建人', dataIndex: 'creatorName', width: 80 },
      { title: '超时状态', dataIndex: 'timeoutStatus', width: 120 },
      { title: '状态', dataIndex: 'checked', width: 120 },
      {
        title: '操作',
        key: 'action',
        width: 250,
        // fixed:'right',
        render: (text, record) => {
          return (
            <div>
              {record.checked === '已完成' && (
                <div className={style.actionBut}>
                  <Action code="taskManagement:viewBtn">
                    <div onClick={() => this.onCheck(0, record)}>查看</div>
                  </Action>
                </div>
              )}
              {record.checked === '办理中' && (
                <div className={style.actionBut}>
                  <Action code="taskManagement:handleBtn">
                    <div onClick={() => this.onHandle(record)}>办理</div>
                  </Action>
                  <Action code="taskManagement:viewBtn">
                    <div onClick={() => this.onCheck(0, record)}>查看</div>
                  </Action>
                  <Action code="taskManagement:overBtn">
                    <div style={{ width: '4rem' }} onClick={() => this.taskEnd(record)}>
                      任务完成
                    </div>
                  </Action>
                </div>
              )}
              {record.checked === '未提交' && (
                <div className={style.actionBut}>
                  <Action code="taskManagement:commitListBtn">
                    <div onClick={() => this.onSubmit(record)}>提交</div>
                  </Action>
                  <Action code="taskManagement:viewBtn">
                    <div onClick={() => this.onCheck(0, record)}>查看</div>
                  </Action>
                  <Action code="taskManagement:editBtn">
                    <div onClick={() => this.onCheck(1, record)}>修改</div>
                  </Action>
                  <Action code="taskManagement:deleteBtn">
                    <div onClick={() => this.onDelete(record)}>删除</div>
                  </Action>
                </div>
              )}
            </div>
          );
        },
      },
    ];
    taskManagement.list &&
      taskManagement.list.map((item, index) => {
        taskManagement.taskTypeCode.map(list => {
          if (list.code === item.taskType) {
            data.push({
              key: index,
              id: item.id,
              proCode: item.proCode,
              proName: item.proName,
              taskType: list.name,
              taskName: item.taskName,
              taskTypeName: item.taskTypeName,
              executor: item.executor,
              executorName: item.executorName,
              startTime: item.startTime,
              endTime: item.endTime,
              continueTime: item.continueTime,
              taskCovers: item.taskCovers,
              priority: item.priority === 0 ? '低' : item.priority === 1 ? '中' : '高',
              creatorId: item.createTime,
              creatorName: item.creatorName,
              projectState: item.projectState,
              note: item.note,
              archive: item.archive,
              checked: item.checked === 0 ? '未提交' : item.checked === 1 ? '办理中' : '已完成',
              timeoutStatus: item.timeoutStatus,
            });
          }
        });
      });
    return (
      <div>
        <Table
          scroll={{ x: 2600 }}
          expandedRowRender={(record, index, indent, expanded) =>
            this.taskHandle(record, index, indent, expanded)
          }
          rowSelection={rowSelection}
          columns={columns}
          dataSource={data}
          onExpand={(expanded, record) => {
            this.onExpand(expanded, record);
          }}
          expandedRowKeys={this.state.expandedRowKeys}
          pagination={false}
        />
        {taskManagement.list.length !== 0 ? (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginTop: 20,
            }}
          >
            <Dropdown overlay={this.HandleGetBatchMenu()} trigger={['click']}>
              <Button>批量操作</Button>
            </Dropdown>
            <Pagination
              style={{
                textAlign: 'right',
              }}
              defaultCurrent={pageNum}
              defaultPageSize={pageSize}
              onChange={page => this.handleSetPageNum(page)}
              onShowSizeChange={(page, size) => this.handleSetPageSize(page, size)}
              total={taskManagement.list.length}
              showTotal={() => `共 ${taskManagement.list.length} 条数据`}
              showSizeChanger
              showQuickJumper={taskManagement.list.length > pageSize}
            />
          </div>
        ) : null}
      </div>
    );
  }
}

// const WrappedIndex = errorBoundary(
//   Form.create()(
//     connect(({taskManagement}) => ({
//       taskManagement,
//     }))(Index),
//   ),
// );
//
// export default WrappedIndex;

const WrappedSingleForm = errorBoundary(
  linkHoc()(
    Form.create()(
      connect(({ taskManagement }) => ({
        taskManagement,
      }))(Index),
    ),
  ),
);

export default WrappedSingleForm;
