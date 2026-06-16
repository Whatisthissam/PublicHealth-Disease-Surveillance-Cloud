import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Cpu, MemoryStick, HardDrive, Network, CheckCircle, AlertTriangle, XCircle, RefreshCw, Bell, BellOff } from 'lucide-react';
import { monitoringAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const MetricGauge = ({ label, value, unit = '%', color, icon: Icon, description }) => {
  const pct = Math.min(Math.max(value, 0), 100);
  const getColor = (v) => v > 80 ? '#ef4444' : v > 60 ? '#f59e0b' : '#10b981';
  const gaugeColor = getColor(pct);

  return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="glass-card p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${gaugeColor}18` }}>
            <Icon className="w-5 h-5" style={{ color: gaugeColor }} />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-700">{label}</p>
            <p className="text-xs text-gray-400">{description}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-3xl font-bold font-display" style={{ color: gaugeColor }}>{value}</p>
          <p className="text-xs text-gray-400">{unit}</p>
        </div>
      </div>
      <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className="h-full rounded-full transition-all"
          style={{ background: `linear-gradient(90deg, ${gaugeColor}80, ${gaugeColor})` }}
        />
      </div>
      <p className="text-xs text-gray-400 mt-2">{pct > 80 ? '⚠️ High usage' : pct > 60 ? 'Normal' : '✓ Healthy'}</p>
    </motion.div>
  );
};

const SEVERITY_CONFIG = {
  critical: { class: 'alert-critical', icon: XCircle,       color: 'text-red-500',    bg: 'bg-red-100' },
  high:     { class: 'alert-high',     icon: AlertTriangle, color: 'text-orange-500', bg: 'bg-orange-100' },
  medium:   { class: 'alert-medium',   icon: AlertTriangle, color: 'text-yellow-500', bg: 'bg-yellow-100' },
  low:      { class: 'alert-low',      icon: Bell,          color: 'text-blue-500',   bg: 'bg-blue-100' },
};

const MOCK_MONITORING = {
  metrics: { cpuUsage: 34, memUsage: 62, storageUsage: 45, networkIn: 12 },
  summary: { activeAlerts: 3, criticalAlerts: 1 },
  services: [
    { name: 'API Gateway', status: 'operational', uptime: '99.98%', latency: '24ms' },
    { name: 'Surveillance Service', status: 'operational', uptime: '99.95%', latency: '45ms' },
    { name: 'MySQL Database', status: 'operational', uptime: '99.99%', latency: '2ms' },
    { name: 'JWT Auth Server', status: 'operational', uptime: '100.00%', latency: '12ms' },
    { name: 'Notification Service', status: 'operational', uptime: '99.91%', latency: '85ms' },
  ],
  alerts: [
    { id: 1, title: 'Nagpur Dengue Case Surge', message: 'Dengue cases reported in Nagpur have crossed the high threshold of 25 cases in 48 hours.', severity: 'critical', region: 'Nagpur', created_at: '2026-06-16T08:12:00.000Z', alert_type: 'SURGE_THRESHOLD', status: 'active' },
    { id: 2, title: 'Mumbai Service Latency Spike', message: 'The latencies for case queries in Mumbai region have exceeded 200ms.', severity: 'medium', region: 'Mumbai', created_at: '2026-06-16T07:45:00.000Z', alert_type: 'LATENCY_SPIKE', status: 'active' },
    { id: 3, title: 'Staff Login Anomaly', message: 'Staff staff_mum_1 performed multiple failed login attempts within 5 minutes.', severity: 'low', region: 'Mumbai', created_at: '2026-06-16T06:30:00.000Z', alert_type: 'LOGIN_ATTEMPTS', status: 'active' },
    { id: 4, title: 'Pune Malaria Alert Resolved', message: 'Surge of malaria in Pune has dropped back to baseline levels.', severity: 'high', region: 'Pune', created_at: '2026-06-15T14:30:00.000Z', alert_type: 'SURGE_THRESHOLD', status: 'resolved' },
  ]
};

