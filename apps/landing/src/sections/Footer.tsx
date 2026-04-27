import { Mail, MessageCircle, Phone, MapPin, Linkedin, Twitter } from 'lucide-react';

export function Footer() {
  return (
    <footer
      style={{
        background: '#050812',
        color: 'rgba(255,255,255,0.6)',
        padding: '80px 20px 40px',
        borderTop: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      <div className="container" style={{ maxWidth: '1100px', margin: '0 auto' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: 48,
            marginBottom: 60,
          }}
        >
          {/* Brand Column */}
          <div style={{ gridColumn: 'span 1' }}>
            <div
              style={{
                fontWeight: 800,
                fontSize: 24,
                color: '#fff',
                marginBottom: 16,
                letterSpacing: '-0.5px'
              }}
            >
              Skolar<span style={{ color: '#0288D1' }}>.</span>
            </div>
            <p style={{ fontSize: 14, lineHeight: 1.6, marginBottom: 24 }}>
              Empowering Pakistani schools with digital-first solutions. Simple, fast, and reliable.
            </p>
            <div style={{ display: 'flex', gap: 16 }}>
              <a href="#" style={{ color: 'rgba(255,255,255,0.4)', transition: '0.3s' }}><Twitter size={20} /></a>
              <a href="#" style={{ color: 'rgba(255,255,255,0.4)', transition: '0.3s' }}><Linkedin size={20} /></a>
            </div>
          </div>

          {/* Contact Information */}
          <div>
            <FooterHeading>Contact Us</FooterHeading>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: 16 }}>
              <ContactItem icon={<Mail size={16} />}>
                alihuzaifa2112006@gmail.com
              </ContactItem>
              <ContactItem icon={<Mail size={16} />}>
                hammad123@gmail.com
              </ContactItem>
              <ContactItem icon={<Phone size={16} />}>
                +92 321 2944161
              </ContactItem>
              <ContactItem icon={<MessageCircle size={16} />}>
                +92 317 8386880
              </ContactItem>
            </ul>
          </div>

          {/* Quick Links */}
          <div style={{ display: 'flex', gap: '40px' }}>
            <div>
              <FooterHeading>Product</FooterHeading>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: 12 }}>
                <FooterLink>Features</FooterLink>
                <FooterLink>Pricing</FooterLink>
                <FooterLink>Parent Portal</FooterLink>
              </ul>
            </div>
            <div>
              <FooterHeading>Legal</FooterHeading>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: 12 }}>
                <FooterLink>Privacy</FooterLink>
                <FooterLink>Terms</FooterLink>
                <FooterLink>Security</FooterLink>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingTop: 32,
            borderTop: '1px solid rgba(255,255,255,0.06)',
            fontSize: 13,
            flexWrap: 'wrap',
            gap: 16,
          }}
        >
          <div>© {new Date().getFullYear()} Skolar Management System. Made in Pakistan 🇵🇰</div>
          <div style={{ display: 'flex', gap: 24 }}>
            <span>Built for the future of education.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

// Helper Components
function FooterHeading({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      color: '#fff',
      fontWeight: 700,
      fontSize: 14,
      textTransform: 'uppercase',
      letterSpacing: '1px',
      marginBottom: 20,
    }}>
      {children}
    </div>
  );
}

function FooterLink({ children }: { children: React.ReactNode }) {
  return (
    <li>
      <a href="#" style={{ 
        color: 'inherit', 
        textDecoration: 'none', 
        fontSize: 14,
        transition: '0.2s color',
      }}
      onMouseOver={(e) => (e.currentTarget.style.color = '#0288D1')}
      onMouseOut={(e) => (e.currentTarget.style.color = 'inherit')}
      >
        {children}
      </a>
    </li>
  );
}

function ContactItem({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <li style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13 }}>
      <span style={{ color: '#0288D1' }}>{icon}</span>
      {children}
    </li>
  );
}