import { motion } from 'framer-motion';

const STEPS = [
  {
    n: '01',
    title: 'Register your school',
    desc: 'Add your classes, subjects, and staff in minutes.',
    color: '#0288D1'
  },
  {
    n: '02',
    title: 'Import your students',
    desc: 'Upload your existing Excel sheet or add them one by one.',
    color: '#7CB342'
  },
  {
    n: '03',
    title: 'Go live',
    desc: 'Teachers mark attendance. Parents see it instantly.',
    color: '#F9A825'
  },
];

export function HowItWorks() {
  return (
    <section id="how" style={{ 
      padding: '100px 20px', 
      background: '#F0F9FF', // Light sky blue background to match theme
      position: 'relative',
      overflow: 'hidden'
    }}>
      <div className="container" style={{ maxWidth: '1100px', margin: '0 auto' }}>
        
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{ textAlign: 'center', marginBottom: 64 }}
        >
          <span style={{
            background: '#fff',
            color: '#0288D1',
            padding: '6px 16px',
            borderRadius: '50px',
            fontSize: '14px',
            fontWeight: 700,
            boxShadow: '0 4px 10px rgba(2, 136, 209, 0.1)'
          }}>
            Quick Setup
          </span>
          <h2 style={{ 
            fontSize: '40px', 
            fontWeight: 800, 
            color: '#01579B', // Deep blue heading
            marginTop: '20px' 
          }}>
            From register to portal in three steps.
          </h2>
          <p style={{
            color: '#546E7A',
            fontSize: '18px',
            maxWidth: '560px',
            margin: '15px auto 0',
          }}>
            No training required. Your teachers will love it.
          </p>
        </motion.div>

        {/* Steps Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 40,
          position: 'relative',
        }}>
          {STEPS.map((s, i) => (
            <motion.div
              key={s.n}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              whileHover={{ y: -5 }}
              style={{ 
                position: 'relative', 
                textAlign: 'left',
                background: '#fff',
                padding: '40px 30px',
                borderRadius: '24px',
                boxShadow: '0 10px 30px rgba(0,0,0,0.04)',
                border: '1px solid rgba(2, 136, 209, 0.05)'
              }}
            >
              {/* Big Outline Number */}
              <div style={{
                fontSize: '64px',
                fontWeight: 900,
                color: 'transparent',
                WebkitTextStroke: `2px ${s.color}30`, // 30% opacity of step color
                lineHeight: 1,
                marginBottom: 20,
              }}>
                {s.n}
              </div>

              <h3 style={{ 
                color: '#263238', 
                fontSize: '22px', 
                fontWeight: 700,
                marginBottom: '12px' 
              }}>
                {s.title}
              </h3>
              
              <p style={{ 
                color: '#607D8B', 
                lineHeight: 1.6,
                fontSize: '16px' 
              }}>
                {s.desc}
              </p>

              {/* Bottom accent bar */}
              <div style={{
                position: 'absolute',
                bottom: '0',
                left: '30px',
                right: '30px',
                height: '4px',
                background: s.color,
                borderRadius: '10px 10px 0 0',
                opacity: 0.6
              }} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}