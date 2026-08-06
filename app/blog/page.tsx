import Link from 'next/link';
import { Metadata } from 'next';
import { generateArticleSchema } from '../../lib/seo/schema';

export const metadata: Metadata = {
  title: 'CS2 Blog & Trading Guides | cs2bd Bangladesh',
  description: 'Stay updated with Counter-Strike 2 skin market trends, trading guides, price history analysis, Doppler phase guides, and platform updates in Bangladesh.',
  keywords: ['cs2 blog', 'cs2 trading guide', 'cs2 skin prices bangladesh', 'cs2 doppler guide', 'cs2 market news bd'],
  alternates: { canonical: `${process.env.NEXT_PUBLIC_APP_URL || 'https://cs2bd.com'}/blog` },
  openGraph: {
    title: 'CS2 Blog & Trading Guides | cs2bd Bangladesh',
    description: 'Counter-Strike 2 skin market trends, trading guides, and price analysis for Bangladeshi gamers.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CS2 Blog & Trading Guides | cs2bd',
    description: 'CS2 skin market trends, trading guides, and price analysis for Bangladeshi gamers.',
  },
};

const ARTICLES = [
  {
    slug: 'cs2-skin-trading-guide-bangladesh-2026',
    title: 'How to Buy & Sell CS2 Skins Safely in Bangladesh (2026 Guide)',
    category: 'Trading Tips',
    date: 'Aug 1, 2026',
    publishedAt: '2026-08-01T10:00:00+06:00',
    readTime: '5 min read',
    excerpt: 'Learn how to use bKash and Nagad with CS2BD escrow to safely trade CS2 skins without currency conversion losses.',
  },
  {
    slug: 'doppler-phases-float-value-explained',
    title: 'CS2 Doppler Phases & Float Values: Everything You Need to Know',
    category: 'Skin Guides',
    date: 'Jul 28, 2026',
    publishedAt: '2026-07-28T10:00:00+06:00',
    readTime: '7 min read',
    excerpt: 'Understand Doppler Phase 1 to Phase 4, Sapphire, Ruby, Black Pearl, and how float wear affects skin valuation.',
  },
  {
    slug: 'cs2-major-update-market-impact',
    title: 'Impact of Recent CS2 Economy Update on Knife & Glove Prices',
    category: 'Market News',
    date: 'Jul 20, 2026',
    publishedAt: '2026-07-20T10:00:00+06:00',
    readTime: '4 min read',
    excerpt: 'A comprehensive analysis of recent patch notes and their direct influence on popular CS2 case keys and covert weapon skins.',
  },
];

export default function BlogPage() {
  const articleSchemas = ARTICLES.map((art) =>
    generateArticleSchema({
      title: art.title,
      description: art.excerpt,
      slug: art.slug,
      publishedAt: art.publishedAt,
      authorName: 'CS2BD Editorial',
    })
  );

  return (
    <>
      {articleSchemas.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
      <main className="container" style={{ padding: '3rem 1rem', maxWidth: 1000 }}>
        <div style={{ marginBottom: '2.5rem' }}>
          <span className="badge badge-accent" style={{ marginBottom: '0.75rem' }}>Blog & News</span>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 900, color: '#fff' }}>
            CS2 Market <span className="gradient-text">Insights</span>
          </h1>
          <p style={{ fontSize: '1rem', color: 'var(--muted)', marginTop: '0.5rem' }}>
            Trading guides, market analytics, and patch breakdowns tailored for Bangladeshi gamers.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {ARTICLES.map((art) => (
            <article key={art.slug} className="card-glass" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <span className="badge" style={{ background: 'rgba(255,106,0,0.15)', color: '#ff8a3d', border: '1px solid rgba(255,106,0,0.3)' }}>{art.category}</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>{art.date} • {art.readTime}</span>
                </div>
                <h2 style={{ fontSize: '1.2rem', color: '#fff', fontWeight: 700, marginBottom: '0.75rem', lineHeight: '1.4' }}>
                  {art.title}
                </h2>
                <p style={{ fontSize: '0.875rem', color: 'var(--muted)', lineHeight: '1.6', marginBottom: '1.25rem' }}>
                  {art.excerpt}
                </p>
              </div>
              <Link href={`/blog`} className="btn btn-ghost btn-sm" style={{ width: 'fit-content' }}>
                Read Article →
              </Link>
            </article>
          ))}
        </div>
      </main>
    </>
  );
}
