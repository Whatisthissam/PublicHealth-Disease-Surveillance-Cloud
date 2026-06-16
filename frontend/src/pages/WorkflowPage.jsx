import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, CheckCircle, Clock, XCircle, RefreshCw, ChevronDown } from 'lucide-react';
import { workflowAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const STATUS_CONFIG = {
  pending:      { label: 'Pending',      color: 'bg-yellow-100 text-yellow-700 border-yellow-200', dot: 'bg-yellow-500' },
  under_review: { label: 'Under Review', color: 'bg-blue-100 text-blue-700 border-blue-200',   dot: 'bg-blue-500' },
  approved:     { label: 'Approved',     color: 'bg-emerald-100 text-emerald-700 border-emerald-200', dot: 'bg-emerald-500' },
  rejected:     { label: 'Rejected',     color: 'bg-red-100 text-red-700 border-red-200',      dot: 'bg-red-500' },
};

const PRIORITY_CONFIG = {
  low:    'bg-gray-100 text-gray-600',
  medium: 'bg-blue-100 text-blue-600',
  high:   'bg-orange-100 text-orange-600',
  urgent: 'bg-red-100 text-red-600',
};

const TaskCard = ({ task, onStatusUpdate }) => {
  const [open, setOpen] = useState(false);
  const cfg = STATUS_CONFIG[task.status] || STATUS_CONFIG.pending;
  const pcfg = PRIORITY_CONFIG[task.priority] || PRIORITY_CONFIG.medium;

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-4 mb-3">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-2">
            <span className={`text-xs font-mono font-semibold text-primary-600`}>{task.task_id}</span>
            <span className={`badge ${pcfg}`}>{task.priority}</span>
          </div>
          <h4 className="font-semibold text-gray-900 text-sm mb-1 truncate">{task.title}</h4>
          <p className="text-xs text-gray-500 truncate">{task.description}</p>
          {task.due_date && (
            <p className="text-xs text-gray-400 mt-2">Due: {task.due_date?.slice(0,10)}</p>
          )}
          {task.assigned_to_name && (
            <p className="text-xs text-primary-600 font-medium mt-1">→ {task.assigned_to_name}</p>
          )}
        </div>
        <div className="flex flex-col items-end gap-2 flex-shrink-0">
          <span className={`badge border ${cfg.color}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
            {cfg.label}
          </span>
          <button onClick={() => setOpen(!open)} className="text-xs text-gray-400 hover:text-primary-600 flex items-center gap-1 transition-colors">
            Update <ChevronDown className={`w-3 h-3 transition-transform ${open ? 'rotate-180' : ''}`} />
          </button>
        </div>
      </div>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
            <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-gray-100">
              {Object.keys(STATUS_CONFIG).map(s => (
                <button
                  key={s}
                  disabled={s === task.status}
                  onClick={() => { onStatusUpdate(task.id, s); setOpen(false); }}
                  className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition-all ${STATUS_CONFIG[s].color} ${s === task.status ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105 cursor-pointer'}`}
                >
                  {STATUS_CONFIG[s].label}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const MOCK_TASKS = [
  { id: 1, task_id: 'WF-2026-0001', title: 'Mumbai Dengue Report Review', description: 'Review the Dengue case surge report submitted for Ward G-South, Mumbai district.', status: 'pending', priority: 'high', assigned_to_name: 'Dr. Priya Mehta', due_date: '2026-06-20T00:00:00.000Z' },
  { id: 2, task_id: 'WF-2026-0002', title: 'ICU Critical Case Escalation', patient_id: 'PAT-33821', description: 'Critical COVID-19 case requires ventilator resource verification in Nagpur.', status: 'under_review', priority: 'urgent', assigned_to_name: 'Dr. Arjun Sharma', due_date: '2026-06-18T00:00:00.000Z' },
  { id: 3, task_id: 'WF-2026-0003', title: 'Malaria Medical Supply Release', description: 'Approve malaria kit release for rural clinics in Pune.', status: 'approved', priority: 'medium', assigned_to_name: 'Dr. Ravi Kulkarni', due_date: '2026-06-22T00:00:00.000Z' },
  { id: 4, task_id: 'WF-2026-0004', title: 'Nashik TB Regimen Verification', description: 'Verify daily DOTS regime logs for patients in Nashik district.', status: 'rejected', priority: 'low', assigned_to_name: 'Rahul Patil', due_date: '2026-06-25T00:00:00.000Z' },
  { id: 5, task_id: 'WF-2026-0005', title: 'Thane Outbreak Data Entry Auditing', description: 'Audit influenza cases logs from Thane sub-centers.', status: 'pending', priority: 'medium', assigned_to_name: 'Rahul Patil', due_date: '2026-06-21T00:00:00.000Z' },
];

const MOCK_AUDIT = [
  { id: 1, created_at: '2026-06-16T09:20:00.000Z', full_name: 'Dr. Arjun Sharma', username: 'admin', action: 'UPDATE', entity_type: 'WORKFLOW', description: 'Updated task WF-2026-0002 status from pending to under_review' },
  { id: 2, created_at: '2026-06-16T09:05:00.000Z', full_name: 'Dr. Priya Mehta', username: 'manager_mum', action: 'CREATE', entity_type: 'CASE', description: 'Created new Dengue case record for PAT-88712' },
  { id: 3, created_at: '2026-06-16T08:50:00.000Z', full_name: 'Dr. Arjun Sharma', username: 'admin', action: 'LOGIN', entity_type: 'AUTH', description: 'Administrator logged in' },
  { id: 4, created_at: '2026-06-15T16:30:00.000Z', full_name: 'Dr. Ravi Kulkarni', username: 'manager_pun', action: 'UPDATE', entity_type: 'WORKFLOW', description: 'Updated task WF-2026-0003 status from under_review to approved' },
  { id: 5, created_at: '2026-06-15T14:15:00.000Z', full_name: 'Rahul Patil', username: 'staff_mum_1', action: 'CREATE', entity_type: 'CASE', description: 'Created new Malaria case record for PAT-44129' },
];

export default function WorkflowPage() {
  const { hasRole, demoMode } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [auditLog, setAuditLog] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('board');
  const [filterStatus, setFilterStatus] = useState('');

  const fetchAll = async () => {
    setLoading(true);
    if (demoMode) {
      const localTasks = JSON.parse(localStorage.getItem('ph_demo_tasks') || JSON.stringify(MOCK_TASKS));
      setTasks(localTasks);
      setAuditLog(MOCK_AUDIT);
      setLoading(false);
      return;
    }

    try {
      const [tasksRes, auditRes] = await Promise.all([
        workflowAPI.getAll({ limit: 50 }),
        hasRole('admin','manager') ? workflowAPI.getAuditLog({ limit: 50 }) : Promise.resolve({ data: { data: [] } }),
      ]);
      setTasks(tasksRes.data.data);
      setAuditLog(auditRes.data.data);
    } catch {
      const localTasks = JSON.parse(localStorage.getItem('ph_demo_tasks') || JSON.stringify(MOCK_TASKS));
      setTasks(localTasks);
      setAuditLog(MOCK_AUDIT);
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchAll(); }, [demoMode]);

  const handleStatusUpdate = async (id, status) => {
    if (demoMode) {
      const localTasks = JSON.parse(localStorage.getItem('ph_demo_tasks') || JSON.stringify(MOCK_TASKS));
      const idx = localTasks.findIndex(t => t.id === id);
      if (idx !== -1) {
        localTasks[idx].status = status;
        localStorage.setItem('ph_demo_tasks', JSON.stringify(localTasks));
      }
      fetchAll();
      return;
    }

    try {
      await workflowAPI.updateStatus(id, { status });
      fetchAll();
    } catch {
      const localTasks = JSON.parse(localStorage.getItem('ph_demo_tasks') || JSON.stringify(MOCK_TASKS));
      const idx = localTasks.findIndex(t => t.id === id);
      if (idx !== -1) {
        localTasks[idx].status = status;
        localStorage.setItem('ph_demo_tasks', JSON.stringify(localTasks));
      }
      fetchAll();
    }
  };

  const byStatus = Object.keys(STATUS_CONFIG).reduce((acc, s) => {
    acc[s] = tasks.filter(t => t.status === s);
    return acc;
  }, {});

  const counts = Object.entries(byStatus).map(([s, t]) => ({ status: s, count: t.length, ...STATUS_CONFIG[s] }));

  const actionColors = { LOGIN: 'text-blue-600', LOGOUT: 'text-gray-500', CREATE: 'text-emerald-600', UPDATE: 'text-orange-600', DELETE: 'text-red-600', VIEW: 'text-primary-600', EXPORT: 'text-purple-600' };

  return (
    <div className="space-y-6">
      <div className="page-header flex items-center justify-between">
        <div>
          <h1 className="page-title">Workflow Management</h1>
          <p className="page-subtitle">Task tracking, approvals, and audit trail</p>
        </div>
        <button onClick={fetchAll} className="btn-secondary flex items-center gap-2 text-sm">
          <RefreshCw className="w-4 h-4" />Refresh
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-4 gap-4">
        {counts.map(c => (
          <motion.div key={c.status} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-4 text-center">
            <p className="text-3xl font-bold font-display text-gray-900">{c.count}</p>
            <span className={`badge border mt-2 ${c.color}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
              {c.label}
            </span>
          </motion.div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200/60">
        {['board', 'list', ...(hasRole('admin','manager') ? ['audit'] : [])].map(t => (
          <button key={t} onClick={() => setActiveTab(t)}
            className={`px-4 py-2.5 text-sm font-semibold capitalize transition-all border-b-2 ${activeTab === t ? 'text-primary-600 border-primary-500' : 'text-gray-500 border-transparent hover:text-gray-700'}`}>
            {t === 'audit' ? 'Audit Trail' : t}
          </button>
        ))}
      </div>

      {activeTab === 'board' && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {Object.entries(STATUS_CONFIG).map(([status, cfg]) => (
            <div key={status}>
              <div className={`flex items-center gap-2 px-3 py-2 rounded-xl border mb-3 ${cfg.color}`}>
                <span className={`w-2 h-2 rounded-full ${cfg.dot}`} />
                <span className="text-xs font-semibold">{cfg.label}</span>
                <span className="ml-auto text-xs font-bold">{byStatus[status]?.length || 0}</span>
              </div>
              <div className="space-y-2">
                {(byStatus[status] || []).map(task => (
                  <TaskCard key={task.id} task={task} onStatusUpdate={handleStatusUpdate} />
                ))}
                {(byStatus[status] || []).length === 0 && (
                  <div className="text-xs text-gray-400 text-center py-6 border-2 border-dashed border-gray-200 rounded-xl">No tasks</div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'list' && (
        <div className="glass-card overflow-hidden">
          <div className="p-4 border-b border-gray-100 flex items-center gap-3">
            <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="select-field w-auto">
              <option value="">All Statuses</option>
              {Object.keys(STATUS_CONFIG).map(s => <option key={s} value={s}>{STATUS_CONFIG[s].label}</option>)}
            </select>
          </div>
          <table className="data-table">
            <thead>
              <tr><th>Task ID</th><th>Title</th><th>Assigned To</th><th>Priority</th><th>Status</th><th>Due Date</th></tr>
            </thead>
            <tbody>
              {tasks.filter(t => !filterStatus || t.status === filterStatus).map(task => (
                <tr key={task.id}>
                  <td className="font-mono text-xs text-primary-600">{task.task_id}</td>
                  <td className="font-medium text-sm max-w-xs truncate">{task.title}</td>
                  <td className="text-gray-600 text-sm">{task.assigned_to_name || '—'}</td>
                  <td><span className={`badge ${PRIORITY_CONFIG[task.priority]}`}>{task.priority}</span></td>
                  <td>
                    <span className={`badge border ${STATUS_CONFIG[task.status]?.color}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${STATUS_CONFIG[task.status]?.dot}`} />
                      {STATUS_CONFIG[task.status]?.label}
                    </span>
                  </td>
                  <td className="text-gray-500 text-xs">{task.due_date?.slice(0,10) || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'audit' && hasRole('admin','manager') && (
        <div className="glass-card overflow-hidden">
          <div className="p-4 border-b border-gray-100"><h3 className="font-bold text-gray-900">Audit Trail</h3></div>
          <table className="data-table">
            <thead><tr><th>Time</th><th>User</th><th>Action</th><th>Entity</th><th>Description</th></tr></thead>
            <tbody>
              {auditLog.map(log => (
                <tr key={log.id}>
                  <td className="text-xs text-gray-400 font-mono">{new Date(log.created_at).toLocaleString()}</td>
                  <td className="text-sm font-medium">{log.full_name || log.username}</td>
                  <td><span className={`text-xs font-bold ${actionColors[log.action] || 'text-gray-600'}`}>{log.action}</span></td>
                  <td className="text-xs text-gray-500">{log.entity_type}</td>
                  <td className="text-xs text-gray-600 max-w-xs truncate">{log.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
