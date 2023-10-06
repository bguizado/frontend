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

const TablaTiendas = () => {
    const { authTokens } = useContext(AuthContext);
    const [dataSource, setDataSource] = useState([]); // Inicializa el estado vacío
    const [newTienda, setNewTienda] = useState(false);
    useEffect(() => {
        // Dentro de un efecto, puedes realizar la llamada a la API de forma asincrónica
        const fetchData = async () => {
            try {
                const response = await fetch('http://127.0.0.1:8000/proyecto/tiendas', {
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
            setNewTienda(false)
        };

        fetchData(); // Llama a la función para obtener los datos
    }, [authTokens.access, newTienda]);


    const [count, setCount] = useState(2);
    const handleDelete = async (key) => {

        try {
            const response = await fetch(`http://127.0.0.1:8000/proyecto/tienda/${key}`, {
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
            title: 'DIRECCION AV/JR',
            dataIndex: 'direccion',
            editable: true,
        },
        {
            title: 'Tipo',
            dataIndex: 'tipo',
            width: '30%',
        },
        {
            title: 'Fecha creacion',
            dataIndex: 'fecha_creacion',
            editable: false,
        },
        {
            title: 'Fecha actualizacion',
            dataIndex: 'fecha_actualizacion',
            editable: true
        },
        {
            title: 'Operaciones',
            dataIndex: 'operation',
            render: (_, record) =>
                dataSource.length >= 1 ? (
                    <Popconfirm title="¿Estas seguro que deseas eliminar la tienda" onConfirm={() => handleDelete(record.id)}>
                        <a>Eliminar</a>
                    </Popconfirm>
                ) : null,
        },
    ];
    const handleSave = async (row) => {
        try {
            const response = await fetch(`http://127.0.0.1:8000/proyecto/tienda/${row.id}`, {
                method: 'PUT', // Utiliza el método PUT para actualizar los datos
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + String(authTokens.access)
                },
                body: JSON.stringify({nombre: row.nombre , direccion: row.direccion}), // Envía el objeto actualizado al servidor
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
            const response = await fetch(`http://127.0.0.1:8000/proyecto/tiendas`, {
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
                setNewTienda(true)
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
                Añadir Tienda
            </Button>
            <Modal title="Añadir Tienda" open={isModalOpen} onCancel={handleCancel} footer={null}>
                <Form onFinish={handleOk}>
                    <Form.Item
                        name="nombre"
                        rules={[
                            {
                                required: true,
                                message: 'Ingrese el nombre de la tienda, por favor!',
                            },
                        ]}
                    >
                        <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Nombre" />
                    </Form.Item>
                    <Form.Item
                        name="Tipo"
                        rules={[
                            {
                                required: true,
                                message: 'Ingrese el tipo de tienda, por favor!',
                            },
                        ]}
                    >
                        <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="BODEGA/MERCADO" />
                    </Form.Item>
                    <Form.Item
                        name="direccion"
                        rules={[
                            {
                                required: true,
                                message: 'Ingrese la direccion, por favor!',
                            },
                        ]}
                    >
                        <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Direccion (AV/JR)" />
                    </Form.Item>
                    <div>
                        <Button type="primary" htmlType="submit" block> Enviar </Button>
                    </div>
                </Form>
            </Modal>

            <Table
                rowClassName={() => 'editable-row'}
                bordered
                dataSource={dataSource}
                columns={columns}
                components={components}
                scroll={{ x: 'max-content' }}
            />
        </div>
    );
};
export default TablaTiendas;

