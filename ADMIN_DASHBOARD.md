# Admin Dashboard - User Management System

## Overview

The Admin Dashboard provides a comprehensive interface for managing users, roles, permissions, and permission groups in the User Management System. It features a modern, responsive design with advanced CRUD operations and real-time statistics.

## Features

### 🎯 **Dashboard Overview**
- **Real-time Statistics**: View counts of users, roles, permissions, and permission groups
- **Quick Actions**: One-click access to create new entities
- **Recent Users**: Display the latest 5 users with quick edit access
- **Management Sections**: Easy navigation to all management areas

### 👥 **User Management**
- **Create Users**: Add new user accounts with full details
- **Edit Users**: Modify user information and status
- **Delete Users**: Remove users with confirmation dialogs
- **Search & Filter**: Find users by name, email, or contact
- **Status Management**: Activate/deactivate user accounts
- **Password Management**: Secure password handling with bcrypt hashing

### 🏷️ **Role Management**
- **Create Roles**: Define new user roles
- **Edit Roles**: Modify role names and properties
- **Delete Roles**: Remove roles with safety confirmations
- **Search**: Find roles by name
- **Role Assignment**: Link roles to users for access control

### 🔐 **Permission Management**
- **Create Permissions**: Define granular system permissions
- **Edit Permissions**: Modify permission codes and descriptions
- **Delete Permissions**: Remove permissions with impact warnings
- **Search**: Find permissions by code or description
- **Validation**: Enforce permission code format (UPPER_CASE_WITH_UNDERSCORES)

### 📦 **Permission Group Management**
- **Create Groups**: Organize permissions into logical groups
- **Edit Groups**: Modify group names and properties
- **Delete Groups**: Remove groups with dependency warnings
- **Search**: Find groups by name
- **Group Assignment**: Link permission groups to roles

## User Interface Features

### 🎨 **Modern Design**
- **Responsive Layout**: Works on desktop, tablet, and mobile
- **Ant Design Components**: Professional UI with consistent styling
- **Color-coded Icons**: Visual distinction between different entity types
- **Loading States**: Smooth user experience with loading indicators

### 🔍 **Advanced Search & Filtering**
- **Real-time Search**: Instant filtering as you type
- **Multi-field Search**: Search across multiple properties
- **Clear Filters**: Easy reset of search criteria
- **Pagination**: Handle large datasets efficiently

### 📊 **Data Tables**
- **Sortable Columns**: Click headers to sort data
- **Pagination Controls**: Navigate through large datasets
- **Page Size Options**: Choose how many items to display
- **Total Counts**: See total number of items
- **Responsive Tables**: Horizontal scrolling on smaller screens

### ⚡ **Quick Actions**
- **Add Buttons**: Prominent buttons for creating new entities
- **Edit Actions**: Quick access to edit forms
- **Delete Confirmations**: Safety dialogs before deletion
- **Refresh Data**: Manual refresh buttons
- **Copy to Clipboard**: Easy copying of email addresses

## Security Features

### 🔐 **Authentication & Authorization**
- **JWT Token Management**: Secure token-based authentication
- **Role-based Access**: Admin-only access to management features
- **Automatic Logout**: Session timeout handling
- **Protected Routes**: Route-level security

### 🛡️ **Data Protection**
- **Password Hashing**: bcrypt encryption for user passwords
- **Input Validation**: Server-side and client-side validation
- **SQL Injection Protection**: Parameterized queries
- **XSS Prevention**: Sanitized input handling

## CRUD Operations

### Create (C)
```javascript
// Example: Creating a new user
const newUser = {
  first_name: "John",
  last_name: "Doe",
  mail: "john.doe@example.com",
  contact: "1234567890",
  password: "securepassword123",
  is_active: true
};
```

### Read (R)
```javascript
// Fetching all users with pagination
const users = await api.get("/users/?skip=0&limit=10");
```

### Update (U)
```javascript
// Updating user information
const updatedUser = {
  first_name: "Jane",
  last_name: "Smith",
  is_active: false
};
await api.put("/users/1", updatedUser);
```

### Delete (D)
```javascript
// Deleting a user with confirmation
await api.delete("/users/1");
```

## API Endpoints

### Users
- `GET /users/` - List all users
- `POST /users/` - Create new user
- `GET /users/{id}` - Get specific user
- `PUT /users/{id}` - Update user
- `DELETE /users/{id}` - Delete user

### Roles
- `GET /roles/` - List all roles
- `POST /roles/` - Create new role
- `GET /roles/{id}` - Get specific role
- `PUT /roles/{id}` - Update role
- `DELETE /roles/{id}` - Delete role

### Permissions
- `GET /permissions/` - List all permissions
- `POST /permissions/` - Create new permission
- `GET /permissions/{id}` - Get specific permission
- `PUT /permissions/{id}` - Update permission
- `DELETE /permissions/{id}` - Delete permission

### Permission Groups
- `GET /permission-groups/` - List all permission groups
- `POST /permission-groups/` - Create new permission group
- `GET /permission-groups/{id}` - Get specific permission group
- `PUT /permission-groups/{id}` - Update permission group
- `DELETE /permission-groups/{id}` - Delete permission group

## Getting Started

### Prerequisites
- Backend server running on port 8000
- MySQL database with proper schema
- Admin user with admin role

### Login
1. Navigate to `http://localhost:3000`
2. Login with admin credentials:
   - Email: `jagadishreddypannala6281@gmail.com`
   - Password: `PJR@6281`
3. You'll be redirected to the admin dashboard

### Using the Dashboard
1. **View Statistics**: Check the overview cards for system statistics
2. **Quick Actions**: Use the quick action cards to create new entities
3. **Manage Users**: Navigate to User Management for user CRUD operations
4. **Manage Roles**: Navigate to Role Management for role operations
5. **Manage Permissions**: Navigate to Permission Management for permission operations
6. **Manage Groups**: Navigate to Permission Group Management for group operations

## Best Practices

### User Management
- Always set strong passwords for new users
- Use descriptive role names
- Regularly review and update user status
- Keep contact information up to date

### Permission Management
- Use descriptive permission codes (e.g., `USER_CREATE`, `USER_READ`)
- Group related permissions together
- Document permission purposes in descriptions
- Review permissions regularly for security

### Role Management
- Create roles based on job functions
- Assign appropriate permissions to roles
- Avoid creating too many roles
- Document role purposes and responsibilities

## Troubleshooting

### Common Issues
1. **Login Fails**: Check if user exists and has admin role
2. **Permission Denied**: Verify user has admin role
3. **Data Not Loading**: Check backend server and database connection
4. **Search Not Working**: Ensure search terms match data format

### Error Messages
- `401 Unauthorized`: Invalid or expired token
- `403 Forbidden`: Insufficient permissions
- `404 Not Found`: Resource doesn't exist
- `422 Validation Error`: Invalid input data
- `500 Internal Server Error`: Backend server issue

## Support

For technical support or feature requests, please contact the development team or create an issue in the project repository. 