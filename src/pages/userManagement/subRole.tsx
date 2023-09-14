import React, { useState } from 'react';
import { Button, Icon, message, Modal, Select, Tag } from 'antd';
import cloneDeep from 'lodash/cloneDeep';

const { Option } = Select;

interface tagType {
  checked: number;
  checkerId: number;
  checkerTime: string;
  code: string;
  createTime: string;
  creatorId: number;
  deleteTime: string;
  deleted: number;
  deletorId: number;
  deptId: number;
  id: number;
  lastEditTime: string;
  lastEditorId: number;
  name: string;
  orgId: number;
  remark: string;
  sysId: number;
  type: number;
}

interface propsType {
  sysId: string;
  handleRoleBySysId?: (p: string) => {};
  roleBySys: tagType[];
  selectTagList: tagType[];
  setSelectTagList: (p: any[]) => {};
  showModal: (id: any) => {};
}

/**
 *
 * @param {string} sysId
 * @param {function} handleRoleBySysId
 * @param {[tagType]} roleBySys
 * @param {[tagType]} selectTagList
 * @param {function} setSelectTagList
 * @param {hook function} showModal
 * @returns {JSX.Element}
 * @constructor
 */
const SubRole = ({
  sysId,
  handleRoleBySysId,
  roleBySys,
  selectTagList,
  setSelectTagList,
  showModal,
}: propsType) => {
  const [visible, setVisible] = useState<boolean>(false);
  const [selectValue, setSelectValue] = useState<number>();

  const handleOk = () => {
    const temp = roleBySys.find(item => item.id === selectValue);
    const same = selectTagList.find(item => item?.id === selectValue);
    if (!same) {
      setSelectTagList([...cloneDeep(selectTagList), cloneDeep(temp)]);
      setSelectValue(undefined);
      setVisible(false);
    } else {
      message.warning('该角色已经添加过了');
    }
  };
  const handleChange = (e: number): void => setSelectValue(e);

  const addTag = (): void => {
    if (!sysId) {
      message.warning('请先选择系统');
      return;
    }
    handleRoleBySysId && handleRoleBySysId(sysId);
    setVisible(true);
  };

  const handleCloseTag = (tag: tagType): void => {
    const tempList = cloneDeep(selectTagList);
    const tempIndex = tempList.findIndex(item => item.id === tag.id);
    if (~tempIndex) {
      tempList.splice(tempIndex, 1);
    }
    setSelectTagList(tempList);
  };
  return (
    <>
      <div
        style={{
          padding: '24px',
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          background: 'rgba(0, 0, 0, 0.1)',
          borderRadius: 4,
          margin: '16px 0',
        }}
      >
        <div>
          <Tag onClick={addTag} style={{ margin: 8, background: '#fff', borderStyle: 'dashed' }}>
            <Icon type="plus" /> 添加角色
          </Tag>
          {selectTagList
            .filter(item => item?.sysId === +sysId)
            .map(item => (
              <Tag
                closable
                color="#2450A5"
                onClose={(e: CloseEvent) => {
                  e.preventDefault();
                  handleCloseTag(item);
                }}
                key={item.id}
                style={{ margin: 8 }}
              >
                {item.name}
              </Tag>
            ))}
        </div>
        {/* <div style={{ minWidth: 60, margin: 8 }}>
          <Button
            onClick={() => {
              showModal(sysId);
            }}
            type="link"
          >
            预览权限
          </Button>
        </div> */}
      </div>
      <Modal
        title="添加角色"
        visible={visible}
        onOk={handleOk}
        onCancel={() => setVisible(false)}
        destroyOnClose={true}
      >
        <label style={{ marginRight: '10px' }}>当前角色:</label>
        <Select
          style={{ width: '50%' }}
          allowClear
          onChange={handleChange}
          optionFilterProp="children"
          showSearch
        >
          {roleBySys.map(item => (
            <Option key={item.id} value={item.id}>
              {item.name}
            </Option>
          ))}
        </Select>
      </Modal>
    </>
  );
};

export default SubRole;
