import React, { PureComponent } from 'react';
import { Button, Card, Pagination, Table } from 'antd';
import Action from '@/utils/hocUtil';
import styles from './DataTable.less';

/**
 * 标准DataTable组件
 * 包含：按钮组（可选）、列表、分页
 */
class DataTable extends PureComponent {
  state = {
    selectedRowKeys: [],
  };

  /**
   * 分页组件变动事件
   * 复位当前页
   * @param current
   * @param pageSize
   */
  onShowSizeChange = (current, pageSize) => {
    this.onPaginationChange(1, pageSize);
  };

  onPaginationChange = (current, pageSize) => {
    const { onPaginationChange: pageChange } = this.props;

    pageChange(current, pageSize);
  };

  defaultButtonClass = type => {
    switch (type) {
      case '新增':
        return 'ant-btn ant-btn-primary buttonCommit buttons1';
      case '修改':
        return 'ant-btn ant-btn-primary buttonCommit buttons2';
      case '复核':
        return 'ant-btn ant-btn-primary buttonCommit buttons3';
      case '反复核':
        return 'ant-btn ant-btn-primary buttonCommit buttons4';
      case '审核':
        return 'ant-btn ant-btn-primary buttonCommit buttons5';
      case '反审核':
        return 'ant-btn ant-btn-primary buttonCommit buttons6';
      default:
        return 'ant-btn ant-btn-primary buttonCommit buttons7';
    }
  };

  /**
   * 按钮组生成函数
   */
  handlerButtonGroup = menuCode => {
    const { buttons } = this.props;

    return (
      <div className={styles.operators}>
        {buttons.map(item => {
          return item.code ? (
            <Action key={item.code} code={`${menuCode}:${item.code}`}>
              <Button type={item.type || 'primary'} key={item.text} onClick={item.onClick}>
                {item.text}
              </Button>
            </Action>
          ) : (
            <Button type={item.type || 'primary'} key={item.text} onClick={item.onClick}>
              {item.text}
            </Button>
          );
        })}
      </div>
    );
  };

  onSelectChange = selectedRowKeys => {
    const { handleSelectRows } = this.props;
    this.setState({ selectedRowKeys });
    handleSelectRows(selectedRowKeys);
  };

  render() {
    const { selectedRowKeys } = this.state;

    const {
      columns,
      dataList,
      total,
      loading,
      current,
      pageSize,
      menuCode,
      extra,
      pagenation,
    } = this.props;

    if (pagenation) {
      return (
        <Card bordered className={styles.card}>
          <div className={styles.tableList}>
            {this.handlerButtonGroup(menuCode)}
            <div className={styles.standardTable}>
              <Table
                rowSelection={{ selectedRowKeys, onChange: this.onSelectChange }}
                loading={loading}
                rowKey={record => record.key}
                dataSource={dataList}
                columns={columns}
                pagination
                size="small"
                bordered
                {...extra}
              />
            </div>
          </div>
        </Card>
      );
    }
    return (
      <div className={styles.tableList}>
        {this.handlerButtonGroup(menuCode)}
        <div className={styles.standardTable}>
          <Table
            rowSelection={{ selectedRowKeys, onChange: this.onSelectChange }}
            loading={loading}
            rowKey={record => record.key}
            dataSource={dataList}
            columns={columns}
            pagination={false}
            size="small"
            bordered
            {...extra}
            scroll={{ x: columns.length * 200 + 500 }}
          />
        </div>
        <div className={styles.tablePagination}>
          <Pagination
            showQuickJumper
            showSizeChanger
            current={current}
            total={total}
            onShowSizeChange={this.onShowSizeChange}
            onChange={this.onPaginationChange}
            pageSize={pageSize}
            // showTotal={total => `共 ${total} 条`}
          />
        </div>
      </div>
    );
  }
}

export default DataTable;
