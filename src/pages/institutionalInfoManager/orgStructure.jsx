import React, { Component } from 'react';
import { errorBoundary } from '@/layouts/ErrorBoundary';
import Action, { linkHoc } from '@/utils/hocUtil';
import { connect } from 'dva';
import { handleTableCss } from '../manuscriptBasic/func';
import { handleValidator, getUrlParams } from '@/utils/utils';
import {
  message,
  Button,
  Menu,
  Form,
  Card,
  Input,
  Select,
  Row,
  Col,
  Icon,
  icon,
  Popconfirm,
  TreeSelect,
  Modal,
  Spin,
} from 'antd';
import SelfTree from '@/components/SelfTree';

function getQueryVariable(variable) {
  const query = window.location.search.substring(1);
  const vars = query.split('&');
  for (let i = 0; i < vars.length; i++) {
    const pair = vars[i].split('=');
    if (pair[0] == variable) {
      return pair[1];
    }
  }
  return false;
}
class orgStructure extends Component {
  state = {
    // 所属组织机构
    SuperiorOrgs: [],
    // 弹框开关标识
    visible: false,
    // 弹框标题
    title: '',
    // 是否显示loading
    loading: false,
    // 树形部门信息
    department: [],
    // 详情信息
    detailsList: [],
    // 判断修改和新增的标识
    falg: true,
    // 机构分类为“分行”的数据，增加“机构类型”、“资质类型”字段
    isSubBank: false,
    // 获取公共信息页面中，机构类型  及  资质类型的数据
    detailOtherData: {},
  };
  handleorgNameValidator = (rule, value, callback) => {
    handleValidator(value, callback, 100, '机构名称长度过长');
  };
  handleOrgShortValidator = (rule, value, callback) => {
    handleValidator(value, callback, 100, '机构简称长度过长');
  };
  handleOaEmployeeIdValidator = (rule, value, callback) => {
    handleValidator(value, callback, 50, 'OA部门id长度过长');
  };

  // 初始化函数
  componentDidMount = () => {
    this.getCodes();
    this.getSuperiorOrg(getQueryVariable('id'));
    this.getDepartment(getQueryVariable('id'));
    this.handleGetDepartLeaderList();
  };
  /**
   * 字典
   * @method getCodes
   */
  getCodes() {
    const { dispatch } = this.props;
    dispatch({
      type: 'modify/getCodeList',
      payload: ['O002', 'J001', 'J004'],
    });
  }

