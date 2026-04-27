import { motion } from 'framer-motion';
import { Check, ArrowRight } from 'lucide-react';
import { useState } from 'react';

const PLANS = [
  {
    name: 'Free Trial',
    price: 0,
    tagline: 'Experience the power of Skolar.',
    features: ['Up to 100 students', '1 Branch registration', '30-day full access', 'Email support'],
    cta: 'Get Started',
    featured: false,
  },
  {
    name: 'School',
    price: 9999,
    tagline: 'Best for individual schools.',
    features: [
      'Unlimited students',
      '1 Branch management',
      'Offline attendance',
      'Digital Report Cards (PDF)',
      'Parent Mobile Portal',
      'Priority Email support',
    ],
    cta: 'Get Now',
    featured: true,
  },
  {
    name: 'Network',
    price: 15000,
    tagline: 'For groups & school chains.',
    features: [
      'Unlimited students',
      'Up to 5 Branches',
      'Centralized Head-Office View',
      'Multi-branch Analytics',
      'Onboarding Specialist',
      'Priority WhatsApp support',
    ],
    cta: 'Get Now',
    featured: false,
  },
];

export function Pricing() {
  return (
    <section id="pricing" style={{ padding: '120px 20px', background: '#F8FAFC' }}>
      <div className="container" style={{ maxWidth: '1100px', margin: '0 auto' }}>
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{ textAlign: 'center', marginBottom: 60 }}
        >
          <span style={{ color: '#0288D1', fontWeight: 700, fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px' }}>
            Flexible Plans
          </span>
          <h2 style={{ fontSize: '42px', fontWeight: 800, color: '#01579B', marginTop: '10px' }}>
            Simple, honest pricing.
          </h2>
          <p style={{ color: '#64748B', fontSize: '18px', maxWidth: '520px', margin: '15px auto 0' }}>
            No hidden fees. Choose a plan that fits your school&apos;s size.
          </p>
        </motion.div>

        {/* Pricing Cards Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '30px',
          alignItems: 'stretch'
        }}>
          {PLANS.map((p, i) => (
            <motion.div
              key={p.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              style={{
                background: '#fff',
                padding: '40px',
                borderRadius: '30px',
                border: p.featured ? '2px solid #0288D1' : '1px solid #E2E8F0',
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                boxShadow: p.featured ? '0 20px 40px rgba(2, 136, 209, 0.1)' : '0 10px 20px rgba(0,0,0,0.02)',
              }}
            >
              {p.featured && (
                <div style={{
                  position: 'absolute', top: '-15px', left: '50%', transform: 'translateX(-50%)',
                  background: '#0288D1', color: '#fff', padding: '6px 20px', borderRadius: '50px',
                  fontSize: '12px', fontWeight: 700, textTransform: 'uppercase'
                }}>
                  Recommended
                </div>
              )}

              <div style={{ marginBottom: '30px' }}>
                <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#1E293B', marginBottom: '10px' }}>{p.name}</h3>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                  <span style={{ fontSize: '14px', fontWeight: 600, color: '#64748B' }}>PKR</span>
                  <span style={{ fontSize: '36px', fontWeight: 800, color: '#0F172A' }}>
                    {p.price.toLocaleString('en-PK')}
                  </span>
                  <span style={{ fontSize: '14px', color: '#64748B' }}>/month</span>
                </div>
                <p style={{ color: '#64748B', fontSize: '15px', marginTop: '10px' }}>{p.tagline}</p>
              </div>

              <div style={{ flexGrow: 1, marginBottom: '30px' }}>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {p.features.map((feat) => (
                    <li key={feat} style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#475569', fontSize: '15px' }}>
                      <div style={{ 
                        width: '20px', height: '20px', borderRadius: '50%', background: '#E0F2FE', 
                        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 
                      }}>
                        <Check size={12} color="#0288D1" strokeWidth={3} />
                      </div>
                      {feat}
                    </li>
                  ))}
                </ul>
              </div>

              <button style={{
                width: '100%',
                padding: '16px',
                borderRadius: '16px',
                border: 'none',
                background: p.featured ? '#0288D1' : '#F1F5F9',
                color: p.featured ? '#fff' : '#1E293B',
                fontSize: '16px',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                transition: 'all 0.3s ease'
              }}>
                {p.cta} <ArrowRight size={18} />
              </button>
            </motion.div>
          ))}
        </div>

        {/* Bottom Note */}
        <p style={{ textAlign: 'center', marginTop: '40px', color: '#64748B', fontSize: '14px' }}>
          Need a custom plan for 10+ branches? <span style={{ color: '#0288D1', fontWeight: 600, cursor: 'pointer' }}>Talk to us</span>.
        </p>
      </div>
    </section>
  );
}