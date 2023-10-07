import React, { useContext } from 'react';
import { Layout, theme } from 'antd';
import AuthContext from '../../context/AuthContext';
import HeaderMain from '../header/HeaderMain'
import NavBar from '../header/NavBar'
import TablaRelevos from './TablaRelevos';

const { Content, Footer } = Layout;

const Relevos = () => {
  let { user, logoutUser } = useContext(AuthContext);

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
      <Content style={{ flexGrow: 1, padding: '0 50px' }}>
        <Layout style={{ padding: '24px 0'}}>
          <NavBar />
          <Content style={{ padding: '0 24px' }}>
            <TablaRelevos />
          </Content>
        </Layout>
      </Content>
      <Footer style={{ textAlign: 'center' }}>Pointdata ©2023</Footer>
    </Layout>
  );
};

export default Relevos;
