import React, { useEffect, useState } from "react";
import { Table, Button, Modal, Form, Input, message, Card, Row, Col, Space, Typography, Tooltip } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined, ReloadOutlined, AppstoreOutlined } from "@ant-design/icons";
import api from "../utils/api";

const { Title, Text } = Typography;
const { Search } = Input;

const apiEndpoint = "/permission-groups/";

export default function PermissionGroups() {
  const [groups, setGroups] = useState([]);
  const [filteredGroups, setFilteredGroups] = useState([]);
  const [visible, setVisible] = useState(false);
  const [editingGroup, setEditingGroup] = useState(null);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const fetchGroups = async () => {
    try {
      setLoading(true);
      const res = await api.get(apiEndpoint);
      setGroups(res.data);
      setFilteredGroups(res.data);
    } catch (error) {
      message.error("Failed to fetch permission groups");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchGroups(); }, []);

  const onFinish = async (values) => {
    try {
      if (editingGroup) {
        await api.put(`${apiEndpoint}${editingGroup.group_id}`, values);
        message.success("Permission group updated successfully!");
      } else {
        await api.post(apiEndpoint, values);
        message.success("Permission group created successfully!");
      }
      setVisible(false);
      setEditingGroup(null);
      fetchGroups();
      form.resetFields();
    } catch (error) {
      message.error(error.response?.data?.detail || "Error saving permission group");
    }
  };

  const onEdit = (record) => {
    setEditingGroup(record);
    setVisible(true);
    form.setFieldsValue(record);
  };

  const onDelete = async (group_id) => {
    try {
      await api.delete(`${apiEndpoint}${group_id}`);
      message.success("Permission group deleted successfully!");
      fetchGroups();
    } catch (error) {
      message.error("Failed to delete permission group");
    }
  };

  const handleSearch = (value) => {
    if (!value) {
      setFilteredGroups(groups);
      return;
    }
    
    const filtered = groups.filter(group => 
      group.group_name?.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredGroups(filtered);
  };

  const columns = [
    {
      title: 'Permission Group',
      dataIndex: 'group_name',
      key: 'group_name',
      render: (text, record) => (
        <div>
          <div style={{ fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
            <AppstoreOutlined style={{ marginRight: '8px', color: '#722ed1' }} />
            {text}
          </div>
          <Text type="secondary" style={{ fontSize: '12px' }}>
            ID: {record.group_id}
          </Text>
        </div>
      ),
      sorter: (a, b) => a.group_name.localeCompare(b.group_name),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Tooltip title="Edit Permission Group">
            <Button 
              type="primary" 
              icon={<EditOutlined />}
              size="small"
              onClick={() => onEdit(record)}
            >
              Edit
            </Button>
          </Tooltip>
          <Tooltip title="Delete Permission Group">
            <Button 
              danger 
              icon={<DeleteOutlined />}
              size="small"
              onClick={() => {
                Modal.confirm({
                  title: 'Are you sure you want to delete this permission group?',
                  content: `This will permanently delete the permission group "${record.group_name}". This may affect roles and users who have permissions from this group.`,
                  okText: 'Yes',
                  okType: 'danger',
                  cancelText: 'No',
                  onOk: () => onDelete(record.group_id),
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
            <Title level={3} style={{ margin: 0 }}>Permission Group Management</Title>
            <Text type="secondary">Manage permission groups for role-based access control</Text>
          </Col>
          <Col>
            <Button 
              type="primary" 
              icon={<PlusOutlined />}
              onClick={() => {
                setEditingGroup(null);
                setVisible(true);
                form.resetFields();
              }}
            >
              Add Permission Group
            </Button>
          </Col>
        </Row>

        <Row gutter={[16, 16]} style={{ marginBottom: '16px' }}>
          <Col span={8}>
            <Search
              placeholder="Search permission groups by name"
              allowClear
              enterButton={<SearchOutlined />}
              onSearch={handleSearch}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </Col>
          <Col>
            <Button 
              icon={<ReloadOutlined />}
              onClick={fetchGroups}
              loading={loading}
            >
              Refresh
            </Button>
          </Col>
        </Row>

        <Table
          columns={columns}
          dataSource={filteredGroups}
          rowKey="group_id"
          loading={loading}
          pagination={{
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} permission groups`,
            pageSizeOptions: ['10', '20', '50', '100'],
            defaultPageSize: 10,
          }}
          scroll={{ x: 600 }}
        />
      </Card>

      <Modal
        open={visible}
        title={editingGroup ? "Edit Permission Group" : "Add New Permission Group"}
        onCancel={() => { 
          setVisible(false); 
          setEditingGroup(null);
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
            name="group_name" 
            label="Group Name"
            rules={[
              { required: true, message: 'Please enter group name' },
              { min: 2, message: 'Group name must be at least 2 characters' }
            ]}
          >
            <Input placeholder="Enter group name (e.g., User Management, Admin Access)" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
} 