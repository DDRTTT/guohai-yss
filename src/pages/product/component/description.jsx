import React, { useState } from 'react';
import { Card, PageContainers } from '@/components';
import { Descriptions, Row, Col } from 'antd';
const Index = props => {
  const { data = [], title = '' } = props;

  return (
    <>
      <Card title={title}>
        <div style={{ padding: '0 40px' }}>
          <Descriptions>
            {data?.map(item => {
              return <Descriptions.Item label={item.label}>{item.value}</Descriptions.Item>;
            })}
          </Descriptions>
        </div>
      </Card>
    </>
  );
};
export default Index;
