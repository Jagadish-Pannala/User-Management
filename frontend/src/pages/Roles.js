import React, { useEffect, useState } from "react";
import { Table, Button, Modal, Form, Input, message, Card, Row, Col, Space, Typography, Tooltip } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined, ReloadOutlined, TeamOutlined } from "@ant-design/icons";
import api from "../utils/api";

const { Title, Text } = Typography;
const { Search } = Input;

const apiEndpoint = "/roles/";

export default function Roles() {
  const [roles, setRoles] = useState([]);
  const [filteredRoles, setFilteredRoles] = useState([]);
  const [visible, setVisible] = useState(false);
  const [editingRole, setEditingRole] = useState(null);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const fetchRoles = async () => {
    try {
      setLoading(true);
      const res = await api.get(apiEndpoint);
      setRoles(res.data);
      setFilteredRoles(res.data);
    } catch (error) {
      message.error("Failed to fetch roles");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchRoles(); }, []);

  const onFinish = async (values) => {
    try {
      if (editingRole) {
        await api.put(`${apiEndpoint}${editingRole.role_id}`, values);
        message.success("Role updated successfully!");
      } else {
        await api.post(apiEndpoint, values);
        message.success("Role created successfully!");
      }
      setVisible(false);
      setEditingRole(null);
      fetchRoles();
      form.resetFields();
    } catch (error) {
      message.error(error.response?.data?.detail || "Error saving role");
    }
  };

  const onEdit = (record) => {
    setEditingRole(record);
    setVisible(true);
    form.setFieldsValue(record);
  };

  const onDelete = async (role_id) => {
    try {
      await api.delete(`${apiEndpoint}${role_id}`);
      message.success("Role deleted successfully!");
      fetchRoles();
    } catch (error) {
      message.error("Failed to delete role");
    }
  };

  const handleSearch = (value) => {
    if (!value) {
      setFilteredRoles(roles);
      return;
    }
    
    const filtered = roles.filter(role => 
      role.role_name?.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredRoles(filtered);
  };

  const columns = [
    {
      title: 'Role',
      dataIndex: 'role_name',
      key: 'role_name',
      render: (text, record) => (
        <div>
          <div style={{ fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
            <TeamOutlined style={{ marginRight: '8px', color: '#1890ff' }} />
            {text}
          </div>
          <Text type="secondary" style={{ fontSize: '12px' }}>
            ID: {record.role_id}
          </Text>
        </div>
      ),
      sorter: (a, b) => a.role_name.localeCompare(b.role_name),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Tooltip title="Edit Role">
            <Button 
              type="primary" 
              icon={<EditOutlined />}
              size="small"
              onClick={() => onEdit(record)}
            >
              Edit
            </Button>
          </Tooltip>
          <Tooltip title="Delete Role">
            <Button 
              danger 
              icon={<DeleteOutlined />}
              size="small"
              onClick={() => {
                Modal.confirm({
                  title: 'Are you sure you want to delete this role?',
                  content: `This will permanently delete the role "${record.role_name}". Users with this role will lose their permissions.`,
                  okText: 'Yes',
                  okType: 'danger',
                  cancelText: 'No',
                  onOk: () => onDelete(record.role_id),
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
            <Title level={3} style={{ margin: 0 }}>Role Management</Title>
            <Text type="secondary">Manage user roles and permissions</Text>
          </Col>
          <Col>
            <Button 
              type="primary" 
              icon={<PlusOutlined />}
              onClick={() => {
                setEditingRole(null);
                setVisible(true);
                form.resetFields();
              }}
            >
              Add Role
            </Button>
          </Col>
        </Row>

        <Row gutter={[16, 16]} style={{ marginBottom: '16px' }}>
          <Col span={8}>
            <Search
              placeholder="Search roles by name"
              allowClear
              enterButton={<SearchOutlined />}
              onSearch={handleSearch}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </Col>
          <Col>
            <Button 
              icon={<ReloadOutlined />}
              onClick={fetchRoles}
              loading={loading}
            >
              Refresh
            </Button>
          </Col>
        </Row>

        <Table
          columns={columns}
          dataSource={filteredRoles}
          rowKey="role_id"
          loading={loading}
          pagination={{
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} roles`,
            pageSizeOptions: ['10', '20', '50', '100'],
            defaultPageSize: 10,
          }}
          scroll={{ x: 600 }}
        />
      </Card>

      <Modal
        open={visible}
        title={editingRole ? "Edit Role" : "Add New Role"}
        onCancel={() => { 
          setVisible(false); 
          setEditingRole(null);
          form.resetFields();
        }}
        onOk={() => form.submit()}
        width={500}
        destroyOnClose
      >
        <Form 
          form={form} 
          onFinish={onFinish} 
          layout="vertical"
        >
          <Form.Item 
            name="role_name" 
            label="Role Name"
            rules={[
              { required: true, message: 'Please enter role name' },
              { min: 2, message: 'Role name must be at least 2 characters' }
            ]}
          >
            <Input placeholder="Enter role name (e.g., Admin, User, Manager)" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
} 