import React, { useState, useEffect } from "react";
import { Card, Row, Col, Statistic, Button, Table, Space, Typography, Divider, message } from "antd";
import { UserOutlined, TeamOutlined, SafetyCertificateOutlined, AppstoreOutlined, PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";

const { Title, Text } = Typography;

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    users: 0,
    roles: 0,
    permissions: 0,
    permissionGroups: 0
  });
  const [recentUsers, setRecentUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch statistics
      const [usersRes, rolesRes, permissionsRes, groupsRes] = await Promise.all([
        api.get("/users/"),
        api.get("/roles/"),
        api.get("/permissions/"),
        api.get("/permission-groups/")
      ]);

      setStats({
        users: usersRes.data.length,
        roles: rolesRes.data.length,
        permissions: permissionsRes.data.length,
        permissionGroups: groupsRes.data.length
      });

      // Get recent users (last 5)
      setRecentUsers(usersRes.data.slice(0, 5));

    } catch (error) {
      message.error("Failed to load dashboard data");
      console.error("Dashboard error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickAction = (action) => {
    switch (action) {
      case 'addUser':
        navigate('/users');
        break;
      case 'addRole':
        navigate('/roles');
        break;
      case 'addPermission':
        navigate('/permissions');
        break;
      case 'addGroup':
        navigate('/permission-groups');
        break;
      default:
        break;
    }
  };

  const recentUsersColumns = [
    {
      title: 'Name',
      dataIndex: 'first_name',
      key: 'name',
      render: (text, record) => `${record.first_name || ''} ${record.last_name || ''}`.trim() || 'N/A',
    },
    {
      title: 'Email',
      dataIndex: 'mail',
      key: 'email',
    },
    {
      title: 'Status',
      dataIndex: 'is_active',
      key: 'status',
      render: (active) => (
        <span style={{ color: active ? '#52c41a' : '#ff4d4f' }}>
          {active ? 'Active' : 'Inactive'}
        </span>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button 
            type="link" 
            icon={<EditOutlined />}
            onClick={() => navigate(`/users`)}
          >
            Edit
          </Button>
        </Space>
      ),
    },
  ];

  const quickActions = [
    {
      title: 'Add User',
      icon: <UserOutlined />,
      action: 'addUser',
      color: '#1890ff',
      description: 'Create new user account'
    },
    {
      title: 'Add Role',
      icon: <TeamOutlined />,
      action: 'addRole',
      color: '#52c41a',
      description: 'Create new user role'
    },
    {
      title: 'Add Permission',
      icon: <SafetyCertificateOutlined />,
      action: 'addPermission',
      color: '#faad14',
      description: 'Create new permission'
    },
    {
      title: 'Add Permission Group',
      icon: <AppstoreOutlined />,
      action: 'addGroup',
      color: '#722ed1',
      description: 'Create new permission group'
    }
  ];

  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      <Title level={2}>Admin Dashboard</Title>
      <Text type="secondary">Welcome to the User Management System</Text>
      
      <Divider />

      {/* Statistics Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total Users"
              value={stats.users}
              prefix={<UserOutlined />}
              loading={loading}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total Roles"
              value={stats.roles}
              prefix={<TeamOutlined />}
              loading={loading}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total Permissions"
              value={stats.permissions}
              prefix={<SafetyCertificateOutlined />}
              loading={loading}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Permission Groups"
              value={stats.permissionGroups}
              prefix={<AppstoreOutlined />}
              loading={loading}
            />
          </Card>
        </Col>
      </Row>

      {/* Quick Actions */}
      <Card title="Quick Actions" style={{ marginBottom: '24px' }}>
        <Row gutter={[16, 16]}>
          {quickActions.map((action) => (
            <Col xs={24} sm={12} lg={6} key={action.action}>
              <Card
                hoverable
                style={{ textAlign: 'center', cursor: 'pointer' }}
                onClick={() => handleQuickAction(action.action)}
              >
                <div style={{ fontSize: '32px', color: action.color, marginBottom: '8px' }}>
                  {action.icon}
                </div>
                <Title level={5}>{action.title}</Title>
                <Text type="secondary">{action.description}</Text>
              </Card>
            </Col>
          ))}
        </Row>
      </Card>

      {/* Management Links */}
      <Card title="Management Sections" style={{ marginBottom: '24px' }}>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} lg={6}>
            <Card
              hoverable
              style={{ textAlign: 'center', cursor: 'pointer' }}
              onClick={() => navigate('/users')}
            >
              <UserOutlined style={{ fontSize: '24px', color: '#1890ff' }} />
              <div style={{ marginTop: '8px' }}>
                <Title level={5}>User Management</Title>
                <Text type="secondary">Manage user accounts</Text>
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card
              hoverable
              style={{ textAlign: 'center', cursor: 'pointer' }}
              onClick={() => navigate('/roles')}
            >
              <TeamOutlined style={{ fontSize: '24px', color: '#52c41a' }} />
              <div style={{ marginTop: '8px' }}>
                <Title level={5}>Role Management</Title>
                <Text type="secondary">Manage user roles</Text>
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card
              hoverable
              style={{ textAlign: 'center', cursor: 'pointer' }}
              onClick={() => navigate('/permissions')}
            >
              <SafetyCertificateOutlined style={{ fontSize: '24px', color: '#faad14' }} />
              <div style={{ marginTop: '8px' }}>
                <Title level={5}>Permission Management</Title>
                <Text type="secondary">Manage system permissions</Text>
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card
              hoverable
              style={{ textAlign: 'center', cursor: 'pointer' }}
              onClick={() => navigate('/permission-groups')}
            >
              <AppstoreOutlined style={{ fontSize: '24px', color: '#722ed1' }} />
              <div style={{ marginTop: '8px' }}>
                <Title level={5}>Permission Groups</Title>
                <Text type="secondary">Manage permission groups</Text>
              </div>
            </Card>
          </Col>
        </Row>
      </Card>

      {/* Recent Users */}
      <Card 
        title="Recent Users" 
        extra={<Button type="link" onClick={() => navigate('/users')}>View All</Button>}
      >
        <Table
          columns={recentUsersColumns}
          dataSource={recentUsers}
          rowKey="user_id"
          pagination={false}
          loading={loading}
          size="small"
        />
      </Card>
    </div>
  );
} 