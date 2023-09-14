import React, { Component, useContext, useEffect, useState } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import Action, { linkHoc } from '@/utils/hocUtil';
import { errorBoundary } from '@/layouts/ErrorBoundary';
import {
  Form,
  Input,
  Modal,
  Breadcrumb,
  Row,
  Col,
  Icon,
  Button,
  Table,
  Select,
  message,
  Spin,
  DatePicker,
  Divider,
  Checkbox,
} from 'antd';
import { Card, PageContainers } from '@/components';
import request from '@/utils/request';
import { router } from 'umi';
import { tableRowConfig } from '@/pages/investorReview/func';
import AddInvest from '@/pages/annualInvestment/addInvest';
const { Search } = Input;
const { confirm } = Modal;
const { Option } = Select;
const FormItem = Form.Item;

@Form.create()
class investmentDetails extends Component {
  state = {
    loading: false,
    isModalVisible: false,
    isModalVisible1: false,
    record: {
      dbDate: {},
    },
    dateString: '',
    formDisable: false,
    objQuery: {},

    detailsList: {},
    proInvestList: [],
    editInvest: {},
    isShowAddInvest: false,
    inveSecuRelaWithMe: [],
  };

  componentDidMount() {
    const objQuery = this.parseQuery();
    const USER_INFO = JSON.parse(sessionStorage.getItem('USER_INFO'));

    this.inveSecuRelaWithMe();
    if (objQuery.type === 'add') {
      //新增时反显报备信息
      this.queryForShow(USER_INFO.id);
    } else if (objQuery.id) {
      //查看详情
      this.querybyid1(objQuery.id);
    }
  }

  inveSecuRelaWithMe() {
    request(`/ams-base-parameter/datadict/queryInfoNew?fcode=inveSecuRelaWithMe`).then(res => {
      if (res) {
        this.setState({ inveSecuRelaWithMe: res });
      }
    });
  }
  querybyid1(id) {
    request(
      `/yss-base-product/proSecInvestDeal/querybyid?coreModule=TProSecInvestDeclare&listModule=TProSecInvestDeclare,TProYearInvestInfo&type=view&id=${id}`,
    ).then(res => {
      if (res.status == '200') {
        if (res.data.TProSecInvestDeclare) {
          this.setState({ detailsList: res.data.TProSecInvestDeclare });
        }
        if (res.data.TProYearInvestInfo) {
          let proInvestList = res.data.TProYearInvestInfo;
          for (let i = 0; i < proInvestList.length; i++) {
            proInvestList[i].index = i + 1;
            request(
              `/yss-base-product/proYearInvestTargetInfo/query?coreModule=TProYearInvestTargetInfo&listModule=TProYearInvestTargetInfo`,
              {
                method: 'POST',
                data: { yearInvestId: proInvestList[i].id },
              },
            ).then(res => {
              if (res.status == '200') {
                let datares = res.data.rows;
                if (datares) {
                  for (let i = 0; i < datares.length; i++) {
                    datares[i].index = i + 1;
                  }
                  proInvestList[i].TProYearInvestTargetInfo = datares;
                }
              } else {
                message.error(res.message);
              }
            });
          }
          this.setState({ proInvestList: proInvestList });
        }
      } else {
        message.error(res.message);
      }
    });
  }
  //标的列表详情
  queryForTarget = yearInvestId => {
    let data = {};
    let payload = {
      yearInvestId: yearInvestId,
    };
    if (yearInvestId) {
      request(
        `/yss-base-product/proYearInvestTargetInfo/query?coreModule=TProYearInvestTargetInfo&listModule=TProYearInvestTargetInfo`,
        {
          method: 'POST',
          data: payload,
        },
      ).then(res => {
        if (res.status == '200') {
          const datares = res.data.rows;
          for (let i = 0; i < data.length; i++) {
            data[i].index = i + 1;
          }
        } else {
          message.error(res.message);
        }
      });

      return data;
    }
  };

