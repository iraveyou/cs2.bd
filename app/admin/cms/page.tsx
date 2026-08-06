'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import {
  Layout,
  FileText,
  HelpCircle,
  Globe,
  Navigation,
  PanelBottom,
  Tag,
  Save,
  Plus,
  Trash2,
  Eye,
  CheckCircle2,
  Sparkles,
  ArrowLeft,
  Megaphone,
  ShoppingBag,
  Users,
  Image as ImageIcon,
  ExternalLink,
  Code
} from 'lucide-react';
import { CMSState } from '../../../lib/repositories/cms.repository';

export default function AdminCMSPage() {
  const [activeTab, setActiveTab] = useState<'homepage' | 'blog' | 'faqs' | 'seo' | 'navigation' | 'footer' | 'promotions'>('homepage');
  const [cmsData, setCmsData] = useState<CMSState | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const router = useRouter();
  const { data: session, status: authStatus } = useSession();
  const isAdmin = authStatus === 'authenticated' && ((session as any)?.role) === 'ADMIN';

  // Form States
  const [newBlog, setNewBlog] = useState({
    title: '',
    slug: '',
    category: 'Trading Guides',
    excerpt: '',
    content: '',
    author: 'Admin Team',
    coverImage: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80',
    publishedAt: new Date().toISOString().split('T')[0],
    isPublished: true,
  });

  const [newFaq, setNewFaq] = useState({
    category: 'Buyer' as 'Buyer' | 'Seller' | 'Payment & bKash' | 'Disputes',
    question: '',
    answer: '',
  });

  const [newPromo, setNewPromo] = useState({
    code: '',
    title: '',
    discountPercent: 5,
    bannerImageUrl: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&w=1000&q=80',
    bannerPosition: 'HOMEPAGE_HERO' as 'HOMEPAGE_HERO' | 'MARKETPLACE_SIDEBAR' | 'LISTING_TOP',
    maxUses: 100,
    isActive: true,
    expiryDate: '2026-12-31',
  });

  const [newAnnouncement, setNewAnnouncement] = useState({
    message: '',
    linkText: 'Learn More',
    linkUrl: '/faq',
    type: 'PROMO' as 'INFO' | 'PROMO' | 'WARNING',
    isActive: true,
  });

  useEffect(() => {
    fetch('/api/admin/cms')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setCmsData(data.cms);
        }
      })
      .catch((err) => console.error('Failed to fetch CMS data', err))
      .finally(() => setLoading(false));
  }, []);

  const handleSaveAll = async () => {
    if (!cmsData) return;
    setSaving(true);
    setSaveSuccess(false);

    try {
      const res = await fetch('/api/admin/cms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'save_full',
          payload: cmsData,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    } catch (err) {
      console.error('Failed to save CMS', err);
    } finally {
      setSaving(false);
    }
  };

  const handleAddBlog = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBlog.title || !newBlog.content) return;

    const res = await fetch('/api/admin/cms', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'add_blog',
        payload: {
          ...newBlog,
          slug: newBlog.slug || newBlog.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
        },
      }),
    });
    const data = await res.json();
    if (data.success && cmsData) {
      setCmsData({
        ...cmsData,
        blogs: [data.blog, ...cmsData.blogs],
      });
      setNewBlog({
        title: '',
        slug: '',
        category: 'Trading Guides',
        excerpt: '',
        content: '',
        author: 'Admin Team',
        coverImage: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80',
        publishedAt: new Date().toISOString().split('T')[0],
        isPublished: true,
      });
    }
  };

  const handleDeleteBlog = async (id: string) => {
    const res = await fetch('/api/admin/cms', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'delete_blog', payload: { id } }),
    });
    const data = await res.json();
    if (data.success && cmsData) {
      setCmsData({
        ...cmsData,
        blogs: cmsData.blogs.filter((b) => b.id !== id),
      });
    }
  };

  const handleAddFAQ = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFaq.question || !newFaq.answer) return;

    const res = await fetch('/api/admin/cms', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'add_faq',
        payload: newFaq,
      }),
    });
    const data = await res.json();
    if (data.success && cmsData) {
      setCmsData({
        ...cmsData,
        faqs: [...cmsData.faqs, data.faq],
      });
      setNewFaq({ category: 'Buyer', question: '', answer: '' });
    }
  };

  const handleDeleteFAQ = async (id: string) => {
    const res = await fetch('/api/admin/cms', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'delete_faq', payload: { id } }),
    });
    const data = await res.json();
    if (data.success && cmsData) {
      setCmsData({
        ...cmsData,
        faqs: cmsData.faqs.filter((f) => f.id !== id),
      });
    }
  };

  const handleAddPromo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPromo.code || !newPromo.title) return;

    const res = await fetch('/api/admin/cms', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'add_promo',
        payload: newPromo,
      }),
    });
    const data = await res.json();
    if (data.success && cmsData) {
      setCmsData({
        ...cmsData,
        promotions: [data.promo, ...cmsData.promotions],
      });
      setNewPromo({
        code: '',
        title: '',
        discountPercent: 5,
        bannerImageUrl: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&w=1000&q=80',
        bannerPosition: 'HOMEPAGE_HERO',
        maxUses: 100,
        isActive: true,
        expiryDate: '2026-12-31',
      });
    }
  };

  const handleDeletePromo = async (id: string) => {
    const res = await fetch('/api/admin/cms', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'delete_promo', payload: { id } }),
    });
    const data = await res.json();
    if (data.success && cmsData) {
      setCmsData({
        ...cmsData,
        promotions: cmsData.promotions.filter((p) => p.id !== id),
      });
    }
  };

  if (authStatus === 'loading' || !cmsData) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="flex items-center gap-3 text-slate-400">
          <div className="w-6 h-6 border-2 border-[#22c55e] border-t-transparent rounded-full animate-spin" />
          <span>Loading Admin CMS Builder...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Top Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#27272a] pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Link href="/admin/dashboard" className="text-xs text-slate-400 hover:text-white flex items-center gap-1 transition">
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Dashboard
            </Link>
            <span className="text-slate-600">•</span>
            <span className="badge badge-accent">CMS Studio</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-white flex items-center gap-2">
            Homepage & Site Content Builder <Sparkles className="w-6 h-6 text-[#22c55e]" />
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Customize homepage hero, featured skins, blog articles, FAQs, SEO metadata, navigation & promo campaigns.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleSaveAll}
            disabled={saving}
            className="btn btn-primary text-xs flex items-center gap-2 min-h-[40px] px-5 shadow-lg shadow-[#22c55e]/20"
          >
            {saving ? (
              <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
            ) : saveSuccess ? (
              <CheckCircle2 className="w-4 h-4" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            {saving ? 'Saving...' : saveSuccess ? 'Saved Live!' : 'Publish Changes'}
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-[#27272a] no-scrollbar">
        {[
          { id: 'homepage', label: 'Homepage Builder', icon: Layout },
          { id: 'blog', label: 'Blog & Articles', icon: FileText },
          { id: 'faqs', label: 'FAQs Manager', icon: HelpCircle },
          { id: 'seo', label: 'SEO Settings', icon: Globe },
          { id: 'navigation', label: 'Navigation Bar', icon: Navigation },
          { id: 'footer', label: 'Footer Links', icon: PanelBottom },
          { id: 'promotions', label: 'Ads & Promos', icon: Tag },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
  if (!isAdmin) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="mx-auto w-16 h-16 rounded-full bg-[#ff3d81]/10 flex items-center justify-center">
          <svg className="w-8 h-8 text-[#ff3d81]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-2.694-.833-3.464 0L2.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-100">Access Denied</h1>
        <p className="text-slate-400 text-sm">Admin access required to view this page.</p>
      </div>
    );
  }

  return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 shrink-0 border ${
                isActive
                  ? 'bg-[#22c55e]/15 border-[#22c55e] text-white shadow-md shadow-[#22c55e]/10'
                  : 'bg-[#18181b] border-[#27272a] text-slate-400 hover:text-white hover:border-slate-700'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-[#22c55e]' : ''}`} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* TAB 1: HOMEPAGE BUILDER */}
      {activeTab === 'homepage' && (
        <div className="space-y-8 animate-in fade-in duration-200">
          {/* Hero Banner Section */}
          <div className="bg-[#18181b] border border-[#27272a] rounded-2xl p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-[#27272a] pb-4">
              <div className="flex items-center gap-2">
                <Megaphone className="w-5 h-5 text-[#22c55e]" />
                <h2 className="text-lg font-bold text-white">Hero Banner Configurator</h2>
              </div>
              <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300">
                <span>Enable Banner</span>
                <input
                  type="checkbox"
                  checked={cmsData.hero.isEnabled}
                  onChange={(e) =>
                    setCmsData({
                      ...cmsData,
                      hero: { ...cmsData.hero, isEnabled: e.target.checked },
                    })
                  }
                  className="w-4 h-4 accent-[#22c55e] rounded"
                />
              </label>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1">
                    Badge Header Tag
                  </label>
                  <input
                    type="text"
                    value={cmsData.hero.badgeText}
                    onChange={(e) =>
                      setCmsData({
                        ...cmsData,
                        hero: { ...cmsData.hero, badgeText: e.target.value },
                      })
                    }
                    className="w-full bg-[#09090b] border border-[#27272a] rounded-xl px-4 py-2.5 text-xs text-white focus:border-[#22c55e] outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1">
                    Hero Main Headline
                  </label>
                  <input
                    type="text"
                    value={cmsData.hero.title}
                    onChange={(e) =>
                      setCmsData({
                        ...cmsData,
                        hero: { ...cmsData.hero, title: e.target.value },
                      })
                    }
                    className="w-full bg-[#09090b] border border-[#27272a] rounded-xl px-4 py-2.5 text-xs text-white focus:border-[#22c55e] outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1">
                    Sub-heading / Description
                  </label>
                  <textarea
                    rows={3}
                    value={cmsData.hero.subtitle}
                    onChange={(e) =>
                      setCmsData({
                        ...cmsData,
                        hero: { ...cmsData.hero, subtitle: e.target.value },
                      })
                    }
                    className="w-full bg-[#09090b] border border-[#27272a] rounded-xl px-4 py-2.5 text-xs text-white focus:border-[#22c55e] outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1">
                      Primary CTA Text
                    </label>
                    <input
                      type="text"
                      value={cmsData.hero.ctaText}
                      onChange={(e) =>
                        setCmsData({
                          ...cmsData,
                          hero: { ...cmsData.hero, ctaText: e.target.value },
                        })
                      }
                      className="w-full bg-[#09090b] border border-[#27272a] rounded-xl px-4 py-2.5 text-xs text-white focus:border-[#22c55e] outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1">
                      Primary CTA Link
                    </label>
                    <input
                      type="text"
                      value={cmsData.hero.ctaLink}
                      onChange={(e) =>
                        setCmsData({
                          ...cmsData,
                          hero: { ...cmsData.hero, ctaLink: e.target.value },
                        })
                      }
                      className="w-full bg-[#09090b] border border-[#27272a] rounded-xl px-4 py-2.5 text-xs text-white focus:border-[#22c55e] outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Live Preview Box */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Live Card Preview</span>
                  <span className="text-[#22c55e] font-mono">Real-time Renderer</span>
                </div>
                <div
                  className="relative p-6 rounded-2xl border border-[#27272a] bg-cover bg-center overflow-hidden min-h-[260px] flex flex-col justify-end"
                  style={{ backgroundImage: `linear-gradient(to top, rgba(9,9,11,0.95), rgba(9,9,11,0.4)), url(${cmsData.hero.bgImageUrl})` }}
                >
                  <span className="inline-block px-2.5 py-1 rounded-md bg-[#22c55e]/20 text-[#22c55e] border border-[#22c55e]/30 text-[10px] font-bold tracking-wider uppercase mb-2 self-start">
                    {cmsData.hero.badgeText}
                  </span>
                  <h3 className="text-xl font-black text-white leading-tight">{cmsData.hero.title}</h3>
                  <p className="text-xs text-slate-300 mt-1 line-clamp-2">{cmsData.hero.subtitle}</p>

                  <div className="mt-4 flex items-center gap-3">
                    <button className="px-4 py-2 bg-[#22c55e] text-black font-bold text-xs rounded-lg shadow-md">
                      {cmsData.hero.ctaText}
                    </button>
                    <button className="px-4 py-2 bg-black/60 border border-white/20 text-white font-bold text-xs rounded-lg">
                      {cmsData.hero.secondaryCtaText}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Announcements Ticker Bar */}
          <div className="bg-[#18181b] border border-[#27272a] rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-[#27272a] pb-3">
              <h3 className="text-md font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#22c55e]" /> Top Announcement Ticker Bar
              </h3>
            </div>

            {cmsData.announcements.map((ann, idx) => (
              <div key={ann.id} className="p-4 bg-[#09090b] border border-[#27272a] rounded-xl space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="md:col-span-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Ticker Message</label>
                    <input
                      type="text"
                      value={ann.message}
                      onChange={(e) => {
                        const updated = [...cmsData.announcements];
                        updated[idx].message = e.target.value;
                        setCmsData({ ...cmsData, announcements: updated });
                      }}
                      className="w-full bg-[#18181b] border border-[#27272a] rounded-lg px-3 py-2 text-xs text-white focus:border-[#22c55e] outline-none mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Link URL</label>
                    <input
                      type="text"
                      value={ann.linkUrl || ''}
                      onChange={(e) => {
                        const updated = [...cmsData.announcements];
                        updated[idx].linkUrl = e.target.value;
                        setCmsData({ ...cmsData, announcements: updated });
                      }}
                      className="w-full bg-[#18181b] border border-[#27272a] rounded-lg px-3 py-2 text-xs text-white focus:border-[#22c55e] outline-none mt-1"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Featured Skins Manager */}
          <div className="bg-[#18181b] border border-[#27272a] rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-[#27272a] pb-3">
              <h3 className="text-md font-bold text-white flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-[#22c55e]" /> Featured Homepage Skins Showcase ({cmsData.featuredListings.length})
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {cmsData.featuredListings.map((item) => (
                <div key={item.id} className="p-4 bg-[#09090b] border border-[#27272a] rounded-xl flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img src={item.image} alt={item.title} className="w-12 h-12 object-cover rounded-lg border border-[#27272a]" />
                    <div>
                      <h4 className="text-xs font-bold text-white">{item.title}</h4>
                      <p className="text-[11px] text-slate-400">{item.skin}</p>
                      <div className="text-xs font-black text-[#22c55e] mt-0.5">৳ {item.price.toLocaleString('en-BD')}</div>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 bg-[#22c55e]/10 text-[#22c55e] border border-[#22c55e]/30 text-[10px] font-bold rounded">
                    {item.tag}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: BLOG & ARTICLES */}
      {activeTab === 'blog' && (
        <div className="space-y-8 animate-in fade-in duration-200">
          {/* Create Article Form */}
          <form onSubmit={handleAddBlog} className="bg-[#18181b] border border-[#27272a] rounded-2xl p-6 space-y-4">
            <h3 className="text-md font-bold text-white flex items-center gap-2">
              <Plus className="w-4 h-4 text-[#22c55e]" /> Publish New CS2 Trading Article
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-300 uppercase">Article Title</label>
                <input
                  type="text"
                  placeholder="e.g. How to Buy CS2 Knives in BD using bKash"
                  value={newBlog.title}
                  onChange={(e) => setNewBlog({ ...newBlog, title: e.target.value })}
                  className="w-full bg-[#09090b] border border-[#27272a] rounded-xl px-4 py-2.5 text-xs text-white focus:border-[#22c55e] outline-none mt-1"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 uppercase">Category</label>
                <select
                  value={newBlog.category}
                  onChange={(e) => setNewBlog({ ...newBlog, category: e.target.value })}
                  className="w-full bg-[#09090b] border border-[#27272a] rounded-xl px-4 py-2.5 text-xs text-white focus:border-[#22c55e] outline-none mt-1"
                >
                  <option value="Trading Guides">Trading Guides</option>
                  <option value="Security & Anti-Scam">Security & Anti-Scam</option>
                  <option value="CS2 News">CS2 News</option>
                  <option value="Skin Price Analysis">Skin Price Analysis</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 uppercase">Short Excerpt (SEO Summary)</label>
              <textarea
                rows={2}
                placeholder="Brief summary for Google search snippets..."
                value={newBlog.excerpt}
                onChange={(e) => setNewBlog({ ...newBlog, excerpt: e.target.value })}
                className="w-full bg-[#09090b] border border-[#27272a] rounded-xl px-4 py-2 text-xs text-white focus:border-[#22c55e] outline-none mt-1"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 uppercase">Full Content (Markdown or HTML)</label>
              <textarea
                rows={6}
                placeholder="Write article content here..."
                value={newBlog.content}
                onChange={(e) => setNewBlog({ ...newBlog, content: e.target.value })}
                className="w-full bg-[#09090b] border border-[#27272a] rounded-xl px-4 py-2.5 text-xs text-white focus:border-[#22c55e] outline-none mt-1 font-mono"
                required
              />
            </div>

            <button type="submit" className="btn btn-primary text-xs px-6">
              Create Article
            </button>
          </form>

          {/* Blog Articles List */}
          <div className="bg-[#18181b] border border-[#27272a] rounded-2xl p-6 space-y-4">
            <h3 className="text-md font-bold text-white">Published Articles ({cmsData.blogs.length})</h3>

            <div className="space-y-3">
              {cmsData.blogs.map((blog) => (
                <div key={blog.id} className="p-4 bg-[#09090b] border border-[#27272a] rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <img src={blog.coverImage} alt={blog.title} className="w-16 h-12 object-cover rounded-lg border border-[#27272a]" />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#22c55e]/10 text-[#22c55e]">
                          {blog.category}
                        </span>
                        <span className="text-xs text-slate-500">{blog.publishedAt}</span>
                      </div>
                      <h4 className="text-xs font-bold text-white mt-1">{blog.title}</h4>
                      <p className="text-[11px] text-slate-400 line-clamp-1">{blog.excerpt}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <Link
                      href={`/blog/${blog.slug}`}
                      target="_blank"
                      className="p-2 bg-[#18181b] border border-[#27272a] hover:border-slate-500 text-slate-300 rounded-lg transition"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => handleDeleteBlog(blog.id)}
                      className="p-2 bg-red-500/10 border border-red-500/30 hover:bg-red-500/20 text-red-400 rounded-lg transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: FAQS MANAGER */}
      {activeTab === 'faqs' && (
        <div className="space-y-8 animate-in fade-in duration-200">
          <form onSubmit={handleAddFAQ} className="bg-[#18181b] border border-[#27272a] rounded-2xl p-6 space-y-4">
            <h3 className="text-md font-bold text-white flex items-center gap-2">
              <Plus className="w-4 h-4 text-[#22c55e]" /> Add Frequently Asked Question
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-300 uppercase">Category</label>
                <select
                  value={newFaq.category}
                  onChange={(e) => setNewFaq({ ...newFaq, category: e.target.value as any })}
                  className="w-full bg-[#09090b] border border-[#27272a] rounded-xl px-4 py-2.5 text-xs text-white focus:border-[#22c55e] outline-none mt-1"
                >
                  <option value="Payment & bKash">Payment & bKash</option>
                  <option value="Buyer">Buyer</option>
                  <option value="Seller">Seller</option>
                  <option value="Disputes">Disputes</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="text-xs font-bold text-slate-300 uppercase">Question</label>
                <input
                  type="text"
                  placeholder="e.g. How long does manual bKash verification take?"
                  value={newFaq.question}
                  onChange={(e) => setNewFaq({ ...newFaq, question: e.target.value })}
                  className="w-full bg-[#09090b] border border-[#27272a] rounded-xl px-4 py-2.5 text-xs text-white focus:border-[#22c55e] outline-none mt-1"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 uppercase">Answer Explanation</label>
              <textarea
                rows={3}
                placeholder="Detailed answer for users..."
                value={newFaq.answer}
                onChange={(e) => setNewFaq({ ...newFaq, answer: e.target.value })}
                className="w-full bg-[#09090b] border border-[#27272a] rounded-xl px-4 py-2.5 text-xs text-white focus:border-[#22c55e] outline-none mt-1"
                required
              />
            </div>

            <button type="submit" className="btn btn-primary text-xs px-6">
              Add FAQ Item
            </button>
          </form>

          <div className="bg-[#18181b] border border-[#27272a] rounded-2xl p-6 space-y-4">
            <h3 className="text-md font-bold text-white">Active FAQ Entries ({cmsData.faqs.length})</h3>

            <div className="space-y-3">
              {cmsData.faqs.map((faq) => (
                <div key={faq.id} className="p-4 bg-[#09090b] border border-[#27272a] rounded-xl flex items-start justify-between gap-4">
                  <div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#22c55e]/10 text-[#22c55e]">
                      {faq.category}
                    </span>
                    <h4 className="text-xs font-bold text-white mt-1.5">{faq.question}</h4>
                    <p className="text-xs text-slate-400 mt-1">{faq.answer}</p>
                  </div>
                  <button
                    onClick={() => handleDeleteFAQ(faq.id)}
                    className="p-2 bg-red-500/10 border border-red-500/30 hover:bg-red-500/20 text-red-400 rounded-lg transition shrink-0"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: SEO SETTINGS */}
      {activeTab === 'seo' && (
        <div className="bg-[#18181b] border border-[#27272a] rounded-2xl p-6 space-y-6 animate-in fade-in duration-200">
          <div className="flex items-center justify-between border-b border-[#27272a] pb-4">
            <h3 className="text-md font-bold text-white flex items-center gap-2">
              <Globe className="w-5 h-5 text-[#22c55e]" /> Global SEO & OpenGraph Configurator
            </h3>
            <span className="text-xs text-[#22c55e] font-mono">100% Google Schema Ready</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-300 uppercase">Default Site Title</label>
                <input
                  type="text"
                  value={cmsData.seo.siteTitle}
                  onChange={(e) =>
                    setCmsData({
                      ...cmsData,
                      seo: { ...cmsData.seo, siteTitle: e.target.value },
                    })
                  }
                  className="w-full bg-[#09090b] border border-[#27272a] rounded-xl px-4 py-2.5 text-xs text-white focus:border-[#22c55e] outline-none mt-1"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 uppercase">Meta Description</label>
                <textarea
                  rows={3}
                  value={cmsData.seo.metaDescription}
                  onChange={(e) =>
                    setCmsData({
                      ...cmsData,
                      seo: { ...cmsData.seo, metaDescription: e.target.value },
                    })
                  }
                  className="w-full bg-[#09090b] border border-[#27272a] rounded-xl px-4 py-2.5 text-xs text-white focus:border-[#22c55e] outline-none mt-1"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 uppercase">Target Keywords (Comma Separated)</label>
                <input
                  type="text"
                  value={cmsData.seo.keywords}
                  onChange={(e) =>
                    setCmsData({
                      ...cmsData,
                      seo: { ...cmsData.seo, keywords: e.target.value },
                    })
                  }
                  className="w-full bg-[#09090b] border border-[#27272a] rounded-xl px-4 py-2.5 text-xs text-white focus:border-[#22c55e] outline-none mt-1"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-300 uppercase">Canonical Domain URL</label>
                <input
                  type="text"
                  value={cmsData.seo.canonicalDomain}
                  onChange={(e) =>
                    setCmsData({
                      ...cmsData,
                      seo: { ...cmsData.seo, canonicalDomain: e.target.value },
                    })
                  }
                  className="w-full bg-[#09090b] border border-[#27272a] rounded-xl px-4 py-2.5 text-xs text-white focus:border-[#22c55e] outline-none mt-1"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 uppercase">Google Merchant ID</label>
                <input
                  type="text"
                  value={cmsData.seo.googleMerchantId}
                  onChange={(e) =>
                    setCmsData({
                      ...cmsData,
                      seo: { ...cmsData.seo, googleMerchantId: e.target.value },
                    })
                  }
                  className="w-full bg-[#09090b] border border-[#27272a] rounded-xl px-4 py-2.5 text-xs text-white focus:border-[#22c55e] outline-none mt-1"
                />
              </div>

              <div className="p-4 bg-[#09090b] border border-[#27272a] rounded-xl space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-300">
                  <span>Dynamic XML Sitemap Status</span>
                  <span className="text-[#22c55e] font-bold">Active (/sitemap.xml)</span>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-300">
                  <span>Robots.txt Engine</span>
                  <span className="text-[#22c55e] font-bold">Active (/robots.txt)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: NAVIGATION */}
      {activeTab === 'navigation' && (
        <div className="bg-[#18181b] border border-[#27272a] rounded-2xl p-6 space-y-4 animate-in fade-in duration-200">
          <h3 className="text-md font-bold text-white flex items-center gap-2">
            <Navigation className="w-5 h-5 text-[#22c55e]" /> Navigation Links Editor
          </h3>

          <div className="space-y-3">
            {cmsData.navLinks.map((nav, idx) => (
              <div key={nav.id} className="p-4 bg-[#09090b] border border-[#27272a] rounded-xl grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Label</label>
                  <input
                    type="text"
                    value={nav.label}
                    onChange={(e) => {
                      const updated = [...cmsData.navLinks];
                      updated[idx].label = e.target.value;
                      setCmsData({ ...cmsData, navLinks: updated });
                    }}
                    className="w-full bg-[#18181b] border border-[#27272a] rounded-lg px-3 py-2 text-xs text-white focus:border-[#22c55e] outline-none mt-1"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Path</label>
                  <input
                    type="text"
                    value={nav.href}
                    onChange={(e) => {
                      const updated = [...cmsData.navLinks];
                      updated[idx].href = e.target.value;
                      setCmsData({ ...cmsData, navLinks: updated });
                    }}
                    className="w-full bg-[#18181b] border border-[#27272a] rounded-lg px-3 py-2 text-xs text-white focus:border-[#22c55e] outline-none mt-1"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Badge (Optional)</label>
                  <input
                    type="text"
                    value={nav.badge || ''}
                    onChange={(e) => {
                      const updated = [...cmsData.navLinks];
                      updated[idx].badge = e.target.value;
                      setCmsData({ ...cmsData, navLinks: updated });
                    }}
                    className="w-full bg-[#18181b] border border-[#27272a] rounded-lg px-3 py-2 text-xs text-white focus:border-[#22c55e] outline-none mt-1"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 6: FOOTER */}
      {activeTab === 'footer' && (
        <div className="bg-[#18181b] border border-[#27272a] rounded-2xl p-6 space-y-4 animate-in fade-in duration-200">
          <h3 className="text-md font-bold text-white flex items-center gap-2">
            <PanelBottom className="w-5 h-5 text-[#22c55e]" /> Footer Columns Manager
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {cmsData.footerColumns.map((col) => (
              <div key={col.id} className="p-4 bg-[#09090b] border border-[#27272a] rounded-xl space-y-3">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">{col.title}</h4>
                <div className="space-y-2">
                  {col.links.map((link, lIdx) => (
                    <div key={lIdx} className="flex items-center gap-2">
                      <span className="text-xs text-slate-400 min-w-[120px]">{link.label}</span>
                      <span className="text-xs text-[#22c55e] font-mono">{link.href}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 7: ADS & PROMOTIONS */}
      {activeTab === 'promotions' && (
        <div className="space-y-8 animate-in fade-in duration-200">
          <form onSubmit={handleAddPromo} className="bg-[#18181b] border border-[#27272a] rounded-2xl p-6 space-y-4">
            <h3 className="text-md font-bold text-white flex items-center gap-2">
              <Plus className="w-4 h-4 text-[#22c55e]" /> Create Promo Code or Banner Campaign
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-300 uppercase">Coupon Code</label>
                <input
                  type="text"
                  placeholder="e.g. CS2BD2026"
                  value={newPromo.code}
                  onChange={(e) => setNewPromo({ ...newPromo, code: e.target.value.toUpperCase() })}
                  className="w-full bg-[#09090b] border border-[#27272a] rounded-xl px-4 py-2.5 text-xs text-white focus:border-[#22c55e] outline-none mt-1 font-mono uppercase"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 uppercase">Campaign Title</label>
                <input
                  type="text"
                  placeholder="e.g. BD Major Launch Special"
                  value={newPromo.title}
                  onChange={(e) => setNewPromo({ ...newPromo, title: e.target.value })}
                  className="w-full bg-[#09090b] border border-[#27272a] rounded-xl px-4 py-2.5 text-xs text-white focus:border-[#22c55e] outline-none mt-1"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 uppercase">Discount (%)</label>
                <input
                  type="number"
                  min="1"
                  max="50"
                  value={newPromo.discountPercent}
                  onChange={(e) => setNewPromo({ ...newPromo, discountPercent: parseInt(e.target.value) || 0 })}
                  className="w-full bg-[#09090b] border border-[#27272a] rounded-xl px-4 py-2.5 text-xs text-white focus:border-[#22c55e] outline-none mt-1"
                />
              </div>
            </div>

            <button type="submit" className="btn btn-primary text-xs px-6">
              Create Campaign
            </button>
          </form>

          <div className="bg-[#18181b] border border-[#27272a] rounded-2xl p-6 space-y-4">
            <h3 className="text-md font-bold text-white">Active Promo Campaigns ({cmsData.promotions.length})</h3>

            <div className="space-y-3">
              {cmsData.promotions.map((promo) => (
                <div key={promo.id} className="p-4 bg-[#09090b] border border-[#27272a] rounded-xl flex items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-black text-sm text-[#22c55e]">{promo.code}</span>
                      <span className="px-2 py-0.5 bg-[#22c55e]/10 text-[#22c55e] text-[10px] font-bold rounded">
                        {promo.discountPercent}% OFF
                      </span>
                    </div>
                    <h4 className="text-xs font-bold text-white mt-1">{promo.title}</h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Used {promo.usedCount} / {promo.maxUses} times • Expires {promo.expiryDate}
                    </p>
                  </div>

                  <button
                    onClick={() => handleDeletePromo(promo.id)}
                    className="p-2 bg-red-500/10 border border-red-500/30 hover:bg-red-500/20 text-red-400 rounded-lg transition shrink-0"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
