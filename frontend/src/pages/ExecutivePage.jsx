import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { TrendingUp, TrendingDown, Users, MapPin, Activity, AlertTriangle, RefreshCw } from 'lucide-react';
import { executiveAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const COLORS = ['#5b7df8','#10b981','#f59e0b','#ef4444','#8b5cf6','#ec4899'];

const MOCK_EXECUTIVE = {
  totals: { totalCases: 21781, overallRecoveryRate: 84.4, criticalCases: 312, growthRate: 3.5 },
  resourceUtilization: { activeStaff: 12, activeRegions: 10, activeAlerts: 3, pendingTasks: 5, pendingReports: 4 },
  monthlyTrend: [
    { month_label: 'Jan 2026', cases: 1820, recovered: 1540 },
    { month_label: 'Feb 2026', cases: 2100, recovered: 1780 },
    { month_label: 'Mar 2026', cases: 1950, recovered: 1640 },
    { month_label: 'Apr 2026', cases: 2340, recovered: 2010 },
    { month_label: 'May 2026', cases: 2680, recovered: 2250 },
    { month_label: 'Jun 2026', cases: 3120, recovered: 2640 },
  ],
  topDiseases: [
    { disease_name: 'Dengue', count: 6240, percentage: 29 },
    { disease_name: 'Malaria', count: 4810, percentage: 22 },
    { disease_name: 'COVID-19', count: 3920, percentage: 18 },
    { disease_name: 'Tuberculosis', count: 2780, percentage: 13 },
    { disease_name: 'Influenza', count: 2140, percentage: 10 },
    { disease_name: 'Chikungunya', count: 1891, percentage: 8 },
  ],
  regionalPerformance: [
    { region: 'Mumbai', total: 4908, active: 620, recovered: 4210, critical: 78, recovery_rate: 85.7, last_case_date: '2026-06-14T00:00:00.000Z' },
    { region: 'Pune', total: 3724, active: 480, recovered: 3190, critical: 54, recovery_rate: 85.6, last_case_date: '2026-06-14T00:00:00.000Z' },
    { region: 'Nagpur', total: 2488, active: 310, recovered: 2140, critical: 38, recovery_rate: 86.0, last_case_date: '2026-06-13T00:00:00.000Z' },
    { region: 'Nashik', total: 2209, active: 290, recovered: 1890, critical: 29, recovery_rate: 85.5, last_case_date: '2026-06-13T00:00:00.000Z' },
    { region: 'Thane', total: 2621, active: 340, recovered: 2240, critical: 41, recovery_rate: 85.4, last_case_date: '2026-06-12T00:00:00.000Z' },
  ],
  riskLevel: 'medium'
};

const MetricCard = ({ label, value, sub, color, icon: Icon, trend }) => (
  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-5">
    <div className="flex items-start justify-between mb-3">
      <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${color}18` }}>
        <Icon className="w-5 h-5" style={{ color }} />
      </div>
      {trend !== undefined && (
        <span className={`flex items-center gap-1 text-xs font-bold ${trend >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
          {trend >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
          {Math.abs(trend)}%
        </span>
      )}
    </div>
    <p className="text-3xl font-bold font-display text-gray-900">{value}</p>
    <p className="text-sm font-medium text-gray-700 mt-1">{label}</p>
    {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
  </motion.div>
);

const RiskBadge = ({ level }) => {
  const map = { low: 'bg-emerald-100 text-emerald-700', medium: 'bg-yellow-100 text-yellow-700', high: 'bg-red-100 text-red-700' };
  return <span className={`badge ${map[level] || map.medium} text-sm px-3 py-1`}>Risk Level: {level?.toUpperCase()}</span>;
};

export default function ExecutivePage() {
  const { demoMode } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (demoMode) {
      setData(MOCK_EXECUTIVE);
      setLoading(false);
      return;
    }
    executiveAPI.getSummary()
      .then(res => setData(res.data.data))
      .catch((err) => {
        console.error(err);
        setData(MOCK_EXECUTIVE);
      })
      .finally(() => setLoading(false));
  }, [demoMode]);

  if (loading) return <div className="min-h-96 flex items-center justify-center"><div className="w-10 h-10 border-4 border-primary-400 border-t-transparent rounded-full animate-spin" /></div>;

  const t = data?.totals || {};
  const res = data?.resourceUtilization || {};

  return (
    <div className="space-y-6">
      <div className="page-header flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="page-title">Executive Reporting Portal</h1>
          <p className="page-subtitle">High-level summaries, performance metrics, and strategic insights</p>
        </div>
        <div className="flex items-center gap-3">
          <RiskBadge level={data?.riskLevel} />
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard icon={Activity}      label="Total Cases YTD"    value={t.totalCases || 0}         color="#5b7df8" />
        <MetricCard icon={TrendingUp}    label="Recovery Rate"      value={`${t.overallRecoveryRate || 0}%`} color="#10b981" trend={parseFloat(t.growthRate || 0)} />
        <MetricCard icon={AlertTriangle} label="Critical Cases"     value={t.criticalCases || 0}       color="#f59e0b" />
        <MetricCard icon={Users}         label="Active Staff"       value={res.activeStaff || 0}       color="#8b5cf6" />
      </div>

      {/* Resource Utilization */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6">
        <h3 className="text-base font-bold text-gray-900 mb-5">Resource Utilization</h3>
        <div className="grid grid-cols-5 gap-4">
          {[
            { label: 'Active Staff',      value: res.activeStaff,      total: 20,  color: '#5b7df8' },
            { label: 'Active Regions',    value: res.activeRegions,    total: 14,  color: '#10b981' },
            { label: 'Active Alerts',     value: res.activeAlerts,     total: 20,  color: '#ef4444' },
            { label: 'Pending Tasks',     value: res.pendingTasks,     total: 25,  color: '#f59e0b' },
            { label: 'Pending Reports',   value: res.pendingReports,   total: 30,  color: '#8b5cf6' },
          ].map(item => (
            <div key={item.label} className="text-center">
              <div className="relative w-16 h-16 mx-auto mb-2">
                <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                  <circle cx="18" cy="18" r="15.9" fill="none" stroke="#f0f0f0" strokeWidth="3" />
                  <circle cx="18" cy="18" r="15.9" fill="none" stroke={item.color} strokeWidth="3"
                    strokeDasharray={`${(item.value / item.total) * 100} 100`} strokeLinecap="round" />
                </svg>
                <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-gray-900">
                  {item.value}
                </span>
              </div>
              <p className="text-xs text-gray-500 text-center leading-tight">{item.label}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Monthly Trend + Disease Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card p-6">
          <h3 className="text-base font-bold text-gray-900 mb-5">12-Month Case Trend</h3>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={data?.monthlyTrend || []}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month_label" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip contentStyle={{ borderRadius: 12, border: 'none' }} />
              <Legend />
              <Line type="monotone" dataKey="cases" stroke="#5b7df8" strokeWidth={2.5} dot={{ r: 3 }} name="Cases" />
              <Line type="monotone" dataKey="recovered" stroke="#10b981" strokeWidth={2.5} dot={{ r: 3 }} name="Recovered" />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card p-6">
          <h3 className="text-base font-bold text-gray-900 mb-5">Disease Burden</h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={data?.topDiseases || []} dataKey="count" nameKey="disease_name" cx="50%" cy="50%" innerRadius={50} outerRadius={80}
                label={({ name, percentage }) => `${name}: ${percentage}%`} labelLine={false}>
                {(data?.topDiseases || []).map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip formatter={(v, n, p) => [`${v} cases`, p.payload.disease_name]} contentStyle={{ borderRadius: 12, border: 'none' }} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Regional Performance Table */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="glass-card overflow-hidden">
        <div className="p-5 border-b border-gray-100">
          <h3 className="font-bold text-gray-900">Regional Performance Analysis</h3>
        </div>
        <table className="data-table">
          <thead><tr><th>Region</th><th>Total Cases</th><th>Active</th><th>Recovered</th><th>Critical</th><th>Recovery Rate</th><th>Last Case</th></tr></thead>
          <tbody>
            {(data?.regionalPerformance || []).map(r => (
              <tr key={r.region}>
                <td className="font-semibold">{r.region}</td>
                <td className="font-bold text-primary-600">{r.total}</td>
                <td className="text-red-600">{r.active}</td>
                <td className="text-emerald-600">{r.recovered}</td>
                <td className="text-orange-500">{r.critical}</td>
                <td>
                  <div className="flex items-center gap-2">
                    <div className="w-20 h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full rounded-full bg-emerald-500" style={{ width: `${r.recovery_rate}%` }} />
                    </div>
                    <span className={`text-xs font-bold ${r.recovery_rate >= 70 ? 'text-emerald-600' : 'text-orange-500'}`}>{r.recovery_rate}%</span>
                  </div>
                </td>
                <td className="text-xs text-gray-400">{r.last_case_date?.slice(0,10) || '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </motion.div>
    </div>
  );
}
