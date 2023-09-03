import React, { Component } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import Action, { linkHoc } from '@/utils/hocUtil';
import { errorBoundary } from '@/layouts/ErrorBoundary';
import { getAuthToken, getSession, USER_INFO } from '@/utils/session';
import { exChangeWidgetType } from '@/utils/utils';
import {
  Form,
  Input,
  Modal,
  Breadcrumb,
  Row,
  Col,
  Icon,
  Button,
  Select,
  Divider,
  Popconfirm,
  Tabs,
  Upload,
  message,
  Menu,
  Dropdown,
  Table,
  Tooltip
} from 'antd';
import { tableRowConfig, eutrapelia } from '@/pages/investorReview/func';
import styles from './productElements.less';
import List from '@/components/List';
import { Card } from '@/components';
import { DownOutlined, UserOutlined } from '@ant-design/icons';
import { downloadFile, json2txt } from '@/utils/download';

const { Search } = Input;
const { confirm } = Modal;
const { Option } = Select;
const { TabPane } = Tabs;
const FormItem = Form.Item;

@Form.create()
class Index extends Component {
  state = {
    isForm: true,
    loading: false,
    activeKey: 'business',
    relationVisible: false,
    relationLoading: false,
    relationBtn: false,
    relationCurrent: 1,
    relationPageSize: 10,
    relationListData: [],
    mateLoading: false,
    selectedRowKeys: [],
    selectedRows: [],
    dropDownData: [],
    orgData: [],
    dataLevelList: [],
    uploadBtnLoading: false,
    current: 1,
    pageSize: 40,// 需求变更：默认展示40条
    total: 0,
    /*
    * 注意：因为两个tab共用此变量，导致在查询、重置、切换页码等操作后，前端展示的数据总会比后台返回的实际数据莫名多展示几条，故需要在重新赋值之前，重置 listData为空
    */
    listData: [], //列表数据
    searchData: {}, //条件查询数据
    fuzzyData: '', // 模糊查询字段
    sortData: { createTime: 'desc' }, // 排序字段
    queryData: [], // 业务列表选中标识
    activeRecord: {}, //当前列表操作列数据
    listForStructure: [], //表结构列表

    // 关联管理相关数据
    activeRecordForRelation: {}, //选中列的数据
    relationType: '', //操作方式  relation(关联)  matching(匹配)

    // 一键匹配相关数据
    matchingForsystem: '', //归属系统 - 匹配项弹窗
    matchingFormechanism: '', //归属机构 - 匹配项弹窗 - 用作获取表名list
    surfaceList: [], //表名称list
    visibleForselectMatching: false,
    isShowBtn: true,
    mateVisible: false,
    activeRecordForMate: {}, //选中列的数据
    listForMate: [], //列表数据
    mateSuccess: 0, // 匹配成功条数
    mateFail: 0, // 匹配失败条数

    visibleForEmigration: false, //迁出弹框
    uploadBtnLoadingForMove: false,
  };

  // tab切换
  handleTabChange = activeKey => {
    this.setActiveKey(activeKey);
    this.setState({ activeKey, queryData: [], activeRecord: {}, listData: [] }, () => {// listData: []：修复bug-两个tab表格共用一个变量，切换时若不清空，前端分页数据展示异常
      this.handleReset();
    });
  };

  // 条件查询和模糊查询重置
  handleReset = () => {
    const { activeKey } = this.state;
    this.setState(
      {
        current: 1,
        searchData: {},
        fuzzyData: '',
        sortData: { createTime: 'desc' },
      },
      () => {
        this.getBusinessList();
      },
    );
  };

  // 删除数据按钮
  del = record => {
    const { dispatch } = this.props;
    dispatch({
      type: 'productElements/deleteBusiness',
      payload: { id: record.id },
    }).then(res => {
      this.getBusinessList();
      message.success('删除成功');
    });
  };

  // 查看详情跳转
  jumpDetail = record => {
    const { activeKey } = this.state;
    this.setActiveKey(activeKey);
    this.props.dispatch(
      routerRedux.push({
        // pathname: `productElementsList/${activeKey}Details`,
        pathname: `productElementsList/businessDetails`,
        query: { id: record.id, activeKey },
        data: record,
      }),
    );
  };

  setActiveKey = key => {
    sessionStorage.setItem('proEleListObj', JSON.stringify({ activeKey: key }));
  };

  // 修改和新增跳转
  jumpAdd = record => {
    const { activeKey } = this.state;
    this.setActiveKey(activeKey);
    this.props.dispatch(
      routerRedux.push({
        pathname: `productElementsList/businessAdd`,
        query: { id: record.id, activeKey },
        data: record,
      }),
    );
  };

  /**
   * 请求参数的统一处理
   * @param {Object} pagination 分页数据
   * @param {Object} conditionsOr 模糊查询数据
   * @param {Object} conditions 精准查询数据
   * @param {Object} sort 排序 desc是降序，asc是升序
   * @param {Array} fuzzArr 精准查询中采用模糊查询方式的数组
   */
  requestParams(pagination, conditionsOr, conditions, sort, fuzzArr, operatorForIN) {
    let conditions_ = [];
    let conditionsOr_ = [];
    conditions &&
      Object.keys(conditions).forEach(k => {
        if (conditions[k]) {
          conditions_.push({
            name: k,
            operator: fuzzArr?.includes(k) ? 'LIKE' : operatorForIN?.includes(k) ? 'IN' : 'EQ',
            value: conditions[k],
          });
        }
      });
    conditionsOr &&
      Object.keys(conditionsOr).forEach(k => {
        if (conditionsOr[k]) {
          conditionsOr_.push({ name: k, operator: 'LIKE', value: conditionsOr[k] });
        }
      });
    return {
      pagination: pagination,
      conditionsOr: conditionsOr_,
      conditions: conditions_,
      sort: sort,
    };
  }

  /**
   * 产品要素-业务 - 列表查询接口
   * @param {Number} current 页码
   * @param {Number} pageSize 条数
   * @param {String} fuzzyData 模糊查询字段
   * @param {Object} sortData  排序
   * @param {Object} searchData  条件查询数据
   * @param {Array} fuzzArr  精准查询中采用模糊查询方式的数组
   * @param {Array} operatorForIN  精准查询中多选查询方式的数组
   * @returns
   */
  getBusinessList = () => {
    let { current, pageSize, fuzzyData, sortData, searchData, activeKey } = this.state;
    const { dispatch } = this.props;
    // 增加限制：activeKey === 'business'，即：去掉产品要素-表结构部分的是否系统级别字段默认为否
    if (!searchData?.systemLevel && activeKey === 'business') {
      searchData.systemLevel = '0';
    }
    const fuzzArr = ['attributeName', 'bizDataName'];
    const operatorForIN = ['industry'];
    const payload = this.requestParams(
      { page: current, size: pageSize },
      { attributeName: fuzzyData, bizDataName: fuzzyData },
      searchData,
      sortData,
      fuzzArr,
      operatorForIN,
    );
    this.setState({ loading: true, listData: [] }, () => {
      dispatch({
        type: 'productElements/getBusinessList',
        payload: payload,
      }).then(res => {
        this.setState({
          listData: res.content,
          total: res.totalElements,
          loading: false,
        });
      });
    });
  };

  // 模糊查询
  search = val => {
    const { activeKey } = this.state;
    this.setState({ current: 1, fuzzyData: val }, () => {
      this.getBusinessList();
    });
  };

  // 精准查询
  searchForBusiness = val => {
    if (!val) {
      val = {};
    }
    const { activeKey } = this.state;
    this.setState({ current: 1, searchData: val }, () => {
      this.getBusinessList();
    });
  };

