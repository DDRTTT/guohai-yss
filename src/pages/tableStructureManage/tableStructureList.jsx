import React, { Component } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import Action, { linkHoc } from '@/utils/hocUtil';
import { errorBoundary } from '@/layouts/ErrorBoundary';
import { Form, Input, Modal, Breadcrumb, Card, Row, Col, Icon, Button, Table, Select, Divider, Popconfirm, Spin, message, Tooltip, Upload } from 'antd';
import styles from './tableStructure.less';
import FormItem from 'antd/lib/form/FormItem'
import { getAuthToken, getSession } from '@/utils/session';
import { uuid } from '@/utils/utils';
import List from '@/components/List';
import { downloadFile } from '@/utils/download';

const { Search } = Input;
const { confirm } = Modal;
const { Option } = Select;
let vipID = '';
let vipModalObj = {}; // 点击个性配置，获取的数据对象
let columnConfigTypeData = []; // 个性化配置-配置类型
let optionData = [];
let isRequired = true;// 精度，默认是可编辑的，需求变更后，不使用变量控制，而是根据精度返回的值控制，如果是-，则不可编辑；否则可编辑
let selNumber = 0; // 0，则setInitialValue中 isRequired 取 初始化的值，否则取 selectChange 中改变的值
let _data = [];
let timer = null;
let mysqlOption = [];// mysql 字典数据
let oracleOption = [];// oracle 字典数据
let dataSourceType = ''; // 数据库类型

const EditableContext = React.createContext();

@Form.create()
class Index extends Component {
  state = {
    current: 1,
    pageSize: 40,
    total: 0,
    structureData: [],
    isForm: true,
    loading: false,
    detailsVisible: false,
    title: '',
    structureVisible: false,
    sourceLoading: false,
    sourceData: [],
    saveLoading: false,
    isUpdate: false,
    record: {},
    selectedRowKeys: [],
    selectedRows: [],
    initBtn: false,
    createTableBtn: false,
    createLoading: false,
    optBtn: false,
    fieldVisible: false,
    fieldTitle: '',
    isBatch: false,
    fieldLoading: false,

    data: [{ _id: 9999 }],
    editingKey: '',
    isEdit: false,

    elementsVisible: false,
    elementsData: [],
    elementsLoading: false,
    elementsRowKeys: [],
    elementsRows: [],
    sysFieldBtn: false,

    fieldData: [], // 生成系统级别字段接口的返回值

    vipVisible: false,
    vipLoading: false,
    vipData: [{ id: 9999 }],
    vipEditingKey: '',
    isVipEdit: false,

    orgData: [],
    dropDownData: [],

    formVals: {},
    val: '',
    downloading: false,
    tableLoading: false,
    tableVisible: false,
    uploadBtnLoadingForMove: false,// 导入
    checkColumnData: [], // 修改表字段-点击删除-收集{ tableId, id}
    loginId: '',
    loginOrgId: '',
  };

  componentDidMount() {

    const { formVals } = this.state;
    this.advancSearch(formVals);
    this.setOrgId();
    // 获取机构下拉
    this.props.dispatch({
      type: 'dataSource/getOrgData',
      payload: { "isOut": true, "pageNum": 1, "pageSize": 9999 }
    }).then(res => {
      if (res) {
        this.setState({ orgData: res })
      }
    })
    // 获取字典下拉
    this.props.dispatch({
      type: 'dataSource/getDropdownData',
      payload: { codeList: 'plmSysPEScene,plmSysPEDataPushSystem,plmSysPEDataSource,plmSysPEElementChangeWay,plmSysPEComponentType,plmSysPESort,plmSysPEDataSubject,attributionSystem,plmSysPESubjectTopCategory,plmSysPESubjectSecondCategory,plmSysPESubjectThirdCategory,plmSysPEBusinessScenario,plmSysPEBusinessClassification,plmSysPEDataGrading,plmOracleDataType,plmMysqlDataType' }
    }).then(res => {
      if (res) {
        this.setState({ dropDownData: res });
        mysqlOption = res.plmMysqlDataType;
        oracleOption = res.plmOracleDataType;
      }
    })
    // 获取数据库类型
    this.getDataSourceType()

  }

  setOrgId = () => {
    const loginOrgId = getSession('loginOrgId');
    const loginId = getSession('loginId');
    this.setState({ loginOrgId, loginId }, () => {
      this.getAddOrgId()
    });
  }

