//提醒策略modal框
import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import { errorBoundary } from '@/layouts/ErrorBoundary';
import moment from 'moment';
import { MessageTodoState } from '@/models/messageTodo';
import styles from './index.less';
import MessageUserArrayModal from './messageUserArrayModal';
import {
  Form,
  Modal,
  message,
  Button,
  Select,
  Row,
  Col,
  Input,
  DatePicker,
  Checkbox,
  Icon,
  Switch,
  Spin,
} from 'antd';

const Index = (props: any) => {
  const dispatch = props.dispatch;
  const dicts = props.messageTodo.dicts;
  const messageModalData = props.data.data;
  const { getFieldDecorator, validateFields, resetFields } = props.form;

  const [showModal, setShowModal] = useState<boolean>(false);
  const [buttonLoading, setButtonLoading] = useState<boolean>(false);
  const [onAndOff, setOnAndOff] = useState<boolean>(true);
  const [modalBGC, setModalBGC] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    handleGetDicts();
  }, []);

  // 接口:获取词汇字典数据
  const handleGetDicts = () => {
    setLoading(true);
    dispatch({
      type: `messageTodo/handleGetDictsFunc`,
      payload: ['A001', 'A002', 'A003', 'A004', 'S002', 'R001', 'T019'],
      callback: () => setLoading(false),
    });
  };

  // 关闭modal窗处理
  const handleCloseModal = () => {
    resetFields(); // 清空表单
    setButtonLoading(false); // 关闭按钮loading
    setShowModal(false); // 关闭model窗口
  };

  // 表单提交
  const handleSumbitModalForm = () => {
    validateFields(
      (
        error: any,
        values: {
          type: any;
          type1: any;
          type2: any;
          type3: any;
          type4: any;
          message: any;
          name: any;
          org: any;
          startDate: any;
          endDate: any;
          isCoerce: any;
          isStrategy: any;
          user: any;
          cole: any;
          product: any;
          userArray: any;
        },
      ) => {
        if (!error) {
          const data = {
            type: values.type,
            type1: values.type1,
            type2: values.type2,
            type3: values.type3,
            type4: values.type4,
            message: values.message,
            name: values.name,
            org: values.org,
            startDate: values.startDate ? moment(values.startDate).format('YYYY-MM-DD') : '',
            endDate: values.endDate ? moment(values.endDate).format('YYYY-MM-DD') : '',
            isCoerce: values.isCoerce,
            isStrategy: values.isStrategy,
            user: values.user,
            cole: values.cole,
            product: values.product,
            userArray: values.userArray,
          };
          console.log(data);
          setButtonLoading(true);
          setTimeout(() => {
            message.success(`${props.data.modalTitle || '新增提醒策略'}成功!`);
            handleCloseModal();
          }, 1000);
        }
      },
    );
  };

  // modal页脚
  const handleAddModalFooter = () => {
    return (
      <div className={styles.messageModalFooter}>
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
            marginRight: '24px',
          }}
        >
          确定
        </Button>
      </div>
    );
  };

  // 下拉框
  const handleAddDictsSelect = (
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
      <Col md={12} sm={24} style={left === 'left' ? { position: 'relative', left: '46px' } : {}}>
        <Form.Item label={name}>
          {getFieldDecorator(code, {
            initialValue: messageModalData?.[code] ? messageModalData?.[code] : '',
            rules: [{ required: true, message: `请选择${name}` }],
          })(
            <Select
              allowClear
              showSearch
              maxTagTextLength={8}
              placeholder={`请选择${name}`}
              style={{ width: '272px', height: '32px' }}
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

  // 下拉框(多选)
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
        md={12}
        sm={24}
        style={
          left === 'left'
            ? { position: 'relative', left: '128px' }
            : { position: 'relative', left: '23px' }
        }
      >
        <Form.Item>
          {getFieldDecorator(code, {
            initialValue: messageModalData?.[code] ? messageModalData?.[code] : [],
          })(
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
   * 文本域
   * @param {string} name 表单名称
   * @param {string} code 表单code
   */
  const handleAddTextArea = (name: string, code: string) => {
    return (
      <Col
        md={24}
        sm={24}
        style={{
          position: 'relative',
          left: '46px',
          top: '4px',
        }}
      >
        <Form.Item label={name}>
          {getFieldDecorator(code, {
            initialValue: messageModalData?.[code] ? messageModalData?.[code] : '',
            rules: [{ required: true, message: `请输入${name}` }],
          })(
            <Input.TextArea
              style={{
                width: '690px',
                height: '56px',
                borderRadius: '3px',
              }}
              allowClear
              placeholder={`请输入${name}`}
            />,
          )}
        </Form.Item>
      </Col>
    );
  };

  /**
   * 日期框(单)
   * @param {string} name 表单名称
   * @param {string} code 表单code
   * @param {string} left 摆放位置
   */
  const handleAddDatePicker = (name: string, code: string, left: string) => {
    return (
      <Col md={12} sm={24} style={left === 'left' ? { position: 'relative', left: '46px' } : {}}>
        <Form.Item label={name}>
          {getFieldDecorator(code, {
            initialValue: messageModalData?.[code]
              ? moment(messageModalData?.[code], 'YYYY-MM-DD')
              : null,
            rules: [{ required: true, message: `请选择${name}` }],
          })(
            <DatePicker
              format={'YYYY-MM-DD'}
              style={{ width: '272px' }}
              allowClear
              placeholder={`请选择${name}`}
            />,
          )}
        </Form.Item>
      </Col>
    );
  };

  /**
   * 多选框:用户组
   * @param {Array} data 字典数组
   */
  const handleAddCheckbox = (data: Array<any> | undefined) => {
    const arr: Array<any> = [];
    if (data && +data !== 0) {
      data.forEach((i: { code: string; name: string }) => {
        arr.push(
          <Checkbox style={{ margin: '8px' }} value={i.code}>
            {i.name}
          </Checkbox>,
        );
      });
    }
    if (+arr !== 0) {
      return (
        <Col md={24} sm={24}>
          <div
            style={onAndOff === true ? { height: '35px', overflow: 'hidden' } : {}}
            className={styles.messageModalUserCheckboxDiv}
          >
            <Form.Item>
              {getFieldDecorator('userArray', {
                initialValue: messageModalData?.userArray || [],
              })(<Checkbox.Group>{arr}</Checkbox.Group>)}
            </Form.Item>
          </div>
          <div
            style={
              onAndOff === true
                ? { top: '9px' }
                : {
                    bottom: '7px',
                  }
            }
            className={styles.messageMdoalUserCheckboxButtonDiv}
          >
            <Button type="link" style={{ float: 'right' }} onClick={() => setOnAndOff(!onAndOff)}>
              {onAndOff === true ? '展开' : '收起'}
              <Icon type={onAndOff === true ? 'down' : 'up'}></Icon>
            </Button>
          </div>
        </Col>
      );
    } else {
      return (
        <Col md={24} sm={24}>
          <p className={styles.messageModalUserHint}>
            注: 用户组加载异常 , 请检查网络请求或用户组数据源 ! (当前状态调整策略 ,
            默认为系统全体成员)
          </p>
        </Col>
      );
    }
  };

  // 用户组
  const handleShowUserArray = () => {
    return (
      <Col md={24} sm={24} style={{ position: 'relative', left: '-1px', top: '-4px' }}>
        <div className={styles.messageModalUser}>
          <Row gutter={[{ xs: 8, sm: 16, md: 24, lg: 32 }, 14]} style={{ marginTop: '3px' }}>
            <Col md={12} sm={24} style={{ marginTop: '4px' }}>
              <span className={styles.messageModalSpan1}>提醒用户:</span>
              <span className={styles.messageModalSpan2}>选择用户组策略</span>
            </Col>
            <Col md={12} sm={24} style={{ marginTop: '3px' }}>
              <MessageUserArrayModal
                handleGetDicts={handleGetDicts}
                handleChangeModalBGC={setModalBGC}
              />
            </Col>
            {loading ? (
              <Col md={24} sm={24} style={{ textAlign: 'center' }}>
                <Spin />
              </Col>
            ) : (
              handleAddCheckbox(dicts['T019'])
            )}
            {handleAddDictsSelects(dicts['T019'], '机构部门', 'org', 'left')}
            {handleAddDictsSelects(dicts['T019'], '业务产品', 'product', 'right')}
            {handleAddDictsSelects(dicts['T019'], '系统角色', 'cole', 'left')}
            {handleAddDictsSelects(dicts['T019'], '系统用户', 'user', 'right')}
            <Col md={24} sm={24}>
              <span
                style={{ margin: '0 0 4px 60px', position: 'relative', top: '-9px' }}
                className={styles.messageModalUserHint}
              >
                注：如未指定提醒用户的类型，将默认向系统中的公司全员发送提醒策略；并根据策略配置向系统中的全员生成相应的待办/消息提醒事项
              </span>
            </Col>
          </Row>
        </div>
      </Col>
    );
  };

  /**
   * 策略开关
   * @param {string} name 表单名称
   * @param {string} code 表单code
   */
  const handleMessageUserStrategy = (name: string, code: string) => {
    return (
      <Col md={5} sm={24}>
        <Form.Item label={name}>
          {getFieldDecorator(code, {
            initialValue: messageModalData?.[code] ? messageModalData?.[code] : false,
            valuePropName: 'checked',
          })(<Switch checkedChildren="开" unCheckedChildren="关" />)}
        </Form.Item>
        <span
          style={{
            width: '1px',
            height: '16px',
            background: '#f2f2f3',
            display: 'inline-block',
            position: 'relative',
            top: '12px',
            left: '15px',
          }}
        ></span>
      </Col>
    );
  };

  /**
   * 强制开关
   * @param {string} name 表单名称
   * @param {string} code 表单code
   */
  const handleMessageModalCoerce = (name: string, code: string) => {
    return (
      <Col md={19} sm={24}>
        <Form.Item>
          {getFieldDecorator(code, {
            initialValue: messageModalData?.[code] ? messageModalData?.[code] : false,
            valuePropName: 'checked',
          })(
            <Checkbox>
              <span style={{ color: '#f66f6a' }}>{name}</span>
              <span style={{ color: '#8A8E99' }}>
                （强制启用开启后用户将无法关闭该提醒配置策略）
              </span>
            </Checkbox>,
          )}
        </Form.Item>
      </Col>
    );
  };

  return (
    <>
      <Button type={props.data.buttonType || 'link'} onClick={() => [setShowModal(true)]}>
        {props.data.buttonName || '新增'}
      </Button>
      <Modal
        width="942px"
        destroyOnClose
        visible={showModal}
        footer={handleAddModalFooter()}
        onCancel={() => handleCloseModal()}
        style={modalBGC ? { opacity: '0.8' } : {}}
        title={props.data.modalTitle || '新增提醒策略'}
        bodyStyle={{ backgroundColor: '#fff', position: 'relative', top: '-1px' }}
      >
        <Form
          className={styles.messageModalForm}
          layout="inline"
          style={{ position: 'relative', left: '24px', top: '-5px' }}
        >
          <Row gutter={[{ xs: 8, sm: 16, md: 24, lg: 32 }, 14]}>
            {handleAddDictsSelect(dicts['T019'], '一级事项', 'type1', 'left')}
            {handleAddDictsSelect(dicts['A002'], '二级事项', 'type2', 'right')}
            {handleAddDictsSelect(dicts['A003'], '事项类别', 'type', 'left')}
            {handleAddDictsSelect(dicts['A004'], '事项名称', 'name', 'right')}
            {handleAddTextArea('提醒内容', 'message')}
            {handleAddDatePicker('触发日期', 'startDate', 'left')}
            {handleAddDatePicker('提醒日期', 'endDate', 'right')}
            {handleAddDictsSelect(dicts['A001'], '提醒频率', 'type3', 'left')}
            {handleAddDictsSelect(dicts['A002'], '提醒方式', 'type4', 'right')}
            {handleShowUserArray()}
            {handleMessageUserStrategy('启用本策略', 'isStrategy')}
            {handleMessageModalCoerce('是否强制启用', 'isCoerce')}
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
