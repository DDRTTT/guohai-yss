import React, { Component, useEffect, useState } from 'react';
import { Button, Form, Input, InputNumber, message, Popconfirm, Table, Tooltip } from 'antd';
import { connect } from 'dva';
import styles from './index.less';
import { handleTableCss } from '@/utils/utils';
import EditChildrenDic from './EditChildrenDic';
import Action from '@/utils/hocUtil';

const FormItem = Form.Item;
const EditableContext = React.createContext();

const EditableRow = ({ form, index, ...props }) => (
  <EditableContext.Provider value={ form }>
    <tr { ...props } />
  </EditableContext.Provider>
);

class EditableCell extends React.Component {
  state = {
    editing: false,
  };

  componentDidMount() {
    document.addEventListener('click', this.handleClickOutside, true);
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.handleClickOutside, true);
  }

  toggleEdit = () => {
    const editing = !this.state.editing;
    this.setState({ editing }, () => {
      if (editing) {
        this.input.focus();
      }
    });
  };

  handleClickOutside = e => {
    const { editing } = this.state;
    if (editing && this.cell !== e.target && !this.cell.contains(e.target)) {
      this.save();
    }
  };

  save = () => {
    const { record, handleSave } = this.props;
    this.form.validateFields((error, values) => {
      if (error) {
        return;
      }
      this.toggleEdit();
      handleSave({ ...record, ...values });
    });
  };

  getInput = () => {
    if (this.props.inputType === 'orderNum') {
      return <InputNumber ref={ node => (this.input = node) } onPressEnter={ this.save } min={ 1 } />;
    }
    return <Input ref={ node => (this.input = node) } onPressEnter={ this.save } maxLength={ 200 } />;
  };

  render() {
    const { editing } = this.state;
    const {
      editable,
      dataIndex,
      title,
      record,
      index,
      handleSave,
      isMuch,
      ...restProps
    } = this.props;

    return (
      <td ref={ node => (this.cell = node) } { ...restProps }>
        { editable ? (
          <EditableContext.Consumer>
            { form => {
              this.form = form;
              return editing ? (
                <FormItem style={ { margin: 0 } }>
                  { form.getFieldDecorator(dataIndex, {
                    rules: [
                      {
                        required: dataIndex !== 'remark',
                        message: `请输入${title}`,
                      },
                    ],
                    initialValue: record[dataIndex],
                  })(this.getInput(dataIndex)) }
                </FormItem>
              ) : (
                <div
                  className={ styles.editableCellValueWrap }
                  style={ {
                    paddingRight: 24,
                    height: 20,
                  } }
                  onClick={ this.toggleEdit }
                >
                  { restProps.children }
                </div>
              );
            } }
          </EditableContext.Consumer>
        ) : (
          restProps.children
        ) }
      </td>
    );
  }
}

const EditableFormRow = Form.create()(EditableRow);

@Form.create()
class Index extends Component {
  state = {};

  componentDidMount() {
    // 数据字典初始化
    sessionStorage.setItem('addWordList', JSON.stringify([]));
  }

  componentWillReceiveProps(nextProps) {
    // 接受父组件数据字典数据
    sessionStorage.setItem('addWordList', JSON.stringify(nextProps.data));
  }

  componentWillUnmount() {
    sessionStorage.removeItem('addWordList');
  }

  render() {
    const { data, edit, dictategoryId, deleteParam, dispatch, type, inquiryOneList } = this.props;

    return (
      <div>
        <EditableTable
          data={ data }
          isEdit={ edit }
          dictategoryId={ dictategoryId }
          deleteParam={ deleteParam }
          dispatch={ dispatch }
          type={ type }
          inquiryOneList={ inquiryOneList }
        />
      </div>
    );
  }
}

