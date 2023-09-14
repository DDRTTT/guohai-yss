import React, { useEffect, useMemo, useState } from 'react';
import { connect } from 'dva';
import { router } from 'umi';
import { deletNUllProperty, handleValidator } from '@/utils/utils';
import { Button, Col, Form, Input } from 'antd';
import Gird from '@/components/Gird';
import { Card, PageContainers } from '@/components';
import styles from './index.less';

const Index = props => {
  const {
    dispatch,
    saveLoading,
    location: {
      query: { type, id, proCode },
    },
    stakeholdersTypeList, //干系人类型
    codeList, //证件类型
    productEnum, //产品全称
    orgNameList, //机构名称
    nameList, //姓名
  } = props;

  const [amsProductInfo, setAmsProductInfo] = useState({});
  const [stakeholderInfoVo, setStakeholderInfoVo] = useState({});

  useEffect(() => {
    // 获取证件类型
    dispatch({
      type: 'investorReview/getDicsByTypes',
      payload: ['certificateType'],
    });
    // 获取产品下拉列表
    dispatch({
      type: 'stakeholderInfoManager/getProductEnumList',
    });
    // 获取干系人详情
    dispatch({
      type: 'stakeholderInfoManager/getStakeholdersQueryById',
      payload: { proCode, id },
      callback: res => {
        setAmsProductInfo(res.amsProductInfoVO);
        setStakeholderInfoVo(res.stakeholderInfoVo);
      },
    });
  }, []);
  useEffect(() => {
    // 获取姓名下拉列表
    dispatch({
      type: 'stakeholderInfoManager/getNameList',
      payload:
        stakeholderInfoVo.category * 1 == 1
          ? {
              orgId: stakeholderInfoVo.agencyName,
            }
          : {},
      categoryType: stakeholderInfoVo.category,
    });
  }, [stakeholderInfoVo]);

  const drawerConfigForProduct = [
    {
      label: '产品全称',
      value: 'proCode',
      type: 'select',
      option: productEnum,
      optionConfig: { name: 'proName', code: 'proCode' },
    },
    { label: '产品简称', value: 'proFname' },
    { label: '产品代码', value: 'proCode' },
    { label: '系列名称', value: 'upstairsSeries' },
    { label: '产品类型', value: 'proType' },
    { label: '风险等级', value: 'proRisk' },
  ];
  const drawerConfigForStakeholder = [
    {
      label: '类别',
      value: 'category',
      type: 'select',
      option: [
        { name: '内部干系人', code: 0 },
        { name: '外部干系人', code: 1 },
      ],
    },
    { label: '干系人类型', value: 'stakeholderType', type: 'select', option: stakeholdersTypeList },
    {
      label: '机构名称',
      value: 'agencyName',
      type: 'select',
      option: orgNameList,
      optionConfig: { name: 'orgName', code: 'id' },
    },
    {
      label: '姓名',
      value: 'name',
      type: 'select',
      option: nameList,
      optionConfig: { name: 'name', code: 'id' },
    },
    {
      label: '证件类型',
      value: 'certificateType',
      type: 'select',
      option: codeList.certificateType,
    },
    { label: '证件号码', value: 'idNumber' },
    { label: '座机号', value: 'phoneNumber' },
    { label: '手机号', value: 'mobilePhone' },
    { label: '邮箱', value: 'email' },
    { label: '开始任职日期', value: 'startDate' },
    { label: '任职公告日期', value: 'appointmentDate' },
    { label: '离任日期', value: 'departureDate' },
    { label: '离任公告日期', value: 'departureNoticeDate' },
    { label: '办公时间', value: 'officeHours', proportion: true },
    { label: '备注', value: 'remarks', proportion: true },
  ];

  return (
    <>
      <PageContainers
        breadcrumb={[
          { title: '产品数据管理', url: '' },
          { title: '干系人信息管理', url: '/productDataManage/stakeholderInfoManager/index' },
          { title: '查看', url: '' },
        ]}
      />
      <Card
        title="详情"
        extra={[
          <Button key="cancle" onClick={() => router.goBack()}>
            返回
          </Button>,
        ]}
      >
        <h1 style={{ fontSize: 16, marginTop: '20px', marginLeft: '20px' }}>产品信息</h1>
        <Gird config={drawerConfigForProduct} info={amsProductInfo} />
        <h1 style={{ fontSize: 16, marginTop: '20px', marginLeft: '20px', clear: 'both' }}>
          干系人信息
        </h1>
        <Gird config={drawerConfigForStakeholder} info={stakeholderInfoVo} />
      </Card>
    </>
  );
};

const data = state => {
  const {
    investorReview: { codeList },
    stakeholderInfoManager: { stakeholdersTypeList, productEnum, orgNameList, nameList },
    dispatch,
    loading,
  } = state;
  return {
    dispatch,
    codeList,
    stakeholdersTypeList,
    productEnum,
    orgNameList,
    nameList,
    saveLoading: loading.effects['stakeholderInfoManager/addMap'],
  };
};

export default connect(data)(Index);
