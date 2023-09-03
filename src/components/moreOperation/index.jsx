import React, { useState } from 'react';
import { connect } from 'dva';
import { Menu, Dropdown, Icon, Modal, Form, Select, Button, message } from 'antd';
import { errorBoundary } from '@/layouts/ErrorBoundary';

const { Option } = Select;
/**
 * 方法说明 Index
 * @method  {}
 * @param   {Object} record  当前列
 * @param   {Object} opertations  tabs和提交状态的对象
 * @param   {Function} fn  列表请求函数
 * @param   {Function} dispatch
 * @param   {Function} form
 * @param   {String} type , 默认值是more 更多,可选值为batch 批量按钮
 * @param   {Array} batchList , 批量选中的数据的数组
 * @param   {Function} submitCallback , 提交成功的回调
 * @param   {Function} successCallback , 接口调用成功的回调
 * @param   {Object} batchStyles , 批量按钮的样式
 */
const Index = ({
  record = {},
  opertations = {},
  fn,
  dispatch,
  form: { getFieldDecorator, validateFields },
  moreOperation: { saveList, skipList },
  type = 'more',
  batchList,
  submitCallback,
  successCallback,
  isHideSkip,
  batchStyles = { float: 'left', marginTop: '-48px', marginLeft: '10px' },
}) => {
  const [visible, setVisible] = useState(false);
  const [title, setTitle] = useState(10);
  const [placeholder, setPlaceholder] = useState(10);
  const [item, setItem] = useState({});
  const { operationAuthority, taskId, processDefinitionId, taskDefinitionKey } = record;
  const { tabs, status, statusKey } = opertations;

  const actionList = [
    {
      name: '认领',
      action: 'claim',
      effects: 'handleDealClaim',
      batchEffects: 'handlerBatchTaskClaim',
    },
    {
      name: '委托',
      action: 'delegation',
      effects: 'handleDealDelegation',
      batchEffects: 'handlerBatchTaskEntrust',
    },
    {
      name: '退回',
      action: 'reject',
      effects: 'handleDealReject',
      batchEffects: 'handlerBatchTaskReject',
    },
    {
      name: '移交',
      action: 'transfer',
      effects: 'handleDealTransfer',
      batchEffects: 'handlerBatchTaskTransfer',
    },
    {
      name: '传阅',
      action: 'circulate',
      effects: 'handleDealCirculate',
      batchEffects: 'handlerBatchTaskCirculate',
    },
    {
      name: '跳过',
      action: 'skip',
      effects: 'handleDealSkip',
      batchEffects: 'handlerBatchTaskCirculate',
    },
    {
      name: '提交',
      action: 'submit',
    },
  ];

  const isArrays = array => {
    return Array.isArray(array) && array.length > 0;
  };
  // 根据条件获取按钮
  const getButton = (_operationAuthority, _status) => {
    // 如果不是 我代办-流程中，手动清空数组
    let temp = [];
    if (!tabs || !_status) {
      temp = _operationAuthority;
    } else if (tabs && _status && tabs === 'T001_1' && _status === 'S001_2') {
      temp = _operationAuthority;
    }
    if (_status === 'S001_1' && type === 'batch') {
      temp.push('提交');
    }
    return temp || [];
  };
  // 获取按钮
  const filterList = isHideSkip ? actionList.filter(obj => obj.name !== '跳过') : actionList;
  const operation = filterList.filter(item => {
    if (type === 'batch') {
      // TODO 退回有问题先不做
      if (item.action === 'reject') return false;
      return (
        // 打开这个判断以后,如果没有选择流程就不会显示批量处理按钮
        // batchList &&
        // batchList.length > 0 &&
        batchList.every(items => {
          return getButton(items.operationAuthority, items[statusKey]).includes(item.name);
        })
      );
    } else {
      return getButton(operationAuthority, status).includes(item.name);
    }
  });
  const handleClick = item => {
    if (type === 'batch' && (!batchList || batchList.length <= 0))
      return message.warn('请选择要办理的流程');
    switch (item.action) {
      case 'claim':
        console.log('item', item);
        setItem(item);
        Modal.confirm({
          title: '请确认是否认领?',
          okText: '确认',
          cancelText: '取消',
          onOk: () => disposeData(item),
        });
        break;
      case 'delegation':
        console.log('item111', item);
        handleDel(item);
        handleGetUserList();
        setPlaceholder('请选择委托人');
        break;
      case 'reject':
        handleDel(item);
        handleRejectList(type === 'batch' ? batchList[0].taskId : taskId);
        setPlaceholder('请选择退回节点');
        break;
      case 'transfer':
        handleDel(item);
        handleGetUserList();
        setPlaceholder('请选择移交人');
        break;
      case 'circulate':
        handleDel(item);
        handleGetUserList();
        setPlaceholder('请选择传阅人');
        break;
      case 'skip':
        handleDel(item);
        handlerGetSkipList();
        setPlaceholder('请选择要跳过的节点');
        break;
      case 'submit':
        Modal.confirm({
          title: '请确认是否要提交?',
          okText: '确认',
          cancelText: '取消',
          onOk: () => submitCallback && submitCallback(batchList),
        });

        break;
    }
  };

  const handleDel = item => {
    setItem(item);
    setVisible(true);
    setTitle(`任务${item.name}`);
  };

  const menu = (
    <Menu>
      {operation.map(item => {
        return (
          <Menu.Item key={item.name} onClick={() => handleClick(item)}>
            <a style={{ textAlign: 'center' }}>{item.name}</a>
          </Menu.Item>
        );
      })}
    </Menu>
  );

  // 可退回节点查询
  const handleRejectList = taskId => {
    if (dispatch) {
      dispatch({
        type: 'moreOperation/handleQueryCanRejectList',
        payload: taskId,
      });
    }
  };

  // 可委托/移交/传阅   人列表
  const handleGetUserList = () => {
    if (dispatch) {
      dispatch({
        type: 'moreOperation/handleGetUserList',
      });
    }
  };
  // 可跳过节点
  const handlerGetSkipList = () => {
    if (dispatch) {
      dispatch({
        type: 'moreOperation/handleDealCanSkipList',
        payload: {
          taskDefinitionKey,
          processDefinitionId,
        },
      });
    }
  };

  const handleFormData = arr => {
    const formData = new FormData();
    arr.map(item => {
      let key = Object.keys(item);
      formData.append(key[0], item[key[0]]);
      console.log('get', formData.get(key[0]));
    });

    return formData;
  };

  // 处理数据
  const disposeData = _item => {
    console.log(_item);
    let payload = null;
    const localItem = _item || item;
    // 认领
    if (localItem.action === 'claim') {
      payload =
        type === 'batch'
          ? { taskIds: batchList.map(taskItem => taskItem.taskId) }
          : handleFormData([{ taskId: record.taskId }]);
    } else {
      validateFields((err, values) => {
        if (!err) {
          switch (localItem.action) {
            // 退回
            case 'reject':
              payload =
                type === 'batch'
                  ? batchList.map(taskItem => {
                      return {
                        taskId: taskItem.taskId,
                        activityId: values.id,
                      };
                    })
                  : handleFormData([{ taskId }, { activityId: values.id }]);
              break;
            // 传阅
            case 'circulate':
              payload =
                type === 'batch'
                  ? batchList.map(taskItem => {
                      return {
                        taskId: taskItem.taskId,
                        processDefinitionId: taskItem.processDefinitionId,
                        taskDefinitionKey: taskItem.taskDefinitionKey,
                        circulateUser: values.id,
                      };
                    })
                  : { taskId, processDefinitionId, taskDefinitionKey, circulateUser: values.id };
              break;
            // 移交
            case 'transfer':
              payload =
                type === 'batch'
                  ? batchList.map(taskItem => {
                      return {
                        taskId: taskItem.taskId,
                        transferUserId: values.id,
                      };
                    })
                  : handleFormData([{ taskId }, { transferUserId: values.id }]);
              break;
            // 委托
            case 'delegation':
              payload =
                type === 'batch'
                  ? batchList.map(taskItem => {
                      return {
                        taskId: taskItem.taskId,
                        userId: values.id,
                      };
                    })
                  : handleFormData([{ taskId }, { userId: values.id }]);
              break;
            // 跳过
            case 'skip':
              payload = handleFormData([{ taskId }, { activityId: values.id }]);
              break;
          }
        }
      });
    }
    payload && handleGeneral(payload, localItem);
  };
  // 提交
  const handleSubmit = () => {
    disposeData();
  };

  // 接口成功以后的回调
  const apiCallback = () => {
    successCallback && successCallback();
    fn && fn();
  };

  // 通用调用接口
  const handleGeneral = (payload, localItem) => {
    setVisible(false);
    if (dispatch) {
      console.log(payload, localItem, type);
      dispatch({
        type: `moreOperation/${type === 'batch' ? localItem.batchEffects : localItem.effects}`,
        payload,
        callback: apiCallback,
        action: localItem.name,
      });
    }
  };

  let options;
  switch (item.action) {
    case 'reject':
      options =
        saveList &&
        saveList.map(d => (
          <Option key={d.nodeId} value={d.nodeId}>
            {d.nodeName}
          </Option>
        ));
      break;
    case 'skip':
      options =
        skipList &&
        skipList.map(d => (
          <Option key={d.nodeId} value={d.nodeId}>
            {d.nodeName}
          </Option>
        ));
      break;
    default:
      options =
        saveList &&
        saveList.map(d => (
          <Option key={d.id} value={d.id}>
            {d.username}
          </Option>
        ));
      break;
  }
  // 如果不是我待办或者未提交就不显示批量按钮
  const showList = ['T001_1', 'T001_4'];
  if (type === 'batch' && !showList.includes(tabs)) {
    return <></>;
  }
  return (
    <>
      {isArrays(operation) && (
        <Dropdown overlay={menu} trigger={['click']} placement="topCenter">
          {type === 'batch' ? (
            <Button className="ant-dropdown-link" style={batchStyles}>
              批量操作
            </Button>
          ) : (
            <Button
              type="link"
              size="small"
              className="ant-dropdown-link"
              onClick={e => e.preventDefault()}
            >
              更多 <Icon type="down" />
            </Button>
          )}
        </Dropdown>
      )}

      <Modal
        bodyStyle={{ textAlign: 'center' }}
        title={title}
        visible={visible}
        onOk={handleSubmit}
        onCancel={() => setVisible(false)}
        destroyOnClose={true}
      >
        <Form.Item>
          {getFieldDecorator('id', {
            rules: [{ required: true, message: '请选择' }],
          })(
            <Select
              allowClear
              showSearch
              style={{ width: 400 }}
              placeholder={placeholder}
              optionFilterProp="children"
              filterOption={(input, option) =>
                option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
              {options}
            </Select>,
          )}
        </Form.Item>
      </Modal>
    </>
  );
};

const WrappedIndex = errorBoundary(
  Form.create()(
    connect(({ moreOperation }) => ({
      moreOperation,
    }))(Index),
  ),
);

export default WrappedIndex;
