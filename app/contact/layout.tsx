import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact CS2BD — Support & Help | cs2bd Bangladesh',
  description: 'Contact CS2BD Bangladesh customer support. Get help with orders, payments, seller verification, and disputes. Email, Discord, and contact form available.',
  keywords: ['cs2bd contact', 'cs2bd support', 'cs2 marketplace help bangladesh', 'cs2 skin dispute support'],
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
