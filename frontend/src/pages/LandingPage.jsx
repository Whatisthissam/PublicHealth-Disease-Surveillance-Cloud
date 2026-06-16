import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import {
  Stethoscope, Activity, Shield, BarChart3, Globe, Bell,
  ArrowRight, ArrowUpRight, ChevronRight, Menu, X, CheckCircle2,
  Microscope, MapPin, Users, TrendingUp, FileText,
  Zap, Lock, Database, Phone, Mail, Twitter, Linkedin,
  Instagram, Star, Play, AlertTriangle, Clock
} from 'lucide-react';

/* ── STATS counter hook ─────────────────────────────────────── */
function useCountUp(target, duration = 2000, start = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime = null;
    const step = (ts) => {
      if (!startTime) startTime = ts;
      const prog = Math.min((ts - startTime) / duration, 1);
      const ease = 1 - Math.pow(1 - prog, 3);
      setCount(Math.floor(ease * target));
      if (prog < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [start, target, duration]);
  return count;
}

/* ── PULSE RING animation ───────────────────────────────────── */
function PulseRing({ size = 160, color = 'rgba(77,217,217,0.15)' }) {
  return (
    <div style={{ position:'relative', width:size, height:size, display:'flex', alignItems:'center', justifyContent:'center' }}>
      {[0,1,2].map(i => (
        <div key={i} style={{
          position:'absolute', borderRadius:'50%', border:`2px solid ${color}`,
          animation:`lp-pulse ${2 + i * 0.7}s ease-out ${i * 0.5}s infinite`,
          width:'100%', height:'100%',
        }} />
      ))}
    </div>
  );
}

/* ── FLOATING HEALTH CARD ───────────────────────────────────── */
function FloatingCard({ style, children, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity:0, y:20, scale:0.95 }}
      animate={{ opacity:1, y:0, scale:1 }}
      transition={{ delay, duration:0.6, ease:[0.22,1,0.36,1] }}
      style={{
        background:'rgba(255,255,255,0.10)',
        backdropFilter:'blur(16px)',
        border:'1px solid rgba(255,255,255,0.18)',
        borderRadius:16, padding:'16px 20px',
        ...style,
      }}
    >
      {children}
    </motion.div>
  );
}

const SERVICES = [
  { icon: Activity,     title: 'Disease Monitoring',   desc: 'Real-time tracking of disease outbreaks across all 10 Maharashtra regions.' },
  { icon: AlertTriangle,title: 'Outbreak Detection',   desc: 'AI-assisted early warning system for epidemic pattern recognition.' },
  { icon: BarChart3,    title: 'Analytics & Reports',  desc: 'Comprehensive dashboards and automated epidemiological reports.' },
  { icon: Globe,        title: 'Regional Coverage',    desc: 'Full coverage across Mumbai, Pune, Nagpur, Nashik and 6 more cities.' },
  { icon: Shield,       title: 'Data Security',        desc: 'HIPAA-compliant, role-based access control with full audit trails.' },
  { icon: FileText,     title: 'Workflow Automation',  desc: 'Streamlined case management and approval workflows for health staff.' },
  { icon: Bell,         title: 'Smart Alerts',         desc: 'Instant notifications for critical thresholds and anomalous patterns.' },
  { icon: Database,     title: 'AWS Cloud Infra',      desc: 'Scalable, fault-tolerant infrastructure hosted on AWS RDS & EC2.' },
];

const TEAM = [
  { name: 'Dr. Arjun Sharma',  title: 'Chief Epidemiologist',  initials: 'AS', bg: '#0a5555' },
  { name: 'Dr. Priya Mehta',   title: 'Regional Health Director', initials: 'PM', bg: '#0a4a4a' },
  { name: 'Dr. Ravi Kulkarni', title: 'Data Science Lead',    initials: 'RK', bg: '#0a5a4a' },
];

