import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Descriptions, PageHeader } from 'antd';
import axios from 'axios';

export default function NewsPreview() {
    const params = useParams();
    const [newsInfo, setNewsInfo] = useState("")
    useEffect(() => {
        axios.get(`/news/${params.id}?_expand=category&_expand=role`).then(
            response => setNewsInfo(response.data)
        )
    }, [params.id])

    const changeTimeFormat = (time) => {
        var date = new Date(time);
        var month = date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
        var currentDate = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
        var hh = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
        var mm = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
        return date.getFullYear() + "-" + month + "-" + currentDate + " " + hh + ":" + mm;
    }

    const auditList = ["未审核", "审核中", "已通过", "未通过"];
    const publishList = ["未发布", "待发布", "已上线", "已下线"];
    const colorList = ["black", "orange", "green", "red"];

    return (
        <div>
            {
                newsInfo && <PageHeader
                    ghost={false}
                    onBack={() => window.history.back()}
                    title={newsInfo.title}
                    subTitle={newsInfo.category.title}
                >
                    <Descriptions size="small" column={3}>
                        <Descriptions.Item label="创建者">{newsInfo.author}</Descriptions.Item>
                        <Descriptions.Item label="创建时间">{changeTimeFormat(newsInfo.createTime)}</Descriptions.Item>
                        <Descriptions.Item label="发布时间">{newsInfo.publishTime ? changeTimeFormat(newsInfo.publishTime) : "-"}</Descriptions.Item>
                        <Descriptions.Item label="区域">{newsInfo.region}</Descriptions.Item>
                        <Descriptions.Item label="审核状态"><span style={{ color: colorList[newsInfo.auditState] }}>{auditList[newsInfo.auditState]}</span></Descriptions.Item>
                        <Descriptions.Item label="发布状态"><span style={{ color: colorList[newsInfo.publishState] }}>{publishList[newsInfo.publishState]}</span></Descriptions.Item>
                        <Descriptions.Item label="访问数量" ><span style={{ color: 'green' }}>{newsInfo.view}</span></Descriptions.Item>
                        <Descriptions.Item label="点赞数量" ><span style={{ color: 'green' }}>{newsInfo.star}</span></Descriptions.Item>
                        <Descriptions.Item label="评论数量" ><span style={{ color: 'green' }}>0</span></Descriptions.Item>
                    </Descriptions>
                </PageHeader>

            }

            <div
                dangerouslySetInnerHTML={{
                    __html: newsInfo.content,
                }}
                style={{
                    margin: "0 24px",
                    border: "1px solid gray"
                }}
            ></div>

        </div>
    )
}
