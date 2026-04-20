"use client";

import { useTheme } from "next-themes";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

export function Header() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[var(--color-gdg-grey-200)] dark:border-[var(--color-gdg-grey-800)] bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center px-4 justify-between">
        <Link href="/" className="flex items-center gap-2">
          {mounted ? (
            <>
              {/* Mobile Logo View (Small Brackets + 'Talk') */}
              <div className="flex sm:hidden items-center gap-1.5">
                <img
                  src={`${process.env.NEXT_PUBLIC_BASE_PATH || ''}/assets/GDG Brackets removed background.png`}
                  alt="GDG Brackets"
                  className="h-12 w-auto object-contain"
                />
                <span className="text-2xl font-bold text-foreground tracking-tight leading-none self-center">UDE</span>
              </div>

              {/* Desktop Logo View (Horizontal Logo) */}
              <img
                src={resolvedTheme === 'dark' ? `${process.env.NEXT_PUBLIC_BASE_PATH || ''}/assets/GDG Horizontal Dark Logo.png` : `${process.env.NEXT_PUBLIC_BASE_PATH || ''}/assets/GDG Horizontal Light Logo.png`}
                alt="GDG Talk Hub"
                className="hidden sm:block h-8 object-contain"
                onError={(e) => {
                  // fallback if not symlinked
                  e.currentTarget.src = "/assets/GDG Brackets removed background.png";
                }}
              />
            </>
          ) : (
            <div className="h-8 w-32 bg-card animate-pulse rounded" />
          )}
        </Link>

        <div className="flex items-center gap-2">
          <a
            href="https://gdg.community.dev/gdg-on-campus-university-of-duisburg-essen-essen-germany/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-card focus:outline-none"
          >
            GDG Official
          </a>

          <button
            onClick={() => setTheme(resolvedTheme === "light" ? "dark" : "light")}
            className="inline-flex items-center justify-center rounded-md p-2 hover:bg-card focus:outline-none"
          >
            <span className="sr-only">Toggle theme</span>
            {mounted ? (
              resolvedTheme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />
            ) : (
              <div className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
