import React, { useEffect } from 'react';
import { Card, Form } from 'antd';
import CustomFormItem from '@/components/AdvancSearch/CustomFormItem';
import { connect } from 'dva';
import { PageContainers } from '@/components';

const defaultConfig = { disabled: true, placeholder: '' };
// 交易单元管理详情
const FormComponent = Form.create()(({ detailInfoItem, formItemData, form }) => {
  const layout = {
    labelAlign: 'right',
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
  };
  useEffect(() => {
    const {
      settlementMode,
      trusteeshipId,
      applyPro,
      market,
      unitNum,
      clearNo,
      protocolCode,
      openStatus,
      operator,
      iniPwd,
    } = detailInfoItem;
    form.setFieldsValue({
      settlementMode,
      trusteeshipId,
      applyPro: applyPro.split(',').map(item => item),
      market,
      unitNum,
      clearNo,
      protocolCode,
      openStatus,
      operator,
      iniPwd,
    });
  }, [detailInfoItem]);

  return (
    <Card bordered={false}>
      <Form {...layout}>
        <CustomFormItem formItemList={formItemData} form={form} />
      </Form>
    </Card>
  );
});

const Index = ({
  dispatch,
  tradingUnitManager: { hostingList, detailInfo },
  investorReview: { codeList },
  location: {
    query: { trusteeshipId, applyPro, settlementMode },
  },
}) => {
  useEffect(() => {
    dispatch({
      type: 'tradingUnitManager/getHostingList',
      payload: {
        orgType: 'J004_2',
      },
    });
    dispatch({
      type: 'tradingUnitManager/getBrokerList',
      payload: {
        qualifyType: 'J001_1',
      },
    });
    dispatch({
      type: 'investorReview/getDicsByTypes',
      payload: ['T004', 'T003', 'T002', 'SM001'],
    });
    dispatch({
      type: 'tradingUnitManager/getTrandingBoothInfo',
      payload: {
        trusteeshipId,
        applyPro,
        settlementMode,
      },
    });
  }, []);

  const formItemData = item => {
    return [
      {
        name: 'settlementMode',
        label: '结算模式',
        type: 'select',
        config: defaultConfig,
        option: codeList.SM001,
      },
      {
        name: 'trusteeshipId',
        label: `${item.settlementMode === 'SM001_1' ? '托管人' : '交易单元所属'}`,
        type: 'select',
        config: defaultConfig,
        readSet: { name: 'orgName', code: 'id' },
        option: hostingList,
      },
      {
        name: 'applyPro',
        label: '适用产品',
        type: 'select',
        config: { ...defaultConfig, mode: 'multiple' },
        option: codeList.T004,
      },
      {
        name: 'market',
        label: '交易市场',
        type: 'select',
        config: defaultConfig,
        option: codeList.T003,
      },
      {
        name: 'unitNum',
        label: '交易单元号',
        config: defaultConfig,
      },
      {
        name: 'clearNo',
        label: '清算编号',
        config: defaultConfig,
      },
      {
        name: 'protocolCode',
        label: '协议编码',
        config: defaultConfig,
      },
      {
        name: 'openStatus',
        label: '开通状态',
        type: 'select',
        config: defaultConfig,
        option: [
          { name: '已开通', code: '1' },
          { name: '未开通', code: '0' },
        ],
      },
      {
        name: 'operator',
        label: '交易单元操作员号',
        config: defaultConfig,
        unRender: item.market !== 'T003_1',
      },
      {
        name: 'iniPwd',
        label: '初始密码',
        config: defaultConfig,
        unRender: item.market !== 'T003_1',
      },
    ];
  };

  return (
    <PageContainers
      breadcrumb={[
        {
          title: '产品数据管理',
          url: '',
        },
        {
          title: '交易单元管理',
          url: '/productDataManage/tradingUnitManager/index',
        },
        {
          title: '查看',
          url: '',
        },
      ]}
    >
      {detailInfo &&
        detailInfo.map((item, index) => (
          <FormComponent key={index} detailInfoItem={item} formItemData={formItemData(item)} />
        ))}
    </PageContainers>
  );
};

export default connect(({ dispatch, tradingUnitManager, investorReview }) => ({
  dispatch,
  tradingUnitManager,
  investorReview,
}))(Index);
