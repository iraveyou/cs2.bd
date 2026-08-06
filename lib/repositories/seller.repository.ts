import prisma from '../prisma';

export interface SellerApplication {
  id: string;
  userId: string;
  name: string;
  email: string;
  phone: string;
  nid: string;
  facebook: string;
  steamProfile: string;
  discord: string;
  experience: string;
  bankDetails: string;
  bkash: string;
  nagad: string;
  portfolio: string;
  previousSales: string;
  documentsUrl?: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt: string;
  reviewedAt?: string;
  adminNotes?: string;
}

class SellerRepository {
  public async getApplications(): Promise<SellerApplication[]> {
    const applicants = await prisma.user.findMany({
      where: { role: 'SELLER_APPLICANT' },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        steamId: true,
        discordId: true,
        createdAt: true,
      },
    });

    return applicants.map((a) => ({
      id: `app-${a.id}`,
      userId: a.id,
      name: a.name || 'Unnamed',
      email: a.email || '',
      phone: a.phone || '',
      nid: '',
      facebook: '',
      steamProfile: a.steamId || '',
      discord: a.discordId || '',
      experience: '',
      bankDetails: '',
      bkash: '',
      nagad: '',
      portfolio: '',
      previousSales: '',
      status: 'PENDING' as const,
      createdAt: a.createdAt.toISOString(),
    }));
  }

  public async getApplicationById(id: string): Promise<SellerApplication | undefined> {
    const userId = id.startsWith('app-') ? id.slice(4) : id;
    const user = await prisma.user.findUnique({
      where: { id: userId, role: 'SELLER_APPLICANT' },
      select: { id: true, name: true, email: true, phone: true, steamId: true, discordId: true, createdAt: true },
    });
    if (!user) return undefined;

    return {
      id: `app-${user.id}`,
      userId: user.id,
      name: user.name || 'Unnamed',
      email: user.email || '',
      phone: user.phone || '',
      nid: '',
      facebook: '',
      steamProfile: user.steamId || '',
      discord: user.discordId || '',
      experience: '',
      bankDetails: '',
      bkash: '',
      nagad: '',
      portfolio: '',
      previousSales: '',
      status: 'PENDING' as const,
      createdAt: user.createdAt.toISOString(),
    };
  }

  public async createApplication(data: Omit<SellerApplication, 'id' | 'status' | 'createdAt'>): Promise<SellerApplication> {
    const existingUser = data.userId
      ? await prisma.user.findUnique({ where: { id: data.userId } })
      : data.email ? await prisma.user.findUnique({ where: { email: data.email } }) : null;

    if (!existingUser) {
      throw new Error('User not found. Please sign in first.');
    }

    const updated = await prisma.user.update({
      where: { id: existingUser.id },
      data: {
        role: 'SELLER_APPLICANT',
        phone: data.phone || existingUser.phone,
        steamId: data.steamProfile || existingUser.steamId,
        discordId: data.discord || existingUser.discordId,
      },
      select: { id: true, name: true, email: true, phone: true, steamId: true, discordId: true, createdAt: true },
    });

    return {
      id: `app-${updated.id}`,
      userId: updated.id,
      name: updated.name || 'Unnamed',
      email: updated.email || '',
      phone: updated.phone || '',
      nid: data.nid || '',
      facebook: data.facebook || '',
      steamProfile: updated.steamId || '',
      discord: updated.discordId || '',
      experience: data.experience || '',
      bankDetails: data.bankDetails || '',
      bkash: data.bkash || '',
      nagad: data.nagad || '',
      portfolio: data.portfolio || '',
      previousSales: data.previousSales || '',
      documentsUrl: data.documentsUrl,
      status: 'PENDING' as const,
      createdAt: updated.createdAt.toISOString(),
    };
  }

  public async approveApplication(id: string, notes?: string): Promise<SellerApplication> {
    const userId = id.startsWith('app-') ? id.slice(4) : id;
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new Error('Seller application not found');

    await prisma.user.update({ where: { id: userId }, data: { role: 'SELLER' } });

    const slug = (user.name || 'seller').toLowerCase().replace(/[^a-z0-9]/g, '') + '-' + userId.slice(0, 6);
    const existingStore = await prisma.store.findUnique({ where: { userId } });
    if (!existingStore) {
      await prisma.store.create({
        data: {
          userId,
          name: `${user.name || 'Seller'}'s Store`,
          slug,
          description: 'Verified CS2 Merchant Store on CS2BD Bangladesh',
          kycStatus: 'APPROVED',
          verifiedAt: new Date(),
          trustScore: 99.0,
        },
      });
    }

    return {
      id: `app-${userId}`,
      userId,
      name: user.name || 'Unnamed',
      email: user.email || '',
      phone: user.phone || '',
      nid: '',
      facebook: '',
      steamProfile: user.steamId || '',
      discord: user.discordId || '',
      experience: '',
      bankDetails: '',
      bkash: '',
      nagad: '',
      portfolio: '',
      previousSales: '',
      status: 'APPROVED',
      createdAt: user.createdAt.toISOString(),
      reviewedAt: new Date().toISOString(),
      adminNotes: notes,
    };
  }

  public async rejectApplication(id: string, notes?: string): Promise<SellerApplication> {
    const userId = id.startsWith('app-') ? id.slice(4) : id;
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new Error('Seller application not found');

    await prisma.user.update({ where: { id: userId }, data: { role: 'USER' } });

    return {
      id: `app-${userId}`,
      userId,
      name: user.name || 'Unnamed',
      email: user.email || '',
      phone: user.phone || '',
      nid: '',
      facebook: '',
      steamProfile: user.steamId || '',
      discord: user.discordId || '',
      experience: '',
      bankDetails: '',
      bkash: '',
      nagad: '',
      portfolio: '',
      previousSales: '',
      status: 'REJECTED',
      createdAt: user.createdAt.toISOString(),
      reviewedAt: new Date().toISOString(),
      adminNotes: notes,
    };
  }
}

export const sellerRepository = new SellerRepository();
