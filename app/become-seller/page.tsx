import Link from 'next/link';

export const metadata = {
  title: 'Become a Seller | cs2bd Bangladesh',
  description: 'Apply to become a verified CS2 skin merchant on cs2bd. Sell skins with 0% introductory fee via bKash and Nagad.',
};

export default function BecomeSellerPage() {
  return (
    <main className="container" style={{ padding: '3rem 1rem', maxWidth: 900 }}>
      <div style={{ marginBottom: '2.5rem', textAlign: 'center' }}>
        <span className="badge badge-accent" style={{ marginBottom: '0.75rem' }}>Merchant Program</span>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 900, color: '#fff' }}>
          Become a Verified <span className="gradient-text">CS2 Seller</span>
        </h1>
        <p style={{ fontSize: '1rem', color: 'var(--muted)', marginTop: '0.5rem' }}>
          Sell your CS2 skins directly to thousands of Bangladeshi buyers with fast bKash and Nagad payouts.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
        <div className="card-glass" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1.1rem', color: '#fff', fontWeight: 700, marginBottom: '0.5rem' }}>💸 Low Seller Fees</h3>
          <p style={{ fontSize: '0.875rem', color: 'var(--muted)', lineHeight: '1.6' }}>
            Keep up to 98% of your listing price with zero hidden currency withdrawal conversions.
          </p>
        </div>

        <div className="card-glass" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1.1rem', color: '#fff', fontWeight: 700, marginBottom: '0.5rem' }}>⚡ Automated Stock Tools</h3>
          <p style={{ fontSize: '0.875rem', color: 'var(--muted)', lineHeight: '1.6' }}>
            Easily manage inspect links, float values, StatTrak indicators, and custom store banners.
          </p>
        </div>

        <div className="card-glass" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1.1rem', color: '#fff', fontWeight: 700, marginBottom: '0.5rem' }}>🛡️ Trust & Verification</h3>
          <p style={{ fontSize: '0.875rem', color: 'var(--muted)', lineHeight: '1.6' }}>
            Gain the Verified Merchant badge by submitting your NID and Steam profile for buyer confidence.
          </p>
        </div>
      </div>

      <div className="card-glass" style={{ padding: '2.5rem', textAlign: 'center' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#fff', marginBottom: '0.75rem' }}>Ready to Apply?</h2>
        <p style={{ color: 'var(--muted)', marginBottom: '1.5rem' }}>Create an account and select "Seller Account" during signup.</p>
        <Link href="/auth/signup" className="btn btn-primary" style={{ padding: '0.75rem 2rem' }}>
          Start Seller Application
        </Link>
      </div>
    </main>
  );
}
