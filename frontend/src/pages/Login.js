import React, { useState } from "react";
import { Form, Input, Button, message } from "antd";
import api from "../utils/api";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      // Create URLSearchParams with the correct field names
      const formData = new URLSearchParams();
      formData.append('username', values.username);
      formData.append('password', values.password);
      
      const res = await api.post("/auth/login", formData, {
        headers: { 
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });
      
      localStorage.setItem("token", res.data.access_token);
      message.success("Login successful!");
      
      // Check if user is admin and redirect accordingly
      try {
        const userRes = await api.get("/auth/me");
        if (userRes.data.roles.includes("admin")) {
          navigate("/admin");
        } else {
          navigate("/");
        }
      } catch (error) {
        navigate("/");
      }
    } catch (err) {
      console.error("Login error:", err);
      message.error(err.response?.data?.detail || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "100px auto" }}>
      <h2>Admin Login</h2>
      <Form onFinish={onFinish} layout="vertical">
        <Form.Item 
          name="username" 
          label="Email" 
          rules={[{ required: true, type: "email", message: "Please enter a valid email address" }]}
        > 
          <Input placeholder="Enter your email" /> 
        </Form.Item>
        <Form.Item 
          name="password" 
          label="Password" 
          rules={[{ required: true, message: "Please enter your password" }]}
        > 
          <Input.Password placeholder="Enter your password" /> 
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} block>
            Login
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
} 