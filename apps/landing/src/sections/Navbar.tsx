import { useEffect, useState , CSSProperties} from 'react';

// Moving styles outside prevents the component from re-creating 
// the object on every render and helps avoid linter "red lines".
const navItemBase: CSSProperties = {
  color: '#4A5568',
  textDecoration: 'none',
  fontSize: '14px',
  fontWeight: '600',
  display: 'flex',
  alignItems: 'center',
  gap: '4px',
  position: 'relative', // TypeScript now knows this is a valid CSS position
  transition: 'color 0.3s ease',
};

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        background: scrolled ? 'rgba(255, 255, 255, 0.8)' : '#ffffff',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        boxShadow: scrolled ? '0 10px 30px -10px rgba(0,0,0,0.1)' : 'none',
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        borderBottom: scrolled ? '1px solid rgba(0,0,0,0.05)' : '1px solid #f0f0f0'
      }}
    >
      <div
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: scrolled ? '10px 24px' : '18px 24px',
          transition: 'padding 0.4s ease'
        }}
      >
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
          <img
            src="/logo.png"
            alt="Skolar Logo"
            style={{ width: '36px', height: '36px', objectFit: 'contain' }}
          />
          <span style={{ fontSize: '24px', fontWeight: '800', color: '#1A202C' }}>
            Skolar
          </span>
        </div>

        {/* Links */}
        <div style={{ display: 'flex', gap: '28px', alignItems: 'center' }} className="nav-links">
          {['Home', 'Features', 'Security', 'Testimonials', 'Why Skolar?'].map((item) => (
            <a 
              key={item} 
              href={`#${item.toLowerCase().replace(' ', '')}`} 
              className="nav-item-hover"
              style={navItemBase}
            >
              {item}
            </a>
          ))}
          
          {/* FIXED PRICING LINK */}
          <a 
            href="#pricing" 
            className="nav-item-hover" 
            style={{ ...navItemBase, color: '#2D3748' }}
          >
            Pricing & Plans
          </a>
        </div>

        {/* Buttons */}
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          <a href="#login" style={{ ...navItemBase, color: '#00adef' }}>
            Login
          </a>
          <a
            href="#demo"
            className="cta-button"
            style={{
              background: 'linear-gradient(135deg, #00adef 0%, #0081b3 100%)',
              color: '#fff',
              padding: '12px 28px',
              borderRadius: '12px',
              textDecoration: 'none',
              fontWeight: '700',
              fontSize: '14px',
              boxShadow: '0 4px 15px rgba(0, 173, 239, 0.3)',
              transition: 'all 0.3s ease'
            }}
          >
            Start Free Trial
          </a>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .nav-item-hover::after {
          content: '';
          position: absolute;
          width: 0;
          height: 2px;
          bottom: -4px;
          left: 0;
          background-color: #00adef;
          transition: width 0.3s ease;
        }
        .nav-item-hover:hover::after { width: 100%; }
        .nav-item-hover:hover { color: #00adef !important; }
        .cta-button:hover { transform: translateY(-2px); filter: brightness(1.1); }
        @media (max-width: 1024px) { .nav-links { display: none; } }
      `}} />
    </nav>
  );
}