  /**
   * 分页 切换页码
   * @param {Number} current 页码
   */
  handleSetPageNum = current => {
    this.setState({ current }, () => {
      this.getBusinessList();
    });
  };

  /**
   * pageSize 变化的回调
   * @param {Number} current
   * @param {Number} pageSize
   */
  handleSetPageSize = (current, pageSize) => {
    this.setState({ current, pageSize }, () => {
      this.getBusinessList();
    });
  };

  // 导出
  exportData = val => {
    const { activeRecord } = this.state;
    const { dispatch } = this.props;
    if (val?.key === 'items') {
      let payload = [];
      activeRecord.forEach(item => {
        payload.push(item.id);
      });
      dispatch({
        type: 'productElements/exportBusiness',
        payload: payload,
      }).then(res => {
        if (res) downloadFile(res, '产品要素.xlsx', 'application/vnd.ms-excel;charset=utf-8');
      });
    } else {
      dispatch({
        type: 'productElements/exportBusinessAll',
      }).then(res => {
        if (res) downloadFile(res, '产品要素.xlsx', 'application/vnd.ms-excel;charset=utf-8');
      });
    }
  };

  // 迁出
  emigration = () => {
    const loginId = getSession('loginId');
    this.setState({ visibleForEmigration: true });
    if (loginId === '1') {// 超级管理员登录
      this.props.form.setFieldsValue({ orgId: undefined }); // 给迁出一个干净的基础
    }
  };
  // 迁出调用
  handleModeForEmigration = () => {
    const { dispatch, form } = this.props;
    form.validateFields((err, vals) => {
      if (err) return;
      dispatch({
        type: 'productElements/emigration',
        payload: vals,
      }).then(res => {
        json2txt(res, '迁出数据');
        this.handleCancel();
      });
    });
  };
  // 关闭弹窗
  handleCancel = () => {
    const { form } = this.props;
    this.setState({
      visibleForEmigration: false,
    });
    form.resetFields();
  };
  /**
   * 关联管理 模糊查询
   * @param {String} val 模糊查询数据
   */
  relationSearch = val => {
    const { activeRecord } = this.state;
    let payload = this.requestParams(
      null,
      {
        columnName: val,
        columnType: val,
        masterTableName: val,
      },
      { orgId: activeRecord?.orgId, sysId: activeRecord?.sysId },
    );
    this.setState({ relationLoading: true }, () => {
      this.props
        .dispatch({
          type: 'productElements/getColumnList',
          payload,
        })
        .then(res => {
          this.setState({ relationListData: res?.data, relationLoading: false });
        });
    });
  };

  /**
   * 关联管理 条件查询
   * @param {String} val 条件查询数据
   */
  conditionsSearch = () => {
    const obj = this.props.form.getFieldsValue(['orgId', 'sysId', 'masterTableName', 'columnName']);
    let payload = this.requestParams(null, null, obj);
    this.setState({ relationLoading: true }, () => {
      this.props
        .dispatch({
          type: 'productElements/getColumnList',
          payload,
        })
        .then(res => {
          this.setState({ relationListData: res?.data, relationLoading: false });
        });
    });
  };

  // 关闭 关联管理 弹窗
  relationCancel = () => {
    this.setState({ relationListData: [], activeRecord: {}, relationVisible: false, isForm: true });
  };

  // 开启 关联管理 弹窗
  setRelationModal = record => {
    this.setState({ activeRecord: record, relationVisible: true, relationType: 'relation' });
  };

  // 关联接口
  relationSave = () => {
    const { activeRecord, activeRecordForRelation, relationType } = this.state;
    const { dispatch } = this.props;
    const payload = [
      {
        busiId: activeRecord.id,
        columnId: activeRecordForRelation.id,
      },
    ];
    dispatch({
      type: 'productElements/saveBusiColumnMapping',
      payload: payload,
    }).then(res => {
      this.setState({ relationListData: [], activeRecord: {}, relationVisible: false }, () => {
        this.getBusinessList();
      });
    });
  };

  // 匹配 规则
  matchCheck = () => {
    const { activeRecord, activeRecordForRelation, activeRecordForMate, relationType } = this.state;
    const { dispatch } = this.props;
    this.setState({ mateLoading: true });
    dispatch({
      type: 'productElements/matchCheck',
      payload: {
        attributeName:
          relationType === 'matching'
            ? activeRecordForMate.attributeName
            : activeRecord.attributeName,
        cloumnName: activeRecordForRelation.columnName,
      },
    }).then(res => {
      if (res) {
        this.setState({ mateLoading: false });
        if (relationType === 'matching') {
          this.dataAssembly();
        } else {
          this.relationSave();
        }
      } else {
        this.setState({ mateLoading: false });
      }
    });
  };

  /**
   * 关联数据选中拼接到一键匹配操作数据中
   * @param {object} activeRecordForRelation 关联列表选中数据
   * @param {object} listForMate 一键匹配列表
   * @param {object} activeRecordForMate 一键匹配选中数据
   * @param {object} activeRecord 业务要素列选中数据
   */
  dataAssembly = () => {
    const { activeRecordForRelation, listForMate, activeRecordForMate, selectedRows } = this.state;
    // listForMate 是 匹配结果表格数据，activeRecordForMate 是 当前匹配成功的那一条数据的信息
    listForMate.forEach(item => {
      if (item.busiId === activeRecordForMate.busiId) {// 修复bug：匹配一条成功，将匹配结果列表所有数据信息都改变的问题（应只改变点击匹配的当前数据）
        item.columnId = activeRecordForRelation.id;
        item.masterTableName = selectedRows[0].masterTableName;
        item.columnName = selectedRows[0].columnName;
        item.matchResult = '1'; // 关联表和字段成功后，匹配结果改为“成功”
      }
    });
    this.setState({ relationVisible: false, relationListData: [] });
  };

  // 一键匹配列表
  handleModeForMatching = () => {
    const { dispatch, form } = this.props;
    form.validateFields((err, vals) => {
      if (err) return;
      this.setState({ mateLoading: true, mateVisible: true, visibleForselectMatching: false });
      dispatch({
        type: 'productElements/oneKeyMatchList',
        payload: vals,
      }).then(res => {
        this.setState(
          {
            listForMate: res?.oneKeyMatchVOList || [],
            mateSuccess: res?.successCount,
            mateFail: res?.failureCount,
            matchingFormechanism: '',
            matchingForsystem: '',
            mateLoading: false,
          },
          () => {
            form.resetFields();
          },
        );
      });
    });
  };

  //根据归属机构和系统获取表list
  matchingChange = val => {
    const { dispatch } = this.props;
    this.setState({ ...val }, () => {
      const { matchingFormechanism, matchingForsystem } = this.state;
      const loginId = getSession('loginId');
      const loginOrgId = getSession('loginOrgId');
      const orgId = loginId === '1' ? matchingFormechanism : loginOrgId;// 非管理员登录，归属机构默认为登录时获取的归属机构
      if (orgId && matchingForsystem) {
        dispatch({
          type: 'productElements/getTableList',
          payload: {
            conditions: [
              { name: 'orgId', operator: 'EQ', value: orgId },
              { name: 'sysId', operator: 'EQ', value: matchingForsystem },
            ],
          },
        }).then(res => {
          this.setState({ surfaceList: res || [] });
        });
      }
    });
  };

  // 匹配操作
  matching = record => {
    this.setState({
      relationVisible: true,
      relationType: 'matching',
      activeRecordForMate: record,
    });
  };

  // 删除操作
  delMatch = record => {
    const { listForMate } = this.state;
    const list = listForMate.filter(item => item.busiId !== record.busiId);
    this.setState({ listForMate: list });
  };

