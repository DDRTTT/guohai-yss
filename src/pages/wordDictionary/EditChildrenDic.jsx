import { connect } from 'dva';
import { Button, Col, Form, message, Modal, Row, Select, Table } from 'antd';

const { Option } = Select;

const CollectionCreateForm = Form.create({ name: 'form_in_modal' })(
  class extends React.Component {
    showModal = () => {
      const {
        dispatch,
        datadictCode,
        wordDictionary: { one },
      } = this.props;

      this.setState({
        visible: true,
      });

      dispatch({
        type: 'wordDictionary/getDropDownListReq',
      });

      dispatch({
        type: 'wordDictionary/queryInfoByLinkageReq',
        payload: {
          datadictCode,
          dictategoryCode: one.code,
        },
        callback: res => {
          this.setState({
            dataSource: res.data ? res.data : [],
          });
        },
      });
    };

    handleChange = item => {
      const { dispatch, form } = this.props;
      form.resetFields(['childrenCode']);
      dispatch({
        type: 'wordDictionary/childrenDicSelect',
        payload: {
          fcode: JSON.parse(item).code,
        },
      });
    };

    handleReset = () => {
      this.props.form.resetFields();
    };

    handleAdd = e => {
      e.preventDefault();
      const { validateFields } = this.props.form;
      const { dataSource } = this.state;

      validateFields((err, values) => {
        if (err) return;
        const { parentCode, childrenCode } = values;
        const { code, name } = JSON.parse(parentCode);
        const newAddDic = {
          code,
          name,
          datadict: childrenCode.map(item => ({ orgType: code, ...JSON.parse(item) })),
        };
        const dataSourceIndex = dataSource.findIndex(item => item.code === code);

        if (dataSourceIndex > -1) {
          dataSource[dataSourceIndex] = newAddDic;
        } else {
          dataSource.push(newAddDic);
        }

        this.setState({
          dataSource,
          current: Math.ceil(dataSource.length / 10),
        });
        this.handleReset();
      });
    };

    handleDelete = (parentCode = '', childrenCode = '') => {
      const { dataSource } = this.state;
      const parentIndex = dataSource.findIndex(item => item.code === parentCode);

      if (parentCode && !childrenCode) {
        dataSource.splice(parentIndex, 1);
      } else {
        const childrenIndex = dataSource[parentIndex].datadict.findIndex(
          item => item.code === childrenCode,
        );

        dataSource[parentIndex].datadict.splice(childrenIndex, 1);

        if (dataSource[parentIndex].datadict.length === 0) {
          dataSource.splice(parentIndex, 1);
        }
      }

      this.setState({
        dataSource,
        current: Math.ceil(dataSource.length / 10),
      });
    };

    state = {
      visible: false,
      columns: [
        {
          title: '词汇名称',
          dataIndex: 'name',
          key: 'name',
        },
        {
          title: '词汇代码',
          dataIndex: 'code',
          key: 'code',
        },
        {
          title: '操作',
          key: 'operation',
          render: (text, record) => <a onClick={() => this.handleDelete(record.code)}>删除</a>,
        },
      ],
      confirmLoading: false,
      dataSource: [],
      current: 1,
    };

    handleCreate = () => {
      const { dispatch, datadictId, inquiryOneList } = this.props;
      const { dataSource } = this.state;
      const linkageDatadicts = {};
      dataSource.forEach(item => {
        linkageDatadicts[item.code] = item.datadict;
      });

      this.setState({ confirmLoading: true });
      dispatch({
        type: 'wordDictionary/updateByLinkageReq',
        payload: {
          datadictId,
          linkageDatadicts,
        },
        callback: () => {
          message.success('保存成功~');
          this.setState({ visible: false, confirmLoading: false });
          inquiryOneList();
        },
      });
    };

    handleCancel = () => {
      this.setState({ visible: false });
    };

    expandedRowRender = item => {
      const columns = [
        {
          title: '字典名称',
          dataIndex: 'name',
          key: 'name',
        },
        {
          title: '字典代码',
          dataIndex: 'code',
          key: 'code',
        },
        {
          title: '操作',
          dataIndex: 'operation',
          key: 'operation',
          render: (text, record) => (
            <a onClick={() => this.handleDelete(item.code, record.code)}>删除</a>
          ),
        },
      ];
      return <Table columns={columns} dataSource={item.datadict} pagination={false} />;
    };

    render() {
      const {
        tableCellText = '',
        form: { getFieldDecorator },
        wordDictionary: { childrenDicSelectList, getDropDownList },
      } = this.props;
      const { columns, dataSource, visible, confirmLoading, current } = this.state;
      const formItemLayout = {
        labelCol: {
          xs: { span: 24 },
          sm: { span: 5 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 12 },
        },
      };

      return (
        <span>
          <a onClick={this.showModal}>{tableCellText}</a>
          <Modal
            width={'80vw'}
            visible={visible}
            title="级联字典项配置"
            okText="保存"
            onCancel={this.handleCancel}
            onOk={this.handleCreate}
            confirmLoading={confirmLoading}
          >
            <Form {...formItemLayout} onSubmit={this.handleAdd}>
              <Row gutter={24}>
                <Col span={8}>
                  <Form.Item label="词汇选择：">
                    {getFieldDecorator('parentCode', {
                      rules: [
                        {
                          required: true,
                          message: `请选择词汇`,
                        },
                      ],
                    })(
                      <Select placeholder="请选择词汇..." onChange={this.handleChange}>
                        {getDropDownList &&
                          getDropDownList.map(({ code, name, id }) => (
                            <Option value={`${JSON.stringify({ code, name })}`} key={id}>
                              {name}
                            </Option>
                          ))}
                      </Select>,
                    )}
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="字典下拉：">
                    {getFieldDecorator('childrenCode', {
                      rules: [
                        {
                          required: true,
                          message: `请选择字典下拉`,
                        },
                      ],
                    })(
                      <Select placeholder="请选择字典下拉..." mode="multiple">
                        {childrenDicSelectList &&
                          childrenDicSelectList.map(({ code, name, id }) => (
                            <Option value={`${JSON.stringify({ code, name })}`} key={id}>
                              {name}
                            </Option>
                          ))}
                      </Select>,
                    )}
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Button type="primary" htmlType="submit">
                    新增
                  </Button>
                  <Button style={{ marginLeft: 12 }} onClick={this.handleReset}>
                    重置
                  </Button>
                </Col>
              </Row>
            </Form>
            <Table
              rowKey={item => item.id}
              columns={columns}
              dataSource={dataSource}
              expandedRowRender={item => this.expandedRowRender(item)}
              pagination={{
                current,
                showSizeChanger: true,
                showQuickJumper: true,
                onChange: page => this.setState({ current: page }),
                showTotal: total => `共 ${total} 条数据`,
              }}
            />
          </Modal>
        </span>
      );
    }
  },
);

export default connect(({ wordDictionary }) => ({ wordDictionary }))(CollectionCreateForm);
