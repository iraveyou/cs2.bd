import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Create Account — CS2BD Bangladesh',
  description: 'Sign up for CS2BD to buy CS2 skins with bKash/Nagad or apply to become a verified seller in Bangladesh.',
  keywords: ['cs2bd signup', 'create cs2bd account', 'register cs2 marketplace bd'],
};

export default function SignUpLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
