import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HeartPulse, Eye, EyeOff, Lock, User, Shield, Activity,
  Globe, Wifi, WifiOff, AlertCircle, Mail, Phone, MapPin, Briefcase, ArrowRight
} from 'lucide-react';
import { authAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const REGIONS = ['Mumbai', 'Pune', 'Nashik', 'Nagpur', 'Thane', 'Aurangabad', 'Kolhapur', 'Solapur', 'Satara', 'Jalgaon'];
const DEPARTMENTS = ['Administration', 'Epidemiology', 'Field Operations', 'Data Entry', 'Data Analytics', 'IT Infrastructure'];

export default function RegisterPage() {
  const { demoMode } = useAuth();
  const navigate = useNavigate();
  const cardRef = useRef(null);

  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    full_name: '',
    phone: '',
    region: '',
    department: ''
  });

  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isDemo, setIsDemo] = useState(demoMode);

  // Detect server status to auto-switch demo banner
  useEffect(() => {
    fetch('/api/health')
      .then(res => {
        if (!res.ok) setIsDemo(true);
      })
      .catch(() => {
        setIsDemo(true);
      });
  }, []);

  // 3D tilt on mouse move
  const handleCardMouseMove = useCallback((e) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const rotX = ((y / rect.height) - 0.5) * -8;
    const rotY = ((x / rect.width)  - 0.5) *  8;
    card.style.transform = `perspective(900px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateZ(4px)`;
  }, []);

  const handleCardMouseLeave = useCallback(() => {
    const card = cardRef.current;
    if (!card) return;
    card.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg) translateZ(0)';
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    if (isDemo) {
      // Offline local storage registration
      setTimeout(() => {
        try {
          const localUsers = JSON.parse(localStorage.getItem('ph_demo_users') || '[]');
          const exists = localUsers.some(
            u => u.username.toLowerCase() === form.username.toLowerCase() ||
                 u.email.toLowerCase() === form.email.toLowerCase()
          );

          if (exists) {
            setError('Username or email already registered.');
            setLoading(false);
            return;
          }

          const newUser = {
            id: Date.now(),
            username: form.username,
            email: form.email,
            password: form.password, // Plain text saved only in demo localStorage mock
            full_name: form.full_name,
            phone: form.phone,
            region: form.region,
            department: form.department,
            role: 'staff',
            is_active: 1,
            created_at: new Date().toISOString()
          };

          localUsers.push(newUser);
          localStorage.setItem('ph_demo_users', JSON.stringify(localUsers));
          
          setSuccess('Account created successfully in Demo Mode! Redirecting to login...');
          setLoading(false);
          setTimeout(() => {
            navigate('/login');
          }, 2000);
        } catch {
          setError('Failed to save demo registration.');
          setLoading(false);
        }
      }, 800);
      return;
    }

    try {
      await authAPI.register(form);
      setSuccess('Registration successful! Redirecting to login page...');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to complete registration.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      {/* ── Soft ambient orbs ── */}
      <div className="login-orb login-orb-1" />
      <div className="login-orb login-orb-2" />
      <div className="login-orb login-orb-3" />

      <div className="login-container">
        {/* ══════════ LEFT PANEL ══════════ */}
        <motion.div
          initial={{ opacity: 0, x: -56 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
          className="login-left"
        >
          {/* Backdrop Wave */}
          <div className="login-left-wave-bg">
            <svg viewBox="0 0 120 100" preserveAspectRatio="none" style={{ width: '100%', height: '100%' }}>
              <defs>
                <linearGradient id="left-grad-reg" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#1E7F84" />
                  <stop offset="50%" stopColor="#1E7F84" />
                  <stop offset="100%" stopColor="#4B999D" />
                </linearGradient>
              </defs>
              <path d="M0,0 L100,0 C112,25 118,50 106,75 C98,90 92,95 100,100 L0,100 Z" fill="url(#left-grad-reg)" />
            </svg>
          </div>

          {/* Dot grids */}
          <div className="login-dot-grid login-dot-grid-top" />
          <div className="login-dot-grid login-dot-grid-bottom" />

          {/* Maharashtra Map Outline */}
          <svg className="login-map-outline" viewBox="0 0 200 200" fill="none">
            <path
              d="M 30,80 C 40,65 55,60 70,55 C 85,50 95,40 110,45 C 125,50 135,35 150,40 C 165,45 170,60 175,75 C 180,90 190,105 180,120 C 170,135 155,140 145,150 C 135,160 120,170 105,165 C 90,160 75,175 65,165 C 55,155 45,145 35,135 C 25,125 20,110 25,95 Z"
              stroke="rgba(255,255,255,0.2)"
              strokeWidth="1.5"
              strokeDasharray="4 4"
            />
            <circle cx="100" cy="95" r="4.5" fill="#ffffff" />
            <circle cx="100" cy="95" r="12" fill="none" stroke="#ffffff" strokeWidth="1" opacity="0.8">
              <animate attributeName="r" values="4.5;16" dur="2s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.8;0" dur="2s" repeatCount="indefinite" />
            </circle>
            <circle cx="65" cy="115" r="3.5" fill="#ffffff" />
            <circle cx="65" cy="115" r="10" fill="none" stroke="#ffffff" strokeWidth="1" opacity="0.6">
              <animate attributeName="r" values="3.5;13" dur="2.5s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.6;0" dur="2.5s" repeatCount="indefinite" />
            </circle>
          </svg>

          {/* Content sits above the wave */}
          <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
            {/* Shield Logo */}
            <div className="login-logo-shield w-14 h-14 flex items-center justify-center text-white bg-white/10 rounded-2xl border border-white/20 shadow-sm">
              <div className="absolute inset-0 flex items-center justify-center opacity-30">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
              </div>
              <HeartPulse size={22} className="relative z-10 text-white" />
            </div>

            {/* Hero text */}
            <div className="login-hero" style={{ margin: '0' }}>
              <motion.h2
                initial={{ opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25, duration: 0.65 }}
                className="login-hero-heading"
              >
                Enterprise Disease<br />
                <span className="login-hero-accent">Surveillance Platform</span>
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="login-hero-sub"
              >
                Real-time monitoring, analytics &amp; outbreak response for
                public health teams across Maharashtra, India.
              </motion.p>
            </div>

            {/* Features Row List */}
            <div className="login-feature-list">
              {[
                { icon: Shield, title: 'Real-time Analytics', desc: 'Track outbreaks and trends instantly' },
                { icon: Activity, title: 'Team Collaboration', desc: 'Work together across departments' },
                { icon: Globe, title: 'Secure & Compliant', desc: 'Your data is protected with enterprise grade security' }
              ].map((feat) => (
                <div key={feat.title} className="login-feature-row">
                  <div className="login-feature-icon-circle">
                    <feat.icon size={18} />
                  </div>
                  <div className="login-feature-text">
                    <span className="login-feature-title">{feat.title}</span>
                    <span className="login-feature-desc">{feat.desc}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* ══════════ RIGHT PANEL ══════════ */}
        <div className="login-right">
          <motion.div
            ref={cardRef}
            initial={{ opacity: 0, y: 36 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.15 }}
            className="login-card w-full max-w-xl"
            style={{ transition: 'transform 0.1s ease-out' }}
            onMouseMove={handleCardMouseMove}
            onMouseLeave={handleCardMouseLeave}
          >
            {/* Tabs Header */}
            <div className="login-tabs-header">
              <button
                type="button"
                onClick={() => navigate('/login')}
                className="login-tab-btn"
              >
                <User size={15} /> Log In
              </button>
              <button
                type="button"
                onClick={() => {}}
                className="login-tab-btn active"
              >
                <User size={15} /> Create Account
              </button>
            </div>

            <div className="login-card-header">
              <h2 className="login-card-title">Create Account</h2>
              <p className="login-card-sub">Self-register as a system staff member</p>
            </div>

            {/* Offline notification banner */}
            <AnimatePresence>
              {isDemo && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="login-demo-banner"
                >
                  <WifiOff size={14} />
                  <span>Offline demo mode active. Account will be created in local storage.</span>
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleSubmit} className="login-form">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="login-field">
                  <label className="login-label">Full Name *</label>
                  <div className="login-input-wrap">
                    <User className="login-input-icon" size={16} />
                    <input
                      type="text"
                      placeholder="Jane Doe"
                      value={form.full_name}
                      onChange={e => setForm(f => ({ ...f, full_name: e.target.value }))}
                      className="login-input"
                      required
                    />
                  </div>
                </div>

                <div className="login-field">
                  <label className="login-label">Username *</label>
                  <div className="login-input-wrap">
                    <User className="login-input-icon" size={16} />
                    <input
                      type="text"
                      placeholder="jane_doe"
                      value={form.username}
                      onChange={e => setForm(f => ({ ...f, username: e.target.value }))}
                      className="login-input font-mono"
                      required
                    />
                  </div>
                </div>

                <div className="login-field">
                  <label className="login-label">Email Address *</label>
                  <div className="login-input-wrap">
                    <Mail className="login-input-icon" size={16} />
                    <input
                      type="email"
                      placeholder="jane@publichealth.in"
                      value={form.email}
                      onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                      className="login-input"
                      required
                    />
                  </div>
                </div>

                <div className="login-field">
                  <label className="login-label">Password *</label>
                  <div className="login-input-wrap">
                    <Lock className="login-input-icon" size={16} />
                    <input
                      type={showPass ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={form.password}
                      onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                      className="login-input login-input-pw"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPass(!showPass)}
                      className="login-eye-btn"
                      tabIndex={-1}
                    >
                      {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>

                <div className="login-field">
                  <label className="login-label">Phone Number</label>
                  <div className="login-input-wrap">
                    <Phone className="login-input-icon" size={16} />
                    <input
                      type="text"
                      placeholder="9876543210"
                      value={form.phone}
                      onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                      className="login-input font-mono"
                    />
                  </div>
                </div>

                <div className="login-field">
                  <label className="login-label">Assigned Region</label>
                  <div className="login-input-wrap">
                    <MapPin className="login-input-icon" size={16} />
                    <select
                      value={form.region}
                      onChange={e => setForm(f => ({ ...f, region: e.target.value }))}
                      className="login-input appearance-none cursor-pointer"
                      style={{ paddingRight: '28px' }}
                    >
                      <option value="">No Region (Global)</option>
                      {REGIONS.map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                  </div>
                </div>

                <div className="login-field md:col-span-2">
                  <label className="login-label">Department</label>
                  <div className="login-input-wrap">
                    <Briefcase className="login-input-icon" size={16} />
                    <select
                      value={form.department}
                      onChange={e => setForm(f => ({ ...f, department: e.target.value }))}
                      className="login-input appearance-none cursor-pointer"
                      style={{ paddingRight: '28px' }}
                    >
                      <option value="">No Department</option>
                      {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </div>
                </div>
              </div>

              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="login-error"
                  >
                    <AlertCircle size={14} className="shrink-0" />
                    <span>{error}</span>
                  </motion.div>
                )}

                {success && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-2.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-1.5 font-medium"
                  >
                    <Wifi size={14} className="shrink-0 animate-pulse text-emerald-500" />
                    <span>{success}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              <button
                type="submit"
                disabled={loading}
                className="login-submit-btn"
              >
                {loading ? (
                  <span className="login-spinner" />
                ) : (
                  <>Register Account <ArrowRight size={15} /></>
                )}
              </button>
            </form>

            {/* Safe badge */}
            <div className="login-safe-badge">
              <Shield size={14} />
              <span>Your data is safe and encrypted</span>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
