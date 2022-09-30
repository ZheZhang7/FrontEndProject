// 自定义hooks

import axios from 'axios'
import { useEffect, useState } from 'react'
import { notification } from 'antd'

function usePublish(type) {
    const { username } = JSON.parse(localStorage.getItem("token"))
    const [dataSource, setDataSource] = useState([])
    useEffect(() => {
        axios.get(`/news?author=${username}&publishState=${type}&_expand=category`).then(
            response => setDataSource(response.data)
        )
    }, [username, type]);

    // 发布
    const handlePublish = (id) => {
        setDataSource(dataSource.filter(item => item.id !== id))
        axios.patch(`/news/${id}`, {
            'publishState': 2,
            'publishTime': Date.now()
        }).then(res => {
            notification.info({
                message: `通知`,
                description: `你可以到【发布管理/已发布】中查看您的新闻`,
                placement: "topRight",
            });

        })
    }

    // 下线
    const handleSunset = (id) => {
        setDataSource(dataSource.filter(item => item.id !== id))
        axios.patch(`/news/${id}`, {
            'publishState': 3,
        }).then(res => {
            notification.info({
                message: `通知`,
                description: `你可以到【发布管理/已下线】中查看您的新闻`,
                placement: "topRight",
            });
        })

    }

    // 删除
    const handleDelete = (id) => {
        setDataSource(dataSource.filter(item => item.id !== id))
        axios.delete(`/news/${id}`).then(res => {
            notification.info({
                message: `通知`,
                description: `你成功删除您的新闻`,
                placement: "topRight",
            });
        })
    }
    return {
        dataSource,
        handlePublish,
        handleSunset,
        handleDelete
    }
}

export default usePublish