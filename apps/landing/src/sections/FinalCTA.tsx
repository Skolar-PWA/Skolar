import { motion } from 'framer-motion';
import { Particles } from '../components/Particles';

export function FinalCTA() {
  return (
    <section
      id="cta"
      style={{
        position: 'relative',
        background: '#0A0F1E',
        color: '#fff',
        padding: '120px 0',
        overflow: 'hidden',
        textAlign: 'center',
      }}
    >
      <div className="glow-orb" />
      <Particles count={28} />
      <div className="container" style={{ position: 'relative' }}>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 'clamp(36px, 5vw, 56px)',
            fontWeight: 800,
            lineHeight: 1.1,
            letterSpacing: '-0.02em',
            marginBottom: 24,
          }}
        >
          Your school, running smarter.
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          style={{
            color: 'rgba(255,255,255,0.7)',
            fontSize: 18,
            maxWidth: 540,
            margin: '0 auto 32px',
          }}
        >
          Start free today. Bring your whole team onboard in minutes.
        </motion.p>
        <motion.a
          href="#"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.35 }}
          className="btn btn-light"
          style={{
            fontSize: 16,
            padding: '16px 28px',
          }}
        >
          Get Started Free — No Credit Card
        </motion.a>
      </div>
    </section>
  );
}
