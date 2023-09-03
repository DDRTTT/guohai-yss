import React, { useEffect } from 'react';
import { Form } from 'antd';
import CustomFormItem from '@/components/AdvancSearch/CustomFormItem';
import { connect } from 'dva';
import { Card, PageContainers } from '@/components';
import Gird from '@/components/Gird';

const defaultConfig = { disabled: true, placeholder: '' };

const Index = ({
  dispatch,
  tradingUnitManager: { hostingList, detailInfo },
  investorReview: { codeList },
  location: {
    query: { trusteeshipId, applyPro, settlementMode },
  },
}) => {
  useEffect(() => {
    dispatch({
      type: 'tradingUnitManager/getHostingList',
      payload: {
        orgType: 'J004_2',
      },
    })
    dispatch({
      type: 'tradingUnitManager/getBrokerList',
      payload: {
        qualifyType: 'J001_1',
      },
    });
    dispatch({
      type: 'investorReview/getDicsByTypes',
      payload: ['T004', 'T003', 'T002', 'SM001'],
    });
    dispatch({
      type: 'tradingUnitManager/getTrandingBoothInfo',
      payload: {
        trusteeshipId,
        applyPro,
        settlementMode,
      },
    });
  }, []);

  // 弹窗配置-产品计划排期表-查看基本信息
  const drawerConfig = item => {
    return [
      { 
        label: '结算模式', 
        value: 'settlementMode', 
        type: 'select', 
        option: codeList && codeList.SM001 
      },{ 
        label: `${item.settlementMode === 'SM001_1' ? '托管人' : '交易单元所属'}`, 
        value: 'trusteeshipId', 
        type: 'select', 
        option: hostingList, 
        optionConfig: { name: 'orgName', code: 'id' } 
      },{
        label: '适用产品', 
        value: 'applyPro', 
        type: 'multiple', 
        option: codeList && codeList.T004 
      },{ 
        label: '交易市场', 
        value: 'market', 
        type: 'select', 
        option: codeList && codeList.T003 
      },{ 
        label: '交易单元号', 
        value: 'unitNum' 
      },{ 
        label: '清算编号', 
        value: 'clearNo' 
      },{ 
        label: '协议编码', 
        value: 'protocolCode' 
      },{ 
        label: '开通状态', 
        value: 'openStatus', 
        type: 'select', 
        option: [{ name: '已开通', code: '1' }, { name: '未开通', code: '0' }] 
      },{ 
        label: '交易单元操作员号', 
        value: 'operator', rule: item.market !== 'T003_1' 
      },{ 
        label: '初始密码', 
        value: 'iniPwd', rule: item.market !== 'T003_1' 
      },
    ]
  }
  return (
    <PageContainers
      breadcrumb={[
        {
          title: '产品数据管理',
          url: '',
        },
        {
          title: '交易单元管理',
          url: '/productDataManage/tradingUnitManager/index',
        },
        {
          title: '查看',
          url: '',
        },
      ]}
    >
      <div className='detailPage bgcFFF'>
        <div className="scollWrap scollWrap129 none-scroll-bar">
          <Card title="详情">
            {detailInfo &&
              detailInfo.map((item, index) => (
                <div style={{marginTop:index === 0 ? "" :'50px'}}>
                  <Gird key={index} config={drawerConfig(item)} info={item}/>
                </div>
              ))}
          </Card>
        </div>
      </div>
    </PageContainers>
  );
};

export default connect(({ dispatch, tradingUnitManager, investorReview }) => ({
  dispatch,
  tradingUnitManager,
  investorReview,
}))(Index);
