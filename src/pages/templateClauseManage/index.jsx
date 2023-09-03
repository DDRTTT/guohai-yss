// 条款列表页面
import React, { Component } from 'react';
import { connect } from 'dva';
import { Link } from 'umi';
import request from '@/utils/request';
import {
  Button,
  Checkbox,
  Col,
  Form,
  Input,
  message,
  Modal,
  Row,
  Select,
  Spin,
  Tooltip,
} from 'antd';
import Action from '@/utils/hocUtil';
import styles from './index.less';
import PageContainer from '@/components/PageContainers';
import { Card, Table } from '@/components';

class TemplateClauseManage extends Component {
  state = {
    visible: false,
    page: 1,
    limit: 10,
    modalData: {},
    id: '',
    isEdit: false,
    text: '',
    IPObject: {},
    btnLoading: false,
    values: {},
  };

  mapLimit = (list, limit, asyncHandle) => {
    const recursion = arr => {
      return asyncHandle(arr.shift()).then(() => {
        if (arr.length !== 0) return recursion(arr);
        return '';
      });
    };

    const listCopy = [].concat(list);
    const asyncList = []; // 正在进行的所有并发异步操作
    while (limit--) {
      asyncList.push(recursion(listCopy));
    }
    return Promise.all(asyncList).then(res => {
      const { values } = this.state;
      this.handleSave(values);
    }); // 所有并发异步操作都完成后，本次并发控制迭代完成
  };

  // 列表总条数
  showTotal = total => {
    return `共 ${total} 条数据`;
  };

  // 切换页码
  changePage = (page, pageSize) => {
    this.setState({ page, limit: pageSize });
    this.getTableList(page, pageSize);
  };

  // 切换页大小
  changePageSize = (page, pageSize) => {
    this.setState({ page: 1, limit: pageSize }, () => {
      this.getTableList(this.state.page, pageSize);
    });
  };

