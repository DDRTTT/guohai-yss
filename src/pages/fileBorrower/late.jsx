import React, { useEffect, useState } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import moment from 'moment';
import { getHandlerCode } from './common';
import FileMain from './components/FileMain';
import { Card, DatePicker, Row, Col, Form, Input } from 'antd';
import { errorBoundary } from '@/layouts/ErrorBoundary';
import styles from './style.less';

function late({
  form: { getFieldDecorator, validateFields, getFieldsValue },
  location,
  listLoading,
  dispatch,
  fileBorrower: {
    orderList: { rows, total },
    tranDicts,
    transFiles,
  },
}) {
  const [detail, setDetail] = useState({});
  const [selectedRows, setSelectedRows] = useState([]);
  useEffect(() => {
    const data = JSON.parse(decodeURI(location.query.detail));
    setDetail(data);
    dispatch({
      type: 'fileBorrower/getorderList',
      payload: {
        bizViewId: 'I8aaa82cd0180d50fd50f97bf0180f40b544b6400',
        isPage: '0',
        returnType: 'LIST',
        id: data.id,
      },
    });

    // 翻译字典 档案室等
    tranDicts.length === 0 &&
      dispatch({
        type: 'fileBorrower/getTranDicts',
        payload: {
          bizViewId: 'I8aaa82cd0180d50fd50f97bf018104339563029f',
          isPage: '0',
          returnType: 'LIST',
        },
      });
    // 翻译字典 档案大类等
    transFiles.length === 0 &&
      dispatch({
        type: 'fileBorrower/getFileTypes',
        payload: {},
      });
  }, []);

  // 开始结束时间限制
  const disabledStartDate = borrowedTime => {
    const returnTime = moment(detail.returnTime);
    if (!borrowedTime || !returnTime) {
      return false;
    }
    return borrowedTime.valueOf() <= returnTime.valueOf();
  };

  return (
    <div>
      <FileMain
        buttons={[
          {
            type: 'primary',
            label: '提交',
            click: () => {
              validateFields((err, fieldsValue) => {
                const payload = { ...fieldsValue };
                if (err) return;
                payload.delayTime = moment(payload.delayTime).format('YYYY-MM-DD');
                dispatch({
                  type: 'fileBorrower/fetModifyApply',
                  payload: {
                    ...payload,
                    id: detail.id,
                    flag: getHandlerCode('late'),
                  },
                }).then(() => {
                  router.goBack();
                });
              });
            },
          },
          {
            type: '',
            label: '取消',
            click: () => {
              router.goBack();
            },
          },
        ]}
        childrenIsheader
        detail={detail}
        selectedRows={rows}
        listLoading={listLoading}
        showDelSome={false}
        setChildSelected={data => setSelectedRows(data)}
      >
        <Card bordered={false}>
          <Form name="lateform" className={styles.lateform} autoComplete="off">
            <Row gutter={24}>
              <Col span={6}>
                <Form.Item label="延期时间">
                  {getFieldDecorator('delayTime', {
                    rules: [{ required: true, message: '请选择延期时间' }],
                  })(<DatePicker disabledDate={disabledStartDate} />)}
                </Form.Item>
              </Col>
              <Col span={18}>
                <Form.Item label="延期原因">
                  {getFieldDecorator('delayReason', {
                    rules: [{ required: true, message: '请填写延期原因' }],
                  })(<Input placeholder="请填写原因" />)}
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Card>
      </FileMain>
    </div>
  );
}

const WrappedLate = errorBoundary(
  Form.create()(
    connect(({ fileBorrower, loading }) => ({
      fileBorrower,
      listLoading: loading.effects['fileBorrower/getorderList'],
    }))(late),
  ),
);

export default WrappedLate;
