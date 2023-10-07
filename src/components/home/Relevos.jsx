import React, { useContext } from 'react';
import { Layout, theme } from 'antd';
import AuthContext from '../../context/AuthContext';
import HeaderMain from '../header/HeaderMain'
import NavBar from '../header/NavBar'
import TablaRelevos from './TablaRelevos';


const { Content, Footer, Sider } = Layout;


const Relevos = () => {

    let { user, logoutUser } = useContext(AuthContext)

    const {
        token: { colorBgContainer },
    } = theme.useToken();
    return (
        <Layout>
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
                        }}
                    >
                        <TablaRelevos />
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
export default Relevos;