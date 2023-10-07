import React, { useContext } from 'react';
import Tiendas from '../components/home/Tiendas';
import AuthContext from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import { notification } from 'antd';


const PageTiendas = () => {
  let { superUser } = useContext(AuthContext);
  console.log(superUser);

  const openNotification = () => {
    notification.error({
      message: 'Error',
      description: 'No tiene permisos para esta acción',
      duration: 3, // Duración en segundos que deseas que se muestre la notificación
    });
  };

  if (superUser) {
    return (
      <div>
        <Tiendas />
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

export default PageTiendas;
