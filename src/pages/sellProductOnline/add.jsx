import React, { useEffect } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Form, Input, Button, Collapse, Select } from 'antd';
import { errorBoundary } from '@/layouts/ErrorBoundary';
import { connect } from 'dva';
import styles from './index.less';

const { Panel } = Collapse;
const { Option } = Select;

/**
 * 销售机构信息已展开的key值
 * @method  handleGetCollapseKeya
 */
function handleGetCollapseKey(/* key */) {
  // console.log(key);
}

const SpoForm = ({
  form: { getFieldDecorator, validateFields, setFieldsValue },
  dispatch,
  sellProductOnline: { proName /* , getproNameData */ },
}) => {
  useEffect(() => {
    dispatch({
      type: 'sellProductOnline/proName',
      payload: '',
    });
  }, []);

  /**
   * 表单数据获取/提交
   * @method  handleSubmit
   */
  const handleSubmit = e => {
    e.preventDefault();
    validateFields((err, value) => {
      if (!err) {
        const formData = {
          // businessType: value.businessType,
          // entrustWay: value.entrustWay,
          // shareType: value.shareType,
          // maxValue: value.maxValue,
          // minAddValue: value.minAddValue,
          productLineSellParamVO: {
            // ID: value.id,
            onlineChannel: value.onlineChannel,
            riskStationCheck: value.riskStationCheck,
          },
          productLineSellProductVO: {
            proCode: value.proCode,
            proName: value.proName,
            proShortName: value.proShortName,
            proGroupName: value.proGroupName,
            assetType: value.assetType,
            riskLevel: value.riskLevel,
            proTrustee: value.proTrustee,
            registerOrgName: value.registerOrgName,
            proCustodian: value.proCustodian,
            proTrusBank: value.proTrusBank,
            proCdate: value.proCdate,
            proSdate: value.proSdate,
            proDuration: value.proDuration,
            faceValue: value.faceValue,
            settlementCurrency: value.settlementCurrency,
          },
          // productLineSellRaiseInfoVO: {
          //   raiseSdate: formData.raiseSdate,
          //   raiseEdate: formData.raiseEdate,
          //   expAmount: formData.expAmount,
          //   subsStart: formData.subsStart,
          //   minSubsAmount: formData.minSubsAmount,
          //   minAppendAmount: formData.minAppendAmount,
          //   minRaiseAmount: formData.minRaiseAmount,
          //   maxRaiseAmount: formData.maxRaiseAmount,
          //   defaultBonusMethod: formData.defaultBonusMethod,
          // },
          // productLineSalesOrgVOList: [
          // {
          //   sellerCode: formData.sellerCode,
          //   sellerName: formData.sellerName,
          //   sellerType: formData.sellerType,
          //   channelType: formData.channelType,
          //   zdSettlePlace: formData.zdSettlePlace,
          //   remarks: formData.remarks,
          // },
          // ],
        };
        const formValues = JSON.stringify(formData);
        // console.log(formValues);
        dispatch({
          type: `sellProductOnline/submitForm`,
          payload: {
            params: formValues,
          },
        });
      }
    });
  };

  // 选择产品名称获取回显信息
  const chosseProName = proCode => {
    dispatch({
      type: 'sellProductOnline/getproNameData',
      payload: {
        proCode,
      },
      callback: res => {
        setFieldsValue({
          // 上线信息
          // onlineChannel: res.productLineSellParamVO.onlineChannel,
          // riskStationCheck: res.productLineSellParamVO.riskStationCheck,
          // 产品信息
          proCode: res.productLineSellProductVO.proCode,
          proName: res.productLineSellProductVO.proName,
          proShortName: res.productLineSellProductVO.proShortName,
          proGroupName: res.productLineSellProductVO.proGroupName,
          assetType: res.productLineSellProductVO.assetType,
          riskLevel: res.productLineSellProductVO.riskLevel,
          proRecordType: res.productLineSellProductVO.proRecordType,
          proCustodian: res.productLineSellProductVO.proCustodian,
          proTrustee: res.productLineSellProductVO.proTrustee,
          proCdate: res.productLineSellProductVO.proCdate,
          proSdate: res.productLineSellProductVO.proSdate,
          registerOrgName: res.productLineSellProductVO.registerOrgName,
          faceValue: res.productLineSellProductVO.faceValue,
          settlementCurrency: res.productLineSellProductVO.settlementCurrency,
          // 募集信息
          // expAmount: res.productLineSellRaiseInfoVO.expAmount,
          // subsStart: res.productLineSellRaiseInfoVO.subsStart,
          // minSubsAmount: res.productLineSellRaiseInfoVO.minSubsAmount,
          // minAppendAmount: res.productLineSellRaiseInfoVO.minAppendAmount,
          // minRaiseAmount: res.productLineSellRaiseInfoVO.minRaiseAmount,
          // maxRaiseAmount: res.productLineSellRaiseInfoVO.maxRaiseAmount,
          // defaultBonusMethod: res.productLineSellRaiseInfoVO.defaultBonusMethod,
        });
      },
    });
  };

  /**
   * 表单数据保存
   * @method    handleFormReset    方法名
   * @param     e                  event点击
   * @returns   {htmlType}         标签集合
   */
  const handleCanSaveData = e => {
    e.preventDefault();
    validateFields((err, value) => {
      if (!err) {
        const formData = {
          ID: value.id,
          businessType: value.businessType,
          entrustWay: value.entrustWay,
          shareType: value.shareType,
          maxValue: value.maxValue,
          minAddValue: value.minAddValue,
          onlineChannel: value.onlineChannel,
          riskStationCheck: value.riskStationCheck,
          productLineSellProductVO: {
            proCode: value.proCode,
            proName: value.proName,
            proShortName: value.proShortName,
            proGroupName: value.proGroupName,
            assetType: value.assetType,
            riskLevel: value.riskLevel,
            proTrustee: value.proTrustee,
            registerOrgName: value.registerOrgName,
            proCustodian: value.proCustodian,
            proTrusBank: value.proTrusBank,
            proCdate: value.proCdate,
            proSdate: value.proSdate,
            proDuration: value.proDuration,
            faceValue: value.faceValue,
            settlementCurrency: value.settlementCurrency,
          },
          productLineSellRaiseInfoVO: {
            raiseSdate: value.raiseSdate,
            raiseEdate: value.raiseEdate,
            expAmount: value.expAmount,
            subsStart: value.subsStart,
            minSubsAmount: value.minSubsAmount,
            minAppendAmount: value.minAppendAmount,
            minRaiseAmount: value.minRaiseAmount,
            maxRaiseAmount: value.maxRaiseAmount,
            defaultBonusMethod: value.defaultBonusMethod,
          },
          productLineSalesOrgVOList: [
            // {
            //   sellerCode: value.sellerCode,
            //   sellerName: value.sellerName,
            //   sellerType: value.sellerType,
            //   channelType: value.channelType,
            //   zdSettlePlace: value.zdSettlePlace,
            //   remarks: value.remarks,
            // },
          ],
        };
        const formValues = JSON.stringify(formData);
        // console.log(formValues);
        dispatch({
          type: `sellProductOnline/saveForm`,
          payload: {
            params: formValues,
          },
        });
      }
    });
  };

  /**
   * 创建input输入框
   * @method    handleFormReset    方法名
   * @param     inputname          输入框前缀名
   * @param     inputvalue         *form绑定的input输入框值*
   * @param     inputplaceholder   input输入框值(提示值)
   * @returns   {htmlType}         标签集合
   */
  const handleInput = (inputname, inputvalue, inputplaceholder) => {
    return (
      <Form.Item>
        <span className={styles.formSpan}>{inputname}:</span>
        {getFieldDecorator(inputvalue)(
          <Input className={styles.formInput} placeholder={inputplaceholder} />,
        )}
      </Form.Item>
    );
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
  // eslint-disable-next-line consistent-return
  const handleMapList = (data, name, code, mode = false) => {
    const e = data;
    if (e) {
      const children = [];
      // eslint-disable-next-line no-restricted-syntax
      for (const key of e) {
        const keys = key[code];
        const values = key[name];
        children.push(
          <Option key={keys} value={keys} className={styles.formInput}>
            {values}
          </Option>,
        );
      }
      return (
        <Select
          showSearch
          maxTagCount={1}
          mode={mode}
          placeholder="请选择"
          optionFilterProp="children"
          className={styles.formInput}
          onChange={chosseProName}
        >
          {children}
        </Select>
      );
    }
  };

  return (
    <PageHeaderWrapper>
      <Form className={styles.bgcFFF} layout="inline" onSubmit={handleSubmit}>
        <div className={styles.pageHeaderBox}>
          <span className={styles.formFont}>产品信息</span>
          <Form.Item>
            <Button className={styles.checkButtonSave} onClick={handleCanSaveData}>
              保存
            </Button>
            <Button className={styles.checkButtonSubmit} htmlType="submit">
              提交
            </Button>
            <Button className={styles.checkButtonflowChart}>流程图</Button>
            <Button className={styles.checkButtonDelegation}>委托</Button>
            <Button className={styles.checkButtonHandOver}>移交</Button>
            <Button className={styles.checkButtonCirculate}>传阅</Button>
            <Button className={styles.checkButtonNoPass}>退回</Button>
            <Button className={styles.checkButtonPass}>通过</Button>
            <Button className={styles.checkButtonLocationHistory}>流转历史</Button>
          </Form.Item>
        </div>
        <Form.Item>
          <span className={styles.formSpan}>产品名称:</span>
          {getFieldDecorator('propName', {
            rules: [{ required: true, message: '产品名称不能为空' }],
          })(handleMapList(proName, 'proName', 'proCode', 'multipe'))}
        </Form.Item>
        {handleInput('产品简称', 'proShortName', 'proShortName')}
        {handleInput('产品代码', 'proCode', 'proCode')}
        {handleInput('系列名称', 'proGroupName', 'proGroupName')}
        {handleInput('资产类型', 'assetType', 'assetType')}
        {handleInput('风险等级', 'riskLevel', 'riskLevel')}
        {handleInput('产品类型', 'proTrustee', 'proTrustee')}
        {handleInput('注册登记结构', 'registerOrgName', 'registerOrgName')}
        {handleInput('管理人', 'proCustodian', 'proCustodian')}
        {handleInput('托管人', 'proTrusBank', 'proTrusBank')}
        {handleInput('成立日期', 'proCdate', 'proCdate')}
        {handleInput('终止日期', 'proSdate', 'proSdate')}
        {handleInput('存续如期', 'proDuration', 'proDuration')}
        {handleInput('面值', 'faceValue', 'faceValue')}
        {handleInput('币种', 'settlementCurrency', 'settlementCurrency')}
        <div className={styles.pageHeaderBox}>
          <span className={styles.formFont}>募集信息</span>
        </div>
        {handleInput('募集开始日期', 'raiseSdate', 'raiseSdate')}
        {handleInput('募集结束日期', 'raiseEdate', 'raiseEdate')}
        {handleInput('预期募集金额', 'expAmount', 'expAmount')}
        {handleInput('认购起点', 'subsStart', 'subsStart')}
        {handleInput('最低认购额', 'minSubsAmount', 'minSubsAmount')}
        {handleInput('最低追加额', 'minAppendAmount', 'minAppendAmount')}
        {handleInput('最低募集金额', 'minRaiseAmount', 'minRaiseAmount')}
        {handleInput('最高募集金额', 'maxRaiseAmount', 'maxRaiseAmount')}
        {handleInput('默认分红方式', 'defaultBonusMethod', 'defaultBonusMethod')}
        <div className={styles.pageHeaderBox}>
          <span className={styles.formFont}>销售机构信息</span>
        </div>
        <Collapse
          bordered={false}
          defaultActiveKey={['1']}
          onChange={handleGetCollapseKey}
          className={styles.bgcFFF}
        >
          <Panel
            className={styles.bgcFFF}
            showArrow={false}
            header={
              <div>
                <span className={styles.formPanelTitle}>销售商01(多个/暂1个)</span>
                <span className={styles.formPanelSpanB}>展开</span>
              </div>
            }
            key="1"
          >
            {handleInput('销售机构代码', 'sellerCode', 'sellerCode')}
            {handleInput('销售机构名称', 'sellerName', 'sellerName')}
            {handleInput('销售机构类型', 'sellerType', 'sellerType')}
            {handleInput('渠道类型', 'channelType', 'channelType')}
            {handleInput('中登结算地点', 'zdSettlePlace', 'zdSettlePlace')}
            {handleInput('备注', 'remarks', 'remarks')}
            <h3>交易限制(上限三个/暂1个)</h3>
            {handleInput('业务类型', 'businessType', 'businessType')}
            {handleInput('委托方式', 'entrustWay', 'entrustWay')}
            {handleInput('份额类型', 'shareType', 'shareType')}
            {handleInput('最大允许值', 'maxValue', 'maxValue')}
            {handleInput('最低追加值', 'minAddValue', 'minAddValue')}
            {handleInput('表数据ID', 'id', 'id')}
          </Panel>
        </Collapse>
        <div className={styles.pageHeaderBox}>
          <span className={styles.formFont}>上线信息</span>
        </div>
        <Form.Item>
          <span className={styles.formSpan}>上线渠道:</span>
          {getFieldDecorator('onlineChannel', {
            rules: [{ required: true, message: '必填项为空!!!' }],
          })(<Input className={styles.formInput} placeholder="onlineChannel" />)}
        </Form.Item>
        <Form.Item>
          <span className={styles.formSpan}>是否需要风险岗审核:</span>
          {getFieldDecorator('riskStationCheck', {
            rules: [{ required: true, message: '必填项为空!!!' }],
          })(<Input className={styles.formInput} placeholder="riskStationCheck" />)}
        </Form.Item>
      </Form>
    </PageHeaderWrapper>
  );
};

const WrappedForm = errorBoundary(
  Form.create()(
    connect(({ sellProductOnline }) => ({
      sellProductOnline,
    }))(SpoForm),
  ),
);

export default WrappedForm;
