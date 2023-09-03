import React, { Component } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import Action, { linkHoc } from '@/utils/hocUtil';
import { errorBoundary } from '@/layouts/ErrorBoundary';
import { Form, Table, Input, Modal, Breadcrumb, Row, Col, Icon, Button, Select, Divider, Popconfirm, Checkbox, Empty, Tooltip, Spin, message } from 'antd';
import styles from './dataTable.less';
import List from '@/components/List';
import { Card } from '@/components';
import { getSession } from '@/utils/session';

const { Search } = Input;
const { confirm } = Modal;
const { Option } = Select;
const CheckboxGroup = Checkbox.Group;

let _data_l = [];
let _data_r = [];
let once = false;

@Form.create()
class Index extends Component {
  state = {
    loading: false,
    tableTitle: '',
    tableVisible: false,
    tableLoading: false,
    detailsVisible: false,
    mapVisible: false,
    mapLoading: false,
    mapTitle: '',
    isUpdate: false,
    record: {},

    data_l: [],
    check_l: '',
    item_l: {},
    data_r: [],
    check_r: '',
    item_r: {},
    impactType: false,
    data_m: [],
    lLoading: false,
    rLoading: false,

    sourceData: [],
    sourceLoading: false,

    dropTableList: [],
    dropTableLoading: false,

    mTableList: [],
    mTableLoading: false,
    current: 1,
    pageSize: 40,
    total: 0,

    orgData: [],
    dropDownData: [],

    dataSource: [],
    dataSourceCode: '',
    tableSource: [],

    formVals: {},

    detailsLoading: false,
    detailsData: {},

    resData: {},
    val: '',

    leftColumnMappingId: '', // 修改时用
    rightColumnMappingId: '',

  };

  titleNav = () => {
    return (
      <Breadcrumb>
        <Breadcrumb.Item>产品要素管理</Breadcrumb.Item>
        <Breadcrumb.Item>数据表映射关系</Breadcrumb.Item>
      </Breadcrumb>
    );
  }

  reSearch = val => {
    this.setState({ current: 1 }, () => {
      this.search(val);
    })
  }

  search = val => {
    const { current, pageSize } = this.state;
    this.setState({ loading: true }, () => {
      this.props.dispatch({
        type: 'dataTable/query',
        payload: {
          pagination: { page: current, size: pageSize },
          sort: { createTime: 'desc' },
          conditionsOr: [
            { name: 'tableLeft', operator: 'LIKE', value: val },
            { name: 'tableRight', operator: 'LIKE', value: val },
          ],
        }
      }).then(res => {
        if (res) {
          this.setState({ dataSource: res.content, total: res.totalElements, formVals: {}, val, })
        }
        this.setState({ loading: false })
      })
    })
  }

  resetForm = () => {
    this.props.form.resetFields();
    this.setState({ formVals: {}, val: '', current: 1 }, () => {
      this.search('');
    });// current 重置为 1
  }

  del = id => {
    const { formVals } = this.state;
    this.setState({ loading: true }, () => {
      this.props.dispatch({
        type: 'dataTable/del',
        payload: { id }
      }).then(res => {
        if (res) {
          // 保留查询条件 刷新列表
          this.query(formVals)
        } else {
          this.setState({ loading: false })
        }
      })
    })
  }

  modalDetails = record => {
    this.setState({ detailsVisible: true, detailsLoading: true }, () => {
      this.props.dispatch({
        type: 'dataTable/getMapping',
        payload: { id: record.id }
      }).then(res => {
        if (res) {
          this.setState({ detailsData: res, detailsLoading: false })
        }
        this.setState({ detailsLoading: false })
      })
    })
  }

  detailsCancel = () => {
    this.setState({ detailsVisible: false, detailsLoading: false })
  }

  getTableRelationship = record => {
    this.setState({ tableTitle: record.tableLeft, tableVisible: true, tableLoading: true }, () => {
      this.props.dispatch({
        type: 'dataTable/getTableRelationship',
        payload: { ...record },
      }).then(res => {
        if (res) {
          this.setState({ tableSource: res })
        }
        this.setState({ tableLoading: false })
      })
    })
  }

  tableCancel = () => {
    this.setState({ tableVisible: false, tableTitle: '', tableSource: [] })
  }

  setMappingModal = (record, mapTitle, isUpdate) => {
    const { dispatch } = this.props;
    this.setState({ mapVisible: true, record, mapTitle, isUpdate, impactType: false, data_l: [], data_r: [], check_l: '', check_r: '', item_l: {}, item_r: {}, data_m: [], mTableList: [], resData: {}, dropTableList: [] }, () => {
      if (isUpdate) {
        once = true;
        this.setState({ mapLoading: true }, () => {
          dispatch({
            type: 'dataTable/getDetails',
            payload: { id: record.id }
          }).then(res => {
            if (res) {
              // set data
              const columnMapping = res.columnMapping;
              this.setState({ resData: res, leftColumnMappingId: columnMapping?.leftColumnMappingId, rightColumnMappingId: columnMapping?.rightColumnMappingId }, () => {
                this.sourceChange(columnMapping);
                this.tableChange(columnMapping?.referencedTable, 'l');
                this.tableChange(columnMapping?.tableName, 'r');
                this.impactChange(res?.tableMapping);
              })
            }
            this.setState({ mapLoading: false })
          })
        })
      }
    })
  }

