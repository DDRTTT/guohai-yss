import React, { PureComponent } from 'react';
import { Table, Input, Button, Form,message,Popconfirm } from 'antd';
import styles from '../../Less/publicNum.less';

const FormItem = Form.Item;
const EditableContext = React.createContext();

const EditableRow = ({ form, index, ...props }) => (
  <EditableContext.Provider value={form}>
    <tr {...props} />
  </EditableContext.Provider>
);

const EditableFormRow = Form.create()(EditableRow);

@Form.create()

export default class Twostep extends PureComponent {
  state = {
    dataSource:[],
  }

  componentDidMount() {
  }


  render() {
    const { data, edit, dispatch, type } = this.props;

    return (<div>
      <EditableTable
        data={data}
        isEdit={edit}
        dispatch={dispatch}
        type={type}
        form={this.props.form}
      />
    </div>);
  }
}

class EditableCell extends React.Component {
  state = {
    editing: false,
  }

  componentDidMount() {
    if (this.props.editable) {
      document.addEventListener('click', this.handleClickOutside, true);
    }
  }

  componentWillUnmount() {
    if (this.props.editable) {
      document.removeEventListener('click', this.handleClickOutside, true);
    }
  }

  toggleEdit = () => {
    const editing = !this.state.editing;
    this.setState({ editing }, () => {
      if (editing) {
        this.input.focus();
      }
    });
  }

  handleClickOutside = (e) => {
    const { editing } = this.state;
    if (editing && this.cell !== e.target && !this.cell.contains(e.target)) {
      this.save();
    }
  }

  save = () => {
    const { record, handleSave } = this.props;
    this.form.validateFields((error, values) => {
      if (error) {
        return;
      }
      this.toggleEdit();
      handleSave({ ...record, ...values });
    });
  }

  render() {
    const { editing } = this.state;
    const {
      editable,
      dataIndex,
      title,
      record,
      index,
      handleSave,
      ...restProps
    } = this.props;

    return (<td ref={node => (this.cell = node)} {...restProps}>
        {editable ? (
          <EditableContext.Consumer>
            {(form) => {
              this.form = form;
              return (
                editing ? (
                  <FormItem style={{ margin: 0 }}>
                    {form.getFieldDecorator(dataIndex, {
                      rules: [{
                        required: dataIndex == 'attrOrdnum'?true:false,
                        message: `请输入${title}.`,
                      }],
                      initialValue: record[dataIndex],
                    })(
                      <Input
                        ref={node => (this.input = node)}
                        onPressEnter={this.save}
                      />
                    )}
                  </FormItem>
                ) : (
                  <div
                    className="editable-cell-value-wrap"
                    style={{ paddingRight: 24,minHeight:20,}}
                    onClick={this.toggleEdit}
                  >
                    {restProps.children}
                  </div>
                )
              );
            }}
          </EditableContext.Consumer>
        ) : restProps.children}
      </td>
    );
  }
}

class EditableTable extends React.Component {
  state = {
    dataSource: [],
    attrOrdnum: 0
  };

  columns = [
    {
      title: '编号',
      dataIndex: 'attrOrdnum',
      editable: true,
      width: 230,
    }, {
      title: '属性名称',
      dataIndex: 'attrCode',
      editable: true,
      width: 230,
    }, {
      title: '标签',
      dataIndex: 'attrName',
      editable: true,
      width: 230,
    },{
      title: '属性样式',
      dataIndex: 'attrStyle',
      editable: true,
      width: 230,
    },{
      title: '消息样式',
      dataIndex: 'contStyle',
      editable: true,
      width: 230,
    },{
      title: '内容',
      dataIndex: 'contExamples',
      editable: true,
      width: 230,
    },{
      title: '操作',
      dataIndex: 'id',
      width: '150px',
      align:'center',
      // fixed: 'right',
      render: (text, record) => {
        return (
          <Popconfirm title="确定要删除吗?" onConfirm={() => this.handleDelete(record)}>
            <a href="javascript:;">删除</a>
          </Popconfirm>
        );
      },
    }];

  componentWillReceiveProps(e) {
    this.setState({
      dataSource: e.data,
    })
    if (e.data.length != 0) {
      this.setState({
        attrOrdnum: this.getIdMax(e.data),
      })
    }else{
      this.setState({
        attrOrdnum:0
      })
    }
  }

  componentWillUnmount(){
    sessionStorage.removeItem("publicApp");
    sessionStorage.removeItem("mouldIdentity");
  }

