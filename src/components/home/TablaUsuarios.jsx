import React, { useContext, useEffect, useRef, useState } from 'react';
import { Button, Form, Input, Popconfirm, Table, Modal } from 'antd';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import AuthContext from '../../context/AuthContext';

const TablaUsuarios = () => {
    const { authTokens } = useContext(AuthContext);
    const [dataSource, setDataSource] = useState([]); // Inicializa el estado vacío
  
    useEffect(() => {
      // Dentro de un efecto, puedes realizar la llamada a la API de forma asincrónica
      const fetchData = async () => {
        try {
          const response = await fetch('http://127.0.0.1:8000/proyecto/usuarios', {
            method: 'GET',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + String(authTokens.access)
            }
          });
  
          if (response.status === 200) {
            const data = await response.json();
            console.log(data)
            setDataSource(data.content); // Almacena los datos en el estado
          } else {
            console.error('Error:', response.status);
          }
        } catch (error) {
          console.error('Error:', error);
        }
      };
  
      fetchData(); // Llama a la función para obtener los datos
    }, [authTokens.access]);

    
    const [count, setCount] = useState(2);
    const handleDelete = (key) => {
        const newData = dataSource.filter((item) => item.key !== key);
        setDataSource(newData);
    };
    const defaultColumns = [
        {
            title: 'Nombre',
            dataIndex: 'nombre',
            editable: true,
        },
        {
            title: 'Apellido',
            dataIndex: 'apellido',
        },
        {
            title: 'Correo',
            dataIndex: 'correo',
            width: '30%',
        },
        {
            title: 'Ultima Sesion',
            dataIndex: 'last_login',
        },
        {
            title: 'operation',
            dataIndex: 'operation',
            render: (_, record) =>
                dataSource.length >= 1 ? (
                    <Popconfirm title="Sure to delete?" onConfirm={() => handleDelete(record.key)}>
                        <a>Delete</a>
                    </Popconfirm>
                ) : null,
        },
    ];
    const handleAdd = (newData) => {
        setDataSource([...dataSource, newData]);
        setCount(count + 1);
    };
    const handleSave = (row) => {
        const newData = [...dataSource];
        const index = newData.findIndex((item) => row.key === item.key);
        const item = newData[index];
        newData.splice(index, 1, {
            ...item,
            ...row,
        });
        setDataSource(newData);
    };

    const columns = defaultColumns.map((col) => {
        if (!col.editable) {
            return col;
        }
        return {
            ...col,
            onCell: (record) => ({
                record,
                editable: col.editable,
                dataIndex: col.dataIndex,
                title: col.title,
                handleSave,
            }),
        };
    });

    const [isModalOpen, setIsModalOpen] = useState(false);
    const showModal = () => {
        setIsModalOpen(true);
    };
    const handleOk = () => {
        const newData = {
            key: count,
            name: `Edward King ${count}`,
            age: '32',
            address: `London, Park Lane no. ${count}`,
        };
        handleAdd(newData)
        setIsModalOpen(false);
    };
    const handleCancel = () => {
        setIsModalOpen(false);
    };


    return (
        <div>
            <Button
                type="primary"
                onClick={showModal}
                style={{
                    marginBottom: 16,
                }}
            >
                Añadir usuario
            </Button>
            <Modal title="Basic Modal" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
                <Form>
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
                </Form>
            </Modal>

            <Table
                rowClassName={() => 'editable-row'}
                bordered
                dataSource={dataSource}
                columns={columns}
            />
        </div>
    );
};
export default TablaUsuarios;