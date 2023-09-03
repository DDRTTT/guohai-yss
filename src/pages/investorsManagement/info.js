/**
 *Create on 2020/9/29.
 */
import React from 'react';
import { connect } from 'dva';
import { nsHoc } from '../../utils/hocUtil';
import {
  Button,
  Card,
  Col,
  DatePicker,
  Form,
  Icon,
  Input,
  message,
  Modal,
  Row,
  Select,
  Spin,
  Table,
  Tabs,
  TreeSelect,
  Upload,
} from 'antd';
import BaseCrudComponent from '@/components/BaseCrudComponent';
import styles from './index.less';
import moment from 'moment';
import { errorBoundary } from '@/layouts/ErrorBoundary';
import { getAuthToken } from '@/utils/session';
import Action from '@/utils/hocUtil';

const dropdownList = {
  //证件类型、机构证件类型、产品证件类型、投资者风险等级、受理方式、账单邮寄方式、账单寄送频率、使用的交易手段、推荐人类型
  codeList: 'TA_IDTPTP, TA_IDTP, TA_PROTP, InvestorRiskLevel, TA_ACCPTMD, TA_STATEMENTFLAG, TA_DELIVERTYPE, tradingMethod, referrerType',
};
const FormItem = Form.Item;
const Search = Input.Search;
const { TextArea } = Input;
const TabPane = Tabs.TabPane;
const { Option } = Select;
const SHOW_PARENT = TreeSelect.SHOW_PARENT;
const token = getAuthToken();
const uploadProps = {
  action: '/ams/ams-file-service/fileServer/uploadFile',
  name: 'file',
  headers: {
    Token: token,
  },
};

@errorBoundary
@nsHoc({ namespace: 'myInvestorInfo' })
@Form.create()
@connect(state => ({
  myInvestorInfo: state.myInvestorInfo,
}))

export default class myInvestorInfo extends BaseCrudComponent {

  state = {
    ID: -1,
    selectedRows: [],
    switchStatus: false,
    currentPage: 1,
    D_currentPage: 1,
    pageSize: 10,
    D_pageSize: 10,
    I_currentPage: 1,
    I_pageSize: 10,
    G_currentPage: 1,
    G_pageSize: 10,
    fuzzySearchVal: '',
    defaultActiveKey: JSON.parse(sessionStorage.getItem('obj')).defaultActiveKey,
    cardData: {
      unit: {
        basic: true,
        communication: true,
        aptitude: true,
        other: true,
      },
      institution: {
        basic: true,
        agent: true,
        communication: true,
        institution: true,
        director: true,
        aptitude: true,
        other: true,
      },
      product: {
        basic: true,
        agent: true,
        communication: true,
        product: true,
        institution: true,
        aptitude: true,
        other: true,
      },
    },
    type: JSON.parse(sessionStorage.getItem('obj')).type,
    fund: true,
    deal: true,
    addVisible: false,
    delVisible: false,
    // opening: false,
    TabPaneVisible: false,
    selectedRowKeys: [],
    dealDataRow: [],
    institutionRow: [],
    dealUpdate: false,
    dealId: 0,
    record: {},
    variable: '',
    addBtn: false,
    ocustno: '',
    clearacct: '',
    need: true,
    inputAction: '',
    isGetBalance: false,
    updateBtn: false,
    accountFormItems: false,
    dealFormItems: false,
    fileList: [],
    annexesObj: {},
    fileType: 'InvestorInfo',
    annexesArr: [],
    accessories: [],
    bankno: 0,
    banknetpointname: '',
    institutionDelVisible: false,
    institutionVal: '',
    btnShow: {
      unit: {
        basic: true,
        communication: true,
        aptitude: true,
        other: true,
      },
      institution: {
        basic: true,
        agent: true,
        communication: true,
        institution: true,
        director: true,
        aptitude: true,
        other: true,
      },
      product: {
        basic: true,
        agent: true,
        communication: true,
        product: true,
        institution: true,
        aptitude: true,
        other: true,
      },
    },

  };

  componentDidMount() {
    const { dispatch, namespace } = this.props;
    const { D_currentPage, D_pageSize } = this.state;
    const id = JSON.parse(sessionStorage.getItem('obj')).id;
    const name = JSON.parse(sessionStorage.getItem('obj')).name;
    const cardType = JSON.parse(sessionStorage.getItem('obj')).cardType;
    const cardNum = JSON.parse(sessionStorage.getItem('obj')).cardNum;
    //投资人信息
    dispatch({
      type: `${namespace}/getDataWithId`,
      payload: {
        id: id,
      },
    });
    //初始化词汇字典下拉
    dispatch({
      type: `${namespace}/queryCriteria`,
      payload: {
        codeList: dropdownList.codeList,
      },
    });
    //初始化销售机构下拉
    dispatch({
      type: `${namespace}/getFdistributorcode`,
      payload: {
        code: 'saleorginfo',
        currentPage: 1,
        pageSize: 10,
      },
    });
    //获取机构类型
    dispatch({
      type: `${namespace}/getOrgType`,
      payload: {
        fcode: 'orgType',
      },
    });
    //获取产品备案机构
    dispatch({
      type: `${namespace}/getProductRecordingAgency`,
      payload: {
        fcode: 'productRecordingAgency',
      },
    });
    //管理人名称(管理人机构)
    dispatch({
      type: `${namespace}/getOrgData`,
      payload: {
        orgTypeList: 'TG, GL',
      },
    });
    // 产品类别
    dispatch({
      type: `${namespace}/getProType`,
    });
  }

  componentWillReceiveProps(nextProps) {
    const { need } = this.state;
    const dealBtn = nextProps.myInvestorInfo.dealSubBtn;
    const addDealStatus = nextProps.myInvestorInfo.addDealStatus;
    const annexes = nextProps.myInvestorInfo.annexes;
    if (!dealBtn) {
      this.setState({
        delVisible: false,
      })
    }
    if (addDealStatus === 'ocustno' && need) {
      this.setState({
        inputAction: 'ocustno',
        addBtn: true,
        need: false,
      })
    }
    if (addDealStatus === 'clearacct' && need) {
      this.setState({
        inputAction: 'clearacct',
        addBtn: true,
        need: false,
      })
    }
    if (Object.keys(annexes).length > 0) {
      this.setState({
        annexesObj: annexes,
      })
    }
  }

  /**下拉**/
  getDropdownData = (data, flag = false, sign = 0) => {
    if (!data) {
      data = {};
      data.data = [];
    }
    const e = data;
    if (e) {
      let children = [];
      for (let key of e) {
        children.push(<Option key={key.code} value={key.code}>{key.name}</Option>);
      }
      return (
        <Select
          optionFilterProp={'children'}
          disabled={sign === 1 ? true : false}
          onChange={(value, option) => {
            flag ? this.setState({ ID: +value }) : this.setState({ ID: -1 });
          }}
        >
          {children}
        </Select>
      )
    }
  };

  getforgtype = (treeData) => {
    const tProps = {
      treeData,
      onChange: this.onChange,
      multiple: false,
      showCheckedStrategy: SHOW_PARENT,
    };
    return (<TreeSelect {...tProps} />);
  };

  agentSelect = (orgData) => {
    let children = [];
    for (let key of orgData) {
      children.push(<Option key={key.text} value={key.text}>{key.value}</Option>);
    }
    return (
      <Select style={{ width: '100%' }}
        optionFilterProp={"children"}
      >
        {children}
      </Select>
    )
  };

  orgTypeSelect = (data) => {
    let children = [];
    for (let key of data) {
      children.push(<Option key={key.id} value={key.code}>{key.name}</Option>);
    }
    return (
      <Select style={{ width: '100%' }}
        optionFilterProp={"children"}
      >
        {children}
      </Select>
    )
  };

  renderTheme = (data) => {
    return (
      <div>
        <h3>{data.name}<span>{data.investorType === 0 ? '机构' : (data.investorType === 1 ? '个人' : '产品')}</span></h3>
        <Row
          gutter={{ md: 8, lg: 24, xl: 48 }}
          className={styles.itemBox}
        >
          <Col xxl={6} md={12} sm={24}>
            <label>证件类型：</label><span>{data.cardTypeName === undefined ? '--' : data.cardTypeName}</span>
          </Col>
          <Col xxl={6} md={12} sm={24}>
            <label>经办人：</label><span>{data.agentName === undefined ? '--' : data.agentName}</span>
          </Col>
          <Col xxl={6} md={12} sm={24}>
            <label>邀请时间：</label><span>{data.inviteTime === undefined ? '--' : data.inviteTime}</span>
          </Col>
          <Col xxl={6} md={12} sm={24}>
            <label className={styles.accountStatus}>账号状态</label>
          </Col>
        </Row>
        <Row
          gutter={{ md: 8, lg: 24, xl: 48 }}
          className={styles.itemBox}
        >
          <Col xxl={6} md={12} sm={24}>
            <label>证件编号：</label><span>{data.cardNum === undefined ? '--' : data.cardNum}</span>
          </Col>
          <Col xxl={6} md={12} sm={24}>
            <label>手机号码：</label><span>{data.phone === undefined ? '--' : data.phone}</span>
          </Col>
          <Col xxl={6} md={12} sm={24}>
            <label>注册时间：</label><span>{data.regTime === undefined ? '--' : data.regTime}</span>
          </Col>
          <Col xxl={6} md={12} sm={24}>
            <label className={styles.statusVal}>{data.regStatus === undefined ? '--' : data.statusName}</label>
          </Col>
        </Row>
        <Row
          gutter={{ md: 8, lg: 24, xl: 48 }}
          className={styles.itemBox}
        >
          <Col xxl={6} md={12} sm={24}>
            <label>证件有效期：</label><span>{data.endDate === undefined ? '--' : data.endDate}</span>
          </Col>
          <Col xxl={6} md={12} sm={24}>
            <label>电子邮箱：</label><span>{data.email === undefined ? '--' : data.email}</span>
          </Col>
        </Row>
      </div>
    );
  };

  callback = (key) => {
    this.setState({
      defaultActiveKey: key,
    });
  };

  onoffCard = (obj, val) => {
    const { cardData } = this.state;
    cardData[obj][val] = !cardData[obj][val];
    this.setState({
      cardData: JSON.parse(JSON.stringify(cardData)),
    });
  };

  updateCard = (obj, val) => {
    const { btnShow } = this.state;
    btnShow[obj][val] = !btnShow[obj][val];
    this.setState({
      btnShow: JSON.parse(JSON.stringify(btnShow)),
      TabPaneVisible: true,
      updateBtn: true,
    });
  };

  cancel = (obj, val) => {
    const { btnShow } = this.state;
    const { form } = this.props;
    btnShow[obj][val] = !btnShow[obj][val];
    this.setState({
      btnShow: JSON.parse(JSON.stringify(btnShow)),
      TabPaneVisible: false,
      updateBtn: false,
    });
    form.resetFields();
  };

  btnArea = (obj, val) => {
    const { cardData, updateBtn } = this.state;
    return (
      <span>
        <a style={{ textDecoration: 'none' }} disabled={updateBtn} onClick={() => this.updateCard(obj, val)}>修改</a>
        <a style={{ marginLeft: 10, marginRight: 5, textDecoration: 'none' }}
          onClick={() => this.onoffCard(obj, val)}>{cardData[obj][val] ? '收起' : '展开'}<Icon
            style={{ verticalAlign: 'middle' }} type={cardData[obj][val] ? 'down' : 'up'} /></a>
      </span>
    );
  };

  handleStandardTableChange = (pagination) => {
    const { dispatch, namespace } = this.props;
    const id = JSON.parse(sessionStorage.getItem('obj')).id;
    this.setState({
      D_pageSize: pagination.pageSize,
      D_currentPage: pagination.current,
    }, () => {
      dispatch({
        type: `${namespace}/getDealTable`,
        payload: {
          par: {
            currentPage: this.state.D_currentPage,
            pageSize: this.state.D_pageSize,
          },
          body: [
            {
              paramKey: 'investorId',
              paramValue: id,
              condition: 'EQUAL',
            },
          ],
        },
      });
    });
  };

  OperationTableChange = (pagination) => {
    const { dispatch, namespace } = this.props;
    const id = JSON.parse(sessionStorage.getItem('obj')).id;
    this.setState({
      pageSize: pagination.pageSize,
      currentPage: pagination.current,
    }, () => {
      dispatch({
        type: `${namespace}/getOperationTable`,
        payload: {
          par: {
            currentPage: this.state.currentPage,
            pageSize: this.state.pageSize,
          },
          body: [
            {
              paramKey: 'investorId',
              paramValue: id,
              condition: 'EQUAL',
            },
          ],
        },
      });
    });
  };

  getInstructionQuery = (val) => {
    const { dispatch, namespace } = this.props;
    this.setState({
      fuzzySearchVal: val,
    }, () => {
      dispatch({
        type: `${namespace}/getOperationTable`,
        payload: {
          par: {
            currentPage: 1,
            pageSize: 10,
          },
          body: [
            {
              paramKey: 'param',
              paramValue: val,
              condition: 'EQUAL',
            },
          ],
        },
      });
    });
  };

  institutionQuery = (val) => {
    const { dispatch, namespace } = this.props;
    this.setState({
      institutionVal: val,
    }, () => {
      dispatch({
        type: `${namespace}/getFdistributorcode`,
        payload: {
          code: 'saleorginfo',
          currentPage: 1,
          pageSize: 10,
          param: val,
        },
      });
    });
  };

  onSearch = () => {
    return (
      <Search
        placeholder="请输入"
        onSearch={(val) => this.getInstructionQuery(val)}
        style={{ width: 242, height: 32 }}
      />
    );
  };

  updateFields = (e, arr, obj, val) => {
    e.preventDefault();
    const { dispatch, form, namespace, myInvestorInfo: { cardType, cardNum } } = this.props;
    form.validateFields(err => {
      if (err) return;
      let formItems = form.getFieldsValue(arr);
      const dateArr = ['endDate', 'foundingTime', 'recordsTime', 'orgEndDate', 'agentEndDate', 'corporationEndDate'];
      Object.keys(formItems).forEach((key) => {
        if (dateArr.includes(key) && formItems[key]) {
          formItems[key] = +formItems[key].format('YYYYMMDD');
        }
      });
      formItems.id = JSON.parse(sessionStorage.getItem('obj')).id;
      formItems.cardType = cardType;
      formItems.cardNum = cardNum;

      dispatch({
        type: `${namespace}/investorMessageUpdate`,
        payload: {
          formItems,
          val,
        },
      });
      const { btnShow } = this.state;
      btnShow[obj][val] = !btnShow[obj][val];
      this.setState({
        btnShow: JSON.parse(JSON.stringify(btnShow)),
        TabPaneVisible: false,
        updateBtn: false,
      })
    });


  };

  fundContentShow = () => {
    const { fund } = this.state;
    this.setState({
      fund: !fund,
    })
  };

  fundContentShowBtn = () => {
    const { fund } = this.state;
    return (
      <span>
        <a style={{ marginLeft: 10, marginRight: 5, textDecoration: 'none' }} onClick={this.fundContentShow}>{fund ? '收起' : '展开'}<Icon style={{ verticalAlign: 'middle' }} type={fund ? 'down' : 'up'} /></a>
      </span>
    )
  };

  dealContentShow = () => {
    const { deal } = this.state;
    this.setState({
      deal: !deal,
    })
  };

  dealContentShowBtn = () => {
    const { deal } = this.state;
    return (
      <a style={{ marginLeft: 10, marginRight: 5, textDecoration: 'none' }} onClick={this.dealContentShow}>{deal ? '收起' : '展开'}<Icon style={{ verticalAlign: 'middle' }} type={deal ? 'down' : 'up'} /></a>
    )
  };

  add = () => {
    const { dispatch, namespace, form } = this.props, { annexesObj } = this.state;
    let hasAnnex = false, hasError = false;
    form.validateFields(err => {
      if (err) {
        Object.keys(err).forEach(item => {
          message.warn(`请先完善投资人信息：${err[item].errors[0].message}`);
        });
        hasError = true;
      }
    });
    Object.keys(annexesObj).forEach(item => {
      if (annexesObj[item].length > 0) {
        hasAnnex = true;
      }
    });
    if (!hasAnnex) {
      message.warn(`请先完善附件管理：请上传附件`);
    }
    if (!hasError && hasAnnex) {
      form.resetFields();
      dispatch({
        type: `${namespace}/changeDealAddModal`,
        payload: true,
      });
      this.setState({
        // accountFormItems: false,
        dealFormItems: true,
      });
    }
  };

  addDealCode = (e, par) => {
    e.preventDefault();
    const id = JSON.parse(sessionStorage.getItem('obj')).id;
    const { dealUpdate, dealId, D_pageSize, D_currentPage, banknetpointname, bankno } = this.state;
    const { dispatch, form, namespace } = this.props;
    form.validateFields((err) => {
      if (err) return;
      let dealItems = form.getFieldsValue(par);
      this.setState({
        ocustno: dealItems.ocustno,
        clearacct: dealItems.clearacct,
        need: true,
      });
      dealItems.investorId = id;
      dealItems.banknetpointname = banknetpointname;
      dealItems.branchCode = bankno;
      if (dealUpdate) {
        dealItems.id = dealId;
        dispatch({
          type: `${namespace}/investorDealUpdate`,
          payload: dealItems,
        })
      } else {
        dispatch({
          type: `${namespace}/investorDealAdd`,
          payload: {
            queryPar: {
              par: {
                currentPage: D_currentPage,
                pageSize: D_pageSize,
              },
              body: [
                {
                  paramKey: 'investorId',
                  paramValue: id,
                  condition: 'EQUAL',
                }
              ]
            },
            body: [dealItems],
            par: {
              currentPage: 1,
              pageSize: 10,
              investorId: id,
            }
          },
        })
      }
    });
  };

  ocustnoOninput = (e) => {
    const { ocustno, inputAction } = this.state;
    if (inputAction === 'ocustno') {
      if (ocustno == e.target.value) {
        this.setState({
          addBtn: true,
        })
      } else {
        this.setState({
          addBtn: false,
        })
      }
    }
  };

  clearacctOninput = (e) => {
    const { clearacct, inputAction } = this.state;
    if (inputAction === 'clearacct') {
      if (clearacct == e.target.value) {
        this.setState({
          addBtn: true,
        })
      } else {
        this.setState({
          addBtn: false,
        })
      }
    }
  };

