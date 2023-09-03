import React from 'react';
import {
  Button,
  Card,
  ConfigProvider,
  DatePicker,
  Dropdown,
  Icon,
  Input,
  Menu,
  message,
  Modal,
  Popover,
  Radio,
  Select,
  Spin,
  Tabs,
} from 'antd';
import { RadioChangeEvent } from 'antd/lib/radio/interface.d';
import { errorBoundary } from '@/layouts/ErrorBoundary';
import { connect } from 'dva';
import router from 'umi/router';
import moment from 'moment';
import CustomCalendar from './CustomCalendar.tsx';
import QuadrantView from './quadrantView';
import ProductView from './productView';
import FiltrateView from './filtrate.tsx';
import SingleCustomerEvents from '@/utils/SingleCustomerEvents';
import CustomModal from './modalPannel';
import flatMap from 'lodash/flatMap';
import { routerRedux } from 'dva/router';
import TabCarlendar from './tabCarlendar';
import { CheckColorItem, TemplateWrap } from './setPanel/strategyComponent';
import { cloneDeep } from 'lodash';
import { getMenu } from '@/utils/session';
import { recursiveGetData } from '@/utils/utils';
import  { ActionBool } from '@/utils/hocUtil';

import { AddTaskMenuPropsItem, homeState } from './operatingCalendar.d';
import { priorityEnum, taskTypeEnum } from './staticEnum';
import { PageContainers } from '@/components';

import CalendarDataTra from './calendarDataTransfer'
const { SubMenu } = Menu;

const styles = require('./index.less');

const { Option } = Select;

const { TabPane } = Tabs;

const { TextArea } = Input;

// 用户权限
// let newMenuTree = [];

// 跳转的时间暂存区
let jumpDateStr = '';

class Index extends React.Component<any, homeState> {
  constructor(props: any) {
    super(props);
    this.state = {
      //  * 当前tab 全部 运营日历 排期表
      currentTab: '',
      //  * 当前运营日历的类型视图 月 周 日
      currentView: 'customList',
      // currentView: 'customList',
      //  * 运营日历的日类型视图
      currentCalendarDayView: 'calendar',
      // 日历的标题
      calendarTitle: '',
      // 日历组件的实例
      calendarRef: undefined,
      // 日历组件的api
      calendarApi: undefined,
      // 日历开始的时间
      startTime: '',
      // 日历结束的时间
      endTime: '',
      // 是否显示筛选的抽屉
      filtrateVisible: false,
      // 点击的单元格的时间
      clickDate: '',
      // 点击单元格的code
      clickCode: [],
      // 筛选的参数
      filterParams: {},
      // 事项设置的弹出框
      matterSetVisible: false,
      // 事项设置的选项
      matterValue: 'custom',
      // 当前用户设置的自定义颜色的数据
      currentUserCustomColor: {},
      // 当前用户使用的模版
      currentUseTemplate: '',
      // 事项设置自定义颜色tabkey
      matterCustomTabKey: '0',
      // 待处理数据
      pendingData: {},
      // 状态弹窗是否显示
      pendingModalVisible: false,
      // 弹窗显示
      hoverVisible: false,
      // 是否显示输入时间的弹窗
      dateTitleInputVisible: false,
      // 用户权限
      newMenuTree: [],

      firstList: [],
      secList: {},

      // 线下办理弹窗的处理说明
      remarks: '',

      // 弹窗部分回头要改的
      // 是否显示弹窗
      showTaskmodal: false,
      privateConfig: {},
      modalConfig: {},
    };
    this.submitData = [];
    // 延期设置的时间
    this.yanqiDate = '';
  }
  /**
   * 初始化获取交易所和设置交易所筛选的初始值
   */
  componentDidMount() {
    jumpDateStr = '';
    // 获取用户权限
    let menuTree = [];
    const newMenuTree = [];
    menuTree = ((getMenu() && JSON.parse(getMenu())) || []).find(item => {
      return item.code == 'productLifecycle';
    });
    menuTree = flatMap(recursiveGetData(menuTree, 'children'));
    menuTree &&
      menuTree.map(item => {
        const sonItem = item.actions.find(sonitem => sonitem.name == '发起流程');
        if (sonItem?.code) {
          newMenuTree.push({
            name: item.name,
            code: `${sonItem.uriFlag}${sonItem.tabUri}`,
          });
        }
      });
    this.setState({
      newMenuTree,
    });
    // 监听添加任务事件
    SingleCustomerEvents.getInstance().addEventListener('addTask', this.showTaskTypeList);
    // 监听任务详情事件
    SingleCustomerEvents.getInstance().addEventListener('showInfo', this.showDetailModal);
    // // 获取用户目前已启用的日程策略
    this.props.dispatch({
      type: 'operatingCalendar/getEnableByUser',
    });
    // // 获取委托人列表
    // this.props.dispatch({
    //   type: 'operatingCalendar/getPersonList',
    // });
    // 获取类型的字典
    this.props
      .dispatch({
        type: 'operatingCalendar/getAllSubInfoList',
      })
      .then((res: any) => {
        const firstList: any[] = res?.filter((item: any) => item.parentId == 0);
        const secList: any = {};
        firstList.forEach((item: any) => {
          res.forEach((sonItem: any) => {
            if (item.id == sonItem.parentId) {
              if (secList[item.code]) {
                secList[item.code].push(sonItem);
              } else {
                secList[item.code] = [sonItem];
              }
            }
          });
        });
        this.setState({
          firstList,
          secList,
        });
        // 获取tab的列表
        this.props.dispatch({
          type: 'investorReview/getDicsByTypes',
          payload: ['addressCode', 'calendar'],
          callBack: (res: any) => {
            this.setState(
              {
                currentTab: res.calendar[0]?.code,
              },
              () => {
                this.getFilterList();
                this.upDataTaskList();
              },
            );
          },
        });
      });
  }

