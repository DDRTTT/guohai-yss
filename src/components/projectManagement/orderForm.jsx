/**
 * 项目任务发起(开发时改成相应的菜单名)
 * Create on 2020/9/14.
 */
import React, { Component } from 'react';
import { Form, Input, Button, DatePicker, Select, message, Breadcrumb } from 'antd';
import moment from 'moment';
import 'moment/locale/zh-cn';
import { connect } from 'dva';
import { errorBoundary } from '@/layouts/ErrorBoundary';
import Action, { linkHoc } from '@/utils/hocUtil';
import router from 'umi/router';
import { routerRedux } from 'dva/router';
import style from './index.less';

const { TextArea } = Input;
const { Option } = Select;
let saveFlag = false;

@Form.create()
class Index extends Component {
  state = {
    seriesType: '',
    proCode: '',
    proName: '',
    proShortName: '',
    proPhase: '',
    proType: '',
    taskType: '',
    executor: '',
    cPerson: '',
    proDesc: '',
    dutContent: '',
    attention: '',
    overReason: '',
    otherProType: '',
    proArea: '',
    overseasProArea: '',
    proDept: '',
    proCDate: '',
    proBusType: '',
    biddingFlag: '',
    taskDuration: '',
    dutStaDate: moment().format('YYYY-MM-DD'),
    dutEndDate: '',
    dutOverDate: '',
    taskTypeCode: [],
    // backDoc: '',
    priority: '',
    taskName: [],
    showBack: 2,
    saveLoading: false,
    updateLoading: false,
    proNameList: [],
  };

  componentDidMount() {
    const { dispatch, queryDate } = this.props;
    const type = queryDate ? queryDate.product.type : 0;
    dispatch({
      type: 'taskManagement/getCode',
      payload: {
        type,
      },
    });
    dispatch({
      type: 'taskManagement/getproName',
      payload: {
        type: 0,
      },
    }).then(res => {
      if (res && res.status === 200) {
        this.setState({
          proNameList: res.data,
        });
      }
    });
  }

  componentWillReceiveProps(nextProps, nextContext) {
    const {
      taskManagement: { proType, proArea },
    } = this.props;

    if (nextProps.queryDate) {
      const list = nextProps.queryDate;
      const children = nextProps.queryDate.product;
      const proAreaName =
        proArea &&
        proArea.filter(n => {
          return n.code === children.proArea;
        })[0];
      const proTypeName =
        proType &&
        proType.filter(n => {
          return n.code === children.proType;
        })[0];
      this.setState(
        {
          seriesType: list.product.type,
          proName: children.proName,
          proPhase:
            list.product.type === 0 && list.projectState === 'state5'
              ? '终止阶段'
              : list.projectState,
          executor: list.taskName,
          taskType: list.taskType,
          showBack: list.taskType === 'customize' ? 1 : 2,
          dutStaDate: list.startTime,
          dutEndDate: list.endTime,
          taskDuration: list.continueTime,
          dutContent: list.taskCovers,
          priority: list.priority === 0 ? '0' : list.priority ? `${list.priority}` : '',
          attention: list.note,
          // backDoc: list.archive,
          proCode: children.proCode,
          proShortName: children.proShortName,
          proType: proTypeName && proTypeName.name,
          otherProType: children.otherProType,
          proArea: proAreaName && proAreaName.name,
          overseasProArea: children.overseasProArea,
          proDept: children.proDept,
          proCDate: children.proCDate,
          proDesc: children.proDesc,
          proBusType: children.proBusType
            ? children.proBusType === '0'
              ? '非管理人项目'
              : '管理人项目'
            : '',
          biddingFlag: children.biddingFlag ? '是' : children.biddingFlag === 0 ? '否' : '',
        },
        () => {
          if (this.state.taskType === 'conventional' && this.state.proPhase) {
            this.getTaskName('conventional');
          }
        },
      );
    }
  }

  handleChangeInput = (event, name) => {
    const value = {};
    value[name] = event.target.value;
    this.setState(value);
  };