function BackdropGlobe() {
  const canvasRef = useRef(null);
  const animRef   = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    let W = canvas.width  = window.innerWidth;
    let H = canvas.height = window.innerHeight;
    
    const handleResize = () => {
      if (!canvas) return;
      W = canvas.width  = window.innerWidth;
      H = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const cx = W / 2, cy = H / 2;
    const R  = Math.min(W, H) * 0.35;

    // Dots on sphere
    const dots = [];
    const RINGS = 16, PER_RING = 28;
    for (let i = 0; i <= RINGS; i++) {
      const phi = (Math.PI * i) / RINGS;
      for (let j = 0; j < PER_RING; j++) {
        const theta = (2 * Math.PI * j) / PER_RING;
        dots.push({ phi, theta, r: R });
      }
    }

    const connections = [];
    for (let i = 0; i < dots.length; i++) {
      for (let j = i + 1; j < dots.length; j++) {
        const a = dots[i], b = dots[j];
        if (Math.abs(a.phi - b.phi) < 0.42 && Math.abs(a.theta - b.theta) < 0.42) {
          connections.push([i, j]);
        }
      }
    }

    function project(x, y, z, rotY, rotX) {
      const x1 = x * Math.cos(rotY) - z * Math.sin(rotY);
      const z1 = x * Math.sin(rotY) + z * Math.cos(rotY);
      const y2 = y * Math.cos(rotX) - z1 * Math.sin(rotX);
      const z2 = y * Math.sin(rotX) + z1 * Math.cos(rotX);
      const fov = 700;
      const scale = fov / (fov + z2 + R);
      return { sx: W / 2 + x1 * scale, sy: H / 2 + y2 * scale, z: z2 };
    }

    function sphereXYZ(phi, theta, r) {
      return {
        x: r * Math.sin(phi) * Math.cos(theta),
        y: r * Math.cos(phi),
        z: r * Math.sin(phi) * Math.sin(theta),
      };
    }

    function draw(t) {
      ctx.clearRect(0, 0, W, H);
      const rotY = t * 0.00015; // slow rotation
      const rotX = Math.sin(t * 0.0001) * 0.12;

      const projected = dots.map(d => {
        const { x, y, z } = sphereXYZ(d.phi, d.theta, d.r);
        return project(x, y, z, rotY, rotX);
      });

      // Draw lines
      ctx.lineWidth = 0.5;
      for (const [i, j] of connections) {
        const a = projected[i], b = projected[j];
        const alpha = Math.max(0, Math.min(0.20, ((a.z + b.z) / (2 * R) + 0.5) * 0.15));
        ctx.strokeStyle = `rgba(30,127,132,${alpha * 0.45})`;
        ctx.beginPath();
        ctx.moveTo(a.sx, a.sy);
        ctx.lineTo(b.sx, b.sy);
        ctx.stroke();
      }

      // Draw dots
      for (const p of projected) {
        const brightness = (p.z + R) / (2 * R);
        const alpha = 0.08 + brightness * 0.12;
        ctx.beginPath();
        ctx.arc(p.sx, p.sy, 1.2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(30,127,132,${alpha * 0.6})`;
        ctx.fill();
      }
    }

    function loop(ts) {
      draw(ts);
      animRef.current = requestAnimationFrame(loop);
    }
    animRef.current = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute', inset: 0, width: '100%', height: '100%',
        opacity: 0.18, pointerEvents: 'none', zIndex: 0
      }}
    />
  );
}

export default function LandingPage() {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const statsRef = useRef(null);
  const statsInView = useInView(statsRef, { once: true, amount: 0.3 });

  const c1 = useCountUp(21781,  2200, statsInView);
  const c2 = useCountUp(18394,  2400, statsInView);
  const c3 = useCountUp(10,     1200, statsInView);
  const c4 = useCountUp(98,     1800, statsInView);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive:true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="lp-root">

      {/* ══════════════════════════════════════
          HERO SECTION — Centered layout with 3D backdrop and soft radial gradient
      ══════════════════════════════════════ */}
      <section 
        className="lp-hero flex flex-col justify-center items-center relative overflow-hidden min-h-screen py-28 md:py-36" 
        id="about"
        style={{
          background: 'radial-gradient(circle at top, #E9F2F3 0%, rgba(188, 217, 218, 0.4) 60%, #FFFFFF 100%)',
          minHeight: '100vh'
        }}
      >
        <BackdropGlobe />

        {/* Background rings */}
        <div className="lp-hero-rings opacity-30" aria-hidden>
          <div className="lp-ring lp-ring-1 border-primary-200/20" />
          <div className="lp-ring lp-ring-2 border-primary-200/10" />
          <div className="lp-ring lp-ring-3 border-primary-200/20" />
        </div>

        <div className="max-w-4xl mx-auto px-6 flex flex-col items-center text-center relative z-10">
          {/* Doctor Avatars group + tracked count */}
          <motion.div 
            initial={{ opacity:0, y:12 }}
            animate={{ opacity:1, y:0 }}
            transition={{ duration:0.5 }}
            className="flex items-center justify-center gap-3 mb-8 bg-white/60 backdrop-blur-md py-2 px-4 rounded-full border border-primary-200/40 shadow-sm"
          >
            <div className="flex -space-x-2.5">
              <img className="w-8 h-8 rounded-full border-2 border-white object-cover" src="https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=100" alt="Dr. Arjun" />
              <img className="w-8 h-8 rounded-full border-2 border-white object-cover" src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=100" alt="Dr. Priya" />
              <img className="w-8 h-8 rounded-full border-2 border-white object-cover" src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=100" alt="Dr. Ravi" />
              <div className="w-8 h-8 rounded-full border-2 border-white bg-primary-100 flex items-center justify-center text-[10px] font-bold text-primary-700 font-mono">
                10+
              </div>
            </div>
            <div className="text-left leading-tight">
              <span className="font-extrabold text-[#0c373a] text-sm block">21,780+</span>
              <span className="text-gray-400 font-semibold text-[10px] uppercase tracking-wider">Active Cases Monitored</span>
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity:0, y:32 }}
            animate={{ opacity:1, y:0 }}
            transition={{ delay:0.1, duration:0.65, ease:[0.22,1,0.36,1] }}
            className="text-4xl md:text-6xl lg:text-7xl font-medium text-[#0c373a] tracking-tight leading-tight mb-8 font-display"
          >
            Intelligent Disease Surveillance &amp; Response<br />
            <span className="lp-hero-heading-accent font-semibold">
              for Safer Communities
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity:0, y:20 }}
            animate={{ opacity:1, y:0 }}
            transition={{ delay:0.25, duration:0.6 }}
            className="text-base md:text-xl text-gray-500 max-w-3xl leading-relaxed mb-12"
          >
            We track disease outbreaks in real-time to help protect communities and support healthcare across Maharashtra.
          </motion.p>

          <motion.div
            initial={{ opacity:0, y:16 }}
            animate={{ opacity:1, y:0 }}
            transition={{ delay:0.4, duration:0.5 }}
            className="flex flex-wrap justify-center gap-4"
          >
            <Link 
              to="/login" 
              className="lp-btn-solid lp-btn-solid--lg px-8 py-3.5 text-base font-bold rounded-full shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 flex items-center gap-2"
              style={{
                background: 'linear-gradient(135deg, #1E7F84 0%, #1A6E72 100%)',
                boxShadow: '0 4px 14px rgba(30,127,132,0.25)'
              }}
            >
              Sign In <ArrowUpRight size={18} />
            </Link>
            <a 
              href="#services" 
              className="flex items-center gap-2 text-primary-700 font-bold hover:text-primary-800 transition-colors border border-primary-200/60 bg-white/80 hover:bg-white px-8 py-3.5 rounded-full shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
            >
              Explore Services <ArrowUpRight size={18} />
            </a>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat:Infinity, duration:1.8, ease:'easeInOut' }}
          className="lp-scroll-cue"
        >
          <div className="lp-scroll-dot" />
        </motion.div>
      </section>

      {/* ══════════════════════════════════════
          STATS BAR
      ══════════════════════════════════════ */}
      <section className="lp-stats-bar" ref={statsRef}>
        <div className="lp-stats-inner">
          {[
            { value: c1, suffix:'',  label:'Total Cases Tracked' },
            { value: c2, suffix:'',  label:'Patients Recovered' },
            { value: c3, suffix:'+', label:'Active Regions' },
            { value: c4, suffix:'%', label:'System Uptime' },
          ].map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity:0, y:20 }}
              whileInView={{ opacity:1, y:0 }}
              viewport={{ once:true }}
              transition={{ delay:i*0.1 }}
              className="lp-stat-item"
            >
              <p className="lp-stat-num">{s.value.toLocaleString()}{s.suffix}</p>
              <p className="lp-stat-label">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════
          SERVICES SECTION
      ══════════════════════════════════════ */}
      <section className="lp-services" id="services">
        <div className="lp-section-inner">
          <motion.div
            initial={{ opacity:0, y:24 }}
            whileInView={{ opacity:1, y:0 }}
            viewport={{ once:true }}
            className="lp-section-header"
          >
            <span className="lp-section-eyebrow">What We Offer</span>
            <h2 className="lp-section-heading">Comprehensive Surveillance<br />Services</h2>
            <p className="lp-section-sub">Everything your public health team needs in one integrated platform</p>
          </motion.div>

          <div className="lp-services-grid">
            {SERVICES.map((s, i) => (
              <motion.div
                key={s.title}
                initial={{ opacity:0, y:28 }}
                whileInView={{ opacity:1, y:0 }}
                viewport={{ once:true }}
                transition={{ delay: Math.floor(i/4) * 0.1 + (i%4)*0.08 }}
                className="lp-service-card"
                whileHover={{ y:-6, transition:{ duration:0.2 } }}
              >
                <div className="lp-service-icon">
                  <s.icon size={22} />
                </div>
                <h3 className="lp-service-title">{s.title}</h3>
                <p className="lp-service-desc">{s.desc}</p>
                <span className="lp-service-arrow"><ChevronRight size={14}/></span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          TRUSTED PARTNER SECTION
      ══════════════════════════════════════ */}
      <section className="lp-partner" id="analytics">
        <div className="lp-partner-inner">
          {/* Left visual */}
          <motion.div
            initial={{ opacity:0, x:-40 }}
            whileInView={{ opacity:1, x:0 }}
            viewport={{ once:true }}
            transition={{ duration:0.65 }}
            className="lp-partner-visual"
          >
            {/* Mock analytics card */}
            <div className="lp-analytics-card">
              <div className="lp-analytics-header">
                <Stethoscope size={18} color="#0d7a7a" />
                <span>Disease Trend Overview</span>
                <span className="lp-analytics-live">● Live</span>
              </div>
              {/* Fake bar chart */}
              <div className="lp-fake-chart">
                {[
                  { label:'Dengue',   w:78, color:'#0d9898' },
                  { label:'Malaria',  w:60, color:'#1aafaf' },
                  { label:'COVID-19', w:48, color:'#4dd9d9' },
                  { label:'TB',       w:35, color:'#7eeaea' },
                  { label:'Influenza',w:25, color:'#b0f0f0' },
                ].map(b => (
                  <div key={b.label} className="lp-fake-bar-row">
                    <span className="lp-fake-bar-label">{b.label}</span>
                    <div className="lp-fake-bar-track">
                      <motion.div
                        initial={{ width:0 }}
                        whileInView={{ width:`${b.w}%` }}
                        viewport={{ once:true }}
                        transition={{ duration:1, delay:0.2 }}
                        className="lp-fake-bar-fill"
                        style={{ background:b.color }}
                      />
                    </div>
                    <span className="lp-fake-bar-pct">{b.w}%</span>
                  </div>
                ))}
              </div>
              {/* Mini KPIs */}
              <div className="lp-analytics-kpis">
                {[
                  { label:'Total', value:'21,781', color:'#0d7a7a' },
                  { label:'Active', value:'2,847', color:'#e53e3e' },
                  { label:'Recovered', value:'18,394', color:'#2d8a5a' },
                ].map(k => (
                  <div key={k.label} className="lp-kpi-mini">
                    <p style={{ color:k.color, fontWeight:800, fontSize:'1rem', fontFamily:'Poppins,sans-serif' }}>{k.value}</p>
                    <p style={{ fontSize:11, color:'#6b7280' }}>{k.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Team avatars */}
            <div className="lp-team-stack">
              {TEAM.map((t, i) => (
                <motion.div
                  key={t.name}
                  initial={{ opacity:0, x:-20 }}
                  whileInView={{ opacity:1, x:0 }}
                  viewport={{ once:true }}
                  transition={{ delay:i*0.12 }}
                  className="lp-team-card"
                  style={{ zIndex: TEAM.length - i }}
                >
                  <div className="lp-team-avatar" style={{ background:t.bg }}>
                    {t.initials}
                  </div>
                  <div>
                    <p className="lp-team-name">{t.name}</p>
                    <p className="lp-team-title">{t.title}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right copy */}
          <motion.div
            initial={{ opacity:0, x:40 }}
            whileInView={{ opacity:1, x:0 }}
            viewport={{ once:true }}
            transition={{ duration:0.65, delay:0.15 }}
            className="lp-partner-copy"
          >
            <span className="lp-section-eyebrow lp-section-eyebrow--teal">Our Platform</span>
            <h2 className="lp-partner-heading">
              YOUR TRUSTED PARTNER<br />
              IN PUBLIC HEALTH
            </h2>
            <p className="lp-partner-desc">
              We believe that protecting public health starts with data. That's why PublicHealth Cloud
              is more than just a platform — we're your operational backbone for disease surveillance,
              outbreak response, and health intelligence.
            </p>

            <div className="lp-partner-features">
              {[
                'Real-time outbreak alerts across all regions',
                'Automated report generation and approval workflow',
                'Role-based access for Admin, Manager & Staff',
                'Full audit trail and compliance logging',
                'AWS-hosted with 99%+ uptime guarantee',
              ].map(f => (
                <div key={f} className="lp-partner-feature">
                  <CheckCircle2 size={17} className="lp-feature-check" />
                  <span>{f}</span>
                </div>
              ))}
            </div>

            <Link to="/login" className="lp-btn-solid lp-btn-solid--teal">
              Access the Platform <ArrowRight size={15}/>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          CTA BANNER
      ══════════════════════════════════════ */}
      <section className="lp-cta" id="contact">
        <div className="lp-cta-inner">
          <motion.div
            initial={{ opacity:0, y:24 }}
            whileInView={{ opacity:1, y:0 }}
            viewport={{ once:true }}
          >
            <p className="lp-cta-eyebrow">Ready to Get Started?</p>
            <h2 className="lp-cta-heading">Protecting Maharashtra,<br />One Data Point at a Time</h2>
            <p className="lp-cta-sub">
              Join health departments, hospitals, and field workers using PublicHealth Cloud
              to monitor, respond, and prevent disease outbreaks.
            </p>
            <div className="lp-cta-actions">
              <Link to="/login" className="lp-btn-solid lp-btn-solid--white">
                Sign In to Dashboard <ArrowRight size={15}/>
              </Link>
              <a href="mailto:admin@publichealth.in" className="lp-btn-ghost lp-btn-ghost--white">
                <Mail size={14}/> Contact Us
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          FOOTER
      ══════════════════════════════════════ */}
      <footer className="lp-footer">
        <div className="lp-footer-inner">
          {/* Brand */}
          <div className="lp-footer-brand">
            <div className="lp-logo" style={{ marginBottom:12, color:'#ffffff' }}>
              <div className="lp-logo-icon"><Stethoscope size={18}/></div>
              <span className="lp-logo-text">PublicHealth Cloud</span>
            </div>
            <p className="lp-footer-brand-desc">
              Enterprise-grade disease surveillance platform built on AWS Cloud infrastructure
              for Maharashtra's public health ecosystem.
            </p>
            <div className="lp-footer-social">
              {[Twitter, Linkedin, Instagram].map((Icon, i) => (
                <a key={i} href="#" className="lp-social-btn"><Icon size={15}/></a>
              ))}
            </div>
          </div>

          {/* Links */}
          <div className="lp-footer-col">
            <p className="lp-footer-col-title">Platform</p>
            {['Dashboard','Disease Records','Analytics','Monitoring','Workflow'].map(l => (
              <a key={l} href="#" className="lp-footer-link">{l}</a>
            ))}
          </div>
          <div className="lp-footer-col">
            <p className="lp-footer-col-title">Resources</p>
            {['Documentation','API Reference','System Status','Release Notes','Support'].map(l => (
              <a key={l} href="#" className="lp-footer-link">{l}</a>
            ))}
          </div>
          <div className="lp-footer-col">
            <p className="lp-footer-col-title">Contact</p>
            <div className="lp-footer-contact">
              <Phone size={13}/> +91 22 1234 5678
            </div>
            <div className="lp-footer-contact">
              <Mail size={13}/> admin@publichealth.in
            </div>
            <div className="lp-footer-contact">
              <MapPin size={13}/> Mumbai, Maharashtra
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
