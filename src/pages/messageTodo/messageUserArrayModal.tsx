import React, { useState } from 'react';
import { connect } from 'dva';
import styles from './index.less';
import { ColumnProps } from 'antd/es/table';
import { MessageTodoState } from '@/models/messageTodo';
import { errorBoundary } from '@/layouts/ErrorBoundary';
import { Form, Modal, Button, Row, Col, Input, Select, message } from 'antd';
import { Table } from '@/components';

interface Columns {
  index: number;
  code: string;
  name: string;
  type: string;
  must: string;
  default: string;
}

const dataSource: Columns[] = [
  {
    index: 1,
    code: 'string',
    name: 'string',
    type: 'string',
    must: 'string',
    default: 'string',
  },
];

const Index = (props: any) => {
  const dicts = props.messageTodo.dicts;
  const { getFieldDecorator, validateFields, resetFields } = props.form;

  const [showModal, setShowModal] = useState<boolean>(false);
  const [buttonLoading, setButtonLoading] = useState<boolean>(false);

  console.log(props);

  // 表头(参数列表)
  const columns: ColumnProps<Columns>[] = [
    {
      title: '序号',
      dataIndex: 'index',
      width: '48px',
    },
    {
      title: '参数Code',
      dataIndex: 'code',
      width: '94px',
    },
    {
      title: '参数名称',
      dataIndex: 'name',
      width: '374px',
    },
    {
      title: '参数类型',
      dataIndex: 'type',
      width: '87px',
    },
    {
      title: '是否必传',
      dataIndex: 'must',
      width: '87px',
    },
    {
      title: '默认值',
      dataIndex: 'default',
      width: '74px',
    },
    {
      title: '操作',
      dataIndex: '操作',
      width: '60px',
      align: 'center',
      render: (text: any, record: any) => {
        return <Button type="link">删除</Button>;
      },
    },
  ];

  // 关闭modal窗处理
  const handleCloseModal = () => {
    resetFields(); // 清空表单
    setButtonLoading(false); // 关闭按钮loading
    setShowModal(false); // 关闭model窗口
    props.handleChangeModalBGC(false); // 去除父级modal窗透明度
  };

  // 表单提交
  const handleSumbitModalForm = () => {
    validateFields((error: any, values: {}) => {
      if (!error) {
        console.log(values);
        setButtonLoading(true);
        setTimeout(() => {
          message.success('用户组新增成功!');
          handleCloseModal();
          props.handleGetDicts();
        }, 1000);
      }
    });
  };

  // modal页脚
  const handleAddModalFooter = () => {
    return (
      <div
        className={styles.messageModalFooter}
        style={{
          width: '503px',
          right: '0',
        }}
      >
        <Button key="back" onClick={() => handleCloseModal()}>
          取消
        </Button>
        <Button
          key="submit"
          type="primary"
          htmlType="submit"
          loading={buttonLoading}
          onClick={handleSumbitModalForm}
          style={{
            background: '#2450A5',
            border: '1px solid #2450A5',
            marginRight: '38px',
          }}
        >
          确定
        </Button>
      </div>
    );
  };

  /**
   * 输入框
   * @param {string} name 表单名称
   * @param {string} code 表单code
   */
  const handleAddInput = (name: string, code: string) => {
    return (
      <Col
        md={24}
        sm={24}
        style={{
          position: 'relative',
          left: '46px',
          top: '4px',
          marginBottom: '3px',
        }}
      >
        <Form.Item label={name}>
          {getFieldDecorator(code, {
            rules: [{ required: true, message: `请输入${name}` }],
          })(<Input allowClear style={{ width: '272px' }} placeholder={`请输入${name}`} />)}
        </Form.Item>
      </Col>
    );
  };

  /**
   * 下拉框(多选)
   * @param {Array} data 字典数组
   * @param {string} name 表单名称
   * @param {string} code 表单code
   * @param {string} left 摆放位置
   */
  const handleAddDictsSelects = (
    data: Array<any> | undefined,
    name: string,
    code: string,
    left: string,
  ) => {
    const arr: Array<any> = [];
    if (data && +data !== 0) {
      data.forEach((i: { name: string; code: string }) => {
        arr.push(
          <Select.Option value={i.code} key={i.name}>
            {i.name}
          </Select.Option>,
        );
      });
    }
    return (
      <Col
        md={24}
        sm={24}
        style={{
          position: 'relative',
          left: '57px',
          top: '4px',
          marginBottom: '3px',
        }}
      >
        <Form.Item label={name}>
          {getFieldDecorator(
            code,
            {},
          )(
            <Select
              allowClear
              showArrow
              mode="tags"
              maxTagCount={1}
              maxTagTextLength={8}
              style={{ width: '272px' }}
              placeholder={`请选择${name}(可多选)`}
              filterOption={(input: any, option: any) =>
                option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
              {arr}
            </Select>,
          )}
        </Form.Item>
      </Col>
    );
  };

  /**
   * 参数列表(头部)
   * @param {string} name 表单名称
   * @param {string} code 表单code
   */
  const handleAddTableHeader = (name: string, code: string) => {
    return (
      <Col
        md={24}
        sm={24}
        style={{
          position: 'relative',
          left: '46px',
          top: '8px',
          marginBottom: '4px',
        }}
      >
        <Form.Item label={name}>
          {getFieldDecorator(code, {
            rules: [{ required: true, message: `请输入${name}` }],
          })(
            <div style={{ position: 'relative', left: '453px' }}>
              <Button className={styles.messageUserArrayButtons}>添加</Button>
              <Button className={styles.messageUserArrayButtons}>规则引擎配置</Button>
              <Button className={styles.messageUserArrayButtons}>查询测试</Button>
            </div>,
          )}
        </Form.Item>
      </Col>
    );
  };

  // 参数列表(身体)
  const handleAddTableBody = () => {
    return (
      <Col md={24} sm={24} style={{ padding: '0 16px' }}>
        <Table
          style={{ padding: '0 55px 0 10px' }}
          bordered
          columns={columns}
          dataSource={dataSource}
        />
      </Col>
    );
  };

  return (
    <>
      <Button
        className={styles.messageModalAddButton}
        onClick={() => [props.handleChangeModalBGC(true), setShowModal(true)]}
      >
        <span className={styles.messageModalAddButtonSpan1}>＋</span>
        <span className={styles.messageModalAddButtonSpan2}>新增用户组</span>
      </Button>
      <Modal
        width="519px"
        destroyOnClose
        visible={showModal}
        title="新增提醒用户组"
        footer={handleAddModalFooter()}
        style={{ position: 'relative', left: '-160px', top: '140px' }}
        onCancel={() => [props.handleChangeModalBGC(false), setShowModal(false)]}
        bodyStyle={{ backgroundColor: '#fff', position: 'relative', top: '-1px' }}
      >
        <Form
          className={styles.messageModalForm}
          layout="inline"
          style={{ width: '407px', position: 'relative', left: '24px', top: '-5px' }}
        >
          <Row gutter={[{ xs: 8, sm: 16, md: 24, lg: 32 }, 14]}>
            {handleAddInput('策略名称', 'name')}
            {handleAddDictsSelects(dicts['T019'], '机构部门', 'org', 'left')}
            {handleAddDictsSelects(dicts['T019'], '业务产品', 'product', 'right')}
            {handleAddDictsSelects(dicts['T019'], '系统角色', 'cole', 'left')}
            {handleAddDictsSelects(dicts['T019'], '系统用户', 'user', 'right')}
            {/* {handleAddTableHeader('参数列表', 'params')} */}
            {/* {handleAddTableBody()} */}
          </Row>
        </Form>
      </Modal>
    </>
  );
};

export default errorBoundary(
  Form.create()(
    connect(({ messageTodo }: { messageTodo: MessageTodoState }) => ({
      messageTodo,
    }))(Index),
  ),
);
