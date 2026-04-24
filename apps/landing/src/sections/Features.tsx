import { motion } from 'framer-motion';
import {
  BarChart3,
  FileText,
  Fingerprint,
  TrendingUp,
  Users,
  WifiOff,
} from 'lucide-react';
import type { ReactNode } from 'react';

const FEATURES: { icon: ReactNode; title: string; desc: string }[] = [
  {
    icon: <Fingerprint size={22} />,
    title: 'Smart Attendance',
    desc: 'Mark 30 students in under 60 seconds. QR scan or manual — works offline.',
  },
  {
    icon: <FileText size={22} />,
    title: 'Digital Report Cards',
    desc: 'Beautiful PDFs generated instantly. Parents download from their phone.',
  },
  {
    icon: <TrendingUp size={22} />,
    title: 'Result Tracking',
    desc: 'Track every student across subjects and years. Spot trends early.',
  },
  {
    icon: <Users size={22} />,
    title: 'Parent Portal',
    desc: 'Parents see attendance and results the moment they are published.',
  },
  {
    icon: <BarChart3 size={22} />,
    title: 'Analytics & Audits',
    desc: 'Which subjects need attention? Compare performance across teachers and terms.',
  },
  {
    icon: <WifiOff size={22} />,
    title: 'Works Offline',
    desc: 'Attendance marking works with no internet. Syncs automatically when connected.',
  },
];

export function Features() {
  return (
    <section id="features" className="section section-light">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          style={{ textAlign: 'center', marginBottom: 56 }}
        >
          <div className="section-kicker">What you get</div>
          <h2 className="section-title">Everything your school needs.<br />Nothing it doesn&apos;t.</h2>
          <p
            style={{
              color: 'var(--color-text-secondary)',
              fontSize: 17,
              maxWidth: 620,
              margin: '0 auto',
              lineHeight: 1.6,
            }}
          >
            A focused toolkit for Pakistani schools — fast to learn, hard to outgrow.
          </p>
        </motion.div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: 24,
          }}
        >
          {FEATURES.map((f, i) => (
            <motion.div
              key={f.title}
              className="feature-card"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5, delay: i * 0.06 }}
            >
              <div className="feature-icon">{f.icon}</div>
              <h3 style={{ fontSize: 18, marginBottom: 8 }}>{f.title}</h3>
              <div style={{ color: 'var(--color-text-secondary)', fontSize: 14, lineHeight: 1.6 }}>
                {f.desc}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
