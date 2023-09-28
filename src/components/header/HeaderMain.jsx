import React from "react";
import { Layout, Button, Space } from 'antd';
import { Link } from 'react-router-dom';
const { Header } = Layout;


const HeaderMain = ({ logoutUser, user }) => {
    return (
        <Header
            style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
            }}
        >
            <div className="demo-logo" />
            <Space wrap>
                {
                    user ? (<Button type="primary" onClick={logoutUser}>Cerrar Sesion</Button>
                    ) : (
                        <Link to="/login"> Iniciar Sesion </Link>
                    )
                }

            </Space>
        </Header>
    )
}
export default HeaderMain