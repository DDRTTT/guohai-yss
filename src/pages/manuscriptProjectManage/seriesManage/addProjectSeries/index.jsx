/**
 *  新建项目系列
 */
import React, { Component, useState } from 'react';
import {
  Table,
  Form,
  Select,
  Button,
  Row,
  Col,
  Input,
  Card,
  DatePicker,
  message,
  Radio,
  Tooltip,
  Modal,
  InputNumber,
  Breadcrumb,
} from 'antd';
import { parse } from 'querystring';
import moment from 'moment';
import { connect } from 'dva';
import router from 'umi/router';
import { routerRedux } from 'dva/router';
import { errorBoundary } from '@/layouts/ErrorBoundary';
import Action, { linkHoc } from '@/utils/hocUtil';
import styles from './index.less';
import ProMemberModal from '@/pages/manuscriptProjectManage/projectInfoManger/addProjectInfo/proMemberModal';
import ReportModal from '@/pages/manuscriptProjectManage/projectInfoManger/addProjectInfo/ReportModal';
import request from '@/utils/request';
import CustomerInfoChildrenForm from '../../components/CustomerInfoChildrenForm';
import { customerListParams } from '../../components/customerInfoSubmitParams';

const { TextArea } = Input;
const FormItem = Form.Item;
const { Option } = Select;
const { Search } = Input;
const ButtonGroup = Button.Group;

