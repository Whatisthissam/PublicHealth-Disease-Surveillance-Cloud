import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { TrendingUp, FileText, Plus, RefreshCw, Download } from 'lucide-react';
import { analyticsAPI } from '../services/api';

const COLORS = ['#5b7df8','#10b981','#f59e0b','#ef4444','#8b5cf6','#ec4899'];

const MOCK_ANALYTICS = {
  outbreakStats: { today: 42, last_7_days: 281, last_30_days: 1204 },
  trend: [
    { month: 'Jan', disease_name: 'Dengue', count: 120 }, { month: 'Jan', disease_name: 'Malaria', count: 90 }, { month: 'Jan', disease_name: 'COVID-19', count: 320 }, { month: 'Jan', disease_name: 'Tuberculosis', count: 80 }, { month: 'Jan', disease_name: 'Influenza', count: 150 }, { month: 'Jan', disease_name: 'Chikungunya', count: 45 },
    { month: 'Feb', disease_name: 'Dengue', count: 140 }, { month: 'Feb', disease_name: 'Malaria', count: 95 }, { month: 'Feb', disease_name: 'COVID-19', count: 280 }, { month: 'Feb', disease_name: 'Tuberculosis', count: 82 }, { month: 'Feb', disease_name: 'Influenza', count: 160 }, { month: 'Feb', disease_name: 'Chikungunya', count: 50 },
    { month: 'Mar', disease_name: 'Dengue', count: 180 }, { month: 'Mar', disease_name: 'Malaria', count: 110 }, { month: 'Mar', disease_name: 'COVID-19', count: 210 }, { month: 'Mar', disease_name: 'Tuberculosis', count: 85 }, { month: 'Mar', disease_name: 'Influenza', count: 140 }, { month: 'Mar', disease_name: 'Chikungunya', count: 55 },
    { month: 'Apr', disease_name: 'Dengue', count: 220 }, { month: 'Apr', disease_name: 'Malaria', count: 130 }, { month: 'Apr', disease_name: 'COVID-19', count: 150 }, { month: 'Apr', disease_name: 'Tuberculosis', count: 88 }, { month: 'Apr', disease_name: 'Influenza', count: 120 }, { month: 'Apr', disease_name: 'Chikungunya', count: 70 },
    { month: 'May', disease_name: 'Dengue', count: 310 }, { month: 'May', disease_name: 'Malaria', count: 180 }, { month: 'May', disease_name: 'COVID-19', count: 110 }, { month: 'May', disease_name: 'Tuberculosis', count: 90 }, { month: 'May', disease_name: 'Influenza', count: 95 }, { month: 'May', disease_name: 'Chikungunya', count: 90 },
    { month: 'Jun', disease_name: 'Dengue', count: 420 }, { month: 'Jun', disease_name: 'Malaria', count: 240 }, { month: 'Jun', disease_name: 'COVID-19', count: 95 }, { month: 'Jun', disease_name: 'Tuberculosis', count: 92 }, { month: 'Jun', disease_name: 'Influenza', count: 80 }, { month: 'Jun', disease_name: 'Chikungunya', count: 120 },
  ],
  byDisease: [
    { disease_name: 'Dengue', count: 1390 }, { disease_name: 'Malaria', count: 845 }, { disease_name: 'COVID-19', count: 1165 },
    { disease_name: 'Tuberculosis', count: 507 }, { disease_name: 'Influenza', count: 745 }, { disease_name: 'Chikungunya', count: 415 },
  ],
  byRegion: [
    { region: 'Mumbai', count: 1890 }, { region: 'Pune', count: 1420 }, { region: 'Nagpur', count: 910 },
    { region: 'Nashik', count: 810 }, { region: 'Thane', count: 1040 }, { region: 'Solapur', count: 680 },
  ]
};

const MOCK_REPORTS = [
  { id: 1, title: 'Q2 Disease Surveillance Report', description: 'Comprehensive analysis of disease trends across Maharashtra for Q2 2026.', created_at: '2026-06-15T00:00:00.000Z', created_by_name: 'Dr. Arjun Sharma' },
  { id: 2, title: 'Mumbai Dengue Outbreak Analysis', description: 'Investigative report on the micro-outbreak of dengue in Ward G-South, Mumbai.', created_at: '2026-06-10T00:00:00.000Z', created_by_name: 'Dr. Priya Mehta' },
  { id: 3, title: 'Malaria Seasonal Trend Forecast', description: 'Predictive modeling of malaria cases based on monsoon projection data.', created_at: '2026-06-05T00:00:00.000Z', created_by_name: 'Dr. Ravi Kulkarni' },
];

