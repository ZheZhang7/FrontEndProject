import React, { useState, useEffect, useRef, useContext } from 'react'
import { Table, Button, Modal, Form, Input } from 'antd'
import { DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import axios from 'axios'

const { confirm } = Modal

export default function NewsCategory() {

    const [dataSource, setDataSource] = useState([])
    const EditableContext = React.createContext(null)

    useEffect(() => {
        axios.get("/categories").then(
            response => {
                setDataSource(response.data);
            }
        )
    }, [])

    const handleSave = (record) => {
        setDataSource(dataSource.map(item => {
            if (item.id === record.id) {
                return {
                    id: item.id,
                    title: record.title,
                    value: record.title
                }
            }
            return item
        }))

        axios.patch(`/categories/${record.id}`, {
            title: record.title,
            value: record.value
        })

    }

    const columns = [
        {
            title: 'ID',
            // dataIndex和后端字段一定要匹配上
            dataIndex: 'id',
            render: (id) => { return <b>{id}</b> }
        },
        {
            title: '栏目名称',
            dataIndex: 'title',
            // 哪一项可以编辑就在哪一项上加oncell
            onCell: (record) => ({
                record,
                editable: true,
                dataIndex: 'title',
                title: "栏目名称",
                handleSave,
            }),
        },
        {
            title: '操作',
            render: (item) => {
                return <div>
                    <Button onClick={() => confirmMethod(item)} type="danger" shape="circle" icon={<DeleteOutlined />} />
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
        axios.delete(`/categories/${item.id}`)
    }

    const EditableRow = ({ index, ...props }) => {
        const [form] = Form.useForm();
        return (
            <Form form={form} component={false}>
                <EditableContext.Provider value={form}>
                    <tr {...props} />
                </EditableContext.Provider>
            </Form>
        );
    };

    // 要可以解构得到columns中的值
    const EditableCell = ({
        title,
        editable,
        children,
        dataIndex,
        record,
        handleSave,
        ...restProps
    }) => {
        const [editing, setEditing] = useState(false);
        const inputRef = useRef(null);
        const form = useContext(EditableContext);
        useEffect(() => {
            if (editing) {
                inputRef.current.focus();
            }
        }, [editing]);

        const toggleEdit = () => {
            setEditing(!editing);
            form.setFieldsValue({
                [dataIndex]: record[dataIndex],
            });
        };

        const save = async () => {
            try {
                const values = await form.validateFields();
                toggleEdit();
                handleSave({ ...record, ...values });
            } catch (errInfo) {
                console.log('Save failed:', errInfo);
            }
        };

        let childNode = children;

        if (editable) {
            childNode = editing ? (
                <Form.Item
                    style={{
                        margin: 0,
                    }}
                    name={dataIndex}
                    rules={[
                        {
                            required: true,
                            message: `${title} is required.`,
                        },
                    ]}
                >
                    <Input ref={inputRef} onPressEnter={save} onBlur={save} />
                </Form.Item>
            ) : (
                <div
                    className="editable-cell-value-wrap"
                    style={{
                        paddingRight: 24,
                    }}
                    onClick={toggleEdit}
                >
                    {children}
                </div>
            );
        }

        return <td {...restProps}>{childNode}</td>;
    };


    return (
        <div>
            <Table
                dataSource={dataSource}
                columns={columns}
                pagination={{ pageSize: 10 }}
                rowKey={item => item.id}
                components={{
                    body: {
                        row: EditableRow,
                        cell: EditableCell,
                    },
                }}
            />
        </div>
    )
}

