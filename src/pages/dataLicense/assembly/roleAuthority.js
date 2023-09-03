import React, { Component } from 'react';
import { connect } from 'dva';
import { Card, Form, Icon, message, Tag, Tooltip, Modal, Input, Col, Row, Radio } from 'antd';
import classNames from 'classnames';
import cloneDeep from 'lodash/cloneDeep';
import styles from '../Less/dataLicense.less';
import { getSession, setSession } from '@/utils/session';
import { parse } from 'qs';

const text = '单击为查看，双击为使用';
const dirCode = 'attributionSystem,manuscriptStrategy,authorizationStrategy';
let count = 0;

@Form.create()
@connect(({ orgAuthorize, role, user, systeam, memberManagement, loading }) => ({
  orgAuthorize,
  role,
  user,
  systeam,
  memberManagement,
  addJobLoading: loading.effects['memberManagement/handleDetailJob'],
  getCurrentUserJobLoading: loading.effects['memberManagement/handleGetCurrentUserJobList'],
}))
export default class Index extends Component {
  state = {
    inputVisible: false,
    inputValue: '',
    show1: false,
    show2: false,
    show3: false,
    roleStyle: {},
    jobArr: [],
    len: 0,
    currentTagId: null,
    // 系统key  0赢管家 1生命周期 2报表世界 3数据中心
    sysKey: '0',
    // 是否是修改岗位
    jobModify: false,
  };

  componentDidMount() {
    const sysId = getSession('sysId');
    const firstSysId = sysId?.split(',')[0] || 1;
    this.setState({ sysKey: firstSysId });
    const { dispatch } = this.props;

    dispatch({
      type: 'orgAuthorize/hasRoleSearch',
      payload: firstSysId,
    });

    // 获取当前用户有的岗位列表
    dispatch({
      type: 'memberManagement/handleGetCurrentUserJobList',
      payload: firstSysId,
    });

    // 所属部门词汇
    dispatch({
      type: 'memberManagement/handleGetDictList',
      payload: { codeList: dirCode },
    });
  }

  /**
   * 方法说明  查看或者使用组件
   * @method  tagChange
   * @param   {Object} tag 组件信息
   * @param   {type} index
   * @param   {type} type
   * @param   {Boolean} job 是否是岗位
   */
  tagChange = (tag, index, type, job) => {
    const { dispatch } = this.props;
    // 重置岗位信息表单
    this.handleJobFormReset();
    count += 1;
    setTimeout(() => {
      if (count === 1) {
        if (this.state.check === tag.id + type) {
          this.setState({
            check: '无',
          });
          dispatch({
            type: `role/hasChooseRole`,
            payload: '',
          });
          dispatch({
            type: `role/getAuthorizeById`,
            payload: '',
          });
        } else {
          this.setState({
            currentTagId: tag.id,
            check: tag.id + type,
          });
          dispatch({
            type: `role/hasChooseRole`,
            payload: tag.id,
          });
          if (job) {
            this.setState({
              jobModify: true,
            });
            // 打开岗位弹框
            dispatch({
              type: `memberManagement/handleSaveModalJob`,
              payload: true,
            });
            // 获取岗位详情
            dispatch({
              type: `memberManagement/handleDetailJob`,
              payload: { id: tag.id },
            });
          } else {
            dispatch({
              type: `role/getAuthorizeById`,
              payload: tag.id,
            });
          }
        }
      } else if (count === 2 && type !== 'has') {
        const {
          dataPage: { userRole, positions },
        } = this.props;
        let num = 0;
        [...userRole, ...positions].forEach(data => {
          if (data.id === tag.id) {
            num++;
          }
        });
        if (num !== 0) {
          message.warn('请勿重复添加组件');
        } else {
          const objectDataString = JSON.stringify(this.props.dataPage);
          const data = JSON.parse(objectDataString);
          const emptyRoleDataString = JSON.stringify(this.props.emptyRoleData);
          const emptyRoleData = JSON.parse(emptyRoleDataString);
          Object.keys(emptyRoleData).forEach(key => {
            emptyRoleData[key] = tag[key] ? tag[key] : emptyRoleData[key];
          });
          if (job) {
            data.positions.push(emptyRoleData);
          } else {
            data.userRole.push(emptyRoleData);
          }
          dispatch({
            type: 'orgAuthorize/changeHasRole',
            payload: { data },
          });
        }
      }
      count = 0;
    }, 300);
  };

