import React, { useEffect, useState } from 'react';
import styles from '../style.less';
import { Card, Button, Row, Col } from 'antd';
import { PageContainers } from '@/components';
import { Table } from '@/components';
import { commonColumns } from '../common';
import { connect } from 'dva';

const CardInfo = props => {
  const { rows, detail } = props;
  const renderButtons = ({ buttons }) => {
    return buttons.map(item => (
      <span className={styles.buttonsWrap}>
        <Button type={item.type} onClick={item.click}>
          {item.label}
        </Button>
      </span>
    ));
  };

  return (
    <Card bordered={false} title="档案借阅" loading={false} extra={renderButtons(props)}>
      <section className={styles.info}>
        <p>
          借阅标题：<b>{detail.borrowingTitle}</b>
        </p>
        <Row gutter={[16, 16]}>
          <Col span={6}>
            借阅人：<strong className={styles.strong}>{detail.borrower}</strong>
          </Col>
          <Col span={6}>
            所属部门：<strong className={styles.strong}>{detail.dept}</strong>
          </Col>
          <Col span={6}>
            借阅时间：<strong className={styles.strong}>{detail.borrowedTime}</strong>
          </Col>
          <Col span={6}>
            归还时间：<strong className={styles.strong}>{detail.returnTime}</strong>
          </Col>
          {detail.delayTime && (
            <Col span={6}>
              延期时间：<strong className={styles.strong}>{detail.delayTime}</strong>
            </Col>
          )}
          {detail.delayReason && (
            <Col span={6}>
              延期原因：<strong className={styles.strong}>{detail.delayReason}</strong>
            </Col>
          )}
        </Row>
      </section>
    </Card>
  );
};

const TableInfo = ({
  selectedRows = [],
  setSelectedRows,
  fileBorrower: { tranDicts, transFiles },
  handlerDo,
  listLoading = false,
  showDelSome = true,
  setChildSelected = null,
}) => {
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  useEffect(() => {
    console.log(
      selectedRows,
      selectedRows.map(item => item.id),
    );
    setSelectedRowKeys(selectedRows.map(item => item.id));
  }, [selectedRows]);
  // 表格行选择
  const onSelectChange = (rows, b) => {
    setSelectedRowKeys(rows);
    console.log(rows, b);
    setChildSelected && setChildSelected(rows); //向上传递
  };
  const delSome = () => {
    let rows = [];
    selectedRows.forEach(item => {
      !selectedRowKeys.find(ele => ele === item.id) && rows.push(item);
    });
    setSelectedRows(rows);
  };
  const handleStandardTableChange = () => {};

  // 表格列配置
  const columns = commonColumns(transFiles, tranDicts, handlerDo);
  return (
    <Card bordered={false} title="借阅单" loading={false}>
      {showDelSome ? (
        <div className={styles.marginbottom15}>
          <Button type="primary" onClick={delSome} disabled={selectedRowKeys.length === 0}>
            批量删除
          </Button>
        </div>
      ) : (
        ''
      )}
      <Table
        scroll={{ x: 1200 }}
        columns={columns}
        loading={listLoading}
        dataSource={selectedRows}
        onChange={handleStandardTableChange}
        rowKey="id"
        rowSelection={{ selectedRowKeys, onChange: onSelectChange }}
      />
    </Card>
  );
};

function fileMain(props) {
  return (
    <>
      <PageContainers
        breadcrumb={[
          {
            title: '返回',
            url: '',
          },
        ]}
      >
        {props.detail ? (
          <div className={styles.marginbottom15}>
            <CardInfo {...props}></CardInfo>
          </div>
        ) : (
          ''
        )}
        {props.childrenIsheader ? (
          <div className={styles.marginbottom15}>{props.children}</div>
        ) : (
          ''
        )}
        <TableInfo {...props}></TableInfo>
        {props.childrenIsfooter ? <div className={styles.margintop15}>{props.children}</div> : ''}
      </PageContainers>
    </>
  );
}

export default connect(({ fileBorrower }) => ({
  fileBorrower,
}))(fileMain);
