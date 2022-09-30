import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom'
import { Layout, Menu } from 'antd';
import {
    // MailOutlined,
    // AppstoreOutlined,
    // SettingOutlined,
    UserOutlined
} from '@ant-design/icons';
import axios from 'axios';
import './index.css';
import { connect } from 'react-redux';
import SubMenu from 'antd/lib/menu/SubMenu';
const { Sider } = Layout

// 配置图标和路由映射
const iconList = {
    "/home": <UserOutlined></UserOutlined>,
    "/user-manage": <UserOutlined></UserOutlined>,
    "/user-manage/list": <UserOutlined></UserOutlined>,
    "/right-manage": <UserOutlined></UserOutlined>,
    "/right-manage/role/list": <UserOutlined></UserOutlined>,
    "/right-manage/right/list": <UserOutlined></UserOutlined>,
    "/news-manage": <UserOutlined></UserOutlined>,
    "/news-manage/add": <UserOutlined></UserOutlined>,
    "/news-manage/draft": <UserOutlined></UserOutlined>,
    "/news-manage/category": <UserOutlined></UserOutlined>,
    "/audit-manage": <UserOutlined></UserOutlined>,
    "/audit-manage/audit": <UserOutlined></UserOutlined>,
    "/audit-manage/list": <UserOutlined></UserOutlined>,
    "/publish-manage": <UserOutlined></UserOutlined>,
    "/publish-manage/unpublished": <UserOutlined></UserOutlined>,
    "/publish-manage/published": <UserOutlined></UserOutlined>,
    "/publish-manage/sunset": <UserOutlined></UserOutlined>,
}

const SideMenu = (props) => {
    // const [collapsed] = useState(false);
    const [menu, setMenu] = useState([])
    let navigate = useNavigate();

    // 发送axios请求
    useEffect(() => {
        axios.get("/rights?_embed=children").then(
            response => setMenu(response.data)
        )
    }, [])

    // 结构权限列表
    const { role: { rights } } = JSON.parse(localStorage.getItem("token"))
    // 判断权限
    const checkPagePermisson = (item) => {
        return item.pagepermisson && rights.includes(item.key)
    }

    // 刷新渲染高亮
    let location = useLocation();
    const selectKeys = [location.pathname];
    const openKeys = ["/" + location.pathname.split("/")[1]]

    // 渲染侧边栏
    const renderMenu = (menuList) => {
        return menuList.map(item => {
            // ?  如果前面为假 后面就不在执行  避免取出item.children为undefined的情况
            if (item.children?.length > 0 && checkPagePermisson(item)) {
                return <SubMenu key={item.key} icon={iconList[item.key]} title={item.title}>
                    {renderMenu(item.children)}
                </SubMenu>
            }

            return checkPagePermisson(item) && <Menu.Item key={item.key} icon={iconList[item.key]} onClick={() => {
                navigate(item.key)
            }}>{item.title}</Menu.Item>
        })
    }

    return (
        <Sider trigger={null} collapsible collapsed={props.isCollapsed}>
            <div style={{ display: "flex", height: '100%', flexDirection: "column" }}>
                <div className="logo">全球新闻发布管理系统</div>
                <div style={{ flex: 1, overflow: 'auto' }}>
                    {/* selectedKeys 改为受控组件 */}
                    <Menu theme="dark" mode="inline" selectedKeys={selectKeys} defaultOpenKeys={openKeys}>
                        {renderMenu(menu)}
                    </Menu>
                </div>
            </div>
        </Sider>
    )
}
const mapStateToProps = ({ CollapsedReducer: { isCollapsed } }) => {
    return {
        isCollapsed
    }
}


export default connect(mapStateToProps)(SideMenu)