  mapModalCancel = () => {
    this.setState({ mapVisible: false, item_l: {}, item_r: {}, check_l: '', check_r: '', impactType: false, mapLoading: false, data_l: [], data_r: [], data_m: [], resData: {}, dropTableList: [] })
    _data_l = _data_r = [];
  }

  getTableName = (val, isMiddel, isDesc) => {
    const { dropTableList, mTableList } = this.state;
    let name = '';
    if (isMiddel) {// 此处前端不用修改，需要返回id（后台需要改动，并且前端需要配合联调，在点确定时，多传两个字段）
      mTableList.forEach(item => {
        if (item.id === val) {
          name = item.masterTableName;
        }
      })
    } else {
      dropTableList.forEach(item => {
        if (item.id === val) {
          if (isDesc) {
            name = item.masterTableDesc
          } else {
            name = item.masterTableName;
          }
        }
      })
    }
    return name;
  }

  mapSave = () => {
    const { item_l, item_r, impactType, data_m, check_l, check_r, sourceData, formVals, record, isUpdate, resData, leftColumnMappingId, rightColumnMappingId } = this.state;
    const { dispatch, form } = this.props;
    form.validateFields(['table_l', 'table_r', '_impact', 'middle', '_orgId', '_sysId'], (err, vals) => {
      if (err) return;
      if (check_l === '' || check_r === '') {
        message.warn('请填写完整');
        return;
      } else {
        this.setState({ mapLoading: true }, () => {
          let tableLeft = '', tableRight = '';
          let payload = {
            tableMapping: {
              tableLeft: this.getTableName(vals.table_l, false, false),  // 左表
              tableRight: this.getTableName(vals.table_r, false, false),  // 右表
              tableLeftDesc: this.getTableName(vals.table_l, false, true),  // 左表说明
              tableRightDesc: this.getTableName(vals.table_r, false, true),  // 右表说明
              // dataSourceCode: vals._name, // 数据源
              mapping: vals._impact,  // 表关系
              orgId: vals._orgId,  // 机构
              sysId: vals._sysId,  // 系统
              id: isUpdate ? record.id : undefined,
            },
            columnMappingList: [{
              tableLeftColumn: item_l?.columnName,  // 左表列名
              tableLeftColumnDesc: item_l?.columnNameDesc,  //左表列名的中文中说明
              tableMiddleLeftColumn: data_m[0]?.columnName,  // 中间表对应左表的列
              tableMiddleLeftColumnDesc: data_m[0]?.columnNameDesc,  // 中间表对应左表的列的说明
              tableMiddleRightColumn: data_m[1]?.columnName,  // 中间表对应右表的列
              tableMiddleRightColumnDesc: data_m[1]?.columnNameDesc,  // 中间表对应右表的列说明
              tableRightColumn: item_r?.columnName,  // 右表列名
              tableRightColumnDesc: item_r?.columnNameDesc,  // 右表列名的中文说明
              id: isUpdate ? resData?.columnMapping?.id : undefined,
              leftColumnMappingId: isUpdate ? leftColumnMappingId : undefined,
              rightColumnMappingId: isUpdate ? rightColumnMappingId : undefined,
            }],
            tableMiddle: this.getTableName(vals.middle, true, false),  // 中间表
          }
          dispatch({
            type: 'dataTable/mapSave',
            payload
          }).then(res => {
            if (res) {
              message.success('操作成功')
              this.mapModalCancel();
              this.query(formVals)
            }
            this.setState({ mapLoading: false })
          })
        })
      }
    })
  }

  onSearchL = val => {
    if (val) {
      this.setState({ data_l: _data_l.filter(key => key.columnName?.includes(val.toUpperCase())) })
    } else {
      this.setState({ data_l: _data_l })
    }
  }

  checkBoxChangeL = ({ target: { checked } }, item) => {
    this.setState({ check_l: checked ? item.id : '', item_l: checked ? item : {} })
  }

  onSearchR = val => {
    if (val) {
      this.setState({ data_r: _data_r.filter(key => key.columnName?.includes(val.toUpperCase())) })
    } else {
      this.setState({ data_r: _data_r })
    }
  }

  checkBoxChangeR = ({ target: { checked } }, item) => {
    this.setState({ check_r: checked ? item.id : '', item_r: checked ? item : {} })
  }

  impactChange = val => {
    const { resData } = this.state;
    const vals = this.props.form.getFieldsValue(['_orgId', '_sysId']);
    this.setState({ impactType: val === 'ManyToMany' });
    if (val === 'ManyToMany') {
      const { dispatch, form } = this.props;
      this.setState({ mTableLoading: true }, () => {
        dispatch({
          type: 'dataTable/getTableList',
          payload: {
            conditions: [{
              name: 'orgId',
              operator: 'EQ',
              value: vals._orgId || '',
            }, {
              name: 'sysId',
              operator: 'EQ',
              value: vals._sysId || '',
            }, {
              name: 'middleTable',
              operator: 'EQ',
              value: 1,
            }],
            conditionsOr: [],
            pagination: {},
            sort: {},
            params: '',
          }
        }).then(res => {
          if (res) {
            this.setState({ mTableList: res })
            if (Object.keys(resData).length > 0 && resData?.tableMapping === 'ManyToMany') {
              this.setState({
                data_m: [{ columnName: resData?.tableMiddleLeftColume, columnNameDesc: resData?.tableMiddleLeftColumeDesc }, { columnName: resData?.tableMiddleRightColume, columnNameDesc: resData?.tableMiddleRightColumeDesc }]
              })
            }
          }
          this.setState({ mTableLoading: false })
        })
      })
    }
  }

