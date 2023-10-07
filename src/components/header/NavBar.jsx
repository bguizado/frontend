import React, { useState } from 'react';
import { HomeOutlined, FormOutlined, UserOutlined } from '@ant-design/icons';
import { Layout, Menu, theme } from 'antd';
import { Link } from 'react-router-dom';


const { Sider } = Layout;

const NavBar = () => {
    const [current, setCurrent] = useState();

    const onClick = (e) => {
        console.log('click ', e);
        setCurrent(e.key);
    };

    const {
        token: { colorBgContainer },
    } = theme.useToken();

    return (

        <Sider
            style={{
                background: colorBgContainer,
            }}
            width={200}
        >
            <Menu
                mode="inline"
                onClick={onClick}
                selectedKeys={[current]}
                // defaultSelectedKeys={[current]}
                // defaultOpenKeys={[]}
                style={{
                    height: '100%',
                }}
                items={[
                    {
                        key: '1',
                        icon: <UserOutlined />,
                        label: <Link to={"/usuarios"}>Usuarios</Link>
                    },
                    {
                        key: '2',
                        icon: <HomeOutlined />,
                        label: <Link to={"/tiendas"}>Tiendas</Link>
                    },
                    {
                        key: '3',
                        icon: <FormOutlined />,
                        label: <Link to={"/relevos"}>Relevos</Link>
                    },
                ]}
            />
        </Sider>

    )
}
export default NavBar