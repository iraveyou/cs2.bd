export const metadata = {
  title: 'Terms of Service | cs2bd Bangladesh',
  description: 'Terms of service and trading regulations for cs2bd CS2 Skins Marketplace in Bangladesh.',
};

export default function TermsPage() {
  return (
    <main className="container" style={{ padding: '3rem 1rem', maxWidth: 850 }}>
      <h1 style={{ fontSize: '2.25rem', fontWeight: 900, color: '#fff', marginBottom: '1.5rem' }}>
        Terms of <span className="gradient-text">Service</span>
      </h1>
      <div className="card-glass" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', color: 'var(--muted)', fontSize: '0.925rem', lineHeight: '1.7' }}>
        <p>Welcome to <strong>CS2BD</strong>. By accessing or using our website and services, you agree to comply with and be bound by the following Terms of Service.</p>
        
        <div>
          <h2 style={{ color: '#fff', fontSize: '1.2rem', marginBottom: '0.5rem' }}>1. Platform Nature</h2>
          <p>cs2bd is a peer-to-peer (P2P) marketplace facilitating digital skin transactions between buyers and sellers in Bangladesh. cs2bd holds payment funds in escrow until digital trade delivery on Steam is completed.</p>
        </div>

        <div>
          <h2 style={{ color: '#fff', fontSize: '1.2rem', marginBottom: '0.5rem' }}>2. Payments & Local Currency</h2>
          <p>All listings are priced in Bangladeshi Taka (BDT ৳). Buyers must submit genuine bKash or Nagad transaction IDs. Fraudulent, duplicate, or chargeback attempts will result in immediate permanent account suspension and reporting to relevant local law enforcement agencies.</p>
        </div>

        <div>
          <h2 style={{ color: '#fff', fontSize: '1.2rem', marginBottom: '0.5rem' }}>3. Seller Verification & Delivery</h2>
          <p>Sellers must provide valid NID identification. Sellers agree to deliver the exact specified CS2 item (matching float value, paint seed, and stickers) via Steam Trade Offer within 2 hours of payment approval.</p>
        </div>

        <div>
          <h2 style={{ color: '#fff', fontSize: '1.2rem', marginBottom: '0.5rem' }}>4. Steam & Valve Disclaimer</h2>
          <p>cs2bd is an independent marketplace and is not affiliated with, endorsed by, or associated with Valve Corporation or Counter-Strike 2. All trademarks belong to their respective owners.</p>
        </div>
      </div>
    </main>
  );
}
