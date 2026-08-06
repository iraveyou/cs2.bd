import { PrismaAdapter } from '@next-auth/prisma-adapter';
import NextAuth, { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import prisma from '../prisma';
import { verify } from '@node-rs/argon2';

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: 'jwt',
  },
  providers: [
    CredentialsProvider({
      id: 'credentials',
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text', placeholder: 'you@domain.com' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        const user = await prisma.user.findUnique({ where: { email: credentials.email } });
        if (!user || !user.passwordHash) return null;
        try {
          const valid = await verify(user.passwordHash, credentials.password);
          if (!valid) return null;
          const { passwordHash, ...safeUser } = user as any;
          return safeUser as any;
        } catch (err) {
          console.error('Password verify error', err);
          return null;
        }
      },
    }),

    CredentialsProvider({
      id: 'steam-credentials',
      name: 'Steam',
      credentials: {
        steamId: { label: 'Steam ID', type: 'text' },
        userId: { label: 'User ID', type: 'text' },
        steamApiKey: { label: 'Steam API Key', type: 'text' },
      },
      async authorize(credentials) {
        if (!credentials?.steamId || !credentials?.userId) return null;
        const user = await prisma.user.findUnique({
          where: { id: credentials.userId },
        });
        if (!user) return null;

        if (!user.steamId) {
          const updatedUser = await prisma.user.update({
            where: { id: user.id },
            data: { steamId: credentials.steamId },
          });
          const { passwordHash, ...safeUser } = updatedUser as any;
          return safeUser as any;
        }

        if (user.steamId !== credentials.steamId) {
          console.warn(`Steam ID mismatch for user ${user.id}: expected ${user.steamId}, got ${credentials.steamId}`);
          return null;
        }

        const { passwordHash, ...safeUser } = user as any;
        return safeUser as any;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.userId = (user as any).id;
        token.role = (user as any).role;
        token.steamId = (user as any).steamId || null;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        (session as any).userId = token.userId;
        (session as any).role = token.role;
        (session as any).steamId = token.steamId || null;
      }
      return session;
    },
    async signIn({ user }) {
      return true;
    },
  },
  pages: {
    signIn: '/auth/signin',
  },
  debug: process.env.NODE_ENV !== 'production',
};

export default NextAuth(authOptions);
