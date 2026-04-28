import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

const TITLE_TOP = 'Streamline Your'.split(' ');
const TITLE_BOTTOM = 'School Operations'.split(' ');

function AnimatedWords({ words, delay = 0 }: { words: string[]; delay?: number }) {
  return (
    <>
      {words.map((w, i) => (
        <motion.span
          key={`${w}-${i}`}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: delay + i * 0.05 }}
          style={{ display: 'inline-block', marginRight: '0.25em' }}
        >
          {w}
        </motion.span>
      ))}
    </>
  );
}

export function Hero() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <section
      style={{
        position: 'relative',
        minHeight: isMobile ? 'auto' : '90vh',
        background: '#81D4FA',
        color: '#fff',
        display: 'flex',
        alignItems: 'center',
        padding: isMobile ? '120px 20px 60px' : '100px 20px',
        overflow: 'hidden',
        fontFamily: '"Inter", "Segoe UI", sans-serif'
      }}
    >
      {/* Decorative Circle (Hidden on small mobile for cleaner look) */}
      {!isMobile && (
        <div style={{
          position: 'absolute',
          top: '10%',
          right: '2%',
          width: '500px',
          height: '500px',
          border: '8px solid rgba(255,255,255,0.2)',
          borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%',
          pointerEvents: 'none',
          transform: 'rotate(15deg)'
        }} />
      )}

      <div className="hero-container" style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : '1.1fr 0.9fr',
        gap: isMobile ? '60px' : '40px',
        alignItems: 'center',
        position: 'relative',
        zIndex: 2,
        textAlign: isMobile ? 'center' : 'left'
      }}>

        {/* Left Side: Text Content */}
        <div style={{ paddingRight: isMobile ? '0' : '20px' }}>
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            style={{
              fontSize: isMobile ? '16px' : '20px',
              fontWeight: 600,
              marginBottom: '16px',
              letterSpacing: '0.5px',
              color: 'rgba(255, 255, 255, 0.9)'
            }}
          >
            The Early Childhood Platform
          </motion.p>

          <h1 style={{
            fontSize: isMobile ? '42px' : '72px',
            fontWeight: 800,
            lineHeight: 1.1,
            marginBottom: '24px',
            letterSpacing: '-1px'
          }}>
            <div style={{ display: 'block' }}>
              <AnimatedWords words={TITLE_TOP} />
            </div>
            <div style={{ display: 'block' }}>
              <AnimatedWords words={TITLE_BOTTOM} delay={0.4} />
            </div>
          </h1>

          <p style={{
            fontSize: isMobile ? '18px' : '22px',
            marginBottom: '40px',
            opacity: 0.9,
            lineHeight: 1.5,
            maxWidth: isMobile ? '100%' : '540px',
            marginInline: isMobile ? 'auto' : '0'
          }}>
            Empowering educators and families to collaborate and nurture children together on a digital platform.
          </p>

          <div style={{
            display: 'flex',
            gap: '14px',
            justifyContent: isMobile ? 'center' : 'flex-start',
            flexWrap: 'wrap'
          }}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{
                padding: '12px 28px',
                borderRadius: '50px',
                border: 'none',
                background: '#0288D1',
                color: 'white',
                fontWeight: 600,
                cursor: 'pointer',
                fontSize: '15px',
                boxShadow: '0 8px 20px rgba(0,0,0,0.1)'
              }}
            >
              Watch Tutorial
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{
                padding: '12px 28px',
                borderRadius: '50px',
                border: '2px solid white',
                background: 'white',
                color: '#0288D1',
                fontWeight: 600,
                cursor: 'pointer',
                fontSize: '15px',
                boxShadow: '0 8px 20px rgba(0,0,0,0.05)'
              }}
            >
              See Pricing
            </motion.button>
          </div>
        </div>

        {/* Right Side: Image Content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          style={{
            position: 'relative',
            justifySelf: isMobile ? 'center' : 'end',
            width: isMobile ? '100%' : 'auto',
            maxWidth: '500px'
          }}
        >
          <div style={{
            position: 'relative',
            borderRadius: isMobile ? '24px' : '40px',
            overflow: 'hidden',
            boxShadow: '0 30px 60px -12px rgba(0,0,0,0.3)',
            background: '#fff',
            border: isMobile ? '4px solid rgba(255,255,255,0.3)' : '8px solid rgba(255,255,255,0.3)'
          }}>
            <img
              src="/teacher.jpg"
              alt="Teacher and Student"
              style={{
                width: '100%',
                height: 'auto',
                display: 'block',
                objectFit: 'cover'
              }}
            />
          </div>

          {/* Floating Badge */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 1, type: 'spring', stiffness: 260, damping: 20 }}
            style={{
              position: 'absolute',
              bottom: isMobile ? '-10px' : '-20px',
              left: isMobile ? '50%' : '-40px',
              transform: isMobile ? 'translateX(-50%)' : 'none',
              background: '#fff',
              padding: isMobile ? '12px 20px' : '20px 30px',
              borderRadius: '24px',
              boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              border: '1px solid #E1F5FE',
              width: isMobile ? 'max-content' : 'auto'
            }}
          >
            <div style={{
              background: '#7CB342',
              padding: '8px',
              borderRadius: '10px',
              color: '#fff',
              display: 'flex'
            }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
              </svg>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
              <span style={{ fontWeight: 800, fontSize: isMobile ? '12px' : '14px', color: '#01579B' }}>
                Trusted by 200+ Schools
              </span>
              <span style={{ fontSize: isMobile ? '10px' : '12px', color: '#546E7A' }}>
                All over Pakistan
              </span>
            </div>
          </motion.div>
        </motion.div>

      </div>
    </section>
  );
}