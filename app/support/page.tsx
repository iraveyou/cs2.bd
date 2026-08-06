import Link from 'next/link';

export const metadata = {
  title: 'Support Center & Help | cs2bd Bangladesh',
  description: 'Get help with bKash / Nagad payment verification, CS2 Steam trade offers, seller verification, or submit a dispute ticket.',
};

export default function SupportPage() {
  return (
    <main className="container" style={{ padding: '3rem 1rem', maxWidth: 900 }}>
      <div style={{ marginBottom: '2.5rem', textAlign: 'center' }}>
        <span className="badge badge-accent" style={{ marginBottom: '0.75rem' }}>Help & Support</span>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 900, color: '#fff' }}>
          How can we <span className="gradient-text">help you?</span>
        </h1>
        <p style={{ fontSize: '1rem', color: 'var(--muted)', marginTop: '0.5rem' }}>
          24/7 Support for payment verification, Steam trade deliveries, and account safety in Bangladesh.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
        <div className="card-glass" style={{ padding: '1.5rem' }}>
          <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>💳</div>
          <h3 style={{ fontSize: '1.1rem', color: '#fff', fontWeight: 700, marginBottom: '0.5rem' }}>Payments & Verification</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--muted)', marginBottom: '1rem', lineHeight: '1.5' }}>
            Issues with bKash or Nagad transaction IDs, pending verifications, or refund requests.
          </p>
          <Link href="/faq" className="btn btn-ghost btn-sm">Read FAQs →</Link>
        </div>

        <div className="card-glass" style={{ padding: '1.5rem' }}>
          <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>🔄</div>
          <h3 style={{ fontSize: '1.1rem', color: '#fff', fontWeight: 700, marginBottom: '0.5rem' }}>Steam Trade Deliveries</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--muted)', marginBottom: '1rem', lineHeight: '1.5' }}>
            Help with Steam Trade URLs, trade hold delays, inspect links, or item non-delivery.
          </p>
          <Link href="/faq" className="btn btn-ghost btn-sm">Trade Guides →</Link>
        </div>

        <div className="card-glass" style={{ padding: '1.5rem' }}>
          <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>🛡️</div>
          <h3 style={{ fontSize: '1.1rem', color: '#fff', fontWeight: 700, marginBottom: '0.5rem' }}>Disputes & Safety</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--muted)', marginBottom: '1rem', lineHeight: '1.5' }}>
            Open a dispute for an unfulfilled order or report suspicious seller activities.
          </p>
          <Link href="/buyer/dashboard" className="btn btn-ghost btn-sm">Open Dispute →</Link>
        </div>
      </div>

      <div className="card-glass" style={{ padding: '2rem', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1.5rem' }}>
        <div>
          <h3 style={{ fontSize: '1.25rem', color: '#fff', fontWeight: 800, marginBottom: '0.25rem' }}>Still need assistance?</h3>
          <p style={{ color: 'var(--muted)', fontSize: '0.9rem', margin: 0 }}>Contact our local Bangladeshi support team directly via email or live chat.</p>
        </div>
        <Link href="/contact" className="btn btn-primary">Contact Support Team</Link>
      </div>
    </main>
  );
}
