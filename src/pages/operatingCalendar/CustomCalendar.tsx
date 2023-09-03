import React from 'react';
import FullCalendar, {
  EventContentArg,
  PluginDefInput,
  DayCellContentArg,
  EventClickArg,
  // DateClickArg,
  ViewContentArg,
  formatDate,
} from '@fullcalendar/react';
import { sliceEvents, createPlugin } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interaction from '@fullcalendar/interaction';
import { Card, Popover, Tooltip } from 'antd';
import moment from 'moment';
const styles = require('./index.less');
import { calendarState, calendarProps, CustiomDayEventProps, holiday, tasItemData} from './operatingCalendar.d';
import TaskList from './taskList';
import SingleCustomerEvents from '@/utils/SingleCustomerEvents';
import TaskItem from './taskListItem';

enum weekEnum {
  '一',
  '二',
  '三',
  '四',
  '五',
  '六',
  '日',
}

const PopOverPannel = (props: { data: tasItemData }) => {
  const { data } = props;
  return (
    <>
      {data.content && <p>{data.proOrToDo || data.title}</p>}
      {data.content && <p>{data.content}</p>}
      {data.toDoNode && <p>待办节点:{data.toDoNode}</p>}
      {data.toDoPeople && <p>待办人:{data.toDoPeople}</p>}
    </>
  );
};

//自定义日的事件块
const CustomDayEventWrap = (props: CustiomDayEventProps): JSX.Element => {
  const {
    data,
    data: { color = 'black', flag },
    time,
  } = props;

  console.log(data);
  return (
    <div className={styles.customDayEventWrap}>
      <div className="topWrap">
        <div className="square" style={{ backgroundColor: color }}></div>
        <p className="title">{data['title']}</p>
      </div>
      <div className="contentWrap">
        {flag == 'tradingCalendar' ? (
          <Card className={styles.taskItem} style={{ borderLeftColor: color }}>
            {data['list'].map((item: any, index: number) => {
              return (
                <li className="tradingDayItem">
                  <span className="tt">{item.itemType}</span>
                  <span className="rest">{item.specificItem}</span>
                </li>
              );
            })}
          </Card>
        ) : (
          data['list'].map((item: any, index: number) => {
            return <Popover
              autoAdjustOverflow
              placement="left"
              overlayClassName={styles.blackMode}
              content={<PopOverPannel data={item} key={'index' + index} />}
            >
              <div>
                <TaskItem data={item} />
              </div>
            </Popover>
          })
        )}
      </div>
    </div>
  );
};

// 自定义视图
const CustomView = (props: any): JSX.Element => {
  let segs = sliceEvents(props, true); // allDay=true
  let eventDatas: any = {};
  segs.forEach(item => {
    const data = JSON.parse(item.def.title);
    console.log(data);
    if (data.flag == 'tradingCalendar') {
      if (eventDatas[data.flag]) {
        // return JSON.parse(item.def.title);
        eventDatas[data.flag].list.push(data);
      } else {
        if (!data.flag) return;
        eventDatas[data.flag] = {
          title: '交易日历',
          color: data.color,
          flag: data.flag,
          list: [data],
        };
      }
    } else {
      if (eventDatas[data.itemTypeCode]) {
        // return JSON.parse(item.def.title);
        eventDatas[data.itemTypeCode].list.push(data);
      } else {
        if (!data.itemType) return;
        eventDatas[data.itemTypeCode] = {
          title: data.itemType,
          color: data.color,
          list: [data],
          flag: data.flag,
        };
      }
    }
  });
  const eventKeys = Object.keys(eventDatas);
  return (
    <>
      <div className="content">
        {eventKeys.map((item, index) => {
          return (
            <CustomDayEventWrap
              time={props.dateProfile.currentRange.start.toUTCString()}
              data={eventDatas[item]}
              key={item}
            />
          );
        })}
      </div>
    </>
  );
};

