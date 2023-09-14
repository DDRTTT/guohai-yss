import { Card, Breadcrumb, Input, Tooltip } from 'antd';
import { Table } from '@/components';
import router from 'umi/router';
import styles from './index.less';

const { Search } = Input;

/**
 * 搜索框创建
 * @param {Function} onSearch
 */
const handleAddSearch = (onSearch, val) => {
  return (
    <Search
      className={styles.searchInput}
      allowClear
      placeholder={
        val === 1 ? '请输入产品名称或产品代码' : val === 0 ? '请输入系列名称或系列代码' : val
      }
      onSearch={onSearch}
      style={{ width: 250 }}
    />
  );
};

/**
 * 头部
 * @param {Function} Search 搜索回调
 * @param {String} val 搜索栏展示
 * @param {String} v1 导航1
 * @param {String} v2 导航2
 * @param {String} v3 导航3
 */
export const handleAddHeard = (Search, val, v1, v2, v3) => {
  return (
    <div style={{ marginBottom: '35px' }}>
      <Card className={styles.searchCard} style={{ height: '84px' }}>
        <Breadcrumb style={{ position: 'relative', top: '6px' }}>
          {v1 ? <Breadcrumb.Item>{v1}</Breadcrumb.Item> : ''}
          {v2 ? (
            <Breadcrumb.Item
              className={styles.BreadcrumbStyle}
              onClick={() => router.push('/productLifecycle/productInformationBase/index')}
            >
              {v2}
            </Breadcrumb.Item>
          ) : (
            ''
          )}
          {v3 ? <Breadcrumb.Item>{v3}</Breadcrumb.Item> : ''}
        </Breadcrumb>
        {val !== undefined ? handleAddSearch(Search, val) : ''}
      </Card>
    </div>
  );
};

/**
 * 表格
 * @param {Array} columns 表头
 * @param {Array} data 表格数据
 * @param {Object} pages 页码
 * @param {Function} onChange 变化回调
 * @param {String} loading 加载状态
 */
export const handleAddTable = (columns, data, pages, onChange, loading) => {
  return (
    <Card className={styles.bodyData}>
      <Table
        className={styles.controlButtonDiv}
        pagination={pages} // 分页栏
        loading={loading} // 加载中效果
        rowKey={record => record.id} // key值
        dataSource={data} // 表数据源
        columns={columns} // 表头数据
        onChange={onChange}
        scroll={{ x: true }}
      />
    </Card>
  );
};

// 字符过长省略(15 / 包含数组类型)
export const handleAddTooltip15 = val => {
  if (typeof val === 'string') {
    return val.length > 15 ? (
      <Tooltip title={val}>
        <span>{val.substr(0, 13)}...</span>
      </Tooltip>
    ) : (
      <Tooltip title={val}>
        <span>{val}</span>
      </Tooltip>
    );
  } else if (Array.isArray(val)) {
    let str = val.toLocaleString();
    str.length > 15 ? (
      <Tooltip title={val}>
        <span>{str.substr(0, 13)}...</span>
      </Tooltip>
    ) : (
      <Tooltip title={val}>
        <span>{str}</span>
      </Tooltip>
    );
  } else if (typeof val === 'number') {
    return val.toString();
  } else return val;
};

// 表格字段提示信息
export const tableRender = {
  render: val => {
    return handleAddTooltip15(val);
  },
};
