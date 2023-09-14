/**
 * 产品看板-查看产品-产品数据
 */
import React, { useContext, useRef } from 'react';
import { Tabs, Row, Col, Spin, Modal } from 'antd';
import { errorBoundary } from '@/layouts/ErrorBoundary';
import { connect, routerRedux } from 'dva';
import MyContext from './myContext';
import styles from './index.less';
import ProductMessageInfo from './productMessageInfo';
import ProductMessageOther from './productMessageOther';
import ProductMessageEntrustAsset from './productMessageEntrustAsset';
import ProductMessageShareHolder from './productMessageShareHolder';
import ProductMessagePerforCompens from './productMessagePerforCompens';
import ProductMessageProGrade from './productMessageProGrade';
import ProductMessageServiceOrganization from './productMessageServiceOrganization';
import ProductMessageRate from './productMessageRate';
import ProductMessageRelationInspect from './productMessageRelationInspect';
import ProductMessageRaise from './productMessageRaise';
import ProductMessageOwnFunds from './productMessageOwnFunds';
import ProductMessageEstablish from './productMessageEstablish';
import ProductMessageTermination from './productMessageTermination';
import ProductMessageLiquidation from './productMessageLiquidation';
import ProductMessageArgumentsSet from './productMessageArgumentsSet';
import ProductMessageRegulationConstituents from './productMessageRegulationConstituents';

const { TabPane } = Tabs;
const { confirm } = Modal;