  bankSplit = (val, option) => {
    this.setState({
      banknetpointname: option.props.children,
      bankno: val,
    })
  };

  bank = (bankData) => {
    return (
      <Select
        style={{ width: '100%' }}
        onChange={this.bankSplit}
      >
        {bankData.map(cardType => <Option key={cardType.code}>{cardType.name}</Option>)}
      </Select>
    )
  };

  addDealMessage = (bankData) => {
    const { dealUpdate, record, addBtn } = this.state;
    const { myInvestorInfo: { addDealBtnLoading } } = this.props;
    const { getFieldDecorator } = this.props.form;
    const addForm = (
      <Form onSubmit={(e) => this.addDealCode(e, ['accountNumber', 'clearacct', 'bankno', 'acctname'])} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={12} sm={24}>
            <FormItem label="交易账号">
              {getFieldDecorator('accountNumber', {
                initialValue: dealUpdate ? record.ocustno : "",
                rules: [{
                  required: true,
                  message: '请填写正确的交易账号(不超过17位数字)',
                  pattern: /^\d{1,17}$/,
                }],
              })(
                <Input placeholder="请输入" onInput={this.ocustnoOninput} />
              )}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem label="银行卡号">
              {getFieldDecorator('clearacct', {
                initialValue: dealUpdate ? record.clearacct : "",
                rules: [
                  {
                    required: true,
                    message: '请填写正确的银行卡号',
                    pattern: /^\d{13,19}$/,
                  },
                ],
              })(
                <Input placeholder="请输入" onInput={this.clearacctOninput} />
              )}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem label="开户行">
              {getFieldDecorator('bankno', {
                initialValue: dealUpdate ? record.bankno : "",
                rules: [{
                  required: true,
                  message: '开户行不能为空',
                }],
              })(
                this.bank(bankData)
              )}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem label="开户名">
              {getFieldDecorator('acctname', {
                initialValue: dealUpdate ? record.acctname : "",
                rules: [{
                  required: true,
                  max: 60,
                  message: '开户名不能为空且长度不能超过60位',
                }],
              })(
                <Input placeholder="请输入" />
              )}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={24} sm={24}>
            <div style={{ textAlign: 'center', paddingTop: 20 }}>
              <Button type="primary" htmlType="submit" loading={addDealBtnLoading} disabled={addBtn} style={{ margin: 10 }}>确定</Button>
              <Button onClick={this.setModalAddVisible} style={{ margin: 10 }}>取消</Button>
            </div>
          </Col>
        </Row>
      </Form>
    );
    return (
      <div className={styles.tableListForm1}>
        {addForm}
      </div>
    )
  };

  setModalAddVisible = () => {
    const { form, dispatch, namespace, myInvestorInfo: { opening } } = this.props;
    form.resetFields();
    dispatch({
      type: `${namespace}/changeDealAddModal`,
      payload: false,
    });
    this.setState({
      addBtn: false,
      dealFormItems: false,
      accountFormItems: opening,
    })
  };

  setModalDelVisible = () => {
    const { dispatch, namespace } = this.props;
    this.setState({
      delVisible: false,
    }, () => {
      dispatch({
        type: `${namespace}/resetDealSubBtn`,
        payload: false,
      })
    });
  };

  setInstitution = () => {
    this.setState({
      institutionDelVisible: false,
    })
  };

  setOpening = () => {
    const { form, dispatch, namespace } = this.props;
    this.setState({
      // opening: false,
      accountFormItems: false,
      dealFormItems: false,
      institutionRow: [],
    });
    dispatch({
      type: `${namespace}/changeAccountModal`,
      payload: false,
    });
    dispatch({
      type: `${namespace}/resetAccountLoading`,
      payload: false,
    });
    form.resetFields();
  };


  openAccount = () => {
    const id = JSON.parse(sessionStorage.getItem('obj')).id;
    const { dispatch, namespace, form } = this.props, { annexesObj } = this.state;
    let hasAnnex = false, hasError = false;
    form.validateFields(err => {
      if (err) {
        Object.keys(err).forEach(item => {
          message.warn(`请先完善投资人信息：${err[item].errors[0].message}`);
        });
        hasError = true;
      }
    });
    Object.keys(annexesObj).forEach(item => {
      if (annexesObj[item].length > 0) {
        hasAnnex = true;
      }
    });
    if (!hasAnnex) {
      message.warn(`请先完善附件管理：请上传附件`);
    }
    if (!hasError && hasAnnex) {
      this.setState({
        // opening: true,
        isGetBalance: false,
        dealFormItems: false,
        accountFormItems: true,
      });
      dispatch({
        type: `${namespace}/changeAccountModal`,
        payload: true,
      });
      dispatch({
        type: `${namespace}/getFilterDealData`,
        payload: {
          currentPage: 1,
          pageSize: 10,
          investorId: id,
        },
      });
    }
  };

  openAccountSubmit = (e) => {
    // e.preventDefault();
    const id = JSON.parse(sessionStorage.getItem('obj')).id;
    const { dealDataRow, institutionRow } = this.state;
    const { dispatch, form, namespace, myInvestorInfo: { cardType, cardNum } } = this.props;
    form.validateFields((err) => {
      if (err) return;
      if (institutionRow.length === 0) {
        message.warn('请填写销售机构');
        return;
      }
      if (dealDataRow.length === 0) {
        message.warn('请选择一个交易账户');
        return;
      }
      let formItems = {};
      formItems.accountId = dealDataRow[0].id;
      formItems.cardType = cardType;
      formItems.cardNum = cardNum;
      formItems.investorId = id;
      formItems.distributorcode = institutionRow[0].code;
      formItems.netNo = institutionRow[0].code;
      dispatch({
        type: `${namespace}/applyAccount`,
        payload: formItems,
      })
    });
  };

  showInstitutionTable = () => {
    this.setState({
      institutionDelVisible: true,
    })
  };

  tableChange = (pagination) => {
    const id = JSON.parse(sessionStorage.getItem('obj')).id;
    const { dispatch, namespace } = this.props;
    this.setState({
      G_currentPage: pagination.currentPage,
      G_pageSize: pagination.pageSize,
    }, () => {
      dispatch({
        type: `${namespace}/getFilterDealData`,
        payload: {
          currentPage: pagination.current,
          pageSize: pagination.pageSize,
          investorId: id,
        }
      })
    })

  };

  openAccountShow = (data, dealColumns) => {
    const { myInvestorInfo: { applyAccountLoading, opening, filterDealData, filterLoading, G_currentPage } } = this.props;
    const rowSelection = {
      type: 'radio',
      onChange: (selectedRowKeys, selectedRows) => {
        this.setState({
          dealDataRow: selectedRows,
        })
      }
    };
    const paginationProps = {
      current: G_currentPage,
      showQuickJumper: true,
      total: filterDealData.data.total,
    };

    const columns = dealColumns.slice(0, 5);
    const { getFieldDecorator } = this.props.form;
    const { accountFormItems, institutionRow } = this.state;
    return (
      <div className={styles.openAccountBox}>
        <h3>{data.name}<span>{data.investorType === 0 ? '机构' : (data.investorType === 1 ? '个人' : '产品')}</span></h3>
        <div className={styles.layerItemBox}>
          <div>
            <label>证件类型：</label><span>{data.cardTypeName}</span>
          </div>
          <div>
            <label>经办人：</label><span>{data.agentName}</span>
          </div>
          <div>
            <label>邀请时间：</label><span>{data.inviteTime}</span>
          </div>
        </div>
        <div className={styles.layerItemBox}>
          <div>
            <label>证件编号：</label><span>{data.cardNum}</span>
          </div>
          <div>
            <label>手机号码：</label><span>{data.phone}</span>
          </div>
          <div>
            <label>注册时间：</label><span>{data.regTime}</span>
          </div>
        </div>
        <div className={styles.layerItemBox}>
          <div>
            <label>证件有效期：</label><span>{data.endDate}</span>
          </div>
          <div>
            <label>电子邮箱：</label><span>{data.email}</span>
          </div>
        </div>
        <div className={styles.layerItemBox} style={{ margin: '10px 0' }}>
          <div>
            <label>请补全以下信息：</label>
          </div>
        </div>
        <div className={styles.tableListForm}>
          <Form layout="inline">
            <div className={styles.rowBoxP}>
              <div>
                <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                  <Col md={12} sm={24}>
                    <label className={styles.major}>销售机构：</label>
                    <span className={styles.institutionBox} onClick={this.showInstitutionTable}>{institutionRow.length === 1 ? institutionRow[0].name : ''}</span>
                  </Col>
                </Row>
              </div>
            </div>
            <div className={styles.layerItemBox} style={{ marginTop: 10 }}>
              <div>
                <label>请选择交易账户信息：</label>
              </div>
            </div>
            {opening ?
              <Spin spinning={filterLoading}>
                <Table
                  rowKey="id"
                  rowSelection={rowSelection}
                  columns={columns}
                  dataSource={filterDealData.data.rows}
                  pagination={paginationProps}
                  onChange={this.tableChange}
                  bordered={true}
                  size="small"
                />
              </Spin>
              : null}
            <Action key="myInvestor:accountAdd0" code="myInvestor:accountAdd">
              <Button type="dashed" style={{ width: '80%', margin: filterDealData.data.total > 0 ? '0 10%' : '20px 10% 0' }} onClick={this.add}><Icon type="plus" />新增交易账户</Button>
            </Action>
            <div className={styles.openQueryBtn} style={{ marginTop: 20 }}>
              <Button onClick={this.setOpening}>取消</Button>
              <Button loading={applyAccountLoading} type="primary" htmlType="submit"
                onClick={() => this.openAccountSubmit()}>开立账户</Button>
            </div>
          </Form>
        </div>
      </div>
    )
  };

  dealUpdate = (val, record) => {
    this.setState({
      addVisible: true,
      dealUpdate: true,
      dealId: val,
      record,
    })
  };

  delThisDeal = () => {
    const { dealId, D_pageSize, D_currentPage } = this.state;
    const { dispatch, namespace } = this.props;
    const id = JSON.parse(sessionStorage.getItem('obj')).id;
    let idList = [];
    idList.push(dealId);
    dispatch({
      type: `${namespace}/investorDealDel`,
      payload: {
        queryPar: {
          par: {
            currentPage: D_currentPage,
            pageSize: D_pageSize,
          },
          body: [
            {
              paramKey: 'investorId',
              paramValue: id,
              condition: 'EQUAL',
            }
          ]
        },
        body: {
          idList: idList.join(','),
        },
      }
    })
  };

  undo = () => {
    const { dealId, D_pageSize, D_currentPage } = this.state;
    const { dispatch, namespace } = this.props;
    const id = JSON.parse(sessionStorage.getItem('obj')).id;
    dispatch({
      type: `${namespace}/investorDealUndo`,
      payload: {
        queryPar: {
          par: {
            currentPage: D_currentPage,
            pageSize: D_pageSize,
          },
          body: [
            {
              paramKey: 'investorId',
              paramValue: id,
              condition: 'EQUAL',
            }
          ]
        },
        par: {
          accountId: dealId,
          investorId: id,
        }
      }
    })
  };

  register = () => {
    const { dealId, D_pageSize, D_currentPage } = this.state;
    const { dispatch, namespace } = this.props;
    const id = JSON.parse(sessionStorage.getItem('obj')).id;
    dispatch({
      type: `${namespace}/investorDealRegister`,
      payload: {
        queryPar: {
          par: {
            currentPage: D_currentPage,
            pageSize: D_pageSize,
          },
          body: [
            {
              paramKey: 'investorId',
              paramValue: id,
              condition: 'EQUAL',
            }
          ]
        },
        par: {
          accountId: dealId,
          investorId: id,
        }
      }
    })
  };

  delTip = () => {
    const { myInvestorInfo: { dealSubBtn } } = this.props;
    const { variable } = this.state;
    return (
      <div>
        <p className={styles.tipText}>
          <Icon
            style={{ color: '#3384D5', marginRight: 10 }}
            type="info-circle"
            theme="filled"
          />
          确认{variable}选中的数据吗？
        </p>
        <div className={styles.tipBtnBox}>
          <Button className={styles.btnStyleLong}
            type="primary" style={{ marginLeft: 10 }}
            onClick={variable === '登记' ? this.register : (variable === '撤销' ? this.undo : this.delThisDeal)}
            loading={dealSubBtn}
          >确定</Button>
          <Button className={styles.btnStyleLong} onClick={this.setModalDelVisible}>取消</Button>
        </div>
      </div>
    );
  };

  delTipShow = (val, variable) => {
    this.setState({
      delVisible: true,
      dealId: val,
      variable: variable,
    })
  };

  operationBtn = (val, record) => {
    const { myInvestorInfo: { fundData } } = this.props;
    if (record.taApplyName === '已登记') {
      return (
        <span>
          <Action key="myInvestor:accountdeleteapply0" code="myInvestor:accountdeleteapply">
            <a onClick={() => this.delTipShow(val, '撤销')}>撤销</a>
          </Action>
        </span>
      )
    }
    if (record.taApplyName === '登记中') {
      return (
        <span>
          <Action key="myInvestor:accountregisteapply0" code="myInvestor:accountregisteapply">
            <a style={{ margin: '0 5px' }} className={styles.notAllowed}>登记</a>
          </Action>
          <Action key="myInvestor:accountDel0" code="myInvestor:accountDel">
            <a style={{ margin: '0 5px' }} className={styles.notAllowed}>删除</a>
          </Action>
        </span>
      )
    }
    if (record.taApplyName === '登记失败' || record.taApplyName === '已撤销' || record.taApplyName === '未登记') {
      return (
        <span>
          <Action key="myInvestor:accountregisteapply" code="myInvestor:accountregisteapply">
            {fundData.applyStatusName === '已开立' ? <a style={{ margin: '0 5px' }} onClick={() => this.delTipShow(val, '登记')}>登记</a> : <a style={{ margin: '0 5px' }} className={styles.notAllowed} title={'请先开立基金账户'}>登记</a>}
          </Action>
          <Action key="myInvestor:accountDel1" code="myInvestor:accountDel">
            <a style={{ color: '#f5222d', margin: '0 5px' }} onClick={() => this.delTipShow(val, '删除')}>删除</a>
          </Action>
        </span>
      )
    }
    if (record.taApplyName === '撤销中') {
      return (
        <span>
          <Action key="myInvestor:accountdeleteapply1" code="myInvestor:accountdeleteapply">
            <a style={{ margin: '0 5px' }} className={styles.notAllowed}>撤销</a>
          </Action>
          <Action key="myInvestor:accountDel2" code="myInvestor:accountDel">
            <a style={{ margin: '0 5px' }} className={styles.notAllowed}>删除</a>
          </Action>
        </span>
      )
    }
    if (record.taApplyName === '撤销失败') {
      return (
        <span>
          <Action key="myInvestor:accountdeleteapply2" code="myInvestor:accountdeleteapply">
            <a style={{ margin: '0 5px' }} onClick={() => this.delTipShow(val, '撤销')}>撤销</a>
          </Action>

          <Action key="myInvestor:accountDel3" code="myInvestor:accountDel">
            <a style={{ color: '#f5222d', margin: '0 5px' }} onClick={() => this.delTipShow(val, '删除')}>删除</a>
          </Action>
        </span>
      )
    }
  };

  fundAccountQuery = () => {
    const id = JSON.parse(sessionStorage.getItem('obj')).id;
    const { dispatch, namespace } = this.props;
    dispatch({
      type: `${namespace}/getFundAccount`,
      payload: {
        investorId: id,
      }
    });
    this.setState({
      isGetBalance: false,
    })
  };

  //控制上传文件大小 不可超过5M
  beforeUpload = (file) => {
    const isLt2M = (file.size / 1024 / 1024) < 50;
    if (!isLt2M) {
      message.error('文件不能大于50M');
    }
    return isLt2M;
  };

  remove = (e) => {
    const { accessories, annexesObj } = this.state;
    let annexesObjIndex = 0, accessoriesIndex = 0;
    annexesObj[e.fileType].forEach((item, i) => {
      if (e.uid === item.uid) {
        annexesObjIndex = i;
      }
    });
    annexesObj[e.fileType].splice(annexesObjIndex, 1);
    accessories.forEach((item, i) => {
      if (e.response.data === item.code) {
        accessoriesIndex = i;
      }
    });
    accessories.splice(accessoriesIndex, 1);
    this.setState({
      annexesObj: JSON.parse(JSON.stringify(annexesObj)),
      accessories: JSON.parse(JSON.stringify(accessories)),
    });
  };

  handleSelectChange = (value, Option) => {
    this.setState({
      fileType: value,
    });
  };

  uploadSubmit = () => {
    const { accessories } = this.state;
    const { dispatch, namespace } = this.props;
    dispatch({
      type: `${namespace}/updateAccessories`,
      payload: accessories,
    });
  };

  handleFileChange = (info) => {
    const id = JSON.parse(sessionStorage.getItem('obj')).id;
    const { fileType, annexesObj, accessories } = this.state;
    let { fileList } = info;

    fileList = fileList.filter((file) => {
      if (file.response) {
        return file.response.status === 200;
      } else if (file.status) {
        return file.status;
      }
      return true;
    });
    if (info.file.status === 'done') {
      if (info.file.response.status === 200) {
        message.success(info.file.name + '上传成功');
        info.file.fileType = fileType;
        switch (fileType) {
          case 'InvestorInfo':
            annexesObj.InvestorInfo.push(info.file);
            break;
          case 'ManagerInfo':
            annexesObj.ManagerInfo.push(info.file);
            break;
          case 'ProductInfo':
            annexesObj.ProductInfo.push(info.file);
            break;
          case 'OrganizationInfo':
            annexesObj.OrganizationInfo.push(info.file);
            break;
          case 'CorporateInfo':
            annexesObj.CorporateInfo.push(info.file);
            break;
          case 'QualificationInfo':
            annexesObj.QualificationInfo.push(info.file);
            break;
        }
        this.setState({ annexesObj: JSON.parse(JSON.stringify(annexesObj)) });
        accessories.push({
          id: info.uid,
          investorId: id,
          name: info.file.name,
          code: info.file.response.data,
          fileType,
        });
      } else {
        message.error('文件上传失败');
      }
    }
    this.setState({
      accessories,
    });
  };