  // 日期选择框
  dataPick = (date, dateString, name) => {
    if (!dateString) {
      this.setState({
        taskDuration: '',
        [name]: '',
      });
      return;
    } else {
      this.setState(
        {
          [name]: dateString,
        },
        () => {
          const { dutStaDate, dutEndDate } = this.state;

          if ((name === 'dutStaDate' && dutEndDate) || (name === 'dutEndDate' && dutStaDate)) {
            if (moment(dutStaDate) > moment(dutEndDate)) {
              this.setState({
                [name]: '',
              });
              return message.warning('截止日期需大于开始日期');
            } else {
              this.setState({
                taskDuration: `${moment(dutEndDate, 'YYYY-MM-DD').diff(
                  moment(dutStaDate, 'YYYY-MM-DD'),
                  'days',
                ) + 1}天`,
              });
            }
          }
        },
      );
    }
  };

  // 返回上一页
  handleBackPage = () => {
    const {
      dispatch,
      router: {
        location: {
          query: { radioType },
        },
      },
    } = this.props;
    this.props.dispatch(
      routerRedux.push({
        pathname: '/projectManagement/archiveTaskHandleList/index',
        query: {
          radioType: this.props.router.location.query.radioType,
        },
      }),
    );
  };

  // 数据的保存和提交
  onSave = item => {
    const { queryDate, id, dispatch } = this.props;
    const {
      seriesType,
      proName,
      proCode,
      proPhase,
      executor,
      taskType,
      dutStaDate,
      dutEndDate,
      taskDuration,
      dutContent,
      priority,
      attention,
      // backDoc,
    } = this.state;

    if (seriesType === '') {
      message.warning('请选择对象类型');
    } else if (proName == '') {
      message.warning('请选择项目名称');
    } else if (proPhase == '') {
      message.warning('请选择项目阶段');
    } else if (taskType == '') {
      message.warning('请选择任务类型');
    } else if (executor == '') {
      message.warning('请选择任务名称');
    } else if (dutContent == '') {
      message.warning('请输入任务内容');
    }
    //  else if (backDoc === '') {
    //   message.warning('请选择是否生成归档任务');
    // }
    else if (priority === '') {
      message.warning('请选择优先级');
    } else {
      if (saveFlag) return;
      saveFlag = true;
      if (item === '保存') {
        this.setState({
          saveLoading: true,
        });
        dispatch({
          type: 'taskManagement/save',
          payload: {
            id,
            proCode,
            projectState: proPhase === '终止阶段' ? 'state5' : proPhase,
            taskName: executor,
            taskType,
            startTime: dutStaDate,
            endTime: dutEndDate,
            continueTime: taskDuration,
            taskCovers: dutContent,
            priority,
            note: attention,
            // archive: backDoc,
          },
          callback: res => {
            saveFlag = false;
            this.setState({
              saveLoading: false,
            });
            if (res.status === 200) {
              message.success('保存成功!');
              this.handleBackPage();
            } else if (res.message) {
              message.error(res.message);
            } else {
              message.error('服务器发生未知错误!');
            }
          },
        });
      } else if (item === '提交') {
        this.setState({
          updateLoading: true,
        });
        dispatch({
          type: 'taskManagement/submit',
          payload: {
            id,
            proCode,
            projectState: proPhase === '终止阶段' ? 'state5' : proPhase,
            taskName: executor,
            taskType,
            startTime: dutStaDate,
            endTime: dutEndDate,
            continueTime: taskDuration,
            taskCovers: dutContent,
            priority,
            note: attention,
            // archive: backDoc,
          },
          callback: res => {
            saveFlag = false;
            this.setState({
              updateLoading: false,
            });
            if (res.status === 200) {
              message.success('提交成功!');
              this.handleBackPage();
            } else if (res.message) {
              message.error(res.message);
            } else {
              message.error('服务器发生未知错误!');
            }
          },
        });
      }
    }
  };

