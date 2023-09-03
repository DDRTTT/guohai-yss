import React, { useEffect, useState, useRef, memo } from 'react';
import { Icon, Menu, Dropdown, Button, message, Modal, Tooltip, DatePicker } from 'antd';

const { RangePicker } = DatePicker
const CalendarDataTra = (info) => {
    const [isModalVisible, setIsModalVisible] = useState(false);//弹窗开关
    const [data, setData] = useState({});//日期
    //弹窗开关
    const showModal = () => {
        setIsModalVisible(true);
    };
    const handleOk = () => {
        setIsModalVisible(false);
    };
    const onCancel = () => {
        setIsModalVisible(false);
    }
    // 日期选择
    const onChangeRangeTime = (value, dateString) => {
        console.log(value, dateString);
    };

    return (
        <>
            <Dropdown className="iconBtn" overlay={
                (<Menu>
                    <Menu.Item >
                        <a type="primary" onClick={showModal} >
                            数据导入
                        </a>
                    </Menu.Item>
                    <Menu.Item>
                        <a >
                            数据导出
                        </a>
                    </Menu.Item>
                    <Menu.Item>
                        <a >
                            模板下载
                        </a>
                    </Menu.Item>
                    <Menu.Item>
                        <a >
                            开放日设置
                        </a>
                    </Menu.Item>
                </Menu>)
            } placement="bottomRight" >
                <Icon type="upload" />
            </Dropdown>
            <Modal
                title="Modal"
                visible={isModalVisible}
                onOk={handleOk}
                onCancel={onCancel}
            >
                {console.log(isModalVisible)}
                <p>Bla bla ...</p>
                <RangePicker
                    showTime={{ format: 'YYYY-MM-DD HH:mm' }}
                    format="YYYY-MM-DD HH:mm"
                    placeholder={['开始时间', '结束时间']}
                    onChange={(dates, dateStrings) => {
                        console.log(dates, dateStrings);
                    }}
                />
            </Modal>
        </>

    )
}
export default memo(CalendarDataTra)