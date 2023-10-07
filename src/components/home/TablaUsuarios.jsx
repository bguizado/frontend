import React, { useContext, useEffect, useRef, useState } from 'react';
import { Button, Form, Input, Popconfirm, Table, Modal } from 'antd';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import AuthContext from '../../context/AuthContext';

const EditableContext = React.createContext(null);
const EditableRow = ({ index, ...props }) => {
    const [form] = Form.useForm();
    return (
        <Form form={form} component={false}>
            <EditableContext.Provider value={form}>
                <tr {...props} />
            </EditableContext.Provider>
        </Form>
    );
};
const EditableCell = ({
    title,
    editable,
    children,
    dataIndex,
    record,
    handleSave,
    ...restProps
}) => {
    const [editing, setEditing] = useState(false);
    const inputRef = useRef(null);
    const form = useContext(EditableContext);
    useEffect(() => {
        if (editing) {
            inputRef.current.focus();
        }
    }, [editing]);
    const toggleEdit = () => {
        setEditing(!editing);
        form.setFieldsValue({
            [dataIndex]: record[dataIndex],
        });
    };
    const save = async () => {
        try {
            const values = await form.validateFields();
            toggleEdit();
            handleSave({
                ...record,
                ...values,
            });
        } catch (errInfo) {
            console.log('Save failed:', errInfo);
        }
    };
    let childNode = children;
    if (editable) {
        childNode = editing ? (
            <Form.Item
                style={{
                    margin: 0,
                }}
                name={dataIndex}
                rules={[
                    {
                        required: true,
                        message: `${title} is required.`,
                    },
                ]}
            >
                <Input ref={inputRef} onPressEnter={save} onBlur={save} />
            </Form.Item>
        ) : (
            <div
                className="editable-cell-value-wrap"
                style={{
                    paddingRight: 24,
                }}
                onClick={toggleEdit}
            >
                {children}
            </div>
        );
    }
    return <td {...restProps}>{childNode}</td>;
};

const TablaUsuarios = () => {
    const { authTokens } = useContext(AuthContext);
    const [dataSource, setDataSource] = useState([]); // Inicializa el estado vacío
    const [newUser, setNewUser] = useState(false);
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
            setNewUser(false)
        };

        fetchData(); // Llama a la función para obtener los datos
    }, [authTokens.access, newUser]);


    const [count, setCount] = useState(2);
    const handleDelete = async (key) => {

        try {
            const response = await fetch(`http://127.0.0.1:8000/proyecto/usuario/${key}`, {
                method: 'DELETE',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + String(authTokens.access)
                }
            });

            if (response.status === 200) {
                const newData = dataSource.filter((item) => item.id !== key);
                setDataSource(newData);
            } else {
                console.error('Error:', response.status);
            }
        } catch (error) {
            console.error('Error:', error);
        }
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
            editable: true,
        },
        {
            title: 'Correo',
            dataIndex: 'correo',
            width: '30%',
        },
        {
            title: 'Administrador',
            dataIndex: 'is_superuser',
            render: (_, record) =>
                <a>{record.is_superuser ? "Si" : "No"}</a>
        },
        {
            title: 'Ultima Sesion',
            dataIndex: 'last_login',
        },
        {
            title: 'Operaciones',
            dataIndex: 'operation',
            render: (_, record) =>
                dataSource.length >= 1 ? (
                    <Popconfirm title="¿Estas seguro que deseas eliminar el usuario?" onConfirm={() => handleDelete(record.id)}>
                        <a>Eliminar</a>
                    </Popconfirm>
                ) : null,
        },
    ];
    const handleSave = async (row) => {
        try {
            const response = await fetch(`http://127.0.0.1:8000/proyecto/usuario/${row.id}`, {
                method: 'PUT', // Utiliza el método PUT para actualizar los datos
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + String(authTokens.access)
                },
                body: JSON.stringify({ nombre: row.nombre, apellido: row.apellido }), // Envía el objeto actualizado al servidor
            });

            if (response.status === 200) {
                // Actualiza los datos en el estado local
                const newData = dataSource.map((item) => {
                    if (item.id === row.id) {
                        return { ...item, ...row };
                    }
                    return item;
                });
                setDataSource(newData);
            } else {
                console.error('Error:', response.status);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const components = { body: { row: EditableRow, cell: EditableCell, }, };
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
                title: col.nombre,
                handleSave,
            }),
        };
    });

    const [isModalOpen, setIsModalOpen] = useState(false);
    const showModal = () => {
        setIsModalOpen(true);
    };
    const [form] = Form.useForm();
    const handleOk = async (values) => {

        try {
            const response = await fetch(`http://127.0.0.1:8000/proyecto/registro`, {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + String(authTokens.access)
                },
                body: JSON.stringify(values)
            });

            if (response.status === 201) {
                const user = { ...values, id: count }
                setNewUser(true)
                setIsModalOpen(false);

                form.resetFields()
            } else {
                console.error('Error:', response.status);
            }
        } catch (error) {
            console.error('Error:', error);
        }
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
                Añadir Usuario
            </Button>
            <Modal title="Añadir Usuario" open={isModalOpen} onCancel={handleCancel} footer={null}>
                <Form onFinish={handleOk}>
                    <Form.Item
                        name="nombre"
                        rules={[
                            {
                                required: true,
                                message: 'Ingrese su nombres, por favor!',
                            },
                        ]}
                    >
                        <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Nombres" />
                    </Form.Item>
                    <Form.Item
                        name="apellido"
                        rules={[
                            {
                                required: true,
                                message: 'Ingrese sus apellidos, por favor!',
                            },
                        ]}
                    >
                        <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Apellidos" />
                    </Form.Item>
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
                        <Input prefix={<LockOutlined className="site-form-item-icon" />} type="password" placeholder="Contraseña" />
                    </Form.Item>
                    <div>
                        <Button type="primary" htmlType="submit" block> Enviar </Button>
                    </div>
                </Form>
            </Modal>
            <div style={{overflowY: 'auto' , maxHeight: 'calc(100vh - 200px)'}} >
            <Table
                rowClassName={() => 'editable-row'}
                bordered
                dataSource={dataSource}
                columns={columns}
                components={components}
                scroll={{ x: 'max-content' }}
            />
            </div>
        </div>
    );
};
export default TablaUsuarios;