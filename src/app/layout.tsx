import type { Metadata } from "next";
import { Geist, Kalam, Fredoka } from "next/font/google";
import "./globals.css";
import dynamic from 'next/dynamic';

const FolderNavigation = dynamic(() => import('./components/FolderNavigation'), {
  ssr: true
});

const LayoutWrapper = dynamic(() => import('./components/LayoutWrapper'), {
  ssr: true
});

const geist = Geist({
  subsets: ["latin"],
});

const kalam = Kalam({
  subsets: ["latin"],
  weight: ["300", "400", "700"],
  variable: "--font-kalam",
});

const fredoka = Fredoka({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-fredoka",
});

export const metadata: Metadata = {
  title: "Kev's Site",
  description: "A website with folder-style navigation",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${geist.className} ${kalam.variable} ${fredoka.variable} min-h-screen`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-2 pb-6">
          <div className="relative">
            <FolderNavigation />
            <LayoutWrapper>
              {children}
            </LayoutWrapper>
          </div>
        </div>
      </body>
    </html>
  );
}