  showInput = type => {
    sessionStorage.setItem('chooseRole', type);
    this.props.addRoleFun();
  };

  // 移除已选择的组件
  closeTage = tagData => {
    const { dispatch } = this.props;
    if (`${tagData.id}has` === +this.state.check) {
      this.setState({
        check: '无',
      });
    }

    const target = cloneDeep(this.props.dataPage);
    target.userRole.forEach((item, i) => {
      if (tagData.id === item.id) {
        target.userRole.splice(i, 1);
      }
    });
    target.positions.forEach((item, i) => {
      if (tagData.id === item.id) {
        target.positions.splice(i, 1);
      }
    });
    dispatch({
      type: 'orgAuthorize/changeHasRole',
      payload: { data: target },
    });
  };

  // 显示更多
  showMore = index => {
    this.setState({
      [`show${index}`]: !this.state[`show${index}`],
    });
  };

  // 修改岗位时，取消或选中
  handleJob = id => {
    const {
      dispatch,
      memberManagement: { saveJobActions },
    } = this.props;

    const jobArr = [...saveJobActions];

    if (jobArr.includes(id)) {
      jobArr.splice(jobArr.indexOf(id), 1);
    } else {
      jobArr.push(id);
    }
    this.setState({
      len: jobArr.length,
    });
    dispatch({
      type: 'memberManagement/handleModifyDetailJob',
      payload: jobArr,
    });
  };

  // 提交(新增/修改) 岗位
  handleJobSubmit = () => {
    const {
      dispatch,
      form,
      // 岗位详情
      memberManagement: { saveJobActions },
    } = this.props;
    const { currentTagId, sysKey, jobModify } = this.state;
    form.validateFields((err, values) => {
      if (!err) {
        if (saveJobActions.length > 0) {
          // 如果存在岗位信息就是修改
          if (jobModify) {
            dispatch({
              type: 'memberManagement/handleUpdateJob',
              payload: {
                ...values,
                id: currentTagId,
                roleIds: [...saveJobActions],
                sysId: sysKey,
              },
            });
          } else {
            // 不存在岗位信息就是新增
            dispatch({
              type: 'memberManagement/handleSaveJob',
              payload: {
                sysId: sysKey,
                ...values,
                roleIds: [...saveJobActions],
              },
            });
          }
        } else {
          message.warn('请至少为该组件选择一个功能组件');
        }
      }
    });
  };

  // 重置岗位信息表单
  handleJobFormReset = () => {
    const {
      dispatch,
      form: { resetFields },
    } = this.props;
    dispatch({
      type: 'memberManagement/handleSaveModalJob',
      payload: false,
    });
    dispatch({
      type: `role/basicSet`,
      payload: {},
    });
    resetFields(['remark', 'name']);
    this.setState({ jobModify: false });
  };

  // TODO: 1、菜单树 2、已选择组件 3、所属岗位 4、功能组件 授权组件
  // 切换用户归属系统
  handleJobChange = e => {
    const search = parse(window.location.search, { ignoreQueryPrefix: true });
    const orgId = sessionStorage.getItem('saveOrgId') || search.orgId;
    const memberId = sessionStorage.getItem('saveMemberId') || search.saveMemberId;
    const { dispatch } = this.props;
    const key = e.target.value;
    this.setState({ sysKey: key });

    const sysIds = getSession('sysId');
    const firstSysId = sysIds?.split(',');
    firstSysId?.filter(item => item !== key);
    firstSysId?.unshift(key);
    const uniqueSysIdArr = Array.from(new Set(firstSysId));

    // 将切换的系统
    setSession('sysId', uniqueSysIdArr.join());
    // TODO: 1、菜单树     完成 √
    // 先清空数据
    dispatch({
      type: 'role/saveAllmenutree',
      payload: [],
    });
    dispatch({
      type: 'role/init',
      payload: key,
    });

    // TODO: 2、已选择组件  完成 √
    dispatch({
      type: `orgAuthorize/queAllData`,
      payload: {
        orgAuthedId: orgId,
        userAuthedId: memberId,
        sysId: key,
      },
    });

    // TODO: 3、所属岗位   完成 √
    dispatch({
      type: 'memberManagement/handleGetCurrentUserJobList',
      payload: key,
    });

    // TODO: 4、功能组件 授权组件  完成 √
    dispatch({
      type: 'orgAuthorize/hasRoleSearch',
      payload: key,
    });
    // 暂存 选择的系统
    dispatch({
      type: 'role/handleSveSysId',
      payload: key,
    });
  };

