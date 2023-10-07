import React, { useContext } from 'react';
import Usuarios from '../components/home/Usuarios';
import AuthContext from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import { notification } from 'antd';


const PageUsuarios = () => {
  let { superUser } = useContext(AuthContext);

  const openNotification = () => {
    notification.error({
      message: 'Error',
      description: 'No tiene permisos para esta acción',
      duration: 3, // Duración en segundos que deseas que se muestre la notificación
    });
  };

  if (superUser[0] === true) {
    return (
      <div>
        <Usuarios />
      </div>
    );
  } else {
        return (
            <>
                {openNotification()}
                <Navigate to="/main" />
            </>
        );
  }
};

export default PageUsuarios;