class CustomCalendar extends React.Component<calendarProps, calendarState> {
  constructor(props: calendarProps) {
    super(props);
    this.state = {
      taskListTitle: '',
    };
  }
  componentDidMount() {
    const { getCalendarRef } = this.props;
    getCalendarRef(this.refs.calendar);
    const time = moment((this.refs.calendar as any).getApi().getDate());
    this.setState({
      taskListTitle: time.format('YYYY年MM月DD日') + ' 星期' + weekEnum[time.weekday()],
    });
  }
  UNSAFE_componentWillReceiveProps(props: any) {
    const { clickDate } = props;
    const time = moment(clickDate);
    if (clickDate) {
      this.setState({
        taskListTitle: time.format('YYYY年MM月DD日') + ' 星期' + weekEnum[time.weekday()],
      });
    }
  }
  //   运营日历 自定义单元的格子
  CustomDayCellContent = (props: DayCellContentArg): JSX.Element => {
    const { holidayList } = this.props;
    const currentDay = moment(props.date).format('YYYY-MM-DD');
    const isToday = (holidayList as holiday[]).find(item => {
      if (~item.date.indexOf(currentDay)) return true;
    });
    const exchangeList = (isToday && isToday.addressList) || [];

    const { dayNumberText, isToday: pIsToday } = props;

    return (
      <div className="dayCellWrap">
        <p className={pIsToday ? 'theDay dayNum' : 'dayNum'}>
          {dayNumberText.slice(0, dayNumberText.length - 1)}
        </p>
        {!isToday ? (
          ''
        ) : (
          <div className="rowFlex">
            <p className="exchangeItem special">休</p>
            {exchangeList.map((item, index) => {
              return (
                <p className="exchangeItem normal" key={index}>
                  {item}
                </p>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  // 运营日历 自定义事件
  CustomEventItem = (props: EventContentArg): JSX.Element => {
    const { allSubInfoList, currentTab } = this.props;
    const eventData = JSON.parse(props.event.title);
    eventData.color = eventData.color || 'black';
    return (
      <div className="taskWrap">
        <div
          style={{ backgroundColor: eventData.color }}
          // TODO 写死的地方
          className={currentTab == 'allCalendar' ? 'squareBlock' : 'circleBlock'}
        ></div>
        <span className="taskType">{allSubInfoList[eventData.code] + ':'}</span>
        <b className="taskTitle">{eventData.taskNum}</b>
      </div>
    );
  };

  /**
   *  点击事件的函数
   */
  handlerEventClick = (arg: EventClickArg) => {
    const { eventClickCallback, currentTab } = this.props;
    // TODO 写死的地方
    if (currentTab == 'tradingCalendar') return;
    const eventData = JSON.parse(arg.event.title);
    const time = moment(arg.event.startStr);
    this.setState({
      taskListTitle: time.format('YYYY年MM月DD日') + ' 星期' + weekEnum[time.weekday()],
    });
    eventClickCallback &&
      eventClickCallback(
        [eventData.code],
        arg.event.startStr,
        eventData.processDefinitionKey ? [eventData.processDefinitionKey] : [],
      );
  };

  /**
   *点击日期的函数
   */
  handlerDataClick = (arg: any) => {
    const { dateClickCallback, currentTab } = this.props;
    // TODO 写死的地方
    if (currentTab == 'tradingCalendar') return;
    const time = moment(arg.date);
    this.setState({
      taskListTitle: time.format('YYYY年MM月DD日') + ' 星期' + weekEnum[time.weekday()],
    });
    dateClickCallback && dateClickCallback([], arg.dateStr);
  };

  //   解析数据
  render() {
    const {
      currentView = 'dayGridMonth',
      CustomEvent = this.CustomEventItem,
      CustomDayCell = this.CustomDayCellContent,
      eventList = [],
      taskList,
      taskListLoading,
      currentTab,
      enableByUser = { weekBegins: 0, displaysNum: 5 },
    } = this.props;
    return (
      <div style={{ display: 'flex' }}>
        <div style={{ width: '100%', height: '100vh' }}>
          <FullCalendar
            ref="calendar"
            initialView={currentView}
            plugins={[
              dayGridPlugin,
              timeGridPlugin,
              interaction,
              createPlugin({
                views: {
                  customList: CustomView,
                  dateIncrement: 'day',
                  weekNumbers: true,
                  locale: 'zh-cn',
                },
              } as PluginDefInput),
            ]}
            // aspectRatio={1.8}
            height="100%"
            headerToolbar={false}
            locale="zh-cn"
            buttonText={{
              today: '今天',
              month: '月',
              week: '周',
              customList: '日',
            }}
            moreLinkText="更多"
            dayMaxEvents={enableByUser.displaysNum}
            allDayText="全天"
            firstDay={enableByUser.weekBegins}
            selectable={true}
            dayPopoverFormat={{ month: 'long', day: 'numeric', weekday: 'long' }}
            slotLabelFormat={{
              hour: '2-digit',
              minute: '2-digit',
              meridiem: false,
              hour12: false,
            }}
            dateClick={this.handlerDataClick}
            eventClick={this.handlerEventClick}
            events={eventList}
            eventContent={CustomEvent}
            dayCellContent={CustomDayCell}
          />
        </div>
        {/* // TODO 写死的地方 */}
        {currentView != 'customList' && currentTab != 'tradingCalendar' && (
          <div style={{ flexBasis: '400px' }}>
            <TaskList
              title={this.state.taskListTitle}
              taskListLoading={taskListLoading}
              sourceData={taskList}
            ></TaskList>
          </div>
        )}
      </div>
    );
  }
}

export default CustomCalendar;
