import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import RecordsPage from './pages/RecordsPage';
import UsersPage from './pages/UsersPage';
import AnalyticsPage from './pages/AnalyticsPage';
import WorkflowPage from './pages/WorkflowPage';
import MonitoringPage from './pages/MonitoringPage';
import ExecutivePage from './pages/ExecutivePage';
import ExpansionPage from './pages/ExpansionPage';

const ProtectedRoute = ({ children, roles }) => {
  const { isAuthenticated, user, loading } = useAuth();
  if (loading) return (
    <div style={{ minHeight:'100vh', background:'#0d5c5c', display:'flex', alignItems:'center', justifyContent:'center' }}>
      <div style={{ width:44, height:44, border:'4px solid rgba(255,255,255,0.2)', borderTopColor:'#4dd9d9', borderRadius:'50%', animation:'spin 0.8s linear infinite' }} />
    </div>
  );
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user?.role)) return <Navigate to="/dashboard" replace />;
  return children;
};

const AppRoutes = () => {
  const { isAuthenticated } = useAuth();
  return (
    <Routes>
      {/* Public pages */}
      <Route path="/"      element={<LandingPage />} />
      <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginPage />} />
      <Route path="/register" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginPage />} />

      {/* Protected app */}
      <Route path="/app" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
        <Route index element={<Navigate to="/app/dashboard" replace />} />
        <Route path="dashboard"  element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
        <Route path="records"    element={<ProtectedRoute><RecordsPage /></ProtectedRoute>} />
        <Route path="users"      element={<ProtectedRoute roles={['admin']}><UsersPage /></ProtectedRoute>} />
        <Route path="analytics"  element={<ProtectedRoute roles={['admin','manager']}><AnalyticsPage /></ProtectedRoute>} />
        <Route path="workflow"   element={<ProtectedRoute><WorkflowPage /></ProtectedRoute>} />
        <Route path="monitoring" element={<ProtectedRoute roles={['admin','manager']}><MonitoringPage /></ProtectedRoute>} />
        <Route path="executive"  element={<ProtectedRoute roles={['admin','manager']}><ExecutivePage /></ProtectedRoute>} />
        <Route path="expansion"  element={<ProtectedRoute roles={['admin']}><ExpansionPage /></ProtectedRoute>} />
      </Route>

      {/* Legacy /dashboard → /app/dashboard */}
      <Route path="/dashboard"  element={<Navigate to="/app/dashboard" replace />} />
      <Route path="/records"    element={<Navigate to="/app/records" replace />} />
      <Route path="/users"      element={<Navigate to="/app/users" replace />} />
      <Route path="/analytics"  element={<Navigate to="/app/analytics" replace />} />
      <Route path="/workflow"   element={<Navigate to="/app/workflow" replace />} />
      <Route path="/monitoring" element={<Navigate to="/app/monitoring" replace />} />
      <Route path="/executive"  element={<Navigate to="/app/executive" replace />} />
      <Route path="/expansion"  element={<Navigate to="/app/expansion" replace />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
