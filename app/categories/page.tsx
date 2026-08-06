import Link from 'next/link';

export const metadata = {
  title: 'CS2 Item Categories | cs2bd Bangladesh',
  description: 'Browse Counter-Strike 2 items by category: Knives, Gloves, Rifles, Pistols, SMGs, Heavy, Stickers, Charms, Agents, and Cases.',
};

const CATEGORIES = [
  { name: 'Knives', icon: '🗡️', count: '140+ listings', color: '#ff4d4d', link: '/marketplace?category=Knives' },
  { name: 'Gloves', icon: '🥊', count: '85+ listings', color: '#ff9933', link: '/marketplace?category=Gloves' },
  { name: 'Rifles', icon: '🔫', count: '320+ listings', color: '#33cc33', link: '/marketplace?category=Rifles' },
  { name: 'Pistols', icon: '🎯', count: '210+ listings', color: '#3399ff', link: '/marketplace?category=Pistols' },
  { name: 'SMGs & Heavy', icon: '💥', count: '110+ listings', color: '#9933ff', link: '/marketplace?category=SMGs' },
  { name: 'Stickers & Charms', icon: '🏷️', count: '90+ listings', color: '#ff3399', link: '/marketplace?category=Stickers' },
  { name: 'Agents & Music', icon: '🎭', count: '65+ listings', color: '#00cccc', link: '/marketplace?category=Agents' },
  { name: 'Cases & Keys', icon: '📦', count: 'Browse all', color: '#e6b800', link: '/marketplace?category=Cases' },
];

export default function CategoriesPage() {
  return (
    <main className="container" style={{ padding: '3rem 1rem', maxWidth: 1000 }}>
      <div style={{ marginBottom: '2.5rem' }}>
        <span className="badge badge-accent" style={{ marginBottom: '0.75rem' }}>Catalog</span>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 900, color: '#fff' }}>
          CS2 Item <span className="gradient-text">Categories</span>
        </h1>
        <p style={{ fontSize: '1rem', color: 'var(--muted)', marginTop: '0.5rem' }}>
          Explore all CS2 skins, knives, gloves, cases, and collectibles available in Bangladesh.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1.25rem' }}>
        {CATEGORIES.map((cat) => (
          <Link key={cat.name} href={cat.link} className="card-glass" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', textDecoration: 'none', transition: 'transform 0.2s, border-color 0.2s' }}>
            <div style={{ fontSize: '2.25rem', marginBottom: '0.25rem' }}>{cat.icon}</div>
            <h3 style={{ fontSize: '1.2rem', color: '#fff', fontWeight: 800 }}>{cat.name}</h3>
            <span style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>{cat.count}</span>
            <span style={{ fontSize: '0.825rem', color: '#ff8a3d', fontWeight: 600, marginTop: '0.5rem' }}>Browse Category →</span>
          </Link>
        ))}
      </div>
    </main>
  );
}
