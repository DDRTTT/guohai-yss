import React, { PureComponent } from "react";
import { Table } from "antd";
import styles from "./index.less";
import Header from "./header";

export default class StandardTable extends PureComponent {
  state = {
    selectedRowKeys: [],
    totalCallNo: 0,
    columnsdata: [],
    fistcolumnsdata: [],
    checkbox: [],
  };

  componentDidMount() {
    this.initclumus();
  }

  handleRowSelectChange = (selectedRowKeys, selectedRows) => {
    const totalCallNo = selectedRows.reduce((sum, val) => {
      return sum + parseFloat(val.callNo, 10);
    }, 0);

    if (this.props.onSelectRow) {
      this.props.onSelectRow(selectedRows);
    }

    this.setState({ selectedRowKeys, totalCallNo });
  };

  cleanSelectedKeys = () => {
    this.handleRowSelectChange([], []);
  };

  // handleTableChange = (pagination, filters, sorter) => {
  //   this.props.onChange(pagination, filters, sorter);
  // };

  initclumus = () => {
    const { columns } = this.props;
    let _checkbox = [];
    columns.map(function(i) {
      _checkbox.push(i.dataIndex);
    });
    this.setState({
      columnsdata: columns,
      fistcolumnsdata: [...columns],
      checkbox: _checkbox,
    });
  };

  componentWillReceiveProps(nextProps) {
    // clean state
    if (nextProps.selectedRows.length === 0) {
      this.setState({
        selectedRowKeys: [],
        totalCallNo: 0,
      });
    }

    if (nextProps.columns !== this.state.fistcolumnsdata) {
      this.initclumus();
    }
  }


  orderbyindex = (e) => {
    let newArry = [];
    let check = this.state.checkbox;
    e.map(function(dada) {
      if (check.find((n) => n == dada.dataIndex)) {
        newArry.push(dada);
      }
    });
    this.setState({
      columnsdata: newArry,
      fistcolumnsdata: e,
    });
  };


  getcheckboxdata = (e) => {
    let newArry = [];
    this.state.fistcolumnsdata.map(function(dada) {
      if (e.find((n) => n == dada.dataIndex)) {
        newArry.push(dada);
      }
    });
    this.setState({
      checkbox: [...e],
      columnsdata: newArry,
      fistcolumnsdata: [...this.state.fistcolumnsdata],
    });
  };


  render() {
    const { selectedRowKeys, totalCallNo } = this.state;
    const {
      data: { data },
      loading,
      forgtype,
      columns,
      unSelect,
      extra,
      onChange,
      currentPage,
      pageNum,
      rowKey,
      type,
      footer,
      diyhead,
      showSizeChanger,
    } = this.props;

    const paginationProps = {
      showSizeChanger: !showSizeChanger,
      showQuickJumper: true,
      current: currentPage,
      total: data.total,
      showTotal: total => `共 ${total} 条`,
    };

    const rowSelection = {
      selectedRowKeys,
      onChange: this.handleRowSelectChange,
      onSelect: this.handleRowSelectOn,
      type: type ? type : 'checkbox',
      getCheckboxProps: record => ({
        disabled: record.disabled,
      }),
    };

    return (
      <div className={styles.standardTable}>
        <div className={styles.tableAlert}/>
        {
          diyhead == false || columns.length <8 ? null :
            <Header
              checkbox={this.state.checkbox}
              data={this.state.fistcolumnsdata}
              orderbyindex={this.orderbyindex}
              checkboxdata={this.getcheckboxdata}
            />
        }

        <Table
          bordered={true}
          loading={loading}
          rowKey={rowKey ? rowKey : record => record.fid}
          dataSource={data.rows}
          columns={this.state.columnsdata}
          // selections={false}
          rowSelection={unSelect ? null : rowSelection}
          footer={footer ? footer : null}
          pagination={paginationProps}
          onChange={onChange}
          {...extra}
        />

      </div>
    );
  }
}
