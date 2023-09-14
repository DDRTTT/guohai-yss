import React from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { nsHoc } from '../../../utils/hocUtil';
import { Button, Card, Form, Pagination, Row, Select, Popconfirm } from 'antd';
import styles from '../Less/publicNum.less';
import BaseCrudComponent from '@/components/BaseCrudComponent';
import Action, { ActionBool, getCurrentMenu } from '@/utils/hocUtil';
import { errorBoundary } from "../../../layouts/ErrorBoundary";


const FormItem = Form.Item;
const { Option } = Select;

@errorBoundary
@nsHoc({ namespace: 'publicNum' })
@Form.create()
@connect(state => ({
  publicNum: state.publicNum,
  // systeam: state.systeam,
}))

export default class TableList extends BaseCrudComponent {
  state = {
    publicList:[{
      pubName:'赢时胜创服平台',
      createTime:'2018-08-23',
      pubImg:'',
      pubId:1,
    }],

    length:10, //每页数据条数
    start:1,   //页码
  };

  componentDidMount() {
    const { dispatch } = this.props;
    //公众号查询
    this.publicFetch()
  }

  componentWillReceiveProps(nextProps) {
    const { dispatch, form } = this.props;
    if(nextProps.publicNum.untiePublic.status == 200){
      this.setState({
        length:10, //每页数据条数
        start:1,   //页码
      },()=>{
        this.publicFetch()
      })

      nextProps.publicNum.untiePublic.status = null
    }

  }

  //公众号查询
  publicFetch = () => {
    const { dispatch } = this.props;
    const { length,start } = this.state;

    let basic = {
      length:length,
      start:start
    }

    dispatch({
      type: 'publicNum/fetch',
      payload: basic,
    });

  }

  //公众号页面渲染
  publicItem = () => {
    const { publicNum:{ data } } = this.props
    let child = [];
    data.rows.map((index,i)=>{
      child.push(<Card className={styles.listPublic}>
            <div style={{float:'left'}}><img src={index.headIcon} className={styles.publicImg}/></div>
            <div className={styles.publicInfo}>
              <p>{index.appName}</p>
              <p>创建时间:<span>{index.newCreateTime}</span></p>
            </div>
            <div className={styles.btnGroup}>
              <Action key="publicNum:update" code="publicNum:update">
                <Button onClick={() => this.editPub('edit', index)}>编辑</Button>
              </Action>
              <Action key="publicNum:queryMenu" code="publicNum:queryMenu">
                <Button onClick={() => this.editPub('man', index)}>菜单管理</Button>
              </Action>
              <Action key="publicNum:mouldQuery" code="publicNum:mouldQuery">
                <Button onClick={() => this.editPub('mes', index)}>模板消息</Button>
              </Action>
              <Action key="publicNum:wechatList" code="publicNum:wechatList">
                <Button onClick={() => this.editPub('user', index)}>用户列表</Button>
              </Action>
              <Action key="publicNum:bind" code="publicNum:bind">
                <Popconfirm title="确定要删除吗？" onConfirm={()=>this.untiePublic(index)}>
                  <Button>删除</Button>
                </Popconfirm>
              </Action>

            </div>
      </Card>)
    })

    return(<div>{child}</div>)
  }

  //添加公众号
  addPublicNum = () => {
    const { dispatch } = this.props;
    dispatch(routerRedux.push('./publicOperate'));
  }

  //编辑公众号
  editPub = (type,record) => {
    const { dispatch } = this.props;
    sessionStorage.setItem('publicType',type)
    if(type !== 'add'){
     sessionStorage.setItem('publicApp',record.id)
     sessionStorage.setItem('publicAppId',record.wechatAppAuth.appId)
    }
    if(type == 'edit'|| type == 'add') dispatch(routerRedux.push('./publicOperate'));
    if(type == 'man') dispatch(routerRedux.push('./menuMan'));
    if(type == 'mes') dispatch(routerRedux.push('./mesMould'));
    if(type == 'user') dispatch(routerRedux.push('./userList'));
  }

  //删除公众号
  untiePublic = (record) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'publicNum/Untie',
      payload: {
        id:record.id
      },
    });
  }

  //页码change
  onShowSizeChange = (current, pageSize) => {
    const { dispatch } = this.props;

    this.setState({
      length:pageSize,
      start:current,
    },()=>{
      let basic = {
        length:this.state.length,
        start:this.state.start
      }
      dispatch({
        type: 'publicNum/fetch',
        payload: basic,
      });
    })

  }

  render() {
    const { dispatch,publicNum:{ data } } = this.props;

    //控制显示隐藏变量
    const show = {
      display: "",
    }
    const hide = {
      display: "none",
    }

    return (
      <div className={styles.public}>
        {/*添加版面*/}
        <Card style={{ width: '100%' }} className={styles.addPublic}>
          <div style={{float:'left'}}>
            <p className={styles.addTitle}>{data.total == 0?<span>尚未</span>:''}添加可管理的公众号</p>
            <p className={styles.addSubtitle}>请先授权需要管理的公众号，可以添加多个</p>
          </div>
          <div style={{float:'right'}}>
            <Button style={{ marginTop: 12, width: 86, height: 28, }} type={'primary'} onClick={()=>this.editPub('add',{})}>立即添加</Button>
          </div>
        </Card>

        {/*公众号列表*/}
        {this.publicItem()}
        <Row gutter={{ md: 24, lg: 24, xl: 48 }} className={styles.page} style={data.rows.length == 0 ||data.total<=10? hide : show } >
        {/* 分页 */}
        <Pagination current={this.state.start} total={data.total} pageSize={10} onChange={this.onShowSizeChange} />
        </Row>
      </div>
    );
  }
}
