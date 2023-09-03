import { routerRedux } from 'dva/router';
import { fnLink } from '@/utils/hocUtil';
import { revoke } from '@/services/investorReview';
import { message, Modal, Tooltip } from 'antd';
import { handleShowTransferHistory } from '@/utils/transferHistory';

/**
 * @description 根据不同的状态获取不同的编辑按钮
 * @param {string} checkedCode 当前流程的状态 S001_1 待提交 S001_2 流程中 S001_3 已结束
 * @param {string} taskTypeCode 当前选项卡的code
 * @param {number} revoke 是否要显示撤销按钮
 * @returns {array} buttonList
 */
export const getEditButton = (checkedCode, taskTypeCode, revoke) => {
  let buttonList = [];
  // #region <-------------1.016更新 start----------->
  // 我待办 && 未提交
  if (taskTypeCode === 'T001_1' || taskTypeCode === 'T001_4') {
    switch (checkedCode) {
      case 'S001_1':
        buttonList = [
          {
            label: '修改',
            code: 'modify',
          },
          {
            label: '复制',
            code: 'copy',
          },
          {
            label: '提交',
            code: 'submit',
          },
        ];
        break;
      case 'S001_2':
        buttonList = [
          {
            label: '办理',
            code: 'transact',
          },
          {
            label: '流转历史',
            code: 'history',
          },
        ];
        break;
      case 'S001_3':
        buttonList = [
          {
            label: '详情',
            code: 'detail',
          },
          {
            label: '流转历史',
            code: 'history',
          },
        ];
        break;

      default:
        buttonList = [];
        break;
    }
  } else {
    //   我参与 && 我发起 && 已办理
    buttonList = [
      {
        label: '详情',
        code: 'detail',
      },
      {
        label: '流转历史',
        code: 'history',
      },
    ];
  }
  // 如果是待提交就显示删除按钮
  if (checkedCode === 'S001_1') {
    buttonList.push({
      label: '删除',
      code: 'delete',
    });
  }
  // 如果revoke等于1的话&状态是流程中的话就显示撤销
  if (revoke && revoke * 1 === 1 && checkedCode === 'S001_2') {
    buttonList.push({
      label: '撤销',
      code: 'repeal',
    });
  }
  return buttonList;
  // #endregion <------------- end----------->
};

/**
 * 获取分页设置
 * @param {*} total 当前列表数据总数
 * @param {*} pageSize 页面的数据数
 * @param {*} otherConfig 可拓展其他配置
 * * @returns {*} config
 */
export const getPaginationConfig = (total, pageSize, otherConfig = {}) => {
  return {
    // size: 'small',
    total,
    pageSize,
    showSizeChanger: true,
    showQuickJumper: true,
    showTotal: total => `共 ${total} 条数据`,
    ...otherConfig,
  };
};

/**
 * 处理小按钮的公用函数
 * @param {string} code 触发的函数
 * @param {*} record 数据
 * @param {string} pageConfig 页面模板的路径
 * @param pageConfigParam
 */
export const handleEdit = (code, record, pageConfig, pageConfigParam) => {
  const { pathName, dispatch, refresh, handlerDelete } = pageConfig;
  switch (code) {
    case 'start':
      fnLink(`${pathName}:start`);
      break;
    case 'add':
      fnLink(`${pathName}:add`);
      break;
    case 'show':
      fnLink(`${pathName}:show`, pageConfigParam || '');
      break;
    case 'detail':
      dispatch(
        routerRedux.push({
          pathname: '/processCenter/processDetail',
          query: {
            processInstanceId: record.processInstanceId,
            nodeId: record.taskDefinitionKey,
            taskId: record.taskId,
            resourcePathName: pathName || '',
          },
        }),
      );
      break;
    case 'submit':
      fnLink(`${pathName}:submit`, pageConfigParam || '');
      break;
    case 'modify':
      fnLink(`${pathName}:modify`, pageConfigParam || '');
      break;
    case 'copy':
      fnLink(`${pathName}:copy`, `?processInstId=${record.processInstanceId || ''}`);
      break;
    case 'transact':
      dispatch(
        routerRedux.push({
          pathname: '/processCenter/taskDeal',
          query: {
            taskId: record.taskId,
            processDefinitionId: record.processDefinitionId,
            processInstanceId: record.processInstanceId,
            taskDefinitionKey: record.taskDefinitionKey,
            mode: 'deal',
            id: record.id,
            proCode: record.proCode,
          },
        }),
      );
      break;
    case 'repeal':
      Modal.confirm({
        title: '请确认是否撤销?',
        okText: '确认',
        cancelText: '取消',
        onOk: () =>
          revoke({ processInstId: record.processInstanceId }).then(res => {
            if (res.status == 200) {
              message.success('撤销成功');
              refresh();
            } else {
              message.error(res.message);
            }
          }),
      });
      break;
    case 'delete':
      if (handlerDelete) {
        Modal.confirm({
          title: '请确认是否删除?',
          okText: '确认',
          cancelText: '取消',
          onOk: () =>
            handlerDelete(record.id).then(res => {
              if (res.status == 200) {
                message.success('删除成功');
                refresh();
              } else {
                message.error(res.message);
              }
            }),
        });
      }
      break;
    case 'history':
      handleShowTransferHistory(record);
      break;
    default:
      break;
  }
};

// 判断是不是一个空的新对象
export const isNullObj = obj => {
  return JSON.stringify(obj) === '{}';
};

/**
 * @description 根据设置的条件隐藏数组
 * @param {String} tabKey 当前的tab的key
 * @param {Array} conditions 隐藏的tabs条件
 * @param {Array} arr column数组
 * @param {String} key 删除的key
 * @param {Object} obj 要添加的key
 */
export const hideColumn = (tabKey, conditions, arr, key, obj) => {
  // 已办理和我发起不显示任务到达时间
  const hideTaskTime = conditions;
  const index = arr.findIndex(item => item.dataIndex == key);
  if (hideTaskTime.includes(tabKey) && ~index) {
    arr.splice(index, 1);
  } else if (!~index && !hideTaskTime.includes(tabKey)) {
    arr.splice(arr.length - 1, 0, obj);
  }
};

/**
 * @description 隐藏任务到达时间
 * @param tabkey
 * @param {Array} arr column数组
 * @param dataIndex
 */
export const hideTaskTime = (tabkey, arr, dataIndex) => {
  hideColumn(tabkey, ['T001_3', 'T001_5'], arr, dataIndex, {
    key: dataIndex,
    dataIndex,
    title: '任务到达时间',
    ...tableRowConfig,
  });
};

/**
 *  一个机智的boy写的一个机智的函数
 *  给表格加tooltip用的公用的方法
 * */

export const eutrapelia = label => {
  return (
    <Tooltip title={label} placement="topLeft">
      {label
        ? label.toString().replace(/null/g, '-')
        : label === '' || label === undefined || label === null
        ? '-'
        : 0}
    </Tooltip>
  );
};
/**
 * 一个机智的常量
 * 表格列的固定宽度
 */
export const tableRowWidth = 200;
/**
 * 又一个机智的常量
 * 表格列常用的配置
 * 真他娘的是个人才
 */
export const tableRowConfig = {
  sorter: true,
  ellipsis: true,
  width: tableRowWidth,
  render: eutrapelia,
};
