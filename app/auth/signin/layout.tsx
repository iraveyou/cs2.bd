import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sign In — CS2BD Bangladesh',
  description: 'Sign in to your CS2BD account to buy and sell CS2 skins in Bangladesh. Use email/password or Steam to access your dashboard.',
};

export default function SignInLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
