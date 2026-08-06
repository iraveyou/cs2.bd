import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../lib/auth/nextauth';
import { sellerRepository } from '../../../../lib/repositories/seller.repository';
import { notifySellerApplicationSubmitted } from '../../../../lib/notification-utils';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ ok: false, message: 'Please sign in to apply.' }, { status: 401 });
    }

    const formData = await req.formData();

    const name = formData.get('name')?.toString() || '';
    const email = formData.get('email')?.toString() || '';
    const phone = formData.get('phone')?.toString() || '';
    const nid = formData.get('nid')?.toString() || '';
    const facebook = formData.get('facebook')?.toString() || '';
    const steamProfile = formData.get('steamProfile')?.toString() || '';
    const discord = formData.get('discord')?.toString() || '';
    const experience = formData.get('experience')?.toString() || '';
    const bankDetails = formData.get('bankDetails')?.toString() || '';
    const bkash = formData.get('bkash')?.toString() || '';
    const nagad = formData.get('nagad')?.toString() || '';
    const portfolio = formData.get('portfolio')?.toString() || '';
    const previousSales = formData.get('previousSales')?.toString() || '';

    if (!name || !phone || !nid || !steamProfile) {
      return NextResponse.json({ ok: false, message: 'Missing required fields (Name, Phone, NID, Steam Profile).' }, { status: 400 });
    }

    const file = formData.get('documents') as File | null;
    let documentsUrl = '';
    if (file && file.name) {
      documentsUrl = `/uploads/${Date.now()}_${file.name}`;
    }

    const application = await sellerRepository.createApplication({
      userId: (session as any).userId,
      name,
      email,
      phone,
      nid,
      facebook,
      steamProfile,
      discord,
      experience,
      bankDetails,
      bkash,
      nagad,
      portfolio,
      previousSales,
      documentsUrl,
    });

    notifySellerApplicationSubmitted((session as any).userId).catch(() => {});

    return NextResponse.json({
      ok: true,
      message: 'Seller application submitted. Admin review is pending.',
      data: application,
    });
  } catch (err: any) {
    console.error('Seller Application Error:', err);
    return NextResponse.json({ ok: false, message: err.message || 'Failed to process application' }, { status: 500 });
  }
}
