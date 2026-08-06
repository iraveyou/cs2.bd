import Link from 'next/link';

export const metadata = {
  title: 'Affiliate & Referral Program | cs2bd Bangladesh',
  description: 'Earn commission on CS2 skin transactions by referring traders and friends to cs2bd in Bangladesh.',
};

export default function AffiliatePage() {
  return (
    <main className="container" style={{ padding: '3rem 1rem', maxWidth: 900 }}>
      <div style={{ marginBottom: '2.5rem', textAlign: 'center' }}>
        <span className="badge badge-accent" style={{ marginBottom: '0.75rem' }}>Earn With Us</span>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 900, color: '#fff' }}>
          Affiliate & <span className="gradient-text">Referral Program</span>
        </h1>
        <p style={{ fontSize: '1rem', color: 'var(--muted)', marginTop: '0.5rem' }}>
          Invite your gaming friends or community to cs2bd and earn up to 15% share of marketplace trade fees.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
        <div className="card-glass" style={{ padding: '1.5rem' }}>
          <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>🔗</div>
          <h3 style={{ fontSize: '1.1rem', color: '#fff', fontWeight: 700, marginBottom: '0.5rem' }}>1. Get Your Unique Link</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--muted)', lineHeight: '1.5' }}>
            Generate a custom referral link from your buyer or seller dashboard.
          </p>
        </div>

        <div className="card-glass" style={{ padding: '1.5rem' }}>
          <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>📢</div>
          <h3 style={{ fontSize: '1.1rem', color: '#fff', fontWeight: 700, marginBottom: '0.5rem' }}>2. Share With Traders</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--muted)', lineHeight: '1.5' }}>
            Share on Discord groups, Facebook gaming pages, YouTube, or Stream channels in Bangladesh.
          </p>
        </div>

        <div className="card-glass" style={{ padding: '1.5rem' }}>
          <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>💰</div>
          <h3 style={{ fontSize: '1.1rem', color: '#fff', fontWeight: 700, marginBottom: '0.5rem' }}>3. Earn Instant Cash</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--muted)', lineHeight: '1.5' }}>
            Get commission credited directly to your bKash or Nagad wallet on every completed order.
          </p>
        </div>
      </div>

      <div className="card-glass" style={{ padding: '2rem', textAlign: 'center' }}>
        <h3 style={{ fontSize: '1.25rem', color: '#fff', fontWeight: 800, marginBottom: '0.75rem' }}>Start Inviting Friends</h3>
        <p style={{ color: 'var(--muted)', marginBottom: '1.25rem' }}>Sign in to access your referral link and real-time earnings stats.</p>
        <Link href="/auth/signin" className="btn btn-primary">Sign In to Dashboard</Link>
      </div>
    </main>
  );
}
