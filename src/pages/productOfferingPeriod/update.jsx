import React, { useEffect, useState } from 'react';
import { connect } from 'dva';
import { Button, Card, Col, DatePicker, Form, Input, Row, Select, Radio } from 'antd';
import { errorBoundary } from '@/layouts/ErrorBoundary';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { getSearchString } from '@/utils/utils';
import moment from 'moment';
import styles from './add.less';

const FormItem = Form.Item;
const saveBtnMsg = {};
const Index = ({
  form: { getFieldDecorator, setFieldsValue },
  dispatch,
  productOfferingPeriodUpdate: {
    saveMsgByUpdate,
    saveProductSelection,
    saveBackMsgByUpdate,
    saveTypeDictionaryFetch,
    saveRiskDictionaryFetch,
  },
}) => {
  const [formValue, setFormValue] = useState({});
  const [radioValue, setRadioValue] = useState('0');
  useEffect(() => {
    handleProductSelection('P001_2');
    const id = getSearchString('id');
    const proCode = getSearchString('proCode');
    handleGetMsgByUpdate(id);
    handleGetBackMsgByUpdate(proCode);
    console.log('详情', saveMsgByUpdate, '回显', saveBackMsgByUpdate);
  }, []);

  /**
   * 词汇字典
   * @method  handleWordDictionaryFetch
   * @param dictCode {string} 词汇代码
   */
  const handleWordDictionaryFetch = (dictCode, type) => {
    dispatch({
      type: 'productOfferingPeriodUpdate/handleWordDictionaryFetch',
      payload: { dictCode, type },
    });
  };
  // 产品名称下拉框
  const handleProductSelection = proStage => {
    dispatch({
      type: 'productOfferingPeriodUpdate/handleProductSearch',
      payload: { proStage },
    });
  };
  /**
   * 方法 查询详情
   * @param {*} id
   */
  const handleGetMsgByUpdate = id => {
    dispatch({
      type: 'productOfferingPeriodUpdate/handleMsgByUpdate',
      payload: { id },
    });
  };
  /**
   * 方法 回显信息
   * @param {*} proCode
   */
  const handleGetBackMsgByUpdate = proCode => {
    dispatch({
      type: 'productOfferingPeriodUpdate/handleGetBackMsgByUpdate',
      payload: { proCode },
    });
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
  // 根据产品名称回显信息
  const handleBackMsg = proCode => {
    dispatch({
      type: 'productOfferingPeriodUpdate/handleGetBackMsgByAdd',
      payload: { proCode },
    }).then(data => {
      setFieldsValue({
        proCode: data.proCode,
        upstairsSeries: data.upstairsSeries,
        proFname: data.proFname,
        canOwnfundParticipation: 1, // TODO
        ownFundsDate: data.ownFundsDate,
        raiseEdateExpect: data.raiseEdateExpect,
        raiseAmountExpect: data.raiseAmountExpect,
      });
      saveBtnMsg.proCode = data.proCode;
      // TODO risk：风险等级字典； type: 资产类型字典
      handleWordDictionaryFetch('S001,A002,T001', 'risk');
      handleWordDictionaryFetch('S001,A002,T001', 'type');
    });
  };
  // 募集开始日
  function onchangeStart(date) {
    console.log(date);
  }
  function onchangeEnd(date) {
    console.log(date);
  }
  function onchangeSelfStart(date) {
    saveBtnMsg.ownFundsDate = date;
  }
  function onChangeRadio(e) {
    setRadioValue(e.target.checked ? '1' : '0');
  }
  // 调整募集结束日限制
  function disabledDate(current) {
    return current && current < moment(saveBtnMsg.ownFundsDate, 'YYYY-MM-DD').add('day', 5);
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
                  initialValue: saveBackMsgByUpdate.proName,
                  rules: [
                    {
                      required: true,
                      message: '产品名称不能为空',
                    },
                  ],
                })(
                  handleMapList(
                    saveProductSelection,
                    'proCode',
                    'proName',
                    'multipe',
                    true,
                    chosseProName,
                  ),
                )}
              </FormItem>
            </Col>
            <Col md={8} sm={24}>
              <FormItem label="产品代码">
                {getFieldDecorator('proCode', {
                  initialValue: saveBackMsgByUpdate.proCode ? saveBackMsgByUpdate.proCode : '',
                })(<Input placeholder="请输入" disabled />)}
              </FormItem>
            </Col>
            <Col md={8} sm={24}>
              <FormItem label="产品系列">
                {getFieldDecorator('upstairsSeries', {
                  initialValue: saveBackMsgByUpdate.upstairsSeries,
                })(handleMapList([], 'name', 'code', 'multipe'))}
              </FormItem>
            </Col>
            <Col md={8} sm={24}>
              <FormItem label="产品简称">
                {getFieldDecorator('proFname', {
                  initialValue: saveBackMsgByUpdate.proFname,
                })(<Input placeholder="请输入" disabled />)}
              </FormItem>
            </Col>
            <Col md={8} sm={24}>
              <FormItem label="资产类型">
                {getFieldDecorator('proType', {
                  initialValue: saveBackMsgByUpdate.proType,
                })(handleMapList(saveTypeDictionaryFetch || [], 'name', 'code', 'multipe'))}
              </FormItem>
            </Col>
            <Col md={8} sm={24}>
              <FormItem label="风险等级">
                {getFieldDecorator('proRisk', {
                  initialValue: saveBackMsgByUpdate.proRisk,
                })(handleMapList(saveRiskDictionaryFetch || [], 'name', 'code', 'multipe'))}
              </FormItem>
            </Col>
            <Col md={8} sm={24}>
              <FormItem label="是否允许自有资金参与">
                {getFieldDecorator('canOwnfundParticipation', {
                  initialValue: saveBackMsgByUpdate.canOwnfundParticipation,
                })}
                <Radio.Group onChange={() => onChangeRadio}>
                  <Radio value="0">是</Radio>
                  <Radio value="1">否</Radio>
                </Radio.Group>
              </FormItem>
            </Col>
            <Col md={8} sm={24}>
              <FormItem label="自有资金参与公告日:">
                {getFieldDecorator('ownFundsDate', {
                  initialValue: saveBackMsgByUpdate.ownFundsDate,
                })}
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
                {getFieldDecorator('raiseSdate', {
                  initialValue: saveBackMsgByUpdate.raiseSdate,
                })}
                <DatePicker onChange={onchangeStart} disabled />
              </FormItem>
            </Col>
            <Col md={12} sm={24}>
              <FormItem label="计划募集结束日:">
                {getFieldDecorator('raiseEdateExpect', {
                  initialValue: saveBackMsgByUpdate.raiseEdateExpect,
                })}
                <DatePicker onChange={onchangeEnd} disabled />
              </FormItem>
            </Col>
            <Col md={12} sm={24}>
              <FormItem label="预计募集金额:">
                {getFieldDecorator('raiseAmountExpect', {
                  initialValue: saveBackMsgByUpdate.raiseAmountExpect,
                })(<Input disabled />)}
              </FormItem>
            </Col>
            <Col md={12} sm={24}>
              <FormItem label="调整类型:">
                {getFieldDecorator('adjustmentType', {
                  initialValue: saveMsgByUpdate.adjustmentType,
                })}
                <Radio.Group>
                  <Radio value="0">延后</Radio>
                  <Radio value="1">提前</Radio>
                </Radio.Group>
              </FormItem>
            </Col>
            <Col md={12} sm={24}>
              <FormItem label="调整计划募集结束日:">
                {getFieldDecorator('adjustEndDate', {
                  initialValue: saveMsgByUpdate.adjustEndDate,
                })}
                <DatePicker
                  onChange={onchangeEnd}
                  format="YYYY-MM-DD"
                  disabledDate={disabledDate}
                />
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
          <h3>修改-产品募集期调整</h3>
          <div className={styles.buttonList}>
            <Button type="primary">保存</Button>
            <Button type="primary" ghost>
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
    connect(({ productOfferingPeriodUpdate }) => ({
      productOfferingPeriodUpdate,
    }))(Index),
  ),
);

export default WrappedIndexForm;
