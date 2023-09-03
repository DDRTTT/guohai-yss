import React from 'react';
import { connect } from 'dva';
import { Button, Card, Form, Modal } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import BaseCrudComponent from '@/components/BaseCrudComponent';
import CrudComponent from '@/components/CrudComponent';
import { formItemCreate } from '@/components/FormUtil';
import * as types from '@/utils/FormItemType';
import styles from '@/utils/utils.less';
import { errorBoundary } from '@/layouts/ErrorBoundary';
import { nsHoc } from '@/utils/hocUtil';
import AuthorizationPad from './AuthorizationPad';

@nsHoc({ namespace: 'role' })
@errorBoundary
@connect(state => ({
  role: state.role,
}))
@Form.create()
export default class Role extends BaseCrudComponent {
  state = {
    title: '新增',
    currentSelectRecord: {},
    selectedActions: null,
    handleInputDisable: false,
  };

  // componentWillUnmount(){
  //   const { dispatch,namespace } = this.props;
  //   dispatch({
  //     type: `response/clear`
  //   });
  // }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'role/init',
    });
  }

  doDel = record => {
    const { dispatch } = this.props;
    dispatch({
      type: `response/del`,
      payload: {
        id: record.id,
      },
    });
  };

  padVisibleSwitch = () => {
    const { dispatch } = this.props;
    dispatch({
      type: `response/padVisibleSwitch`,
    });
  };

  handlerSave = e => {
    e.preventDefault();
    const { form } = this.props;
    const { currentSelectRecord } = this.state;

    form.validateFields((err, fieldsValue) => {
      if (err) {
        return;
      }
      if (currentSelectRecord.id) {
        // 更新
        fieldsValue.id = currentSelectRecord.id;
        this.edit(fieldsValue);
      } else {
        this.add(fieldsValue);
      }
    });
  };

  doDetailInit = (record, title, par = false) => {
    this.setState({
      title,
      currentSelectRecord: record,
      handleInputDisable: par,
    });

    this.handleModalVisible();
  };

  authorityInit = record => {
    const { dispatch } = this.props;
    dispatch({
      type: `response/getAuthorizeById`,
      payload: record.id,
    });

    // 清空已选择功能点
    this.setState({
      currentSelectRecord: record,
      selectedActions: null,
    });
  };

  authoritySave = () => {
    const { selectedActions, currentSelectRecord } = this.state;
    if (selectedActions) {
      const { dispatch } = this.props;
      dispatch({
        type: `response/authorize`,
        payload: {
          id: currentSelectRecord.id,
          actions: selectedActions,
        },
      });
    } else {
      this.padVisibleSwitch();
    }
  };

  onSelectedActionsChange = selectedActions => {
    this.setState({ selectedActions });
  };

  getstatusMap = (type, array) => {
    console.log('type', type);
    const m = new Map();
    for (const key in array) {
      if (array.hasOwnProperty(key)) {
        m.set(array[key].value, array[key].text);
      }
    }
    return m.get(type);
  };

  render() {
    const {
      role: {
        data,
        loading,
        current,
        pageSize,
        modelVisible,
        authorizationPadVisible,
        actions,
        roletype,
        allmenutree,
      },
      form,
    } = this.props;
    const { currentSelectRecord, title } = this.state;
    const { getFieldDecorator } = form;

    /**
     * 数据定义区，待定义数据包括：<br/>
     * 1、公共查询表单 searchFields
     * 2、公共按钮组 gridButtons
     * 3、table 列定义 columns
     * 4、行操作按钮组 colActions
     */

    const searchFields = [
      /*      {
              key: 'code',
              label: '角色代码',
              type: types.INPUT,
              placeholder: '请输入角色编码关键字',
            }, */
      {
        key: 'name',
        label: '角色名称',
        type: types.INPUT,
        placeholder: '请输入角色名称关键字',
      },
      {
        key: 'queryButton',
        type: types.BUTTON,
        buttons: [
          {
            text: '查询',
            extra: {
              style: { marginLeft: 8 },
              htmlType: 'submit',
              key: 'query',
            },
          },
        ],
      },
    ];

    const columns = [
      /*      {
              title: '角色代码',
              dataIndex: 'code',
            }, */
      {
        title: '角色名称',
        dataIndex: 'name',
      },
      {
        title: '创建人',
        dataIndex: 'creator',
      },
      {
        title: '创建时间',
        dataIndex: 'createTime',
      },
      {
        title: '角色描述',
        dataIndex: 'description',
      },
      {
        title: '角色类型',
        dataIndex: 'type',
        render: record => <a>{this.getstatusMap(record, roletype)}</a>,
      },
    ];

    const gridButtons = [
      {
        text: '新增',
        code: 'add',
        onClick: () => this.doDetailInit({}, '新增', false),
      },
    ];

    const colActions = [
      {
        text: '授权',
        code: 'authority',
        onClick: record => this.authorityInit(record),
      },
    ];

    const ccProps = {
      title: '角色管理',
      menuCode: this.props.namespace,
      data,
      loading,
      current,
      pageSize,
      searchFields,
      gridButtons,
      colActions,
      columns,
      tableExtra: {
        rowSelection: null,
      },
      doDetailInit: this.doDetailInit,
      doDel: this.doDel,
      doGridSearch: this.doDataSearch,
    };

    const roleDetail = [
      /*      {
              key: 'code',
              label: '角色代码',
              type: types.INPUT,
              options: {
                initialValue: currentSelectRecord.code,
                rules: [{ required: true, message: '角色代码不能为空!' }],
              },
            }, */
      {
        key: 'name',
        label: '角色名称',
        type: types.INPUT,
        options: {
          initialValue: currentSelectRecord.name,
          rules: [{ required: true, message: '角色名称不能为空!' }],
        },
        extra: { disabled: this.state.handleInputDisable },
      },
      {
        key: 'description',
        label: '角色描述',
        type: types.INPUT,
        options: {
          initialValue: currentSelectRecord.description,
        },
      },
      {
        key: 'type',
        label: '角色类型',
        type: types.SELECTOR,
        data: roletype,
        options: {
          initialValue: currentSelectRecord.type,
          rules: [{ required: true, message: '角色类型不能为空!' }],
        },
      },
    ];

    return (
      <PageHeaderWrapper>
        <CrudComponent {...ccProps} />

        <Modal
          key="roleDetail"
          title={`角色${title}`}
          visible={modelVisible}
          width={600}
          closable={false}
          maskClosable={false}
          className={styles.defaultModal}
          footer={null}
        >
          <Form onSubmit={this.handlerSave}>
            <Card className={styles.card1}>
              {formItemCreate(getFieldDecorator, roleDetail, 2)}
              <div style={{ textAlign: 'center' }}>
                <span className="submitButtons">
                  <Button
                    htmlType="submit"
                    type="primary"
                    style={{ marginRight: '20px', height: 28 }}
                  >
                    保存
                  </Button>
                  <Button
                    type="danger"
                    style={{ height: 28 }}
                    onClick={() => this.handleModalVisible()}
                  >
                    取消
                  </Button>
                </span>
              </div>
            </Card>
          </Form>
        </Modal>

        <Modal
          key="roleActionsDetail"
          title="角色授权"
          visible={authorizationPadVisible}
          width={900}
          closable={false}
          maskClosable={false}
          className={styles.defaultModal}
          footer={[
            <Button
              onClick={() => this.authoritySave()}
              type="primary"
              htmlType="submit"
              style={{ display: 'inline-block', height: 28 }}
            >
              保存
            </Button>,
            <Button type="danger" onClick={() => this.padVisibleSwitch()}>
              取消
            </Button>,
          ]}
        >
          <AuthorizationPad
            authorizes={allmenutree}
            allowedModifying
            selectedActions={actions}
            onSelectedActionsChange={this.onSelectedActionsChange}
          />
        </Modal>
      </PageHeaderWrapper>
    );
  }
}
