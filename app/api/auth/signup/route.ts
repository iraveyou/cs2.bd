import { NextResponse } from 'next/server'
import prisma from '../../../../lib/prisma'
import { hash } from '@node-rs/argon2'
import { createNotification } from '../../../../lib/notification-utils'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { name, email, phone, password, accountType } = body
    if (!email || !password || !name) return NextResponse.json({ ok: false, message: 'Missing fields' }, { status: 400 })

    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) return NextResponse.json({ ok: false, message: 'Email already registered' }, { status: 409 })

    const passwordHash = await hash(password)
    const role = accountType === 'seller' ? 'SELLER_APPLICANT' : 'USER'

    const user = await prisma.user.create({ data: { name, email, phone: phone || null, passwordHash, role } })

    createNotification({
      userId: user.id,
      type: 'system',
      title: 'Welcome to CS2BD',
      message: accountType === 'seller' ? 'Your account is ready. Apply for seller verification to start listing skins.' : 'Your account is ready. Start browsing and buying CS2 skins.',
      link: accountType === 'seller' ? '/seller/apply' : '/marketplace',
    }).catch(() => {})

    return NextResponse.json({ ok: true, user: { id: user.id, email: user.email, name: user.name, role: user.role } })
  } catch (err: any) {
    console.error('signup error', err)
    return NextResponse.json({ ok: false, message: err.message || 'Error' }, { status: 500 })
  }
}
