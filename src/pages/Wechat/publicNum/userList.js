import React from 'react';
import { connect } from 'dva';
import { nsHoc } from '../../../utils/hocUtil';
import { Button, Card, Col, Form, Icon, Input, message, Modal, Popconfirm, Radio, Row, Select, Tabs, Spin } from 'antd';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import StandardTable from '../../../components/StandardTable/index';
import styles from '../Less/publicNum.less';
import BaseCrudComponent from '@/components/BaseCrudComponent';
import UserAdd from './userSon/UserAdd';
import ExportFile from './userSon/ExportFile';
import { errorBoundary } from "../../../layouts/ErrorBoundary";


const FormItem = Form.Item;
const { Option } = Select;
const RadioGroup = Radio.Group;
const TabPane = Tabs.TabPane;

@errorBoundary
@nsHoc({ namespace: 'publicNum' })
@Form.create()
@connect(state => ({
  publicNum: state.publicNum,
}))

export default class TableList extends BaseCrudComponent {
  state = {
    tabsParam: 1, //1微信用户 2业务用户

    visible: false,
    visible2: false,
    // visible3: false,
    visible4: false,

    //微信用户
    start: 1,
    length: 10,

    //业务用户
    start2: 1,

    formValues: {},
    type:null,   //跳转用户新增组件的type
    item:{},     //存储业务用户的信息
  };

  componentDidMount() {
    const { dispatch } = this.props;

    //默认查询
    this.inquiry();

    //获取下载文件
    dispatch({
      type: 'publicNum/selectList',
      payload: {
        fcode: 'BUSUSER_FILE',
      },
    })
  }

  componentWillReceiveProps(nextProps) {
    const { dispatch, form } = this.props;
    if (nextProps.publicNum.busUserAdd.status == 200) {
      this.setState({ visible: false }, () => {
        nextProps.publicNum.busUserAdd.status = null;
      });

    }
    if (nextProps.publicNum.busUserUpdate.status == 200) {
      this.setState({ visible: false }, () => {
        nextProps.publicNum.busUserUpdate.status = null;
      });

    }

  }

  //点击 表格详情
  showModal = (key, item, type) => e => {
    const { dispatch } = this.props;
    const { tabsParam } = this.state;
    e.preventDefault();
    this.setState({
      [key]: true,
      type:type,
      item:item,
    });

    //新增&修改 业务用户 visible
    //微信详情 visible2
    //导入业务 visible4


    if (key == 'visible2') {
      //详情接口
      dispatch({
        type:'publicNum/wechatDetailed',
        payload: {
          id: item.id,
        },
      });
    }else if(key == 'visible'){
      dispatch({
        type: "publicNum/userForm",
        payload: {
          item:  type =='revise'?item:{},
          type: type =='revise' ?'edit':type,
        }
      });
    }
  };

  //标签页change
  tabsChange = (e) => {
    this.setState({
      tabsParam: e,
    }, () => {
      this.inquiry();
    });
    this.props.form.resetFields();
  };

  onCancel = key => () => {
    this.setState({ [key]: false,item:{},type:null, });
  };

  //查询
  inquiry = () => {
    const { dispatch } = this.props;
    const { tabsParam, start, length, start2 } = this.state;
    this.props.form.validateFields((err, values) => {
      this.setState({
        formValues: values,
      }, () => {
        values.start = tabsParam == 1 ? start : start2;
        values.length = length;
        values.appid = sessionStorage.getItem('publicApp');
        dispatch({
          type: tabsParam == 1 ? 'publicNum/wechat' : 'publicNum/user',
          payload: values,
        });
      });
    });
  };

  //截取字符串
  splitString = (word, num) => {
    let handleWord;
    if (word.length >= num) {
      handleWord = word.substring(0, num) + '...';

    } else {
      handleWord = word;
    }
    return handleWord;
  };

