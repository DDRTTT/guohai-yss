import { subscribeItem } from './operatingCalendar.d';
import { CheckboxValueType } from 'antd/lib/checkbox/Checkbox.d';
export interface homeState {
  currentTab: string;
  currentView: 'dayGridMonth' | 'dayGridWeek' | 'customList';
  currentCalendarDayView: 'quadrant' | 'product' | 'calendar';
  calendarTitle: string;
  calendarApi: any;
  calendarRef: any;
  startTime: string;
  endTime: string;
  checkLevelList: number[];
  adressList: adressItem[];
  checkAdressList: string[];
  switchFlag: number;
  filtrateVisible: boolean;
  clickDate: string;
  clickCode: string[];
  filterParams: any;
  matterSetVisible: boolean;
  matterValue: string;
  currentUseTemplate: string;
  currentUserCustomColor: any;
  matterCustomTabKey: any;
  firstList: any[];
  secList: any;
  pendingData: any;
  pendingModalVisible: boolean;
  hoverVisible: boolean;
  dateTitleInputVisible: boolean;
  remarks: string;

  showTaskmodal: boolean;
  privateConfig: object;
  modalConfig: object;
}
interface adressItem {
  label: string;
  value: string | number;
}
export interface calendarState {
  taskListTitle: string;
}
export interface callBackFunc {
  (data?: any): void;
}
export interface holiday {
  date: string;
  addressList: string[];
}
export interface calendarProps {
  currentView: homeState['currentView'];
  currentTab: homeState['currentTab'];
  CustomView: JSX.Element;
  CustomEvent: JSX.Element;
  CustomDayCell: JSX.Element;
  eventList: [];
  eventClickCallback?: any;
  dateClickCallback?: any;
  holidayList?: holiday[];
  getCalendarRef: callBackFunc;
  allSubInfoList: { id: number; code: string; name: string }[];
  dispatch: any;
  taskList: any[];
  taskListLoading: boolean;
  clickDate: string;
  enableByUser: any;
}
interface dayEventData {
  id: string | number;
  remindTime: string;
  title: string;
  type: number;
  delayDay?: string;
  deadline: string;
  executeTime: string;
  proOrToDo: string;
  itemType: string;
}
export interface CustiomDayEventProps {
  time: string;
  data: any;
  key: number | string;
  flag: string;
}

export interface FiltrateProps {
  onCloseCallBack: callBackFunc;
  filtrateVisible: boolean;
  // 下列这些应该回头是要改的
  levelChange: callBackFunc;
  switchFlag: boolean;
  switchChange: callBackFunc;
  addressNewList: any[];
  checkAdressList: any[];
  addDressChange: callBackFunc;
  currentTab: string;
  checkLevelList: CheckboxValueType[];
  filterList: any[];
  form: any;
  setFilterData: any;
  filterParams: any;
  filterListLoading: boolean;
}

export interface AddTaskMenuPropsItem {
  handlerClick: callBackFunc;
}

export interface subscribeSonItem {
  code: string;
  name: string;
  state: number | string;
  stateName: string;
}
export interface subscribeItem {
  code: string;
  name: string;
  remarks?: string;
  list: subscribeSonItem[];
}

export interface taskListProps {
  taskListLoading: boolean;
  sourceData: any[];
  title: any;
}
export interface taskListState {}

export interface tasItemData {
  itemType: string;
  specificItem: string;
  progress?: string;
  proOrToDo: string;
  grade?: string | number;
  content: string;
  deadline?: string;
  executeTime: string;
  toDoNode?: string;
  toDoPeople?: string;
  color: string;
  title?: string;
  remarks?: string;
  itemTypeCode: string;
  flag: string;
}
