import React from 'react';
import { taskListProps, taskListState, tasItemData } from './operatingCalendar.d';
import { Spin, List, Popover } from 'antd';
const styles = require('./index.less');
import TaskItem from './taskListItem.tsx';

const PopOverPannel = (props: { data: tasItemData }) => {
  const { data } = props;
  return (
    <>
      {data.content && <p>{data.proOrToDo || data.title}</p>}
      {data.content && <p>{data.content}</p>}
      {data.toDoNode && <p>待办节点:{data.toDoNode}</p>}
      {data.toDoPeople && <p>待办人:{data.toDoPeople}</p>}
      {data.remarks && <p>处理说明:{data.remarks}</p>}
    </>
  );
};

class TaskList extends React.Component<taskListProps, taskListState> {
  constructor(props: taskListProps) {
    super(props);
  }
  render() {
    const { taskListLoading = false, sourceData, title } = this.props;
    return (
      <Spin spinning={taskListLoading}>
        <div className="taskList">
          <div className="taskNav">
            <p>{title}</p>
          </div>
          <List
            bordered
            itemLayout="vertical"
            dataSource={sourceData}
            renderItem={item => (
              <List.Item>
                <Popover
                  overlayClassName={styles.blackMode}
                  placement="left"
                  content={<PopOverPannel data={item} />}
                >
                  <div>
                    <TaskItem data={item} />
                  </div>
                </Popover>
              </List.Item>
            )}
          />
        </div>
      </Spin>
    );
  }
}

export default TaskList;
