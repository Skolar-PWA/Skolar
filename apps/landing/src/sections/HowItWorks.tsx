import { motion } from 'framer-motion';

const STEPS = [
  {
    n: '01',
    title: 'Register your school',
    desc: 'Add your classes, subjects, and staff in minutes.',
  },
  {
    n: '02',
    title: 'Import your students',
    desc: 'Upload your existing Excel sheet or add them one by one.',
  },
  {
    n: '03',
    title: 'Go live',
    desc: 'Teachers mark attendance. Parents see it instantly.',
  },
];

export function HowItWorks() {
  return (
    <section id="how" className="section section-dark" style={{ position: 'relative' }}>
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{ textAlign: 'center', marginBottom: 56 }}
        >
          <div className="section-kicker">How it works</div>
          <h2 className="section-title" style={{ color: '#fff' }}>
            From register to portal in three steps.
          </h2>
          <p
            style={{
              color: 'rgba(255,255,255,0.65)',
              fontSize: 17,
              maxWidth: 560,
              margin: '0 auto',
            }}
          >
            No training required. Your teachers will love it.
          </p>
        </motion.div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: 32,
            position: 'relative',
          }}
        >
          {STEPS.map((s, i) => (
            <motion.div
              key={s.n}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.5, delay: i * 0.12 }}
              style={{ position: 'relative', textAlign: 'left' }}
            >
              <div
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: 72,
                  fontWeight: 800,
                  color: 'transparent',
                  WebkitTextStroke: '1px rgba(255,255,255,0.3)',
                  lineHeight: 1,
                  marginBottom: 12,
                }}
              >
                {s.n}
              </div>
              <h3 style={{ color: '#fff', fontSize: 22, marginBottom: 8 }}>{s.title}</h3>
              <p style={{ color: 'rgba(255,255,255,0.65)', lineHeight: 1.6 }}>{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
