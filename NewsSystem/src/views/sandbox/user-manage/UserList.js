import React, { useState, useEffect, useRef } from 'react'
import { Table, Button, Modal, Switch } from 'antd'
import { DeleteOutlined, EditOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import axios from 'axios'

import UserForm from '../../../components/user-manage/UserForm';

const { confirm } = Modal

export default function UserList() {

    const [dataSource, setDataSource] = useState([])
    const [isAddVisible, setIsAddVisible] = useState(false)
    const [isUpdateVisible, setIsUpdateVisible] = useState(false)
    const [isUpdateDisabled, setIsUpdateDisabled] = useState(false)
    const [regionList, setRegionList] = useState([])
    const [roleList, setRoleList] = useState([])
    // 保存更新
    const [current, setCurrent] = useState(null)
    const addForm = useRef(null)
    const updateForm = useRef(null)

    // 解构角色权限
    const { roleId, region, username } = JSON.parse(localStorage.getItem("token"))
    useEffect(() => {
        axios.get("/users?_expand=role").then(
            response => setDataSource(roleId === 1 ? response.data : [
                // 自己
                ...response.data.filter(item => item.username === username),
                // 和自己同一个区域的并且比自己权限小的
                ...response.data.filter(item => item.region === region && item.roleId === 3)
            ])
        )
    }, [roleId, region, username])

    useEffect(() => {
        axios.get("/regions").then(
            response => setRegionList(response.data)
        )
    }, [])

    useEffect(() => {
        axios.get("/roles").then(
            response => setRoleList(response.data)
        )
    }, [])

    const columns = [
        {
            title: '区域',
            dataIndex: 'region',
            // 可筛选项
            filters: [
                ...regionList.map(item => ({
                    text: item.title,
                    value: item.value

                })),
                {
                    text: '全球',
                    value: '全球'
                }
            ],
            // 筛选
            onFilter: (value, item) => {
                if (value === '全球') {
                    return item.region === ''
                }
                return item.region === value
            },
            render: (region) => { return <b>{region === '' ? '全球' : region}</b> }
        },
        {
            title: '角色名称',
            dataIndex: 'role',
            filters: [
                ...roleList.map(item => ({
                    text: item.roleName,
                    value: item.roleName
                }))
            ],
            onFilter: (value, item) => item.role.roleName === value,
            render: (role) => {
                return role?.roleName
            }
        },
        {
            title: '用户名',
            dataIndex: 'username',
        },
        {
            title: '用户状态',
            dataIndex: 'roleState',
            render: (roleState, item) => {
                return <Switch onChange={() => handleChange(item)} checked={roleState} disabled={item.default}></Switch>
            }
        },
        {
            title: '操作',
            render: (item) => {
                return <div>
                    <Button onClick={() => confirmMethod(item)} type="danger" shape="circle" icon={<DeleteOutlined />} disabled={item.default} />
                    <Button onClick={() => handleUpdate(item)} style={{ marginLeft: '5px' }} type="primary" shape="circle" icon={<EditOutlined />} disabled={item.default} />
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
        setDataSource(dataSource.filter(data => item.id !== data.id))
        axios.delete(`/users/${item.id}`)
    }

    // 点击确认函数
    const addFormOK = () => {
        addForm.current.validateFields().then(
            value => {
                // 关闭弹窗
                setIsAddVisible(false)
                // 重置表单
                addForm.current.resetFields();

                // post 到后端 生成id 方便后续删除和更新
                axios.post(`/users`, {
                    ...value,
                    "roleState": true,
                    "default": false
                }).then(
                    // 没有连表role 因此，不刷新不会显示角色名称
                    // 解决方法可以后端进行连接操作
                    // 或者前端进行过滤 role: roleList.filter(item => item.id === value.roleId)[0]
                    response => setDataSource([...dataSource, {
                        ...response.data,
                        role: roleList.filter(item => item.id === value.roleId)[0]
                    }])
                )
            }
        ).catch(
            err => console.log(err)
        )
    }

    // 编辑用户状态
    const handleChange = (item) => {
        item.roleState = !item.roleState;
        setDataSource([...dataSource])
        axios.patch(`/users/${item.id}`, {
            roleState: item.roleState
        })
    }

    // 编辑按钮函数
    const handleUpdate = (item) => {
        // react不保证同步更新状态
        // 我们采用异步方式，同步触发，保证刷新后不空白
        setIsUpdateVisible(true);
        setTimeout(() => {
            if (item.roleId === 1) {
                // 禁用
                setIsUpdateDisabled(true)
            } else {
                // 取消禁用
                setIsUpdateDisabled(false)
            }
            // 从表单中动态读取原数据
            updateForm.current.setFieldsValue(item)
        }, 0)

        setCurrent(item)
    }

    // 编辑确认函数
    const updateFormOK = () => {
        updateForm.current.validateFields().then(
            value => {
                setIsUpdateVisible(false)
                setDataSource(dataSource.map(item => {
                    if (item.id === current.id) {
                        return {
                            ...item,
                            ...value,
                            role: roleList.filter(data => data.id === value.roleId)[0]
                        }
                    }
                    return item
                }))
                setIsUpdateDisabled(!isUpdateDisabled)
                axios.patch(`/users/${current.id}`, value)
            }
        ).catch(
            err => console.log(err)
        )
    }

    return (
        <div>
            <Button type='primary' onClick={() => { setIsAddVisible(true) }}>添加用户</Button>
            <Table
                rowKey={(item) => item.id}
                dataSource={dataSource}
                columns={columns}
                pagination={{ pageSize: 5 }}
            />

            {/* 添加用户的模态框 */}
            <Modal
                visible={isAddVisible}
                title="添加用户"
                okText="确定"
                cancelText="取消"
                onCancel={() => { setIsAddVisible(false) }}
                onOk={() => addFormOK()}
            >
                <UserForm ref={addForm} regionList={regionList} roleList={roleList}></UserForm>
            </Modal>

            {/* 更新的模态框 */}
            <Modal
                visible={isUpdateVisible}
                title="更新用户"
                okText="更新"
                cancelText="取消"
                onCancel={() => {
                    setIsUpdateVisible(false)
                    setIsUpdateDisabled(!isUpdateDisabled)
                }}
                onOk={() => updateFormOK()}
            >
                <UserForm ref={updateForm} regionList={regionList} roleList={roleList} isUpdateDisabled={isUpdateDisabled} isUpdate={true}></UserForm>
            </Modal>
        </div>
    )
}