  /**
   * 根据类型获取不同的添加任务
   */
  AddTaskMenu = (props: AddTaskMenuPropsItem) => {
    const taskKeys = Array.from(Object.keys(taskTypeEnum)).slice(1, 3);
    const { handlerClick } = props;
    const { newMenuTree } = this.state;

    return (
      <Menu
        mode="vertical"
        onClick={(params: any) => {
          handlerClick(params.key);
        }}
      >
        {taskKeys.map((item, index) => {
          return <Menu.Item key={item}>{taskTypeEnum[item]}</Menu.Item>;
        })}
        {newMenuTree.length && (
          <SubMenu key="processMatters" title="新的流程发起">
            {newMenuTree.map((item, index) => {
              return <Menu.Item key={item.code}>{item.name}</Menu.Item>;
            })}
          </SubMenu>
        )}
      </Menu>
    );
  };

  /**
   * 显示任务类型
   */
  showTaskTypeList = (_grade: string | number) => {
    this.setState({
      privateConfig: {
        modalType: 'addTask',
        selectTaskType: this.selectTaskType,
        grade: _grade,
      },
      modalConfig: {
        footer: null,
        title: this.state.calendarTitle,
      },
      showTaskmodal: true,
    });
  };

  // 选择任务类型&添加自定义任务
  selectTaskType = (typeNum: number | string, grade?: number | string) => {
    const { currentView, calendarApi, secList, firstList } = this.state;
    const { personList } = this.props;
    this.setState({
      showTaskmodal: false,
      privateConfig: {
        taskType: typeNum,
        modalType: 'taskInfo',
        handlerSubmit: this.handlerSubmit,
        grade,
        firstList,
        secList,
        personList,
        startTime:
          currentView == 'customList'
            ? moment(calendarApi.view.activeStart).format('YYYY-MM-DD')
            : null,
      },
      modalConfig: {
        title: `创建${taskTypeEnum[typeNum]}`,
      },
      // showTaskmodal: true,
    });
    switch (typeNum) {
      case 'customItems':
        router.push('/taskCenter/operatingCalendar/index/addTask');
        break;
      case 'paiqi':
        router.push('/taskCenter/productScheduling/calendar/add');
        break;
      default:
        router.push(typeNum);
        break;
    }
  };

  /**
   *任务详情
   */
  showDetailModal = (data: any) => {
    // 如果是产品事项就不做反应
    if (data.itemTypeCode == 'productMatters') return;
    // 线下办理
    if (+data.handType == 1) {
      this.setState({ remarks: data.remarks || '', pendingData: data, pendingModalVisible: true });
    } else if (+data.handType == 0) {
      sessionStorage.setItem('calendarLocation', location.href);
      // 线上办理
      const { processDefinitionId, processInstanceId, taskDefinitionKey, taskId } = data;
      const { dispatch } = this.props;
      dispatch(
        routerRedux.push({
          pathname: '/processCenter/taskDeal',
          query: {
            taskId,
            processDefinitionId,
            processInstanceId,
            taskDefinitionKey,
            mode: 'deal',
          },
        } as any),
      );
    } else {
      message.error('请先设置办理策略!');
    }
  };

