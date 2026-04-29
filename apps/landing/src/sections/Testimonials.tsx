import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { useState, useEffect } from 'react';

const QUOTES = [
  {
    quote: "We eliminated four physical registers in the first week. Our teachers actually prefer this to paper.",
    name: 'Ayesha Khan',
    title: 'Principal, Horizon School',
    img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop'
  },
  {
    quote: "Parents now get results the moment we release them. No more WhatsApp groups, no more phone calls.",
    name: 'Omar Sheikh',
    title: 'Director, Crescent Academy',
    img: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop'
  },
  {
    quote: "The offline attendance is a game changer. Even when our internet drops, teachers keep working.",
    name: 'Fatima Raza',
    title: 'Admin, Bloomfield High',
    img: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop'
  },
];

export function Testimonials() {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const nextStep = () => {
    setDirection(1);
    setIndex((prev) => (prev === QUOTES.length - 1 ? 0 : prev + 1));
  };

  const prevStep = () => {
    setDirection(-1);
    setIndex((prev) => (prev === 0 ? QUOTES.length - 1 : prev - 1));
  };

  // Auto-play feature
  useEffect(() => {
    const timer = setInterval(nextStep, 5000);
    return () => clearInterval(timer);
  }, [index]);

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 200 : -200,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 200 : -200,
      opacity: 0,
    }),
  };

  return (
    <section id='testimonials' style={{ padding: '100px 20px', background: '#fff' }}>
      <div className="container" style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          style={{ marginBottom: '50px' }}
        >
          <span style={{ color: '#0288D1', fontWeight: 700, textTransform: 'uppercase', fontSize: '14px', letterSpacing: '1px' }}>
            Loved by school leaders
          </span>
          <h2 style={{ fontSize: '36px', fontWeight: 800, color: '#01579B', marginTop: '10px' }}>
            Real schools. Real results.
          </h2>
        </motion.div>

        <div style={{ position: 'relative', minHeight: '350px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>

          {/* Left Arrow */}
          <button
            onClick={prevStep}
            style={{
              position: 'absolute', left: '-60px', zIndex: 10, background: '#fff', border: '1px solid #E1F5FE',
              borderRadius: '50%', width: '50px', height: '50px', cursor: 'pointer', display: 'flex',
              alignItems: 'center', justifyContent: 'center', color: '#0288D1', boxShadow: '0 5px 15px rgba(0,0,0,0.05)'
            }}
          >
            <ChevronLeft size={24} />
          </button>

          {/* Testimonial Card */}
          <div style={{ width: '100%', overflow: 'hidden', position: 'relative' }}>
            <AnimatePresence initial={false} custom={direction} mode="wait">
              <motion.div
                key={index}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.4, ease: 'easeInOut' }}
                style={{
                  background: '#F0F9FF',
                  padding: '50px',
                  borderRadius: '35px',
                  position: 'relative'
                }}
              >
                <Quote size={40} style={{ position: 'absolute', top: '20px', left: '20px', color: '#B3E5FC', opacity: 0.5 }} />

                <p style={{ fontSize: '20px', color: '#263238', lineHeight: 1.6, fontStyle: 'italic', marginBottom: '30px', fontWeight: 500 }}>
                  &ldquo;{QUOTES[index].quote}&rdquo;
                </p>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '15px' }}>
                  <img
                    src={QUOTES[index].img}
                    alt={QUOTES[index].name}
                    style={{ width: '60px', height: '60px', borderRadius: '50%', objectFit: 'cover', border: '3px solid #fff' }}
                  />
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ fontWeight: 700, fontSize: '18px', color: '#01579B' }}>{QUOTES[index].name}</div>
                    <div style={{ color: '#546E7A', fontSize: '14px' }}>{QUOTES[index].title}</div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Right Arrow */}
          <button
            onClick={nextStep}
            style={{
              position: 'absolute', right: '-60px', zIndex: 10, background: '#fff', border: '1px solid #E1F5FE',
              borderRadius: '50%', width: '50px', height: '50px', cursor: 'pointer', display: 'flex',
              alignItems: 'center', justifyContent: 'center', color: '#0288D1', boxShadow: '0 5px 15px rgba(0,0,0,0.05)'
            }}
          >
            <ChevronRight size={24} />
          </button>
        </div>

        {/* Dots Indicator */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '30px' }}>
          {QUOTES.map((_, i) => (
            <div
              key={i}
              onClick={() => setIndex(i)}
              style={{
                width: i === index ? '25px' : '10px',
                height: '10px',
                borderRadius: '10px',
                background: i === index ? '#0288D1' : '#B3E5FC',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}