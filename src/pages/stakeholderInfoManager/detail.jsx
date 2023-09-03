import React, { useEffect, useMemo, useState } from 'react';
import { Button, Col, Form, Input } from 'antd';
import CustomFormItem from '@/components/AdvancSearch/CustomFormItem';
import { connect } from 'dva';
import { router } from 'umi';
import { deletNUllProperty, handleValidator } from '@/utils/utils';
import moment from 'moment';
import styles from './index.less';
import { Card, PageContainers } from '@/components';
import Gird from '@/components/Gird';

const { TextArea } = Input;

const titleEnum = { add: '新增', modify: '修改', show: '详情' };
const Index = props => {
  const {
    form,
    location: {
      query: { type, id, proCode },
    },
    stakeholdersTypeList,
    dispatch,
    codeList,
    productEnum,
    orgNameList,
    nameList,
    saveLoading,
  } = props;
  const { getFieldDecorator, getFieldsValue, validateFieldsAndScroll } = form;
  const [categoryType, setCategoryType] = useState();
  const [amsProductInfo, setAmsProductInfo] = useState({});
  const [stakeholderInfoVo, setStakeholderInfoVo] = useState({});
  // 如果是新增的时候,选择内部干系人 把投资经理删掉
  const stakeholdersTypeListMemo = useMemo(() => {
    return () => {
      if (type === 'add') {
        const temp = [];
        stakeholdersTypeList.forEach(item => {
          if (item.code !== 'investmentManager') {
            temp.push(item);
          }
        });
        return temp;
      }
      return stakeholdersTypeList;
    };
  }, [stakeholdersTypeList]);

  //   获取能不能支持disabled
  const getDisabled = () => type === 'show';

  // 查看和修改的情况证件类型之前的都置灰
  const spicalDisabled = () => {
    return { disabled: type === 'show' || type === 'modify' };
  };

  // 反显数据
  const invertFunc = (value = {}) => {
    const {
      certificateType,
      idNumber,
      phoneNumber,
      mobilePhone,
      email,
      startDate,
      appointmentDate,
      departureDate,
      departureNoticeDate,
      remarks,
      officeHours,
    } = value;
    form.setFieldsValue({
      certificateType,
      idNumber,
      phoneNumber,
      mobilePhone,
      email,
      startDate: startDate && moment(startDate),
      appointmentDate: appointmentDate && moment(appointmentDate),
      departureDate: departureDate && moment(departureDate),
      departureNoticeDate: departureNoticeDate && moment(departureNoticeDate),
      remarks,
      officeHours,
    });
  };

  // 默认的config
  const defultConfig = { ...getDisabled(), placeholder: getDisabled() ? '' : '请输入' };
  const productInfo = [
    {
      name: 'proName',
      label: '产品全称',
      type: 'select',
      config: {
        ...getDisabled(),
        ...spicalDisabled(),
        onChange: e => {
          dispatch({
            type: 'stakeholderInfoManager/getProInfo',
            payload: {
              proCode: e,
            },
            callback: data => {
              const {
                proCode = '',
                proFname = '',
                proRisk = '',
                proType = '',
                upstairsSeries = '',
              } = data;
              form.setFieldsValue({
                proCode,
                proFname,
                proRisk,
                proType,
                upstairsSeries,
              });
            },
          });
        },
        placeholder: getDisabled() ? '' : '请选择',
      },
      rules: [{ required: true, message: '请选择产品全称' }],
      readSet: { name: 'proName', code: 'proCode' },
      option: productEnum,
    },
    {
      name: 'proFname',
      label: '产品简称',
      config: { disabled: true, placeholder: '' },
    },
    {
      name: 'proCode',
      label: '产品代码',
      config: { disabled: true, placeholder: '' },
    },
    {
      name: 'upstairsSeries',
      label: '系列名称',
      config: { disabled: true, placeholder: '' },
    },
    {
      name: 'proType',
      label: '产品类型',
      //   type: 'select',
      config: { disabled: true, placeholder: '' },
    },
    {
      name: 'proRisk',
      label: '风险等级',
      //   type: 'select',
      config: { disabled: true, placeholder: '' },
    },
  ];
  const stakeholderInfo = [
    {
      name: 'category',
      label: '类别',
      type: 'radio',
      option: [
        {
          name: '内部干系人',
          code: 0,
        },
        {
          name: '外部干系人',
          code: 1,
        },
      ],
      config: {
        disabled: spicalDisabled().disabled,
        rules: [{ required: true, message: '请选择干系人类别' }],
        onChange:e =>{
          handlerCategoryChange(e)
        }
      },
    },
    {
      name: 'stakeholderType',
      label: '干系人类型',
      type: 'select',
      config: {
        ...defultConfig,
        ...spicalDisabled(),
        placeholder: spicalDisabled().disabled ? '' : '请选择',
        onChange: () => {
          form.resetFields(['agencyName', 'name']);
          invertFunc();
          dispatch({
            type: 'stakeholderInfoManager/getOrgNameList',
          });
        },
      },
      rules: [{ required: true, message: '请选择干系人类型' }],
      option: stakeholdersTypeListMemo(),
    },
    {
      name: 'agencyName',
      label: '机构名称',
      type: 'select',
      config: {
        ...defultConfig,
        ...spicalDisabled(),
        placeholder: spicalDisabled().disabled ? '' : '请选择',
        onChange: e => {
          form.resetFields(['name']);
          invertFunc();
          // 获取机构下拉
          dispatch({
            type: 'stakeholderInfoManager/getNameList',
            payload:
              categoryType == 1
                ? {
                    orgId: e,
                  }
                : {},
            categoryType,
          });
        },
      },
      rules: [{ required: true, message: '请选择机构名称' }],
      option: orgNameList,
      readSet: { name: 'orgName', code: 'id' },
    },
    {
      name: 'name',
      label: '姓名',
      type: 'select',
      config: {
        ...defultConfig,
        ...spicalDisabled(),
        placeholder: spicalDisabled().disabled ? '' : '请选择',
        onChange: e => {
          dispatch({
            type: 'stakeholderInfoManager/getEmployeesDetail',
            payload: {
              category: getFieldsValue(['category']).category,
              id: +e,
            },
          }).then(res => {
            if (!res) return;
            invertFunc(res);
          });
        },
      },
      rules: [{ required: true, message: '请选择名称' }],
      option: nameList,
      // readSet: { name: 'name', code: !categoryType ? 'empNo' : 'id' },
      readSet: { name: 'name', code: 'id' },
    },
    {
      name: 'certificateType',
      label: '证件类型',
      type: 'select',
      config: {
        ...defultConfig,
        placeholder: getDisabled() ? '' : '请选择',
      },
      option: codeList.certificateType,
    },
    {
      name: 'idNumber',
      label: '证件号码',
      config: defultConfig,
      rules: [
        { pattern: /^\w+$/, message: '请输入正确的证件号码' },
        {
          validator: (rule, value, callback) => {
            if (!value) callback();
            try {
              if (getFieldsValue(['certificateType']).code == 'idCard') {
                const reg = /^(\d{18,18}|\d{15,15}|\d{17,17}X)$/;
                if (!reg.test(value)) {
                  callback('请输入正确的证件号码');
                }
                callback();
              } else if (getFieldsValue(['certificateType']).code == 'passport') {
                const reg = /^1[45][0-9]{7}$|(^[P|p|S|s]\d{7}$)|(^[S|s|G|g|E|e]\d{8}$)|(^[Gg|Tt|Ss|Ll|Qq|Dd|Aa|Ff]\d{8}$)|(^[H|h|M|m]\d{8,10}$)/;
                if (!reg.test(value)) {
                  callback('请输入正确的证件号码');
                }
                callback();
              }
              callback();
            } catch (error) {
              callback();
            }
            callback();
          },
        },
      ],
    },
    {
      name: 'phoneNumber',
      label: '座机号',
      config: defultConfig,
      rules: [{ pattern: /^(0\d{2,3}-\d{7,8})|(\d{7,8})$/, message: '请输入正确的座机号' }],
    },
    {
      name: 'mobilePhone',
      label: '手机号',
      config: defultConfig,
      rules: [{ pattern: /(^1[0-9]{10}$)|(^\+\d{13}$)/, message: '请输入正确的手机号' }],
    },
    {
      name: 'email',
      label: '邮箱',
      config: defultConfig,
      rules: [{ type: 'email', message: '请输入正确的邮箱' }],
    },
    {
      name: 'startDate',
      label: '开始任职日期',
      type: 'datepicker',
      config: { ...defultConfig, placeholder: getDisabled() ? '' : '请选择日期' },
      unRender: !!categoryType,
    },
    // {
    //   name: 'appointmentDate',
    //   label: '任职公告日期',
    //   type: 'datepicker',
    //   config: { ...defultConfig, placeholder: getDisabled() ? '' : '请选择日期' },
    //   unRender: !!categoryType,
    // },
    {
      name: 'departureDate',
      label: '离任日期',
      type: 'datepicker',
      config: { ...defultConfig, placeholder: getDisabled() ? '' : '请选择日期' },
      unRender: !!categoryType,
      rules: [
        {
          validator: (rule, value, callback) => {
            if (!value) callback();
            try {
              if (value.isSameOrBefore(getFieldsValue(['startDate']).startDate)) {
                callback('离任日期不能小于开始任职日期');
              }
            } catch (error) {
              callback();
            }
            callback();
          },
        },
      ],
    },
    // {
    //   name: 'departureNoticeDate',
    //   label: '离任公告日期',
    //   type: 'datepicker',
    //   config: { ...defultConfig, placeholder: getDisabled() ? '' : '请选择日期' },
    //   unRender: !!categoryType,
    //   rules: [
    //     {
    //       validator: (rule, value, callback) => {
    //         if (!value) callback();
    //         try {
    //           if (value.isSameOrBefore(getFieldsValue(['appointmentDate']).appointmentDate)) {
    //             callback('离任公告日期不能小于任职公告日期');
    //           }
    //         } catch (error) {
    //           callback();
    //         }
    //         callback();
    //       },
    //     },
    //   ],
    // },
    // {
    //   name: 'officeHours',
    //   label: '办公时间',
    //   type: 'area',
    //   width: 24,
    //   config: defultConfig,
    //   formItemConfig: { labelCol: { span: 3 }, wrapperCol: { span: 21 } },
    // },
    // {
    //   name: 'remarks',
    //   label: '备注',
    //   type: 'area',
    //   width: 24,
    //   config: defultConfig,
    //   formItemConfig: { labelCol: { span: 3 }, wrapperCol: { span: 21 } },
    // },
  ];

  useEffect(() => {
    dispatch({
      type: 'investorReview/getDicsByTypes',
      payload: ['certificateType'],
    });
    dispatch({
      type: 'stakeholderInfoManager/getProductEnumList',
    });
    // dispatch({
    //   type: 'stakeholderInfoManager/getOrgNameList',
    // });
    if (type != 'add') {
      dispatch({
        type: 'stakeholderInfoManager/getStakeholdersQueryById',
        payload: { proCode, id },
        callback: res => {
          setAmsProductInfo(res.amsProductInfoVO)
          setStakeholderInfoVo(res.stakeholderInfoVo)
          const obj = {};
          productInfo.map(item => (obj[item.name] = res.amsProductInfoVO[item.name]));
          stakeholderInfo.map(item => {
            obj[item.name] =
              item.type != 'datepicker'
                ? res.stakeholderInfoVo[item.name]
                : res.stakeholderInfoVo[item.name]
                ? moment(res.stakeholderInfoVo[item.name])
                : '';
          });
          deletNUllProperty(obj);
          const tempCategory = res.stakeholderInfoVo.category;
          setCategoryType(tempCategory);
          form.setFieldsValue({
            category: tempCategory,
            officeHours: res.stakeholderInfoVo.officeHours,
            remarks: res.stakeholderInfoVo.remarks,
            ...obj,
          });
          dispatch({
            type: 'stakeholderInfoManager/getStakeholdersTypeList',
            payload: {
              flag: tempCategory,
            },
          });
          dispatch({
            type: 'stakeholderInfoManager/getNameList',
            payload:
              tempCategory * 1 == 1
                ? {
                    orgId: res.stakeholderInfoVo.agencyName,
                  }
                : {},
            categoryType: tempCategory,
          });
        },
      });
    }
  }, []);
  //   保存数据
  const handlerSubmit = () => {
    validateFieldsAndScroll((err, values) => {
      if (err) {
        return;
      }
      values.departureNoticeDate =
        (values.departureNoticeDate && values.departureNoticeDate.format('YYYY-MM-DD')) || '';
      values.departureDate =
        (values.departureDate && values.departureDate.format('YYYY-MM-DD')) || '';
      values.appointmentDate =
        (values.appointmentDate && values.appointmentDate.format('YYYY-MM-DD')) || '';
      values.startDate = (values.startDate && values.startDate.format('YYYY-MM-DD')) || '';
      values.name = (values.name && `${values.name}`) || '';
      values.id = id;

      dispatch({
        type: 'stakeholderInfoManager/addMap',
        payload: { stakeholderInfoVo: values },
        callback: () => {
          router.goBack();
        },
      });
    });
  };
  //   类别切换
  const handlerCategoryChange = e => {
    setCategoryType(e.target.value);
    // form.resetFields(['stakeholderType', 'agencyName', 'name']);
    form.resetFields(stakeholderInfo.map(item => item.name));
    // 清空姓名的下拉框选项
    dispatch({
      type: 'stakeholderInfoManager/setResetList',
      payload: [],
    });
    // 获取干系人类型下拉
    dispatch({
      type: 'stakeholderInfoManager/getStakeholdersTypeList',
      payload: {
        flag: e.target.value,
      },
    });
    // // 获取机构下拉
    // dispatch({
    //   type: 'stakeholderInfoManager/getOrgNameList',
    //   categoryType: e.target.value,
    // });
  };
  // 字节长度校验
  const handleParentNameValidator = (rule, value, callback) => {
    if (!value) callback();
    handleValidator(value, callback, 2400, '输入的长度超过限制 , 请重新输入 !');
  };
  const layout = {
    labelAlign: 'right',
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
  };
  const drawerConfigForProduct = [
    { label: '产品全称', value: 'proCode', type: 'select', option: productEnum, optionConfig: { name: 'proName', code: 'proCode' } },
    { label: '产品简称', value: 'proFname' },
    { label: '产品代码', value: 'proCode' },
    { label: '系列名称', value: 'upstairsSeries' },
    { label: '产品类型', value: 'proType' },
    { label: '风险等级', value: 'proRisk' },
  ]
  const drawerConfigForStakeholder = [
    { label: '类别', value: 'category', type: 'select', option: [{ name: '内部干系人', code: 0, }, { name: '外部干系人', code: 1, }] },
    { label: '干系人类型', value: 'stakeholderType', type: 'select', option: stakeholdersTypeList },
    { label: '机构名称', value: 'agencyName', type: 'select', option: orgNameList || [], optionConfig: { name: 'orgName', code: 'id' } },
    { label: '姓名', value: 'name', type: 'select', option: nameList || [], optionConfig: { name: 'name', code: 'id' } },
    { label: '证件类型', value: 'certificateType', type: 'select', option: codeList.certificateType },
    { label: '证件号码', value: 'idNumber' },
    { label: '座机号', value: 'phoneNumber' },
    { label: '手机号', value: 'mobilePhone' },
    { label: '邮箱', value: 'email' },
    { label: '开始任职日期', value: 'startDate' },
    // { label: '任职公告日期', value: 'appointmentDate' },
    { label: '离任日期', value: 'departureDate' },
    // { label: '离任公告日期', value: 'departureNoticeDate' },
    { label: '办公时间', value: 'officeHours', proportion: true },
    { label: '备注', value: 'remarks', proportion: true },
  ]
  return (
    <PageContainers
      breadcrumb={[
        {
          title: '产品数据管理',
          url: '',
        },
        {
          title: '干系人信息管理',
          url: '/productDataManage/stakeholderInfoManager/index',
        },
        {
          title: type === 'show' ? '查看' : '修改',
          url: '',
        },
      ]}
    >
      <div className={styles.detailPage}>
        <Card
          title='详情'
          extra={[<Button key="cancle" onClick={() => router.goBack()}>返回</Button>]}
          >
          <div className="scollWrap none-scroll-bar">
            <h1 style={{marginTop: '20px', marginLeft: '20px' }} className={'font-w600'}>产品信息</h1>
            <Gird config={drawerConfigForProduct} info={amsProductInfo} />
            <h1 style={{marginTop: '20px', marginLeft: '20px', clear: 'both' }} className={'font-w600'}>干系人信息</h1>
            <Gird config={drawerConfigForStakeholder} info={stakeholderInfoVo} />
          </div>
        </Card>
      </div>
    </PageContainers>
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
export default Form.create()(connect(data)(Index));