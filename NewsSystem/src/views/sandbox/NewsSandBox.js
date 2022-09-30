import React, { useEffect } from 'react';

import SideMenu from '../../components/sandbox/SideMenu';
import TopHeader from '../../components/sandbox/TopHeader';
import NewsRouter from '../../components/sandbox/NewsRouter';
// 切换路由顶部进度条
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';

import './NewsSandBox.css';
import { Layout } from 'antd';

const { Content } = Layout

export default function NewsSandBox() {
    NProgress.start();
    useEffect(() => {
        NProgress.done();
    })
    return (
        <Layout>
            <SideMenu></SideMenu>

            <Layout className="site-layout">
                <TopHeader></TopHeader>

                <Content
                    className="site-layout-background"
                    style={{
                        margin: '24px 16px',
                        padding: 24,
                        minHeight: 280,
                        overflow: 'auto'
                    }}
                >
                    {/* 配置路由 */}
                    <NewsRouter></NewsRouter>
                </Content>

            </Layout>

        </Layout>
    )
}