  //获取最大的id数
  getIdMax = (list) => {
    let max;
    for (let i = 0; i < list.length; i++) {
      if (i < list.length - 1) {
        if (list[i].attrOrdnum > list[i + 1].attrOrdnum) {
          max = list[i].attrOrdnum
        } else {
          max = list[i + 1].attrOrdnum
        }
      } else if (i == list.length - 1 && list.length > 1) {
        if (list[i].attrOrdnum > list[i - 1].attrOrdnum) {
          max = list[i].attrOrdnum
        } else {
          max = list[i - 1].attrOrdnum
        }
      } else {
        max = list[i].attrOrdnum
      }

    }
    return max
  }

  testNull = (a,b,c,d) =>{

    if( a !=''&&b!='' ){
      return 'nice'
    }else if(a == '' && b ==''){
      return 'nulla'
    }else{
      return a == ''?c:d
    }
  }

  //添加一条记录
  handleAdd = () => {
    const { dispatch } = this.props;
    const { attrOrdnum, dataSource } = this.state;

    let max = this.getIdMax(dataSource);

    const newData = {
      count:max?max+1:parseInt(attrOrdnum)+1,
      attrOrdnum:max?max+1:parseInt(attrOrdnum)+1,
      attrCode: '',
      attrName: '',
      attrStyle:'',
      contStyle:'',
      contExamples:'',
    };

    this.setState({
      dataSource: [...dataSource, newData],
    });

  }

  //存储一条记录
  handleSave = (row) => {
    const { dispatch } = this.props;
    const newData = [...this.state.dataSource];
    const index = newData.findIndex(item => row.attrOrdnum === item.attrOrdnum);
    const item = newData[index];

    newData.map((e,i)=>{
      if( row.count!=e.count && row.attrOrdnum == e.attrOrdnum ){
        message.warn('编号不能重复')
        return false
      }
    })

    newData.splice(index, 1, {
      ...item,
      ...row,
    });


    //存储数据
    this.setState({ dataSource: newData },()=>{

      dispatch({
        type: 'publicNum/memory',
        payload: {
          list: this.state.dataSource
        },
      });
    });

  }

  //点击删除处理
  handleDelete = (record) => {
    const {  dispatch } = this.props
    const dataSource = [...this.state.dataSource];

    this.setState({ dataSource: dataSource.filter(item => item.attrOrdnum !== record.attrOrdnum)},()=>{
      dispatch({
        type: 'publicNum/memory',
        payload: {
          list: this.state.dataSource
        },
      });
    });

  }

  //提交代码
  sureMould = () => {
    const { form, dispatch,type } = this.props
    form.validateFields((err, fieldsValue) => {
      if(!err){
        let isJump = true;

        if(this.state.dataSource.length == 0){
          message.warn('消息模板不能为空！');
           isJump =  false;
        }

        this.state.dataSource.map((item,i)=>{
          let test = this.testNull(item.attrCode,item.contStyle,'属性名称','消息样式')
          let test2 = this.testNull(item.attrName,item.attrStyle,'标签','属性样式')

          if( test=='nulla' && test2=='nulla' ){
            message.warn('添加数据不能为空！')
            isJump =  false;
          }else{
            if(test != 'nice' && test != 'nulla'){
              message.warn(test+'不能为空');
              isJump =  false;
            }

            if(test2 != 'nice' && test2 != 'nulla'){
              message.warn(test2+'不能为空');
              isJump =  false;
            }
          }

        })

        fieldsValue.conInfo = this.state.dataSource;
        fieldsValue.appAuthId = sessionStorage.getItem("publicApp");
        fieldsValue.id = type == 'addMould'?null:sessionStorage.getItem("mouldIdentity");


        if(isJump){
          dispatch({
            type: type == 'addMould'?'publicNum/mouldAdd':'publicNum/mouldUpdate',
            payload: fieldsValue,
          });
        }else{
          dispatch({
            type: 'publicNum/memory',
            payload: {
              list: this.state.dataSource
            },
          });
        }
      }
    })

  }

  render() {
    const { dataSource } = this.state;
    const { data } = this.props;
    const components = {
      body: {
        row: EditableFormRow,
        cell: EditableCell,
      },
    };
    const columns = this.columns.map((col) => {
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
        {this.props.isEdit ?
          <div>
            <Button onClick={this.handleAdd} type="primary" style={{ marginBottom: 16, width: 86, height: 26 }}>
              添加
            </Button><span> ( 双击空白格编辑字典列表 ) </span>
          </div> : ''}
        <Table
          components={components}
          rowClassName={styles.editableRow}
          bordered
          dataSource={dataSource}
          columns={columns}
        />
        <div style={{marginTop:20}}>
          <Button type="primary" onClick={()=>this.sureMould()} style={{marginRight:10}}>确定</Button>
          {/*<Button>取消</Button>*/}
        </div>
      </div>
    );
  }
}

