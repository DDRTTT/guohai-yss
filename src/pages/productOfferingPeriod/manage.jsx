import React, { useEffect, useState } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import {
  Button,
  Card,
  Col,
  DatePicker,
  Form,
  Input,
  message,
  Popconfirm,
  Row,
  Select,
  Steps,
  Radio,
} from 'antd';
import { errorBoundary } from '@/layouts/ErrorBoundary';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import styles from './add.less';

const FormItem = Form.Item;
const { TextArea } = Input;

const Index = ({
  form: { getFieldDecorator, validateFields },
  dispatch,
  productOfferingPeriod: { manageProductLoading, saveWordDictionaryFetch },
}) => {
  const [formValue, setFormValue] = useState({});

  /**
   * 方法说明 循环生成select
   * @method  handleMapList
   * @return {void}
   * @param  {Object[]}       data 数据源
   * @param  {string}         name   select的name
   * @param  {string}         code  select的code
   * @param  {boolean|string} mode  是否可以多选(设置 Select 的模式为多选或标签)
   * @param  {boolean}        fnBoole 选择时函数控制
   * @param  {function}       fn 控制函数
   */
  const handleMapList = (data, name, code, mode = false, fnBoole = false, fn) => {
    if (!data) {
      data = {};
      data.data = [];
    }
    const e = data;
    if (e) {
      const children = [];
      for (const key of e) {
        const keys = key[code];
        const values = key[name];
        children.push(
          <Select.Option key={keys} value={keys}>
            {values}
          </Select.Option>,
        );
      }
      return (
        <Select
          showSearch
          maxTagCount={1}
          mode={mode}
          style={{ width: '100%' }}
          placeholder="请选择"
          optionFilterProp="children"
          onChange={fnBoole ? fn : ''}
        >
          {children}
        </Select>
      );
    }
  };

  // 募集开始日
  function onchangeStart(date) {
    console.log(date);
  }
  function onchangeEnd(date) {
    console.log(date);
  }
  function onchangeSelfStart(date) {
    console.log(date);
  }
  // 查询表单
  const renderAdvancedForm = () => {
    return (
      <Form>
        <Card>
          <div className={styles.tab1}>
            <h3>通知要素</h3>
            <Button>产品视图</Button>
          </div>
          <Row
            gutter={{
              md: 8,
              lg: 24,
              xl: 48,
            }}
          >
            <Col md={8} sm={24}>
              <FormItem label="产品名称">
                {getFieldDecorator('propName', {
                  rules: [{ required: true, message: '产品名称不能为空' }],
                })(handleMapList([], 'name', 'code', 'multipe'))}
              </FormItem>
            </Col>
            <Col md={8} sm={24}>
              <FormItem label="产品代码">
                {getFieldDecorator('proCode')(<Input placeholder="请输入" />)}
              </FormItem>
            </Col>
            <Col md={8} sm={24}>
              <FormItem label="产品系列">
                {getFieldDecorator('upstairsSeries')(handleMapList([], 'name', 'code', 'multipe'))}
              </FormItem>
            </Col>
            <Col md={8} sm={24}>
              <FormItem label="产品简称">
                {getFieldDecorator('proFname')(<Input placeholder="请输入" />)}
              </FormItem>
            </Col>
            <Col md={8} sm={24}>
              <FormItem label="资产类型">
                {getFieldDecorator('proType')(
                  handleMapList(saveWordDictionaryFetch.A002 || [], 'name', 'code', 'multiple'),
                )}
              </FormItem>
            </Col>
            <Col md={8} sm={24}>
              <FormItem label="风险等级">
                {getFieldDecorator('proRisk')(handleMapList([], 'name', 'code', 'multipe'))}
              </FormItem>
            </Col>
            <Col md={8} sm={24}>
              <FormItem label="是否允许自有资金参与">
                <Radio.Group>
                  <Radio value={0}>是</Radio>
                  <Radio value={1}>否</Radio>
                </Radio.Group>
              </FormItem>
            </Col>
            <Col md={8} sm={24}>
              <FormItem label="自有资金参与公告日:">
                <DatePicker onChange={onchangeSelfStart} />
              </FormItem>
            </Col>
          </Row>
          <h3>募集期信息</h3>
          <Row
            gutter={{
              md: 8,
              lg: 24,
              xl: 48,
            }}
          >
            <Col md={12} sm={24}>
              <FormItem label="募集开始日:">
                <DatePicker onChange={onchangeStart} />
              </FormItem>
            </Col>
            <Col md={12} sm={24}>
              <FormItem label="计划募集结束日:">
                <DatePicker onChange={onchangeEnd} />
              </FormItem>
            </Col>
            <Col md={12} sm={24}>
              <FormItem label="预计募集金额:">
                {getFieldDecorator('raiseAmountExpect')(<Input />)}
              </FormItem>
            </Col>
            <Col md={12} sm={24}>
              <FormItem label="调整类型:">
                <Radio.Group>
                  <Radio value={0}>延后</Radio>
                  <Radio value={1}>提前</Radio>
                </Radio.Group>
              </FormItem>
            </Col>
            <Col md={24} sm={24}>
              <FormItem label="调整计划募集结束日:">
                <DatePicker onChange={onchangeEnd} />
              </FormItem>
            </Col>
            <h3>审核要素</h3>
            <Col md={24} sm={24}>
              <FormItem label="是否提前结束募集:">
                <Radio.Group>
                  <Radio value={0}>是</Radio>
                  <Radio value={1}>否</Radio>
                </Radio.Group>
              </FormItem>
            </Col>
            <h3>市场岗审核人</h3>
            <Col md={24} sm={24}>
              <FormItem label="审批意见:">
                <TextArea rows={2} />
              </FormItem>
            </Col>
            <h3>业务审核人</h3>
            <Col md={24} sm={24}>
              <FormItem label="审批意见:">
                <TextArea rows={2} />
              </FormItem>
            </Col>
            <h3>业务经办人</h3>
            <Col md={24} sm={24}>
              <FormItem label="审批意见:">
                <TextArea rows={2} />
              </FormItem>
            </Col>
          </Row>
        </Card>
      </Form>
    );
  };
  return (
    <PageHeaderWrapper>
      <Card>
        <div className={styles.headTag}>
          <h3>办理-产品募集期调整</h3>
          <div className={styles.buttonList}>
            {/* <Button type="primary" >催办</Button>
                    <Button type="primary" ghost>撤回</Button>
                    <Button>流转历史</Button>
                    <Button>取消</Button> */}
            <Button type="primary">委托</Button>
            <Button type="primary" ghost>
              移交
            </Button>
            <Button>传阅</Button>
            <Button>退回</Button>
            <Button>通过</Button>
            <Button>流转历史</Button>
            <Button>取消</Button>
          </div>
        </div>
        <div>{renderAdvancedForm()}</div>
      </Card>
    </PageHeaderWrapper>
  );
};
const WrappedIndexForm = errorBoundary(
  Form.create()(
    connect(({ productOfferingPeriod, loading }) => ({
      productOfferingPeriod,
      listLoading: loading.effects['productOfferingPeriod/saveListFetch'],
      manageProductLoading: loading.effects['productOfferingPeriod/manage'],
    }))(Index),
  ),
);

export default WrappedIndexForm;
