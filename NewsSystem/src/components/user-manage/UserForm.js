import React, { forwardRef, useState, useEffect } from 'react'
import { Form, Input, Select } from 'antd'

const { Option } = Select

// forwardRef 在父组件中调用子组件中某个DOM节点或者组件的ref
// 在这里  userlist里面的onOk事件 需要userform中表单的值  forward可以透传多层
const UserForm = forwardRef((props, ref) => {

    const { roleList, regionList, isUpdateDisabled, isUpdate } = props;
    const [isDisabled, setIsDisabled] = useState(false)

    useEffect(() => {
        setIsDisabled(isUpdateDisabled)
    }, [isUpdateDisabled]);

    // 区域权限控制
    const { roleId, region } = JSON.parse(localStorage.getItem("token"))
    const checkRegionDisabled = (item) => {
        // 更新处理
        if (isUpdate) {
            // 超级管理员
            if (roleId === 1) {
                // 不禁用
                return false
            } else {
                // 禁用
                return true
            }
        } else {      //创建处理
            // 超级管理员
            if (roleId === 1) {
                return false
            } else {
                // 禁用
                return item.value !== region
            }
        }
    }

    // 角色权限控制
    const checkRoleDisabled = (item) => {
        if (isUpdate) {
            if (roleId === 1) {
                return false
            } else {
                return true
            }
        } else {
            if (roleId === 1) {
                return false
            } else {
                // 禁用非编辑的角色按钮
                return item.id !== 3
            }
        }
    }

    return (
        <Form layout="vertical" ref={ref}>
            <Form.Item
                name="username"
                label="用户名"
                rules={[
                    {
                        required: true,
                        message: 'Please input the title of collection!',
                    },
                ]}
            >
                <Input />
            </Form.Item>
            <Form.Item
                name="password"
                label="密码"
                rules={[
                    {
                        required: true,
                        message: 'Please input the title of collection!',
                    },
                ]}
            >
                <Input type='password' />
            </Form.Item>
            <Form.Item
                name="region"
                label="区域"
                rules={isDisabled ? [] : [
                    {
                        required: true,
                        message: 'Please input the title of collection!',
                    },
                ]}
            >
                <Select disabled={isDisabled}>
                    {
                        regionList.map(item => <Option value={item.value} key={item.id} disabled={checkRegionDisabled(item)}>{item.title}</Option>)
                    }
                </Select>
            </Form.Item>
            <Form.Item
                name="roleId"
                label="角色"
                rules={[{
                    required: true,
                    message: 'Please input the title of collection!',
                }]}
            >
                <Select onChange={(value) => {
                    if (value === 1) {
                        setIsDisabled(true)
                        ref.current.setFieldsValue({
                            region: ''
                        })
                    } else {
                        setIsDisabled(false)
                    }
                }}>
                    {
                        roleList.map(item => <Option value={item.id} key={item.id} disabled={checkRoleDisabled(item)}>{item.roleName}</Option>)
                    }
                </Select>
            </Form.Item>
        </Form>
    )
})

export default UserForm