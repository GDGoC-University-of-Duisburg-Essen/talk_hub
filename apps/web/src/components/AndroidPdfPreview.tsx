"use client";

import { useState, useEffect } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { ExternalLink, Loader2 } from "lucide-react";

// Configure worker to load from unpkg according to the exact version
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface AndroidPdfPreviewProps {
  pdfUrl: string;
}

export default function AndroidPdfPreview({ pdfUrl }: AndroidPdfPreviewProps) {
  const [numPages, setNumPages] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [windowWidth, setWindowWidth] = useState(300);

  useEffect(() => {
    const timer = setTimeout(() => {
      setWindowWidth(Math.min(window.innerWidth - 32, 600));
    }, 0);

    const handleResize = () => {
      setWindowWidth(Math.min(window.innerWidth - 32, 600));
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
    setLoading(false);
  }

  function onDocumentLoadError() {
    setLoading(false);
    setError(true);
  }

  // We show up to 3 pages
  const pagesToShow = Math.min(numPages, 3);

  return (
    <div className="flex-1 flex flex-col items-center p-4 bg-[var(--color-gdg-grey-50)] dark:bg-[var(--color-gdg-grey-900)] overflow-y-auto h-full">
      <div className="w-full max-w-lg mx-auto flex flex-col items-center">

        {loading && (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="w-8 h-8 text-[var(--color-gdg-blue)] animate-spin mb-4" />
            <p className="text-sm text-muted">Lade Vorschau...</p>
          </div>
        )}

        {error && (
          <div className="text-center py-8">
            <p className="text-red-500 text-sm mb-4">Vorschau konnte nicht geladen werden.</p>
          </div>
        )}

        <div className={loading || error ? "hidden" : "w-full"}>
          <Document
            file={pdfUrl}
            onLoadSuccess={onDocumentLoadSuccess}
            onLoadError={onDocumentLoadError}
            loading={null}
            className="w-full flex flex-col items-center gap-6"
          >
            {Array.from(new Array(pagesToShow), (el, index) => (
              <div key={`page_${index + 1}`} className="shadow-md rounded-md overflow-hidden bg-white w-full flex justify-center">
                <Page
                  pageNumber={index + 1}
                  renderTextLayer={false}
                  renderAnnotationLayer={false}
                  width={windowWidth}
                />
              </div>
            ))}
          </Document>
        </div>

        {(!loading || error) && (
          <div className="mt-8 flex flex-col items-center w-full pb-8">
            {numPages > 3 && !error && (
              <p className="text-xs text-muted mb-4 font-medium bg-[var(--color-gdg-grey-200)] dark:bg-[var(--color-gdg-grey-800)] px-3 py-1 rounded-full">
                + {numPages - 3} weitere Seiten
              </p>
            )}

            <a
              href={pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center w-full rounded-full bg-[var(--color-gdg-blue)] px-6 py-3.5 text-sm font-bold text-white shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5 active:scale-95"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Gesamtes PDF öffnen
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
