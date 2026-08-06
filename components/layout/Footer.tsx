'use client';
import Link from 'next/link';

const FOOTER_LINKS = {
  Marketplace: [
    { href: '/marketplace', label: 'Browse Skins' },
    { href: '/marketplace?sort=newest', label: 'New Arrivals' },
    { href: '/marketplace?sort=price_asc', label: 'Best Prices' },
    { href: '/marketplace?filter=stattrak', label: 'StatTrak™' },
  ],
  Sellers: [
    { href: '/auth/signup', label: 'Become a Seller' },
    { href: '/seller/dashboard', label: 'Seller Dashboard' },
    { href: '/docs/seller-guide', label: 'Seller Guide' },
    { href: '/support', label: 'Seller Support' },
  ],
  Company: [
    { href: '/about', label: 'About cs2bd' },
    { href: '/blog', label: 'Blog' },
    { href: '/support', label: 'Help Center' },
    { href: '/privacy', label: 'Privacy Policy' },
  ],
};

export default function Footer() {
  return (
    <footer style={{ borderTop: '1px solid var(--border)', marginTop: '5rem', paddingTop: '3rem', paddingBottom: '2rem' }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '2.5rem', marginBottom: '3rem' }}>
          {/* Brand col */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <span style={{ width: 24, height: 24, background: 'linear-gradient(135deg, #ff6a00, #ff3d81)', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.65rem' }}>⚡</span>
              <span className="gradient-text" style={{ fontWeight: 900, fontSize: '1rem', letterSpacing: '-0.02em' }}>CS2BD</span>
            </div>
            <p style={{ fontSize: '0.82rem', color: 'var(--muted)', lineHeight: '1.7', maxWidth: 220 }}>
              Bangladesh's first dedicated CS2 skins marketplace — secure, verified, community-driven.
            </p>
          </div>

          {/* Link columns */}
          {Object.entries(FOOTER_LINKS).map(([section, links]) => (
            <div key={section}>
              <p className="label" style={{ marginBottom: '0.875rem' }}>{section}</p>
              <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {links.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="footer-link">{l.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <p style={{ fontSize: '0.78rem', color: 'var(--muted)', margin: 0 }}>
            © {new Date().getFullYear()} cs2bd. Not affiliated with Valve Corporation.
          </p>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <Link href="/terms" style={{ fontSize: '0.78rem', color: 'var(--muted)', textDecoration: 'none' }}>Terms</Link>
            <Link href="/privacy" style={{ fontSize: '0.78rem', color: 'var(--muted)', textDecoration: 'none' }}>Privacy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
