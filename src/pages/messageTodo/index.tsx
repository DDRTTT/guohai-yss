import React, { useEffect, useState } from 'react';
import { errorBoundary } from '@/layouts/ErrorBoundary';
import { Form, Menu, Icon, Input, Tabs, Radio, Dropdown, Button, Tag, Select, TreeSelect, Spin, Modal, Row, Col, Checkbox, Switch } from 'antd';
import { connect } from 'dva';
import styles from './index.less';
import { PageContainers } from '@/components';
import { handleMapSelectOption } from '@/pages/messageTodo/util';

import { FormComponentProps } from 'antd/es/form';
import { Dispatch } from 'redux';
import { MessageTodoState } from '@/models/messageTodo';

// 日历策略
import CalendarStrategy from './calendarStrategy';
// 订阅策略
import SubscriptionStrategy from './subscriptionStrategy';
// 办理策略
import HandlingStrategy from './handlingStrategy';
// 样式策略
import StyleStrategy from './styleStrategy';
// 提醒策略
import ReminderStrategy from './reminderStrategy';

const { CheckableTag } = Tag;
const { Option } = Select;
const { TextArea } = Input;

interface MessageTodoProps {
  dispatch: Dispatch;
  form: FormComponentProps['form'];
  messageTodo: MessageTodoState;
}

// card图标
const MessageTodoCard = (rectColor: string | undefined, pathColor: string | undefined) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 22 22">
      <g id="icon_head_card_22_selected" transform="translate(-13 -89)">
        <rect
          id="矩形_35"
          data-name="矩形 35"
          width="22"
          height="22"
          transform="translate(13 89)"
          fill={rectColor}
        />
        <path
          id="路径_249"
          data-name="路径 249"
          d="M22.969,92.094H16.437a.344.344,0,0,0-.343.344v6.531a.344.344,0,0,0,.343.344h6.532a.344.344,0,0,0,.343-.344V92.438A.344.344,0,0,0,22.969,92.094Zm-1.117,5.758h-4.3v-4.3h4.3Z"
          fill={pathColor}
        />
        <path
          id="路径_250"
          data-name="路径 250"
          d="M31.562,92.094H25.031a.345.345,0,0,0-.344.344v6.531a.345.345,0,0,0,.344.344h6.531a.345.345,0,0,0,.344-.344V92.438A.344.344,0,0,0,31.562,92.094Zm-1.117,5.758h-4.3v-4.3h4.3Z"
          fill={pathColor}
        />
        <path
          id="路径_251"
          data-name="路径 251"
          d="M31.562,100.688H25.031a.344.344,0,0,0-.344.343v6.532a.344.344,0,0,0,.344.343h6.531a.344.344,0,0,0,.344-.343v-6.532A.344.344,0,0,0,31.562,100.688Zm-1.117,5.757h-4.3v-4.3h4.3Z"
          fill={pathColor}
        />
        <path
          id="路径_252"
          data-name="路径 252"
          d="M22.969,100.688H16.437a.344.344,0,0,0-.343.343v6.532a.344.344,0,0,0,.343.343h6.532a.344.344,0,0,0,.343-.343v-6.532A.344.344,0,0,0,22.969,100.688Zm-1.117,5.757h-4.3v-4.3h4.3Z"
          fill={pathColor}
        />
      </g>
    </svg>
  );
};
// list图标
const MessageTodoList = (rectColor: string | undefined, pathColor: string | undefined) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 22 22">
      <g id="icon_head_list_22_normal" transform="translate(-89 -89)">
        <rect
          id="矩形_40"
          data-name="矩形 40"
          width="22"
          height="22"
          transform="translate(89 89)"
          fill={rectColor}
        />
        <path
          id="路径_254"
          data-name="路径 254"
          d="M108.594,93.125H96.047a.172.172,0,0,0-.172.172v1.2a.172.172,0,0,0,.172.172h12.547a.173.173,0,0,0,.172-.172V93.3A.173.173,0,0,0,108.594,93.125Zm0,6.1H96.047a.172.172,0,0,0-.172.171v1.2a.172.172,0,0,0,.172.171h12.547a.172.172,0,0,0,.172-.171V99.4A.172.172,0,0,0,108.594,99.227Zm0,6.1H96.047a.172.172,0,0,0-.172.172v1.2a.172.172,0,0,0,.172.172h12.547a.173.173,0,0,0,.172-.172v-1.2A.173.173,0,0,0,108.594,105.328Z"
          fill={pathColor}
        />
        <path
          id="路径_255"
          data-name="路径 255"
          d="M91.234,93.9a1.2,1.2,0,1,0,1.2-1.2A1.2,1.2,0,0,0,91.234,93.9Z"
          fill={pathColor}
        />
        <path
          id="路径_256"
          data-name="路径 256"
          d="M91.234,100a1.2,1.2,0,1,0,1.2-1.2A1.2,1.2,0,0,0,91.234,100Z"
          fill={pathColor}
        />
        <path
          id="路径_257"
          data-name="路径 257"
          d="M91.234,106.1a1.2,1.2,0,1,0,1.2-1.2A1.2,1.2,0,0,0,91.234,106.1Z"
          fill={pathColor}
        />
      </g>
    </svg>
  );
};