const EditableTable = props => {
  const [dataSource, setDataSource] = useState([]);
  const [count, setCount] = useState(0);
  const [current, setCurrent] = useState(1);

  useEffect(() => {
    if (props.data instanceof Array) {
      const { dispatch, data } = props;
      setDataSource(data);
      dispatch({
        type: 'wordDictionary/forMoment',
        payload: data,
      });
    }
  }, []);

  const { isEdit } = props;
  const columns = [
    {
      title: '序号',
      dataIndex: 'orderNum',
      editable: isEdit,
      width: 70,
      inputType: 'orderNum',
      render: text => handleTableCss(text),
    },
    {
      title: '字典代码',
      dataIndex: 'code',
      width: 400,
      editable: isEdit,
      render: text => handleTableCss(text),
    },
    {
      title: '字典名称',
      dataIndex: 'name',
      width: 250,
      editable: isEdit,
      render: text => handleTableCss(text),
    },
    {
      title: '联动词汇',
      dataIndex: 'linkageDatadicts',
      width: 300,
      ellipsis: true,
      render: (text, record) => {
        return (
          <div style={ { display: 'flex', justifyContent: 'space-between' } }>
            <Tooltip title={ record.linkageDatadictsName } placement="topLeft">
              <span
                style={ {
                  display: 'inline-block',
                  width: '220px',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                } }
              >
                { record.linkageDatadictsName }
              </span>
            </Tooltip>
            { isEdit ? (
              <Action code="wordDictionary:updateByLinkage">
                <EditChildrenDic
                  datadictId={ record.id }
                  datadictCode={ record.code }
                  inquiryOneList={ props.inquiryOneList }
                  tableCellText={ 'status' in record ? '' : text ? '编辑' : '新增' }
                />
              </Action>
            ) : null }
          </div>
        );
      },
    },
    {
      title: '备注',
      dataIndex: 'remark',
      editable: isEdit,
      width: 250,
      render: text => handleTableCss(text),
    },
    {
      title: '操作',
      align: 'center',
      render: (text, record) => {
        return (
          <Popconfirm title="确定要删除吗?" onConfirm={ () => handleDelete(record.id) }>
            <a>删除</a>
          </Popconfirm>
        );
      },
    },
  ];
  const columns1 = [
    {
      title: '序号',
      dataIndex: 'orderNum',
      editable: isEdit,
      width: 70,
      inputType: 'orderNum',
      render: text => handleTableCss(text),
    },
    {
      title: '字典代码',
      dataIndex: 'code',
      editable: isEdit,
      width: 400,
      render: text => handleTableCss(text),
    },
    {
      title: '字典名称',
      dataIndex: 'name',
      editable: isEdit,
      width: 250,
      render: text => handleTableCss(text),
    },
    {
      title: '联动词汇',
      dataIndex: 'linkageDatadicts',
      width: 300,
      ellipsis: true,
      render: (text, record) => {
        return (
          <div style={ { display: 'flex', justifyContent: 'space-between' } }>
            <Tooltip title={ record.linkageDatadictsName } placement="topLeft">
              <span
                style={ {
                  display: 'inline-block',
                  width: '220px',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                } }
              >
                { record.linkageDatadictsName }
              </span>
            </Tooltip>
            { isEdit ? (
              <Action code="wordDictionary:updateByLinkage">
                <EditChildrenDic
                  datadictId={ record.id }
                  datadictCode={ record.code }
                  inquiryOneList={ props.inquiryOneList }
                  tableCellText={ 'status' in record ? '' : text ? '编辑' : '新增' }
                />
              </Action>
            ) : null }
          </div>
        );
      },
    },
    {
      title: '备注',
      dataIndex: 'remark',
      editable: isEdit,
      width: 250,
      render: text => handleTableCss(text),
    },
  ];
  // 点击删除处理
  const handleDelete = id => {
    const { dispatch } = props;
    if (dataSource.length === 0) {
      message.warn('请输入数据字典');
    } else {
      const arr = dataSource.filter(item => {
        return item.id !== id;
      });
      sessionStorage.setItem('addWordList', JSON.stringify(arr));
      setDataSource(arr);
      dispatch({
        type: 'wordDictionary/forMoment',
        payload: arr,
      });
    }
  };

  // 添加
  const handleAdd = () => {
    const newData = {
      id: count + 1,
      dictategoryId: props.dictategoryId,
      code: '',
      name: ``,
      remark: ``,
      orderNum: dataSource.length + 1,
      status: 0,
      linkageDatadicts: '',
    };

    setDataSource([...dataSource, newData]);
    setCount(count + 1);
    setCurrent(Math.ceil(dataSource.length / 10));
  };

  // 保存
  const handleSave = row => {
    let flag = true;
    const { dispatch, type } = props;
    const newData = [...dataSource];
    const index = newData.findIndex(item => row.id === item.id);
    const item = newData[index];

    for (let i = 0; i < newData.length; i++) {
      if (row.code === newData[i].code && row.id !== newData[i].id) {
        message.warn('字典代码不能重复');
        flag = false;
        break;
      }
    }

    if (flag) {
      newData.splice(index, 1, {
        ...item,
        ...row,
      });
      setDataSource(newData);

      dispatch({
        type: `wordDictionary/${type}`,
        payload: { list: newData },
      });
      dispatch({
        type: 'wordDictionary/forMoment',
        payload: newData,
      });
    }
  };

  const components = {
    body: {
      row: EditableFormRow,
      cell: EditableCell,
    },
  };
  const col = isEdit ? columns : columns1;
  const column = col.map(col => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: record => ({
        record,
        editable: col.editable,
        dataIndex: col.dataIndex,
        isMust: col.isMust,
        title: col.title,
        inputType: col.inputType,
        handleSave,
      }),
    };
  });

  return (
    <>
      { props.isEdit ? (
        <div>
          <Button onClick={ handleAdd } type="primary" style={ { marginBottom: 16 } }>
            添加
          </Button>
          <span> ( 双击空白格编辑字典列表 ) </span>
        </div>
      ) : (
        ''
      ) }
      <Table
        components={ components }
        rowClassName={ styles.editableRow }
        bordered
        dataSource={ dataSource }
        columns={ column }
        scroll={ { x: column.length * 200 } }
        pagination={ {
          current,
          showSizeChanger: true,
          showQuickJumper: true,
          onChange: page => setCurrent(page),
          showTotal: total => `共 ${total} 条数据`,
        } }
      />
    </>
  );
};

export default connect(({ wordDictionary }) => ({
  wordDictionary,
}))(Index);
