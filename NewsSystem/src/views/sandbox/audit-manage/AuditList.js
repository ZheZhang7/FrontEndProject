import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

import { Table, Button, Tag, notification } from 'antd'
// import { DeleteOutlined } from '@ant-design/icons';

export default function AuditList() {

    const [dataSource, setDataSource] = useState([])

    const navigate = useNavigate()

    const { username } = JSON.parse(localStorage.getItem("token"))
    useEffect(() => {
        // 请求路径条件为作者是自己,auditState不等于0 也就是不在草稿箱里面的
        // publishState<=1 还未发布的 已通过审核的就是待发布的
        axios.get(`/news?author=${username}&auditState_ne=0&publishState_lte=1&_expand=category`).then(
            response => {
                setDataSource(response.data)
            }
        )
    })

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
            title: '审核状态',
            dataIndex: 'auditState',
            render: (auditState) => {
                const colorList = ["", "orange", "green", "red"]
                const auditList = ["草稿箱", "审核中", "已通过", "未通过"]
                return <Tag color={colorList[auditState]}>{auditList[auditState]}</Tag>
            }
        },
        {
            title: '操作',
            render: (item) => {
                return <div>
                    {
                        item.auditState === 1 && <Button onClick={() => handleRevert(item)} type='default'>撤销</Button>
                    }
                    {
                        item.auditState === 2 && <Button onClick={() => handlePublish(item)} type="danger">发布</Button>
                    }
                    {
                        item.auditState === 3 && <Button onClick={() => handleUpdate(item)} type="primary">更新</Button>
                    }
                </div >
            }
        }
    ];

    // 撤销
    const handleRevert = (item) => {
        setDataSource(dataSource.filter(data => data.id !== item.id))
        axios.patch(`/news/${item.id}`, {
            auditState: 0
        }).then(
            response => {
                notification.info({
                    message: `通知`,
                    description:
                        `您可以到草稿箱中查看您的新闻`,
                    placement: 'topRight',
                });
            }
        )
    }

    // 更新
    const handleUpdate = (item) => {
        navigate(`/news-manage/update/${item.id}`)
    }

    // 发布
    const handlePublish = (item) => {
        axios.patch(`/news/${item.id}`, {
            'publishState': 2,
            'publishTime': Date.now()
        }).then(res => {
            navigate('/publish-manage/published')

            notification.info({
                message: `通知`,
                description: `你可以到【发布管理/已发布】中查看您的新闻`,
                placement: "topRight",
            });

        })
    }


    return (
        <div>
            <Table dataSource={dataSource} columns={columns} pagination={{ pageSize: 5 }} rowKey={item => item.id} />
        </div>
    )
}
