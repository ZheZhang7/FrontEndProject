import React, { useEffect, useState, useRef } from 'react'
import { Avatar, Card, Col, Row, List, Drawer } from 'antd';
import { PieChartOutlined } from '@ant-design/icons';
import * as echarts from 'echarts'
import axios from 'axios'
import _ from 'lodash'

const { Meta } = Card

export default function Home() {
    const [viewList, setViewList] = useState([]);
    const [starList, setStarList] = useState([]);
    const [allList, setAllList] = useState([]);
    const [visible, setVisible] = useState(false)
    const [pieChart, setPieChart] = useState(null);
    // 请求最长浏览
    useEffect(() => {
        axios.get(`/news?publishState=2&_expand=category&_sort=view&_order=desc&_limit=6`).then(
            response => {
                setViewList(response.data)
            }
        )
    }, [])

    // 请求点赞
    useEffect(() => {
        axios.get(`/news?publishState=2&_expand=category&_sort=star&_order=desc&_limit=6`).then(
            response => {
                setStarList(response.data)
            }
        )
    }, [])

    // 初始化柱状图
    const barRef = useRef()
    useEffect(() => {
        axios.get(`news?publishState=2&_expand=category`).then(
            response => {
                renderBar(_.groupBy(response.data, item => item.category.title))
                setAllList(response.data)
            }

        )
        // 销毁图标的响应式
        return () => {
            window.onresize = null
        }
    }, [])

    const renderBar = (obj) => {
        var myChart = echarts.init(barRef.current);

        // 指定图表的配置项和数据
        var option = {
            title: {
                text: '新闻分类图示'
            },
            legend: {
                data: ['数量']
            },
            xAxis: {
                data: Object.keys(obj)
            },
            yAxis: {},
            series: [
                {
                    name: '数量',
                    type: 'bar',
                    data: Object.values(obj).map(item => item.length),
                    minInterval: 1
                }
            ]
        };

        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option);

        // 监听大小变化，实现响应式
        window.onresize = () => {
            myChart.resize();
        }
    }

    // 初始化饼状图
    const pieRef = useRef()

    const renderPie = () => {
        // 数据处理

        let currentList = allList.filter((data) => data.author === username);
        let groupObj = _.groupBy(currentList, (item) => item.category.title);

        let list = [];
        for (let i in groupObj) {
            list.push({
                name: i,
                value: groupObj[i].length,
            });
        }



        var myChart;
        if (!pieChart) {
            myChart = echarts.init(pieRef.current)
            setPieChart(myChart)
        } else {
            myChart = pieChart
        }
        var option;

        option = {
            title: {
                text: '当前用户新闻分类图示',
                left: 'center'
            },
            tooltip: {
                trigger: 'item'
            },
            legend: {
                orient: 'vertical',
                left: 'left'
            },
            series: [
                {
                    name: '发布数量',
                    type: 'pie',
                    radius: '50%',
                    data: list,
                    center: ['50%', '50%'],
                    emphasis: {
                        itemStyle: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    }
                }
            ]
        };

        option && myChart.setOption(option);

    }

    // 用户信息
    const { username, region, role: { roleName } } = JSON.parse(localStorage.getItem("token"))
    return (
        <div className="site-card-wrapper">
            <Row gutter={16} >
                <Col span={8} >
                    <Card title="用户最常浏览" bordered={true} hoverable={true}>
                        <List
                            size="small"
                            dataSource={viewList}
                            renderItem={(item) => <List.Item>
                                <a href={`#/news-manage/preview/${item.id}`}>{item.title}</a>
                            </List.Item>}
                        />
                    </Card>
                </Col>
                <Col span={8}>
                    <Card title="用户点赞最多" bordered={true} hoverable={true}>
                        <List
                            size="small"
                            dataSource={starList}
                            renderItem={(item) => <List.Item>
                                <a href={`#/news-manage/preview/${item.id}`}>{item.title}</a>
                            </List.Item>}
                        />
                    </Card>
                </Col>
                <Col span={8}>
                    <Card title="用户信息" bordered={true} hoverable={true}>
                        <Card
                            cover={
                                <img
                                    alt="example"
                                    src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
                                />
                            }
                            actions={[
                                <PieChartOutlined key="setting" onClick={() => {
                                    setTimeout(() => {
                                        setVisible(true)

                                        // 初始化饼图
                                        renderPie()
                                    }, 0)
                                }} />,
                                // <EditOutlined key="edit" />,
                                // <EllipsisOutlined key="ellipsis" />,
                            ]}
                        >
                            <Meta
                                avatar={<Avatar src="https://joeschmoe.io/api/v1/random" />}
                                title={username}
                                description={
                                    <div>
                                        <b>{region ? region : "全球"}</b>
                                        <span style={{ paddingLeft: "30px" }}>{roleName}</span>
                                    </div>
                                }
                            />
                        </Card>
                    </Card>
                </Col>
            </Row>

            {/* 图表 */}
            <div ref={barRef} style={{
                width: '66%',
                height: "400px",
                marginTop: "30px",

            }}></div>

            {/* 抽屉组件 */}
            <Drawer
                width={'600px'}
                title="个人新闻分类"
                placement="right"
                onClose={() => {
                    setVisible(false)
                }}
                visible={visible}
                closable={true}
            >

                <div ref={pieRef} style={{
                    width: '100%',
                    height: "400px",
                    marginTop: "30px",

                }}></div>
            </Drawer>

        </div>
    )
}