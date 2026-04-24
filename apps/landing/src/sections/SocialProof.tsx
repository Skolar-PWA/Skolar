import { CountUp } from '../components/CountUp';

export function SocialProof() {
  return (
    <section
      style={{
        background: '#0E1528',
        color: 'rgba(255,255,255,0.8)',
        padding: '48px 0',
        borderTop: '1px solid rgba(255,255,255,0.06)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      <div
        className="container"
        style={{
          display: 'flex',
          justifyContent: 'center',
          gap: 48,
          flexWrap: 'wrap',
          fontFamily: 'var(--font-heading)',
          fontSize: 16,
          textAlign: 'center',
        }}
      >
        <div>
          Trusted by <strong style={{ color: '#fff' }}><CountUp to={50} suffix="+" /></strong> schools
        </div>
        <div>
          <strong style={{ color: '#fff' }}><CountUp to={25000} suffix="+" /></strong> students managed
        </div>
        <div>
          <strong style={{ color: '#fff' }}><CountUp to={98} suffix="%" /></strong> teacher adoption
        </div>
      </div>
    </section>
  );
}
