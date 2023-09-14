/**
 * author: jiaqiuhua
 * date: 2021/7/28
 * note: treeNode自定义
 * **/

import { TreeSelect, Tooltip } from 'antd';
const { TreeNode } = TreeSelect;

const treeNodeCustomize = data => {
  return data.map(item => {
    if (item.children) {
      return (
        <TreeNode
          value={item.title}
          key={item.code}
          disabled={true}
          title={
            <Tooltip placement="top" title={item.reason}>
              <span style={{ textDecoration: item.applicability == 0 ? 'line-through' : '' }}>
                {item.title}
              </span>
            </Tooltip>
          }
        >
          {treeNodeCustomize(item.children)}
        </TreeNode>
      );
    }

    return (
      <TreeNode
        value={item.title}
        key={item.code}
        disabled={item.applicability == 0}
        title={
          <Tooltip placement="top" title={item.reason}>
            <span style={{ textDecoration: item.applicability == 0 ? 'line-through' : '' }}>
              {item.title}
            </span>
          </Tooltip>
        }
      />
    );
  });
};

export default treeNodeCustomize;