  getDataSourceType = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'tableStructure/getDataSourceType'
    }).then(res => {
      dataSourceType = res.data;
    })
  }

  // 获取表单数据  用于查询列表、分页查询
  getFormItemVal = () => {
    let payload = {};
    // 查询条件
    this.props.form.validateFields(['dataSubject', 'systemLevel', 'orgId', 'sysId', 'dataThemeLevelOne', 'dataThemeLevelTwo', 'dataThemeLevelThree', 'bizScene', 'bizClass', 'attributeName', 'bizDataName', 'dataLevel',], (err, vals) => {
      if (err) return;
      let conditions = [];
      Object.keys(vals).forEach(k => {
        if (vals[k] === 0 || vals[k]) {// 防止：是否系统级别选择否（number 0）被过滤走，应保留
          conditions.push({ name: k, operator: ['attributeName', 'bizDataName'].includes(k) ? 'LIKE' : 'EQ', value: vals[k] })
        }
      })
      payload = {
        conditions,
        sort: {
          createTime: 'desc',
        },
      }
    });
    return payload;
  }

  query = () => {
    const { dispatch } = this.props;
    this.setState({ elementsLoading: true }, () => {
      dispatch({
        type: 'tableStructure/productElementsQuery',
        payload: this.getFormItemVal(),
      }).then(res => {
        if (res) {
          this.setState({ elementsData: res })
        }
        this.setState({ elementsLoading: false })
      })
    })
  }

  getList = (page = 1, size = 10) => {
    this.setState({ loading: true }, () => {
      this.props.dispatch({
        type: 'tableStructure/getList',
        payload: {
          pagination: { page, size, },
          sort: { createTime: 'desc' }
        }
      }).then(res => {
        if (res) {
          this.setState({ structureData: res.content, total: res.totalElements })
        }
        this.setState({ loading: false });
      })
    })
  }

  advancSearch = (vals, isResetCurrent) => {// 高级搜索-查询：isResetCurrent 为 true，重置 current 为 1
    if (!vals) {
      vals = {}
    }
    const { dispatch, form } = this.props;
    const { current, pageSize } = this.state;
    let conditions = [];
    Object.keys(vals).forEach(k => {
      if (vals[k]) {
        conditions.push({ name: k, operator: ['masterTableDesc', 'masterTableName'].includes(k) ? 'LIKE' : 'EQ', value: vals[k] })
      }
    })

    let payload = {
      pagination: { page: isResetCurrent ? 1 : current, size: pageSize },
      sort: { createTime: 'desc', },
      conditions,
    }
    this.setState({ loading: true, current: isResetCurrent ? 1 : current }, () => {
      dispatch({
        type: 'tableStructure/advancSearch',
        payload,
      }).then(res => {
        if (res) {
          this.setState({ structureData: res.content, total: res.totalElements, formVals: vals, val: '' })
        }
        this.setState({ loading: false })
      })
    })
  }

  reSearch = val => {// 高级搜索，重定位到第 1 页
    this.setState({ current: 1 }, () => {
      this.search(val)
    })
  }

  search = val => {
    const { current, pageSize } = this.state;
    this.setState({ loading: true }, () => {
      this.props.dispatch({
        type: 'tableStructure/advancSearch',
        payload: {
          pagination: { page: current, size: pageSize },
          sort: { createTime: 'desc', },
          conditionsOr: [
            { name: 'masterTableDesc', operator: 'LIKE', value: val },
            { name: 'masterTableName', operator: 'LIKE', value: val },
          ]
        }
      }).then(res => {
        if (res) {
          this.setState({ structureData: res.content, total: res.totalElements, formVals: {}, val })
        }
        this.setState({ loading: false })
      })
    })
  }

  // 校验表结构是否绑定映射关系
  checkTableStructure = (params, id, type) => {
    const { dispatch } = this.props;
    params = type === 'delete' ? { ...params, id, oprStatus: 1 } : { ...params, id, oprStatus: 2 };
    dispatch({
      type: 'tableStructure/checkTableStructure',
      payload: params
    }).then(res => {
      if (res?.status === 200) {
        if (type === 'delete') {// 表结构管理--删除
          this.handleDelete(id);
        } else {// 表结构管理--修改表结构--确定
          this.pureSave();
        }
      } else {
        const _this = this;
        Modal.confirm({
          title: `${res?.message}，确定则会变更已有的表映射关系，确定继续吗？`,
          okText: '确定',
          cancelText: '取消',
          onOk: () => {
            if (type === 'delete') {// 表结构管理--删除
              _this.handleDelete(id);
            } else {// 表结构管理--修改表字段--确定
              _this.pureSave();
            }
          },
        });
      }
    })
  }

  handleDelete = id => {
    const { current, structureData, formVals } = this.state;
    this.setState({ loading: true }, () => {
      // 某页列表中只有一条数据且要删除时 向前跳一页
      if (structureData.length === 1) {
        if (current > 1) {
          current--;
          this.setState({ current })
        }
      }
      this.props.dispatch({
        type: 'tableStructure/del',
        payload: { id }
      }).then(res => {
        if (res) {
          message.success('操作成功！');
          this.advancSearch(formVals)
        } else {
          this.setState({ loading: false })
        }
      })
    })
  }

  del = record => {
    const masterTableName = record.masterTableName;
    const middleTable = record.middleTable;
    const orgId = record.orgId;
    const sysId = record.sysId;
    this.checkTableStructure({ masterTableName, middleTable, orgId, sysId }, record.id, 'delete');
  }

  getPersonalityNameByCode = (val, flag, orgType = '') => {
    let name = '';
    if (flag === 'configName') {
      columnConfigTypeData?.forEach(item => {
        if (item.code === val) {
          name = item.name;
        }
      })
    }
    if (flag === 'configValue') {
      if (orgType) {
        const result = JSON.stringify(vipModalObj) == "{}";
        if (result) {
          this.getVipModalObj(true, orgType, val);
        } else {
          vipModalObj[orgType].forEach(item => {
            if (item.code === val) {
              name = item.name;
            }
          })
        }
      }
    }
    return name;
  }

  modalDetails = record => {
    this.setState({ detailsVisible: true, record })
  }

  detailsCancel = () => {
    this.setState({ detailsVisible: false })
  }

  structureCancel = () => {
    this.setState({ structureVisible: false, title: '', isUpdate: false, id: '' })
  }

  getSourceData = () => {
    this.setState({ sourceLoading: true }, () => {
      let payload = {};
      const vals = this.props.form.getFieldsValue(['_orgId', '_sysId']);
      let conditions = [];
      Object.keys(vals).forEach(k => {
        if (vals[k]) {
          conditions.push({ name: k.substr(1), operator: 'EQ', value: vals[k] })
        }
      })
      payload = {
        conditions: [{ name: 'checked', operator: 'EQ', value: '1' }, ...conditions],
        pagination: {},
        sort: {
          createTime: 'desc',
        },
        params: '',
      }
      this.props.dispatch({
        type: 'dataSource/getListCondition',
        payload,
      }).then(res => {
        if (res) {
          this.setState({ sourceData: res })
        }
        this.setState({ sourceLoading: false });
      })
    })
  }

  setModal = (title, isUpdate, record = {}) => {
    this.setState({ title, structureVisible: true, isUpdate, record, sourceLoading: true })
  }

  pureSave = () => {
    const { dispatch, form } = this.props;
    const { isUpdate, record, current, pageSize, addOrgId } = this.state;
    form.validateFields((err, vals) => {
      if (err) return;
      this.setState({ saveLoading: true }, () => {
        let type = isUpdate ? 'update' : 'add';
        if (isUpdate) {// 修改
          vals.id = record?.id + '';
        } else {
          vals = { ...vals, orgId: addOrgId };// 新增时，orgId的获取
        }
        dispatch({
          type: `tableStructure/${type}`,
          payload: { ...vals },
        }).then(res => {
          if (res) {
            message.success('操作成功！');
            this.setState({ structureVisible: false }, () => {
              this.getList(current, pageSize);
            })
          }
          this.setState({ saveLoading: false, });
        })
      })
    })
  }

  structureSave = () => {
    const { record, title } = this.state;// title区分：新增/修改 表结构，新增表结构，不需要校验
    const id = record.id;
    const params = this.props.form.getFieldsValue(['masterTableName', 'middleTable', 'orgId', 'sysId']);
    if (title === '修改') {
      this.checkTableStructure(params, id, 'save');
    } else {// 新增
      this.pureSave();
    }
  }

  handleSetPageNum = current => {
    const { formVals, val } = this.state;
    this.setState({ current }, () => {
      if (Object.keys(formVals).length > 0) {
        this.advancSearch(formVals);
      } else {
        this.search(val);
      }
    })
  }

  handleSetPageSize = (current, pageSize) => {
    const { formVals, val } = this.state;
    this.setState({ current, pageSize }, () => {
      if (Object.keys(formVals).length > 0) {
        this.advancSearch(formVals);
      } else {
        this.search(val);
      }
    })

  }

  setfieldModal = (fieldTitle, isBatch, record) => {// 修改表字段
    isRequired = true;
    selNumber = 0;
    const { selectedRows, data } = this.state;
    this.setState({ fieldTitle, isBatch, record, fieldVisible: true, fieldLoading: true, checkColumnData: [] }, () => {
      let id = '';
      if (isBatch) {
        this.setState({ sysFieldBtn: +selectedRows[0].extendBase === 0 });
        id = selectedRows[0].id;
      } else {
        this.setState({ sysFieldBtn: +record.extendBase === 0 });
        id = record.id;
      }
      this.props.dispatch({
        type: 'tableStructure/getColumn',
        payload: { id }
      }).then(res => {
        if (res) {
          res.forEach(item => item._id = uuid());
          const newData = data;
          newData.splice(data.length - 1, 0, ...res);
          this.setState({ data: newData });
          _data = newData;
        }
        this.setState({ fieldLoading: false })
      })
    })
  }

  fieldCancel = () => {
    const { editingKey } = this.state;
    // 加一个二次确认框
    this.setState({ fieldVisible: false, fieldTitle: '', isBatch: false, record: {}, editingKey: '', sysFieldBtn: false, data: [{ _id: 9999 }], vipData: [{ id: 9999 }], checkColumnData: [] });
    _data = [{ _id: 9999 }];
  }

  checkColumn = () => {
    const { dispatch } = this.props;
    const { checkColumnData } = this.state;
    dispatch({
      type: 'tableStructure/checkColumn',
      payload: checkColumnData
    }).then(res => {
      if (res && res?.status === 200) {
        this.fieldSubmit();
      } else {
        const _this = this;
        Modal.confirm({
          title: `${res?.message}，确定则会变更已有的表映射关系，确定继续吗？`,
          okText: '确定',
          cancelText: '取消',
          onOk: () => {
            _this.fieldSubmit();
          },
        });
      }
    })
  }

  fieldSubmit = () => {
    const { data, editingKey, selectedRows, isBatch, record } = this.state;
    const { form } = this.props;
    const newData = data;
    const columns = ['columnName', 'columnNameDesc', 'columnType', 'required', 'precision', 'extended', 'authType', 'systemLevel', 'commInterface'];
    if (editingKey !== '') {
      message.warn('有正在编辑中的数据，请先保存');
      return;
    }
    let payload = JSON.parse(JSON.stringify(data));
    payload.pop();
    if (isBatch) {
      payload.forEach(item => item.tableId = selectedRows[0].id);
    } else {
      payload.forEach(item => item.tableId = record.id);
    }
    this.setState({ fieldLoading: true }, () => {
      this.props.dispatch({
        type: 'tableStructure/fieldSubmit',
        payload,
      }).then(res => {
        if (res) {
          message.success('操作成功');
          this.fieldCancel();
        }
        this.setState({ fieldLoading: false })
      })
    })

  }

  // 如果没有少填必填项 新增时直接保存上一条编辑状态的数据
  handleAdd = () => {
    isRequired = true;
    selNumber = 0;
    const { data, editingKey } = this.state;
    const { form } = this.props;
    let newData = data;

    const _id = uuid();
    const row = { _id, columnName: '', columnNameDesc: '', columnType: '', isPrimaryKey: '', required: '', precision: '', extended: '', authType: '', systemLevel: '', commInterface: '' };
    const columns = ['columnName', 'columnNameDesc', 'columnType', 'isPrimaryKey', 'required', 'precision', 'extended', 'authType', 'systemLevel', 'commInterface'];
    this.setState({ isEdit: false }); // fixBug#942
    if (newData.length === 1 && +newData[0]._id === 9999) {
      newData.unshift(row);
      if (dataSourceType === 'ORACLE') {
        newData[0].columnType = 'VARCHAR2';
        newData[0].precision = 255;
      } else {
        newData[0].columnType = 'varchar';// 可能要修改，看字典最后的对标值
        newData[0].precision = 255;
      }
      this.setState({ data: newData, editingKey: _id })
      _data = newData;
    } else {
      let addTo = true;
      if (editingKey !== '') {
        form.validateFields(columns, (err, row) => {
          if (err) {
            addTo = false;
            return;
          }
          row.columnName = row.columnName?.toUpperCase();
          const i = newData.findIndex(item => editingKey === item._id);
          if (i > -1) {
            const item = newData[i];
            newData.splice(i, 1, { ...item, ...row });
          } else {
            newData.splice(data.length - 1, 1, row);
          }
          this.setState({ data: newData })
          _data = newData;
          form.resetFields(columns);
        })
      }
      if (addTo) {
        newData.splice(data.length - 1, 0, row);
        if (dataSourceType === 'ORACLE') {
          newData[newData.length - 2].columnType = 'VARCHAR2';
          newData[newData.length - 2].precision = 255;
        } else {
          newData[newData.length - 2].columnType = 'varchar';
          newData[newData.length - 2].precision = 255;
        }
        this.setState({ data: newData, editingKey: _id });
        _data = newData;
      }
    }
  }

  save = (form, key, record) => {
    const { data } = this.state;
    form.validateFields(['columnName', 'columnNameDesc', 'columnType', 'isPrimaryKey', 'required', 'precision', 'extended', 'authType', 'systemLevel', 'commInterface'], (err, row) => {
      if (err) return;
      const newData = [...data];
      const i = newData.findIndex(item => key === item._id);
      row.columnName = row.columnName?.toUpperCase();// 保存时，若数据库字段名不为空，则大写
      if (i > -1) {
        const item = newData[i];
        newData.splice(i, 1, { ...item, ...row });
      } else {
        newData.splice(data.length - 1, 1, row);
      }
      this.setState({ data: newData, editingKey: '' })
      _data = newData;
    })

  }

  cancel = key => {
    const { isEdit } = this.state;
    if (isEdit) {
      this.setState({ editingKey: '', isEdit: false });
    } else {
      if (key.length > 6) {
        const { data } = this.state;
        const newData = data;
        const i = newData.findIndex(item => item._id === key);
        newData.splice(i, 1);
        this.setState({ data: newData });
        _data = newData;
      }
      this.setState({ editingKey: '' })
    }
  }

  edit = key => {
    this.setState({ editingKey: key, isEdit: true });
    isRequired = true;
    selNumber = 0;
  }

  delete = record => {
    const { data, checkColumnData } = this.state;
    const newData = data;
    const key = record._id;
    const i = newData.findIndex(item => key === item._id);
    checkColumnData.push({ id: record.id, tableId: record.tableId });
    newData.splice(i, 1);
    this.setState({ data: newData, editingKey: '', checkColumnData });
    _data = newData;
  }

  isEditing = record => record._id === this.state.editingKey;
  isVipEditing = record => record.id === this.state.vipEditingKey;

  // 查业务要素 数据量大 几千条 20s左右
  getElementsData = () => {
    this.setState({ elementsLoading: true }, () => {
      this.props.dispatch({
        type: 'tableStructure/getElements',
      }).then(res => {
        if (res) {
          this.setState({ elementsData: res })
        }
        this.setState({ elementsLoading: false })
      })
    })
  }

  setElementsModal = () => {
    this.setState({ elementsVisible: true, }, () => {
      // this.getElementsData();  数据量大   不在这里直接查
    })
  }
  elementsCancel = () => {
    this.setState({ elementsVisible: false, elementsLoading: false, isForm: true, elementsRowKeys: [], elementsRows: [], elementsData: [] })
  }

  elementsSave = () => {
    const { elementsRows, data, isBatch, selectedRows, record } = this.state;
    this.setState({ elementsLoading: true }, () => {
      this.props.dispatch({
        type: 'tableStructure/eleChange',
        payload: {
          tableId: isBatch ? selectedRows[0]?.id : record.id,
          dataSourceCode: isBatch ? selectedRows[0]?.dataSourceCode : record.dataSourceCode,
          productElementBizs: elementsRows,
        }
      }).then(res => {
        if (res) {
          this.elementsCancel();
          let newData = data;
          newData.forEach(nd => {
            res.forEach(r => {
              res = res.filter(key => key?.columnName?.toUpperCase() !== nd?.columnName?.toUpperCase())
            })
          })
          res.forEach(item => {
            item._id = uuid();
            item.required = item.required ? item.required : 0;
            item.extended = item.extended ? item.extended : 0;
            item.systemLevel = item.systemLevel ? item.systemLevel : 0;
            delete item.id;
          });
          newData.splice(data.length - 1, 0, ...res)
          this.setState({ data: newData });
          _data = newData;
        }
        this.setState({ elementsLoading: false })
      })
    })
  }

  elementsSearch = val => {
    const { record } = this.state;
    this.props.form.resetFields(['dataSubject', 'dataThemeLevelOne', 'dataThemeLevelTwo', 'dataThemeLevelThree', 'bizScene', 'bizClass', 'attributeName', 'bizDataName', 'dataLevel', 'systemLevel']);// 初始化高级搜索条件
    this.setState({ elementsLoading: true }, () => {
      this.props.dispatch({
        type: 'tableStructure/productElementsQuery',
        payload: {
          conditionsOr: [{ name: 'attributeName', operator: 'LIKE', value: val }, { name: 'bizDataName', operator: 'LIKE', value: val }],
          conditions: [{ name: 'orgId', operator: 'EQ', value: record.orgId }, { name: 'sysId', operator: 'EQ', value: record.sysId }],
          sort: {
            createTime: 'desc',
          },
        }
      }).then(res => {
        if (res) {
          this.setState({ elementsData: res })
        }
        this.setState({ elementsLoading: false })
      })
    })
  }

  _downloadFile = () => {
    const { selectedRows } = this.state;
    let payload = [];
    selectedRows.forEach(item => {
      payload.push({ tableName: item.masterTableName, dataSourceCode: item.dataSourceCode })
    })
    this.setState({ downloading: true }, () => {
      this.props.dispatch({
        type: 'tableStructure/_downloadFile',
        payload,
      }).then(res => {
        if (res) {
          message.success('操作成功');
        }
        this.setState({ downloading: false })
      })
    })
  }

  createTable = () => {
    const { selectedRows, sourceData } = this.state;
    let dataSourceName = '';
    this.props.form.validateFields(['_orgId', '_sysId', '_dataSourceCode'], (err, vals) => {
      if (err) return;
      sourceData.forEach(item => {
        if (item.code = vals._dataSourceCode) {
          dataSourceName = item.name;
        }
      });
      this.setState({ tableLoading: true }, () => {
        this.props.dispatch({
          type: 'tableStructure/createTable',
          payload: {
            dataSourceCode: vals._dataSourceCode,
            dataSourceName,
            orgId: vals._orgId,
            sysId: vals._sysId,
            tableInfos: selectedRows
          }
        }).then(res => {
          if (res) {
            message.success('操作成功！')
            this.setState({ tableVisible: false });
          }
          this.setState({ tableLoading: false })
        })
      })
    })
  }

  createField = () => {
    const { data } = this.state;
    this.setState({ fieldLoading: true }, () => {
      this.props.dispatch({
        type: 'tableStructure/createField'
      }).then(res => {
        if (res) {
          let newData = data;
          newData.forEach(nd => {
            res.forEach(r => {
              res = res.filter(key => key?.columnName?.toUpperCase() !== nd?.columnName?.toUpperCase())
            })
          })
          res.forEach(item => {
            item._id = uuid();
            item.required = 0;
            item.extended = 0;
            item.systemLevel = 1;
          });
          newData.splice(data.length - 1, 0, ...res)
          this.setState({ data: newData, fieldData: res });
          _data = newData;
        }
        this.setState({ fieldLoading: false })
      })
    })
  }

  getVipModalObj = (flag, orgType, val) => {
    this.props.dispatch({
      type: 'dataSource/getDropdownData',
      payload: { codeList: 'columnConfigType' }
    }).then(res => {
      if (res) {
        columnConfigTypeData = res.columnConfigType;
        let codeListStr = '', codeListArr = [];
        columnConfigTypeData.map(item => {
          codeListArr.push(item.code);
        })
        codeListStr = codeListArr.join(',');
        this.props.dispatch({
          type: 'dataSource/getDropdownData',
          payload: { codeList: codeListStr }
        }).then(res => {
          vipModalObj = res;
          if (flag) {
            vipModalObj[orgType].forEach(item => {
              if (item.code === val) {
                name = item.name;
              }
            })
          }
        })
      }
      this.setState({ vipLoading: false })
    })
  }

  setVipModal = record => {
    vipID = record._id;
    const { vipData } = this.state;
    this.setState({ vipVisible: true, vipEditingKey: '' }, () => {
      if (record?.columnPersonalConfList?.length > 0) {
        const newVipData = vipData;
        newVipData.splice(vipData.length - 1, 0, ...record.columnPersonalConfList);
        this.setState({ vipData: newVipData });
      }
      const result = JSON.stringify(vipModalObj) == "{}";
      if (columnConfigTypeData.length === 0 || result) {
        this.setState({ vipLoading: true }, () => {
          this.getVipModalObj();
        })
      }
    })
  }

  vipModalCancel = () => {
    this.setState({ vipVisible: false, vipLoading: false, vipData: [{ id: 9999 }] })
  }

  vipSubmit = () => {
    const { vipData, data, vipEditingKey } = this.state;
    const { form } = this.props;
    const newData = data;
    const newVipData = vipData;
    let addTo = true;
    if (vipEditingKey !== '') {
      form.validateFields(['configName', 'configValue', 'configDesc'], (err, row) => {
        if (err) {
          addTo = false;
          return;
        }
        const i = newVipData.findIndex(item => vipEditingKey === item.id);
        if (i > -1) {
          const item = newVipData[i];
          newVipData.splice(i, 1, { ...item, ...row });
        } else {
          newVipData.splice(vipData.length - 1, 1, row);
        }
        this.setState({ vipData: newVipData, vipEditingKey: '' })
        form.resetFields(['configName', 'configValue', 'configDesc']);
      })
    }
    if (addTo) {
      newData.forEach(item => {
        if (item._id === vipID) {
          vipData.pop();
          item.columnPersonalConfList = vipData;
        }
      });
      this.setState({ data: newData, vipData: [{ id: 9999 }], vipVisible: false, });
      _data = newData;
    }
  }

  // 如果没有少填必填项 新增时直接保存上一条编辑状态的数据
  vipHandleAdd = () => {
    const { vipData, vipEditingKey } = this.state;
    const { form } = this.props;
    let newData = vipData;
    const id = uuid();
    const row = { id, configName: '', configValue: '', configDesc: '' };
    if (newData.length === 1 && +newData[0].id === 9999) {
      newData.unshift(row);
      this.setState({ vipData: newData, vipEditingKey: id })
    } else {
      let addTo = true;
      if (vipEditingKey !== '') {
        form.validateFields(['configName', 'configValue', 'configDesc'], (err, row) => {
          if (err) {
            addTo = false;
            return;
          }
          const i = newData.findIndex(item => vipEditingKey === item.id);
          if (i > -1) {
            const item = newData[i];
            newData.splice(i, 1, { ...item, ...row });
          } else {
            newData.splice(vipData.length - 1, 1, row);
          }
          this.setState({ vipData: newData })
          form.resetFields(['configName', 'configValue', 'configDesc']);
        })
      }
      if (addTo) {
        newData.splice(vipData.length - 1, 0, row);
        this.setState({ vipData: newData, vipEditingKey: id })
      }
    }
  }

  vipCancel = key => {
    const { isVipEdit } = this.state;
    if (isVipEdit) {
      this.setState({ vipEditingKey: '', isVipEdit: false });
    } else {
      if (key.length > 6) {
        const { vipData } = this.state;
        const newData = vipData;
        const i = newData.findIndex(item => item.id === key);
        newData.splice(i, 1);
        this.setState({ vipData: newData });
      }
      this.setState({ vipEditingKey: '' })
    }
  }

  vipSave = (form, key, record) => {
    const { vipData } = this.state;
    form.validateFields(['configName', 'configValue', 'configDesc'], (err, row) => {
      if (err) return;
      const newData = [...vipData];
      const i = newData.findIndex(item => key === item.id);
      if (i > -1) {
        const item = newData[i];
        newData.splice(i, 1, { ...item, ...row });
      } else {
        newData.splice(vipData.length - 1, 1, row);
      }
      this.setState({ vipData: newData, vipEditingKey: '' })
    })
  }

  vipEdit = (key, configName) => {
    optionData = vipModalObj[configName];
    this.setState({ vipEditingKey: key, isVipEdit: true });
  }

  vipDelete = key => {
    const { vipData } = this.state;
    const newData = vipData;
    const i = newData.findIndex(item => key === item.id);
    newData.splice(i, 1);
    this.setState({ vipData: newData, vipEditingKey: '' })
  }

  handleOpenConditions = () => {
    const { isForm } = this.state;
    this.setState({ isForm: !isForm, });
  }

  resetForm = () => {
    this.props.form.resetFields(['masterTableDesc', 'masterTableName', 'dataSourceName', 'extendBase', 'middleTable']);
    this.setState({ formVals: {}, val: '', current: 1 }, () => {
      this.search('');
    });
  }

  resetFormEle = () => {
    this.props.form.resetFields(['dataSubject', 'systemLevel', 'orgId', 'sysId', 'dataThemeLevelOne', 'dataThemeLevelTwo', 'dataThemeLevelThree', 'bizScene', 'bizClass', 'attributeName', 'bizDataName', 'dataLevel']);
    this.query();
  }

  getNameByCode = (val = '', orgType = '', url = '') => {
    let data = [], name = '';
    if (val) {
      const { dropDownData } = this.state;
      if (orgType) {
        data = dropDownData[orgType];
        data?.forEach(item => {
          if (item.code === val) {
            name = item.name;
          }
        })
      }
    }
    return name;
  }

  getOrgNameByorgCode = val => {
    let name = '';
    if (val) {
      const { orgData } = this.state;
      if (orgData?.length > 0) {
        orgData?.forEach(item => {
          if (item.id === val) {
            name = item.orgName;
          }
        })
      }
    }
    return name;
  }

  setTableModal = () => {
    const { selectedRows } = this.state;
    let open = true, orgIdList = [], sysIdList = [];
    if (selectedRows.length > 1) {
      selectedRows.forEach(item => {
        orgIdList.push(item.orgId);
        sysIdList.push(item.sysId);
      });
      if ([...new Set(orgIdList)].length > 1 || [...new Set(sysIdList)].length > 1) {
        open = false;
        message.warn('请选择相同的机构和系统')
      }
    }

    if (open) {
      this.setState({ tableVisible: true, sourceLoading: true }, () => {
        this.getSourceData()
      })
    }
  }

  tableModalCancel = () => {
    this.setState({ tableVisible: false })
  }

  beforeUploadForMove = file => {// 导入：同要素管理-迁入
    const isLt100M = file.size / 1024 / 1024 < 100;
    if (!isLt100M) {
      message.warn('文件不能大于100M!');
    }
    return isLt100M;
  };

  uploadChangeForMove = info => {// 导入：同要素管理-迁入
    if (info.file.status === 'uploading') {
      this.setState({ uploadBtnLoadingForMove: true });
    }
    if (info.file.status === 'done') {
      if (info?.file?.response?.status === 200) {
        message.success(`${info.file.name} 导入成功`);
        this.setState({ current: 1 }, () => {
          this.advancSearch({});
        })
      } else {
        message.warn(`${info.file.response.message}`);
      }
      this.setState({ uploadBtnLoadingForMove: false });
    }
    if (info.file.status === 'error') {
      message.warn(`${info.file.name} 导入失败，请稍后再试`);
      this.setState({ uploadBtnLoadingForMove: false });
    }
  };

  exportItems = () => {
    const { selectedRows } = this.state;
    const { dispatch } = this.props;
    let paramsArr = [];
    selectedRows.forEach(item => {
      paramsArr.push(item.id);
    });
    dispatch({
      type: 'tableStructure/exportItems',
      payload: paramsArr,
    }).then(res => {
      if (res) downloadFile(res, '数据模型所选项.txt', 'application/vnd.ms-excel;charset=utf-8');
    });
  }

  exportAll = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'tableStructure/exportAll',
    }).then(res => {
      if (res) downloadFile(res, '数据模型全量.txt', 'application/vnd.ms-excel;charset=utf-8');
    });
  }

  getAddOrgId = () => {
    const { loginId, loginOrgId, isUpdate } = this.state;
    const addOrgId = loginId === '1' ? (isUpdate ? record?.orgId : loginOrgId) : loginOrgId;
    this.setState({ addOrgId });
  }

  render() {
    const { isUpdate, tableLoading, tableVisible, isForm, loading, detailsVisible, title, structureVisible, saveLoading, record, initBtn, createTableBtn, optBtn, current, pageSize, total, fieldVisible, fieldTitle, fieldLoading, selectedRows, isBatch, data, editingKey, elementsVisible, elementsData, elementsLoading, elementsRows, sourceLoading, sourceData, structureData, createLoading, sysFieldBtn, vipEditingKey, vipVisible, vipLoading, vipData, orgData, dropDownData, downloading, uploadBtnLoadingForMove, loginOrgId, loginId, addOrgId } = this.state;

    const { form } = this.props;
    const tableStructureColumns = [
      { title: '序号', dataIndex: 'id', key: 'id', width: 90, fixed: 'left', align: 'center', render: (text, record, index) => `${index + 1 + (current - 1) * pageSize}` },
      { title: '表中文名称', dataIndex: 'masterTableDesc', key: 'masterTableDesc', ellipsis: true, render: (text) => (<Tooltip placement="topLeft" title={text}>{text}</Tooltip>) },
      { title: '表英文名称', dataIndex: 'masterTableName', key: 'masterTableName', ellipsis: true, render: (text) => (<Tooltip placement="topLeft" title={text}>{text}</Tooltip>) },
      { title: '是否继承基类', dataIndex: 'extendBase', key: 'extendBase', render: text => (+text === 1 ? '是' : '否') },
      { title: '是否为中间表', dataIndex: 'middleTable', key: 'middleTable', render: text => (+text === 1 ? '是' : '否') },
      { title: '归属机构', dataIndex: 'orgId', key: 'orgId', ellipsis: true, render: val => (<Tooltip placement="topLeft" title={this.getOrgNameByorgCode(val)}>{this.getOrgNameByorgCode(val)}</Tooltip>) },
      { title: '归属系统', dataIndex: 'sysId', key: 'sysId', render: val => this.getNameByCode(val, 'attributionSystem') },
      { title: '接口通用地址', dataIndex: 'commInterface', key: 'commInterface', ellipsis: true, render: (text) => (<Tooltip placement="topLeft" title={text}>{text}</Tooltip>) },
      {
        title: '操作', align: 'center', fixed: 'right', width: 300, render: (text, record) => (
          <span>
            <a onClick={() => this.modalDetails(record)}>详情</a>
            <Divider type="vertical" />
            <a onClick={() => this.setModal('修改', true, record)}>修改表结构</a>
            <Divider type="vertical" />
            <a onClick={() => this.setfieldModal('修改表字段', false, record)}>修改表字段</a>
            <Divider type="vertical" />
            <Popconfirm
              placement="topRight"
              title={'确认删除此条数据么？'}
              onConfirm={() => this.del(record)}
              okText="确定"
              cancelText="取消"
            >
              <a>删除</a>
            </Popconfirm>
          </span>
        )
      },
    ];
    const fieldColumns = [
      { title: '序号', dataIndex: '_id', key: '_id', width: 50, fixed: 'left', align: 'center', render: (text, record, index) => `${index + 1}` },
      { title: '数据库字段名', dataIndex: 'columnName', key: 'columnName', editable: true, width: 150, ellipsis: true, render: (text) => (<Tooltip placement="topLeft" title={text}>{text}</Tooltip>) },
      { title: '字段说明', dataIndex: 'columnNameDesc', key: 'columnNameDesc', editable: true, width: 120, ellipsis: true, render: (text) => (<Tooltip placement="topLeft" title={text}>{text}</Tooltip>) },
      { title: '数据库字段类型', dataIndex: 'columnType', key: 'columnType', editable: true, width: 150, ellipsis: true, render: (text) => (<Tooltip placement="topLeft" title={text}>{text}</Tooltip>) },
      { title: '主键', dataIndex: 'isPrimaryKey', key: 'isPrimaryKey', editable: true, width: 100, render: text => text !== undefined ? +text === 1 ? '是' : '' : '' },// 主键的否，前端展示空
      { title: '必输项', dataIndex: 'required', key: 'required', editable: true, width: 100, render: text => text !== undefined ? +text === 1 ? '是' : '否' : '' },
      { title: '精度', dataIndex: 'precision', key: 'precision', editable: true, width: 120 },
      { title: '是否为扩展字段', dataIndex: 'extended', key: 'extended', editable: true, width: 120, render: text => text !== undefined ? +text === 1 ? '是' : '否' : '' },
      { title: '是否为系统级别字段', dataIndex: 'systemLevel', key: 'systemLevel', editable: true, width: 150, render: text => text !== undefined ? +text === 1 ? '是' : '否' : '' },
      {
        title: '操作', dataIndex: 't', key: 't', width: 200, align: 'center', render: (text, record, index) => {
          const editable = this.isEditing(record);
          return +record._id === 9999 ? <a onClick={this.handleAdd}>新增</a> : editable ? (
            <span>
              <Popconfirm title='确定取消么？' onConfirm={() => this.cancel(record._id)}>
                <a style={{ marginRight: 8 }}>取消</a>
              </Popconfirm>
              <Divider type='vertical' />
              <EditableContext.Consumer>
                {form => (<a onClick={() => this.save(form, record._id, record)} style={{ marginRight: 8 }}>保存</a>)}
              </EditableContext.Consumer>
            </span>
          ) : (
            <span>
              <a disabled={editingKey !== ''} onClick={() => this.edit(record._id)}>修改</a>
              <Divider type='vertical' />
              <Popconfirm title='确定删除么？' onConfirm={() => this.delete(record)}>
                <a disabled={editingKey !== ''}>删除</a>
              </Popconfirm>
              <Divider type='vertical' />
              <a onClick={() => this.setVipModal(record)}>个性化配置</a>
            </span>
          )
        }
      },
    ];

    const personalityColumns = [
      { title: '序号', dataIndex: 'id', key: 'id', width: 50, fixed: 'left', align: 'center', render: (text, record, index) => `${index + 1}` },
      { title: '配置类型', dataIndex: 'configName', key: 'configName', editable: true, width: 150, render: val => this.getPersonalityNameByCode(val, 'configName') },
      { title: '值', dataIndex: 'configValue', key: 'configValue', editable: true, width: 150, render: (val, record) => this.getPersonalityNameByCode(val, 'configValue', record.configName) },
      { title: '说明', dataIndex: 'configDesc', key: 'configDesc', editable: true, ellipsis: true, render: (text) => (<Tooltip placement="topLeft" title={text}>{text}</Tooltip>) },
      {
        title: '操作', dataIndex: 'j', key: 'j', width: 120, render: (text, record, index) => {
          const editable = this.isVipEditing(record);
          return +record.id === 9999 ? <a onClick={this.vipHandleAdd}>新增</a> : editable ? (
            <span>
              <Popconfirm title='确定取消么？' onConfirm={() => this.vipCancel(record.id)}>
                <a style={{ marginRight: 8 }}>取消</a>
              </Popconfirm>
              <Divider type='vertical' />
              <EditableContext.Consumer>
                {form => (<a onClick={() => this.vipSave(form, record.id, record)} style={{ marginRight: 8 }}>保存</a>)}
              </EditableContext.Consumer>
            </span>
          ) : (
            <span>
              <a disabled={vipEditingKey !== ''} onClick={() => this.vipEdit(record.id, record.configName)}>修改</a>
              <Divider type='vertical' />
              <Popconfirm title='确定删除么？' onConfirm={() => this.vipDelete(record.id)}>
                <a disabled={vipEditingKey !== ''}>删除</a>
              </Popconfirm>
            </span>
          )
        }
      },
    ];
    const elementsColumns = [
      { title: '序号', dataIndex: 'id', key: 'id', width: 90, fixed: 'left', align: 'center', render: (text, record, index) => `${index + 1}` },
      { title: '英文业务属性', dataIndex: 'attributeName', key: 'attributeName', fixed: 'left', width: 200 },
      { title: '中文业务属性', dataIndex: 'bizDataName', key: 'bizDataName', fixed: 'left', width: 200 },
      { title: '数据分级', dataIndex: 'dataLevel', key: 'dataLevel', fixed: 'left', width: 100, render: val => this.getNameByCode(val, 'plmSysPEDataGrading') },
      { title: '数据主体', dataIndex: 'dataSubject', key: 'dataSubject', render: val => this.getNameByCode(val, 'plmSysPEDataSubject') },
      { title: '一级分类', dataIndex: 'dataThemeLevelOne', key: 'dataThemeLevelOne', render: val => this.getNameByCode(val, 'plmSysPESubjectTopCategory') },
      { title: '二级分类', dataIndex: 'dataThemeLevelTwo', key: 'dataThemeLevelTwo', render: val => this.getNameByCode(val, 'plmSysPESubjectSecondCategory') },
      { title: '三级分类', dataIndex: 'dataThemeLevelThree', key: 'dataThemeLevelThree', render: val => this.getNameByCode(val, 'plmSysPESubjectThirdCategory') },
      { title: '业务场景', dataIndex: 'bizScene', key: 'bizScene', render: val => this.getNameByCode(val, 'plmSysPEBusinessScenario') },
      { title: '业务分类', dataIndex: 'bizClass', key: 'bizClass', render: val => this.getNameByCode(val, 'plmSysPEBusinessClassification') },
      { title: '组件类型', dataIndex: 'widgetType', key: 'widgetType', render: val => this.getNameByCode(val, 'plmSysPEComponentType') },
      { title: '要素变更方式', dataIndex: 'elementChangeType', key: 'elementChangeType', render: val => this.getNameByCode(val, 'plmSysPEElementChangeWay') },
      { title: '是否为系统级别字段', dataIndex: 'systemLevel', key: 'systemLevel', render: val => val !== undefined ? +val === 1 ? '是' : '否' : '' },
      { title: '排序', dataIndex: 'sort', key: 'sort', render: val => this.getNameByCode(val, 'plmSysPESort') },
      { title: '数据来源', dataIndex: 'source', key: 'source', render: val => this.getNameByCode(val, 'plmSysPEDataSource') },
      { title: '数据推送(系统)', dataIndex: 'pushSystem', key: 'pushSystem', render: val => this.getNameByCode(val, 'plmSysPEDataPushSystem') },
      { title: '数据推送(场景)', dataIndex: 'pushScene', key: 'pushScene', render: val => this.getNameByCode(val, 'plmSysPEScene') },
      { title: '默认值', dataIndex: 'defaultValue', key: 'defaultValue' },
      { title: '字典中文名称', dataIndex: 'dicItem', key: 'dicItem' },
      { title: '字典英文名称', dataIndex: 'dicItemCode', key: 'dicItemCode' },
      { title: '说明', dataIndex: 'description', key: 'description' },
      { title: '提示语', dataIndex: 'tip', key: 'tip' },
      { title: '归属机构', dataIndex: 'orgId', key: 'orgId', render: val => this.getOrgNameByorgCode(val) },
      { title: '归属系统', dataIndex: 'sysId', key: 'sysId', render: val => this.getNameByCode(val, 'attributionSystem') },
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
    const layout = {
      labelAlign: 'right',
      labelCol: { span: 8 },
      wrapperCol: { span: 16 },
    };

    const rowSelection = {
      onChange: (selectedRowKeys, selectedRows) => {
        this.setState({ selectedRowKeys, selectedRows, createTableBtn: selectedRowKeys.length > 0, initBtn: selectedRowKeys.length === 1, optBtn: selectedRowKeys.length > 0 })
      },

    };

    const elsmentsRowSelection = {
      onChange: (selectedRowKeys, selectedRows) => {

        this.setState({ elementsRowKeys: selectedRowKeys, elementsRows: selectedRows })
      },
    }

    const columns = fieldColumns.map(col => {
      if (!col.editable) {
        return col;
      }
      return {
        ...col,
        onCell: record => ({
          record,
          inputType: col.dataIndex,
          dataIndex: col.dataIndex,
          title: col.title,
          editing: this.isEditing(record),
        })
      }
    })
    const vipColumns = personalityColumns.map(col => {
      if (!col.editable) {
        return col;
      }
      return {
        ...col,
        onCell: record => ({
          record,
          inputType: col.dataIndex,
          dataIndex: col.dataIndex,
          title: col.title,
          editing: this.isVipEditing(record),
        })
      }
    });

    const formItemData = [
      {
        name: 'masterTableDesc',
        label: '表中文名称',
        type: 'input',
      },
      {
        name: 'masterTableName',
        label: '表英文名称',
        type: 'input',
      },
      {
        name: 'extendBase',
        label: '是否继承基类',
        type: 'select',
        readSet: { name: 'name', code: 'code' },
        option: [
          { name: '是', code: 1 },
          { name: '否', code: 0 },
        ]
      },
      {
        name: 'middleTable',
        label: '是否中间表',
        type: 'select',
        readSet: { name: 'name', code: 'code' },
        option: [
          { name: '是', code: 1 },
          { name: '否', code: 0 },
        ]
      },
      {
        name: 'orgId',
        label: '归属机构',
        type: 'select',
        readSet: { name: 'orgName', code: 'id' },
        option: orgData,
        initialValue: loginId === '1' ? undefined : loginOrgId,// 非超级管理员登录，默认为登录时的归属机构
        disabled: loginId === '1' ? false : true,
      },
      {
        name: 'sysId',
        label: '归属系统',
        type: 'select',
        readSet: { name: 'name', code: 'code' },
        option: dropDownData.attributionSystem,
      },
    ];

    const uploadContractPropsForMove = {// 导入：同要素管理-迁入
      action: '/ams/yss-product-element/productElementBiz/immigration',
      name: 'file',
      headers: {
        Token: getAuthToken()
      },
    };


    return (
      <>
        <List
          title='表结构管理'
          formItemData={formItemData}
          advancSearch={vals => this.advancSearch(vals, true)}
          resetFn={this.resetForm}
          searchPlaceholder="请输入"
          fuzzySearch={this.reSearch}
          extra={<>
            <Button style={{ marginRight: 8 }} disabled={!createTableBtn} onClick={this._downloadFile} loading={downloading}>下载实体文件</Button>
            <Button style={{ marginRight: 8 }} disabled={!createTableBtn} onClick={this.setTableModal} loading={createLoading}>生成表</Button>
            <Button style={{ marginRight: 8 }} disabled={!initBtn} onClick={() => this.setfieldModal('批量初始化', true, {})}>批量初始化</Button>
            <Button style={{ marginRight: 8 }} disabled={!optBtn} onClick={this.exportItems}>导出所选项</Button>
            <Button style={{ marginRight: 8 }} onClick={this.exportAll}>导出全部</Button>
            <Upload
              {...uploadContractPropsForMove}
              accept=".txt"
              onChange={this.uploadChangeForMove}
              beforeUpload={this.beforeUploadForMove}
              showUploadList={false}
            >
              <Button
                style={{ marginRight: 8 }}
                loading={uploadBtnLoadingForMove}
                disabled={uploadBtnLoadingForMove}
              >
                导入
              </Button>
            </Upload>
            <Button type='primary' onClick={() => this.setModal('新增', false, {})}>新增</Button>
          </>}
          tableList={
            <Table
              dataSource={structureData}
              columns={tableStructureColumns}
              loading={loading}
              rowSelection={rowSelection}
              rowKey={record => record.id}
              scroll={{ x: tableStructureColumns.length * 200, y: 590 }}
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
            />
          }
          loginId={loginId}
        />
        <Modal
          title='表结构查看'
          visible={detailsVisible}
          onCancel={this.detailsCancel}
          footer={null}
          destroyOnClose={true}
        >
          <div style={{ paddingLeft: 20 }}>
            <p>表中文名称：{record?.masterTableDesc}</p>
            <p>表英文名称：{record?.masterTableName}</p>
            <p>归属机构：{this.getOrgNameByorgCode(record?.orgId)}</p>
            <p>归属系统：{this.getNameByCode(record?.sysId, 'attributionSystem')}</p>
            <p>是否继承基类：{+record?.extendBase === 1 ? '是' : '否'}</p>
            <p>是否中间表：{+record?.middleTable === 1 ? '是' : '否'}</p>
            <p>接口通用地址：{record?.commInterface}</p>
          </div>
          <div style={{ textAlign: 'right', marginBottom: 20, marginTop: 20 }}>
            <Button style={{ marginRight: 10 }} onClick={this.detailsCancel}>取消</Button>
          </div>
        </Modal>
        <Modal
          title={`表结构${title}`}
          visible={structureVisible}
          onOk={this.structureSave}
          onCancel={this.structureCancel}
          confirmLoading={saveLoading}
          destroyOnClose={true}
          width={600}
        >
          {structureVisible && <Spin spinning={saveLoading}>
            <Form {...layout}>
              <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                <Col md={20}>
                  <Form.Item label="表中文名称:" {...formItemLayout}>
                    {getFieldDecorator('masterTableDesc', {
                      rules: [{ required: true, message: '请输入表中文名称' }],
                      initialValue: record?.masterTableDesc || '',
                    })(
                      <Input autoComplete="off" allowClear placeholder="请输入表中文名称" />
                    )}
                  </Form.Item>
                </Col>
                <Col md={20}>
                  <Form.Item label="表英文名称:" {...formItemLayout}>
                    {getFieldDecorator('masterTableName', {
                      rules: [{ required: true, message: '请输入表英文名称' }],
                      initialValue: record?.masterTableName || '',
                    })(
                      <Input disabled={isUpdate} autoComplete="off" allowClear placeholder="请输入表英文名称" />
                    )}
                  </Form.Item>
                </Col>
                <Col md={20}>
                  <Form.Item label="归属机构:" {...formItemLayout}>
                    {getFieldDecorator('orgId', {
                      rules: [{ required: true, message: '请选择归属机构' }],
                      initialValue: loginId === '1' ? (record?.orgId || undefined) : loginOrgId,
                    })(
                      <Select placeholder='请选择归属机构' disabled={loginId === '1' ? false : true} showSearch optionFilterProp="children">
                        {orgData.length > 0 && orgData.map(item => (
                          <Option key={item.id} value={item.id}>{item.orgName}</Option>
                        ))}
                      </Select>
                    )}
                  </Form.Item>
                </Col>
                <Col md={20}>
                  <Form.Item label="归属系统:" {...formItemLayout}>
                    {getFieldDecorator('sysId', {
                      rules: [{ required: true, message: '请选择归属系统' }],
                      initialValue: record?.sysId || undefined,
                    })(
                      <Select placeholder='请选择归属系统' showSearch optionFilterProp="children">
                        {dropDownData?.attributionSystem?.length > 0 && dropDownData.attributionSystem.map(item => (
                          <Option key={item.code} value={item.code}>{item.name}</Option>
                        ))}
                      </Select>
                    )}
                  </Form.Item>
                </Col>
                <Col md={20}>
                  <Form.Item label="是否继承基类:" {...formItemLayout}>
                    {getFieldDecorator('extendBase', {
                      rules: [{ required: true, message: '请选择是否继承基类' }],
                      initialValue: record?.extendBase ?? 1,
                    })(
                      <Select placeholder='请选择是否继承基类' showSearch optionFilterProp="children">
                        <Option key='1' value={1}>是</Option>
                        <Option key='0' value={0}>否</Option>
                      </Select>
                    )}
                  </Form.Item>
                </Col>
                <Col md={20}>
                  <Form.Item label="是否中间表:" {...formItemLayout}>
                    {getFieldDecorator('middleTable', {
                      rules: [{ required: true, message: '请选择是否为中间表' }],
                      initialValue: record?.middleTable ?? 0,
                    })(
                      <Select placeholder='请选择是否为中间表' showSearch optionFilterProp="children">
                        <Option key='1' value={1}>是</Option>
                        <Option key='0' value={0}>否</Option>
                      </Select>
                    )}
                  </Form.Item>
                </Col>
                <Col md={20}>
                  <Form.Item label="接口通用地址:" {...formItemLayout}>
                    {getFieldDecorator('commInterface', {
                      // rules: [{ required: true, message: '请输入接口通用地址' }],
                      initialValue: record?.commInterface,
                    })(
                      <Input placeholder='请输入接口通用地址' />
                    )}
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </Spin>}
        </Modal>
        <Modal
          title={fieldTitle}
          visible={fieldVisible}
          onOk={null}
          onCancel={this.fieldCancel}
          confirmLoading={fieldLoading}
          destroyOnClose={true}
          width={1600}
          footer={null}
        >
          <Row style={{ marginBottom: 10 }}>
            <Col md={16}>表名：{isBatch ? selectedRows[0].masterTableName : `${record.masterTableName}（${record.masterTableDesc}）`}</Col>
            <Col md={8} style={{ textAlign: 'right' }}>
              <Button style={{ marginRight: 8 }} onClick={this.setElementsModal} loading={fieldLoading}>业务要素匹配</Button>
              {!sysFieldBtn && <Button onClick={this.createField} loading={fieldLoading}>生成系统级别字段</Button>}
            </Col>
          </Row>
          <EditableContext.Provider value={form}>
            <Table
              size='small'
              dataSource={data}
              columns={columns}
              loading={fieldLoading}
              components={{ body: { cell: EditableCell } }}
              rowKey={record => record._id}
              pagination={false}
              style={{ minHeight: 500 }}
              scroll={{ y: 540 }}
            />
          </EditableContext.Provider>
          <div style={{ textAlign: 'right', marginBottom: 20, marginTop: 20 }}>
            <span style={{ marginRight: 10 }} >共{data.length - 1}条数据</span>
            <Button style={{ marginRight: 10 }} onClick={this.fieldCancel}>取消</Button>
            <Button type='primary' style={{ marginRight: 10 }} onClick={this.checkColumn} loading={fieldLoading}>确定</Button>
          </div>
        </Modal>
        <Modal
          title='个性化配置'
          visible={vipVisible}
          onOk={null}
          onCancel={this.vipModalCancel}
          confirmLoading={vipLoading}
          destroyOnClose={true}
          width={1000}
          footer={null}
          mask={false}
          zIndex={1001}
        >
          <EditableContext.Provider value={form}>
            <Table
              size='small'
              dataSource={vipData}
              columns={vipColumns}
              loading={vipLoading}
              components={{ body: { cell: VipCell } }}
              rowKey={record => record.id}
              pagination={false}
            />
          </EditableContext.Provider>
          <div style={{ textAlign: 'right', marginBottom: 20, marginTop: 20 }}>
            <Button style={{ marginRight: 10 }} onClick={this.vipModalCancel}>取消</Button>
            <Button type='primary' style={{ marginRight: 10 }} onClick={this.vipSubmit} loading={vipLoading}>确定</Button>
          </div>
        </Modal>
        <Modal
          title='业务要素匹配'
          visible={elementsVisible}
          onOk={null}
          onCancel={this.elementsCancel}
          destroyOnClose={true}
          width={1600}
          footer={null}
          mask={false}
          style={{ top: 20, left: 20 }}
          zIndex={1001}
        >
          <Spin spinning={elementsLoading}>
            <Row style={{ display: isForm ? 'block' : 'none', marginBottom: 10 }}>
              <Col span={16}>
                <Search style={{ height: 32, width: 250 }} placeholder="请输入" onSearch={val => this.elementsSearch(val)} />
                <span style={{ marginLeft: 23 }}>
                  <a onClick={this.handleOpenConditions} type="text">
                    其他查询条件
                    <Icon type="down" />
                  </a>
                </span>
              </Col>
            </Row>
            <Form {...layout} style={{ display: isForm ? 'none' : 'block', marginBottom: 10 }}>
              <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                <Col md={6}>
                  <Form.Item label="归属机构:" {...formItemLayout}>
                    {getFieldDecorator('orgId', {// 但单击批量初始化时，默认值为selectedRows[0]?.orgId
                      initialValue: record.orgId || selectedRows[0]?.orgId
                    })(
                      <Select placeholder='请选择归属机构' showSearch disabled optionFilterProp="children">
                        {orgData.length > 0 && orgData.map(item => (
                          <Option key={item.id} value={item.id}>{item.orgName}</Option>
                        ))}
                      </Select>
                    )}
                  </Form.Item>
                </Col>
                <Col md={6}>
                  <Form.Item label="归属系统:" {...formItemLayout}>
                    {getFieldDecorator('sysId', {// 但单击批量初始化时，默认值为selectedRows[0]?.sysId
                      initialValue: record.sysId || selectedRows[0]?.sysId
                    })(
                      <Select placeholder='请选择归属系统' disabled showSearch optionFilterProp="children">
                        {dropDownData?.attributionSystem?.length > 0 && dropDownData.attributionSystem.map(item => (
                          <Option key={item.code} value={item.code}>{item.name}</Option>
                        ))}
                      </Select>
                    )}
                  </Form.Item>
                </Col>
                <Col md={6}>
                  <Form.Item label="数据主体:" {...formItemLayout}>
                    {getFieldDecorator('dataSubject',)(
                      <Select placeholder='请选择数据主体' showSearch optionFilterProp="children">
                        {dropDownData?.plmSysPEDataSubject?.length > 0 && dropDownData.plmSysPEDataSubject.map(item => (
                          <Option key={item.code} value={item.code}>{item.name}</Option>
                        ))}
                      </Select>
                    )}
                  </Form.Item>
                </Col>
                <Col md={6}>
                  <Form.Item label="一级分类:" {...formItemLayout}>
                    {getFieldDecorator('dataThemeLevelOne',)(
                      <Select placeholder='请选择一级分类' showSearch optionFilterProp="children">
                        {dropDownData?.plmSysPESubjectTopCategory?.length > 0 && dropDownData.plmSysPESubjectTopCategory.map(item => (
                          <Option key={item.code} value={item.code}>{item.name}</Option>
                        ))}
                      </Select>
                    )}
                  </Form.Item>
                </Col>
                <Col md={6}>
                  <Form.Item label="二级分类:" {...formItemLayout}>
                    {getFieldDecorator('dataThemeLevelTwo',)(
                      <Select placeholder='请选择二级分类' showSearch optionFilterProp="children">
                        {dropDownData?.plmSysPESubjectSecondCategory?.length > 0 && dropDownData.plmSysPESubjectSecondCategory.map(item => (
                          <Option key={item.code} value={item.code}>{item.name}</Option>
                        ))}
                      </Select>
                    )}
                  </Form.Item>
                </Col>
                <Col md={6}>
                  <Form.Item label="三级分类:" {...formItemLayout}>
                    {getFieldDecorator('dataThemeLevelThree',)(
                      <Select placeholder='请选择三级分类' showSearch optionFilterProp="children">
                        {dropDownData?.plmSysPESubjectThirdCategory?.length > 0 && dropDownData.plmSysPESubjectThirdCategory.map(item => (
                          <Option key={item.code} value={item.code}>{item.name}</Option>
                        ))}
                      </Select>
                    )}
                  </Form.Item>
                </Col>
                <Col md={6}>
                  <Form.Item label="业务场景:" {...formItemLayout}>
                    {getFieldDecorator('bizScene',)(
                      <Select placeholder='请选择业务场景' showSearch optionFilterProp="children">
                        {dropDownData?.plmSysPEBusinessScenario?.length > 0 && dropDownData.plmSysPEBusinessScenario.map(item => (
                          <Option key={item.code} value={item.code}>{item.name}</Option>
                        ))}
                      </Select>
                    )}
                  </Form.Item>
                </Col>
                <Col md={6}>
                  <Form.Item label="业务分类:" {...formItemLayout}>
                    {getFieldDecorator('bizClass',)(
                      <Select placeholder='请选择业务分类' showSearch optionFilterProp="children">
                        {dropDownData?.plmSysPEBusinessClassification?.length > 0 && dropDownData.plmSysPEBusinessClassification.map(item => (
                          <Option key={item.code} value={item.code}>{item.name}</Option>
                        ))}
                      </Select>
                    )}
                  </Form.Item>
                </Col>
                <Col md={6}>
                  <Form.Item label="英文业务属性:" {...formItemLayout}>
                    {getFieldDecorator('attributeName',)(
                      <Input placeholder='请输入英文业务属性' />
                    )}
                  </Form.Item>
                </Col>
                <Col md={6}>
                  <Form.Item label="中文业务属性:" {...formItemLayout}>
                    {getFieldDecorator('bizDataName',)(
                      <Input placeholder='请输入中文业务属性' />
                    )}
                  </Form.Item>
                </Col>
                <Col md={6}>
                  <Form.Item label="数据分级:" {...formItemLayout}>
                    {getFieldDecorator('dataLevel',)(
                      <Select placeholder='请选择数据分级' showSearch optionFilterProp="children">
                        {dropDownData?.plmSysPEDataGrading?.length > 0 && dropDownData.plmSysPEDataGrading.map(item => (
                          <Option key={item.code} value={item.code}>{item.name}</Option>
                        ))}
                      </Select>
                    )}
                  </Form.Item>
                </Col>
                <Col md={6}>
                  <Form.Item label="系统级别字段:" {...formItemLayout}>
                    {getFieldDecorator('systemLevel',)(
                      <Select placeholder='请选择是否为系统级别字段' showSearch optionFilterProp="children">
                        <Option key={1} value={1}>是</Option>
                        <Option key={0} value={0}>否</Option>
                      </Select>
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col style={{ float: 'right' }}>
                  <span>
                    <Button type="primary" onClick={this.query}>查询</Button>
                    <Button style={{ marginLeft: 10 }} onClick={this.resetFormEle}>重置</Button>
                    <a style={{ marginLeft: 23 }} onClick={this.handleOpenConditions}>收起<Icon type="up" /></a>
                  </span>
                </Col>
              </Row>
            </Form>
            <Table
              size='small'
              dataSource={elementsData}
              columns={elementsColumns}
              // loading={elementsLoading}
              pagination={false}
              rowSelection={elsmentsRowSelection}
              scroll={{ x: elementsColumns.length * 200, y: isForm ? 580 : 400 }}
            />
            <div style={{ textAlign: 'right', marginBottom: 20, marginTop: 20 }}>
              <span style={{ marginRight: 10 }} >共{elementsData.length}条数据</span>
              <Button style={{ marginRight: 10 }} onClick={this.elementsCancel}>取消</Button>
              <Button disabled={!elementsRows.length > 0} type='primary' style={{ marginRight: 10 }} onClick={this.elementsSave}>确定</Button>
            </div>
          </Spin>
        </Modal>
        <Modal
          title='生成表'
          visible={tableVisible}
          onOk={null}
          onCancel={this.tableModalCancel}
          confirmLoading={tableLoading}
          destroyOnClose={true}
          width={600}
          footer={null}
        >
          {tableVisible && <Spin spinning={tableLoading}>
            <Form {...layout}>
              <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                <Col md={20}>
                  <Form.Item label="归属机构:" {...formItemLayout}>
                    {getFieldDecorator('_orgId', {
                      rules: [{ required: true, message: '请选择归属机构' }],
                      initialValue: selectedRows[0]?.orgId
                    })(
                      <Select disabled={true} onChange={this.getSourceData} placeholder='请选择归属机构' showSearch optionFilterProp="children">
                        {orgData.length > 0 && orgData.map(item => (
                          <Option key={item.id} value={item.id}>{item.orgName}</Option>
                        ))}
                      </Select>
                    )}
                  </Form.Item>
                </Col>
                <Col md={20}>
                  <Form.Item label="归属系统:" {...formItemLayout}>
                    {getFieldDecorator('_sysId', {
                      rules: [{ required: true, message: '请选择归属系统' }],
                      initialValue: selectedRows[0]?.sysId
                    })(
                      <Select disabled={true} onChange={this.getSourceData} placeholder='请选择归属系统' showSearch optionFilterProp="children">
                        {dropDownData?.attributionSystem?.length > 0 && dropDownData.attributionSystem.map(item => (
                          <Option key={item.code} value={item.code}>{item.name}</Option>
                        ))}
                      </Select>
                    )}
                  </Form.Item>
                </Col>
                <Col md={20}>
                  <Spin size='small' spinning={sourceLoading}>
                    <Form.Item label="数据源名称:" {...formItemLayout}>
                      {getFieldDecorator('_dataSourceCode', {
                        rules: [{ required: true, message: '请选择数据源名称' }],
                        initialValue: record?.dataSourceCode || '',
                      })(
                        <Select placeholder='请选择数据源名称' showSearch optionFilterProp="children">
                          {sourceData.length > 0 && sourceData.map(item => (<Option key={item.code} value={item.code}>{item.name}</Option>))}
                        </Select>
                      )}
                    </Form.Item>
                  </Spin>
                </Col>
              </Row>
            </Form>
          </Spin>}
          <div style={{ textAlign: 'right', marginBottom: 20, marginTop: 20 }}>
            <Button style={{ marginRight: 10 }} onClick={this.tableModalCancel}>取消</Button>
            <Button type='primary' style={{ marginRight: 10 }} onClick={this.createTable} loading={tableLoading}>确定</Button>
          </div>
        </Modal>
      </>
    );
  }
}

class EditableCell extends React.Component {
  setInitialValue = (record, dataIndex) => {
    if (['columnName', 'columnNameDesc', 'commInterface'].includes(dataIndex)) {
      return record[dataIndex];
    }
    if (['isPrimaryKey', 'required', 'extended', 'systemLevel'].includes(dataIndex)) {
      return record[dataIndex] || 0
    }
    if (dataIndex === 'columnType') {
      const columnTypeVal = dataSourceType === 'ORACLE' ? 'VARCHAR2' : 'varchar'; // 'VARCHAR' mysql字典有可能使用小写，注意！
      return record[dataIndex] || columnTypeVal
    }

    if (dataIndex === 'precision' && selNumber === 0) {
      if (record[dataIndex]) {// 若精度值存在，可编辑
        isRequired = true;
        return record[dataIndex];
      } else {
        isRequired = false;
        return record[dataIndex];
      }
    }

  }


  selectChange = (val, option, setFieldsValue) => {
    const precision = option.props.remarks; // 词汇字典中的备注，为精度的默认值
    const isPrimaryKey = 0; // 是否主键，默认是“否”
    isRequired = precision ? true : false;// 当remarks有值时，精度可编辑
    selNumber++;
    setFieldsValue({ precision, isPrimaryKey });
  }
  columnNameRepeatCheck = e => {
    const val = e.target.value;

    if (val) {
      if (timer) {
        clearTimeout(timer);
      }
      timer = setTimeout(() => {
        _data.forEach(item => {
          if (item?.columnName?.toUpperCase() === val.toUpperCase()) {
            message.error('数据库字段名重复')
          }
        })
      }, 1000);
    }
  }
  getInput = setFieldsValue => {
    const { inputType, record } = this.props;

    if (['columnName', 'columnNameDesc', 'commInterface'].includes(inputType)) {
      return <Input
        onChange={inputType === 'columnName' ? this.columnNameRepeatCheck : null}
      />
    }
    if (inputType === 'precision') {
      return <Input disabled={!isRequired} />
    }
    if (['required', 'extended', 'systemLevel', 'isPrimaryKey'].includes(inputType)) {
      return (
        <Select style={{ width: '100%' }} showSearch optionFilterProp="children">
          <Option key='1' value={1}>是</Option>
          <Option key='0' value={0}>否</Option>
        </Select>
      )
    }
    if (inputType === 'columnType') {
      return (
        <Select style={{ width: '100%' }} onChange={(val, option) => this.selectChange(val, option, setFieldsValue)} showSearch optionFilterProp="children">
          {dataSourceType === 'ORACLE' ? oracleOption.map(item => (
            <Option key={item.code} value={item.code} remarks={item.remarks}>{item.code}</Option>
          )) : mysqlOption.map(item => (
            <Option key={item.code} value={item.code} remarks={item.remarks}>{item.code}</Option>
          ))}
        </Select>
      )
    }

  };


  renderCell = ({ getFieldDecorator, setFieldsValue }) => {
    const { editing, dataIndex, title, record, children, ...restProps } = this.props;
    return (
      <td {...restProps}>
        {editing ? (
          <FormItem style={{ margin: 0 }}>
            {getFieldDecorator(dataIndex, {
              rules: [{
                required: dataIndex === 'precision' ? isRequired ? true : false : ['isPrimaryKey', 'columnName', 'columnType', 'extended', 'systemLevel'].includes(dataIndex) ? true : false,
                message: '请正确填写',
              }],
              initialValue: this.setInitialValue(record, dataIndex)
            })(this.getInput(setFieldsValue))}
          </FormItem>
        ) : (children)}
      </td>
    )
  }
  render() {
    return <EditableContext.Consumer>{this.renderCell}</EditableContext.Consumer>
  }
}

class VipCell extends React.Component {
  configNameChange = (val, setFieldsValue) => {
    optionData = vipModalObj[val];
    let configDesc = '';
    columnConfigTypeData.map(item => {
      if (item.code === val) {
        configDesc = item.remarks;
      }
    })
    setFieldsValue({ configDesc, configValue: '' })
  }

  configValueChange = (val, setFieldsValue) => {
    let configDesc = '';
    optionData.map(item => {
      if (item.code === val) {
        configDesc = item.remarks;
      }
    })
    setFieldsValue({ configDesc })
  }

  getInput = setFieldsValue => {
    const { inputType } = this.props;
    if (inputType === 'configName') {
      return (
        <Select style={{ width: '100%' }} onChange={val => this.configNameChange(val, setFieldsValue)} showSearch optionFilterProp="children">
          {columnConfigTypeData.map(item => (
            <Option key={item.code} value={item.code}>{item.name}</Option>
          ))}
        </Select>
      )
    }
    if (inputType === 'configValue') {
      return (
        <Select style={{ width: '100%' }} onChange={val => this.configValueChange(val, setFieldsValue)} showSearch optionFilterProp="children">
          {optionData.map(item => (
            <Option key={item.code} value={item.code}>{item.name}</Option>
          ))}
        </Select>
      )
    }
    if (inputType === 'configDesc') {
      return <Input />
    }

  };

  renderCell = ({ getFieldDecorator, setFieldsValue }) => {
    const { editing, dataIndex, title, record, children, ...restProps } = this.props;
    return (
      <td {...restProps}>
        {editing ? (
          <FormItem style={{ margin: 0 }}>
            {getFieldDecorator(dataIndex, {
              rules: [{
                required: ['configName', 'configValue'].includes(dataIndex) ? true : false,
                message: '请正确填写',
              }],
              initialValue: record[dataIndex],
            })(this.getInput(setFieldsValue))}
          </FormItem>
        ) : (children)}
      </td>
    )
  }
  render() {
    return <EditableContext.Consumer>{this.renderCell}</EditableContext.Consumer>
  }
}


const WrappedSingleForm = errorBoundary(
  linkHoc()(
    Form.create()(
      connect(({ tableStructure, dataSource, productElements }) => ({ tableStructure, dataSource, productElements }))(Index),
    ),
  ),
);

export default WrappedSingleForm;