  institutionPaging = (pagination) => {
    const { dispatch, namespace } = this.props;
    const { institutionVal } = this.state;
    this.setState({
      I_currentPage: pagination.current,
      I_pageSize: pagination.pageSize,
    }, () => {
      dispatch({
        type: `${namespace}/getFdistributorcode`,
        payload: {
          code: 'saleorginfo',
          currentPage: pagination.current,
          pageSize: pagination.pageSize,
          param: institutionVal,
        },
      });
    });
  };

  institutionTable = (data) => {
    const { myInvestorInfo: { institutionLoading, I_currentPage } } = this.props;
    const { institutionDelVisible } = this.state;
    const rowSelection = {
      type: 'radio',
      onChange: (selectedRowKeys, selectedRows) => {
        this.setState({
          institutionRow: selectedRows,
          institutionDelVisible: false,
        })
      }
    };
    const columns = [
      {
        title: '机构名称',
        dataIndex: 'name',
        width: 400,
      },
      {
        title: '机构代码',
        dataIndex: 'code',
      },
    ];
    const paginationProps = {
      current: I_currentPage,
      // showSizeChanger: true,
      showQuickJumper: true,
    };
    return (
      <div>
        <Spin spinning={institutionLoading}>
          <Search
            placeholder="请输入"
            onSearch={(val) => this.institutionQuery(val)}
            style={{ width: 242, height: 32, marginBottom: 20 }}
          />
          {institutionDelVisible ? <Table
            rowKey="id"
            rowSelection={rowSelection}
            columns={columns}
            dataSource={data}
            onChange={this.institutionPaging}
            pagination={paginationProps}
            bordered={true}
            size="small"
          /> : null}
        </Spin>
      </div>
    )
  };

