import { getServerSession } from 'next-auth';
import { authOptions } from './nextauth';
import { redirect } from 'next/navigation';

// Mirror the Role enum locally to avoid Prisma client import at module load time
export const RoleEnum = {
  USER: 'USER',
  SELLER_APPLICANT: 'SELLER_APPLICANT',
  SELLER: 'SELLER',
  MODERATOR: 'MODERATOR',
  SUPPORT: 'SUPPORT',
  ADMIN: 'ADMIN',
} as const;

export type Role = (typeof RoleEnum)[keyof typeof RoleEnum];

export interface UserSession {
  id: string;
  email: string | null;
  role: Role;
  name?: string | null;
}

/**
 * Retrieves the current session user on the server.
 */
export async function getCurrentUser(): Promise<UserSession | null> {
  const session = await getServerSession(authOptions);
  if (!session?.user) return null;

  return {
    id: (session as any).userId,
    email: session.user.email ?? null,
    role: (session as any).role as Role,
    name: session.user.name,
  };
}

/**
 * Asserts that a user has a specific role, redirecting if not authorized or unauthenticated.
 */
export async function requireRole(allowedRoles: Role[], redirectTo = '/auth/signin') {
  const user = await getCurrentUser();

  if (!user) {
    redirect(redirectTo);
  }

  if (!allowedRoles.includes(user.role)) {
    redirect('/unauthorized');
  }

  return user;
}

/**
 * Checks if the user is an admin.
 */
export async function requireAdmin() {
  return requireRole([RoleEnum.ADMIN]);
}

/**
 * Checks if the user is a seller or admin.
 */
export async function requireSeller() {
  return requireRole([RoleEnum.SELLER, RoleEnum.ADMIN]);
}
