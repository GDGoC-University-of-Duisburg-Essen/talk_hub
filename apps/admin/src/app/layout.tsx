import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Admin - GDG Talk Hub",
  description: "Add new talks to your GDG locally",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen bg-background font-sans antialiased text-foreground`}>
        <div className="border-b border-[var(--color-gdg-grey-200)] bg-background">
          <div className="container mx-auto flex h-16 items-center px-4">
            <div className="flex items-center space-x-3 font-bold text-xl">
              <img src="/assets/GDG Brackets removed background.png" alt="GDG Brackets" className="h-8 w-auto object-contain" />
              <span>GDG Talk Admin</span>
            </div>
          </div>
        </div>
        <main className="container mx-auto px-4 py-8">
          {children}
        </main>
      </body>
    </html>
  );
}