const ProductMessage = ({
  dispatch,
  listLoading,
  listLoadingA,
  productBillboard: { productOverviewMessage, productOverviewTable },
}) => {
  const {
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
  } = useContext(MyContext); // 子组件接受的数据
  const typeData = useRef('');

  /**
   * 切换Tabs页key值
   *@param {String} key Tabs页key值
   */
  const handleCutTabs = key => {
    const listData = [
      'productInfo',
      'entrustAsset',
      'shareHolder',
      'otherInfo',
      'perforCompens',
      'serviceOrg',
      'proGrade',
      'rate',
      'raise',
      'ownFunds',
      'termination',
      'establish',
      'liquidation',
    ];
    const tableData = ['relationInspect'];
    if (tableData.includes(key)) {
      handleGetProductOverivewTable(proCodeArguments, key);
    }
    if (listData.includes(key)) {
      handleGetProductOverivewMessage(proCodeArguments, key);
    }
    if (key === 'RC') {
      handleGetRCData(proCodeArguments);
    }
    if (key === 'AS') {
      handleGetASData(proCodeArguments);
    }
  };

  const handleGetASData = proCode => {
    dispatch({
      type: 'productBillboard/getASFunc',
      payload: proCode,
    });
  };

  // 监管要素详情页
  const handleGetRCData = proCode => {
    dispatch({
      type: 'productBillboard/getRCFunc',
      payload: proCode,
    });
  };

  /**
   *获取产品概述信息(表格信息)
   *@param {String} proCode 参数值
   *@param {String} type 列表关键字(根据关键字获取不同的列表数据)
   */
  const handleGetProductOverivewTable = (proCode, type) => {
    dispatch({
      type: 'productBillboard/overviewMessageTableData',
      payload: { proCode, pageNum: 1, pageSize: 10, type: type },
    });
  };

  /**
   * 获取产品信息(栅格信息)
   * @param {String} code 产品代码
   * @param {String} type 参数值
   */
  const handleGetProductOverivewMessage = (code, type) => {
    dispatch({
      type: 'productBillboard/overviewMessageListData',
      payload: { proCode: code, type: type },
    });
  };

  // 表格多选框
  const rowSelection = {
    onChange: selectedRowKeys => {
      batchData.current = selectedRowKeys;
    },
  };

  /** `
   * 信息渲染(公共)
   * @param {dataTitle} String 页标题
   * @param {dataName} Object 数据名称
   * @param {data} Object 数据源
   */
  const handleAddbaseData = (dataTitle, dataName, data) => {
    const rowColData = [];
    for (const key in data) {
      if (typeof dataName[key] !== 'undefined') {
        rowColData.push(
          <Col span={6} className={styles.rowColBody}>
            <span className={styles.dataName}>{dataName[key]}：</span>
            {handleUpdateNameValue(data[key])}
          </Col>,
        );
      }
    }
    return (
      <div className={styles.dataTitle}>
        <Row>
          <h3 style={{ fontSize: '20px', paddingBottom: '10px', fontWeight: 'bold' }}>
            {dataTitle}
          </h3>
          {rowColData}
        </Row>
      </div>
    );
  };

  /** `
   * Col信息渲染(公共)
   * @param {dataTitle} String 页标题
   * @param {dataName} Object 数据名称
   * @param {data} Object 数据源
   */
  const handleAddbaseColData = (dataTitle, dataName, data) => {
    const rowColData = [];
    for (const key in data) {
      if (typeof data[key] === 'string' || 'number') {
        if (typeof dataName[key] !== 'undefined') {
          rowColData.push(
            <Col span={6} className={styles.rowColBody}>
              <span style={{ fontWeight: '700', fontSize: '15px' }}>{dataName[key]}：</span>
              {data[key]}
            </Col>,
          );
        }
      }
    }
    return (
      <div className={styles.dataTitle}>
        <Row>{rowColData}</Row>
      </div>
    );
  };

  /**
   * 动态渲染:下属产品Tabs页(是否结构化产品)
   * @param {String} dataTitle 页标题
   * @param {String} keyData 列表参数关键字
   */
  const handleShowAffiliateProductTabPane = (dataTitle, keyData) => {
    if (isStructproShow.current === '1') {
      return (
        <TabPane tab={dataTitle} key={keyData}>
          <MyContext.Provider
            value={{ proCodeArguments, codeListData, codeListCodeData, proDictsObj }}
          >
            <ProductMessageProGrade />
          </MyContext.Provider>
        </TabPane>
      );
    }
  };

  /**
   * 服务机构跳转方法集合(暂跳看板主页)
   */
  const handleGoProductBillboard = () => {
    dispatch(
      routerRedux.push({
        pathname: './index',
        // query: { ...params },
      }),
    );
  };

  /**
   * 募集信息Tabs页动态展示(依于否结构化产品)
   * @param {dataTitle} 页标题
   */
  const handleShowRaiseData = dataTitle => {
    const ruleData = ['A002_2', 'A002_3'];
    if (ruleData.includes(proTypeArguments)) {
      return (
        <TabPane tab={dataTitle} key="raise">
          <MyContext.Provider
            value={{ proCodeArguments, codeListData, codeListCodeData, proDictsObj }}
          >
            <ProductMessageRaise />
          </MyContext.Provider>
        </TabPane>
      );
    }
  };

  /**
   * 成立信息Tabs页子项动态展示(依于产品类型:单一/集合)
   * @param {dataTile} String 页标题
   * @param {dataName} Object 数据名称
   */
  const handleShowSetUpChildData = (dataTile, dataName) => {
    const ruleData = ['A002_2', 'A002_3'];
    if (ruleData.includes(proTypeArguments)) {
      if (JSON.stringify(productOverviewMessage) !== '{}') {
        return [
          handleAddbaseData(dataTile, dataName, productOverviewMessage.establish),
          // handleAddbaseColData(dataTile, dataName, productOverviewMessage.establish.proMap),
        ];
      }
    } else if (JSON.stringify(productOverviewMessage) !== '{}') {
      return handleAddbaseData(dataTile, dataName, productOverviewMessage.establish /* .proMap */);
    }
  };

  /**
   * 产品概述信息加载状态
   * @param {String} dataTitle 页标题
   * @param {Object} dataName 标题数据源
   */
  const handleIfProductOverviewMessage = (dataTitle, dataName) => {
    if (JSON.stringify(productOverviewMessage) === '{}') {
      return <Spin />;
    }
    return handleAddbaseData(dataTitle, dataName, productOverviewMessage);
  };

  /**
   * 份额持有人大会及日常机构Tabs页展示控制
   */
  const handleAddshareHolder = () => {
    const arr = ['A002_2', 'A002_3'];
    if (arr.includes(proTypeArguments)) {
      return (
        <TabPane tab="份额持有人大会及日常机构" key="shareHolder">
          <MyContext.Provider
            value={{ proCodeArguments, codeListData, codeListCodeData, proDictsObj }}
          >
            <ProductMessageShareHolder />
          </MyContext.Provider>
        </TabPane>
      );
    }
  };

  /**
   * 委托财产Tabs展示控制
   */
  const handleAddEntrustasset = () => {
    if (proTypeArguments === 'A002_1') {
      return (
        <TabPane tab="委托财产" key="entrustAsset">
          <MyContext.Provider
            value={{ proCodeArguments, codeListData, codeListCodeData, proDictsObj }}
          >
            <ProductMessageEntrustAsset />
          </MyContext.Provider>
        </TabPane>
      );
    }
  };

  /**
   * 创建Tabs标签页
   */
  const handleAddTabs = () => {
    return (
      <Tabs defaultActiveKey="基础信息" tabPosition="right" onChange={handleCutTabs}>
        <TabPane tab="基础信息" key="productInfo">
          <MyContext.Provider
            value={{
              proTypeArguments,
              proCodeArguments,
              codeListData,
              codeListCodeData,
              codeListOrgCodeData,
              codeListOrgData,
              proDictsObj,
              orgBelongCodeData,
              orgBelongData,
              orgBelongObj,
              proConsignerCodeData,
              proConsignerListData,
              proConsignerObj,
            }}
          >
            <ProductMessageInfo />
          </MyContext.Provider>
        </TabPane>
        {handleShowAffiliateProductTabPane('下属产品', 'proGrade')}
        {handleAddEntrustasset()}
        {handleAddshareHolder()}
        <TabPane tab="其他信息" key="otherInfo">
          <MyContext.Provider
            value={{
              proTypeArguments,
              proCodeArguments,
              codeListData,
              codeListCodeData,
              proDictsObj,
            }}
          >
            <ProductMessageOther />
          </MyContext.Provider>
        </TabPane>
        <TabPane tab="服务机构" key="serviceOrg">
          <MyContext.Provider
            value={{
              proTypeArguments,
              proCodeArguments,
              codeListData,
              codeListCodeData,
              proDictsObj,
              codeListOrgCodeData,
              codeListOrgData,
              allDictdOrgObj,
            }}
          >
            <ProductMessageServiceOrganization />
          </MyContext.Provider>
        </TabPane>
        <TabPane tab="费率信息" key="rate">
          <MyContext.Provider
            value={{
              proTypeArguments,
              proCodeArguments,
              codeListData,
              codeListCodeData,
              proDictsObj,
            }}
          >
            <ProductMessageRate />
          </MyContext.Provider>
        </TabPane>
        <TabPane tab="业绩报酬信息" key="perforCompens">
          <MyContext.Provider
            value={{
              proTypeArguments,
              proCodeArguments,
              codeListData,
              codeListCodeData,
              proDictsObj,
            }}
          >
            <ProductMessagePerforCompens />
          </MyContext.Provider>
        </TabPane>
        {handleShowRaiseData('募集信息')}
        {/* <TabPane tab="关联方参与信息" key="relationInspect">
          <MyContext.Provider
            value={{
              proTypeArguments,
              proCodeArguments,
              codeListData,
              codeListCodeData,
              proDictsObj,
            }}
          >
            <ProductMessageRelationInspect />
          </MyContext.Provider>
        </TabPane> */}
        {/* <TabPane tab="自有资金参与信息" key="ownFunds">
          <MyContext.Provider
            value={{
              proTypeArguments,
              proCodeArguments,
              codeListData,
              codeListCodeData,
              proDictsObj,
            }}
          >
            <ProductMessageOwnFunds />
          </MyContext.Provider>
        </TabPane> */}
        <TabPane tab="成立信息" key="establish">
          <MyContext.Provider
            value={{
              proTypeArguments,
              proCodeArguments,
              codeListData,
              codeListCodeData,
              proDictsObj,
              codeListOrgCodeData,
              codeListOrgData,
              allDictdOrgObj,
            }}
          >
            <ProductMessageEstablish />
          </MyContext.Provider>
        </TabPane>
        <TabPane tab="终止信息" key="termination">
          <MyContext.Provider
            value={{
              proTypeArguments,
              proCodeArguments,
              codeListData,
              codeListCodeData,
              proDictsObj,
              codeListOrgCodeData,
              codeListOrgData,
            }}
          >
            <ProductMessageTermination />
          </MyContext.Provider>
        </TabPane>
        <TabPane tab="清盘信息" key="liquidation">
          <MyContext.Provider
            value={{
              proTypeArguments,
              proCodeArguments,
              codeListData,
              codeListCodeData,
              proDictsObj,
            }}
          >
            <ProductMessageLiquidation />
          </MyContext.Provider>
        </TabPane>
        {/* <TabPane tab="参数设置" key="AS">
          <MyContext.Provider
            value={{
              proTypeArguments,
              proCodeArguments,
              codeListData,
              codeListCodeData,
              proDictsObj,
            }}
          >
            <ProductMessageArgumentsSet />
          </MyContext.Provider>
        </TabPane> */}
        <TabPane tab="监管要素" key="RC">
          <MyContext.Provider
            value={{
              proTypeArguments,
              proCodeArguments,
              codeListData,
              codeListCodeData,
              proDictsObj,
            }}
          >
            <ProductMessageRegulationConstituents />
          </MyContext.Provider>
        </TabPane>
      </Tabs>
    );
  };

  return <div>{handleAddTabs()}</div>;
};

const WrappedIndexForm = errorBoundary(
  connect(({ productBillboard, loading }) => ({
    productBillboard,
    listLoading: loading.effects['productBillboard/overviewMessageListData'],
    listLoadingA: loading.effects['productBillboard/overviewMessageTableData'],
  }))(ProductMessage),
);

export default WrappedIndexForm;
