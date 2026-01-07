import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { ApolloProviderWrapper } from "@/src/components/apollo-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Espace Partenaire - Newbi",
  description: "Interface dédiée aux apporteurs d'affaires Newbi",
  icons: {
    icon: "https://pub-866a54f5560d449cb224411e60410621.r2.dev/Logo_NI_Purple.png",
    shortcut: "https://pub-866a54f5560d449cb224411e60410621.r2.dev/Logo_NI_Purple.png",
    apple: "https://pub-866a54f5560d449cb224411e60410621.r2.dev/Logo_NI_Purple.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="dark" style={{ colorScheme: 'dark' }}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ApolloProviderWrapper>
          <Toaster position="top-right" richColors />
          {children}
        </ApolloProviderWrapper>
      </body>
    </html>
  );
}
