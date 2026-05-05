import type { Metadata } from 'next';
import { Google_Sans_Flex } from 'next/font/google';
import './globals.css';

const google_sans_flex = Google_Sans_Flex({
  subsets: ['latin'],
  variable: '--font-sans',
});

export const metadata: Metadata = {
  title: 'Sema',
  description: 'Sema - Your AI-powered personal assistant',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={`${google_sans_flex.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
