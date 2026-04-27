import { motion } from 'framer-motion';
import { Rocket, ShieldCheck, Zap } from 'lucide-react';
import { Particles } from '../components/Particles';

export function FinalCTA() {
  return (
    <section
      id="cta"
      style={{
        position: 'relative',
        background: '#01579B', // Deep School Blue
        backgroundImage: 'radial-gradient(circle at center, #0288D1 0%, #01579B 100%)',
        color: '#fff',
        padding: '140px 20px',
        overflow: 'hidden',
        textAlign: 'center',
      }}
    >
      {/* Decorative Animated Orbs */}
      <div style={{
        position: 'absolute',
        top: '-10%',
        left: '-10%',
        width: '400px',
        height: '400px',
        background: 'rgba(129, 212, 250, 0.2)',
        filter: 'blur(80px)',
        borderRadius: '50%',
        zIndex: 0
      }} />
      
      <Particles count={35} />

      <div className="container" style={{ position: 'relative', zIndex: 1, maxWidth: '800px', margin: '0 auto' }}>
        
        {/* Trust Badges */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            gap: '20px', 
            marginBottom: '30px',
            color: 'rgba(255,255,255,0.8)',
            fontSize: '14px',
            fontWeight: 600
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <ShieldCheck size={18} color="#4FC3F7" /> No Credit Card
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Zap size={18} color="#FFD54F" /> Instant Setup
          </div>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          style={{
            fontSize: 'clamp(40px, 6vw, 64px)',
            fontWeight: 900,
            lineHeight: 1.1,
            letterSpacing: '-0.03em',
            marginBottom: 24,
            textShadow: '0 10px 30px rgba(0,0,0,0.2)'
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
            fontSize: '20px',
            maxWidth: '580px',
            margin: '0 auto 48px',
            lineHeight: 1.6
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
          <motion.a
            href="#"
            whileHover={{ scale: 1.05, boxShadow: '0 20px 40px rgba(0,0,0,0.3)' }}
            whileTap={{ scale: 0.95 }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '12px',
              background: '#fff',
              color: '#01579B',
              padding: '20px 48px',
              borderRadius: '20px',
              fontSize: '18px',
              fontWeight: 800,
              textDecoration: 'none',
              boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
              transition: 'all 0.3s ease'
            }}
          >
            Start Your 30-Day Free Trial <Rocket size={20} />
          </motion.a>
          
          <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '14px' }}>
            Friendly support available via WhatsApp
          </span>
        </motion.div>
      </div>

      {/* Glassmorphism accent shape */}
      <div style={{
        position: 'absolute',
        bottom: '-50px',
        right: '-50px',
        width: '300px',
        height: '300px',
        background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 100%)',
        backdropFilter: 'blur(10px)',
        borderRadius: '80px',
        transform: 'rotate(15deg)',
        zIndex: 0
      }} />
    </section>
  );
}