  mTableChange = val => {
    this.props.dispatch({
      type: 'dataTable/getColumns',
      payload: { id: val }
    }).then(res => {
      if (res) {
        let i = 0;
        res.forEach((item, index) => {
          if (item.columnName.toLowerCase() === 'fid') {
            i = index;
          }
        })
        res.splice(i, 1);
        this.setState({ data_m: res })
      }
    })
  }

  exchange = () => {
    const { data_m } = this.state;
    let arr = [];
    arr.push(data_m[1]);
    arr.push(data_m[0]);
    this.setState({ data_m: arr })
  }

  tableChange = (val, flag) => {
    const { resData } = this.state;
    this.setState({ [`${flag}Loading`]: true }, () => {
      this.props.dispatch({
        type: 'dataTable/getColumns',
        payload: { id: val }
      }).then(res => {
        if (res) {
          this.setState({ [`data_${flag}`]: res, [`item_${flag}`]: {}, [`check_${flag}`]: '' });
          if (flag === 'r') {
            if (Object.keys(resData).length > 0 && resData?.columnMapping?.columnName) {
              res.forEach(item => {
                if (item.columnName === resData?.columnMapping?.columnName) {
                  this.setState({ [`item_${flag}`]: item, [`check_${flag}`]: item.id })
                }
              })
            }
            _data_r = res;
          }
          if (flag === 'l') {
            if (Object.keys(resData).length > 0 && resData?.columnMapping?.referencedColumn) {
              res.forEach(item => {
                if (item.columnName === resData?.columnMapping?.referencedColumn) {
                  this.setState({ [`item_${flag}`]: item, [`check_${flag}`]: item.id })
                }
              })
            }
            _data_l = res;
          }
        }
        this.setState({ [`${flag}Loading`]: false })
      })
    })
  }

  sourceChange = vals => {
    // 下拉显示表信息
    this.setState({ mapLoading: true }, () => {
      this.props.dispatch({
        type: 'dataTable/getTableList',
        payload: {
          conditions: [{
            name: 'orgId',
            operator: 'EQ',
            value: vals?._orgId || vals?.orgId,
          }, {
            name: 'sysId',
            operator: 'EQ',
            value: vals?._sysId || vals?.sysId,
          }, {
            name: 'middleTable',
            operator: 'EQ',
            value: 0,
          }],
          conditionsOr: [],
          pagination: {},
          sort: {},
          params: '',
        }
      }).then(res => {
        if (res) {
          if (once) {
            this.setState({ dropTableList: res });
            once = false;
          } else {
            this.setState({ dropTableList: res, impactType: false, data_l: [], data_r: [], check_l: '', check_r: '', item_l: {}, item_r: {}, data_m: [], mTableList: [], resData: {} });
            this.props.form.resetFields(['table_l', 'table_r', '_impact', 'middle']);
          }
        }
        this.setState({ mapLoading: false })
      })
    })
  }

  getTable = () => {
    const { form } = this.props;
    form.validateFields(['_orgId', '_sysId'], (err, vals) => {
      if (err) return;
      this.sourceChange(vals);
    })
  }

  advancedQuery = vals => {
    this.setState({ current: 1 }, () => {
      this.query(vals);
    })
  }

  query = vals => {
    if (!vals) {
      vals = {};
    }
    const { dispatch } = this.props;
    const { current, pageSize } = this.state;
    let conditions = [];
    Object.keys(vals).forEach(k => {
      if (vals[k]) {
        conditions.push({ name: k, operator: ['tableLeft', 'tableRight'].includes(k) ? 'LIKE' : 'EQ', value: vals[k] })
      }
    })
    let payload = {
      conditions,
      pagination: {
        page: current,
        size: pageSize,
      },
      sort: {
        createTime: 'desc',
      },
    }
    this.setState({ loading: true }, () => {
      dispatch({
        type: 'dataTable/query',
        payload,
      }).then(res => {
        if (res) {
          this.setState({ dataSource: res.content, total: res.totalElements, formVals: vals, val: '' })
        }
        this.setState({ loading: false })
      })
    })
  }



  handleSetPageNum = current => {
    const { formVals, val } = this.state;
    this.setState({ current }, () => {
      if (Object.keys(formVals).length > 0) {
        this.query(formVals);
      } else {
        this.search(val)
      }
    })
  }

  handleSetPageSize = (current, pageSize) => {
    const { formVals, val } = this.state;
    this.setState({ current, pageSize }, () => {
      if (Object.keys(formVals).length > 0) {
        this.query(formVals);
      } else {
        this.search(val)
      }
    })
  }

  getOrgData = () => {
    this.props.dispatch({
      type: 'dataSource/getOrgData',
      payload: { "isOut": true, "pageNum": 1, "pageSize": 9999 }
    }).then(res => {
      if (res) {
        this.setState({ orgData: res })
      }
    })
  }

  getDropData = () => {
    this.props.dispatch({
      type: 'dataSource/getDropdownData',
      payload: { codeList: 'attributionSystem' }
    }).then(res => {
      if (res) {
        this.setState({ dropDownData: res })
      }
    })
  }

