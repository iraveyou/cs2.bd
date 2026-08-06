import Link from 'next/link';

export const metadata = {
  title: 'CS2 Deals & Discounted Skins | cs2bd Bangladesh',
  description: 'Hot deals, below-market-price CS2 skins, quick-buy bargains, and flash sales in Bangladesh.',
};

export default function DealsPage() {
  return (
    <main className="container" style={{ padding: '3rem 1rem', maxWidth: 1000 }}>
      <div style={{ marginBottom: '2.5rem' }}>
        <span className="badge badge-accent" style={{ marginBottom: '0.75rem' }}>🔥 Special Offers</span>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 900, color: '#fff' }}>
          Flash Deals & <span className="gradient-text">Bargains</span>
        </h1>
        <p style={{ fontSize: '1rem', color: 'var(--muted)', marginTop: '0.5rem' }}>
          Skins listed up to 25% below Steam Community Market value for fast local trade.
        </p>
      </div>

      <div className="card-glass" style={{ padding: '2.5rem', textAlign: 'center', marginBottom: '3rem' }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚡</div>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#fff', marginBottom: '0.5rem' }}>Looking for Lowest Prices?</h2>
        <p style={{ color: 'var(--muted)', maxWidth: 600, margin: '0 auto 1.5rem', lineHeight: '1.6' }}>
          Filter all live listings on cs2bd by price sorting and discount rates to grab high-float low-wear deals instantly.
        </p>
        <Link href="/marketplace?sort=price_asc" className="btn btn-primary">
          Explore Discounted Listings
        </Link>
      </div>
    </main>
  );
}
