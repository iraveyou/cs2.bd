import { Metadata } from 'next';
import { generateFaqSchema } from '../../lib/seo/schema';

export const metadata: Metadata = {
  title: 'Frequently Asked Questions (FAQ) | cs2bd Bangladesh',
  description: 'Find answers to common questions about buying CS2 skins via bKash/Nagad, seller verification, escrow protection, trade URLs, and more on CS2BD Bangladesh.',
  keywords: ['cs2 faq', 'cs2bd help', 'cs2 skin payment bkash', 'cs2 escrow bangladesh', 'cs2 seller verification'],
  alternates: { canonical: `${process.env.NEXT_PUBLIC_APP_URL || 'https://cs2bd.com'}/faq` },
  openGraph: {
    title: 'Frequently Asked Questions | cs2bd Bangladesh',
    description: 'Everything you need to know about buying and selling CS2 skins in Bangladesh with bKash, Nagad, and escrow protection.',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'CS2BD FAQ — Bangladesh CS2 Skins Marketplace',
    description: 'Find answers about bKash payments, escrow, seller verification, and Steam trade delivery.',
  },
};

const FAQS = [
  {
    q: 'How does payment work with bKash and Nagad?',
    a: 'When you buy an item, you will be shown the merchant/personal bKash or Nagad phone number. You perform a "Send Money" or "Payment" from your app, then submit the Transaction ID (TrxID) and your sender phone number. CS2BD admin team verifies the transaction and releases the order to the seller.',
  },
  {
    q: 'How long does item delivery take?',
    a: 'Most verified sellers send the Steam trade offer within 10 to 30 minutes. Once you receive and accept the trade offer on Steam, mark the order as "Delivered" on CS2BD to release funds to the seller.',
  },
  {
    q: 'What if the seller does not deliver my CS2 skin?',
    a: 'Your money remains safe in CS2BD Escrow. If the seller fails to send the trade offer within 2 hours, you can open a dispute or request an automatic full refund back to your bKash/Nagad account.',
  },
  {
    q: 'How can I become a verified seller on CS2BD?',
    a: 'Go to "Become Seller" page, complete your profile application with your Bangladeshi NID, Steam profile, and payment account details. Our admin team reviews seller applications within 24 hours.',
  },
  {
    q: 'Are there any hidden fees or currency conversion charges?',
    a: 'No! All prices on CS2BD are listed in Bangladeshi Taka (BDT ৳). What you see is exactly what you pay through bKash or Nagad. No hidden charges.',
  },
  {
    q: 'What skins can I buy on CS2BD?',
    a: 'You can buy CS2 knives, gloves, rifles (AK-47, M4A1-S, AWP), pistols (Desert Eagle, USP-S), SMGs, shotguns, stickers, cases, music kits, and agents — all from verified Bangladeshi sellers.',
  },
  {
    q: 'How does escrow protection work?',
    a: 'CS2BD holds your payment in escrow until you confirm receipt of the skin on Steam. The seller only receives the funds after you verify delivery. If there is a dispute, our support team mediates.',
  },
  {
    q: 'What is a Trade URL and how do I find it?',
    a: 'A Steam Trade URL allows sellers to send you trade offers directly. Find it in your Steam Inventory → "Trade Offers" → "Who can send me Trade Offers?" → Your Trade URL. Paste it in your CS2BD profile.',
  },
  {
    q: 'What is float value and why does it matter?',
    a: 'Float value (0.00–1.00) determines a skin\'s wear condition. Factory New (0.00–0.07) skins look pristine and are more valuable. Minimal Wear (0.07–0.15), Field-Tested (0.15–0.38), Well-Worn (0.38–0.45), and Battle-Scarred (0.45–1.00) follow. Lower float = better appearance & higher price.',
  },
  {
    q: 'Can I sell my CS2 skins on CS2BD?',
    a: 'Yes! Apply to become a verified seller by submitting your NID, Steam profile, and payment details. Once approved, you can list your skins with your desired price and receive payments via bKash or Nagad.',
  },
];

export default function FAQPage() {
  const faqSchema = generateFaqSchema(FAQS.map((f) => ({ question: f.q, answer: f.a })));

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <main className="container" style={{ padding: '3rem 1rem', maxWidth: 900 }}>
        <div style={{ marginBottom: '2.5rem' }}>
          <span className="badge badge-accent" style={{ marginBottom: '0.75rem' }}>Knowledge Base</span>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 900, color: '#fff' }}>
            Frequently Asked <span className="gradient-text">Questions</span>
          </h1>
          <p style={{ fontSize: '1rem', color: 'var(--muted)', marginTop: '0.5rem' }}>
            Everything you need to know about Bangladesh&apos;s leading CS2 skins marketplace.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {FAQS.map((faq, i) => (
            <div key={i} className="card-glass" style={{ padding: '1.5rem' }}>
              <h2 style={{ fontSize: '1.15rem', color: '#fff', fontWeight: 700, marginBottom: '0.5rem' }}>
                {faq.q}
              </h2>
              <p style={{ fontSize: '0.9rem', color: 'var(--muted)', lineHeight: '1.6', margin: 0 }}>
                {faq.a}
              </p>
            </div>
          ))}
        </div>
      </main>
    </>
  );
}