export default function MonitoringPage() {
  const { demoMode } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [acknowledging, setAcknowledging] = useState(null);
  const [filterSeverity, setFilterSeverity] = useState('');
  const [filterStatus, setFilterStatus] = useState('active');

  const fetchData = async () => {
    if (demoMode) {
      const localData = JSON.parse(localStorage.getItem('ph_demo_monitoring') || JSON.stringify(MOCK_MONITORING));
      setData(localData);
      setLoading(false);
      return;
    }

    try {
      const res = await monitoringAPI.getData();
      setData(res.data.data);
    } catch {
      const localData = JSON.parse(localStorage.getItem('ph_demo_monitoring') || JSON.stringify(MOCK_MONITORING));
      setData(localData);
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); const t = setInterval(fetchData, 30000); return () => clearInterval(t); }, [demoMode]);

  const handleAck = async (id) => {
    setAcknowledging(id);
    if (demoMode) {
      const localData = JSON.parse(localStorage.getItem('ph_demo_monitoring') || JSON.stringify(MOCK_MONITORING));
      const idx = localData.alerts.findIndex(a => a.id === id);
      if (idx !== -1) {
        localData.alerts[idx].status = 'resolved';
        localData.summary.activeAlerts = Math.max(0, localData.summary.activeAlerts - 1);
        if (localData.alerts[idx].severity === 'critical') {
          localData.summary.criticalAlerts = Math.max(0, localData.summary.criticalAlerts - 1);
        }
      }
      localStorage.setItem('ph_demo_monitoring', JSON.stringify(localData));
      setData(localData);
      setAcknowledging(null);
      return;
    }

    try { await monitoringAPI.acknowledgeAlert(id); fetchData(); }
    catch {
      const localData = JSON.parse(localStorage.getItem('ph_demo_monitoring') || JSON.stringify(MOCK_MONITORING));
      const idx = localData.alerts.findIndex(a => a.id === id);
      if (idx !== -1) {
        localData.alerts[idx].status = 'resolved';
        localData.summary.activeAlerts = Math.max(0, localData.summary.activeAlerts - 1);
        if (localData.alerts[idx].severity === 'critical') {
          localData.summary.criticalAlerts = Math.max(0, localData.summary.criticalAlerts - 1);
        }
      }
      localStorage.setItem('ph_demo_monitoring', JSON.stringify(localData));
      setData(localData);
    } finally { setAcknowledging(null); }
  };

  if (loading) return <div className="min-h-96 flex items-center justify-center"><div className="w-10 h-10 border-4 border-primary-400 border-t-transparent rounded-full animate-spin" /></div>;

  const m = data?.metrics || {};
  const filteredAlerts = (data?.alerts || []).filter(a => {
    if (filterSeverity && a.severity !== filterSeverity) return false;
    if (filterStatus && a.status !== filterStatus) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="page-header flex items-center justify-between">
        <div>
          <h1 className="page-title">Monitoring & Alert Center</h1>
          <p className="page-subtitle">System health, performance metrics, and active alerts — Auto-refresh 30s</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-emerald-50 border border-emerald-200">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-semibold text-emerald-700">Live Monitoring</span>
          </div>
          <button onClick={fetchData} className="btn-secondary flex items-center gap-2 text-sm">
            <RefreshCw className="w-4 h-4" />Refresh
          </button>
        </div>
      </div>

      {/* Alert Summary */}
      <div className="grid grid-cols-2 gap-4">
        <div className="glass-card p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-red-100 flex items-center justify-center flex-shrink-0">
            <AlertTriangle className="w-6 h-6 text-red-500" />
          </div>
          <div>
            <p className="text-3xl font-bold font-display text-gray-900">{data?.summary?.activeAlerts || 0}</p>
            <p className="text-sm text-gray-500">Active Alerts</p>
          </div>
        </div>
        <div className="glass-card p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-red-100 flex items-center justify-center flex-shrink-0">
            <XCircle className="w-6 h-6 text-red-600" />
          </div>
          <div>
            <p className="text-3xl font-bold font-display text-red-600">{data?.summary?.criticalAlerts || 0}</p>
            <p className="text-sm text-gray-500">Critical Alerts</p>
          </div>
        </div>
      </div>

      {/* System Metrics */}
      <div>
        <h2 className="text-base font-bold text-gray-900 mb-4">System Resource Utilization</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricGauge label="CPU Usage"    value={m.cpuUsage}    color="#5b7df8" icon={Cpu}         description="Application server" />
          <MetricGauge label="Memory"       value={m.memUsage}    color="#8b5cf6" icon={MemoryStick} description="RAM utilization" />
          <MetricGauge label="Storage"      value={m.storageUsage} color="#10b981" icon={HardDrive}  description="Disk usage" />
          <MetricGauge label="Network In"   value={m.networkIn}   unit="MB/s" color="#f59e0b" icon={Network} description="Inbound traffic" />
        </div>
      </div>

      {/* Service Status */}
      <div>
        <h2 className="text-base font-bold text-gray-900 mb-4">Service Health</h2>
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
          {(data?.services || []).map(s => (
            <div key={s.name} className="glass-card p-4">
              <div className="flex items-center gap-2 mb-3">
                <span className={`w-2.5 h-2.5 rounded-full ${s.status === 'operational' ? 'bg-emerald-500' : 'bg-red-500'} animate-pulse`} />
                <p className="text-xs font-semibold text-gray-700 truncate">{s.name}</p>
              </div>
              <p className="text-xs text-gray-400">Uptime: <span className="font-semibold text-gray-700">{s.uptime}</span></p>
              <p className="text-xs text-gray-400">Latency: <span className="font-semibold text-gray-700">{s.latency}</span></p>
            </div>
          ))}
        </div>
      </div>

      {/* Alerts */}
      <div>
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <h2 className="text-base font-bold text-gray-900">Alerts</h2>
          <div className="flex gap-2">
            <select value={filterSeverity} onChange={e => setFilterSeverity(e.target.value)} className="select-field w-auto text-xs">
              <option value="">All Severity</option>
              {['critical','high','medium','low'].map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="select-field w-auto text-xs">
              <option value="">All Status</option>
              {['active','resolved','acknowledged'].map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>
        <div className="space-y-3">
          {filteredAlerts.length === 0 && (
            <div className="glass-card p-8 text-center text-gray-400">
              <CheckCircle className="w-8 h-8 mx-auto mb-2 text-emerald-400" />
              <p className="text-sm">No alerts match the current filter.</p>
            </div>
          )}
          {filteredAlerts.map(alert => {
            const cfg = SEVERITY_CONFIG[alert.severity] || SEVERITY_CONFIG.medium;
            return (
              <motion.div key={alert.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className={`p-4 rounded-xl ${cfg.class} flex items-start justify-between gap-4`}>
                <div className="flex items-start gap-3">
                  <div className={`w-8 h-8 rounded-lg ${cfg.bg} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                    <cfg.icon className={`w-4 h-4 ${cfg.color}`} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm font-semibold text-gray-900">{alert.title}</p>
                      <span className={`badge ${cfg.bg} ${cfg.color} text-[10px]`}>{alert.severity}</span>
                      {alert.region && <span className="badge bg-gray-100 text-gray-600 text-[10px]">{alert.region}</span>}
                    </div>
                    <p className="text-xs text-gray-600">{alert.message}</p>
                    <p className="text-[10px] text-gray-400 mt-1">{new Date(alert.created_at).toLocaleString()} • {alert.alert_type}</p>
                  </div>
                </div>
                {alert.status === 'active' && (
                  <button
                    onClick={() => handleAck(alert.id)}
                    disabled={acknowledging === alert.id}
                    className="flex-shrink-0 text-xs px-3 py-1.5 rounded-lg bg-white/60 border border-gray-200 text-gray-600 hover:bg-white font-medium transition-all"
                  >
                    {acknowledging === alert.id ? '...' : 'Resolve'}
                  </button>
                )}
                {alert.status !== 'active' && (
                  <span className={`flex-shrink-0 badge ${alert.status === 'resolved' ? 'badge-approved' : 'badge-review'}`}>{alert.status}</span>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
