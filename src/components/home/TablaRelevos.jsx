import AuthContext from '../../context/AuthContext';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { Button, Form, Input, Popconfirm, Table, Modal, Select, Upload } from 'antd'; // Agrega 'Select' y 'Upload' aquí
import { LockOutlined, UserOutlined, UploadOutlined } from '@ant-design/icons'; // Agrega 'UploadOutlined' aquí

const { Option } = Select;


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

const TablaRelevos = () => {
    const { authTokens } = useContext(AuthContext);
    const [dataSource, setDataSource] = useState([]); // Inicializa el estado vacío
    const [newRelevo, setNewRelevo] = useState(false);
    useEffect(() => {
        // Dentro de un efecto, puedes realizar la llamada a la API de forma asincrónica
        const fetchData = async () => {
            try {
                const response = await fetch('http://127.0.0.1:8000/proyecto/relevo', {
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
            setNewRelevo(false)
        };

        fetchData(); // Llama a la función para obtener los datos
    }, [authTokens.access, newRelevo]);


    const [count, setCount] = useState(2);
    
    const defaultColumns = [
        {
            title: 'Implementado',
            dataIndex: 'implementado',
            editable: false,
        },
        {
            title: 'Estado',
            dataIndex: 'estado',
            editable: false,
        },
        {
            title: 'Imagen',
            dataIndex: 'imagen',
            width: '30%',
        },
        {
            title: 'Usuario',
            dataIndex: 'usuario_id',
            editable: false
        },
        {
            title: 'Tienda',
            dataIndex: 'tienda_id',
            editable: false
        },
        {
            title: 'Fecha de creacion',
            dataIndex: 'fecha_creacion',
            editable: false
        }
    ];

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
              
            }),
        };
    });

    const [isModalOpen, setIsModalOpen] = useState(false);
    const showModal = () => {
        setIsModalOpen(true);
    };
    const [form] = Form.useForm();
    const [tienda, setTiendas] = useState([]); // Define tienda como un estado

    const handleOk = async (values) => {
        try {
            const response = await fetch(`http://127.0.0.1:8000/proyecto/relevo`, {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + String(authTokens.access)
                },
                body: JSON.stringify(values)
            });
            
    
            if (response.status === 201) {
                const relevo = { ...values, id: count }
                setNewRelevo(true)
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
    const obtenerTiendas = async () => {
        try {
            const tiendasResponse = await fetch('http://127.0.0.1:8000/proyecto/tiendas', {
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + String(authTokens.access)
                },
            });
    
            if (tiendasResponse.ok) {
                const tiendasData = await tiendasResponse.json();
                const tiendasArray = Object.values(tiendasData);
                setTiendas(tiendasArray);
            } else {
                console.error('Error al obtener datos de la API');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };
    
    useEffect(() => {
        if (isModalOpen) {
            obtenerTiendas();
        }
    }, [isModalOpen]);

    const normFile = (e) => {
        if (Array.isArray(e)) {
            return e;
        }
        return e && e.fileList;
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
                Crear Relevo
            </Button>
            <Modal title="Crear Relevo" open={isModalOpen} onCancel={handleCancel} footer={null}>
            <Form onFinish={handleOk}>
                            <Form.Item
                name="implementado"
                rules={[
                    {
                        required: false,
                        message: 'Seleccione una opción, por favor!',
                    },
                ]}
            >
                <Select placeholder="Seleccione Implementado">
                    <Option value="MERCADERISMO">Mercaderismo</Option>
                    <Option value="SIN MERCADERISMO">Sin Mercaderismo</Option>
                </Select>
            </Form.Item>
                    <Form.Item
            name="estado"
            rules={[
                {
                    required: false,
                    message: 'Seleccione una opción, por favor!',
                },
            ]}
        >
            <Select placeholder="Seleccione Estado">
                <Option value="EFECTIVO">Efectivo</Option>
                <Option value="NO DESEA">No Desea</Option>
                <Option value="CERRADO">Cerrado</Option>
            </Select>
        </Form.Item> 
                    <Form.Item
                name="imagen"
                valuePropName="fileList"
                getValueFromEvent={normFile}
                rules={[
                    {
                        required: false,
                        message: 'Suba una imagen, por favor!',
                    },
                ]}
            >
                <Upload
                    name="logo"
                    action="/upload.do"
                    listType="picture"
                >
                    <Button icon={<UploadOutlined />}>Subir Imagen</Button>
                </Upload>
            </Form.Item> 
                <Form.Item
                        name="tienda_id"
                        rules={[
                            {
                                required: true,
                                message: 'Seleccione una tienda, por favor!',
                            },
                        ]}
                    >
                        <Select placeholder="Seleccione tienda">
                            {tienda.map((tienda) => (
                                <Option key={tienda.id} value={tienda.id}>
                                    {tienda.nombre}
                                </Option>
                            ))}
                        </Select>
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
export default TablaRelevos;