  getLabelList = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'tempClauseManage/getLabelList',
    });
  };

  selectLabel = value => {
    let { text } = this.state;
    const { labelList } = this.props.tempClauseManage;
    labelList.forEach(item => {
      if (item.code === value) {
        text = item.text;
      }
    });
    this.setState({ text });
    this.getTempList(value);
  };

  getTempList = labelName => {
    const { dispatch } = this.props;
    dispatch({
      type: 'tempClauseManage/getTempList',
      payload: {
        labelName,
      },
    });
  };

  showModal = () => {
    const { dispatch } = this.props;
    this.setState({ visible: true, isEdit: false, modalData: {} });
    dispatch({
      type: 'tempClauseManage/initTempList',
      payload: [],
    });
    this.getLabelList();
  };

  showEditModal = modalData => {
    this.setState({ modalData, visible: true, isEdit: true, id: modalData.id });
    this.getTempList(modalData.flabelName); // 这里的flabelName不要修改哦！
    this.getLabelList();
  };

  // 新增配置取消
  handleCancel = e => {
    const {
      form: { resetFields },
    } = this.props;
    this.setState({
      visible: false,
      modalData: {},
      isEdit: false,
      btnLoading: false,
    });
    resetFields();
  };

  handleSave = data => {
    // 保存的数据准备，勿删！
    const { page, limit, id, isEdit } = this.state;
    const {
      form: { resetFields },
    } = this.props;
    const payload = isEdit ? { id, ...data } : data;
    request(`/ams-base-contract/clause/add`, {
      method: 'POST',
      data: payload, // 传参使用data，不能使用body，且不能使用JSON.stringify（umi框架中封装的request会自动识别传参的类型，将conent-type设置为对应的格式）
    })
      .then(res => {
        if (res?.status === 200) {
          message.success(res.message);
          this.getTableList(page, limit);
          this.setState({ visible: false, isEdit: false, modalData: {}, btnLoading: false });
          resetFields();
        }
        if (res?.status?.toString().length === 8) {
          message.warn(res.message);
          this.setState({ isEdit: false, btnLoading: false });
        }
      })
      .catch(res => {
        message.warning(res.message);
        this.setState({ visible: false, isEdit: false, modalData: {} });
        resetFields();
      });
  };

  // 替换标签的txt
  replaceTagsTxt = (tagsName, tagsTxt) => {
    request(`/ams-base-contract/directory/updateByLableName`, {
      method: 'POST',
      data: { labelName: tagsName, text: tagsTxt },
    }).then(res => {
      if (res?.status?.toString().length === 8) {
        message.warn(res.message);
      }
    });
  };

  // 替换
  magic = values => {
    const { IPObject } = this.state;
    const { tempList } = this.props.tempClauseManage;
    const keyArr = values.ftemplateId.split(',');
    const paramsArr = [];
    keyArr.forEach(k => {
      tempList.forEach(t => {
        if (k === t.code) {
          paramsArr.push({
            jsonArr: [
              {
                name: values.flabelName,
                id: '',
                clear: true,
                content: { body: [{ span: [{ '@value': values.fvalue }] }] },
              },
            ],
            fileUrl: `${IPObject.gateWayIp}/ams/ams-file-service/fileServer/downloadUploadFile?getFile=${t.fileSerialNumber}`, // 已文件流方式
            key: t.code,
          });
        }
      });
    });

    this.replaceTagsTxt(values.flabelName, values.fvalue);

    let count = 0;
    const _limit = paramsArr.length > 5 ? 5 : paramsArr.length; // 设置最大并发数为5
    this.mapLimit(paramsArr, _limit, item => {
      return new Promise(resolve => {
        count++;
        fetch(`${IPObject.jsApiIp}/addtocontentcontrol`, {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json;charset=UTF-8',
          },
          method: 'POST',
          body: JSON.stringify({
            jsonArr: JSON.stringify(item.jsonArr),
            fileUrl: item.fileUrl,
          }),
        }).then(res => {
          if (res.status === 200) {
            res.json().then(response => {
              if (response?.end === true) {
                // console.log('当前并发量:', count--);
                // 替换后的文档 保存
                request('/ams-file-service/template/updateTemplateByBusId', {
                  method: 'POST',
                  data: {
                    busId: item.key,
                    url: response?.urls['result.docx'],
                  },
                }).then(res => {
                  if (res?.status === 200) {
                    // 清除文档缓存
                    fetch(`${IPObject.jsApiIp}/remove?key=${item.key}`).then(res => {
                      if (res?.status === 200) {
                        resolve();
                      }
                    });
                  }
                  if (res?.status?.toString().length === 8) {
                    message.warn(res.message);
                  }
                });
              }
            });
          }
        });
      });
    }).then(response => {
      //
    });
  };

  // 新增配置提交
  handleModalSubmit = e => {
    const {
      form: { validateFields },
      tempClauseManage: { tempList },
    } = this.props;
    const { IPObject } = this.state;
    e.preventDefault();
    validateFields((err, values) => {
      if (!err) {
        if (Array.isArray(values.ftemplateId)) {
          if (values.ftemplateId.length > 1) {
            values.ftemplateId = values.ftemplateId.join(',');
          } else {
            values.ftemplateId = values.ftemplateId[0];
          }
        }

        this.setState({ values, btnLoading: true }, () => {
          const pArr = [];
          tempList.forEach(val => {
            pArr.push(
              new Promise(resolve => {
                fetch(`${IPObject.jsApiIp}/IsOnline?key=${val.code}`).then(res => {
                  if (res?.status === 200) {
                    res.json().then(response => {
                      resolve(response);
                    });
                  }
                });
              }),
            );
          });
          Promise.all(pArr)
            .then(result => {
              let flag = true;
              for (let i = 0; i < result.length; i++) {
                if (result[i].online) {
                  let userName = '';
                  if (result[i].users.length > 1) {
                    result[i].users.forEach(item => {
                      userName += `${item.username} `;
                    });
                  } else {
                    userName = result[i].users[0].username;
                  }
                  message.warn(
                    `${userName}正在编辑当前文档，不能进行替换，请所有人退出文档编辑后再试`,
                  );
                  flag = false;
                  this.setState({ btnLoading: false });
                  break;
                }
              }
              if (flag) {
                this.magic(values);
              }
            })
            .catch(error => {});
        });

        // this.handleSave(values);
      }
    });
  };

  deleteItem = record => {
    Modal.confirm({
      title: '请确认是否删除?',
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        const { dispatch } = this.props;
        let { ftemplateId } = record;
        if (Array.isArray(ftemplateId)) {
          if (ftemplateId.length > 0) {
            ftemplateId = ftemplateId.join(',');
          } else {
            ftemplateId = ftemplateId[0];
          }
        }
        const payload = {
          id: record.id,
          fname: record.fname,
          fvalue: record.fvalue,
          flabelName: record.flabelName, // 不要修改！
          ftemplateId,
        };
        dispatch({
          type: 'tempClauseManage/deletItem',
          payload: {
            payload,
          },
          callback: () => {
            const { page, limit } = this.state;
            this.getTableList(page, limit);
          },
        });
      },
    });
  };

  // 获取表格数据
  getTableList = (page, pageSize) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'tempClauseManage/getList',
      payload: {
        page,
        pageSize,
      },
    });
  };

  // 获取地址
  getNginxIP = () => {
    request('/ams-base-contract/contractfile/getnginxip').then(res => {
      if (res?.status === 200) {
        this.setState({ IPObject: res.data });
      }
    });
  };

  componentDidMount() {
    const { page, limit } = this.state;
    this.getTableList(page, limit);
    this.getNginxIP();
  }

  render() {
    const { btnLoading, page, limit, visible, modalData, isEdit, text } = this.state;
    const { total, dataSource, labelList, tempList } = this.props.tempClauseManage;
    const { TextArea } = Input;
    const {
      form: { getFieldDecorator },
    } = this.props;
    const columnTooltip = text => {
      return (
        <Tooltip title={text} placement="topLeft">
          <span>{text}</span>
        </Tooltip>
      );
    };
    const columns = [
      {
        key: 'number',
        title: '序号',
        dataIndex: 'number',
        width: 70,
        render: (text, record, index) => `${(page - 1) * limit + (index + 1)}`,
      },
      {
        key: 'fname',
        title: '条款项',
        dataIndex: 'fname',
        width: 150,
        ellipsis: true,
        render: columnTooltip,
      },
      {
        key: 'flabelName', // 不要修改名称
        title: '文档标签',
        dataIndex: 'flabelName', // 不要修改名称
        width: 150,
        ellipsis: true,
        render: columnTooltip,
      },
      {
        key: 'tempName',
        title: '对应模板',
        dataIndex: 'tempName',
        width: 200,
        ellipsis: true,
        render: columnTooltip,
      },
      {
        key: 'fvalue',
        title: '内容文本',
        dataIndex: 'fvalue',
        width: 200,
        ellipsis: true,
        render: columnTooltip,
      },
      {
        key: 'handle',
        title: '操作',
        fixed: 'right',
        width: 160,
        render: (item, record) => (
          <div>
            <Link to={`/electronic/templateClauseManageCheck?id=${record.id}`}>查看</Link>
            <Action code="templateClauseManage:update">
              <a style={{ margin: '0 16px 0 16px' }} onClick={() => this.showEditModal(record)}>
                修改
              </a>
            </Action>
            <Action code="templateClauseManage:delete">
              <a onClick={() => this.deleteItem(record)}>删除</a>
            </Action>
          </div>
        ),
      },
    ];
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 14 },
      },
    };
    const formItemLayout2 = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 3 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 19 },
      },
    };

    return (
      <>
        <PageContainer />
        <Card
          title="模板条款管理"
          extra={
            <Action code="templateClauseManage:add">
              <Button type="primary" onClick={this.showModal}>
                新增
              </Button>
            </Action>
          }
        >
          <Table
            rowKey="id"
            dataSource={dataSource}
            columns={columns}
            scroll={{ x: 1000 }}
            pagination={{
              onChange: this.changePage,
              onShowSizeChange: this.changePageSize,
              total,
              pageSize: limit,
              current: page,
              showTotal: this.showTotal,
              showSizeChanger: true,
              showQuickJumper: true,
            }}
          />
          <Modal
            title={isEdit ? '修改配置' : '新增配置'}
            centered
            visible={visible}
            footer={null}
            onCancel={this.handleCancel}
            zIndex={998}
            width={720}
          >
            <Spin spinning={btnLoading} size="small">
              <Form onSubmit={this.handleModalSubmit}>
                <Row type="flex" justify="space-around">
                  <Col span={12}>
                    <Form.Item {...formItemLayout} label="条款项">
                      {getFieldDecorator('fname', {
                        initialValue: modalData.fname || '',
                        rules: [
                          {
                            required: true,
                            message: '请填写条款项',
                          },
                        ],
                      })(<Input disabled={isEdit} />)}
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item {...formItemLayout} label="文档标签">
                      {getFieldDecorator('flabelName', {
                        // flabelName勿改！！
                        initialValue: modalData.flabelName || '',
                        rules: [
                          {
                            required: true,
                            message: '请选择文档标签',
                          },
                        ],
                      })(
                        <Select onChange={this.selectLabel} disabled={isEdit}>
                          {labelList.map(item => {
                            // value={item.name}勿擅自改！
                            return (
                              <Select.Option value={item.name} key={item.code}>
                                {item.name}
                              </Select.Option>
                            );
                          })}
                        </Select>,
                      )}
                    </Form.Item>
                  </Col>
                </Row>
                <Form.Item label="文本段" {...formItemLayout2}>
                  {getFieldDecorator('fvalue', {
                    initialValue: modalData.fvalue || '',
                    rules: [
                      {
                        required: true,
                        message: '请填写文本段',
                      },
                    ],
                  })(<TextArea className={styles.txtarea} placeholder={text} />)}
                </Form.Item>
                <Form.Item label="选择模板" {...formItemLayout2}>
                  {getFieldDecorator('ftemplateId', {
                    initialValue: modalData.ftemplateId || '',
                    rules: [
                      {
                        required: true,
                        message: '请选择模板',
                      },
                    ],
                  })(
                    <Checkbox.Group className={styles.selTempt} disabled={isEdit}>
                      {tempList
                        ? tempList.map(item => {
                            return (
                              <Row key={item.code}>
                                <Col span={20}>
                                  <Checkbox value={item.code}>{item.name}</Checkbox>
                                </Col>
                              </Row>
                            );
                          })
                        : ''}
                    </Checkbox.Group>,
                  )}
                </Form.Item>
                <Form.Item style={{ marginLeft: '472px' }}>
                  <Button style={{ marginRight: '16px' }} onClick={this.handleCancel}>
                    取消
                  </Button>
                  <Button type="primary" htmlType="submit" loading={btnLoading}>
                    保存
                  </Button>
                </Form.Item>
              </Form>
            </Spin>
          </Modal>
        </Card>
      </>
    );
  }
}

export default Form.create()(
  connect(({ tempClauseManage }) => ({ tempClauseManage }))(TemplateClauseManage),
);
