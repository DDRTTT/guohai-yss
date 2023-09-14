import React from "react";
import { connect } from "dva";
import { nsHoc } from "../../../utils/hocUtil";
import { Button, Card, Col, Form, Input, Modal, Popconfirm, Radio, Row, Select } from "antd";
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import StandardTable from "../../../components/StandardTable/index";
import styles from "../Less/publicNum.less";
import BaseCrudComponent from '@/components/BaseCrudComponent';
import { errorBoundary } from "../../../layouts/ErrorBoundary";


const FormItem = Form.Item;
const { Option } = Select;
const RadioGroup = Radio.Group;

@errorBoundary
@nsHoc({ namespace: "publicNum" })
@Form.create()
@connect(state => ({
  publicNum: state.publicNum
  // systeam: state.systeam,
}))

export default class TableList extends BaseCrudComponent {
  state = {
    visible: false,
    modalType: null,
    modalData: null,

    appId: null,
    menuId: null,      //调用修改接口时要用到的菜单id
    parentShow: false, //父级菜单是否禁用
    isNew: false,      //是否重定向

    start: 1,
    length: 10,        //页码传值参数

    levelList: [
      {
        name: "一级菜单",
        code: 1
      }, {
        name: "二级菜单",
        code: 2
      }
    ],

    //用户标识列表
    scopeList: [
      {
        name: "snsapi_base",
        code: "snsapi_base"
      }, {
        name: "snsapi_userinfo",
        code: "snsapi_userinfo"
      }
    ],

    //修改存储
    editRecord: null,

    //表单验证
    error: "",
    helpMes: ""
  };

  componentDidMount() {
    const { dispatch } = this.props;

    this.setState({
      appId: sessionStorage.getItem("publicApp")
    }, () => {
      this.getMenuList();
    });

  }

  componentWillUnmount(){
    sessionStorage.removeItem("publicApp");
  }

  componentWillReceiveProps(nextProps) {
    const { dispatch, form } = this.props;

    if (nextProps.publicNum.publicMenuAdd.status == 200) {
      this.handleCancel();
      this.props.form.resetFields();
      this.getMenuList(1);
      nextProps.publicNum.publicMenuAdd.status = null;
    }

    if (nextProps.publicNum.publicMenuUpdate.status == 200) {
      this.handleCancel();
      this.props.form.resetFields();
      this.getMenuList(1);
      nextProps.publicNum.publicMenuUpdate.status = null;
    }

    if (nextProps.publicNum.publicMenuDelete.status == 200) {
      this.getMenuList(1);
      nextProps.publicNum.publicMenuDelete.status = null;
    }
  }

  //公众号初始查询
  getMenuList = (a) => {
    const { dispatch } = this.props;
    const { start, length } = this.state;

    this.setState({
      start: a ? 1 : start
    }, () => {

      //获取公众号列表
      dispatch({
        type: "publicNum/menu",
        payload: {
          appId: sessionStorage.getItem("publicApp"),
          length: length,
          start: start
        }
      });

      //获取父级菜单
      dispatch({
        type: "publicNum/menuParentList",
        payload: {
          id: sessionStorage.getItem("publicApp")
        }
      });

    });

  };

  //表格操作
  tableHandle = (item, type) => {
    const { dispatch } = this.props;
    //编辑
    if (type == "edit") {
      this.editMenuFun(item, type);
      this.setState({
        menuId: item.id
      });
      //删除
    } else {
      dispatch({
        type: "publicNum/menuDelete",
        payload: {
          id: item.id
        }
      });
    }
  };

  //新增修改模态框
  editMenuFun = (item, type) => {
    const { dispatch } = this.props;

    this.setState({
      visible: true,
      modalType: type,
      modalData: item,
      isNew: (type != "add") && (item.isRedirect == 0) ? false : true
    }, () => {

      dispatch({
        type: "publicNum/menuForm",
        payload: {
          item: item,
          type: type
        }
      });

      this.setState({
        parentShow: item.levelNum == 1 ? true : false
      });

    });
  };

  handleOk = () => {
    setTimeout(() => {
      this.setState({ visible: false });
    }, 3000);
  };

  handleCancel = () => {
    this.setState({ visible: false });
    this.props.form.resetFields();
  };

  //切换是否重定向
  changeRedirect = (e) => {
    this.setState({
      isNew: e.target.value == 1 ? true : false
    });

  };

  //表单提交
  formSubmit = () => {
    // e.preventDefault();
    const { dispatch, form } = this.props;
    form.validateFields((err, values) => {
      if (!err) {
        values.id = this.state.modalType == "add" ? null : this.state.menuId;
        let basic = {
          id: this.state.appId,
          menuInfos: [values]
        };

        //提交表单
        dispatch({
          type: this.state.modalType == "add" ? "publicNum/menuAdd" : "publicNum/menuUpdate",
          payload: basic
        });
      }
    });
  };

