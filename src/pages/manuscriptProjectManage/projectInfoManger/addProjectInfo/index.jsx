/**
 *  新建项目与修改项目信息
 */
import React, { Component } from 'react';
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
  Breadcrumb,
  Tooltip,
} from 'antd';
import moment from 'moment';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import router from 'umi/router';
import { errorBoundary } from '@/layouts/ErrorBoundary';
import Action, { linkHoc } from '@/utils/hocUtil';
import styles from './index.less';
import ModalForm from './ModalForm';
import ProMemberModal from './proMemberModal';
import PublishModal from './PublishModal';
import ReportModal from './ReportModal';
import request from '@/utils/request';
import CustomerInfoChildrenForm from '../../components/CustomerInfoChildrenForm';
import { customerListParams } from '../../components/customerInfoSubmitParams';

const { TextArea } = Input;
const { Option } = Select;
const ButtonGroup = Button.Group;

const phoneReg = /^(13[0-9]|14[5|7]|15[0|1|2|3|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/; // 手机号码校验规则
const numReg = /^\d{3,4}-?\d{7,8}$/; // 电话号码校验规则
const phoneReg2 = /^\+86(13[0-9]|14[5|7]|15[0|1|2|3|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/; // 手机号码校验规则
const idCardReg = /(^[1-9]\d{5}(18|19|2[0-3])\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)/; // 18位身份证号校验规则
const PASSPORT1 = /^[a-zA-Z]{5,17}$/; // 护照验证规则
const PASSPORT2 = /^[a-zA-Z0-9]{5,17}$/; // 护照验证规则
const HKMAKAO = /^[HMhm]{1}([0-9]{10}|[0-9]{8})$/; // 港澳通行证
const TAIWAN1 = /^[0-9]{8}$/; // 台湾来往大陆通行证
const TAIWAN2 = /^[0-9]{10}$/; // 台湾来往大陆通行证
const emailReg = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
const layout = {
  labelAlign: 'right',
  labelCol: { span: 9 },
  wrapperCol: { span: 15 },
};

@Form.create()
class AddProjectInfo extends Component {
  state = {
    pageInfo: {},
    proParticipants: [],
    proMembers: [],
    proReportList: [], //项目申报信息列表数据
    proPublishInfoList: [], //项目发行信息列表数据
    proParticipantList: [], // 参与人类型
    customerType: '1', // 客户类型
    idType: '', // 证件类型
    proArea: '', // 项目区域
    proBusType: '1', // 项目分类
    publicSector: '', // 上市板块
    code: '', // 由上一页面传入的项目编码
    localProParticipantList: [], //全量参与人类型数据
    newProParticipantList: [], //部分参与人类型数据
    tradingPlaces: '', //交易场所
    setUpTime: '', //成立时间
    publicTime: '', //上市时间
    taskComments: [],
    update: 0,
    processType: '',
    dis: false,
    processInstanceId: '',
    reportInfoColumns: [
      {
        key: 'tradingPlaces',
        dataIndex: 'tradingPlaces',
        title: '交易场所',
        render: (tradingPlaces, record) => {
          const { tradingPlacesList } = this.props.addProjectInfo;
          return (
            <Select
              style={{ width: '100%' }}
              placeholder="请选择"
              showArrow
              value={record.tradingPlaces}
              onChange={val => this.reportSelectAction(val, record, 'tradingPlaces')}
              disabled={this.state.dis}
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
        render: (otherTradingPlaces, record) => (
          <Input
            placeholder="请输入"
            onChange={e => this.reportInputAction(e, record, 'otherTradingPlaces')}
            value={otherTradingPlaces}
            maxLength={50}
            disabled={this.state.dis}
          />
        ),
      },
      {
        key: 'declareTime',
        dataIndex: 'declareTime',
        title: '申报受理日期',
        width: 200,
        render: (declareTime, record) => (
          <DatePicker
            placeholder="请选择"
            value={declareTime ? moment(this.deFormatDate(declareTime)) : null}
            disabled={this.state.dis}
            onChange={(date, dateString) =>
              this.reportDatePickerAction(record, dateString, 'declareTime')
            }
          />
        ),
      },
      {
        key: 'id',
        dataIndex: 'id',
        title: '操作',
        width: 120,
        align: 'center',
        render: (id, record) => {
          const { proReportList } = this.state;
          return (
            <ButtonGroup>
              <Button
                onClick={() => this.removeReport(record)}
                disabled={this.state.dis}
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
                onClick={() => this.addReport({})}
                type="link"
                size="small"
                disabled={this.state.dis}
              >
                添加
              </Button>
            </ButtonGroup>
          );
        },
      },
    ],
    publishInfoColumns: [
      {
        key: 'stockCode',
        dataIndex: 'stockCode',
        title: '证券代码',
        render: (stockCode, record) => (
          <Input
            disabled={this.state.dis}
            placeholder="请输入"
            onChange={e => this.publishInputAction(e, record, 'stockCode')}
            value={stockCode}
            maxLength={20}
          />
        ),
      },
      {
        key: 'stockShortName',
        dataIndex: 'stockShortName',
        title: '证券简称',
        render: (stockShortName, record) => (
          <Input
            disabled={this.state.dis}
            placeholder="请输入"
            onChange={e => this.publishInputAction(e, record, 'stockShortName')}
            value={stockShortName}
            maxLength={25}
          />
        ),
      },
      {
        key: 'issueTime',
        dataIndex: 'issueTime',
        title: '挂牌日期',
        width: 200,
        render: (issueTime, record) => (
          <DatePicker
            disabled={this.state.dis}
            placeholder="请选择"
            value={issueTime ? moment(this.deFormatDate(issueTime)) : null}
            onChange={(date, dateString) =>
              this.publishDatePickerAction(record, dateString, 'issueTime')
            }
          />
        ),
      },
      {
        key: 'id',
        dataIndex: 'id',
        title: '操作',
        width: 120,
        align: 'center',
        render: (id, record) => {
          const { proPublishInfoList } = this.state;
          return (
            <ButtonGroup>
              <Button
                disabled={this.state.dis}
                onClick={() => this.removePublish(record)}
                type="link"
                size="small"
              >
                删除
              </Button>
              <Button
                disabled={this.state.dis}
                style={{
                  display:
                    proPublishInfoList.length - 1 === proPublishInfoList.indexOf(record)
                      ? 'inline-block'
                      : 'none',
                }}
                onClick={() => this.addPublish({})}
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
    columns: [
      {
        key: 'proRole',
        title: '参与人类型',
        dataIndex: 'proRole',
        width: 200,
        align: 'center',
        render: (proRole, record) => {
          const { newProParticipantList } = this.state;
          return (
            <Select
              disabled={this.state.dis}
              style={{ width: '100%' }}
              placeholder="请选择"
              showSearch
              filterOption={this.productFilterOption}
              value={record.proRole ? record.proRole : []}
              onChange={val => this.selectProRole(val, record)}
            >
              {newProParticipantList.length !== 0 &&
                newProParticipantList.map(item => (
                  <Option key={item.code} setFieldsValue={item.code}>
                    {item.name}
                  </Option>
                ))}
            </Select>
          );
        },
      },
      {
        key: 'membeName',
        title: '参与人名称',
        dataIndex: 'membeName',
        width: 200,
        align: 'center',
        render: (membeName, record) => {
          return (
            <Input
              disabled={this.state.dis}
              placeholder="请输入"
              onChange={e => this.inputMemberName(e, record)}
              value={membeName}
              maxLength={25}
            />
          );
        },
      },
      {
        key: 'id',
        dataIndex: 'id',
        title: '操作',
        width: 280,
        align: 'center',
        render: (id, record) => {
          const { proParticipants } = this.state;
          return (
            <ButtonGroup>
              <Button
                disabled={this.state.dis}
                onClick={() => this.removeProjectMember(record)}
                type="link"
                size="small"
              >
                删除
              </Button>
              <Button
                disabled={this.state.dis}
                style={{
                  display:
                    proParticipants.length - 1 === proParticipants.indexOf(record)
                      ? 'inline-block'
                      : 'none',
                }}
                onClick={() => this.addProjectMember()}
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
          return (
            <Select
              disabled={this.state.dis}
              style={{ width: '100%' }}
              placeholder="请选择"
              showSearch
              filterOption={this.productFilterOption}
              value={record.membeName ? record.membeName + '' : []}
              onChange={val => this.proMembersSelectAction(val, record, 'membeName', index)}
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
          return (
            <Select
              disabled
              style={{ width: '100%' }}
              placeholder="请选择"
              showArrow
              value={sex || []}
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
          const { idTypeList } = this.props.addProjectInfo;
          return (
            <Select
              disabled={this.state.dis}
              style={{ width: '100%' }}
              placeholder="请选择"
              showArrow
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
          return (
            <Input
              disabled={this.state.dis}
              value={idCard}
              placeholder="请输入"
              maxLength={18}
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
          return (
            <Input
              value={department}
              placeholder="请输入"
              onChange={e => this.proMembersInputAction(e, record, 'department')}
              disabled
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
          return (
            <Input
              disabled={this.state.dis}
              value={job}
              placeholder="请输入"
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
          return (
            <Select
              disabled={this.state.dis}
              style={{ width: '100%' }}
              placeholder="请选择"
              showArrow
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
          return (
            <Input
              placeholder="请输入"
              value={email}
              onChange={e => this.proMembersInputAction(e, record, 'email')}
              disabled
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
          return (
            <Input
              placeholder="请输入"
              maxLength={14}
              value={mobile}
              onChange={e => this.proMembersInputAction(e, record, 'mobile')}
              disabled
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
          return (
            <TextArea
              disabled={this.state.dis}
              rows={4}
              allowClear
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
          const { proMembers } = this.state;
          return (
            <>
              <Button
                disabled={this.state.dis}
                onClick={() => this.removeProMembers(record)}
                type="link"
                size="small"
              >
                删除
              </Button>
              <Button
                disabled={this.state.dis}
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
  };

  componentDidMount() {
    if (document.getElementsByClassName('ant-layout').length > 1) {
      document.getElementsByClassName('ant-layout')[2].scrollTop = 0;
    }
    const { proCode, taskId, update } = this.props.location.query;
    if (update) this.setState({ update: 1 });
    if (proCode) this.setState({ code: proCode });
    if (taskId) {
      request(`/api/billow-diplomatic/todo-task/processInfo?taskId=${taskId}`).then(res => {
        if (res?.status === 200) {
          const {
            taskComments,
            processInstanceId,
            formData: { businessData },
          } = res.data;
          this.setState({
            processInstanceId,
            dis: businessData.processType === 'project_terminate',
            processType: businessData.processType,
          });
          if (taskComments) this.setState({ taskComments });
          this.props.dispatch({
            type: 'projectInfoManger/getMemberInfoByCodeReq',
            payload: {
              proCode: businessData.proCode,
            },
            callback: result => {
              businessData.proMembers = result.data;
              this.handleData(businessData);
            },
          });
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
          if (res?.status === 200) {
            this.handleData(res.data);
          } else {
            message.error(res.message);
          }
        });
    } else {
      this.getProcodes();
    }
    this.getDropLists();
  }

  // 处理页面数据
  handleData = data => {
    const {
      proParticipants,
      proMembers,
      proReportList,
      proPublishInfoList = [],
      proBusType,
      customerType,
      idType,
      tradingPlaces,
      proArea,
      publicSector,
    } = data;
    this.setState(
      {
        pageInfo: data,
        proParticipants: proParticipants ? proParticipants : [],
        proMembers,
        proReportList: proReportList ? proReportList : [],
        proPublishInfoList,
        customerType,
        proArea,
        proBusType,
        publicSector,
        idType,
        tradingPlaces,
      },
      () => this.selectProParticipantList(),
    );
  };

  // 获取项目编码
  getProcodes = () => {
    this.props
      .dispatch({
        type: 'addProjectInfo/getProCode',
        payload: {
          proType: '3005',
        },
      })
      .then(res => {
        if (res && res.status === 200) this.props.form.setFieldsValue({ proCode: res.data });
      });
  };

  getDropLists() {
    const { dispatch } = this.props;
    // 项目系列下拉框数据获取
    dispatch({
      type: 'addProjectInfo/getproName',
      payload: {
        type: 0,
      },
    });
    // 项目类型下拉框数据获取
    dispatch({
      type: 'addProjectInfo/getProTypeList',
      payload: {
        fcode: 'awp_pro_type',
      },
    });
    // 所属行业下拉框数据获取
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
    // 项目参与人类型下拉框数据获取
    dispatch({
      type: 'addProjectInfo/getProTypeList',
      payload: {
        fcode: 'awp_pro_participant',
      },
    }).then(res => {
      if (res) {
        this.setState({
          newProParticipantList: res,
          localProParticipantList: res,
        });
      }
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

  /**
   * 项目类型选值获取项目编码事件
   * @param {}} val
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
        if (res && res.status === 200) this.props.form.setFieldsValue({ proCode: res.data });
      });
  };

  /**
   * 项目参与人下拉框选值事件
   * @param {*} val
   * @param {*} record
   */
  selectProRole = (val, record) => {
    const newProParticipants = this.state.proParticipants.filter(item => {
      if (record === item) {
        item.proRole = val;
      }
      return true;
    });

    this.setState(
      {
        proParticipants: newProParticipants,
      },
      () => {
        this.selectProParticipantList();
      },
    );
  };

  /**
   * 项目参与人弹框下拉选值
   * @param {选中的值} val
   */
  selectModalProRole = (val, name) => {
    this.setState({
      [name]: val,
    });
  };

  // 项目申报信息下拉框选值事件
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

  //项目申报信息日期选值事件
  reportDatePickerAction = (record, dataString, name) => {
    const newProReportList = this.state.proReportList.filter(item => {
      if (record === item) {
        if (dataString) {
          item[name] = `${dataString} 00:00:00`;
        } else {
          item[name] = null;
        }
      }
      return true;
    });

    this.setState({
      proReportList: newProReportList,
    });
  };

  // 项目申报信息输入框输入事件
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

  // 项目发行信息下拉框选值事件
  publishSelectAction = (val, record, name) => {
    const newProPublishInfoList = this.state.proPublishInfoList.filter(item => {
      if (record === item) {
        item[name] = val;
      }
      return true;
    });

    this.setState({
      proPublishInfoList: newProPublishInfoList,
    });
  };

  //项目发行信息日期选值事件
  publishDatePickerAction = (record, dataString, name) => {
    const newProPublishInfoList = this.state.proPublishInfoList.filter(item => {
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
      proPublishInfoList: newProPublishInfoList,
    });
  };

  /**
   * 项目成员信息下拉框选值事件
   * @param {*} val
   * @param {*} record
   */
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

  /**
   * 项目参与人输入框输入事件
   * @param {*} e
   * @param {*} record
   */
  inputMemberName = (e, record) => {
    const newProParticipants = this.state.proParticipants.filter(item => {
      if (record === item) {
        item.membeName = e.target.value;
      }
      return true;
    });
    this.setState({
      proParticipants: newProParticipants,
    });
  };

  // 项目发行信息输入框输入事件
  publishInputAction = (e, record, name) => {
    const newProPublishInfoList = this.state.proPublishInfoList.filter(item => {
      if (record === item) {
        item[name] = e.target.value;
      }
      return true;
    });
    this.setState({
      proPublishInfoList: newProPublishInfoList,
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

  // 项目参与人添加事件
  addProjectMember = (proRole, membeName) => {
    const { proParticipants } = this.state;
    const newProParticipants = [
      ...proParticipants,
      {
        proRole: proRole || '',
        membeName: membeName || '',
      },
    ];
    this.setState(
      {
        proParticipants: newProParticipants,
      },
      () => {
        this.selectProParticipantList();
      },
    );
  };

  // 添加项目参与人弹框点击确认
  onParticipantConfirm = values => {
    this.addProjectMember(values.proRole, values.membeName);
  };

  // 添加成员信息弹框点击确认
  onProMemberConfirm = values => {
    this.addproMembers(values);
  };

  // 项目申报添加事件
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

  // 项目发行添加事件
  addPublish = values => {
    const { proPublishInfoList } = this.state;
    const newProPublishInfoList = [
      ...proPublishInfoList,
      {
        stockCode: values.stockCode || '',
        stockShortName: values.stockShortName || '',
        issueTime: values.issueTime || '',
      },
    ];
    this.setState({
      proPublishInfoList: newProPublishInfoList,
    });
  };

  // 项目成员信息添加事件
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

  // 项目申报删除事件
  removeReport = record => {
    const newProReportList = this.state.proReportList.filter(item => {
      return item !== record;
    });
    this.setState({
      proReportList: newProReportList,
    });
  };

  // 项目发行删除事件
  removePublish = record => {
    const newProPublishInfoList = this.state.proPublishInfoList.filter(item => {
      return item !== record;
    });
    this.setState({
      proPublishInfoList: newProPublishInfoList,
    });
  };

  // 项目参与人删除事件
  removeProjectMember = record => {
    const { proParticipants } = this.state;
    const role = record.proRole;
    let index = '';
    proParticipants.forEach((item, idx) => {
      if (item.proRole === role) index = idx;
    });
    proParticipants.splice(index, 1);
    this.setState(
      {
        proParticipants,
      },
      () => {
        const { proParticipantList } = this.props.addProjectInfo;
        if (proParticipantList.length !== 0) {
          this.setState(
            {
              newProParticipantList: proParticipantList,
            },
            () => this.selectProParticipantList(),
          );
        }
      },
    );
  };

  // 项目成员信息删除事件
  removeProMembers = record => {
    const newProMembers = this.state.proMembers.filter(item => {
      return item !== record;
    });
    this.setState({
      proMembers: newProMembers,
    });
  };

  compareTime = (date1, date2) => {
    const startTime = date1.slice(0, 10);
    const endTime = date2.slice(0, 10);

    const day = 24 * 60 * 60 * 1000;
    const dateArr = startTime.split('-');
    const checkDate = new Date();
    checkDate.setFullYear(dateArr[0], dateArr[1] - 1, dateArr[2]);
    const checkTime = checkDate.getTime();
    const dateArr2 = endTime.split('-');
    const checkDate2 = new Date();
    checkDate2.setFullYear(dateArr2[0], dateArr2[1] - 1, dateArr2[2]);
    const checkTime2 = checkDate2.getTime();
    const cha = parseInt((checkTime2 - checkTime) / day);
    return cha <= 0;
  };

  // 保存/提交 操作
  handleSubmit = actionType => {
    const {
      dispatch,
      form: { validateFields },
    } = this.props;
    const {
      code,
      proParticipants,
      proMembers,
      proReportList,
      proPublishInfoList,
      processType,
      processInstanceId,
    } = this.state;

    validateFields((err, values) => {
      if (!err) {
        const formValues = customerListParams(values);

        for (let j = 0; j < proParticipants.length; j++) {
          if (proParticipants[j].proRole === '')
            return message.warn('项目参与人中有参与人类型未填写');

          if (proParticipants[j].membeName === '')
            return message.warn('项目参与人中有参与人名称未填写');
        }

        for (let i = 0; i < proReportList.length; i++) {
          const item = proReportList[i];
          if (!item.tradingPlaces) return message.warn('项目申报信息有交易场所未填写');
          if (item.tradingPlaces === '2007' && !item.otherTradingPlaces)
            return message.warn('项目申报信息中交易场所为其他时其他交易场所为必填项');
          if (!item.declareTime) return message.warn('项目申报信息有申报受理日期未填写');
        }

        for (let i = 0; i < proPublishInfoList.length; i++) {
          const item = proPublishInfoList[i];
          if (!item.stockCode) return message.warn('项目发行信息有证券代码未填写');
          if (!item.stockShortName) return message.warn('项目发行信息有证券简称未填写');
          if (!item.issueTime) return message.warn('项目发行信息有挂牌日期未填写');
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
        if (hascy < 1) return message.warn('必须在项目成员中添加1个项目成员');

        for (let i = 0; i < proMembers.length; i++) {
          if (proMembers[i].membeName === '') return message.warn('项目成员中有姓名未填写');
          if (proMembers[i].sex === '') return message.warn('项目成员中有性别未填写');
          const { idType } = proMembers[i];
          if (idType === '') return message.warn('项目成员中有证件类型未填写');
          const { idCard } = proMembers[i];
          if (idCard === '') return message.warn('项目成员中有证件号码未填写');

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

          if (proMembers[i].department === '') return message.warn('项目成员中有部门未填写');

          if (proMembers[i].job === '') return message.warn('项目成员中有职位未填写');

          if (proMembers[i].proRole === '') return message.warn('项目成员中有项目角色未填写');

          if (proMembers[i].email === '') return message.warn('项目成员中有邮箱未填写');

          if (!emailReg.test(proMembers[i].email))
            return message.warn('项目成员信息中邮箱格式错误');

          if (proMembers[i].mobile === '') return message.warn('项目成员中有联系电话未填写');

          if (
            !(
              phoneReg.test(proMembers[i].mobile) ||
              numReg.test(proMembers[i].mobile) ||
              phoneReg2.test(proMembers[i].mobile)
            )
          )
            return message.warn('项目成员信息中联系电话格式校验错误!');
        }

        formValues.terminationDate = this.formatDate(formValues.terminationDate);
        formValues.proCDate = this.formatDate(formValues.proCDate);
        formValues.declareTime = this.formatDate(formValues.declareTime);
        formValues.issueTime = this.formatDate(formValues.issueTime);
        if (formValues.seriesCode) {
          const [seriesCode, seriesName] = formValues.seriesCode.split(',');
          formValues.seriesCode = seriesCode;
          formValues.seriesName = seriesName;
        }

        const myPayload = { type: 1, proParticipants, proMembers, ...formValues };

        if (actionType === 'save') {
          this.setState({
            isSaving: true,
          });
          dispatch({
            type: code ? 'addProjectInfo/updateProductInfo' : 'addProjectInfo/savaData',
            payload: code
              ? { ...myPayload, proPublishInfoList, proReportList, processType, processInstanceId }
              : myPayload,
          }).then(res => {
            this.setState({
              isSaving: false,
            });
            if (res && res.status === 200) {
              message.success('保存成功!');
              router.push('/projectManagement/informationManagement');
            } else if (res && res.message === '项目编码已被占用') {
              message.warning('该项目编码已被占用，已重新获取项目编码，请再次保存');
              this.getProcodes();
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
            payload: { ...myPayload, proPublishInfoList, proReportList, isNew: 1 },
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
        } else if (actionType === 'resave') {
          this.setState({
            isReSaving: true,
          });
          dispatch({
            type: 'addProjectInfo/resave',
            payload: { ...myPayload, proPublishInfoList, proReportList, isNew: 1 },
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
        } else if (actionType === 'submit') {
          this.setState({
            isSubmiting: true,
          });
          dispatch({
            type: 'addProjectInfo/commitData',
            payload: code
              ? {
                  ...myPayload,
                  proPublishInfoList,
                  proReportList,
                  isNew: 0,
                  processType,
                  processInstanceId,
                }
              : { ...myPayload, isNew: 1 },
          }).then(res => {
            this.setState({
              isSubmiting: false,
            });
            if (res && res.status === 200) {
              message.success('提交成功!');
              router.push('/projectManagement/informationManagement');
            } else {
              message.error(res.message);
            }
          });
        }
      }
    });
  };

  /**
   * 项目参与人下拉框过滤
   */
  selectProParticipantList() {
    const { localProParticipantList } = this.state;
    if (localProParticipantList.length !== 0) {
      const newProParticipant = [];
      localProParticipantList.forEach(item => {
        if (!this.filterRoles(item)) newProParticipant.push(item);
      });
      this.setState({
        newProParticipantList: newProParticipant,
      });
    }
  }

  // 过滤角色
  filterRoles(item) {
    const { proParticipants } = this.state;
    let hasselect = false;
    for (let i = 0; i < proParticipants.length; i++) {
      if (proParticipants[i].proRole !== 'parti_12' && item.code === proParticipants[i].proRole) {
        item.hasselect = true;
        hasselect = true;
      } else {
        item.hasselect = false;
      }
    }
    return hasselect;
  }

  // 下拉框支持模糊匹配
  productFilterOption = (input, option) => {
    const label = option.props.children.toLowerCase();
    const value = option.props.value.toLowerCase();
    const ipt = input.toLowerCase();
    return label.includes(ipt) || value.includes(ipt);
  };

  /**
   * 格式化日期
   * @param {时间} date 'YYYY-MMM-DD HH:FF:SS'
   */
  formatDate(date) {
    return date ? moment(date).format('YYYY-MM-DD HH:mm:ss') : '';
  }

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

  /**
   * 选择系列编号修改数据
   * @param {} val
   */

  getRenderingdata = val => {
    const { pageInfo } = this.state;
    this.props
      .dispatch({
        type: 'addProjectInfo/getPageInfo',
        payload: {
          proCode: val.split(',')[0],
        },
      })
      .then(res => {
        if (res && res.status === 200) {
          const { proArea, proMembers } = res.data;
          const datainfo = {
            ...res.data,
            proName: pageInfo.proName,
            proType: res.data.proType || pageInfo.proType || '',
            otherProType: res.data.otherProType || pageInfo.otherProType || '',
            proArea: res.data.proArea || pageInfo.proArea || '',
            overseasProArea: res.data.overseasProArea || pageInfo.overseasProArea || '',
            proDept: res.data.proDept || pageInfo.proDept || '',
          };
          const newProMembers = [];
          proMembers.forEach(item => {
            newProMembers.push({
              membeCode: item.membeCode,
              membeName: item.membeName,
              sex: item.sex,
              idType: item.idType,
              idCard: item.idCard,
              department: item.department,
              job: item.job,
              proRole: item.proRole,
              email: item.email,
              mobile: item.mobile,
              remark: item.remark,
            });
          });

          this.setState({
            pageInfo: datainfo,
            proArea,
            proMembers: newProMembers,
          });
          this.props.form.setFieldsValue({
            proArea,
          });
        } else if (res.message) {
          message.error(res.message);
        } else {
          message.error('服务器发生未知错误!');
        }
      });
  };

  // 取消 操作
  handleBack = () => {
    if (this.props.location.query.radioType) {
      this.props.dispatch(
        routerRedux.push({
          pathname: '/projectManagement/projectAndSeriesQuery',
          query: {
            radioType: this.props.location.query.radioType,
          },
        }),
      );
    } else {
      router.go(-1);
    }
  };

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
        proName,
      },
    } = this.props;
    const { getFieldDecorator } = this.props.form;
    const {
      proMembers,
      proParticipants,
      proPublishInfoList,
      proReportList,
      proArea,
      proBusType,
      pageInfo,
      code,
      newProParticipantList,
      reportInfoColumns,
      publishInfoColumns,
      columns,
      memberColumn,
      isSaving,
      isReSaving,
      isReCommiting,
      isSubmiting,
      taskComments,
      taskCommentsColumn,
      update,
      processType,
      dis,
    } = this.state;

    return (
      <Card
        className={styles.addprojectinfo}
        title={
          <Breadcrumb>
            <Breadcrumb.Item>{update ? '项目/系列信息' : '项目信息管理'}</Breadcrumb.Item>
            <Breadcrumb.Item>
              {update ? '项目信息变更' : code ? '修改项目信息' : '新增项目信息'}
            </Breadcrumb.Item>
          </Breadcrumb>
        }
        extra={
          <>
            <Button
              type="primary"
              style={{ display: update ? 'none' : 'inline-block' }}
              className={styles.save}
              onClick={() => this.handleSubmit('save')}
              loading={isSaving}
            >
              保存
            </Button>
            <Action code="informationManagement:resave">
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
            <Action code="informationManagement:recommit">
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
            <Action code="informationManagement:commit">
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
            <Button style={{ marginLeft: '10px' }} onClick={this.handleBack}>
              取消
            </Button>
          </>
        }
      >
        <div
          style={{
            height:
              document.getElementsByClassName('ant-layout').length > 1 ? 'calc(100vh - 250px)' : '',
            overflowY: 'auto',
          }}
        >
          <Form {...layout}>
            <div
              style={{
                display:
                  processType === 'project_terminate' || pageInfo.terminationDate
                    ? 'block'
                    : 'none',
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
                          required: processType === 'project_terminate',
                          message: '终止原因是必填项',
                        },
                      ],
                    })(
                      <TextArea
                        rows={4}
                        allowClear
                        autoSize={{ minRows: 3, maxRows: 6 }}
                        maxLength={500}
                        disabled={processType !== 'project_terminate'}
                      />,
                    )}
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="终止日期">
                    {getFieldDecorator('terminationDate', {
                      initialValue: pageInfo.terminationDate
                        ? moment(this.deFormatDate(pageInfo.terminationDate))
                        : null,
                      rules: [
                        {
                          required: processType === 'project_terminate',
                          message: '终止日期是必填项',
                        },
                      ],
                    })(
                      <DatePicker
                        placeholder="请选择"
                        disabled={processType !== 'project_terminate'}
                      />,
                    )}
                  </Form.Item>
                </Col>
              </Row>
            </div>
            <div
              style={{
                display: JSON.stringify(taskComments) !== '[]' ? 'block' : 'none',
                color: '#333',
                fontSize: '16px',
              }}
            >
              审批办理意见
            </div>
            <Table
              style={{
                display: JSON.stringify(taskComments) !== '[]' ? 'block' : 'none',
                margin: '15px 0 30px',
              }}
              rowKey={(r, index) => index}
              columns={taskCommentsColumn}
              dataSource={taskComments}
              bordered
              pagination={false}
            />
            <span
              style={{
                display: 'block',
                paddingBottom: 10,
                color: '#333',
                fontSize: '16px',
              }}
            >
              系列信息
            </span>
            <Row>
              <Col span={8}>
                <Form.Item label="系列名称:">
                  {getFieldDecorator('seriesCode', {
                    initialValue: pageInfo.seriesCode
                      ? pageInfo.seriesCode + ',' + pageInfo.seriesName
                      : undefined,
                  })(
                    <Select
                      placeholder="请选择"
                      showSearch
                      filterOption={this.productFilterOption}
                      onChange={this.getRenderingdata}
                      disabled={dis}
                    >
                      {proName &&
                        proName.map(item => {
                          return (
                            <Option key={item.code} value={item.code + ',' + item.proName}>
                              {item.name}
                            </Option>
                          );
                        })}
                    </Select>,
                  )}
                </Form.Item>
              </Col>
            </Row>
            <div style={{ marginTop: 15, padding: '20px 0 10px', color: '#333', fontSize: '16px' }}>
              项目信息
            </div>
            <Row>
              <Col span={8}>
                <Form.Item label="项目编码:">
                  {getFieldDecorator('proCode', {
                    initialValue: dis ? pageInfo.proCode : code,
                    rules: [{ required: true, message: '项目编码是必填项' }],
                  })(<Input placeholder="请输入" disabled />)}
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="项目名称:">
                  {getFieldDecorator('proName', {
                    initialValue: pageInfo.proName,
                    rules: [{ required: true, message: '项目名称是必填项' }],
                  })(<Input placeholder="请输入" maxLength={100} disabled={dis} />)}
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="项目简称:">
                  {getFieldDecorator('proShortName', { initialValue: pageInfo.proShortName })(
                    <Input placeholder="请输入" maxLength={100} disabled={dis} />,
                  )}
                </Form.Item>
              </Col>
            </Row>
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
                      onChange={this.selectProType}
                      setFieldsValue={pageInfo.proType}
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
                    rules: [{ required: proArea === '900000', message: '境外区域名称是必填项' }],
                  })(<Input placeholder="请输入" maxLength={50} disabled={dis} />)}
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="项目期次:">
                  {getFieldDecorator('productPeriod', {
                    initialValue: pageInfo.productPeriod,
                    rules: [
                      {
                        validator: (rule, value, callback) => {
                          if (value && value <= 0) {
                            callback('项目期次不能小于1');
                          } else {
                            callback();
                          }
                        },
                      },
                    ],
                  })(<Input placeholder="请输入" maxLength={3} type="number" disabled={dis} />)}
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="所属部门:">
                  {getFieldDecorator('proDept', {
                    initialValue: pageInfo.proDept,
                    rules: [{ required: true, message: '所属部门是必填项' }],
                  })(<Input placeholder="请输入" maxLength={10} disabled={dis} />)}
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="开始日期">
                  {getFieldDecorator('proCDate', {
                    initialValue: pageInfo.proCDate
                      ? moment(this.deFormatDate(pageInfo.proCDate))
                      : null,
                  })(<DatePicker placeholder="请选择" disabled={dis} />)}
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={8}>
                <Form.Item label="项目分类:">
                  {getFieldDecorator('proBusType', {
                    initialValue: proBusType,
                    rules: [{ required: true, message: '项目分类是必填项' }],
                  })(
                    <Radio.Group name="proBusType" disabled={dis}>
                      <Radio value="1">管理人项目</Radio>
                      <Radio value="0">非管理人项目</Radio>
                    </Radio.Group>,
                  )}
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="是否招投标">
                  {getFieldDecorator('biddingFlag', {
                    initialValue: pageInfo.biddingFlag,
                  })(
                    <Radio.Group disabled={dis}>
                      <Radio value={1}>是</Radio>
                      <Radio value={0}>否</Radio>
                    </Radio.Group>,
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col>
                <Form.Item label="项目描述" labelCol={{ span: 3 }} wrapperCol={{ span: 21 }}>
                  {getFieldDecorator('proDesc', { initialValue: pageInfo.proDesc })(
                    <TextArea
                      rows={4}
                      allowClear
                      autoSize={{ minRows: 3, maxRows: 6 }}
                      maxLength={1000}
                      placeholder="请输入1000字以内内容..."
                      disabled={dis}
                    />,
                  )}
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
          {pageInfo && pageInfo.proReportList && code && !dis ? (
            <div className={styles.sonTableTitle}>
              项目申报信息
              <ReportModal
                onConfirm={this.addReport}
                data={{
                  productFilterOption: this.productFilterOption,
                  tradingPlacesList,
                }}
              />
            </div>
          ) : null}
          {pageInfo && pageInfo.proReportList && code ? (
            <Table
              rowKey={(r, index) => index}
              columns={reportInfoColumns}
              dataSource={proReportList}
              bordered
              pagination={false}
            />
          ) : null}
          {pageInfo && pageInfo.proPublishInfoList && code && !dis ? (
            <div className={styles.sonTableTitle}>
              项目发行信息
              <PublishModal
                onConfirm={this.addPublish}
                data={{
                  productFilterOption: this.productFilterOption,
                  listedPlateList: proPlateList,
                }}
              />
            </div>
          ) : null}
          {pageInfo && pageInfo.proPublishInfoList ? (
            <Table
              rowKey={(r, index) => index}
              columns={publishInfoColumns}
              dataSource={proPublishInfoList}
              bordered
              pagination={false}
            />
          ) : null}
          {!dis ? (
            <div className={styles.sonTableTitle}>
              项目参与人
              <ModalForm
                onConfirm={this.onParticipantConfirm}
                data={{
                  proParticipantList: newProParticipantList,
                }}
              />
            </div>
          ) : null}
          <Table
            rowKey={(r, index) => index}
            columns={columns}
            dataSource={proParticipants}
            bordered
            pagination={false}
          />
          {!dis ? (
            <div className={styles.sonTableTitle}>
              项目成员信息
              <ProMemberModal
                onConfirm={this.onProMemberConfirm}
                data={{
                  productFilterOption: this.productFilterOption,
                  idTypeList,
                  memberNameList,
                  proMembers,
                }}
              />
            </div>
          ) : null}
          <Table
            rowKey={(r, index) => index}
            columns={memberColumn}
            scroll={{ x: 1300 }}
            dataSource={proMembers}
            bordered
            pagination={false}
          />
        </div>
      </Card>
    );
  }
}

const WrappedSingleForm = errorBoundary(
  linkHoc()(
    Form.create()(
      connect(({ addProjectInfo }) => ({
        addProjectInfo,
      }))(AddProjectInfo),
    ),
  ),
);
export default WrappedSingleForm;
