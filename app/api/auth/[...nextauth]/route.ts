import auth from '../../../../lib/auth/nextauth';

// NextAuth handler exported for App Router
const handler = auth;
export { handler as GET, handler as POST };
