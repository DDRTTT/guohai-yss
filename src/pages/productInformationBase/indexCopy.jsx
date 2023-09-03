/**
 * 产品看板-查看产品-产品信息库
 */
 import React, { useContext, useEffect, useState } from 'react';
 import { Table, Tabs, Button, message, Card, Breadcrumb } from 'antd';
 import { connect, routerRedux } from 'dva';
 import router from 'umi/router';
 import { errorBoundary } from '@/layouts/ErrorBoundary';
 import styles from './index.less';
 import { handleAddHeard } from './baseFunc';

 const { TabPane } = Tabs;

 const url = '/dynamicPage/params';

 // 1.基础类
 const 机构基本信息 = {
   title: '机构基本信息',
   data: '信息主体 : 机构 , 介绍 ......',
   code: '机构基本信息',
 };
 const 联系人信息 = { title: '联系人信息', data: '信息主体 : 机构', code: '联系人信息' };
 const 高管信息 = { title: '高管信息', data: '信息主体 : 机构', code: '高管信息' };
 const 员工信息 = { title: '员工信息', data: '信息主体 : 机构', code: '员工信息' };
 const 系列信息 = { title: '系列信息', data: '信息主体 : 产品', code: '系列信息' };
 const 产品基本信息 = { title: '产品基本信息', data: '信息主体 : 产品', code: '产品基本信息' };
 const 下属产品信息 = { title: '下属产品信息', data: '信息主体 : 产品', code: '下属产品信息' };
 const 评审记录 = { title: '评审记录', data: '信息主体 : 产品', code: '评审记录' };
 const 基础类 = [
   机构基本信息,
   联系人信息,
   高管信息,
   员工信息,
   系列信息,
   产品基本信息,
   下属产品信息,
   评审记录,
 ];

 // 2.费用与业绩报酬类
 const 产品费用信息 = { title: '产品费用信息', data: '信息主体 : 产品', code: '产品费用信息' };
 const 业绩报酬信息 = { title: '业绩报酬信息', data: '信息主体 : 产品', code: '业绩报酬信息' };
 const 费用与业绩报酬类 = [产品费用信息,业绩报酬信息];

 // 3.投资运作类
 const 自有资金参与信息 = {
   title: '自有资金参与信息',
   data: '信息主体 : 产品',
   code: '自有资金参与信息',
 };
 const 投资经理变更信息 = {
   title: '投资经理变更信息',
   data: '信息主体 : 产品',
   code: '投资经理变更信息',
 };
 const 持有人大会信息 = { title: '持有人大会信息', data: '信息主体 : 产品', code: '持有人大会信息' };
 const 交易确认信息 = { title: '交易确认信息', data: '信息主体 : 产品', code: '交易确认信息' };
 const 投资运作类 = [自有资金参与信息, 投资经理变更信息, 持有人大会信息, 交易确认信息];

 // 4.收益分配类
 const 分红信息 = { title: '分红信息', data: '信息主体 : 产品', code: '分红信息' };
 const 收益分配类 = [分红信息];

 // 5.终止、清算类
 const 产品终止信息 = { title: '产品终止信息', data: '信息主体 : 产品', code: '产品终止信息' };
 const 产品清盘信息 = { title: '产品清盘信息', data: '信息主体 : 产品', code: '产品清盘信息' };
 const 终止清算类 = [产品终止信息, 产品清盘信息];

 // 6.信息披露类
 const 信披信息 = { title: '信披信息', data: '信息主体 : 产品', code: '信披信息' };
 const 定期报告信息 = { title: '定期报告信息', data: '信息主体 : 产品', code: '定期报告信息' };
 const 信息披露类 = [信披信息, 定期报告信息];

 // 7.估值运营类
 const 数据中心 = { title: '数据中心', data: '信息主体 : 产品', code: '数据中心' };
 const 估值运营类 = [数据中心];

 // 8.监管类
 const 监管要素信息 = {
   title: '监管要素信息',
   data: '信息主体 : 监管要素信息',
   code: '监管要素信息',
 };
 const 参数信息 = { title: '参数信息', data: '信息主体 : 监管要素信息', code: '参数信息' };
 const FISP = { title: 'FISP', data: '信息主体 : 监管要素信息', code: 'FISP' };
 const 人行 = { title: '人行', data: '信息主体 : 监管要素信息', code: '人行' };
 const 中证协 = { title: '中证协', data: '信息主体 : 监管要素信息', code: '中证协' };
 const 资管月周报 = { title: '资管月周报', data: '信息主体 : 监管要素信息', code: '资管月周报' };
 const 个性化内部报表 = {
   title: '个性化内部报表',
   data: '信息主体 : 监管要素信息',
   code: '个性化内部报表',
 };
 const 中基协 = { title: '中基协', data: '信息主体 : 监管要素信息', code: '中基协' };
 const 监管类 = [监管要素信息, 参数信息, FISP, 人行, 中证协, 资管月周报, 个性化内部报表, 中基协];

 // 9.干系人类
 const 干系人信息 = { title: '干系人信息', data: '信息主体 : 干系人', code: '干系人信息' };
 const 干系人类 = [干系人信息];

 // 10.销售发行类
 const 客户信息 = { title: '客户信息', data: '信息主体 : 客户', code: '客户信息' };
 const 受益所有人 = { title: '受益所有人', data: '信息主体 : 客户', code: '受益所有人' };
 const 投资者信息 = { title: '投资者信息(集合)', data: '信息主体 : 客户', code: '投资者信息' };
 const 销售机构信息 = { title: '销售机构信息', data: '信息主体 : 销售机构', code: '销售机构信息' };
 const 销售协议信息 = { title: '销售协议信息', data: '信息主体 : 销售机构', code: '销售协议信息' };
 const 交易限制信息 = { title: '交易限制信息', data: '信息主体 : 产品', code: '交易限制信息' };
 const 销售发行类 = [客户信息, 受益所有人, 投资者信息, 销售机构信息, 销售协议信息, 交易限制信息];

 // 11.账户类
 const 销售机构账户信息 = {
   title: '销售机构账户信息',
   data: '信息主体 : 销售机构',
   code: '销售机构账户信息',
 };
 const 账户信息 = { title: '账户信息', data: '信息主体 : 账户', code: '账户信息' };
 const 交易单元信息 = { title: '交易单元信息', data: '信息主体 : 账户', code: '交易单元信息' };
 const 账户类 = [销售机构账户信息, 账户信息, 交易单元信息];

 // 12.风险控制

 const 全部类 = [
   机构基本信息,
   联系人信息,
   高管信息,
   员工信息,
   系列信息,
   产品基本信息,
   下属产品信息,
   评审记录,
   产品费用信息,
   业绩报酬信息,
   自有资金参与信息,
   投资经理变更信息,
   持有人大会信息,
   交易确认信息,
   分红信息,
   产品清盘信息,
   信披信息,
   定期报告信息,
   数据中心,
   监管要素信息,
   参数信息,
   FISP,
   人行,
   中证协,
   资管月周报,
   个性化内部报表,
   中基协,
   干系人信息,
   客户信息,
   受益所有人,
   投资者信息,
   销售机构信息,
   销售协议信息,
   交易限制信息,
   销售机构账户信息,
   账户信息,
   交易单元信息,
 ];

 // 模糊查询
 const whole = [
   机构基本信息,
   联系人信息,
   高管信息,
   员工信息,
   系列信息,
   产品基本信息,
   下属产品信息,
   评审记录,
   产品费用信息,
   业绩报酬信息,
   自有资金参与信息,
   投资经理变更信息,
   持有人大会信息,
   交易确认信息,
   分红信息,
   产品清盘信息,
   信披信息,
   定期报告信息,
   数据中心,
   监管要素信息,
   参数信息,
   FISP,
   人行,
   中证协,
   资管月周报,
   个性化内部报表,
   中基协,
   干系人信息,
   客户信息,
   受益所有人,
   投资者信息,
   销售机构信息,
   销售协议信息,
   交易限制信息,
   销售机构账户信息,
   账户信息,
   交易单元信息,
 ];

 const Index = ({ dispatch }) => {
   const [tabsKey, setTabsKey] = useState('全部公共信息');
   const [search, setSearch] = useState(全部类);

   const handleChangeTabsKey = val => {
     switch (val) {
       case '全部公共信息':
         return [setTabsKey('全部公共信息'), setSearch(全部类)];
       case '基础类':
         return [setTabsKey('基础类'), setSearch(基础类)];
       case '费用与业绩报酬类':
         return [setTabsKey('费用与业绩报酬类'), setSearch(费用与业绩报酬类)];
       case '投资运作类':
         return [setTabsKey('投资运作类'), setSearch(投资运作类)];
       case '收益分配类':
         return [setTabsKey('收益分配类'), setSearch(收益分配类)];
       case '终止清算类':
         return [setTabsKey('终止清算类'), setSearch(终止清算类)];
       case '信息披露类':
         return [setTabsKey('信息披露类'), setSearch(信息披露类)];
       case '估值运营类':
         return [setTabsKey('估值运营类'), setSearch(估值运营类)];
       case '监管类':
         return [setTabsKey('监管类'), setSearch(监管类)];
       case '干系人类':
         return [setTabsKey('干系人类'), setSearch(干系人类)];
       case '销售发行类':
         return [setTabsKey('销售发行类'), setSearch(销售发行类)];
       case '账户类':
         return [setTabsKey('账户类'), setSearch(账户类)];
       default:
         return [setTabsKey('全部公共信息'), setSearch(全部类)];
     }
   };

   const handleGo = (v1, v2) => {
     return router.push(`${url}/产品要素库/${v1}/${v2}`);
   };

   // 跳转方法
   const handleGoRouterPush = e => {
     switch (e) {
       case '机构基本信息':
         return handleGo('f4d07be0-5195-4499-9c0f-bec467fae3b6', e);
       case '联系人信息':
         return handleGo('2f4ef0e2-9967-40bb-af04-96cd83779600', e);
       case '高管信息':
         return handleGo('6ad88910-805f-444b-9ea8-bf9d22298cd9', e);
       case '员工信息':
         return handleGo('3ebcd816-2e54-48d4-9868-9f2b3367ba65', e);
       case '系列信息':
         return handleGo('85260c17-c791-4a4f-b7aa-3b328d2dc9c8', e);
       case '产品基本信息':
         return handleGo('8d3812ad-b02b-43eb-8dc3-7bbe25c6db07', e);
       case '下属产品信息':
         return handleGo('14de35a8-f167-49f9-96bb-de9367207dde', e);
       case '评审记录':
         return handleGo('312d6083-c9ac-4ecd-923f-4be86463e020', e);
       case '产品费用信息':
         return handleGo('9b938493-bce5-40c5-b95e-716f5be68f33', e);
       case '业绩报酬信息':
         return handleGo('c6b4e79d-e7fa-482f-b661-7f0ad3c4a4f3', e);
       case '自有资金参与信息':
         return handleGo('0ab22a7c-8326-4871-abdf-db809251979b', e);
       case '投资经理变更信息':
         return handleGo('ed5f78c7-e6d9-4776-824e-a1839949e375', e);
       case '持有人大会信息':
         return handleGo('51baf43c-ff64-4858-bb14-53e6c6125c02', e);
       case '交易确认信息':
         return handleGo('dbe1eda4-f5e5-4fe7-bac2-cc8ba7914c00', e);
       case '分红信息':
         return handleGo('136867e7-191d-42ed-9024-0bd8b372fb18', e);
       case '产品清盘信息':
         return handleGo('37443688-6302-48d3-b808-77ca5d790c13', e);
       case '产品终止信息':
         return handleGo('79bcd8b9-d4c8-40b4-9f7b-91068b64680c', e);
       case '信披信息':
         return handleGo('ec1b3e14-e618-4feb-a6b0-d5e4eac635c1', e);
       case '定期报告信息':
         return handleGo('8df55c6b-032a-4fe1-9cff-95843ccf89b6', e);
       case '数据中心':
         return handleGo('0335d710-18eb-46cf-bfb4-67e84ff19e9e', e);
       case '监管要素信息':
         return handleGo('9862559a-d19f-44d8-89cf-5a3f7ee23074', e);
       case '参数信息':
         return handleGo('ab8414d5-3779-43d3-aa4b-3ba6cb1cd6b7', e);
       case 'FISP':
         return handleGo('d88004ae-68c7-438e-9863-42ef7e475aac', e);
       case '人行':
         return handleGo('c36c7bb0-476f-4674-b26b-5382c7fa353e', e);
       case '中证协':
         return handleGo('729a4b26-cebf-4e5d-af8d-2ba1449bb2ec', e);
       case '资管月周报':
         return handleGo('8662cd53-997b-4d24-8af4-4bf7b3233ab7', e);
       case '个性化内部报表':
         return handleGo('f2ce7a0a-9f0c-47e0-81d0-fc7b08970cd4', e);
       case '中基协':
         return handleGo('92c1b198-e3f2-4827-b584-3fc124157d77', e);
       case '干系人信息':
         return handleGo('d9b4cb1e-b3cb-4a82-9923-6c9b4278170c', e);
       case '客户信息':
         return handleGo('b9e4b846-c1a0-4862-82d3-37fcdaa5d54c', e);
       case '受益所有人':
         return handleGo('4ec93440-6963-4cc9-b006-881102f2bfef', e);
       case '投资者信息':
         return handleGo('8d57ddca-d080-4523-8b58-902ce9781369', e);
       case '销售机构信息':
         return handleGo('6b20ddb6-ce18-4c20-8704-563949899c70', e);
       case '销售协议信息':
         return handleGo('b595f51c-02cd-4642-997d-bc14535490c2', e);
       case '交易限制信息':
         return handleGo('8eb72709-02ce-452f-8d11-6d6399d64975', e);
       case '销售机构账户信息':
         return handleGo('394d213f-7a8c-40a1-bf84-49494369d3e8', e);
       case '账户信息':
         return handleGo('e2afff80-f340-4341-9e32-92248dd44c87', e);
       case '交易单元信息':
         return handleGo('85b92605-df5d-4474-b1a6-10174b2f2de0', e);
       default:
         return message.warn('没得你要的页面');
     }
   };

   // TabPane创建
   const handleAddTabPane = (tabsName, tabsKey, data) => {
     let arr = [];
     if (data) {
       for (let key of data) {
         arr.push(
           <Card className={styles.tabsData} key={key.code} onClick={() => handleGoRouterPush(key.code)}>
             <h3 className={styles.tabsDataH3}>{key.title}</h3>
             <p className={styles.tabsDataP}>{key.data}</p>
           </Card>,
         );
       }
     }
     return (
       <TabPane tab={tabsName} key={tabsKey}>
         {arr}
       </TabPane>
     );
   };

   // Tabs页创建
   const handleAddTabs = () => {
     return (
       <div className={styles.bodyData} style={{ height: 'calc(100vh - 200px)', overflowY: 'auto' }}>
         <Tabs
           tabPosition="left"
           defaultActiveKey="全部公共信息"
           activeKey={tabsKey}
           onChange={handleChangeTabsKey}
           style={{ margin: '20px 0 20px 0 ' }}
         >
           {handleAddTabPane('全部公共信息', '全部公共信息', search)}
           {handleAddTabPane('基础类', '基础类', search)}
           {handleAddTabPane('费用与业绩报酬类', '费用与业绩报酬类', search)}
           {handleAddTabPane('投资运作类', '投资运作类', search)}
           {handleAddTabPane('收益分配类', '收益分配类', search)}
           {handleAddTabPane('终止清算类', '终止清算类', search)}
           {handleAddTabPane('信息披露类', '信息披露类', search)}
           {handleAddTabPane('估值运营类', '估值运营类', search)}
           {handleAddTabPane('监管类', '监管类', search)}
           {handleAddTabPane('干系人类', '干系人类', search)}
           {handleAddTabPane('销售发行类', '销售发行类', search)}
           {handleAddTabPane('账户类', '账户类', search)}
         </Tabs>
       </div>
     );
   };

   // 搜索回调
   const handleCanSearch = val => {
     if (val) {
       let arr = [];
       for (let key of whole) {
         if (key.title.indexOf(val) !== -1) {
           arr.push(key);
         }
       }
       return JSON.stringify(arr) !== '[]'
         ? [setTabsKey('全部公共信息'), setSearch(arr)]
         : (message.warn(`未能找到您搜索的 : " ${val} " 模块 !`, 1),
           setTabsKey('全部公共信息'),
           setSearch(全部类));
     } else return [setTabsKey('全部公共信息'), setSearch(全部类)];
   };

   return (
     <>
       {handleAddHeard(
         handleCanSearch,
         '请输入产品信息要素模块名称',
         '产品生命周期',
         '产品信息要素',
       )}
       {handleAddTabs()}
     </>
   );
 };

 const WrappedIndexForm = errorBoundary(
   connect(({ productBillboard }) => ({
     productBillboard,
   }))(Index),
 );

 export default WrappedIndexForm;
