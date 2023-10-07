import React, { useContext } from 'react';
import { Layout, theme } from 'antd';
import AuthContext from '../../context/AuthContext';
import HeaderMain from '../header/HeaderMain'
import NavBar from '../header/NavBar'


const { Content, Footer, Sider } = Layout;


const Home = () => {

    let { user, logoutUser } = useContext(AuthContext)

    const {
        token: { colorBgContainer },
    } = theme.useToken();

    const containerStyle = {
        minHeight: '100vh', // Establece la altura mínima para ocupar toda la pantalla verticalmente
        display: 'flex',
        flexDirection: 'column',
    };

    return (
        <Layout style={containerStyle}>
            <HeaderMain logoutUser={logoutUser} user={user} />
            <Content
                style={{
                    padding: '0 50px',
                }}
            >
                <Layout
                    style={{
                        padding: '24px 0',
                        background: colorBgContainer,
                    }}
                >
                    <NavBar />
                    <Content
                        style={{
                            padding: '0 24px',
                            minHeight: 280,
                            display: 'flex', alignContent: 'center',
                            flexDirection: 'column',
                            textAlign: 'center',
                            marginTop: '40px',
                            gap: '20px'
                            
                        }}>                      
                            <h1 style={{
                                fontFamily: 'Trebuchet MS',                                
                            }} >BIENVENIDO AL PANEL ADMINISTRATIVO DE POINTDATA </h1>
                          
                            <p style={{
                                fontFamily: 'Trebuchet MS',                               
                            }}> Pointdata es un ERP de mercaderismo, creado por Codigo Corp, empresa dedica a la soluciones tecnologícas </p>
                        
                    </Content>
                </Layout>
            </Content >
            <Footer
                style={{
                    textAlign: 'center',
                }}
            >
                Pointdata ©2023
            </Footer>
        </Layout >
    );
};
export default Home;