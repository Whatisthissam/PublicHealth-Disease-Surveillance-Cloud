import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Area, AreaChart
} from 'recharts';
import {
  Users, Activity, TrendingUp, AlertTriangle,
  FileText, MapPin, CheckCircle, Clock, RefreshCw, ArrowUpRight
} from 'lucide-react';
import { dashboardAPI } from '../services/api';

const COLORS = ['#5b7df8','#10b981','#f59e0b','#ef4444','#8b5cf6','#ec4899','#14b8a6','#f97316'];

/* ─────────────────────────────────────────────────────────────
   3D TILT KPI CARD — follows mouse cursor with CSS perspective
───────────────────────────────────────────────────────────── */
const KPICard = ({ icon: Icon, label, value, color, change, delay }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.45 }}
      className="kpi-card"
      style={{ color }}
    >
      {/* Decorative corner accent */}
      <div className="kpi-corner-accent" style={{ background: `${color}12` }} />
      <div className="kpi-inner-glow" style={{ background: `radial-gradient(circle at 80% 20%, ${color}10 0%, transparent 60%)` }} />

      <div className="flex items-center justify-between mb-4 relative z-10">
        <div
          className="kpi-icon-box"
          style={{ background: `${color}18`, border: `1px solid ${color}22` }}
        >
          <Icon className="w-5 h-5" style={{ color }} />
        </div>
        {change !== undefined && (
          <span className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full ${change >= 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-500'}`}>
            <ArrowUpRight className={`w-3 h-3 ${change < 0 ? 'rotate-180' : ''}`} />
            {Math.abs(change)}%
          </span>
        )}
      </div>

      <p className="kpi-value relative z-10" style={{ transform: 'none' }}>{value?.toLocaleString() ?? '--'}</p>
      <p className="kpi-label relative z-10" style={{ transform: 'none' }}>{label}</p>

      {/* Depth bar at bottom */}
      <div className="kpi-depth-bar" style={{ background: `linear-gradient(90deg, ${color}40 0%, ${color}10 100%)` }} />
    </motion.div>
  );
};

function hexToRgb(hex) {
  const r = parseInt(hex.slice(1,3),16);
  const g = parseInt(hex.slice(3,5),16);
  const b = parseInt(hex.slice(5,7),16);
  return `${r},${g},${b}`;
}

const StatusDot = ({ status }) => {
  const colors = { operational: 'bg-emerald-500', degraded: 'bg-yellow-500', down: 'bg-red-500' };
  return <span className={`inline-block w-2 h-2 rounded-full ${colors[status] || 'bg-gray-400'} animate-pulse`} />;
};

const sphereIcons = {
  'Recovery Rate': CheckCircle,
  'Critical Rate': AlertTriangle,
  'System Uptime': Activity,
  'Avg Response': Clock,
  'Region Coverage': MapPin,
};