  //微信用户
  wechatForm = () => {
    const { getFieldDecorator } = this.props.form;
    const { publicNum: { loading } } = this.props;

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

    return (
      <Form>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={7} sm={24}>
            <FormItem  {...formItemLayout} label="用户昵称">
              {getFieldDecorator('nickName')(
                <Input placeholder="请输入" style={{ width: '100%' }}/>,
              )}
            </FormItem>
          </Col>
          <Col md={7} sm={24}>
            {/*<FormItem  {...formItemLayout} label="渠道来源">*/}
              {/*{getFieldDecorator('subscribeScene')(*/}
                {/*<Input placeholder="请输入"/>,*/}
              {/*)}*/}
            {/*</FormItem>*/}
          </Col>
          <Col md={10} sm={24}>
            <Button style={{ width: 80, float: 'right', height: 28 }} onClick={this.handleFormReset}>重置</Button>
            <Button type="primary" htmlType="submit" style={{ width: 80, float: 'right', height: 28, marginRight: 10 }}
                    onClick={this.inquiry}>查询</Button>
            <Popconfirm title="确定要刷新吗？" onConfirm={()=>this.reStart()}>
              <Button type="primary" className={styles.addButton} style={{right:205}}>刷新</Button>
            </Popconfirm>
          </Col>
        </Row>
      </Form>
    );
  };

  wechatInfo = () => {
    const { publicNum: { wechatById } } = this.props;
    return (<Row gutter={{ md: 8, lg: 24, xl: 48 }}>
      <Col md={16} sm={24}>
        {/*微信用户*/}
        <div className={styles.wechatImg}>
          <img src={wechatById.headimgurl}/>
        </div>
        <div className={styles.basicInfo1}>
          <p className={styles.titleNname}>{wechatById.nickName ? this.splitString(wechatById.nickName, 32) : '暂无'}
            <Icon type={wechatById.sex == 2 ? 'woman' : 'man'} style={{ color: '#08c' }}/>
          </p>
          <p>{wechatById.city ? wechatById.country + '-' + wechatById.province + '-' + wechatById.city : '暂无城市信息'}</p>
          <p>用户语言：<span>{wechatById.province ? this.splitString(wechatById.province, 26) : '暂无'}</span></p>
          <p>关注时间：<span>{wechatById.subscribeTime ? this.splitString(wechatById.subscribeTime, 26) : '暂无'}</span></p>
          <p>备注：<span>{wechatById.remark ? this.splitString(wechatById.remark, 29) : '暂无'}</span></p>
          <p>公众号标识：<span>{wechatById.openId ? this.splitString(wechatById.openId, 26) : '暂无'}</span></p>
          <p>平台标识：<span>{wechatById.unionId ? this.splitString(wechatById.unionId, 26) : '暂无'}</span></p>
          <p>是否已关注：<span>{wechatById.type == 1 ? '已关注' : '未关注'}</span></p>
          <p>标签：<span>{wechatById.tagidList ? this.splitString(wechatById.tagidList, 29) : '暂无'}</span></p>
          <p>二维码扫码场景：<span>{wechatById.tagidList ? this.splitString(wechatById.tagidList, 24) : '暂无'}</span></p>
        </div>
      </Col>
      <Col md={8} sm={24}>
        {/*业务用户*/}
        <div className={styles.basicInfo2}>
          <p>用户代码：<span>{wechatById.userId ? this.splitString(wechatById.userId, 14) : '暂无'}</span></p>
          <p>用户名称：<span>{wechatById.userName ? this.splitString(wechatById.userName, 14) : '暂无'}</span></p>
          <p>性别：<span>{wechatById.sex == 1 ?'男':(wechatById.sex == 2?'女' : '未知')}</span></p>
          <p>所属机构：<span>{wechatById.userSys ? this.splitString(wechatById.userSys, 14) : '暂无'}</span></p>
        </div>
      </Col>
      {/*<br style={{ clear: 'both' }}/>*/}
    </Row>);

  };

