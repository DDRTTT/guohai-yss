/**
 * 项目任务列表(开发时改成相应的菜单名)
 * Create on 2020/9/14.
 */
import React, { Component } from 'react';
import { Form, message, Table } from 'antd';
import { connect } from 'dva';
import { errorBoundary } from '@/layouts/ErrorBoundary';
import style from './index.less';
import router from 'umi/router';
import Action, { linkHoc } from '@/utils/hocUtil';

@Form.create()
class Index extends Component {
  state = {
    selectedRowKeys: [],
    state: 1,
    expandedRowKeys: '',
    params: {
      pageNum: 1,
      pageSize: 10,
      direction: 'ASC', // DESC、ASC
      field: '',
      keyWords: '',
    },
  };

  componentDidMount() {
    this.props.dispatch({
      type: 'taskManagement/getTaskList',
      payload: {
        pageNum: this.state.params.pageNum,
        pageSize: this.state.params.pageSize,
      },
    });
  }

  onSelectChange = selectedRowKeys => {
    console.log('selectedRowKeys changed: ', selectedRowKeys);
    this.setState({ selectedRowKeys });
  };

  onSubmit = item => {
    this.props.dispatch({
      type: 'taskManagement/listSubmit',
      payload: { id: item.id },
      callback: res => {
        message.error(res.message);
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

  onDelete = item => {
    console.log(item.id);
    this.props.dispatch({
      type: 'taskManagement/delete',
      payload: { ids: item.id },
      callback: res => {
        message.warning(res.message);
      },
    });
  };

  /**
   * @method 请求表格列表
   */
  handleGetTableList = () => {
    if (
      (this.state.taskTypeCode === 'T001_1' || this.state.taskTypeCode === 'T001_4') &&
      this.state.field === ''
    ) {
      this.setState(
        {
          // field: 'taskTime',
          // direction: 'desc'
          field: '',
          direction: '',
        },
        () => {
          this.getTableList();
        },
      );
    } else {
      this.getTableList();
    }
  };

  getTableList = () => {
    const payload = {
      keyWords: this.state.keyWords,
      proCodeList: this.state.proCodeList,
      // proCode: this.state.proCode,
      proTypeList: this.state.proTypeList,
      statusCodes: this.state.statusCodes,
      pageNum: this.state.pageNum,
      pageSize: this.state.pageSize,
      taskTypeCode: this.state.taskTypeCode,
      direction: this.state.direction,
      field: this.state.field,
    };
    if (payload.field === 'proTypeName') {
      payload.field = 'proType';
    }
    if (payload.field === 'clearReasonName') {
      payload.field = 'clearReason';
    }
    if (payload.field === 'statusName') {
      payload.field = 'status';
    }
    this.props.dispatch({
      type: 'taskManagement/getTaskList',
      payload,
    });
  };

  handleSetPageNum = page => {
    this.state.params.pageNum = page;
    this.handleGetTableList(this.state.params);
  };

  handleSetPageSize = (...r) => {
    this.state.params.pageSize = r[1];
    this.handleGetTableList(this.state.params);
  };

  // 任务办理
  onHandle = item => {
    router.push({
      pathname: '/projectManagement/taskManagementDeal',
      query: item,
    });
  };

  render() {
    const { selectedRowKeys } = this.state;
    const rowSelection = { selectedRowKeys, onChange: this.onSelectChange };
    const { taskManagement } = this.props;
    const data = [];
    const columns = [
      { title: '项目编码', dataIndex: 'proCode', width: 200, fixed: 'left' },
      { title: '项目名称', dataIndex: 'proName', width: 150, fixed: 'left' },
      { title: '任务名称', dataIndex: 'taskName', width: 100 },
      { title: '任务类型', dataIndex: 'taskType', width: 100 },
      { title: '执行者', dataIndex: 'executorName', width: 80 },
      { title: '开始时间', dataIndex: 'startTime', width: 180 },
      { title: '截止时间', dataIndex: 'endTime', width: 180 },
      { title: '任务持续时间', dataIndex: 'continueTime', width: 200 },
      { title: '任务内容', dataIndex: 'taskCovers', width: 180 },
      { title: '优先级', dataIndex: 'priority', width: 80 },
      { title: '创建时间', dataIndex: 'creatorId', width: 120 },
      { title: '创建人', dataIndex: 'creatorName', width: 80 },
      { title: '超时状态', dataIndex: 'timeoutStatus', width: 120, fixed: 'right' },
      { title: '状态', dataIndex: 'checked', width: 120, fixed: 'right' },
      {
        title: '操作',
        key: 'action',
        fixed: 'right',
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
                    <div style={{ width: '4rem' }}>任务完成</div>
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
            creatorId: item.creatorId,
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
          scroll={{ x: 2400 }}
          rowSelection={rowSelection}
          columns={columns}
          dataSource={data}
          pagination={{
            size: 'small',
            showSizeChanger: true,
            showQuickJumper: true,
            total: taskManagement.list.length,
            showTotal: () => `共 ${taskManagement.list.length} 条`,
            onChange: page => this.handleSetPageNum(page),
            onShowSizeChange: (page, size) => this.handleSetPageSize(page, size),
            pageSize: this.state.params.pageSize,
          }}
        />
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
