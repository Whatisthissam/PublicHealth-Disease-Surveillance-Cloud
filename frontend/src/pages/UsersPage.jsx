import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, Search, Edit3, Trash2, X, Save,
  User, Shield, Check, Ban, Users,
  UserPlus, Phone, Mail, MapPin, Briefcase,
  AlertCircle, ShieldAlert
} from 'lucide-react';
import { usersAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const REGIONS = ['Mumbai', 'Pune', 'Nashik', 'Nagpur', 'Thane', 'Aurangabad', 'Kolhapur', 'Solapur', 'Satara', 'Jalgaon'];
const DEPARTMENTS = ['Administration', 'Epidemiology', 'Field Operations', 'Data Entry', 'Data Analytics', 'IT Infrastructure'];
const ROLES = ['admin', 'manager', 'staff'];

const INITIAL_DEMO_USERS = [
  { id: 1, username: 'admin', email: 'admin@publichealthcloud.in', role: 'admin', full_name: 'Dr. Arjun Mehta', phone: '9876543210', region: 'Mumbai', department: 'Administration', is_active: 1, created_at: new Date().toISOString() },
  { id: 2, username: 'manager_mum', email: 'manager.mumbai@publichealthcloud.in', role: 'manager', full_name: 'Dr. Priya Sharma', phone: '9876543211', region: 'Mumbai', department: 'Epidemiology', is_active: 1, created_at: new Date().toISOString() },
  { id: 3, username: 'manager_pune', email: 'manager.pune@publichealthcloud.in', role: 'manager', full_name: 'Dr. Rahul Desai', phone: '9876543212', region: 'Pune', department: 'Epidemiology', is_active: 1, created_at: new Date().toISOString() },
  { id: 4, username: 'staff_mum_1', email: 'staff1.mumbai@publichealthcloud.in', role: 'staff', full_name: 'Anita Joshi', phone: '9876543213', region: 'Mumbai', department: 'Field Operations', is_active: 1, created_at: new Date().toISOString() },
  { id: 5, username: 'staff_pune_1', email: 'staff1.pune@publichealthcloud.in', role: 'staff', full_name: 'Sneha Kulkarni', phone: '9876543215', region: 'Pune', department: 'Data Entry', is_active: 1, created_at: new Date().toISOString() },
  { id: 6, username: 'analyst_1', email: 'analyst1@publichealthcloud.in', role: 'staff', full_name: 'Ritu Agarwal', phone: '9876543227', region: 'Mumbai', department: 'Data Analytics', is_active: 1, created_at: new Date().toISOString() },
];

const EMPTY_FORM = {
  username: '',
  email: '',
  password: '',
  full_name: '',
  role: 'staff',
  phone: '',
  region: '',
  department: '',
  is_active: 1
};

export default function UsersPage() {
  const { user: currentUser, demoMode } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterRole, setFilterRole] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [modal, setModal] = useState({ open: false, mode: 'add', data: null });
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    if (demoMode) {
      let localUsers = localStorage.getItem('ph_demo_users');
      if (!localUsers) {
        localStorage.setItem('ph_demo_users', JSON.stringify(INITIAL_DEMO_USERS));
        localUsers = JSON.stringify(INITIAL_DEMO_USERS);
      }
      const parsed = JSON.parse(localUsers);
      const filtered = parsed.filter(u => {
        const matchesSearch = !search ||
          u.username.toLowerCase().includes(search.toLowerCase()) ||
          u.email.toLowerCase().includes(search.toLowerCase()) ||
          u.full_name.toLowerCase().includes(search.toLowerCase());
        const matchesRole = !filterRole || u.role === filterRole;
        const matchesStatus = filterStatus === '' || u.is_active === parseInt(filterStatus);
        return matchesSearch && matchesRole && matchesStatus;
      });
      setUsers(filtered);
      setLoading(false);
      return;
    }

    try {
      const res = await usersAPI.getAll({ search });
      let data = res.data.data;
      if (filterRole) {
        data = data.filter(u => u.role === filterRole);
      }
      if (filterStatus !== '') {
        data = data.filter(u => u.is_active === parseInt(filterStatus));
      }
      setUsers(data);
    } catch (err) {
      // Fallback to demo data
      let localUsers = localStorage.getItem('ph_demo_users') || JSON.stringify(INITIAL_DEMO_USERS);
      const parsed = JSON.parse(localUsers);
      const filtered = parsed.filter(u => {
        const matchesSearch = !search ||
          u.username.toLowerCase().includes(search.toLowerCase()) ||
          u.email.toLowerCase().includes(search.toLowerCase()) ||
          u.full_name.toLowerCase().includes(search.toLowerCase());
        const matchesRole = !filterRole || u.role === filterRole;
        const matchesStatus = filterStatus === '' || u.is_active === parseInt(filterStatus);
        return matchesSearch && matchesRole && matchesStatus;
      });
      setUsers(filtered);
    } finally {
      setLoading(false);
    }
  }, [search, filterRole, filterStatus, demoMode]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Statistics calculation
  const stats = useMemo(() => {
    const total = users.length;
    const admins = users.filter(u => u.role === 'admin').length;
    const managers = users.filter(u => u.role === 'manager').length;
    const active = users.filter(u => u.is_active === 1 || u.is_active === true).length;
    return { total, admins, managers, active };
  }, [users]);

  const openAdd = () => {
    setForm(EMPTY_FORM);
    setError('');
    setModal({ open: true, mode: 'add', data: null });
  };

  const openEdit = (u) => {
    setForm({
      username: u.username,
      email: u.email,
      password: '', // blank by default
      full_name: u.full_name,
      role: u.role,
      phone: u.phone || '',
      region: u.region || '',
      department: u.department || '',
      is_active: u.is_active ? 1 : 0
    });
    setError('');
    setModal({ open: true, mode: 'edit', data: u });
  };

  const closeModal = () => {
    setModal({ open: false, mode: 'add', data: null });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    // Field validation
    if (modal.mode === 'add' && !form.password) {
      setError('Password is required for new users.');
      setSaving(false);
      return;
    }

    if (demoMode) {
      const localUsers = JSON.parse(localStorage.getItem('ph_demo_users') || JSON.stringify(INITIAL_DEMO_USERS));
      if (modal.mode === 'add') {
        // Check for duplicate username/email
        const exists = localUsers.some(u => u.username.toLowerCase() === form.username.toLowerCase() || u.email.toLowerCase() === form.email.toLowerCase());
        if (exists) {
          setError('Username or Email already exists.');
          setSaving(false);
          return;
        }

        const newUser = {
          ...form,
          id: Date.now(),
          created_at: new Date().toISOString()
        };
        delete newUser.password; // Do not save plaintext password in storage
        localUsers.unshift(newUser);
      } else {
        const idx = localUsers.findIndex(u => u.id === modal.data.id);
        if (idx !== -1) {
          localUsers[idx] = {
            ...localUsers[idx],
            full_name: form.full_name,
            role: form.role,
            phone: form.phone,
            region: form.region,
            department: form.department,
            is_active: form.is_active
          };
        }
      }
      localStorage.setItem('ph_demo_users', JSON.stringify(localUsers));
      setSaving(false);
      closeModal();
      fetchUsers();
      return;
    }

    try {
      if (modal.mode === 'add') {
        await usersAPI.create(form);
      } else {
        const payload = { ...form };
        if (!payload.password) delete payload.password; // backend skips hash if empty
        await usersAPI.update(modal.data.id, payload);
      }
      closeModal();
      fetchUsers();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save user.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (id === currentUser?.id) {
      alert('Cannot delete your own account.');
      return;
    }

    if (demoMode) {
      const localUsers = JSON.parse(localStorage.getItem('ph_demo_users') || JSON.stringify(INITIAL_DEMO_USERS));
      const updated = localUsers.filter(u => u.id !== id);
      localStorage.setItem('ph_demo_users', JSON.stringify(updated));
      setDeleteConfirm(null);
      fetchUsers();
      return;
    }

    try {
      await usersAPI.delete(id);
      setDeleteConfirm(null);
      fetchUsers();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete user.');
    }
  };

  // Helper styles matching Layout roleColors but tailored for dashboard tables
  const roleBadge = (r) => {
    const map = {
      admin: 'bg-purple-100 text-purple-700 border border-purple-200',
      manager: 'bg-blue-100 text-blue-700 border border-blue-200',
      staff: 'bg-emerald-100 text-emerald-700 border border-emerald-200'
    };
    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold capitalize ${map[r] || map.staff}`}>
        <span className={`w-1.5 h-1.5 rounded-full ${r === 'admin' ? 'bg-purple-500' : r === 'manager' ? 'bg-blue-500' : 'bg-emerald-500'}`} />
        {r}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="page-header flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="page-title">User Management</h1>
          <p className="page-subtitle">Add, manage, and configure access roles for PublicHealth system users</p>
        </div>
        <button id="add-user-btn" onClick={openAdd} className="btn-primary flex items-center gap-2">
          <UserPlus className="w-4 h-4" /> Add User
        </button>
      </div>

      {/* Stats Widgets */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="kpi-card">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-primary-600 mb-1">Total Users</p>
              <h3 className="text-3xl font-extrabold text-gray-900 font-display">{stats.total}</h3>
            </div>
            <div className="p-3 bg-primary-100/60 rounded-xl text-primary-700">
              <Users size={20} />
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-3">Registered user accounts</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="kpi-card">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-purple-600 mb-1">Administrators</p>
              <h3 className="text-3xl font-extrabold text-gray-900 font-display">{stats.admins}</h3>
            </div>
            <div className="p-3 bg-purple-100/60 rounded-xl text-purple-700">
              <Shield size={20} />
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-3">Full system configuration control</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="kpi-card">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-blue-600 mb-1">Managers</p>
              <h3 className="text-3xl font-extrabold text-gray-900 font-display">{stats.managers}</h3>
            </div>
            <div className="p-3 bg-blue-100/60 rounded-xl text-blue-700">
              <User size={20} />
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-3">Epidemiological region managers</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="kpi-card">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-emerald-600 mb-1">Active Accounts</p>
              <h3 className="text-3xl font-extrabold text-gray-900 font-display">{stats.active}</h3>
            </div>
            <div className="p-3 bg-emerald-100/60 rounded-xl text-emerald-700">
              <Check size={20} />
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-3">Operational staff status</p>
        </motion.div>
      </div>

      {/* Search & Filters */}
      <div className="glass-card p-4 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, username, email..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="input-field pl-9"
          />
        </div>
        <select value={filterRole} onChange={e => setFilterRole(e.target.value)} className="select-field w-auto min-w-36">
          <option value="">All Roles</option>
          {ROLES.map(r => <option key={r} value={r} className="capitalize">{r}</option>)}
        </select>
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="select-field w-auto min-w-36">
          <option value="">All Statuses</option>
          <option value="1">Active</option>
          <option value="0">Inactive</option>
        </select>
      </div>

      {/* Table Card */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
          <p className="text-sm text-gray-500 font-medium">{users.length} users found</p>
        </div>
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Name / Email</th>
                <th>Username</th>
                <th>Role</th>
                <th>Region & Department</th>
                <th>Phone</th>
                <th>Status</th>
                <th className="text-right pr-6">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                [...Array(6)].map((_, i) => (
                  <tr key={i}><td colSpan={7}><div className="skeleton h-12 mx-4 my-1" /></td></tr>
                ))
              ) : users.length === 0 ? (
                <tr><td colSpan={7} className="text-center py-12 text-gray-400">No users found.</td></tr>
              ) : users.map(u => (
                <tr key={u.id} className="hover:bg-primary-50/20">
                  <td>
                    <div className="flex flex-col">
                      <span className="font-semibold text-gray-900">{u.full_name}</span>
                      <span className="text-xs text-gray-400 flex items-center gap-1 mt-0.5"><Mail size={11} /> {u.email}</span>
                    </div>
                  </td>
                  <td className="font-mono text-xs text-primary-700 font-semibold">{u.username}</td>
                  <td>{roleBadge(u.role)}</td>
                  <td>
                    <div className="flex flex-col text-xs text-gray-600 gap-0.5">
                      <span className="flex items-center gap-1 font-medium"><MapPin size={11} className="text-primary-500" /> {u.region || '—'}</span>
                      <span className="flex items-center gap-1 text-gray-400"><Briefcase size={11} /> {u.department || '—'}</span>
                    </div>
                  </td>
                  <td className="text-gray-500 text-xs font-mono">{u.phone ? <span className="flex items-center gap-1"><Phone size={11} /> {u.phone}</span> : '—'}</td>
                  <td>
                    <span className={`badge ${u.is_active === 1 || u.is_active === true ? 'badge-active' : 'badge-deceased'}`}>
                      {u.is_active === 1 || u.is_active === true ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="text-right pr-6">
                    <div className="flex items-center justify-end gap-1.5">
                      <button onClick={() => openEdit(u)} className="p-1.5 rounded-lg hover:bg-primary-50 text-gray-400 hover:text-primary-600 transition-colors" title="Edit user">
                        <Edit3 className="w-4 h-4" />
                      </button>
                      {u.id !== currentUser?.id ? (
                        <button onClick={() => setDeleteConfirm(u)} className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors" title="Delete user">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      ) : (
                        <span className="w-7 text-center text-xs text-gray-300 font-semibold select-none cursor-default" title="You are logged into this account">Self</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Add / Edit User Modal */}
      <AnimatePresence>
        {modal.open && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="glass-card p-6 w-full max-w-xl max-h-[90vh] overflow-y-auto custom-scroll"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold font-display text-gray-900 flex items-center gap-2">
                  <UserPlus className="text-primary-600 w-5 h-5" />
                  {modal.mode === 'add' ? 'Register New User' : 'Edit User Profile'}
                </h3>
                <button onClick={closeModal} className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 transition-colors"><X className="w-4 h-4" /></button>
              </div>

              <form onSubmit={handleSave} className="grid grid-cols-2 gap-4">
                {modal.mode === 'add' ? (
                  <>
                    <div>
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 block">Username *</label>
                      <input
                        value={form.username}
                        onChange={e => setForm(f => ({ ...f, username: e.target.value }))}
                        placeholder="john_doe"
                        className="input-field font-mono"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 block">Email Address *</label>
                      <input
                        type="email"
                        value={form.email}
                        onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                        placeholder="john@publichealthcloud.in"
                        className="input-field"
                        required
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1 block">Username</label>
                      <input
                        value={form.username}
                        className="input-field bg-gray-100/70 border-gray-200 text-gray-400 cursor-not-allowed font-mono"
                        disabled
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1 block">Email Address</label>
                      <input
                        value={form.email}
                        className="input-field bg-gray-100/70 border-gray-200 text-gray-400 cursor-not-allowed"
                        disabled
                      />
                    </div>
                  </>
                )}

                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 block">Full Name *</label>
                  <input
                    value={form.full_name}
                    onChange={e => setForm(f => ({ ...f, full_name: e.target.value }))}
                    placeholder="Dr. John Doe"
                    className="input-field"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 block">
                    {modal.mode === 'add' ? 'Password *' : 'Change Password'}
                  </label>
                  <input
                    type="password"
                    value={form.password}
                    onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                    placeholder={modal.mode === 'add' ? '••••••••' : 'Leave blank to keep current'}
                    className="input-field"
                    required={modal.mode === 'add'}
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 block">Access Role *</label>
                  <select
                    value={form.role}
                    onChange={e => setForm(f => ({ ...f, role: e.target.value }))}
                    className="select-field capitalize"
                    required
                  >
                    {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 block">Phone Number</label>
                  <input
                    value={form.phone}
                    onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                    placeholder="9876543210"
                    className="input-field font-mono"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 block">Assigned Region</label>
                  <select
                    value={form.region}
                    onChange={e => setForm(f => ({ ...f, region: e.target.value }))}
                    className="select-field"
                  >
                    <option value="">No Region (Global)</option>
                    {REGIONS.map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 block">Department</label>
                  <select
                    value={form.department}
                    onChange={e => setForm(f => ({ ...f, department: e.target.value }))}
                    className="select-field"
                  >
                    <option value="">No Department</option>
                    {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>

                <div className="col-span-2">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 block">Account Status</label>
                  <select
                    value={form.is_active}
                    onChange={e => setForm(f => ({ ...f, is_active: parseInt(e.target.value) }))}
                    className="select-field"
                  >
                    <option value="1">Active (Allow System Login)</option>
                    <option value="0">Inactive (Block System Login)</option>
                  </select>
                </div>

                {error && (
                  <div className="col-span-2 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <div className="col-span-2 flex justify-end gap-3 pt-4 border-t border-gray-100">
                  <button type="button" onClick={closeModal} className="btn-secondary">Cancel</button>
                  <button type="submit" disabled={saving} className="btn-primary flex items-center gap-2">
                    {saving ? <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> : <Save className="w-4 h-4" />}
                    {modal.mode === 'add' ? 'Create User' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete User Dialog */}
      <AnimatePresence>
        {deleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
              className="glass-card p-6 w-full max-w-md border border-red-100"
            >
              <div className="flex items-start gap-3.5 mb-4 text-red-600">
                <div className="p-2.5 bg-red-50 rounded-xl">
                  <ShieldAlert className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 font-display">Remove User Account</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Are you sure you want to permanently delete the user account for <span className="font-semibold text-primary-700">{deleteConfirm.full_name}</span>?
                  </p>
                </div>
              </div>
              <p className="text-xs text-red-500 bg-red-50/60 p-2.5 rounded-lg border border-red-100 mb-6">
                <strong>Warning:</strong> Deleting a user will remove their profile and credentials. Related case logs they reported will remain intact under their reference. This action is irreversible.
              </p>
              <div className="flex gap-3">
                <button onClick={() => setDeleteConfirm(null)} className="btn-secondary flex-1">Cancel</button>
                <button onClick={() => handleDelete(deleteConfirm.id)} className="btn-danger flex-1">Remove User</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