  //业务用户
  businessForm = () => {
    const { getFieldDecorator } = this.props.form;
    const { publicNum: { loading } } = this.props;

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
      <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
        <Col md={7} sm={24}>
          <FormItem  {...formItemLayout} label="用户姓名">
            {getFieldDecorator('userName')(
              <Input placeholder="请输入" style={{ width: '100%' }}/>,
            )}
          </FormItem>
        </Col>
        <Col md={7} sm={24}>
          <FormItem  {...formItemLayout} label="所属机构">
            {getFieldDecorator('userSys')(
              <Input placeholder="请输入"/>,
            )}
          </FormItem>
        </Col>
        <Col md={10} sm={24}>
          <Button style={{ width: 80, float: 'right', height: 28 }} onClick={this.handleFormReset}>重置</Button>
          <Button type="primary" htmlType="submit" style={{ width: 80, float: 'right', height: 28, marginRight: 10 }}
                  onClick={this.inquiry}>查询</Button>
        </Col>
      </Row>
    </Form>);
  };


  //微信用戶
  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;

    this.setState({
      start: pagination.current,
      length: pagination.pageSize,
      formValues: this.props.form.getFieldsValue(),
    }, () => {

      const basic = {
        start: this.state.start,
        length: this.state.length,
        appid: sessionStorage.getItem('publicApp'),
        ...this.state.formValues,
      };
      dispatch({
        type: 'publicNum/wechat',
        payload: basic,
      });
    });
  };

  //業務用戶
  handleStandardTableChange2 = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;

    this.setState({
      start2: pagination.current,
      length: pagination.pageSize,
      formValues: this.props.form.getFieldsValue(),
    }, () => {

      const basic = {
        start: this.state.start2,
        length: this.state.length,
        appid: sessionStorage.getItem('publicApp'),
        ...this.state.formValues,
      };
      dispatch({
        type: 'publicNum/user',
        payload: basic,
      });
    });

  };

  busButton = () => {
    return (<div>
      <Button type="primary" className={styles.addButton} style={{ right: '125px' }}
              onClick={this.showModal('visible', {},'add')}>新增</Button>
      <Button className={styles.addButton} onClick={this.showModal('visible4', {},'import')}>导入</Button>
    </div>);
  };


  //刷新按钮
  reStart =()=>{
    const { dispatch } = this.props;
    let _this = this;
    dispatch({
      type: 'publicNum/reStart',
      payload: {
       appid: sessionStorage.getItem('publicAppId')
      },
    }).then(function(response){
      if (response.status == 200) {
        message.success("刷新成功");
        _this.inquiry()
      } else {
        message.error(response.message);
      }
    })
  }

  //删除业务用户
  deleteConfirm =(record)=> {
    const { dispatch } = this.props;
    const basic = {
      start: this.state.start2,
      length: this.state.length,
      appid: sessionStorage.getItem('publicApp'),
      ...this.state.formValues,
    };
    //调用删除接口
    dispatch({
      type: 'publicNum/userDelete',
      payload: {
        one:{
          id: record.id,
        },
        payload:basic,
      },
    })
  }

  render() {
    const { publicNum: { loading, wechatList, businessList, currentPage4, currentPage5, templateList,userMenu, }, dispatch, namespace } = this.props;
    const { visible, visible2, visible4, tabsParam, start2, length, formValues,type,item } = this.state;

    //微信用户表头
    const columns = [
      {
        title: '头像',
        dataIndex: 'headimgurl',
        render: (val, record) => (
          <div style={{ textAlign: 'center' }}>
            <img src={val} style={{ width: 60, height: 60 }}/>
          </div>
        ),
      },
      {
        title: '用户代码',
        dataIndex: 'userId',
      },
      {
        title: '用户名称',
        dataIndex: 'userName',
      },
      {
        title: '关注时间',
        dataIndex: 'subscribeTime',
      },
      {
        title: '性别',
        dataIndex: 'sex',
        render: (val, record) => (<div>
          {val == 1 ? '男' : (val == 2 ?'女':'未知')}
        </div>),
      },
      {
        title: '昵称',
        dataIndex: 'nickName',
      },
      {
        title: '公众号标识',
        dataIndex: 'openId',
      },
      {
        title: '平台标识',
        dataIndex: 'unionId',
      },
      {
        title: '操作',
        dataIndex: 'id',
        align: 'center',
        width: 150,
        fixed: 'right',
        render: (val, record) => (
          <div>
            <a style={{ marginRight: 10 }} onClick={this.showModal('visible2', record,'detail')}>详情</a>
          </div>
        )
      }
    ];

    //业务用户表头
    const columns2 = [
      {
        title: '用户代码',
        dataIndex: 'userId',
      },
      {
        title: '用户姓名',
        dataIndex: 'userName',
      },
      {
        title: '性别',
        dataIndex: 'userSex',
        render: (val, record) => (<div>
          {val == 0 ? '未知' : (val == 1 ? '男' : '女')}
        </div>),
      },
      {
        title: '所属机构',
        dataIndex: 'userSys',
      },
      {
        title: '操作',
        dataIndex: 'id',
        align: 'center',
        width: 200,
        fixed: 'right',
        render: (val, record) => (
          <div>
            <a style={{ marginRight: 10 }} onClick={this.showModal('visible',record,'revise')}>修改</a>
            <Popconfirm title="确定要删除吗？" onConfirm={()=>this.deleteConfirm(record)}>
              <a style={{ marginRight: 10 }} >删除</a>
            </Popconfirm>
          </div>
        )
      }
    ];

    return (
      <PageHeaderLayout father_url="/wechat/publicNum">
        {/*页签切换*/}
        <Card className={styles.userList}>
          {tabsParam == 2 ? this.busButton() : ''}
          <Spin spinning={loading}>
            <Tabs defaultActiveKey="1" onChange={this.tabsChange}>
              <TabPane tab="微信用户" key="1">{this.wechatForm()}</TabPane>
              <TabPane tab="业务用户" key="2">{this.businessForm()}</TabPane>
            </Tabs>
          </Spin>
        </Card>

        {/*表格*/}
        <Row gutter={{ md: 8, lg: 24, xl: 48 }} className={styles.userList}>
          <Col md={24} sm={24} style={{ marginTop: 20 }}>
            <Card>
              {tabsParam == 1 ? (<StandardTable
                columns={columns}
                selectedRows={[]}
                unSelect={true}
                loading={loading}
                data={wechatList}
                onChange={this.handleStandardTableChange}
                currentPage={currentPage4}
              >
              </StandardTable>) : (
                <StandardTable
                  columns={columns2}
                  selectedRows={[]}
                  unSelect={true}
                  loading={loading}
                  data={businessList}
                  onChange={this.handleStandardTableChange2}
                  currentPage={currentPage5}
                >
                </StandardTable>)}

            </Card>
          </Col>
        </Row>

        {/*新增业务用户模态框*/}
        <Modal
          visible={visible}
          title={"新增用户"}
          // onOk={this.handleOk}
          onCancel={this.onCancel('visible')}
          footer={null}
          width={700}
        >
          <Card bordered={false}>
            {/*{this.menuForm()}*/}
            <UserAdd
              dispatch={dispatch}
              userMenu={userMenu}
              data={item}
              type={type}
              handleCancel={this.onCancel('visible')}
              visible={visible}
              start={start2}
              length={length}
              formValues={formValues}
            />
          </Card>
        </Modal>

        {/*微信用户*/}
        <Modal
          title="用户信息"
          visible={visible2}
          footer={null}
          onCancel={this.onCancel('visible2')}
          width={800}
          className={styles.modal1}
        >
          {this.wechatInfo()}
        </Modal>

        {/*业务用户*/}
        {/*<Modal*/}
          {/*title="用户信息"*/}
          {/*visible={visible3}*/}
          {/*footer={null}*/}
          {/*onCancel={this.onCancel('visible3')}*/}
          {/*width={800}*/}
          {/*className={styles.modal1}*/}
        {/*>*/}
          {/*{this.busInfo()}*/}
        {/*</Modal>*/}

        {/*导入*/}
        <Modal
          title=""
          visible={visible4}
          footer={null}
          onCancel={this.onCancel('visible4')}
          width={800}
          className={styles.modal1}
        >
          <ExportFile
            visible={visible4}
            closeModal={this.onCancel('visible4')}
            destroyOnClose={true}
            importFile={templateList}
            namespace={namespace}
          />
        </Modal>
      </PageHeaderLayout>
    );
  }
}
