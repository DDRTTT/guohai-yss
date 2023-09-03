/**
 * 项目信息详情table组件
 * Create on 2020/9/15.
 */
import React, { Component } from 'react';
import { Table, Input, Button, Popconfirm, Form } from 'antd';
import style from './index.less';

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

class EditableTable extends React.Component {
  constructor(props) {
    super(props);
    this.columns = [
      {
        title: '参与人类型',
        dataIndex: 'name',
        width: '50%',
        editable: true,
      },
      {
        title: '参与人名称',
        dataIndex: 'address',
        width: '50%',
      },
    ];

    this.columnPuls = [
      {
        title: '姓名',
        dataIndex: 'name',
        editable: true,
        fixed: 'left',
      },
      {
        title: '性别',
        dataIndex: 'address',
      },
      {
        title: '证件类型',
        dataIndex: 'address',
      },
      {
        title: '其他证件类型',
        dataIndex: 'address',
      },
      {
        title: '证件号码',
        dataIndex: 'address',
      },
      {
        title: '部门',
        dataIndex: 'address',
      },
      {
        title: '职位',
        dataIndex: 'address',
      },
      {
        title: '项目角色',
        dataIndex: 'address',
      },
      {
        title: '邮箱',
        dataIndex: 'address',
      },
      {
        title: '联系电话',
        dataIndex: 'address',
      },
      {
        title: '备注',
        dataIndex: 'address',
        fixed: 'right',
      },
    ];

    this.state = {
      dataSource: [
        {
          key: '0',
          name: 'Edward King 0',
          address: 'London, Park Lane no. 0',
        },
        {
          key: '1',
          name: 'Edward King 1',
          address: 'London, Park Lane no. 1',
        },
      ],
      count: 2,
    };
  }

  handleDelete = key => {
    const dataSource = [...this.state.dataSource];
    this.setState({ dataSource: dataSource.filter(item => item.key !== key) });
  };

  handleAdd = () => {
    const { count, dataSource } = this.state;
    const newData = {
      key: count,
      name: `Edward King ${count}`,
      age: 32,
      address: `London, Park Lane no. ${count}`,
    };
    this.setState({
      dataSource: [...dataSource, newData],
      count: count + 1,
    });
  };

  handleSave = row => {
    const newData = [...this.state.dataSource];
    const index = newData.findIndex(item => row.key === item.key);
    const item = newData[index];
    newData.splice(index, 1, {
      ...item,
      ...row,
    });
    this.setState({ dataSource: newData });
  };

  render() {
    const { dataSource } = this.state;
    const components = {
      body: {
        row: EditableFormRow,
        cell: EditableCell,
      },
    };
    const columns = this.columns.map(col => {
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
    const columnPuls = this.columnPuls.map(col => {
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
        <div className={style.informationTitle}>
          <span className={style.topTitle}>项目参与人</span>
        </div>
        <Table
          components={components}
          rowClassName={() => 'editable-row'}
          bordered
          dataSource={dataSource}
          columns={columns}
        />
        <div className={style.informationTitle}>
          <span className={style.topTitle}>项目成员信息</span>
        </div>
        <Table
          components={components}
          rowClassName={() => 'editable-row'}
          bordered
          dataSource={dataSource}
          columns={columnPuls}
          scroll={{ x: 1700 }}
        />
      </div>
    );
  }
}

export default EditableTable;
