import styles from './index.less';
import { Breadcrumb, Button, Col, Form, Icon, Input, Row, Select, Tooltip } from 'antd';
import PageContainer from '@/components/PageContainers';
import { Card, Table } from '@/components';

const { Search } = Input;
const FormItem = Form.Item;

export const handleTableRender = label => {
  return (
    <Tooltip title={label} placement="topLeft">
      <span
        style={{
          width: '180px',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          display: 'inline-block',
          paddingTop: '5px',
        }}
      >
        {label
          ? label.toString().replace(/null/g, '-')
          : label === '' || label === undefined
          ? '-'
          : 0}
      </span>
    </Tooltip>
  );
};

// 数据处理 : 1是0否
export const handleChangeYesAndNo = val => {
  switch (val) {
    case '1':
      return '是';
    case 1:
      return '是';
    case '0':
      return '否';
    case 0:
      return '否';
    default:
      val;
  }
};

// 时间戳获取
export const handleGetTime = () => {
  const date = new Date();
  const time =
    date.getFullYear() +
    '_' +
    (date.getMonth() + 1) +
    '_' +
    date.getDay() +
    '_' +
    date.getHours() +
    '_' +
    date.getMinutes() +
    '_' +
    date.getSeconds() +
    '_' +
    date.getMilliseconds();
  return time;
};

// 面包屑导航
const handleAddBreadcrumb = data => {
  const arr = [];
  data.forEach((i, index) => arr.push(<Breadcrumb.Item key={`menu${index}`}>{i}</Breadcrumb.Item>));
  return <Breadcrumb>{arr}</Breadcrumb>;
};

// 下拉框
const handleAddSelect = data => {
  const arr = [];
  if (data && data.data && Array.isArray(data.data) && +data.data !== 0) {
    data.data.forEach((i, index) => {
      arr.push(
        <Select.Option
          key={`${data.code}${index}`}
          value={data.valueType === 'Chinese' ? i.name : i.code}
        >
          {i.name}
        </Select.Option>,
      );
    });
    return (
      <Col key={data.code} md={6} sm={24}>
        <FormItem>
          <span>{data.name}&nbsp;:&nbsp;</span>
          {data.getFieldDecorator(data.code)(
            <Select
              style={{ width: data.width }}
              mode={data.mode}
              placeholder={data.placeholder}
              showArrow
            >
              {arr}
            </Select>,
          )}
        </FormItem>
      </Col>
    );
  }
};

// 查询体
const handleAddSearchBody = data => {
  const arr = [];
  if (data && Array.isArray(data) && +data !== 0) {
    data.forEach(i => {
      switch (i.type) {
        case 'select':
          return arr.push(handleAddSelect(i));
        default:
          '';
      }
    });
  }
  return arr;
};

// 头部搜索栏
export const handleAddSerach = (data, queryData) => {
  const gutter = { md: 8, lg: 24, xl: 48 };
  const searchStyle = { width: 260, marginRight: 20 };
  const onAndOff = { display: data.search.display ? 'none' : '' };
  const offAndOn = { display: data.search.display ? '' : 'none' };
  return (
    <>
      <PageContainer />
      <Card default style={{ marginBottom: '16px', paddingBottom: 20 }}>
        <Row gutter={gutter}>
          <Col key="search" md={24} sm={24}>
            <div className={styles.searchDiv} style={onAndOff}>
              <Search
                placeholder={data.search.placeholder}
                allowClear
                style={searchStyle}
                value={data.search.keyWords}
                onChange={e => data.search.setKeyWords(e.target.value)}
                onSearch={data.search.onSearch}
              />
              <Button
                className={styles.activeSearch}
                onClick={() => [data.search.setDisplay(true), data.search.setKeyWords('')]}
                type="link"
              >
                展开搜索
                <Icon type="down" />
              </Button>
            </div>
          </Col>
          <Col key="searchBody" md={24} sm={24} style={offAndOn} className={styles.searchForm}>
            <Form onSubmit={data.search.onSearch}>
              <Row gutter={gutter}>
                {handleAddSearchBody(queryData)}
                <Col
                  key="searchButton"
                  md={6}
                  sm={24}
                  style={{ float: 'right', textAlign: 'right' }}
                >
                  <div className={styles.searchBox}>
                    <span>
                      <Button htmlType="submit" type="primary" style={{ marginRight: '10px' }}>
                        查询
                      </Button>
                      <Button style={{ marginRight: '20px' }} onClick={() => data.search.reset()}>
                        重置
                      </Button>
                    </span>
                    <Button
                      className={styles.activeSearch}
                      onClick={() => [data.search.reset(), data.search.setDisplay(false)]}
                      type="link"
                    >
                      收起&nbsp;
                      <Icon type="up" />
                    </Button>
                  </div>
                </Col>
              </Row>
            </Form>
          </Col>
        </Row>
      </Card>
    </>
  );
};

// 表格
export const handleAddTable = (data, title) => {
  return (
    <Card title={title} extra={data.tabsButtons ? data.tabsButtons : ''}>
      <Table
        rowSelection={data.rowSelection} // checkbox多选框
        pagination={data.pagination} // 分页栏
        loading={data.listLoading} // 加载中效果
        rowKey={data.key} // key值
        dataSource={data.dataSource} // 表数据源
        columns={data.columns} // 表头数据
        onChange={data.onChange}
        scroll={{ x: true }}
      />
    </Card>
  );
};
