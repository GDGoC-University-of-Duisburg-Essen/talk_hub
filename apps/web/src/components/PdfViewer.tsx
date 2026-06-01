"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";

// Dynamically import the Android viewer with SSR disabled to prevent pdf.js canvas issues
const AndroidPdfPreview = dynamic(() => import("./AndroidPdfPreview"), {
  ssr: false,
  loading: () => (
    <div className="flex-1 flex flex-col items-center justify-center py-12 bg-[var(--color-gdg-grey-50)] dark:bg-[var(--color-gdg-grey-900)] h-full min-h-[300px]">
      <Loader2 className="w-8 h-8 text-[var(--color-gdg-blue)] animate-spin mb-4" />
      <p className="text-sm text-muted">Lade Viewer...</p>
    </div>
  )
});

interface PdfViewerProps {
  pdfUrl: string;
}

export function PdfViewer({ pdfUrl }: PdfViewerProps) {
  const [needsCustomViewer, setNeedsCustomViewer] = useState<boolean | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (typeof window !== "undefined") {
        const isAndroidDevice = /android/i.test(navigator.userAgent.toLowerCase());
        const lacksPdfPlugin = 'pdfViewerEnabled' in navigator && navigator.pdfViewerEnabled === false;
        
        // If it's an Android device OR the browser explicitly says it doesn't support PDFs inline
        setNeedsCustomViewer(isAndroidDevice || lacksPdfPlugin);
      }
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  // Show a simple loading state while checking the user agent
  if (needsCustomViewer === null) {
    return (
      <div className="flex-1 flex items-center justify-center bg-white dark:bg-[var(--color-gdg-grey-900)] h-[500px] min-h-[300px]">
        <Loader2 className="w-8 h-8 text-[var(--color-gdg-blue)] animate-spin" />
      </div>
    );
  }

  if (needsCustomViewer) {
    return <AndroidPdfPreview pdfUrl={pdfUrl} />;
  }

  return (
    <>
      <iframe
        src={`${pdfUrl}#toolbar=1&navpanes=0&scrollbar=1`}
        className="w-full h-full border-0 hidden md:block"
        title="Präsentationsfolien Preview"
      />
      <div className="md:hidden flex-1 bg-white h-full">
        <object
          data={`${pdfUrl}#toolbar=1&navpanes=0&scrollbar=1`}
          type="application/pdf"
          className="w-full h-full border-0 min-h-[300px]"
          aria-label="Präsentationsfolien Mobile Preview"
        >
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-[var(--color-gdg-grey-50)] dark:bg-[var(--color-gdg-grey-900)] h-full min-h-[300px]">
            <p className="mb-4 text-muted text-sm">Die mobile Vorschau wird von diesem Browser nicht unterstützt. Bitte öffne die PDF direkt:</p>
            <a
              href={pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--color-gdg-blue)] underline font-medium text-sm"
            >
              PDF hier im Vollbild öffnen
            </a>
          </div>
        </object>
      </div>
    </>
  );
}