  handleSelect = (event, name) => {
    const { taskManagement, dispatch } = this.props;
    if (name === 'proName') {
      dispatch({
        type: 'taskManagement/getDate',
        payload: event,
        callback: res => {
          const proAreaName =
            taskManagement.proArea &&
            taskManagement.proArea.filter(n => {
              return n.code === res.proArea;
            })[0];
          const proTypeName =
            taskManagement.proType &&
            taskManagement.proType.filter(n => {
              return n.code === res.proType;
            })[0];
          this.setState({
            proPhase: res.projectState,
            proCode: res.proCode,
            proShortName: res.proShortName,
            proType: proTypeName && proTypeName.name,
            otherProType: res.otherProType,
            proArea: proAreaName && proAreaName.name,
            overseasProArea: res.overseasProArea,
            proDept: res.proDept,
            proCDate: res.proCDate,
            proDesc: res.proDesc,
            proBusType: res.proBusType
              ? res.proBusType === '0'
                ? '非管理人项目'
                : '管理人项目'
              : '',
            biddingFlag: res.biddingFlag ? '是' : res.biddingFlag === 0 ? '否' : '',
          });
        },
      });
    }
    if (name === 'seriesType') {
      this.setState(
        {
          proNameList: [],
          proName: '',
          proCode: '',
          proShortName: '',
          proType: '',
          proArea: '',
          proDept: '',
          proCDate: '',
          proDesc: '',
          proBusType: '',
          biddingFlag: '',
        },
        () => {
          dispatch({
            type: 'taskManagement/getproName',
            payload: {
              type: event,
            },
          }).then(res => {
            if (res.status === 200) {
              this.setState({
                proNameList: res.data,
              });
            }
          });
          if (!(this.state.proPhase === 'state1' || this.state.proPhase === 'state2')) {
            this.setState({
              proPhase: '',
            });
          }
        },
      );
    }
    if (name === 'taskType') {
      this.setState({
        executor: '',
      });
      if (event === 'customize') {
        this.setState({
          // taskName: [],
          showBack: 1,
          // backDoc: '',
        });
      } else if (event === 'conventional') {
        if (this.state.proPhase) {
          this.getTaskName('conventional');
        }
        this.setState({
          showBack: 0,
        });
      }
    }
    if (name === 'proPhase') {
      this.setState(
        {
          // taskType: '',
          executor: '',
          [name]: event,
        },
        () => {
          if (this.state.taskType === 'conventional') {
            this.getTaskName('conventional');
          }
        },
      );
    }
    this.setState({
      [name]: event,
    });
  };

  getTaskName(type) {
    const { proPhase } = this.state;
    let payload = '';
    if (type === 'conventional') {
      if (proPhase === 'state1') {
        payload = 'awp_task_name1';
      } else if (proPhase === 'state2') {
        payload = 'awp_task_name2';
      } else if (proPhase === 'state3') {
        payload = 'awp_task_name3';
      } else if (proPhase === 'state4') {
        payload = 'awp_task_name4';
      } else if (proPhase === 'state5') {
        payload = 'awp_task_name5';
      } else if (proPhase === 'state6') {
        payload = 'awp_task_name6';
      } else if (proPhase === 'state7') {
        payload = 'awp_task_name7';
      }
    }
    this.setState(
      {
        taskName: [],
      },
      () => {
        this.props.dispatch({
          type: 'taskManagement/getTaskName',
          payload,
          callback: res => {
            this.setState({
              taskName: res,
              // showBack: type === 'conventional' ? 0 : 2,
              // backDoc: type === 'conventional' ? '' : 1,
            });
          },
        });
      },
    );
  }

  renderProStageOption() {
    const { taskManagement, dis } = this.props;
    const { proPhase } = this.state;
    if (this.state.seriesType === 1) {
      return (
        <Select
          disabled={dis}
          style={{ width: '75%' }}
          value={proPhase ? proPhase : undefined}
          placeholder="请选择"
          onChange={event => {
            this.handleSelect(event, 'proPhase');
          }}
        >
          {taskManagement.proStage &&
            taskManagement.proStage.map(item => {
              return (
                <Option key={item.code} value={item.code}>
                  {item.name}
                </Option>
              );
            })}
        </Select>
      );
    }
    return (
      <Select
        disabled={dis}
        style={{ width: '75%' }}
        value={proPhase ? proPhase : undefined}
        placeholder="请选择"
        onChange={event => {
          this.handleSelect(event, 'proPhase');
        }}
      >
        <Option key="state1" value="state1">
          立项阶段
        </Option>
        <Option key="state2" value="state2">
          申报阶段
        </Option>
        <Option
          style={{ display: proPhase == 'state5' ? 'inline-block' : 'none' }}
          key={'state5'}
          value={'state5'}
        >
          终止阶段
        </Option>
        <Option
          style={{ display: proPhase == 'state4' ? 'inline-block' : 'none' }}
          key={'state4'}
          value={'state4'}
        >
          存续阶段
        </Option>
      </Select>
    );
  }

