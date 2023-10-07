import React, { useContext } from 'react';
import { Layout, theme } from 'antd';
import AuthContext from '../../context/AuthContext';
import HeaderMain from '../header/HeaderMain'
import NavBar from '../header/NavBar'
import TablaTiendas from './TablaTiendas';


const { Content, Footer, Sider } = Layout;


const Tiendas = () => {

    let { user, logoutUser } = useContext(AuthContext)

    const {
        token: { colorBgContainer },
    } = theme.useToken();

    const containerStyle = {
        minHeight: '100vh', // Establece la altura mínima para ocupar toda la pantalla verticalmente
        display: 'flex',
        flexDirection: 'column',};
    return (
        <Layout style={containerStyle}>
            <HeaderMain logoutUser={logoutUser} user={user} />
            <Content
                style={{
                    padding: '0 50px',
                    flexGrow: 1
                }}
            >
                <Layout
                    style={{
                        padding: '24px 0',
                    
                    }}
                >
                    <NavBar />
                    <Content
                        style={{
                            padding: '0 24px',
                            minHeight: 280,
                        }}
                    >
                        <TablaTiendas />
                    </Content>
                </Layout>
            </Content>
            <Footer
                style={{
                    textAlign: 'center',
                }}
            >
                Pointdata ©2023
            </Footer>
        </Layout>
    );
};
export default Tiendas;