import { motion, useScroll, useTransform } from 'framer-motion';
import { BarChart3, FileText, Fingerprint, TrendingUp, Users, WifiOff } from 'lucide-react';
import type { ReactNode } from 'react';
import { useRef } from 'react';

const FEATURES: { icon: ReactNode; title: string; desc: string; color: string; number: string }[] = [
  { icon: <Fingerprint size={26} />, title: 'Smart Attendance', desc: 'Mark 30 students in under 60 seconds. QR scan or manual.', color: '#0288D1', number: '01' },
  { icon: <FileText size={26} />, title: 'Digital Report Cards', desc: 'Beautiful PDFs generated instantly. Parents download from their phone.', color: '#7CB342', number: '02' },
  { icon: <TrendingUp size={26} />, title: 'Result Tracking', desc: 'Track every student across subjects and years. Spot trends early.', color: '#F9A825', number: '03' },
  { icon: <Users size={26} />, title: 'Parent Portal', desc: 'Parents see attendance and results the moment they are published.', color: '#AB47BC', number: '04' },
  { icon: <BarChart3 size={26} />, title: 'Analytics & Audits', desc: 'Which subjects need attention? Compare performance across teachers.', color: '#00ACC1', number: '05' },
  { icon: <WifiOff size={26} />, title: 'Works Offline', desc: 'No internet? No problem. Attendance syncs automatically later.', color: '#EC407A', number: '06' },
];

export function Features() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  const lineHeight = useTransform(scrollYProgress, [0.1, 0.9], ['0%', '100%']);

  return (
    <section id="features" style={{ background: '#fff', padding: '120px 20px', position: 'relative', overflow: 'hidden' }}>
      
      {/* Background Storytelling Shape */}
      <div style={{
        position: 'absolute',
        bottom: '-10%',
        left: '-5%',
        width: '400px',
        height: '400px',
        background: 'rgba(129, 212, 250, 0.1)',
        borderRadius: '50% 20% 70% 30% / 30% 60% 30% 60%',
        transform: 'rotate(-20deg)',
        pointerEvents: 'none',
        zIndex: 0
      }}/>

      <div className="container" ref={containerRef} style={{ maxWidth: '1000px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
        
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.7 }}
          style={{ textAlign: 'center', marginBottom: '100px' }}
        >
          <span style={{
            background: '#E1F5FE',
            color: '#0288D1',
            padding: '8px 24px',
            borderRadius: '50px',
            fontSize: '15px',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '1px'
          }}>
            Your Digital Journey
          </span>
          <h2 style={{ fontSize: '48px', fontWeight: 800, color: '#01579B', marginTop: '20px', lineHeight: 1.15 }}>
            A flow tailored for <br /> modern Pakistani schools.
          </h2>
        </motion.div>

        {/* Dynamic Flow Layout */}
        <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: '80px' }}>
          
          {/* Animated Central Connection Line */}
          <motion.div style={{
            position: 'absolute',
            left: 'calc(50% - 2px)',
            top: '0',
            width: '4px',
            height: lineHeight,
            background: 'linear-gradient(to bottom, #0288D1 0%, #7CB342 30%, #F9A825 50%, #AB47BC 70%, #00ACC1 90%, #EC407A 100%)',
            borderRadius: '2px',
            opacity: 0.3,
            zIndex: 0
          }} />

          {FEATURES.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-120px' }}
              transition={{ duration: 0.6, delay: 0.1 }}
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                alignItems: 'center',
                gap: '60px',
                position: 'relative',
                zIndex: 1,
                textAlign: i % 2 === 0 ? 'right' : 'left'
              }}
            >
              {/* Feature Content */}
              <div style={{ order: i % 2 === 0 ? 0 : 2 }}>
                <div style={{
                  display: 'flex',
                  justifyContent: i % 2 === 0 ? 'flex-end' : 'flex-start',
                  alignItems: 'center',
                  gap: '15px',
                  marginBottom: '15px'
                }}>
                   {i % 2 !== 0 && <span style={{fontSize: '56px', fontWeight: 900, color: `${f.color}20`}}>{f.number}</span>}
                   <div style={{
                      width: '64px',
                      height: '64px',
                      borderRadius: '20px',
                      background: f.color, 
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#fff',
                      boxShadow: `0 10px 20px ${f.color}30`,
                   }}>{f.icon}</div>
                   {i % 2 === 0 && <span style={{fontSize: '56px', fontWeight: 900, color: `${f.color}20`}}>{f.number}</span>}
                </div>
                
                <h3 style={{ fontSize: '26px', fontWeight: 800, color: '#263238', marginBottom: '10px' }}>
                  {f.title}
                </h3>
                <p style={{ color: '#607D8B', fontSize: '17px', lineHeight: 1.65, maxWidth: '440px', margin: i % 2 === 0 ? '0 0 0 auto' : '0 auto 0 0' }}>
                  {f.desc}
                </p>
              </div>

              {/* Central Dot Indicator */}
              <div style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
                  <motion.div 
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.3 }}
                    style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      background: '#fff',
                      border: `6px solid ${f.color}`,
                      boxShadow: `0 0 0 10px ${f.color}15`,
                      zIndex: 2,
                  }}/>
              </div>

            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}