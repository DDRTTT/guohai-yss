import React from 'react';
import { Row, Col, Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import styles from '../index.less';

export default function TabHeader(props) {
  const viewMore = () => {};
  // console.log(props.moreUrl);
  // console.log(props.searchAction);
  const searchAction = (event, type) => {
    console.log(props.bindchange);
    if (!props.bindchange && type == 'onchange') return;
    props.searchAction(event.target.value);
  };
  return (
    <>
      <Row className={styles.tableHeader}>
        <Col span={20}>
          <span className={styles.tableHeaderTitle}>{props.title}</span>
        </Col>
        <Col span={4} className={styles.textRight}>
          {props.isMore ? (
            <el-button type="text" size="small" onClick={viewMore}>
              <span className={styles.moreBtn}>更多</span>
            </el-button>
          ) : props.isSearch ? (
            <Input
              placeholder="模糊搜索"
              onChange={event => {
                searchAction(event, 'onchange');
              }}
              onPressEnter={event => {
                searchAction(event, 'onpressenter');
              }}
              prefix={<SearchOutlined className="site-form-item-icon" />}
            />
          ) : (
            ''
          )}
        </Col>
      </Row>
    </>
  );
}
