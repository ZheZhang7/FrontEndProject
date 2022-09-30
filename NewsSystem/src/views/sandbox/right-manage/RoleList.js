// 角色管理  
// 超级管理员（审批所有） 区域管理员（审核区域编辑稿件） 区域编辑（写）
// 根据不同的角色具有不同的权限
import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Tree } from 'antd';
import { DeleteOutlined, UnorderedListOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import axios from 'axios';

const { confirm } = Modal;

export default function RoleList() {

    const [dataSource, setDataSource] = useState([])
    const [rightList, setRightList] = useState([])
    const [currentRights, setCurrentRights] = useState([])
    const [currentID, setCurrentID] = useState([])
    const [autoExpandParent, setAutoExpandParent] = useState(true)
    const [expandedKeys, setExpandedKeys] = useState([])
    const [isModalVisible, setIsModalVisible] = useState(false);

    // 发送ajax请求，渲染数据
    useEffect(() => {
        axios.get('/roles').then(
            response => setDataSource(response.data)
        )
    }, [])

    useEffect(() => {
        axios.get('/rights?_embed=children').then(
            response => setRightList(response.data)
        )
    }, [])

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            render: (id) => { return <b>{id}</b> }
        },
        {
            title: '角色名称',
            dataIndex: 'roleName',
        },
        {
            title: '操作',
            render: (item) => {
                return <div>
                    <Button onClick={() => confirmMethod(item)} type="danger" shape="circle" icon={<DeleteOutlined />} />
                    <Button
                        onClick={() => {
                            setIsModalVisible(true)
                            setCurrentRights(item.rights)
                            setCurrentID(item.id)
                        }}
                        style={{ marginLeft: '5px' }}
                        type="primary"
                        shape="circle"
                        icon={<UnorderedListOutlined />}
                    />
                </div>
            }
        }
    ]

    // 点击删除
    const confirmMethod = (item) => {
        confirm({
            title: '确定删除？',
            icon: <ExclamationCircleOutlined />,
            onOk() {
                deleteMethod(item);
            }
        });
    }

    // 确认删除，更新后端
    const deleteMethod = (item) => {
        setDataSource(dataSource.filter(data => data.id !== item.id))
        axios.delete(`/roles/${item.id}`)
    }

    // 树形结构
    // 点击确认
    const handleOk = () => {
        setIsModalVisible(false)
        // 同步dataSource
        setDataSource(dataSource.map((item) => {
            if (item.id === currentID) {
                return {
                    ...item,
                    rights: currentRights
                }
            }
            return item
        }))
        // 同步后端
        axios.patch(`/roles/${currentID}`, {
            rights: currentRights
        })
    }
    // 点击取消
    const handleCancel = () => {
        setIsModalVisible(false)
    }

    const onCheck = (checkedKeys) => {
        setCurrentRights(checkedKeys.checked)
    }

    // 树形展开
    const onExpand = (expandedKeys) => {
        setExpandedKeys(expandedKeys)
        setAutoExpandParent(false)
    }
    return (
        <div>
            <Table dataSource={dataSource} columns={columns} pagination={{ pageSize: 5 }} rowKey={(item) => item.id}></Table>
            <Modal title="权限分配" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
                <Tree
                    checkedKeys={currentRights}
                    onCheck={onCheck}
                    // 取消父子间联系
                    checkStrictly
                    checkable
                    onExpand={onExpand}
                    autoExpandParent={autoExpandParent}
                    expandedKeys={expandedKeys}
                    treeData={rightList}
                />
            </Modal>
        </div>
    )
}