  getSourceData = () => {
    this.setState({ sourceLoading: true }, () => {
      let payload = {};
      this.props.form.validateFields(['_orgId', '_sysId'], (err, vals) => {
        if (err) return;
        let conditions = [];
        Object.keys(vals).forEach(k => {
          if (vals[k]) {
            conditions.push({ name: k.substr(1), operator: 'EQ', value: vals[k] })
          }
        })
        payload = {
          conditions,
          pagination: {},
          sort: {
            createTime: 'desc',
          },
          params: '',
        }
      });
      this.props.dispatch({
        // type: 'dataSource/getList'
        type: 'dataSource/getListCondition',
        payload,
      }).then(res => {
        if (res) {
          this.setState({ sourceData: res, impactType: false, data_l: [], data_r: [], check_l: '', check_r: '', item_l: {}, item_r: {}, data_m: [], mTableList: [], resData: {} })
        }
        this.setState({ sourceLoading: false });
      })
    })
  }

  examine = (id, flag) => {
    this.setState({ loading: true }, () => {
      this.props.dispatch({
        type: 'dataTable/checkOr',
        payload: { idList: [id], checked: flag }
      }).then(res => {
        if (res) {
          message.success('操作成功');
          this.query(this.state.formVals);
        }
        this.setState({ loading: false })
      })
    })
  }

  getOrgNameByorgCode = val => {
    let name = '';
    if (val) {
      const { orgData } = this.state;
      if (orgData?.length > 0) {
        orgData.forEach(item => {
          if (item.id === val) {
            name = item.orgName;
          }
        })
      }
    }
    return name;
  }

  getNameByCode = (val = '', orgType = '', url = '') => {
    let data = [], name = '';
    if (val) {
      const { dropDownData } = this.state;
      if (orgType) {
        data = dropDownData[orgType];
        if (data?.length > 0) {
          data.forEach(item => {
            if (item.code === val) {
              name = item.name;
            }
          })
        }
      }
    }
    return name;
  }

  getMappingNameByCode = val => {
    const mapping = [{ code: 'OneToOne', name: '一对一' }, { code: 'OneToMany', name: '一对多' }, { code: 'ManyToOne', name: '多对一' }, { code: 'ManyToMany', name: '多对多' }]
    let name = '';
    if (val) {
      mapping.forEach(item => {
        if (val === item.code) {
          name = item.name;
        }
      })
    }
    return name;
  }

  componentDidMount() {
    this.getOrgData();
    this.getDropData();
    // this.getSourceData();
    const { formVals } = this.state;
    this.query(formVals)
  }

