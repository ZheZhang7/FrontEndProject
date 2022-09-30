// 本地路由映射表
import React, { useEffect, useState } from 'react'
import Home from '../../views/sandbox/home/Home';
import UserList from '../../views/sandbox/user-manage/UserList'
import RoleList from '../../views/sandbox/right-manage/RoleList';
import RightList from '../../views/sandbox/right-manage/RightList';
import NewsAdd from "../../views/sandbox/news-manage/NewsAdd";
import NewsDraft from "../../views/sandbox/news-manage/NewsDraft";
import NewsCategory from "../../views/sandbox/news-manage/NewsCategory";
import NewsPreview from '../../views/sandbox/news-manage/NewsPreview';
import NewsUpdate from '../../views/sandbox/news-manage/NewsUpdate';
import Audit from "../../views/sandbox/audit-manage/Audit";
import AuditList from "../../views/sandbox/audit-manage/AuditList";
import Unpublished from "../../views/sandbox/publish-manage/Unpublished";
import Published from "../../views/sandbox/publish-manage/Published";
import Sunset from "../../views/sandbox/publish-manage/Sunset";

import NoPerssion from '../../views/sandbox/nopermission/NoPerssion';

import { Navigate, Routes, Route } from 'react-router-dom';

// import { connect } from 'react-redux'

// import { Spin } from 'antd';

import axios from 'axios';




const LocalRouterMap = {
    "/home": <Home></Home>,
    "/user-manage/list": <UserList></UserList>,
    "/right-manage/role/list": <RoleList></RoleList>,
    "/right-manage/right/list": <RightList></RightList>,
    "/news-manage/add": <NewsAdd></NewsAdd>,
    "/news-manage/draft": <NewsDraft></NewsDraft>,
    "/news-manage/category": <NewsCategory></NewsCategory>,
    "/news-manage/preview/:id": <NewsPreview></NewsPreview>,
    "/news-manage/update/:id": <NewsUpdate></NewsUpdate>,
    "/audit-manage/audit": <Audit></Audit>,
    "/audit-manage/list": <AuditList></AuditList>,
    "/publish-manage/unpublished": <Unpublished></Unpublished>,
    "/publish-manage/published": <Published></Published>,
    "/publish-manage/sunset": <Sunset></Sunset>,
}

export default function NewsRouter() {
    // 定义后端返回的列表
    const [BackRouteList, setBackRouteList] = useState([]);
    // 请求数据，将数据进行扁平化处理
    useEffect(() => {
        // 使用promise.all 处理两个axios请求，等所有请求的状态fulfilled，返回值组成一个数组，传给promise回调
        Promise.all([
            axios.get("/rights"),
            axios.get("/children")
        ]).then((response) => {
            setBackRouteList([...response[0].data, ...response[1].data])
        })
    }, []);

    // 检查路由开关或者无权限
    const checkRoute = (item) => {
        return LocalRouterMap[item.key] && (item.pagepermisson || item.routepermisson)
    }

    const { role: { rights } } = JSON.parse(localStorage.getItem('token'))
    // 检查用户是否有权限
    const checkUserPermission = (item) => {
        return rights.includes(item.key)
    }

    return (
        // <Spin size="large" spinning={props.isLoading}>
        <Routes>
            {/* 动态创建路由，防止通过路径直接访问不属于自己的权限 */}
            {
                BackRouteList.map((item) => {
                    // 权限控制判断
                    if (checkRoute(item) && checkUserPermission(item)) {
                        return <Route
                            path={item.key}
                            key={item.key}
                            element={LocalRouterMap[item.key]}
                        ></Route>
                    }
                    return null
                })
            }
            <Route path="/" element={<Navigate replace to="/home"></Navigate>} exact></Route>
            {
                // BackRouteList大于0的时候再渲染，初始时BackRouteList是空数组，会闪NoPerssion
                // 若数据还没回来，则不会重定向
                BackRouteList.length > 0 && <Route path="/*" element={<NoPerssion></NoPerssion>}></Route>
            }
        </Routes>
        // </Spin>
    )
}


// const mapStateToProps = ({ LoadingReducer: { isLoading } }) => {
//     return {
//         isLoading
//     }
// }
// export default connect(mapStateToProps)(NewsRouter)