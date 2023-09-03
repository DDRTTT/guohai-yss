/**
 *Create by fq
 */

import React, { useEffect, useState } from 'react';
import {
  Button,
  Card,
  Col,
  Divider,
  Dropdown,
  Form,
  Icon,
  Input,
  Menu,
  Modal,
  Radio,
  Row,
  Select,
  Table,
  Tag,
} from 'antd';
import { routerRedux } from 'dva/router';
import { connect } from 'dva';
import styles from './less/index.less';

const { Search } = Input;
const FormItem = Form.Item;
const { CheckableTag } = Tag;
const { confirm } = Modal;

const obj2FormData = (obj, form, namespace) => {
  const formData = form || new FormData();
  const keys = Object.keys(obj);
  for (const key of keys.values()) {
    const val = obj[key];
    if (val) {
      // 对象嵌套
      const formKey = namespace ? `${namespace}[${key}]` : key;

      if (val instanceof Array) {
        //  数组内容
        if (val[0] && val[0] instanceof File) {
          // 文件上传
          for (const f of val.values()) {
            formData.append(formKey, f);
          }
        } else {
          formData.append(formKey, val.join(','));
        }
      } else if (typeof val === 'object') {
        if (val instanceof File) {
          formData.append(formKey, val);
        } else {
          // 递归调用
          obj2FormData(val, formData, formKey);
        }
      } else {
        // 文本内容(不含对象)
        formData.append(formKey, val);
      }
    }
  }

  return formData;
};

