import React, { useEffect, useState } from 'react'
import axios from 'axios'

import { Table, Button, notification } from 'antd'
import { CheckOutlined, CloseOutlined } from "@ant-design/icons"

export default function Audit() {
    const [dataSource, setDataSource] = useState([])
    const { roleId, region, username } = JSON.parse(localStorage.getItem("token"))
    useEffect(() => {
        const roleObj = {
            "1": "superadmin",
            "2": "admin",
            "3": "editor"
        }
        axios.get(`/news?auditState=1&_expand=category`).then(
            response => {
                const list = response.data
                setDataSource(roleObj[roleId] === "superadmin" ? list : [
                    ...list.filter(item => item.author === username),
                    ...list.filter(item => item.region === region && roleObj[item.roleId] === "editor" && item.username !== username)
                ])
            }
        )
    }, [roleId, region, username])


    const columns = [
        {
            title: '新闻标题',
            dataIndex: 'title',
            render: (title, item) => { return <a href={`#/news-manage/preview/${item.id}`}>{title}</a> }
        },
        {
            title: '作者',
            dataIndex: 'author',

        },
        {
            title: '新闻分类',
            dataIndex: 'category',
            render: (category) => { return <div>{category.title}</div> }
        },
        {
            title: '操作',
            render: (item) => {
                return <div>
                    <Button onClick={() => handleAudit(item, 2, 1)} style={{ marginRight: "10px" }} type='primary' shape='circle' icon={<CheckOutlined />}></Button>
                    <Button onClick={() => handleAudit(item, 3, 0)} style={{ margin: "0px 10px" }} type='danger' shape='circle' icon={<CloseOutlined />}></Button>
                </div >
            }
        }
    ];

    // 通过或者拒绝
    const handleAudit = (item, auditState, publishState) => {
        setDataSource(dataSource.filter((data) => data.id !== item.id))

        axios.patch(`/news/${item.id}`, {
            auditState,
            publishState
        }).then(
            notification.info({
                message: `通知`,
                description:
                    `您可以到【审核管理/审核列表】中查看您的新闻`,//正常逻辑是邮件系统的通知
                placement: 'topRight',
            })
        )
    }

    return (
        <div>
            <Table dataSource={dataSource} columns={columns} pagination={{ pageSize: 5 }} rowKey={item => item.id} />
        </div>
    )
}
