import AuthContext from '../../context/AuthContext';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { Button, Form, Input, Table, Modal, Select, message } from 'antd'; // Agrega 'Select' y 'Upload' aquí
import { UploadOutlined } from '@ant-design/icons'; // Agrega 'UploadOutlined' aquí
import { Upload } from 'antd'

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
            title: 'ID Usuario',
            dataIndex: 'usuario',
            editable: false
        },
        {
            title: 'ID Tienda',
            dataIndex: 'tienda',
            editable: false
        },
        {
            title: 'Fecha de creacion',
            dataIndex: 'fechaCreacion',
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


    const [imagenFile, setImagenfile] = useState('')

    const props = {
        name: 'file',
        action: 'https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188',
        headers: {
            authorization: 'authorization-text',
        },
        onChange(info) {
            if (info.file.status === 'done') {
                message.success(`${info.file.name} file uploaded successfully`);
                setImagenfile(info.file.originFileObj)

            } else if (info.file.status === 'error') {
                message.error(`${info.file.name} file upload failed.`);
            }
        },
    };



    const [form] = Form.useForm();

    const handleOk = async (values) => {

        let formData = new FormData();
        formData.append("imagen", imagenFile)
        formData.append("implementado", values.implementado)
        formData.append('estado', values.estado)
        formData.append('tienda', values.tienda)


        try {
            const response = await fetch(`http://127.0.0.1:8000/proyecto/relevo`, {
                method: 'POST',
                headers: {
                    'Authorization': 'Bearer ' + String(authTokens.access)
                },
                body: formData
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

    const pagination = {
        pageSize: 8, // Número de filas por página
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
                                required: true,
                                message: 'Seleccione una opción, por favor!',
                            },
                        ]}
                    >
                        <Select placeholder="Seleccion si implemento o no, la tienda">
                            <Option value="MERCADERISMO">MERCADERISMO</Option>
                            <Option value="SIN MERCADERISMO">SIN MERCADERISMO</Option>
                        </Select>
                    </Form.Item>
                    <Form.Item
                        name="estado"
                        rules={[
                            {
                                required: true,
                                message: 'Seleccione una opción, por favor!',
                            },
                        ]}
                    >
                        <Select placeholder="Seleccione Estado">
                            <Option value="EFECTIVO">EFECTIVO</Option>
                            <Option value="NO DESEA">NO DESEA</Option>
                            <Option value="CERRADO">CERRADO</Option>
                        </Select>
                    </Form.Item>
                    {/* <Form.Item
                        name="imagen"
                        rules={[
                            {
                                required: false,
                                message: 'Suba una imagen, por favor!',
                            },
                        ]}
                    >
                        <Input type="file" name="" id="" />
                    </Form.Item> */}
                    <Upload {...props}>
                        <Button icon={<UploadOutlined />}>Click to Upload</Button>
                    </Upload>

                    <Form.Item
                        name="tienda"
                        rules={[
                            {
                                required: true,
                                message: 'Seleccione una tienda, por favor!',
                            },
                        ]}
                    >
                        <Input placeholder="tienda" />
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
                pagination={pagination} // Configuración de paginación
            />
        </div>
    );
};
export default TablaRelevos;