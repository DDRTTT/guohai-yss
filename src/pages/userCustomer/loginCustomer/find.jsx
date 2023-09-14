import React, { useEffect, useState } from 'react';
import { errorBoundary } from '@/layouts/ErrorBoundary';
import { connect } from 'dva';
import { Tabs, Input, Radio, Form } from 'antd';
import classNames from 'classnames';
import styles from './style.less';
import { Table } from '@/components';

const { TabPane } = Tabs;
const { Search } = Input;

// 城市选择
const Selectlist = props => {
  // console.log('====xxxxxxxxx====', props);
  let { tabId, dataList, sname, selectOption } = props;
  //
  const selectChange = e => {
    let targetId = e.target.value; // 要跳到的id
    if (targetId) {
      targetId = tabId + '_' + targetId;
      const scrollDiv = document.getElementById(tabId); // 有滚动条的div
      let targetDiv = document.getElementById(targetId);
      if (scrollDiv && null != scrollDiv) {
        targetDiv = findBeforeShowEle(targetDiv);
        // console.log('找到targetDiv====', targetDiv);
        if (targetDiv === -1) {
          // 没找到
          scrollDiv.scrollTop = 0;
        } else if (scrollDiv && null != scrollDiv && null != scrollDiv.scrollTop) {
          scrollDiv.scrollTop = targetDiv.offsetTop;
        }
      }
    }
  };
  // 向上找，显示的统计兄弟节点
  const findBeforeShowEle = elementDiv => {
    // console.log('targetDiv====', targetDiv.style.display)
    if (elementDiv.style.display === 'none') {
      // 隐藏的，找到兄弟节点
      //  previousSibling：获取元素的上一个兄弟节点；（既包含元素节点、文本节点、注释节点）
      //   previousElementSibling：获取上一个兄弟元素节点；（只包含元素节点）；
      // console.log('上一个兄弟==', elementDiv.previousElementSibling)
      if (elementDiv.previousElementSibling) {
        // 有上一个兄弟元素
        return findBeforeShowEle(elementDiv.previousElementSibling);
      }
    } else {
      // 找到显示的
      return elementDiv;
    }
    return -1; // 没找到
  };

  // 点击了某城市，需要触发后续变化
  const toChangBankList = (e, id) => {
    e.preventDefault();
    if (props.selectdValue) {
      // 已存在，直接更换
      if (props.selectdValue === id) {
        // 如果相等，说明是取消操作
        selectOption(tabId, undefined);
      } else {
        // 如果不相等，说明是更换
        selectOption(tabId, id);
      }
    } else {
      // 原来就没有，说明是高亮
      selectOption(tabId, id);
    }
  };

  return (
    <div className={styles.topB}>
      <div className={styles.selectT}>{sname}</div>
      <div>
        <Radio.Group onChange={selectChange}>
          {/* <Radio.Button disabled>热门选择</Radio.Button> */}
          <Radio.Button value="A">ABCDE</Radio.Button>
          <Radio.Button value="F">FGHIJ</Radio.Button>
          <Radio.Button value="K">KLMN</Radio.Button>
          <Radio.Button value="O">OPQR</Radio.Button>
          <Radio.Button value="S">STUV</Radio.Button>
          <Radio.Button value="W">WXYZ</Radio.Button>
        </Radio.Group>
        <div className={styles.cityItems} id={tabId}>
          {dataList.map((item, index) => {
            return (
              <div
                key={index}
                id={`${tabId}_${item.title}`}
                className={styles.ite}
                style={{ display: item.data.length <= 0 ? 'none' : 'block' }}
              >
                <div>{item.title}</div>
                <ul>
                  {item.data && item.data.length > 0 ? (
                    item.data.map((child, i) => {
                      return (
                        <li
                          key={i}
                          onClick={e => toChangBankList(e, child.FCODE)}
                          className={props.selectdValue === child.FCODE ? styles.selected : ''}
                        >
                          {child.FNAME}
                        </li>
                      );
                    })
                  ) : (
                    <li>无</li>
                  )}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const Find = ({
  form: { validateFields },
  dispatch,
  listLoading,
  loginCustomer: {
    depositListData: { rows, total },
    cityListData: { citys },
    bankListData: { banks },
  },
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(12); // 每页记录数
  const [keyWords, setKeyword] = useState(); // 搜索词
  const [cityId, setCityId] = useState(); // 城市id
  const [bankId, setBankId] = useState(); // 银行id

  // console.log('--------最开始----------', keyWords, cityId, bankId);

  const columns = [
    {
      title: '开户行名称',
      dataIndex: 'name',
      key: 'name',
      // width: 484,
      width: '80%',
    },
    {
      title: '大额行号',
      dataIndex: 'largePaymentNo',
      key: 'largePaymentNo',
    },
  ];
  const paginationProps = {
    defaultPageSize: limit,
    pageSize: limit,
    showQuickJumper: true,
    current: currentPage,
    total,
    showTotal: total => `共 ${total} 条数据`,
  };

  useEffect(() => {
    // console.log('..............开始', keyWords, cityId, bankId);
    dispatch({
      type: 'loginCustomer/cityList',
    });
    dispatch({
      type: 'loginCustomer/bankList',
    });
    const basic = {
      currentPage,
      pageSize: limit,
    };
    dispatch({
      type: 'loginCustomer/depositList',
      payload: basic,
    });
  }, []);

  useEffect(() => {
    // console.log('..............引起，开户列表', keyWords, cityId, bankId);
    const basic = {
      currentPage,
      pageSize: limit,
      city: cityId, // 城市FCODE字段
      bankNo: bankId, // 银行FCODE字段
      keyWords: keyWords, // 关键词
    };
    dispatch({
      type: 'loginCustomer/depositList',
      payload: basic,
    });
  }, [cityId, bankId]);

  // useEffect(() => {
  //   console.log('..............城市引起，触发银行', keyWords, cityId, bankId);
  //   setBankId();
  //   const par = {
  //     city: cityId, // 城市FCODE字段
  //     keyWords: keyWords,
  //   };
  //   dispatch({
  //     type: 'loginCustomer/bankList',
  //     payload: par,
  //     callback: () => {
  //       // setBankId()
  //     },
  //   });
  // }, [cityId]);

  // // @todo 改为上面方法成功后回调
  // useEffect(() => {
  //   console.log('..............银行引起，开户列表', keyWords, cityId, bankId);
  //   const basic = {
  //     currentPage,
  //     pageSize: limit,
  //     city: cityId, // 城市FCODE字段
  //     bankNo:  bankId, // 银行FCODE字段
  //     keyWords:  keyWords, // 关键词
  //   };
  //   dispatch({
  //     type: 'loginCustomer/depositList',
  //     payload: basic,
  //   });
  // }, [bankId]);

  // 列表查询
  const handleListFetch = (pages, limits) => {
    setCurrentPage(pages);
    validateFields((err, fieldsValue) => {
      if (err) return;
      dispatch({
        type: 'loginCustomer/depositList',
        payload: {
          currentPage: pages,
          pageSize: limits,
          city: cityId, // 城市FCODE字段
          bankNo: bankId, // 银行FCODE字段
          keyWords: keyWords, // 关键词
        },
      });
    });
  };
  const handleStandardTableChange = ({ current, pageSize }) => {
    if (pageSize !== limit) {
      handleListFetch(1, pageSize);
      setCurrentPage(1);
      setLimit(pageSize);
    } else {
      handleListFetch(current, pageSize);
      setCurrentPage(current);
      setLimit(pageSize);
    }
  };

  const handleSearch = val => {
    setKeyword(val);
    // if (!val) return;
    dispatch({
      type: 'loginCustomer/depositList',
      payload: {
        currentPage: currentPage,
        pageSize: limit,
        city: cityId, // 城市FCODE字段
        bankNo: bankId, // 银行FCODE字段
        keyWords: keyWords, // 关键词
      },
    });
  };
  const handleBlur = e => {
    setKeyword(e.target.value);
  };
  const operations = (
    <Search
      name="keyWords"
      placeholder="网点名称/大额行号"
      onSearch={value => {
        handleSearch(value);
      }}
      onBlur={e => {
        handleBlur(e);
      }}
      className={styles.searchInput}
      style={{ width: 360, height: 40, background: '#F6F8FA', borderRadius: 20 }}
    />
  );

  // 选择城市或银行的回调
  const selectOption = (tabId, value) => {
    // console.log('重新选择城市或银行的回调=====', tabId, value);
    if (tabId) {
      if (tabId === 'cityListBox') {
        setCityId(value);
      } else if (tabId === 'binkListBox') {
        setBankId(value);
      } else {
        console.log('类型不正确');
      }
    }
  };
  // 改变银行列表
  const toChangeBank = cityId => {
    // console.log('改变银行列表---------');
    dispatch({
      type: 'loginCustomer/bankList',
    });
    // 要引起 开户列表变化
  };

  return (
    <div className={styles.findContent}>
      <Tabs tabBarExtraContent={operations}>
        <TabPane tab="大额行号" key="1" className={styles.contentBox}>
          <div className={styles.leftBox}>
            <Selectlist
              tabId="cityListBox"
              sname="选择城市"
              dataList={citys}
              selectOption={selectOption}
              selectdValue={cityId}
            ></Selectlist>
            <Selectlist
              tabId="binkListBox"
              sname="选择银行"
              dataList={banks}
              selectOption={selectOption}
              selectdValue={bankId}
            ></Selectlist>
          </div>
          <div className={styles.rightBox}>
            <Table
              dataSource={rows}
              loading={listLoading}
              columns={columns}
              currentPage={currentPage}
              pagination={paginationProps}
              onChange={handleStandardTableChange}
              rowKey="id"
            />
          </div>
        </TabPane>
        {/* <TabPane tab="自定义查询内容" key="2">
          自定义查询内容...
        </TabPane> */}
      </Tabs>
    </div>
  );
};

const WrappedIndexForm = errorBoundary(
  Form.create()(
    connect(({ loginCustomer, loading }) => ({
      loginCustomer,
      listLoading: loading.effects['loginCustomer/depositList'],
    }))(Find),
  ),
);

export default WrappedIndexForm;
