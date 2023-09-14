import GridContent from './gridContent';
import { PageHeaderProps } from 'antd/es/page-header';
// import RouteContext, { RouteContextType } from './RouteContext';
import { RouteContextType } from './RouteContext';
import { useContext } from 'react';
import { TabPaneProps, TabsProps } from 'antd/es/tabs';
import { PageHeader, Tabs } from 'antd';
import React from 'react';
import classNames from 'classnames';
import styles from './index.less';
import { RouteContext } from '@ant-design/pro-layout';

export interface PageHeaderTabConfig {
  tabList?: (TabPaneProps & { key?: React.ReactText })[];
  tabActiveKey?: TabsProps['activeKey'];
  onTabChange?: TabsProps['onChange'];
  tabBarExtraContent?: TabsProps['tabBarExtraContent'];
  tabProps?: TabsProps;
}

export interface PageContainerProps extends PageHeaderTabConfig, Omit<PageHeaderProps, 'title'> {
  title?: React.ReactNode | false;
  content?: React.ReactNode;
  extraContent?: React.ReactNode;
  prefixCls?: string;
  footer?: React.ReactNode[];
  ghost?: boolean;
  pageHeaderRender?: (props: PageContainerProps) => React.ReactNode;
}

/**
 * render Footer tabList
 * In order to be compatible with the old version of the PageHeader
 * basically all the functions are implemented.
 */
const renderFooter: React.SFC<Omit<
  PageContainerProps & {
    prefixedClassName: string;
  },
  'title'
>> = ({ tabList, tabActiveKey, onTabChange, tabBarExtraContent, tabProps, prefixedClassName }) => {
  if (tabList && tabList.length) {
    return (
      <Tabs
        className={styles[`${prefixedClassName}-tabs`]}
        activeKey={tabActiveKey}
        onChange={key => {
          if (onTabChange) {
            onTabChange(key);
          }
        }}
        tabBarExtraContent={tabBarExtraContent}
        {...tabProps}
      >
        {tabList.map((item, index) => (
          // eslint-disable-next-line react/no-array-index-key
          <Tabs.TabPane {...item} tab={item.tab} key={item.key || index} />
        ))}
      </Tabs>
    );
  }
  return null;
};

const renderPageHeader = (
  content: React.ReactNode,
  extraContent: React.ReactNode,
  prefixedClassName: string,
): React.ReactNode => {
  if (!content && !extraContent) {
    return null;
  }
  return (
    <div className={styles[`${prefixedClassName}-detail`]}>
      <div className={styles[`${prefixedClassName}-main`]}>
        <div className={styles[`${prefixedClassName}-row`]}>
          {content && <div className={styles[`${prefixedClassName}-content`]}>{content}</div>}
          {extraContent && (
            <div className={styles[`${prefixedClassName}-extraContent`]}>{extraContent}</div>
          )}
        </div>
      </div>
    </div>
  );
};

const defaultPageHeaderRender = (
  props: PageContainerProps,
  value: RouteContextType & { prefixedClassName: string },
): React.ReactNode => {
  const { title, content, pageHeaderRender, extraContent, style, prefixCls, ...restProps } = props;
  console.log('props', props);
  console.log('value', value);
  if (pageHeaderRender) {
    return pageHeaderRender({ ...props, ...value });
  }
  let pageHeaderTitle = title;
  if (!title && title !== false) {
    pageHeaderTitle = value.title;
  }
  return (
    <PageHeader
      {...value}
      title={pageHeaderTitle}
      {...restProps}
      footer={renderFooter({
        ...restProps,
        prefixedClassName: value.prefixedClassName,
      })}
      prefixCls={prefixCls}
    >
      {renderPageHeader(content, extraContent, value.prefixedClassName)}
    </PageHeader>
  );
};

const PageContainer: React.FC<PageContainerProps> = props => {
  const { children, style, footer, ghost, prefixCls = 'ant-pro' } = props;
  const value = useContext(RouteContext);
  const prefixedClassName = `${prefixCls}-page-container`;

  const className = classNames(prefixedClassName, props.className, {
    [`${prefixCls}-page-container-ghost`]: ghost,
  });
  return (
    <div style={style} className={styles[className]}>
      <div className={styles[`${prefixedClassName}-warp`]}>
        {defaultPageHeaderRender(props, {
          ...value,
          prefixCls: undefined,
          prefixedClassName,
        })}
      </div>
      <GridContent>
        <div className={styles[`${prefixedClassName}-children-content`]}>{children}</div>
      </GridContent>
    </div>
  );
};

export default PageContainer;
