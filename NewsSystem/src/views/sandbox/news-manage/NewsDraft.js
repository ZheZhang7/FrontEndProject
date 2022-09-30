// 草稿箱
import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { Table, Button, Modal, notification } from 'antd'
import { DeleteOutlined, EditOutlined, ExclamationCircleOutlined, VerticalAlignTopOutlined } from '@ant-design/icons';
import axios from 'axios'

const { confirm } = Modal

export default function NewsDraft() {

    const navigate = useNavigate()

    const [dataSource, setDataSource] = useState([])
    const { username } = JSON.parse(localStorage.getItem("token"))
    useEffect(() => {
        axios.get(`/news?author=${username}&auditState=0&_expand=category`).then(
            response => {
                setDataSource(response.data);
            }
        )
    }, [username])

    const columns = [
        {
            title: 'ID',
            // dataIndex和后端字段一定要匹配上
            dataIndex: 'id',
            render: (id) => { return <b>{id}</b> }
        },
        {
            title: '新闻标题',
            dataIndex: 'title',
            render: (title, item) => {
                return <a href={`#/news-manage/preview/${item.id}`}>{title}</a>
            }

        },
        {
            title: '作者',
            dataIndex: 'author',

        },
        {
            title: '新闻分类',
            dataIndex: 'category',
            render: (category) => {
                return category.title
            }
        },
        {
            title: '操作',
            render: (item) => {
                return <div>
                    <Button style={{ marginRight: '10px' }} onClick={() => confirmMethod(item)} type="danger" shape="circle" icon={<DeleteOutlined />} />
                    <Button style={{ margin: '0px 10px' }} type="primary" shape="circle" icon={<EditOutlined />} onClick={() => { navigate(`/news-manage/update/${item.id}`) }} />
                    <Button style={{ margin: '0px 10px' }} onClick={() => handleCheck(item.id, item.auditState)} type="primary" shape="circle" icon={<VerticalAlignTopOutlined />} />
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
        setDataSource(dataSource.filter(data => data.id !== item.id))
        axios.delete(`/news/${item.id}`)
    }

    // 在草稿箱中的提交
    const handleCheck = (id, auditState) => {

        axios.patch(`/news/${id}`, {
            auditState: 1
        }).then(
            response => {
                navigate('/audit-manage/list')
                notification.info({

                    message: `通知`,
                    description:
                        `您可以到审核列表中查看您的新闻`,
                    placement: 'topRight',
                });
            }
        )
    }



    return (
        <div>
            <Table dataSource={dataSource} columns={columns} pagination={{ pageSize: 5 }} rowKey={(item) => item.id} />
        </div>
    )
}