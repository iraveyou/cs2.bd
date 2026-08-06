import { NextResponse } from 'next/server'
import prisma from '../../../../lib/prisma'
import { hash } from '@node-rs/argon2'

export async function POST(req: Request) {
  if (process.env.NODE_ENV === 'production') return NextResponse.json({ ok: false, message: 'Disabled in production' }, { status: 403 })
  try {
    const admins = [
      { email: 'admin1@cs2bd.test', name: 'Admin One', password: 'Password123!' },
      { email: 'admin2@cs2bd.test', name: 'Admin Two', password: 'Password123!' },
      { email: 'admin3@cs2bd.test', name: 'Admin Three', password: 'Password123!' },
      { email: 'admin4@cs2bd.test', name: 'Admin Four', password: 'Password123!' },
    ]

    const results: any[] = []
    for (const a of admins) {
      const existing = await prisma.user.findUnique({ where: { email: a.email } })
      if (existing) { results.push({ email: a.email, status: 'exists' }); continue }
      const pwdHash = await hash(a.password)
      const user = await prisma.user.create({ data: { email: a.email, name: a.name, passwordHash: pwdHash, role: 'ADMIN' } })
      results.push({ email: a.email, id: user.id })
    }

    return NextResponse.json({ ok: true, results })
  } catch (err: any) {
    console.error('seed admin error', err)
    return NextResponse.json({ ok: false, message: err.message || 'Error' }, { status: 500 })
  }
}
