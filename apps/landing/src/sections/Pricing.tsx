import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { useState } from 'react';

type Plan = {
  name: string;
  monthly: number;
  yearly: number;
  tagline: string;
  features: string[];
  cta: string;
  featured?: boolean;
};

const PLANS: Plan[] = [
  {
    name: 'Free Trial',
    monthly: 0,
    yearly: 0,
    tagline: 'Try everything, risk-free.',
    features: ['Up to 100 students', '1 branch', '6-month trial', 'Email support'],
    cta: 'Start Free',
  },
  {
    name: 'School',
    monthly: 2999,
    yearly: 2399,
    tagline: 'Everything a single school needs.',
    features: [
      'Unlimited students',
      '1 branch',
      'All features',
      'Offline attendance',
      'PDF report cards',
      'Priority email support',
    ],
    cta: 'Start Free Trial',
    featured: true,
  },
  {
    name: 'Network',
    monthly: 7999,
    yearly: 6399,
    tagline: 'For school groups with multiple branches.',
    features: [
      'Unlimited students',
      'Up to 5 branches',
      'Centralized analytics',
      'Priority WhatsApp support',
      'Onboarding specialist',
    ],
    cta: 'Contact Sales',
  },
];

export function Pricing() {
  const [yearly, setYearly] = useState(false);

  return (
    <section id="pricing" className="section section-light">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{ textAlign: 'center', marginBottom: 36 }}
        >
          <div className="section-kicker">Pricing</div>
          <h2 className="section-title">Simple, honest pricing.</h2>
          <p
            style={{
              color: 'var(--color-text-secondary)',
              fontSize: 17,
              maxWidth: 520,
              margin: '0 auto',
            }}
          >
            Free to start. Pay only when you&apos;re ready.
          </p>
        </motion.div>

        <div
          style={{
            display: 'inline-flex',
            margin: '0 auto 40px',
            background: '#fff',
            border: '1px solid var(--color-border)',
            borderRadius: 999,
            padding: 4,
            position: 'relative',
            left: '50%',
            transform: 'translateX(-50%)',
          }}
        >
          {(['Monthly', 'Yearly'] as const).map((t, i) => {
            const active = yearly === (i === 1);
            return (
              <button
                key={t}
                onClick={() => setYearly(i === 1)}
                style={{
                  padding: '8px 20px',
                  borderRadius: 999,
                  border: 'none',
                  background: active ? 'var(--color-primary)' : 'transparent',
                  color: active ? '#fff' : 'var(--color-text-secondary)',
                  fontFamily: 'var(--font-heading)',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                {t} {i === 1 && <span style={{ fontSize: 11, marginLeft: 4 }}>· save 20%</span>}
              </button>
            );
          })}
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: 24,
            alignItems: 'stretch',
          }}
        >
          {PLANS.map((p, i) => {
            const price = yearly ? p.yearly : p.monthly;
            return (
              <motion.div
                key={p.name}
                className={`price-card ${p.featured ? 'featured' : ''}`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
              >
                {p.featured && (
                  <div
                    style={{
                      position: 'absolute',
                      top: -14,
                      left: '50%',
                      transform: 'translateX(-50%)',
                      background: 'var(--color-primary)',
                      color: '#fff',
                      fontSize: 12,
                      fontWeight: 700,
                      letterSpacing: '0.06em',
                      textTransform: 'uppercase',
                      padding: '6px 14px',
                      borderRadius: 999,
                    }}
                  >
                    Most Popular
                  </div>
                )}
                <div>
                  <div
                    style={{
                      fontFamily: 'var(--font-heading)',
                      fontWeight: 700,
                      color: 'var(--color-primary)',
                      fontSize: 13,
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                      marginBottom: 8,
                    }}
                  >
                    {p.name}
                  </div>
                  <div className="price-amount">
                    PKR {price.toLocaleString('en-PK')}
                    <small> / month</small>
                  </div>
                  <div style={{ color: 'var(--color-text-muted)', fontSize: 14, marginTop: 6 }}>
                    {p.tagline}
                  </div>
                </div>

                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: 10 }}>
                  {p.features.map((f) => (
                    <li
                      key={f}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 10,
                        fontSize: 14,
                        color: 'var(--color-text-secondary)',
                      }}
                    >
                      <Check size={16} color="var(--color-primary)" /> {f}
                    </li>
                  ))}
                </ul>

                <a
                  href="#cta"
                  className={`btn ${p.featured ? 'btn-primary' : 'btn-light'}`}
                  style={{ justifyContent: 'center' }}
                >
                  {p.cta}
                </a>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