  render() {
    const { loading, tableTitle, tableVisible, tableLoading, detailsVisible, mapLoading, mapVisible, mapTitle, record, data_l, check_l, item_l, data_r, check_r, item_r, impactType, data_m, lLoading, rLoading, sourceLoading, sourceData, dropTableList, dropTableLoading, mTableList, mTableLoading, total, current, pageSize, dataSource, orgData, dropDownData, tableSource, detailsLoading, detailsData, resData } = this.state;

    const loginOrgId = getSession('loginOrgId');
    const loginId = getSession('loginId');

    const dataTableColumns = [
      { title: '序号', dataIndex: 'id', key: 'id', width: 90, fixed: 'left', align: 'center', render: (val, record, index) => `${index + 1 + (current - 1) * pageSize}` },
      { title: '左表', dataIndex: 'tableLeft', key: 'tableLeft', width: 290, fixed: 'left', ellipsis: true, render: (val, record) => (<Tooltip placement="topLeft" title={val}><a onClick={() => this.getTableRelationship(record)}>{val}</a></Tooltip>) },
      { title: '左表名称说明', dataIndex: 'tableLeftDesc', key: 'tableLeftDesc', ellipsis: true, render: (text) => (<Tooltip placement="topLeft" title={text}>{text}</Tooltip>) },
      { title: '右表', dataIndex: 'tableRight', key: 'tableRight', ellipsis: true, render: (text) => (<Tooltip placement="topLeft" title={text}>{text}</Tooltip>) },
      { title: '右表名称说明', dataIndex: 'tableRightDesc', key: 'tableRightDesc', ellipsis: true, render: (text) => (<Tooltip placement="topLeft" title={text}>{text}</Tooltip>) },
      // { title: '数据源名称', dataIndex: 'dataSourceDesc', key: 'dataSourceDesc', ellipsis: true, render: (text) => (<Tooltip placement="topLeft" title={text}>{text}</Tooltip>) },
      { title: '表关系', dataIndex: 'mapping', key: 'mapping', render: val => this.getMappingNameByCode(val) },
      { title: '归属机构', dataIndex: 'orgId', key: 'orgId', ellipsis: true, render: val => (<Tooltip placement="topLeft" title={this.getOrgNameByorgCode(val)}>{this.getOrgNameByorgCode(val)}</Tooltip>) },
      { title: '归属系统', dataIndex: 'sysId', key: 'sysId', render: val => this.getNameByCode(val, 'attributionSystem') },
      { title: '创建人', dataIndex: 'creatorId', key: 'creatorId' },
      { title: '创建时间', dataIndex: 'createTime', key: 'createTime' },
      { title: '最后修改人', dataIndex: 'lastEditorId', key: 'lastEditorId' },
      { title: '最后修改时间', dataIndex: 'lastEditTime', key: 'lastEditTime' },
      { title: '审核状态', dataIndex: 'checked', key: 'checked', render: val => (+val === 0 ? '未审核' : '已审核') },
      { title: '审核人', dataIndex: 'checkerId', key: 'checkerId' },
      { title: '审核时间', dataIndex: 'checkerTime', key: 'checkerTime' },
      {
        title: '操作', align: 'center', fixed: 'right', width: 300, render: (text, record) => (
          <span>
            <a onClick={() => this.modalDetails(record)}>查看</a>
            <Divider type="vertical" />
            <a disabled={+record.checked !== 0} onClick={() => this.setMappingModal(record, '修改', true)}>修改</a>
            <Divider type="vertical" />
            <a disabled={+record.checked !== 0} onClick={() => this.examine(record.id, 1)}>审核</a>
            <Divider type="vertical" />
            <a disabled={+record.checked === 0} onClick={() => this.examine(record.id, 0)}>反审核</a>
            <Divider type="vertical" />
            <Popconfirm
              placement="topRight"
              title={'确认删除此条数据么？'}
              onConfirm={() => this.del(record.id)}
              okText="确定"
              cancelText="取消"
            >
              <a disabled={+record.checked !== 0}>删除</a>
            </Popconfirm>
          </span>
        )
      },
    ];
    const modalColumns = [
      { title: '左表', dataIndex: 'referencedTable', key: 'referencedTable', ellipsis: true, render: val => (<Tooltip placement="topLeft" title={val}>{tableTitle === val ? <span style={{ fontWeight: 'bold' }}>{val}</span> : <span>{val}</span>}</Tooltip>) },
      { title: '表关系', dataIndex: 'tableMapping', key: 'tableMapping', render: val => this.getMappingNameByCode(val) },
      { title: '右表', dataIndex: 'tableName', key: 'tableName', ellipsis: true, render: val => (<Tooltip placement="topLeft" title={val}>{tableTitle === val ? <span style={{ fontWeight: 'bold' }}>{val}</span> : <span>{val}</span>}</Tooltip>) },
      { title: '左表列名', dataIndex: 'referencedColumn', key: 'referencedColumn', ellipsis: true, render: (text) => (<Tooltip placement="topLeft" title={text}>{text}</Tooltip>) },
      { title: '列名的中文说明', dataIndex: 'referencedColumnDesc', key: 'referencedColumnDesc', ellipsis: true, render: (text) => (<Tooltip placement="topLeft" title={text}>{text}</Tooltip>) },
      { title: '中间表', dataIndex: 'tableMiddle', key: 'tableMiddle', ellipsis: true, render: (text) => (<Tooltip placement="topLeft" title={text}>{text}</Tooltip>) },
      { title: '右表列名', dataIndex: 'columnName', key: 'columnName', ellipsis: true, render: (text) => (<Tooltip placement="topLeft" title={text}>{text}</Tooltip>) },
      { title: '列名的中文说明', dataIndex: 'columnNameDesc', key: 'columnNameDesc', ellipsis: true, render: (text) => (<Tooltip placement="topLeft" title={text}>{text}</Tooltip>) },
    ];
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 10 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 14 },
      },
    };
    const formItemData = [
      {
        name: 'orgId',
        label: '归属机构',
        type: 'select',
        readSet: { name: 'orgName', code: 'id' },
        option: orgData,
        disabled: loginId === '1' ? false : true,
        initialValue: loginId === '1' ? undefined : loginOrgId,// 非超级管理员登录，默认为登录时的归属机构
      },
      {
        name: 'sysId',
        label: '归属系统',
        type: 'select',
        readSet: { name: 'name', code: 'code' },
        option: dropDownData?.attributionSystem,
      },
      // {
      //   name: 'dataSourceDesc',
      //   label: '数据源名称',
      //   type: 'select',
      //   readSet: { name: 'name', code: 'code' },
      //   option: sourceData,
      // },
      {
        name: 'mapping',
        label: '表关系',
        type: 'select',
        readSet: { name: 'name', code: 'code' },
        option: [
          { name: '一对一', code: 'OneToOne' },
          { name: '一对多', code: 'OneToMany' },
          { name: '多对一', code: 'ManyToOne' },
          { name: '多对多', code: 'ManyToMany' },
        ],
      },
      {
        name: 'tableLeft',
        label: '左表',
        type: 'input',
        // type: 'select',
        // readSet: { name: 'masterTableName', code: 'id' },
        // option: dropTableList,
      },
      {
        name: 'tableRight',
        label: '右表',
        type: 'input',
        // type: 'select',
        // readSet: { name: 'masterTableName', code: 'id' },
        // option: dropTableList,
      },
    ];
    return (
      <>
        <List
          title='数据表映射关系'
          formItemData={formItemData}
          customLayout={{
            labelAlign: 'right',
            labelCol: { span: 10 },
            wrapperCol: { span: 14 },
          }}
          advancSearch={this.advancedQuery}
          resetFn={this.resetForm}
          searchPlaceholder="请输入"
          fuzzySearch={this.reSearch}
          extra={<Button type='primary' onClick={() => this.setMappingModal({}, '新增', false)}>新增</Button>}
          tableList={(
            <Table
              dataSource={dataSource}
              columns={dataTableColumns}
              loading={loading}
              scroll={{ x: dataTableColumns.length * 200, y: 590 }}
              pagination={{
                showSizeChanger: true,
                showQuickJumper: true,
                total,
                showTotal: () => `共 ${total} 条`,
                onChange: page => this.handleSetPageNum(page),
                onShowSizeChange: (page, size) => this.handleSetPageSize(page, size),
                pageSize,
                current,
              }}
            />)
          }
          loginId={loginId}
        />
        <Modal
          title={`${tableTitle}表详情`}
          visible={tableVisible}
          width={1200}
          // onOk={this.tableCancel}
          onCancel={this.tableCancel}
          footer={null}
          destroyOnClose={true}
        >
          <div style={{ marginLeft: 60, marginBottom: 15, fontWeight: 'bold' }}>表名：{tableTitle}</div>
          <Table
            size='small'
            dataSource={tableSource}
            columns={modalColumns}
            loading={tableLoading}
            pagination={false}
            scroll={{ y: 500 }}
          />
          <div style={{ textAlign: 'right', marginBottom: 20, marginTop: 20 }}><Button style={{ marginRight: 10 }} onClick={this.tableCancel}>取消</Button></div>
        </Modal>
        <Modal
          title='查看详情'
          visible={detailsVisible}
          onOk={this.detailsCancel}
          onCancel={this.detailsCancel}
          destroyOnClose={true}
          width={800}
        >
          <Spin size='small' spinning={detailsLoading}>
            <div style={{ paddingLeft: 40 }}>
              <p>表关系: {this.getMappingNameByCode(detailsData?.tableMapping)}</p>
              <p>关联详情:
                {detailsData?.tableMapping === 'ManyToMany' ? <>
                  <span style={{ marginLeft: 5 }}>{detailsData?.columnMapping?.referencedTable}</span>-<span>{detailsData?.columnMapping?.referencedColumn}</span>
                  <Icon type="link" style={{ margin: '0 10px' }} />
                  <span>{detailsData?.tableMiddleLeftColume}</span>-<span>{detailsData?.tableMiddleRightColume}</span>
                  <Icon type="link" style={{ margin: '0 10px' }} />
                  <span>{detailsData?.columnMapping?.tableName}</span>-<span>{detailsData?.columnMapping?.columnName}</span>
                </> : <>
                  <span style={{ marginLeft: 5 }}>{detailsData?.columnMapping?.referencedTable}</span>-<span>{detailsData?.columnMapping?.referencedColumn}</span>
                  <Icon type="link" style={{ margin: '0 10px' }} />
                  <span>{detailsData?.columnMapping?.tableName}</span>-<span>{detailsData?.columnMapping?.columnName}</span>
                </>}

              </p>
            </div>
          </Spin>
        </Modal>
        <Modal
          title={`表映射${mapTitle}`}
          visible={mapVisible}
          // visible={true}
          width={1400}
          onCancel={this.mapModalCancel}
          footer={null}
          destroyOnClose={true}
          style={{ top: 20 }}
        >
          {mapVisible && <Spin spinning={mapLoading}>
            <div style={{ height: 800 }}>
              <Row>
                <Col md={8}>
                  <Form.Item label="归属机构:" {...formItemLayout}>
                    {getFieldDecorator('_orgId', {
                      rules: [{ required: true, message: '请选择归属机构' }],
                      initialValue: loginId === '1' ? (resData?.columnMapping?.orgId) : loginOrgId,
                    })(
                      <Select onSelect={this.getTable} style={{ width: '100%' }} placeholder='请选择归属机构' disabled={loginId === '1' ? false : true} showSearch optionFilterProp="children">
                        {orgData.length > 0 && orgData.map(item => (
                          <Option key={item.id} value={item.id}>{item.orgName}</Option>
                        ))}
                      </Select>
                    )}
                  </Form.Item>
                </Col>
                <Col md={8}>
                  <Form.Item label="归属系统:" {...formItemLayout}>
                    {getFieldDecorator('_sysId', {
                      rules: [{ required: true, message: '请选择归属系统' }],
                      initialValue: resData?.columnMapping?.sysId,
                    })(
                      <Select onSelect={this.getTable} style={{ width: '100%' }} placeholder='请选择归属系统' showSearch optionFilterProp="children">
                        {dropDownData?.attributionSystem?.length > 0 && dropDownData.attributionSystem.map(item => (
                          <Option key={item.code} value={item.code}>{item.name}</Option>
                        ))}
                      </Select>
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <div className={styles.container}>
                <div className={styles.l}>
                  <Row>
                    <Col md={6} style={{ paddingLeft: 20 }}><Form.Item label="左表"></Form.Item></Col>
                    <Col md={16}>
                      <Form.Item label="">
                        {getFieldDecorator('table_l', {
                          rules: [{ required: true, message: '请选择左表' }],
                          initialValue: resData?.columnMapping?.referencedTable,
                        })(
                          <Select onChange={val => this.tableChange(val, 'l')} style={{ width: '100%' }} placeholder='请选择左表' showSearch optionFilterProp="children">
                            {dropTableList.length > 0 && dropTableList.map(item => (
                              <Option key={item.id} value={item.id} title={item.masterTableDesc ? `${item.masterTableName}（${item.masterTableDesc}）` : item.masterTableName}>{item.masterTableDesc ? `${item.masterTableName}（${item.masterTableDesc}）` : item.masterTableName}</Option>
                            ))}
                          </Select>
                        )}
                      </Form.Item>
                    </Col>
                  </Row>
                  <div style={{ padding: '0 20px' }}>
                    <Input.Search style={{ marginTop: 10 }} placeholder="请输入" onSearch={this.onSearchL} />
                    <Spin size='small' spinning={lLoading}>
                      <div className={styles.rollarea}>
                        {data_l.length > 0 ? data_l.map((item, i) => (
                          <Row style={{ marginTop: +i === 0 ? 0 : 20 }}>
                            <Col md={24}>
                              <Checkbox
                                key={item.id}
                                style={{ width: '100%', lineHeight: '14px' }}
                                onChange={e => this.checkBoxChangeL(e, item)}
                                checked={check_l === item.id} value={item.id}
                              >
                                <Tooltip placement="right" title={item.columnNameDesc ? `${item.columnName}（${item.columnNameDesc}）` : item.columnName}><span className={styles.checkbox}>{item.columnName.length > 17 ? `${item.columnName.substr(0,17)}...` : item.columnName}</span></Tooltip>
                                <Icon type="menu" />
                              </Checkbox>
                            </Col>
                          </Row>
                        )) : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />}
                      </div>
                    </Spin>
                  </div>
                </div>
                <div className={styles.m}>
                  <Row style={{ padding: '0 20px' }}>
                    <Col md={8} style={{ paddingLeft: 20 }}><Form.Item label="表关联"></Form.Item></Col>
                    <Col md={7}>
                      <Form.Item label="">
                        {getFieldDecorator('_impact', {
                          rules: [{ required: true, message: '请选择表关系' }],
                          initialValue: resData?.tableMapping,
                        })(
                          <Select style={{ width: '100%' }} placeholder='请选择表关系' onChange={this.impactChange} showSearch optionFilterProp="children">
                            <Option key='OneToOne' value='OneToOne'>一对一</Option>
                            <Option key='OneToMany' value='OneToMany'>一对多</Option>
                            <Option key='ManyToOne' value='ManyToOne'>多对一</Option>
                            <Option key='ManyToMany' value='ManyToMany'>多对多</Option>
                          </Select>
                        )}
                      </Form.Item>
                    </Col><Col md={1}></Col>
                    {impactType && <Col md={7}>
                      <Spin size='small' spinning={mTableLoading}>
                        <Form.Item label="">
                          {getFieldDecorator('middle', {
                            rules: [{ required: impactType, message: '请选择中间表' }],
                            initialValue: resData?.tableMiddle,
                          })(
                            <Select onChange={this.mTableChange} style={{ width: '100%' }} placeholder='请选择中间表' showSearch optionFilterProp="children">
                              {mTableList.length > 0 && mTableList.map(item => (
                                <Option key={item.id} value={item.id} title={item.masterTableDesc ? `${item.masterTableName}（${item.masterTableDesc}）` : item.masterTableName}>{item.masterTableDesc ? `${item.masterTableName}（${item.masterTableDesc}）` : item.masterTableName}</Option>
                              ))}
                            </Select>
                          )}
                        </Form.Item>
                      </Spin>
                    </Col>}
                  </Row>
                  <div className={styles.mBox}>
                    {impactType ? <>
                      <Row>
                        <Col md={8}>
                          <Row>
                            <Col md={12}>左表列名</Col>
                            <Col md={12}>中文说明</Col>
                          </Row>
                        </Col>
                        <Col md={1}></Col>
                        <Col md={6}>
                          中间表列名
                        </Col>
                        <Col md={1}></Col>
                        <Col md={8}>
                          <Row>
                            <Col md={12}>右表列名</Col>
                            <Col md={12}>中文说明</Col>
                          </Row>
                        </Col>
                      </Row>
                      <Row style={{ marginTop: 20 }}>
                        <Col md={8}>
                          <Row>
                            <Col md={12}>
                              <Tooltip placement='bottom' title={item_l?.columnName || '左表列名'}>
                                <div className={styles.mValBox}>{item_l?.columnName || ''}</div>
                              </Tooltip>
                            </Col>
                            <Col md={12}>
                              <Tooltip placement='bottom' title={item_l?.columnNameDesc || '左表列名的中文说明'}>
                                <div className={styles.mValBox}>{item_l?.columnNameDesc || ''}</div>
                              </Tooltip>
                            </Col>
                          </Row>
                        </Col>
                        <Col md={1}><Icon type="link" /></Col>
                        <Col md={6}>
                          <Row>
                            <Col md={11}>
                              <Tooltip placement='bottom' title={data_m.length > 0 ? `${data_m[0].columnName}--${data_m[0].columnNameDesc}` : '中间表列名'}>
                                <div className={styles.mValBox}>{data_m[0]?.columnName || ''}</div>
                              </Tooltip>
                            </Col>
                            <Col md={2}><Icon type="swap" onClick={this.exchange} /></Col>
                            <Col md={11}>
                              <Tooltip placement='bottom' title={data_m.length > 1 ? `${data_m[1].columnName}--${data_m[1].columnNameDesc}` : '中间表列名'}>
                                <div className={styles.mValBox}>{data_m[1]?.columnName || ''}</div>
                              </Tooltip>
                            </Col>
                          </Row>
                        </Col>
                        <Col md={1}><Icon type="link" /></Col>
                        <Col md={8}>
                          <Row>
                            <Col md={12}>
                              <Tooltip placement='bottom' title={item_r?.columnName || '右表列名'}>
                                <div className={styles.mValBox}>{item_r?.columnName || ''}</div>
                              </Tooltip>
                            </Col>
                            <Col md={12}>
                              <Tooltip placement='bottom' title={item_r?.columnNameDesc || '右表列名的中文说明'}>
                                <div className={styles.mValBox}>{item_r?.columnNameDesc || ''}</div>
                              </Tooltip>
                            </Col>
                          </Row>
                        </Col>
                      </Row>
                    </> : <>
                      <Row>
                        <Col md={10}>
                          <Row>
                            <Col md={12}>左表列名</Col>
                            <Col md={12}>中文说明</Col>
                          </Row>
                        </Col>
                        <Col md={4}></Col>
                        <Col md={10}>
                          <Row>
                            <Col md={12}>右表列名</Col>
                            <Col md={12}>中文说明</Col>
                          </Row>
                        </Col>
                      </Row>
                      <Row style={{ marginTop: 20 }}>
                        <Col md={10}>
                          <Row>
                            <Col md={12}>
                              <Tooltip placement='bottom' title={item_l?.columnName || '左表列名'}>
                                <div className={styles.mValBox}>{item_l.columnName || ''}</div>
                              </Tooltip>
                            </Col>
                            <Col md={12}>
                              <Tooltip placement='bottom' title={item_l?.columnNameDesc || '左表列名的中文说明'}>
                                <div className={styles.mValBox}>{item_l?.columnNameDesc || ''}</div>
                              </Tooltip>
                            </Col>
                          </Row>
                        </Col>
                        <Col md={4}><Icon type="link" /></Col>
                        <Col md={10}>
                          <Row>
                            <Col md={12}>
                              <Tooltip placement='bottom' title={item_r?.columnName || '右表列名'}>
                                <div className={styles.mValBox}>{item_r?.columnName || ''}</div>
                              </Tooltip>
                            </Col>
                            <Col md={12}>
                              <Tooltip placement='bottom' title={item_r?.columnNameDesc || '右表列名的中文说明'}>
                                <div className={styles.mValBox}>{item_r?.columnNameDesc || ''}</div>
                              </Tooltip>
                            </Col>
                          </Row>
                        </Col>
                      </Row>
                    </>}
                  </div>
                </div>
                <div className={styles.r}>
                  <Row>
                    <Col md={6} style={{ paddingLeft: 20 }}><Form.Item label="右表"></Form.Item></Col>
                    <Col md={16}>
                      <Form.Item label="">
                        {getFieldDecorator('table_r', {
                          rules: [{ required: true, message: '请选择右表' }],
                          initialValue: resData?.columnMapping?.tableName
                        })(
                          <Select onChange={val => this.tableChange(val, 'r')} style={{ width: '100%' }} placeholder='请选择右表' showSearch optionFilterProp="children">
                            {dropTableList.length > 0 && dropTableList.map(item => (
                              <Option key={item.id} value={item.id} title={item.masterTableDesc ? `${item.masterTableName}（${item.masterTableDesc}）` : item.masterTableName}>{item.masterTableDesc ? `${item.masterTableName}（${item.masterTableDesc}）` : item.masterTableName}</Option>
                            ))}
                          </Select>
                        )}
                      </Form.Item>
                    </Col>
                  </Row>
                  <div style={{ padding: '0 20px' }}>
                    <Input.Search style={{ marginTop: 10 }} placeholder="请输入" onSearch={this.onSearchR} />
                    <Spin size='small' spinning={rLoading}>
                      <div className={styles.rollarea}>
                        {data_r.length > 0 ? data_r.map(item => (
                          <Row style={{ marginTop: 20 }}>
                            <Col md={24}>
                              <Checkbox
                                key={item.id}
                                style={{ width: '100%', lineHeight: '14px' }}
                                onChange={e => this.checkBoxChangeR(e, item)}
                                checked={check_r === item.id} value={item.id}
                              >
                                <Tooltip placement="left" title={item.columnNameDesc ? `${item.columnName}（${item.columnNameDesc}）` : item.columnName}><span className={styles.checkbox}>{item.columnName.length > 17 ? `${item.columnName.substr(0,17)}...` : item.columnName}</span></Tooltip>
                                <Icon type="menu" />
                              </Checkbox>
                            </Col>
                          </Row>
                        )) : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />}
                      </div>
                    </Spin>
                  </div>
                </div>
              </div>
              <div style={{ marginBottom: 10 }}>
                <Row>
                  <Col span={24} style={{ marginBottom: 10 }} style={{ textAlign: 'right' }}>
                    <Button style={{ marginRight: 8 }} onClick={this.mapModalCancel}>取消</Button>
                    <Button type="primary" style={{ marginRight: 8 }} loading={mapLoading} onClick={this.mapSave} >确定</Button>
                  </Col>
                </Row>
              </div>
            </div>
      </Spin>}
        </Modal>
      </>
    );
  }
}

const WrappedSingleForm = errorBoundary(
  linkHoc()(
    Form.create()(
      connect(({ dataTable, dataSource }) => ({ dataTable, dataSource }))(Index),
    ),
  ),
);

export default WrappedSingleForm;
