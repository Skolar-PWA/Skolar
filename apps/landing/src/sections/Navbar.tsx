import { useEffect, useState, CSSProperties } from 'react';

const navItemBase: CSSProperties = {
  color: '#4A5568',
  textDecoration: 'none',
  fontSize: '15px',
  fontWeight: '600',
  display: 'flex',
  alignItems: 'center',
  gap: '4px',
  position: 'relative',
  transition: 'color 0.3s ease',
};

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '#home' },
    { name: 'Features', href: '#features' },
    // { name: 'Security', href: '#how' },
    { name: 'How It Works', href: '#how' },
    { name: 'Testimonials', href: '#testimonials' },
    { name: 'Why Skolar?', href: '#whyskolar' },
    { name: 'Pricing & Plans', href: '#pricing' },
  ];

  return (
    <nav
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        background: scrolled || isMenuOpen ? '#ffffff' : 'rgba(255, 255, 255, 0.9)',
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
          padding: scrolled ? '12px 24px' : '20px 24px',
          transition: 'padding 0.4s ease'
        }}
      >
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', zIndex: 1100 }}>
          <img
            src="/logo.png"
            alt="Skolar Logo"
            style={{ width: '32px', height: '32px', objectFit: 'contain' }}
          />
          <span style={{ fontSize: '22px', fontWeight: '800', color: '#1A202C', letterSpacing: '-0.5px' }}>
            Skolar
          </span>
        </div>

        {/* Desktop Links */}
        <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }} className="desktop-menu">
          {navLinks.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className="nav-item-hover"
              style={navItemBase}
            >
              {item.name}
            </a>
          ))}
        </div>

        {/* Desktop Buttons */}
        <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }} className="desktop-menu">
          <a href="#login" style={{ ...navItemBase, color: '#00adef' }}>
            Login
          </a>
          <a
            href="#demo"
            className="cta-button"
            style={{
              background: 'linear-gradient(135deg, #00adef 0%, #0081b3 100%)',
              color: '#fff',
              padding: '10px 22px',
              borderRadius: '10px',
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

        {/* Mobile Toggle Button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          style={{
            display: 'none',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '5px',
            zIndex: 1100
          }}
          className="mobile-toggle"
        >
          <div style={{
            width: '25px',
            height: '2px',
            backgroundColor: '#1A202C',
            margin: '6px 0',
            transition: '0.4s',
            transform: isMenuOpen ? 'rotate(-45deg) translate(-5px, 6px)' : 'none'
          }} />
          <div style={{
            width: '25px',
            height: '2px',
            backgroundColor: '#1A202C',
            margin: '6px 0',
            opacity: isMenuOpen ? 0 : 1,
            transition: '0.4s'
          }} />
          <div style={{
            width: '25px',
            height: '2px',
            backgroundColor: '#1A202C',
            margin: '6px 0',
            transition: '0.4s',
            transform: isMenuOpen ? 'rotate(45deg) translate(-5px, -7px)' : 'none'
          }} />
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <div style={{
        position: 'fixed',
        top: 0,
        right: isMenuOpen ? 0 : '-100%',
        width: '100%',
        height: '100vh',
        background: '#ffffff',
        zIndex: 1050,
        transition: 'right 0.3s ease-in-out',
        display: 'flex',
        flexDirection: 'column',
        padding: '100px 40px',
        gap: '25px'
      }}>
        {navLinks.map((item) => (
          <a
            key={item.name}
            href={item.href}
            onClick={() => setIsMenuOpen(false)}
            style={{ ...navItemBase, fontSize: '20px' }}
          >
            {item.name}
          </a>
        ))}
        <hr style={{ border: 'none', borderTop: '1px solid #eee', margin: '10px 0' }} />
        <a href="#login" style={{ ...navItemBase, fontSize: '20px', color: '#00adef' }}>Login</a>
        <a
          href="#demo"
          style={{
            background: '#00adef',
            color: '#fff',
            padding: '16px',
            borderRadius: '12px',
            textAlign: 'center',
            textDecoration: 'none',
            fontWeight: '700'
          }}
        >
          Start Free Trial
        </a>
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
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
        
        @media (max-width: 1024px) {
          .desktop-menu { display: none !important; }
          .mobile-toggle { display: block !important; }
        }
      `}} />
    </nav>
  );
}