  render() {
    const {
      // taskManagement,
      taskManagement: { taskTypeCode = [] },
      dis,
      queryDate,
      type,
      id,
    } = this.props;
    const pageType = Number(type);
    const {
      seriesType,
      proName,
      proCode,
      proShortName,
      priority,
      proType,
      showBack,
      otherProType,
      proArea,
      overseasProArea,
      proDept,
      proCDate,
      proBusType,
      biddingFlag,
      taskDuration,
      proDesc,
      dutContent,
      attention,
      overReason,
      taskName,
      dutStaDate,
      dutEndDate,
      // backDoc,
      proPhase,
      executor,
      saveLoading,
      updateLoading,
      proNameList,
    } = this.state;
    let taskType = this.state.taskType;
    taskType = taskType === 'archive' ? '文件更新任务' : taskType;
    const TaskTypeCode = taskTypeCode.filter(
      item => item.name !== '文件更新任务' && item.name !== '物理文档归档入库',
    );

    return (
      <div>
        <div className={style.top}>
          <Breadcrumb>
            <Breadcrumb.Item>
              <span>项目任务管理</span>
            </Breadcrumb.Item>
            <Breadcrumb.Item>
              <span>{pageType === 1 ? '修改' : pageType === 0 ? '详情' : '发起'}</span>
            </Breadcrumb.Item>
          </Breadcrumb>
          <div className={style.topBtn}>
            <Action code="archiveTaskHandleList:initiateTask">
              <Button
                className={style.save}
                style={{ display: dis ? 'none' : 'inline-block' }}
                onClick={() => this.onSave('保存')}
                loading={saveLoading}
              >
                保存
              </Button>
            </Action>
            <Action code="archiveTaskHandleList:updatecommit">
              <Button
                className={style.commit}
                style={{
                  display: dis || pageType === 1 ? 'none' : 'inline-block',
                }}
                onClick={() => this.onSave('提交')}
                loading={updateLoading}
              >
                提交
              </Button>
            </Action>
            <Button onClick={this.handleBackPage}>取消</Button>
          </div>
        </div>
        <div
          style={{
            height: 'calc(100vh - 172px)',
            overflowY: 'auto',
            padding: '2rem 1rem',
            background: '#fff',
          }}
        >
          <span style={{ fontWeight: 'bold' }}>指定任务发起目标</span>
          <div className={style.list}>
            <div style={{ display: 'flex', width: '30%' }}>
              <div style={{ width: '32%' }}>
                <span style={{ color: 'red' }}>*</span> 对象类型：
              </div>
              <Select
                style={{ width: '75%' }}
                value={seriesType ? seriesType : seriesType === 0 ? 0 : undefined}
                optionFilterProp="children"
                disabled={id ? true : dis}
                onChange={event => this.handleSelect(event, 'seriesType')}
                placeholder="请选择"
                showSearch
              >
                <Option key={0} value={0}>
                  系列
                </Option>
                <Option key={1} value={1}>
                  项目
                </Option>
              </Select>
            </div>
          </div>
          <span style={{ fontWeight: 'bold' }}>项目/系列信息</span>
          <div className={style.list}>
            <div style={{ display: 'flex', width: '30%', alignItems: 'center' }}>
              <div style={{ width: '30%' }}>
                <span style={{ color: 'red' }}>*</span> {seriesType ? '项目名称：' : '系列名称：'}
              </div>
              <Select
                style={{ width: '100%', maxWidth: '70%' }}
                value={proName ? proName : undefined}
                optionFilterProp="children"
                disabled={id ? true : dis}
                placeholder="请选择"
                onChange={event => {
                  this.handleSelect(event, 'proName');
                }}
                filterOption={(input, option) =>
                  option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
                showSearch
              >
                {proNameList &&
                  proNameList.map(item => {
                    return (
                      <Option key={item.code} value={item.code}>
                        {item.name}
                      </Option>
                    );
                  })}
              </Select>
            </div>
            <div style={{ display: 'flex', width: '30%', alignItems: 'center' }}>
              <div style={{ width: '44%' }}>{seriesType ? '项目编码：' : '系列编码：'}</div>
              <Input disabled value={proCode} name="proCode" />
            </div>
            {seriesType ? (
              <div style={{ display: 'flex', width: '30%', alignItems: 'center' }}>
                <div style={{ width: '44%' }}>项目简称：</div>
                <Input disabled value={proShortName} name="proShortName" />
              </div>
            ) : (
              <div style={{ display: 'flex', width: '30%' }} />
            )}
          </div>
          <div className={style.list}>
            <div style={{ display: 'flex', alignItems: 'center', width: '30%' }}>
              <div style={{ width: '44%' }}>项目类型：</div>
              <Input disabled value={proType} name="proType" />
            </div>
            {proType === '3007' ? (
              <div style={{ display: 'flex', width: '30%', alignItems: 'center' }}>
                <div style={{ width: '44%' }}>其它项目类型：</div>
                <Input disabled value={otherProType} name="otherProType" />
              </div>
            ) : null}
            <div style={{ display: 'flex', width: '30%' }}>
              <div style={{ width: '44%', display: 'flex', alignItems: 'center' }}>项目区域：</div>
              <Input disabled value={proArea} name="proArea" />
            </div>
            <div style={{ display: proType === '3007' ? 'none' : 'inline-block', width: '30%' }} />
          </div>
          <div className={style.list}>
            {proArea === '境外' ? (
              <div style={{ display: 'flex', width: '30%' }}>
                <div style={{ width: '44%', display: 'flex', alignItems: 'center' }}>
                  境外区域名称：
                </div>
                <Input disabled value={overseasProArea} name="overseasProArea" />
              </div>
            ) : null}
            <div
              style={{
                display: 'flex',
                width: '30%',
              }}
            >
              <div style={{ width: '44%', display: 'flex', alignItems: 'center' }}>所属部门：</div>
              <Input disabled value={proDept} name="proDept" />
            </div>
            {seriesType ? (
              <div style={{ display: 'flex', width: '30%' }}>
                <div style={{ width: '44%', display: 'flex', alignItems: 'center' }}>
                  开始日期：
                </div>
                <Input disabled value={proCDate} name="proCDate" />
              </div>
            ) : (
              <div style={{ display: 'flex', width: '30%' }} />
            )}
            <div style={{ display: proArea !== '境外' ? 'inline-block' : 'none', width: '30%' }} />
          </div>
          {seriesType ? (
            <>
              <div className={style.row}>
                <div>项目描述：</div>
                <TextArea disabled rows={4} value={proDesc} name="proDesc" />
              </div>
              <div className={style.list}>
                <div style={{ display: 'flex', width: '30%' }}>
                  <div style={{ width: '44%', display: 'flex', alignItems: 'center' }}>
                    项目分类：
                  </div>
                  <Input disabled value={proBusType} name="proBusType" />
                </div>
                <div style={{ display: 'flex', width: '30%' }}>
                  <div style={{ width: '44%', display: 'flex', alignItems: 'center' }}>
                    是否招投标：
                  </div>
                  <Input disabled value={biddingFlag} name="biddingFlag" />
                </div>
                <div style={{ display: 'flex', width: '30%' }} />
                {/* <div style={{ display: 'flex', width: '30%' }}>
                  <div style={{width:'44%',display:'flex',alignItems:'center'}}>其他项目类型：</div>
                  <Input disabled value={otherProType2} name={'otherProType2'} onChange={(event) => {
                   this.handleChangeInput(event, 'otherProType2')
                  }}/>
                </div> */}
              </div>
            </>
          ) : (
            ''
          )}
          <span style={{ display: 'block', fontWeight: 'bold', paddingTop: 20 }}>任务信息</span>
          <div className={style.list}>
            <div style={{ display: 'flex', width: '30%' }}>
              <div style={{ width: '32%' }}>
                <span style={{ color: 'red' }}>*</span> 项目阶段：
              </div>
              {this.renderProStageOption()}
            </div>
            <div style={{ display: 'flex', width: '30%' }}>
              <div style={{ width: '32%' }}>
                <span style={{ color: 'red' }}>*</span> 任务类型：
              </div>
              <Select
                disabled={dis}
                style={{ width: '75%' }}
                placeholder="请选择"
                value={taskType ? taskType : undefined}
                onChange={event => {
                  this.handleSelect(event, 'taskType');
                }}
                filterOption={(input, option) =>
                  option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
                showSearch
              >
                {TaskTypeCode &&
                  TaskTypeCode.map(item => {
                    return (
                      <Option key={item.code} value={item.code}>
                        {item.name}
                      </Option>
                    );
                  })}
              </Select>
            </div>
            <div style={{ display: 'flex', width: '30%' }}>
              <div style={{ width: '32%' }}>
                <span style={{ color: 'red' }}>*</span> 任务名称：
              </div>
              {this.state.showBack === 1 ? (
                <Input
                  disabled={dis}
                  style={{ width: '76%' }}
                  placeholder="请输入"
                  value={executor}
                  name="executor"
                  maxLength={50}
                  onChange={event => {
                    this.handleChangeInput(event, 'executor');
                  }}
                />
              ) : (
                <Select
                  disabled={dis}
                  placeholder="请选择"
                  value={executor ? executor : undefined}
                  style={{ width: '75%' }}
                  onChange={event => {
                    this.handleSelect(event, 'executor');
                  }}
                  filterOption={(input, option) =>
                    option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                  showSearch
                >
                  {taskName &&
                    taskName.map(item => {
                      return <Option value={item.name}>{item.name}</Option>;
                    })}
                </Select>
              )}
            </div>
          </div>
          <div className={style.list}>
            <div style={{ display: 'flex', width: '30%' }}>
              <div style={{ width: '32%' }}> &nbsp;开始日期：</div>
              <DatePicker
                disabled={dis}
                value={
                  dutStaDate ? moment(dutStaDate, 'YYYY-MM-DD') : moment(moment(), 'YYYY-MM-DD')
                }
                style={{ width: '75%' }}
                placeholder={dis ? '' : '请选择'}
                onChange={(date, dateString) => {
                  this.dataPick(date, dateString, 'dutStaDate');
                }}
              />
            </div>
            <div style={{ display: 'flex', width: '30%' }}>
              <div style={{ width: '32%' }}> &nbsp;截止日期：</div>
              <DatePicker
                disabled={dis}
                placeholder={dis ? '' : '请选择'}
                value={dutEndDate ? moment(dutEndDate, 'YYYY-MM-DD') : dutEndDate}
                style={{ width: '75%' }}
                onChange={(event, dateString) => {
                  this.dataPick(event, dateString, 'dutEndDate');
                }}
              />
            </div>
            <div style={{ display: 'flex', width: '30%' }}>
              <div style={{ width: '44%', display: 'flex', alignItems: 'center' }}>
                任务持续时间：
              </div>
              <Input disabled value={taskDuration} name="taskDuration" />
            </div>
          </div>
          <div className={style.row}>
            <div>
              <span style={{ color: 'red' }}>*</span>任务内容：
            </div>
            <TextArea
              disabled={dis}
              rows={4}
              maxLength={500}
              placeholder="请输入500字以内内容..."
              value={dutContent}
              name="dutContent"
              onChange={event => {
                this.handleChangeInput(event, 'dutContent');
              }}
            />
          </div>

          {/* <div style={{ display: 'flex', marginTop: '1rem' }}>
            <div style={{ width: '9%' }}>
              <span style={{ color: 'red' }}>*</span>是否生成归档任务：
            </div>
            <Select
              disabled={dis ? true : taskType === 'automatic' ? true : false}
              style={{ width: '30%' }}
              value={taskType === 'automatic' ? 1 : backDoc}
              onChange={event => {
                this.handleSelect(event, 'backDoc');
              }}
            >
              <Option value={1}>是</Option>
              <Option value={0}>否</Option>
            </Select>
          </div> */}
          <div style={{ display: 'flex', marginTop: '1rem' }}>
            <div style={{ width: '9%' }}>
              <span style={{ color: 'red' }}>*</span>优先级：
            </div>
            <Select
              disabled={dis}
              style={{ width: '21%' }}
              placeholder="请选择"
              value={priority ? priority : undefined}
              onChange={event => {
                this.handleSelect(event, 'priority');
              }}
            >
              <Option key={2} value="2">
                高
              </Option>
              <Option key={1} value="1">
                中
              </Option>
              <Option key={0} value="0">
                低
              </Option>
            </Select>
          </div>
          <div className={style.row}>
            <div>注意事项：</div>
            <TextArea
              disabled={dis}
              rows={4}
              maxLength={500}
              placeholder={dis ? '' : '请输入500字以内内容...'}
              value={attention}
              name="attention"
              onChange={event => {
                this.handleChangeInput(event, 'attention');
              }}
            />
          </div>
        </div>
      </div>
    );
  }
}

const WrappedIndex = errorBoundary(
  Form.create()(
    connect(({ taskManagement, router }) => ({
      taskManagement,
      router,
    }))(Index),
  ),
);

export default WrappedIndex;
