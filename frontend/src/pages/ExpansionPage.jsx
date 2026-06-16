import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin, CheckCircle, Clock, TrendingUp, Building2, Users, Hospital } from 'lucide-react';
import { regionsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const REGION_COORDS = {
  Mumbai:     { x: 8,  y: 65, cases_label: 'High Density' },
  Pune:       { x: 15, y: 72, cases_label: 'Moderate' },
  Nashik:     { x: 15, y: 50, cases_label: 'Moderate' },
  Nagpur:     { x: 65, y: 45, cases_label: 'Moderate' },
  Thane:      { x: 10, y: 60, cases_label: 'High' },
  Aurangabad: { x: 30, y: 58, cases_label: 'Moderate' },
  Kolhapur:   { x: 12, y: 82, cases_label: 'Low' },
  Solapur:    { x: 32, y: 72, cases_label: 'Low' },
  Satara:     { x: 14, y: 77, cases_label: 'Low' },
  Jalgaon:    { x: 28, y: 38, cases_label: 'Low' },
  Delhi:      { x: 45, y: 15, cases_label: 'Planned' },
  Bangalore:  { x: 30, y: 88, cases_label: 'Planned' },
  Hyderabad:  { x: 45, y: 72, cases_label: 'Planned' },
  Chennai:    { x: 50, y: 85, cases_label: 'Planned' },
};

const EXPANSION_PHASES = [
  {
    phase: 'Phase 1 (Current)',
    color: '#10b981',
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
    regions: ['Mumbai','Pune','Nashik','Nagpur','Thane','Aurangabad','Kolhapur','Solapur','Satara','Jalgaon'],
    timeline: 'Q1 2024 - Active',
    desc: '10 regions in Maharashtra fully operational with real-time surveillance'
  },
  {
    phase: 'Phase 2 (Planned)',
    color: '#5b7df8',
    bg: 'bg-primary-50',
    border: 'border-primary-200',
    regions: ['Delhi','Bangalore'],
    timeline: 'Q3 2025 - Planned',
    desc: 'National capital and Silicon Valley of India — awaiting budget approval'
  },
  {
    phase: 'Phase 3 (Future)',
    color: '#8b5cf6',
    bg: 'bg-purple-50',
    border: 'border-purple-200',
    regions: ['Hyderabad','Chennai'],
    timeline: 'Q1 2026 - Roadmap',
    desc: 'South India pharma hub and medical tourism capital expansion'
  },
];

const MOCK_REGIONS_DATA = {
  summary: { activeRegions: 10, plannedExpansions: 4, totalPopulationCovered: 112000000, totalRegions: 14 },
  regions: [
    { id: 1, name: 'Mumbai', state: 'Maharashtra', is_current: true, population: 21000000, hospitals: 142, health_centers: 380, total_cases: 4908, recovered_cases: 4210, description: 'Capital city with dense urban population. Real-time surveillance fully integrated since Q1 2024.' },
    { id: 2, name: 'Pune', state: 'Maharashtra', is_current: true, population: 7400000, hospitals: 89, health_centers: 210, total_cases: 3724, recovered_cases: 3190, description: 'Educational and IT hub. High surveillance coverage across municipal limits.' },
    { id: 3, name: 'Nagpur', state: 'Maharashtra', is_current: true, population: 2900000, hospitals: 45, health_centers: 120, total_cases: 2488, recovered_cases: 2140, description: 'Central India medical hub. Covers surrounding rural blocks.' },
    { id: 4, name: 'Nashik', state: 'Maharashtra', is_current: true, population: 2200000, hospitals: 34, health_centers: 95, total_cases: 2209, recovered_cases: 1890, description: 'Surveillance covers wine industry labor colonies and agricultural sectors.' },
    { id: 5, name: 'Thane', state: 'Maharashtra', is_current: true, population: 11000000, hospitals: 72, health_centers: 190, total_cases: 2621, recovered_cases: 2240, description: 'Industrial belt adjoining Mumbai. High active case rates.' },
    { id: 6, name: 'Aurangabad', state: 'Maharashtra', is_current: true, population: 1800000, hospitals: 28, health_centers: 74, total_cases: 1420, recovered_cases: 1210, description: 'Tourism and industrial city. Serves Marathwada region.' },
    { id: 7, name: 'Kolhapur', state: 'Maharashtra', is_current: true, population: 3900000, hospitals: 32, health_centers: 85, total_cases: 1120, recovered_cases: 980, description: 'South Maharashtra hub. Focused surveillance on sugarcane workers.' },
    { id: 8, name: 'Solapur', state: 'Maharashtra', is_current: true, population: 4300000, hospitals: 30, health_centers: 80, total_cases: 980, recovered_cases: 850, description: 'Textile hub. Bordering Karnataka state.' },
    { id: 9, name: 'Satara', state: 'Maharashtra', is_current: true, population: 3000000, hospitals: 25, health_centers: 68, total_cases: 810, recovered_cases: 710, description: 'Hilly terrain. Focused surveillance on malaria and seasonal fevers.' },
    { id: 10, name: 'Jalgaon', state: 'Maharashtra', is_current: true, population: 4200000, hospitals: 28, health_centers: 75, total_cases: 790, recovered_cases: 690, description: 'North Maharashtra agricultural center. Severe summer heat related case tracking.' },
    { id: 11, name: 'Delhi', state: 'Delhi NCR', is_current: false, population: 33000000, hospitals: 210, health_centers: 540, total_cases: 0, recovered_cases: 0, description: 'Planned expansion for Q3 2025. Federal capital territory integration.' },
    { id: 12, name: 'Bangalore', state: 'Karnataka', is_current: false, population: 14000000, hospitals: 110, health_centers: 280, total_cases: 0, recovered_cases: 0, description: 'Planned expansion for Q3 2025. IT hub integration.' },
    { id: 13, name: 'Hyderabad', state: 'Telangana', is_current: false, population: 10500000, hospitals: 95, health_centers: 240, total_cases: 0, recovered_cases: 0, description: 'Roadmap phase expansion planned for Q1 2026.' },
    { id: 14, name: 'Chennai', state: 'Tamil Nadu', is_current: false, population: 11900000, hospitals: 102, health_centers: 260, total_cases: 0, recovered_cases: 0, description: 'Roadmap phase expansion planned for Q1 2026.' },
  ]
};

export default function ExpansionPage() {
  const { demoMode } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    if (demoMode) {
      setData(MOCK_REGIONS_DATA);
      setLoading(false);
      return;
    }
    regionsAPI.getAll()
      .then(res => setData(res.data.data))
      .catch((err) => {
        console.error(err);
        setData(MOCK_REGIONS_DATA);
      })
      .finally(() => setLoading(false));
  }, [demoMode]);

  if (loading) return <div className="min-h-96 flex items-center justify-center"><div className="w-10 h-10 border-4 border-primary-400 border-t-transparent rounded-full animate-spin" /></div>;

  const allRegions = data?.regions || [];
  const current = data?.currentRegions || [];
  const planned = data?.expansionPlan || [];
  const summary = data?.summary || {};

  const selRegion = allRegions.find(r => r.name === selected);

  return (
    <div className="space-y-6">
      <div className="page-header">
        <h1 className="page-title">Expansion Management</h1>
        <p className="page-subtitle">Regional scalability planning — current coverage and future growth roadmap</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { icon: MapPin,   label: 'Active Regions',     value: summary.activeRegions,      color: '#10b981' },
          { icon: Clock,    label: 'Planned Expansions',  value: summary.plannedExpansions,  color: '#5b7df8' },
          { icon: Users,    label: 'Population Covered',  value: summary.totalPopulationCovered ? `${(summary.totalPopulationCovered / 1e6).toFixed(1)}M` : '--', color: '#8b5cf6' },
          { icon: Building2,label: 'Total Regions',       value: summary.totalRegions,       color: '#f59e0b' },
        ].map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="glass-card p-5">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{ background: `${s.color}18` }}>
              <s.icon className="w-5 h-5" style={{ color: s.color }} />
            </div>
            <p className="text-3xl font-bold font-display text-gray-900">{s.value}</p>
            <p className="text-sm text-gray-500 mt-1">{s.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Map + Expansion Plan */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Visual Map */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6 lg:col-span-2">
          <h3 className="text-base font-bold text-gray-900 mb-4">Geographic Coverage Map</h3>
          <div className="relative bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl overflow-hidden border border-primary-100" style={{ height: 360 }}>
            {/* Decorative grid */}
            <div className="absolute inset-0 opacity-20">
              {[...Array(12)].map((_, i) => <div key={i} className="absolute border-b border-primary-200" style={{ top: `${i * 8.33}%`, left: 0, right: 0 }} />)}
              {[...Array(12)].map((_, i) => <div key={i} className="absolute border-r border-primary-200" style={{ left: `${i * 8.33}%`, top: 0, bottom: 0 }} />)}
            </div>
            {/* India outline hint */}
            <div className="absolute inset-4 border-2 border-primary-200/50 rounded-3xl opacity-30" />

            <p className="absolute top-3 left-3 text-xs font-semibold text-primary-500 z-10">India — Disease Surveillance Network</p>

            {/* Region dots */}
            {allRegions.map(region => {
              const pos = REGION_COORDS[region.name];
              if (!pos) return null;
              const isCurrent = !!region.is_current;
              const isSelected = selected === region.name;
              return (
                <motion.button
                  key={region.name}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  whileHover={{ scale: 1.3 }}
                  onClick={() => setSelected(region.name === selected ? null : region.name)}
                  className="absolute z-10 flex flex-col items-center"
                  style={{ left: `${pos.x}%`, top: `${pos.y}%`, transform: 'translate(-50%, -50%)' }}
                >
                  <div className={`w-4 h-4 rounded-full border-2 border-white shadow-lg transition-all ${
                    isCurrent ? 'bg-emerald-500' : 'bg-primary-400'
                  } ${isSelected ? 'ring-2 ring-offset-1 ring-primary-400 scale-125' : ''}`} />
                  {isCurrent && <span className="absolute -top-0.5 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-emerald-400 opacity-60 animate-ping" />}
                  <span className={`text-[9px] font-bold mt-1 whitespace-nowrap ${isCurrent ? 'text-emerald-700' : 'text-primary-600'}`}>{region.name}</span>
                </motion.button>
              );
            })}

            {/* Legend */}
            <div className="absolute bottom-3 right-3 flex flex-col gap-1.5 bg-white/80 p-2.5 rounded-xl border border-white/80 text-xs">
              <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-emerald-500" />Active Region</div>
              <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-primary-400" />Planned Region</div>
            </div>
          </div>

          {/* Selected region details */}
          {selRegion && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-4 p-4 rounded-xl bg-primary-50 border border-primary-200">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-bold text-gray-900">{selRegion.name}</h4>
                <span className={`badge ${selRegion.is_current ? 'badge-approved' : 'badge-pending'}`}>{selRegion.is_current ? 'Active' : 'Planned'}</span>
              </div>
              <div className="grid grid-cols-3 gap-3 text-center">
                <div><p className="text-lg font-bold text-primary-600">{selRegion.total_cases || 0}</p><p className="text-xs text-gray-500">Total Cases</p></div>
                <div><p className="text-lg font-bold text-emerald-600">{selRegion.recovered_cases || 0}</p><p className="text-xs text-gray-500">Recovered</p></div>
                <div><p className="text-lg font-bold text-gray-600">{selRegion.hospitals || 0}</p><p className="text-xs text-gray-500">Hospitals</p></div>
              </div>
              {selRegion.description && <p className="text-xs text-gray-500 mt-2">{selRegion.description}</p>}
            </motion.div>
          )}
        </motion.div>

        {/* Expansion Phases */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="space-y-4">
          <h3 className="text-base font-bold text-gray-900">Expansion Roadmap</h3>
          {EXPANSION_PHASES.map((phase, i) => (
            <div key={phase.phase} className={`glass-card p-4 border ${phase.border}`}>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-3 h-3 rounded-full" style={{ background: phase.color }} />
                <span className="text-sm font-bold text-gray-900">{phase.phase}</span>
              </div>
              <p className="text-xs text-gray-500 mb-3">{phase.desc}</p>
              <div className="flex flex-wrap gap-1.5 mb-3">
                {phase.regions.map(r => (
                  <span key={r} className={`text-xs px-2 py-1 rounded-full ${phase.bg} border ${phase.border} font-medium`} style={{ color: phase.color }}>{r}</span>
                ))}
              </div>
              <div className="flex items-center gap-2 text-xs">
                <Clock className="w-3.5 h-3.5" style={{ color: phase.color }} />
                <span style={{ color: phase.color }} className="font-semibold">{phase.timeline}</span>
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Regions Table */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card overflow-hidden">
        <div className="p-5 border-b border-gray-100">
          <h3 className="font-bold text-gray-900">All Regions</h3>
        </div>
        <table className="data-table">
          <thead><tr><th>Region</th><th>State</th><th>Status</th><th>Population</th><th>Hospitals</th><th>Health Centers</th><th>Total Cases</th><th>Recovered</th></tr></thead>
          <tbody>
            {allRegions.map(r => (
              <tr key={r.id}>
                <td className="font-semibold flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${r.is_current ? 'bg-emerald-500' : 'bg-primary-400'}`} />
                  {r.name}
                </td>
                <td className="text-gray-600">{r.state}</td>
                <td><span className={`badge ${r.is_current ? 'badge-approved' : 'badge-pending'}`}>{r.is_current ? 'Active' : 'Planned'}</span></td>
                <td className="text-gray-600">{r.population ? `${(r.population / 1e6).toFixed(2)}M` : '—'}</td>
                <td className="text-gray-600">{r.hospitals || '—'}</td>
                <td className="text-gray-600">{r.health_centers || '—'}</td>
                <td className="font-bold text-primary-600">{r.total_cases || 0}</td>
                <td className="text-emerald-600">{r.recovered_cases || 0}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </motion.div>
    </div>
  );
}
