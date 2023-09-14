/**
 * 产品看板
 */
import React, { useEffect, useRef, useState } from 'react';
import { errorBoundary } from '@/layouts/ErrorBoundary';
import Action from '@/utils/hocUtil';
import { connect, routerRedux } from 'dva';
import {
  Button,
  Checkbox,
  Col,
  Form,
  Icon,
  Input,
  message,
  Modal,
  Row,
  Select,
  Tabs,
  Tooltip,
} from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import cloneDeep from 'lodash/cloneDeep';
import styles from './index.less';
import staticInstance from '@/utils/staticInstance';
import { Table } from '@/components';
import List from '@/components/List';

const FormItem = Form.Item;
const { TabPane } = Tabs;
const { confirm } = Modal;

const Index = ({
  dispatch,
  listLoading,
  listLoading1,
  listLoading2,
  listLoading4,
  form: { getFieldDecorator, resetFields, validateFields },
  productBillboard: {
    dicts,
    proTypeDatas,
    productStageData,
    seriesNameData,
    proNameAndCodeData,
    productBillboardInvestmentManagerData,
    productBillboardTableData,
    productBillboardNewTabsData,
    productBillboardNewTableData,
  },
}) => {
  const [tabsShowAndOff, setTabsShowAndOff] = useState(
    staticInstance.getInstance().billboardRadioKey,
  );
  const [tabsKey, setTabsKey] = useState('1');
  const [isKanban, setKanban] = useState(); // 是否展示看板
  const [productOnAndOff, setProductOnAndOff] = useState(false); // 产品类型展开/收起搜索

  // 代码映射相关
  const proCodeLinkData = useRef(''); // 提交时的产品代码
  const codelinkObj = {
    system: '',
    sysProCode: '',
    insProCode: proCodeLinkData.current,
  };
  const [modalShowAndOff, setModalShowAndOff] = useState(false); // 代码映射对话框
  const modalTitle = useRef(''); // 代码映射对话框标题
  const proCodeLinkTableDataRef = useRef([]); // 代码映射数据
  const [proCodeLinkTableData, setProCodeLinkTableData] = useState([]); // 代码映射数据
  // 词汇字典相关
  const codeListData = useRef({}); // 词汇字典键值对集合
  const codeListCodeData = useRef([]); // 词汇字典code集合
  // 产品看板(表格)
  const totalData = useRef(0); // 页码总数
  const dataObj = useRef({}); // 请求参数
  const pageNumData = useRef(1); // 当前页面页数
  const pageSizeData = useRef(10); // 当前页面展示数量
  const proNameData = useRef([]); // 产品全称
  const proCodeData = useRef([]); // 产品代码
  const upstairsSeriesData = useRef([]); // 系列名称
  const proTypeData = useRef([]); // 产品类型
  const investManagerData = useRef([]); // 投资经理
  const proRiskData = useRef([]); // 风险等级
  const proEstablishStartTimeData = useRef(''); // 成立日期开始
  const proEstablishEndTimeData = useRef(''); // 成立日期结束
  const proTerminationStartTimeData = useRef(''); // 结束日期开始
  const proTerminationEndTimeData = useRef(''); // 结束日期结束
  const proStageData = useRef([]); // 产品阶段
  const directionData = useRef(''); // 排序方式
  const fieldData = useRef(''); // 排序依据
  const keyWordsData = useRef(''); // 模糊搜索关键字
  const batchData = useRef([]); // 批量操作参数
  // 系列(父级表格)
  const totalNewData = useRef(0); // 页码总数
  const dataNewObj = useRef({}); // 请求参数
  const pageNumNewData = useRef(1); // 当前页面页数
  const pageSizeNewData = useRef(10); // 当前页面展示数量
  const proNameNewData = useRef([]); // 产品全称
  const proCodeNewData = useRef([]); // 产品代码
  const upstairsSeriesNewData = useRef([]); // 系列名称
  const proTypeNewData = useRef([]); // 产品类型
  const investManagerNewData = useRef([]); // 投资经理
  const proRiskNewData = useRef([]); // 风险等级
  const proStageNewData = useRef([]); // 产品阶段
  const directionNewData = useRef(''); // 排序方式
  const fieldNewData = useRef(''); // 排序依据
  const keyWordsNewData = useRef(); // 模糊搜索关键字
  const batchNewData = useRef([]); // 批量操作参数
  // 系列(子级表格)
  const [expandedRowKeysData, setExpandedRowKeysData] = useState('[]');
  const tableHeight = useRef('');
  const totalNewChildData = useRef(0); // 页码总数
  const dataNewChildObj = useRef({}); // 请求参数
  const pageNumNewChildData = useRef(1); // 当前页面页数
  const pageSizeNewChildData = useRef(10); // 当前页面展示数量
  const proNameNewChildData = useRef([]); // 产品全称
  const proCodeNewChildData = useRef([]); // 产品代码
  const upstairsSeriesNewChildData = useRef([]); // 系列名称
  const proTypeNewChildData = useRef([]); // 产品类型
  const investmentManagerNewChildData = useRef([]); // 投资经理
  const proRiskNewChildData = useRef([]); // 风险等级
  const proStageNewChildData = useRef([]); // 产品阶段
  const directionNewChildData = useRef(''); // 排序方式
  const fieldNewChildData = useRef(''); // 排序依据
  const batchNewChildData = useRef([]); // 批量操作参数

  const proStageTooltip = {
    P002_1:
      '立项阶段：从“产品评审”流程开始，集合产品完成“募集公告”流程截止；单一产品完成“单一投资者资金缴付提取” 流程截止',
    P002_2: '募集阶段：从“募集公告”流程完成开始，到“验资”流程完成截止',
    P002_3: '成立阶段：从“验资”流程完成开始，到“产品成立公告”流程完成截止',
    P002_4:
      '运作阶段：集合产品从“产品成立公告”流程完成开始，单一产品从“单一投资者资金缴付提取” 流程完成开始；到“产品终止”流程完成截止',
    P002_5: '清盘阶段：从“产品终止”流程完成开始，到产品状态为“已清盘”截止',
  };

  /**
   * 更新词汇字典键值对对象
   * @param {Object} res 词汇字典数据源
   */
  const handleUpdateDicts = res => {
    const obj = {};
    const objCodeArr = [];
    if (typeof res !== '{}') {
      for (const key in res) {
        for (const newKey in res[key]) {
          if (typeof res[key][newKey].code !== 'undefined') {
            obj[res[key][newKey].code] = res[key][newKey].name;
            objCodeArr.push(res[key][newKey].code);
          }
        }
      }
    }
    codeListData.current = obj;
    codeListCodeData.current = objCodeArr;
  };

  /**
   * 词汇替换
   * @param {String} val 词汇字典数据源
   */
  const handleUpdateNameValue = val => {
    if (codeListCodeData.current.includes(val)) {
      return codeListData.current[val];
    }
    if (val === '1') {
      return '是';
    }
    if (val === '0') {
      return '否';
    }
    return val;
  };

  /**
   * 更新请求参数(产品看板)
   */
  const handleGetDataObj = () => {
    dataObj.current = {
      pageNum: pageNumData.current, // 当前页
      pageSize: pageSizeData.current, // 页展示量
      proName: proNameData.current, // 产品全称
      proCode: proCodeData.current, // 产品代码
      proType: proTypeData.current, // 产品类型
      upstairsSeries: upstairsSeriesData.current, // 系列名称
      investmentManager: investManagerData.current, // 投资经理
      proRisk: proRiskData.current, // 风险等级
      proStage: proStageData.current, // 产品阶段
      direction: directionData.current, // 排序方式
      proEstablishStartTime: proEstablishStartTimeData.current,
      proEstablishEndTime: proEstablishEndTimeData.current,
      proTerminationStartTime: proTerminationStartTimeData.current,
      proTerminationEndTime: proTerminationEndTimeData.current,
      field: fieldData.current, // 排序字段
      keyWords: keyWordsData.current, // 关键字
    };
  };

  /**
   * 更新请求参数(系列看板-父级)
   * @method handleGetDataObj
   */
  const handleGetDataNewObj = () => {
    dataNewObj.current = {
      pageNum: pageNumNewData.current, // 当前页
      pageSize: pageSizeNewData.current, // 页展示量
      proName: proNameNewData.current, // 产品全称
      proCode: proCodeNewData.current, // 产品代码
      proType: proTypeNewData.current, // 产品类型
      upstairsSeries: upstairsSeriesNewData.current, // 系列名称
      investmentManager: investManagerNewData.current, // 投资经理
      proRisk: proRiskNewData.current, // 风险等级
      proStage: proStageNewData.current, // 产品阶段
      direction: directionNewData.current, // 排序方式
      field: fieldNewData.current, // 排序字段
      keyWords: keyWordsNewData.current, // 关键字
    };
  };

  /**
   * 更新请求参数(系列看板-子级)
   * @method handleGetDataObj
   */
  const handleGetDataNewChildObj = () => {
    dataNewChildObj.current = {
      pageNum: pageNumNewChildData.current, // 当前页
      pageSize: pageSizeNewChildData.current, // 页展示量
      proName: proNameNewChildData.current, // 产品全称
      proCode: proCodeNewChildData.current, // 产品代码
      proType: proTypeNewChildData.current, // 产品类型
      upstairsSeries: upstairsSeriesNewChildData.current, // 系列名称
      investmentManager: investmentManagerNewChildData.current, // 投资经理
      proRisk: proRiskNewChildData.current, // 风险等级
      proStage: proStageNewChildData.current, // 产品阶段
      direction: directionNewChildData.current, // 排序方式
      field: fieldNewChildData.current, // 排序字段
    };
  };

  /**
   * 创建产品看板栅格
   */
  const handleAddGird = () => {
    const arr = [
      <Col className={styles.productGrid} xs={{ span: 4 }}>
        <p>
          <span className={'text_ADB0B8'}>/ 产品生命周期阶段划分</span>
        </p>
      </Col>,
    ];
    if (JSON.stringify(productStageData) !== '[]') {
      for (const key of productStageData) {
        if (typeof key === 'object') {
          arr.push(
            <Col
              className={`${styles.productGrid} ${styles.productGridHover} ${
                proStageData.current.includes(key.proStage) ? styles.bgcFFF : ''
              }`}
              xs={{ span: 4 }}
              onClick={() => {
                handleShowProstageData(key.proStage);
              }}
            >
              <Tooltip title={proStageTooltip[key.proStage]}>
                <div className={styles.girdBody}>{key.amount}</div>
                <div className={styles.girdTitle}>{handleUpdateNameValue(key.proStage)}阶段</div>
              </Tooltip>
            </Col>,
          );
        }
      }
    }
    return (
      <div className={styles.girdTop} style={{ display: isKanban ? '' : 'none' }}>
        <Row
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
          }}
        >
          {arr}
        </Row>
        <CloseOutlined className={styles.closeOutlined} onClick={() => setKanban()} />
      </div>
    );
  };

  /**
   * 数据字典下拉选项数据渲染
   * @method  handleMapList
   * @param   {value} 大字典code
   * @param   {code} 小字典code
   * @param   {name} 小字典name
   * @param   {spanName} 标题名称
   * @param   {getFDname} 标签的绑定值
   */
  const handleMapList = (value, code, name, spanName, getFDname, message) => {
    if (dicts[value]) {
      const children = [];
      for (const key of dicts[value]) {
        const keys = key[code];
        const values = key[name];
        children.push(
          <Select.Option key={keys} value={keys}>
            {values}
          </Select.Option>,
        );
      }
      return (
        <FormItem>
          <span>{spanName}</span>
          {getFieldDecorator(getFDname)(
            <Select
              name="getFDname"
              mode="multiple"
              className={styles.searchInput}
              placeholder={message}
              showArrow
            >
              {children}
            </Select>,
          )}
        </FormItem>
      );
    }
    return '';
  };

  // 产品看板重置
  const resetForProduct = () => {
    proNameData.current = [];
    proCodeData.current = [];
    upstairsSeriesData.current = [];
    proTypeData.current = [];
    proStageData.current = [];
    investManagerData.current = [];
    proRiskData.current = [];
    proEstablishStartTimeData.current = '';
    proEstablishEndTimeData.current = '';
    proTerminationStartTimeData.current = '';
    proTerminationEndTimeData.current = '';
    proTerminationEndTimeData.current = '';
    keyWordsData.current = '';
    handleGetDataObj();
    handleGetListData();
  };
  // 系列看板重置
  const resetForSeries = () => {
    proNameNewData.current = [];
    proCodeNewData.current = [];
    upstairsSeriesNewData.current = [];
    proTypeNewData.current = [];
    proStageNewData.current = [];
    investManagerNewData.current = [];
    proRiskNewData.current = [];
    proTerminationEndTimeData.current = '';
    keyWordsNewData.current = '';
    handleGetDataNewObj();
    handleGetListNewData();
  };

  /**
   * 修改:日期输入框change
   * @param {Object} date 变化的时间框
   * @param {String} dateString 输入框日期String
   * @param {Object} refData 该输入框对应的数据
   */
  const handleChangeDatePickerValue = (date, dateString, refData1, refData2) => {
    refData1.current = dateString[0];
    refData2.current = dateString[1];
  };

  /**
   * 搜索框值(产品看板)
   * @param {key} 值
   */
  const blurSearch = key => {
    keyWordsData.current = key;
    pageNumData.current = 1;
    handleGetListData();
  };

  /**
   * 搜索框值(系列看板)
   * @param {key} 值
   */
  const blurNewSearch = key => {
    keyWordsNewData.current = key;
    pageNumNewData.current = 1;
    handleGetListNewData();
  };

  /**
   * 产品全称/代码下拉列表渲染
   * @method handleProNameAndCodeSelect
   * @param spanName span名称
   * @param getFDname 标签绑定值
   * @param inputBody 输入框提示信息
   */
  const handleProNameAndCodeSelect = (data, spanName, getFDname, inputBody, getKey) => {
    const children = [];
    if (data !== []) {
      for (const key of data) {
        if (getKey) {
          children.push(
            <Select.Option value={key[getFDname]}>
              {key[getFDname]}&nbsp;&nbsp;({key[getKey]})
            </Select.Option>,
          );
        } else {
          children.push(<Select.Option value={key[getFDname]}>{key[getFDname]}</Select.Option>);
        }
      }
    }
    return (
      <FormItem>
        <span>{spanName}</span>
        {getFieldDecorator(getFDname)(
          <Select mode="multiple" className={styles.searchInput} placeholder={inputBody} showArrow>
            {children}
          </Select>,
        )}
      </FormItem>
    );
  };

  /**
   * 系列名称下拉列表渲染
   * @method handleProNameAndCodeSelect
   * @param data 数据源
   * @param spanName span名称
   * @param getFDname 标签绑定值
   * @param inputBody 输入框提示信息
   * @param getKey 输入框value值
   * @param getNewKey 输入框显示值
   */
  const handleCanShowSeriesName = (data, spanName, getFDname, inputBody, getKey, getNewKey) => {
    const children = [];
    if (data !== []) {
      for (const key of data) {
        children.push(
          <Select.Option value={key[getNewKey]}>
            {key[getKey]}&nbsp;&nbsp;({key[getNewKey]})
          </Select.Option>,
        );
      }
    }
    return (
      <FormItem>
        <span>{spanName}</span>
        {getFieldDecorator(getFDname)(
          <Select mode="multiple" className={styles.searchInput} placeholder={inputBody} showArrow>
            {children}
          </Select>,
        )}
      </FormItem>
    );
  };

  /**
   * 公共下拉列表渲染
   * @param data 数据源
   * @param spanName span名称
   * @param getFDname 标签绑定值
   * @param inputBody 输入框提示信息
   * @param getKey 输入框value值
   * @param getNewKey 输入框显示值
   */
  const handleCanShowBase = (data, spanName, getFDname, inputBody, getKey, getNewKey) => {
    const children = [];
    if (data !== []) {
      for (const key of data) {
        children.push(<Select.Option value={key[getKey]}>{key[getNewKey]}</Select.Option>);
      }
    }
    return (
      <FormItem>
        <span>{spanName}</span>
        {getFieldDecorator(getFDname)(
          <Select mode="multiple" className={styles.searchInput} placeholder={inputBody} showArrow>
            {children}
          </Select>,
        )}
      </FormItem>
    );
  };

  const handleCanShowCheckBox = e => {
    if (e.target.checked === true) {
    } else {
    }
  };

  // 数组删除
  Array.prototype.remove = function(val) {
    const index = this.indexOf(val);
    if (index > -1) {
      this.splice(index, 1);
    }
  };

  /**
   * 产品类型checkBox选中方法(产品看板)
   *@method handleGetProTypeKey
   *@param {String} e checkbox选中项
   */
  const handleGetProTypeKey = e => {
    if (e.target.checked === true) {
      if (!proTypeData.current.includes(e.target.value)) {
        proTypeData.current.push(e.target.value);
      }
    } else if (proTypeData.current.includes(e.target.value)) {
      proTypeData.current.remove(e.target.value);
    }
  };

  /**
   * 产品类型checkBox选中方法(系列看板)
   *@method handleGetProTypeNewKey
   *@param {String} e checkbox选中项
   */
  const handleGetProTypeNewKey = e => {
    if (e.target.checked === true) {
      if (!proTypeNewData.current.includes(e.target.value)) {
        proTypeNewData.current.push(e.target.value);
      }
    } else if (proTypeNewData.current.includes(e.target.value)) {
      proTypeNewData.current.remove(e.target.value);
    }
  };

  // 更新数据
  const handleCangeProTypeCheckBoxCommit = () => {
    handleGetDataObj();
    handleGetDataNewObj();
    handleGetListData();
    handleGetListNewData();
  };

  /**
   *@method handleAddOption 产品类型多选查询下拉选项(产品看板)
   */
  const handleAddOption = () => {
    const proTypeArrayData = [];
    if (proTypeDatas !== []) {
      for (const key of proTypeDatas) {
        proTypeArrayData.push(
          <Col span={6}>
            <Checkbox
              key={key.value}
              value={key.value}
              className={styles.productCheckBox}
              onChange={handleGetProTypeKey}
            >
              <span>{key.label}</span>
            </Checkbox>
          </Col>,
        );
      }
    }
    return (
      <div style={{ display: productOnAndOff ? '' : 'none' }} className={styles.productSelect}>
        <Row>{proTypeArrayData}</Row>
        <div style={{ float: 'right' }}>
          <Button type="primary" onClick={handleCangeProTypeCheckBoxCommit}>
            查询
          </Button>
        </div>
      </div>
    );
  };

  // 产品类型多选查询下拉选项(系列看板)
  const handleAddNewOption = () => {
    const proTypeArrayData = [];
    if (proTypeDatas !== []) {
      for (const key of proTypeDatas) {
        proTypeArrayData.push(
          <Col span={6}>
            <Checkbox
              key={key.value}
              value={key.value}
              className={styles.productCheckBox}
              onChange={handleGetProTypeNewKey}
            >
              <span>{key.label}</span>
            </Checkbox>
          </Col>,
        );
      }
    }
    return (
      <div style={{ display: productOnAndOff ? '' : 'none' }} className={styles.productSelect}>
        <Row>{proTypeArrayData}</Row>
        <div style={{ float: 'right' }}>
          <Button type="primary" onClick={handleCangeProTypeCheckBoxCommit}>
            查询
          </Button>
        </div>
      </div>
    );
  };

  /**
   * 产品类型下拉按钮(产品看板)
   */
  const handleAddCheckBoxSelect = () => {
    return (
      <div>
        <Button
          type="link"
          className={styles.tabsTabDropdown}
          onClick={() => setProductOnAndOff(!productOnAndOff)}
        >
          产品类型
          <Icon type="down" />
        </Button>
        {handleAddOption()}
      </div>
    );
  };

  /**
   *@method handleAddNewSelect 产品类型下拉按钮(系列看板)
   */
  const handleAddNewSelect = () => {
    return (
      <div>
        <Button
          type="link"
          className={styles.tabsTabDropdown}
          onClick={() => setProductOnAndOff(!productOnAndOff)}
        >
          产品类型
          <Icon type="down" />
        </Button>
        {handleAddNewOption()}
      </div>
    );
  };

  /**
   *@method handleGoProductAdd 产品看板新增按钮
   */
  const handleGoProductAdd = () => {
    dispatch(
      routerRedux.push({
        pathname: '/dynamicPage/pages/产品评审/4028e7b67443dc6e0174490aea870006/新增页面',
      }),
    );
  };

  /**
   *@method handleGoSeriesAdd 系列看板新增按钮
   */
  const handleGoSeriesAdd = () => {
    dispatch(
      routerRedux.push({
        pathname: '/dynamicPage/pages/产品评审/4028e7b674b6714e0174c4debba60008/新增页面',
      }),
    );
  };

  /**
   * 切换Tabs标签页回调
   *@param {Object} e 点击对象
   */
  const handleChangeRadioKey = key => {
    keyWordsData.current = '';
    keyWordsNewData.current = '';
    setTabsKey(key);
    setTabsShowAndOff(key);
    staticInstance.getInstance().billboardRadioKey = key;
    if (key === '1') {
      resetForProduct();
    } else if (key === '2') {
      resetForSeries();
    }
    setProductOnAndOff(false);
  };

  // 产品看板 === 搜索的区域的配置
  const formItemDataForProduct = [
    {
      name: 'proCode',
      label: '产品全称',
      type: 'select',
      readSet: { name: 'proName', code: 'proCode', bracket: 'proCode' },
      config: { mode: 'multiple', maxTagCount: 1 },
      option: proNameAndCodeData,
    },
    {
      name: 'upstairsSeries',
      label: '系列名称',
      type: 'select',
      readSet: { name: 'proName', code: 'proCode', bracket: 'proCode' },
      config: { mode: 'multiple', maxTagCount: 1 },
      option: seriesNameData,
    },
    {
      name: 'proType',
      label: '产品类型',
      type: 'select',
      readSet: { name: 'label', code: 'value' },
      config: { mode: 'multiple', maxTagCount: 1 },
      option: proTypeDatas,
    },
    {
      name: 'investmentManager',
      label: '投资经理',
      type: 'select',
      readSet: { name: 'name', code: 'empNo', bracket: 'proCode' },
      config: { mode: 'multiple', maxTagCount: 1 },
      option: productBillboardInvestmentManagerData,
    },
    {
      name: 'proRisk',
      label: '风险等级',
      type: 'select',
      readSet: { name: 'name', code: 'code', bracket: 'proCode' },
      config: { mode: 'multiple', maxTagCount: 1 },
      option: dicts.R001,
    },
    {
      name: 'proStage',
      label: '产品阶段',
      type: 'select',
      readSet: { name: 'name', code: 'code' },
      config: { mode: 'multiple', maxTagCount: 1 },
      option: dicts.P002,
    },
    {
      name: 'proCdate',
      label: '成立日期',
      type: 'RangePicker',
    },
    {
      name: 'proEdate',
      label: '结束日期',
      type: 'RangePicker',
    },
  ];
  // 产品看板 === 搜索回调
  const searchForproduct = fieldsValue => {
    // 成立日期
    if (fieldsValue) {
      const proCdate = {};
      if (fieldsValue && fieldsValue.proCdate && fieldsValue.proCdate.length) {
        proCdate.startTime = fieldsValue.proCdate[0].format('YYYY-MM-DD');
        proCdate.endTime = fieldsValue.proCdate[1].format('YYYY-MM-DD');
      }
      // 结束日期
      const proEdate = {};
      if (fieldsValue && fieldsValue.proEdate && fieldsValue.proEdate.length) {
        proEdate.startTime = fieldsValue.proEdate[0].format('YYYY-MM-DD');
        proEdate.endTime = fieldsValue.proEdate[1].format('YYYY-MM-DD');
      }
      pageNumData.current = 1;
      proNameData.current = fieldsValue.proName;
      proCodeData.current = fieldsValue.proCode;
      upstairsSeriesData.current = fieldsValue.upstairsSeries;
      proTypeData.current = fieldsValue.proType;
      proStageData.current = fieldsValue.proStage || [];
      investManagerData.current = fieldsValue.investmentManager;
      proRiskData.current = fieldsValue.proRisk;
      proEstablishStartTimeData.current = proCdate.startTime;
      proEstablishEndTimeData.current = proCdate.endTime;
      proTerminationStartTimeData.current = proEdate.startTime;
      proTerminationEndTimeData.current = proEdate.endTime;
    }
    handleGetDataObj();
    handleGetListData();
  };

  // 模糊查询回调
  const handlerSearch = fieldsValue => {
    if (tabsKey === '1') {
      searchForproduct(fieldsValue);
    } else {
      seriesSearchhandler(fieldsValue);
    }
  };

  // 系列看板 === 搜索的区域的配置
  const formItemDataForSeries = [
    {
      name: 'proCode',
      label: '系列名称',
      type: 'select',
      readSet: { name: 'proName', code: 'proCode', bracket: 'proCode' },
      config: { mode: 'multiple', maxTagCount: 1 },
      option: seriesNameData,
    },
    {
      name: 'proType',
      label: '产品类型',
      type: 'select',
      readSet: { name: 'label', code: 'value' },
      config: { mode: 'multiple', maxTagCount: 1 },
      option: proTypeDatas,
    },
    {
      name: 'investmentManager',
      label: '投资经理',
      type: 'select',
      readSet: { name: 'name', code: 'empNo', bracket: 'proCode' },
      config: { mode: 'multiple', maxTagCount: 1 },
      option: productBillboardInvestmentManagerData,
    },
    {
      name: 'proRisk',
      label: '风险等级',
      type: 'select',
      readSet: { name: 'name', code: 'code', bracket: 'proCode' },
      config: { mode: 'multiple', maxTagCount: 1 },
      option: dicts.R001,
    },
  ];
  // 系列看板 === 搜索回调
  const seriesSearchhandler = fieldsValue => {
    pageNumNewData.current = 1;
    proCodeNewData.current = fieldsValue.proCode;
    proTypeNewData.current = fieldsValue.proType;
    investManagerNewData.current = fieldsValue.investmentManager;
    proRiskNewData.current = fieldsValue.proRisk;
    handleGetDataNewObj();
    handleGetListNewData();
  };
  /**
   * 模糊搜索的回调
   * @param {string} param 模糊搜索传回来的字符串
   */
  const handlerFuzzySearch = param => {
    assign({
      pageNum: 1,
      fuzzy: param,
      searchData: undefined,
    });
  };

  /**
   *创建Radio切换框
   */
  const handleAddRadio = () => {
    return (
      <>
        {handleAddModal()}
        <List
          title={false}
          formItemData={formItemDataForProduct}
          advancSearch={handlerSearch}
          searchInputWidth="300"
          resetFn={() => {
            if (tabsKey === '1') {
              resetForProduct();
            } else {
              resetForSeries();
            }
          }}
          searchPlaceholder={
            tabsKey === '1' ? '请输入产品全称/产品代码/系列名称' : '请输入系列名称/系列号'
          }
          fuzzySearch={value => {
            if (tabsKey === '1') {
              blurSearch(value);
            } else {
              blurNewSearch(value);
            }
          }}
          tabs={{
            tabList: [
              { key: '1', tab: '产品看板' },
              { key: '2', tab: '系列看板' },
            ],
            activeTabKey: tabsKey,
            onTabChange: handleChangeRadioKey,
          }}
          extra={
            tabsKey === '1' && (
              <Button disabled={isKanban} onClick={() => setKanban(true)} type="link">
                开启产品阶段
              </Button>
            )
          }
          tableList={
            tabsKey === '1' ? (
              <>
                {handleAddGird()}
                {tableData()}
              </>
            ) : (
              <>{newTableDataFather()}</>
            )
          }
        />
      </>
    );
  };

  /**
   * 请求:数据字典下拉列表数据
   */
  const handleGetSelectOptions = () => {
    dispatch({
      type: 'productBillboard/getDicts',
      payload: { codeList: ['A002', 'P002', 'D001', 'R001', 'orgType', 'subSystem'] },
      callback: res => {
        handleUpdateDicts(res); // 处理:词汇字典数据
      },
    });
  };

  const handleGetProTypeData = () => {
    dispatch({
      type: 'productBillboard/getProTypeFunc',
    });
  };

  /**
   * 请求:代码映射表格
   * @param {String} proCode
   */
  const handleGetCodeLinkTable = proCode => {
    dispatch({
      type: 'productBillboard/codeLinkTableDataFunc',
      payload: proCode,
      callback: res => {
        proCodeLinkTableDataRef.current = res;
        setProCodeLinkTableData(proCodeLinkTableDataRef.current);
      },
    });
  };

  /**
   * 请求:代码映射表格(保存/修改)
   * @param {Object} record
   */
  const handleUpdateCodeLink = record => {
    dispatch({
      type: 'productBillboard/codeLinkUpdateFunc',
      payload: record,
      callback: () => {
        handleGetCodeLinkTable(proCodeLinkData.current);
      },
    });
  };

  /**
   * 请求:产品看板阶段概述数据
   */
  const handleGetProductStageData = () => {
    dispatch({
      type: 'productBillboard/getProductStageFunc',
    });
  };

  /**
   * 请求:获取投资经理下拉列表
   *@method hendleGetInvestmentManagerData
   */
  const hendleGetInvestmentManagerData = () => {
    dispatch({
      type: 'productBillboard/getInvestmentManagerFunc',
    });
  };

  /**
   * 请求:获取产品全称/代码下拉列表
   *@method handleGetProNameAndCode
   */
  const handleGetProNameAndCode = () => {
    dispatch({
      type: 'productBillboard/getProNameAndCodeFunc',
    });
  };

  /**
   * 请求:获取系列名称下拉列表
   *@method handleGetProNameAndCode
   */
  const handleGetSeriesName = () => {
    dispatch({
      type: 'productBillboard/getSeriesNameFunc',
    });
  };

  /**
   * 精确查询数据取值(产品看板)
   */
  const handleExactSerach = e => {
    e.preventDefault();
    validateFields((err, values) => {
      if (!err) {
        pageNumData.current = 1;
        proNameData.current = values.proName;
        proCodeData.current = values.proCode;
        upstairsSeriesData.current = values.upstairsSeries;
        proTypeData.current = values.proType;
        proStageData.current = values.proStage || [];
        investManagerData.current = values.investmentManager;
        proRiskData.current = values.proRisk;
        handleGetDataObj();
      }
    });
    handleGetListData();
  };

  /**
   * 精确查询数据取值(系列看板)
   */
  const handleExactNewSerach = e => {
    e.preventDefault();
    validateFields((err, values) => {
      if (!err) {
        pageNumNewData.current = 1;
        proNameNewData.current = values.proName;
        proCodeNewData.current = values.proCode;
        upstairsSeriesNewData.current = values.upstairsSeries;
        proTypeNewData.current = values.proType;
        proStageNewData.current = values.proStage || [];
        investManagerNewData.current = values.investmentManager;
        proRiskNewData.current = values.proRisk;
        handleGetDataNewObj();
      }
    });
    handleGetListNewData();
  };

  /**
   *@method handleGetListData 获取表格数据(产品看板)
   */
  const handleGetListData = () => {
    handleGetDataObj();
    dispatch({
      type: 'productBillboard/fetch',
      payload: dataObj.current,
      callback: res => {
        totalData.current = res.total;
      },
    });
  };

  /**
   * 获取表格数据(系列看板-父级)
   */
  const handleGetListNewData = () => {
    handleGetDataNewObj();
    dispatch({
      type: 'productBillboard/newFetch',
      payload: dataNewObj.current,
      callback: res => {
        totalNewData.current = res.total;
      },
    });
  };

  /**
   * 获取表格数据(系列看板-子级)
   */
  const handleGetListNewChildData = () => {
    handleGetDataNewChildObj();
    dispatch({
      type: 'productBillboard/newChildFetch',
      payload: dataNewChildObj.current,
      callback: res => {
        totalNewChildData.current = res.total;
        handleChangeHeight();
      },
    });
  };

  /**
   * 删除产品
   */
  const handleDeleteProData = record => {
    dispatch({
      type: 'productBillboard/deleteProAndSerFunc',
      payload: [record.proCode],
      callback: () => {
        handleGetListData();
        handleGetListNewData();
      },
    });
  };

  // 删除对话框
  const handleShowDeleteConfirm = record => {
    confirm({
      content: '请确认是否删除',
      onOk() {
        handleDeleteProData(record);
      },
      onCancel() {},
    });
  };

  // 删除对话框
  const handleShowProstageData = data => {
    confirm({
      content: `确定要查询${handleUpdateNameValue(data)}阶段的所有产品吗?`,
      onOk() {
        proStageData.current = [data];
        handleGetListData();
      },
      onCancel() {},
    });
  };

  // 表格多选框
  const rowSelection = {
    onChange: selectedRowKeys => {
      batchData.current = selectedRowKeys;
    },
  };

  /**
   * 页展示量变更(产品看板)
   * @param {Object} current pageNum当前页码
   * @param {String} pageSize 表格行数据
   */
  const handleUpdataPageSize = (current, pageSize) => {
    pageSizeData.current = pageSize;
    pageNumData.current = 1;
    handleGetDataObj();
  };

  /**
   * 页展示量变更(系列看板-父级)
   * @param {Object} current pageNum当前页码
   * @param {String} pageSize 表格行数据
   */
  const handleUpdataNewPageSize = (current, pageSize) => {
    pageSizeNewData.current = pageSize;
    pageNumNewData.current = 1;
    setExpandedRowKeysData([]);
    handleGetDataNewObj();
  };

  /**
   * 页展示量变更(系列看板-子级)
   * @param {Object} current pageNum当前页码
   * @param {String} pageSize 表格行数据
   */
  const handleUpdataNewChildPageSize = (current, pageSize) => {
    pageSizeNewChildData.current = pageSize;
    pageNumNewChildData.current = 1;
    handleGetDataNewChildObj();
    handleChangeHeight(100);
  };

  /**
   * 当前页码变更(产品看板)
   * @param {String} pageNum 跳转到的页码
   */
  const handleUpdataPageNum = pageNum => {
    pageNumData.current = pageNum;
    handleGetDataObj();
  };

  /**
   * 当前页码变更(系列看板-父级)
   * @param {String} pageNum 跳转到的页码
   */
  const handleUpdataNewPageNum = pageNum => {
    pageNumNewData.current = pageNum;
    setExpandedRowKeysData([]);
    handleGetDataNewObj();
  };

  /**
   * 当前页码变更(系列看板-子级)
   * @param {String} pageNum 跳转到的页码
   */
  const handleUpdataNewChildPageNum = pageNum => {
    pageNumNewChildData.current = pageNum;
    handleGetDataNewChildObj();
    handleChangeHeight(100);
  };

  // 页码属性设置(产品看板)
  const paginationProps = {
    showSizeChanger: true,
    showQuickJumper: true,
    onShowSizeChange: handleUpdataPageSize,
    onChange: handleUpdataPageNum,
    current: pageNumData.current,
    total: totalData.current,
    showTotal: () => {
      return `共 ${totalData.current} 条数据`;
    },
  };

  // 页码属性设置(系列看板-父级)
  const paginationNewProps = {
    showSizeChanger: true,
    showQuickJumper: true,
    onShowSizeChange: handleUpdataNewPageSize,
    onChange: handleUpdataNewPageNum,
    current: pageNumNewData.current,
    total: totalNewData.current,
    showTotal: () => {
      return `共 ${totalNewData.current} 条数据`;
    },
  };

  // 页码属性设置(系列看板-子级)
  const paginationNewChildProps = {
    showSizeChanger: true,
    showQuickJumper: true,
    onShowSizeChange: handleUpdataNewChildPageSize,
    onChange: handleUpdataNewChildPageNum,
    current: pageNumNewChildData.current,
    total: totalNewChildData.current,
    showTotal: () => {
      return `共 ${totalNewChildData.current} 条数据`;
    },
  };

  /**
   * 查看按钮(产品看板)
   * @param {Object} record 行数据
   */
  const handleGoProductData = record => {
    dispatch(
      routerRedux.push({
        pathname: './index/productData',
        query: { proCode: record.proCode },
      }),
    );
  };

  /**
   * 变更按钮(产品看板)
   * @param {Object} record 行数据
   */
  const handleGoUpdate = record => {
    dispatch(
      routerRedux.push({
        pathname: `/dynamicPage/pages/合同定稿/8aaaa5d2757978ef0175bc2bdd1b000d/修改?processInstId=${record.contractReview}`,
      }),
    );
  };

  /**
   * 查看按钮(系列看板)
   * @param {Object} record 行数据
   */
  const handleGoSeriesData = record => {
    dispatch(
      routerRedux.push({
        pathname: './index/seriesData',
        query: { proCode: record.proCode },
      }),
    );
  };

  // 表头(产品看板)
  const columns = [
    {
      title: '产品全称',
      dataIndex: 'proName',
      key: 'proName',
      sorter: true,
      width: 400,
      ellipsis: {
        showTitle: false,
      },
      render: text => {
        return (
          <Tooltip title={text}>
            {text
              ? text.toString().replace(/null/g, '-')
              : text === '' || text === undefined
              ? '-'
              : 0}
          </Tooltip>
        );
      },
    },
    {
      title: '产品代码',
      dataIndex: 'proCode',
      key: 'proCode',
      sorter: true,
      width: 120,
      ellipsis: {
        showTitle: false,
      },
      render: text => {
        return (
          <Tooltip title={text}>
            {text
              ? text.toString().replace(/null/g, '-')
              : text === '' || text === undefined
              ? '-'
              : 0}
          </Tooltip>
        );
      },
    },
    {
      title: '投资经理',
      dataIndex: 'investmentManager',
      key: 'investmentManager',
      sorter: true,
      width: 150,
      ellipsis: {
        showTitle: false,
      },
      render: text => {
        return (
          <Tooltip title={text}>
            {text
              ? text.toString().replace(/null/g, '-')
              : text === '' || text === undefined
              ? '-'
              : 0}
          </Tooltip>
        );
      },
    },
    {
      title: '产品类型',
      dataIndex: 'proType',
      key: 'proType',
      sorter: true,
      width: 150,
      ellipsis: {
        showTitle: false,
      },
      render: text => {
        return (
          <Tooltip title={text}>
            {text
              ? text.toString().replace(/null/g, '-')
              : text === '' || text === undefined
              ? '-'
              : 0}
          </Tooltip>
        );
      },
    },
    {
      title: '成立日期',
      dataIndex: 'proCdate',
      key: 'proCdate',
      sorter: true,
      width: 120,
      ellipsis: {
        showTitle: false,
      },
      render: text => {
        return (
          <Tooltip title={text}>
            {text
              ? text.toString().replace(/null/g, '-')
              : text === '' || text === undefined
              ? '-'
              : 0}
          </Tooltip>
        );
      },
    },
    {
      title: '终止日期',
      dataIndex: 'proSdate',
      key: 'proSdate',
      sorter: true,
      width: 120,
      ellipsis: {
        showTitle: false,
      },
      render: text => {
        return (
          <Tooltip title={text}>
            {text
              ? text.toString().replace(/null/g, '-')
              : text === '' || text === undefined
              ? '-'
              : 0}
          </Tooltip>
        );
      },
    },
    {
      title: '系列名称',
      dataIndex: 'upstairsSeries',
      key: 'upstairsSeries',
      sorter: true,
      width: 400,
      ellipsis: {
        showTitle: false,
      },
      render: text => {
        return (
          <Tooltip title={text}>
            {text
              ? text.toString().replace(/null/g, '-')
              : text === '' || text === undefined
              ? '-'
              : 0}
          </Tooltip>
        );
      },
    },
    {
      title: '委托人',
      dataIndex: 'proConsigner',
      key: 'proConsigner',
      sorter: true,
      width: 120,
      ellipsis: {
        showTitle: false,
      },
      render: text => {
        return (
          <Tooltip title={text}>
            {text
              ? text.toString().replace(/null/g, '-')
              : text === '' || text === undefined
              ? '-'
              : 0}
          </Tooltip>
        );
      },
    },
    {
      title: '风险等级',
      dataIndex: 'proRisk',
      key: 'proRisk',
      sorter: true,
      width: 150,
      ellipsis: {
        showTitle: false,
      },
      render: text => {
        return (
          <Tooltip title={text}>
            {text
              ? text.toString().replace(/null/g, '-')
              : text === '' || text === undefined
              ? '-'
              : 0}
          </Tooltip>
        );
      },
    },
    {
      title: '产品阶段',
      dataIndex: 'proStage',
      key: 'proStage',
      sorter: true,
      width: 120,
      ellipsis: {
        showTitle: false,
      },
      render: text => {
        return (
          <Tooltip title={text}>
            {text
              ? text.toString().replace(/null/g, '-')
              : text === '' || text === undefined
              ? '-'
              : 0}
          </Tooltip>
        );
      },
    },
    {
      title: '数据状态',
      dataIndex: 'checked',
      key: 'checked',
      sorter: true,
      width: 120,
      ellipsis: {
        showTitle: false,
      },
      render: text => {
        return (
          <Tooltip title={text}>
            {text
              ? text.toString().replace(/null/g, '-')
              : text === '' || text === undefined
              ? '-'
              : 0}
          </Tooltip>
        );
      },
    },
    {
      title: '评审状态',
      dataIndex: 'reviewStatus',
      key: 'reviewStatus',
      sorter: true,
      width: 120,
      ellipsis: {
        showTitle: false,
      },
      render: text => {
        return (
          <Tooltip title={text}>
            {text
              ? text.toString().replace(/null/g, '-')
              : text === '' || text === undefined
              ? '-'
              : 0}
          </Tooltip>
        );
      },
    },
    {
      title: '产品状态',
      dataIndex: 'proStatus',
      key: 'proStatus',
      sorter: true,
      width: 120,
      ellipsis: {
        showTitle: false,
      },
      render: text => {
        return (
          <Tooltip title={text}>
            {text
              ? text.toString().replace(/null/g, '-')
              : text === '' || text === undefined
              ? '-'
              : 0}
          </Tooltip>
        );
      },
    },
    {
      title: '操作',
      key: '操作',
      width: 220,
      align: 'center',
      fixed: 'right',
      render: (_, record) => {
        return (
          <>
            <Action code="productBillboard:query">
              <Button
                className={styles.proButton}
                type="link"
                onClick={() => handleGoProductData(record)}
              >
                查看
              </Button>
            </Action>
            {/* <Button
               type="link"
               className={styles.proButton}
               disabled={record.contractReview === '' ? 'disabled' : ''}
               onClick={() => handleGoUpdate(record)}
             >
               变更
             </Button> */}
            <Action code="productBillboard:delete">
              <Button
                type="link"
                className={styles.proButton}
                onClick={() => handleShowDeleteConfirm(record)}
              >
                删除
              </Button>
            </Action>
            {/* <Action code="productBillboard:codeChange"> */}
            <Button
              type="link"
              className={styles.proButton}
              onClick={() => handleShowModal(record)}
            >
              代码映射
            </Button>
            {/* </Action> */}
          </>
        );
      },
    },
  ];

  // 表头(系列看板-父级)
  const newFatherColumns = [
    {
      title: '系列名称',
      dataIndex: 'proName',
      key: 'proName',
      sorter: true,
      width: 400,
      ellipsis: {
        showTitle: false,
      },
      render: text => {
        return (
          <Tooltip title={text}>
            {text
              ? text.toString().replace(/null/g, '-')
              : text === '' || text === undefined
              ? '-'
              : 0}
          </Tooltip>
        );
      },
    },
    {
      title: '系列号',
      dataIndex: 'proCode',
      key: 'proCode',
      sorter: true,
      width: 120,
      ellipsis: {
        showTitle: false,
      },
      render: text => {
        return (
          <Tooltip title={text}>
            {text
              ? text.toString().replace(/null/g, '-')
              : text === '' || text === undefined
              ? '-'
              : 0}
          </Tooltip>
        );
      },
    },
    {
      title: '投资经理',
      dataIndex: 'investmentManager',
      key: 'investmentManager',
      sorter: true,
      width: 200,
      ellipsis: {
        showTitle: false,
      },
      render: text => {
        return (
          <Tooltip title={text}>
            {text
              ? text.toString().replace(/null/g, '-')
              : text === '' || text === undefined
              ? '-'
              : 0}
          </Tooltip>
        );
      },
    },
    {
      title: '产品类型',
      dataIndex: 'proType',
      key: 'proType',
      sorter: true,
      width: 120,
      ellipsis: {
        showTitle: false,
      },
      render: text => {
        return (
          <Tooltip title={text}>
            {text
              ? text.toString().replace(/null/g, '-')
              : text === '' || text === undefined
              ? '-'
              : 0}
          </Tooltip>
        );
      },
    },
    {
      title: '上级系列',
      dataIndex: 'upstairsSeries',
      key: 'upstairsSeries',
      sorter: true,
      width: 200,
      ellipsis: {
        showTitle: false,
      },
      render: text => {
        return (
          <Tooltip title={text}>
            {text
              ? text.toString().replace(/null/g, '-')
              : text === '' || text === undefined
              ? '-'
              : 0}
          </Tooltip>
        );
      },
    },
    {
      title: '委托人',
      dataIndex: 'proConsigner',
      key: 'proConsigner',
      sorter: true,
      width: 120,
      ellipsis: {
        showTitle: false,
      },
      render: text => {
        return (
          <Tooltip title={text}>
            {text
              ? text.toString().replace(/null/g, '-')
              : text === '' || text === undefined
              ? '-'
              : 0}
          </Tooltip>
        );
      },
    },
    {
      title: '风险等级',
      dataIndex: 'proRisk',
      key: 'proRisk',
      sorter: true,
      width: 150,
      ellipsis: {
        showTitle: false,
      },
      render: text => {
        return (
          <Tooltip title={text}>
            {text
              ? text.toString().replace(/null/g, '-')
              : text === '' || text === undefined
              ? '-'
              : 0}
          </Tooltip>
        );
      },
    },
    {
      title: '产品数量',
      dataIndex: 'proCount',
      key: 'proCount',
      sorter: true,
      width: 120,
      ellipsis: {
        showTitle: false,
      },
      render: text => {
        return (
          <Tooltip title={text}>
            {text
              ? text.toString().replace(/null/g, '-')
              : text === '' || text === undefined
              ? '-'
              : 0}
          </Tooltip>
        );
      },
    },
    {
      title: '数据状态',
      dataIndex: 'checked',
      key: 'checked',
      sorter: true,
      width: 120,
      ellipsis: {
        showTitle: false,
      },
      render: text => {
        return (
          <Tooltip title={text}>
            {text
              ? text.toString().replace(/null/g, '-')
              : text === '' || text === undefined
              ? '-'
              : 0}
          </Tooltip>
        );
      },
    },
    {
      title: '评审状态',
      dataIndex: 'reviewStatus',
      key: 'reviewStatus',
      sorter: true,
      width: 120,
      ellipsis: {
        showTitle: false,
      },
      render: text => {
        return (
          <Tooltip title={text}>
            {text
              ? text.toString().replace(/null/g, '-')
              : text === '' || text === undefined
              ? '-'
              : 0}
          </Tooltip>
        );
      },
    },
    {
      title: '操作',
      dataIndex: '操作',
      key: '操作',
      width: 150,
      fixed: 'right',
      align: 'center',
      render: (_, record) => (
        <div>
          <Action code="productBillboard:serviceQuery">
            <Button
              type="link"
              className={styles.proButton}
              onClick={() => handleGoSeriesData(record)}
            >
              查看
            </Button>
          </Action>
          <Action code="productBillboard:serviceDelete">
            <Button
              type="link"
              className={styles.proButton}
              onClick={() => handleShowDeleteConfirm(record)}
            >
              删除
            </Button>
          </Action>
        </div>
      ),
    },
  ];

  // 表头(系列看板-子级)
  const newChildColumns = [
    {
      title: '产品全称',
      dataIndex: 'proName',
      key: 'proName',
      sorter: true,
      width: 400,
      ellipsis: {
        showTitle: false,
      },
      render: text => {
        return (
          <Tooltip title={text}>
            {text
              ? text.toString().replace(/null/g, '-')
              : text === '' || text === undefined
              ? '-'
              : 0}
          </Tooltip>
        );
      },
    },
    {
      title: '产品代码',
      dataIndex: 'proCode',
      key: 'proCode',
      sorter: true,
      width: 120,
      ellipsis: {
        showTitle: false,
      },
      render: text => {
        return (
          <Tooltip title={text}>
            {text
              ? text.toString().replace(/null/g, '-')
              : text === '' || text === undefined
              ? '-'
              : 0}
          </Tooltip>
        );
      },
    },
    {
      title: '投资经理',
      dataIndex: 'investmentManager',
      key: 'investmentManager',
      sorter: true,
      width: 200,
      ellipsis: {
        showTitle: false,
      },
      render: text => {
        return (
          <Tooltip title={text}>
            {text
              ? text.toString().replace(/null/g, '-')
              : text === '' || text === undefined
              ? '-'
              : 0}
          </Tooltip>
        );
      },
    },
    {
      title: '产品类型',
      dataIndex: 'proType',
      key: 'proType',
      sorter: true,
      width: 120,
      ellipsis: {
        showTitle: false,
      },
      render: text => {
        return (
          <Tooltip title={text}>
            {text
              ? text.toString().replace(/null/g, '-')
              : text === '' || text === undefined
              ? '-'
              : 0}
          </Tooltip>
        );
      },
    },
    {
      title: '委托人',
      dataIndex: 'proConsigner',
      key: 'proConsigner',
      sorter: true,
      width: 120,
      ellipsis: {
        showTitle: false,
      },
      render: text => {
        return (
          <Tooltip title={text}>
            {text
              ? text.toString().replace(/null/g, '-')
              : text === '' || text === undefined
              ? '-'
              : 0}
          </Tooltip>
        );
      },
    },
    {
      title: '风险等级',
      dataIndex: 'proRisk',
      key: 'proRisk',
      sorter: true,
      width: 150,
      ellipsis: {
        showTitle: false,
      },
      render: text => {
        return (
          <Tooltip title={text}>
            {text
              ? text.toString().replace(/null/g, '-')
              : text === '' || text === undefined
              ? '-'
              : 0}
          </Tooltip>
        );
      },
    },
    {
      title: '产品阶段',
      dataIndex: 'proStage',
      key: 'proStage',
      sorter: true,
      width: 120,
      ellipsis: {
        showTitle: false,
      },
      render: text => {
        return (
          <Tooltip title={text}>
            {text
              ? text.toString().replace(/null/g, '-')
              : text === '' || text === undefined
              ? '-'
              : 0}
          </Tooltip>
        );
      },
    },
    {
      title: '上级系列',
      dataIndex: 'upstairsSeries',
      key: 'upstairsSeries',
      sorter: true,
      width: 200,
      ellipsis: {
        showTitle: false,
      },
      render: text => {
        return (
          <Tooltip title={text}>
            {text
              ? text.toString().replace(/null/g, '-')
              : text === '' || text === undefined
              ? '-'
              : 0}
          </Tooltip>
        );
      },
    },
    {
      title: '操作',
      dataIndex: 'batchoOperation',
      key: 'batchoOperation',
      render: (_, record) => (
        <div>
          <Action code="productBillboard:serviceQuery">
            <Button
              type="link"
              className={styles.proButton}
              onClick={() => handleGoProductData(record)}
            >
              查看
            </Button>
          </Action>
          <Action code="productBillboard:serviceQuery">
            <Button
              type="link"
              className={styles.proButton}
              onClick={() => handleShowDeleteConfirm(record)}
            >
              删除
            </Button>
          </Action>
        </div>
      ),
    },
  ];

  /**
   * 渲染表格数据(产品看板)
   */
  const tableData = () => {
    handleGetDataObj();
    return (
      <Table
        className={styles.controlButtonDiv}
        pagination={paginationProps} // 分页栏
        loading={listLoading} // 加载中效果
        rowKey={record => record.proCode} // key值
        dataSource={productBillboardTableData.rows} // 表数据源
        columns={columns}
        onChange={handleChangeSorter}
        scroll={{ x: columns.length * 120 }}
      />
    );
  };

  /**
   * 渲染表格数据(系列看板-父级)
   */
  const newTableDataFather = () => {
    return (
      <Table
        className={styles.controlButtonDiv}
        pagination={paginationNewProps}
        loading={listLoading1} // 加载中效果
        rowKey={record => record.proCode} // key值
        dataSource={productBillboardNewTabsData.rows} // 表数据源
        columns={newFatherColumns}
        expandedRowRender={newTableData}
        scroll={{ x: columns.length * 120 }}
        onChange={handleChangeNewSorter}
        // expandRowByClick="true" // 点击直接展开子表格
        expandedRowKeys={expandedRowKeysData}
        onExpand={(expanded, record) => {
          handleChangeNewChildData(expanded, record);
        }}
      />
    );
  };

  /**
   * 渲染表格数据(系列看板-子级)
   */
  const newTableData = () => {
    handleGetDataNewChildObj();
    return (
      <Table
        style={{ margin: '2px 300px 2px 3px' }}
        Checkbox={rowSelection}
        pagination={paginationNewChildProps}
        loading={listLoading2} // 加载中效果
        rowKey={record => record.proCode} // key值
        dataSource={productBillboardNewTableData.rows} // 表数据源
        columns={newChildColumns}
        scroll={{ x: columns.length * 150 }}
        onChange={handleChangeNewChildSorter}
      />
    );
  };

  /**
   * 原生JS简单实现标签+属性选择器
   * @param {*} name
   */
  const attrSelect = name => {
    const Arr = [];
    const ns = name.match(/([a-z]+)\[([^=]+)=([^\]]*)\]/);
    if (!ns) return null;
    const tag = ns[1];
    const attrName = ns[2];
    const attrValue = ns[3];
    const eles = document.getElementsByTagName(tag);
    for (let i = 0; i < eles.length; i++) {
      if (eles[i].getAttribute(attrName) == attrValue) {
        Arr.push(eles[i]);
      }
    }
    return Arr;
  };
  /**
   * 原生JS设置高度
   * @param {*} item
   * @param {*} h
   */
  const setH = (item, h) => {
    if (!h || !item) return;
    for (let i = 0; i < item.length; i++) {
      if (item[i]) item[i].style.height = `${h}px`;
    }
  };

  /**
   * 原生JS获取高度
   * @param {*} item
   */
  const getH = item => {
    if (item && item[0]) return item[0].clientHeight;
    return null;
  };

  // 获取元素及高度
  const handleChangeHeight = newHeight => {
    const attr = `data-row-key=${`${upstairsSeriesNewChildData.current}-extra-row`}`;
    const $dom = attrSelect(`tr[${attr}]`);
    tableHeight.current = getH($dom);
    const $row = attrSelect(`tr[${attr}]`);
    if (newHeight) {
      setH($row, newHeight);
    } else {
      setH($row, tableHeight.current);
    }
  };

  // 子表格展开项
  const handleChangeNewChildData = (expanded, record) => {
    if (record) {
      const temp = [];
      if (expanded) {
        temp.push(record.proCode);
      }
      setExpandedRowKeysData(temp);
      upstairsSeriesNewChildData.current = [record.proCode];
      handleGetListNewChildData();
    }
  };

  /**
   * 排序方法(产品表格)
   * @param {Object} pagination 页码数据信息
   * @param {Object} filters 不知道干啥的
   * @param {Object} sorter 排序依据
   */
  const handleChangeSorter = (pagination, filters, sorter) => {
    fieldData.current = sorter.field;
    if (sorter.order === 'ascend') {
      directionData.current = 'asc'; // 升序
    } else if (sorter.order === 'descend') {
      directionData.current = 'desc'; // 降序
    } else {
      directionData.current = ''; // 默认
    }
    handleGetDataObj();
    handleGetListData();
  };

  /**
   * 排序方法(系列表格-父级)
   * @param {Object} pagination 页码数据信息
   * @param {Object} filters 不知道干啥的
   * @param {Object} sorter 排序依据
   */
  const handleChangeNewSorter = (pagination, filters, sorter) => {
    fieldNewData.current = sorter.field;
    if (sorter.order === 'ascend') {
      directionNewData.current = 'asc'; // 升序
    } else if (sorter.order === 'descend') {
      directionNewData.current = 'desc'; // 降序
    } else {
      directionNewData.current = ''; // 默认
    }
    setExpandedRowKeysData([]);
    handleGetDataNewObj();
    handleGetListNewData();
  };

  /**
   * 排序方法(系列表格-子级)
   * @param {Object} pagination 页码数据信息
   * @param {Object} filters 不知道干啥的
   * @param {Object} sorter 排序依据
   */
  const handleChangeNewChildSorter = (pagination, filters, sorter) => {
    fieldNewChildData.current = sorter.field;
    if (sorter.order === 'ascend') {
      directionNewChildData.current = 'asc'; // 升序
    } else if (sorter.order === 'descend') {
      directionNewChildData.current = 'desc'; // 降序
    } else {
      directionNewChildData.current = ''; // 默认
    }
    handleGetListNewChildData();
  };

  /**
   * TA下拉列表变更
   * @param {String} val 选中值
   * @param {Object} record 行数据
   * @param {Object} data 表数据
   */
  const handleChangeCodeLinkSelect = (val, record, data) => {
    const da = cloneDeep(data);
    for (const key of da) {
      if (!key.id) {
        key.system = val;
      } else if (key.id === record.id) {
        key.system = val;
      }
    }
    proCodeLinkTableDataRef.current = da;
    setProCodeLinkTableData(da);
  };

  /**
   * TA下拉列表渲染
   * @param {String} text 当前值
   * @param {Array} data 字典数据源
   * @param {String} code code码
   * @param {String} name name码
   * @param {Object} record 行数据
   */
  const handleAddCodeLinkSelect = (text, data, code, name, record) => {
    const arr = [];
    for (const key of data) {
      arr.push(
        <Select.Option key={key[code]} value={key[code]}>
          {key[name]}
        </Select.Option>,
      );
    }
    return (
      <Select
        className={styles.proLinkSelect}
        defaultValue={text}
        onChange={val => handleChangeCodeLinkSelect(val, record, proCodeLinkTableDataRef.current)}
      >
        {arr}
      </Select>
    );
  };

  // 代码映射输入框变更
  const handleChangeCodeLinkInput = (e, record) => {
    const da = cloneDeep(proCodeLinkTableDataRef.current);
    for (const key of da) {
      if (!key.id) {
        key.sysProCode = e.target.value;
      } else if (record.id === key.id) {
        key.sysProCode = e.target.value;
      }
    }
    proCodeLinkTableDataRef.current = da;
    setProCodeLinkTableData(da);
  };

  // 代码映射输入框
  const handleAddCodeLinkInput = (text, record) => {
    return <Input defaultValue={text} onChange={e => handleChangeCodeLinkInput(e, record)} />;
  };

  // 表头(代码映射)
  const proCodeLinkColumns = [
    {
      title: '映射平台',
      dataIndex: 'system',
      key: 'system',
      align: 'center',
      render: (text, record) => {
        return handleAddCodeLinkSelect(text, dicts.subSystem, 'code', 'name', record);
      },
    },
    {
      title: '映射代码',
      dataIndex: 'sysProCode',
      key: 'sysProCode',
      align: 'center',
      render: (text, record) => {
        return handleAddCodeLinkInput(text, record);
      },
    },
    {
      title: '操作',
      dataIndex: 'batchoOperation',
      key: 'batchoOperation',
      width: 150,
      align: 'center',
      render: (_, record) => {
        if (!record.id) {
          return (
            <div>
              <Button type="link" onClick={() => handleCommitCodeLink()}>
                保存
              </Button>
              <Button
                type="link"
                onClick={() => handleCancelCodeLink(record, proCodeLinkTableDataRef.current)}
              >
                取消
              </Button>
            </div>
          );
        }
        return (
          <div>
            <Button type="link" onClick={() => handleCommitCodeLink()}>
              保存
            </Button>
            <Button
              type="link"
              onClick={() => handleCancelCodeLink(record, proCodeLinkTableDataRef.current)}
            >
              删除
            </Button>
          </div>
        );
      },
    },
  ];

  /**
   * 打开代码映射对话框
   * @param {Object} record 行数据
   */
  const handleShowModal = record => {
    console.log('代码映射');
    modalTitle.current = `${record.proName} : ${record.proCode}`;
    proCodeLinkData.current = record.proCode;
    handleGetCodeLinkTable(proCodeLinkData.current);
    setModalShowAndOff(true);
  };

  const handleCloseModal = () => {
    setModalShowAndOff(false);
  };

  // 产品关联(新增行)
  const handleAddProCodeLink = () => {
    const len = proCodeLinkTableDataRef.current.length;

    if (JSON.stringify(proCodeLinkTableDataRef.current) === '[]') {
      proCodeLinkTableDataRef.current = [...proCodeLinkTableDataRef.current, codelinkObj];
      setProCodeLinkTableData([...proCodeLinkTableDataRef.current]);
    } else if (proCodeLinkTableDataRef.current[len - 1].id) {
      proCodeLinkTableDataRef.current = [...proCodeLinkTableDataRef.current, codelinkObj];
      setProCodeLinkTableData([...proCodeLinkTableDataRef.current]);
    } else {
      message.warn('已有未保存的代码映射选项 , 请保存后再次新增 !', 1);
    }
  };

  // 代码映射(保存)
  const handleCommitCodeLink = () => {
    confirm({
      title: `代码映射`,
      content: '确定要保存吗?',
      onOk() {
        handleUpdateCodeLink(proCodeLinkTableDataRef.current);
      },
      onCancel() {},
    });
  };

  /**
   * 代码映射(取消/删除)
   * @param {Object} record 行数据
   * @param {Object} data 表格数据
   */
  const handleCancelCodeLink = (record, data) => {
    const da = cloneDeep(data);
    if (!record.id) {
      for (const key in da) {
        if (JSON.stringify(record) === JSON.stringify(da[key])) {
          da.splice(key, 1);
        }
      }
      proCodeLinkTableDataRef.current = da;
      setProCodeLinkTableData([...da]);
    } else {
      confirm({
        title: `确认框`,
        content: '请确认是否删除?',
        onOk() {
          if (record.id) {
            if (proCodeLinkTableDataRef.current.length === 1) {
              proCodeLinkTableDataRef.current = [codelinkObj];
              setProCodeLinkTableData([codelinkObj]);
              handleUpdateCodeLink(proCodeLinkTableDataRef.current);
            } else {
              for (const key in da) {
                if (record.id === da[key].id) {
                  da.splice(key, 1);
                }
              }
              proCodeLinkTableDataRef.current = da;
              setProCodeLinkTableData([...da]);
              handleUpdateCodeLink(proCodeLinkTableDataRef.current);
            }
          }
        },
        onCancel() {},
      });
    }
  };

  // 代码映射
  const handleAddModal = () => {
    return (
      <Modal
        className={styles.proLinkModal}
        title={modalTitle.current}
        visible={modalShowAndOff}
        onOk={() => handleCommitCodeLink()}
        onCancel={handleCloseModal}
      >
        <Button type="primary" className={styles.linkButtonStyle} onClick={handleAddProCodeLink}>
          新增代码映射
        </Button>
        <Table
          style={{ marginTop: 16 }}
          loading={listLoading4}
          size="small"
          rowKey={record => record.id}
          dataSource={proCodeLinkTableData}
          columns={proCodeLinkColumns}
        />
      </Modal>
    );
  };

  // useEffect(() => {
  //   handleAddModal();
  // }, [proCodeLinkTableDataRef.current]);

  useEffect(() => {
    handleGetSelectOptions(); // 请求:获取词汇字典数据
    handleGetProTypeData();
    handleGetProNameAndCode(); // 请求:获取产品全称/代码下拉列表
    hendleGetInvestmentManagerData(); // 请求:获取投资经理下拉列表
    handleGetSeriesName(); // 请求:获取系列名称下拉列表
    handleGetProductStageData(); // 请求:产品看板阶段概述数据
    handleGetListData(); // 请求:获取分页列表数据请求(产品看板)
    handleGetListNewData(); // 请求:获取分页列表数据请求(系列看板-父级)
  }, []);

  return <>{handleAddRadio()}</>;
};

const WrappedIndexForm = errorBoundary(
  Form.create()(
    connect(({ productBillboard, loading }) => ({
      productBillboard,
      listLoading: loading.effects['productBillboard/fetch'],
      listLoading1: loading.effects['productBillboard/newFetch'],
      listLoading2: loading.effects['productBillboard/newChildFetch'],
      listLoading4: loading.effects['productBillboard/codeLinkTableDataFunc'],
    }))(Index),
  ),
);

export default WrappedIndexForm;
