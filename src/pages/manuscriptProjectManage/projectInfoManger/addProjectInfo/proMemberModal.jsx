import { Button, Modal, Form, Input, Select, Radio } from 'antd';
import ModalWin from './ModalWin.jsx';
import { connect } from 'dva';

const { TextArea } = Input;
const { Option } = Select;

const phoneReg = /^(13[0-9]|14[5|7]|15[0|1|2|3|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/; //手机号码校验规则
const phoneReg2 = /^\+86(13[0-9]|14[5|7]|15[0|1|2|3|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/; // 手机号码校验规则
const numReg = /^\d{3,4}-?\d{7,8}$/; //电话号码校验规则
const idCardReg = /(^[1-9]\d{5}(18|19|2[0-3])\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)/; // 18位身份证号校验规则
const PASSPORT1 = /^[a-zA-Z]{5,17}$/; //护照验证规则
const PASSPORT2 = /^[a-zA-Z0-9]{5,17}$/; //护照验证规则
const HKMAKAO = /^[HMhm]{1}([0-9]{10}|[0-9]{8})$/; //港澳通行证
const TAIWAN1 = /^[0-9]{8}$/; //台湾来往大陆通行证
const TAIWAN2 = /^[0-9]{10}$/; // 台湾来往大陆通行证
const emailReg = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;

const CollectionForm = Form.create({ name: 'form_in_modal' })(
  class extends React.Component {
    state = {
      idType: '',
    };
    removetrim = (rule, value, callback) => {
      if (value) {
        if (value.length != value.trim().length) {
          callback('请删除前后端多余空格');
        } else {
          callback();
        }
      } else {
        callback();
      }
    };

    handleMembeNameChange = value => {
      const {
        dispatch,
        form: { resetFields, setFieldsValue },
      } = this.props;

      resetFields();
      dispatch({
        type: 'addProjectInfo/getMemberInfoReq',
        payload: {
          userId: value,
        },
        callback: res => {
          if ('data' in res) {
            const { data } = res;
            setFieldsValue({
              ...data,
              idType: `${data.idType}`,
            });
          } else {
            setFieldsValue({});
          }
        },
      });
    };

    render() {
      const { idType } = this.state;
      const { visible, onCancel, onCreate, form, data } = this.props;
      const { idTypeList, memberNameList } = data;
      const { getFieldDecorator } = form;

      return (
        <ModalWin
          id="proMemberModal"
          title={'添加成员信息'}
          visible={visible}
          okText="确定"
          onCancel={onCancel}
          onOk={onCreate}
        >
          <div style={{ height: '40vh', overflowY: 'auto' }}>
            <Form layout="vertical">
              <Form.Item label="姓名">
                {getFieldDecorator('membeCode', {
                  rules: [
                    {
                      required: true,
                      message: '姓名不得为空!',
                    },
                  ],
                })(
                  <Select
                    style={{ display: 'block' }}
                    placeholder="请选择"
                    showSearch
                    filterOption={(input, option) =>
                      option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                    onChange={this.handleMembeNameChange}
                  >
                    {memberNameList &&
                      memberNameList.map(item => (
                        <Option key={item.id} value={item.id}>
                          {item.username}
                        </Option>
                      ))}
                  </Select>,
                )}
              </Form.Item>
              <Form.Item label="性别:">
                {getFieldDecorator('sex', {
                  rules: [
                    {
                      required: true,
                      message: '性别不得为空!',
                    },
                  ],
                })(
                  <Radio.Group disabled>
                    <Radio value="0">男</Radio>
                    <Radio value="1">女</Radio>
                  </Radio.Group>,
                )}
              </Form.Item>
              <Form.Item label="证件类型:">
                {getFieldDecorator('idType', {
                  rules: [
                    {
                      required: true,
                      message: '证件类型不得为空!',
                    },
                  ],
                })(
                  <Select
                    style={{ display: 'block' }}
                    placeholder="请选择证件类型"
                    showArrow
                    onChange={val => this.setState({ idType: val })}
                  >
                    {idTypeList &&
                      idTypeList.map(item => (
                        <Option key={item.code} value={item.code}>
                          {item.name}
                        </Option>
                      ))}
                  </Select>,
                )}
              </Form.Item>
              <Form.Item label="证件号码">
                {getFieldDecorator('idCard', {
                  rules: [
                    {
                      required: true,
                      message: '证件号码不得为空!',
                    },
                    {
                      validator: (rule, value, callback) => {
                        if (value && idType === '1001' && !idCardReg.test(value)) {
                          callback('身份证号格式不正确!');
                        } else if (
                          value &&
                          idType === '1002' &&
                          !(PASSPORT1.test(value) || PASSPORT2.test(value))
                        ) {
                          callback('护照号码格式不正确!');
                        } else if (value && idType === '1003' && !HKMAKAO.test(value)) {
                          callback('港澳居民通行证号码格式不正确!');
                        } else if (
                          value &&
                          idType === '1004' &&
                          !(TAIWAN1.test(value) || TAIWAN2.test(value))
                        ) {
                          callback('台湾来往通行证号码格式不正确!');
                        } else {
                          callback();
                        }
                      },
                    },
                    {
                      validator: this.removetrim,
                    },
                  ],
                })(<Input placeholder="请输入证件号码" maxLength={18} />)}
              </Form.Item>
              <Form.Item label="部门">
                {getFieldDecorator('department', {
                  rules: [
                    {
                      required: true,
                      message: '部门不得为空!',
                    },
                  ],
                })(<Input placeholder="请输入部门" disabled maxLength={50} />)}
              </Form.Item>
              <Form.Item label="职位">
                {getFieldDecorator('job', {
                  rules: [
                    {
                      required: true,
                      message: '职位不得为空!',
                    },
                    {
                      validator: this.removetrim,
                    },
                  ],
                })(<Input placeholder="请输入职位" maxLength={50} />)}
              </Form.Item>
              <Form.Item label="项目角色">
                {getFieldDecorator('proRole', {
                  rules: [
                    {
                      required: true,
                      message: '项目角色不得为空!',
                    },
                  ],
                })(
                  <Select style={{ display: 'block' }} placeholder="请选择项目角色" showArrow>
                    <Option value="项目管理员">项目管理员</Option>
                    <Option value="项目组成员">项目组成员</Option>
                    <Option value="项目负责人">项目负责人</Option>
                    <Option value="现场负责人">现场负责人</Option>
                    <Option value="项目承揽人">项目承揽人</Option>
                    <Option value="项目协办人">项目协办人</Option>
                  </Select>,
                )}
              </Form.Item>
              <Form.Item label="邮箱">
                {getFieldDecorator('email', {
                  rules: [
                    {
                      required: true,
                      message: '邮箱不得为空!',
                    },
                    {
                      validator: (rule, value, callback) => {
                        if (value && !emailReg.test(value)) {
                          callback('邮箱格式错误');
                        } else {
                          callback();
                        }
                      },
                    },
                    {
                      validator: this.removetrim,
                    },
                  ],
                })(<Input placeholder="请输入邮箱" disabled maxLength={50} />)}
              </Form.Item>
              <Form.Item label="联系电话">
                {getFieldDecorator('mobile', {
                  rules: [
                    {
                      required: true,
                      message: '联系电话不得为空!',
                    },
                    {
                      validator: (rule, value, callback) => {
                        if (
                          value &&
                          !(phoneReg.test(value) || phoneReg2.test(value) || numReg.test(value))
                        ) {
                          callback('联系电话格式校验失败!');
                        } else {
                          callback();
                        }
                      },
                    },
                    {
                      validator: this.removetrim,
                    },
                  ],
                })(<Input placeholder="请输入联系电话" disabled maxLength={14} />)}
              </Form.Item>
              <Form.Item label="备注">
                {getFieldDecorator('remark', {
                  rules: [
                    {
                      validator: this.removetrim,
                    },
                  ],
                })(
                  <TextArea
                    rows={4}
                    allowClear
                    autoSize={{ minRows: 3, maxRows: 6 }}
                    maxLength="100"
                  />,
                )}
              </Form.Item>
            </Form>
          </div>
        </ModalWin>
      );
    }
  },
);

class ProMemberModal extends React.Component {
  state = {
    visible: false,
  };

  showModal = () => {
    this.formRef.props.form.resetFields();
    this.setState({ visible: true });
  };

  handleCancel = () => {
    this.setState({ visible: false });
  };

  handleCreate = () => {
    const {
      data: { memberNameList },
    } = this.props;
    const { form } = this.formRef.props;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      const { username } = memberNameList.find(item => item.id === values.membeCode);
      this.props.onConfirm({ ...values, membeName: `${values.membeCode},${username}` });
      form.resetFields();
      this.setState({ visible: false });
    });
  };

  saveFormRef = formRef => {
    this.formRef = formRef;
  };

  render() {
    const { data, dispatch } = this.props;

    return (
      <>
        <Button
          type="primary"
          onClick={this.showModal}
          style={{ float: 'right', marginBottom: 10 }}
        >
          添加成员信息
        </Button>
        <CollectionForm
          wrappedComponentRef={this.saveFormRef}
          visible={this.state.visible}
          onCancel={this.handleCancel}
          onCreate={this.handleCreate}
          data={data}
          dispatch={dispatch}
        ></CollectionForm>
      </>
    );
  }
}

export default connect()(ProMemberModal);
