/**
 * 产品视图-查看产品
 */
import React, { useEffect, useRef, useState } from 'react';
import { Col, message, Row, Spin, Tabs } from 'antd';
import { errorBoundary } from '@/layouts/ErrorBoundary';
import { connect } from 'dva';
import router from 'umi/router';
import styles from './index.less';
import MyContext from './myContext';
import ProductLifeCycle from './productLifeCycle';
import TimeLine from './timeLine';
import ProductMessage from './productMessage';
import ProductFile from './productFile';
import Account from './account';
import DealConfirm from './dealConfirm';
import InformationDisclosure from './informationDisclosure';
import ReviewRecord from './reviewRecord';
import BonusOfDetail from './bonusOfDetail';
import Investor from './investor';
import Stakeholder from './stakeholder';
import SalesOrganization from './salesOrganization';
import { PageContainers } from '@/components';

const { TabPane } = Tabs;

const ProductData = ({ dispatch, productBillboard: { productBillboardProductOverview } }) => {
  const [loadingData, setLoadingData] = useState(true);
  const receiveArguments = useRef('');
  const isStructproShow = useRef(''); // 是否结构化产品
  const proTypeArguments = productBillboardProductOverview.proType;
  const proCodeArguments = receiveArguments.current;
  const [codeListCodeData, setCodeListCodeData] = useState([]); // 词汇字典code
  const [codeListData, setCodeListData] = useState({}); // 词汇字典value:key
  const dictdObj = useRef({}); // 词汇字典集合
  const [codeListOrgCodeData, setCodeListOrgCodeData] = useState([]); // 机构字典code
  const [codeListOrgData, setCodeListOrgData] = useState({}); // 机构字典value:key
  const dictdOrgObj = useRef({}); // 机构字典集合
  const [allDictdOrgObj, setAllDictdOrgObj] = useState({}); // 机构字典集合(看板专用)
  const [orgBelongCodeData, setOrgBelongCodeData] = useState([]); // 产品归属部门code
  const [orgBelongData, setOrgBelongData] = useState({}); // 产品归属部门value:key
  const orgBelongObj = useRef({}); // 归属部门字典集合
  const [proConsignerCodeData, setProConsignerCodeData] = useState([]); // 委托人下拉
  const [proConsignerListData, setproConsignerListData] = useState({}); // 委托人value:key
  const proConsignerObj = useRef({}); // 委托人集合
  const proCustodianList = useRef([]); // 管理人下拉列表
  const proTrusBankList = useRef([]); // 托管人下拉列表
  const proDictsObj = dictdObj.current;

  // 产品概述信息
  const productBaseData = {
    proName: '产品全称：',
    proCode: '产品代码：',
    proFname: '产品简称：',
    proCustodian: '管理人：',
    proTypeName: '产品类型：',
    proRisk: '风险等级：',
    recSdate: '募集开始日：',
    recEdate: '募集实际结束日：',
    proCdate: '产品成立日：',
    proEdate: '产品到期日：',
  };

  // 产品概述信息(超链接)
  const productTrusBank = {
    proTrusBank: '托管人：',
  };

  /**
   *获取url参数
   *@param {String} variable 参数名称
   *@param {String} paramName 参数值
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
   * 获取产品概述信息
   * @param {String} parma 参数值
   */
  const handleGetProductOverivew = parma => {
    dispatch({
      type: 'productBillboard/overview',
      payload: parma,
      callback: res => {
        isStructproShow.current = res.isStructpro;
        setLoadingData(false);
      },
    });
  };

  /**
   * 产品详细信息加载状态
   * @param {String} dataName 页面标题
   */
  const handleIfProductOverview = dataName => {
    if (JSON.stringify(productBillboardProductOverview.data) === '{}') {
      return <Spin size="small" />;
    }
    return productBillboardProductOverview[dataName];
  };

  /**
   * 返回按钮(返回产品视图)
   */
  const handleGoProductBillboard = () => {
    router.push('./index');
  };

  /**
   * 跳转(托管行详情页)
   */
  const handleGoTrusBankPages = val => {
    router.push(`/productDataManage/institutionalInfoManager/details?id=${val}`);
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
   * 词汇替换(产品归属部门)
   * @param {String} val 词汇值
   */
  const handleUpdateOrgBelong = val => {
    if (Array.isArray(val)) {
      const arr = [];
      for (const key of val) {
        if (orgBelongCodeData.includes(key)) {
          arr.push(orgBelongData[key]);
        } else if (!orgBelongCodeData.includes(key)) {
          arr.push(key);
        }
      }
      return arr;
    }
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

  const handle = data => {
    const item = (name, value) => [
      <Col span={2}>{name}</Col>,
      <Col span={4}>{value || '—'}</Col>,
      <Col span={1} />,
    ];

    data.map(n => {
      return [<Col span={2} />, n.map(i => item(i)), <Col span={1} />];
    });
  };

  /**
   *产品数据渲染
   */
  const handleAddData = data => {
    return (
      <Spin spinning={loadingData} size="large" style={{ backgroundColor: '#fff' }}>
        <div
          className={styles.bodyData}
          style={{ height: 'calc(100vh - 200px)', overflowY: 'auto' }}
        >
          <h2 style={{ fontSize: '24px', paddingBottom: '10px', fontWeight: 'bold' }}>
            {data.proName ? `${data.proName}\xa0\xa0——\xa0${data.proCode}` : ''}
          </h2>
          <div>
            <Row gutter={[16, 16]}>
              <Col span={2} />
              <Col span={2}>产品全称:</Col>
              <Col span={4}>{productBillboardProductOverview.proName || '—'}</Col>
              <Col span={1} />
              <Col span={2}>产品代码:</Col>
              <Col span={4}>{productBillboardProductOverview.proCode || '—'}</Col>
              <Col span={1} />
              <Col span={2}>产品简称:</Col>
              <Col span={4}>{productBillboardProductOverview.proFname || '—'}</Col>
              <Col span={2} />
            </Row>
            <Row gutter={[16, 16]}>
              <Col span={2} />
              <Col span={2}>管理人:</Col>
              <Col span={4}>{productBillboardProductOverview.proCustodian || '—'}</Col>
              <Col span={1} />
              <Col span={2}>产品类型:</Col>
              <Col span={4}>{productBillboardProductOverview.proTypeName || '—'}</Col>
              <Col span={1} />
              <Col span={2}>风险等级:</Col>
              <Col span={4}>{productBillboardProductOverview.proRisk || '—'}</Col>
              <Col span={1} />
              <Col span={1} />
            </Row>
            <Row gutter={[16, 16]}>
              <Col span={2} />
              <Col span={2}>募集开始日:</Col>
              <Col span={4}>{productBillboardProductOverview.recSdate || '—'}</Col>
              <Col span={1} />
              <Col span={2}>募集实际结束日:</Col>
              <Col span={4}>{productBillboardProductOverview.recEdate || '—'}</Col>
              <Col span={1} />
              <Col span={2}>产品成立日:</Col>
              <Col span={4}>{productBillboardProductOverview.proCdate || '—'}</Col>
              <Col span={1} />
              <Col span={1} />
            </Row>
            <Row gutter={[16, 16]}>
              <Col span={2} />
              <Col span={2}>产品到期日:</Col>
              <Col span={4}>{productBillboardProductOverview.proEdate || '—'}</Col>
              <Col span={1} />
            </Row>
          </div>
          <div style={{ clear: 'both' }}>{handleAddTabs()}</div>
        </div>
      </Spin>
    );
  };

  /**
   * TabPane渲染(交易确认)
   */
  const handleAddDealConfirmTabPane = () => {
    if (proTypeArguments === 'A002_1') {
      return (
        <TabPane tab="交易确认" key="6" className={styles.tabsTabPane}>
          <MyContext.Provider value={{ proTypeArguments, proCodeArguments }}>
            <DealConfirm />
          </MyContext.Provider>
        </TabPane>
      );
    }
  };

  // 创建Tabs标签页
  const handleAddTabs = () => {
    if (productBillboardProductOverview.proCode) {
      return (
        <Tabs defaultActiveKey="1" className={styles.bgcFFF}>
          <TabPane tab="产品生命周期" key="1" className={styles.tabsTabPane}>
            <MyContext.Provider value={{ proTypeArguments }}>
              <ProductLifeCycle />
            </MyContext.Provider>
          </TabPane>
          <TabPane tab="产品数据" key="3" className={styles.tabsTabPane}>
            <MyContext.Provider
              value={{
                isStructproShow,
                proTypeArguments,
                proCodeArguments,
                codeListCodeData,
                codeListData,
                codeListOrgCodeData,
                codeListOrgData,
                allDictdOrgObj,
                proDictsObj,
                orgBelongCodeData,
                orgBelongData,
                orgBelongObj,
                proConsignerCodeData,
                proConsignerListData,
                proConsignerObj,
              }}
            >
              <ProductMessage />
            </MyContext.Provider>
          </TabPane>
          <TabPane tab="账户" key="5" className={styles.tabsTabPane}>
            <MyContext.Provider value={{ proCodeArguments }}>
              <Account />
            </MyContext.Provider>
          </TabPane>
          <TabPane tab="时间轴" key="2" className={styles.tabsTabPane}>
            <MyContext.Provider value={{ proCodeArguments }}>
              <TimeLine />
            </MyContext.Provider>
          </TabPane>
          <TabPane tab="产品文档" key="4" className={styles.tabsTabPane}>
            <MyContext.Provider value={{ proCodeArguments }}>
              <ProductFile />
            </MyContext.Provider>
          </TabPane>
          {handleAddDealConfirmTabPane()}
          <TabPane tab="信披" key="7" className={styles.tabsTabPane}>
            <MyContext.Provider value={{ proCodeArguments }}>
              <InformationDisclosure />
            </MyContext.Provider>
          </TabPane>
          {/* <TabPane tab="定期报告" key="8" className={styles.tabsTabPane}>
            <MyContext.Provider value={{ proCodeArguments }}>
              <PeriodicReport />
            </MyContext.Provider>
          </TabPane> */}
          <TabPane tab="评审记录" key="9" className={styles.tabsTabPane}>
            <MyContext.Provider value={{ proCodeArguments }}>
              <ReviewRecord />
            </MyContext.Provider>
          </TabPane>
          <TabPane tab="分红明细" key="10" className={styles.tabsTabPane}>
            <MyContext.Provider value={{ proCodeArguments }}>
              <BonusOfDetail />
            </MyContext.Provider>
          </TabPane>
          <TabPane tab="投资者" key="11" className={styles.tabsTabPane}>
            <MyContext.Provider value={{ proCodeArguments, proDictsObj }}>
              <Investor />
            </MyContext.Provider>
          </TabPane>
          <TabPane tab="干系人" key="12" className={styles.tabsTabPane}>
            <MyContext.Provider value={{ proCodeArguments }}>
              <Stakeholder />
            </MyContext.Provider>
          </TabPane>
          <TabPane tab="销售机构" key="13" className={styles.tabsTabPane}>
            <MyContext.Provider value={{ proCodeArguments }}>
              <SalesOrganization />
            </MyContext.Provider>
          </TabPane>
        </Tabs>
      );
    }
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
   * 获取机构下拉字典(看板专用数据结构)
   * @param {String} code 机构查询参数
   * @param {Object} refData 机构赋值对象
   */
  const handleGetAllOrgDicts = () => {
    dispatch({
      type: 'productBillboard/getAllOrgDictsFunc',
      callback: res => {
        setAllDictdOrgObj(res);
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

  // 请求:数据字典下拉列表数据
  const handleGetSelectOptions = () => {
    dispatch({
      type: 'productBillboard/getDicts',
      payload: {
        codeList: [
          'A002',
          'C001',
          'D010',
          'E001',
          'R001',
          'GT001',
          'J004',
          'R003',
          'R005',
          'X006',
          'X007',
          'X014',
          'X016',
          'X017',
          'X018',
          'M002',
          'P001',
          'I009',
          'T005',
          'T007',
          'T008',
          'T009',
          'T010',
          'T011',
          'T012',
          'T015',
          'T016',
          'M003',
          'M004',
          'M006',
          'M007',
          'M008',
          'M009',
          'M010',
          'M011',
          'T006',
          'S003',
          'SM001',
          'ST001',
          'SC001',
          'U001',
          'MF001',
          'GDSY',
          'CPQY',
          'SPJR',
          'CPHH',
          'HTBG',
          'HTZZ',
          'addressCode',
          'proCreatedCondition',
          'annuityPlanType',
          'creditEnhanceType',
          'annuityEntrustedModel',
          'increaseCreditOrgType',
          'increaseCreditForm',
          'proVariety',
          'privateFundType',
          'AMACProType1',
          'AMACProType2',
          'AMACProType3',
          'AMACProType4',
          'AMACProType5',
          'AMACProType2DeferState',
          'SACProType',
          'SACProCateGory3',
          'assetManageProCateGory',
          'assetManageProCateGory1',
          'assetManageProCateGory2',
          'assetManageProCateGory3',
          'assetManageProCateGory4',
          'assetManageProCateGory5',
          'V001',
          'CS024',
          'CS025',
          'X008',
          'CS022',
          'CS001',
          'X012',
          'CS007',
          'CS026',
          'CS040',
          'CS041',
          'CS028',
          'CS027',
          'CS029',
          'CS030',
          'CS008',
          'CS031',
          'CS032',
          'CS033',
          'CS034',
          'DC001',
          'DI001',
          'investementStrategy',
          'mixedInvestmentBias',
          'listedFundType',
          'listedTradingPlace',
          'listedTradingPlace_domestic',
          'listedTradingPlace_abroad',
          'currentStop',
          'mainInvest',
          'productInferiorFundSource',
          'unitermBondPayRate',
          'financeMonthType2',
          'personalizedProType1',
          'seviceType',
          'personalizedProType2',
          'businessType',
          'personalizedInvestType',
          'personalizedInvestStrategy',
          'projectType',
          // 'investementStrategy',
          // 'mixedInvestmentBias',
          // 'domestic',
          // 'listedFundType',
          // 'mainInvest',
          // 'unitermBondPayRate',
          // 'financeMonthType2',
        ],
      },
      callback: res => {
        handleUpdateDicts(res); // 处理:词汇字典数据
        dictdObj.current = res;
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
        obj[res[key].id] = res[key][name];
        objCodeArr.push(res[key][code]);
      }
      func1(objCodeArr);
      func2(obj);
    }
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

  useEffect(() => {
    handleGetOrgNewDicts('J004_1', proCustodianList); // 管理人下拉列表
    handleGetOrgNewDicts('J004_2', proTrusBankList); // 托管人下拉列表
    handleGetOrgDicts(); // 请求:获取机构下拉值
    handleGetAllOrgDicts(); // 请求:获取机构字典结构数据
    handleGetSelectOptions(); // 请求:获取词汇字典数据
    handleGetOrgBelong(orgBelongObj); // 请求:获取产品归属部门下拉数据
    handleGetProConsigner(proConsignerObj); // 请求:获取委托人下拉数据
    handleGetUrlParam('proCode'); // 获取参数
    handleGetProductOverivew(receiveArguments.current); // 发起请求
  }, []);

  const arrDicts = ['产品类型：', '风险等级：'];
  const arrOgrBelong = ['产品归属部门：'];
  const arrOrgDicts = ['管理人：', '托管人：'];

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
          title: '产品看板',
          url: '/productLifecycle/productBillboard/index',
        },
        {
          title: '查看',
          url: '',
        },
      ]}
    >
      {handleAddData(productBillboardProductOverview, handleChangeWords)}
    </PageContainers>
  );
};

const WrappedIndexForm = errorBoundary(
  connect(({ productBillboard }) => ({
    productBillboard,
  }))(ProductData),
);

export default WrappedIndexForm;
