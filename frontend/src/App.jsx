// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './app.css';
import AuthLayout from './components/AuthLayout';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import Dashboard from './components/Dashboard';
import Navbar from './components/Navbar';
import ProfileSettings from './components/ProfileSettings';
import { useAuth } from './context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { currentUser } = useAuth();
  if (!currentUser) return <Navigate to="/login" />;
  return children;
};

// Background Elements Component
const BackgroundElements = () => {
  return (
    <>
      {/* Field Lines */}
      <div className="field-lines">
        <div className="field-line field-line-vertical"></div>
        <div className="field-line field-line-horizontal"></div>
        <div className="field-line field-line-diagonal-1"></div>
        <div className="field-line field-line-diagonal-2"></div>
      </div>

      {/* Floating Shapes */}
      <div className="floating-shapes">
        <div className="floating-shape shape-1"></div>
        <div className="floating-shape shape-2"></div>
        <div className="floating-shape shape-3"></div>
        <div className="floating-shape shape-4"></div>
      </div>

      {/* Center Circle */}
      <div className="center-circle"></div>
    </>
  );
};

// Layout WITH Navbar and Background
const Layout = ({ children }) => {
  return (
    <div className="bg-gradient min-vh-100">
      <BackgroundElements />
      <Navbar />
      <main className="container py-4 position-relative" style={{ zIndex: 1 }}>
        {children}
      </main>
    </div>
  );
};

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Auth pages WITH navbar now */}
        <Route
          path="/login"
          element={
            <Layout>
              <AuthLayout title="Login" icon="box-arrow-in-right">
                <LoginForm />
              </AuthLayout>
            </Layout>
          }
        />

        <Route
          path="/register"
          element={
            <Layout>
              <AuthLayout title="Register" icon="person-plus">
                <RegisterForm />
              </AuthLayout>
            </Layout>
          }
        />

        {/* Protected pages WITH navbar */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Layout><Dashboard /></Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Layout><ProfileSettings /></Layout>
            </ProtectedRoute>
          }
        />

        {/* Default redirect */}
        <Route path="/" element={<Navigate to="/dashboard" />} />

        {/* Catch all route - redirect to dashboard for authenticated users, login for others */}
        <Route path="*" element={<Navigate to="/dashboard" />} />
      </Routes>
    </Router>
  );
}