const Single = ({
  form,
  dispatch,
  listLoading,
  processTaskManagement: {
    saveGetProcessTaskListFetch,
    saveGetProcessTagListFetch,
    saveGetTemplateFetch,
    saveGetProcessNodeFetch,
    saveGetPrincipalFetch,
    saveGetTaskNodeFetch,
  },
}) => {
  const [seniorType, setSeniorType] = useState(false);

  // 状态
  const [type, setType] = useState(2);
  // 表单控制
  const [len, setLen] = useState(0);
  // 每页数据条数
  const [limit, setLimit] = useState(10);
  // 页码
  const [page, setPage] = useState(1);
  // 行信息
  const [record, setRecord] = useState({});
  // tags控制
  const [selectedTags, setSelectedTags] = useState([]);

  const [selectedTagsLen, setSelectedTagsLen] = useState(0);
  // 任务认领弹框
  const [commissionedModalVisible, setCommissionedModalVisible] = useState(false);
  // 任务移交弹框
  const [handOverModalVisible, setHandOverModalVisible] = useState(false);

  // 任务传阅弹框
  const [circulatedTaskModalVisible, setCirculatedTaskModalVisible] = useState(false);

  // 任务退回弹框
  const [rollbackTaskModalVisible, setRollbackTaskModalVisible] = useState(false);

  // 任务Id - TaskId
  const [claimTask, setClaimTask] = useState();

  const { getFieldDecorator } = form;

  useEffect(() => {
    // if (!authorization()) {
    dispatch({
      type: 'processTaskManagement/handleGetProcessTaskListFetch',
      payload: {
        emergencyState: 2,
        limit: 20,
        page: 1,
        templateIds: [],
        processTags: [],
        nodeIds: [],
      },
    });
    // }
  }, []);

  /**
   * 认领任务
   * @method  handleClaimTask
   */
  const handleClaimTask = () => {
    dispatch({
      type: 'processTaskManagement/handleClaimTaskFetch',
      payload: {
        taskId: claimTask,
      },
    });
  };

  /**
   * 确认认领
   * @method  handleConfirm
   */
  const handleConfirm = () => {
    confirm({
      title: '确定要认领该任务吗?',
      okText: '确定',
      cancelText: '取消',
      onOk() {
        handleClaimTask();
      },
      onCancel() {},
    });
  };

  /**
   * 委托人弹框
   * @method  handleGetPrincipalModal
   */
  const handleGetPrincipalModal = () => {
    setCommissionedModalVisible(true);
    handleGetParticipantList();
  };

  /**
   * 移交人弹框
   * @method  handleHandOverModal
   */
  const handleHandOverModal = () => {
    setHandOverModalVisible(true);
    handleGetParticipantList();
  };

  /**
   * 传阅人弹框
   * @method  handleCirculatedModal
   */
  const handleCirculatedModal = () => {
    setCirculatedTaskModalVisible(true);
    handleGetParticipantList();
  };

  /**
   * 任务退回弹框
   * @method  handleHandOverModal
   */
  const handleRollbackTaskModal = () => {
    setRollbackTaskModalVisible(true);
    handleRollbackTaskList();
  };

  /**
   * 方法说明  获取委托人/移交人/传阅人 list
   * @method  handleGetParticipantList
   */
  const handleGetParticipantList = () => {
    dispatch({
      type: 'processTaskManagement/handleGetParticipantListFetch',
    });
  };

  /**
   * 方法说明  获取节点 list
   * @method  handleRollbackTaskList
   */
  const handleRollbackTaskList = () => {
    dispatch({
      type: 'processTaskManagement/handleGetTaskNodeFetch',
      payload: {
        processDefinitionId: record.processDefinitionId,
        taskDefinitionKey: record.taskDefinitionKey,
      },
    });
  };

  const menu = (
    <Menu>
      <Menu.Item key={1} onClick={handleConfirm}>
        <a href="#">认领</a>
      </Menu.Item>
      <Menu.Item key={2} onClick={handleGetPrincipalModal}>
        <a>委托</a>
      </Menu.Item>
      <Menu.Item key={3} onClick={handleRollbackTaskModal}>
        <a>退回</a>
      </Menu.Item>
      <Menu.Item key={4} onClick={handleHandOverModal}>
        <a>移交</a>
      </Menu.Item>
      <Menu.Item key={5} onClick={handleCirculatedModal}>
        <a>传阅</a>
      </Menu.Item>
    </Menu>
  );

  const columns = [
    // {
    //   title: '序号',
    //   dataIndex: 'name',
    //   key: 'name',
    // },
    {
      title: '流程名称',
      dataIndex: 'processName',
      key: 'processName',
    },
    {
      title: '发起方式',
      dataIndex: 'launchingMode',
      key: 'launchingMode',
    },
    {
      title: '发起时间',
      dataIndex: 'launchingTime',
      key: 'launchingTime',
    },
    {
      title: '任务节点名称',
      dataIndex: 'taskName',
      key: 'taskName',
    },
    {
      title: '到达任务节点',
      dataIndex: 'taskArrivalTime',
      key: 'taskArrivalTime',
    },
    {
      title: '流程状态',
      dataIndex: 'processStatus',
      key: 'processStatus',
      width: 140,
      render: text =>
        text &&
        text.length !== 0 &&
        text.map(item => {
          return item === '正常' ? (
            <div className="success">{item}</div>
          ) : item === '将要超时' ? (
            <div className="warning">{item}</div>
          ) : item === '超时' || item === '催办' ? (
            <div className="error">{item}</div>
          ) : (
            ''
          );
        }),
    },
    {
      title: '任务节点状态',
      dataIndex: 'taskStatus',
      key: 'taskStatus',
      width: 140,
      render: text =>
        text &&
        text.length !== 0 &&
        text.map(item => {
          return item === '正常' ? (
            <div className="success">{item}</div>
          ) : item === '将要超时' ? (
            <div className="warning">{item}</div>
          ) : item === '超时' || item === '催办' ? (
            <div className="error">{item}</div>
          ) : (
            ''
          );
        }),
    },
    {
      title: '操作',
      dataIndex: 'opeator',
      key: 'opeator',
      align: 'right',
      render: (text, record) => (
        <div>
          <a onClick={() => handleTransactJump(record)}>办理</a>
          <Divider type="vertical" />
          <a>流转历史</a>
          <Divider type="vertical" />
          <Dropdown
            overlay={menu}
            trigger={['click']}
            onClick={() => {
              setClaimTask(record.taskId);
              setRecord(record);
            }}
          >
            <a className="ant-dropdown-link" onClick={e => e.preventDefault()}>
              更多 <Icon type="down" />
            </a>
          </Dropdown>
        </div>
      ),
    },
  ];

  // 办理跳转
  const handleTransactJump = record => {
    const { taskId, processInstanceId, taskDefinitionKey } = record;
    dispatch(
      routerRedux.push({
        pathname: `/processCenter/taskDeal?taskId=${taskId}&processinstanceId=${processInstanceId}&taskDefininionKey=${taskDefinitionKey}`,
      }),
    );
  };

  /**
   * 方法说明 循环生成select
   * @method  handleMapList
   * @return {void}
   * @param  {Object[]}       data 数据源
   * @param  {string}         name   select的name
   * @param  {string}         code  select的code
   * @param  {boolean|string} mode  是否可以多选(设置 Select 的模式为多选或标签)
   * @param  {boolean}        fnBoole 选择时函数控制
   * @param  {function}       fn 控制函数
   */
  const handleMapList = (data, name, code, mode = false, fnBoole = false, fn) => {
    if (!data) {
      data = {};
      data.data = [];
    }
    const e = data;
    if (e) {
      const children = [];
      for (const key of e) {
        const keys = key[code];
        const values = key[name];
        children.push(
          <Select.Option key={keys} value={keys}>
            {values}
          </Select.Option>,
        );
      }
      return (
        <Select
          maxTagCount={1}
          mode={mode}
          style={{ width: '100%' }}
          placeholder="请选择"
          optionFilterProp="children"
          onChange={fnBoole ? fn : ''}
        >
          {children}
        </Select>
      );
    }
  };

  /**
   * 模板名称选择
   * @method  handleSelectChange
   * @return {void}
   * @param e {Array}
   */
  const handleSelectChange = e => {
    setLen(e.length);
    form.resetFields('nodeIds');
    if (e.length) {
      dispatch({
        type: 'processTaskManagement/handleGetProcessNodeFetch',
        payload: {
          processDefinitionKeys: e[e.length - 1],
        },
      });
    }
  };

  /**
   * 查询按钮
   * @method  handleGetSearchFetch
   */
  const handleGetSearchFetch = () => {
    form.validateFields((err, values) => {
      if (err) return;
      handleGetTemplateListFetch(
        type,
        limit,
        page,
        values.templateIds,
        values.processTags,
        values.nodeIds,
      );
    });
  };

  /**
   * 重置表单按钮
   * @method  handleFormReset
   */
  const handleFormReset = () => {
    form.resetFields();
    setSelectedTags([]);
  };

  /**
   * tag标签选择
   * @method  handleTagChange
   * @return {void}
   * @param tag {string}
   * @param checked {boolean}
   */
  const handleTagChange = (tag, checked) => {
    setSelectedTagsLen(saveGetProcessTagListFetch.length);
    if (tag === 'all') {
      if (checked) {
        setSelectedTags(saveGetProcessTagListFetch.concat('all'));
        handleSelectedTags(saveGetProcessTagListFetch);
      } else {
        setSelectedTags([]);
        handleSelectedTags([]);
      }
    } else {
      let nextSelectedTags = checked ? [...selectedTags, tag] : selectedTags.filter(t => t !== tag);
      nextSelectedTags = nextSelectedTags.filter(t => t !== 'all');
      setSelectedTags(nextSelectedTags);
      const len = nextSelectedTags.length;
      if (len === selectedTagsLen) {
        setSelectedTags(nextSelectedTags.concat('all'));
        handleSelectedTags(saveGetProcessTagListFetch);
      } else {
        nextSelectedTags = nextSelectedTags.filter(t => t !== 'all');
        setSelectedTags(nextSelectedTags);
        handleSelectedTags(nextSelectedTags);
      }
    }
  };

  /**
   * 流程标签请求
   * @method  handleSelectedTags
   * @return {void}
   * @param nodeIds {string[]} 流程标签
   */
  const handleSelectedTags = nodeIds => {
    form.validateFields((err, values) => {
      if (err) return;
      handleGetTemplateListFetch(
        type,
        limit,
        page,
        values.templateIds,
        values.processTags,
        nodeIds,
      );
    });
  };

  /**
   * 确认委托
   * @method  handleModalOk
   */
  const handleCommissionedModalOk = () => {
    setCommissionedModalVisible(false);
    form.validateFields(['usercode'], (err, values) => {
      const formData = new FormData();
      formData.append('taskId', claimTask);
      formData.append('userId', values.usercode);
      const obj = {
        taskId: claimTask,
        userId: values.usercode,
      };
      if (err) return;
      dispatch({
        type: 'processTaskManagement/handleDetermineDelegateFetch',
        payload: obj2FormData(obj),
      });
    });
  };

  /**
   * 确认移交
   * @method  handleHandOverModalOk
   */
  const handleHandOverModalOk = () => {
    setHandOverModalVisible(false);
    form.validateFields(['usercode'], (err, values) => {
      const formData = new FormData();
      formData.append('taskId', claimTask);
      formData.append('transferUserId', values.usercode);
      if (err) return;
      dispatch({
        type: 'processTaskManagement/handleHandOverFetch',
        payload: formData,
      });
    });
  };

  /**
   * 确认回退
   * @method  handleRollbackTaskModalOk
   */
  const handleRollbackTaskModalOk = () => {
    setRollbackTaskModalVisible(false);
    form.validateFields(['usercode'], (err, values) => {
      const formData = new FormData();
      formData.append('taskId', record.taskId);
      formData.append('activityId', values.activityId);
      if (err) return;
      dispatch({
        type: 'processTaskManagement/handleRollbackTaskFetch',
        payload: formData,
      });
    });
  };

  /**
   * 确认传阅
   * @method  handleCirculatedTaskModalOk
   */
  const handleCirculatedTaskModalOk = () => {
    setCirculatedTaskModalVisible(false);
    form.validateFields(['circulateUser'], (err, values) => {
      if (err) return;
      dispatch({
        type: 'processTaskManagement/handleCirculatedTaskFetch',
        payload: {
          circulateUser: values.circulateUser,
          ...record,
        },
      });
    });
  };

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

  // 高级搜索表单创建
  const seniorSearchForm = () => {
    return (
      <Form>
        <Row
          gutter={{
            md: 8,
            lg: 24,
            xl: 48,
          }}
        >
          <Col md={8} sm={24}>
            <FormItem label="模板名称">
              {getFieldDecorator('templateIds')(
                handleMapList(
                  saveGetTemplateFetch,
                  'processName',
                  'id',
                  'multiple',
                  true,
                  handleSelectChange,
                ),
              )}
            </FormItem>
          </Col>
          {len === 1 || len === 0 ? (
            <Col md={8} sm={24}>
              <FormItem label="流程节点">
                {getFieldDecorator('nodeIds')(
                  handleMapList(saveGetProcessNodeFetch, 'nodeName', 'nodeId', 'multiple'),
                )}
              </FormItem>
            </Col>
          ) : (
            ''
          )}

          <Col md={24} sm={24}>
            <FormItem label="流程标签">
              {getFieldDecorator('processTags')(
                <div>
                  <CheckableTag
                    key="all"
                    checked={selectedTags.indexOf('all') > -1}
                    onChange={checked => handleTagChange('all', checked)}
                  >
                    全部
                  </CheckableTag>
                  {saveGetProcessTagListFetch.map(item => {
                    // return <MyTag key={index}>{item}</MyTag>;
                    return (
                      <CheckableTag
                        key={item}
                        checked={selectedTags.indexOf(item) > -1}
                        onChange={checked => handleTagChange(item, checked)}
                      >
                        {item}
                      </CheckableTag>
                    );
                  })}
                </div>,
              )}
            </FormItem>
          </Col>
        </Row>
        <div style={{ textAlign: 'right' }}>
          <span className="submitButtons" style={{ marginRight: 10 }}>
            <Button
              htmlType="submit"
              type="primary"
              style={{
                marginRight: '10px',
                height: 28,
              }}
              onClick={handleGetSearchFetch}
            >
              查询
            </Button>
            <Button style={{ height: 28 }} onClick={handleFormReset}>
              重置
            </Button>
          </span>
          <span className={styles.searchLabel} onClick={() => setSeniorType()}>
            收起
            <Icon type="up" />
          </span>
        </div>
      </Form>
    );
  };

  /**
   * 类型改变时请求
   * @method  handleTypeChange
   * @param   {string|number} e  紧急 2 一般 1 待阅 '0' 全部 0
   * @return  {void}
   */
  const handleTypeChange = e => {
    const { value } = e.target;
    setType(value);
    setPage(1);
    form.validateFields((err, values) => {
      if (err) return;
      handleGetTemplateListFetch(
        value,
        limit,
        page,
        values.values,
        values.nodeIds,
        values.processTags,
      );
    });
  };

  /**
   * 方法说明 列表（搜索）
   * @method  handleGetTemplateListFetch
   * @return {Object}
   * @param emergencyState {string|number} 状态
   * @param limit {number} 每页数据条数
   * @param page {number} 页码
   * @param templateIds {Array} 模板名称id
   * @param processTags {Array} 流程节点id
   * @param nodeIds {Array} 流程标签id
   */
  const handleGetTemplateListFetch = (
    emergencyState = 1,
    limit = 10,
    page = 1,
    templateIds = [],
    processTags = [],
    nodeIds = [],
  ) => {
    dispatch({
      type: 'processTaskManagement/handleGetProcessTaskListFetch',
      payload: {
        emergencyState,
        limit,
        page,
        templateIds,
        processTags,
        nodeIds,
      },
    });
  };

  const paginationProps = {
    showSizeChanger: true,
    showQuickJumper: true,
    current: page,
    total: saveGetProcessTaskListFetch.total,
    showTotal: total => `共 ${total} 条数据`,
  };

  /**
   * 分页
   * @method  handlePaginationChange
   */
  const handlePaginationChange = pagination => {
    form.validateFields((err, values) => {
      if (err) return;
      setLimit(pagination.pageSize);
      setPage(pagination.current);
      handleGetTemplateListFetch(
        type,
        pagination.pageSize,
        pagination.current,
        values.values,
        values.nodeIds,
        values.processTags,
      );
    });
  };

  return (
    <Form {...formItemLayout}>
      <div className={styles.list}>
        <Card
          style={{
            marginBottom: 20,
            paddingTop: 20,
            paddingBottom: 20,
          }}
        >
          <Row
            gutter={{
              md: 8,
              lg: 24,
              xl: 48,
            }}
          >
            <Col md={12} sm={24} />
            <Col md={12} sm={24}>
              <div className={styles.seniorsearch} style={{ display: seniorType ? 'none' : '' }}>
                <Search
                  placeholder="请输入公告主题"
                  onSearch={value => this.blurSearch(value)}
                  style={{
                    width: 242,
                    marginRight: 20,
                    height: 32,
                  }}
                />
                <span className={styles.searchLabel} onClick={() => setSeniorType(true)}>
                  高级搜索
                  <Icon type="down" />
                </span>
              </div>
            </Col>
            <Col
              md={24}
              sm={24}
              style={{ display: seniorType ? '' : 'none' }}
              className={styles.searchForm}
            >
              {seniorSearchForm()}
            </Col>
          </Row>
        </Card>
      </div>
      <Card>
        <FormItem>
          {getFieldDecorator('emergencyState', {
            initialValue: type,
          })(
            <Radio.Group onChange={e => handleTypeChange(e)}>
              <Radio.Button value={2}>紧急</Radio.Button>
              <Radio.Button value={1}>一般</Radio.Button>
              <Radio.Button value="0">待阅</Radio.Button>
              <Radio.Button value={0}>全部</Radio.Button>
            </Radio.Group>,
          )}
        </FormItem>
        <Table
          loading={listLoading}
          dataSource={saveGetProcessTaskListFetch.rows}
          columns={columns}
          pagination={paginationProps}
          onChange={handlePaginationChange}
        />
        <Modal
          title="任务委托"
          visible={commissionedModalVisible}
          onOk={handleCommissionedModalOk}
          onCancel={() => setCommissionedModalVisible(false)}
        >
          <FormItem label="请选择委托人">
            {getFieldDecorator('usercode')(
              handleMapList(saveGetPrincipalFetch, 'username', 'usercode', false),
            )}
          </FormItem>
        </Modal>

        <Modal
          title="任务移交"
          visible={handOverModalVisible}
          onOk={handleHandOverModalOk}
          onCancel={() => setHandOverModalVisible(false)}
        >
          <FormItem label="请选择移交人">
            {getFieldDecorator('usercode')(
              handleMapList(saveGetPrincipalFetch, 'username', 'usercode', false),
            )}
          </FormItem>
        </Modal>

        <Modal
          title="任务退回"
          visible={rollbackTaskModalVisible}
          onOk={handleRollbackTaskModalOk}
          onCancel={() => setRollbackTaskModalVisible(false)}
        >
          <FormItem label="请选择退回节点">
            {getFieldDecorator('activityId')(
              handleMapList(saveGetTaskNodeFetch, 'nodeName', 'nodeId', false),
            )}
          </FormItem>
        </Modal>

        <Modal
          title="任务传阅"
          visible={circulatedTaskModalVisible}
          onOk={handleCirculatedTaskModalOk}
          onCancel={() => setCirculatedTaskModalVisible(false)}
        >
          <FormItem label="请选择传阅人">
            {getFieldDecorator('circulateUser')(
              handleMapList(saveGetPrincipalFetch, 'username', 'usercode', false),
            )}
          </FormItem>
        </Modal>
      </Card>
    </Form>
  );
};

const WrappedSingleForm = Form.create()(
  connect(({ processTaskManagement, loading }) => ({
    processTaskManagement,
    listLoading: loading.effects['processTaskManagement/handleGetProcessTaskListFetch'],
  }))(Single),
);

export default WrappedSingleForm;
