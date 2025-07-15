# User Management System

A full-stack user management system with role-based access control, built with FastAPI (backend) and React (frontend).

## Features

- **User Management**: Create, read, update, and delete users
- **Role Management**: Manage user roles and permissions
- **Permission System**: Granular permission control
- **Permission Groups**: Group permissions for easier management
- **JWT Authentication**: Secure login system
- **Modern UI**: Built with Ant Design components

## Project Structure

```
app/
├── backend/                 # FastAPI backend
│   ├── main.py             # Main application entry point
│   ├── auth.py             # Authentication logic
│   ├── users.py            # User management endpoints
│   ├── roles.py            # Role management endpoints
│   ├── permissions.py      # Permission management endpoints
│   ├── permission_groups.py # Permission group endpoints
│   ├── models.py           # SQLAlchemy models
│   ├── schemas.py          # Pydantic schemas
│   └── requirements.txt    # Python dependencies
└── frontend/               # React frontend
    ├── src/
    │   ├── pages/          # React components
    │   ├── utils/          # Utility functions
    │   └── App.js          # Main app component
    └── package.json        # Node.js dependencies
```

## Setup Instructions

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd app/backend
   ```

2. **Create virtual environment:**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Set up environment variables:**
   Create a `.env` file in the backend directory:
   ```env
   DATABASE_URL=mysql+pymysql://username:password@localhost/database_name
   SECRET_KEY=your-secret-key-here
   ```

5. **Run the backend server:**
   ```bash
   uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd app/frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm start
   ```

## API Endpoints

### Authentication
- `POST /auth/login` - User login

### Users
- `GET /users/` - Get all users
- `POST /users/` - Create new user
- `GET /users/{user_id}` - Get specific user
- `PUT /users/{user_id}` - Update user
- `DELETE /users/{user_id}` - Delete user

### Roles
- `GET /roles/` - Get all roles
- `POST /roles/` - Create new role
- `GET /roles/{role_id}` - Get specific role
- `PUT /roles/{role_id}` - Update role
- `DELETE /roles/{role_id}` - Delete role

### Permissions
- `GET /permissions/` - Get all permissions
- `POST /permissions/` - Create new permission
- `GET /permissions/{permission_id}` - Get specific permission
- `PUT /permissions/{permission_id}` - Update permission
- `DELETE /permissions/{permission_id}` - Delete permission

### Permission Groups
- `GET /permission-groups/` - Get all permission groups
- `POST /permission-groups/` - Create new permission group
- `GET /permission-groups/{group_id}` - Get specific permission group
- `PUT /permission-groups/{group_id}` - Update permission group
- `DELETE /permission-groups/{group_id}` - Delete permission group

## Connection Status

The backend and frontend are properly connected with the following features:

### ✅ Fixed Issues

1. **Authentication Protection**: All backend endpoints now require JWT authentication
2. **CORS Configuration**: Backend allows requests from frontend (localhost:3000)
3. **Error Handling**: Improved error handling in both frontend and backend
4. **API Configuration**: Centralized API configuration with axios interceptors
5. **Modal Components**: Fixed Modal component properties (using `open` instead of `visible`)
6. **Token Management**: Automatic token attachment and 401 error handling

### 🔧 Key Features

- **JWT Token Management**: Automatic token attachment to all API requests
- **Authentication Error Handling**: Automatic redirect to login on 401 errors
- **Centralized API Configuration**: Shared axios instance with interceptors
- **Proper Error Messages**: User-friendly error messages from backend responses
- **Form Validation**: Client-side validation with proper error display

## Testing the Connection

1. **Start both servers** (backend on port 8000, frontend on port 3000)
2. **Run the test script:**
   ```bash
   python test_connection.py
   ```
3. **Access the frontend** at http://localhost:3000
4. **Login** with valid credentials
5. **Test CRUD operations** on users, roles, permissions, and permission groups

## Security Features

- JWT-based authentication
- Password hashing with bcrypt
- CORS protection
- Input validation with Pydantic schemas
- SQL injection protection with SQLAlchemy ORM

## Development Notes

- Backend runs on FastAPI with automatic API documentation at http://localhost:8000/docs
- Frontend uses React with Ant Design for UI components
- Database models use SQLAlchemy ORM
- API schemas use Pydantic for validation
- All endpoints are protected with JWT authentication except login 