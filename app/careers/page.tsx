import Link from 'next/link';

export const metadata = {
  title: 'Careers | cs2bd Bangladesh',
  description: 'Join the team building Bangladesh\'s premier CS2 gaming and item marketplace.',
};

export default function CareersPage() {
  return (
    <main className="container" style={{ padding: '3rem 1rem', maxWidth: 900 }}>
      <div style={{ marginBottom: '2.5rem' }}>
        <span className="badge badge-accent" style={{ marginBottom: '0.75rem' }}>Work With Us</span>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 900, color: '#fff' }}>
          Build the Future of <span className="gradient-text">Gaming in BD</span>
        </h1>
        <p style={{ fontSize: '1rem', color: 'var(--muted)', marginTop: '0.5rem' }}>
          We are empowering gamers, traders, and software creators across Bangladesh.
        </p>
      </div>

      <div className="card-glass" style={{ padding: '2rem', marginBottom: '2rem' }}>
        <h3 style={{ fontSize: '1.25rem', color: '#fff', fontWeight: 700, marginBottom: '0.75rem' }}>Open Positions</h3>
        <p style={{ color: 'var(--muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>We are looking for passionate remote team members based in Bangladesh:</p>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ border: '1px solid var(--border)', padding: '1rem', borderRadius: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
            <div>
              <h4 style={{ color: '#fff', fontSize: '1rem', fontWeight: 700, margin: 0 }}>Community & Trade Support Specialist</h4>
              <p style={{ color: 'var(--muted)', fontSize: '0.8rem', margin: '0.2rem 0 0' }}>Remote (Dhaka/Chittagong) • Full-Time</p>
            </div>
            <Link href="/contact" className="btn btn-ghost btn-sm">Apply via Email</Link>
          </div>

          <div style={{ border: '1px solid var(--border)', padding: '1rem', borderRadius: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
            <div>
              <h4 style={{ color: '#fff', fontSize: '1rem', fontWeight: 700, margin: 0 }}>Full-Stack Developer (Next.js & Prisma)</h4>
              <p style={{ color: 'var(--muted)', fontSize: '0.8rem', margin: '0.2rem 0 0' }}>Remote Bangladesh • Full-Time / Contract</p>
            </div>
            <Link href="/contact" className="btn btn-ghost btn-sm">Apply via Email</Link>
          </div>
        </div>
      </div>
    </main>
  );
}
