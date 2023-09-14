/**
 *  新建项目与修改项目信息
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
  Modal,
  InputNumber,
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

const { TextArea } = Input;

const FormItem = Form.Item;
const { Option } = Select;
const { Search } = Input;
const ButtonGroup = Button.Group;
const creditNumReg = /^[0-9a-zA-Z]{18}$/; // 统一社会信用代码校验规则
const phoneReg = /^(13[0-9]|14[5|7]|15[0|1|2|3|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/; // 手机号码校验规则
const numReg = /^\d{3,4}-?\d{7,8}$/; // 电话号码校验规则
const phoneReg2 = /^\+86(13[0-9]|14[5|7]|15[0|1|2|3|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/; // 手机号码校验规则
const idCardReg = /(^[1-9]\d{5}(18|19|2[0-3])\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)/; // 18位身份证号校验规则
const PASSPORT1 = /^[a-zA-Z]{5,17}$/; // 护照验证规则
const PASSPORT2 = /^[a-zA-Z0-9]{5,17}$/; // 护照验证规则
const HKMAKAO = /^[HMhm]{1}([0-9]{10}|[0-9]{8})$/; // 港澳通行证
const TAIWAN1 = /^[0-9]{8}$/; // 台湾来往大陆通行证
const TAIWAN2 = /^[0-9]{10}$/; // 台湾来往大陆通行证
const regNum = /^[0-9a-zA-Z]*$/;
const emailReg = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
@Form.create()
class AddProjectInfo extends Component {
  constructor(props) {
    super(props);
  }

  state = {
    seriesCode: '',
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
    localProParticipantList: [],
    newProParticipantList: [],
    tradingPlaces: '',
    setUpTime: '',
    publicTime: '',
  };

  componentDidMount() {
    if (document.getElementsByClassName('ant-layout')) {
      document.getElementsByClassName('ant-layout')[2].scrollTop = 0;
    }
    const code = window.location.href.split('=')[1];
    if (code) {
      this.props
        .dispatch({
          type: 'addProjectInfo/getPageInfo',
          payload: {
            proCode: code,
          },
        })
        .then(res => {
          if (res && res.status === 200) {
            const {
              data: {
                proParticipants,
                proMembers,
                proReportList,
                proPublishInfoList,
                proBusType,
                customerType,
                idType,
                tradingPlaces,
                proArea,
                publicSector,
              },
            } = res;

            const newProReportList = [];
            proReportList.forEach(item => {
              newProReportList.push({
                tradingPlaces: item.tradingPlaces,
                otherTradingPlaces: item.otherTradingPlaces,
                declareTime: item.declareTime,
              });
            });

            const newProPublishInfoList = [];
            proPublishInfoList.forEach(item => {
              newProPublishInfoList.push({
                stockCode: item.stockCode,
                stockShortName: item.stockShortName,
                issueTime: item.issueTime,
              });
            });

            this.setState(
              {
                pageInfo: res.data,
                proParticipants: res.data.proParticipants,
                proMembers,
                proReportList: newProReportList,
                proPublishInfoList: newProPublishInfoList,
                customerType,
                proArea,
                proBusType,
                publicSector,
                idType,
                tradingPlaces,
                code,
              },
              () => this.selectProParticipantList(),
            );
          } else {
            message.error(res.message);
          }
        });
    } else {
      this.getProcodes();
    }
    this.getDropLists();
  }
  getProcodes = () => {
    this.props
      .dispatch({
        type: 'addProjectInfo/getProCode',
        payload: {
          proType: '3005',
        },
      })
      .then(res => {
        if (res && res.data) this.props.form.setFieldsValue({ proCode: res.data });
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
  }

  /**
   * 项目类型选值获取项目编码事件
   * @param {}} val
   */
  selectProType = val => {
    this.props.dispatch({
      type: 'addProjectInfo/getProCode',
      payload: {
        proType: val,
      },
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
          item[name] = '';
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
  proMembersSelectAction = (val, record, name) => {
    const newProMembers = this.state.proMembers.filter(item => {
      if (record === item) {
        item[name] = val;
      }
      return true;
    });

    this.setState({
      proMembers: newProMembers,
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

  /**
   * 项目参与人添加事件
   */
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

  /**
   * 添加项目参与人弹框点击确认
   */
  onParticipantConfirm = values => {
    this.addProjectMember(values.proRole, values.membeName);
  };

  /**
   * 添加成员信息弹框点击确认
   */
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

  /**
   * 项目成员信息添加事件
   */
  addproMembers = values => {
    const { proMembers } = this.state;
    const newProMembers = [
      ...proMembers,
      {
        membeName: values.membeName || '', // 姓名
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
  /**
   * 项目参与人删除事件
   * @param {*} record
   */
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

  /**
   * 项目成员信息删除事件
   * @param {*} record
   */
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

  // 保存 审核操作
  handleSubmit = () => {
    const {
      dispatch,
      form: { validateFields, getFieldsValue },
    } = this.props;
    const {
      code,
      proParticipants,
      proMembers,
      proReportList,
      proPublishInfoList,
      pageInfo,
    } = this.state;
    if (pageInfo.projectState === 'state3' && !proPublishInfoList.length) {
      return message.warn('请至少添加一条发行信息');
    }
    validateFields((err, values) => {
      if (!err) {
        for (let j = 0; j < proParticipants.length; j++) {
          if (proParticipants[j].proRole === '') {
            return message.warn('项目参与人中有参与人类型未填写');
          }
          if (proParticipants[j].membeName === '') {
            return message.warn('项目参与人中有参与人名称未填写');
          }
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
        proMembers.forEach(item => {
          if (item.proRole === '项目负责人') hasfzr = true;
          if (item.proRole === '项目组成员') hascy++;
        });
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
        this.setState({
          isSaving: true,
        });
        const formItems = getFieldsValue();
        if (formItems.proCDate) {
          formItems.proCDate = this.formatDate(formItems.proCDate._d);
        }
        if (formItems.publicTime) {
          formItems.publicTime = this.formatDate(formItems.publicTime._d);
        }
        if (formItems.setUpTime) {
          formItems.setUpTime = this.formatDate(formItems.setUpTime._d);
        }
        if (formItems.declareTime) {
          formItems.declareTime = this.formatDate(formItems.declareTime._d);
        }
        if (formItems.issueTime) {
          formItems.issueTime = this.formatDate(formItems.issueTime._d);
        }
        if (formItems.registeredCapital) {
          formItems.registeredCapital += '';
        }
        let myPayload = { type: 1, proParticipants, proMembers, ...formItems };
        dispatch({
          type: code ? 'addProjectInfo/updateProductInfo' : 'addProjectInfo/savaData',
          payload: code
            ? { ...myPayload, proPublishList: proPublishInfoList, proReportList }
            : myPayload,
        }).then(res => {
          this.setState({
            isSaving: false,
          });
          if (res && res.status === 200) {
            // if (pageInfo.projectState === 'state3') {
            //   dispatch({
            //     type: 'projectInfoManger/projectPublish',
            //     payload: {
            //       proPublishList: proPublishInfoList,
            //       proCode: code,
            //     },
            //   }).then(res => {
            //     this.setState({
            //       isSaving: false,
            //     });
            //     if (res && res.status === 200) {
            //       message.success('修改成功!');
            //       router.push('/projectManagement/informationManagement');
            //     } else {
            //       message.success(res.message);
            //     }
            //   });
            // } else {

            message.success('保存成功!');
            router.push('/projectManagement/informationManagement');
            // }
          } else if (res && res.message === '项目编码已被占用') {
            message.warning('该项目编码已被占用，已重新获取项目编码，请再次保存');
            this.getProcodes();
          } else {
            message.error(res.message);
          }
        });
      }
    });
  };

  /**
   * 项目参与人下拉框过滤
   */
  selectProParticipantList() {
    const { proParticipants, newProParticipantList, localProParticipantList } = this.state;
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

  /** *
   * 过滤角色
   */
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

  /**
   * 项目区域  所属行业 参与人类型 下拉框支持模糊匹配
   * @param {*} input
   * @param {*} option
   */
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
    const Y = date.getFullYear();
    const M = date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1;
    const D = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate();
    const h = date.getHours() < 10 ? `0${date.getHours()}` : date.getHours();
    const m = date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes();
    const s = date.getSeconds() < 10 ? `0${date.getSeconds()}` : date.getSeconds();
    return `${Y}-${M}-${D} ${h}:${m}:${s}`;
  }

  /**
   * 格式化日期
   * @param {时间} date 'YYYY-MMM-DD'
   */
  deFormatDate(date) {
    if (date) {
      const arr = date.split(' ');
      return arr[0];
    }
    return '';
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
          const startTime = setUpTime.slice(0, 10);
          const endTime = publicTime.slice(0, 10);

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
          if (cha < 0) {
            message.warning('上市时间需大于成立时间');
            this.setState({
              [name]: '',
            });
            if (name === 'setUpTime') {
              this.props.form.setFieldsValue({ setUpTime: '' });
            } else {
              this.props.form.setFieldsValue({ publicTime: '' });
            }
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
    this.setState({ seriesCode: val });
    this.props
      .dispatch({
        type: 'addProjectInfo/getPageInfo',
        payload: {
          proCode: val,
        },
      })
      .then(res => {
        if (res && res.status === 200) {
          const { proArea, customerType, publicSector, idType, pageInfo, proMembers } = res.data;
          let datainfo = {
            ...pageInfo,
            proType: res.data.proType || '',
            otherProType: res.data.otherProType || '',
            proArea: res.data.proArea || '',
            overseasProArea: res.data.overseasProArea || '',
            proDept: res.data.proDept || '',
            customerName: res.data.customerName || '',
            customerShortName: res.data.customerShortName || '',
            customerType: res.data.customerType || '',
            customerCode: res.data.customerCode || '',
            industryInvolved: res.data.industryInvolved || '',
            setUpTime: res.data.setUpTime || '',
            publicSector: res.data.publicSector,
            publicTime: res.data.publicTime || '',
            legalRepresentative: res.data.legalRepresentative || '',
            registeredCapital: res.data.registeredCapital || '',
            contact: res.data.contact || '',
            contactNumber: res.data.contactNumber || '',
            businessScope: res.data.businessScope || '',
            idType: res.data.idType || '',
            otherIdType: res.data.otherIdType || '',
            idNumber: res.data.idNumber || '',
            sex: res.data.sex || '',
            email: res.data.email || '',
            remark: res.data.remark || '',
          };
          const newProMembers = [];
          proMembers.forEach(item => {
            newProMembers.push({
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
            customerType,
            publicSector,
            idType,
            proMembers: newProMembers,
          });
          this.props.form.setFieldsValue({ customerType });
          this.props.form.setFieldsValue({ proArea });
          this.props.form.setFieldsValue({ publicSector });
          this.props.form.setFieldsValue({ idType });
        } else if (res.message) {
          message.error(res.message);
        } else {
          message.error('服务器发生未知错误!');
        }
      });
  };

  render() {
    const {
      addProjectInfo: {
        proCode,
        proTypeList,
        proTradeList,
        proLocaList,
        proPlateList,
        proParticipantList,
        idTypeList,
        tradingPlacesList,
        capitalCurrencyList,
        proName,
      },
    } = this.props;
    const { getFieldDecorator } = this.props.form;
    const {
      proMembers,
      proParticipants,
      // publishInfoColumns,
      proPublishInfoList,
      proReportList,
      proArea,
      proBusType,
      customerType,
      idType,
      pageInfo,
      code,
      publicSector,
      newProParticipantList,
      tradingPlaces,
      isSaving,
    } = this.state;
    // const {

    // } = this.state.pageInfo;
    const layout = {
      labelAlign: 'right',
      labelCol: { span: 9 },
      wrapperCol: { span: 15 },
    };
    const reportInfoColumns = [
      {
        key: 'tradingPlaces',
        dataIndex: 'tradingPlaces',
        title: '交易场所',
        render: (tradingPlaces, record) => (
          <Select
            style={{ width: '100%' }}
            placeholder="请选择"
            showArrow
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
        ),
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
            value={declareTime ? moment(declareTime) : ''}
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
          return (
            <ButtonGroup>
              <Button onClick={() => this.removeReport(record)} type="link" size="small">
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
              >
                添加
              </Button>
            </ButtonGroup>
          );
        },
      },
    ];
    const publishInfoColumns = [
      {
        key: 'stockCode',
        dataIndex: 'stockCode',
        title: '证券代码',
        render: (stockCode, record) => (
          <Input
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
            placeholder="请选择"
            value={issueTime ? moment(issueTime) : ''}
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
          return (
            <ButtonGroup>
              <Button onClick={() => this.removePublish(record)} type="link" size="small">
                删除
              </Button>
              <Button
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
    ];
    const columns = [
      {
        key: 'proRole',
        title: '参与人类型',
        dataIndex: 'proRole',
        width: 200,
        align: 'center',
        render: (proRole, record) => {
          return (
            <Select
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
          return (
            <ButtonGroup>
              <Button onClick={() => this.removeProjectMember(record)} type="link" size="small">
                删除
              </Button>
              <Button
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
    ];
    const memberColumn = [
      {
        key: 'membeName',
        title: '姓名',
        dataIndex: 'membeName',
        width: 150,
        align: 'center',
        render: (membeName, record) => {
          return (
            <Input
              placeholder="请输入"
              value={membeName}
              onChange={e => this.proMembersInputAction(e, record, 'membeName')}
              maxLength={25}
            />
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
          return (
            <Select
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
      // {
      //   key: 'idName',
      //   title: '其他证件类型',
      //   dataIndex: 'idName',
      //   width: 200,
      //   align: 'center',
      //   render: (idName, record) => {
      //     return (
      //       <Input
      //         value={idName}
      //         placeholder="请输入"
      //         onChange={e => this.proMembersInputAction(e, record, 'idName')}
      //       />
      //     );
      //   },
      // },
      {
        key: 'idCard',
        title: '证件号码',
        dataIndex: 'idCard',
        width: 220,
        align: 'center',
        render: (idCard, record) => {
          return (
            <Input
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
          return (
            <>
              <Button onClick={() => this.removeProMembers(record)} type="link" size="small">
                删除
              </Button>
              <Button
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
    ];
    return (
      <>
        <Card
          style={{
            marginBottom: 10,
          }}
        >
          <Row gutter={24}>
            <Col md={12} sm={12}>
              <span style={{ color: 'rgba(149, 163, 187, 1)' }}>项目信息管理</span> /{' '}
              <span style={{ color: 'rgba(71,75,91,1)' }}>
                {code ? '修改项目信息' : '新增项目信息'}
              </span>
            </Col>
          </Row>
        </Card>
        <Card className={styles.addprojectinfo}>
          <Row style={{ borderBottom: '1px solid #ccc', paddingBottom: 10 }}>
            <Col span={8}>新建项目</Col>
            <Col span={16}>
              <Button
                style={{ float: 'right', marginLeft: 10 }}
                onClick={() => {
                  router.go(-1);
                }}
              >
                取消
              </Button>
              <Button
                className={styles.save}
                style={{ float: 'right', color: '#409eff' }}
                onClick={() => this.handleSubmit()}
                loading={isSaving}
              >
                保存
              </Button>
            </Col>
          </Row>
          <div
            style={{
              height: 'calc(100vh - 340px)',
              overflowY: 'auto',
              marginTop: 20,
            }}
          >
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
            <Form {...layout}>
              <Row>
                <Col span={8}>
                  <Form.Item name="seriesCode" label="系列名称:">
                    {getFieldDecorator('seriesCode', {
                      initialValue: pageInfo.seriesCode,
                    })(
                      <Select placeholder="请选择" showArrow onChange={this.getRenderingdata}>
                        {proName &&
                          proName.map(item => {
                            return (
                              <Option key={item.code} value={item.code}>
                                {item.name}
                              </Option>
                            );
                          })}
                      </Select>,
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <div
                style={{ marginTop: 15, padding: '20px 0 10px', color: '#333', fontSize: '16px' }}
              >
                项目信息
              </div>
              <Row>
                <Col span={8}>
                  <Form.Item name="proCode" label="项目编码:">
                    {getFieldDecorator('proCode', {
                      initialValue: code,
                      rules: [{ required: true, message: '项目编码是必填项' }],
                    })(<Input placeholder="请输入" disabled />)}
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item name="proName" label="项目名称:">
                    {getFieldDecorator('proName', {
                      initialValue: pageInfo.proName,
                      rules: [{ required: true, message: '项目名称是必填项' }],
                    })(<Input placeholder="请输入" maxLength={50} />)}
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item name="proShortName" label="项目简称:">
                    {getFieldDecorator('proShortName', { initialValue: pageInfo.proShortName })(
                      <Input placeholder="请输入" maxLength={50} />,
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col span={8}>
                  <Form.Item name="proType" label="项目类型:">
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
                {/* <Col span={8}>
                <Form.Item name="otherProType" label="其他项目类型:">
                  {getFieldDecorator('otherProType', { initialValue: pageInfo.otherProType })(
                    <Input placeholder="请输入" />,
                  )}
                </Form.Item>
              </Col> */}
                <Col span={8}>
                  <Form.Item name="proArea" label="项目区域:">
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
                  <Form.Item name="overseasProArea" label="境外区域名称:">
                    {getFieldDecorator('overseasProArea', {
                      initialValue: pageInfo.overseasProArea,
                      rules: [{ required: proArea === '900000', message: '境外区域名称是必填项' }],
                    })(<Input placeholder="请输入" maxLength={50} />)}
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item name="proDept" label="项目期次:">
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
                    })(<Input placeholder="请输入" maxLength={3} type="number" />)}
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item name="proDept" label="所属部门:">
                    {getFieldDecorator('proDept', {
                      initialValue: pageInfo.proDept,
                      rules: [{ required: true, message: '所属部门是必填项' }],
                    })(<Input placeholder="请输入" maxLength={50} />)}
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item name="proCDate" label="开始日期">
                    {getFieldDecorator('proCDate', {
                      initialValue: pageInfo.proCDate
                        ? moment(this.deFormatDate(pageInfo.proCDate))
                        : '',
                    })(<DatePicker placeholder="请选择" />)}
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col span={8}>
                  <Form.Item name="proBusType" label="项目分类:">
                    {getFieldDecorator('proBusType', {
                      initialValue: proBusType,
                      rules: [{ required: true, message: '项目分类是必填项' }],
                    })(
                      <Radio.Group name="proBusType">
                        <Radio value="1">管理人项目</Radio>
                        <Radio value="0">非管理人项目</Radio>
                      </Radio.Group>,
                    )}
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item name="biddingFlag" label="是否招投标">
                    {getFieldDecorator('biddingFlag', {
                      initialValue: pageInfo.biddingFlag,
                    })(
                      <Radio.Group name="biddingFlag">
                        <Radio value={1}>是</Radio>
                        <Radio value={0}>否</Radio>
                      </Radio.Group>,
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Form.Item
                    name="proDesc"
                    label="项目描述"
                    labelCol={{ span: 3 }}
                    wrapperCol={{ span: 21 }}
                  >
                    {getFieldDecorator('proDesc', { initialValue: pageInfo.proDesc })(
                      <TextArea
                        rows={4}
                        allowClear
                        autoSize={{ minRows: 3, maxRows: 6 }}
                        maxLength={1000}
                        placeholder="请输入1000字以内内容..."
                      />,
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <div
                style={{ marginTop: 15, padding: '20px 0 10px', color: '#333', fontSize: '16px' }}
              >
                客户信息
              </div>
              <Row>
                <Col span={8}>
                  <Form.Item name="customerName" label="客户名称:">
                    {getFieldDecorator('customerName', {
                      initialValue: pageInfo.customerName,
                      rules: [{ required: true, message: '客户名称是必填项' }],
                    })(<Input placeholder="请输入" maxLength={50} />)}
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item name="customerShortName" label="客户简称:">
                    {getFieldDecorator('customerShortName', {
                      initialValue: pageInfo.customerShortName,
                    })(<Input placeholder="请输入" maxLength={50} />)}
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item name="customerType" label="客户类型:">
                    {getFieldDecorator('customerType', {
                      initialValue: customerType,
                      rules: [{ required: true, message: '客户类型是必填项' }],
                    })(
                      <Radio.Group
                        onChange={e => this.setState({ customerType: e.target.value })}
                        name="customerType"
                      >
                        <Radio value="1">机构</Radio>
                        <Radio value="0">自然人</Radio>
                      </Radio.Group>,
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <div
                style={{
                  display: customerType === '1' || customerType === undefined ? 'block' : 'none',
                }}
              >
                <Row>
                  <Col span={8}>
                    <Form.Item name="customerCode" label="统一社会信用代码:">
                      {getFieldDecorator('customerCode', {
                        initialValue: pageInfo.customerCode,
                        rules: [
                          {
                            required: customerType === '1',
                            message: '统一社会信用代码是必填项',
                          },
                          {
                            validator: (rule, value, callback) => {
                              if (customerType === '0') {
                                callback();
                              } else if (value && !creditNumReg.test(value)) {
                                callback('统一社会信用代码格式错误');
                              } else {
                                callback();
                              }
                            },
                          },
                        ],
                      })(<Input placeholder="请输入" />)}
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item name="industryInvolved" label="所属行业:">
                      {getFieldDecorator('industryInvolved', {
                        initialValue: pageInfo.industryInvolved,
                        rules: [
                          {
                            required: customerType === '1',
                            message: '所属行业是必填项',
                          },
                        ],
                      })(
                        <Select
                          placeholder="请选择"
                          showSearch
                          allowClear
                          filterOption={this.productFilterOption}
                        >
                          {proTradeList &&
                            proTradeList.map(item => (
                              <Option key={item.code} value={item.code}>
                                {item.name}
                              </Option>
                            ))}
                        </Select>,
                      )}
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item name="setUpTime" label="成立时间">
                      {getFieldDecorator('setUpTime', {
                        initialValue: pageInfo.setUpTime
                          ? moment(this.deFormatDate(pageInfo.setUpTime))
                          : '',
                      })(
                        <DatePicker
                          placeholder="请选择"
                          onChange={(date, dateString) => {
                            this.dataPick(date, dateString, 'setUpTime');
                          }}
                        />,
                      )}
                    </Form.Item>
                  </Col>
                </Row>
                <Row>
                  <Col span={8}>
                    <Form.Item name="publicSector" label="上市板块:">
                      {getFieldDecorator('publicSector', { initialValue: pageInfo.publicSector })(
                        <Select
                          placeholder="请选择"
                          showArrow
                          onChange={val => this.setState({ publicSector: val })}
                        >
                          {proPlateList &&
                            proPlateList.map(item => (
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
                      display: publicSector !== '1006' ? 'inline-block' : 'none',
                    }}
                  >
                    <Form.Item name="publicTime" label="上市时间">
                      {getFieldDecorator('publicTime', {
                        initialValue: pageInfo.publicTime
                          ? moment(this.deFormatDate(pageInfo.publicTime))
                          : '',
                      })(
                        <DatePicker
                          placeholder="请选择"
                          onChange={(date, dateString) => {
                            this.dataPick(date, dateString, 'publicTime');
                          }}
                        />,
                      )}
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item name="legalRepresentative" label="法人代表:">
                      {getFieldDecorator('legalRepresentative', {
                        initialValue: pageInfo.legalRepresentative,
                      })(<Input placeholder="请输入" maxLength={25} />)}
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item name="registeredCapital" label="注册资本(万):">
                      {getFieldDecorator('registeredCapital', {
                        initialValue: pageInfo.registeredCapital,
                        rules: [
                          {
                            validator: (rule, value, callback) => {
                              const reg = /^[0-9\.\,]*$/g;
                              if (value && !reg.test(value)) {
                                callback('输入金额格式不对');
                              } else {
                                callback();
                              }
                            },
                          },
                        ],
                      })(
                        <InputNumber
                          style={{ width: '100%' }}
                          maxLength={20}
                          formatter={value => this.moneyFormat(value)}
                          parser={value => value.replace(/\$\s?|(,*)/g, '')}
                          placeholder="请输入"
                        />,
                      )}
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item label="币种:">
                      {getFieldDecorator('registeredCapitalCurrency', {
                        initialValue: pageInfo.registeredCapitalCurrency || 'CNY',
                      })(
                        <Select placeholder="请选择" showArrow>
                          {capitalCurrencyList &&
                            capitalCurrencyList.map(item => (
                              <Option key={item.code} value={item.code}>
                                {item.name}
                              </Option>
                            ))}
                        </Select>,
                      )}
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item name="contact" label="联系人:">
                      {getFieldDecorator('contact', { initialValue: pageInfo.contact })(
                        <Input placeholder="请输入" maxLength={25} />,
                      )}
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item name="contactNumber" label="联系电话:">
                      {getFieldDecorator('contactNumber', {
                        initialValue: pageInfo.contactNumber,
                        rules: [
                          {
                            validator: (rule, value, callback) => {
                              if (
                                (value &&
                                  (phoneReg.test(value) ||
                                    phoneReg2.test(value) ||
                                    numReg.test(value))) ||
                                !value
                              ) {
                                callback();
                              } else {
                                callback('格式校验失败!');
                              }
                            },
                          },
                        ],
                      })(<Input placeholder="请输入" maxLength={14} />)}
                    </Form.Item>
                  </Col>
                  <Col span={24}>
                    <Form.Item
                      name="businessScope"
                      label="经营范围:"
                      labelCol={{ span: 3 }}
                      wrapperCol={{ span: 21 }}
                    >
                      {getFieldDecorator('businessScope', {
                        initialValue: pageInfo.businessScope,
                        rules: [
                          {
                            required: customerType === '1',
                            message: '经营范围是必填项',
                          },
                        ],
                      })(
                        <TextArea
                          rows={4}
                          allowClear
                          maxLength={2000}
                          autoSize={{ minRows: 3, maxRows: 6 }}
                          placeholder="请输入2000字以内内容..."
                        />,
                      )}
                    </Form.Item>
                  </Col>
                  <Col span={24}>
                    <Form.Item
                      name="remark"
                      label="备注:"
                      labelCol={{ span: 3 }}
                      wrapperCol={{ span: 21 }}
                    >
                      {getFieldDecorator('remark', { initialValue: pageInfo.remark })(
                        <TextArea
                          rows={4}
                          allowClear
                          maxLength={2000}
                          autoSize={{ minRows: 3, maxRows: 6 }}
                          placeholder="请输入2000字以内内容..."
                        />,
                      )}
                    </Form.Item>
                  </Col>
                </Row>
              </div>
              <div
                style={{
                  display: customerType === '1' || customerType === undefined ? 'none' : 'block',
                }}
              >
                <Row>
                  <Col span={8}>
                    <Form.Item name="idType" label="证件类型:">
                      {getFieldDecorator('idType', {
                        initialValue: pageInfo.idType,
                        rules: [
                          {
                            required: customerType !== '1',
                            message: '证件类型是必填项',
                          },
                        ],
                      })(
                        <Select
                          placeholder="请选择"
                          showArrow
                          onChange={val => this.setState({ idType: val })}
                          name="idType"
                        >
                          {idTypeList &&
                            idTypeList.map(item => (
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
                      display: idType === '1007' ? 'inline-block' : 'none',
                    }}
                  >
                    <Form.Item name="otherIdType" label="其他证件类型:">
                      {getFieldDecorator('otherIdType', {
                        initialValue: pageInfo.otherIdType,
                        rules: [
                          {
                            required: idType === '1007',
                            message: '其他证件类型是必填项',
                          },
                        ],
                      })(<Input placeholder="请输入" maxLength={25} />)}
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item name="idNumber" label="证件号码:">
                      {getFieldDecorator('idNumber', {
                        initialValue: pageInfo.idNumber,
                        rules: [
                          {
                            required: customerType !== '1',
                            message: '证件号码是必填项',
                          },
                          {
                            validator: (rule, value, callback) => {
                              if (customerType === '1') {
                                callback();
                              } else if (value && idType === '1001' && !idCardReg.test(value)) {
                                callback('身份证号格式不正确!');
                              } else if (
                                value &&
                                idType === '1002' &&
                                !(PASSPORT1.test(value) || PASSPORT2.test(value))
                              ) {
                                callback('护照号码格式不正确!');
                              } else if (value && idType === '1003' && !HKMAKAO.test(value)) {
                                callback('港澳居民通行证号码格式不正确!');
                              } else if (
                                value &&
                                idType === '1004' &&
                                !(TAIWAN1.test(value) || TAIWAN2.test(value))
                              ) {
                                callback('台湾来往通行证号码格式不正确!');
                              } else {
                                callback();
                              }
                            },
                          },
                        ],
                      })(<Input placeholder="请输入" maxLength={18} />)}
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item name="sex" label="性别:">
                      {getFieldDecorator('sex', {
                        initialValue: pageInfo.sex,
                      })(
                        <Radio.Group name="sex">
                          <Radio value="0">男</Radio>
                          <Radio value="1">女</Radio>
                        </Radio.Group>,
                      )}
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item name="email" label="邮箱:">
                      {getFieldDecorator('email', {
                        initialValue: pageInfo.email,
                        rules: [
                          {
                            validator: (rule, value, callback) => {
                              if (value && !emailReg.test(value)) {
                                callback('邮箱格式错误');
                              } else {
                                callback();
                              }
                            },
                          },
                        ],
                      })(<Input placeholder="请输入" maxLength={50} />)}
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item name="contactNumber" label="联系电话:">
                      {getFieldDecorator('contactNumber', {
                        initialValue: pageInfo.contactNumber,
                        rules: [
                          {
                            validator: (rule, value, callback) => {
                              if (
                                (value &&
                                  (phoneReg.test(value) ||
                                    phoneReg2.test(value) ||
                                    numReg.test(value))) ||
                                !value
                              ) {
                                callback();
                              } else {
                                callback('格式校验失败!');
                              }
                            },
                          },
                        ],
                      })(<Input placeholder="请输入" maxLength={14} />)}
                    </Form.Item>
                  </Col>
                  <Col span={24}>
                    <Form.Item
                      name="remark"
                      label="备注:"
                      labelCol={{ span: 3 }}
                      wrapperCol={{ span: 21 }}
                    >
                      {getFieldDecorator('remark', { initialValue: pageInfo.remark })(
                        <TextArea
                          rows={4}
                          allowClear
                          maxLength={2000}
                          autoSize={{ minRows: 3, maxRows: 6 }}
                          placeholder="请输入2000字以内内容..."
                        />,
                      )}
                    </Form.Item>
                  </Col>
                </Row>
              </div>
            </Form>
            <div
              style={{
                display: JSON.stringify(pageInfo.proReportList) !== '[]' && code ? 'block' : 'none',
              }}
              className={styles.sonTableTitle}
            >
              项目申报信息
              <ReportModal
                onConfirm={this.addReport}
                data={{
                  productFilterOption: this.productFilterOption,
                  tradingPlacesList,
                }}
              />
            </div>
            <Table
              style={{
                display: JSON.stringify(pageInfo.proReportList) !== '[]' && code ? 'block' : 'none',
              }}
              columns={reportInfoColumns}
              dataSource={proReportList}
              bordered
              pagination={false}
            />
            <div
              style={{
                display:
                  JSON.stringify(pageInfo.proPublishInfoList) !== '[]' && code ? 'block' : 'none',
              }}
              className={styles.sonTableTitle}
            >
              项目发行信息
              <PublishModal
                onConfirm={this.addPublish}
                data={{
                  productFilterOption: this.productFilterOption,
                  listedPlateList: proPlateList,
                }}
              />
            </div>
            <Table
              style={{
                display:
                  JSON.stringify(pageInfo.proPublishInfoList) !== '[]' && code ? 'block' : 'none',
              }}
              columns={publishInfoColumns}
              dataSource={proPublishInfoList}
              bordered
              pagination={false}
            />
            <div className={styles.sonTableTitle}>
              项目参与人{' '}
              <ModalForm
                onConfirm={this.onParticipantConfirm}
                data={{
                  productFilterOption: this.productFilterOption,
                  proParticipantList: newProParticipantList,
                }}
              />
            </div>
            <Table columns={columns} dataSource={proParticipants} bordered pagination={false} />
            <div className={styles.sonTableTitle}>
              项目成员信息{' '}
              <ProMemberModal
                onConfirm={this.onProMemberConfirm}
                data={{
                  productFilterOption: this.productFilterOption,
                  idTypeList,
                }}
              />
            </div>
            <Table
              columns={memberColumn}
              scroll={{ x: 1300 }}
              dataSource={proMembers}
              bordered
              pagination={false}
            />
          </div>
        </Card>
      </>
    );
  }
}

const WrappedSingleForm = errorBoundary(
  linkHoc()(
    Form.create()(
      connect(({ addProjectInfo, loading }) => ({
        addProjectInfo,
        loading: loading.effects['addProjectInfo/searchTableData'],
      }))(AddProjectInfo),
    ),
  ),
);
export default WrappedSingleForm;
