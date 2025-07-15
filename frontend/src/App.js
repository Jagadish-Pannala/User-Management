import React from "react";
import { BrowserRouter as Router, Route, Routes, Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import Users from "./pages/Users";
import Roles from "./pages/Roles";
import Permissions from "./pages/Permissions";
import PermissionGroups from "./pages/PermissionGroups";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import api from "./utils/api";

function parseJwt(token) {
  if (!token) return null;
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

function RequireAuth({ children }) {
  const location = useLocation();
  const token = localStorage.getItem("token");
  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return children;
}

function Logout() {
  const navigate = useNavigate();
  React.useEffect(() => {
    localStorage.removeItem("token");
    navigate("/login");
  }, [navigate]);
  return null;
}

function isTokenExpired(token) {
  const user = parseJwt(token);
  if (!user || !user.exp) return true;
  return user.exp * 1000 < Date.now();
}

function RequireAdmin({ children }) {
  const [isAdmin, setIsAdmin] = React.useState(null);
  const location = useLocation();
  React.useEffect(() => {
    async function checkAdmin() {
      try {
        const res = await api.get("/auth/me");
        setIsAdmin(res.data.roles.includes("admin"));
      } catch {
        setIsAdmin(false);
      }
    }
    checkAdmin();
  }, []);
  if (isAdmin === null) return <div>Loading...</div>;
  if (!isAdmin) return <Navigate to="/login" state={{ from: location }} replace />;
  return children;
}

function Home() {
  const token = localStorage.getItem("token");
  const user = parseJwt(token);
  
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  
  return (
    <div style={{ maxWidth: 800, margin: "40px auto", padding: "20px" }}>
      <h1>Welcome to User Management System</h1>
      <p>Hello, {user?.sub || 'User'}!</p>
      <p>Please use the navigation menu above to manage users, roles, permissions, and permission groups.</p>
    </div>
  );
}

function App() {
  const token = localStorage.getItem("token");
  const user = parseJwt(token);
  
  React.useEffect(() => {
    if (token && isTokenExpired(token)) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
  }, [token]);

  // After login, check if admin and redirect
  React.useEffect(() => {
    if (window.location.pathname === "/login" && token) {
      api.get("/auth/me").then(res => {
        if (res.data.roles.includes("admin")) {
          window.location.href = "/admin";
        } else {
          window.location.href = "/";
        }
      }).catch(() => {
        // If /auth/me fails, redirect to home
        window.location.href = "/";
      });
    }
  }, [token]);

  return (
    <Router>
      {token && (
        <nav style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', alignItems: 'center', padding: '10px', backgroundColor: '#f0f0f0' }}>
          <span style={{ marginRight: 'auto', fontWeight: 'bold' }}>User: {user?.sub}</span>
          <Link to="/">Home</Link>
          <Link to="/users">Users</Link>
          <Link to="/roles">Roles</Link>
          <Link to="/permissions">Permissions</Link>
          <Link to="/permission-groups">Permission Groups</Link>
          <Link to="/admin">Admin Dashboard</Link>
          <Link to="/logout">Logout</Link>
        </nav>
      )}
      <Routes>
        <Route path="/" element={<RequireAuth><Home /></RequireAuth>} />
        <Route path="/login" element={<Login />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/users" element={<RequireAuth><Users /></RequireAuth>} />
        <Route path="/roles" element={<RequireAuth><Roles /></RequireAuth>} />
        <Route path="/permissions" element={<RequireAuth><Permissions /></RequireAuth>} />
        <Route path="/permission-groups" element={<RequireAuth><PermissionGroups /></RequireAuth>} />
        <Route path="/admin" element={<RequireAuth><RequireAdmin><AdminDashboard /></RequireAdmin></RequireAuth>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;