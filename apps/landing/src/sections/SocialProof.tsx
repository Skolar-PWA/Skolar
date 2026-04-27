import { CountUp } from '../components/CountUp';

export function SocialProof() {
  return (
    <section
      style={{
        background: '#F0F9FF', // Bohat light blue background (Clean look)
        color: '#0288D1', // Primary blue color for text
        padding: '60px 0',
        borderTop: '1px solid rgba(2, 136, 209, 0.1)',
      }}
    >
      <div
        className="container"
        style={{
          maxWidth: '1100px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-around', // Stats ke darmiyan barabar jagah
          gap: 30,
          flexWrap: 'wrap',
          fontFamily: '"Inter", sans-serif',
          textAlign: 'center',
        }}
      >
        {/* Stat Item 1 */}
        <div style={{ flex: '1', minWidth: '200px' }}>
          <div style={{ 
            fontSize: '42px', 
            fontWeight: 800, 
            color: '#01579B', // Deep blue for numbers
            marginBottom: '8px' 
          }}>
            <CountUp to={200} suffix="+" />
          </div>
          <div style={{ 
            fontSize: '16px', 
            fontWeight: 500, 
            color: '#546E7A', 
            textTransform: 'uppercase', 
            letterSpacing: '1px' 
          }}>
            Partner Schools
          </div>
        </div>

        {/* Vertical Divider (Optional - for desktop) */}
        <div style={{ width: '1px', background: 'rgba(2, 136, 209, 0.2)', alignSelf: 'stretch' }} className="hide-mobile" />

        {/* Stat Item 2 */}
        <div style={{ flex: '1', minWidth: '200px' }}>
          <div style={{ 
            fontSize: '42px', 
            fontWeight: 800, 
            color: '#01579B', 
            marginBottom: '8px' 
          }}>
            <CountUp to={1000} suffix="+" />
          </div>
          <div style={{ 
            fontSize: '16px', 
            fontWeight: 500, 
            color: '#546E7A', 
            textTransform: 'uppercase', 
            letterSpacing: '1px' 
          }}>
            Students Managed
          </div>
        </div>

        {/* Vertical Divider */}
        <div style={{ width: '1px', background: 'rgba(2, 136, 209, 0.2)', alignSelf: 'stretch' }} className="hide-mobile" />

        {/* Stat Item 3 */}
        <div style={{ flex: '1', minWidth: '200px' }}>
          <div style={{ 
            fontSize: '42px', 
            fontWeight: 800, 
            color: '#7CB342', // Green color for growth/adoption
            marginBottom: '8px' 
          }}>
            <CountUp to={10} suffix="+" />
          </div>
          <div style={{ 
            fontSize: '16px', 
            fontWeight: 500, 
            color: '#546E7A', 
            textTransform: 'uppercase', 
            letterSpacing: '1px' 
          }}>
            Cities Reached
          </div>
        </div>
      </div>
    </section>
  );
}