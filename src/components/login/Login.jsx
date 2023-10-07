import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Checkbox, Form, Input } from 'antd';
import AuthContext from '../../context/AuthContext';
import React, { useContext } from 'react';


const Login = () => {

  let { loginUser } = useContext(AuthContext)

  return (

    <form onSubmit={loginUser}>
      <Form.Item
        name="correo"
        rules={[
          {
            required: true,
            message: 'Ingrese su correo, por favor!',
          },
        ]}
      >
        <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Correo" />
      </Form.Item>
      <Form.Item
        name="password"
        rules={[
          {
            required: true,
            message: 'Ingrese su contraseña, por favor!',
          },
        ]}
      >
        <Input
          prefix={<LockOutlined className="site-form-item-icon" />}
          type="password"
          placeholder="Contraseña"
        />
      </Form.Item>
      <Form.Item>
        <Form.Item name="remember" valuePropName="checked" noStyle>
          <Checkbox>Recuerdame</Checkbox>
        </Form.Item>

        <a className="login-form-forgot" href="">
          Olvidaste tu contraseña
        </a>
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" className="login-form-button">
          Iniciar Sesion
        </Button>
      </Form.Item>
    </form>
  );
};

export default Login;