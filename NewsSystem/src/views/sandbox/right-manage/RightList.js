import React, { useState, useEffect } from 'react'
import { Table, Tag, Button, Modal, Popover, Switch } from 'antd'
import { DeleteOutlined, EditOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import axios from 'axios'

const { confirm } = Modal

export default function RightList() {

    const [dataSource, setDataSource] = useState([])

    useEffect(() => {
        axios.get("/rights?_embed=children").then(
            response => {
                response.data.forEach(item => {
                    return item.children?.length === 0 ? item.children = '' : item.children;
                });
                setDataSource(response.data);
            }
        )
    }, [])

    const columns = [
        {
            title: 'ID',
            // dataIndex和后端字段一定要匹配上
            dataIndex: 'id',
            render: (id) => { return <b>{id}</b> }
        },
        {
            title: '权限名称',
            dataIndex: 'title',

        },
        {
            title: '权限路径',
            dataIndex: 'key',
            render: (key) => { return <Tag color="orange">{key}</Tag> }
        },
        {
            title: '操作',
            render: (item) => {
                return <div>
                    <Button onClick={() => confirmMethod(item)} type="danger" shape="circle" icon={<DeleteOutlined />} />
                    {/* 如果没有配置pagepermisson这一项时，则会禁用按钮 */}
                    <Popover content={
                        <div style={{ textAlign: "center" }}>
                            <Switch checked={item.pagepermisson} onChange={() => switchMethod(item)}></Switch>
                        </div>}
                        title="页面配置项" trigger={item.pagepermisson === undefined ? '' : 'click'}>
                        <Button style={{ marginLeft: '5px' }} type="primary" shape="circle" icon={<EditOutlined />} disabled={item.pagepermisson === undefined} />
                    </Popover>

                </div>
            }
        }
    ];

    // 删除弹框
    const confirmMethod = (item) => {
        confirm({
            title: '确定删除？',
            icon: <ExclamationCircleOutlined />,

            onOk() {
                // console.log('OK');
                deleteMethod(item);
            },

            onCancel() {
                // console.log('Cancel');
            },
        });
    }

    // 删除确认函数
    const deleteMethod = (item) => {
        // 当前页面同步 + 后端页面删除

        if (item.grade === 1) {
            setDataSource(dataSource.filter(data => data.id !== item.id))
            axios.delete(`/rights/${item.id}`)
        } else {
            let list = dataSource.filter(data => data.id === item.rightId)
            list[0].children = list[0].children.filter(data => data.id !== item.id)
            setDataSource([...dataSource])
            axios.delete(`/children/${item.id}`)
        }
    }

    // 开关编辑权限函数
    const switchMethod = (item) => {
        item.pagepermisson = item.pagepermisson === 1 ? 0 : 1;
        setDataSource([...dataSource])

        if (item.grade === 1) {
            axios.patch(`/rights/${item.id}`, {
                pagepermisson: item.pagepermisson
            })
        } else {
            axios.patch(`/children/${item.id}`, {
                pagepermisson: item.pagepermisson
            })
        }

    }

    return (
        <div>
            <Table dataSource={dataSource} columns={columns} pagination={{ pageSize: 5 }} />
        </div>
    )
}
