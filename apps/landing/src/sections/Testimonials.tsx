import { motion } from 'framer-motion';

const QUOTES = [
  {
    quote:
      'We eliminated four physical registers in the first week. Our teachers actually prefer this to paper.',
    name: 'Ayesha Khan',
    title: 'Principal, Horizon School',
  },
  {
    quote:
      'Parents now get results the moment we release them. No more WhatsApp groups, no more phone calls.',
    name: 'Omar Sheikh',
    title: 'Director, Crescent Academy',
  },
  {
    quote:
      'The offline attendance is a game changer. Even when our internet drops, teachers keep working.',
    name: 'Fatima Raza',
    title: 'Admin, Bloomfield High',
  },
];

export function Testimonials() {
  return (
    <section className="section section-tinted">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{ textAlign: 'center', marginBottom: 48 }}
        >
          <div className="section-kicker">Loved by school leaders</div>
          <h2 className="section-title">Real schools. Real results.</h2>
        </motion.div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: 24,
          }}
        >
          {QUOTES.map((q, i) => (
            <motion.div
              key={q.name}
              className="testimonial"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <div
                style={{
                  fontSize: 16,
                  lineHeight: 1.6,
                  color: 'var(--color-text-primary)',
                  marginBottom: 20,
                }}
              >
                &ldquo;{q.quote}&rdquo;
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    background: 'var(--color-primary-light)',
                    color: 'var(--color-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    fontFamily: 'var(--font-heading)',
                  }}
                >
                  {q.name
                    .split(' ')
                    .map((x) => x[0])
                    .slice(0, 2)
                    .join('')}
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 14 }}>{q.name}</div>
                  <div style={{ color: 'var(--color-text-muted)', fontSize: 13 }}>{q.title}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