  // 请求:机构人员列表
  handleGetDepartLeaderList = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'modify/getDepartLeaderFunc',
    });
  };

  /**
   *
   * @method 树形节点部门信息
   */
  getDepartment = val => {
    const { dispatch } = this.props;
    dispatch({
      type: 'modify/getDepartment',
      // type: 'modify/superiorOrgList',
      payload: { needRoot: 1, orgId: val },
    }).then(data => {
      this.setState({
        loading: true,
      });
      if (data.status === 200) {
        const {
          modify: { department },
        } = this.props;
        this.setState({
          department,
          loading: false,
        });
      }
    });
  };

  /**
   *
   * @method 所属组织机构
   */
  getSuperiorOrg = type => {
    const { dispatch } = this.props;
    dispatch({
      type: 'modify/superiorOrgList',
      payload: type,
    }).then(data => {
      if (data) {
        const {
          modify: { SuperiorOrgs },
        } = this.props;
        this.setState({
          SuperiorOrgs,
        });
      }
    });
  };
  // 节点信息新增、修改(同新增机构)
  preservation = () => {
    this.props.form.validateFieldsAndScroll((err, values) => {
      const { dispatch } = this.props;
      const { nodeData, falg } = this.state;
      if (err) {
        return;
      }
      console.log('111', values);
      const value = {
        orgName: values.orgName,
        orgShort: values.orgShort,
        orgKind: values.orgKind,
        parentId: values.parentId,
        oaDeptId: values.oaDeptId,
        departLeader: values.departLeader,
        orgType: values.orgType ? values.orgType.join(',') : '',
        qualifyType: values.qualifyType,
      };
      // 根据falg来判断是不是修改 修改传id
      if (falg) {
        value.id = nodeData.code;
      }
      dispatch({
        type: 'modify/preservation',
        payload: value,
      }).then(data => {
        if (data) {
          // 关闭弹框和加loading
          this.setState(
            {
              visible: false,
              loading: true,
            },
            () => {
              this.getDepartment(getQueryVariable('id'));
            },
          );
        }
      });
    });
  };
  // 详情接口
  /**
   * 详情
   * @method getDetails
   */
  getDetails = id => {
    const { dispatch } = this.props;
    dispatch({
      type: 'modify/getDetails',
      payload: id,
    }).then(data => {
      if (data) {
        const {
          modify: { detailsList },
        } = this.props;
        this.setState({
          detailsList,
          isSubBank: detailsList.orgKind === '1'
        });
      }
    });
  };

  // 获取公共信息页面，资质类型 及 机构类型数据
  getOtherDetails = () => {
    const { dispatch, orgId } = this.props;
    dispatch({
      type: 'modify/getOtherDetails',
      payload: orgId,
    }).then(() => {
      const {
        modify: { detailOtherData },
      } = this.props;
      const { orgType, qualifyType } = detailOtherData || {};
      this.setState({
        detailOtherData: {
          orgType,
          qualifyType,
        },
      });
    });
  };
  // 点击修改时决定弹框出现的状态
  showModal = title => {
    if (!this.state.nodeData || !this.state.nodeData.title) {
      message.warn('请点击选择要修改的节点');
      return;
    }
    this.getOtherDetails();
    this.getDetails(this.state.nodeData.code);
    this.setState({
      visible: true,
      title,
      falg: true,
    });
  };
  // 点击新增时弹框展示
  addShowModal = title => {
    this.getOtherDetails();
    this.setState({
      visible: true,
      title,
      falg: false,
    });
  };
  // 弹框确定时的回调
  handleOk = e => {
    this.preservation();
  };
  // 弹框取消时的回调
  handleCancel = e => {
    console.log(e);
    this.setState({
      visible: false,
    });
  };
  // 弹框销毁时的回调
  afterClose = () => {
    this.props.form.resetFields();
    this.setState({ isSubBank: false });
  };
  getCheckMsg = (result, msg) => {
    // console.log(msg,'msg信息')
  };
  // 数据树选中某个节点的时候的操作
  getClickMsg = (result, msg) => {
    console.log(msg, 'msg信息');
    // nodeData点击获取当前节点的信息
    this.setState({
      nodeData: msg,
    });
  };
  checkableFlag = () => {};
  multipleFlag = () => {};
  // 选择机构分类下拉
  changeValue = val => {
    this.setState({ isSubBank: val === '1' });
  };
  // 保存按钮
  preserButton = () => {
    return (
      <>
        <Button type="primary" htmlType="submit" onClick={() => this.showModal('修改')}>
          修改
        </Button>
        <Button
          style={{ marginLeft: 15 }}
          htmlType="submit"
          onClick={() => this.addShowModal('新增')}
        >
          新增
        </Button>
      </>
    );
  };
  // 组织架构部门修改
  orgFrameAdd = () => {
    const { getFieldDecorator } = this.props.form;
    const {
      modify: { codeList, departLeaderList },
      orgCode,
    } = this.props;
    const { SuperiorOrgs, title, detailsList, falg, department, detailOtherData } = this.state;
    const layout = {
      labelAlign: 'right',
      labelCol: { span: 8 },
      wrapperCol: { span: 16 },
    };
    return (
      <Modal
        width={1200}
        title={title}
        visible={this.state.visible}
        onOk={() => this.handleOk()}
        onCancel={this.handleCancel}
        afterClose={this.afterClose}
      >
        {' '}
        <Row>
          <Form {...layout}>
            <Col span={8}>
              <Form.Item label="机构名称">
                {getFieldDecorator('orgName', {
                  initialValue: falg ? detailsList.orgName : undefined,
                  rules: [
                    {
                      required: true,
                      message: '机构名称不可为空',
                    },
                    { validator: this.handleorgNameValidator },
                  ],
                })(<Input autoComplete="off" allowClear placeholder="请输入机构名称" />)}
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="机构简称">
                {getFieldDecorator('orgShort', {
                  initialValue: falg ? detailsList.orgShort : undefined,
                  rules: [{ validator: this.handleOrgShortValidator }],
                })(
                  <Input
                    autoComplete="off"
                    // disabled={disabled}
                    allowClear
                    placeholder="请输入机构简称"
                  />,
                )}
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="机构分类">
                {getFieldDecorator('orgKind', {
                  initialValue: falg ? detailsList.orgKind : undefined,
                  rules: [
                    {
                      required: true,
                      message: '机构分类不可为空',
                    },
                  ],
                })(
                  <Select
                    placeholder="请选择管机构分类"
                    filterOption={(input, option) =>
                      option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                    onChange={this.changeValue}
                    showSearch
                  >
                    {codeList?.O002?.map(item => {
                      if (item.code) {
                        return <Select.Option key={item.code}>{item.name}</Select.Option>;
                      }
                    })}
                  </Select>,
                )}
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="所属组织机构">
                {getFieldDecorator('parentId', {
                  initialValue: falg ? detailsList.parentId : undefined,
                  rules: [
                    {
                      required: true,
                      message: '所属组织机构不可为空',
                    },
                  ],
                })(
                  <TreeSelect
                    dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                    treeData={department}
                    placeholder="请选择所属组织机构"
                    treeDefaultExpandAll
                    // onChange={this.onChange}
                  />,
                )}
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="OA部门id">
                {getFieldDecorator('oaDeptId', {
                  initialValue: falg ? detailsList.oaDeptId : undefined,
                  rules: [{ validator: this.handleOaEmployeeIdValidator }],
                })(<Input autoComplete="off" allowClear placeholder="请输入OA部门id" />)}
              </Form.Item>
            </Col>
            {orgCode === '91450300198230687E' && (
              <Col span={8}>
                <Form.Item label="负责人">
                  {getFieldDecorator('departLeader', {
                    initialValue: falg ? detailsList.departLeader : undefined,
                    rules: [
                      {
                        required: true,
                        message: '负责人不可为空',
                      },
                    ],
                  })(
                    <Select
                      placeholder="请选择负责人"
                      filterOption={(input, option) =>
                        option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                      }
                      showSearch
                    >
                      {departLeaderList.map(item => {
                        if (item.id !== undefined) {
                          return <Select.Option key={item.id}>{item.name}</Select.Option>;
                        }
                      })}
                    </Select>,
                  )}
                </Form.Item>
              </Col>
            )}
            <Col span={8} style={{ display: this.state.isSubBank ? 'block' : 'none' }}>
              <Form.Item label="机构类型">
                {getFieldDecorator('qualifyType', {
                  initialValue: detailOtherData.qualifyType,
                })(
                  <Select disabled optionFilterProp="children">
                    {codeList &&
                      codeList.J001 &&
                      codeList.J001.map(item => (
                        <Select.Option key={item.code}>{item.name}</Select.Option>
                      ))}
                  </Select>,
                )}
              </Form.Item>
            </Col>
            <Col span={8} style={{ display: this.state.isSubBank ? 'block' : 'none' }}>
              <Form.Item label="资质类型">
                {getFieldDecorator('orgType', {
                  initialValue: detailOtherData.orgType,
                })(
                  <Select disabled mode="multiple" optionFilterProp="children">
                    {codeList &&
                      codeList.J004 &&
                      codeList.J004.map(item => (
                        <Select.Option key={item.code}>{item.name}</Select.Option>
                      ))}
                  </Select>,
                )}
              </Form.Item>
            </Col>
          </Form>
        </Row>
      </Modal>
    );
  };
  // 组织架构部门查看
  orgFrameeDit = () => {
    const { department } = this.state;
    return (
      <Row>
        <Col span={24} style={{ textAlign: 'right', marginBottom: 20, padding: '8px 16px' }}>
          {this.preserButton()}
        </Col>
        <Col span={24}>
          <SelfTree
            treeData={department}
            multipleFlag={false}
            checkable
            searchFlag={true}
            getCheckMsg={this.getCheckMsg}
            getClickMsg={this.getClickMsg}
            falg={false}
            // checkableFlag={this.checkableFlag}
            // multipleFlag={this.multipleFlag}
          />
        </Col>
      </Row>
    );
  };
  orgFrameSee = () => {
    const { department } = this.state;
    return (
      <SelfTree
        treeData={department}
        multipleFlag={false}
        searchFlag={true}
        getCheckMsg={this.getCheckMsg}
        getClickMsg={this.getClickMsg}
        falg={false}
      />
    );
  };
  render() {
    const { identification } = this.props;
    return (
      <div>
        {this.orgFrameAdd()}
        <Spin spinning={this.state.loading}>
          {identification ? this.orgFrameSee() : this.orgFrameeDit()}
        </Spin>
      </div>
    );
  }
}

const WrappedAdvancedSearchForm = errorBoundary(
  Form.create()(
    connect(({ modify, loading }) => ({
      modify,
    }))(orgStructure),
  ),
);

export default WrappedAdvancedSearchForm;
