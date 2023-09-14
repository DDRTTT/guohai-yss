/**
 * 系列视图-查看产品
 */
import React, { useEffect, useRef, useState } from 'react';
import { Button, Col, Form, message, Row, Spin, Tabs } from 'antd';
import { errorBoundary } from '@/layouts/ErrorBoundary';
import { connect, routerRedux } from 'dva';
import router from 'umi/router';
import MyContext from './myContext';
import styles from './index.less';
import ReviewRecord from './reviewRecord';
import SubordinateSeries from './subordinateSeries';
import SeriesProduct from './seriesProduct';
import { handleAddCustomTooltip } from './baseFunc';
import { PageContainers } from '@/components';

const { TabPane } = Tabs;

const SeriesData = ({ dispatch, productBillboard: { productBillboardServicesOverview } }) => {
  const [codeListCodeData, setCodeListCodeData] = useState([]); // 词汇字典code
  const [codeListData, setCodeListData] = useState({}); // 词汇字典value:key
  const dictdObj = useRef({}); // 词汇字典集合
  const [codeListOrgCodeData, setCodeListOrgCodeData] = useState([]); // 机构字典code
  const [codeListOrgData, setCodeListOrgData] = useState({}); // 机构字典value:key
  const dictdOrgObj = useRef({}); // 机构字典集合
  const receiveArguments = useRef('');
  const proCodeArguments = receiveArguments.current;
  const proCustodianList = useRef([]); // 委托人下拉列表
  const proTrusBankList = useRef([]); // 托管人下拉列表
  const [orgBelongCodeData, setOrgBelongCodeData] = useState([]); // 产品归属部门code
  const [orgBelongData, setOrgBelongData] = useState({}); // 产品归属部门value:key
  const orgBelongObj = useRef({}); // 归属部门字典集合
  const [proConsignerCodeData, setProConsignerCodeData] = useState([]); // 委托人下拉
  const [proConsignerListData, setproConsignerListData] = useState({}); // 委托人value:key
  const proConsignerObj = useRef({}); // 委托人集合
  const [investmentManagerCodeData, setInvestmentManagerCodeData] = useState([]); // 投资经理code
  const [investmentManagerData, setInvestmentManagerData] = useState([]); // 投资经理value
  const investmentManagerObj = useRef({}); // 投资经理集合

  // 系列产品
  const dataNewObj = useRef({}); // 请求参数
  const pageNumNewData = useRef(1); // 当前页面页数
  const pageSizeNewData = useRef(10); // 当前页面展示数量
  const directionNewData = useRef(''); // 排序方式
  const fieldNewData = useRef(''); // 排序依据

  // 系列概述信息
  const productData = {
    proName: '系列全称：',
    proCode: '系列号：',
    upstairsSeries: '上级系列：',
    proTypeName: '产品类型：',
    operationWay: '运作方式：',
    proRisk: '风险等级：',
    proArchivalType: '投资类型：',
    proBelongDepartment: '产品归属部门：',
    investmentManager: '投资经理：',
    isStructpro: '是否结构化产品：',
    customerType: '客户类型：',
    canOwnfundParticipation: '是否允许自有资金参与：',
  };

  // 产品概述信息(超链接)
  const productTrusBank = {
    proCustodian: '管理人：',
  };

  const proConsignerData = {
    proConsigner: '委托人：',
  };

  /**
   * 获取url参数
   * @param {String} variable 参数名称
   */
  const handleGetUrlParam = variable => {
    const query = window.location.search.substring(1);
    const vars = query.split('&');
    for (let i = 0; i < vars.length; i++) {
      const pair = vars[i].split('=');
      if (pair[0] == variable) {
        return (receiveArguments.current = pair[1]);
      }
    }
    return message.error('参数接收错误');
  };

  /**
   *获取产品概述信息
   */
  const handleGetProductOverivew = () => {
    dispatch({
      type: 'productBillboard/newOverview',
      payload: receiveArguments.current,
    });
  };

  /**
   * 获取机构下拉字典
   * @param {String} code 机构查询参数
   * @param {Object} refData 机构赋值对象
   */
  const handleGetOrgDicts = () => {
    dispatch({
      type: 'productBillboard/getOrgDictsFunc',
      payload: '',
      callback: res => {
        handleUpdateOrgDicts(res); // 处理:机构下拉数据
        dictdOrgObj.current = res;
      },
    });
  };

  /**
   * 获取机构下拉字典(管理人/托管人)
   * @param {String} code 机构查询参数
   * @param {Object} refData 机构赋值对象
   */
  const handleGetOrgNewDicts = (code, refData) => {
    dispatch({
      type: 'productBillboard/getOrgDictsFunc',
      payload: code,
      callback: res => {
        refData.current = res;
      },
    });
  };

  /**
   * 获取产品归属部门下拉列表
   * @param {Object} refData 机构赋值对象
   */
  const handleGetOrgBelong = refData => {
    dispatch({
      type: 'productBillboard/getOrgBelongFunc',
      callback: res => {
        handleUpOrgBelongData(res, 'id', 'deptName', setOrgBelongCodeData, setOrgBelongData);
        refData.current = res;
      },
    });
  };

  /**
   * 更新产品归属部门下列表(公用)
   * @param {Object} res 数据源
   */
  const handleUpOrgBelongData = (res, code, name, func1, func2) => {
    const obj = {};
    const objCodeArr = [];
    if (typeof res !== '[]') {
      for (const key in res) {
        obj[res[key][code]] = res[key][name];
        objCodeArr.push(res[key][code]);
      }
      func1(objCodeArr);
      func2(obj);
    }
  };

  /**
   * 获取委托人下拉列表
   * @param {Object} refData 机构赋值对象Ï
   */
  const handleGetProConsigner = refData => {
    dispatch({
      type: 'productBillboard/getProConsignerFunc',
      callback: res => {
        handleUpOrgBelongData(
          res,
          'id',
          'clientName',
          setProConsignerCodeData,
          setproConsignerListData,
        );
        refData.current = res;
      },
    });
  };

  /**
   * 请求:获取投资经理下拉列表
   *@method hendleGetInvestmentManagerData
   */
  const hendleGetInvestmentManagerData = () => {
    dispatch({
      type: 'productBillboard/getInvestmentManagerFunc',
      callback: res => {
        handleUpOrgBelongData(
          res,
          'empNo',
          'name',
          setInvestmentManagerCodeData,
          setInvestmentManagerData,
        );
        investmentManagerObj.current = res;
      },
    });
  };

  /**
   * 请求:数据字典下拉列表数据
   */
  const handleGetSelectOptions = () => {
    dispatch({
      type: 'productBillboard/getDicts',
      payload: {
        codeList: [
          'A002',
          'D010',
          'E001',
          'R001',
          'R003',
          'X006',
          'X007',
          'X014',
          'X016',
          'M002',
          'P001',
          'I009',
          'M007',
          'M008',
          'M009',
          'M010',
          'M011',
          'T006',
          'SM001',
          'ST001',
          'SC001',
          'GT001',
          'MF001',
        ],
      },
      callback: res => {
        handleUpdateDicts(res); // 处理:词汇字典数据
        dictdObj.current = res;
      },
    });
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
    setCodeListCodeData(objCodeArr);
    setCodeListData(obj);
  };

  /**
   * 产品概述信息加载状态
   *@param {String} dataName 标题名称1
   *@param {String} dataCode 标题名称3
   */
  const handleIfProductOverviewTitle = (dataName, dataCode) => {
    if (JSON.stringify(productBillboardServicesOverview.data) === '{}') {
      return <Spin />;
    }
    return `
        ${productBillboardServicesOverview[dataName]}——
        ${productBillboardServicesOverview[dataCode]}
      `;
  };

  /**
   * 词汇替换(字典)
   * @param {String} val 词汇值
   */
  const handleUpdateNameValue = val => {
    if (Array.isArray(val)) {
      const arr = [];
      for (const key of val) {
        if (codeListCodeData.includes(key)) {
          arr.push(codeListData[key]);
        }
      }
      return arr;
    }
    if (codeListCodeData.includes(val)) {
      return codeListData[val];
    }
    return val;
  };

  /**
   * 词汇替换(是否)
   * @param {String} val 词汇值
   */
  const handleUpdateNameValueYesAndNo = val => {
    if (val === '1') {
      return '是';
    }
    if (val === '0') {
      return '否';
    }
    return val;
  };

  /**
   * 跳转(托管行详情页)
   */
  const handleGoTrusBankPages = val => {
    router.push(`/productDataManage/institutionalInfoManager/details?id=${val}`);
  };

  /**
   * 跳转(托管行详情页)
   */
  const handleGoProConsignerPages = () => {
    if (
      productBillboardServicesOverview.busIdList &&
      productBillboardServicesOverview.proConsigner
    ) {
      const id = productBillboardServicesOverview.proConsigner;
      const d1 = productBillboardServicesOverview.busIdList[0];
      const d2 = productBillboardServicesOverview.busIdList[1];
      router.push(
        `/productDataManage/myInvestor/newInvestor?id=${id}&dis=true&busIdList=${d1}&busIdList=${d2}`,
      );
    }
  };

  /**
   * 更新机构下拉值键值对对象
   * @param {Object} res 数据源
   */
  const handleUpdateOrgDicts = res => {
    const obj = {};
    const objCodeArr = [];
    if (typeof res !== '[]') {
      for (const key in res) {
        obj[res[key].id] = res[key].orgName;
        objCodeArr.push(res[key].id);
      }
      setCodeListOrgCodeData(objCodeArr);
      setCodeListOrgData(obj);
    }
  };

  /**
   * 词汇替换(托管人,管理人)
   * @param {String} val 词汇值
   */
  const handleUpdateOrgName = val => {
    if (codeListOrgCodeData.includes(val)) {
      return codeListOrgData[val];
    }
    return val;
  };

  /**
   * 词汇替换(委托人)
   * @param {String} val 词汇值
   */
  const handleUpdateProConsigner = val => {
    if (proConsignerCodeData.includes(val)) {
      return proConsignerListData[val];
    }
    return val;
  };

  /**
   * 词汇替换(投资经理)
   * @param {String} val 词汇值
   */
  const handleUpDateInvestmentManager = val => {
    if (Array.isArray(val)) {
      const arr = [];
      for (const key of val) {
        if (investmentManagerCodeData.includes(key)) {
          arr.push(investmentManagerData[key]);
        } else {
          arr.push(key);
        }
      }
      return arr;
    }
    return val;
  };

  /**
   * 词汇替换(产品归属部门)
   * @param {String} val 词汇值
   */
  const handleUpdateOrgBelong = val => {
    if (Array.isArray(val)) {
      const arr = [];
      for (const key of val) {
        if (orgBelongCodeData.includes(key)) {
          arr.push(orgBelongData[key]);
        } else {
          arr.push(key);
        }
      }
      return arr;
    }
    return val;
  };

  /**
   *产品数据渲染
   */
  const handleAddData = (data, wordsChange) => {
    const arr = [];
    if (data) {
      for (const key in data) {
        if (typeof productData[key] !== 'undefined') {
          arr.push(
            <Col span={6} className={styles.titleRowColBody}>
              <span className={styles.dataName}>{productData[key]}</span>
              {handleAddCustomTooltip(wordsChange(data[key], productData[key]), 10)}
            </Col>,
          );
        } else if (typeof productTrusBank[key] !== 'undefined') {
          arr.push(
            <Col span={6} className={styles.titleRowColBody}>
              <div className={styles.divClick} onClick={() => handleGoTrusBankPages(data[key])}>
                <span className={styles.dataName}>{productTrusBank[key]}</span>
                {handleAddCustomTooltip(wordsChange(data[key], productTrusBank[key]), 10)}
              </div>
            </Col>,
          );
        } else if (typeof proConsignerData[key] !== 'undefined') {
          arr.push(
            <Col span={6} className={styles.titleRowColBody}>
              <div className={styles.divClick} onClick={() => handleGoProConsignerPages(data[key])}>
                <span className={styles.dataName}>{proConsignerData[key]}</span>
                {handleAddCustomTooltip(wordsChange(data[key], proConsignerData[key]), 10)}
              </div>
            </Col>,
          );
        }
      }
    }
    return (
      <div className={styles.bodyData} style={{ height: 'calc(100vh - 200px)', overflowY: 'auto' }}>
        <Row>
          <h2 style={{ fontSize: '24px', paddingBottom: '10px', fontWeight: 'bold' }}>
            {handleIfProductOverviewTitle('proName', 'proCode')}
          </h2>
          {arr}
          <Button
            style={{ position: 'relative', left: '18%', bottom: '135px' }}
            onClick={handleGoProductBillboard}
          >
            返回
          </Button>
        </Row>
        {handleAddTabs()}
      </div>
    );
  };

  // 返回按钮(返回产品视图)
  const handleGoProductBillboard = () => {
    dispatch(
      routerRedux.push({
        pathname: './index',
        // query: { ...params },
      }),
    );
  };

  // 创建Tabs标签页
  const handleAddTabs = () => {
    return (
      <Tabs defaultActiveKey="1" className={styles.bgcFFF}>
        <TabPane tab="下级系列" key="1" className={styles.tabsTabPane}>
          <MyContext.Provider value={{ proCodeArguments }}>
            <SubordinateSeries />
          </MyContext.Provider>
        </TabPane>
        <TabPane tab="系列产品" key="2" className={styles.tabsTabPane}>
          <MyContext.Provider value={{ proCodeArguments }}>
            <SeriesProduct />
          </MyContext.Provider>
        </TabPane>
        <TabPane tab="评审记录" key="3" className={styles.tabsTabPane}>
          <MyContext.Provider value={{ proCodeArguments }}>
            <ReviewRecord />
          </MyContext.Provider>
        </TabPane>
      </Tabs>
    );
  };

  useEffect(() => {
    handleGetSelectOptions();
    handleGetUrlParam('proCode', receiveArguments); // 获取url参数
    handleGetOrgDicts(); // 请求:获取机构下拉字典
    handleGetOrgNewDicts('J004_1', proCustodianList); // 管理人下拉列表
    handleGetOrgNewDicts('J004_2', proTrusBankList); // 托管人下拉列表
    handleGetOrgBelong(orgBelongObj); // 请求:获取产品归属部门下拉数据
    handleGetProConsigner(proConsignerObj); // 请求:获取委托人下拉数据
    hendleGetInvestmentManagerData(); // 请求:获取投资经理下拉列表
    handleGetProductOverivew(); // 请求:获取概述信息
  }, []);

  const arrDicts = ['产品类型：', '风险等级：', '运作方式：', '投资类型：', '客户类型：'];
  const arrOgrBelong = ['产品归属部门：'];
  const arrOrgDicts = ['管理人：', '托管人：'];
  const yesAndNoArr = ['是否允许自有资金参与：', '是否结构化产品：'];

  const handleChangeWords = (val, val2) => {
    if (arrDicts.includes(val2)) {
      return handleUpdateNameValue(val);
    }
    if (arrOrgDicts.includes(val2)) {
      return handleUpdateOrgName(val);
    }
    if (arrOgrBelong.includes(val2)) {
      return handleUpdateOrgBelong(val);
    }
    if (yesAndNoArr.includes(val2)) {
      return handleUpdateNameValueYesAndNo(val);
    }
    if (val2 === '委托人：') {
      return handleUpdateProConsigner(val);
    }
    if (val2 === '投资经理：') {
      return handleUpDateInvestmentManager(val);
    }
    return val;
  };

  return (
    <PageContainers
      breadcrumb={[
        {
          title: '产品生命周期',
          url: '',
        },
        {
          title: '系列看板',
          url: '/productLifecycle/productBillboard/index',
        },
        {
          title: '查看',
          url: '',
        },
      ]}
    >
      {handleAddData(productBillboardServicesOverview, handleChangeWords)}
    </PageContainers>
  );
};

const WrappedIndexForm = errorBoundary(
  Form.create()(
    connect(({ productBillboard, loading }) => ({
      productBillboard,
    }))(SeriesData),
  ),
);

export default WrappedIndexForm;
