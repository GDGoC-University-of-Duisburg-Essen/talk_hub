import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const inter = Inter({ subsets: ["latin"] });

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

export const metadata: Metadata = {
  title: "GDG Talk Hub UDE",
  description: "Presentations and Talks from GDGoC, University of Duisburg-Essen",
  icons: {
    icon: `${basePath}/favicon.png`,
    shortcut: `${basePath}/favicon.png`,
    apple: `${basePath}/favicon.png`,
  },
  openGraph: {
    title: "GDG Talk Hub UDE",
    description: "Presentations and Talks from GDGoC, University of Duisburg-Essen",
    url: "https://gdgoc-university-of-duisburg-essen.github.io/talk_hub/",
    siteName: "GDG Talk Hub UDE",
    images: [
      {
        url: `${basePath}/og/og-image.png`,
        width: 1200,
        height: 630,
        alt: "GDG Talk Hub",
      },
    ],
    locale: "de_DE",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "GDG Talk Hub UDE",
    description: "Presentations and Talks from GDGoC, University of Duisburg-Essen",
    images: [
      {
        url: `${basePath}/og/og-image.png`,
        width: 1200,
        height: 630,
        alt: "GDG Talk Hub",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen bg-background font-sans antialiased`}>
        <ThemeProvider>
          <div className="relative flex min-h-screen flex-col">
            <Header />
            <div className="flex-1">
              {children}
            </div>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
