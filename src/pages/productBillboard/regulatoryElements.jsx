/**
 * 产品看板-查看产品-监管要素
 */
import React, { useContext, useEffect, useRef, useState } from 'react';
import { Button, Table, Select, Tooltip } from 'antd';
import { connect } from 'dva';
import router from 'umi/router';
import MyContext from './myContext';
import { errorBoundary } from '@/layouts/ErrorBoundary';
import { tableRowConfig } from '@/pages/investorReview/func';
import { uuid, getNamebyId } from '@/utils/utils';

const { Option } = Select;

const RegulatoryElements = ({
    dispatch,
}) => {
    const { proCodeArguments } = useContext(MyContext); // 子组件接受的数据
    const [page, setPage] = useState(1); // 当前页
    const [pageSize, setPageSize] = useState(10); // 每页展示条数
    const [total, setTotal] = useState(0); // 总条数
    const [tableList, setTableList] = useState([]); // 表格数据
    const [tableLoading, setTableLoading] = useState(false);
    const [operationType, setOperationType] = useState(undefined); // 监管要素类型
    const [allUsers, setAllUsers] = useState([]);

    useEffect(() => {
        getAllUsers();
    }, [])

    useEffect(() => {
        getTableList();
    }, [proCodeArguments, page, pageSize, operationType]);

    // 请求方法:获取表格数据
    async function getTableList() {
        const params = { page, pageSize, operationType, proCode: proCodeArguments };
        setTableLoading(true);
        await dispatch({
            type: 'productBillboard/getRegulatoryElements',
            payload: params
        }).then(res => {
            setTableList(res.rows);
            setTotal(res.total);
        })
        setTableLoading(false);
    }

    function getAllUsers() {
        dispatch({
            type: 'productBillboard/getAllUsers'
        }).then(res => {
            setAllUsers(res);
        })
    }

    function handleSearch(val) {
        setPage(1);
        setOperationType(val);
    }

    // 点击查看，跳转页面同[产品数据管理-监管要素信息管理]
    function handleCheck(record) {
        switch (record.operationType) {
            case 'FISP报表':
                router.push(`/dynamicPage/pages/FISP报表/8a8ada707d74bee0017edce751400012/查看?type=view&id=${record.dataId}&proCode=${proCodeArguments}&secondary=true`)
                break;
            case '个性化内部报表':
                router.push(`/dynamicPage/pages/个性化内部报表/8a8ada707d74bee0017eeca6fef20015/查看?type=view&id=${record.dataId}&proCode=${proCodeArguments}&secondary=true`)
                break;
            case '人行报表':
                router.push(`/dynamicPage/pages/人行报表/8a8ada707d74bee0017eecdd29bc0017/查看?type=view&id=${record.dataId}&proCode=${proCodeArguments}&secondary=true`)
                break;
            case '中基协报表':
                router.push(`/dynamicPage/pages/中基协报表/8a8ada707d74bee0017f06411bf20025/查看?type=view&id=${record.dataId}&proCode=${proCodeArguments}&secondary=true`)
                break;
            case '中证协':
                router.push(`/dynamicPage/pages/中证协报表/8a8ada707d74bee0017eecfddc4f0019/查看?type=view&id=${record.dataId}&proCode=${proCodeArguments}&secondary=true`)
                break;
            default:
                router.push(`/dynamicPage/pages/资管月周报/8a8ada707d74bee0017eed1c341a001d/查看?type=view&id=${record.dataId}&proCode=${proCodeArguments}&secondary=true`)

        }
    }

    // 页码属性设置
    const paginationProps = {
        total,
        showQuickJumper: true,
        showSizeChanger: true,
        current: page,
        onChange: currentPage => {
            setPage(currentPage);
        },
        onShowSizeChange: (current, size) => {
            setPage(1);
            setPageSize(size);
        },
        showTotal: () => {
            return `共 ${total} 条数据`;
        },
    };

    // 静态数据:表头ebyId
    const columns = [
        {
            title: '监管要素类型',
            dataIndex: 'operationType',
            key: 'operationType',
            ...tableRowConfig,
            width: 300,
            sorter: false,
            align: 'center',
        },
        {
            title: '操作人',
            dataIndex: 'operatorUser',
            key: 'operatorUser',
            width: 300,
            sorter: false,
            align: 'center',
            render: text => {
                const label = getNamebyId(text, allUsers, 'id', 'name')
                return (
                    <Tooltip title={label} placement="topLeft">
                        {label
                            ? label.toString().replace(/null/g, '-')
                            : label === '' || label === undefined || label === null
                                ? '-'
                                : 0}
                    </Tooltip>
                );
            }
        },
        {
            title: '状态',
            dataIndex: 'operationDescription',
            key: 'operationDescription',
            ...tableRowConfig,
            width: 250,
            sorter: false,
            align: 'center',
        },
        {
            title: '操作时间',
            dataIndex: 'operatingTime',
            key: 'operatingTime',
            ...tableRowConfig,
            width: 250,
            sorter: false,
            align: 'center',
        },
        {
            title: '操作',
            key: 'operation',
            dataIndex: 'operation',
            fixed: 'right',
            width: 200,
            align: 'center',
            render: (text, record) => {
                return record.operationDescription !== '数据删除' ?
                    <Button type="link" onClick={() => handleCheck(record)} disabled={record.deleted === 1}>
                        查看
                    </Button> : '-'
            },
        },
    ];

    return (
        <>
            <Select
                placeholder="所有监管要素类型"
                allowClear
                showSearch
                optionFilterProp="children"
                filterOption={(input, option) =>
                    option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
                style={{ width: '200px', marginBottom: '10px' }}
                onChange={val => handleSearch(val)}
            >
                <Option value="FISP报表" key="1">FISP报表</Option>
                <Option value="个性化内部报表" key="2">个性化内部报表</Option>
                <Option value="人行报表" key="3">人行报表</Option>
                <Option value="中基协报表" key="4">中基协报表</Option>
                <Option value="中证协" key="5">中证协</Option>
                <Option value="资管月周报" key="6">资管月周报</Option>
            </Select>
            <Table
                pagination={paginationProps} // 分页栏
                loading={tableLoading} // 加载中效果
                rowKey={uuid()} // key值
                dataSource={tableList} // 表数据源
                columns={columns} // 表头数据
                scroll={{ x: true }}
            />
        </>
    );
};

const WrappedIndexForm = errorBoundary(
    connect()(RegulatoryElements),
);

export default WrappedIndexForm;
