import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Particles } from '../components/Particles';

const TITLE_TOP = 'Modernize Your School.'.split(' ');
const TITLE_BOTTOM = 'Run Everything in One Place.'.split(' ');

function AnimatedWords({ words, delay = 0 }: { words: string[]; delay?: number }) {
  return (
    <>
      {words.map((w, i) => (
        <motion.span
          key={`${w}-${i}`}
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: delay + i * 0.05, ease: [0.25, 0.1, 0.25, 1] }}
          style={{ display: 'inline-block', marginRight: '0.25em' }}
        >
          {w}
        </motion.span>
      ))}
    </>
  );
}

export function Hero() {
  return (
    <section
      id="top"
      style={{
        position: 'relative',
        minHeight: '100vh',
        background: '#0A0F1E',
        color: '#fff',
        display: 'flex',
        alignItems: 'center',
        paddingTop: 120,
        paddingBottom: 80,
        overflow: 'hidden',
      }}
    >
      <div className="glow-orb" />
      <Particles count={38} />

      <div className="container" style={{ position: 'relative', textAlign: 'center' }}>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{ marginBottom: 24, display: 'flex', justifyContent: 'center' }}
        >
          <div className="pill">
            <Sparkles size={14} /> Built for Pakistan&apos;s schools
          </div>
        </motion.div>

        <h1 className="hero-headline" style={{ marginBottom: 20 }}>
          <div>
            <AnimatedWords words={TITLE_TOP} />
          </div>
          <div style={{ color: '#A5B4FC' }}>
            <AnimatedWords words={TITLE_BOTTOM} delay={TITLE_TOP.length * 0.05} />
          </div>
        </h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          style={{
            maxWidth: 680,
            margin: '0 auto 32px',
            color: 'rgba(255,255,255,0.72)',
            fontSize: 18,
            lineHeight: 1.6,
          }}
        >
          From attendance to report cards — EduPortal gives teachers, parents, and management
          real-time visibility into every student&apos;s journey.
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.9 }}
          style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}
        >
          <a className="btn btn-primary" href="#cta">
            Start Free Trial <ArrowRight size={16} />
          </a>
          <a className="btn btn-ghost" href="#how">
            See How It Works
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 1.1 }}
          style={{
            marginTop: 28,
            display: 'flex',
            gap: 24,
            justifyContent: 'center',
            flexWrap: 'wrap',
            color: 'rgba(255,255,255,0.65)',
            fontSize: 13,
          }}
        >
          <span>✓ No credit card</span>
          <span>✓ Setup in 10 minutes</span>
          <span>✓ Free for 100 students</span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 1.3, ease: [0.25, 0.1, 0.25, 1] }}
          style={{
            marginTop: 72,
            maxWidth: 960,
            marginInline: 'auto',
          }}
        >
          <motion.div
            animate={{ y: [0, -12, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            className="browser-frame"
          >
            <div className="browser-bar">
              <div className="browser-dot" style={{ background: '#EF4444' }} />
              <div className="browser-dot" style={{ background: '#EAB308' }} />
              <div className="browser-dot" style={{ background: '#22C55E' }} />
              <div
                style={{
                  flex: 1,
                  textAlign: 'center',
                  color: 'rgba(255,255,255,0.4)',
                  fontSize: 12,
                  fontFamily: 'monospace',
                }}
              >
                app.eduportal.pk/dashboard
              </div>
            </div>
            <DashboardMockup />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

function DashboardMockup() {
  return (
    <div
      style={{
        background: '#F8FAFC',
        padding: 24,
        display: 'grid',
        gridTemplateColumns: '200px 1fr',
        gap: 16,
        minHeight: 360,
      }}
    >
      <div
        style={{
          background: '#0F172A',
          borderRadius: 12,
          padding: 16,
          color: '#94A3B8',
          fontSize: 12,
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
        }}
      >
        <div style={{ color: '#fff', fontWeight: 700, marginBottom: 8 }}>EduPortal</div>
        {['Dashboard', 'Students', 'Staff', 'Attendance', 'Results', 'Analytics'].map((n, i) => (
          <div
            key={n}
            style={{
              padding: '6px 10px',
              borderRadius: 6,
              background: i === 0 ? 'rgba(29,78,216,0.2)' : 'transparent',
              color: i === 0 ? '#fff' : undefined,
            }}
          >
            {n}
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
          {[
            { t: 'Attendance', v: '94%', c: '#059669' },
            { t: 'Students', v: '1,248', c: '#1D4ED8' },
            { t: 'Disputes', v: '2', c: '#D97706' },
            { t: 'Outstanding', v: 'PKR 42k', c: '#DC2626' },
          ].map((s) => (
            <div
              key={s.t}
              style={{
                background: '#fff',
                borderRadius: 10,
                padding: 14,
                border: '1px solid #E2E8F0',
              }}
            >
              <div style={{ fontSize: 11, color: '#94A3B8', fontWeight: 600 }}>{s.t}</div>
              <div style={{ fontSize: 20, fontWeight: 800, color: s.c, fontFamily: 'var(--font-heading)' }}>
                {s.v}
              </div>
              <div style={{ height: 16, marginTop: 6 }}>
                <svg width="100%" height="16" viewBox="0 0 100 16" preserveAspectRatio="none">
                  <path
                    d="M0,10 L15,6 L30,9 L45,4 L60,7 L75,3 L100,5"
                    stroke={s.c}
                    strokeWidth="1.5"
                    fill="none"
                  />
                </svg>
              </div>
            </div>
          ))}
        </div>
        <div
          style={{
            background: '#fff',
            borderRadius: 10,
            padding: 16,
            border: '1px solid #E2E8F0',
            minHeight: 140,
          }}
        >
          <div
            style={{
              fontSize: 12,
              fontWeight: 700,
              color: '#0F172A',
              marginBottom: 10,
              fontFamily: 'var(--font-heading)',
            }}
          >
            Attendance by class
          </div>
          <div style={{ display: 'flex', gap: 10, alignItems: 'flex-end', height: 90 }}>
            {[78, 92, 88, 95, 84, 90, 86, 82].map((h, i) => (
              <div
                key={i}
                style={{
                  flex: 1,
                  height: `${h}%`,
                  background: `linear-gradient(180deg, #1D4ED8 0%, #3B82F6 100%)`,
                  borderRadius: 4,
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
