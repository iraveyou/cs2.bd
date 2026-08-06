import { NextRequest, NextResponse } from 'next/server';
import { CMSRepository } from '../../../../lib/repositories/cms.repository';

export async function GET() {
  const data = CMSRepository.getCMSData();
  return NextResponse.json({ success: true, cms: data });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, payload } = body;

    if (action === 'update_hero') {
      const updated = CMSRepository.updateHeroBanner(payload);
      return NextResponse.json({ success: true, hero: updated });
    }

    if (action === 'save_seo') {
      const updated = CMSRepository.updateSEO(payload);
      return NextResponse.json({ success: true, seo: updated });
    }

    if (action === 'add_blog') {
      const newBlog = CMSRepository.addBlogPost(payload);
      return NextResponse.json({ success: true, blog: newBlog });
    }

    if (action === 'delete_blog') {
      const deleted = CMSRepository.deleteBlogPost(payload.id);
      return NextResponse.json({ success: true, deleted });
    }

    if (action === 'add_faq') {
      const newFaq = CMSRepository.addFAQ(payload);
      return NextResponse.json({ success: true, faq: newFaq });
    }

    if (action === 'delete_faq') {
      const deleted = CMSRepository.deleteFAQ(payload.id);
      return NextResponse.json({ success: true, deleted });
    }

    if (action === 'add_promo') {
      const newPromo = CMSRepository.addPromotion(payload);
      return NextResponse.json({ success: true, promo: newPromo });
    }

    if (action === 'delete_promo') {
      const deleted = CMSRepository.deletePromotion(payload.id);
      return NextResponse.json({ success: true, deleted });
    }

    if (action === 'save_full') {
      const full = CMSRepository.saveFullCMSState(payload);
      return NextResponse.json({ success: true, cms: full });
    }

    return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message || 'CMS error' }, { status: 500 });
  }
}
