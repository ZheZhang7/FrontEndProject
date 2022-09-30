import React, { useState, useEffect, useRef } from 'react'
import { Button, PageHeader, Steps, Form, Input, Select, message, notification } from 'antd'
import axios from 'axios';
import NewsEditor from '../../../components/news-manage/NewsEditor';
import { useNavigate, useParams } from 'react-router-dom';
const { Step } = Steps;
const { Option } = Select;

export default function NewsUpdate() {
    const [current, setCurrent] = useState(0)
    const [categoryList, setCategoryList] = useState([])

    const [formInfo, setFormInfo] = useState({})
    const [content, setContent] = useState("")

    const navigate = useNavigate();
    const params = useParams()


    const handleNext = () => {
        if (current === 0) {
            NewsForm.current.validateFields().then(
                response => {
                    setFormInfo(response);
                    setCurrent(current + 1)
                }
            ).catch(
                error => console.log(error)
            )
        } else {
            if (content === "" || content.trim() === '<p></p>') {
                message.error("新闻内容不能为空")
            } else {
                setCurrent(current + 1);
            }
        }
    }

    const handlePrevious = () => {
        setCurrent(current - 1)
    }

    const handleSave = (auditState) => {
        axios.patch(`/news/${params.id}`, {
            ...formInfo,
            "content": content,
            // 审核状态  0 草稿箱  1 审核列表
            "auditState": auditState
        }).then(
            response => {
                navigate(auditState === 0 ? '/news-manage/draft' : '/audit-manage/list')
                notification.info({
                    message: `通知`,
                    description:
                        `您可以到${auditState === 0 ? "草稿箱" : "审核列表"}中查看您的新闻`,
                    placement: 'topRight',
                });
            }
        )
    }

    const NewsForm = useRef(null)

    useEffect(() => {
        axios.get("/categories").then(
            response => setCategoryList(response.data)
        )
    })

    useEffect(() => {
        axios.get(`/news/${params.id}?_expand=category&_expand=role`).then(
            response => {
                let { title, categoryId, content } = response.data
                NewsForm.current.setFieldsValue({
                    title,
                    categoryId
                })

                setContent(content)
            }
        )
    }, [params.id])



    return (
        <div>
            {/* 头部 */}
            <PageHeader
                className="site-page-header"
                title="更新新闻"
                onBack={() => navigate(-1)}
            />

            {/* 步骤 */}
            <Steps current={current}>
                <Step title="基本信息" description="新闻标题,新闻分类" />
                <Step title="新闻内容" description="新闻主体内容" />
                <Step title="新闻提交" description="保存草稿或提交审核" />
            </Steps>

            {/* 步骤一 */}
            <div style={{ display: current === 0 ? '' : 'none', marginTop: "50px" }}>
                <Form
                    name="basic"
                    labelCol={{
                        span: 2,
                    }}
                    wrapperCol={{
                        span: 22,
                    }}
                    initialValues={{
                        remember: true,
                    }}
                    autoComplete="off"
                    ref={NewsForm}
                >
                    <Form.Item
                        label="新闻标题"
                        name="title"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your title!',
                            },
                        ]}
                    >
                        <Input placeholder='请输入新闻标题' />
                    </Form.Item>
                    <Form.Item
                        label="新闻分类"
                        name="categoryId"
                        rules={[
                            {
                                required: true,
                                message: 'Please choose your categoryId!',
                            },
                        ]}
                    >
                        <Select>
                            {
                                categoryList.map(item => {
                                    return <Option value={item.id} key={item.id}>{item.title}</Option>
                                })
                            }

                        </Select>
                    </Form.Item>
                </Form>
            </div>
            {/* 步骤二 */}
            <div style={{ display: current === 1 ? '' : 'none', marginTop: '50px' }}>
                {/* 子传父 */}
                <NewsEditor content={content} getContent={(value) => {
                    setContent(value);
                }}></NewsEditor>
            </div>
            {/* 步骤三 */}
            <div style={{ display: current === 2 ? '' : 'none' }}></div>



            {/* 按钮 */}
            <div style={{ marginTop: '50px' }}>
                {
                    current === 2 && <span>
                        <Button type='primary' onClick={() => handleSave(0)}>保存至草稿箱</Button>
                        <Button type='danger' onClick={() => handleSave(1)}>提交审核</Button>
                    </span>
                }
                {
                    current < 2 && <Button onClick={handleNext} type='primary'>下一步</Button>
                }
                {
                    current > 0 && <Button onClick={handlePrevious}>上一步</Button>
                }
            </div>
        </div>
    )
}
