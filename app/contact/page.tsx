'use client';
import Link from 'next/link';

export const metadata = {
  title: 'Contact CS2BD — Support & Help | cs2bd Bangladesh',
  description: 'Contact CS2BD Bangladesh customer support. Get help with orders, payments, seller verification, and disputes. Email, Discord, and contact form available.',
  keywords: ['cs2bd contact', 'cs2bd support', 'cs2 marketplace help bangladesh', 'cs2 skin dispute support'],
};

export default function ContactPage() {
  return (
    <main className="container" style={{ padding: '3rem 1rem', maxWidth: 800 }}>
      <div style={{ marginBottom: '2.5rem', textAlign: 'center' }}>
        <span className="badge badge-accent" style={{ marginBottom: '0.75rem' }}>Get in Touch</span>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 900, color: '#fff' }}>
          Contact <span className="gradient-text">CS2BD</span>
        </h1>
        <p style={{ fontSize: '1rem', color: 'var(--muted)', marginTop: '0.5rem' }}>
          Have questions regarding an order, payment, or seller application? We are here to help.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
        <div className="card-glass" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1.1rem', color: '#fff', fontWeight: 700, marginBottom: '0.5rem' }}>📧 Email Support</h3>
          <p style={{ fontSize: '0.875rem', color: 'var(--muted)', marginBottom: '0.5rem' }}>General Queries & Disputes</p>
          <a href="mailto:support@cs2bd.com" style={{ color: '#ff8a3d', fontWeight: 600, fontSize: '0.9rem' }}>support@cs2bd.bd</a>
        </div>

        <div className="card-glass" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1.1rem', color: '#fff', fontWeight: 700, marginBottom: '0.5rem' }}>💬 Live Community</h3>
          <p style={{ fontSize: '0.875rem', color: 'var(--muted)', marginBottom: '0.5rem' }}>Discord Trading Server</p>
          <a href="https://discord.gg/" target="_blank" rel="noreferrer" style={{ color: '#ff8a3d', fontWeight: 600, fontSize: '0.9rem' }}>Join Discord Community →</a>
        </div>
      </div>

      <div className="card-glass" style={{ padding: '2rem' }}>
        <h3 style={{ fontSize: '1.25rem', color: '#fff', fontWeight: 700, marginBottom: '1rem' }}>Send Us a Message</h3>
        <form onSubmit={(e) => { e.preventDefault(); alert('Message sent! Our support team will reply via email shortly.'); }} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label className="label" style={{ display: 'block', marginBottom: '0.35rem' }}>Your Name</label>
            <input type="text" className="input input-bordered w-full" placeholder="e.g. Tanvir Ahmed" required style={{ width: '100%', padding: '0.65rem 0.85rem', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', borderRadius: 8, color: '#fff' }} />
          </div>
          <div>
            <label className="label" style={{ display: 'block', marginBottom: '0.35rem' }}>Email / Phone Number</label>
            <input type="text" className="input input-bordered w-full" placeholder="e.g. 01700000000 or email@domain.com" required style={{ width: '100%', padding: '0.65rem 0.85rem', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', borderRadius: 8, color: '#fff' }} />
          </div>
          <div>
            <label className="label" style={{ display: 'block', marginBottom: '0.35rem' }}>Message</label>
            <textarea rows={4} className="input input-bordered w-full" placeholder="How can we assist you today?" required style={{ width: '100%', padding: '0.65rem 0.85rem', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', borderRadius: 8, color: '#fff' }} />
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: 'fit-content' }}>Submit Message</button>
        </form>
      </div>
    </main>
  );
}
