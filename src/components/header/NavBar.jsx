import React from 'react'
import { LaptopOutlined, NotificationOutlined, UserOutlined } from '@ant-design/icons';
import {  Layout, Menu, theme } from 'antd';
import TablaUsuarios from '../home/TablaUsuarios'
import TablaTiendas from '../home/TablaTiendas';
import TablaRelevos from '../home/TablaRelevos';
const { Content, Footer, Sider } = Layout;

const NavBar = () => {
    const {
        token: { colorBgContainer },
    } = theme.useToken();

    return(
        <Layout
        style={{
            padding: '24px 0',
            background: colorBgContainer,
        }}
    >
        <Sider
         //   theme='dark' 
         //   breakpoint="lg"
         //   collapsedWidth="0"
            style={{
                background: colorBgContainer,
            }}
            width={200}
        >
            <Menu
                mode="inline"
                defaultSelectedKeys={['1']}
                defaultOpenKeys={['sub1']}
                style={{
                    height: '100%',
                }}
                items={[
                    {
                      key: '1',
                      icon: <UserOutlined />,
                      label: 'Usuarios',                                
                    },
                    {
                        key: '2',
                        icon: <LaptopOutlined />,
                        label: 'Tiendas',
                      },
                      {
                        key: '3',
                        icon: <NotificationOutlined />,
                        label: 'Registros',
                      },
                ]}
            />
        </Sider>
        <Content
            style={{
                padding: '0 24px',
                /* minHeight: 280, */
            }}
        >
            {/* Sacar tabla a tra vistaaaaaaa */}
            <TablaTiendas/>
        { /* <TablaUsuarios /> */ } 
        </Content>
    </Layout>
    )
}
export default NavBar