import { NextResponse } from 'next/server';
import { sellerRepository } from '../../../../../lib/repositories/seller.repository';

export async function GET() {
  try {
    const applications = await sellerRepository.getApplications();
    return NextResponse.json({ ok: true, data: applications });
  } catch (err: any) {
    return NextResponse.json({ ok: false, message: 'Failed to fetch seller applications' }, { status: 500 });
  }
}
