import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard, FileText, BarChart3, GitBranch,
  Activity, TrendingUp, Map, LogOut, Menu, X,
  Bell, User, ChevronDown, Stethoscope, Wifi, WifiOff,
  Users
} from 'lucide-react';

const navItems = [
  { to: '/app/dashboard',  icon: LayoutDashboard, label: 'Dashboard',          roles: ['admin','manager','staff'] },
  { to: '/app/records',    icon: FileText,         label: 'Disease Records',    roles: ['admin','manager','staff'] },
  { to: '/app/users',      icon: Users,            label: 'Users',              roles: ['admin'] },
  { to: '/app/analytics',  icon: BarChart3,        label: 'Analytics',          roles: ['admin','manager'] },
  { to: '/app/workflow',   icon: GitBranch,        label: 'Workflow',           roles: ['admin','manager','staff'] },
  { to: '/app/monitoring', icon: Activity,         label: 'Monitoring',         roles: ['admin','manager'] },
  { to: '/app/executive',  icon: TrendingUp,       label: 'Executive',          roles: ['admin','manager'] },
  { to: '/app/expansion',  icon: Map,              label: 'Expansion',          roles: ['admin'] },
];

const roleColors = {
  admin:   { pill: 'bg-purple-100 text-purple-700 border-purple-200', dot: 'bg-purple-500' },
  manager: { pill: 'bg-blue-100 text-blue-700 border-blue-200',       dot: 'bg-blue-500' },
  staff:   { pill: 'bg-emerald-100 text-emerald-700 border-emerald-200', dot: 'bg-emerald-500' },
};

export default function Layout() {
  const { user, logout, hasRole, demoMode } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen]   = useState(true);
  const [profileOpen, setProfileOpen]   = useState(false);

  const handleLogout = () => { logout(); navigate('/login'); };
  const visibleNav   = navItems.filter(item => hasRole(...item.roles));
  const rc           = roleColors[user?.role] || roleColors.staff;

  return (
    <div className="layout-root">
      {/* ── Sidebar ──────────────────────────────────────────────── */}
      <AnimatePresence initial={false}>
        {sidebarOpen && (
          <motion.aside
            key="sidebar"
            initial={{ x: -272 }}
            animate={{ x: 0 }}
            exit={{ x: -272 }}
            transition={{ type: 'spring', stiffness: 320, damping: 32 }}
            className="layout-sidebar"
          >
            {/* Logo */}
            <div className="sidebar-logo">
              <div className="sidebar-logo-icon">
                <Stethoscope size={20} />
              </div>
              <div className="sidebar-logo-text">
                <span className="sidebar-brand">PublicHealth</span>
                <span className="sidebar-brand-sub">Surveillance Cloud</span>
              </div>
            </div>

            {/* Nav */}
            <nav className="sidebar-nav">
              <p className="sidebar-nav-label">Navigation</p>
              {visibleNav.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `sidebar-nav-item ${isActive ? 'sidebar-nav-item--active' : ''}`
                  }
                >
                  <item.icon size={16} className="sidebar-nav-icon" />
                  <span>{item.label}</span>
                </NavLink>
              ))}
            </nav>

            {/* User card */}
            <div className="sidebar-user">
              <div className="sidebar-user-card">
                <div className="sidebar-avatar">
                  <User size={15} />
                </div>
                <div className="sidebar-user-info">
                  <p className="sidebar-user-name">{user?.full_name || user?.username}</p>
                  <span className={`sidebar-role-pill ${rc.pill}`}>
                    <span className={`sidebar-role-dot ${rc.dot}`} />
                    {user?.role?.toUpperCase()}
                  </span>
                </div>
                <button onClick={handleLogout} className="sidebar-logout-btn" title="Sign out">
                  <LogOut size={15} />
                </button>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* ── Main area ────────────────────────────────────────────── */}
      <div className="layout-main">
        {/* Topbar */}
        <header className="layout-topbar">
          <button
            onClick={() => setSidebarOpen(s => !s)}
            className="topbar-menu-btn"
            aria-label="Toggle sidebar"
          >
            {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
          </button>

          {/* Breadcrumb */}
          <div className="topbar-breadcrumb">
            <span className="topbar-breadcrumb-root">PublicHealth Cloud</span>
            <span className="topbar-breadcrumb-sep">›</span>
            <span className="topbar-status-dot" />
            <span className="topbar-status-label">
              {demoMode ? 'Demo Mode' : 'All Systems Operational'}
            </span>
          </div>

          {/* Demo badge */}
          {demoMode && (
            <div className="topbar-demo-badge">
              <WifiOff size={11} />
              Demo Mode
            </div>
          )}

          <div className="topbar-right">
            {/* Notifications */}
            <button className="topbar-icon-btn" aria-label="Notifications">
              <Bell size={18} />
              <span className="topbar-notif-dot" />
            </button>

            {/* Profile */}
            <div className="topbar-profile" onClick={() => setProfileOpen(o => !o)}>
              <div className="topbar-avatar">
                <User size={14} />
              </div>
              <span className="topbar-username">{user?.full_name?.split(' ')[0] || user?.username}</span>
              <ChevronDown size={13} className={`topbar-chevron ${profileOpen ? 'rotate-180' : ''}`} />
            </div>

            {/* Profile dropdown */}
            <AnimatePresence>
              {profileOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.96 }}
                  transition={{ duration: 0.15 }}
                  className="topbar-dropdown"
                  onMouseLeave={() => setProfileOpen(false)}
                >
                  <div className="dropdown-header">
                    <p className="dropdown-name">{user?.full_name || user?.username}</p>
                    <p className="dropdown-email">{user?.email || `${user?.username}@publichealth.in`}</p>
                    <span className={`sidebar-role-pill ${rc.pill} text-[10px]`}>
                      {user?.role?.toUpperCase()}
                    </span>
                  </div>
                  <hr className="dropdown-divider" />
                  <button onClick={handleLogout} className="dropdown-logout">
                    <LogOut size={13} /> Sign out
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </header>

        {/* Page content */}
        <main className="layout-content custom-scroll">
          <div className="layout-content-inner">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.28 }}
            >
              <Outlet />
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  );
}
