export function Footer() {
  return (
    <footer
      style={{
        background: '#050812',
        color: 'rgba(255,255,255,0.65)',
        padding: '56px 0 32px',
        borderTop: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      <div className="container">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: 32,
            marginBottom: 40,
          }}
        >
          <div>
            <div
              style={{
                fontFamily: 'var(--font-heading)',
                fontWeight: 700,
                fontSize: 18,
                color: '#fff',
                marginBottom: 10,
              }}
            >
              EduPortal
            </div>
            <div style={{ fontSize: 13, lineHeight: 1.6 }}>
              Modern school management, built for Pakistan.
            </div>
          </div>
          <FooterCol title="Product" items={['Features', 'Pricing', 'Roadmap', 'Changelog']} />
          <FooterCol title="Company" items={['About', 'Blog', 'Careers', 'Contact']} />
          <FooterCol title="Support" items={['Documentation', 'Help Center', 'WhatsApp Support']} />
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            paddingTop: 24,
            borderTop: '1px solid rgba(255,255,255,0.06)',
            fontSize: 13,
            flexWrap: 'wrap',
            gap: 12,
          }}
        >
          <div>© {new Date().getFullYear()} EduPortal. Made in Pakistan.</div>
          <div style={{ display: 'flex', gap: 16 }}>
            <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Twitter</a>
            <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>LinkedIn</a>
            <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>WhatsApp</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <div
        style={{
          color: '#fff',
          fontFamily: 'var(--font-heading)',
          fontWeight: 700,
          fontSize: 13,
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          marginBottom: 14,
        }}
      >
        {title}
      </div>
      <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: 10, fontSize: 14 }}>
        {items.map((i) => (
          <li key={i}>
            <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>{i}</a>
          </li>
        ))}
      </ul>
    </div>
  );
}
