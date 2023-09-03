import React, { useState } from 'react';
import { errorBoundary } from '@/layouts/ErrorBoundary';
import { Button, Dropdown, Form, Icon, Input, Menu, Radio, Select, Tag } from 'antd';
import styles from '@/pages/messageTodo/index.less';
import { handleMapSelectOption } from '@/pages/messageTodo/util';
import SubscriptionStrategy from '@/pages/messageTodo/subscriptionStrategy';
import ReminderStrategy from '@/pages/messageTodo/reminderStrategy';

const { CheckableTag } = Tag;
const { Option } = Select;

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

// @ts-ignore
const MessageTodoCardIcon = (rectColor: string | undefined, pathColor: string | undefined) => (
  <Icon component={() => MessageTodoCard(rectColor, pathColor)} />
);
const MessageTodoListIcon = (rectColor: string | undefined, pathColor: string | undefined) => (
  <Icon component={() => MessageTodoList(rectColor, pathColor)} />
);

const aa = [
  {
    name: '立项阶段子流程',
    value: 1,
  },
  {
    name: '立项阶段子流程',
    value: 2,
  },
  {
    name: '立项阶段子流程',
    value: 3,
  },
  {
    name: '立项阶段子流程',
    value: 4,
  },
  {
    name: '立项阶段子流程',
    value: 5,
  },
  {
    name: '立项阶段子流程',
    value: 6,
  },
  {
    name: '立项阶段子流程',
    value: 7,
  },
  {
    name: '立项阶段子流程',
    value: 8,
  },
  {
    name: '立项阶段子流程',
    value: 9,
  },
  {
    name: '立项阶段子流程',
    value: 10,
  },
  {
    name: '立项阶段子流程',
    value: 11,
  },
  {
    name: '立项阶段子流程',
    value: 12,
  },
  {
    name: '立项阶段子流程',
    value: 13,
  },
  {
    name: '立项阶段子流程',
    value: 14,
  },
];

const CommonHeader = ({ form: { getFieldDecorator } }) => {
  const [menuKey, setMenuKey] = useState<string>('');
  const [listOrCard, setListOrCard] = useState<string>('card');
  const [selectedTags, setSelectedTags] = useState<Array<number>>([]);
  // 阶段索引
  const [selectedTagsIndex, setSelectedTagsIndex] = useState<number>(0);
  const [tabKey, setTabKey] = useState<string>('1');

  const handleMenuClick = (e: EventTarget | undefined): void => {
    console.log('click', e);
  };

  const menu = (
    // @ts-ignore
    <Menu onClick={handleMenuClick}>
      <Menu.Item key="1">启用</Menu.Item>
      <Menu.Item key="2">关闭</Menu.Item>
    </Menu>
  );

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
   * 阶段选择
   * @param tag {number}
   * @param checked {boolean}
   * @param index {number}
   */
  const handleTagChange = (tag: number, checked: boolean, index: number) => {
    const nextSelectedTags = checked ? [tag] : selectedTags.filter(t => t !== tag);
    setSelectedTags(nextSelectedTags);
    setSelectedTagsIndex(index);
  };

  const handleTabChange = (item: string) => setTabKey(item);

  return (
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
                {getFieldDecorator('username', {
                  rules: [{ required: true, message: '请选择事项类型' }],
                })(
                  <Select className={styles.searchSelect}>
                    {handleMapSelectOption([], Option, undefined)}
                  </Select>,
                )}
              </Form.Item>
              <Form.Item>
                {getFieldDecorator('password', {
                  rules: [{ required: true, message: '请选择提醒事项' }],
                })(
                  <Select className={styles.searchSelect}>
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
            <Radio.Group value={listOrCard} onChange={e => setListOrCard(e.target.value)}>
              {listOrCard === 'card' && [
                <Radio.Button value="card" className={styles.sButton}>
                  {MessageTodoCardIcon('#5e7ce0', '#fff')}
                </Radio.Button>,
                <Radio.Button value="list" className={styles.selectedButton}>
                  {MessageTodoListIcon('#fff', '#575d6c')}
                </Radio.Button>,
              ]}

              {listOrCard === 'list' && [
                <Radio.Button value="card" className={styles.selectedButton}>
                  {MessageTodoCardIcon('#fff', '#575d6c')}
                </Radio.Button>,
                <Radio.Button value="list" className={styles.sButton}>
                  {MessageTodoListIcon('#5e7ce0', '#fff')}
                </Radio.Button>,
              ]}
            </Radio.Group>
            <Dropdown overlay={menu} className={styles.dropdown}>
              <Button>
                批量操作 <Icon type="down" />
              </Button>
            </Dropdown>
          </div>
        </div>
        <div className={styles.sliders}>
          <div className={styles.leftSides} onClick={() => handleScroll('left')}>
            <Icon type="double-left" />
          </div>
          <div className={styles.inner} id="scrollId">
            <div className={styles.innerContent}>
              {aa.map((tag, index) => {
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

        {/*产品事项*/}
        {menuKey === '2' && <SubscriptionStrategy listOrCard={listOrCard} />}

        {/*自定义事项*/}
        {menuKey === '5' && <ReminderStrategy />}
      </div>
    </div>
  );
};

export default errorBoundary(Form.create()(CommonHeader));
