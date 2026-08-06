import Link from 'next/link';

export const metadata = {
  title: 'About Us | cs2bd - Bangladesh CS2 Marketplace',
  description: 'Learn about cs2bd, the premier peer-to-peer Counter-Strike 2 item marketplace built specifically for traders and gamers in Bangladesh.',
};

export default function AboutPage() {
  return (
    <main className="container" style={{ padding: '3rem 1rem', maxWidth: 900 }}>
      <div style={{ marginBottom: '2.5rem' }}>
        <span className="badge badge-accent" style={{ marginBottom: '0.75rem' }}>Our Story</span>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '1rem', color: '#fff' }}>
          About <span className="gradient-text">CS2BD</span>
        </h1>
        <p style={{ fontSize: '1.1rem', color: 'var(--muted)', lineHeight: '1.7' }}>
          cs2bd was born out of a simple need: Bangladeshi CS2 traders and gamers lacked a fast, secure, and local platform for buying and selling Counter-Strike 2 skins without high foreign fees or scam risks.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
        <div className="card-glass" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1.2rem', color: '#fff', marginBottom: '0.5rem' }}>🇧🇩 Tailored for Bangladesh</h3>
          <p style={{ fontSize: '0.9rem', color: 'var(--muted)', lineHeight: '1.6' }}>
            Instant transactions powered by bKash, Nagad, and personal send-money verification with zero hidden currency conversion fees.
          </p>
        </div>
        <div className="card-glass" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1.2rem', color: '#fff', marginBottom: '0.5rem' }}>🔒 Escrow Protection</h3>
          <p style={{ fontSize: '0.9rem', color: 'var(--muted)', lineHeight: '1.6' }}>
            Funds are held safely in escrow until the Steam trade offer is confirmed by both buyer and seller.
          </p>
        </div>
        <div className="card-glass" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1.2rem', color: '#fff', marginBottom: '0.5rem' }}>⚡ Verified Sellers</h3>
          <p style={{ fontSize: '0.9rem', color: 'var(--muted)', lineHeight: '1.6' }}>
            Every merchant is NID and identity-verified to eliminate fraud and provide reliable 10-minute delivery guarantees.
          </p>
        </div>
      </div>

      <div className="card-glass" style={{ padding: '2rem', textAlign: 'center' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#fff', marginBottom: '0.75rem' }}>Ready to Start Trading?</h2>
        <p style={{ color: 'var(--muted)', marginBottom: '1.5rem' }}>Explore thousands of verified CS2 knives, gloves, weapons, and cases now.</p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <Link href="/marketplace" className="btn btn-primary">Browse Marketplace</Link>
          <Link href="/auth/signup" className="btn btn-ghost">Become a Seller</Link>
        </div>
      </div>
    </main>
  );
}