  render() {
    const { ID, TabPaneVisible, institutionDelVisible, annexesObj, btnShow, isGetBalance, selectedRows, switchStatus, defaultActiveKey, cardData, type, fund, deal, delVisible, variable, dealFormItems } = this.state;
    const { getFieldDecorator } = this.props.form;
    const {
      myInvestorInfo: {
        productRecordingAgency,
        proTypeData,
        orgType,
        orgData,
        accessoriesLoading,
        opening,
        bankData,
        basic,
        communication,
        agent,
        aptitude,
        institution,
        director,
        product,
        other,
        badRecord,
        controlRel,
        qualifiedInvestor,
        balance,
        investorType,
        operatorData,
        data: { data },
        loading,
        dealTableLoading,
        currentPage,
        D_currentPage,
        dealData,
        dropDownList,
        dealTitle,
        dealAddBtn,
        fundData,
        fundAccountLoading,
        fdistributorcode,
      },
    } = this.props;
    const columns = [
      {
        title: '操作类型',
        dataIndex: 'businesscode',
      },
      {
        title: '操作员',
        dataIndex: 'creatorIdName',
      },

      {
        title: '执行内容',
        dataIndex: 'content',
      },
      {
        title: '操作时间',
        dataIndex: 'createTime',
      },
    ];
    const dealColumns = [
      {
        title: '交易账号',
        dataIndex: 'accountNumber',
      },
      {
        title: '银行卡号',
        dataIndex: 'clearacct',
      },

      {
        title: '开户行代码',
        dataIndex: 'bankno',
      },
      {
        title: '开户行',
        dataIndex: 'banknetpointname',
      },
      {
        title: '开户名',
        dataIndex: 'acctname',
      },
      {
        title: 'TA增开',
        dataIndex: 'taApplyName',
      },
      {
        title: '操作',
        dataIndex: 'id',
        align: 'center',
        width: 200,
        fixed: 'right',
        render: (val, record) => (
          <span>{this.operationBtn(val, record)}</span>
        )
      },
    ];
    return (
      <div className={styles.parentDiv}>
        <Modal
          key="add"
          title="新增交易账户"
          wrapClassName="vertical-center-modal"
          zIndex={1001}
          visible={dealAddBtn}
          onOk={() => this.setModalAddVisible()}
          onCancel={() => this.setModalAddVisible()}
          footer={null}
          width={850}
        >
          {dealFormItems ? this.addDealMessage(bankData) : ''}
        </Modal>
        <Modal
          key="opening"
          title="申请开户"
          wrapClassName="vertical-center-modal"
          visible={opening}
          onOk={() => this.setOpening()}
          onCancel={() => this.setOpening()}
          footer={null}
          width={1000}
        >
          {this.openAccountShow(data, dealColumns)}
        </Modal>
        <Modal
          key="del"
          title={variable}
          wrapClassName="vertical-center-modal"
          visible={delVisible}
          onOk={() => this.setModalDelVisible()}
          onCancel={() => this.setModalDelVisible()}
          footer={null}
          width={450}
        >
          {this.delTip()}
        </Modal>
        <Modal
          key="institution"
          title="销售机构"
          wrapClassName="vertical-center-modal"
          zIndex={1001}
          visible={institutionDelVisible}
          onOk={() => this.setInstitution()}
          onCancel={() => this.setInstitution()}
          footer={null}
          width={850}
        >
          {this.institutionTable(fdistributorcode)}
        </Modal>
        <div className={styles.theme}>
          {this.renderTheme(data)}
          <Tabs defaultActiveKey={defaultActiveKey} onChange={this.callback}>
            <TabPane tab="投资人信息" key={'0'}>
              {+type === 1 ? (
                <div className={styles.investorManageBox}>
                  <Card
                    title="基础信息"
                    extra={this.btnArea('unit', 'basic')}
                    bodyStyle={{
                      borderTop: '1px solid #ddd',
                      padding: cardData.unit.basic ? '14px 32px' : 0,
                    }}
                  >
                    <Spin spinning={basic}>
                      <div
                        className={styles.tableListForm1}
                        style={{ display: cardData.unit.basic ? 'block' : 'none' }}
                      >
                        <Form
                          onSubmit={e =>
                            this.updateFields(
                              e,
                              ['investorType', 'name', 'nameInitials', 'endDate', 'work', 'duties'],
                              'unit',
                              'basic',
                            )
                          }
                          layout="inline"
                        >
                          <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                            <Col xxl={8} md={12} sm={24}>
                              <FormItem label="投资者类型">
                                {getFieldDecorator('investorType', {
                                  initialValue: data.investorType,
                                  rules: [
                                    {
                                      required: true,
                                      message: '投资者类型不能为空',
                                    },
                                  ],
                                })(
                                  btnShow.unit.basic ? (
                                    <span>
                                      {data.investorTypeName === undefined
                                        ? '--'
                                        : data.investorTypeName}
                                    </span>
                                  ) : (
                                    this.getDropdownData(investorType)
                                  ),
                                )}
                              </FormItem>
                            </Col>
                            <Col xxl={8} md={12} sm={24}>
                              <FormItem label="投资者名称">
                                {getFieldDecorator('name', {
                                  initialValue: data.name,
                                  rules: [
                                    {
                                      required: true,
                                      message: '投资者名称不能为空且长度不能超过120位',
                                      max: 120,
                                    },
                                  ],
                                })(
                                  btnShow.unit.basic ? (
                                    <span>{data.name === undefined ? '--' : data.name}</span>
                                  ) : (
                                    <Input placeholder="请输入" />
                                  ),
                                )}
                              </FormItem>
                            </Col>
                            <Col xxl={8} md={12} sm={24}>
                              <FormItem label="投资者简称">
                                {getFieldDecorator('nameInitials', {
                                  initialValue: data.nameInitials,
                                  rules: [
                                    {
                                      max: 20,
                                      message: '长度不能超过20位',
                                    },
                                  ],
                                })(
                                  btnShow.unit.basic ? (
                                    <span>
                                      {data.nameInitials === undefined ? '--' : data.nameInitials}
                                    </span>
                                  ) : (
                                    <Input placeholder="请输入" />
                                  ),
                                )}
                              </FormItem>
                            </Col>
                            <Col xxl={8} md={12} sm={24}>
                              <FormItem label="证件类型">
                                {getFieldDecorator('cardType', {
                                  initialValue: data.cardType,
                                  rules: [
                                    {
                                      required: true,
                                      message: '证件类型不能为空',
                                    },
                                  ],
                                })(
                                  <span>
                                    {data.cardTypeName === undefined ? '--' : data.cardTypeName}
                                  </span>,
                                )}
                              </FormItem>
                            </Col>
                            <Col xxl={8} md={12} sm={24}>
                              <FormItem label="证件号码">
                                {getFieldDecorator('cardNum', {
                                  initialValue: data.cardNum,
                                  rules: [
                                    {
                                      required: true,
                                      max: 30,
                                      message: '证件号码不能为空且长度不能超过30位',
                                    },
                                  ],
                                })(<span>{data.cardNum === undefined ? '--' : data.cardNum}</span>)}
                              </FormItem>
                            </Col>
                            <Col xxl={8} md={12} sm={24}>
                              <FormItem label="证件有效期">
                                {getFieldDecorator('endDate', {
                                  initialValue: data.endDate ? moment(data.endDate + '') : '',
                                })(
                                  btnShow.unit.basic ? (
                                    <span>
                                      {data.endDate === undefined
                                        ? '--'
                                        : moment(data.endDate + '').format('YYYY-MM-DD')}
                                    </span>
                                  ) : (
                                    <DatePicker style={{ width: '100%' }} />
                                  ),
                                )}
                              </FormItem>
                            </Col>
                            <Col xxl={8} md={12} sm={24}>
                              <FormItem label="职业">
                                {getFieldDecorator('work', {
                                  initialValue: data.work,
                                  rules: [
                                    {
                                      max: 50,
                                      message: '长度不能超过50位',
                                    },
                                  ],
                                })(
                                  btnShow.unit.basic ? (
                                    <span>{data.work === undefined ? '--' : data.work}</span>
                                  ) : (
                                    <Input placeholder="请输入" />
                                  ),
                                )}
                              </FormItem>
                            </Col>
                            <Col xxl={8} md={12} sm={24}>
                              <FormItem label="职务">
                                {getFieldDecorator('duties', {
                                  initialValue: data.duties,
                                  rules: [
                                    {
                                      max: 50,
                                      message: '长度不能超过50位',
                                    },
                                  ],
                                })(
                                  btnShow.unit.basic ? (
                                    <span>{data.duties === undefined ? '--' : data.duties}</span>
                                  ) : (
                                    <Input placeholder="请输入" />
                                  ),
                                )}
                              </FormItem>
                            </Col>
                          </Row>
                          <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                            <Col md={24} sm={24}>
                              <div
                                style={{ display: btnShow.unit.basic ? 'none' : 'block' }}
                                className={styles.openQueryBtn}
                              >
                                <Button type="primary" htmlType="submit">
                                  确定
                                </Button>
                                <Button onClick={() => this.cancel('unit', 'basic')}>取消</Button>
                              </div>
                            </Col>
                          </Row>
                        </Form>
                      </div>
                    </Spin>
                  </Card>

                  <Card
                    title="通讯信息"
                    extra={this.btnArea('unit', 'communication')}
                    bodyStyle={{
                      borderTop: '1px solid #ddd',
                      padding: cardData.unit.communication ? '14px 32px' : 0,
                    }}
                    style={{ marginTop: 20 }}
                  >
                    <Spin spinning={communication}>
                      <div
                        className={styles.tableListForm1}
                        style={{ display: cardData.unit.communication ? 'block' : 'none' }}
                      >
                        <Form
                          onSubmit={e =>
                            this.updateFields(
                              e,
                              [
                                'nationality',
                                'phone',
                                'email',
                                'officePhone',
                                'postalCode',
                                'fax',
                                'companyName',
                                'address',
                              ],
                              'unit',
                              'communication',
                            )
                          }
                          layout="inline"
                        >
                          <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                            <Col xxl={8} md={12} sm={24}>
                              <FormItem label="国籍">
                                {getFieldDecorator('nationality', {
                                  initialValue: data.nationality,
                                })(
                                  btnShow.unit.communication ? (
                                    <span>
                                      {data.nationality === undefined ? '--' : data.nationality}
                                    </span>
                                  ) : (
                                    <Input placeholder="请输入" />
                                  ),
                                )}
                              </FormItem>
                            </Col>
                            <Col xxl={8} md={12} sm={24}>
                              <FormItem label="移动电话">
                                {getFieldDecorator('phone', {
                                  initialValue: data.phone,
                                  rules: [
                                    {
                                      required: true,
                                      pattern: /^1(3|4|5|7|8)\d{9}$/,
                                      message: '请填写正确的移动电话号码',
                                    },
                                  ],
                                })(
                                  btnShow.unit.communication ? (
                                    <span>{data.phone === undefined ? '--' : data.phone}</span>
                                  ) : (
                                    <Input placeholder="请输入" />
                                  ),
                                )}
                              </FormItem>
                            </Col>
                            <Col xxl={8} md={12} sm={24}>
                              <FormItem label="电子邮箱">
                                {getFieldDecorator('email', {
                                  initialValue: data.email,
                                  rules: [
                                    {
                                      max: 20,
                                      message: '长度不超过20位',
                                    },
                                  ],
                                })(
                                  btnShow.unit.communication ? (
                                    <span>{data.email === undefined ? '--' : data.email}</span>
                                  ) : (
                                    <Input placeholder="请输入" />
                                  ),
                                )}
                              </FormItem>
                            </Col>
                            <Col xxl={8} md={12} sm={24}>
                              <FormItem label="办公电话">
                                {getFieldDecorator('officePhone', {
                                  initialValue: data.officePhone,
                                  rules: [
                                    {
                                      max: 50,
                                      message: '长度不能超过50位',
                                    },
                                  ],
                                })(
                                  btnShow.unit.communication ? (
                                    <span>
                                      {data.officePhone === undefined ? '--' : data.officePhone}
                                    </span>
                                  ) : (
                                    <Input placeholder="请输入" />
                                  ),
                                )}
                              </FormItem>
                            </Col>
                            <Col xxl={8} md={12} sm={24}>
                              <FormItem label="邮政编码">
                                {getFieldDecorator('postalCode', {
                                  initialValue: data.postalCode,
                                  rules: [
                                    {
                                      pattern: /^[0-9]{6}$/,
                                      message: '请填写正确的邮政编码',
                                    },
                                  ],
                                })(
                                  btnShow.unit.communication ? (
                                    <span>
                                      {data.postalCode === undefined ? '--' : data.postalCode}
                                    </span>
                                  ) : (
                                    <Input placeholder="请输入" />
                                  ),
                                )}
                              </FormItem>
                            </Col>
                            <Col xxl={8} md={12} sm={24}>
                              <FormItem label="传真号码">
                                {getFieldDecorator('fax', {
                                  initialValue: data.fax,
                                  rules: [
                                    {
                                      max: 50,
                                      message: '长度不能超过50位',
                                    },
                                  ],
                                })(
                                  btnShow.unit.communication ? (
                                    <span>{data.fax === undefined ? '--' : data.fax}</span>
                                  ) : (
                                    <Input placeholder="请输入" />
                                  ),
                                )}
                              </FormItem>
                            </Col>
                            <Col xxl={8} md={12} sm={24}>
                              <FormItem label="工作单位名称">
                                {getFieldDecorator('companyName', {
                                  initialValue: data.companyName,
                                  rules: [
                                    {
                                      max: 200,
                                      message: '长度不能超过200位',
                                    },
                                  ],
                                })(
                                  btnShow.unit.communication ? (
                                    <span>
                                      {data.companyName === undefined ? '--' : data.companyName}
                                    </span>
                                  ) : (
                                    <Input placeholder="请输入" />
                                  ),
                                )}
                              </FormItem>
                            </Col>
                            <Col xxl={8} md={12} sm={24}>
                              <FormItem label="通讯地址">
                                {getFieldDecorator('address', {
                                  initialValue: data.address,
                                  rules: [
                                    {
                                      max: 200,
                                      message: '长度不能超过200位',
                                    },
                                  ],
                                })(
                                  btnShow.unit.communication ? (
                                    <span>{data.address === undefined ? '--' : data.address}</span>
                                  ) : (
                                    <TextArea
                                      placeholder="请输入"
                                      autosize={{ minRows: 2, maxRows: 6 }}
                                    />
                                  ),
                                )}
                              </FormItem>
                            </Col>
                          </Row>
                          <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                            <Col md={24} sm={24}>
                              <div
                                style={{ display: btnShow.unit.communication ? 'none' : 'block' }}
                                className={styles.openQueryBtn}
                              >
                                <Button type="primary" htmlType="submit">
                                  确定
                                </Button>
                                <Button onClick={() => this.cancel('unit', 'communication')}>
                                  取消
                                </Button>
                              </div>
                            </Col>
                          </Row>
                        </Form>
                      </div>
                    </Spin>
                  </Card>

                  <Card
                    title="资质信息"
                    extra={this.btnArea('unit', 'aptitude')}
                    bodyStyle={{
                      borderTop: '1px solid #ddd',
                      padding: cardData.unit.aptitude ? '14px 32px' : 0,
                    }}
                    style={{ marginTop: 20 }}
                  >
                    <Spin spinning={aptitude}>
                      <div
                        className={styles.tableListForm1}
                        style={{ display: cardData.unit.aptitude ? 'block' : 'none' }}
                      >
                        <Form
                          onSubmit={e =>
                            this.updateFields(
                              e,
                              [
                                'qualifiedInvestor',
                                'riskGrade',
                                'controlRel',
                                'beneficiary',
                                'badRecord',
                              ],
                              'unit',
                              'aptitude',
                            )
                          }
                          layout="inline"
                        >
                          <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                            <Col xxl={8} md={12} sm={24}>
                              <FormItem label="合格投资者">
                                {getFieldDecorator('qualifiedInvestor', {
                                  initialValue: data.qualifiedInvestor,
                                })(
                                  btnShow.unit.aptitude ? (
                                    <span>
                                      {data.qualifiedInvestorName === undefined
                                        ? '--'
                                        : data.qualifiedInvestorName}
                                    </span>
                                  ) : (
                                    this.getDropdownData(qualifiedInvestor, false, 1)
                                  ),
                                )}
                              </FormItem>
                            </Col>
                            <Col xxl={8} md={12} sm={24}>
                              <FormItem label="投资者风险等级">
                                {getFieldDecorator('riskGrade', {
                                  initialValue: data.riskGrade,
                                })(
                                  btnShow.unit.aptitude ? (
                                    <span>
                                      {data.riskGradeName === undefined ? '--' : data.riskGradeName}
                                    </span>
                                  ) : (
                                    this.getDropdownData(dropDownList.InvestorRiskLevel, false, 1)
                                  ),
                                )}
                              </FormItem>
                            </Col>
                            <Col xxl={8} md={12} sm={24}>
                              <FormItem label="是否存在实际控制关系">
                                {getFieldDecorator('controlRel', {
                                  initialValue: data.controlRel,
                                })(
                                  btnShow.unit.aptitude ? (
                                    <span>
                                      {data.controlRelName === undefined
                                        ? '--'
                                        : data.controlRelName}
                                    </span>
                                  ) : (
                                    this.getDropdownData(controlRel)
                                  ),
                                )}
                              </FormItem>
                            </Col>
                            <Col xxl={8} md={12} sm={24}>
                              <FormItem label="交易的实际受益人">
                                {getFieldDecorator('beneficiary', {
                                  initialValue: data.beneficiary,
                                  rules: [
                                    {
                                      max: 20,
                                      message: '长度不能超过20位',
                                    },
                                  ],
                                })(
                                  btnShow.unit.aptitude ? (
                                    <span>
                                      {data.beneficiary === undefined ? '--' : data.beneficiary}
                                    </span>
                                  ) : (
                                    <Input placeholder="请输入" />
                                  ),
                                )}
                              </FormItem>
                            </Col>
                            <Col xxl={8} md={12} sm={24}>
                              <FormItem label="是否有不良诚信记录">
                                {getFieldDecorator('badRecord', {
                                  initialValue: data.badRecord,
                                })(
                                  btnShow.unit.aptitude ? (
                                    <span>
                                      {data.badRecordName === undefined ? '--' : data.badRecordName}
                                    </span>
                                  ) : (
                                    this.getDropdownData(badRecord)
                                  ),
                                )}
                              </FormItem>
                            </Col>
                          </Row>
                          <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                            <Col md={24} sm={24}>
                              <div
                                style={{ display: btnShow.unit.aptitude ? 'none' : 'block' }}
                                className={styles.openQueryBtn}
                              >
                                <Button type="primary" htmlType="submit">
                                  确定
                                </Button>
                                <Button onClick={() => this.cancel('unit', 'aptitude')}>
                                  取消
                                </Button>
                              </div>
                            </Col>
                          </Row>
                        </Form>
                      </div>
                    </Spin>
                  </Card>

                  <Card
                    title="其它信息"
                    extra={this.btnArea('unit', 'other')}
                    bodyStyle={{
                      borderTop: '1px solid #ddd',
                      padding: cardData.unit.other ? '14px 32px' : 0,
                    }}
                    style={{ marginTop: 20 }}
                  >
                    <Spin spinning={other}>
                      <div
                        className={styles.tableListForm1}
                        style={{ display: cardData.unit.other ? 'block' : 'none' }}
                      >
                        <Form
                          onSubmit={e =>
                            this.updateFields(
                              e,
                              [
                                'acceptWay',
                                'dealWay',
                                'sendWay',
                                'sendFrequency',
                                'regionNum',
                                'shanghaiSecAcc',
                                'shenzhenSecAcc',
                                'referrerType',
                                'referrerName',
                              ],
                              'unit',
                              'other',
                            )
                          }
                          layout="inline"
                        >
                          <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                            <Col xxl={8} md={12} sm={24}>
                              <FormItem label="受理方式">
                                {getFieldDecorator('acceptWay', {
                                  initialValue: data.acceptWay,
                                })(
                                  btnShow.unit.other ? (
                                    <span>
                                      {data.acceptWayName === undefined ? '--' : data.acceptWayName}
                                    </span>
                                  ) : (
                                    this.getDropdownData(dropDownList.TA_ACCPTMD)
                                  ),
                                )}
                              </FormItem>
                            </Col>
                            <Col xxl={8} md={12} sm={24}>
                              <FormItem label="使用的交易手段">
                                {getFieldDecorator('dealWay', {
                                  initialValue: data.dealWay,
                                })(
                                  btnShow.unit.other ? (
                                    <span>
                                      {data.dealWayName === undefined ? '--' : data.dealWayName}
                                    </span>
                                  ) : (
                                    this.getDropdownData(dropDownList.tradingMethod)
                                  ),
                                )}
                              </FormItem>
                            </Col>
                            <Col xxl={8} md={12} sm={24}>
                              <FormItem label="账单寄送方式">
                                {getFieldDecorator('sendWay', {
                                  initialValue: data.sendWay,
                                })(
                                  btnShow.unit.other ? (
                                    <span>
                                      {data.sendWayName === undefined ? '--' : data.sendWayName}
                                    </span>
                                  ) : (
                                    this.getDropdownData(dropDownList.TA_STATEMENTFLAG)
                                  ),
                                )}
                              </FormItem>
                            </Col>
                            <Col xxl={8} md={12} sm={24}>
                              <FormItem label="账单寄送频率">
                                {getFieldDecorator('sendFrequency', {
                                  initialValue: data.sendFrequency,
                                })(
                                  btnShow.unit.other ? (
                                    <span>
                                      {data.sendFrequencyName === undefined
                                        ? '--'
                                        : data.sendFrequencyName}
                                    </span>
                                  ) : (
                                    this.getDropdownData(dropDownList.TA_DELIVERTYPE)
                                  ),
                                )}
                              </FormItem>
                            </Col>
                            <Col xxl={8} md={12} sm={24}>
                              <FormItem label="交易所在地区编号">
                                {getFieldDecorator('regionNum', {
                                  initialValue: data.regionNum,
                                  rules: [
                                    {
                                      max: 20,
                                      message: '长度不能超过20位',
                                    },
                                  ],
                                })(
                                  btnShow.unit.other ? (
                                    <span>
                                      {data.regionNum === undefined ? '--' : data.regionNum}
                                    </span>
                                  ) : (
                                    <Input placeholder="请输入" />
                                  ),
                                )}
                              </FormItem>
                            </Col>
                            <Col xxl={8} md={12} sm={24}>
                              <FormItem label="上交所证券账户">
                                {getFieldDecorator('shanghaiSecAcc', {
                                  initialValue: data.shanghaiSecAcc,
                                  rules: [
                                    {
                                      max: 100,
                                      message: '长度不能超过100位',
                                    },
                                  ],
                                })(
                                  btnShow.unit.other ? (
                                    <span>
                                      {data.shanghaiSecAcc === undefined
                                        ? '--'
                                        : data.shanghaiSecAcc}
                                    </span>
                                  ) : (
                                    <Input placeholder="请输入" />
                                  ),
                                )}
                              </FormItem>
                            </Col>
                            <Col xxl={8} md={12} sm={24}>
                              <FormItem label="深交所证券账户">
                                {getFieldDecorator('shenzhenSecAcc', {
                                  initialValue: data.shenzhenSecAcc,
                                  rules: [
                                    {
                                      max: 100,
                                      message: '长度不能超过100位',
                                    },
                                  ],
                                })(
                                  btnShow.unit.other ? (
                                    <span>
                                      {data.shenzhenSecAcc === undefined
                                        ? '--'
                                        : data.shenzhenSecAcc}
                                    </span>
                                  ) : (
                                    <Input placeholder="请输入" />
                                  ),
                                )}
                              </FormItem>
                            </Col>
                            <Col xxl={8} md={12} sm={24}>
                              <FormItem label="推荐人类型">
                                {getFieldDecorator('referrerType', {
                                  initialValue: data.referrerType,
                                })(
                                  btnShow.unit.other ? (
                                    <span>
                                      {data.referrerTypeName === undefined
                                        ? '--'
                                        : data.referrerTypeName}
                                    </span>
                                  ) : (
                                    this.getDropdownData(dropDownList.referrerType)
                                  ),
                                )}
                              </FormItem>
                            </Col>
                            <Col xxl={8} md={12} sm={24}>
                              <FormItem label="推荐人">
                                {getFieldDecorator('referrerName', {
                                  initialValue: data.referrerName,
                                  rules: [
                                    {
                                      max: 20,
                                      message: '长度不能超过20位',
                                    },
                                  ],
                                })(
                                  btnShow.unit.other ? (
                                    <span>
                                      {data.referrerName === undefined ? '--' : data.referrerName}
                                    </span>
                                  ) : (
                                    <Input placeholder="请输入" />
                                  ),
                                )}
                              </FormItem>
                            </Col>
                          </Row>
                          <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                            <Col md={24} sm={24}>
                              <div
                                style={{ display: btnShow.unit.other ? 'none' : 'block' }}
                                className={styles.openQueryBtn}
                              >
                                <Button type="primary" htmlType="submit">
                                  确定
                                </Button>
                                <Button onClick={() => this.cancel('unit', 'other')}>取消</Button>
                              </div>
                            </Col>
                          </Row>
                        </Form>
                      </div>
                    </Spin>
                  </Card>
                </div>
              ) : +type === 0 ? (
                <div className={styles.investorManageBox}>
                  <Card
                    title="基础信息"
                    extra={this.btnArea('institution', 'basic')}
                    bodyStyle={{
                      borderTop: '1px solid #ddd',
                      padding: cardData.institution.basic ? '14px 32px' : 0,
                    }}
                  >
                    <Spin spinning={basic}>
                      <div
                        className={styles.tableListForm1}
                        style={{ display: cardData.institution.basic ? 'block' : 'none' }}
                      >
                        <Form
                          onSubmit={e =>
                            this.updateFields(
                              e,
                              ['investorType', 'name', 'nameInitials', 'endDate'],
                              'institution',
                              'basic',
                            )
                          }
                          layout="inline"
                        >
                          <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                            <Col xxl={8} md={12} sm={24}>
                              <FormItem label="投资者类型">
                                {getFieldDecorator('investorType', {
                                  initialValue: data.investorType,
                                  rules: [
                                    {
                                      required: true,
                                      message: '投资者类型不能为空',
                                    },
                                  ],
                                })(
                                  btnShow.institution.basic ? (
                                    <span>
                                      {data.investorTypeName === undefined
                                        ? '--'
                                        : data.investorTypeName}
                                    </span>
                                  ) : (
                                    this.getDropdownData(investorType)
                                  ),
                                )}
                              </FormItem>
                            </Col>
                            <Col xxl={8} md={12} sm={24}>
                              <FormItem label="投资者名称">
                                {getFieldDecorator('name', {
                                  initialValue: data.name,
                                  rules: [
                                    {
                                      required: true,
                                      max: 120,
                                      message: '投资者名称不能为空且长度不能超过120位',
                                    },
                                  ],
                                })(
                                  btnShow.institution.basic ? (
                                    <span>{data.name === undefined ? '--' : data.name}</span>
                                  ) : (
                                    <Input placeholder="请输入" />
                                  ),
                                )}
                              </FormItem>
                            </Col>
                            <Col xxl={8} md={12} sm={24}>
                              <FormItem label="投资者简称">
                                {getFieldDecorator('nameInitials', {
                                  initialValue: data.nameInitials,
                                  rules: [
                                    {
                                      max: 20,
                                      message: '长度不能超过20位',
                                    },
                                  ],
                                })(
                                  btnShow.institution.basic ? (
                                    <span>
                                      {data.nameInitials === undefined ? '--' : data.nameInitials}
                                    </span>
                                  ) : (
                                    <Input placeholder="请输入" />
                                  ),
                                )}
                              </FormItem>
                            </Col>
                            <Col xxl={8} md={12} sm={24}>
                              <FormItem label="证件类型">
                                {getFieldDecorator('cardType', {
                                  initialValue: data.cardType,
                                  rules: [
                                    {
                                      required: true,
                                      message: '证件类型不能为空',
                                    },
                                  ],
                                })(
                                  <span>
                                    {data.cardTypeName === undefined ? '--' : data.cardTypeName}
                                  </span>,
                                )}
                              </FormItem>
                            </Col>
                            <Col xxl={8} md={12} sm={24}>
                              <FormItem label="证件号码">
                                {getFieldDecorator('cardNum', {
                                  initialValue: data.cardNum,
                                  rules: [
                                    {
                                      required: true,
                                      max: 30,
                                      message: '证件号码不能为空且长度不能超过30位',
                                    },
                                  ],
                                })(<span>{data.cardNum === undefined ? '--' : data.cardNum}</span>)}
                              </FormItem>
                            </Col>
                            <Col xxl={8} md={12} sm={24}>
                              <FormItem label="证件有效期">
                                {getFieldDecorator('endDate', {
                                  initialValue: data.endDate ? moment(data.endDate + '') : null,
                                })(
                                  btnShow.institution.basic ? (
                                    <span>
                                      {data.endDate === undefined
                                        ? '--'
                                        : moment(data.endDate + '').format('YYYY-MM-DD')}
                                    </span>
                                  ) : (
                                    <DatePicker style={{ width: '100%' }} />
                                  ),
                                )}
                              </FormItem>
                            </Col>
                          </Row>
                          <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                            <Col md={24} sm={24}>
                              <div
                                style={{ display: btnShow.institution.basic ? 'none' : 'block' }}
                                className={styles.openQueryBtn}
                              >
                                <Button type="primary" htmlType="submit">
                                  确定
                                </Button>
                                <Button onClick={() => this.cancel('institution', 'basic')}>
                                  取消
                                </Button>
                              </div>
                            </Col>
                          </Row>
                        </Form>
                      </div>
                    </Spin>
                  </Card>

                  <Card
                    title="经办人信息"
                    extra={this.btnArea('institution', 'agent')}
                    bodyStyle={{
                      borderTop: '1px solid #ddd',
                      padding: cardData.institution.agent ? '14px 32px' : 0,
                    }}
                    style={{ marginTop: 20 }}
                  >
                    <Spin spinning={agent}>
                      <div
                        className={styles.tableListForm1}
                        style={{ display: cardData.institution.agent ? 'block' : 'none' }}
                      >
                        <Form
                          onSubmit={e =>
                            this.updateFields(
                              e,
                              [
                                'agentName',
                                'agentCardType',
                                'agentCardNum',
                                'agentEndDate',
                                'agentDuties',
                                'agentRelationship',
                              ],
                              'institution',
                              'agent',
                            )
                          }
                          layout="inline"
                        >
                          <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                            <Col xxl={8} md={12} sm={24}>
                              <FormItem label="姓名">
                                {getFieldDecorator('agentName', {
                                  initialValue: data.agentName,
                                  rules: [
                                    {
                                      required: true,
                                      max: 20,
                                      message: '姓名不能为空且长度不能超过20位',
                                    },
                                  ],
                                })(
                                  btnShow.institution.agent ? (
                                    <span>
                                      {data.agentName === undefined ? '--' : data.agentName}
                                    </span>
                                  ) : (
                                    <Input placeholder="请输入" />
                                  ),
                                )}
                              </FormItem>
                            </Col>
                            <Col xxl={8} md={12} sm={24}>
                              <FormItem label="证件类型">
                                {getFieldDecorator('agentCardType', {
                                  initialValue: data.agentCardType,
                                  rules: [
                                    {
                                      required: true,
                                      message: '证件类型不能为空',
                                    },
                                  ],
                                })(
                                  btnShow.institution.agent ? (
                                    <span>
                                      {data.agentCardTypeName === undefined
                                        ? '--'
                                        : data.agentCardTypeName}
                                    </span>
                                  ) : (
                                    this.getDropdownData(dropDownList.TA_IDTPTP, true)
                                  ),
                                )}
                              </FormItem>
                            </Col>
                            <Col xxl={8} md={12} sm={24}>
                              <FormItem label="证件号码">
                                {getFieldDecorator('agentCardNum', {
                                  initialValue: data.agentCardNum,
                                  rules:
                                    ID === 0
                                      ? [
                                        {
                                          required: true,
                                          pattern: /(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}[0-9Xx]$)/,
                                          message: '请填写正确的证件号码',
                                        },
                                      ]
                                      : [
                                        {
                                          required: true,
                                          max: 30,
                                          message: '证件号码不能为空且长度不能超过30位',
                                        },
                                      ],
                                })(
                                  btnShow.institution.agent ? (
                                    <span>
                                      {data.agentCardNum === undefined ? '--' : data.agentCardNum}
                                    </span>
                                  ) : (
                                    <Input placeholder="请输入" />
                                  ),
                                )}
                              </FormItem>
                            </Col>
                            <Col xxl={8} md={12} sm={24}>
                              <FormItem label="证件有效期">
                                {getFieldDecorator('agentEndDate', {
                                  initialValue: data.agentEndDate
                                    ? moment(data.agentEndDate + '')
                                    : null,
                                })(
                                  btnShow.institution.agent ? (
                                    <span>
                                      {data.agentEndDate === undefined
                                        ? '--'
                                        : moment(data.agentEndDate + '').format('YYYY-MM-DD')}
                                    </span>
                                  ) : (
                                    <DatePicker style={{ width: '100%' }} />
                                  ),
                                )}
                              </FormItem>
                            </Col>
                            <Col xxl={8} md={12} sm={24}>
                              <FormItem label="职务">
                                {getFieldDecorator('agentDuties', {
                                  initialValue: data.agentDuties,
                                  rules: [
                                    {
                                      max: 50,
                                      message: '长度不能超过50位',
                                    },
                                  ],
                                })(
                                  btnShow.institution.agent ? (
                                    <span>
                                      {data.agentDuties === undefined ? '--' : data.agentDuties}
                                    </span>
                                  ) : (
                                    <Input placeholder="请输入" />
                                  ),
                                )}
                              </FormItem>
                            </Col>
                            <Col xxl={8} md={12} sm={24}>
                              <FormItem label="与该机构关系">
                                {getFieldDecorator('agentRelationship', {
                                  initialValue: data.agentRelationship,
                                  rules: [
                                    {
                                      max: 20,
                                      message: '长度不能超过20位',
                                    },
                                  ],
                                })(
                                  btnShow.institution.agent ? (
                                    <span>
                                      {data.agentRelationship === undefined
                                        ? '--'
                                        : data.agentRelationship}
                                    </span>
                                  ) : (
                                    <Input placeholder="请输入" />
                                  ),
                                )}
                              </FormItem>
                            </Col>
                          </Row>
                          <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                            <Col md={24} sm={24}>
                              <div
                                style={{ display: btnShow.institution.agent ? 'none' : 'block' }}
                                className={styles.openQueryBtn}
                              >
                                <Button type="primary" htmlType="submit">
                                  确定
                                </Button>
                                <Button onClick={() => this.cancel('institution', 'agent')}>
                                  取消
                                </Button>
                              </div>
                            </Col>
                          </Row>
                        </Form>
                      </div>
                    </Spin>
                  </Card>

                  <Card
                    title="通讯信息"
                    extra={this.btnArea('institution', 'communication')}
                    bodyStyle={{
                      borderTop: '1px solid #ddd',
                      padding: cardData.institution.communication ? '14px 32px' : 0,
                    }}
                    style={{ marginTop: 20 }}
                  >
                    <Spin spinning={communication}>
                      <div
                        className={styles.tableListForm1}
                        style={{ display: cardData.institution.communication ? 'block' : 'none' }}
                      >
                        <Form
                          onSubmit={e =>
                            this.updateFields(
                              e,
                              ['phone', 'email', 'officePhone', 'postalCode', 'fax', 'address'],
                              'institution',
                              'communication',
                            )
                          }
                          layout="inline"
                        >
                          <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                            <Col xxl={8} md={12} sm={24}>
                              <FormItem label="移动电话">
                                {getFieldDecorator('phone', {
                                  initialValue: data.phone,
                                  rules: [
                                    {
                                      required: true,
                                      pattern: /^1(3|4|5|7|8)\d{9}$/,
                                      message: '请填写正确的移动电话号码',
                                    },
                                  ],
                                })(
                                  btnShow.institution.communication ? (
                                    <span>{data.phone === undefined ? '--' : data.phone}</span>
                                  ) : (
                                    <Input placeholder="请输入" />
                                  ),
                                )}
                              </FormItem>
                            </Col>
                            <Col xxl={8} md={12} sm={24}>
                              <FormItem label="电子邮箱">
                                {getFieldDecorator('email', {
                                  initialValue: data.email,
                                  rules: [
                                    {
                                      max: 20,
                                      message: '长度不能超过20位',
                                    },
                                  ],
                                })(
                                  btnShow.institution.communication ? (
                                    <span>{data.email === undefined ? '--' : data.email}</span>
                                  ) : (
                                    <Input placeholder="请输入" />
                                  ),
                                )}
                              </FormItem>
                            </Col>
                            <Col xxl={8} md={12} sm={24}>
                              <FormItem label="办公电话">
                                {getFieldDecorator('officePhone', {
                                  initialValue: data.officePhone,
                                  rules: [
                                    {
                                      max: 50,
                                      message: '长度不能超过50位',
                                    },
                                  ],
                                })(
                                  btnShow.institution.communication ? (
                                    <span>
                                      {data.officePhone === undefined ? '--' : data.officePhone}
                                    </span>
                                  ) : (
                                    <Input placeholder="请输入" />
                                  ),
                                )}
                              </FormItem>
                            </Col>
                            <Col xxl={8} md={12} sm={24}>
                              <FormItem label="邮政编码">
                                {getFieldDecorator('postalCode', {
                                  initialValue: data.postalCode,
                                  rules: [
                                    {
                                      pattern: /^[0-9]{6}$/,
                                      message: '请填写正确的邮政编码',
                                    },
                                  ],
                                })(
                                  btnShow.institution.communication ? (
                                    <span>
                                      {data.postalCode === undefined ? '--' : data.postalCode}
                                    </span>
                                  ) : (
                                    <Input placeholder="请输入" />
                                  ),
                                )}
                              </FormItem>
                            </Col>
                            <Col xxl={8} md={12} sm={24}>
                              <FormItem label="传真号码">
                                {getFieldDecorator('fax', {
                                  initialValue: data.fax,
                                  rules: [
                                    {
                                      max: 50,
                                      message: '长度不能超过50位',
                                    },
                                  ],
                                })(
                                  btnShow.institution.communication ? (
                                    <span>{data.fax === undefined ? '--' : data.fax}</span>
                                  ) : (
                                    <Input placeholder="请输入" />
                                  ),
                                )}
                              </FormItem>
                            </Col>
                            <Col xxl={8} md={12} sm={24}>
                              <FormItem label="通讯地址">
                                {getFieldDecorator('address', {
                                  initialValue: data.address,
                                  rules: [
                                    {
                                      max: 200,
                                      message: '长度不能超过200位',
                                    },
                                  ],
                                })(
                                  btnShow.institution.communication ? (
                                    <span>{data.address === undefined ? '--' : data.address}</span>
                                  ) : (
                                    <TextArea
                                      placeholder="请输入"
                                      autosize={{ minRows: 2, maxRows: 6 }}
                                    />
                                  ),
                                )}
                              </FormItem>
                            </Col>
                          </Row>
                          <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                            <Col md={24} sm={24}>
                              <div
                                style={{
                                  display: btnShow.institution.communication ? 'none' : 'block',
                                }}
                                className={styles.openQueryBtn}
                              >
                                <Button type="primary" htmlType="submit">
                                  确定
                                </Button>
                                <Button onClick={() => this.cancel('institution', 'communication')}>
                                  取消
                                </Button>
                              </div>
                            </Col>
                          </Row>
                        </Form>
                      </div>
                    </Spin>
                  </Card>

                  <Card
                    title="机构信息"
                    extra={this.btnArea('institution', 'institution')}
                    bodyStyle={{
                      borderTop: '1px solid #ddd',
                      padding: cardData.institution.institution ? '14px 32px' : 0,
                    }}
                    style={{ marginTop: 20 }}
                  >
                    <Spin spinning={institution}>
                      <div
                        className={styles.tableListForm1}
                        style={{ display: cardData.institution.institution ? 'block' : 'none' }}
                      >
                        <Form
                          onSubmit={e =>
                            this.updateFields(
                              e,
                              [
                                'qualifications',
                                'qualificationsNum',
                                'runRange',
                                'registerAddress',
                                'officeAddress',
                                'registerCapital',
                                'holdingPeople',
                              ],
                              'institution',
                              'institution',
                            )
                          }
                          layout="inline"
                        >
                          <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                            <Col xxl={8} md={12} sm={24}>
                              <FormItem label="机构资质证明">
                                {getFieldDecorator('qualifications', {
                                  initialValue: data.qualifications,
                                  rules: [
                                    {
                                      max: 100,
                                      message: '长度不能超过100位',
                                    },
                                  ],
                                })(
                                  btnShow.institution.institution ? (
                                    <span>
                                      {data.qualifications === undefined
                                        ? '--'
                                        : data.qualifications}
                                    </span>
                                  ) : (
                                    <Input placeholder="请输入" />
                                  ),
                                )}
                              </FormItem>
                            </Col>
                            <Col xxl={8} md={12} sm={24}>
                              <FormItem label="资质证书编号">
                                {getFieldDecorator('qualificationsNum', {
                                  initialValue: data.qualificationsNum,
                                  rules: [
                                    {
                                      max: 100,
                                      message: '长度不能超过100位',
                                    },
                                  ],
                                })(
                                  btnShow.institution.institution ? (
                                    <span>
                                      {data.qualificationsNum === undefined
                                        ? '--'
                                        : data.qualificationsNum}
                                    </span>
                                  ) : (
                                    <Input placeholder="请输入" />
                                  ),
                                )}
                              </FormItem>
                            </Col>
                            <Col xxl={8} md={12} sm={24}>
                              <FormItem label="经营范围">
                                {getFieldDecorator('runRange', {
                                  initialValue: data.runRange,
                                  rules: [
                                    {
                                      max: 100,
                                      message: '长度不能超过100位',
                                    },
                                  ],
                                })(
                                  btnShow.institution.institution ? (
                                    <span>
                                      {data.runRange === undefined ? '--' : data.runRange}
                                    </span>
                                  ) : (
                                    <Input placeholder="请输入" />
                                  ),
                                )}
                              </FormItem>
                            </Col>
                            <Col xxl={8} md={12} sm={24}>
                              <FormItem label="注册地址">
                                {getFieldDecorator('registerAddress', {
                                  initialValue: data.registerAddress,
                                  rules: [
                                    {
                                      max: 200,
                                      message: '长度不能超过200位',
                                    },
                                  ],
                                })(
                                  btnShow.institution.institution ? (
                                    <span>
                                      {data.registerAddress === undefined
                                        ? '--'
                                        : data.registerAddress}
                                    </span>
                                  ) : (
                                    <TextArea
                                      placeholder="请输入"
                                      autosize={{ minRows: 2, maxRows: 6 }}
                                    />
                                  ),
                                )}
                              </FormItem>
                            </Col>
                            <Col xxl={8} md={12} sm={24}>
                              <FormItem label="办公地址">
                                {getFieldDecorator('officeAddress', {
                                  initialValue: data.officeAddress,
                                  rules: [
                                    {
                                      max: 200,
                                      message: '长度不能超过200位',
                                    },
                                  ],
                                })(
                                  btnShow.institution.institution ? (
                                    <span>
                                      {data.officeAddress === undefined ? '--' : data.officeAddress}
                                    </span>
                                  ) : (
                                    <TextArea
                                      placeholder="请输入"
                                      autosize={{ minRows: 2, maxRows: 6 }}
                                    />
                                  ),
                                )}
                              </FormItem>
                            </Col>
                            <Col xxl={8} md={12} sm={24}>
                              <FormItem label="注册资本">
                                {getFieldDecorator('registerCapital', {
                                  initialValue: data.registerCapital,
                                  rules: [
                                    {
                                      pattern: /^([1-9]\d{0,12})(\.[0-9]{1,2})?$/,
                                      message: '仅数字且整数部分长度不能超过13位(最多两位小数)',
                                    },
                                  ],
                                })(
                                  btnShow.institution.institution ? (
                                    <span>
                                      {data.registerCapital === undefined
                                        ? '--'
                                        : data.registerCapital}
                                    </span>
                                  ) : (
                                    <Input style={{ width: '100%' }} />
                                  ),
                                )}
                              </FormItem>
                            </Col>
                            <Col xxl={8} md={12} sm={24}>
                              <FormItem label="控股股东或实际控制人">
                                {getFieldDecorator('holdingPeople', {
                                  initialValue: data.holdingPeople,
                                  rules: [
                                    {
                                      max: 50,
                                      message: '长度不能超过50位',
                                    },
                                  ],
                                })(
                                  btnShow.institution.institution ? (
                                    <span>
                                      {data.holdingPeople === undefined ? '--' : data.holdingPeople}
                                    </span>
                                  ) : (
                                    <Input placeholder="请输入" />
                                  ),
                                )}
                              </FormItem>
                            </Col>
                          </Row>
                          <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                            <Col md={24} sm={24}>
                              <div
                                style={{
                                  display: btnShow.institution.institution ? 'none' : 'block',
                                }}
                                className={styles.openQueryBtn}
                              >
                                <Button type="primary" htmlType="submit">
                                  确定
                                </Button>
                                <Button onClick={() => this.cancel('institution', 'institution')}>
                                  取消
                                </Button>
                              </div>
                            </Col>
                          </Row>
                        </Form>
                      </div>
                    </Spin>
                  </Card>

                  <Card
                    title="法定代表/负责人信息"
                    extra={this.btnArea('institution', 'director')}
                    bodyStyle={{
                      borderTop: '1px solid #ddd',
                      padding: cardData.institution.director ? '14px 32px' : 0,
                    }}
                    style={{ marginTop: 20 }}
                  >
                    <Spin spinning={director}>
                      <div
                        className={styles.tableListForm1}
                        style={{ display: cardData.institution.director ? 'block' : 'none' }}
                      >
                        <Form
                          onSubmit={e =>
                            this.updateFields(
                              e,
                              [
                                'corporationName',
                                'corporationCardType',
                                'corporationCardNum',
                                'corporationEndDate',
                                'corporationDuties',
                                'corporationPhone',
                                'corporationEmail',
                                'corporationCall',
                                'corporationPostalCode',
                                'corporationAddress',
                              ],
                              'institution',
                              'director',
                            )
                          }
                          layout="inline"
                        >
                          <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                            <Col xxl={8} md={12} sm={24}>
                              <FormItem label="姓名">
                                {getFieldDecorator('corporationName', {
                                  initialValue: data.corporationName,
                                  rules: [
                                    {
                                      max: 20,
                                      message: '长度不能超过20位',
                                    },
                                  ],
                                })(
                                  btnShow.institution.director ? (
                                    <span>
                                      {data.corporationName === undefined
                                        ? '--'
                                        : data.corporationName}
                                    </span>
                                  ) : (
                                    <Input placeholder="请输入" />
                                  ),
                                )}
                              </FormItem>
                            </Col>
                            <Col xxl={8} md={12} sm={24}>
                              <FormItem label="证件类型">
                                {getFieldDecorator('corporationCardType', {
                                  initialValue: data.corporationCardType,
                                })(
                                  btnShow.institution.director ? (
                                    <span>
                                      {data.corporationCardTypeName === undefined
                                        ? '--'
                                        : data.corporationCardTypeName}
                                    </span>
                                  ) : (
                                    this.getDropdownData(dropDownList.TA_IDTPTP, true)
                                  ),
                                )}
                              </FormItem>
                            </Col>
                            <Col xxl={8} md={12} sm={24}>
                              <FormItem label="证件号码">
                                {getFieldDecorator('corporationCardNum', {
                                  initialValue: data.corporationCardNum,
                                  rules:
                                    ID === 0
                                      ? [
                                        {
                                          pattern: /(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}[0-9Xx]$)/,
                                          message: '请填写正确的证件号码',
                                        },
                                      ]
                                      : [
                                        {
                                          max: 30,
                                          message: '证件号码不能为空且长度不能超过30位',
                                        },
                                      ],
                                })(
                                  btnShow.institution.director ? (
                                    <span>
                                      {data.corporationCardNum === undefined
                                        ? '--'
                                        : data.corporationCardNum}
                                    </span>
                                  ) : (
                                    <Input placeholder="请输入" />
                                  ),
                                )}
                              </FormItem>
                            </Col>
                            <Col xxl={8} md={12} sm={24}>
                              <FormItem label="证件有效期">
                                {getFieldDecorator('corporationEndDate', {
                                  initialValue: data.corporationEndDate
                                    ? moment(data.corporationEndDate + '')
                                    : null,
                                })(
                                  btnShow.institution.director ? (
                                    <span>
                                      {data.corporationEndDate === undefined
                                        ? '--'
                                        : moment(data.corporationEndDate + '').format('YYYY-MM-DD')}
                                    </span>
                                  ) : (
                                    <DatePicker style={{ width: '100%' }} />
                                  ),
                                )}
                              </FormItem>
                            </Col>
                            <Col xxl={8} md={12} sm={24}>
                              <FormItem label="职务">
                                {getFieldDecorator('corporationDuties', {
                                  initialValue: data.corporationDuties,
                                  rules: [
                                    {
                                      max: 20,
                                      message: '长度不能超过20位',
                                    },
                                  ],
                                })(
                                  btnShow.institution.director ? (
                                    <span>
                                      {data.corporationDuties === undefined
                                        ? '--'
                                        : data.corporationDuties}
                                    </span>
                                  ) : (
                                    <Input placeholder="请输入" />
                                  ),
                                )}
                              </FormItem>
                            </Col>
                            <Col xxl={8} md={12} sm={24}>
                              <FormItem label="移动电话">
                                {getFieldDecorator('corporationPhone', {
                                  initialValue: data.corporationPhone,
                                  rules: [
                                    {
                                      pattern: /^1(3|4|5|7|8)\d{9}$/,
                                      message: '请填写正确的移动电话号码',
                                    },
                                  ],
                                })(
                                  btnShow.institution.director ? (
                                    <span>
                                      {data.corporationPhone === undefined
                                        ? '--'
                                        : data.corporationPhone}
                                    </span>
                                  ) : (
                                    <Input placeholder="请输入" />
                                  ),
                                )}
                              </FormItem>
                            </Col>
                            <Col xxl={8} md={12} sm={24}>
                              <FormItem label="电子邮箱">
                                {getFieldDecorator('corporationEmail', {
                                  initialValue: data.corporationEmail,
                                  rules: [
                                    {
                                      max: 20,
                                      message: '长度不能超过20位',
                                    },
                                  ],
                                })(
                                  btnShow.institution.director ? (
                                    <span>
                                      {data.corporationEmail === undefined
                                        ? '--'
                                        : data.corporationEmail}
                                    </span>
                                  ) : (
                                    <Input placeholder="请输入" />
                                  ),
                                )}
                              </FormItem>
                            </Col>
                            <Col xxl={8} md={12} sm={24}>
                              <FormItem label="办公电话">
                                {getFieldDecorator('corporationCall', {
                                  initialValue: data.corporationCall,
                                  rules: [
                                    {
                                      max: 50,
                                      message: '长度不能超过50位',
                                    },
                                  ],
                                })(
                                  btnShow.institution.director ? (
                                    <span>
                                      {data.corporationCall === undefined
                                        ? '--'
                                        : data.corporationCall}
                                    </span>
                                  ) : (
                                    <Input placeholder="请输入" />
                                  ),
                                )}
                              </FormItem>
                            </Col>
                            <Col xxl={8} md={12} sm={24}>
                              <FormItem label="邮政编码">
                                {getFieldDecorator('corporationPostalCode', {
                                  initialValue: data.corporationPostalCode,
                                  rules: [
                                    {
                                      pattern: /^[0-9]{6}$/,
                                      message: '请填写正确的邮政编码',
                                    },
                                  ],
                                })(
                                  btnShow.institution.director ? (
                                    <span>
                                      {data.corporationPostalCode === undefined
                                        ? '--'
                                        : data.corporationPostalCode}
                                    </span>
                                  ) : (
                                    <Input placeholder="请输入" />
                                  ),
                                )}
                              </FormItem>
                            </Col>
                            <Col xxl={8} md={12} sm={24}>
                              <FormItem label="办公地址">
                                {getFieldDecorator('corporationAddress', {
                                  initialValue: data.corporationAddress,
                                  rules: [
                                    {
                                      max: 200,
                                      message: '长度不能超过200位',
                                    },
                                  ],
                                })(
                                  btnShow.institution.director ? (
                                    <span>
                                      {data.corporationAddress === undefined
                                        ? '--'
                                        : data.corporationAddress}
                                    </span>
                                  ) : (
                                    <TextArea
                                      placeholder="请输入"
                                      autosize={{ minRows: 2, maxRows: 6 }}
                                    />
                                  ),
                                )}
                              </FormItem>
                            </Col>
                          </Row>
                          <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                            <Col md={24} sm={24}>
                              <div
                                style={{ display: btnShow.institution.director ? 'none' : 'block' }}
                                className={styles.openQueryBtn}
                              >
                                <Button type="primary" htmlType="submit">
                                  确定
                                </Button>
                                <Button onClick={() => this.cancel('institution', 'director')}>
                                  取消
                                </Button>
                              </div>
                            </Col>
                          </Row>
                        </Form>
                      </div>
                    </Spin>
                  </Card>

                  <Card
                    title="资质信息"
                    extra={this.btnArea('institution', 'aptitude')}
                    bodyStyle={{
                      borderTop: '1px solid #ddd',
                      padding: cardData.institution.aptitude ? '14px 32px' : 0,
                    }}
                    style={{ marginTop: 20 }}
                  >
                    <Spin spinning={aptitude}>
                      <div
                        className={styles.tableListForm1}
                        style={{ display: cardData.institution.aptitude ? 'block' : 'none' }}
                      >
                        <Form
                          onSubmit={e =>
                            this.updateFields(
                              e,
                              [
                                'qualifiedInvestor',
                                'riskGrade',
                                'controlRel',
                                'beneficiary',
                                'badRecord',
                              ],
                              'institution',
                              'aptitude',
                            )
                          }
                          layout="inline"
                        >
                          <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                            <Col xxl={8} md={12} sm={24}>
                              <FormItem label="合格投资者">
                                {getFieldDecorator('qualifiedInvestor', {
                                  initialValue: data.qualifiedInvestor,
                                })(
                                  btnShow.institution.aptitude ? (
                                    <span>
                                      {data.qualifiedInvestorName === undefined
                                        ? '--'
                                        : data.qualifiedInvestorName}
                                    </span>
                                  ) : (
                                    this.getDropdownData(qualifiedInvestor, false, 1)
                                  ),
                                )}
                              </FormItem>
                            </Col>
                            <Col xxl={8} md={12} sm={24}>
                              <FormItem label="投资者风险等级">
                                {getFieldDecorator('riskGrade', {
                                  initialValue: data.riskGrade,
                                })(
                                  btnShow.institution.aptitude ? (
                                    <span>
                                      {data.riskGradeName === undefined ? '--' : data.riskGradeName}
                                    </span>
                                  ) : (
                                    this.getDropdownData(dropDownList.InvestorRiskLevel, false, 1)
                                  ),
                                )}
                              </FormItem>
                            </Col>
                            <Col xxl={8} md={12} sm={24}>
                              <FormItem label="是否存在实际控制关系">
                                {getFieldDecorator('controlRel', {
                                  initialValue: data.controlRel,
                                })(
                                  btnShow.institution.aptitude ? (
                                    <span>
                                      {data.controlRelName === undefined
                                        ? '--'
                                        : data.controlRelName}
                                    </span>
                                  ) : (
                                    this.getDropdownData(controlRel)
                                  ),
                                )}
                              </FormItem>
                            </Col>
                            <Col xxl={8} md={12} sm={24}>
                              <FormItem label="交易的实际受益人">
                                {getFieldDecorator('beneficiary', {
                                  initialValue: data.beneficiary,
                                  rules: [
                                    {
                                      max: 20,
                                      message: '长度不能超过20位',
                                    },
                                  ],
                                })(
                                  btnShow.institution.aptitude ? (
                                    <span>
                                      {data.beneficiary === undefined ? '--' : data.beneficiary}
                                    </span>
                                  ) : (
                                    <Input placeholder="请输入" />
                                  ),
                                )}
                              </FormItem>
                            </Col>
                            <Col xxl={8} md={12} sm={24}>
                              <FormItem label="是否有不良诚信记录">
                                {getFieldDecorator('badRecord', {
                                  initialValue: data.badRecord,
                                })(
                                  btnShow.institution.aptitude ? (
                                    <span>
                                      {data.badRecordName === undefined ? '--' : data.badRecordName}
                                    </span>
                                  ) : (
                                    this.getDropdownData(badRecord)
                                  ),
                                )}
                              </FormItem>
                            </Col>
                          </Row>
                          <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                            <Col md={24} sm={24}>
                              <div
                                style={{ display: btnShow.institution.aptitude ? 'none' : 'block' }}
                                className={styles.openQueryBtn}
                              >
                                <Button type="primary" htmlType="submit">
                                  确定
                                </Button>
                                <Button onClick={() => this.cancel('institution', 'aptitude')}>
                                  取消
                                </Button>
                              </div>
                            </Col>
                          </Row>
                        </Form>
                      </div>
                    </Spin>
                  </Card>

                  <Card
                    title="其它信息"
                    extra={this.btnArea('institution', 'other')}
                    bodyStyle={{
                      borderTop: '1px solid #ddd',
                      padding: cardData.institution.other ? '14px 32px' : 0,
                    }}
                    style={{ marginTop: 20 }}
                  >
                    <Spin spinning={other}>
                      <div
                        className={styles.tableListForm1}
                        style={{ display: cardData.institution.other ? 'block' : 'none' }}
                      >
                        <Form
                          onSubmit={e =>
                            this.updateFields(
                              e,
                              [
                                'acceptWay',
                                'dealWay',
                                'sendWay',
                                'sendFrequency',
                                'regionNum',
                                'shanghaiSecAcc',
                                'shenzhenSecAcc',
                                'referrerType',
                                'referrerName',
                              ],
                              'institution',
                              'other',
                            )
                          }
                          layout="inline"
                        >
                          <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                            <Col xxl={8} md={12} sm={24}>
                              <FormItem label="受理方式">
                                {getFieldDecorator('acceptWay', {
                                  initialValue: data.acceptWay,
                                })(
                                  btnShow.institution.other ? (
                                    <span>
                                      {data.acceptWayName === undefined ? '--' : data.acceptWayName}
                                    </span>
                                  ) : (
                                    this.getDropdownData(dropDownList.TA_ACCPTMD)
                                  ),
                                )}
                              </FormItem>
                            </Col>
                            <Col xxl={8} md={12} sm={24}>
                              <FormItem label="使用的交易手段">
                                {getFieldDecorator('dealWay', {
                                  initialValue: data.dealWay,
                                })(
                                  btnShow.institution.other ? (
                                    <span>
                                      {data.dealWayName === undefined ? '--' : data.dealWayName}
                                    </span>
                                  ) : (
                                    this.getDropdownData(dropDownList.tradingMethod)
                                  ),
                                )}
                              </FormItem>
                            </Col>
                            <Col xxl={8} md={12} sm={24}>
                              <FormItem label="账单寄送方式">
                                {getFieldDecorator('sendWay', {
                                  initialValue: data.sendWay,
                                })(
                                  btnShow.institution.other ? (
                                    <span>
                                      {data.sendWayName === undefined ? '--' : data.sendWayName}
                                    </span>
                                  ) : (
                                    this.getDropdownData(dropDownList.TA_STATEMENTFLAG)
                                  ),
                                )}
                              </FormItem>
                            </Col>
                            <Col xxl={8} md={12} sm={24}>
                              <FormItem label="账单寄送频率">
                                {getFieldDecorator('sendFrequency', {
                                  initialValue: data.sendFrequency,
                                })(
                                  btnShow.institution.other ? (
                                    <span>
                                      {data.sendFrequencyName === undefined
                                        ? '--'
                                        : data.sendFrequencyName}
                                    </span>
                                  ) : (
                                    this.getDropdownData(dropDownList.TA_DELIVERTYPE)
                                  ),
                                )}
                              </FormItem>
                            </Col>
                            <Col xxl={8} md={12} sm={24}>
                              <FormItem label="交易所在地区编号">
                                {getFieldDecorator('regionNum', {
                                  initialValue: data.regionNum,
                                  rules: [
                                    {
                                      max: 20,
                                      message: '长度不能超过20位',
                                    },
                                  ],
                                })(
                                  btnShow.institution.other ? (
                                    <span>
                                      {data.regionNum === undefined ? '--' : data.regionNum}
                                    </span>
                                  ) : (
                                    <Input placeholder="请输入" />
                                  ),
                                )}
                              </FormItem>
                            </Col>
                            <Col xxl={8} md={12} sm={24}>
                              <FormItem label="上交所证券账户">
                                {getFieldDecorator('shanghaiSecAcc', {
                                  initialValue: data.shanghaiSecAcc,
                                  rules: [
                                    {
                                      max: 100,
                                      message: '长度不能超过100位',
                                    },
                                  ],
                                })(
                                  btnShow.institution.other ? (
                                    <span>
                                      {data.shanghaiSecAcc === undefined
                                        ? '--'
                                        : data.shanghaiSecAcc}
                                    </span>
                                  ) : (
                                    <Input placeholder="请输入" />
                                  ),
                                )}
                              </FormItem>
                            </Col>
                            <Col xxl={8} md={12} sm={24}>
                              <FormItem label="深交所证券账户">
                                {getFieldDecorator('shenzhenSecAcc', {
                                  initialValue: data.shenzhenSecAcc,
                                  rules: [
                                    {
                                      max: 100,
                                      message: '长度不能超过100位',
                                    },
                                  ],
                                })(
                                  btnShow.institution.other ? (
                                    <span>
                                      {data.shenzhenSecAcc === undefined
                                        ? '--'
                                        : data.shenzhenSecAcc}
                                    </span>
                                  ) : (
                                    <Input placeholder="请输入" />
                                  ),
                                )}
                              </FormItem>
                            </Col>
                            <Col xxl={8} md={12} sm={24}>
                              <FormItem label="推荐人类型">
                                {getFieldDecorator('referrerType', {
                                  initialValue: data.referrerType,
                                })(
                                  btnShow.institution.other ? (
                                    <span>
                                      {data.referrerTypeName === undefined
                                        ? '--'
                                        : data.referrerTypeName}
                                    </span>
                                  ) : (
                                    this.getDropdownData(dropDownList.referrerType)
                                  ),
                                )}
                              </FormItem>
                            </Col>
                            <Col xxl={8} md={12} sm={24}>
                              <FormItem label="推荐人">
                                {getFieldDecorator('referrerName', {
                                  initialValue: data.referrerName,
                                  rules: [
                                    {
                                      max: 20,
                                      message: '长度不能超过20位',
                                    },
                                  ],
                                })(
                                  btnShow.institution.other ? (
                                    <span>
                                      {data.referrerName === undefined ? '--' : data.referrerName}
                                    </span>
                                  ) : (
                                    <Input placeholder="请输入" />
                                  ),
                                )}
                              </FormItem>
                            </Col>
                          </Row>
                          <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                            <Col md={24} sm={24}>
                              <div
                                style={{ display: btnShow.institution.other ? 'none' : 'block' }}
                                className={styles.openQueryBtn}
                              >
                                <Button type="primary" htmlType="submit">
                                  确定
                                </Button>
                                <Button onClick={() => this.cancel('institution', 'other')}>
                                  取消
                                </Button>
                              </div>
                            </Col>
                          </Row>
                        </Form>
                      </div>
                    </Spin>
                  </Card>
                </div>
              ) : (
                <div className={styles.investorManageBox}>
                  <Card
                    title="基础信息"
                    extra={this.btnArea('product', 'basic')}
                    bodyStyle={{
                      borderTop: '1px solid #ddd',
                      padding: cardData.product.basic ? '14px 32px' : 0,
                    }}
                  >
                    <Spin spinning={basic}>
                      <div
                        className={styles.tableListForm1}
                        style={{ display: cardData.product.basic ? 'block' : 'none' }}
                      >
                        <Form
                          onSubmit={e =>
                            this.updateFields(
                              e,
                              ['investorType', 'name', 'nameInitials', 'endDate'],
                              'product',
                              'basic',
                            )
                          }
                          layout="inline"
                        >
                          <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                            <Col xxl={8} md={12} sm={24}>
                              <FormItem label="投资者类型">
                                {getFieldDecorator('investorType', {
                                  initialValue: data.investorType,
                                  rules: [
                                    {
                                      required: true,
                                      message: '投资者类型不能为空',
                                    },
                                  ],
                                })(
                                  btnShow.product.basic ? (
                                    <span>
                                      {data.investorTypeName === undefined
                                        ? '--'
                                        : data.investorTypeName}
                                    </span>
                                  ) : (
                                    this.getDropdownData(investorType)
                                  ),
                                )}
                              </FormItem>
                            </Col>
                            <Col xxl={8} md={12} sm={24}>
                              <FormItem label="投资者名称">
                                {getFieldDecorator('name', {
                                  initialValue: data.name,
                                  rules: [
                                    {
                                      required: true,
                                      max: 120,
                                      message: '投资者名称不能为空且长度不能超过120位',
                                    },
                                  ],
                                })(
                                  btnShow.product.basic ? (
                                    <span>{data.name === undefined ? '--' : data.name}</span>
                                  ) : (
                                    <Input placeholder="请输入" />
                                  ),
                                )}
                              </FormItem>
                            </Col>
                            <Col xxl={8} md={12} sm={24}>
                              <FormItem label="投资者简称">
                                {getFieldDecorator('nameInitials', {
                                  initialValue: data.nameInitials,
                                  rules: [
                                    {
                                      max: 20,
                                      message: '长度不能超过20位',
                                    },
                                  ],
                                })(
                                  btnShow.product.basic ? (
                                    <span>
                                      {data.nameInitials === undefined ? '--' : data.nameInitials}
                                    </span>
                                  ) : (
                                    <Input placeholder="请输入" />
                                  ),
                                )}
                              </FormItem>
                            </Col>
                            <Col xxl={8} md={12} sm={24}>
                              <FormItem label="证件类型">
                                {getFieldDecorator('cardType', {
                                  initialValue: data.cardType,
                                  rules: [
                                    {
                                      required: true,
                                      message: '证件类型不能为空',
                                    },
                                  ],
                                })(
                                  <span>
                                    {data.cardTypeName === undefined ? '--' : data.cardTypeName}
                                  </span>,
                                )}
                              </FormItem>
                            </Col>
                            <Col xxl={8} md={12} sm={24}>
                              <FormItem label="证件号码">
                                {getFieldDecorator('cardNum', {
                                  initialValue: data.cardNum,
                                  rules: [
                                    {
                                      required: true,
                                      max: 30,
                                      message: '证件号码不能为空且长度不能超过30位',
                                    },
                                  ],
                                })(<span>{data.cardNum === undefined ? '--' : data.cardNum}</span>)}
                              </FormItem>
                            </Col>
                            <Col xxl={8} md={12} sm={24}>
                              <FormItem label="证件有效期">
                                {getFieldDecorator('endDate', {
                                  initialValue: data.endDate ? moment(data.endDate + '') : null,
                                })(
                                  btnShow.product.basic ? (
                                    <span>
                                      {data.endDate === undefined
                                        ? '--'
                                        : moment(data.endDate + '').format('YYYY-MM-DD')}
                                    </span>
                                  ) : (
                                    <DatePicker style={{ width: '100%' }} />
                                  ),
                                )}
                              </FormItem>
                            </Col>
                          </Row>
                          <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                            <Col md={24} sm={24}>
                              <div
                                style={{ display: btnShow.product.basic ? 'none' : 'block' }}
                                className={styles.openQueryBtn}
                              >
                                <Button type="primary" htmlType="submit">
                                  确定
                                </Button>
                                <Button onClick={() => this.cancel('product', 'basic')}>
                                  取消
                                </Button>
                              </div>
                            </Col>
                          </Row>
                        </Form>
                      </div>
                    </Spin>
                  </Card>

                  <Card
                    title="经办人信息"
                    extra={this.btnArea('product', 'agent')}
                    bodyStyle={{
                      borderTop: '1px solid #ddd',
                      padding: cardData.product.agent ? '14px 32px' : 0,
                    }}
                    style={{ marginTop: 20 }}
                  >
                    <Spin spinning={agent}>
                      <div
                        className={styles.tableListForm1}
                        style={{ display: cardData.product.agent ? 'block' : 'none' }}
                      >
                        <Form
                          onSubmit={e =>
                            this.updateFields(
                              e,
                              [
                                'agentName',
                                'agentCardType',
                                'agentCardNum',
                                'agentEndDate',
                                'agentDuties',
                                'agentRelationship',
                              ],
                              'product',
                              'agent',
                            )
                          }
                          layout="inline"
                        >
                          <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                            <Col xxl={8} md={12} sm={24}>
                              <FormItem label="姓名">
                                {getFieldDecorator('agentName', {
                                  initialValue: data.agentName,
                                  rules: [
                                    {
                                      required: true,
                                      max: 20,
                                      message: '姓名不能为空且长度不能超过20位',
                                    },
                                  ],
                                })(
                                  btnShow.product.agent ? (
                                    <span>
                                      {data.agentName === undefined ? '--' : data.agentName}
                                    </span>
                                  ) : (
                                    <Input placeholder="请输入" />
                                  ),
                                )}
                              </FormItem>
                            </Col>
                            <Col xxl={8} md={12} sm={24}>
                              <FormItem label="证件类型">
                                {getFieldDecorator('agentCardType', {
                                  initialValue: data.agentCardType,
                                  rules: [
                                    {
                                      required: true,
                                      message: '证件类型不能为空',
                                    },
                                  ],
                                })(
                                  btnShow.product.agent ? (
                                    <span>
                                      {data.agentCardTypeName === undefined
                                        ? '--'
                                        : data.agentCardTypeName}
                                    </span>
                                  ) : (
                                    this.getDropdownData(dropDownList.TA_IDTPTP, true)
                                  ),
                                )}
                              </FormItem>
                            </Col>
                            <Col xxl={8} md={12} sm={24}>
                              <FormItem label="证件号码">
                                {getFieldDecorator('agentCardNum', {
                                  initialValue: data.agentCardNum,
                                  rules:
                                    ID === 0
                                      ? [
                                        {
                                          required: true,
                                          pattern: /(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}[0-9Xx]$)/,
                                          message: '请填写正确的证件号码',
                                        },
                                      ]
                                      : [
                                        {
                                          required: true,
                                          max: 30,
                                          message: '证件号码不能为空且长度不能超过30位',
                                        },
                                      ],
                                })(
                                  btnShow.product.agent ? (
                                    <span>
                                      {data.agentCardNum === undefined ? '--' : data.agentCardNum}
                                    </span>
                                  ) : (
                                    <Input placeholder="请输入" />
                                  ),
                                )}
                              </FormItem>
                            </Col>
                            <Col xxl={8} md={12} sm={24}>
                              <FormItem label="证件有效期">
                                {getFieldDecorator('agentEndDate', {
                                  initialValue: data.agentEndDate
                                    ? moment(data.agentEndDate + '')
                                    : null,
                                })(
                                  btnShow.product.agent ? (
                                    <span>
                                      {data.agentEndDate === undefined
                                        ? '--'
                                        : moment(data.agentEndDate + '').format('YYYY-MM-DD')}
                                    </span>
                                  ) : (
                                    <DatePicker style={{ width: '100%' }} />
                                  ),
                                )}
                              </FormItem>
                            </Col>
                            <Col xxl={8} md={12} sm={24}>
                              <FormItem label="职务">
                                {getFieldDecorator('agentDuties', {
                                  initialValue: data.agentDuties,
                                  rules: [
                                    {
                                      max: 50,
                                      message: '长度不能超过50位',
                                    },
                                  ],
                                })(
                                  btnShow.product.agent ? (
                                    <span>
                                      {data.agentDuties === undefined ? '--' : data.agentDuties}
                                    </span>
                                  ) : (
                                    <Input placeholder="请输入" />
                                  ),
                                )}
                              </FormItem>
                            </Col>
                            <Col xxl={8} md={12} sm={24}>
                              <FormItem label="与该产品关系">
                                {getFieldDecorator('agentRelationship', {
                                  initialValue: data.agentRelationship,
                                  rules: [
                                    {
                                      max: 20,
                                      message: '长度不能超过20位',
                                    },
                                  ],
                                })(
                                  btnShow.product.agent ? (
                                    <span>
                                      {data.agentRelationship === undefined
                                        ? '--'
                                        : data.agentRelationship}
                                    </span>
                                  ) : (
                                    <Input placeholder="请输入" />
                                  ),
                                )}
                              </FormItem>
                            </Col>
                          </Row>
                          <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                            <Col md={24} sm={24}>
                              <div
                                style={{ display: btnShow.product.agent ? 'none' : 'block' }}
                                className={styles.openQueryBtn}
                              >
                                <Button type="primary" htmlType="submit">
                                  确定
                                </Button>
                                <Button onClick={() => this.cancel('product', 'agent')}>
                                  取消
                                </Button>
                              </div>
                            </Col>
                          </Row>
                        </Form>
                      </div>
                    </Spin>
                  </Card>

                  <Card
                    title="通讯信息"
                    extra={this.btnArea('product', 'communication')}
                    bodyStyle={{
                      borderTop: '1px solid #ddd',
                      padding: cardData.product.communication ? '14px 32px' : 0,
                    }}
                    style={{ marginTop: 20 }}
                  >
                    <Spin spinning={communication}>
                      <div
                        className={styles.tableListForm1}
                        style={{ display: cardData.product.communication ? 'block' : 'none' }}
                      >
                        <Form
                          onSubmit={e =>
                            this.updateFields(
                              e,
                              ['phone', 'email', 'officePhone', 'postalCode', 'fax', 'address'],
                              'product',
                              'communication',
                            )
                          }
                          layout="inline"
                        >
                          <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                            <Col xxl={8} md={12} sm={24}>
                              <FormItem label="移动电话">
                                {getFieldDecorator('phone', {
                                  initialValue: data.phone,
                                  rules: [
                                    {
                                      required: true,
                                      pattern: /^1(3|4|5|7|8)\d{9}$/,
                                      message: '请填写正确的移动电话号码',
                                    },
                                  ],
                                })(
                                  btnShow.product.communication ? (
                                    <span>{data.phone === undefined ? '--' : data.phone}</span>
                                  ) : (
                                    <Input placeholder="请输入" />
                                  ),
                                )}
                              </FormItem>
                            </Col>
                            <Col xxl={8} md={12} sm={24}>
                              <FormItem label="电子邮箱">
                                {getFieldDecorator('email', {
                                  initialValue: data.email,
                                  rules: [
                                    {
                                      max: 20,
                                      message: '长度不能超过20位',
                                    },
                                  ],
                                })(
                                  btnShow.product.communication ? (
                                    <span>{data.email === undefined ? '--' : data.email}</span>
                                  ) : (
                                    <Input placeholder="请输入" />
                                  ),
                                )}
                              </FormItem>
                            </Col>
                            <Col xxl={8} md={12} sm={24}>
                              <FormItem label="办公电话">
                                {getFieldDecorator('officePhone', {
                                  initialValue: data.officePhone,
                                  rules: [
                                    {
                                      max: 50,
                                      message: '长度不能超过50位',
                                    },
                                  ],
                                })(
                                  btnShow.product.communication ? (
                                    <span>
                                      {data.officePhone === undefined ? '--' : data.officePhone}
                                    </span>
                                  ) : (
                                    <Input placeholder="请输入" />
                                  ),
                                )}
                              </FormItem>
                            </Col>
                            <Col xxl={8} md={12} sm={24}>
                              <FormItem label="邮政编码">
                                {getFieldDecorator('postalCode', {
                                  initialValue: data.postalCode,
                                  rules: [
                                    {
                                      pattern: /^[0-9]{6}$/,
                                      message: '请填写正确的邮政编码',
                                    },
                                  ],
                                })(
                                  btnShow.product.communication ? (
                                    <span>
                                      {data.postalCode === undefined ? '--' : data.postalCode}
                                    </span>
                                  ) : (
                                    <Input placeholder="请输入" />
                                  ),
                                )}
                              </FormItem>
                            </Col>
                            <Col xxl={8} md={12} sm={24}>
                              <FormItem label="传真号码">
                                {getFieldDecorator('fax', {
                                  initialValue: data.fax,
                                  rules: [
                                    {
                                      max: 50,
                                      message: '长度不能超过50位',
                                    },
                                  ],
                                })(
                                  btnShow.product.communication ? (
                                    <span>{data.fax === undefined ? '--' : data.fax}</span>
                                  ) : (
                                    <Input placeholder="请输入" />
                                  ),
                                )}
                              </FormItem>
                            </Col>
                            <Col xxl={8} md={12} sm={24}>
                              <FormItem label="通讯地址">
                                {getFieldDecorator('address', {
                                  initialValue: data.address,
                                  rules: [
                                    {
                                      max: 200,
                                      message: '长度不能超过200位',
                                    },
                                  ],
                                })(
                                  btnShow.product.communication ? (
                                    <span>{data.address === undefined ? '--' : data.address}</span>
                                  ) : (
                                    <TextArea
                                      placeholder="请输入"
                                      autosize={{ minRows: 2, maxRows: 6 }}
                                    />
                                  ),
                                )}
                              </FormItem>
                            </Col>
                          </Row>
                          <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                            <Col md={24} sm={24}>
                              <div
                                style={{
                                  display: btnShow.product.communication ? 'none' : 'block',
                                }}
                                className={styles.openQueryBtn}
                              >
                                <Button type="primary" htmlType="submit">
                                  确定
                                </Button>
                                <Button onClick={() => this.cancel('product', 'communication')}>
                                  取消
                                </Button>
                              </div>
                            </Col>
                          </Row>
                        </Form>
                      </div>
                    </Spin>
                  </Card>

                  <Card
                    title="产品信息"
                    extra={this.btnArea('product', 'product')}
                    bodyStyle={{
                      borderTop: '1px solid #ddd',
                      padding: cardData.product.product ? '14px 32px' : 0,
                    }}
                    style={{ marginTop: 20 }}
                  >
                    <Spin spinning={product}>
                      <div
                        className={styles.tableListForm1}
                        style={{ display: cardData.product.product ? 'block' : 'none' }}
                      >
                        <Form
                          onSubmit={e =>
                            this.updateFields(
                              e,
                              [
                                'recordsOrg',
                                'foundingTime',
                                'recordsTime',
                                'recordsNum',
                                'duration',
                                'productType',
                                'scale',
                                'trusteeId',
                                'custodianId',
                              ],
                              'product',
                              'product',
                            )
                          }
                          layout="inline"
                        >
                          <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                            <Col xxl={8} md={12} sm={24}>
                              <FormItem label="产品备案机构">
                                {getFieldDecorator('recordsOrg', {
                                  initialValue: data.recordsOrg,
                                  rules: [
                                    {
                                      max: 200,
                                      message: '长度不能超过200位',
                                    },
                                  ],
                                })(
                                  btnShow.product.product ? (
                                    <span>
                                      {data.recordsOrgName === undefined
                                        ? '--'
                                        : data.recordsOrgName}
                                    </span>
                                  ) : (
                                    this.orgTypeSelect(productRecordingAgency)
                                  ),
                                )}
                              </FormItem>
                            </Col>
                            <Col xxl={8} md={12} sm={24}>
                              <FormItem label="成立时间">
                                {getFieldDecorator('foundingTime', {
                                  initialValue: data.foundingTime
                                    ? moment(data.foundingTime + '')
                                    : null,
                                })(
                                  btnShow.product.product ? (
                                    <span>
                                      {data.foundingTime === undefined
                                        ? '--'
                                        : moment(data.foundingTime + '').format('YYYY-MM-DD')}
                                    </span>
                                  ) : (
                                    <DatePicker style={{ width: '100%' }} />
                                  ),
                                )}
                              </FormItem>
                            </Col>
                            <Col xxl={8} md={12} sm={24}>
                              <FormItem label="备案时间">
                                {getFieldDecorator('recordsTime', {
                                  initialValue: data.recordsTime
                                    ? moment(data.recordsTime + '')
                                    : null,
                                })(
                                  btnShow.product.product ? (
                                    <span>
                                      {data.recordsTime === undefined
                                        ? '--'
                                        : moment(data.recordsTime + '').format('YYYY-MM-DD')}
                                    </span>
                                  ) : (
                                    <DatePicker style={{ width: '100%' }} />
                                  ),
                                )}
                              </FormItem>
                            </Col>
                            <Col xxl={8} md={12} sm={24}>
                              <FormItem label="产品备案编号">
                                {getFieldDecorator('recordsNum', {
                                  initialValue: data.recordsNum,
                                  rules: [
                                    {
                                      max: 100,
                                      message: '长度不能超过100位',
                                    },
                                  ],
                                })(
                                  btnShow.product.product ? (
                                    <span>
                                      {data.recordsNum === undefined ? '--' : data.recordsNum}
                                    </span>
                                  ) : (
                                    <Input placeholder="请输入" />
                                  ),
                                )}
                              </FormItem>
                            </Col>
                            <Col xxl={8} md={12} sm={24}>
                              <FormItem label="产品存续期">
                                {getFieldDecorator('duration', {
                                  initialValue: data.duration,
                                  rules: [
                                    {
                                      pattern: /^[1-9]\d{0,95}([年|月|日]{1})$/,
                                      message: '仅数字(且数字部分不能超过96位)+单位(年/月/日)',
                                    },
                                  ],
                                })(
                                  btnShow.product.product ? (
                                    <span>
                                      {data.duration === undefined ? '--' : data.duration}
                                    </span>
                                  ) : (
                                    <Input placeholder="请输入" />
                                  ),
                                )}
                              </FormItem>
                            </Col>
                            <Col xxl={8} md={12} sm={24}>
                              <FormItem label="产品类别">
                                {getFieldDecorator('productType', {
                                  initialValue: data.productType,
                                })(
                                  btnShow.product.product ? (
                                    <span>
                                      {data.productTypeName === undefined
                                        ? '--'
                                        : data.productTypeName}
                                    </span>
                                  ) : (
                                    this.getforgtype(proTypeData)
                                  ),
                                )}
                              </FormItem>
                            </Col>
                            <Col xxl={8} md={12} sm={24}>
                              <FormItem label="产品规模">
                                {getFieldDecorator('scale', {
                                  initialValue: data.scale,
                                  rules: [
                                    {
                                      pattern: /^([1-9]\d{0,12})(\.[0-9]{1,2})?$/,
                                      message: '仅数字且整数部分长度不能超过13位(最多两位小数)',
                                    },
                                  ],
                                })(
                                  btnShow.product.product ? (
                                    <span>{data.scale === undefined ? '--' : data.scale}</span>
                                  ) : (
                                    <Input style={{ width: '100%' }} />
                                  ),
                                )}
                              </FormItem>
                            </Col>
                            <Col xxl={8} md={12} sm={24}>
                              <FormItem label="产品托管人">
                                {getFieldDecorator('trusteeId', {
                                  initialValue: data.trusteeId,
                                })(
                                  btnShow.product.product ? (
                                    <span>
                                      {data.trusteeIdName === undefined ? '--' : data.trusteeIdName}
                                    </span>
                                  ) : (
                                    this.agentSelect(orgData.TG)
                                  ),
                                )}
                              </FormItem>
                            </Col>
                            <Col xxl={8} md={12} sm={24}>
                              <FormItem label="管理人名称">
                                {getFieldDecorator('custodianId', {
                                  initialValue: data.custodianId,
                                })(
                                  btnShow.product.product ? (
                                    <span>
                                      {data.custodianIdName === undefined
                                        ? '--'
                                        : data.custodianIdName}
                                    </span>
                                  ) : (
                                    this.agentSelect(orgData.GL)
                                  ),
                                )}
                              </FormItem>
                            </Col>
                          </Row>
                          <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                            <Col md={24} sm={24}>
                              <div
                                style={{ display: btnShow.product.product ? 'none' : 'block' }}
                                className={styles.openQueryBtn}
                              >
                                <Button type="primary" htmlType="submit">
                                  确定
                                </Button>
                                <Button onClick={() => this.cancel('product', 'product')}>
                                  取消
                                </Button>
                              </div>
                            </Col>
                          </Row>
                        </Form>
                      </div>
                    </Spin>
                  </Card>

                  <Card
                    title="机构信息"
                    extra={this.btnArea('product', 'institution')}
                    bodyStyle={{
                      borderTop: '1px solid #ddd',
                      padding: cardData.product.institution ? '14px 32px' : 0,
                    }}
                    style={{ marginTop: 20 }}
                  >
                    <Spin spinning={institution}>
                      <div
                        className={styles.tableListForm1}
                        style={{ display: cardData.product.institution ? 'block' : 'none' }}
                      >
                        <Form
                          onSubmit={e =>
                            this.updateFields(
                              e,
                              [
                                'orgType',
                                'orgCardType',
                                'orgCardNum',
                                'orgEndDate',
                                'qualifications',
                                'qualificationsNum',
                                'runRange',
                                'registerAddress',
                                'officeAddress',
                                'registerCapital',
                                'holdingPeople',
                              ],
                              'product',
                              'institution',
                            )
                          }
                          layout="inline"
                        >
                          <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                            <Col xxl={8} md={12} sm={24}>
                              <FormItem label="机构类型">
                                {getFieldDecorator('orgType', {
                                  initialValue: data.orgType,
                                })(
                                  btnShow.product.institution ? (
                                    <span>
                                      {data.orgTypeName === undefined ? '--' : data.orgTypeName}
                                    </span>
                                  ) : (
                                    this.orgTypeSelect(orgType)
                                  ),
                                )}
                              </FormItem>
                            </Col>
                            <Col xxl={8} md={12} sm={24}>
                              <FormItem label="机构证件类型">
                                {getFieldDecorator('orgCardType', {
                                  initialValue: data.orgCardType,
                                })(
                                  btnShow.product.institution ? (
                                    <span>
                                      {data.orgCardTypeName === undefined
                                        ? '--'
                                        : data.orgCardTypeName}
                                    </span>
                                  ) : (
                                    this.getDropdownData(dropDownList.TA_IDTP)
                                  ),
                                )}
                              </FormItem>
                            </Col>
                            <Col xxl={8} md={12} sm={24}>
                              <FormItem label="机构证件编号">
                                {getFieldDecorator('orgCardNum', {
                                  initialValue: data.orgCardNum,
                                  rules: [
                                    {
                                      max: 100,
                                      message: '长度不能超过100位',
                                    },
                                  ],
                                })(
                                  btnShow.product.institution ? (
                                    <span>
                                      {data.orgCardNum === undefined ? '--' : data.orgCardNum}
                                    </span>
                                  ) : (
                                    <Input placeholder="请输入" />
                                  ),
                                )}
                              </FormItem>
                            </Col>
                            <Col xxl={8} md={12} sm={24}>
                              <FormItem label="有效期">
                                {getFieldDecorator('orgEndDate', {
                                  initialValue: data.orgEndDate
                                    ? moment(data.orgEndDate + '')
                                    : null,
                                })(
                                  btnShow.product.institution ? (
                                    <span>
                                      {data.orgEndDate === undefined
                                        ? '--'
                                        : moment(data.orgEndDate + '').format('YYYY-MM-DD')}
                                    </span>
                                  ) : (
                                    <DatePicker style={{ width: '100%' }} />
                                  ),
                                )}
                              </FormItem>
                            </Col>
                            <Col xxl={8} md={12} sm={24}>
                              <FormItem label="机构资质证明">
                                {getFieldDecorator('qualifications', {
                                  initialValue: data.qualifications,
                                  rules: [
                                    {
                                      max: 100,
                                      message: '长度不能超过100位',
                                    },
                                  ],
                                })(
                                  btnShow.product.institution ? (
                                    <span>
                                      {data.qualifications === undefined
                                        ? '--'
                                        : data.qualifications}
                                    </span>
                                  ) : (
                                    <Input placeholder="请输入" />
                                  ),
                                )}
                              </FormItem>
                            </Col>
                            <Col xxl={8} md={12} sm={24}>
                              <FormItem label="资质证书编号">
                                {getFieldDecorator('qualificationsNum', {
                                  initialValue: data.qualificationsNum,
                                  rules: [
                                    {
                                      max: 100,
                                      message: '长度不能超过100位',
                                    },
                                  ],
                                })(
                                  btnShow.product.institution ? (
                                    <span>
                                      {data.qualificationsNum === undefined
                                        ? '--'
                                        : data.qualificationsNum}
                                    </span>
                                  ) : (
                                    <Input placeholder="请输入" />
                                  ),
                                )}
                              </FormItem>
                            </Col>
                            <Col xxl={8} md={12} sm={24}>
                              <FormItem label="经营范围">
                                {getFieldDecorator('runRange', {
                                  initialValue: data.runRange,
                                  rules: [
                                    {
                                      max: 100,
                                      message: '长度不能超过100位',
                                    },
                                  ],
                                })(
                                  btnShow.product.institution ? (
                                    <span>
                                      {data.runRange === undefined ? '--' : data.runRange}
                                    </span>
                                  ) : (
                                    <Input placeholder="请输入" />
                                  ),
                                )}
                              </FormItem>
                            </Col>
                            <Col xxl={8} md={12} sm={24}>
                              <FormItem label="注册地址">
                                {getFieldDecorator('registerAddress', {
                                  initialValue: data.registerAddress,
                                  rules: [
                                    {
                                      max: 200,
                                      message: '长度不能超过200位',
                                    },
                                  ],
                                })(
                                  btnShow.product.institution ? (
                                    <span>
                                      {data.registerAddress === undefined
                                        ? '--'
                                        : data.registerAddress}
                                    </span>
                                  ) : (
                                    <TextArea
                                      placeholder="请输入"
                                      autosize={{ minRows: 2, maxRows: 6 }}
                                    />
                                  ),
                                )}
                              </FormItem>
                            </Col>
                            <Col xxl={8} md={12} sm={24}>
                              <FormItem label="办公地址">
                                {getFieldDecorator('officeAddress', {
                                  initialValue: data.officeAddress,
                                  rules: [
                                    {
                                      max: 200,
                                      message: '长度不能超过200位',
                                    },
                                  ],
                                })(
                                  btnShow.product.institution ? (
                                    <span>
                                      {data.officeAddress === undefined ? '--' : data.officeAddress}
                                    </span>
                                  ) : (
                                    <TextArea
                                      placeholder="请输入"
                                      autosize={{ minRows: 2, maxRows: 6 }}
                                    />
                                  ),
                                )}
                              </FormItem>
                            </Col>
                            <Col xxl={8} md={12} sm={24}>
                              <FormItem label="注册资本">
                                {getFieldDecorator('registerCapital', {
                                  initialValue: data.registerCapital,
                                  rules: [
                                    {
                                      pattern: /^([1-9]\d{0,12})(\.[0-9]{1,2})?$/,
                                      message: '仅数字且整数部分长度不能超过13位(最多两位小数)',
                                    },
                                  ],
                                })(
                                  btnShow.product.institution ? (
                                    <span>
                                      {data.registerCapital === undefined
                                        ? '--'
                                        : data.registerCapital}
                                    </span>
                                  ) : (
                                    <Input placeholder={'请输入'} />
                                  ),
                                )}
                              </FormItem>
                            </Col>
                            <Col xxl={8} md={12} sm={24}>
                              <FormItem label="控股股东或实际控制人">
                                {getFieldDecorator('holdingPeople', {
                                  initialValue: data.holdingPeople,
                                  rules: [
                                    {
                                      max: 50,
                                      message: '长度不能超过50位',
                                    },
                                  ],
                                })(
                                  btnShow.product.institution ? (
                                    <span>
                                      {data.holdingPeople === undefined ? '--' : data.holdingPeople}
                                    </span>
                                  ) : (
                                    <Input placeholder="请输入" />
                                  ),
                                )}
                              </FormItem>
                            </Col>
                          </Row>
                          <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                            <Col md={24} sm={24}>
                              <div
                                style={{ display: btnShow.product.institution ? 'none' : 'block' }}
                                className={styles.openQueryBtn}
                              >
                                <Button type="primary" htmlType="submit">
                                  确定
                                </Button>
                                <Button onClick={() => this.cancel('product', 'institution')}>
                                  取消
                                </Button>
                              </div>
                            </Col>
                          </Row>
                        </Form>
                      </div>
                    </Spin>
                  </Card>

                  <Card
                    title="资质信息"
                    extra={this.btnArea('product', 'aptitude')}
                    bodyStyle={{
                      borderTop: '1px solid #ddd',
                      padding: cardData.product.aptitude ? '14px 32px' : 0,
                    }}
                    style={{ marginTop: 20 }}
                  >
                    <Spin spinning={aptitude}>
                      <div
                        className={styles.tableListForm1}
                        style={{ display: cardData.product.aptitude ? 'block' : 'none' }}
                      >
                        <Form
                          onSubmit={e =>
                            this.updateFields(
                              e,
                              [
                                'qualifiedInvestor',
                                'riskGrade',
                                'controlRel',
                                'beneficiary',
                                'badRecord',
                              ],
                              'product',
                              'aptitude',
                            )
                          }
                          layout="inline"
                        >
                          <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                            <Col xxl={8} md={12} sm={24}>
                              <FormItem label="合格投资者">
                                {getFieldDecorator('qualifiedInvestor', {
                                  initialValue: data.qualifiedInvestor,
                                })(
                                  btnShow.product.aptitude ? (
                                    <span>
                                      {data.qualifiedInvestorName === undefined
                                        ? '--'
                                        : data.qualifiedInvestorName}
                                    </span>
                                  ) : (
                                    this.getDropdownData(qualifiedInvestor, false, 1)
                                  ),
                                )}
                              </FormItem>
                            </Col>
                            <Col xxl={8} md={12} sm={24}>
                              <FormItem label="投资者风险等级">
                                {getFieldDecorator('riskGrade', {
                                  initialValue: data.riskGrade,
                                })(
                                  btnShow.product.aptitude ? (
                                    <span>
                                      {data.riskGradeName === undefined ? '--' : data.riskGradeName}
                                    </span>
                                  ) : (
                                    this.getDropdownData(dropDownList.InvestorRiskLevel, false, 1)
                                  ),
                                )}
                              </FormItem>
                            </Col>
                            <Col xxl={8} md={12} sm={24}>
                              <FormItem label="是否存在实际控制关系">
                                {getFieldDecorator('controlRel', {
                                  initialValue: data.controlRel,
                                })(
                                  btnShow.product.aptitude ? (
                                    <span>
                                      {data.controlRelName === undefined
                                        ? '--'
                                        : data.controlRelName}
                                    </span>
                                  ) : (
                                    this.getDropdownData(controlRel)
                                  ),
                                )}
                              </FormItem>
                            </Col>
                            <Col xxl={8} md={12} sm={24}>
                              <FormItem label="交易的实际受益人">
                                {getFieldDecorator('beneficiary', {
                                  initialValue: data.beneficiary,
                                  rules: [
                                    {
                                      max: 20,
                                      message: '长度不能超过20位',
                                    },
                                  ],
                                })(
                                  btnShow.product.aptitude ? (
                                    <span>
                                      {data.beneficiary === undefined ? '--' : data.beneficiary}
                                    </span>
                                  ) : (
                                    <Input placeholder="请输入" />
                                  ),
                                )}
                              </FormItem>
                            </Col>
                            <Col xxl={8} md={12} sm={24}>
                              <FormItem label="是否有不良诚信记录">
                                {getFieldDecorator('badRecord', {
                                  initialValue: data.badRecord,
                                })(
                                  btnShow.product.aptitude ? (
                                    <span>
                                      {data.badRecordName === undefined ? '--' : data.badRecordName}
                                    </span>
                                  ) : (
                                    this.getDropdownData(badRecord)
                                  ),
                                )}
                              </FormItem>
                            </Col>
                          </Row>
                          <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                            <Col md={24} sm={24}>
                              <div
                                style={{ display: btnShow.product.aptitude ? 'none' : 'block' }}
                                className={styles.openQueryBtn}
                              >
                                <Button type="primary" htmlType="submit">
                                  确定
                                </Button>
                                <Button onClick={() => this.cancel('product', 'aptitude')}>
                                  取消
                                </Button>
                              </div>
                            </Col>
                          </Row>
                        </Form>
                      </div>
                    </Spin>
                  </Card>

                  <Card
                    title="其它信息"
                    extra={this.btnArea('product', 'other')}
                    bodyStyle={{
                      borderTop: '1px solid #ddd',
                      padding: cardData.product.other ? '14px 32px' : 0,
                    }}
                    style={{ marginTop: 20 }}
                  >
                    <Spin spinning={other}>
                      <div
                        className={styles.tableListForm1}
                        style={{ display: cardData.product.other ? 'block' : 'none' }}
                      >
                        <Form
                          onSubmit={e =>
                            this.updateFields(
                              e,
                              [
                                'acceptWay',
                                'dealWay',
                                'sendWay',
                                'sendFrequency',
                                'regionNum',
                                'shanghaiSecAcc',
                                'shenzhenSecAcc',
                                'referrerType',
                                'referrerName',
                              ],
                              'product',
                              'other',
                            )
                          }
                          layout="inline"
                        >
                          <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                            <Col xxl={8} md={12} sm={24}>
                              <FormItem label="受理方式">
                                {getFieldDecorator('acceptWay', {
                                  initialValue: data.acceptWay,
                                })(
                                  btnShow.product.other ? (
                                    <span>
                                      {data.acceptWayName === undefined ? '--' : data.acceptWayName}
                                    </span>
                                  ) : (
                                    this.getDropdownData(dropDownList.TA_ACCPTMD)
                                  ),
                                )}
                              </FormItem>
                            </Col>
                            <Col xxl={8} md={12} sm={24}>
                              <FormItem label="使用的交易手段">
                                {getFieldDecorator('dealWay', {
                                  initialValue: data.dealWay,
                                })(
                                  btnShow.product.other ? (
                                    <span>
                                      {data.dealWayName === undefined ? '--' : data.dealWayName}
                                    </span>
                                  ) : (
                                    this.getDropdownData(dropDownList.tradingMethod)
                                  ),
                                )}
                              </FormItem>
                            </Col>
                            <Col xxl={8} md={12} sm={24}>
                              <FormItem label="账单寄送方式">
                                {getFieldDecorator('sendWay', {
                                  initialValue: data.sendWay,
                                })(
                                  btnShow.product.other ? (
                                    <span>
                                      {data.sendWayName === undefined ? '--' : data.sendWayName}
                                    </span>
                                  ) : (
                                    this.getDropdownData(dropDownList.TA_STATEMENTFLAG)
                                  ),
                                )}
                              </FormItem>
                            </Col>
                            <Col xxl={8} md={12} sm={24}>
                              <FormItem label="账单寄送频率">
                                {getFieldDecorator('sendFrequency', {
                                  initialValue: data.sendFrequency,
                                })(
                                  btnShow.product.other ? (
                                    <span>
                                      {data.sendFrequencyName === undefined
                                        ? '--'
                                        : data.sendFrequencyName}
                                    </span>
                                  ) : (
                                    this.getDropdownData(dropDownList.TA_DELIVERTYPE)
                                  ),
                                )}
                              </FormItem>
                            </Col>
                            <Col xxl={8} md={12} sm={24}>
                              <FormItem label="交易所在地区编号">
                                {getFieldDecorator('regionNum', {
                                  initialValue: data.regionNum,
                                  rules: [
                                    {
                                      max: 20,
                                      message: '长度不能超过20位',
                                    },
                                  ],
                                })(
                                  btnShow.product.other ? (
                                    <span>
                                      {data.regionNum === undefined ? '--' : data.regionNum}
                                    </span>
                                  ) : (
                                    <Input placeholder="请输入" />
                                  ),
                                )}
                              </FormItem>
                            </Col>
                            <Col xxl={8} md={12} sm={24}>
                              <FormItem label="上交所证券账户">
                                {getFieldDecorator('shanghaiSecAcc', {
                                  initialValue: data.shanghaiSecAcc,
                                  rules: [
                                    {
                                      max: 100,
                                      message: '长度不能超过100位',
                                    },
                                  ],
                                })(
                                  btnShow.product.other ? (
                                    <span>
                                      {data.shanghaiSecAcc === undefined
                                        ? '--'
                                        : data.shanghaiSecAcc}
                                    </span>
                                  ) : (
                                    <Input placeholder="请输入" />
                                  ),
                                )}
                              </FormItem>
                            </Col>
                            <Col xxl={8} md={12} sm={24}>
                              <FormItem label="深交所证券账户">
                                {getFieldDecorator('shenzhenSecAcc', {
                                  initialValue: data.shenzhenSecAcc,
                                  rules: [
                                    {
                                      max: 100,
                                      message: '长度不能超过100位',
                                    },
                                  ],
                                })(
                                  btnShow.product.other ? (
                                    <span>
                                      {data.shenzhenSecAcc === undefined
                                        ? '--'
                                        : data.shenzhenSecAcc}
                                    </span>
                                  ) : (
                                    <Input placeholder="请输入" />
                                  ),
                                )}
                              </FormItem>
                            </Col>
                            <Col xxl={8} md={12} sm={24}>
                              <FormItem label="推荐人类型">
                                {getFieldDecorator('referrerType', {
                                  initialValue: data.referrerType,
                                })(
                                  btnShow.product.other ? (
                                    <span>
                                      {data.referrerTypeName === undefined
                                        ? '--'
                                        : data.referrerTypeName}
                                    </span>
                                  ) : (
                                    this.getDropdownData(dropDownList.referrerType)
                                  ),
                                )}
                              </FormItem>
                            </Col>
                            <Col xxl={8} md={12} sm={24}>
                              <FormItem label="推荐人">
                                {getFieldDecorator('referrerName', {
                                  initialValue: data.referrerName,
                                  rules: [
                                    {
                                      max: 20,
                                      message: '长度不能超过20位',
                                    },
                                  ],
                                })(
                                  btnShow.product.other ? (
                                    <span>
                                      {data.referrerName === undefined ? '--' : data.referrerName}
                                    </span>
                                  ) : (
                                    <Input placeholder="请输入" />
                                  ),
                                )}
                              </FormItem>
                            </Col>
                          </Row>
                          <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                            <Col md={24} sm={24}>
                              <div
                                style={{ display: btnShow.product.other ? 'none' : 'block' }}
                                className={styles.openQueryBtn}
                              >
                                <Button type="primary" htmlType="submit">
                                  确定
                                </Button>
                                <Button onClick={() => this.cancel('product', 'other')}>
                                  取消
                                </Button>
                              </div>
                            </Col>
                          </Row>
                        </Form>
                      </div>
                    </Spin>
                  </Card>
                </div>
              )}
            </TabPane>
            <TabPane tab="附件管理" disabled={TabPaneVisible} key={'1'}>
              <div className={styles.investorManageBox}>
                <Card title="附件管理" bodyStyle={{ borderTop: '1px solid #ddd' }}>
                  <Spin spinning={accessoriesLoading}>
                    <div style={{ padding: '20px 70px' }}>
                      <div style={{ marginBottom: 20 }}>
                        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                          <Col xxl={8} md={12} sm={24}>
                            <FormItem label="选择上传类型">
                              {getFieldDecorator('uploadType', {
                                initialValue: 'InvestorInfo',
                                rules: [
                                  {
                                    required: true,
                                  },
                                ],
                              })(
                                <Select
                                  style={{ width: '100%' }}
                                  onChange={this.handleSelectChange}
                                >
                                  <Option value="InvestorInfo">投资人信息附件</Option>
                                  <Option value="ManagerInfo">经办人信息附件</Option>
                                  <Option value="OrganizationInfo">机构信息附件</Option>
                                  <Option value="ProductInfo">产品信息附件</Option>
                                  <Option value="CorporateInfo">法定代表或负责人信息附件</Option>
                                  <Option value="QualificationInfo">资质信息附件</Option>
                                </Select>,
                              )}
                            </FormItem>
                          </Col>
                        </Row>
                      </div>
                      <Upload
                        {...uploadProps}
                        showUploadList={false}
                        onChange={this.handleFileChange}
                        beforeUpload={this.beforeUpload}
                        onRemove={e => this.remove(e)}
                      >
                        <Button type={'primary'}>
                          <Icon type="upload" /> 点击上传
                        </Button>
                        <div style={{ margin: '5px 0 40px 0', fontSize: 12, color: '#666' }}>
                          支持扩展名：.rar .zip .doc .docx .pdf .jpg,且不超过50M
                        </div>
                      </Upload>
                      <div className={styles.tableListForm1}>
                        <Form>
                          <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                            <Col md={18} sm={24}>
                              <FormItem label="投资人信息">
                                {getFieldDecorator('InvestorInfo')(
                                  <Upload
                                    {...uploadProps}
                                    disabled={true}
                                    fileList={annexesObj.InvestorInfo}
                                    onChange={this.handleFileChange}
                                    beforeUpload={this.beforeUpload}
                                    onRemove={e => this.remove(e)}
                                  />,
                                )}
                              </FormItem>
                            </Col>
                            <Col md={18} sm={24}>
                              <FormItem label="经办人信息">
                                {getFieldDecorator('ManagerInfo')(
                                  <Upload
                                    {...uploadProps}
                                    disabled={true}
                                    fileList={annexesObj.ManagerInfo}
                                    beforeUpload={this.beforeUpload}
                                    onRemove={e => this.remove(e)}
                                  />,
                                )}
                              </FormItem>
                            </Col>
                            <Col md={18} sm={24}>
                              <FormItem label="产品信息">
                                {getFieldDecorator('ProductInfo')(
                                  <Upload
                                    {...uploadProps}
                                    disabled={true}
                                    fileList={annexesObj.ProductInfo}
                                    beforeUpload={this.beforeUpload}
                                    onRemove={e => this.remove(e)}
                                  />,
                                )}
                              </FormItem>
                            </Col>
                            <Col md={18} sm={24}>
                              <FormItem label="机构信息">
                                {getFieldDecorator('OrganizationInfo')(
                                  <Upload
                                    {...uploadProps}
                                    disabled={true}
                                    fileList={annexesObj.OrganizationInfo}
                                    beforeUpload={this.beforeUpload}
                                    onRemove={e => this.remove(e)}
                                  />,
                                )}
                              </FormItem>
                            </Col>
                            <Col md={18} sm={24}>
                              <FormItem label="法定代表/负责人信息">
                                {getFieldDecorator('CorporateInfo')(
                                  <Upload
                                    {...uploadProps}
                                    disabled={true}
                                    fileList={annexesObj.CorporateInfo}
                                    beforeUpload={this.beforeUpload}
                                    onRemove={e => this.remove(e)}
                                  />,
                                )}
                              </FormItem>
                            </Col>
                            <Col md={18} sm={24}>
                              <FormItem label="资质信息">
                                {getFieldDecorator('QualificationInfo')(
                                  <Upload
                                    {...uploadProps}
                                    disabled={true}
                                    fileList={annexesObj.QualificationInfo}
                                    beforeUpload={this.beforeUpload}
                                    onRemove={e => this.remove(e)}
                                  />,
                                )}
                              </FormItem>
                            </Col>
                          </Row>
                        </Form>
                      </div>
                    </div>
                    <div className={styles.uploadSubmitBox}>
                      <Button type="primary" onClick={this.uploadSubmit}>
                        提交
                      </Button>
                    </div>
                  </Spin>
                </Card>
              </div>
            </TabPane>
          </Tabs>
        </div>
      </div>
    );
  }
}

