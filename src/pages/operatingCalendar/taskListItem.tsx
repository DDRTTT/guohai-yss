import React from 'react';
import { tasItemData } from './operatingCalendar.d';
const styles = require('./index.less');
import { Card, Rate, Divider } from 'antd';
import { priorityEnum } from './staticEnum';
import SingleCustomerEvents from '@/utils/SingleCustomerEvents';

const TaskItem = (props: { data: tasItemData }) => {
  const {
    data,
    data: { color = 'black' },
  } = props;
  return (
    <Card className={styles.taskItem} style={{ borderLeftColor: color }}>
      <div
        className="title"
        style={{ color: color }}
        onClick={() => {
          SingleCustomerEvents.getInstance().dispatchEvent('showInfo', data);
        }}
      >
        <span className="left">
          {data.itemType}
          <Divider type="vertical" style={{ width: '2px', backgroundColor: color }} />
          {data.specificItem}
        </span>
        {data.progress && <span className="statusTag">{data.progress}</span>}
      </div>
      <p className="desc">
        <span className="descOmit">{data.proOrToDo || data.title || ''}</span>
      </p>
      <div className="rate">
        {/* {data.grade && (
          <Rate
            tooltips={[...priorityEnum].reverse()}
            disabled={true}
            value={5 - Number(data.grade)}
            count={priorityEnum.length}
          />
        )} */}
        <Rate
          tooltips={[...priorityEnum].reverse()}
          disabled={true}
          value={5 - Number(data.grade) || 0}
          count={priorityEnum.length}
        />
        <span style={{ marginLeft: '5px' }}>
          {`${data.executeTime.split(' ')[0]}${
            data.deadline ? ' (截止: ' + data.deadline.split(' ')[0] + ')' : ''
          }`}
        </span>
      </div>
      {/* <p className="content omit">{data.content}</p> */}
      <p className="content omit" dangerouslySetInnerHTML={{ __html: data.content }} />
      {/* 如果是产品日历不限时这三个属性 */}
      {data.itemTypeCode != 'productMatters' && (
        <>
          <p className="todoNode">待办节点:{data.toDoNode || ''}</p>
          <p className="todoNode">待办人:{data.toDoPeople || ''}</p>
          <p className="todoNode">处理说明:{data.remarks || ''}</p>
        </>
      )}
      {/* {data.toDoNode && <p className="todoNode">待办节点:{data.toDoNode}</p>} */}
      {/* <p className="todoNode">待办节点:{data.toDoNode || ''}</p> */}
      {/* {data.toDoPeople && <p className="todoNode">待办人:{data.toDoPeople}</p>} */}
      {/* <p className="todoNode">待办人:{data.toDoPeople || ''}</p> */}
      {/* <p className="todoNode">处理说明:{data.remarks || ''}</p> */}
    </Card>
  );
};

export default TaskItem;