const { Search } = Input;
const { TabPane } = Tabs;
// @ts-ignore
// card图标组件
const MessageTodoCardIcon = (rectColor: string | undefined, pathColor: string | undefined) => (
  <Icon component={() => MessageTodoCard(rectColor, pathColor)} />
);
// list图标组件
const MessageTodoListIcon = (rectColor: string | undefined, pathColor: string | undefined) => (
  <Icon component={() => MessageTodoList(rectColor, pathColor)} />
);

const MessageTodo: React.FC<MessageTodoProps> = ({
  form: { getFieldDecorator },
  form,
  dispatch,
  messageTodo: { saveProcessNodeList },
}) => {
  // 菜单hooks
  const [menuKey, setMenuKey] = useState<string>('1');
  // 列表或者卡片 hook
  const [listOrCard, setListOrCard] = useState<string>('card');
  // 流程阶段选择 hook
  const [selectedTags, setSelectedTags] = useState<Array<number>>([]);
  // 流程阶段选择索引 hoos
  const [selectedTagsIndex, setSelectedTagsIndex] = useState<number>(0);
  // 公共tabs hook
  const [tabKey, setTabKey] = useState<string>('1');
  const [treeData, setTreeData] = useState<Array<any>>([]);
  const [parent, setParent] = useState<Array<any>>([]);
  const [secondaryMenu, setSecondaryMenu] = useState<Array<any>>([]);
  const [subscribe, setSubscribe] = useState<boolean>(false);  // 订阅策略 loading
  const [menuItem, setMenuItem] = useState<string>('');
  const [menuLoading, setMenuLoading] = useState<boolean>(false);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [modalTitle, setModalTitle] = useState<String>("");
  const [batchBtnState, setBatchBtnState] = useState<boolean>(true);
  const [groupVisible, setGroupVisible] = useState<boolean>(false);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [option, setOption] = useState<Array<any>>([{ key: '1', value: '+新增二级事项' }, { key: '2', value: '立项阶段子流程' }, { key: '3', value: '募集阶段子流程' }, { key: '4', value: '成立阶段子流程' }, { key: '5', value: '运做阶段子流程' }, { key: '6', value: '清盘阶段子流程' }])
  const [secondVisible, setSecondVisible] = useState<boolean>(false);
  const [selected, setSelected] = useState<string>('')

  const plainOptions = [
    { label: '投行委领导组', value: '1' },
    { label: '投行委领导组', value: '2' },
    { label: '投行委领导组', value: '3' },
    { label: '投行委领导组', value: '4' },
    { label: '投行委领导组', value: '5' },
  ]

  useEffect(() => {
    // // 流程节点列
    // dispatch({
    //   type: 'messageTodo/fetchProcessNodeList',
    // });
  });

  /**
   * 点击菜单方法
   * @param {EventTarget} e 事件源
   */
  const handleMenuClick = (e: EventTarget | undefined): void => {
    console.log('click', e);
  };

  /**
   * 菜单
   */
  const menu = (
    // @ts-ignore
    <Menu onClick={handleMenuClick}>
      <Menu.Item key="1">批量启用</Menu.Item>
      <Menu.Item key="2">批量关闭</Menu.Item>
    </Menu>
  );

  /**
   * 点击滚动
   * @param {string} direction 滚动方向
   */
  const handleScroll = (direction: string) => {
    const ele = document.getElementById('scrollId') as HTMLElement;
    let scrollLeft = ele.scrollLeft;
    if (direction === 'left') {
      scrollLeft -= 162;
    } else {
      scrollLeft += 162;
    }
    (document.getElementById('scrollId') as HTMLElement).scrollLeft = scrollLeft;
  };

  /**
   * 流程阶段选择
   * @param {number} tag
   * @param {boolean} checked
   * @param {number} index
   */
  const handleTagChange = (tag: any, checked: boolean, index: number) => {
    const nextSelectedTags = checked ? [tag] : selectedTags.filter(t => t !== tag);
    setSelectedTags(nextSelectedTags);
    setSelectedTagsIndex(index);
    // setMenuItem(tag);
  };

  // 获取提醒策略列表
  const queryRemindData = () => {
    console.log('into queryRemindData');
    dispatch({
      type: 'messageTodo/queryRemindData',
      payload: {
        query: {
          currentPage: 1,
          pageSize: 10,
        },
        body: {
          firstCode: '',
          secondCode: '',
          messageTask: '',
          name: '',
        }
      }
    })
  }

  // 获取事项类型树
  const queryMatterTree = () => {
    dispatch({
      type: 'messageTodo/queryMatterTree',
    }).then((res: any) => {
      setTreeData(res);
    })
  }

  // 根据parentId获取子级事项
  const getMatterByParentId = (parentId: any) => {
    dispatch({
      type: 'messageTodo/getMatterByParentId',
      payload: { parentId }
    }).then((res: any) => {
      if (parentId === 0) {
        // setParent(res)
        // getMatterByParentId(res[0]?.id);  // 接口返回值暂时没有
      } else {
        setSecondaryMenu(res);
        setSubscribe(false);
        setMenuLoading(false);
      }

    })
  }

  const switchCard = () => {
    console.log('card');
    setBatchBtnState(true);
  }

  const switchList = () => {
    console.log('list');
    setBatchBtnState(true);

  }

  const renderTab = (item: string) => {
    setTabKey(item);
    // 订阅策略
    if (item === '2') {
      // setSubscribe(true)
      // 获取事项类型树
      queryMatterTree();
      // 根据parentId获取子级事项
      getMatterByParentId(0);
    }
    // 提醒策略
    if (item === '5') {
      // queryRemindData();
      // queryMatterTree();
    }
  }

  const switchSecondaryMenu = (key: string) => {
    setMenuLoading(true);
    setMenuKey(key);
    getMatterByParentId(key);
    setMenuItem('');
  }

  const showModal = (sign: string) => {
    setModalTitle(sign);
    setModalVisible(true);
  }

  const modalHandleOk = () => {
    setModalVisible(false);
    setModalTitle("");
  }

  const modalHandleCancel = () => {
    setModalVisible(false);
    setModalTitle("");
    setIsEdit(false);
  }

  const handleBatchBtnState = (sign: boolean) => {
    console.log('into', sign);
    setBatchBtnState(sign)
  }

  const handleEditModalState = (record: any) => {
    // record <ReminderStrategy /> 传过来的列表数据
    setModalVisible(true);
    setModalTitle("编辑提醒策略");
    setIsEdit(true);
  }

  const handleCheckBoxChange = (checkedValues: any) => {
    console.log('checkedValues', checkedValues);
  }

  const selectChange = (e: string) => {
    if (e === '1') {
      setSecondVisible(true);
      form.resetFields(['xzejsx']);
    }
  }

  const addSecond = () => {
    let value = form.getFieldValue('xzejsx');
    let key = option.length + 1 + '';
    option.push({
      key,
      value,
    });
    setOption(option);
    setSecondVisible(false);
    form.resetFields(['ejlx']);
    setSelected(key);
  }

  return (
    <PageContainers
      footer={
        <Tabs defaultActiveKey="1" onChange={(item: string) => renderTab(item)} animated={false}>
          <TabPane tab="日历策略" key="1" />
          <TabPane tab="订阅策略" key="2" />
          <TabPane tab="办理策略" key="3" />
          <TabPane tab="样式策略" key="4" />
          <TabPane tab="提醒策略" key="5" />
        </Tabs>
      }
      backText={'返回'}
      backIcon={<Icon type="left" />}
      onBack={() => window.history.back()}
    >
      <div className={styles.messageTodo}>
        {/*日历策略*/}
        {/* // @ts-ignore */}
        {/* {tabKey === '1' && <CalendarStrategy currentTitle={'日历策略'} />} */}
        {/*订阅策略*/}
        {tabKey === '2' && (
          <Spin spinning={subscribe}>
            <div className={styles.innerBox}>
              {/* <Menu
                className={styles.leftBox}
                defaultSelectedKeys={['52c17ba312504d7b8d3acb2685f51587']}
                mode="inline"
                onSelect={({ key }) => switchSecondaryMenu(key)}
              >
                {
                  parent?.length > 0 && parent.map(item => (
                    <Menu.Item key={item.id}>
                      <span>{item.name}</span>
                    </Menu.Item>
                  ))
                }
              </Menu> */}
              <Menu
                className={styles.leftBox}
                defaultSelectedKeys={['1']}
                mode="inline"
                onSelect={({ key }) => setMenuKey(key)}
              >
                <Menu.Item key="1">
                  <span>流程事项</span>
                </Menu.Item>
                <Menu.Item key="2">
                  <span>产品事项</span>
                </Menu.Item>
                <Menu.Item key="3">
                  <span>业务事项</span>
                </Menu.Item>
                <Menu.Item key="4">
                  <span>系统事项</span>
                </Menu.Item>
                <Menu.Item key="5">
                  <span>自定义事项</span>
                </Menu.Item>
              </Menu>
              <div className={styles.rightBox}>
                <div className={styles.searchBox}>
                  <div className={styles.searchBoxLeft}>
                    <Form layout="inline">
                      <Form.Item>
                        {getFieldDecorator('username2', {
                          rules: [{ required: true, message: '请选择二级类别' }],
                        })(
                          // <Select className={styles.searchSelect}>
                          //   {handleMapSelectOption([], Option, undefined)}
                          // </Select>,
                          <TreeSelect className={styles.searchSelect}
                            // style={{ width: '100%' }}
                            // value={this.state.value}
                            dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                            treeData={treeData}
                            placeholder="请选择二级类别"
                            treeDefaultExpandAll
                          // onChange={this.onChange}
                          />
                        )}
                      </Form.Item>
                      <Form.Item>
                        {getFieldDecorator('password', {
                          rules: [{ required: true, message: '请选择事项分类' }],
                        })(
                          <Select className={styles.searchSelect} placeholder="请选择事项分类">
                            {/* {handleMapSelectOption([], Option, undefined)} */}
                            <Option value={0}>{"代办类型"}</Option>
                            <Option value={1}>{"提醒类型"}</Option>
                          </Select>,
                        )}
                      </Form.Item>
                      <Form.Item>
                        {getFieldDecorator('password', {
                          rules: [{ required: true, message: '请输入关键字!' }],
                        })(
                          <Search
                            placeholder="请输入关键字"
                            onSearch={value => console.log(value)}
                            className={styles.searchInput}
                          />,
                        )}
                      </Form.Item>
                    </Form>
                  </div>
                  <div className={styles.searchBoxRight}>
                    <Radio.Group value={listOrCard} onChange={e => setListOrCard(e.target.value)}>
                      {listOrCard === 'card' && [
                        <Radio.Button value="card" className={styles.sButton} onClick={switchCard}>
                          {MessageTodoCardIcon('#2450A5', '#fff')}
                        </Radio.Button>,
                        <Radio.Button value="list" className={styles.selectedButton} onClick={switchList}>
                          {MessageTodoListIcon('#fff', '#575d6c')}
                        </Radio.Button>,
                      ]}

                      {listOrCard === 'list' && [
                        <Radio.Button value="card" className={styles.selectedButton} onClick={switchCard}>
                          {MessageTodoCardIcon('#fff', '#575d6c')}
                        </Radio.Button>,
                        <Radio.Button value="list" className={styles.sButton} onClick={switchList}>
                          {MessageTodoListIcon('#2450A5', '#fff')}
                        </Radio.Button>,
                      ]}
                    </Radio.Group>
                    <Dropdown overlay={menu} className={styles.dropdown} disabled={batchBtnState}>
                      <Button>
                        批量操作 <Icon type="down" />
                      </Button>
                    </Dropdown>
                  </div>
                </div>
                <Spin spinning={menuLoading}>
                  <div className={styles.sliders}>
                    <div className={styles.leftSides} onClick={() => handleScroll('left')}>
                      <Icon type="double-left" />
                    </div>
                    <div className={styles.inner} id="scrollId">
                      <div className={styles.innerContent}>
                        {saveProcessNodeList!.map((tag, index) => {
                          return (
                            <CheckableTag
                              key={tag.value}
                              checked={selectedTags.indexOf(tag.value) > -1}
                              onChange={checked => handleTagChange(tag.value, checked, index)}
                            >
                              {tag.name}
                            </CheckableTag>
                          );
                        })}

                        {/* {secondaryMenu!.map((tag, index) => (
                          <CheckableTag
                            key={tag.id}
                            checked={selectedTags.indexOf(tag.id) > -1}
                            onChange={checked => handleTagChange(tag.id, checked, index)}
                          >
                            {tag.name}
                          </CheckableTag>
                        ))} */}
                      </div>
                    </div>
                    <div className={styles.rightSides} onClick={() => handleScroll('right')}>
                      <Icon type="double-right" />
                    </div>
                  </div>
                </Spin>
                {/*流程事项*/}
                {menuKey === '1' && <SubscriptionStrategy tabKey={tabKey} listOrCard={listOrCard} handleBatchBtnState={handleBatchBtnState} handleEditModalState={handleEditModalState} />}
                {/*产品事项*/}
                {menuKey === '2' && <SubscriptionStrategy tabKey={tabKey} listOrCard={listOrCard} handleBatchBtnState={handleBatchBtnState} handleEditModalState={handleEditModalState} />}
                {/*业务事项*/}
                {menuKey === '3' && <SubscriptionStrategy tabKey={tabKey} listOrCard={listOrCard} handleBatchBtnState={handleBatchBtnState} handleEditModalState={handleEditModalState} />}
                {/*系统事项*/}
                {menuKey === '4' && <SubscriptionStrategy tabKey={tabKey} listOrCard={listOrCard} handleBatchBtnState={handleBatchBtnState} handleEditModalState={handleEditModalState} />}
                {/*自定义事项*/}
                {menuKey === '5' && <SubscriptionStrategy tabKey={tabKey} listOrCard={listOrCard} handleBatchBtnState={handleBatchBtnState} handleEditModalState={handleEditModalState} />}
              </div>
            </div>
          </Spin>
        )}
        {/*办理策略*/}
        {/*// @ts-ignore*/}
        {tabKey === '3' && <HandlingStrategy currentTitle={'办理策略'} />}
        {/*样式策略*/}
        {tabKey === '4' && <StyleStrategy currentTitle={'样式策略'} />}
        {/*提醒策略*/}
        {tabKey === '5' && (
          <div className={styles.innerBox}>
            <Menu
              className={styles.leftBox}
              defaultSelectedKeys={['1']}
              mode="inline"
              onSelect={({ key }) => setMenuKey(key)}
            >
              <Menu.Item key="1">
                <span>流程事项</span>
              </Menu.Item>
              <Menu.Item key="2">
                <span>产品事项</span>
              </Menu.Item>
              <Menu.Item key="3">
                <span>业务事项</span>
              </Menu.Item>
              <Menu.Item key="4">
                <span>系统事项</span>
              </Menu.Item>
              <Menu.Item key="5">
                <span>自定义事项</span>
              </Menu.Item>
            </Menu>
            <div className={styles.rightBox}>
              <div className={styles.searchBox}>
                <div className={styles.searchBoxLeft}>
                  <Form layout="inline">
                    <Form.Item>
                      {getFieldDecorator('username2', {
                        rules: [{ required: true, message: '请选择二级类别' }],
                      })(
                        // <Select className={styles.searchSelect}>
                        //   {handleMapSelectOption([], Option, undefined)}
                        // </Select>,
                        <TreeSelect className={styles.searchSelect}
                          // style={{ width: '100%' }}
                          // value={this.state.value}
                          dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                          treeData={treeData}
                          placeholder="请选择二级类别"
                          treeDefaultExpandAll
                        // onChange={this.onChange}
                        />
                      )}
                    </Form.Item>
                    <Form.Item>
                      {getFieldDecorator('password', {
                        rules: [{ required: true, message: '请选择事项分类' }],
                      })(
                        <Select className={styles.searchSelect} placeholder="请选择事项分类">
                          {handleMapSelectOption([], Option, undefined)}
                        </Select>,
                      )}
                    </Form.Item>
                    <Form.Item>
                      {getFieldDecorator('password', {
                        rules: [{ required: true, message: '请输入关键字!' }],
                      })(
                        <Search
                          placeholder="请输入关键字"
                          onSearch={value => console.log(value)}
                          className={styles.searchInput}
                        />,
                      )}
                    </Form.Item>
                  </Form>
                </div>
                <div className={styles.searchBoxRight}>
                  <Dropdown overlay={menu} className={styles.dropdown} disabled={batchBtnState}>
                    <Button>
                      批量操作 <Icon type="down" />
                    </Button>
                  </Dropdown>
                  <Button type="primary" style={{ marginLeft: 8 }} onClick={() => showModal('新增提醒策略')}>
                    <Icon type="plus" />
                    新增
                  </Button>
                </div>
              </div>
              <div className={styles.sliders}>
                <div className={styles.leftSides} onClick={() => handleScroll('left')}>
                  <Icon type="double-left" />
                </div>
                <div className={styles.inner} id="scrollId">
                  <div className={styles.innerContent}>
                    {saveProcessNodeList!.map((tag, index) => {
                      return (
                        <CheckableTag
                          key={tag.value}
                          checked={selectedTags.indexOf(tag.value) > -1}
                          onChange={checked => handleTagChange(tag.value, checked, index)}
                        >
                          {tag.name}
                        </CheckableTag>
                      );
                    })}
                  </div>
                </div>
                <div className={styles.rightSides} onClick={() => handleScroll('right')}>
                  <Icon type="double-right" />
                </div>
              </div>

              {/*流程事项*/}
              {menuKey === '1' && <SubscriptionStrategy listOrCard={'list'} handleBatchBtnState={handleBatchBtnState} handleEditModalState={handleEditModalState} />}
              {/*产品事项*/}
              {menuKey === '2' && <SubscriptionStrategy listOrCard={'list'} handleBatchBtnState={handleBatchBtnState} handleEditModalState={handleEditModalState} />}
              {/*业务事项*/}
              {menuKey === '3' && <SubscriptionStrategy listOrCard={'list'} handleBatchBtnState={handleBatchBtnState} handleEditModalState={handleEditModalState} />}
              {/*系统事项*/}
              {menuKey === '4' && <SubscriptionStrategy listOrCard={'list'} handleBatchBtnState={handleBatchBtnState} handleEditModalState={handleEditModalState} />}
              {/*自定义事项*/}
              {menuKey === '5' && <ReminderStrategy listOrCard={'list'} handleBatchBtnState={handleBatchBtnState} handleEditModalState={handleEditModalState} />}
            </div>
          </div>
        )}
      </div>
      <Modal
        title={modalTitle}
        visible={modalVisible}
        bodyStyle={{ marginTop: -1, maxHeight: 750, overflow: "auto", background: '#fff', padding: '0 24px 0', borderBottomRightRadius: 4, borderBottomLeftRadius: 4 }}
        width={942}
        onOk={modalHandleOk}
        onCancel={modalHandleCancel}
        // confirmLoading={confirmLoading}
        getContainer={false}
        footer={null}
        destroyOnClose={true}
      >
        <div>
          <Form layout="inline">
            <div className={styles.modalTitle}>
              提醒事件
          </div>
            <div className={styles.tableListForm}>

              <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                <Col md={12} sm={24}>
                  <Form.Item label="一级类型">
                    {getFieldDecorator('yjlx', {
                      rules: [{ required: true, message: '请选择事件的一级类型' }],
                    })(
                      <Select style={{ width: '100%' }} disabled={isEdit} placeholder="请选择事件的一级类型" >
                        <Option key="1" value="1">流程事项</Option>
                        <Option key="2" value="2">产品事项</Option>
                        <Option key="3" value="3">业务事项</Option>
                        <Option key="4" value="4">系统事项</Option>
                        <Option key="5" value="5">自定义事项</Option>
                      </Select>
                    )}
                  </Form.Item>
                </Col>
                <Col md={12} sm={24}>
                  <Form.Item label="二级类别">
                    {getFieldDecorator('ejlx', {
                      rules: [{ required: true, message: '请选择事项的二级类别' }],
                      initialValue: selected || undefined,
                    })(
                      <Select
                        showSearch
                        optionFilterProp="children"
                        style={{ width: '100%' }}
                        disabled={isEdit}
                        placeholder="请选择事项的二级类别"
                        onChange={(e: string) => selectChange(e)}
                      >
                        {option.map(item => (
                          <Option key={item.key} value={item.key}>{item.value}</Option>
                        ))}
                      </Select>
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                <Col md={12} sm={24}>
                  <Form.Item label="事项分类">
                    {getFieldDecorator('sxfl', {
                      rules: [{ required: true, message: '请选择事项分类' }],
                    })(
                      <Select style={{ width: '100%' }} disabled={isEdit} placeholder="请选择事项分类" >
                        <Option key="1" value="1">待办事项</Option>
                        <Option key="2" value="2">提醒事项</Option>
                      </Select>
                    )}
                  </Form.Item>
                </Col>
                <Col md={12} sm={24}>
                  <Form.Item label="事项名称">
                    {getFieldDecorator('sxmc', {
                      rules: [{ required: true, message: '请输入事项名称' }],
                    })(
                      <Input style={{ width: '100%' }} disabled={isEdit} placeholder="请输入事项名称" />
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                <Col md={12} sm={24}>
                  <Form.Item label="规则策略">
                    {getFieldDecorator('ghcl', {
                      rules: [{ required: true, message: '请选择规则策略' }],
                    })(
                      <Select style={{ width: '100%' }} disabled={isEdit} placeholder="请选择事项提醒匹配的规则策略" ></Select>
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                <Col md={24} sm={24}>
                  <Form.Item label="提醒内容">
                    {getFieldDecorator('txnr', {
                      rules: [{ required: true, message: '请编辑提醒内容' }],
                    })(
                      <TextArea rows={3} disabled={isEdit} placeholder="请编辑提醒内容" />
                    )}
                  </Form.Item>
                </Col>
              </Row>

            </div>
            <div className={styles.modalTitle} style={{ marginTop: 20 }}>
              提醒机制
          </div>
            <div className={styles.tableListForm}>
              <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                <Col md={12} sm={24}>
                  <Form.Item label="触发机制">
                    {getFieldDecorator('cfjz', {
                      rules: [{ required: true, message: '请选择提醒触发机制' }],
                    })(
                      <Select style={{ width: '100%' }} disabled={isEdit} placeholder="请选择提醒触发机制" >
                        <Option key="1" value="1">5%</Option>
                        <Option key="2" value="2">年度结束日</Option>
                        <Option key="3" value="3">季度结束日</Option>
                        <Option key="4" value="4">审计结果出具日</Option>
                        <Option key="5" value="5">计划设立日</Option>
                        <Option key="6" value="6">投资运作日</Option>
                        <Option key="7" value="7">合同变更日</Option>
                        <Option key="8" value="8">合同约定日</Option>
                        <Option key="9" value="9">合同签订日</Option>
                        <Option key="10" value="10">专户开户日</Option>
                        <Option key="11" value="11">专户注销日</Option>
                        <Option key="12" value="12">专户转换日</Option>
                        <Option key="13" value="13">募集结束日</Option>
                      </Select>
                    )}
                  </Form.Item>
                </Col>
                <Col md={12} sm={24}>
                  <Form.Item label="开始提醒">
                    {getFieldDecorator('kstx', {
                      rules: [{ required: true, message: '请选择提醒机制' }],
                    })(
                      <Select style={{ width: '100%' }} placeholder="请选择提醒机制" >
                        <Option key="1" value="1">T</Option>
                        <Option key="2" value="2">T-1</Option>
                        <Option key="3" value="3">T-2</Option>
                        <Option key="4" value="4">T-3</Option>
                        <Option key="5" value="5">T-4</Option>
                        <Option key="6" value="6">T-5</Option>
                        <Option key="7" value="7">T-6</Option>
                        <Option key="8" value="8">T-7</Option>
                        <Option key="9" value="9">T-10</Option>
                        <Option key="10" value="10">T-20</Option>
                        <Option key="11" value="11">T-30</Option>
                        <Option key="12" value="12">T-90</Option>
                        <Option key="13" value="13">T+1</Option>
                        <Option key="14" value="14">T+2</Option>
                        <Option key="15" value="15">T+3</Option>
                        <Option key="16" value="16">T+4</Option>
                        <Option key="17" value="17">T+5</Option>
                        <Option key="18" value="18">T+6</Option>
                        <Option key="19" value="19">T+7</Option>
                        <Option key="20" value="20">T+10</Option>
                        <Option key="21" value="21">T+20</Option>
                        <Option key="22" value="22">T+30</Option>
                        <Option key="23" value="23">T+90</Option>
                      </Select>
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                <Col md={12} sm={24}>
                  <Form.Item label="提醒频率">
                    {getFieldDecorator('txpl', {
                      rules: [{ required: true, message: '请选择提醒频率' }],
                    })(
                      <Select style={{ width: '100%' }} placeholder="请选择提醒频率" >
                        <Option key="1" value="1">仅提醒一次</Option>
                        <Option key="2" value="2">5分钟</Option>
                        <Option key="3" value="3">10分钟</Option>
                        <Option key="4" value="4">30分钟</Option>
                        <Option key="5" value="5">60分钟</Option>
                        <Option key="6" value="6">上午10时</Option>
                        <Option key="7" value="7">下午14时</Option>
                        <Option key="8" value="8">每天</Option>
                        <Option key="9" value="9">每周一</Option>
                        <Option key="10" value="10">每周五</Option>
                        <Option key="11" value="11">每月第一日</Option>
                        <Option key="12" value="12">每月结束日</Option>
                        <Option key="13" value="13">每季第一日</Option>
                        <Option key="14" value="14">每季结束日</Option>
                      </Select>
                    )}
                  </Form.Item>
                </Col>
                <Col md={12} sm={24}>
                  <Form.Item label="提醒方式">
                    {getFieldDecorator('txfs', {
                      rules: [{ required: true, message: '请选择提醒方式' }],
                    })(
                      <Select style={{ width: '100%' }} placeholder="请选择提醒方式" >
                        <Option key="1" value="1">站内信</Option>
                        <Option key="2" value="2">系统弹窗</Option>
                        <Option key="3" value="3">电子邮件</Option>
                        <Option key="4" value="4">手机短信</Option>
                        <Option key="5" value="5">微信</Option>
                      </Select>
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                <Col md={12} sm={24}>
                  <Form.Item label="结束提醒">
                    {getFieldDecorator('jstx', {
                      rules: [{ required: true, message: '请选择结束提醒机制' }],
                    })(
                      <Select style={{ width: '100%' }} placeholder="请选择结束提醒机制" >
                        <Option key="1" value="1">站内信</Option>
                        <Option key="2" value="2">系统弹窗</Option>
                        <Option key="3" value="3">电子邮件</Option>
                        <Option key="4" value="4">手机短信</Option>
                        <Option key="5" value="5">微信</Option>
                      </Select>
                    )}
                  </Form.Item>
                </Col>
              </Row>

            </div>
            {tabKey === '5' && <div style={{ padding: '0 32px', marginTop: 10, marginBottom: 10 }}>
              <div className={styles.groupBox}>
                <div className={styles.groupTitle}>
                  <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                    <Col md={18} sm={24}>
                      <span style={{ marginLeft: 45 }}>提醒用户：</span><span style={{ color: '#8A8E99', fontSize: 12 }}>选择用户组策略</span>
                    </Col>
                    <Col md={6} sm={24}>
                      <Button style={{ height: 24, marginLeft: 20 }} onClick={() => setGroupVisible(true)}><Icon type="plus" />新增用户组</Button>
                    </Col>
                  </Row>
                </div>
                <div style={{ padding: '0 56px 0 119px' }}>
                  <Row gutter={{ md: 8, lg: 24, xl: 48 }} style={{ borderBottom: '1px solid #DFE1E6', paddingTop: 5, paddingBottom: 5 }}>
                    <Col md={22} sm={24} style={{ paddingLeft: 0, paddingRight: 0 }}>
                      <Checkbox.Group options={plainOptions} defaultValue={['1']} onChange={handleCheckBoxChange} />
                    </Col>
                    <Col md={2} sm={24} style={{ paddingLeft: 0, paddingRight: 0 }}>
                      <a style={{ marginLeft: 10 }}>展开<Icon type="down" style={{ marginLeft: 4 }} /></a>
                    </Col>
                  </Row>
                  <div className={styles.tableListForm} style={{ padding: "10px 0 0 0" }}>
                    <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                      <Col md={11} sm={24} style={{ paddingLeft: 0 }}>
                        <Form.Item>
                          {getFieldDecorator('jgbm')(
                            <Select mode="multiple" style={{ width: '100%' }} placeholder="请选择机构部门(可多选)" >
                              <Option key='1' value='机构部门一'>机构部门一</Option>
                              <Option key='2' value='机构部门二'>机构部门二</Option>
                            </Select>
                          )}
                        </Form.Item>
                      </Col>
                      <Col md={11} sm={24}>
                        <Form.Item>
                          {getFieldDecorator('ywcp')(
                            <Select mode="multiple" style={{ width: '100%' }} placeholder="请选择业务产品(可多选)" >
                              <Option key='1' value='业务产品一'>业务产品一</Option>
                              <Option key='2' value='业务产品二'>业务产品二</Option>
                            </Select>
                          )}
                        </Form.Item>
                      </Col>
                    </Row>
                    <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                      <Col md={11} sm={24} style={{ paddingLeft: 0 }}>
                        <Form.Item>
                          {getFieldDecorator('xtjs')(
                            <Select mode="multiple" style={{ width: '100%' }} placeholder="请选择系统角色(可多选)" >
                              <Option key='1' value='系统角色一'>系统角色一</Option>
                              <Option key='2' value='系统角色二'>系统角色二</Option>
                            </Select>
                          )}
                        </Form.Item>
                      </Col>
                      <Col md={11} sm={24}>
                        <Form.Item>
                          {getFieldDecorator('xtyh')(
                            <Select mode="multiple" style={{ width: '100%' }} placeholder="请选择系统用户(可多选)" >
                              <Option key='1' value='系统用户一'>系统用户一</Option>
                              <Option key='2' value='系统用户二'>系统用户二</Option>
                            </Select>
                          )}
                        </Form.Item>
                      </Col>
                    </Row>
                  </div>
                </div>
                <div className={styles.groupTip}>
                  注：如未指定提醒用户的类型，将默认向系统中的公司全员发送提醒策略；并根据策略配置向系统中的全员生成相应的待办/消息提醒事项
              </div>
              </div>
            </div>}
            {tabKey == '2' && <div style={{ paddingLeft: 70 }}>
              <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                <Col md={24} sm={24}>
                  <Form.Item label="涉及流程">
                    <Button style={{ marginLeft: 9 }}>募集流程</Button>
                    <Button style={{ marginLeft: 8 }}>信披流程</Button>
                  </Form.Item>
                </Col>
              </Row>
            </div>}
            <div className={styles.tableListForm}>
              {tabKey === '5' && <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                <Col md={24} sm={24}>
                  <Form.Item label="涉及流程">
                    {getFieldDecorator('sjlc')(
                      <Select mode="multiple" disabled={isEdit} style={{ width: '100%' }} placeholder="请选择事项及流程" >
                        <Option key="1" value="涉及流程一">涉及流程一</Option>
                        <Option key="2" value="涉及流程二">涉及流程二</Option>
                      </Select>
                    )}
                  </Form.Item>
                </Col>
              </Row>}
              <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                <Col md={6} sm={24} style={{ paddingRight: 0 }}>
                  <Form.Item label="启用本策略">
                    {getFieldDecorator('qybcl')(
                      <Switch checkedChildren="开" unCheckedChildren="关" defaultChecked />
                    )}
                  </Form.Item>
                </Col>
                <Col md={17} sm={24} style={{ paddingLeft: 0 }}>
                  <Form.Item>
                    {getFieldDecorator('qzkq')(
                      <Checkbox disabled={isEdit} style={{ width: "100%" }} ><span style={{ color: '#F66F6A' }}>是否强制启用</span><span style={{ color: "#8A8E99", fontSize: 12 }}>（强制启用开启后用户将无法关闭该提醒配置策略）</span></Checkbox>
                    )}
                  </Form.Item>
                </Col>
              </Row>
            </div>
          </Form>
        </div>
        <div className={styles.modalFootBox}>
          <Button onClick={modalHandleCancel}>取消</Button>
          <Button type="primary" style={{ marginLeft: 8 }}>确定</Button>
        </div>
      </Modal>
      <Modal
        title="新增提醒用户组"
        width={519}
        visible={groupVisible}
        bodyStyle={{ marginTop: -1, background: '#fff', padding: '0 24px 0', borderBottomRightRadius: 4, borderBottomLeftRadius: 4 }}
        onCancel={() => setGroupVisible(false)}
        // confirmLoading={confirmLoading}
        getContainer={false}
        footer={null}
        zIndex={1000}
        mask={false}
        style={{ top: 150, left: -160 }}
        destroyOnClose={true}
      >
        <div className={styles.tableListForm}>
          <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
            <Col md={24} sm={24}>
              <Form.Item label="策略名称">
                {getFieldDecorator('clmc')(
                  <Input style={{ width: '100%' }} placeholder="请输入策略名称" />
                )}
              </Form.Item>
            </Col>
            <Col md={24} sm={24}>
              <Form.Item label="机构部门">
                {getFieldDecorator('jgbm1')(
                  <Select mode="multiple" style={{ width: '100%' }} placeholder="请选择机构部门(可多选)" >
                    <Option key='1' value='机构部门一'>机构部门一</Option>
                    <Option key='2' value='机构部门二'>机构部门二</Option>
                  </Select>
                )}
              </Form.Item>
            </Col>
            <Col md={24} sm={24}>
              <Form.Item label="业务产品">
                {getFieldDecorator('ywcp1')(
                  <Select mode="multiple" style={{ width: '100%' }} placeholder="请选择业务产品(可多选)" >
                    <Option key='1' value='业务产品一'>业务产品一</Option>
                    <Option key='2' value='业务产品二'>业务产品二</Option>
                  </Select>
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
            <Col md={24} sm={24}>
              <Form.Item label="系统角色">
                {getFieldDecorator('xtjs1')(
                  <Select mode="multiple" style={{ width: '100%' }} placeholder="请选择系统角色(可多选)" >
                    <Option key='1' value='系统角色一'>系统角色一</Option>
                    <Option key='2' value='系统角色二'>系统角色二</Option>
                  </Select>
                )}
              </Form.Item>
            </Col>
            <Col md={24} sm={24}>
              <Form.Item label="系统用户">
                {getFieldDecorator('xtyh1')(
                  <Select mode="multiple" style={{ width: '100%' }} placeholder="请选择系统用户(可多选)" >
                    <Option key='1' value='系统用户一'>系统用户一</Option>
                    <Option key='2' value='系统用户二'>系统用户二</Option>
                  </Select>
                )}
              </Form.Item>
            </Col>
          </Row>
        </div>
        <div className={styles.modalFootBox}>
          <Button onClick={() => setGroupVisible(false)}>取消</Button>
          <Button type="primary" style={{ marginLeft: 8 }}>确定</Button>
        </div>
      </Modal>
      <Modal
        title="新增二级事项"
        width={300}
        visible={secondVisible}
        bodyStyle={{ marginTop: -1, background: '#fff', padding: '0 24px 0', borderBottomRightRadius: 4, borderBottomLeftRadius: 4 }}
        onCancel={() => setSecondVisible(false)}
        // confirmLoading={confirmLoading}
        getContainer={false}
        footer={null}
        zIndex={1000}
        mask={false}
        style={{ top: 150, left: 360 }}
        destroyOnClose={true}
      >
        <div>
          <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
            <Col md={24} sm={24}>
              <Form.Item label="">
                {getFieldDecorator('xzejsx')(
                  <Input style={{ width: '100%' }} placeholder="请输入二级事项" />
                )}
              </Form.Item>
            </Col>
          </Row>
        </div>
        <div className={styles.modalFootBox}>
          <Button onClick={() => setSecondVisible(false)}>取消</Button>
          <Button type="primary" style={{ marginLeft: 8 }} onClick={addSecond}>确定</Button>
        </div>
      </Modal>
    </PageContainers>
  );
};

export default errorBoundary(
  Form.create()(
    connect(
      ({
        messageTodo,
        loading,
      }: {
        messageTodo: MessageTodoState;
        loading: {
          models: Record<string, boolean>;
        };
      }) => ({
        messageTodo,
      }),
    )(MessageTodo),
  ),
);
