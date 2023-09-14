import { Tooltip } from 'antd';

/** 处理table每一个td省略号
 * @return {ReactNode}
 * @param {string} text 列表展示数据
 * @param {string} val
 * */

export const handleTableCss = (text, val) => {
  const width = val === '机构名称' ? '380px' : '180px';
  return (
    <Tooltip title={text} placement="topLeft">
      <span
        style={{
          overflow: 'hidden',
          whiteSpace: 'nowrap',
          textOverflow: 'ellipsis',
          display: 'inline-block',
          width: width,
          paddingTop: '5px',
        }}
      >
        {text}
      </span>
    </Tooltip>
  );
};
