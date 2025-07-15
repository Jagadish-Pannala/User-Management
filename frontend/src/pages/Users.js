import React, { useEffect, useState } from "react";
import { Table, Button, Modal, Form, Input, message, Card, Row, Col, Space, Typography, Switch, InputNumber, Tooltip } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined, ReloadOutlined } from "@ant-design/icons";
import api from "../utils/api";

const { Title, Text } = Typography;
const { Search } = Input;

const apiEndpoint = "/users/";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [visible, setVisible] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await api.get(apiEndpoint);
      setUsers(res.data);
      setFilteredUsers(res.data);
    } catch (error) {
      message.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const onFinish = async (values) => {
    try {
      if (editingUser) {
        await api.put(`${apiEndpoint}${editingUser.user_id}`, values);
        message.success("User updated successfully!");
      } else {
        await api.post(apiEndpoint, values);
        message.success("User created successfully!");
      }
      setVisible(false);
      setEditingUser(null);
      fetchUsers();
      form.resetFields();
    } catch (error) {
      message.error(error.response?.data?.detail || "Error saving user");
    }
  };

  const onEdit = (record) => {
    setEditingUser(record);
    setVisible(true);
    form.setFieldsValue({
      ...record,
      password: '' // Don't show password in edit form
    });
  };

  const onDelete = async (user_id) => {
    try {
      await api.delete(`${apiEndpoint}${user_id}`);
      message.success("User deleted successfully!");
      fetchUsers();
    } catch (error) {
      message.error("Failed to delete user");
    }
  };

  const handleSearch = (value) => {
    if (!value) {
      setFilteredUsers(users);
      return;
    }
    
    const filtered = users.filter(user => 
      user.first_name?.toLowerCase().includes(value.toLowerCase()) ||
      user.last_name?.toLowerCase().includes(value.toLowerCase()) ||
      user.mail?.toLowerCase().includes(value.toLowerCase()) ||
      user.contact?.includes(value)
    );
    setFilteredUsers(filtered);
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'first_name',
      key: 'name',
      render: (text, record) => (
        <div>
          <div style={{ fontWeight: 'bold' }}>
            {`${record.first_name || ''} ${record.last_name || ''}`.trim() || 'N/A'}
          </div>
          <Text type="secondary" style={{ fontSize: '12px' }}>
            ID: {record.user_id}
          </Text>
        </div>
      ),
      sorter: (a, b) => {
        const nameA = `${a.first_name || ''} ${a.last_name || ''}`.trim();
        const nameB = `${b.first_name || ''} ${b.last_name || ''}`.trim();
        return nameA.localeCompare(nameB);
      },
    },
    {
      title: 'Email',
      dataIndex: 'mail',
      key: 'email',
      render: (text) => <Text copyable>{text}</Text>,
      sorter: (a, b) => a.mail.localeCompare(b.mail),
    },
    {
      title: 'Contact',
      dataIndex: 'contact',
      key: 'contact',
      render: (text) => text || 'N/A',
    },
    {
      title: 'Status',
      dataIndex: 'is_active',
      key: 'status',
      render: (active) => (
        <Switch
          checked={active}
          checkedChildren="Active"
          unCheckedChildren="Inactive"
          disabled
        />
      ),
      filters: [
        { text: 'Active', value: true },
        { text: 'Inactive', value: false },
      ],
      onFilter: (value, record) => record.is_active === value,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Tooltip title="Edit User">
            <Button 
              type="primary" 
              icon={<EditOutlined />}
              size="small"
              onClick={() => onEdit(record)}
            >
              Edit
            </Button>
          </Tooltip>
          <Tooltip title="Delete User">
            <Button 
              danger 
              icon={<DeleteOutlined />}
              size="small"
              onClick={() => {
                Modal.confirm({
                  title: 'Are you sure you want to delete this user?',
                  content: `This will permanently delete ${record.first_name || 'this user'}.`,
                  okText: 'Yes',
                  okType: 'danger',
                  cancelText: 'No',
                  onOk: () => onDelete(record.user_id),
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
            <Title level={3} style={{ margin: 0 }}>User Management</Title>
            <Text type="secondary">Manage user accounts and permissions</Text>
          </Col>
          <Col>
            <Button 
              type="primary" 
              icon={<PlusOutlined />}
              onClick={() => {
                setEditingUser(null);
                setVisible(true);
                form.resetFields();
              }}
            >
              Add User
            </Button>
          </Col>
        </Row>

        <Row gutter={[16, 16]} style={{ marginBottom: '16px' }}>
          <Col span={8}>
            <Search
              placeholder="Search users by name, email, or contact"
              allowClear
              enterButton={<SearchOutlined />}
              onSearch={handleSearch}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </Col>
          <Col>
            <Button 
              icon={<ReloadOutlined />}
              onClick={fetchUsers}
              loading={loading}
            >
              Refresh
            </Button>
          </Col>
        </Row>

        <Table
          columns={columns}
          dataSource={filteredUsers}
          rowKey="user_id"
          loading={loading}
          pagination={{
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} users`,
            pageSizeOptions: ['10', '20', '50', '100'],
            defaultPageSize: 10,
          }}
          scroll={{ x: 800 }}
        />
      </Card>

      <Modal
        open={visible}
        title={editingUser ? "Edit User" : "Add New User"}
        onCancel={() => { 
          setVisible(false); 
          setEditingUser(null);
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
          initialValues={{ is_active: true }}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item 
                name="first_name" 
                label="First Name"
                rules={[{ required: true, message: 'Please enter first name' }]}
              >
                <Input placeholder="Enter first name" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item 
                name="last_name" 
                label="Last Name"
                rules={[{ required: true, message: 'Please enter last name' }]}
              >
                <Input placeholder="Enter last name" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item 
            name="mail" 
            label="Email"
            rules={[
              { required: true, message: 'Please enter email' },
              { type: 'email', message: 'Please enter a valid email' }
            ]}
          >
            <Input placeholder="Enter email address" />
          </Form.Item>

          <Form.Item 
            name="contact" 
            label="Contact Number"
          >
            <Input placeholder="Enter contact number" />
          </Form.Item>

          <Form.Item 
            name="password" 
            label="Password"
            rules={[
              { required: !editingUser, message: 'Please enter password' },
              { min: 6, message: 'Password must be at least 6 characters' }
            ]}
          >
            <Input.Password placeholder={editingUser ? "Leave blank to keep current password" : "Enter password"} />
          </Form.Item>

          <Form.Item 
            name="is_active" 
            label="Status"
            valuePropName="checked"
          >
            <Switch checkedChildren="Active" unCheckedChildren="Inactive" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}