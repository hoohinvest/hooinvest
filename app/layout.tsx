import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'HooVest | Invest in Real Businesses. Own Real Results.',
  description: 'Raise capital or invest with clarity—equity, interest, or royalties—on one simple platform. Access real businesses and real assets with transparent underwriting.',
  openGraph: {
    title: 'HooVest | Invest in Real Businesses',
    description: 'Raise capital or invest with clarity—equity, interest, or royalties—on one simple platform.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('theme') || 'dark';
                  document.documentElement.setAttribute('data-theme', theme);
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}



