import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout, Dropdown, Menu, Avatar } from 'antd';
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    UserOutlined
} from '@ant-design/icons';
import { connect } from 'react-redux'

const { Header } = Layout;

const TopHeader = (props) => {
    // console.log(props);
    // const [collapsed, setCollapsed] = useState(false);

    const { username, role: { roleName } } = JSON.parse(localStorage.getItem("token"));

    const navigate = useNavigate()

    const menu = (
        <Menu>
            <Menu.Item key={'suplogin'}>
                {roleName}
            </Menu.Item>
            <Menu.Item key={'logout'} danger onClick={() => {
                localStorage.removeItem('token')
                navigate('/login')
            }}>退出</Menu.Item>
        </Menu>
    );

    return (
        <Header
            className="site-layout-background"
            style={{
                padding: '0 16px',
            }}
        >
            {React.createElement(props.isCollapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
                className: 'trigger',
                onClick: () => {
                    // 改变state中isCollapsed
                    props.changeCollapsed()
                },
            })}

            <div style={{ float: "right" }}>
                <span style={{ marginRight: '15px' }}>欢迎{username}回来</span>
                <Dropdown overlay={menu}>
                    <Avatar size="middle" icon={<UserOutlined />} />
                    {/* <DownOutlined /> */}
                </Dropdown>
            </div>
        </Header>
    )
}

/*
    connect(
        mapStateToProps 定制状态给props 
        mapDispatchToProps 定制分发给props
    )(被包装的对象)

*/

const mapStateToProps = ({ CollapsedReducer: { isCollapsed } }) => {
    return {
        isCollapsed
    }
}

const mapDispatchToProps = {
    changeCollapsed() {
        return {
            type: "change_collapsed"
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(TopHeader)