export default function AnalyticsPage() {
  const [data, setData] = useState(null);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [year, setYear] = useState(2024);
  const [tab, setTab] = useState('overview');

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      try {
        const [analyticsRes, reportsRes] = await Promise.all([
          analyticsAPI.getData({ year }),
          analyticsAPI.getReports({ limit: 30 }),
        ]);
        setData(analyticsRes.data.data);
        setReports(reportsRes.data.data);
      } catch (err) {
        console.error(err);
        setData(MOCK_ANALYTICS);
        setReports(MOCK_REPORTS);
      }
      finally { setLoading(false); }
    };
    fetchAll();
  }, [year]);

  const TABS = ['overview', 'disease', 'regional', 'reports'];

  if (loading) return <div className="min-h-96 flex items-center justify-center"><div className="w-10 h-10 border-4 border-primary-400 border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="space-y-6">
      <div className="page-header flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="page-title">Reporting & Analytics</h1>
          <p className="page-subtitle">Disease trends, outbreak statistics, and regional performance analysis</p>
        </div>
        <div className="flex items-center gap-3">
          <select value={year} onChange={e => setYear(Number(e.target.value))} className="select-field w-auto">
            {[2024,2023,2022].map(y => <option key={y} value={y}>{y}</option>)}
          </select>
        </div>
      </div>

      {/* Outbreak Summary Cards */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Cases Today', value: data?.outbreakStats?.today || 0, color: '#5b7df8' },
          { label: 'Last 7 Days', value: data?.outbreakStats?.last_7_days || 0, color: '#f59e0b' },
          { label: 'Last 30 Days', value: data?.outbreakStats?.last_30_days || 0, color: '#ef4444' },
        ].map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="glass-card p-5">
            <p className="text-3xl font-bold font-display text-gray-900">{s.value}</p>
            <p className="text-sm text-gray-500 mt-1">{s.label}</p>
            <div className="mt-3 h-1.5 rounded-full bg-gray-100 overflow-hidden">
              <div className="h-full rounded-full" style={{ width: `${Math.min((s.value / 10) * 100, 100)}%`, background: s.color }} />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Tab navigation */}
      <div className="flex gap-2 border-b border-gray-200/60">
        {TABS.map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-2.5 text-sm font-semibold capitalize transition-all border-b-2 ${tab === t ? 'text-primary-600 border-primary-500' : 'text-gray-500 border-transparent hover:text-gray-700'}`}>
            {t}
          </button>
        ))}
      </div>

      {tab === 'overview' && (
        <div className="space-y-6">
          {/* Disease Trend Line Chart */}
          <div className="glass-card p-6">
            <h3 className="text-base font-bold text-gray-900 mb-5">Monthly Trend by Disease ({year})</h3>
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={(() => {
                const months = [...new Set((data?.trend || []).map(t => t.month))].sort();
                return months.map(month => {
                  const entry = { month };
                  (data?.trend || []).filter(t => t.month === month).forEach(t => { entry[t.disease_name] = t.count; });
                  return entry;
                });
              })()}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip contentStyle={{ borderRadius: 12, border: 'none' }} />
                <Legend />
                {['Dengue','Malaria','COVID-19','Tuberculosis','Influenza','Chikungunya'].map((d, i) => (
                  <Area key={d} type="monotone" dataKey={d} stroke={COLORS[i]} fill={`${COLORS[i]}18`} strokeWidth={2} />
                ))}
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Status & Severity */}
          <div className="grid grid-cols-2 gap-6">
            <div className="glass-card p-6">
              <h3 className="text-base font-bold text-gray-900 mb-5">Cases by Status</h3>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={data?.byStatus || []} dataKey="count" nameKey="status" cx="50%" cy="50%" outerRadius={80} label={({ name, value }) => `${name}: ${value}`}>
                    {(data?.byStatus || []).map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="glass-card p-6">
              <h3 className="text-base font-bold text-gray-900 mb-5">Cases by Severity</h3>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={data?.bySeverity || []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="severity" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip contentStyle={{ borderRadius: 12, border: 'none' }} />
                  <Bar dataKey="count" fill="#5b7df8" radius={[4,4,0,0]}>
                    {(data?.bySeverity || []).map((entry, i) => (
                      <Cell key={i} fill={['#10b981','#f59e0b','#f97316','#ef4444'][i] || '#5b7df8'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {tab === 'disease' && (
        <div className="glass-card p-6">
          <h3 className="text-base font-bold text-gray-900 mb-5">Disease-wise Breakdown</h3>
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr><th>Disease</th><th>Total</th><th>Active</th><th>Recovered</th><th>Deceased</th><th>Critical</th><th>Recovery Rate</th></tr>
              </thead>
              <tbody>
                {(data?.byDisease || []).map(d => (
                  <tr key={d.disease_name}>
                    <td className="font-semibold">{d.disease_name}</td>
                    <td className="font-bold text-primary-600">{d.total}</td>
                    <td className="text-red-600">{d.active}</td>
                    <td className="text-emerald-600">{d.recovered}</td>
                    <td className="text-gray-500">{d.deceased}</td>
                    <td className="text-orange-500">{d.critical}</td>
                    <td>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${d.total > 0 ? (d.recovered / d.total * 100) : 0}%` }} />
                        </div>
                        <span className="text-xs text-gray-600 w-10">{d.total > 0 ? Math.round(d.recovered / d.total * 100) : 0}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === 'regional' && (
        <div className="space-y-6">
          <div className="glass-card p-6">
            <h3 className="text-base font-bold text-gray-900 mb-5">Regional Performance</h3>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={data?.byRegion || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="region" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip contentStyle={{ borderRadius: 12, border: 'none' }} />
                <Legend />
                <Bar dataKey="total" fill="#5b7df8" radius={[4,4,0,0]} name="Total" />
                <Bar dataKey="active" fill="#ef4444" radius={[4,4,0,0]} name="Active" />
                <Bar dataKey="recovered" fill="#10b981" radius={[4,4,0,0]} name="Recovered" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="glass-card overflow-hidden">
            <div className="p-4 border-b border-gray-100"><h3 className="font-bold text-gray-900">Recovery Rates by Region</h3></div>
            <table className="data-table">
              <thead><tr><th>Region</th><th>Total Cases</th><th>Active</th><th>Recovered</th><th>Recovery Rate</th></tr></thead>
              <tbody>
                {(data?.byRegion || []).map(r => (
                  <tr key={r.region}>
                    <td className="font-semibold">{r.region}</td>
                    <td className="font-bold">{r.total}</td>
                    <td className="text-red-600">{r.active}</td>
                    <td className="text-emerald-600">{r.recovered}</td>
                    <td>
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${r.recovery_rate}%` }} />
                        </div>
                        <span className="text-sm font-semibold text-gray-700">{r.recovery_rate}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === 'reports' && (
        <div className="glass-card overflow-hidden">
          <div className="p-4 border-b border-gray-100 flex items-center justify-between">
            <h3 className="font-bold text-gray-900">Generated Reports</h3>
          </div>
          <table className="data-table">
            <thead><tr><th>Report ID</th><th>Title</th><th>Type</th><th>Period</th><th>Region</th><th>Status</th></tr></thead>
            <tbody>
              {reports.map(r => (
                <tr key={r.id}>
                  <td className="font-mono text-xs text-primary-600">{r.report_id}</td>
                  <td className="font-medium text-sm max-w-xs truncate">{r.title}</td>
                  <td><span className="badge bg-primary-100 text-primary-700">{r.report_type}</span></td>
                  <td className="text-xs text-gray-500">{r.period_start?.slice(0,10)} — {r.period_end?.slice(0,10)}</td>
                  <td>{r.region}</td>
                  <td>
                    <span className={`badge ${r.status === 'approved' ? 'badge-approved' : r.status === 'pending' ? 'badge-pending' : r.status === 'rejected' ? 'badge-rejected' : 'badge-review'}`}>{r.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
