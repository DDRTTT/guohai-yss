// 级联关系页面
import React, { useEffect, useRef, useState } from 'react';
import { errorBoundary } from '@/layouts/ErrorBoundary';
import { connect } from 'dva';
import { Button, DatePicker, Form, Input, Layout, message, Modal, Row, Select } from 'antd';
import { linkHoc } from '@/utils/hocUtil';
import { handleTableCss } from '@/utils/utils';
import styles from './index.less';
import { cloneDeep, uniq } from 'lodash';
import { Table } from '@/components';
import List from '@/components/List';

const { Search } = Input;
const FormItem = Form.Item;
const { RangePicker } = DatePicker;
const { Content } = Layout;
const { confirm } = Modal;

let initalTableCurrent = '';
const Index = ({
  form: { getFieldsValue, getFieldDecorator, setFieldsValue, resetFields, validateFields },
  dispatch,
  listLoading,
  electronicRecord: {
    cascadeList,
    moduleCodeList,
    propertyList,
    remarkList,
    remarkListAll,
    propertyListAll,
    fileTypeList,
    fileTypeListAll,
    saveWordDictionaryFetch,
  },
}) => {
  // 展开/收起
  const [seniorType, setSeniorType] = useState(false);
  // 每页数据条数
  const [rows, setrows] = useState(10);
  // 页码
  const [pageNum, setPageNum] = useState(1);
  // 批量选中数据
  const [selectData, setSelectData] = useState([]);
  // 弹出框title
  const [opType, setOpType] = useState('add');
  // 添加弹出框
  const [addVisible, setAddVisible] = useState(false);
  // 请求控制阀
  const [flag, setFlag] = useState(true);
  // 新增修改表单中选中对象
  const [selObj, setSelObj] = useState({});
  // 列表中当前修改对象原数据
  const [oldObj, setOldObj] = useState({});
  // 搜索表单数据
  const [searchFormData, setSearchFormData] = useState({});
  // 数据加载flag
  const [spinning, setSpinning] = useState(false);
  // 下拉禁止
  const [ctrlFlag0, setCtrlFlag0] = useState(false);
  const [ctrlFlag2, setCtrlFlag2] = useState(false);
  const [ctrlFlag4, setCtrlFlag4] = useState(false);

  const controlFlag = useRef(false);
  const keywordInput = useRef(null);

  // 底稿目录配置列表
  useEffect(() => {
    handleWordDictionaryFetch('M001');
    handleGetListFetch(10, 1);
    handleGetModuleCode();
    handleGetPropertyName();
    handleGetAllRemaks();
    handleGetFileTypeOfADD();
    handleGetFileTypeOfUpdate();
  }, []);

  // 字典（业务模块定义）
  const handleWordDictionaryFetch = codeList => {
    dispatch({
      type: 'electronicRecord/handleWordDictionaryFetch',
      payload: { codeList },
    });
  };

  // 查询所有的业务模块定义(一级)
  const handleGetModuleCode = () => {
    dispatch({
      type: 'electronicRecord/handleGetModuleCodeInfo',
      payload: {},
    });
  };
  // 所有的模块业务属性定义(二级)
  const handleGetPropertyName = moduleCode => {
    dispatch({
      type: 'electronicRecord/handleGetPropertyInfo',
      payload: { moduleCode },
    }).then(data => {
      if (data) {
        setSpinning(false);
      }
    });
  };

  // 获取指定的属性业务值定义(三级目录)
  const handleGetRemaks = (moduleCode, propertyName) => {
    dispatch({
      type: 'electronicRecord/handleGetRemarkInfo',
      payload: { moduleCode, propertyName },
    }).then(data => {
      if (data) {
        setSpinning(false);
      }
    });
  };
  // 所有的三级目录
  const handleGetAllRemaks = () => {
    dispatch({
      type: 'electronicRecord/handleGetRemarkInfoAll',
      payload: {},
    }).then(data => {
      if (data) {
        setSpinning(false);
      }
    });
  };
  // 新增时，所有的 已被关联的文件类型(四级目录)
  const handleGetFileTypeOfADD = () => {
    dispatch({
      type: 'electronicRecord/handleGetFileTypeInfoADD',
      payload: {},
    });
  };

  // 高级搜索，关联文件类型-所有
  const handleGetFileTypeOfUpdate = () => {
    dispatch({
      type: 'electronicRecord/handleGetFileTypeInfoAlter',
      payload: {},
    });
  };

  // 业务模块回调
  const handleModuleCodeBack = data => {
    setSpinning(true);
    // 清空2,3级目录
    setFieldsValue({
      propertyName: { key: '', label: '' },
      property: '',
      valueName: { key: '', label: '' },
      propertyValue: '',
    });
    dispatch({
      type: 'electronicRecord/handleEmptyPropertyList',
      payload: {},
    });
    if (data) {
      handleGetPropertyName(data);
      const obj = { moduleCode: data };
      setSelObj(obj);
    }
  };

  const handlePropertyBack = data => {
    setSpinning(true);
    if (data) {
      console.log(data);
      const obj = { moduleCode: selObj.moduleCode, property: data.key, propertyName: data.label };
      setSelObj(obj);
      handleGetRemaks(obj.moduleCode, data.label);
    }
  };

  // 三级目录回调
  const handleGetNoFileTypeBack = data => {
    setSpinning(true);
    if (data) {
      const obj = {
        moduleCode: selObj.moduleCode,
        property: selObj.property,
        propertyName: selObj.propertyName,
        propertyValue: data,
      };
      setSelObj(obj);
      handleGetNoFileType(obj.moduleCode, obj.property, obj.propertyValue, obj.propertyName);
      handleGetTrueRemarks(obj.moduleCode, obj.propertyValue, obj.propertyName);
    }
  };

  // 根据1,2目录查出对应的remarks
  const handleGetTrueRemarks = (moduleCode, property, valueName) => {
    dispatch({
      type: 'electronicRecord/handleGetRemarkInfo',
      payload: { moduleCode, property, valueName },
    }).then(data => {
      // const obj = {
      //   moduleCode: selObj.moduleCode,
      //   property: selObj.property,
      //   propertyName: selObj.propertyName,
      //   propertyValue: selObj.propertyValue,
      // };
      // setSelObj(obj);
    });
  };

  // 根据1,2,3目录查询未关联的文件类型
  const handleGetNoFileType = (moduleCode, property, propertyValue, propertyName) => {
    dispatch({
      type: 'electronicRecord/handleGetNoFileTypeInfo',
      payload: { moduleCode, property, propertyValue, propertyName },
    }).then(data => {
      if (data) {
        setSpinning(false);
      }
    });
  };

  const paginationProps = {
    showSizeChanger: true,
    showQuickJumper: true,
    current: pageNum,
    total: cascadeList.total,
    showTotal: total => `共 ${total} 条数据`,
  };

  /**
   * 分页回调
   * @method  handlePaginationChange
   */
  const handlePaginationChange = (pagination, filters, sorter, extra) => {
    const field = sorter.columnKey;
    let direction;
    switch (sorter.order) {
      case 'ascend':
        direction = 'asc';
        break;
      case 'descend':
        direction = 'desc';
        break;
      default:
        direction = '';
        break;
    }
    validateFields(values => {
      if (rows != pagination.pageSize || (initalTableCurrent && pageNum != pagination.current)) {
        controlFlag.current = true;
      } else {
        controlFlag.current = false;
      }
      initalTableCurrent = pagination.current;
      setrows(pagination.rows);
      setPageNum(pagination.current);
      values = searchFormData;
      delete values.moduleCode;
      delete values.propertyName;
      delete values.propertyValue;
      delete values.fileTypeCodes;
      console.log(values);
      handleGetListFetch(pagination.pageSize, pagination.current, field, direction, values);
    });
  };

  /**
   * rowSelection 回调
   */
  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
      setSelectData(selectedRows);
    },
  };

  /**
   * table组件
   */
  const tableCom = () => {
    return (
      <Table
        rowKey="id"
        // bordered
        loading={listLoading}
        dataSource={cascadeList.result}
        columns={columns}
        pagination={paginationProps}
        onChange={handlePaginationChange}
        scroll={{ x: columns.length * 200 }}
        rowSelection={{
          type: 'checkbox',
          ...rowSelection,
        }}
      />
    );
  };

  const columns = [
    // {
    //   title: '序号',
    //   key: 'order',
    //   width: 100,
    //   render: (text, record, index) => `${(pageNum - 1) * rows + index + 1}`,
    // },
    {
      title: '业务模块',
      dataIndex: 'moduleName',
      key: 'moduleCode',
      // sorter: true,
      render: (_, row) => {
        return {
          children: row.moduleName,
          props: {
            rowSpan: row.rowSpan,
          },
        };
      },
    },

    {
      title: '模块业务属性名称',
      dataIndex: 'propertyName',
      key: 'propertyName',
      // sorter: true,
      render: text => {
        return handleTableCss(text);
      },
    },
    {
      title: '属性业务值名称',
      dataIndex: 'valueName',
      key: 'valueName',
      // sorter: true,
      render: text => {
        return handleTableCss(text);
      },
    },
    {
      title: '档案类别',
      dataIndex: 'fileTypeNames',
      key: 'fileTypeNames',
      render: text => {
        return handleTableCss(text.join(','));
      },
      // sorter: true,
    },
    {
      title: '操作',
      dataIndex: 'opeator',
      key: 'opeator',
      align: 'left',
      fixed: 'right',
      render: (text, record) => {
        const actionBtnList = getActionBtn();
        return <ActionButton buttonList={actionBtnList} handlerBack={handleEdit} record={record} />;
      },
    },
  ];

  /**
   * 操作列表按钮
   *
   */
  const ActionButton = props => {
    const { buttonList } = props;
    const child = buttonList.map((item, index) => {
      const button = (
        // <Action code={item.code}>
        <a
          style={{ marginRight: 10 }}
          onClick={() => {
            props.handlerBack(item.label, props.record);
          }}
        >
          {item.label}
        </a>
        // </Action>
      );
      return <span key={index}>{button}</span>;
    });
    return child;
  };

  /**
   * 生成不同的按钮
   * @param {*} operStatusName
   */
  const getActionBtn = () => {
    const buttonList = [{ label: '修改' }, { label: '删除' }];

    return buttonList;
  };

  /**
   * 为操作列表按钮，绑定事件
   * @param {*} label
   * @param {*} record
   */
  const handleEdit = (label, record) => {
    switch (label) {
      case '修改':
        setOpType('edite');
        setAddVisible(true);
        setCtrlFlag0(true);
        setCtrlFlag2(true);
        setCtrlFlag4(true);
        setOldObj(record);
        handleGetFileTypeOfUpdate();
        // 去重关联文件类型，fileTypeCode相同的筛除
        const newFileTypeCodes = uniq(record.fileTypeCodes);
        setFieldsValue({
          moduleCode: record.moduleCode,
          propertyName: { key: record.property, label: record.propertyName },
          property: record.property,
          valueName: { key: record.propertyValue, label: record.valueName },
          propertyValue: record.propertyValue,
          fileTypeCodes: newFileTypeCodes,
        });
        break;
      case '删除':
        confirm({
          title: '确定删除所选内容吗?',
          content: '',
          onOk() {
            dispatch({
              type: 'electronicRecord/handleDeleteInfo',
              payload: record.ids,
            }).then(data => {
              if (data) {
                handleCheck();
              }
            });
          },
          onCancel() {
            console.log('Cancel');
          },
        });
        break;
      default:
        throw new Error('没有该按钮的处理方法');
    }
  };

  /**
   * 方法说明 列表（搜索）
   * @method  handleGetListFetch
   * @return {Object}
   * @param rows {number} 每页大小
   * @param pageNum  {number} 页数/当前页
   * @param field  {string} 排序字段
   * @param direction  {string} 排序方式
   * @param formData {Object} 表单项
   */
  const handleGetListFetch = (rows = rows, pageNum = pageNum, field, direction, formData) => {
    setSpinning(true);
    dispatch({
      type: 'electronicRecord/handleGetListInfo',
      payload: {
        rows: rows || 10,
        pageNum,
        field,
        direction,
        ...formData,
      },
    }).then(() => {
      setSpinning(false);
      if (controlFlag.current) {
        document.querySelector('.ant-pagination-options-quick-jumper>input').value = '';
      }
    });
  };

  /**
   * 方法说明 循环生成select
   * @method  handleMapList
   * @return {void}
   * @param  {Object[]}       data 数据源
   * @param  {string}         name   select的name
   * @param  {string}         code  select的code
   * @param  {boolean|string} mode  是否可以多选(设置 Select 的模式为多选或标签)
   * @param  {boolean}        fnBoole 选择时函数控制
   * @param  {function}       fn 控制函数
   * @param  {boolean}       labelFlag 获得选项问本
   * @param  {boolean}        ctrlFlag 控制禁用
   * @param  {boolean}        blurFlag 控制搜索
   * @param  {Function}        blurFn 失焦回调
   * @param  {Function}        searchFn 搜索回调
   * @param arrowFlag
   */
  const handleMapList = (
    data,
    code,
    name,
    mode = false,
    fnBoole = false,
    fn = undefined,
    labelFlag = false,
    ctrlFlag = false,
    blurFlag = false,
    blurFn = undefined,
    searchFn = undefined,
    arrowFlag = true,
  ) => {
    if (!data) {
      data = {};
      data.data = [];
    }
    if (data) {
      const children = [];
      for (const key of data) {
        const keys = key[code];
        const values = key[name];
        children.push(
          <Select.Option key={keys} value={keys}>
            {values}
          </Select.Option>,
        );
      }
      return (
        <Select
          showArrow={arrowFlag}
          allowClear
          showSearch={blurFlag}
          labelInValue={labelFlag}
          mode={mode}
          style={{ width: '100%' }}
          placeholder="请选择"
          optionFilterProp="children"
          onChange={fnBoole ? fn : undefined}
          onBlur={blurFlag ? blurFn : undefined}
          onSearch={blurFlag ? searchFn : undefined}
          disabled={ctrlFlag}
        >
          {children}
        </Select>
      );
    }
  };

  const changeBackPropertyName = data => {
    setFieldsValue({ property: data ? data.key : '' });
    const flag = !!data;
    setCtrlFlag2(flag);
    // 根据1,2级查3级
    if (data) {
      const values = getFieldsValue();
      handleGetTrueRemarks(values.moduleCode, data.key);
    }
  };

  // 新增表单--属性名名称失焦回调
  const blurBackPropertyName = data => {
    if (data && data.key) {
      setFieldsValue({ property: data.key });
      setCtrlFlag2(true);
      return;
    }
    console.log(getFieldsValue());
    const val = getFieldsValue().propertyName;
    const arr = propertyList.filter(item => {
      return item.propertyName === val;
    });
    if (arr.length !== 0) {
      setFieldsValue({ property: arr[0].property });
    }
    setCtrlFlag2(false);
  };

  // 新增表单--属性名名称搜索回调
  const searchBackPropertyName = data => {
    console.log(data);
    if (data) {
      setFieldsValue({ propertyName: { key: '', label: data } });
    }
  };

  // 新增表单--属性业务值回调搜索
  const searchBaCKRemarks = data => {
    if (data) {
      setFieldsValue({ valueName: { key: '', label: data } });
    }
  };

  // 3级目录change事件
  const changeBackRemarks = data => {
    setFieldsValue({ propertyValue: data ? data.key : '' });
    const flag = !!data;
    setCtrlFlag4(flag);
  };

  // 新增表单--属性值失焦回调
  const blurBackRemarks = data => {
    if (data && data.key) {
      setFieldsValue({ propertyValue: data.key });
      setCtrlFlag4(true);
      return;
    }
    const val = getFieldsValue().valueName;
    if (!val) {
      return;
    }
    const arr = remarkList.filter(item => {
      return item.valueName === val.label;
    });
    if (arr.length !== 0) {
      setFieldsValue({ propertyValue: arr[0].propertyValue });
      setCtrlFlag4(true);
    } else {
      setCtrlFlag4(false);
    }
  };
  /**
   * 条件查询
   * @method searchBtn
   */
  const handlerSearch = fieldsValue => {
    setSearchFormData(fieldsValue);
    handleGetListFetch(10, 1, '', '', fieldsValue);
  };
  const handleCheck = () => {
    setPageNum(1);
    handleGetSearchFetch(10, 1);
  };
  
  //重置
  const handleReset = () => {
    setSearchFormData({});
    handleGetListFetch(10, 1, '', '', {});
  }
  // 模糊搜索
  const blurSearch = value => {
    value = { keyword: value };
    handleGetListFetch(10, 1, '', '', value);
  };
  

  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 6 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 16 },
    },
  };

  // 新增/修改--弹出框表单
  const FormAttrbuite = () => {
    return (
      <div className={styles.addOrEdite}>
        <FormItem label="业务模块">
          {getFieldDecorator('moduleCode', {
            rules: [
              {
                required: true,
                message: '请选择',
              },
            ],
          })(
            handleMapList(
              saveWordDictionaryFetch.M001 || [],
              'code',
              'name',
              false,
              true,
              handleModuleCodeBack,
              false,
              ctrlFlag0,
              false,
              undefined,
              undefined,
            ),
          )}
        </FormItem>
        <FormItem label="模块业务属性名称">
          {getFieldDecorator('propertyName')(
            handleMapList(
              getFieldsValue().moduleCode ? propertyList || [] : [],
              'property',
              'propertyName',
              '',
              true,
              changeBackPropertyName,
              true,
              ctrlFlag0,
              true,
              blurBackPropertyName,
              searchBackPropertyName,
            ),
          )}
        </FormItem>
        <FormItem label="模块业务属性" style={{ display: opType === 'add' ? '' : 'none' }}>
          {getFieldDecorator('property', {
            getValueFromEvent: event => {
              return event.target.value.replace(/[^a-zA-Z0-9]/g, '');
            },
          })(<Input placeholder="请输入" disabled={ctrlFlag2} />)}
        </FormItem>
        <FormItem label="属性业务值名称">
          {getFieldDecorator('valueName')(
            handleMapList(
              getFieldsValue().propertyName ? remarkList || [] : [],
              'propertyValue',
              'valueName',
              '',
              true,
              changeBackRemarks,
              true,
              ctrlFlag0,
              true,
              blurBackRemarks,
              searchBaCKRemarks,
            ),
          )}
        </FormItem>
        <FormItem label="属性业务值" style={{ display: opType === 'add' ? '' : 'none' }}>
          {getFieldDecorator('propertyValue', {
            getValueFromEvent: event => {
              return event.target.value.replace(/[^a-zA-Z0-9]/g, '');
            },
          })(<Input placeholder="请输入" disabled={ctrlFlag4} />)}
        </FormItem>
        <FormItem label="档案类别">
          {getFieldDecorator('fileTypeCodes', {
            rules: [
              {
                required: true,
                message: '请选择',
              },
            ],
          })(
            handleMapList(
              fileTypeList || [],
              'fileTypeCode',
              'fileTypeName',
              'multiple',
              false,
              '',
              false,
              false,
              false,
              '',
              '',
              false,
            ),
          )}
        </FormItem>
      </div>
    );
  };

  const handleAddInfo = () => {
    resetFields();
    setOpType('add');
    setAddVisible(true);
    setCtrlFlag2(false);
    setCtrlFlag4(false);
    handleGetFileTypeOfADD();
    if (selectData.length > 1) {
      message.warn('请选择一条内容');
    } else if (selectData.length === 1) {
      setFieldsValue({ moduleCode: selectData[0].moduleCode });
    } else {
      setCtrlFlag0(false);
    }
  };

  // 置空propertyList
  const empatyProperTyList = () => {
    dispatch({
      type: 'electronicRecord/handleEmptyPropertyList',
      payload: {},
    });
  };

  // 新增-确认
  const handleAdd = () => {
    if (flag) {
      validateFields(values => {
        values = getFieldsValue();
        if (!values.moduleCode) {
          message.warn('业务模块不能为空');
          return;
        }
        if (!values.fileTypeCodes || !values.fileTypeCodes.length) {
          message.warn('档案类别不能为空');
          return;
        }
        // 2及目录和三级目录必须是成对出现
        if (values.propertyName && propertyName.label && !values.property) {
          message.warn('属性业务值不能为空');
          return;
        }
        if (values.property && !values.propertyName) {
          message.warn('请选择模块业务属性名称');
          return;
        }
        if (values.valueName && values.valueName.label && !values.propertyValue) {
          message.warn('属性业务值不能为空');
          return;
        }
        if (values.propertyValue && !values.valueName) {
          message.warn('请选择属性业务值名称');
          return;
        }
        if (
          values.valueName &&
          values.valueName.label &&
          values.propertyValue &&
          !values.propertyName.label
        ) {
          message.warn('请选择模块业务属性名称');
          return;
        }

        if (!values.moduleCode.errors && !values.fileTypeCodes.errors) {
          setFlag(false);
          setSpinning(true);
          let reqObj = cloneDeep(values);
          reqObj.propertyName = values.propertyName ? values.propertyName.label : '';
          reqObj.valueName = values.valueName ? values.valueName.label : '';
          if (opType === 'add') {
          } else {
            reqObj = {
              ids: oldObj.ids,
              new: reqObj,
            };
          }
          reqObj.opType = opType;
          handleAddOrEditeInfo(reqObj);
        }
      });
    }
  };

  // 新增修改接口
  const handleAddOrEditeInfo = params => {
    dispatch({
      type: 'electronicRecord/handleAddOrEditeInfo',
      payload: { ...params },
    }).then(data => {
      if (data) {
        setAddVisible(false);
        handleCheck();
      }
      setFlag(true);
      setSpinning(false);
    });
  };

  // 批量删除
  const handleDeleteInfo = () => {
    if (selectData.length === 0) {
      message.warn('请至少选中一条数据');
      return;
    }
    const ids = [];
    selectData.forEach(item => {
      ids.push(...item.ids);
    });
    confirm({
      title: '确定删除所选内容吗?',
      content: '',
      onOk() {
        dispatch({
          type: 'electronicRecord/handleDeleteInfo',
          payload: ids,
        }).then(data => {
          if (data) {
            handleCheck();
            setSelectData([]);
          }
        });
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  };

  const formItemData = [
    {
      name: 'moduleCodeList',
      label: '业务模块',
      type: 'select',
      readSet: { name: 'name', code: 'code' },
      config: { mode: 'multiple', maxTagCount: 1 },
      option: saveWordDictionaryFetch.M001 || [],
    },
    {
      name: 'propertyList',
      label: '模块业务属性名称',
      type: 'select',
      readSet: { name: 'propertyName', code: 'property' },
      config: { mode: 'multiple', maxTagCount: 1 },
      option: propertyListAll || [],
    },
    {
      name: 'propertyValueList',
      label: '属性业务值名称',
      type: 'select',
      readSet: { name: 'valueName', code: 'propertyValue' },
      config: { mode: 'multiple', maxTagCount: 1 },
      option: remarkListAll || [],
    },
    {
      name: 'fileTypeCodeList',
      label: '档案类别',
      type: 'select',
      readSet: { name: 'fileTypeName', code: 'fileTypeCode' },
      config: { mode: 'multiple', maxTagCount: 1 },
      option: fileTypeListAll || [],
    },
  ];

  return (
    <>
      <List
        formItemData={formItemData}
        advancSearch={handlerSearch}
        resetFn={handleReset}
        searchPlaceholder="请输入模块业务属性名称/属性业务值名称/档案类别"
        fuzzySearch={blurSearch}
        extra={
          <div className={styles.wrapButton}>
            {/*<Action code="manuscriptBasic:add"> */}
            <Button type="primary" onClick={handleAddInfo} style={{ marginRight: 10 }}>
              新增
            </Button>
            <Button type="danger" onClick={handleDeleteInfo}>
              删除
            </Button>
            {/*</Action> */}
          </div>
        }
        tableList={(<>
          {tableCom()}
        </>)}
      />
      <Modal
        title={opType === 'add' ? '新增' : '修改'}
        closable={false}
        visible={addVisible}
        onOk={handleAdd}
        onCancel={() => {
          setAddVisible(false);
          resetFields();
          empatyProperTyList();
        }}
      >
        <Form {...formItemLayout}>
          <Row gutter={{ md: 8, lg: 24, xl: 48 }}>{FormAttrbuite()}</Row>
        </Form>
      </Modal>
    </>
  );
};

const WrappedIndexForm = errorBoundary(
  linkHoc()(
    Form.create()(
      connect(({ electronicRecord, loading }) => ({
        electronicRecord,
        listLoading: loading.effects['electronicRecord/handleGetListMsg'],
      }))(Index),
    ),
  ),
);

export default WrappedIndexForm;
