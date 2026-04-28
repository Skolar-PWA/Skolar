import { Mail, MessageCircle, Phone, Linkedin, Twitter, ExternalLink } from 'lucide-react';

export function Footer() {
  return (
    <footer
      style={{
        background: '#F0F9FF', // Light theme background to match your sections
        color: '#455A64', // Darker slate for readability
        padding: '80px 20px 40px',
        borderTop: '1px solid #E1F5FE',
      }}
    >
      <div className="container" style={{ maxWidth: '1100px', margin: '0 auto' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: 48,
            marginBottom: 60,
          }}
        >
          {/* Brand Column */}
          <div>
            <div
              style={{
                fontWeight: 900,
                fontSize: 28,
                color: '#01579B',
                marginBottom: 16,
                letterSpacing: '-1px'
              }}
            >
              Skolar<span style={{ color: '#0288D1' }}>.</span>
            </div>
            <p style={{ fontSize: 15, lineHeight: 1.6, marginBottom: 24, color: '#546E7A' }}>
              Building the next generation of school management tools for Pakistan. 
              Efficiency in every classroom.
            </p>
            <div style={{ display: 'flex', gap: 12 }}>
              <SocialIcon icon={<Twitter size={18} />} />
              <SocialIcon icon={<Linkedin size={18} />} />
            </div>
          </div>

          {/* Contact Information */}
          <div>
            <FooterHeading>Get in Touch</FooterHeading>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: 14 }}>
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
          <div style={{ display: 'flex', gap: '60px' }}>
            <div>
              <FooterHeading>Product</FooterHeading>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: 12 }}>
                <FooterLink>Features</FooterLink>
                <FooterLink>Pricing</FooterLink>
                <FooterLink>Parent Portal</FooterLink>
              </ul>
            </div>
            <div>
              <FooterHeading>Support</FooterHeading>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: 12 }}>
                <FooterLink>Privacy Policy</FooterLink>
                <FooterLink>Terms of Use</FooterLink>
                <FooterLink>Help Center</FooterLink>
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
            borderTop: '1px solid #E1F5FE',
            fontSize: 14,
            flexWrap: 'wrap',
            gap: 16,
            color: '#90A4AE'
          }}
        >
          <div>© {new Date().getFullYear()} Skolar. Built with ❤️ in Pakistan 🇵🇰</div>
          <div style={{ display: 'flex', gap: 24, fontWeight: 500, color: '#546E7A' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              Status: Online <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#4CAF50' }} />
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}

// Sub-components for cleaner code
function FooterHeading({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      color: '#01579B',
      fontWeight: 800,
      fontSize: 13,
      textTransform: 'uppercase',
      letterSpacing: '1.2px',
      marginBottom: 24,
    }}>
      {children}
    </div>
  );
}

function FooterLink({ children }: { children: React.ReactNode }) {
  return (
    <li>
      <a href="#" style={{ 
        color: '#546E7A', 
        textDecoration: 'none', 
        fontSize: 14,
        transition: '0.2s all',
      }}
      onMouseOver={(e) => (e.currentTarget.style.color = '#0288D1')}
      onMouseOut={(e) => (e.currentTarget.style.color = '#546E7A')}
      >
        {children}
      </a>
    </li>
  );
}

function ContactItem({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <li style={{ 
      display: 'flex', 
      alignItems: 'center', 
      gap: 12, 
      fontSize: 14, 
      color: '#455A64',
      background: '#fff',
      padding: '8px 12px',
      borderRadius: '10px',
      border: '1px solid #E1F5FE'
    }}>
      <span style={{ color: '#0288D1' }}>{icon}</span>
      {children}
    </li>
  );
}

function SocialIcon({ icon }: { icon: React.ReactNode }) {
  return (
    <a href="#" style={{
      width: 36,
      height: 36,
      borderRadius: '10px',
      background: '#fff',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#0288D1',
      border: '1px solid #E1F5FE',
      transition: '0.3s'
    }}>
      {icon}
    </a>
  );
}