  // showDetailModal = (_id: string | number) => {
  //   if (this.state.currentTab != 'allCalendar') return;
  //   const { dispatch } = this.props;
  //   this.setState({
  //     privateConfig: {
  //       modalType: 'taskDetail',
  //       taskId: _id,
  //       cancelHandler: (params: any) => {
  //         dispatch({
  //           type: 'operatingCalendar/getUpdateTask',
  //           payload: params,
  //           callBack: this.upDataTaskList,
  //         });
  //       },
  //     },
  //     modalConfig: { footer: null, title: '任务详情' },
  //     showTaskmodal: true,
  //   });
  // };
  /**
   * 添加任务提交数据
   */
  handlerSubmit = (params: any) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'operatingCalendar/addTask',
      payload: params,
      callBack: () => {
        this.setState({
          showTaskmodal: false,
        });
        this.upDataTaskList();
      },
    });
  };

  /**
   * 更新数据
   */
  upDataTaskList = () => {
    // 如果日历组件的还没有初始化完成 或者 左上角的tab按钮还没有显示出来的话,就return出去
    if (this.state.calendarApi == undefined || this.props.tabList.length <= 0) return;
    const { calendarApi, currentCalendarDayView, currentTab } = this.state;
    const startTime = moment(calendarApi.view.activeStart).format('YYYY-MM-DD');
    const endTime = moment(calendarApi.view.activeEnd).format('YYYY-MM-DD');
    this.setState(
      {
        // 更新标题
        calendarTitle: calendarApi.view.title,
        // 更新当前时间
        clickDate: moment(calendarApi.getDate()).format('YYYY-MM-DD'),
        // 更新开始和结束时间
        startTime,
        endTime,
      },
      async () => {
        if (currentCalendarDayView == 'calendar') {
          await this.getData();
          // TODO 写死的地方
          // if (currentTab != 'tradingCalendar') {
          this.getTaskList();
          // }
        } else {
          // SingleCustomerEvents.getInstance().dispatchEvent(currentCalendarDayView, startTime);
        }
      },
    );
  };
  /**
   * 切换日历的日月周
   */
  handlerChangeView = (e: RadioChangeEvent) => {
    this.state.calendarApi.changeView(e.target.value);
    // 切换视图以后跳转时间
    if (this.state.clickDate) {
      this.state.calendarApi.gotoDate(this.state.clickDate);
    }
    this.setState(
      {
        currentView: e.target.value as homeState['currentView'],
      },
      this.upDataTaskList,
    );
  };
  /**
   * 切换运营日历的日类型视图
   */
  handlerChangeCalendarDayView = (value: homeState['currentCalendarDayView']) => {
    this.setState(
      {
        currentCalendarDayView: value,
      },
      this.upDataTaskList,
    );
  };
  /**
   * 切换tab的时候
   */
  handlerChangeCurrentTab = (key: string) => {
    this.setState(
      {
        currentTab: key,
      },
      async () => {
        this.getFilterList();
        this.upDataTaskList();
      },
    );
  };

  // 获取日期的实例
  getCalendarRef = (ref: any) => {
    this.setState(
      {
        calendarRef: ref,
        calendarApi: ref.getApi(),
      },
      this.upDataTaskList,
    );
  };

  /**
   *跳转到今天
   */
  handlerToday = () => {
    this.state.calendarApi.today();
    this.upDataTaskList();
  };
  /**
   * 上一个
   */
  handlerPrev = () => {
    this.state.calendarApi.prev();
    this.upDataTaskList();
  };
  /**
   * 下一个
   */
  handlerNext = () => {
    this.state.calendarApi.next();
    this.upDataTaskList();
  };
  /**
   * 获取数据
   */
  getData = async () => {
    const {
      calendarApi,
      currentTab,
      currentCalendarDayView,
      currentView,
      startTime,
      endTime,
      filterParams,
    } = this.state;
    // 运营日历的情况下
    if (
      currentView !== 'customList'
      // (currentView === 'customList' && currentCalendarDayView == 'calendar')
    ) {
      // 获取日历的数据
      await this.props.dispatch({
        type: 'operatingCalendar/getNoticeList',
        payload: {
          startTime,
          endTime,
          // TODO 写死的地方
          flag: currentTab,
          ...filterParams,
        },
      });
      // this.getHolidayList();
      // this.getFilterList();
    }
    // if (currentView == 'customList' && currentCalendarDayView == 'calendar') {
    //   this.getTaskList();
    // }
  };
  /**
   * 初始化任务列表
   */
  getTaskList = (code: string[] = [], dateStr?: string, _processDefinitionKey?: string[]) => {
    // 如果日历组件的还没有初始化完成 或者 左上角的tab按钮还没有显示出来的话,就return出去
    if (this.state.calendarApi == undefined || this.props.tabList.length <= 0) return;
    const { calendarApi, currentTab, filterParams } = this.state;
    const { noticeList } = this.props;

    // 如果有时间传过来就存起来 筛选的时候要用
    if (dateStr) {
      this.setState({
        clickDate: dateStr,
      });
    }
    if (code) {
      this.setState({
        clickCode: code,
      });
    }
    // 当天的日期
    const theDayDate = dateStr || moment(calendarApi.getDate()).format('YYYY-MM-DD');
    // 当前的任务列表
    const theDayTaskList = noticeList.filter((item: any) => item.start == theDayDate) ?? [];
    // 运营日历用的定义的key
    const processDefinitionKey: string[] = _processDefinitionKey || [];
    if (!_processDefinitionKey) {
      theDayTaskList.forEach((item: any) => {
        const _item = JSON.parse(item.title);
        if (_item.processDefinitionKey) {
          processDefinitionKey.push(_item.processDefinitionKey);
        }
      });
    }
    this.props.dispatch({
      type: 'operatingCalendar/getTaskList',
      payload: {
        code,
        flag: currentTab,
        executeTime: theDayDate,
        ...filterParams,
        processDefinitionKey,
      },
    });
  };
  /**
   *获取筛选选项
   * @memberof Index
   */
  getFilterList = () => {
    const { currentTab } = this.state;
    this.setState({ filterParams: {} });
    this.props.dispatch({
      type: 'operatingCalendar/getFilterList',
      payload: {
        flag: currentTab,
      },
    });
  };

  /**
   * 获取节假日的数据
   */
  getHolidayList = () => {
    const { calendarApi } = this.state;
    const startTime = moment(calendarApi.view.activeStart).format('YYYY-MM-DD');
    const endTime = moment(calendarApi.view.activeEnd).format('YYYY-MM-DD');
    // 获取交易所休息日的数据
    this.props.dispatch({
      type: 'operatingCalendar/getHolidayList',
      payload: {
        startTime,
        endTime,
      },
    });
  };
  /**
   * 计算是否显示日历组件
   * 因为判断显示的条件太多,不如判断隐藏的条件
   */
  computedCanHiddenCalendar = (): boolean => {
    const { currentView, currentCalendarDayView, currentTab } = this.state;
    if (currentCalendarDayView !== 'calendar' && currentView === 'customList') {
      return true;
    }
    return false;
  };
  /**
   * 计算content区域是否显示loading
   */
  computedSpinLoading = (): boolean => {
    const {
      quadrantLoading = false,
      noticeListLoading = false,
      taskListLoading = false,
    } = this.props;
    return (
      quadrantLoading ||
      noticeListLoading ||
      (this.state.currentView == 'customList' && taskListLoading)
    );
  };
  /**
   * 筛选抽屉的关闭回调函数
   */
  handlerFiltrateClose = () => {
    this.setState({
      filtrateVisible: false,
    });
  };
  /**
   * 自己写的日历组件点击日期的回调
   */
  handlerTabChange = (date: string) => {
    this.state.calendarApi.gotoDate(date);
    this.upDataTaskList();
  };
  /**
   * 筛选返回回来值
   */
  handlerFilterData = (data: any) => {
    this.setState(
      {
        filterParams: data,
      },
      this.upDataTaskList,
    );
  };
  /**
   *事项设置确认
   */
  handleMatterSetOk = () => {
    this.props
      .dispatch({
        type: 'operatingCalendar/addBatchPer',
        payload: this.submitData[0],
      })
      .then(res => {
        this.setState({
          matterSetVisible: false,
        });
        this.upDataTaskList();
      });
  };
  /**
   * 事项设置切换选项
   */
  onMatterChange = (e: any) => {
    this.setState({
      matterValue: e.target.value,
    });
  };
  /**
   *显示事项设置面板
   */
  showMatterPanel = () => {
    this.setState({
      matterSetVisible: true,
    });
    Promise.all([
      this.props.dispatch({
        type: 'operatingCalendar/getAllSys',
      }),
      this.props.dispatch({
        type: 'operatingCalendar/getPer',
      }),
    ]).then((result: any) => {
      if (!result[1].length) {
        this.submitData = [this.dispostData(cloneDeep(this.props.allSysList[0]))];
        this.setState({
          currentUseTemplate: this.props.allSysList[0]?.name,
          currentUserCustomColor: this.props.allSysList[0],
        });
      } else {
        const userTemplate = result[1][0];
        this.submitData = [this.dispostData(cloneDeep(userTemplate))];
        this.setState({
          currentUseTemplate: userTemplate.name,
          currentUserCustomColor: userTemplate,
        });
      }
    });
  };
  //   处理数据
  dispostData = data => {
    const { list, name } = data;
    const tempList = [];
    list.forEach(item => {
      tempList.push({
        strategyName: name,
        firstCode: item.code,
        id: item.id,
        color: item.color || '#000000',
      });
      if (item.colorList.length) {
        item.colorList.forEach(sonItem => {
          tempList.push({
            strategyName: name,
            firstCode: item.code,
            subCode: sonItem.subCode || sonItem.code,
            color: sonItem.color || '#000000',
            id: sonItem.id,
          });
        });
      }
    });
    return tempList;
  };
  /**
   * 事项设置切换模版的回调
   */
  onMatterChangeCallback = e => {
    const currentValue = e.target.value;
    const userTemplate = this.props.allSysList.find((item: any) => item.name == currentValue);
    this.submitData = [this.dispostData(cloneDeep(userTemplate))];
    this.setState({
      currentUseTemplate: currentValue,
      currentUserCustomColor: userTemplate,
    });
  };

  /**
   * 事项线下办理的时候的处理说明的change事件
   */
  onRemarksChange = (e: any) => {
    this.setState({ remarks: e.target.value });
  };

  /**
   * 办理处理
   */
  transactionHandler = (key: string) => {
    const { pendingData, remarks } = this.state;
    switch (key) {
      // 忽略
      case 'overlook':
        this.props.dispatch({
          type: 'operatingCalendar/taskHandleAdd',
          payload: {
            taskId: pendingData.id,
            isIgnore: 1,
            isComplete: 1,
            remarks,
          },
          callBack: () => {
            this.setState(
              {
                pendingModalVisible: false,
              },
              () => {
                this.upDataTaskList();
                message.success('已忽略');
              },
            );
          },
        });
        break;
      // 延期
      case 'postpone':
        this.props.dispatch({
          type: 'operatingCalendar/getUpdateTask',
          payload: {
            id: pendingData.id,
            deadline: this.yanqiChange,
            remarks,
          },
          callBack: () => {
            this.setState(
              {
                pendingModalVisible: false,
                hoverVisible: false,
              },
              () => {
                this.upDataTaskList();
                message.success('已延期');
              },
            );
          },
        });
        break;
      // 办理
      case 'transaction':
        this.props.dispatch({
          type: 'operatingCalendar/taskHandleAdd',
          payload: {
            taskId: pendingData.id,
            isComplete: 1,
            remarks,
          },
          callBack: () => {
            this.setState(
              {
                pendingModalVisible: false,
              },
              () => {
                this.upDataTaskList();
                message.success('已完成');
              },
            );
          },
        });
        break;
    }
  };
  // 延期时间的选择
  yanqiChange = key => {
    this.yanqiChange = moment(key).format('YYYY-MM-DD hh:mm:ss');
  };
  // 点击标题输入时间
  handlerDateInputVisible = () => {
    jumpDateStr = this.state.clickDate;
    this.setState({
      dateTitleInputVisible: true,
    });
  };
  // 跳转时间的change事件
  handleTitleInput = (e: any) => {
    if (!e.target) {
      jumpDateStr = e.format('YYYY-MM-DD');
    }
    if (e.target?.nodeName == 'BUTTON') {
      const reg = /^\d{4}-\d{2}-\d{2}$/;
      if (!reg.test(jumpDateStr)) {
        message.error('请输入正确的格式!');
      } else if (!moment(jumpDateStr).isValid()) {
        message.error('请输入正确的日期!');
      } else if (jumpDateStr == this.state.clickDate) {
        this.setState({
          dateTitleInputVisible: false,
        });
      } else {
        this.setState(
          {
            dateTitleInputVisible: false,
          },
          () => {
            this.handlerTabChange(jumpDateStr);
          },
        );
      }
    }
  };

  render() {
    const {
      currentTab,
      currentView,
      currentCalendarDayView,
      calendarTitle,
      startTime,
      filtrateVisible,
      clickDate,
      showTaskmodal,
      privateConfig,
      modalConfig,
      filterParams,
      currentUseTemplate,
      currentUserCustomColor,
      matterCustomTabKey,
      matterValue,
      pendingModalVisible,
      pendingData,
      remarks,
      dateTitleInputVisible,
    } = this.state;

    const {
      holidayList,
      noticeList,
      tabList,
      tabListLoading = true,
      allSubInfoList,
      taskList,
      submitLoading = false,
      taskListLoading = false,
      allSubInfoLoading = false,
      filterList,
      filterListLoading = false,
      getAllSysLoading = false,
      getPerLoading = false,
      addBatchPerLoading = false,
      allSysList,
      enableByUser,
    } = this.props;

    // 规则列表
    const handRuleList = pendingData?.handRule?.split(',') || [];

    let eventList = [];
    // 运营日历
    if (
      currentView !== 'customList'
      // (currentView === 'customList' && currentCalendarDayView == 'calendar')
    ) {
      eventList = noticeList;
    } // 如果是日的话,要显示任务的数据
    else if (currentView === 'customList' && currentCalendarDayView == 'calendar') {
      const _data = taskList || [];

      let tempData = _data.map((sonItem: any) => {
        return {
          title: JSON.stringify({ ...sonItem, flag: currentTab }),
          start: sonItem.executeTime,
          color: 'transparent',
          textColor: 'black',
        };
      });
      tempData = flatMap(tempData);
      eventList = tempData;
    }

    return (
      <PageContainers>
        <Spin spinning={tabListLoading || allSubInfoLoading}>
          <div className={styles.calendarWrap}>
            <Spin spinning={this.computedSpinLoading()}>
              <Card
                className={styles.homeCard}
                extra={ 
                  ActionBool('operatingCalendar:set') &&
                  <Button 
                    onClick={() => {
                      router.push('/taskCenter/operatingCalendar/index/openDaySetting');
                    }}
                    type="primary"
                  >
                    开放日设置
                  </Button>
                }
                title={
                  <Tabs
                    activeKey={currentTab}
                    onChange={this.handlerChangeCurrentTab}
                    animated={false}
                  >
                    {tabList.map((item: { id: string; code: string; name: string }) => {
                      return <TabPane tab={item.name} key={item.code} />;
                    })}
                  </Tabs>
                }
              >
                <ConfigProvider autoInsertSpaceInButton={false}>
                  <div className="rowFlex spaceBetween headwrap">
                    <div>
                      <Button icon="left" onClick={this.handlerPrev} className="equal" />
                      <span className="titleWord" onClick={this.handlerDateInputVisible}>
                        {calendarTitle}
                      </span>
                      <Button icon="right" className="equal" onClick={this.handlerNext} />
                      <Button className="equal tody" onClick={this.handlerToday}>
                        今天
                      </Button>
                    </div>
                    <div>
                      <Button
                        className="iconBtn"
                        style={{ marginLeft: '8px' }}
                        onClick={this.showMatterPanel}
                      >
                        事项设置
                      </Button>
                      {currentView == 'customList' && (
                        <Select
                          value={currentCalendarDayView}
                          onChange={this.handlerChangeCalendarDayView}
                        >
                          <Option value="calendar">日历视图</Option>
                          {currentTab != 'productMatters' && currentTab != 'tradingCalendar' && (
                            <Option value="product">产品视图</Option>
                          )}
                          <Option value="quadrant">象限视图</Option>
                        </Select>
                      )}
                      {currentCalendarDayView != 'calendar' ? (
                        <></>
                      ) : (
                        <Radio.Group
                          style={{ marginRight: '8px' }}
                          value={currentView}
                          onChange={this.handlerChangeView}
                        >
                          {/* <Radio.Button value="dayGridYear">年</Radio.Button> */}
                          <Radio.Button value="dayGridMonth">月</Radio.Button>
                          <Radio.Button value="dayGridWeek">周</Radio.Button>
                          <Radio.Button value="customList">日</Radio.Button>
                        </Radio.Group>
                      )}
                      {/* {currentCalendarDayView == 'calendar' && (
                      <Button
                        style={{ marginLeft: '8px' }}
                        onClick={() => {
                          router.push('/taskCenter/allTheSchedule');
                        }}
                        className="iconBtn"
                      >
                        <Icon type="unordered-list" />
                        全部日程
                      </Button>
                    )} */}
                      {currentCalendarDayView !== 'product' && (
                        <>
                          {/* TODO 写死的地方 */}
                          {currentTab == 'allCalendar' && (
                            <Dropdown
                              overlay={() =>
                                this.AddTaskMenu({ handlerClick: this.selectTaskType })
                              }
                              trigger={['click']}
                            >
                              <Button onClick={() => {}} className="iconBtn">
                                <Icon type="plus" />
                                {/* 新建 */}
                              </Button>
                            </Dropdown>
                          )}
                          <Button
                            onClick={() => {
                              router.push('/taskCenter/operatingCalendar/index/subscribe');
                            }}
                            className="iconBtn"
                          >
                            <Icon type="setting" />
                            {/* 订阅 */}
                          </Button>
                          <Button
                            onClick={() => {
                              this.setState({
                                filtrateVisible: true,
                              });
                            }}
                            className="iconBtn"
                          >
                            <Icon type="filter" />
                            {/* 筛选 */}
                          </Button>
                            <CalendarDataTra/>
                        </>
                      )}
                    </div>
                  </div>
                  {currentView == 'customList' && (
                    <TabCarlendar currentDate={clickDate} tabChange={this.handlerTabChange} />
                  )}
                </ConfigProvider>
                <div
                  style={{
                    display: this.computedCanHiddenCalendar() ? 'none' : 'block',
                  }}
                >
                  {/* 日历组件 */}
                  <CustomCalendar
                    currentView={currentView}
                    currentTab={currentTab}
                    holidayList={holidayList}
                    getCalendarRef={this.getCalendarRef}
                    eventList={eventList}
                    allSubInfoList={allSubInfoList}
                    dateClickCallback={this.getTaskList}
                    eventClickCallback={this.getTaskList}
                    taskList={taskList}
                    taskListLoading={taskListLoading}
                    clickDate={clickDate}
                    enableByUser={enableByUser}
                  />
                </div>
                {/* 象限视图 */}
                {currentCalendarDayView == 'quadrant' && currentView == 'customList' && (
                  <QuadrantView
                    currentStartTime={startTime}
                    // checkLevelList={checkLevelList}
                    // checkAdressList={checkAdressList}
                    filterParams={filterParams}
                    currentTab={currentTab}
                  />
                )}
                {/* 产品视图 */}
                {currentCalendarDayView == 'product' && currentView == 'customList' && (
                  <ProductView currentStartTime={startTime} />
                )}
              </Card>
            </Spin>
            {/* 抽屉筛选 */}
            <FiltrateView
              filtrateVisible={filtrateVisible}
              onCloseCallBack={this.handlerFiltrateClose}
              setFilterData={this.handlerFilterData}
              currentTab={currentTab}
              filterList={filterList}
              filterParams={filterParams}
              filterListLoading={filterListLoading}
            />

            <CustomModal
              modalConfig={modalConfig}
              privateConfig={privateConfig}
              showTaskmodal={showTaskmodal}
              setShowTaskmodal={(state: boolean) => {
                this.setState({
                  showTaskmodal: state,
                });
              }}
              submitLoading={submitLoading}
            />
            <Modal
              title={pendingData.title || ''}
              visible={pendingModalVisible}
              onOk={() => {}}
              onCancel={() => {
                this.setState({
                  pendingModalVisible: false,
                });
              }}
              footer={
                <div className={styles.footerClass}>
                  <Button
                    onClick={() => {
                      this.setState({
                        pendingModalVisible: false,
                      });
                    }}
                  >
                    取消
                  </Button>
                  {handRuleList && handRuleList[1] == 1 && (
                    <Button
                      onClick={() => {
                        this.transactionHandler('overlook');
                      }}
                      disabled={pendingData.progress == '已完成'}
                    >
                      忽略
                    </Button>
                  )}
                  {handRuleList && handRuleList[0] == 1 && (
                    <Popover
                      content={
                        <div>
                          <div style={{ marginBottom: '10px' }}>
                            <span style={{ display: 'inline-block', marginRight: '10px' }}>
                              延期至:
                            </span>
                            <DatePicker
                              disabledDate={current => {
                                return current && current < moment().endOf(pendingData.deadline);
                              }}
                              onChange={this.yanqiChange}
                            />
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <Button
                              onClick={() => {
                                this.transactionHandler('postpone');
                              }}
                            >
                              确认
                            </Button>
                          </div>
                        </div>
                      }
                      trigger="click"
                      visible={this.state.hoverVisible}
                    >
                      <Button
                        style={{ marginLeft: '8px' }}
                        onClick={() => {
                          this.setState({
                            hoverVisible: true,
                          });
                        }}
                        disabled={pendingData.progress == '已完成'}
                      >
                        延期
                      </Button>
                    </Popover>
                  )}
                  {/* 流程事项和产品事项不可以办理 */}
                  {pendingData.itemTypeCode != 'productMatters' &&
                    pendingData.itemTypeCode != 'processMatters' && (
                      <Button
                        onClick={() => {
                          this.transactionHandler('transaction');
                        }}
                        disabled={pendingData.progress == '已完成'}
                      >
                        确定
                      </Button>
                    )}
                </div>
              }
            >
              <div className={styles.pendingStyle}>
                <p>
                  <span>事项类型</span>
                  {pendingData.itemType || ''}
                </p>
                <p>
                  <span>紧急程度</span>
                  {(pendingData.grade && priorityEnum[Number(pendingData.grade) - 1]) || ''}
                </p>
                <p>
                  <span>二级事项类型</span>
                  {pendingData.specificItem || pendingData.subItemType || ''}
                </p>
                <p>
                  <span>产品名称</span>
                  {pendingData.proOrToDo || ''}
                </p>
                <p>
                  <span>事项描述</span>
                  {pendingData.content || ''}
                </p>
                <p>
                  <span>开始时间</span>
                  {pendingData.executeTime || ''}
                </p>
                <p>
                  <span>截止时间</span>
                  {pendingData.deadline || ''}
                </p>
                {/* 流程事项和产品事项不可以办理 */}
                {pendingData.itemTypeCode != 'productMatters' &&
                  pendingData.itemTypeCode != 'processMatters' && (
                    <>
                      <p>
                        <span>办理方式</span>
                        {pendingData.handTypeName || ''}
                      </p>
                      <p>
                        <span>办理规则</span>
                        {pendingData.handRuleName || ''}
                      </p>
                      <p>
                        <span>办理人员</span>
                        {pendingData.toDoPeople || ''}
                      </p>
                    </>
                  )}
                <p style={{ display: 'flex' }}>
                  <span style={{ whiteSpace: 'nowrap' }}>处理说明</span>
                  <TextArea rows={4} onChange={this.onRemarksChange} value={remarks} />
                  {/* {pendingData.remarks || ''} */}
                </p>
              </div>
            </Modal>

            <Modal
              title="事项设置"
              visible={this.state.matterSetVisible}
              onOk={this.handleMatterSetOk}
              onCancel={() => {
                this.setState({
                  matterSetVisible: false,
                });
              }}
              confirmLoading={addBatchPerLoading}
            >
              <Spin spinning={getAllSysLoading || getPerLoading}>
                <div>
                  <span style={{ marginRight: '20px' }}>颜色设置:</span>
                  <Radio.Group onChange={this.onMatterChange} value={matterValue}>
                    <Radio value="custom">自定义颜色</Radio>
                    <Radio value="template">模版设置</Radio>
                  </Radio.Group>
                </div>
                <p style={{ fontSize: '12px', marginTop: '5px', color: 'red' }}>
                  注:模版设置颜色为管理员设定,可进行自定义颜色替换设置
                </p>
                {matterValue == 'template' && (
                  <div style={{ display: 'flex', marginTop: '20px' }}>
                    <span style={{ marginRight: '40px', whiteSpace: 'noWrap' }}>设置为:</span>
                    <div>
                      <TemplateWrap
                        allSysList={allSysList}
                        currentValue={currentUseTemplate}
                        onChangeCallback={this.onMatterChangeCallback}
                      />
                    </div>
                  </div>
                )}
                {matterValue == 'custom' && (
                  <div className={styles.cocolorItem}>
                    <Tabs
                      activeKey={matterCustomTabKey}
                      animated={false}
                      onChange={(key: any) => {
                        this.setState({
                          matterCustomTabKey: key,
                        });
                      }}
                      tabBarGutter={0}
                      size="small"
                    >
                      {currentUserCustomColor?.list?.map((item: any, index: any) => {
                        return (
                          <TabPane tab={item.name} key={index}>
                            <div style={{ padding: '0 5%' }}>
                              <div
                                style={{
                                  display: 'flex',
                                  justifyContent: 'space-between',
                                  paddingRight: '20px',
                                }}
                              >
                                <span>二级事项名称</span>
                                <span>颜色</span>
                              </div>
                              <div
                                style={{
                                  maxHeight: '300px',
                                  overflowY: 'scroll',
                                  paddingRight: '20px',
                                }}
                              >
                                {item?.colorList?.map((sonItem: any, sonIndex: any) => {
                                  return (
                                    <CheckColorItem
                                      firstActivety={0}
                                      data={sonItem}
                                      key={sonIndex}
                                      submitData={this.submitData}
                                    />
                                  );
                                })}
                              </div>
                            </div>
                            <p
                              style={{ marginBottom: 0, marginTop: '10px', textAlign: 'right' }}
                            >{`共有${item?.colorList?.length || 0}条数据`}</p>
                          </TabPane>
                        );
                      })}
                    </Tabs>
                  </div>
                )}
              </Spin>
            </Modal>

            <Modal
              title="请输入要跳转的时间"
              visible={dateTitleInputVisible}
              destroyOnClose={true}
              onOk={this.handleTitleInput}
              onCancel={() => {
                jumpDateStr = '';
                this.setState({
                  dateTitleInputVisible: false,
                });
              }}
            >
              {/* <Input defaultValue={clickDate} onChange={this.handleTitleInput} /> */}
              <DatePicker defaultValue={moment(clickDate)} onChange={this.handleTitleInput} />
            </Modal>
          </div>
        </Spin>
      </PageContainers>
    );
  }
}

