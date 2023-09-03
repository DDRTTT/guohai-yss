import React, { useEffect, useState } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Button, Card, Col, DatePicker, Form, Input, Row, Select, Radio } from 'antd';
import { errorBoundary } from '@/layouts/ErrorBoundary';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import moment from 'moment';
import styles from './add.less';

const FormItem = Form.Item;
const saveBtnMsg = {};
const submitMsg = {};

const Index = ({
  form: { getFieldDecorator, setFieldsValue },
  dispatch,
  productOfferingPeriodAdd: { saveProductSelection, saveWordDictionaryFetch },
}) => {
  useEffect(() => {
    // handleProductSelection('P002_2');
    handleProductSelection('');

    // 资产类型，风险等级字典
    handleWordDictionaryFetch('R001,A002');
  }, []);

  // 产品名称下拉框
  const handleProductSelection = proStage => {
    dispatch({
      type: 'productOfferingPeriodAdd/handleProductSearch',
      payload: { proStage },
    });
  };

  /**
   * 词汇字典
   * @method  handleWordDictionaryFetch
   * @param codeList {string} 词汇代码
   */
  const handleWordDictionaryFetch = codeList => {
    dispatch({
      type: 'productOfferingPeriodAdd/handleWordDictionaryFetch',
      payload: { codeList },
    });
  };
  // 根据产品名称回显信息
  const handleBackMsg = proCode => {
    dispatch({
      type: 'productOfferingPeriodAdd/handleGetBackMsgByAdd',
      payload: { proCode },
    }).then(data => {
      setFieldsValue({
        proCode: data.proCode,
        upstairsSeries: data.upstairsSeries,
        proFname: data.proFname,
        canOwnfundParticipation: data.canOwnfundParticipation,
        ownFundsDate: data.ownFundsDate,
        raiseEdateExpect: data.raiseEdateExpect,
        raiseAmountExpect: data.raiseAmountExpect,
        proType: data.proType,
        proRisk: data.proRisk,
      });
      saveBtnMsg.proCode = data.proCode;
      submitMsg.proCode = data.proCode;
      saveBtnMsg.raiseEdateExpect = data.raiseEdateExpect;
    });
  };
  const chooseProType = proType => {
    //  console.log(proType);
  };
  const chooseProRisk = proRisk => {
    //  console.log(proRisk);
  };
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
  const handleMapList = (data, name, code, mode = false, fnBoole, fn) => {
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

  // 选择产品名称 回显信息
  const chosseProName = proCode => {
    handleBackMsg(proCode);
  };
  // 募集开始日
  function onchangeStart(date) {
    //  console.log(date);
  }
  function onchangeEnd(e) {
    saveBtnMsg.raiseEdateExpect = moment(e).format('YYYY-MM-DD');
    submitMsg.raiseEdateExpect = moment(e).format('YYYY-MM-DD');
  }
  function onchangeSelfStart(date) {
    //  console.log(date);
  }
  function onChangeRadio(e) {
    // setRadioValue(e.target.checked ? '1' : '0');
  }
  function onchangeAdjustmentType(e) {
    saveBtnMsg.adjustmentType = e.target.checked ? '1' : '0';
    submitMsg.adjustmentType = e.target.checked ? '1' : '0';
  }
  function onchangeAdjustEndDate(e) {
    saveBtnMsg.adjustEndDate = moment(e).format('YYYY-MM-DD');
    submitMsg.adjustEndDate = moment(e).format('YYYY-MM-DD');
  }
  // 调整募集结束日限制
  function disabledDate(current) {
    return current && current < moment(saveBtnMsg.ownFundsDate, 'YYYY-MM-DD').add('day', 5);
  }

  // 保存
  function save() {
    dispatch({
      type: 'productOfferingPeriodAdd/handleSaveByAddAPI',
      payload: {
        proCode: saveBtnMsg.proCode,
        adjustmentType: saveBtnMsg.adjustmentType,
        adjustEndDate: saveBtnMsg.adjustEndDate,
        raiseEdateExpect: saveBtnMsg.raiseEdateExpect,
      },
    });
  }
  // 提交
  function submitForm() {
    dispatch({
      type: 'productOfferingPeriodAdd/handleSubmitAPI',
      payload: {
        proCode: submitMsg.proCode,
        adjustmentType: submitMsg.adjustmentType,
        adjustEndDate: submitMsg.adjustEndDate,
        raiseEdateExpect: submitMsg.raiseEdateExpect,
      },
    }).then(data => {
      if (data) {
        dispatch(
          routerRedux.push({
            pathname: '/productOfferingPeriod/productOfferingPeriod',
          }),
        );
      }
    });
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
                {getFieldDecorator('proName', {
                  rules: [{ required: true, message: '产品名称不能为空' }],
                })(
                  handleMapList(
                    saveProductSelection,
                    'proName',
                    'proCode',
                    'multipe',
                    true,
                    chosseProName,
                  ),
                )}
              </FormItem>
            </Col>
            <Col md={8} sm={24}>
              <FormItem label="产品代码">
                {getFieldDecorator('proCode')(<Input placeholder="请输入" disabled />)}
              </FormItem>
            </Col>
            <Col md={8} sm={24}>
              <FormItem label="产品系列">
                {getFieldDecorator('upstairsSeries')(
                  handleMapList(saveProductSelection, 'pronName', 'proCode', 'multipe'),
                )}
              </FormItem>
            </Col>
            <Col md={8} sm={24}>
              <FormItem label="产品简称">
                {getFieldDecorator('proFname')(<Input placeholder="请输入" disabled />)}
              </FormItem>
            </Col>
            <Col md={8} sm={24}>
              <FormItem label="资产类型">
                {getFieldDecorator('proType')(
                  handleMapList(
                    saveWordDictionaryFetch.A002 || [],
                    'name',
                    'code',
                    'multipe',
                    true,
                    chooseProType,
                  ),
                )}
              </FormItem>
            </Col>
            <Col md={8} sm={24}>
              <FormItem label="风险等级">
                {getFieldDecorator('proRisk')(
                  handleMapList(
                    saveWordDictionaryFetch.R001 || [],
                    'name',
                    'code',
                    'multipe',
                    true,
                    chooseProRisk,
                  ),
                )}
              </FormItem>
            </Col>
            <Col md={8} sm={24}>
              <FormItem label="是否允许自有资金参与">
                {getFieldDecorator('canOwnfundParticipation')(
                  <Radio.Group onChange={() => onChangeRadio}>
                    <Radio value="0">是</Radio>
                    <Radio value="1">否</Radio>
                  </Radio.Group>,
                )}
              </FormItem>
            </Col>
            <Col md={8} sm={24}>
              <FormItem label="自有资金参与公告日:">
                {getFieldDecorator('ownFundsDate')}
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
                <DatePicker onChange={onchangeStart} disabled />
              </FormItem>
            </Col>
            <Col md={12} sm={24}>
              <FormItem label="计划募集结束日:">
                <DatePicker onChange={onchangeEnd} />
              </FormItem>
            </Col>
            <Col md={12} sm={24}>
              <FormItem label="预计募集金额:">
                {getFieldDecorator('raiseAmountExpect')(<Input disabled />)}
              </FormItem>
            </Col>
            <Col md={12} sm={24}>
              <FormItem label="调整类型:">
                <Radio.Group onChange={onchangeAdjustmentType}>
                  <Radio value="0">延后</Radio>
                  <Radio value="1">提前</Radio>
                </Radio.Group>
              </FormItem>
            </Col>
            <Col md={12} sm={24}>
              <FormItem label="调整计划募集结束日:">
                <DatePicker onChange={onchangeAdjustEndDate} disabledDate={disabledDate} />
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
          <h3>新增-产品募集期调整</h3>
          <div className={styles.buttonList}>
            <Button type="primary" onClik={save}>
              保存
            </Button>
            <Button type="primary" ghost onClick={submitForm}>
              提交
            </Button>
            <Button>流程图</Button>
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
    connect(({ productOfferingPeriodAdd }) => ({
      productOfferingPeriodAdd,
    }))(Index),
  ),
);

export default WrappedIndexForm;
