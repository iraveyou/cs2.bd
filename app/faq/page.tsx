export const metadata = {
  title: 'Frequently Asked Questions (FAQ) | cs2bd Bangladesh',
  description: 'Find answers to common questions regarding buying CS2 skins via bKash/Nagad, seller verification, escrow protection, and trade URL setups.',
};

const FAQS = [
  {
    q: 'How does payment work with bKash and Nagad?',
    a: 'When you buy an item, you will be shown the merchant/personal bKash or Nagad phone number. You perform a "Send Money" or "Payment" from your app, then submit the Transaction ID (TrxID) and your sender phone number. cs2bd admin team verifies the transaction and releases the order to the seller.',
  },
  {
    q: 'How long does item delivery take?',
    a: 'Most verified sellers send the Steam trade offer within 10 to 30 minutes. Once you receive and accept the trade offer on Steam, mark the order as "Delivered" on cs2bd to release funds to the seller.',
  },
  {
    q: 'What if the seller does not deliver my CS2 skin?',
    a: 'Your money remains safe in cs2bd Escrow. If the seller fails to send the trade offer within 2 hours, you can open a dispute or request an automatic full refund back to your bKash/Nagad account.',
  },
  {
    q: 'How can I become a verified seller on cs2bd?',
    a: 'Go to "Become Seller" page, complete your profile application with your Bangladeshi NID, Steam profile, and payment account details. Our admin team reviews seller applications within 24 hours.',
  },
  {
    q: 'Are there any hidden fees or currency conversion charges?',
    a: 'No! All prices on cs2bd are listed in Bangladeshi Taka (BDT ৳). What you see is exactly what you pay through bKash or Nagad.',
  },
];

export default function FAQPage() {
  return (
    <main className="container" style={{ padding: '3rem 1rem', maxWidth: 900 }}>
      <div style={{ marginBottom: '2.5rem' }}>
        <span className="badge badge-accent" style={{ marginBottom: '0.75rem' }}>Knowledge Base</span>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 900, color: '#fff' }}>
          Frequently Asked <span className="gradient-text">Questions</span>
        </h1>
        <p style={{ fontSize: '1rem', color: 'var(--muted)', marginTop: '0.5rem' }}>
          Everything you need to know about Bangladesh's leading CS2 skins marketplace.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {FAQS.map((faq, i) => (
          <div key={i} className="card-glass" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1.15rem', color: '#fff', fontWeight: 700, marginBottom: '0.5rem' }}>
              {faq.q}
            </h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--muted)', lineHeight: '1.6', margin: 0 }}>
              {faq.a}
            </p>
          </div>
        ))}
      </div>
    </main>
  );
}
