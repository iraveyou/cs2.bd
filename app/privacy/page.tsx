export const metadata = {
  title: 'Privacy Policy | cs2bd Bangladesh',
  description: 'Privacy Policy detailing how cs2bd protects user data, phone numbers, and transaction logs in Bangladesh.',
};

export default function PrivacyPage() {
  return (
    <main className="container" style={{ padding: '3rem 1rem', maxWidth: 850 }}>
      <h1 style={{ fontSize: '2.25rem', fontWeight: 900, color: '#fff', marginBottom: '1.5rem' }}>
        Privacy <span className="gradient-text">Policy</span>
      </h1>
      <div className="card-glass" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', color: 'var(--muted)', fontSize: '0.925rem', lineHeight: '1.7' }}>
        <p>At <strong>CS2BD</strong>, we prioritize the privacy and security of our users in Bangladesh. This Privacy Policy explains how we collect, use, and safeguard your personal information.</p>
        
        <div>
          <h2 style={{ color: '#fff', fontSize: '1.2rem', marginBottom: '0.5rem' }}>Information We Collect</h2>
          <p>We collect essential account details including your name, email address, Bangladeshi mobile number (bKash/Nagad), NID documents for verified sellers, and Steam 64 ID for trade offer routing.</p>
        </div>

        <div>
          <h2 style={{ color: '#fff', fontSize: '1.2rem', marginBottom: '0.5rem' }}>How We Use Your Data</h2>
          <p>Your phone numbers and transaction IDs are strictly used to verify manual bKash and Nagad payments and facilitate order delivery notifications. We never sell your personal data to third parties.</p>
        </div>

        <div>
          <h2 style={{ color: '#fff', fontSize: '1.2rem', marginBottom: '0.5rem' }}>Data Security & Encryption</h2>
          <p>All sensitive information, including password hashes and transaction attachments, are stored using industry-standard encryption protocols in secure Cloud infrastructure.</p>
        </div>
      </div>
    </main>
  );
}
