import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Stethoscope, Eye, EyeOff, Lock, User, Shield, Activity,
  Globe, Wifi, WifiOff, AlertCircle, Mail, Phone, MapPin, Briefcase, ArrowRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';

const REGIONS = ['Mumbai', 'Pune', 'Nashik', 'Nagpur', 'Thane', 'Aurangabad', 'Kolhapur', 'Solapur', 'Satara', 'Jalgaon'];
const DEPARTMENTS = ['Administration', 'Epidemiology', 'Field Operations', 'Data Entry', 'Data Analytics', 'IT Infrastructure'];

export default function LoginPage() {
  const { login, demoMode } = useAuth();
  const navigate = useNavigate();
  const cardRef = useRef(null);

  // Tabs toggle state (defaulting based on route path)
  const [activeTab, setActiveTab] = useState(
    window.location.pathname === '/register' ? 'register' : 'login'
  );

  // Form states
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [registerForm, setRegisterForm] = useState({
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
  const [rememberMe, setRememberMe] = useState(false);

  // Sync tab active state with path changes
  useEffect(() => {
    const tab = window.location.pathname === '/register' ? 'register' : 'login';
    setActiveTab(tab);
    setError('');
    setSuccess('');
  }, [window.location.pathname]);

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

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setError('');
    setSuccess('');
    // Dynamically update URL without full-page reload
    window.history.pushState(null, '', tab === 'register' ? '/register' : '/login');
  };

  // Mouse tilt effect
  const handleCardMouseMove = useCallback((e) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const rotX = ((y / rect.height) - 0.5) * -6;
    const rotY = ((x / rect.width)  - 0.5) *  6;
    card.style.transform = `perspective(1000px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateZ(2px)`;
  }, []);

  const handleCardMouseLeave = useCallback(() => {
    const card = cardRef.current;
    if (!card) return;
    card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)';
  }, []);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(loginForm.email, loginForm.password);
      navigate('/app/dashboard');
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Login failed. Check your credentials.';
      setError(msg);
      if (!err.response) setIsDemo(true);
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
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
            u => u.username.toLowerCase() === registerForm.username.toLowerCase() ||
                 u.email.toLowerCase() === registerForm.email.toLowerCase()
          );

          if (exists) {
            setError('Username or email already registered.');
            setLoading(false);
            return;
          }

          const newUser = {
            id: Date.now(),
            username: registerForm.username,
            email: registerForm.email,
            password: registerForm.password,
            full_name: registerForm.full_name,
            phone: registerForm.phone,
            region: registerForm.region,
            department: registerForm.department,
            role: 'staff',
            is_active: 1,
            created_at: new Date().toISOString()
          };

          localUsers.push(newUser);
          localStorage.setItem('ph_demo_users', JSON.stringify(localUsers));
          
          setSuccess('Account created successfully in Demo Mode!');
          setLoading(false);
          setTimeout(() => {
            handleTabChange('login');
            setLoginForm({ email: registerForm.email, password: registerForm.password });
          }, 1500);
        } catch {
          setError('Failed to save demo registration.');
          setLoading(false);
        }
      }, 800);
      return;
    }

    try {
      await authAPI.register(registerForm);
      setSuccess('Registration successful!');
      setLoading(false);
      setTimeout(() => {
        handleTabChange('login');
        setLoginForm({ email: registerForm.email, password: registerForm.password });
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to complete registration.');
      setLoading(false);
    }
  };

  const pageRef = useRef(null);

  const handlePageMouseMove = useCallback((e) => {
    const page = pageRef.current;
    if (!page) return;
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    const x = ((clientX / innerWidth) * 100).toFixed(2);
    const y = ((clientY / innerHeight) * 100).toFixed(2);
    page.style.setProperty('--mouse-x', `${x}%`);
    page.style.setProperty('--mouse-y', `${y}%`);
  }, []);

  return (
    <div 
      ref={pageRef}
      className="login-page"
      onMouseMove={handlePageMouseMove}
    >
      {/* Dynamic Radar & Sonar Sweep */}
      <div className="login-concentric-circles" />
      <div className="login-radar-sweep" />

      {/* ── Soft ambient blur orbs ── */}
      <div className="login-orb login-orb-1" />
      <div className="login-orb login-orb-2" />
      <div className="login-orb login-orb-3" />

      {/* Doctor silhouette watermark */}
      <svg className="login-doctor-watermark" viewBox="0 0 500 500" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="250" cy="250" r="210" stroke="url(#doc-grad)" strokeWidth="1.5" strokeDasharray="8 6" />
        <circle cx="250" cy="250" r="180" stroke="url(#doc-grad)" strokeWidth="1" opacity="0.5" />
        <path d="M250 140 C270 140, 285 155, 285 175 C285 195, 270 210, 250 210 C230 210, 215 195, 215 175 C215 155, 230 140, 250 140 Z" stroke="url(#doc-grad)" strokeWidth="3" strokeLinecap="round" />
        <path d="M190 280 L220 235 L235 245 L250 225 L265 245 L280 235 L310 280" stroke="url(#doc-grad)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M235 210 C235 235, 265 235, 265 210" stroke="url(#doc-grad)" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M250 235 L250 255 C250 262, 258 268, 265 268" stroke="url(#doc-grad)" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="265" cy="268" r="5" stroke="url(#doc-grad)" strokeWidth="2.5" />
        <path d="M170 330 C170 290, 200 270, 230 265 M330 330 C330 290, 300 270, 270 265" stroke="url(#doc-grad)" strokeWidth="3" strokeLinecap="round" />
        <path d="M250 60 L350 90 L350 220 C350 310, 250 390, 250 390 C250 390, 150 310, 150 220 L150 90 Z" stroke="url(#doc-grad)" strokeWidth="2" opacity="0.3" strokeDasharray="5 5" />
        <defs>
          <linearGradient id="doc-grad" x1="150" y1="60" x2="350" y2="390" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#1e7f84" />
            <stop offset="100%" stopColor="#8b5cf6" />
          </linearGradient>
        </defs>
      </svg>

      <div className="login-card-container">
        <motion.div
          ref={cardRef}
          layout
          animate={{ width: activeTab === 'login' ? 440 : 640 }}
          transition={{ type: 'spring', stiffness: 280, damping: 28 }}
          className="login-card"
          style={{ transition: 'transform 0.1s ease-out' }}
          onMouseMove={handleCardMouseMove}
          onMouseLeave={handleCardMouseLeave}
        >
          {/* Card branding header */}
          <div className="login-card-header">
            <div className="login-logo-badge">
              <Stethoscope size={24} className="animate-pulse" />
            </div>
            <h1 className="login-card-title">PublicHealth Cloud</h1>
            <p className="login-card-sub">Disease Surveillance System</p>
          </div>

          {/* iOS segmented tabs toggle */}
          <div className="login-segmented-control">
            <div 
              className="login-segmented-slider"
              style={{ left: activeTab === 'login' ? '4px' : 'calc(50% + 2px)' }}
            />
            <button
              type="button"
              onClick={() => handleTabChange('login')}
              className={`login-segmented-btn ${activeTab === 'login' ? 'active' : ''}`}
            >
              <User size={15} /> Log In
            </button>
            <button
              type="button"
              onClick={() => handleTabChange('register')}
              className={`login-segmented-btn ${activeTab === 'register' ? 'active' : ''}`}
            >
              <User size={15} /> Create Account
            </button>
          </div>

          {/* Offline demo banner */}
          <AnimatePresence>
            {isDemo && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="login-demo-banner"
              >
                <WifiOff size={14} />
                <span>
                  {activeTab === 'login' 
                    ? 'Backend offline — demo mode. Password: password' 
                    : 'Offline demo mode active. Data saved locally.'}
                </span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Dynamic Tab Switcher */}
          <AnimatePresence mode="wait">
            {activeTab === 'login' ? (
              <motion.div
                key="login-tab"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <form onSubmit={handleLoginSubmit} className="login-form">
                  <div className="login-field">
                    <label className="login-label">Email address or Username</label>
                    <div className="login-input-wrap">
                      <Mail className="login-input-icon" size={16} />
                      <input
                        id="login-email"
                        type="text"
                        placeholder="Enter username or email"
                        value={loginForm.email}
                        required
                        autoComplete="username"
                        onChange={e => setLoginForm(f => ({ ...f, email: e.target.value }))}
                        className="login-input"
                      />
                    </div>
                  </div>

                  <div className="login-field">
                    <label className="login-label">Password</label>
                    <div className="login-input-wrap">
                      <Lock className="login-input-icon" size={16} />
                      <input
                        id="login-password"
                        type={showPass ? 'text' : 'password'}
                        placeholder="Enter your password"
                        value={loginForm.password}
                        required
                        autoComplete="current-password"
                        onChange={e => setLoginForm(f => ({ ...f, password: e.target.value }))}
                        className="login-input login-input-pw"
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

                  <div className="login-options-row">
                    <label className="login-remember-me">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={e => setRememberMe(e.target.checked)}
                      />
                      Remember me
                    </label>
                    <a
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        alert("Please contact system admin to reset password.");
                      }}
                      className="login-forgot-link"
                    >
                      Forgot password?
                    </a>
                  </div>

                  {error && (
                    <div className="login-error">
                      <AlertCircle size={14} className="shrink-0" />
                      <span>{error}</span>
                    </div>
                  )}

                  <button
                    id="login-btn"
                    type="submit"
                    disabled={loading}
                    className="login-submit-btn"
                  >
                    {loading ? (
                      <><span className="login-spinner"/>Signing in…</>
                    ) : (
                      <>Sign In <ArrowRight size={15} /></>
                    )}
                  </button>
                </form>

                <div className="login-divider"><span>or continue with</span></div>

                {/* Social logins */}
                <div className="login-social-grid">
                  <button
                    type="button"
                    onClick={() => alert("Google Sign-in is a demo mockup. Use your password.")}
                    className="login-social-btn"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                    </svg>
                    Google
                  </button>
                  <button
                    type="button"
                    onClick={() => alert("Microsoft Sign-in is a demo mockup. Use your password.")}
                    className="login-social-btn"
                  >
                    <svg width="16" height="16" viewBox="0 0 23 23" style={{ marginRight: '2px' }}>
                      <path fill="#f35325" d="M1 1h10v10H1z" />
                      <path fill="#81bc06" d="M12 1h10v10H12z" />
                      <path fill="#05a6f0" d="M1 12h10v10H1z" />
                      <path fill="#ffba08" d="M12 12h10v10H12z" />
                    </svg>
                    Microsoft
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="register-tab"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <form onSubmit={handleRegisterSubmit} className="login-form">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="login-field">
                      <label className="login-label">Full Name *</label>
                      <div className="login-input-wrap">
                        <User className="login-input-icon" size={16} />
                        <input
                          type="text"
                          placeholder="Jane Doe"
                          value={registerForm.full_name}
                          onChange={e => setRegisterForm(f => ({ ...f, full_name: e.target.value }))}
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
                          value={registerForm.username}
                          onChange={e => setRegisterForm(f => ({ ...f, username: e.target.value }))}
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
                          value={registerForm.email}
                          onChange={e => setRegisterForm(f => ({ ...f, email: e.target.value }))}
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
                          value={registerForm.password}
                          onChange={e => setRegisterForm(f => ({ ...f, password: e.target.value }))}
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
                          value={registerForm.phone}
                          onChange={e => setRegisterForm(f => ({ ...f, phone: e.target.value }))}
                          className="login-input font-mono"
                        />
                      </div>
                    </div>

                    <div className="login-field">
                      <label className="login-label">Assigned Region</label>
                      <div className="login-input-wrap">
                        <MapPin className="login-input-icon" size={16} />
                        <select
                          value={registerForm.region}
                          onChange={e => setRegisterForm(f => ({ ...f, region: e.target.value }))}
                          className="login-input appearance-none cursor-pointer"
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
                          value={registerForm.department}
                          onChange={e => setRegisterForm(f => ({ ...f, department: e.target.value }))}
                          className="login-input appearance-none cursor-pointer"
                        >
                          <option value="">No Department</option>
                          {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                        </select>
                      </div>
                    </div>
                  </div>

                  {error && (
                    <div className="login-error mt-2">
                      <AlertCircle size={14} className="shrink-0" />
                      <span>{error}</span>
                    </div>
                  )}

                  {success && (
                    <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm rounded-xl flex items-center gap-1.5 font-medium mt-2">
                      <Wifi size={14} className="shrink-0 animate-pulse text-emerald-500" />
                      <span>{success}</span>
                    </div>
                  )}

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
              </motion.div>
            )}
          </AnimatePresence>

          {/* Secure lock badge */}
          <div className="login-safe-badge">
            <Shield size={14} />
            <span>Your data is safe and encrypted</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
