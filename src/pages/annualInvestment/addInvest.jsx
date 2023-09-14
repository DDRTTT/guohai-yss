import React from 'react';
import {
  Form,
  Input,
  Modal,
  DatePicker,
  Select,
  Button,
  Table,
  Divider,
  Row,
  Col,
  message,
} from 'antd';
import moment from 'moment';
import { handleValidator } from '@/utils/utils';
import { Card } from '@/components';
import { tableRowConfig } from '@/pages/investorReview/func';
import AddTarget from '@/pages/annualInvestment/addTarget';
import request from '@/utils/request';

const FormItem = Form.Item;

class AddInvest extends React.Component {
  state = {
    isShowAddTarget: false,
    editTarget: {},
    targetList: [],
    isView: false,
    inveSecuRelaWithMe: [],
    DeduplicationList: [], //利害关系人列表,
    inveSecuHoldTime: [],
  };

  componentDidMount() {
    const {
      editInvest: { id, TProYearInvestTargetInfo },
      isView,
    } = this.props;
    const { targetList } = this.state;
    if (TProYearInvestTargetInfo) {
      this.setState({
        targetList: TProYearInvestTargetInfo,
      });
    }
    if (!TProYearInvestTargetInfo) {
      this.queryForTarget(id);
    } else {
      this.setState({
        targetList: TProYearInvestTargetInfo,
      });
    }

    if (isView) {
      this.setState({
        isView: true,
      });
    }

    this.inveSecuHoldTime();
    this.inveSecuRelaWithMe();
    const USER_id = JSON.parse(sessionStorage.getItem('USER_INFO')).id;
    this.queryAndDeduplication(USER_id);
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
          data = res.data.rows;
          if (data) {
            for (let i = 0; i < data.length; i++) {
              data[i].index = i + 1;
            }
          }
          this.setState({ targetList: data });
        } else {
          message.error(res.message);
        }
      });
    }
  };

  // 利害关系人列表
  queryAndDeduplication = creatorId => {
    let data = {};
    let payload = {
      creatorId: creatorId,
      checked: 'D001_2',
    };
    request(
      `/yss-base-product/proSecAccountInfo/queryAndDeduplication?coreModule=TProSecAccountInfo&listModule=TProSecAccountReport,TProInternalSysInfo,TProSecAccountInfo`,
      {
        method: 'POST',
        data: payload,
      },
    ).then(res => {
      if (res.data) {
        data = res.data;
        this.setState({ DeduplicationList: data });
      }
    });
  };

  inveSecuRelaWithMe() {
    request(`/ams-base-parameter/datadict/queryInfoNew?fcode=inveSecuRelaWithMe`).then(res => {
      if (res) {
        this.setState({ inveSecuRelaWithMe: res });
      }
    });
  }
  inveSecuHoldTime() {
    request(`/ams-base-parameter/datadict/queryInfoNew?fcode=inveSecuHoldTime`).then(res => {
      if (res) {
        this.setState({ inveSecuHoldTime: res });
      }
    });
  }

  onSubmit = () => {
    const { form } = this.props;
    const { targetList } = this.state;
    form.validateFields((err, values) => {
      if (values.createTime) {
        values.createTime = moment(values.createTime).format('YYYY-MM-DD hh:mm:ss');
      }
      if (!err) {
        // debugger;
        const { editInvest } = this.props;

        values.TProYearInvestTargetInfo = targetList;
        this.props.updateInvesrList({
          ...editInvest,
          ...values,
        });
      }
    });
  };

  onCancel = () => {
    this.props.updateInvesrList();
  };

  onShowDetail = data => {
    this.setState({
      editTarget: data || {},
      isShowAddTarget: true,
    });
  };
  delTargetList = index => {
    const { targetList } = this.state;
    targetList.splice(index, 1);
    this.setState({
      targetList,
    });
  };

  setTargetList = data => {
    const { targetList } = this.state;

    const tempList = JSON.parse(JSON.stringify(targetList || []));
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
      targetList: tempList,
      isShowAddTarget: false,
    });
  };
  render() {
    const {
      isShowAddInvest,
      editInvest: { id, userType, userName, ownerShip, createTime, TProYearInvestTargetInfo },
      form: { getFieldDecorator, resetFields, getFieldValue },
    } = this.props;
    let localeusername = JSON.parse(sessionStorage.getItem('USER_INFO')).username;

    const { targetList, isView, inveSecuRelaWithMe, DeduplicationList } = this.state;
    if (!isShowAddInvest) {
      resetFields();
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
    const targetColumns = [
      {
        title: '序号',
        dataIndex: 'index',
        key: 'index',
        ...tableRowConfig,
        align: 'center',
        sorter: false,
      },
      {
        title: '标的名称',
        dataIndex: 'tradeMark',
        editable: true,
        ...tableRowConfig,
        width: 200,
        sorter: false,
      },
      {
        title: '标的代码',
        dataIndex: 'tradeMarkCode',
        width: 200,
        editable: true,
        ...tableRowConfig,
        sorter: false,
      },
      {
        title: '持仓份额',
        dataIndex: 'holdShare',
        width: 200,
        editable: true,
        ...tableRowConfig,
        sorter: false,
      },
      {
        title: '持仓时间',
        dataIndex: 'holdTime',
        width: 200,
        editable: true,
        ...tableRowConfig,
        sorter: false,
        render: text => {
          const { inveSecuHoldTime } = this.state;
          for (const curr of inveSecuHoldTime) {
            if (text == curr.code) {
              return curr.name;
            }
          }
        },
      },
      {
        title: '操作',
        fixed: 'right',
        key: 'opt',
        hideInTable: 'true',
        render: (text, record, index) => (
          <span style={{ display: isView ? 'none' : 'block' }}>
            <a
              onClick={() => {
                this.onShowDetail(record);
              }}
            >
              编辑
            </a>
            <Divider type="vertical" />
            <a
              onClick={() => {
                this.delTargetList(index);
              }}
            >
              删除
            </a>
          </span>
        ),
      },
    ];

    let isViewTemp = isView;

    const queryUserName = userType => {
      if (userType == 1) {
        isViewTemp = true;
        return localeusername;
      } else {
        return '';
      }
    };
    const queryOwnerShip = (userType, userName) => {
      if (userType == 1) {
        isViewTemp = true;
        return 'RWM001';
      } else {
        for (const dl of DeduplicationList) {
          if (userName === dl.userName) {
            return dl.ownerShip;
          }
        }
      }
    };
    return (
      <Modal
        width="60vw"
        title="新增投资人信息"
        visible={isShowAddInvest}
        onOk={this.onSubmit}
        onCancel={this.onCancel}
      >
        <Form>
          <Row gutter={24}>
            <Col span={12}>
              <Form.Item label="人员类型" {...formItemLayout}>
                {getFieldDecorator('userType', {
                  initialValue: userType,
                  rules: [
                    {
                      required: true,
                      message: '人员类型不可为空',
                    },
                  ],
                })(
                  <Select
                    placeholder="请选择人员类型"
                    onChange={val => queryOwnerShip(val)}
                    disabled={isView}
                    showArrow={false}
                  >
                    <Select.Option key={1}>{'本人'}</Select.Option>
                    <Select.Option key={0}>{'利害关系人'}</Select.Option>
                  </Select>,
                )}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="姓名" {...formItemLayout}>
                {getFieldDecorator('userName', {
                  initialValue:
                    getFieldValue('userType') == 1
                      ? queryUserName(getFieldValue('userType'))
                      : userName,
                  rules: [
                    {
                      required: true,
                      message: '姓名不可为空',
                    },
                  ],
                })(
                  DeduplicationList && (
                    <Select placeholder="请选择姓名" disabled={isViewTemp} showArrow={false}>
                      {DeduplicationList.map(item => (
                        <Select.Option key={item.userName}>{item.userName}</Select.Option>
                      ))}
                    </Select>
                  ),
                )}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="与本人关系" {...formItemLayout}>
                {getFieldDecorator('ownerShip', {
                  initialValue: ownerShip
                    ? ownerShip
                    : queryOwnerShip(getFieldValue('userType'), getFieldValue('userName')),
                  rules: [
                    {
                      required: true,
                      message: '与本人关系不可为空',
                    },
                  ],
                })(
                  <Select placeholder="请选择与本人关系" disabled={isViewTemp} showArrow={false}>
                    {inveSecuRelaWithMe.map(item => (
                      <Select.Option key={item.code}>{item.name}</Select.Option>
                    ))}
                  </Select>,
                )}
              </Form.Item>
            </Col>
            <Col span={12}>
              <FormItem name="createTime" label="创建时间:" {...formItemLayout}>
                {getFieldDecorator('createTime', {
                  initialValue: createTime ? moment(createTime) : moment(new Date()),
                })(<DatePicker disabled={true} />)}
              </FormItem>
            </Col>
          </Row>
        </Form>
        <Card title={'投资标的类型维护'}>
          <div style={{ textAlign: 'right', display: isView ? 'none' : 'block' }}>
            <Button
              type="primary"
              onClick={() => {
                this.onShowDetail();
              }}
            >
              新增
            </Button>
          </div>

          <Table
            rowKey={record => record.id}
            columns={targetColumns}
            // scroll={{ x: targetColumns.length * 200 + 200 }}
            dataSource={targetList}
          />
          <AddTarget
            isShowAddTarget={this.state.isShowAddTarget}
            updateTargetList={this.setTargetList}
            editTarget={this.state.editTarget}
          />
        </Card>
      </Modal>
    );
  }
}

const AddInvestModalForm = Form.create({ name: 'add_invest_form' })(AddInvest);

export default AddInvestModalForm;
