import React, { useEffect, useState } from "react";
import { Table, Button, Modal, Form, Input, message, Card, Row, Col, Space, Typography, Tooltip } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined, ReloadOutlined, SafetyCertificateOutlined } from "@ant-design/icons";
import api from "../utils/api";

const { Title, Text } = Typography;
const { Search } = Input;
const { TextArea } = Input;

const apiEndpoint = "/permissions/";

export default function Permissions() {
  const [permissions, setPermissions] = useState([]);
  const [filteredPermissions, setFilteredPermissions] = useState([]);
  const [visible, setVisible] = useState(false);
  const [editingPermission, setEditingPermission] = useState(null);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const fetchPermissions = async () => {
    try {
      setLoading(true);
      const res = await api.get(apiEndpoint);
      setPermissions(res.data);
      setFilteredPermissions(res.data);
    } catch (error) {
      message.error("Failed to fetch permissions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPermissions(); }, []);

  const onFinish = async (values) => {
    try {
      if (editingPermission) {
        await api.put(`${apiEndpoint}${editingPermission.permission_id}`, values);
        message.success("Permission updated successfully!");
      } else {
        await api.post(apiEndpoint, values);
        message.success("Permission created successfully!");
      }
      setVisible(false);
      setEditingPermission(null);
      fetchPermissions();
      form.resetFields();
    } catch (error) {
      message.error(error.response?.data?.detail || "Error saving permission");
    }
  };

  const onEdit = (record) => {
    setEditingPermission(record);
    setVisible(true);
    form.setFieldsValue(record);
  };

  const onDelete = async (permission_id) => {
    try {
      await api.delete(`${apiEndpoint}${permission_id}`);
      message.success("Permission deleted successfully!");
      fetchPermissions();
    } catch (error) {
      message.error("Failed to delete permission");
    }
  };

  const handleSearch = (value) => {
    if (!value) {
      setFilteredPermissions(permissions);
      return;
    }
    
    const filtered = permissions.filter(permission => 
      permission.permission_code?.toLowerCase().includes(value.toLowerCase()) ||
      permission.description?.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredPermissions(filtered);
  };

  const columns = [
    {
      title: 'Permission',
      dataIndex: 'permission_code',
      key: 'permission_code',
      render: (text, record) => (
        <div>
          <div style={{ fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
            <SafetyCertificateOutlined style={{ marginRight: '8px', color: '#faad14' }} />
            {text}
          </div>
          <Text type="secondary" style={{ fontSize: '12px' }}>
            ID: {record.permission_id}
          </Text>
        </div>
      ),
      sorter: (a, b) => a.permission_code.localeCompare(b.permission_code),
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      render: (text) => (
        <div style={{ maxWidth: '300px' }}>
          {text || <Text type="secondary">No description</Text>}
        </div>
      ),
      ellipsis: true,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Tooltip title="Edit Permission">
            <Button 
              type="primary" 
              icon={<EditOutlined />}
              size="small"
              onClick={() => onEdit(record)}
            >
              Edit
            </Button>
          </Tooltip>
          <Tooltip title="Delete Permission">
            <Button 
              danger 
              icon={<DeleteOutlined />}
              size="small"
              onClick={() => {
                Modal.confirm({
                  title: 'Are you sure you want to delete this permission?',
                  content: `This will permanently delete the permission "${record.permission_code}". This may affect users who have this permission.`,
                  okText: 'Yes',
                  okType: 'danger',
                  cancelText: 'No',
                  onOk: () => onDelete(record.permission_id),
                });
              }}
            >
              Delete
            </Button>
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      <Card>
        <Row justify="space-between" align="middle" style={{ marginBottom: '16px' }}>
          <Col>
            <Title level={3} style={{ margin: 0 }}>Permission Management</Title>
            <Text type="secondary">Manage system permissions and access controls</Text>
          </Col>
          <Col>
            <Button 
              type="primary" 
              icon={<PlusOutlined />}
              onClick={() => {
                setEditingPermission(null);
                setVisible(true);
                form.resetFields();
              }}
            >
              Add Permission
            </Button>
          </Col>
        </Row>

        <Row gutter={[16, 16]} style={{ marginBottom: '16px' }}>
          <Col span={8}>
            <Search
              placeholder="Search permissions by code or description"
              allowClear
              enterButton={<SearchOutlined />}
              onSearch={handleSearch}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </Col>
          <Col>
            <Button 
              icon={<ReloadOutlined />}
              onClick={fetchPermissions}
              loading={loading}
            >
              Refresh
            </Button>
          </Col>
        </Row>

        <Table
          columns={columns}
          dataSource={filteredPermissions}
          rowKey="permission_id"
          loading={loading}
          pagination={{
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} permissions`,
            pageSizeOptions: ['10', '20', '50', '100'],
            defaultPageSize: 10,
          }}
          scroll={{ x: 800 }}
        />
      </Card>

      <Modal
        open={visible}
        title={editingPermission ? "Edit Permission" : "Add New Permission"}
        onCancel={() => { 
          setVisible(false); 
          setEditingPermission(null);
          form.resetFields();
        }}
        onOk={() => form.submit()}
        width={600}
        destroyOnClose
      >
        <Form 
          form={form} 
          onFinish={onFinish} 
          layout="vertical"
        >
          <Form.Item 
            name="permission_code" 
            label="Permission Code"
            rules={[
              { required: true, message: 'Please enter permission code' },
              { min: 3, message: 'Permission code must be at least 3 characters' },
              { 
                pattern: /^[A-Z_]+$/, 
                message: 'Permission code should be uppercase with underscores (e.g., USER_CREATE)' 
              }
            ]}
          >
            <Input placeholder="Enter permission code (e.g., USER_CREATE, USER_READ)" />
          </Form.Item>
          
          <Form.Item 
            name="description" 
            label="Description"
            rules={[
              { max: 500, message: 'Description cannot exceed 500 characters' }
            ]}
          >
            <TextArea 
              placeholder="Enter a description for this permission (optional)"
              rows={3}
              showCount
              maxLength={500}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
} 