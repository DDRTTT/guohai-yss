import React, { useEffect, useRef, useState } from 'react';
import { errorBoundary } from '@/layouts/ErrorBoundary';
import { connect } from 'dva';
import { Timeline, Button, Form, Spin } from 'antd';
import styles from './index.less';

const Index = ({ proCode, proStage, dispatch, productForInfo, listLoading, handleStageChange }) => {
  const [fuseStageList, setFuseStageList] = useState([]);
  const [list, setList] = useState([]);
  const [indexList, setIndexList] = useState('');

  useEffect(() => {
    // 流程发起人下啦数据表
    dispatch({
      type: 'productForInfo/getHistoricalByProCode',
      payload: { proCode: proCode, proStage: proStage },
    });
  }, [proCode]);

  useEffect(() => {
    setList(productForInfo.historicalByProCode || []);
    setIndexList(handleDataForHistoricalByProCode(productForInfo.historicalByProCode));
  }, [productForInfo.historicalByProCode]);

  // 产品阶段图数据组装
  const handleDataForHistoricalByProCode = val => {
    let histoorIndex = '';
    val.forEach((item, index) => {
      let arr = item?.resultMap?.filter(_item => _item.state === '1');
      if (arr.length) histoorIndex = index;
    });
    return histoorIndex;
  };

  const handleProgressColor = index => {
    if (indexList > index) return '5px solid #000000';
    if (indexList === index) return '5px solid #2450A5';
    return '5px solid #dedee1';
  };

  return (
    <div className={styles.history}>
      <Spin spinning={!!listLoading}>
        <div className="site-layout-background">
          <div className="bgBar" />
          <div className="phaseStepWrap">
            {list.map((item, index) => {
              return (
                <div className="phaseStepItem" key={index}>
                  <p>{item.stage}</p>
                  <Timeline
                    className={styles.timelines}
                    style={{ borderTop: handleProgressColor(index) }}
                  >
                    <Timeline.Item></Timeline.Item>
                    {item?.resultMap?.map((item, indexForResu) => {
                      return (
                        <Timeline.Item key={indexForResu}>
                          <>
                            <Button
                              type="link"
                              style={indexList > index ? { color: '#000000' } : {}}
                              disabled={
                                indexList < index || (indexList === index && item.state !== '1')
                              }
                              onClick={() =>
                                handleStageChange && handleStageChange(item.processCode)
                              }
                            >
                              {item.process}
                            </Button>
                          </>
                        </Timeline.Item>
                      );
                    })}
                  </Timeline>
                </div>
              );
            })}
          </div>
        </div>
      </Spin>
    </div>
  );
};

const WrappedIndexForm = errorBoundary(
  Form.create()(
    connect(({ productForInfo, loading }) => ({
      productForInfo,
      listLoading: loading.effects['productForInfo/getHistoricalByProCode'],
    }))(Index),
  ),
);

export default WrappedIndexForm;