function SphereStat({ value, label, color }) {
  const Icon = sphereIcons[label] || Activity;
  return (
    <div className="kpi-circle-wrap">
      <div
        className="kpi-circle-badge"
        style={{
          borderColor: `${color}30`,
          background: `radial-gradient(circle at center, ${color}04 0%, ${color}0c 100%)`,
          boxShadow: `0 8px 20px -6px ${color}15, inset 0 0 12px ${color}08`
        }}
      >
        <div className="kpi-circle-inner">
          <div className="kpi-circle-icon-box" style={{ background: `${color}10` }}>
            <Icon className="w-5 h-5" style={{ color }} />
          </div>
          <span className="kpi-circle-value">{value}</span>
          <span className="kpi-circle-label">{label}</span>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   MOCK DATA
───────────────────────────────────────────────────────────── */
const MOCK_DATA = {
  kpis: {
    totalCases: 21781, activeCases: 2847, recoveredCases: 18394,
    criticalCases: 312, pendingReports: 47, totalRegions: 10,
    totalUsers: 38, pendingWorkflow: 23,
  },
  monthlyCases: [
    { month: 'Jan', total: 1820, recovered: 1540 }, { month: 'Feb', total: 2100, recovered: 1780 },
    { month: 'Mar', total: 1950, recovered: 1640 }, { month: 'Apr', total: 2340, recovered: 2010 },
    { month: 'May', total: 2680, recovered: 2250 }, { month: 'Jun', total: 3120, recovered: 2640 },
    { month: 'Jul', total: 2890, recovered: 2480 }, { month: 'Aug', total: 2560, recovered: 2190 },
  ],
  diseaseTrend: [
    { disease_name: 'Dengue', count: 6240 }, { disease_name: 'Malaria', count: 4810 },
    { disease_name: 'COVID-19', count: 3920 }, { disease_name: 'Tuberculosis', count: 2780 },
    { disease_name: 'Influenza', count: 2140 }, { disease_name: 'Chikungunya', count: 1891 },
  ],
  regionalStats: [
    { region: 'Mumbai',  active: 620, recovered: 4210, critical: 78 },
    { region: 'Pune',    active: 480, recovered: 3190, critical: 54 },
    { region: 'Nagpur',  active: 310, recovered: 2140, critical: 38 },
    { region: 'Nashik',  active: 290, recovered: 1890, critical: 29 },
    { region: 'Solapur', active: 220, recovered: 1480, critical: 22 },
    { region: 'Thane',   active: 340, recovered: 2240, critical: 41 },
  ],
  systemStatus: {
    database: 'operational', api_server: 'operational',
    file_storage: 'operational', email_service: 'operational', monitoring: 'operational',
  },
  recentCases: [
    { case_id: 'PH-2024-001892', disease_name: 'Dengue',        region: 'Mumbai',  status: 'active',    severity: 'moderate', date_reported: '2024-06-14' },
    { case_id: 'PH-2024-001891', disease_name: 'Malaria',       region: 'Pune',    status: 'recovered', severity: 'mild',     date_reported: '2024-06-14' },
    { case_id: 'PH-2024-001890', disease_name: 'COVID-19',      region: 'Nagpur',  status: 'critical',  severity: 'severe',   date_reported: '2024-06-13' },
    { case_id: 'PH-2024-001889', disease_name: 'Tuberculosis',  region: 'Nashik',  status: 'active',    severity: 'moderate', date_reported: '2024-06-13' },
    { case_id: 'PH-2024-001888', disease_name: 'Influenza',     region: 'Thane',   status: 'recovered', severity: 'mild',     date_reported: '2024-06-12' },
    { case_id: 'PH-2024-001887', disease_name: 'Chikungunya',   region: 'Solapur', status: 'active',    severity: 'mild',     date_reported: '2024-06-12' },
  ],
};

/* ─────────────────────────────────────────────────────────────
   MAIN DASHBOARD
───────────────────────────────────────────────────────────── */
export default function DashboardPage() {
  const [data, setData]         = useState(null);
  const [loading, setLoading]   = useState(true);
  const [lastUpdated, setLast]  = useState(new Date());
  const [usingMock, setMock]    = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await dashboardAPI.getStats();
      setData(res.data.data); setMock(false); setLast(new Date());
    } catch {
      setData(MOCK_DATA); setMock(true);
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  if (loading) return (
    <div className="space-y-6 animate-pulse">
      <div className="h-8 bg-gray-200 rounded-xl w-64" />
      <div className="grid grid-cols-4 gap-4">
        {[...Array(8)].map((_,i) => <div key={i} className="h-36 bg-white/60 rounded-2xl"/>)}
      </div>
    </div>
  );

  const kpis = data?.kpis || {};
  const kpiCards = [
    { icon: Activity,      label: 'Total Cases',      value: kpis.totalCases,     color: '#5b7df8', change: 12 },
    { icon: AlertTriangle, label: 'Active Cases',     value: kpis.activeCases,    color: '#ef4444', change: -3 },
    { icon: CheckCircle,   label: 'Recovered Cases',  value: kpis.recoveredCases, color: '#10b981', change: 8  },
    { icon: TrendingUp,    label: 'Critical Cases',   value: kpis.criticalCases,  color: '#f59e0b', change: -5 },
    { icon: FileText,      label: 'Pending Reports',  value: kpis.pendingReports, color: '#8b5cf6', change: 2  },
    { icon: MapPin,        label: 'Active Regions',   value: kpis.totalRegions,   color: '#14b8a6' },
    { icon: Users,         label: 'Total Users',      value: kpis.totalUsers,     color: '#ec4899' },
    { icon: Clock,         label: 'Pending Workflow', value: kpis.pendingWorkflow,color: '#f97316', change: 1  },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="page-header flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="page-title">Operational Dashboard</h1>
          <p className="page-subtitle">Real-time disease surveillance metrics — Maharashtra, India</p>
        </div>
        <div className="flex items-center gap-3">
          {usingMock && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-700 border border-amber-200">
              📊 Demo Data (Backend offline)
            </span>
          )}
          <button onClick={fetchData} className="btn-secondary flex items-center gap-2 text-sm">
            <RefreshCw className="w-4 h-4" />Refresh
          </button>
        </div>
      </div>

      {/* 3D TILT KPI Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {kpiCards.map((kpi, i) => <KPICard key={kpi.label} {...kpi} delay={i * 0.06} />)}
      </div>

      {/* 3D Sphere Stats banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="glass-card p-5"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wide">Key Performance Indicators</h3>
        </div>
        <div className="flex flex-wrap gap-6 justify-around py-3">
          {[
            { value: '87.4%',  label: 'Recovery Rate',    color: '#10b981' },
            { value: '1.43%',  label: 'Critical Rate',    color: '#ef4444' },
            { value: '94.2%',  label: 'System Uptime',    color: '#5b7df8' },
            { value: '2.1d',   label: 'Avg Response',     color: '#f59e0b' },
            { value: '100%',   label: 'Region Coverage',  color: '#8b5cf6' },
          ].map(s => <SphereStat key={s.label} {...s} />)}
        </div>
      </motion.div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Trend — Area chart */}
        <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.55 }} className="glass-card p-6">
          <h3 className="text-base font-bold text-gray-900 mb-5">Monthly Case Trend</h3>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={data?.monthlyCases || []}>
              <defs>
                <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#5b7df8" stopOpacity={0.25}/>
                  <stop offset="95%" stopColor="#5b7df8" stopOpacity={0.02}/>
                </linearGradient>
                <linearGradient id="colorRecov" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#10b981" stopOpacity={0.25}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.02}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0"/>
              <XAxis dataKey="month" tick={{ fontSize:11 }}/>
              <YAxis tick={{ fontSize:11 }}/>
              <Tooltip contentStyle={{ borderRadius:12, border:'none', boxShadow:'0 8px 24px rgba(0,0,0,0.10)' }}/>
              <Legend/>
              <Area type="monotone" dataKey="total"     stroke="#5b7df8" strokeWidth={2.5} fill="url(#colorTotal)" dot={{ r:4 }} name="Total Cases"/>
              <Area type="monotone" dataKey="recovered" stroke="#10b981" strokeWidth={2.5} fill="url(#colorRecov)" dot={{ r:4 }} name="Recovered"/>
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Disease Distribution */}
        <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.65 }} className="glass-card p-6">
          <h3 className="text-base font-bold text-gray-900 mb-5">Disease Distribution</h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={data?.diseaseTrend || []} dataKey="count" nameKey="disease_name"
                cx="50%" cy="50%" outerRadius={85} innerRadius={40}
                paddingAngle={3}
              >
                {(data?.diseaseTrend || []).map((_,i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]}/>
                ))}
              </Pie>
              <Tooltip contentStyle={{ borderRadius:12, border:'none' }}/>
              <Legend/>
            </PieChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Regional Stats + System Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.72 }} className="glass-card p-6 lg:col-span-2">
          <h3 className="text-base font-bold text-gray-900 mb-5">Regional Case Statistics</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={data?.regionalStats || []} barCategoryGap="30%">
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0"/>
              <XAxis dataKey="region" tick={{ fontSize:11 }}/>
              <YAxis tick={{ fontSize:11 }}/>
              <Tooltip contentStyle={{ borderRadius:12, border:'none' }}/>
              <Legend/>
              <Bar dataKey="active"    fill="#ef4444" radius={[6,6,0,0]} name="Active"/>
              <Bar dataKey="recovered" fill="#10b981" radius={[6,6,0,0]} name="Recovered"/>
              <Bar dataKey="critical"  fill="#f59e0b" radius={[6,6,0,0]} name="Critical"/>
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* System Status */}
        <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.78 }} className="glass-card p-6">
          <h3 className="text-base font-bold text-gray-900 mb-5">System Status</h3>
          <div className="space-y-3">
            {Object.entries(data?.systemStatus || {}).map(([svc, status]) => (
              <div key={svc} className="flex items-center justify-between p-3 rounded-xl bg-white/60 border border-white/80">
                <span className="text-sm font-medium text-gray-700 capitalize">{svc.replace(/_/g,' ')}</span>
                <div className="flex items-center gap-2">
                  <StatusDot status={status}/>
                  <span className="text-xs text-gray-500 capitalize">{status}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200">
            <p className="text-xs text-emerald-700 font-semibold">Updated: {lastUpdated.toLocaleTimeString()}</p>
          </div>
        </motion.div>
      </div>

      {/* Recent Cases */}
      <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.84 }} className="glass-card p-6">
        <h3 className="text-base font-bold text-gray-900 mb-5">Recent Cases</h3>
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Case ID</th><th>Disease</th><th>Region</th>
                <th>Status</th><th>Severity</th><th>Date Reported</th>
              </tr>
            </thead>
            <tbody>
              {(data?.recentCases || []).map(c => (
                <tr key={c.case_id}>
                  <td className="font-mono text-xs text-primary-600">{c.case_id}</td>
                  <td className="font-medium">{c.disease_name}</td>
                  <td className="text-gray-600">{c.region}</td>
                  <td><span className={`badge badge-${c.status}`}>{c.status}</span></td>
                  <td><span className={`badge badge-${c.severity}`}>{c.severity}</span></td>
                  <td className="text-gray-500">{c.date_reported}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