  // 新增岗位
  handleAddJob = () => {
    const {
      dispatch,
      form: { resetFields },
    } = this.props;
    // 重置表单
    dispatch({
      type: `role/basicSet`,
      payload: {},
    });
    resetFields(['remark', 'name']);
    // 重置岗位包含的组件id [string]
    dispatch({
      type: `memberManagement/saveJobActions`,
      payload: [],
    });
    // true开启/false关闭 新增岗位弹框
    dispatch({
      type: 'memberManagement/handleSaveModalJob',
      payload: true,
    });
  };

  // 删除组件
  handleDelRole = ({ id }, firstSysId, title, type, e) => {
    e.stopPropagation();
    const { dispatch } = this.props;
    dispatch({
      type: 'memberManagement/handleDelRole',
      payload: { id, firstSysId },
    });
  };

  // 删除岗位
  handleDelJob = ({ id }, firstSysId, title, type, e) => {
    e.stopPropagation();
    const { dispatch } = this.props;
    dispatch({
      type: 'memberManagement/handleDelJob',
      payload: { id, firstSysId },
    });
  };

  handleConfirm = ({ id,name }, firstSysId, title, type, e, category) => {
    e.stopPropagation();
    let content='';
    if(type==='job'){
      content=`确定要删除岗位组件"${name}"吗？删除该岗位组件后，原流程图办理节点如果包含该岗位组件将会一并删除。`
    }else if(type==='role' && category==='func' ){
      content=`确定要删除功能组件"${name}"吗？删除该功能组件后，后续对应的菜单授权和功能授权将会受到影响。`
    }else if(type==='role' && category==='auth' ){
      content=`确定要删除授权组件"${name}"吗？删除该授权组件后，后续对应的用户授权将会受到影响。`
    }else{
      content=`确定要删除创建的${title}吗？`
    }
    Modal.confirm({
      title: `确定删除${title}么?`,
      content: content,
      okText: '确定',
      okType: 'danger',
      cancelText: '取消',
      onOk: () => {
        if (type === 'role') {
          this.handleDelRole({ id }, firstSysId, title, type, e);
        } else {
          this.handleDelJob({ id }, firstSysId, title, type, e);
        }
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  };

  render() {
    const { inputVisible, sysKey, jobModify } = this.state;
    const {
      orgAuthorize: { dataPage, tags, loading },
      dataPage: { userRole = [], positions = [] },
      memberManagement: {
        saveInfo: { type },
        saveInfo,
        saveCurrentUserJobList,
        saveDictList: { attributionSystem },
        saveModalJob,
        saveJobActions,
        saveJobInfo,
      },
      formType,
      form: { getFieldDecorator },
      addJobLoading,
      getCurrentUserJobLoading,
    } = this.props;
    let chooseShow;
    let sysId;
    // 从本地取出
    const sysIds = getSession('sysId');
    const firstSysId = sysIds?.split(',')[0] || '1';
    if (formType === 'add') {
      chooseShow = type;
      sysId = saveInfo.sysId;
    } else if (formType === 'edit') {
      chooseShow = dataPage.type;
      sysId = dataPage.sysId;
    }
    return (
      <>
        <Card bordered={false} className={styles.sysBox}>
          <Icon type="info-circle" /> 单次授权操作仅限一个系统授权
          <div className={styles.hasChooseRoleTileSys}>
            用户归属系统：
            <Radio.Group defaultValue={firstSysId} onChange={this.handleJobChange}>
              {attributionSystem &&
                attributionSystem.map(i => {
                  return (
                    <Radio key={i.name} value={i.code}>
                      {i.name}
                    </Radio>
                  );
                })}
            </Radio.Group>
          </div>
        </Card>
        <Card loading={loading} bordered={false}>
          <div style={{ float: 'left' }}>已选择组件：</div>
          <div className={styles.fLeft}>
            {[]
              .concat(userRole, positions)
              .filter(item => +item.sysId === +sysKey)
              .map((tag, index) => {
                let color = tag.type === '01' ? 'geekblue' : 'green';
                if (`${tag.id}has` === this.state.check) {
                  color = tag.type === '01' ? '#2f54eb' : '#52c41a';
                }

                return (
                  <span key={tag.id}>
                    <Tag
                      style={{
                        fontSize: '14px',
                        marginBottom: '10px',
                      }}
                      key={tag.id}
                      onClick={() => this.tagChange(tag, index, 'has')}
                      color={color}
                    >
                      {tag.name}
                      <Icon
                        onClick={e => {
                          e.stopPropagation();
                          this.closeTage(tag, index);
                        }}
                        type="close"
                      />
                    </Tag>
                  </span>
                );
              })}
          </div>
        </Card>
        {chooseShow === '01' && (
          <Card loading={loading} bordered className={styles.roleAllStyle}>
            <div style={{ float: 'left' }}>授权组件：</div>
            <div
              // style={{ display: tags && tags['01'].length > 7 ? 'block' : 'none' }}
              className={styles.iconShow}
              onClick={() => this.showMore(1)}
            >
              {this.state.show1 ? '收起' : '展开'}
              <Icon type={this.state.show1 ? 'up' : 'down'} />
            </div>
            <div className={styles.addiconShow}>
              {!inputVisible && (
                <Tag onClick={() => this.showInput('01')} style={{ cursor: 'pointer' }}>
                  <Icon type="plus" />
                  授权
                </Tag>
              )}
            </div>
            <div className={this.state.show1 ? styles.fLeft : styles.hideTag}>
              {tags &&
                tags['01'].map((tag, index) => {
                  return (
                    <span key={tag.id}>
                      <Tag
                        key={tag.id}
                        style={{
                          fontSize: '14px',
                          marginBottom: '10px',
                        }}
                        onClose={() => this.closeTage(tag, index)}
                        onClick={() => this.tagChange(tag, index, '')}
                        className={
                          +tag.id === +this.state.check ? styles.checkStyle : styles.unCheckStyle
                        }
                      >
                        <Tooltip title={text}>{tag.name}</Tooltip>
                        <Tooltip title="删除">
                          <Icon
                            onClick={e => this.handleConfirm(tag, firstSysId, '组件', 'role', e,'auth')}
                            type="close"
                          />
                        </Tooltip>
                      </Tag>
                    </span>
                  );
                })}
            </div>
          </Card>
        )}
        <Card loading={getCurrentUserJobLoading}>
          <div style={{ float: 'left' }}>岗位组件：</div>
          <div
            // style={{ display: tags && tags['02'].length > 7 ? 'block' : 'none' }}
            className={styles.iconShow}
            onClick={() => this.showMore(3)}
          >
            {this.state.show3 ? '收起' : '展开'}
            <Icon type={this.state.show3 ? 'up' : 'down'} />
          </div>
          <div className={styles.addiconShow}>
            {!inputVisible && (
              <Tag onClick={this.handleAddJob} style={{ cursor: 'pointer' }}>
                <Icon type="plus" />
                岗位
              </Tag>
            )}
          </div>
          <div className={this.state.show3 ? styles.fLeft : styles.hideTag}>
            {saveCurrentUserJobList &&
              saveCurrentUserJobList.map((tag, index) => {
                return (
                  <span key={tag.id}>
                    <Tag
                      key={tag.id}
                      style={{
                        fontSize: '14px',
                        marginBottom: '10px',
                      }}
                      onClose={() => this.closeTage(tag, index)}
                      onClick={() => this.tagChange(tag, index, '', true)}
                      className={
                        +tag.id === +this.state.check ? styles.checkStyle : styles.unCheckStyle
                      }
                    >
                      <Tooltip title={text}>{tag.name}</Tooltip>
                      <Tooltip title="删除">
                        <Icon
                          onClick={e => this.handleConfirm(tag, firstSysId, '岗位', 'job', e,'post')}
                          type="close"
                        />
                      </Tooltip>
                    </Tag>
                  </span>
                );
              })}
          </div>
        </Card>
        <Card bordered loading={loading} className={styles.roleAllStyle}>
          <div style={{ float: 'left' }}>功能组件：</div>
          <div
            style={{ display: tags && tags['02'].length > 7 ? 'block' : 'none' }}
            className={styles.iconShow}
            onClick={() => this.showMore(2)}
          >
            {this.state.show2 ? '收起' : '展开'}

            <Icon type={this.state.show2 ? 'up' : 'down'} />
          </div>
          <div className={styles.addiconShow}>
            {!inputVisible && (
              <Tag onClick={() => this.showInput('02')} style={{ cursor: 'pointer' }}>
                <Icon type="plus" />
                功能
              </Tag>
            )}
          </div>
          <div className={this.state.show2 ? styles.fLeft : styles.hideTag}>
            {tags &&
              tags['02'].map((tag, index) => {
                return (
                  <span key={tag.id}>
                    <Tag
                      key={tag.id}
                      style={{ fontSize: '14px' }}
                      className={
                        +tag.id === +this.state.check ? styles.checkStyle : styles.unCheckStyle
                      }
                      onClick={() => this.tagChange(tag, index, '')}
                    >
                      <Tooltip title={text}>{tag.name}</Tooltip>
                      <Tooltip title="删除">
                        <Icon
                          onClick={e => this.handleConfirm(tag, firstSysId, '组件', 'role', e,'func')}
                          type="close"
                        />
                      </Tooltip>
                    </Tag>
                  </span>
                );
              })}
          </div>
        </Card>
        <Modal
          width="90%"
          title={jobModify ? `查看/修改岗位` : `新增岗位`}
          visible={saveModalJob}
          okText="提交"
          onOk={this.handleJobSubmit}
          onCancel={this.handleJobFormReset}
        >
          <Form layout="inline">
            <Row
              gutter={{
                md: 8,
                lg: 24,
                xl: 48,
              }}
            >
              <Col md={12} sm={24}>
                <Form.Item label="岗位名称">
                  {getFieldDecorator('name', {
                    rules: [
                      {
                        required: true,
                        message: '请输入岗位名称',
                      },
                    ],
                    initialValue: saveJobInfo.name,
                  })(<Input placeholder="请输入" disabled={jobModify} />)}
                </Form.Item>
              </Col>
              <Col md={12} sm={24}>
                <Form.Item label="岗位描述">
                  {getFieldDecorator('remark', {
                    initialValue: saveJobInfo.remark,
                  })(<Input placeholder="请输入" />)}
                </Form.Item>
              </Col>
            </Row>
          </Form>
          <Card
            title="关联功能组件："
            extra={<div>已选中{this.state.len}个功能组件</div>}
            style={{ marginTop: 40 }}
            loading={addJobLoading}
          >
            {tags &&
              tags['02'].map(i => {
                const jobClassName = classNames(
                  styles.job,
                  saveJobActions?.includes(i.id) ? styles.chooesJob : '',
                );
                return (
                  <span
                    key={i.id}
                    style={{ fontSize: '14px' }}
                    className={jobClassName}
                    onClick={() => this.handleJob(i.id)}
                  >
                    <Tooltip title={i.name}>{i.name}</Tooltip>
                  </span>
                );
              })}
          </Card>
        </Modal>
      </>
    );
  }
}
