import { Input, Button, Popconfirm, Form, Tooltip, message } from 'antd';
import { Table } from '@/components';
import { handleTableCss } from '../manuscriptBasic/func';
import Action from '@/utils/hocUtil';
import React from 'react';
import { cloneDeep } from 'lodash';
import EditChildrenDic from './EditChildrenDic';
const EditableContext = React.createContext();

const EditableRow = ({ form, index, ...props }) => (
  <EditableContext.Provider value={form}>
    <tr {...props} />
  </EditableContext.Provider>
);

const EditableFormRow = Form.create()(EditableRow);

class EditableCell extends React.Component {
  state = {
    editing: false,
  };

  toggleEdit = () => {
    const editing = !this.state.editing;
    this.setState({ editing }, () => {
      if (editing) {
        this.input.focus();
      }
    });
  };

  save = e => {
    const { record, handleSave } = this.props;
    this.form.validateFields((error, values) => {
      if (error && error[e.currentTarget.id]) {
        return;
      }
      this.toggleEdit();
      handleSave({ ...record, ...values });
    });
  };

  renderCell = form => {
    this.form = form;
    const { children, dataIndex, record, title } = this.props;
    const { editing } = this.state;
    return editing ? (
      <Form.Item style={{ margin: 0 }}>
        {form.getFieldDecorator(dataIndex, {
          rules: [
            {
              required: true,
              message: `${title} is required.`,
            },
          ],
          initialValue: record[dataIndex],
        })(<Input ref={node => (this.input = node)} onPressEnter={this.save} onBlur={this.save} />)}
      </Form.Item>
    ) : (
      <div
        className="editable-cell-value-wrap"
        style={{ paddingRight: 24 }}
        onClick={this.toggleEdit}
      >
        {children}
      </div>
    );
  };

  render() {
    const {
      editable,
      dataIndex,
      title,
      record,
      index,
      handleSave,
      children,
      ...restProps
    } = this.props;
    return (
      <td {...restProps}>
        {editable ? (
          <EditableContext.Consumer>{this.renderCell}</EditableContext.Consumer>
        ) : (
          children
        )}
      </td>
    );
  }
}

class Index extends React.Component {
  constructor(props) {
    super(props);
  }

  componentWillMount() {
    const tempDataSrource = cloneDeep(this.props.dataSource || []);
    tempDataSrource.map((item, index) => (item.orderNum = index + 1));
    this.setState({ dataSource: tempDataSrource });
  }
  isEdit = this.props?.isEdit || true;
  baseColumns = [
    {
      title: '序号',
      dataIndex: 'orderNum',
      editable: this.isEdit,
      width: 70,
      inputType: 'orderNum',
      render: text => handleTableCss(text),
    },
    {
      title: '字典代码',
      dataIndex: 'code',
      width: 300,
      editable: this.isEdit,
      render: text => handleTableCss(text),
    },
    {
      title: '字典名称',
      dataIndex: 'name',
      width: 300,
      editable: this.isEdit,
      render: text => handleTableCss(text),
    },
    {
      title: '联动词汇',
      dataIndex: 'linkageDatadicts',
      width: 300,
      ellipsis: true,
      render: (text, record) => {
        return (
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Tooltip title={record.linkageDatadictsName} placement="topLeft">
              <span
                style={{
                  display: 'inline-block',
                  width: '220px',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {record.linkageDatadictsName}
              </span>
            </Tooltip>
            {this.isEdit ? (
              <Action code="wordDictionary:updateByLinkage">
                <EditChildrenDic
                  datadictId={record.id}
                  datadictCode={record.code}
                  inquiryOneList={this.props.inquiryOneList}
                  tableCellText={'status' in record ? '' : text ? '编辑' : '新增'}
                />
                <></>
              </Action>
            ) : null}
          </div>
        );
      },
    },
    {
      title: '备注',
      dataIndex: 'remark',
      editable: this.isEdit,
      width: 250,
      render: text => handleTableCss(text),
    },
  ];

  actionCol = [
    {
      title: '操作',
      align: 'center',
      render: (text, record) => {
        return (
          <Popconfirm title="确定要删除吗?" onConfirm={() => this.handleDelete(record.id)}>
            <a>删除</a>
          </Popconfirm>
        );
      },
    },
  ];

  state = {
    dataSource: [],
    count: 0,
    pageNum: 1,
  };

  handleDelete = key => {
    const dataSource = [...this.state.dataSource];
    const tempSource = dataSource
      .filter(item => item.id !== key)
      .map((item, index) => {
        item.orderNum = index + 1;
        return item;
      });

    this.setState({ dataSource: tempSource }, () => {
      this.props.updataDataSource(this.state.dataSource);
    });
  };

  handleAdd = () => {
    const { count, dataSource } = this.state;
    const newData = {
      id: count + 1 + 'fe',
      dictategoryId: this.props?.dictategoryId,
      code: '',
      name: ``,
      remark: ``,
      orderNum: dataSource.length + 1,
      status: 0,
      linkageDatadicts: '',
    };
    console.log('添加字典:' + newData);

    this.setState({
      dataSource: [...dataSource, newData],
      count: count + 1,
    });
  };

  handleSave = row => {
    const newData = [...this.state.dataSource];
    const index = newData.findIndex(item => row.id === item.id);
    const item = newData[index];
    newData.splice(index, 1, {
      ...item,
      ...row,
    });
    // const repeatIndex = newData.findIndex(item => item.code == row.code && row.id != item.id);
    // if (repeatIndex != -1) {
    //   message.warn('字典代码不能重复');
    //   return;
    // }
    newData.map(item => {
      // if (item.code.length == 0 || item.code == '-') {
      //   message.warn('字典代码不能为空');
      //   return;
      // }
      // if (item.name.length == 0 || item.name == '-') {
      //   message.warn('字典名称不能为空');
      //   return;
      // }
      if (item.code == row.code && row.id != item.id) {
        message.warn('字典代码"' + item.code + '"不能重复');
        return;
      }
    });
    this.setState({ dataSource: newData });
    // 如果有回调就回调更新数据
    this.props?.updataDataSource && this.props?.updataDataSource(newData);
  };

  render() {
    const { dataSource, pageNum } = this.state;
    const { isEdit } = this.props;
    const components = {
      body: {
        row: EditableFormRow,
        cell: EditableCell,
      },
    };
    const tempColumn = isEdit ? [...this.baseColumns, ...this.actionCol] : this.baseColumns;
    const columns = tempColumn.map(col => {
      if (!col.editable) {
        return col;
      }
      return {
        ...col,
        onCell: record => ({
          record,
          editable: col.editable,
          dataIndex: col.dataIndex,
          title: col.title,
          handleSave: this.handleSave,
        }),
      };
    });
    return (
      <div>
        {isEdit && (
          <div>
            <Button onClick={this.handleAdd} type="primary" style={{ marginBottom: 16 }}>
              添加
            </Button>
            <span> ( 双击空白格编辑字典列表 ) </span>
          </div>
        )}
        <Table
          components={components}
          rowClassName={() => 'editable-row'}
          bordered
          dataSource={dataSource}
          columns={columns}
          scroll={{ x: columns.length * 200 }}
          pagination={{
            current: pageNum,
            showSizeChanger: true,
            showQuickJumper: true,
            onChange: page => {
              this.setState({ pageNum: page });
            },
            showTotal: total => `共 ${dataSource.length} 条数据`,
          }}
        />
      </div>
    );
  }
}

export default Index;
