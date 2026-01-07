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
  description: "Devenez partenaire Newbi et gagnez jusqu'à 50% de commission sur chaque client référé. Recommandez Newbi à votre réseau professionnel.",
  icons: {
    icon: "https://pub-866a54f5560d449cb224411e60410621.r2.dev/Logo_NI_Purple.png",
    shortcut: "https://pub-866a54f5560d449cb224411e60410621.r2.dev/Logo_NI_Purple.png",
    apple: "https://pub-866a54f5560d449cb224411e60410621.r2.dev/Logo_NI_Purple.png",
  },
  openGraph: {
    title: "Devenez Partenaire Newbi - Gagnez jusqu'à 50% de commission",
    description: "Recommandez Newbi à votre réseau professionnel et générez des revenus sur chaque client référé.",
    url: "https://partenaire.newbi.fr",
    siteName: "Newbi Partenaire",
    images: [
      {
        url: "https://pub-866a54f5560d449cb224411e60410621.r2.dev/og-partenaire-newbi.png",
        width: 1200,
        height: 630,
        alt: "Newbi Partenaire - Gagnez des commissions",
      },
    ],
    locale: "fr_FR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Devenez Partenaire Newbi - Gagnez jusqu'à 50% de commission",
    description: "Recommandez Newbi à votre réseau professionnel et générez des revenus sur chaque client référé.",
    images: ["https://pub-866a54f5560d449cb224411e60410621.r2.dev/og-partenaire-newbi.png"],
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
