/**
 * 产品看板-查看产品-产品数据-关联方参与信息
 */
import React, { useContext, useRef } from 'react';
import { Table } from '@/components';
import { connect } from 'dva';
import { errorBoundary } from '@/layouts/ErrorBoundary';
import MyContext from './myContext';
import styles from './index.less';
import { handleChangeThousands } from './baseFunc';
import { tableRowConfig } from '@/pages/investorReview/func';

const ProductMessageRelationInspect = ({
  dispatch,
  listLoading,
  productBillboard: { productOverviewTable },
}) => {
  const { proCodeArguments, codeListData, codeListCodeData, proDictsObj } = useContext(MyContext); // 子组件接受的数据
  const pageNumData关联方 = useRef(1);
  const pageSizeData关联方 = useRef(10);
  const totalData关联方 = useRef();

  // 表头数据(关联方参与信息)
  const relationInspectColumns = [
    {
      title: '关联方参与人数',
      dataIndex: 'relatedPartyerNum',
      key: 'relatedPartyerNum',
      ...tableRowConfig,
      align: 'right',
    },
    {
      title: '关联方参与份额',
      dataIndex: 'relatedPartyShare',
      key: 'relatedPartyShare',
      render: val => {
        return handleChangeThousands(val);
      },
      align: 'right',
    },
    {
      title: '是否披露',
      dataIndex: 'isPublishName',
      key: 'isPublishName',
      ...tableRowConfig,
    },
    {
      title: '披露日期',
      dataIndex: 'publishPalnDate',
      key: 'publishPalnDate',
      ...tableRowConfig,
    },
  ];

  /**
   * 请求:关联方参与表格数据
   * @method handleGetListData
   */
  const handleGetListData = () => {
    dispatch({
      type: 'productBillboard/overviewMessageTableData',
      payload: {
        proCode: proCodeArguments,
        pageNum: pageNumData关联方.current,
        pageSize: pageSizeData关联方.current,
        type: 'relationInspect',
      },
    });
  };

  /**
   * 词汇替换
   * @param {String} val 词汇字典数据源
   */
  const handleUpdateNameValue = val => {
    if (typeof val === 'string') {
      if (codeListCodeData.includes(val)) {
        return codeListData[val];
      } else {
        if (val === '1') {
          return '是';
        } else if (val === '0') {
          return '否';
        } else {
          return val;
        }
      }
    } else if (Array.isArray(val)) {
      let arr = [];
      for (let key in val) {
        if (codeListCodeData.includes(val[key])) {
          arr.push(codeListData[val[key]]);
        } else {
          return val;
        }
      }
      return arr;
    } else {
      return val;
    }
  };

  /**
   * 当前页码变更(产品看板)
   * @param {String} pageNum 跳转到的页码
   */
  const handleUpdataPageNum = pageNum => {
    pageNumData关联方.current = pageNum;
    handleGetListData();
  };

  /**
   * 页码属性变更(关联方)
   * @method  handleUpdataPageSize
   * @param   {pageSize}     string    表格行数据
   * @return  {string}
   */
  const handleUpdataPage = (current, pageSize, pageNum) => {
    pageSizeData关联方.current = pageSize;
    pageNumData关联方.current = 1;
    handleGetListData();
  };

  // 页码属性设置(关联方)
  const paginationProps = {
    showQuickJumper: true,
    showSizeChanger: true,
    onShowSizeChange: handleUpdataPage,
    onChange: handleUpdataPageNum,
    current: pageNumData关联方.current,
    total: productOverviewTable.total,
    showTotal: () => {
      return `共 ${productOverviewTable.total} 条数据`;
    },
  };

  /**
   *表格渲染
   * @param {String} dataTitle 页标题
   * @param {String} columns 表头数据
   * @param {String} keyId 表id
   * @param {String} scroll 表格内宽
   */
  const handleAddTable = (dataTitle, columns, keyId, scroll) => {
    return (
      <>
        <h3 className={styles.baseTableTitle}>{dataTitle}</h3>
        <Table
          style={{ paddingLeft: '3%' }}
          pagination={false}
          // rowSelection={rowSelection} // 开启checkbox多选框
          loading={listLoading} // 加载中效果
          rowKey={record => record[keyId]} // key值
          pagination={paginationProps} // 分页栏
          columns={columns}
          dataSource={productOverviewTable.rows}
          scroll={{ x: scroll }}
        />
      </>
    );
  };

  return <> {handleAddTable('关联方参与信息', relationInspectColumns, 'id')}</>;
};

const WrappedIndexForm = errorBoundary(
  connect(({ productBillboard, loading }) => ({
    productBillboard,
    listLoading: loading.effects['productBillboard/overviewMessageTableData'],
  }))(ProductMessageRelationInspect),
);

export default WrappedIndexForm;