  // 一键匹配
  oneKeyMatch = () => {
    const { listForMate } = this.state;
    const { dispatch } = this.props;
    this.setState({ mateLoading: true });
    dispatch({
      type: 'productElements/oneKeyMatch',
      payload: listForMate,
    }).then(res => {
      this.setState({ mateLoading: false, mateVisible: false }, () => {
        this.getBusinessList();
      });
    });
  };

  // 关闭 匹配结果 弹窗
  mateCancel = () => {
    this.setState({ mateVisible: false });
  };

  // 获取 select 下啦数据
  getDropDownData = () => {
    this.props
      .dispatch({
        type: 'dataSource/getDropdownData',
        payload: {
          codeList:
            'plmIndustry,plmSysPEElementChangeWay,plmSysPEDataPushSystem,plmSysPEScene,plmSysPEDataSource,columnAuthType,plmSysPEDataSubject,attributionSystem,plmSysPESubjectTopCategory,plmSysPESubjectSecondCategory,plmSysPESubjectThirdCategory,plmSysPEBusinessScenario,plmSysPEBusinessClassification,plmSysPEDataGrading',
        },
      })
      .then(res => {
        if (res) {
          this.setState({
            dropDownData: res,
            dataLevelList: res?.plmSysPEDataGrading.sort((a, b) => a.code - b.code),
          });
        }
      });
  };

  /**
   * 产品要素-表结构 - 列表查询接口
   * @param {Number} current 页码
   * @param {Number} pageSize 条数
   * @param {String} fuzzyData 模糊查询字段
   * @param {Object} sortData  排序
   * @param {Object} searchData  条件查询参数
   * @param {Array} fuzzArr  精准查询中采用模糊查询方式的数组
   * @returns
   */

  // 获取所有机构
  getOrgData = () => {
    this.props
      .dispatch({
        type: 'dataSource/getOrgData',
        payload: { isOut: true, pageNum: 1, pageSize: 9999 },
      })
      .then(res => {
        if (res) {
          this.setState({ orgData: res });
        }
      });
  };

  beforeUpload = file => {
    const isLt100M = file.size / 1024 / 1024 < 100;
    if (!isLt100M) {
      message.warn('文件不能大于100M!');
    }
    return isLt100M;
  };

  uploadChange = info => {
    if (info.file.status === 'uploading') {
      this.setState({ uploadBtnLoading: true });
    }
    if (info.file.status === 'done') {
      if (info?.file?.response?.status === 200) {
        message.success(`${info.file.name} 导入成功`);
        this.getBusinessList();
      } else {
        message.warn(`${info.file.response.message}`);
      }
      this.setState({ uploadBtnLoading: false });
    }
    if (info.file.status === 'error') {
      message.warn(`${info.file.name} 导入失败，请稍后再试`);
      this.setState({ uploadBtnLoading: false });
    }
  };

  beforeUploadForMove = file => {
    const isLt100M = file.size / 1024 / 1024 < 100;
    if (!isLt100M) {
      message.warn('文件不能大于100M!');
    }
    return isLt100M;
  };

  uploadChangeForMove = info => {
    if (info.file.status === 'uploading') {
      this.setState({ uploadBtnLoadingForMove: true });
    }
    if (info.file.status === 'done') {
      if (info?.file?.response?.status === 200) {
        message.success(`${info.file.name} 迁入成功`);
        this.getBusinessList();
      } else {
        message.warn(`${info.file.response.message}`);
      }
      this.setState({ uploadBtnLoadingForMove: false });
    }
    if (info.file.status === 'error') {
      message.warn(`${info.file.name} 迁入失败，请稍后再试`);
      this.setState({ uploadBtnLoadingForMove: false });
    }
  };

  handleOpenConditions = () => {
    const { isForm } = this.state;
    this.setState({ isForm: !isForm });
  };

  resetFormEle = () => {
    this.props.form.resetFields(['masterTableName', 'columnName']);
  };

  componentDidMount() {
    const proEleListObj = JSON.parse(sessionStorage.getItem('proEleListObj'));
    if (proEleListObj && proEleListObj.activeKey) {
      this.setState({ activeKey: proEleListObj.activeKey }, () => {
        this.getDropDownData();
        this.getOrgData();
        this.getBusinessList();
      });
    } else {
      this.getDropDownData();
      this.getOrgData();
      this.getBusinessList();
    }
  }

