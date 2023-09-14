import React,{memo} from 'react';
import { Table } from 'antd';

interface T {
}

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
      i.ellipsis ? (i.ellipsis = false) : '';//控制表宽度是否自适应
      if (i.title=='操作') {
        i.ellipsis=true
      }
    },
  );
  // props.pagination.pageSizeOptions=['30','50','100','300']
  return (
    <Table
      {...props}
      bordered
      // rowClassName={(record, index) => {
      //   let className = '';
      //   if (index % 2 === 1) className = 'bgcFBFCFF';
      //   return className;
      // }}
    />
  );
};

export default memo(TableProvider)
