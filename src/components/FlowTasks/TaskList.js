import React from 'react';
import { Table, Tabs, Pagination, Button, Popover } from 'antd';
import styles from './style.less';

const { TabPane } = Tabs;
// 任务列表部分
const TaskList = prop => {
  const { tableLoading, dataSource, initData, pagerProp, panes, columns, editTask } = prop;

  // 默认分页定义
  const defaultPager = {
    current: 1,
    total: dataSource.total || 0,
    showTotal: total => `共 ${total} 条`,
  };

  const pager = Object.assign(defaultPager, pagerProp || {});

  /**
   * 方法说明 新增流程跳转
   * @method addTask 新增流程跳转
   * @param {*} record
   */

  // tab 上的扩展按钮
  const operations = (
    <Button type="primary" onClick={() => editTask('add')}>
      发起流程
    </Button>
  );
  // 更多弹出定义
  const popContent = (
    <ul style={{ margin: 0, padding: 0 }}>
      <li>
        <a> 提交 </a>
      </li>
      <li>
        <a> 认领 </a>
      </li>
      <li>
        <a> 委托 </a>
      </li>
      <li>
        <a> 退回 </a>
      </li>
      <li>
        <a> 移交 </a>
      </li>
      <li>
        <a> 传阅 </a>
      </li>
    </ul>
  );
  // 列表checkbox选择
  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
    },
    onSelect: (record, selected, selectedRows) => {
      console.log(record, selected, selectedRows);
    },
    onSelectAll: (selected, selectedRows, changeRows) => {
      console.log(selected, selectedRows, changeRows);
    },
  };
  return (
    <div className={styles.mainContent}>
      <Tabs
        defaultActiveKey="1"
        tabBarExtraContent={operations}
        onChange={activeTab => initData('tabChange', activeTab)}
      >
        {panes.map(pane => (
          <TabPane tab={pane.title} key={pane.key} />
        ))}
      </Tabs>
      <Table
        dataSource={dataSource.rows}
        loading={tableLoading}
        columns={columns}
        rowSelection={rowSelection}
        pagination={false}
        onChange={(pagination, filters, sorter) => {
          initData('sortChange', sorter);
        }}
        scroll={{ x: 1700 }}
        rowKey={record => record.id}
      />
      <div style={{ display: 'flex', marginTop: 16 }}>
        <div style={{ flex: 1 }}>
          <Popover placement="bottom" content={popContent} trigger="click">
            <Button>批量操作</Button>
          </Popover>
        </div>
        <Pagination
          {...pager}
          onChange={(page, pageSize) => {
            initData('pageChange', page);
          }}
          onShowSizeChange={(current, size) => {
            initData('pageSizeChange', size);
          }}
        />
      </div>
    </div>
  );
};
export default TaskList;