  render() {
    const {
      isForm,
      loading,
      activeKey,
      relationVisible,
      relationLoading,
      relationBtn,
      mateVisible,
      mateLoading,
      selectedRowKeys,
      selectedRows,
      uploadBtnLoading,
      current,
      pageSize,
      total,
      listData,
      relationListData,
      listForMate,
      mateSuccess,
      mateFail,
      listForStructure,
      dropDownData,
      orgData,
      isShowBtn,
      queryData,
      visibleForselectMatching,
      dataLevelList,
      activeRecord,
      activeRecordForMate,
      surfaceList,
      visibleForEmigration,
      uploadBtnLoadingForMove
    } = this.state;

    const loginOrgId = getSession('loginOrgId');
    const loginId = getSession('loginId');

    const { getFieldDecorator, resetFields } = this.props.form;
    // 关于是否的下拉数据
    const option = [
      { name: '是', code: '1' },
      { name: '否', code: '0' },
    ];
    const formItemLayout = {
      labelCol: { span: 10 },
      wrapperCol: { span: 14 },
    };
    const formItemLayout2 = {
      labelCol: { span: 5 },
      wrapperCol: { span: 19 },
    };

    // 产品要素-业务 条件查询参数
    const formItemData = [
      {
        name: 'industry',
        label: '所属行业',
        type: 'select',
        readSet: { name: 'name', code: 'code' },
        option: dropDownData?.plmIndustry || [],
        config: { mode: 'multiple' },
      },
      {
        name: 'orgId',
        label: '归属机构',
        type: 'select',
        readSet: { name: 'orgName', code: 'id' },
        initialValue: loginId === '1' ? undefined : loginOrgId,// 非超级管理员登录，默认为登录时的归属机构
        disabled: loginId === '1' ? false : true,
        option: orgData || [],
      },
      {
        name: 'sysId',
        label: '归属系统',
        type: 'select',
        readSet: { name: 'name', code: 'code' },
        option: dropDownData?.attributionSystem || [],
      },
      {
        name: 'dataSubject',
        label: '数据主体',
        type: 'select',
        readSet: { name: 'name', code: 'code' },
        option: dropDownData?.plmSysPEDataSubject || [],
      },
      {
        name: 'dataThemeLevelOne',
        label: '一级分类',
        type: 'select',
        readSet: { name: 'name', code: 'code' },
        option: dropDownData?.plmSysPESubjectTopCategory || [],
      },
      {
        name: 'dataThemeLevelTwo',
        label: '二级分类',
        type: 'select',
        readSet: { name: 'name', code: 'code' },
        option: dropDownData?.plmSysPESubjectSecondCategory || [],
      },
      {
        name: 'dataThemeLevelThree',
        label: '三级分类',
        type: 'select',
        readSet: { name: 'name', code: 'code' },
        option: dropDownData?.plmSysPESubjectThirdCategory || [],
      },
      {
        name: 'bizScene',
        label: '业务场景',
        type: 'select',
        readSet: { name: 'name', code: 'code' },
        option: dropDownData?.plmSysPEBusinessScenario || [],
      },
      {
        name: 'bizClass',
        label: '业务分类',
        type: 'select',
        readSet: { name: 'name', code: 'code' },
        option: dropDownData?.plmSysPEBusinessClassification || [],
      },
      {
        name: 'attributeName',
        label: '英文业务属性',
      },
      {
        name: 'bizDataName',
        label: '中文业务属性',
      },
      {
        name: 'dataLevel',
        label: '数据分级',
        type: 'select',
        readSet: { name: 'name', code: 'code' },
        option: dataLevelList,
      },
      {
        name: 'systemLevel',
        label: '系统级别字段',
        type: 'select',
        readSet: { name: 'name', code: 'code' },
        option: [
          { code: 1, name: '是' },
          { code: 0, name: '否' },
        ],
      },
    ];

    // 产品要素 Columns
    const businessColumns = [
      {
        title: '序号',
        dataIndex: 'id',
        key: 'id',
        width: 70,
        fixed: 'left',
        align: 'center',
        render: (text, record, index) => `${index + 1 + (current - 1) * pageSize}`,
      },
      {
        title: '英文业务属性',
        dataIndex: 'attributeName',
        key: 'attributeName',
        ...tableRowConfig,
        sorter: false,
      },
      {
        title: '中文业务属性',
        dataIndex: 'bizDataName',
        key: 'bizDataName',
        ...tableRowConfig,
        sorter: false,
      },
      {
        title: '组件类型',
        dataIndex: 'widgetType',
        key: 'widgetType',
        sorter: false,
        ellipsis: true,
        width: 200,
        render: text => {
          return (
            <Tooltip title={exChangeWidgetType(text)}>
              {text ? exChangeWidgetType(text) : '-'}
            </Tooltip>
          );
        },
      },
      {
        title: '服务通用地址',
        dataIndex: 'commInterface',
        key: 'commInterface',
        ...tableRowConfig,
        sorter: false,
      },
      {
        title: '字典英文名称',
        dataIndex: 'dicItemCode',
        key: 'dicItemCode',
        ...tableRowConfig,
        sorter: false,
      },
      {
        title: '字典中文名称',
        dataIndex: 'dicItem',
        key: 'dicItem',
        ...tableRowConfig,
        sorter: false,
      },
      {
        title: '所属行业',
        dataIndex: 'industry',
        key: 'industry',
        ...tableRowConfig,
        sorter: false,
        render: text => {
          const _text = dropDownData?.plmIndustry?.filter(item => item.code === text) || [];
          let industryText = '';
          _text.forEach(item => {
            industryText += item.name;
          });
          return eutrapelia(industryText);
        },
      },
      {
        title: '归属机构',
        dataIndex: 'orgId',
        key: 'orgId',
        ...tableRowConfig,
        sorter: false,
        render: text => {
          const _text = orgData?.filter(item => item.id === text) || [];
          return eutrapelia(_text[0]?.orgName);
        },
      },
      {
        title: '归属系统',
        dataIndex: 'sysId',
        key: 'sysId',
        ...tableRowConfig,
        sorter: false,
        render: text => {
          const _text = dropDownData?.attributionSystem?.filter(item => item.code === text) || [];
          return eutrapelia(_text[0]?.name);
        },
      },
      {
        title: '数据分级',
        dataIndex: 'dataLevel',
        key: 'dataLevel',
        ...tableRowConfig,
        sorter: false,
        width: 100,
        render: text => {
          const _text = dropDownData?.plmSysPEDataGrading?.filter(item => item.code === text) || [];
          return eutrapelia(_text[0]?.name);
        },
      },
      {
        title: '数据主体',
        dataIndex: 'dataSubject',
        key: 'dataSubject',
        ...tableRowConfig,
        sorter: false,
        render: text => {
          const _text = dropDownData?.plmSysPEDataSubject?.filter(item => item.code === text) || [];
          return eutrapelia(_text[0]?.name);
        },
      },
      {
        title: '一级分类',
        dataIndex: 'dataThemeLevelOne',
        key: 'dataThemeLevelOne',
        ...tableRowConfig,
        sorter: false,
        render: text => {
          const _text =
            dropDownData?.plmSysPESubjectTopCategory?.filter(item => item.code === text) || [];
          return eutrapelia(_text[0]?.name);
        },
      },
      {
        title: '二级分类',
        dataIndex: 'dataThemeLevelTwo',
        key: 'dataThemeLevelTwo',
        ...tableRowConfig,
        sorter: false,
        render: text => {
          const _text =
            dropDownData?.plmSysPESubjectSecondCategory?.filter(item => item.code === text) || [];
          return eutrapelia(_text[0]?.name);
        },
      },
      {
        title: '三级分类',
        dataIndex: 'dataThemeLevelThree',
        key: 'dataThemeLevelThree',
        ...tableRowConfig,
        sorter: false,
        render: text => {
          const _text =
            dropDownData?.plmSysPESubjectThirdCategory?.filter(item => item.code === text) || [];
          return eutrapelia(_text[0]?.name);
        },
      },
      {
        title: '业务场景',
        dataIndex: 'bizScene',
        key: 'bizScene',
        ...tableRowConfig,
        sorter: false,
        render: text => {
          const _text =
            dropDownData?.plmSysPEBusinessScenario?.filter(item => item.code === text) || [];
          return eutrapelia(_text[0]?.name);
        },
      },
      {
        title: '业务分类',
        dataIndex: 'bizClass',
        key: 'bizClass',
        ...tableRowConfig,
        sorter: false,
        render: text => {
          const _text =
            dropDownData?.plmSysPEBusinessClassification?.filter(item => item.code === text) || [];
          return eutrapelia(_text[0]?.name);
        },
      },
      {
        title: '要素变更方式',
        dataIndex: 'elementChangeType',
        key: 'elementChangeType',
        ...tableRowConfig,
        sorter: false,
        render: text => {
          const _text =
            dropDownData?.plmSysPEElementChangeWay?.filter(item => item.code === text) || [];
          return eutrapelia(_text[0]?.name);
        },
      },
      {
        title: '是否为系统级别字段',
        dataIndex: 'systemLevel',
        key: 'systemLevel',
        ...tableRowConfig,
        sorter: false,
        render: text => {
          const _text = option.filter(item => item.code === text) || [];
          return eutrapelia(_text[0]?.name);
        },
      },
      {
        title: '排序',
        dataIndex: 'sort',
        key: 'sort',
        ...tableRowConfig,
        sorter: false,
      },
      {
        title: '数据来源',
        dataIndex: 'source',
        key: 'source',
        ...tableRowConfig,
        sorter: false,
        render: text => {
          const _text = dropDownData?.plmSysPEDataSource?.filter(item => item.code === text) || [];
          return eutrapelia(_text[0]?.name);
        },
      },
      {
        title: '数据推送(系统)',
        dataIndex: 'pushSystem',
        key: 'pushSystem',
        ...tableRowConfig,
        sorter: false,
        render: text => {
          const _text =
            dropDownData?.plmSysPEDataPushSystem?.filter(item => item.code === text) || [];
          return eutrapelia(_text[0]?.name);
        },
      },
      {
        title: '数据推送(场景)',
        dataIndex: 'pushScene',
        key: 'pushScene',
        ...tableRowConfig,
        sorter: false,
        render: text => {
          const _text = dropDownData?.plmSysPEScene?.filter(item => item.code === text) || [];
          return eutrapelia(_text[0]?.name);
        },
      },
      {
        title: '默认值',
        dataIndex: 'defaultValue',
        key: 'defaultValue',
        ...tableRowConfig,
        sorter: false,
      },
      {
        title: '说明',
        dataIndex: 'description',
        key: 'description',
        ...tableRowConfig,
        sorter: false,
      },
      { title: '提示语', dataIndex: 'tip', key: 'tip', ...tableRowConfig, sorter: false },
      {
        title: '关联表',
        dataIndex: 'tableName',
        key: 'tableName',
        fixed: 'right',
        ...tableRowConfig,
        sorter: false,
      },
      {
        title: '字段名',
        dataIndex: 'columnName',
        key: 'columnName',
        fixed: 'right',
        ...tableRowConfig,
        sorter: false,
      },
      {
        title: '操作',
        align: 'center',
        fixed: 'right',
        ...tableRowConfig,
        sorter: false,
        width: 230,
        render: (text, record, index) => (
          <span>
            <a onClick={() => this.jumpDetail(record)}>查看</a>
            <Divider type="vertical" />
            <a onClick={() => this.jumpAdd({ flag: 'businessUpdate', ...record })}>修改</a>
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
            {activeKey === 'structure' && (
              <>
                <Divider type="vertical" />
                <a onClick={() => this.setRelationModal(record)}>关联管理</a>
              </>
            )}
          </span>
        ),
      },
    ];

    // 产品要素-表结构 条件查询参数
    const formItemDataForStructure = [
      {
        name: 'masterTableName',
        label: '表名',
      },
      {
        name: 'columnName',
        label: '数据库字段名',
      },
      {
        name: 'required',
        label: '必输项',
        type: 'select',
        readSet: { name: 'name', code: 'code' },
        option: option,
      },
      {
        name: 'extended',
        label: '是否为扩展字段',
        type: 'select',
        readSet: { name: 'name', code: 'code' },
        option: option,
      },
      {
        name: 'systemLevel',
        label: '是否为系统级别字段',
        type: 'select',
        readSet: { name: 'name', code: 'code' },
        option: option,
      },
    ];

    // 产品要素-表结构 Columns 
    const structureColumns = [
      {
        title: '序号',
        dataIndex: 'id',
        key: 'id',
        width: 90,
        fixed: 'left',
        align: 'center',
        render: (text, record, index) => `${index + 1 + (current - 1) * pageSize}`,
      },
      {
        title: '表名',
        dataIndex: 'masterTableName',
        key: 'masterTableName',
        fixed: 'left',
        ...tableRowConfig,
        sorter: false,
      },
      {
        title: '数据库字段名',
        dataIndex: 'columnName',
        key: 'columnName',
        ...tableRowConfig,
        sorter: false,
      },
      {
        title: '数据库字段类型',
        dataIndex: 'columnType',
        key: 'columnType',
        ...tableRowConfig,
        sorter: false,
      },
      {
        title: '必输项',
        dataIndex: 'required',
        key: 'required',
        ...tableRowConfig,
        sorter: false,
        render: (text, record, index) => {
          let active = option.filter(item => item.code === text) || [];
          return eutrapelia(active[0]?.name);
        },
      },
      { title: '精度', dataIndex: 'precision', key: 'precision', ...tableRowConfig, sorter: false },
      {
        title: '是否为扩展字段',
        dataIndex: 'extended',
        key: 'extended',
        ...tableRowConfig,
        sorter: false,
        render: (text, record, index) => {
          let active = option.filter(item => item.code === text) || [];
          return eutrapelia(active[0]?.name);
        },
      },
      {
        title: '权限校验类型',
        dataIndex: 'authType',
        key: 'authType',
        ...tableRowConfig,
        sorter: false,
        render: (text, record, index) => {
          let active = dropDownData?.columnAuthType.filter(item => item.code == text) || [];
          return eutrapelia(active[0]?.name);
        },
      },
      {
        title: '是否为系统级别字段',
        dataIndex: 'systemLevel',
        key: 'systemLevel',
        ...tableRowConfig,
        sorter: false,
        render: (text, record, index) => {
          let active = option.filter(item => +item.code === text) || [];
          return eutrapelia(active[0]?.name);
        },
      },
      {
        title: '关联业务数据',
        dataIndex: 'bizName',
        key: 'bizName',
        ...tableRowConfig,
        sorter: false,
      },
      // {
      //   title: '操作',
      //   align: 'center',
      //   fixed: 'right',
      //   width: 300,
      //   render: (text, record) => (
      //     <span>
      //       <a onClick={() => this.jumpDetail(record)}>查看</a>
      //       <Divider type="vertical" />
      //       <a onClick={() => this.jumpAdd({ flag: 'structureUpdate', ...record })}>修改</a>
      //       <Divider type="vertical" />
      //       <Popconfirm
      //         placement="topRight"
      //         title={'确认删除此条数据么？'}
      //         onConfirm={() => this.del(record)}
      //         okText="确定"
      //         cancelText="取消"
      //       >
      //         <a>删除</a>
      //       </Popconfirm>
      //     </span>
      //   ),
      // },
    ];

    // 关联管理 Columns
    const relationColumns = [
      {
        title: '序号',
        dataIndex: 'id',
        key: 'id',
        width: 100,
        fixed: 'left',
        align: 'center',
        render: (text, record, index) => `${index + 1}`,
      },
      {
        title: '表名称',
        dataIndex: 'masterTableName',
        key: 'masterTableName',
        ...tableRowConfig,
        sorter: false,
      },
      {
        title: '数据库字段名',
        dataIndex: 'columnName',
        key: 'columnName',
        ...tableRowConfig,
        sorter: false,
      },
      {
        title: '字段说明',
        dataIndex: 'columnNameDesc',
        key: 'columnNameDesc',
        ...tableRowConfig,
        sorter: false,
      },
      {
        title: '数据库字段类型',
        dataIndex: 'columnType',
        key: 'columnType',
        ...tableRowConfig,
        sorter: false,
      },
      {
        title: '必输项',
        dataIndex: 'required',
        key: 'required',
        ...tableRowConfig,
        sorter: false,
        render: (text, record, index) => {
          let active = option.filter(item => item.code === text) || [];
          return eutrapelia(active[0]?.name);
        },
      },
      {
        title: '精度',
        dataIndex: 'precision',
        key: 'precision',
        ...tableRowConfig,
        sorter: false,
      },
      {
        title: '是否为扩展字段',
        dataIndex: 'extended',
        key: 'extended',
        ...tableRowConfig,
        sorter: false,
        render: (text, record, index) => {
          let active = option.filter(item => +item.code === +text) || [];
          return eutrapelia(active[0]?.name);
        },
      },
      {
        title: '权限校验类型',
        dataIndex: 'authType',
        key: 'authType',
        ...tableRowConfig,
        sorter: false,
      },
      {
        title: '是否为系统级别字段',
        dataIndex: 'systemLevel',
        key: 'systemLevel',
        ...tableRowConfig,
        sorter: false,
        render: (text, record, index) => {
          let active = option.filter(item => +item.code === +text) || [];
          return eutrapelia(active[0]?.name);
        },
      },
      {
        title: '归属机构',
        dataIndex: 'orgId',
        key: 'orgId',
        ...tableRowConfig,
        sorter: false,
        render: text => {
          const _text = orgData?.filter(item => item.id === text) || [];
          return eutrapelia(_text[0]?.orgName);
        },
      },
      {
        title: '归属系统',
        dataIndex: 'sysId',
        key: 'sysId',
        ...tableRowConfig,
        sorter: false,
        render: text => {
          const _text = dropDownData?.attributionSystem?.filter(item => item.code === text) || [];
          return eutrapelia(_text[0]?.name);
        },
      },
    ];

    // 一键匹配 Columns
    const mateColumns = [
      {
        title: '序号',
        dataIndex: 'id',
        key: 'id',
        width: 90,
        fixed: 'left',
        align: 'center',
        render: (text, record, index) => `${index + 1}`,
      },
      {
        title: '中文业务属性',
        dataIndex: 'bizDataName',
        key: 'bizDataName',
        ...tableRowConfig,
        sorter: false,
      },
      {
        title: '英文业务属性',
        dataIndex: 'attributeName',
        key: 'attributeName',
        ...tableRowConfig,
        sorter: false,
      },
      {
        title: '数据分级',
        dataIndex: 'dataLevel',
        key: 'dataLevel',
        ...tableRowConfig,
        sorter: false,
        width: 100,
        render: text => {
          const _text = dropDownData?.plmSysPEDataGrading?.filter(item => item.code === text) || [];
          return eutrapelia(_text[0]?.name);
        },
      },
      {
        title: '数据主体',
        dataIndex: 'dataSubject',
        key: 'dataSubject',
        ...tableRowConfig,
        sorter: false,
        render: text => {
          const _text = dropDownData?.plmSysPEDataSubject?.filter(item => item.code === text) || [];
          return eutrapelia(_text[0]?.name);
        },
      },
      {
        title: '一级分类',
        dataIndex: 'dataThemeLevelOne',
        key: 'dataThemeLevelOne',
        ...tableRowConfig,
        sorter: false,
        render: text => {
          const _text =
            dropDownData?.plmSysPESubjectTopCategory?.filter(item => item.code === text) || [];
          return eutrapelia(_text[0]?.name);
        },
      },
      {
        title: '二级分类',
        dataIndex: 'dataThemeLevelTwo',
        key: 'dataThemeLevelTwo',
        ...tableRowConfig,
        sorter: false,
        render: text => {
          const _text =
            dropDownData?.plmSysPESubjectSecondCategory?.filter(item => item.code === text) || [];
          return eutrapelia(_text[0]?.name);
        },
      },
      {
        title: '三级分类',
        dataIndex: 'dataThemeLevelThree',
        key: 'dataThemeLevelThree',
        ...tableRowConfig,
        sorter: false,
        render: text => {
          const _text =
            dropDownData?.plmSysPESubjectThirdCategory?.filter(item => item.code === text) || [];
          return eutrapelia(_text[0]?.name);
        },
      },
      {
        title: '业务场景',
        dataIndex: 'bizScene',
        key: 'bizScene',
        ...tableRowConfig,
        sorter: false,
        render: text => {
          const _text =
            dropDownData?.plmSysPEBusinessScenario?.filter(item => item.code === text) || [];
          return eutrapelia(_text[0]?.name);
        },
      },
      {
        title: '业务分类',
        dataIndex: 'bizClass',
        key: 'bizClass',
        ...tableRowConfig,
        sorter: false,
        render: text => {
          const _text =
            dropDownData?.plmSysPEBusinessClassification?.filter(item => item.code === text) || [];
          return eutrapelia(_text[0]?.name);
        },
      },
      {
        title: '要素变更方式',
        dataIndex: 'elementChangeType',
        key: 'elementChangeType',
        ...tableRowConfig,
        sorter: false,
        render: text => {
          const _text =
            dropDownData?.plmSysPEElementChangeWay?.filter(item => item.code === text) || [];
          return eutrapelia(_text[0]?.name);
        },
      },
      {
        title: '是否为系统级别字段',
        dataIndex: 'systemLevel',
        key: 'systemLevel',
        ...tableRowConfig,
        sorter: false,
        render: text => {
          const _text = option.filter(item => +item.code === text) || [];
          return eutrapelia(_text[0]?.name);
        },
      },
      {
        title: '排序',
        dataIndex: 'sort',
        key: 'sort',
        ...tableRowConfig,
        sorter: false,
      },
      {
        title: '数据来源',
        dataIndex: 'source',
        key: 'source',
        ...tableRowConfig,
        sorter: false,
        render: text => {
          const _text = dropDownData?.plmSysPEDataSource?.filter(item => item.code === text) || [];
          return eutrapelia(_text[0]?.name);
        },
      },
      {
        title: '数据推送(系统)',
        dataIndex: 'pushSystem',
        key: 'pushSystem',
        ...tableRowConfig,
        sorter: false,
        render: text => {
          const _text =
            dropDownData?.plmSysPEDataPushSystem?.filter(item => item.code === text) || [];
          return eutrapelia(_text[0]?.name);
        },
      },
      {
        title: '数据推送(场景)',
        dataIndex: 'pushScene',
        key: 'pushScene',
        ...tableRowConfig,
        sorter: false,
        render: text => {
          const _text = dropDownData?.plmSysPEScene?.filter(item => item.code === text) || [];
          return eutrapelia(_text[0]?.name);
        },
      },
      {
        title: '默认值',
        dataIndex: 'defaultValue',
        key: 'defaultValue',
        ...tableRowConfig,
        sorter: false,
      },
      {
        title: '字典中文名称',
        dataIndex: 'dicItem',
        key: 'dicItem',
        ...tableRowConfig,
        sorter: false,
      },
      {
        title: '字典英文名称',
        dataIndex: 'dicItemCode',
        key: 'dicItemCode',
        ...tableRowConfig,
        sorter: false,
      },
      {
        title: '说明',
        dataIndex: 'description',
        key: 'description',
        ...tableRowConfig,
        sorter: false,
      },
      { title: '提示语', dataIndex: 'tip', key: 'tip', ...tableRowConfig, sorter: false },
      {
        title: '归属机构',
        dataIndex: 'orgId',
        key: 'orgId',
        ...tableRowConfig,
        sorter: false,
        render: text => {
          const _text = orgData?.filter(item => item.id === text) || [];
          return eutrapelia(_text[0]?.orgName);
        },
      },
      {
        title: '归属系统',
        dataIndex: 'sysId',
        key: 'sysId',
        ...tableRowConfig,
        sorter: false,
        render: text => {
          const _text = dropDownData?.attributionSystem?.filter(item => item.code === text) || [];
          return eutrapelia(_text[0]?.name);
        },
      },
      {
        title: '匹配结果',
        dataIndex: 'matchResult',
        key: 'matchResult',
        fixed: 'right',
        ...tableRowConfig,
        sorter: false,
        width: 100,
        render: (text, record) => {
          return text === '0' ? '失败' : '成功';
        },
      },
      {
        title: '关联表',
        dataIndex: 'masterTableName',
        key: 'masterTableName',
        fixed: 'right',
        ...tableRowConfig,
        sorter: false,
        width: 100,
      },
      {
        title: '字段名',
        dataIndex: 'columnName',
        key: 'columnName',
        fixed: 'right',
        width: 150,
      },
      {
        title: '操作',
        dataIndex: '',
        key: '',
        fixed: 'right',
        align: 'center',
        ...tableRowConfig,
        sorter: false,
        width: 100,
        render: (record) => (
          <span>
            <a
              onClick={() => {
                this.matching(record);
              }}
            >
              {record.matchResult === '0' ? '匹配' : '修改'}
            </a>
            <Divider type="vertical" />
            <a
              onClick={() => {
                this.delMatch(record);
              }}
            >
              删除
            </a>
          </span>
        ),
      },
    ];

    const layout = {
      labelAlign: 'right',
      labelCol: { span: 8 },
      wrapperCol: { span: 16 },
    };

    const relationRowSelection = {
      onChange: (selectedRowKeys, selectedRows) => {
        this.setState({
          activeRecordForRelation: selectedRows[0],
          selectedRowKeys,
          selectedRows,
          relationBtn: selectedRows.length > 0,
        });
      },
      type: 'radio',
    };

    // 业务列表 checkbox
    const rowSelectionForBusiness = {
      onChange: (selectedRowKeys, selectedRows) => {
        this.setState({ queryData: selectedRowKeys, activeRecord: selectedRows });
        if (selectedRows.length) {
          this.setState({ isShowBtn: false });
        } else {
          this.setState({ isShowBtn: true });
        }
      },
      selectedRowKeys: queryData,
      type: 'checkbox',
    };

    const uploadContractProps = {
      action: '/ams/yss-product-element/productElementBiz/importBiz',
      name: 'file',
      headers: {
        Token: getAuthToken(),
      },
    };

    const uploadContractPropsForMove = {
      action: '/ams/yss-product-element/productElementBiz/immigration',
      name: 'file',
      headers: {
        Token: getAuthToken()
      },
    };

    const menu = (
      <Menu onClick={this.exportData}>
        <Menu.Item key="items" disabled={isShowBtn}>
          导出所选项
        </Menu.Item>
        <Menu.Item key="all">导出全量</Menu.Item>
      </Menu>
    );

    // 表头按钮相关
    const operations = (
      <div style={{ marginTop: '-6px' }}>
        <Button style={{ marginRight: 8 }} onClick={this.emigration}>
          迁出
        </Button>
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
            迁入
          </Button>
        </Upload>

        {activeKey === 'structure' && (
          <Button
            style={{ marginRight: 8 }}
            onClick={() => this.setState({ visibleForselectMatching: true })}
          >
            一键匹配
          </Button>
        )}
        <Dropdown overlay={menu}>
          <Button style={{ marginRight: 8 }}>
            导出 <DownOutlined />
          </Button>
        </Dropdown>
        <Upload
          {...uploadContractProps}
          accept=".xlsx,.xls"
          onChange={this.uploadChange}
          beforeUpload={this.beforeUpload}
          showUploadList={false}
        >
          <Button loading={uploadBtnLoading} disabled={uploadBtnLoading} style={{ marginRight: 8 }}>
            导入
          </Button>
        </Upload>
        <Button
          type="primary"
          style={{ marginRight: 8 }}
          onClick={() => this.jumpAdd({ flag: `businessAdd` })}
        >
          新增
        </Button>
      </div>
    );

    return (
      <>
        <List
          title={false}
          searchInputWidth="300"
          fuzzySearch={val => this.search(val)}
          customLayout={{
            labelAlign: 'right',
            labelCol: { span: 10 },
            wrapperCol: { span: 14 },
          }}
          // formItemData={activeKey === 'business' ? formItemData : formItemDataForStructure}
          formItemData={formItemData}
          advancSearch={val => this.searchForBusiness(val)}
          searchPlaceholder={`请输入`}
          resetFn={this.handleReset}
          tabs={{
            tabList: [
              { key: 'business', tab: '产品要素-业务' },
              { key: 'structure', tab: '产品要素-表结构' },
            ],
            activeTabKey: activeKey,
            onTabChange: this.handleTabChange,
          }}
          extra={operations}
          tableList={
            <>
              {activeKey === 'business' && (
                <Table
                  rowKey="id"
                  dataSource={listData}
                  columns={[
                    ...businessColumns.splice(0, 25),// businessColumns 中需求变更：增加两列【组件类型、服务通用地址】，故 23 --> 25，防止丢失原有展示列
                    {
                      title: '操作',
                      align: 'center',
                      fixed: 'right',
                      ...tableRowConfig,
                      sorter: false,
                      width: 230,
                      render: (text, record, index) => (
                        <span>
                          <a onClick={() => this.jumpDetail(record)}>查看</a>
                          <Divider type="vertical" />
                          <a onClick={() => this.jumpAdd({ flag: 'businessUpdate', ...record })}>
                            修改
                          </a>
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
                      ),
                    },
                  ]}
                  loading={loading}
                  scroll={{ x: businessColumns.length * 200 - 100, y: 590 }}
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
                  rowSelection={rowSelectionForBusiness}
                />
              )}
              {activeKey === 'structure' && (
                <Table
                  rowKey="id"
                  dataSource={listData}
                  columns={businessColumns}
                  loading={loading}
                  scroll={{ x: businessColumns.length * 200 - 100, y: 590 }}
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
                  rowSelection={rowSelectionForBusiness}
                />
              )}
            </>
          }
          loginId={loginId}
        />
        {/* 迁出 */}
        <Modal
          title="迁出数据"
          visible={visibleForEmigration}
          onOk={this.handleModeForEmigration}
          onCancel={this.handleCancel}
        >
          <Form>
            <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
              <Col md={21}>
                <FormItem label="归属机构:" {...formItemLayout}>
                  {getFieldDecorator('orgId', {
                    rules: [{ required: true, message: '请选择归属机构' }],
                    initialValue: loginId === '1' ? undefined : loginOrgId
                  })(
                    <Select placeholder="请选择归属机构" disabled={loginId === '1' ? false : true} showSearch optionFilterProp="children">
                      {orgData.length > 0 &&
                        orgData.map(item => (
                          <Option key={item.id} value={item.id} title={item.orgName}>
                            {item.orgName}
                          </Option>
                        ))}
                    </Select>,
                  )}
                </FormItem>
              </Col>
              <Col md={21}>
                <FormItem label="归属系统:" {...formItemLayout}>
                  {getFieldDecorator('sysId', {
                    rules: [{ required: true, message: '请选择归属系统' }],
                  })(
                    <Select placeholder="请选择归属系统" showSearch optionFilterProp="children">
                      {dropDownData?.attributionSystem?.length > 0 &&
                        dropDownData.attributionSystem.map(item => (
                          <Option key={item.code} value={item.code} title={item.name}>
                            {item.name}
                          </Option>
                        ))}
                    </Select>,
                  )}
                </FormItem>
              </Col>
            </Row>
          </Form>
        </Modal>
        {/* 一键匹配 匹配项弹窗 */}
        <Modal
          title="匹配项"
          visible={visibleForselectMatching}
          onOk={this.handleModeForMatching}
          onCancel={() => {
            this.setState({
              visibleForselectMatching: false,
              matchingFormechanism: '',
              matchingForsystem: '',
            });
            resetFields();
          }}
          width={900}
        >
          <Form>
            <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
              <Col md={12}>
                <FormItem label="归属机构:" {...formItemLayout}>
                  {getFieldDecorator('orgId', {
                    initialValue: loginId === '1' ? undefined : loginOrgId,
                    rules: [{ required: true, message: '请选择归属机构' }],
                  })(
                    <Select
                      placeholder="请选择归属机构"
                      disabled={loginId === '1' ? false : true}
                      showSearch
                      optionFilterProp="children"
                      onChange={val => {
                        this.matchingChange({ matchingFormechanism: val });
                      }}
                    >
                      {orgData.length > 0 &&
                        orgData.map(item => (
                          <Option key={item.id} value={item.id} title={item.orgName}>
                            {item.orgName}
                          </Option>
                        ))}
                    </Select>,
                  )}
                </FormItem>
              </Col>
              <Col md={12}>
                <FormItem label="归属系统:" {...formItemLayout}>
                  {getFieldDecorator('sysId', {
                    rules: [{ required: true, message: '请选择归属系统' }],
                  })(
                    <Select
                      placeholder="请选择归属系统"
                      showSearch
                      optionFilterProp="children"
                      onChange={val => {
                        this.matchingChange({ matchingForsystem: val });
                      }}
                    >
                      {dropDownData?.attributionSystem?.length > 0 &&
                        dropDownData.attributionSystem.map(item => (
                          <Option key={item.code} value={item.code} title={item.name}>
                            {item.name}
                          </Option>
                        ))}
                    </Select>,
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
              <Col md={12}>
                <FormItem label="系统级别字段:" {...formItemLayout}>
                  {getFieldDecorator('systemLevel')(
                    <Select placeholder="请选择系统级别字段" showSearch optionFilterProp="children">
                      <Option key={1} value={1} title="是">
                        是
                      </Option>
                      <Option key={0} value={0} title="否">
                        否
                      </Option>
                    </Select>,
                  )}
                </FormItem>
              </Col>
              <Col md={12}>
                <FormItem label="业务分类:" {...formItemLayout}>
                  {getFieldDecorator('bizClass')(
                    <Select placeholder="请选择业务分类" showSearch optionFilterProp="children">
                      {dropDownData?.plmSysPEBusinessClassification?.length > 0 &&
                        dropDownData.plmSysPEBusinessClassification.map(item => (
                          <Option key={item.code} value={item.code} title={item.name}>
                            {item.name}
                          </Option>
                        ))}
                    </Select>,
                  )}
                </FormItem>
              </Col>
              <Col md={24}>
                <FormItem label="表名:" {...formItemLayout2}>
                  {getFieldDecorator('tableId')(
                    <Select placeholder="请选择表名" showSearch optionFilterProp="children">
                      {surfaceList.map(item => (
                        <Option key={item.id} value={item.id} title={item.masterTableDesc ? `${item.masterTableName}（${item.masterTableDesc}）` : item.masterTableName}>
                          {item.masterTableDesc ? `${item.masterTableName}（${item.masterTableDesc}）` : item.masterTableName}
                        </Option>
                      ))}
                    </Select>,
                  )}
                </FormItem>
              </Col>
            </Row>
          </Form>
        </Modal>
        {/* 业务要素关联管理 */}
        <Modal
          title={
            <span>
              产品要素关联管理
              <span style={{ marginLeft: 40, fontSize: 12, color: '#8A8E99' }}>
                请选择产品要素结构信息进行关联！
              </span>
            </span>
          }
          visible={relationVisible}
          onOk={null}
          onCancel={this.relationCancel}
          confirmLoading={relationLoading}
          destroyOnClose={true}
          width={1600}
          footer={null}
          zIndex={1001}
        >
          {isForm ? (
            <Row style={{ marginBottom: 10 }}>
              <Col span={16}>
                <Search
                  style={{ height: 32, width: 250 }}
                  placeholder="请输入"
                  onSearch={val => this.relationSearch(val)}
                />
                <span style={{ marginLeft: 23 }}>
                  <a onClick={this.handleOpenConditions} type="text">
                    其他查询条件
                    <Icon type="down" />
                  </a>
                </span>
              </Col>
            </Row>
          ) : (
            <Form {...layout} style={{ marginBottom: 10 }}>
              <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                <Col md={6}>
                  <Form.Item label="归属机构:" {...formItemLayout}>
                    {getFieldDecorator('orgId', {
                      initialValue: activeRecord?.orgId || activeRecordForMate?.orgId, // activeRecordForMate 从匹配结果中，操作-匹配，进入产品要素关联管理，归属机构和归属系统也需要反显
                    })(
                      <Select disabled={true}>
                        {orgData.length > 0 &&
                          orgData.map(item => (
                            <Option key={item.id} value={item.id}>
                              {item.orgName}
                            </Option>
                          ))}
                      </Select>,
                    )}
                  </Form.Item>
                </Col>
                <Col md={6}>
                  <Form.Item label="归属系统:" {...formItemLayout}>
                    {getFieldDecorator('sysId', {
                      initialValue: activeRecord?.sysId || activeRecordForMate?.sysId,
                    })(
                      <Select disabled={true}>
                        {dropDownData?.attributionSystem?.length > 0 &&
                          dropDownData.attributionSystem.map(item => (
                            <Option key={item.code} value={item.code}>
                              {item.name}
                            </Option>
                          ))}
                      </Select>,
                    )}
                  </Form.Item>
                </Col>
                <Col md={6}>
                  <Form.Item label="表名:" {...formItemLayout}>
                    {getFieldDecorator('masterTableName')(<Input placeholder="请填写表名" />)}
                  </Form.Item>
                </Col>
                <Col md={6}>
                  <Form.Item label="字段名:" {...formItemLayout}>
                    {getFieldDecorator('columnName')(<Input placeholder="请填写字段名" />)}
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col style={{ float: 'right' }}>
                  <span>
                    <Button type="primary" onClick={this.conditionsSearch}>
                      查询
                    </Button>
                    <Button style={{ marginLeft: 10 }} onClick={this.resetFormEle}>
                      重置
                    </Button>
                    <a style={{ marginLeft: 23 }} onClick={this.handleOpenConditions}>
                      收起
                      <Icon type="up" />
                    </a>
                  </span>
                </Col>
              </Row>
            </Form>
          )}

          <Table
            size="small"
            dataSource={relationListData}
            columns={relationColumns}
            loading={relationLoading}
            pagination={false}
            rowSelection={relationRowSelection}
            scroll={{ x: relationColumns.length * 200 - 140, y: 500 }}
          />
          <div style={{ marginBottom: 10, marginTop: 20 }}>
            <Row>
              <Col span={24} style={{ marginBottom: 10 }} style={{ textAlign: 'right' }}>
                <span style={{ marginRight: 10 }}>共{relationListData.length}条数据</span>
                <Button style={{ marginRight: 8 }} onClick={this.relationCancel}>
                  取消
                </Button>
                <Button
                  type="primary"
                  style={{ marginRight: 8 }}
                  disabled={!relationBtn}
                  loading={loading}
                  onClick={this.matchCheck}
                >
                  关联
                </Button>
              </Col>
            </Row>
          </div>
        </Modal>
        {/* 匹配结果弹窗 */}
        <Modal
          title="匹配结果"
          visible={mateVisible}
          onOk={null}
          onCancel={this.mateCancel}
          confirmLoading={mateLoading}
          destroyOnClose={true}
          width={1400}
          footer={null}
        >
          <Row>
            <Col md={6} style={{ marginBottom: 20 }}>
              <span style={{ color: '#8A8E99' }}>
                数据匹配成功<span style={{ margin: '0 8px', color: '#50D4AB' }}>{mateSuccess}</span>
                条，失败
                <span style={{ margin: '0 8px', color: '#F66F6A' }}>{mateFail}</span>条
              </span>
            </Col>
          </Row>
          <Table
            size="small"
            dataSource={listForMate}
            columns={mateColumns}
            loading={mateLoading}
            pagination={false}
            scroll={{ x: mateColumns.length * 200 - 500, y: 500 }}
          />
          <div style={{ marginBottom: 10, marginTop: 20 }}>
            <Row>
              <Col span={24} style={{ marginBottom: 10 }} style={{ textAlign: 'right' }}>
                <span style={{ marginRight: 10 }}>共{listForMate.length}条数据</span>
                <Button style={{ marginRight: 8 }} onClick={this.mateCancel}>
                  取消
                </Button>
                <Button
                  style={{ marginRight: 8 }}
                  onClick={() =>
                    this.setState({ mateVisible: false, visibleForselectMatching: true })
                  }
                >
                  重新匹配
                </Button>
                <Button
                  type="primary"
                  style={{ marginRight: 8 }}
                  loading={loading}
                  onClick={this.oneKeyMatch}
                >
                  确定
                </Button>
              </Col>
            </Row>
          </div>
        </Modal>
      </>
    );
  }
}

const WrappedSingleForm = errorBoundary(
  linkHoc()(
    Form.create()(
      connect(({ productElements, dataSource }) => ({ productElements, dataSource }))(Index),
    ),
  ),
);

export default WrappedSingleForm;
