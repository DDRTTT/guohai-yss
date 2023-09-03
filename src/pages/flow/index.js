import React, { useEffect, useState } from 'react';
import JsPlumbFlow from '@/components/JSPlumbFlow';
import { routerRedux } from 'dva/router';
import { Button, Form, Row, Modal, Input, Select, message } from 'antd';
import { connect } from 'dva';
import styles from './index.less';

const FormItem = Form.Item;

/**
 * @param {string} proCode  产品类型字典/权限产品
 * @param {string} proType  添加类型 type/product
 * @param {string} lifecycleName 模板名称
 */
const tempObj = { proType: 'type', lifecycleName: '', proCode: '' };

const routerPath = {
  listAddress: '/processCenter/flowList',
};
const Index = props => {
  const {
    dispatch,
    saveFlowNodeMsg,
    saveFlowStageMsg,
    saveFlowCommonMsg,
    saveFlowAttrMsg,
    saveOriginMsg,
    saveWordDictionaryFetch,
    saveAuthorityProduct,
    saveFlowInfo,
    form: { getFieldDecorator, validateFields },
  } = props;

  // 弹窗添加，打开/关闭
  const [visible, setVisible] = useState(false);
  // 预览
  const [preview, setPreview] = useState(false);
  const [edit, setEdit] = useState(false);

  useEffect(() => {
    // 获取所有信息
    getFlowAttrList();
    handleWordDictionaryFetch('A002');
    handleAuthorityProduct('flow'); // 当前菜单代码
    const { id, preview, edit } = props.location.query;
    if (preview) {
      setPreview(true);
    }
    if (edit) {
      setEdit(true);
    }
    if (id) {
      handleGetFlowInfoById(id);
    }
  }, []);

  useEffect(() => {
    return () => backToList();
  }, []);

  const getFlowAttrList = () => {
    dispatch({
      type: 'flow/handleGetAttrListMsg',
      payload: '',
    });
  };
  const handleGetFlowInfoById = id => {
    dispatch({
      type: 'flow/handleGetFlowInfo',
      payload: { id },
    });
  };

  // 词汇字典
  const handleWordDictionaryFetch = codeList => {
    dispatch({
      type: 'flow/handleWordDictionaryFetch',
      payload: { codeList },
    });
  };

  const handleAuthorityProduct = menuCode => {
    dispatch({
      type: 'flow/handleAuthorityProduct',
      payload: { menuCode },
    });
  };

  // 添加
  const AddElement = () => {
    setVisible(true);
  };

  // 取消
  const backToList = () => {
    // 清空下数据
    const tempData = JSON.parse(localStorage.getItem('visoData'));
    window.localStorage.removeItem('visoData');
    dispatch({
      type: 'flow/handleEmptyData',
      payload: {},
    });
    dispatch(
      routerRedux.push({
        pathname: routerPath.listAddress,
      }),
    );
  };

  // 提交
  const submitAndSaveData = uri => {
    const visoData = JSON.parse(localStorage.getItem('visoData'));
    const newData = JSON.parse(localStorage.getItem('newData'));
    visoData.nodeData = JSON.parse(
      JSON.stringify(visoData.nodeData).replace(/"id"/g, '"elementId"'),
    );
    const regionConfig = JSON.parse(localStorage.getItem('regionConfig'));
    let { proType, proCode, lifecycleName } = tempObj;
    proType = proType ? proType : newData.proType;
    proCode = proCode ? proCode : newData.proCode;
    lifecycleName = lifecycleName ? lifecycleName : newData.lifecycleName;
    // 画布信息
    visoData.regionConfig = regionConfig;
    if (!edit && !preview) {
      if (!proType) {
        message.warning('请选择添加类型');
        return;
      }
      if (!proCode) {
        message.warning('请选择产品');
        return;
      }
    }
    dispatch({
      type: 'flow/handleSubmitControllInfo',
      payload: {
        ...visoData,
        proType,
        proCode,
        lifecycleName,
        uri,
        id: saveFlowInfo.id ? saveFlowInfo.id : '',
      },
    }).then(data => {
      if (data) {
        dispatch(
          routerRedux.push({
            pathname: routerPath.listAddress,
          }),
        );
      }
    });
  };

  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 6 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 16 },
    },
  };

  /**
   * properties：属性控件类型：0：下拉，1：文本，2：时间
   * 这里用==，因为接口返回的有时候是字符串类型有时候是数值
   */
  const FormAttrbuite = () => {
    let child = saveFlowAttrMsg.map((item, index) => {
      let childCos;
      if (item.properties == '0') {
        child = (
          <Select>
            <Select.Option value="lucy">Lucy</Select.Option>
          </Select>
        );
      } else if (item.properties == '1') {
        child = <Input placeholder="请输入" />;
        childCos = (
          <FormItem label={item.name}>
            {props.form.getFieldDecorator(item.key, {
              rules: [{ required: item.isMust == 1, message: '必填项' }],
            })(<Input placeholder="请输入" />)}
          </FormItem>
        );
      } else if (item.properties == '2') {
      }

      return <div key={index}>{childCos}</div>;
    });

    return child;
  };

  // 添加弹出框--确认
  const handleOk = () => {
    const submitObj = props.form.getFieldsValue();
    dispatch({
      type: 'flow/handleAddControllInfo',
      payload: submitObj,
    });
  };

  const handleCancel = () => {
    setVisible(false);
  };
  return (
    <div className={styles.flow}>
      <div className={styles.hearder}>
        <div style={{ display: preview ? 'none' : '' }}>
          <Button onClick={AddElement}>添加</Button>
          <Button onClick={() => submitAndSaveData('submitProcessTree')}>提交</Button>
          <Button onClick={() => submitAndSaveData('saveProcessTree')}>保存流程模板</Button>
          <Button>流程配置模板</Button>
        </div>
        <Button onClick={backToList}>取消</Button>
      </div>
      <JsPlumbFlow
        flowNodeData={saveFlowNodeMsg}
        flowStageData={saveFlowStageMsg}
        flowCOmmonData={saveFlowCommonMsg}
        flowAttrData={saveFlowAttrMsg}
        originData={saveOriginMsg}
        wordDictionary={saveWordDictionaryFetch}
        authorityProduct={saveAuthorityProduct}
        getChildValue={tempObj}
        flowInfo={saveFlowInfo}
        preview={preview}
        edit={edit}
      />
      <Modal visible={visible} onOk={handleOk} onCancel={handleCancel} destroyOnClose>
        <Form {...formItemLayout}>
          <Row gutter={{ md: 8, lg: 24, xl: 48 }}>{FormAttrbuite()}</Row>
        </Form>
      </Modal>
    </div>
  );
};

const flow = state => {
  const {
    dispatch,
    flow: {
      saveFlowNodeMsg,
      saveFlowStageMsg,
      saveFlowCommonMsg,
      saveFlowAttrMsg,
      saveOriginMsg,
      saveWordDictionaryFetch,
      saveAuthorityProduct,
      saveFlowInfo,
    },
  } = state;
  return {
    dispatch,
    saveFlowNodeMsg,
    saveFlowStageMsg,
    saveFlowCommonMsg,
    saveFlowAttrMsg,
    saveOriginMsg,
    saveWordDictionaryFetch,
    saveAuthorityProduct,
    saveFlowInfo,
  };
};

export default Form.create()(connect(flow)(Index));
