import React, { useState, useEffect, useRef, useContext } from 'react';
import { Card, Col, Row, Checkbox } from 'antd';
import { connect } from 'dva';
import icon_add from '@/assets/operatingCalendar/rw_ic_add.png';
import SingleCustomerEvents from '@/utils/SingleCustomerEvents';
import styles from './index.less';
import moment from 'moment';
import { taskStatusEnum, priorityEnum } from './staticEnum';

// 默认颜色的列表
const defaultColor = ['#2F6AFF', '#6FB423', '#F5A623', '#DF5146'];

// 单条任务
const TaskItem = props => {
  const { data } = props;
  const { type, title, handleSchedule = 0, id, delayDay } = data;
  const { dispatch, refresh } = useContext(QuadrantContext);
  const [checked, setChecked] = useState(() => handleSchedule == 1);
  const {
    itemType,
    proName,
    taskStatus,
    toDoNode,
    processDefinitionId,
    processInstanceId,
    taskDefinitionKey,
    taskId,
    subItemType,
    startTime,
  } = data;

  // 完成/取消任务
  const handlerCheck = _checked => {
    setChecked(_checked);
    dispatch({
      type: 'operatingCalendar/updateHandleSchedul',
      payload: { flag: _checked ? 1 : 0, ids: id },
      callBack: () => {
        refresh();
      },
    });
  };

  return (
    <div
      className="taskItem"
      onClick={() => {
        SingleCustomerEvents.getInstance().dispatchEvent('showInfo', data);
      }}
    >
      <div className="leftWrap">
        {/* <img
          className="checkbox"
          onClick={() => {
            handlerCheck(!checked);
          }}
          src={checked ? check2 : check1}
          alt=""
        /> */}
        <p
          className={checked ? 'detail lineThrough' : 'detail'}
          onClick={() => {
            SingleCustomerEvents.getInstance().dispatchEvent('showInfo', data);
          }}
        >
          <span>{itemType + ':'}</span>
          {`${subItemType ? subItemType + '--' : ''}${proName ? '(' + proName + ')' + '--' : ''}${
            startTime ? moment(startTime).format('YYYY年MM月DD日') : ''
          }`}
        </p>
      </div>
      <p style={{ color: '#19994B', whiteSpace: 'nowrap' }}>
        {Array.isArray(taskStatus) ? taskStatus[0] : taskStatus}
      </p>
      {/* {handleSchedule == 2 && <p style={{ color: '#FCB430' }}>即将到期</p>} */}
      {/* {handleSchedule == 3 && <p style={{ color: '#EF5549' }}>{delayDay}</p>} */}
    </div>
  );
};
// card上再封装一层
const CustomerCard = props => {
  const { currentTab } = useContext(QuadrantContext);
  const {
    data: { color, title, list: taskList, grade },
  } = props;
  return (
    <Col span={12}>
      <Card
        title={
          <div className="titleWrap">
            <div className="colorBlock" style={{ backgroundColor: color }}></div>
            {title}
          </div>
        }
        extra={
          currentTab === 'allCalendar' ? (
            <img
              style={{ cursor: 'pointer' }}
              src={icon_add}
              onClick={() => {
                SingleCustomerEvents.getInstance().dispatchEvent('addTask', grade);
              }}
            />
          ) : (
            ''
          )
        }
        size="small"
        bordered={false}
        style={{ height: '320px', overflow: 'auto' }}
      >
        {taskList.map((item, key) => {
          return <TaskItem key={item.id} data={item} />;
        })}
      </Card>
    </Col>
  );
};
// contenxt
const QuadrantContext = React.createContext(null);
// 象限视图
const Index = props => {
  const { currentStartTime, dispatch, quadrantList, currentTab, filterParams } = props;
  // 任务列表
  const [defaultLayout, setDefaultLayout] = useState([]);
  useEffect(() => {
    setDefaultLayout(
      priorityEnum.map((item, index) => {
        return {
          title: item,
          color: defaultColor[priorityEnum.length - index - 1],
          list: [],
        };
      }),
    );
    // SingleCustomerEvents.getInstance().addEventListener('quadrant', getData);
  }, []);

  useEffect(() => {
    if (currentStartTime != '') {
      getData();
    }
  }, [currentStartTime]);

  useEffect(() => {
    if (!quadrantList || quadrantList.length < 0) return;
    setDefaultLayout(
      priorityEnum.map((item, index) => {
        const tempItem = quadrantList.filter(item => item.grade == index + 1);
        return {
          title: item,
          color: defaultColor[priorityEnum.length - index - 1],
          list: tempItem[0] ? tempItem[0].taskVoList : [],
          grade: index + 1,
        };
      }),
    );
  }, [quadrantList]);
  //   获取数据
  const getData = () => {
    dispatch({
      type: 'operatingCalendar/queryQuadrant',
      payload: { executeTime: currentStartTime, flag: currentTab, ...filterParams },
      // payload: { executeTime: '2020-11-11', gradeList: checkLevelList },
    });
  };
  return (
    <QuadrantContext.Provider value={{ dispatch, refresh: getData, currentTab }}>
      <div style={{ marginTop: '16px' }} className={styles.quadrantView}>
        <Row gutter={[24, 24]}>
          {defaultLayout.map(item => {
            return <CustomerCard data={item} key={item.title} />;
          })}
        </Row>
      </div>
    </QuadrantContext.Provider>
  );
};

const quadrantView = state => {
  const {
    dispatch,
    operatingCalendar: { quadrantList },
  } = state;
  return {
    dispatch,
    quadrantList,
  };
};
export default connect(quadrantView)(Index);
