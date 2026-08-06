import { NextRequest, NextResponse } from 'next/server';
import { sellerRepository } from '../../../../../lib/repositories/seller.repository';
import { notifySellerApproved } from '../../../../../lib/notification-utils';

export async function POST(req: NextRequest) {
  try {
    const { id, notes } = await req.json();
    if (!id) {
      return NextResponse.json({ ok: false, message: 'Application ID is required' }, { status: 400 });
    }

    const app = await sellerRepository.approveApplication(id, notes);

    notifySellerApproved(app.userId).catch(() => {});

    return NextResponse.json({ ok: true, message: `Seller application for ${app.name} has been approved!`, data: app });
  } catch (err: any) {
    return NextResponse.json({ ok: false, message: err.message || 'Failed to approve application' }, { status: 500 });
  }
}
