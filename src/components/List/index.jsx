import React, { useEffect, useState, useRef } from 'react';
import { Button, Col, Form, Icon, Input, Row } from 'antd';
import { Card, PageContainers, Table } from '@/components';
import { isNullObj } from '@/pages/investorReview/func';
import CustomFormItem from '@/components/AdvancSearch/CustomFormItem';
// import PageContainer from '@/components/PageContainers';
// import DynamicHeader from '@/components/DynamicHeader';
// import { number } from 'sockjs-client/lib/utils/random';
const { Search } = Input;
// 布局
let layout = {
  labelAlign: 'right',
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

const Index = props => {
  const {
    advancSearch = () => {}, // 获取高级搜索的回调函数
    formItemData = [], //搜索框的配置数据
    fuzzySearch = () => {}, // 模糊搜索的回调函数
    searchPlaceholder = 'input search text', // 模糊搜索输入框的占位符
    searchInputWidth = 200, // 模糊搜索输入框的宽度
    fuzzySearchBool = true, //是否存在模糊查询
    advancSearchBool = true, //是否存在精准查询
    showBreadCrumb = true, // 是否展示面包屑列表
    showSearch, // 只显示条件搜索
    loading,
    resetFn, //重置
    pageContainerProps,
    tabs,
    tableList,
    title,
    extra,
    pageCode,
    columns,
    dynamicHeaderCallback,
    taskTypeCode,
    taskArrivalTimeKey,
    form: { validateFields, resetFields },
    form,
    hasMoreTabs,
    customLayout,
    loginId,
    searchType,
  } = props;
  const tabValue = useRef('');

  // 非要改成可以一直调接口的
  const [waste, setWaste] = useState(false);

  // 模糊搜索的数据
  const [searchValue, setSearchValue] = useState('');
  const searchChange = e => {
    setSearchValue(e.target.value);
  };

  // 是否展开
  const [expand, setExpand] = useState(false);

  useEffect(()=>{
    getSession()
    expandFun()
  },[])

  //只显示条件搜索
  function expandFun(){
    if(showSearch){
      setExpand(true)
    }
  }

  //sessionStorage存搜索条件
  function getSession(){
    const formData = sessionStorage.getItem('keyValueSearch');
    let reqBody
    let objectKeys
    if (formData) {
      reqBody = JSON.parse(formData);
    }
    formData && setSearchValue(reqBody?.keyWords)
  }

  // 切换 模糊 or 精准查询
  const updateExpand = boolean => {
    setExpand(boolean);
    setSearchValue('');
    // if (!loginId) {
    //   // 产品要素管理，彭章涛要求切换时，不能重置查询条件
    //   handleReset();
    // }
  }; // ok

  // tabs 切换
  const onTabChange = value => {
    setExpand(false);
    setSearchValue('');
    form.resetFields();
    tabs.onTabChange(value);
    tabValue.current = value;
  };

  /**
   *  @description 搜索
   */
  const handleSearch = e => {
    e.preventDefault();
    form.validateFields((err, values) => {
      if (err) return;
      const formValues = { ...values };
      isNullObj(formValues) ? advancSearch(waste ? {} : null) : advancSearch(formValues);
      setWaste(!waste);
    });
  };

  /**
   *  @description 重置搜索框
   */
  const handleReset = () => {
    if (resetFn) {
      resetFn();
      form.resetFields();
    } else {
      form.resetFields();
    }
    tabValue.current = tabValue.current + '1';
  };

  // 模糊查询组件
  const renderFuzzy = (
    <div style={{display: !searchType  ? 'block' : 'none'}}>
      <Search loading={loading}
        placeholder={searchPlaceholder}
        value={searchValue}
        onChange={searchChange}
        onSearch={(value, e) => {
          e.preventDefault();
          fuzzySearch(value);
        }}
        style={{
          display: expand ? 'none' : 'inline-block',
          width: (!/px/.test(searchInputWidth) && searchInputWidth * 1) || searchInputWidth,
        }}
      />
      <Button
        type="link"
        onClick={() => {
          updateExpand(!expand);
        }}
        style={{ display: !expand && advancSearchBool ? 'inline-block' : 'none' }}
      >
        高级搜索
        <Icon type="down" />
      </Button>
    </div>
  );
  // customLayout存在，优先使用;否则，使用原layout
  layout = customLayout ? customLayout : layout;
  // tab栏较多时，显示有问题，需要重新设置样式
  const cardClassName = `listCard ${hasMoreTabs ? 'moreTabsListCard' : ''}`;
  return (
    <>
      <div style={{ display: searchInputWidth?'block' : 'none'}}>
        <div style={{ display: showBreadCrumb ? 'block' : 'none' }}>
          <PageContainers {...pageContainerProps} fuzz={fuzzySearchBool ? renderFuzzy : ''} />
        </div>
        <Card
          className={'search-card2 margin_t-16'}
          style={{ display: expand || !fuzzySearchBool ? 'block' : 'none' }}
        >
          <Form {...layout} onSubmit={handleSearch} className={'seachForm2'} >
            <Row gutter={24} style={{padding:'12px'}}>
              <CustomFormItem
                tabValue={tabValue?.current}
                formItemList={formItemData}
                form={form}
                loginId={loginId}
              />
              <Col span={6} className={'textAlign_r padding_t8 padding_b8 float_r'}>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  className={'margin_l5 margin_l5'}
                >
                  查询
                </Button>
                <Button loading={loading} onClick={handleReset} className={'margin_l5 margin_r5'}>
                  重置
                </Button>
                {
                  !showSearch? <Button
                    style={{ display: fuzzySearchBool ? 'inline-block' : 'none' }}
                    onClick={() => {
                      updateExpand(!expand);
                    }}
                    type="link"
                  >
                    收起
                    <Icon type="up" />
                  </Button>:''
                }
              </Col>
            </Row>
          </Form>
        </Card>
      </div>
      <Card
        title={title}
        className={cardClassName}
        tabList={tabs && tabs.tabList}
        activeTabKey={tabs && tabs.activeTabKey}
        onTabChange={onTabChange}
        extra={
          <>
            {extra}
            {pageCode && (''
              // <DynamicHeader
              //   tabValue={tabValue.current}
              //   columns={columns}
              //   pageCode={pageCode}
              //   callBackHandler={dynamicHeaderCallback}
              //   taskTypeCode={taskTypeCode}
              //   taskArrivalTimeKey={taskArrivalTimeKey}
              // />
            )}
          </>
        }
      >
        {tableList}
      </Card>
    </>
  );
};

export default Form.create()(Index);
