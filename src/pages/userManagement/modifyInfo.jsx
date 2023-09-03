import React, { useEffect } from 'react';
import { Form, Modal, Row } from 'antd';
import { connect } from 'dva';
import CustomFormItem from '@/components/AdvancSearch/CustomFormItem';

const ModifyInfo = ({
  showModifyPannel,
  setShowModifyPannel,
  dispatch,
  form,
  form: { validateFieldsAndScroll },
  userauthed,
  saveGetDept,
  userId,
  refreshFunc,
  workSpace: {
    GET_USER_SYSID,
    SAVE_DATA_DICTIONARY: { attributionSystem },
  },
}) => {
  useEffect(() => {
    if (dispatch) {
      dispatch({
        type: 'workSpace/GET_USER_SYSID_FETCH',
      });
      dispatch({
        type: 'workSpace/DATA_DICTIONARY_FETCH',
        payload: {
          codeList: 'attributionSystem',
        },
      });
    }
  }, []);

  const layout = {
    labelAlign: 'right',
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
  };

  const defaultConfig = {
    config: {
      //   disabled: true,
    },
  };

  const productInfo = [
    {
      name: 'username',
      label: '用户名',
      rules: [{ required: true, message: '请输入用户名' }],
      ...defaultConfig,
      initialValue: userauthed.username,
      config: {
        disabled: true,
      },
    },
    {
      name: 'usercode',
      label: '登录名',
      rules: [{ required: true, message: '请输入登录名' }],
      ...defaultConfig,
      initialValue: userauthed.usercode,
    },
    {
      name: 'sex',
      label: '性别',
      type: 'select',
      option: [
        { name: '男', code: 0 },
        { name: '女', code: 1 },
      ],
      ...defaultConfig,
      initialValue: userauthed.sex + '',
      config: {
        disabled: true,
      },
    },
    {
      name: 'mobile',
      label: '手机号码',
      ...defaultConfig,
      initialValue: userauthed.mobile,
      config: {
        disabled: true,
      },
    },
    {
      name: 'email',
      label: '电子邮箱',
      ...defaultConfig,
      initialValue: userauthed.email,
      config: {
        disabled: true,
      },
    },
    {
      name: 'deptId',
      label: '所属部门',
      type: 'select',
      option: saveGetDept,
      // rules: [{ required: true, message: '请选择所属部门' }],
      ...defaultConfig,
      initialValue: userauthed.deptId && userauthed.deptId + '',
      readSet: {
        name: 'orgName',
        code: 'id',
      },
      config: {
        disabled: true,
      },
    },
    {
      name: 'assistMgtDept',
      label: '协管部门',
      type: 'select',
      ...defaultConfig,
      initialValue: userauthed.assistMgtDept && userauthed.assistMgtDept + '',
      readSet: {
        name: 'orgName',
        code: 'id',
      },
      option: saveGetDept,
    },
    {
      name: 'sysId',
      label: '归属系统',
      type: 'checkbox',
      rules: [{ required: true, message: '请选择用户归属系统' }],
      ...defaultConfig,
      option: attributionSystem?.filter(item => GET_USER_SYSID.includes(item.code)),
      initialValue: [...(userauthed?.sysId?.split(",") || [])],
    },
  ];

  const handleSubmit = () => {
    validateFieldsAndScroll((err, values) => {
      if (err) return;
      dispatch({
        type: 'userManagement/updateUserInfo',
        payload: {
          password: '',
          usernum: '',
          cardType: '',
          orgId: '7',
          ...values,
          sysId: values?.sysId?.join(',') || "",
          userId,
        },
      }).then(() => {
        refreshFunc && refreshFunc();
        setShowModifyPannel(false);
      });
    });
  };

  return (
    <Modal
      title="修改信息"
      visible={showModifyPannel}
      onOk={handleSubmit}
      onCancel={() => setShowModifyPannel(false)}
      width="80%"
    >
      <Form {...layout}>
        <Row>
          <CustomFormItem formItemList={productInfo} form={form} />
        </Row>
      </Form>
    </Modal>
  );
};

export default Form.create()(connect(({ workSpace }) => ({ workSpace }))(ModifyInfo));