  // 反显本人报备的基本信息
  queryForShow = creatorId => {
    let payload = {
      creatorId: creatorId,
      checked: 'D001_2',
    };
    request(
      `/yss-base-product/proSecInvestDeal/queryForShow?coreModule=TProSecAccountReport&listModule=TProSecAccountReport,TProInternalSysInfo,TProSecAccountInfo`,
      {
        method: 'POST',
        data: payload,
      },
    ).then(res => {
      if (res.status == '200') {
        let datas = {};
        datas = res.data;
        datas.applyNum = this.generateNum();
        datas.reportStatus = '0';
        this.setState({ detailsList: datas });
      } else {
        message.error(res.message);
      }
    });
  };

  /**
   * 申请单编号初始化
   * @returns {string}
   */
  generateNum() {
    const format = '{y}{m}{d}' || '{y}-{m}-{d} {h}:{i}:{s}';
    let date = new Date();
    const formatObj = {
      y: date.getFullYear(),
      m: date.getMonth() + 1,
      d: date.getDate(),
      h: date.getHours(),
      i: date.getMinutes(),
      s: date.getSeconds(),
      a: date.getDay(),
    };
    const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
      let value = formatObj[key];
      // Note: getDay() returns 0 on Sunday
      if (key === 'a') {
        return ['日', '一', '二', '三', '四', '五', '六'][value];
      }
      if (result.length > 0 && value < 10) {
        value = '0' + value;
      }
      return value || 0;
    });
    return `NDTZ${time_str}${parseInt((1 + Math.random()) * 65536) + 100000}`;
  }

  /**
   * 发起时间
   */
  generateLaunchTime() {
    const format = '{y}-{m}-{d} {h}:{i}:{s}' || '{y}-{m}-{d} {h}:{i}:{s}';
    let date = new Date();
    const formatObj = {
      y: date.getFullYear(),
      m: date.getMonth() + 1,
      d: date.getDate(),
      h: date.getHours(),
      i: date.getMinutes(),
      s: date.getSeconds(),
      a: date.getDay(),
    };
    const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
      let value = formatObj[key];
      // Note: getDay() returns 0 on Sunday
      if (key === 'a') {
        return ['日', '一', '二', '三', '四', '五', '六'][value];
      }
      if (result.length > 0 && value < 10) {
        value = '0' + value;
      }
      return value || 0;
    });
    return time_str;
  }

  /**
   * 处理路径请求参数
   * @returns {{}}
   */
  parseQuery = () => {
    let query = window.location.search.substring(1);
    let res = {};

    query = query.trim().replace(/^(\?|#|&)/, '');

    if (!query) {
      return res;
    } else {
      query.split('&').forEach(function(param) {
        var parts = param.replace(/\+/g, ' ').split('=');
        // var key = decode(parts.shift());
        var key = parts.shift();
        var val = parts.length > 0 ? parts.join('=') : null;

        if (res[key] === undefined) {
          res[key] = val;
        } else if (Array.isArray(res[key])) {
          res[key].push(val);
        } else {
          res[key] = [res[key], val];
        }
      });
    }

    this.setState({ objQuery: res });
    return res;
  };
  onShowAddInvest = data => {
    this.setState({
      editInvest: data || {},
      isShowAddInvest: true,
    });
  };
  delInvestList = index => {
    const { proInvestList } = this.state;
    proInvestList.splice(index, 1);
    this.setState({
      proInvestList,
    });
  };

  setInvestList = data => {
    const { proInvestList } = this.state;
    const tempList = JSON.parse(JSON.stringify(proInvestList || []));
    if (data && data.id && !data.indexId) {
      for (let index = 0; index < tempList.length; index++) {
        if (tempList[index].id === data.id) {
          tempList[index] = data;
        }
        tempList[index].index = index + 1;
      }
    }
    if (data && !data.id && !data.indexId) {
      // 新增;
      tempList.push({
        ...data,
        index: tempList.length + 1,
        indexId: +new Date(),
      });
    } else if (data && !data.id && data.indexId) {
      for (let index = 0; index < tempList.length; index++) {
        if (tempList[index].indexId === data.indexId) {
          tempList[index] = data;
        }
        tempList[index].index = index + 1;
      }
    }
    this.setState({
      proInvestList: tempList,
      isShowAddInvest: false,
    });
  };

  dataUpdate = () => {
    const { proInvestList, objQuery } = this.state;
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const TProSecInvestDeclare = values;
        if (TProSecInvestDeclare.promiseChecked) {
          TProSecInvestDeclare.promiseChecked = ['1'];
        }
        TProSecInvestDeclare.id = objQuery.id;
        const TProYearInvestInfo = [];
        if (proInvestList.length > 0) {
          for (let proInvestListElement of proInvestList) {
            let TProYearInvestInfoElement = {};

            if (proInvestListElement.checked)
              TProYearInvestInfoElement.checked = proInvestListElement.checked;
            if (proInvestListElement.createTime)
              TProYearInvestInfoElement.createTime = proInvestListElement.createTime;
            if (proInvestListElement.creatorId)
              TProYearInvestInfoElement.creatorId = proInvestListElement.creatorId;
            if (proInvestListElement.dealId)
              TProYearInvestInfoElement.dealId = proInvestListElement.dealId;

            if (proInvestListElement.deleted)
              TProYearInvestInfoElement.deleted = proInvestListElement.deleted;
            if (proInvestListElement.id) {
              TProYearInvestInfoElement.id = proInvestListElement.id;
            }
            if (proInvestListElement.lastEditTime)
              TProYearInvestInfoElement.lastEditTime = proInvestListElement.lastEditTime;
            if (proInvestListElement.lastEditorId)
              TProYearInvestInfoElement.lastEditorId = proInvestListElement.lastEditorId;
            if (proInvestListElement.ownerShip)
              TProYearInvestInfoElement.ownerShip = proInvestListElement.ownerShip;
            if (proInvestListElement.userName)
              TProYearInvestInfoElement.userName = proInvestListElement.userName;
            if (proInvestListElement.userType)
              TProYearInvestInfoElement.userType = proInvestListElement.userType;
            if (proInvestListElement.TProYearInvestTargetInfo)
              TProYearInvestInfoElement.TProYearInvestTargetInfo =
                proInvestListElement.TProYearInvestTargetInfo;

            TProYearInvestInfo.push(TProYearInvestInfoElement);
          }
        }

        if (TProYearInvestInfo.length > 0) {
          for (let tProYearInvestInfo of TProYearInvestInfo) {
            const temp = [];
            if (tProYearInvestInfo.TProYearInvestTargetInfo) {
              for (let target of tProYearInvestInfo.TProYearInvestTargetInfo) {
                let trmpObj = {};
                if (target.checked) trmpObj.checked = target.checked;
                if (target.createTime) trmpObj.createTime = target.createTime;
                if (target.creatorId) trmpObj.creatorId = target.creatorId;

                if (target.deleted) trmpObj.deleted = target.deleted;
                if (target.id) trmpObj.id = target.id;
                if (target.lastEditTime) trmpObj.lastEditTime = target.lastEditTime;

                if (target.holdShare) trmpObj.holdShare = target.holdShare;
                if (target.holdTime) trmpObj.holdTime = target.holdTime;
                if (target.tradeMark) trmpObj.tradeMark = target.tradeMark;
                if (target.tradeMarkCode) trmpObj.tradeMarkCode = target.tradeMarkCode;
                if (target.yearInvestId) trmpObj.yearInvestId = target.yearInvestId;
                if (target.lastEditorId) trmpObj.lastEditorId = target.lastEditorId;
                temp.push(trmpObj);
              }
            }
            tProYearInvestInfo.TProYearInvestTargetInfo = temp;
          }
        }
        TProSecInvestDeclare.TProYearInvestInfo = TProYearInvestInfo;

        const payload = {};
        payload.TProSecInvestDeclare = TProSecInvestDeclare;
        payload.coreModule = 'TProSecInvestDeclare';
        payload.listModule = [
          'TProSecInvestDeclare',
          'TProYearInvestInfo',
          'TProYearInvestTargetInfo',
        ];
        payload.ignoreTable = [];

        request(`/yss-base-product/proSecInvestDeclare/update`, {
          method: 'POST',
          data: payload,
        }).then(res => {
          if (res) {
            if (res.status == '200') {
              message.success('保存成功！');
              router.push(
                '/dynamicPage/params/证券投资申报/72cccc9e-ec4d-4616-87e9-36d9c0b3df8e/年度投资申报',
              );
            } else {
              message.error(res.message);
            }
          }
        });
      }
    });
  };
  dataSave = () => {
    const { objQuery } = this.state;
    if (objQuery.type === 'add') {
      this.dataAdd();
    }
    if (objQuery.type === 'edit') {
      this.dataUpdate();
    }
  };
  dataAdd = () => {
    const { proInvestList, objQuery } = this.state;

    this.props.form.validateFields((err, values) => {
      if (!err) {
        const TProSecInvestDeclare = values;
        if (TProSecInvestDeclare.promiseChecked) {
          TProSecInvestDeclare.promiseChecked = ['1'];
        }
        if (objQuery.type === 'add') {
          TProSecInvestDeclare.launchTime = this.generateLaunchTime();
        }

        const TProYearInvestInfo = proInvestList;

        if (TProYearInvestInfo.length > 0) {
          for (let tProYearInvestInfo of TProYearInvestInfo) {
            if (tProYearInvestInfo.index) {
              delete tProYearInvestInfo.index;
            }
            if (tProYearInvestInfo.indexId) {
              delete tProYearInvestInfo.indexId;
            }
            if (tProYearInvestInfo.TProYearInvestTargetInfo) {
              for (let target of tProYearInvestInfo.TProYearInvestTargetInfo) {
                if (target.index) {
                  delete target.index;
                }
                if (target.indexId) {
                  delete target.indexId;
                }
              }
            }
          }
        }

        TProSecInvestDeclare.TProYearInvestInfo = TProYearInvestInfo;

        const payload = {};
        payload.TProSecInvestDeclare = TProSecInvestDeclare;
        payload.coreModule = 'TProSecInvestDeclare';
        payload.listModule = [
          'TProSecInvestDeclare',
          'TProYearInvestInfo',
          'TProYearInvestTargetInfo',
        ];
        payload.ignoreTable = [];
        if (objQuery.type === 'add') {
          request(`/yss-base-product/proSecInvestDeclare/add`, {
            method: 'POST',
            data: payload,
          }).then(res => {
            if (res) {
              if (res.status == '200') {
                message.success('保存成功！');
                router.push(
                  '/dynamicPage/params/证券投资申报/72cccc9e-ec4d-4616-87e9-36d9c0b3df8e/年度投资申报',
                );
              } else {
                message.error(res.message);
              }
            }
          });
        }
      }
    });
  };

  render() {
    const {
      objQuery,
      loading,
      detailsList,
      proInvestList,
      editInvest,
      isShowAddInvest,
    } = this.state;
    const { getFieldDecorator } = this.props.form;
    const indeterminate = false;

    let formDisable,
      nameDisable = false;
    let title = objQuery.type;
    if (title == 'add') {
      title = '新增';
      formDisable = false;
    } else if (title == 'edit') {
      title = '修改';
      formDisable = false;
    } else if (title == 'view') {
      title = '查看';
      formDisable = true;
      nameDisable = true;
    }

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    };
    const formItemLayout1 = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 2 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    };
    const columns = [
      {
        title: '序号',
        dataIndex: 'index',
        key: 'index',
        ...tableRowConfig,
        align: 'center',
        sorter: false,
      },
      {
        title: '人员类型',
        dataIndex: 'userType',
        editable: true,
        ...tableRowConfig,
        width: 400,
        sorter: false,
        render: text => {
          return text == 1 ? '本人' : '利害关系人';
        },
      },
      {
        title: '姓名',
        dataIndex: 'userName',
        width: 200,
        editable: true,
        ...tableRowConfig,
        sorter: false,
      },
      {
        title: '与本人关系',
        dataIndex: 'ownerShip',
        width: 200,
        editable: true,
        ...tableRowConfig,
        sorter: false,
        render: text => {
          const { inveSecuRelaWithMe } = this.state;
          for (const curr of inveSecuRelaWithMe) {
            if (text == curr.code) {
              return curr.name;
            }
          }
        },
      },
      {
        title: '创建时间',
        dataIndex: 'createTime',
        width: 200,
        editable: true,
        ...tableRowConfig,
        sorter: false,
      },
      {
        title: '操作',
        fixed: 'right',
        key: 'opt',
        render: (text, record, index) => (
          <span>
            <a
              onClick={() => {
                this.onShowAddInvest(record);
              }}
              style={{ display: formDisable ? '' : 'none' }}
            >
              查看
            </a>
            <a
              onClick={() => {
                this.onShowAddInvest(record);
              }}
              style={{ display: formDisable ? 'none' : '' }}
            >
              编辑
            </a>

            <Divider type="vertical" />
            <a
              onClick={() => {
                this.delInvestList(index);
              }}
              style={{ display: formDisable ? 'none' : '' }}
            >
              删除
            </a>
          </span>
        ),
      },
    ];

    const onChange = (date, dateString) => {
      this.setState({ dateString: dateString });
    };
    const onCheckAllChange = e => {
      console.log(`checked = ${e.target.checked}`);
    };
    return (
      <>
        <PageContainers
          breadcrumb={[
            {
              title: '年度投资申报',
              url:
                '/dynamicPage/params/证券投资申报/72cccc9e-ec4d-4616-87e9-36d9c0b3df8e/年度投资申报',
            },
            {
              title: `${title}`,
              url: '/processCenter/investmentDetails',
            },
          ]}
        />

        <Card title={`${title}`} bordered={true}>
          <Row style={{ paddingTop: 0, marginBottom: 20 }} justify="end">
            <div style={{ float: 'right' }}>
              {/*<Button style={{ marginRight: 8 }} onClick={()=>router.goBack()}>取消</Button>*/}
              <Button
                style={{ marginRight: 8 }}
                onClick={() =>
                  router.push(
                    '/dynamicPage/params/证券投资申报/72cccc9e-ec4d-4616-87e9-36d9c0b3df8e/年度投资申报',
                  )
                }
              >
                取消
              </Button>
              <Button
                type="primary"
                style={{ display: formDisable ? 'none' : '' }}
                onClick={this.dataSave}
              >
                保存
              </Button>
            </div>
          </Row>
          <Spin spinning={loading}>
            <Card title={'年度投资申报'} style={{ marginBottom: 20 }} bordered={true}>
              <Form>
                <Row gutter={24}>
                  <Form.Item labelCol={2} label={` `} colon={false} {...formItemLayout1}>
                    {getFieldDecorator('promiseChecked', {
                      initialValue: detailsList.promiseChecked,
                      rules: [
                        {
                          required: true,
                          message: '不可为空',
                        },
                      ],
                    })(
                      <Checkbox
                        indeterminate={indeterminate}
                        disabled={formDisable}
                        onChange={onCheckAllChange}
                      >
                        郑重承诺合规进行投资，不利用未公开数据谋取不正当利益。
                      </Checkbox>,
                    )}
                  </Form.Item>
                </Row>
                <Row>
                  <Col span={8}>
                    <Form.Item label="申请单编号" {...formItemLayout}>
                      {getFieldDecorator('applyNum', {
                        initialValue: detailsList.applyNum,
                        rules: [
                          {
                            required: true,
                            message: '申请单编号不可为空',
                          },
                        ],
                      })(<Input autoComplete="off" disabled={true} placeholder="" />)}
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item label="姓名" {...formItemLayout}>
                      {getFieldDecorator('userName', {
                        initialValue: detailsList.userName,
                        rules: [
                          {
                            required: true,
                            message: '姓名不可为空',
                          },
                        ],
                      })(<Input autoComplete="off" disabled={nameDisable} placeholder="" />)}
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item label="人员类型" {...formItemLayout}>
                      {getFieldDecorator('userType', {
                        initialValue: detailsList.userType,
                        rules: [
                          {
                            required: true,
                            message: '人员类型不可为空',
                          },
                        ],
                      })(<Input autoComplete="off" disabled={true} placeholder="" />)}
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item label="手机号码" {...formItemLayout}>
                      {getFieldDecorator('phoneNum', {
                        initialValue: detailsList.phoneNum,
                        rules: [
                          {
                            required: true,
                            message: '手机号码不可为空',
                          },
                        ],
                      })(<Input autoComplete="off" disabled={formDisable} placeholder="" />)}
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item label="团队名称" {...formItemLayout}>
                      {getFieldDecorator('teamName', {
                        initialValue: detailsList.teamName,
                        rules: [
                          {
                            required: true,
                            message: '团队名称不可为空',
                          },
                        ],
                      })(<Input autoComplete="off" disabled={formDisable} placeholder="" />)}
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item label="公司名称" {...formItemLayout}>
                      {getFieldDecorator('companyName', {
                        initialValue: detailsList.companyName,
                      })(<Input autoComplete="off" disabled={formDisable} placeholder="" />)}
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item label="部门名称" {...formItemLayout}>
                      {getFieldDecorator('deptName', {
                        initialValue: detailsList.deptName,
                      })(<Input autoComplete="off" disabled={formDisable} placeholder="" />)}
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item label="岗位" {...formItemLayout}>
                      {getFieldDecorator('station', {
                        initialValue: detailsList.station,
                      })(<Input autoComplete="off" disabled={formDisable} placeholder="" />)}
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item label="报备状态" {...formItemLayout}>
                      {getFieldDecorator('reportStatus', {
                        initialValue: detailsList.reportStatus,
                      })(
                        <Select
                          placeholder="请选择报备状态"
                          disabled={formDisable}
                          showArrow={false}
                        >
                          <Select.Option key={1}>{'报备中'}</Select.Option>
                          <Select.Option key={0}>{'未报备'}</Select.Option>
                        </Select>,
                      )}
                    </Form.Item>
                  </Col>
                </Row>
              </Form>
            </Card>
            <Card title={'投资人信息列表'}>
              <div
                style={{ textAlign: 'right', display: this.props.detailsFlag ? 'none' : 'block' }}
              >
                <Button
                  style={{ display: formDisable ? 'none' : '' }}
                  type="primary"
                  onClick={() => {
                    this.onShowAddInvest();
                  }}
                >
                  新增
                </Button>
              </div>

              <Table
                rowKey={record => record.id}
                columns={columns}
                scroll={{ x: columns.length * 200 + 200 }}
                dataSource={proInvestList}
              />

              {this.state.isShowAddInvest && (
                <AddInvest
                  isView={formDisable}
                  isShowAddInvest={this.state.isShowAddInvest}
                  updateInvesrList={this.setInvestList}
                  editInvest={this.state.editInvest}
                />
              )}
            </Card>
          </Spin>
        </Card>
      </>
    );
  }
}
//
const InvestmentDetails = errorBoundary(
  linkHoc()(Form.create()(connect(({ dataSource }) => ({ dataSource }))(investmentDetails))),
);

export default InvestmentDetails;
