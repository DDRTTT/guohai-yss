/**
 * 目录树：新增
 * author: jiaqiuhua
 * date: 2021/03/17
 * * */
import React, { useImperativeHandle, forwardRef, useState } from 'react';
import { Input, Form, Modal, TreeSelect, message } from 'antd';

const FormItem = Form.Item;
const TreeNodeAdd = forwardRef(
  (
    {
      props: { dispatch, saveTreeData, clickMsgData, taskId, proCode, opType },
      form: { getFieldDecorator, resetFields, validateFields, getFieldsValue, setFieldsValue },
      newAddTreeSuccess,
    },
    ref,
  ) => {
    const [visible, setVisible] = useState(false);

    // 显示Modal
    const handleShow = () => {
      const { parentId, code, name, orderNum } = clickMsgData;
      setVisible(true);
      if (parentId) {
        setFieldsValue({
          parentId: opType === 'edit' ? parentId : code,
          pathCode: opType === 'edit' && name ? name.split(' ')[0] : '',
          pathName: opType === 'edit' && name ? name.split(' ')[1] : '',
        });
      }
    };

    // 隐藏modal
    const handleHide = () => {
      setVisible(false);
    };

    // 重置
    const handleReset = () => {
      resetFields();
    };

    // 树选择器，值改变
    const treeSelectChange = value => {
      setFieldsValue({ parentId: value, pathCode: '', pathName: '' });
    };

    // 父节点下的文件状态判断
    const handleParentNodeFileState = pathId => {
      return new Promise(resolve => {
        dispatch({
          type: 'taskManagementDeal/getFileStateByPathReq',
          payload: {
            pathId,
          },
        }).then(res => {
          if (res && res.status === 200) {
            const { state, pathName } = res.data;
            switch (state) {
              case 'prohibit':
                message.warn(`${pathName} 禁止作为父级目录~`);
                resolve(false);
                return;
              case 'prompt':
                message.warn(`${pathName} 节点下有文档，调整后节点文档也随之删除，是否调整？`);
                resolve(false);
                return;
              case 'noApplicability':
                message.warn(`${pathName} 节点为不适用目录，不能作为父级目录~`);
                resolve(false);
                return;
              case 'ok':
                resolve(true);
                return;
            }
          }
        });
      });
    };

    // 确定modal
    const handleConfirm = e => {
      e.preventDefault();
      validateFields((err, values) => {
        const { parentId, pathCode, pathName } = values;

        if (err) return;
        if (!parentId) values.parentId = '-1';
        if (pathCode.length > 20) return message.warn('目录编码长度不可超过20');
        if (pathName.length > 50) return message.warn('目录名称长度不可超过50');
        if (values.parentId !== '-1') {
          handleParentNodeFileState(values.parentId).then(bool => {
            if (bool) {
              handleTaskPathAddReq(values);
            }
          });
          return;
        }
        handleTaskPathAddReq(values);
      });
    };

    // 添加树节点
    const handleTaskPathAddReq = values => {
      const { code } = clickMsgData;
      dispatch({
        type: `${
          opType === 'add'
            ? 'taskManagementDeal/getTaskPathAddReq'
            : 'taskManagementDeal/getTaskPathEditReq'
        }`,
        payload: {
          taskId,
          path: {
            proCode,
            opType,
            id: opType === 'add' ? '' : code,
            ...values,
          },
        },
        callback: () => {
          setVisible(false);
          newAddTreeSuccess && newAddTreeSuccess();
        },
      });
    };

    // 暴露子组件方法
    useImperativeHandle(ref, () => ({
      handleReset,
      handleShow,
      handleHide,
    }));

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    };

    return (
      <Modal
        destroyOnClose
        title={opType === 'add' ? '添加' : '修改'}
        visible={visible}
        onOk={handleConfirm}
        onCancel={handleHide}
      >
        <Form>
          {opType === 'edit' && clickMsgData.parentId === '-1' ? null : (
            <FormItem label="父级目录" {...formItemLayout}>
              {getFieldDecorator('parentId')(
                <TreeSelect
                  style={{ width: '100%' }}
                  dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                  treeData={saveTreeData}
                  placeholder="请选择父级目录"
                  treeDefaultExpandAll
                  onChange={treeSelectChange}
                  disabled={opType === 'edit'}
                />,
              )}
            </FormItem>
          )}
          <FormItem label="目录编码" {...formItemLayout}>
            {getFieldDecorator('pathCode', {
              rules: [
                {
                  required: true,
                  message: '目录编码不能为空',
                },
              ],
              getValueFromEvent: event => {
                return event.target.value.replace(/\s+/g, '');
              },
            })(<Input placeholder="请输入目录编码" />)}
          </FormItem>
          <FormItem label="目录名称" {...formItemLayout}>
            {getFieldDecorator('pathName', {
              rules: [
                {
                  required: true,
                  message: '目录名称不能为空',
                },
              ],
              getValueFromEvent: event => {
                return event.target.value.replace(/\s+/g, '');
              },
            })(<Input placeholder="请输入目录名称" />)}
          </FormItem>
        </Form>
      </Modal>
    );
  },
);

export default Form.create({ name: 'tree_node_modal_form' })(TreeNodeAdd);
