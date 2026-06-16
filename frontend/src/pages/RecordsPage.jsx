import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Filter, Edit3, Trash2, Eye, X, Save, ChevronLeft, ChevronRight } from 'lucide-react';
import { casesAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const REGIONS = ['Mumbai','Pune','Nashik','Nagpur','Thane','Aurangabad','Kolhapur','Solapur','Satara','Jalgaon'];
const DISEASES = ['Dengue','Malaria','COVID-19','Tuberculosis','Influenza','Chikungunya'];
const STATUSES = ['active','recovered','deceased','quarantined'];
const SEVERITIES = ['mild','moderate','severe','critical'];

const EMPTY_FORM = { disease_name: '', patient_id: '', region: '', status: 'active', severity: 'mild', date_reported: '', description: '', age: '', gender: '' };

const MOCK_CASES = [
  { id: 1, case_id: 'PH-2026-001892', disease_name: 'Dengue', patient_id: 'PAT-88712', region: 'Mumbai', status: 'active', severity: 'moderate', date_reported: '2026-06-14T00:00:00.000Z', age: 34, gender: 'male', description: 'Patient presented with high fever, joint pain, and mild rash. Suspected dengue. Fluid resuscitation started.' },
  { id: 2, case_id: 'PH-2026-001891', disease_name: 'Malaria', patient_id: 'PAT-44129', region: 'Pune', status: 'recovered', severity: 'mild', date_reported: '2026-06-14T00:00:00.000Z', age: 28, gender: 'female', description: 'Confirmed P. vivax malaria. Completed course of chloroquine. Fully recovered with no complications.' },
  { id: 3, case_id: 'PH-2026-001890', disease_name: 'COVID-19', patient_id: 'PAT-33821', region: 'Nagpur', status: 'active', severity: 'critical', date_reported: '2026-06-13T00:00:00.000Z', age: 67, gender: 'male', description: 'Severe bilateral pneumonia, hypoxic respiratory failure. Admitted to ICU, placed on high-flow nasal oxygen.' },
  { id: 4, case_id: 'PH-2026-001889', disease_name: 'Tuberculosis', patient_id: 'PAT-99823', region: 'Nashik', status: 'active', severity: 'moderate', date_reported: '2026-06-13T00:00:00.000Z', age: 45, gender: 'female', description: 'Pulmonary tuberculosis, sputum smear positive. Started on HRZE daily regimen. Under direct observation (DOTS).' },
  { id: 5, case_id: 'PH-2026-001888', disease_name: 'Influenza', patient_id: 'PAT-11029', region: 'Thane', status: 'recovered', severity: 'mild', date_reported: '2026-06-12T00:00:00.000Z', age: 12, gender: 'female', description: 'Influenza-like illness. Prescribed oseltamivir and supportive care. Fully recovered.' },
  { id: 6, case_id: 'PH-2026-001887', disease_name: 'Chikungunya', patient_id: 'PAT-55610', region: 'Solapur', status: 'active', severity: 'mild', date_reported: '2026-06-12T00:00:00.000Z', age: 50, gender: 'other', description: 'Presents with severe joint swelling and headache. Symptomatic treatment provided.' },
  { id: 7, case_id: 'PH-2026-001886', disease_name: 'Dengue', patient_id: 'PAT-22345', region: 'Mumbai', status: 'recovered', severity: 'moderate', date_reported: '2026-06-11T00:00:00.000Z', age: 22, gender: 'female', description: 'Classic dengue fever. Discharged after platelet count stabilized.' },
  { id: 8, case_id: 'PH-2026-001885', disease_name: 'COVID-19', patient_id: 'PAT-90182', region: 'Pune', status: 'active', severity: 'severe', date_reported: '2026-06-11T00:00:00.000Z', age: 59, gender: 'male', description: 'Moderate-to-severe respiratory symptoms. Under isolation ward monitoring.' },
];

export default function RecordsPage() {
  const { hasRole, demoMode } = useAuth();
  const [cases, setCases] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, page: 1, limit: 15, pages: 1 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({ status: '', severity: '', region: '', disease: '' });
  const [modal, setModal] = useState({ open: false, mode: 'add', data: null });
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const fetchCases = useCallback(async (page = 1) => {
    setLoading(true);
    if (demoMode) {
      const localCases = JSON.parse(localStorage.getItem('ph_demo_cases') || JSON.stringify(MOCK_CASES));
      const filtered = localCases.filter(c => {
        const matchesSearch = !search || 
          c.case_id.toLowerCase().includes(search.toLowerCase()) ||
          c.patient_id.toLowerCase().includes(search.toLowerCase()) ||
          c.region.toLowerCase().includes(search.toLowerCase()) ||
          c.disease_name.toLowerCase().includes(search.toLowerCase());
        
        const matchesStatus = !filters.status || c.status === filters.status;
        const matchesSeverity = !filters.severity || c.severity === filters.severity;
        const matchesRegion = !filters.region || c.region === filters.region;
        const matchesDisease = !filters.disease || c.disease_name === filters.disease;

        return matchesSearch && matchesStatus && matchesSeverity && matchesRegion && matchesDisease;
      });
      setCases(filtered);
      setPagination({ total: filtered.length, page: 1, limit: 15, pages: 1 });
      setLoading(false);
      return;
    }

    try {
      const res = await casesAPI.getAll({ page, limit: 15, search, ...filters });
      setCases(res.data.data);
      setPagination(res.data.pagination);
    } catch {
      // Fallback
      const localCases = JSON.parse(localStorage.getItem('ph_demo_cases') || JSON.stringify(MOCK_CASES));
      const filtered = localCases.filter(c => {
        const matchesSearch = !search || 
          c.case_id.toLowerCase().includes(search.toLowerCase()) ||
          c.patient_id.toLowerCase().includes(search.toLowerCase()) ||
          c.region.toLowerCase().includes(search.toLowerCase()) ||
          c.disease_name.toLowerCase().includes(search.toLowerCase());
        
        const matchesStatus = !filters.status || c.status === filters.status;
        const matchesSeverity = !filters.severity || c.severity === filters.severity;
        const matchesRegion = !filters.region || c.region === filters.region;
        const matchesDisease = !filters.disease || c.disease_name === filters.disease;

        return matchesSearch && matchesStatus && matchesSeverity && matchesRegion && matchesDisease;
      });
      setCases(filtered);
      setPagination({ total: filtered.length, page: 1, limit: 15, pages: 1 });
    } finally { setLoading(false); }
  }, [search, filters, demoMode]);

  useEffect(() => { fetchCases(1); }, [fetchCases]);

  const openAdd = () => { setForm(EMPTY_FORM); setError(''); setModal({ open: true, mode: 'add', data: null }); };
  const openEdit = (c) => { setForm({ ...c, age: c.age || '', description: c.description || '' }); setError(''); setModal({ open: true, mode: 'edit', data: c }); };
  const closeModal = () => setModal({ open: false, mode: 'add', data: null });

  const handleSave = async (e) => {
    e.preventDefault(); setSaving(true); setError('');
    if (demoMode) {
      const localCases = JSON.parse(localStorage.getItem('ph_demo_cases') || JSON.stringify(MOCK_CASES));
      if (modal.mode === 'add') {
        const newCase = {
          ...form,
          id: Date.now(),
          case_id: `PH-2026-${Math.floor(100000 + Math.random() * 900000)}`,
        };
        localCases.unshift(newCase);
      } else {
        const idx = localCases.findIndex(c => c.id === modal.data.id);
        if (idx !== -1) localCases[idx] = { ...localCases[idx], ...form };
      }
      localStorage.setItem('ph_demo_cases', JSON.stringify(localCases));
      setSaving(false);
      closeModal();
      fetchCases(pagination.page);
      return;
    }

    try {
      if (modal.mode === 'add') await casesAPI.create(form);
      else await casesAPI.update(modal.data.id, form);
      closeModal(); fetchCases(pagination.page);
    } catch (err) { setError(err.response?.data?.message || 'Failed to save.'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (demoMode) {
      const localCases = JSON.parse(localStorage.getItem('ph_demo_cases') || JSON.stringify(MOCK_CASES));
      const updated = localCases.filter(c => c.id !== id);
      localStorage.setItem('ph_demo_cases', JSON.stringify(updated));
      setDeleteConfirm(null);
      fetchCases(pagination.page);
      return;
    }

    try { await casesAPI.delete(id); setDeleteConfirm(null); fetchCases(pagination.page); }
    catch { }
  };

  const statusBadge = (s) => {
    const map = { active: 'badge-active', recovered: 'badge-recovered', deceased: 'badge-deceased', quarantined: 'badge-pending' };
    return <span className={`badge ${map[s] || 'badge'}`}>{s}</span>;
  };
  const severityBadge = (s) => {
    const map = { mild: 'badge-mild', moderate: 'badge-moderate', severe: 'badge-severe', critical: 'badge-critical' };
    return <span className={`badge ${map[s] || 'badge'}`}>{s}</span>;
  };

  return (
    <div className="space-y-6">
      <div className="page-header flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="page-title">Disease Record Management</h1>
          <p className="page-subtitle">Manage and track all disease case records across regions</p>
        </div>
        {hasRole('admin','manager','staff') && (
          <button id="add-case-btn" onClick={openAdd} className="btn-primary flex items-center gap-2">
            <Plus className="w-4 h-4" /> Add Case
          </button>
        )}
      </div>

      {/* Search & Filters */}
      <div className="glass-card p-4 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search cases, patients, regions..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="input-field pl-9"
          />
        </div>
        <select value={filters.status} onChange={e => setFilters(f => ({ ...f, status: e.target.value }))} className="select-field w-auto min-w-32">
          <option value="">All Status</option>
          {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <select value={filters.severity} onChange={e => setFilters(f => ({ ...f, severity: e.target.value }))} className="select-field w-auto min-w-32">
          <option value="">All Severity</option>
          {SEVERITIES.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <select value={filters.region} onChange={e => setFilters(f => ({ ...f, region: e.target.value }))} className="select-field w-auto min-w-32">
          <option value="">All Regions</option>
          {REGIONS.map(r => <option key={r} value={r}>{r}</option>)}
        </select>
        <select value={filters.disease} onChange={e => setFilters(f => ({ ...f, disease: e.target.value }))} className="select-field w-auto min-w-32">
          <option value="">All Diseases</option>
          {DISEASES.map(d => <option key={d} value={d}>{d}</option>)}
        </select>
      </div>

      {/* Table */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
          <p className="text-sm text-gray-500 font-medium">{pagination.total} records found</p>
        </div>
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Case ID</th><th>Disease</th><th>Patient ID</th><th>Region</th>
                <th>Status</th><th>Severity</th><th>Reported</th><th>Age</th>
                {hasRole('admin','manager','staff') && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                [...Array(8)].map((_, i) => (
                  <tr key={i}><td colSpan={9}><div className="skeleton h-10 mx-4 my-1" /></td></tr>
                ))
              ) : cases.length === 0 ? (
                <tr><td colSpan={9} className="text-center py-12 text-gray-400">No cases found.</td></tr>
              ) : cases.map(c => (
                <tr key={c.id}>
                  <td className="font-mono text-xs text-primary-600 font-semibold">{c.case_id}</td>
                  <td className="font-medium">{c.disease_name}</td>
                  <td className="text-gray-600 text-xs">{c.patient_id}</td>
                  <td>{c.region}</td>
                  <td>{statusBadge(c.status)}</td>
                  <td>{severityBadge(c.severity)}</td>
                  <td className="text-gray-500 text-xs">{c.date_reported?.slice(0,10)}</td>
                  <td className="text-gray-500">{c.age || '—'}</td>
                  {hasRole('admin','manager','staff') && (
                    <td>
                      <div className="flex items-center gap-1">
                        <button onClick={() => openEdit(c)} className="p-1.5 rounded-lg hover:bg-primary-50 text-gray-400 hover:text-primary-600 transition-colors">
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        {hasRole('admin','manager') && (
                          <button onClick={() => setDeleteConfirm(c)} className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-4 border-t border-gray-100 flex items-center justify-between">
          <p className="text-sm text-gray-500">Page {pagination.page} of {pagination.pages}</p>
          <div className="flex gap-2">
            <button onClick={() => fetchCases(pagination.page - 1)} disabled={pagination.page <= 1} className="btn-secondary py-1.5 px-3 text-xs disabled:opacity-40">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button onClick={() => fetchCases(pagination.page + 1)} disabled={pagination.page >= pagination.pages} className="btn-secondary py-1.5 px-3 text-xs disabled:opacity-40">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </motion.div>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {modal.open && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="glass-card p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto custom-scroll"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold font-display text-gray-900">
                  {modal.mode === 'add' ? 'Add Disease Case' : 'Edit Disease Case'}
                </h3>
                <button onClick={closeModal} className="p-2 rounded-lg hover:bg-gray-100 text-gray-400"><X className="w-4 h-4" /></button>
              </div>

              <form onSubmit={handleSave} className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1.5 block">Disease Name *</label>
                  <select value={form.disease_name} onChange={e => setForm(f => ({ ...f, disease_name: e.target.value }))} className="select-field" required>
                    <option value="">Select Disease</option>
                    {DISEASES.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1.5 block">Patient ID *</label>
                  <input value={form.patient_id} onChange={e => setForm(f => ({ ...f, patient_id: e.target.value }))} placeholder="PAT-XXXXX" className="input-field" required />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1.5 block">Region *</label>
                  <select value={form.region} onChange={e => setForm(f => ({ ...f, region: e.target.value }))} className="select-field" required>
                    <option value="">Select Region</option>
                    {REGIONS.map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1.5 block">Date Reported *</label>
                  <input type="date" value={form.date_reported?.slice(0,10)} onChange={e => setForm(f => ({ ...f, date_reported: e.target.value }))} className="input-field" required />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1.5 block">Status</label>
                  <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))} className="select-field">
                    {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1.5 block">Severity</label>
                  <select value={form.severity} onChange={e => setForm(f => ({ ...f, severity: e.target.value }))} className="select-field">
                    {SEVERITIES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1.5 block">Age</label>
                  <input type="number" value={form.age} onChange={e => setForm(f => ({ ...f, age: e.target.value }))} placeholder="Age" className="input-field" min={0} max={120} />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1.5 block">Gender</label>
                  <select value={form.gender} onChange={e => setForm(f => ({ ...f, gender: e.target.value }))} className="select-field">
                    <option value="">Unknown</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="text-sm font-medium text-gray-700 mb-1.5 block">Description</label>
                  <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={3} className="input-field resize-none" placeholder="Clinical notes..." />
                </div>

                {error && <div className="col-span-2 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">{error}</div>}

                <div className="col-span-2 flex justify-end gap-3 pt-2">
                  <button type="button" onClick={closeModal} className="btn-secondary">Cancel</button>
                  <button type="submit" disabled={saving} className="btn-primary flex items-center gap-2">
                    {saving ? <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> : <Save className="w-4 h-4" />}
                    {modal.mode === 'add' ? 'Add Case' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirm */}
      <AnimatePresence>
        {deleteConfirm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className="glass-card p-6 w-full max-w-sm">
              <h3 className="text-lg font-bold text-gray-900 mb-2">Delete Case</h3>
              <p className="text-sm text-gray-600 mb-6">Are you sure you want to delete <span className="font-semibold text-primary-600">{deleteConfirm.case_id}</span>? This action cannot be undone.</p>
              <div className="flex gap-3">
                <button onClick={() => setDeleteConfirm(null)} className="btn-secondary flex-1">Cancel</button>
                <button onClick={() => handleDelete(deleteConfirm.id)} className="btn-danger flex-1">Delete</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