const operatingCalendar = (state: any) => {
  const {
    dispatch,
    operatingCalendar: {
      noticeList,
      holidayList,
      tabList,
      allSubInfoList,
      taskList,
      filterList,
      allSysList,
      personList,
      enableByUser,
    },
    investorReview: { codeList },
    loading,
  } = state;
  return {
    dispatch,
    noticeList,
    holidayList,
    codeList,
    tabList: codeList.calendar || [],
    taskList,
    allSubInfoList,
    allSysList,
    filterList,
    personList,
    enableByUser,
    tabListLoading: loading.effects['investorReview/getDicsByTypes'],
    noticeListLoading: loading.effects['operatingCalendar/getNoticeList'],
    quadrantLoading: loading.effects['operatingCalendar/queryQuadrant'],
    taskListLoading: loading.effects['operatingCalendar/getTaskList'],
    submitLoading: loading.effects['operatingCalendar/addTask'],
    allSubInfoLoading: loading.effects['operatingCalendar/getAllSubInfoList'],
    filterListLoading: loading.effects['operatingCalendar/getFilterList'],
    getAllSysLoading: loading.effects['operatingCalendar/getAllSys'],
    getPerLoading: loading.effects['operatingCalendar/getPer'],
    addBatchPerLoading: loading.effects['operatingCalendar/addBatchPer'],
  };
};
export default errorBoundary(connect(operatingCalendar)(Index));