const creditNumReg = /^[0-9a-zA-Z]{18}$/; //统一社会信用代码校验规则
const phoneReg = /^(13[0-9]|14[5|7]|15[0|1|2|3|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/; //手机号码校验规则
const phoneReg2 = /^\+86(13[0-9]|14[5|7]|15[0|1|2|3|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/; // 手机号码校验规则
const numReg = /^\d{3,4}-?\d{7,8}$/; //电话号码校验规则
const idCardReg = /(^[1-9]\d{5}(18|19|2[0-3])\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)/; // 18位身份证号校验规则
const PASSPORT1 = /^[a-zA-Z]{5,17}$/; //护照验证规则
const PASSPORT2 = /^[a-zA-Z0-9]{5,17}$/; //护照验证规则
const HKMAKAO = /^[HMhm]{1}([0-9]{10}|[0-9]{8})$/; //港澳通行证
const TAIWAN1 = /^[0-9]{8}$/; //台湾来往大陆通行证
const TAIWAN2 = /^[0-9]{10}$/; //台湾来往大陆通行证
const regNum = /^[0-9a-zA-Z]*$/;
const emailReg = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;

const layout = {
  labelAlign: 'right',
  labelCol: { span: 9 },
  wrapperCol: { span: 15 },
};

@Form.create()
class AddProjectSeries extends Component {
  state = {
    pageInfo: {},
    proType: '', //项目类型
    customerType: '1', //客户类型
    idType: '', //证件类型
    proArea: '', //项目区域
    publicSector: '', //上市板块
    code: '', //由上一页面传入的系列编号
    dis: false,
    setUpTime: '',
    publicTime: '',
    columns: [
      {
        key: 'proCode',
        title: '项目编码',
        dataIndex: 'proCode',
        width: 160,
        align: 'center',
        render: proCode => <span>{proCode}</span>,
      },
      {
        key: 'proName',
        title: '项目名称',
        dataIndex: 'proName',
        ellipsis: {
          showTitle: false,
        },
        width: 200,
        align: 'center',
        render: proName => (
          <Tooltip placement="topLeft" title={proName}>
            <span>{proName}</span>
          </Tooltip>
        ),
      },
      {
        key: 'proShortName',
        title: '项目简称',
        dataIndex: 'proShortName',
        width: 180,
        ellipsis: {
          showTitle: false,
        },
        align: 'center',
        render: proShortName => (
          <Tooltip placement="topLeft" title={proShortName}>
            <span>{proShortName}</span>
          </Tooltip>
        ),
      },
      {
        key: 'checked',
        title: '状态',
        dataIndex: 'checked',
        width: 100,
        align: 'center',
        render: checked => <span>{checked ? '已审核' : '未审核'}</span>,
      },
      {
        key: 'proTypeName',
        title: '项目类型',
        dataIndex: 'proTypeName',
        width: 240,
        align: 'center',
        render: proTypeName => <span>{proTypeName}</span>,
      },
      {
        key: 'proAreaName',
        title: '项目区域',
        dataIndex: 'proAreaName',
        width: 200,
        align: 'center',
        ellipsis: {
          showTitle: false,
        },
        render: (proAreaName, record) => (
          <Tooltip
            placement="topLeft"
            title={record.proArea === '900000' ? record.overseasProArea : proAreaName}
          >
            <span>{record.proArea === '900000' ? record.overseasProArea : proAreaName}</span>
          </Tooltip>
        ),
      },
      {
        key: 'proDept',
        title: '所属部门',
        dataIndex: 'proDept',
        width: 200,
        ellipsis: {
          showTitle: false,
        },
        align: 'center',
        render: proDept => (
          <Tooltip placement="topLeft" title={proDept}>
            <span>{proDept}</span>
          </Tooltip>
        ),
      },
      {
        key: 'stockCode',
        title: '证券代码',
        dataIndex: 'stockCode',
        width: 220,
        align: 'center',
        render: stockCode => <span>{stockCode}</span>,
      },
      {
        key: 'stockShortName',
        title: '证券简称',
        dataIndex: 'stockShortName',
        width: 200,
        ellipsis: {
          showTitle: false,
        },
        align: 'center',
        render: stockShortName => (
          <Tooltip placement="topLeft" title={stockShortName}>
            <span>{stockShortName}</span>
          </Tooltip>
        ),
      },
      {
        key: 'projectStateName',
        title: '项目阶段',
        dataIndex: 'projectStateName',
        width: 160,
        align: 'center',
        render: projectStateName => <span>{projectStateName}</span>,
      },
    ],
    proMembers: [],
    proReportList: [], //项目申报信息列表数据
    taskComments: [],
    taskCommentsColumn: [
      {
        key: 'taskName',
        title: '任务名称',
        dataIndex: 'taskName',
        align: 'center',
        width: 160,
      },
      {
        key: 'handleTime',
        title: '办理时间',
        dataIndex: 'handleTime',
        align: 'center',
        width: 200,
      },
      {
        key: 'taskComment',
        title: '办理备注',
        width: 200,
        dataIndex: 'taskComment',
        align: 'center',
        ellipsis: {
          showTitle: false,
        },
        render: taskComment => (
          <Tooltip placement="topLeft" title={taskComment}>
            <span>{taskComment}</span>
          </Tooltip>
        ),
      },
      {
        key: 'handler',
        title: '办理人',
        dataIndex: 'handler',
        align: 'center',
        width: 200,
      },
    ],
    isIframe: false,
    update: 0,
    processType: '',
    processInstanceId: '',
    reportInfoColumns: [
      {
        key: 'tradingPlaces',
        dataIndex: 'tradingPlaces',
        title: '交易场所',
        render: (tradingPlaces, record) => {
          const { dis } = this.state;
          const { tradingPlacesList } = this.props.addProjectInfo;
          return (
            <Select
              style={{ width: '100%' }}
              placeholder="请选择"
              showArrow
              disabled={dis}
              value={record.tradingPlaces}
              onChange={val => this.reportSelectAction(val, record, 'tradingPlaces')}
            >
              {tradingPlacesList &&
                tradingPlacesList.map(item => (
                  <Option key={item.code} value={item.code}>
                    {item.name}
                  </Option>
                ))}
            </Select>
          );
        },
      },
      {
        key: 'otherTradingPlaces',
        dataIndex: 'otherTradingPlaces',
        title: '其他交易场所',
        render: (otherTradingPlaces, record) => {
          const { dis } = this.state;
          return (
            <Input
              placeholder="请输入"
              disabled={dis}
              onChange={e => this.reportInputAction(e, record, 'otherTradingPlaces')}
              value={otherTradingPlaces}
              maxLength={50}
            />
          );
        },
      },
      {
        key: 'declareTime',
        dataIndex: 'declareTime',
        title: '申报受理日期',
        width: 200,
        render: (declareTime, record) => {
          const { dis } = this.state;
          return (
            <DatePicker
              placeholder="请选择"
              disabled={dis}
              value={declareTime ? moment(this.deFormatDate(declareTime)) : ''}
              onChange={(date, dateString) =>
                this.reportDatePickerAction(record, dateString, 'declareTime')
              }
            />
          );
        },
      },
      {
        key: 'id',
        dataIndex: 'id',
        title: '操作',
        width: 120,
        align: 'center',
        render: (id, record) => {
          const { dis, proReportList } = this.state;
          return (
            <ButtonGroup>
              <Button
                disabled={dis}
                onClick={() => this.removeReport(record)}
                type="link"
                size="small"
              >
                删除
              </Button>
              <Button
                style={{
                  display:
                    proReportList.length - 1 === proReportList.indexOf(record)
                      ? 'inline-block'
                      : 'none',
                }}
                disabled={dis}
                onClick={() => this.addReport({})}
                type="link"
                size="small"
              >
                添加
              </Button>
            </ButtonGroup>
          );
        },
      },
    ],
    memberColumn: [
      {
        key: 'membeName',
        title: '姓名',
        dataIndex: 'membeName',
        width: 150,
        align: 'center',
        render: (membeName, record, index) => {
          const { memberNameList } = this.props.addProjectInfo;
          const { dis } = this.state;
          return (
            <Select
              style={{ width: '100%' }}
              placeholder="请选择"
              showSearch
              filterOption={this.productFilterOption}
              value={record.membeName ? record.membeName.split(',')[0] : []}
              onChange={val => this.proMembersSelectAction(val, record, 'membeName', index)}
              disabled={dis}
            >
              {memberNameList.length !== 0 &&
                memberNameList.map(item => (
                  <Option
                    key={item.id}
                    value={item.id + ',' + item.username}
                    setFieldsValue={item.id + ',' + item.username}
                  >
                    {item.username}
                  </Option>
                ))}
            </Select>
          );
        },
      },
      {
        key: 'sex',
        title: '性别',
        dataIndex: 'sex',
        width: 150,
        align: 'center',
        render: (sex, record) => {
          const { dis } = this.state;
          return (
            <Select
              style={{ width: '100%' }}
              placeholder="请选择"
              showArrow
              value={sex || []}
              disabled={dis}
              onChange={val => this.proMembersSelectAction(val, record, 'sex')}
            >
              <Option value="0">男</Option>
              <Option value="1">女</Option>
            </Select>
          );
        },
      },
      {
        key: 'idType',
        title: '证件类型',
        dataIndex: 'idType',
        width: 230,
        align: 'center',
        render: (idType, record) => {
          const { dis } = this.state;
          const { idTypeList } = this.props.addProjectInfo;
          return (
            <Select
              style={{ width: '100%' }}
              placeholder="请选择"
              showArrow
              disabled={dis}
              value={record.idType ? `${record.idType}` : []}
              onChange={val => this.proMembersSelectAction(val, record, 'idType')}
              name="idType"
            >
              {idTypeList &&
                idTypeList.map(item => (
                  <Option key={item.code} value={item.code}>
                    {item.name}
                  </Option>
                ))}
            </Select>
          );
        },
      },
      {
        key: 'idCard',
        title: '证件号码',
        dataIndex: 'idCard',
        width: 220,
        align: 'center',
        render: (idCard, record) => {
          const { dis } = this.state;
          return (
            <Input
              value={idCard}
              placeholder="请输入"
              maxLength={18}
              disabled={dis}
              onChange={e => this.proMembersInputAction(e, record, 'idCard')}
            />
          );
        },
      },
      {
        key: 'department',
        title: '部门',
        dataIndex: 'department',
        width: 200,
        align: 'center',
        render: (department, record) => {
          const { dis } = this.state;
          return (
            <Input
              value={department}
              placeholder="请输入"
              disabled={dis}
              onChange={e => this.proMembersInputAction(e, record, 'department')}
              maxLength={50}
            />
          );
        },
      },
      {
        key: 'job',
        title: '职位',
        dataIndex: 'job',
        width: 200,
        align: 'center',
        render: (job, record) => {
          const { dis } = this.state;
          return (
            <Input
              value={job}
              placeholder="请输入"
              disabled={dis}
              onChange={e => this.proMembersInputAction(e, record, 'job')}
              maxLength={50}
            />
          );
        },
      },
      {
        key: 'proRole',
        title: '项目角色',
        dataIndex: 'proRole',
        width: 220,
        align: 'center',
        render: (proRole, record) => {
          const { dis } = this.state;
          return (
            <Select
              style={{ width: '100%' }}
              placeholder="请选择"
              showArrow
              disabled={dis}
              value={proRole || []}
              onChange={val => this.proMembersSelectAction(val, record, 'proRole')}
            >
              <Option value="项目管理员">项目管理员</Option>
              <Option value="项目组成员">项目组成员</Option>
              <Option value="项目负责人">项目负责人</Option>
              <Option value="现场负责人">现场负责人</Option>
              <Option value="项目承揽人">项目承揽人</Option>
              <Option value="项目协办人">项目协办人</Option>
            </Select>
          );
        },
      },
      {
        key: 'email',
        title: '邮箱',
        dataIndex: 'email',
        width: 220,
        align: 'center',
        render: (email, record) => {
          const { dis } = this.state;
          return (
            <Input
              placeholder="请输入"
              value={email}
              disabled={dis}
              onChange={e => this.proMembersInputAction(e, record, 'email')}
              maxLength={50}
            />
          );
        },
      },
      {
        key: 'mobile',
        title: '联系电话',
        dataIndex: 'mobile',
        width: 200,
        align: 'center',
        render: (mobile, record) => {
          const { dis } = this.state;
          return (
            <Input
              placeholder="请输入"
              maxLength={14}
              value={mobile}
              disabled={dis}
              onChange={e => this.proMembersInputAction(e, record, 'mobile')}
            />
          );
        },
      },
      {
        key: 'remark',
        title: '备注',
        dataIndex: 'remark',
        width: 320,
        align: 'center',
        render: (remark, record) => {
          const { dis } = this.state;
          return (
            <TextArea
              rows={4}
              allowClear
              disabled={dis}
              value={remark}
              autoSize={{ minRows: 4, maxRows: 4 }}
              maxLength={100}
              onChange={e => this.proMembersInputAction(e, record, 'remark')}
            />
          );
        },
      },
      {
        key: 'id',
        dataIndex: 'id',
        title: '操作',
        width: 140,
        align: 'center',
        fixed: 'right',
        render: (id, record) => {
          const { dis, proMembers } = this.state;
          return (
            <>
              <Button
                disabled={dis}
                onClick={() => this.removeProMembers(record)}
                type="link"
                size="small"
              >
                删除
              </Button>
              <Button
                disabled={dis}
                style={{
                  display:
                    proMembers.length - 1 === proMembers.indexOf(record) ? 'inline-block' : 'none',
                }}
                onClick={this.addproMembers}
                type="link"
                size="small"
              >
                添加
              </Button>
            </>
          );
        },
      },
    ],
  };

  componentDidMount() {
    if (document.getElementsByClassName('ant-layout')[2]) {
      document.getElementsByClassName('ant-layout')[2].scrollTop = 0;
    }

    window.parent.postMessage(
      {
        code: '200',
        type: 'onReady',
        data: {
          iframItemKey: 'businessData',
        },
      },
      '*',
    );
    window.onmessage = this.messageHandle;
    this.getPageData();
  }

  componentWillUnmount() {
    window.onmessage = null;
  }

  messageHandle = event => {
    console.log('addProjectSeries event::', event);
    const eventData = event.data;

    if (eventData.code === '200' && eventData.type === 'dataDispatched') {
      if (
        eventData.data.formData &&
        eventData.data.formData.businessData &&
        JSON.stringify(eventData.data.formData.businessData) !== '{}'
      ) {
        this.setState({
          isIframe: true,
          dis: true,
        });
        this.handleDetailInfo(eventData.data.formData.businessData);
      }
    }
  };

  // 获取页面数据
  getPageData = () => {
    const { proCode, taskId, update, dis } = this.props.location.query;
    if (update) this.setState({ update: 1 });
    if (proCode) this.setState({ code: proCode });
    if (dis) this.setState({ dis: true });
    if (taskId) {
      request(`/api/billow-diplomatic/todo-task/processInfo?taskId=${taskId}`).then(res => {
        if (res?.status === 200) {
          const {
            taskComments,
            processInstanceId,
            formData: { businessData },
          } = res.data;
          this.setState({
            dis: businessData.processType === 'series_terminate',
            processType: businessData.processType,
            processInstanceId,
          });
          if (taskComments)
            this.setState({
              taskComments,
            });
          this.handleDetailInfo(businessData);
        } else {
          message.warn(res.message);
        }
      });
    } else if (proCode) {
      this.props
        .dispatch({
          type: 'addProjectInfo/getPageInfo',
          payload: {
            proCode,
          },
        })
        .then(res => {
          if (res && res.status === 200) {
            this.handleDetailInfo(res.data);
          } else {
            message.error(res.message);
          }
        });
    } else {
      //获取生成系列编码
      this.props
        .dispatch({
          type: 'addProjectInfo/getProCode',
          payload: {
            proType: '3005',
          },
        })
        .then(res => {
          if (res && res.status === 200) this.setState({ proCode: res.data });
        });
    }
    this.getDropLists();
  };

  // 处理详情接口信息
  handleDetailInfo = data => {
    const {
      proCode,
      customerType,
      idType,
      proArea,
      publicSector,
      proMembers,
      proReportList,
    } = data;
    const pageInfo = { ...data };

    if (pageInfo.customerList) {
      pageInfo.customerList = pageInfo.customerList.map((item, index) => ({
        ...item,
        expands: true,
        id: `${index}`,
      }));
    }

    this.setState({
      proCode,
      pageInfo,
      proMembers: proMembers ? proMembers : [],
      proReportList: proReportList ? proReportList : [],
      customerType,
      proArea,
      publicSector,
      idType,
    });
  };

  // 项目成员信息输入框输入事件
  proMembersInputAction = (e, record, name) => {
    const newProMembers = this.state.proMembers.filter(item => {
      if (record === item) {
        item[name] = e.target.value;
      }
      return true;
    });
    this.setState({
      proMembers: newProMembers,
    });
  };

  //项目成员信息下拉框选值事件
  proMembersSelectAction = (val, record, name, index) => {
    const newProMembers = this.state.proMembers.filter(item => {
      if (record === item) {
        if (name === 'membeName') {
          item.membeName = val.split(',')[1];
          item.membeCode = val.split(',')[0];
        } else {
          item[name] = val;
        }
      }
      return true;
    });

    this.setState(
      {
        proMembers: newProMembers,
      },
      () => {
        if (name === 'membeName') {
          this.memberPartFillBack(val, index);
        }
      },
    );
  };

  // 项目成员信息  table表格中  根据姓名进行数据回填
  memberPartFillBack = (val, index) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'addProjectInfo/getMemberInfoReq',
      payload: {
        userId: val.split(',')[0],
      },
      callback: res => {
        const { proMembers } = this.state;
        const {
          department = '',
          email = '',
          idCard = '',
          idType = '',
          job = '',
          mobile = '',
          proRole = '',
          remark = '',
          sex = '',
        } = res.data ? res.data : {};
        proMembers[index] = {
          membeCode: val.split(',')[0],
          membeName: val.split(',')[1],
          department: `${department}`,
          email: `${email}`,
          idCard: `${idCard}`,
          idType: `${idType}`,
          job: `${job}`,
          mobile: `${mobile}`,
          proRole: `${proRole}`,
          remark: `${remark}`,
          sex: `${sex}`,
        };

        this.setState({
          proMembers,
        });
      },
    });
  };

  //项目成员信息添加事件
  addproMembers = values => {
    const { proMembers } = this.state;
    const newProMembers = [
      ...proMembers,
      {
        membeName: values.membeName ? values.membeName.split(',')[1] + '' : '', // 姓名
        membeCode: values.membeName ? values.membeName.split(',')[0] + '' : '', // 姓名code
        sex: values.sex || '', // 性别
        idType: values.idType || '', // 证件类型
        idCard: values.idCard || '', // 证件号码
        department: values.department || '', // 部门
        job: values.job || '', // 职位
        proRole: values.proRole || '', // 项目角色
        email: values.email || '', // 邮箱
        mobile: values.mobile || '', // 联系电话
        remark: values.remark || '', // 备注
      },
    ];
    this.setState({
      proMembers: newProMembers,
    });
  };

  //项目成员信息删除事件
  removeProMembers = record => {
    const newProMembers = this.state.proMembers.filter(item => {
      return item !== record;
    });
    this.setState({
      proMembers: newProMembers,
    });
  };

  // 申报信息下拉框选值事件
  reportSelectAction = (val, record, name) => {
    const newProReportList = this.state.proReportList.filter(item => {
      if (record === item) {
        item[name] = val;
      }
      return true;
    });

    this.setState({
      proReportList: newProReportList,
    });
  };

  //申报信息日期选值事件
  reportDatePickerAction = (record, dataString, name) => {
    const newProReportList = this.state.proReportList.filter(item => {
      if (record === item) {
        if (dataString) {
          item[name] = `${dataString} 00:00:00`;
        } else {
          item[name] = '';
        }
      }
      return true;
    });

    this.setState({
      proReportList: newProReportList,
    });
  };

  // 申报信息输入框输入事件
  reportInputAction = (e, record, name) => {
    const newProReportList = this.state.proReportList.filter(item => {
      if (record === item) {
        item[name] = e.target.value;
      }
      return true;
    });
    this.setState({
      proReportList: newProReportList,
    });
  };

  // 申报添加事件
  addReport = values => {
    const { proReportList } = this.state;
    const newProReportList = [
      ...proReportList,
      {
        tradingPlaces: values.tradingPlaces || '',
        otherTradingPlaces: values.otherTradingPlaces || '',
        declareTime: values.declareTime || '',
      },
    ];
    this.setState({
      proReportList: newProReportList,
    });
  };

  // 申报删除事件
  removeReport = record => {
    const newProReportList = this.state.proReportList.filter(item => {
      return item !== record;
    });
    this.setState({
      proReportList: newProReportList,
    });
  };

  // 获取下拉数据
  getDropLists() {
    const { dispatch } = this.props;
    //项目类型下拉框数据获取
    dispatch({
      type: 'addProjectInfo/getProTypeList',
      payload: {
        fcode: 'awp_pro_type',
      },
    });
    //所属行业下拉框数据获取
    dispatch({
      type: 'addProjectInfo/getProTypeList',
      payload: {
        fcode: 'awp_pro_trade',
      },
    });
    // 项目区域下拉框数据获取
    dispatch({
      type: 'addProjectInfo/getProTypeList',
      payload: {
        fcode: 'awp_pro_loca',
      },
    });
    // 上市板块下拉框数据获取
    dispatch({
      type: 'addProjectInfo/getProTypeList',
      payload: {
        fcode: 'awp_list_plate',
      },
    });
    // 证件类型下拉框数据获取
    dispatch({
      type: 'addProjectInfo/getProTypeList',
      payload: {
        fcode: 'awp_id_type',
      },
    });
    // 交易场所下拉框数据获取
    dispatch({
      type: 'addProjectInfo/getProTypeList',
      payload: {
        fcode: 'awp_trad_place',
      },
    });
    // 币种下拉框数据获取
    dispatch({
      type: 'addProjectInfo/getProTypeList',
      payload: {
        fcode: 'C001',
      },
    });
    // 成员姓名下拉框数据获取
    dispatch({
      type: 'addProjectInfo/getMemberNameList',
    });
  }

  // 取消 操作
  handleBack = () => {
    if (this.props.location.query.comeFrom) {
      router.go(-1);
    } else {
      this.props.dispatch(
        routerRedux.push({
          pathname: '/projectManagement/projectAndSeriesQuery',
          query: {
            radioType: this.props.router.location.query.radioType,
          },
        }),
      );
    }
  };

  // 保存/提交 操作
  handleSubmit = actionType => {
    const { dispatch, form } = this.props;
    const { code, proMembers, proReportList, processType, processInstanceId } = this.state;

    form.validateFields((err, values) => {
      if (!err) {
        const formatDate = date => (date ? moment(date).format('YYYY-MM-DD HH:mm:ss') : '');
        const formValues = customerListParams(values);
        formValues.terminationDate = formatDate(formValues.terminationDate);

        if (formValues.registeredCapital) {
          formValues.registeredCapital = `${formValues.registeredCapital}`;
        }

        if (proMembers.length <= 0) return message.warn('必须在项目成员中添加一个项目负责人');
        let hasfzr = false;
        let hascy = 0;
        let membeCounts = [];
        let hasRepeat = false;
        proMembers.forEach(item => {
          if (item.membeCode) {
            if (membeCounts.indexOf(item.membeCode + '') !== -1) {
              hasRepeat = true;
            } else {
              membeCounts.push(item.membeCode + '');
            }
          }
          if (item.proRole === '项目负责人') hasfzr = true;
          if (item.proRole === '项目组成员') hascy++;
        });

        if (hasRepeat) return message.warn('项目成员中有重复人员，请重新选择');
        if (!hasfzr) return message.warn('必须在项目成员中添加一个项目负责人');
        if (hascy < 2) return message.warn('必须在项目成员中添加两个项目成员');

        for (let i = 0; i < proMembers.length; i++) {
          if (proMembers[i].membeName === '') return message.warn('项目成员中有姓名未填写');
          if (proMembers[i].sex === '') return message.warn('项目成员中有性别未填写');
          const { idType } = proMembers[i];
          if (idType === '') return message.warn('项目成员中有证件类型未填写');
          const { idCard } = proMembers[i];
          if (idCard === '') {
            return message.warn('项目成员中有证件号码未填写');
          }
          if (idType == '1001') {
            if (!idCardReg.test(idCard)) return message.warn('项目成员信息中身份证号格式不正确!');
          } else if (idType == '1002') {
            if (!(PASSPORT1.test(idCard) || PASSPORT2.test(idCard)))
              return message.warn('项目成员信息中护照号码格式不正确!');
          } else if (idType == '1003') {
            if (!HKMAKAO.test(idCard))
              return message.warn('项目成员信息中港澳居民通行证号码格式不正确!');
          } else if (idType == '1004') {
            if (!(TAIWAN1.test(idCard) || TAIWAN2.test(idCard)))
              return message.warn('项目成员信息中台湾来往通行证号码格式不正确!');
          }

          if (proMembers[i].department === '') {
            return message.warn('项目成员中有部门未填写');
          }
          if (proMembers[i].job === '') {
            return message.warn('项目成员中有职位未填写');
          }
          if (proMembers[i].proRole === '') {
            return message.warn('项目成员中有项目角色未填写');
          }
          if (proMembers[i].email === '') {
            return message.warn('项目成员中有邮箱未填写');
          }
          if (!emailReg.test(proMembers[i].email)) {
            return message.warn('项目成员信息中邮箱格式错误');
          }
          if (proMembers[i].mobile === '') {
            return message.warn('项目成员中有联系电话未填写');
          }
          if (
            !(
              phoneReg.test(proMembers[i].mobile) ||
              numReg.test(proMembers[i].mobile) ||
              phoneReg2.test(proMembers[i].mobile)
            )
          ) {
            return message.warn('项目成员信息中联系电话格式校验错误!');
          }
        }

        for (let i = 0; i < proReportList.length; i++) {
          const item = proReportList[i];
          if (!item.tradingPlaces) return message.warn('项目申报信息有交易场所未填写');
          if (item.tradingPlaces === '2007' && !item.otherTradingPlaces)
            return message.warn('项目申报信息中交易场所为其他时其他交易场所为必填项');
          if (!item.declareTime) return message.warn('项目申报信息有申报受理日期未填写');
        }

        let myPayload = { type: 0, ...formValues, proMembers };

        if (actionType === 'save') {
          dispatch({
            type: code ? 'addProjectInfo/updateProductInfo' : 'addProjectInfo/savaData',
            payload: code
              ? { ...myPayload, proReportList, processType, processInstanceId }
              : myPayload,
          }).then(res => {
            if (res && res.status === 200) {
              message.success(code ? '修改成功!' : '保存成功!');
              router.push('/projectManagement/seriesManage');
            } else {
              message.error(res.message);
            }
          });
        } else if (actionType === 'resave') {
          this.setState({
            isReSaving: true,
          });
          dispatch({
            type: 'addProjectInfo/resave',
            payload: { ...myPayload, proReportList, isNew: 1 },
          }).then(res => {
            this.setState({
              isReSaving: false,
            });
            if (res && res.status === 200) {
              message.success('保存成功!');
              router.push('/projectManagement/informationManagement');
            } else {
              message.error(res.message);
            }
          });
        } else if (actionType === 'recommit') {
          this.setState({
            isReCommiting: true,
          });
          dispatch({
            type: 'addProjectInfo/recommit',
            payload: { ...myPayload, proReportList, isNew: 1 },
          }).then(res => {
            this.setState({
              isReCommiting: false,
            });
            if (res && res.status === 200) {
              message.success('提交成功!');
              router.push('/projectManagement/informationManagement');
            } else {
              message.error(res.message);
            }
          });
        } else if (actionType === 'submit') {
          this.setState({
            isSubmiting: true,
          });
          dispatch({
            type: 'addProjectInfo/commitData',
            payload: code
              ? { ...myPayload, proReportList, isNew: 0, processType, processInstanceId }
              : { ...myPayload, isNew: 1 },
          }).then(res => {
            this.setState({
              isSubmiting: false,
            });
            if (res && res.status === 200) {
              message.success('提交成功!');
              router.push('/projectManagement/seriesManage');
            } else {
              message.error(res.message);
            }
          });
        }
      }
    });
  };
  /**
   * 项目类型选值获取项目编码事件
   * @param {} val
   */
  selectProType = val => {
    this.props
      .dispatch({
        type: 'addProjectInfo/getProCode',
        payload: {
          proType: val,
        },
      })
      .then(res => {
        if (res && res.status === 200) this.setState({ proCode: res.data });
      });
  };

  // 下拉框支持模糊匹配
  productFilterOption = (input, option) => {
    const label = option.props.children.toLowerCase();
    const value = option.props.value.toLowerCase();
    const ipt = input.toLowerCase();
    return label.includes(ipt) || value.includes(ipt);
  };

  /**
   * 格式化日期
   * @param {时间} date 'YYYY-MMM-DD'
   */
  deFormatDate(date) {
    return date ? moment(date).format('YYYY-MM-DD') : '';
  }
  /**
   * 日期选择框
   * @param {*} date
   * @param {*} dateString
   * @param {*} name
   */
  dataPick = (date, dateString, name) => {
    this.setState(
      {
        [name]: dateString,
      },
      () => {
        const { setUpTime, publicTime } = this.state;
        if ((name === 'setUpTime' && publicTime) || (name === 'publicTime' && setUpTime)) {
          if (moment(setUpTime) > moment(publicTime)) {
            this.setState({
              [name]: '',
            });
            this.props.form.setFieldsValue({ [name]: '' });
            message.warning('上市时间需大于成立时间');
          }
        }
      },
    );
  };
  /**
   * 格式金额
   * @param {} num
   */
  moneyFormat(num) {
    if (!num) return;
    let dotIndex = num.split('.');
    let arr = [];
    dotIndex[0]
      .split('')
      .reverse()
      .forEach((item, index) => {
        if (index % 3 == 0) {
          arr.push(',');
        }
        arr.push(item);
      });
    let returnV = arr
      .splice(1)
      .reverse()
      .join('');

    let decimal = '';
    if (num.indexOf('.') != -1) {
      decimal = '.' + dotIndex[1].substr(0, 6);
      if (decimal.length > 6) {
        while (decimal.charAt(decimal.length - 1) === '0') {
          decimal = decimal.substr(0, decimal.length - 1);
        }
      }
      let count = returnV + decimal;

      returnV = returnV + decimal;
    }
    if (returnV.length > 1) {
      while (returnV.charAt(0) === '0') {
        if (returnV.charAt(1) !== '.') {
          returnV = returnV.substr(1, returnV.length - 1);
        } else {
          break;
        }
      }
    }
    return returnV;
  }

  render() {
    const {
      addProjectInfo: {
        proTypeList,
        proTradeList,
        proLocaList,
        proPlateList,
        idTypeList,
        tradingPlacesList,
        capitalCurrencyList,
        memberNameList,
      },
      saveLoading,
      updateLoading,
    } = this.props;
    const { getFieldDecorator } = this.props.form;
    const {
      proCode,
      proType,
      proArea,
      customerType,
      idType,
      pageInfo,
      code,
      publicSector,
      dis,
      columns,
      proMembers,
      proReportList,
      isReSaving,
      isReCommiting,
      isSubmiting,
      taskComments,
      taskCommentsColumn,
      isIframe,
      update,
      reportInfoColumns,
      memberColumn,
      processType,
    } = this.state;

    return (
      <Card
        className={styles.addprojectsries}
        title={
          isIframe ? (
            ''
          ) : (
            <Breadcrumb>
              <Breadcrumb.Item>
                {update
                  ? '项目/系列信息'
                  : this.props.location.query.comeFrom
                  ? '项目系列管理'
                  : '项目/系列信息查询'}
              </Breadcrumb.Item>
              <Breadcrumb.Item>
                {update
                  ? '系列信息变更'
                  : dis
                  ? '系列信息详情'
                  : code
                  ? '修改系列信息'
                  : '新建系列信息'}
              </Breadcrumb.Item>
            </Breadcrumb>
          )
        }
        extra={
          isIframe ? (
            ''
          ) : (
            <>
              {dis === false || processType === 'series_terminate' ? (
                <>
                  <Button
                    type="primary"
                    style={{ display: update ? 'none' : 'inline-block' }}
                    onClick={() => this.handleSubmit('save')}
                    loading={code ? updateLoading : saveLoading}
                  >
                    保存
                  </Button>
                  <Action code="seriesManage:resave">
                    <Button
                      type="primary"
                      style={{ display: update ? 'inline-block' : 'none' }}
                      className={styles.save}
                      onClick={() => this.handleSubmit('resave')}
                      loading={isReSaving}
                    >
                      保存
                    </Button>
                  </Action>
                  <Action code="seriesManage:recommit">
                    <Button
                      type="primary"
                      style={{ display: update ? 'inline-block' : 'none', marginLeft: '10px' }}
                      className={styles.save}
                      onClick={() => this.handleSubmit('recommit')}
                      loading={isReCommiting}
                    >
                      提交
                    </Button>
                  </Action>
                  <Action code="seriesManage:commit">
                    <Button
                      style={{
                        display: update === 0 ? 'inline-block' : 'none',
                        marginLeft: '10px',
                      }}
                      type="primary"
                      className={styles.save}
                      onClick={() => this.handleSubmit('submit')}
                      loading={isSubmiting}
                    >
                      提交
                    </Button>
                  </Action>
                </>
              ) : (
                ''
              )}
              <Button style={{ marginLeft: '10px' }} onClick={this.handleBack}>
                取消
              </Button>
            </>
          )
        }
      >
        <div
          style={{
            height: isIframe ? 'auto' : 'calc(100vh - 220px)',
            overflowY: 'auto',
          }}
        >
          <Form {...layout}>
            <div
              style={{
                display:
                  processType === 'series_terminate' || pageInfo.terminationDate ? 'block' : 'none',
              }}
            >
              <div style={{ padding: '5px 0 10px', color: '#333', fontSize: '16px' }}>终止原因</div>
              <Row>
                <Col>
                  <Form.Item label="终止原因:" labelCol={{ span: 3 }} wrapperCol={{ span: 21 }}>
                    {getFieldDecorator('terminationReason', {
                      initialValue: pageInfo.terminationReason,
                      rules: [
                        {
                          required: processType === 'series_terminate',
                          message: '终止原因是必填项',
                        },
                      ],
                    })(
                      <TextArea
                        rows={4}
                        allowClear
                        autosize={{ minRows: 3, maxRows: 6 }}
                        maxLength={500}
                        disabled={processType !== 'series_terminate'}
                      />,
                    )}
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="终止日期">
                    {getFieldDecorator('terminationDate', {
                      initialValue: pageInfo.terminationDate
                        ? moment(this.deFormatDate(pageInfo.terminationDate))
                        : '',
                      rules: [
                        {
                          required: processType === 'series_terminate',
                          message: '终止日期是必填项',
                        },
                      ],
                    })(
                      <DatePicker
                        placeholder="请选择"
                        disabled={processType !== 'series_terminate'}
                      />,
                    )}
                  </Form.Item>
                </Col>
              </Row>
            </div>
            <div
              style={{
                display: JSON.stringify(taskComments) !== '[]' && !dis ? 'block' : 'none',
                color: '#333',
                fontSize: '16px',
              }}
            >
              审批办理意见
            </div>
            <Table
              style={{
                display: JSON.stringify(taskComments) !== '[]' && !dis ? 'block' : 'none',
                margin: '15px 0 30px',
              }}
              columns={taskCommentsColumn}
              dataSource={taskComments}
              bordered
              pagination={false}
            />
            <span
              style={{
                display: 'block',
                paddingBottom: 20,
                color: '#333',
                fontSize: '16px',
              }}
            >
              系列信息
            </span>
            <Row>
              <Col span={8}>
                <Form.Item label="系列编号:">
                  {getFieldDecorator('proCode', {
                    initialValue: dis ? pageInfo.proCode : proCode,
                    rules: [{ required: true, message: '系列编号是必填项' }],
                  })(<Input placeholder="请选择项目类型生成系列编号" disabled />)}
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="系列名称:">
                  {getFieldDecorator('proName', {
                    initialValue: pageInfo.proName,
                    rules: [{ required: true, message: '系列名称是必填项' }],
                  })(<Input placeholder="请输入" disabled={dis} maxLength={100} />)}
                </Form.Item>
              </Col>
            </Row>
            <div style={{ marginTop: 15, padding: '20px 0 10px', color: '#333', fontSize: '16px' }}>
              项目信息
            </div>
            <Row>
              <Col span={8}>
                <Form.Item label="项目类型:">
                  {getFieldDecorator('proType', {
                    initialValue: code ? pageInfo.proType : '3005',
                    rules: [{ required: true, message: '项目类型是必填项' }],
                  })(
                    <Select
                      placeholder="请选择"
                      showArrow
                      // onChange={this.selectProType}
                      // disabled={code ? true : dis}
                      disabled
                    >
                      {proTypeList &&
                        proTypeList.map(item => (
                          <Option key={item.code} value={item.code}>
                            {item.name}
                          </Option>
                        ))}
                    </Select>,
                  )}
                </Form.Item>
              </Col>
              <Col span={8} style={{ display: proType === '3007' ? 'inline-block' : 'none' }}>
                <Form.Item label="其他项目类型:">
                  {getFieldDecorator('otherProType', {
                    initialValue: pageInfo.otherProType,
                    rules: [
                      {
                        required: proType === '3007',
                        message: '其他项目类型是必填项',
                      },
                    ],
                  })(<Input placeholder="请输入" disabled={dis} maxLength={50} />)}
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="项目区域:">
                  {getFieldDecorator('proArea', {
                    initialValue: pageInfo.proArea,
                    rules: [{ required: true, message: '项目区域是必填项' }],
                  })(
                    <Select
                      placeholder="请选择"
                      showSearch
                      allowClear
                      filterOption={this.productFilterOption}
                      onChange={val => this.setState({ proArea: val })}
                      disabled={dis}
                    >
                      {proLocaList &&
                        proLocaList.map(item => (
                          <Option key={item.code} value={item.code}>
                            {item.name}
                          </Option>
                        ))}
                    </Select>,
                  )}
                </Form.Item>
              </Col>
              <Col
                span={8}
                style={{
                  display: proArea === '900000' ? 'inline-block' : 'none',
                }}
              >
                <Form.Item label="境外区域名称:">
                  {getFieldDecorator('overseasProArea', {
                    initialValue: pageInfo.overseasProArea,
                    rules: [
                      {
                        required: proArea === '900000',
                        message: '境外区域名称是必填项',
                      },
                    ],
                  })(<Input placeholder="请输入" disabled={dis} maxLength={50} />)}
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="所属部门:">
                  {getFieldDecorator('proDept', {
                    initialValue: pageInfo.proDept,
                    rules: [{ required: true, message: '所属部门是必填项' }],
                  })(<Input placeholder="请输入" disabled={dis} maxLength={10} />)}
                </Form.Item>
              </Col>
            </Row>
            {/* 客户信息：可增加多个 */}
            <CustomerInfoChildrenForm
              form={this.props.form}
              data={{
                idTypeList,
                proTradeList,
                proPlateList,
                moneyFormat: this.moneyFormat,
                capitalCurrencyList,
                pageInfo,
                dis,
              }}
            />
          </Form>
          <div>
            <span
              style={{ marginTop: 15, padding: '20px 0 10px', color: '#333', fontSize: '16px' }}
            >
              项目成员信息
            </span>
            {dis ? (
              ''
            ) : (
              <ProMemberModal
                onConfirm={this.addproMembers}
                data={{
                  productFilterOption: this.productFilterOption,
                  idTypeList,
                  memberNameList,
                  proMembers,
                }}
              />
            )}
          </div>
          <Table
            style={{ marginBottom: 15 }}
            columns={memberColumn}
            scroll={{ x: 1300 }}
            dataSource={proMembers}
            bordered
            pagination={false}
          />
          <div
            style={{
              display:
                pageInfo.proReportList && JSON.stringify(pageInfo.proReportList) !== '[]' && code
                  ? 'block'
                  : 'none',
            }}
            // className={styles.sonTableTitle}
          >
            <span
              style={{ marginTop: 15, padding: '20px 0 10px', color: '#333', fontSize: '16px' }}
            >
              申报信息
            </span>
            {dis ? (
              ''
            ) : (
              <ReportModal
                onConfirm={this.addReport}
                data={{
                  productFilterOption: this.productFilterOption,
                  tradingPlacesList,
                }}
              />
            )}
          </div>
          <Table
            style={{
              display:
                pageInfo.proReportList && JSON.stringify(pageInfo.proReportList) !== '[]' && code
                  ? 'block'
                  : 'none',
            }}
            columns={reportInfoColumns}
            dataSource={proReportList}
            bordered
            pagination={false}
          />
          <div
            style={{
              display:
                pageInfo.productsList && pageInfo.productsList.length !== 0 ? 'block' : 'none',
            }}
          >
            <div style={{ marginTop: 15, padding: '20px 0 10px', color: '#333', fontSize: '16px' }}>
              项目信息
            </div>
            <Table
              columns={columns}
              scroll={{ x: 1300 }}
              dataSource={pageInfo.productsList}
              bordered
              pagination={false}
            />
          </div>
        </div>
      </Card>
    );
  }
}

const WrappedSingleForm = errorBoundary(
  linkHoc()(
    Form.create()(
      connect(({ addProjectSeries, addProjectInfo, loading, router }) => ({
        addProjectSeries,
        addProjectInfo,
        saveLoading: loading.effects['addProjectInfo/savaData'],
        updateLoading: loading.effects['addProjectInfo/updateProductInfo'],
        router,
      }))(AddProjectSeries),
    ),
  ),
);
export default WrappedSingleForm;
