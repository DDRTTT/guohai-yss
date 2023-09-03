import React from 'react';
import { Table } from 'antd';
import { handleTableCss } from '@/pages/manuscriptBasic/func';

const TableProvider: React.FC<any> = props => {
  const columns = props?.columns;
  columns?.forEach(
    (item: {
      title: string;
      dataIndex?: string;
      ellipsis?: boolean;
      render: (text: any, record: T, index: number) => React.ReactNode;
    }) => {
      const i = item;
      i.ellipsis ? (i.ellipsis = false) : '';
      if (!i.render) {
        i.render = (text: string) => <>{handleTableCss(text) || '-'}</>;
      }
    },
  );
  return (
    <Table
      {...props}
      bordered
      rowClassName={(record, index) => {
        let className = '';
        if (index % 2 === 1) className = 'bgcFBFCFF';
        return className;
      }}
    />
  );
};

export default TableProvider;