  //检查名字的长度
  checkName = (rule, value, callback) => {
    const { parentShow } = this.state;
    const { dispatch, form } = this.props;
    if (!value) {
      callback("菜单名称为必填项！");
      this.setState({
        error: "error",
        helpMes: "菜单名称为必填项!"
      });
      callback('菜单名称为必填项');
    } else {
      let length = value.replace(/[^\u0000-\u00ff]/g, "aa").length;
      if (parentShow ? length > 16 : length > 60) {
        this.setState({
          error: "error",
          helpMes: parentShow ? "菜单名称不得超过16个字节!" : "菜单名称不得超过60个字节!"
        },()=>{
          callback(this.state.helpMes);
        });

      } else {
        this.setState({
          error: "",
          helpMes: ""
        });
      }
      callback();
    }
  };

  //编辑表单
  menuForm = () => {
    const { levelList, modalData, scopeList, parentShow, isNew, error, helpMes, } = this.state;
    const { publicNum: { editMenu, parentList,loading } } = this.props;
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 4 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 20 }
      }
    };

    return (<Form>
      <FormItem  {...formItemLayout} label={"菜单等级"}>
        <Col md={14} sm={24}>
          {getFieldDecorator("levelNum", {
            initialValue: modalData ? modalData.levelNum : "",
            rules: [{ required: true, message: "菜单等级为必填项!" }]
          })(
            this.selectList(levelList, "levelNum", "code")
          )}
        </Col>
        <Col md={10} sm={24}></Col>
      </FormItem>
      <FormItem  {...formItemLayout} label={"父级菜单"}>
        <Col md={14} sm={24}>
          {getFieldDecorator("parentId", {
            initialValue: modalData ? modalData.parentId : "",
            rules: [{ required: !parentShow, message: "父级菜单为必填项!" }]
          })(
            this.selectList(parentList, "parentId", "parentId")
          )}
        </Col>
        <Col md={10} sm={24}></Col>
      </FormItem>
      <FormItem  {...formItemLayout} label={"菜单名称"} help={helpMes} validateStatus={error}>
        <Col md={14} sm={24}>
          {getFieldDecorator("name", {
            initialValue: modalData ? modalData.name : "",
            rules: [{ required: true, message: "菜单名称为必填项!" }, { validator: this.checkName }]
          })(
            <Input/>
          )}
        </Col>
        <Col md={10} sm={24}><p style={{
          fontSize: 14,
          color: "#c3c9d2",
          marginLeft: 10,
          height: 32
        }}>{parentShow ? "菜单名称最多8个汉字" : "菜单名称最多30个汉字"}</p></Col>
      </FormItem>

      {this.renderForm(editMenu)}

      {/*是否重定向*/}
      <FormItem  {...formItemLayout} label={"是否重定向"}>
        <Col md={14} sm={24}>
          {getFieldDecorator("isRedirect", {
            initialValue: modalData?(JSON.stringify(modalData)!="{}"?modalData.isRedirect:1):1,
          })(
            <RadioGroup onChange={this.changeRedirect}>
              <Radio value={1}>是</Radio>
              <Radio value={0}>否</Radio>
            </RadioGroup>
          )}
        </Col>
        <Col md={10} sm={24}></Col>
      </FormItem>
      <FormItem  {...formItemLayout} label={"定向服务地址"}>
        <Col md={14} sm={24}>
          {getFieldDecorator("redirectUrl", {
            initialValue: modalData ? modalData.redirectUrl : "",
            rules: [{ required: isNew, message: "定向服务地址为必填项!" }]
          })(<Input/>)}
        </Col>
        <Col md={10} sm={24}></Col>
      </FormItem>
      <FormItem  {...formItemLayout} label={"state标记"}>
        <Col md={14} sm={24}>
          {getFieldDecorator("state", {
            initialValue: modalData ? modalData.state : "",
            rules: [{ required: isNew, message: "state标记为必填项!" }]
          })(<Input />)}
        </Col>
        <Col md={10} sm={24}></Col>
      </FormItem>
      <FormItem  {...formItemLayout} label={"用户标示"}>
        <Col md={14} sm={24}>
          {getFieldDecorator("scope", {
            initialValue: modalData ? modalData.scope : "",
            rules: [{ required: isNew, message: "state标记为必填项!" }]
          })(
            this.selectList2(scopeList)
          )}
        </Col>
        <Col md={10} sm={24}></Col>
      </FormItem>
      <Button onClick={() => this.handleCancel()} style={{ float: "right" }}>取消</Button>
      <Button type="primary" onClick={()=>this.formSubmit()} style={{ marginRight: 10, float: "right" }} disabled={loading}>确定</Button>
    </Form>);
  };

  //加密方式下拉
  selectList = (list, field, value) => {
    const { parentShow } = this.state;
    let child = [];
    list.map((index, i) => {
      child.push(<Option value={index[value]}>{index.name}</Option>);
    });

    return (<Select style={{ width: "100%" }}
                    disabled={field == "parentId" ? (parentShow ? true : false) : false}
                    onChange={field == "levelNum" ? this.changeSelect : this.changeSelect2}>
      {child}
    </Select>);
  };

  //加密方式下拉
  selectList2 = (list) => {
    let child = [];
    list.map((index, i) => {
      child.push(<Option value={index.code}>{index.name}</Option>);
    });

    return (<Select style={{ width: "100%" }}
    >
      {child}
    </Select>);
  };

  changeSelect = (e) => {
    this.setState({
      parentShow: e == "1" ? true : false
    });
    //菜单等级的值改变，父级菜单的值清空
    this.props.form.setFieldsValue({
      parentId: ""
    });
  };

  changeSelect2 = (e) => {

  };


  //渲染表单
  renderForm = (formList) => {
    const { getFieldDecorator } = this.props.form;

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 4 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 20 }
      }
    };
    let uploadInfo = [];
    formList.map((index, i) => {
      uploadInfo.push(<div>
        <FormItem  {...formItemLayout} label={index.label}>
          <Col md={index.tipShow ? 14 : 24} sm={24}>
            {getFieldDecorator(index.filedName, {
              initialValue: index.initialValue,
              rules: [{ required: index.required, message: index.label + "为必填项!" }]
            })(
              <Input/>
            )}
          </Col>
          <Col md={index.tipShow ? 10 : 0} sm={24}><p
            style={{ fontSize: 14, color: "#c3c9d2", marginLeft: 10, height: 32 }}>{index.tipInfo}</p></Col>
        </FormItem>
      </div>);
    });
    return uploadInfo;
  };

  menuPublic = () => {
    const { dispatch } = this.props;
    let basic = {};
    //提交表单
    dispatch({
      type: "publicNum/menuPublic",
      payload: basic
    });
  };

  handleStandardTableChange = (pagination) => {

    this.setState({
      length: pagination.pageSize,
      start: pagination.current
    }, () => {
      this.getMenuList();
    });

  };


  render() {
    const { publicNum: { loading, publicMenu, currentPage2 } } = this.props;
    const { visible, modalType } = this.state;


    const columns = [
      {
        title: "顺序",
        dataIndex: "orderNum"
      },
      {
        title: "菜单名称",
        dataIndex: "name"
      },
      {
        title: "菜单等级",
        dataIndex: "levelNum",
        render: (val) => (
          <div>{val == 1 ? "一级菜单" : "二级菜单"}</div>
        )
      }, {
        title: "菜单类型",
        dataIndex: "typeName"
      },
      {
        title: "链接地址",
        dataIndex: "linkUrl"
      }, {
        title: "操作",
        dataIndex: "id",
        align: "center",
        width: 200,
        fixed: 'right',
        render: (val, record) => (
          <div>
            <a style={{ marginRight: 10 }} onClick={() => {
              this.tableHandle(record, "edit");
            }}>修改</a>
            <Popconfirm title="确定要删除吗?" onConfirm={() => this.tableHandle(record, "delete")}>
              <a style={{ marginRight: 10 }} href="javascript:;">删除</a>
            </Popconfirm>
          </div>
        )
      }
    ];

    return (
      <PageHeaderLayout father_url="/wechat/publicNum">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }} className={styles.menuDo}>
          <Col md={24} sm={24}>
            <Card className={styles.menuTitle}>
              <div className={styles.menuTips}>
                <p>菜单添加规则：</p>
                <p>1. 微信端最多创建 <span>3 个一级菜单</span>，每个一级菜单下最多可以创建 <span>5 个二级菜单</span>，菜单最多支持两层。</p>
                <p>2. 添加好自定义菜单后点击发布微信端自定义菜单，重新关注即时生效，默认24小时生效。</p>
                <p style={{ clear: "both" }}></p>
              </div>
              <div className={styles.menuBtn}>
                <Button type="primary" onClick={() => this.editMenuFun({}, "add")}>新增菜单</Button>
                <Button onClick={() => this.menuPublic()}>菜单发布</Button>
              </div>
            </Card>
          </Col>
          {/*表格*/}
          <Col md={24} sm={24} style={{ marginTop: 20 }}>
            <Card>
              <StandardTable
                columns={columns}
                unSelect={true}
                selectedRows={[]}
                loading={loading}
                data={publicMenu}
                onChange={this.handleStandardTableChange}
                currentPage={currentPage2}
              >
              </StandardTable>
            </Card>
          </Col>
        </Row>
        <Modal
          visible={visible}
          title={modalType == "add" ? "新增菜单" : "修改菜单"}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          footer={null}
          width={820}
        >
          <Card bordered={false}>
            {this.menuForm()}
          </Card>
        </Modal>
      </PageHeaderLayout>
    );
  }
}
