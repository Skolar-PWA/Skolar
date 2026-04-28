import { motion } from 'framer-motion';
import { Rocket, ShieldCheck, Zap } from 'lucide-react';

export function FinalCTA() {
  return (
    <section
      id="cta"
      style={{
        position: 'relative',
        background: '#81D4FA', // Matching Hero Background
        color: '#fff',
        padding: '120px 20px',
        overflow: 'hidden',
        textAlign: 'center',
        fontFamily: '"Inter", "Segoe UI", sans-serif',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      {/* Decorative Blob from Hero Section - Positioned Bottom Left */}
      <div style={{
        position: 'absolute',
        bottom: '-10%',
        left: '-5%',
        width: '450px',
        height: '450px',
        border: '8px solid rgba(255,255,255,0.2)',
        borderRadius: '40% 60% 70% 30% / 40% 50% 60% 70%',
        pointerEvents: 'none',
        transform: 'rotate(-15deg)',
        zIndex: 0
      }} />

      {/* Second Blob - Positioned Top Right */}
      <div style={{
        position: 'absolute',
        top: '5%',
        right: '-5%',
        width: '300px',
        height: '300px',
        border: '6px solid rgba(255,255,255,0.15)',
        borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%',
        pointerEvents: 'none',
        transform: 'rotate(15deg)',
        zIndex: 0
      }} />

      <div className="container" style={{ position: 'relative', zIndex: 1, maxWidth: '850px', margin: '0 auto' }}>

        {/* Trust Badges - Updated colors to match Hero theme */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '24px',
            marginBottom: '32px',
            color: 'rgba(255,255,255,0.95)',
            fontSize: '15px',
            fontWeight: 600
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShieldCheck size={20} color="#fff" /> No Credit Card Required
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Zap size={20} color="#fff" /> Instant Setup
          </div>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          style={{
            fontSize: 'clamp(36px, 5vw, 64px)',
            fontWeight: 800,
            lineHeight: 1.1,
            letterSpacing: '-1px',
            marginBottom: 28,
          }}
        >
          Ready to transform <br /> your school?
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          style={{
            color: 'rgba(255,255,255,0.9)',
            fontSize: '22px',
            maxWidth: '600px',
            margin: '0 auto 48px',
            lineHeight: 1.5,
            opacity: 0.9
          }}
        >
          Join 50+ modern Pakistani schools managing attendance,
          results, and parents with Skolar.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}
        >
          {/* Primary Button - Matching Hero "See Pricing" style for high contrast */}
          <motion.a
            href="#"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '12px',
              background: '#fff',
              color: '#0288D1',
              padding: '16px 40px',
              borderRadius: '50px',
              fontSize: '18px',
              fontWeight: 700,
              textDecoration: 'none',
              boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
              transition: 'all 0.3s ease'
            }}
          >
            Start Your 30-Day Free Trial <Rocket size={20} />
          </motion.a>

          <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: '15px', fontWeight: 500 }}>
            Friendly support available via WhatsApp
          </span>
        </motion.div>
      </div>
    </section>
  );
}