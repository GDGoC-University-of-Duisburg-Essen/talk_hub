import { getTalks } from "@/lib/talks";
import Link from "next/link";
import { ArrowLeft, Download, Calendar, Tag, User } from "lucide-react";
import { notFound } from "next/navigation";

export async function generateStaticParams() {
  const talks = getTalks();
  return talks.map((talk) => ({
    year: new Date(talk.date).getFullYear().toString(),
    slug: talk.slug,
  }));
}

export default async function TalkDetailsPage({ params }: { params: Promise<{ year: string; slug: string }> }) {
  const resolvedParams = await params;
  const talks = getTalks();
  const talk = talks.find(t => new Date(t.date).getFullYear().toString() === resolvedParams.year && t.slug === resolvedParams.slug);

  if (!talk) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
       <Link href="/" className="inline-flex items-center text-sm font-medium text-muted hover:text-foreground mb-8 transition-colors">
         <ArrowLeft className="w-4 h-4 mr-2" />
         Zurück zur Übersicht
       </Link>

       <header className="mb-8">
         <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
           <div>
             <div className="flex items-center gap-3 mb-3">
                <span className="text-xs font-bold text-white bg-[var(--color-gdg-blue)] px-2.5 py-1 rounded-md uppercase tracking-wide">
                  {talk.category}
                </span>
                <span className="text-xs font-medium bg-card border border-[var(--color-gdg-grey-200)] dark:border-[var(--color-gdg-grey-800)] px-2.5 py-1 rounded-md text-muted">
                  {talk.level}
                </span>
             </div>
             <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-4">{talk.title}</h1>
             
             <div className="flex flex-wrap items-center gap-4 text-sm text-muted">
                <div className="flex items-center">
                  <User className="w-4 h-4 mr-1.5" />
                  {talk.speaker}
                </div>
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1.5" />
                  {new Date(talk.date).toLocaleDateString('de-DE', { year: 'numeric', month: 'long', day: 'numeric' })}
                </div>
                <div className="flex items-center">
                  <Tag className="w-4 h-4 mr-1.5" />
                  {talk.event}
                </div>
             </div>
           </div>
           
           {talk.pdfPath && (
             <div className="relative inline-flex shrink-0 overflow-hidden rounded-full p-[3px] shadow-sm group hover:shadow-md transition-shadow">
               <span 
                 className="absolute left-1/2 top-1/2 h-[300%] w-[300%] origin-center -translate-x-1/2 -translate-y-1/2 transition-transform duration-[1000ms] ease-in-out group-hover:rotate-[180deg]"
                 style={{
                   background: "conic-gradient(var(--color-gdg-blue) 0deg 90deg, var(--color-gdg-red) 90deg 180deg, var(--color-gdg-yellow) 180deg 270deg, var(--color-gdg-green) 270deg 360deg)"
                 }}
               />
               <a 
                 href={`${process.env.NEXT_PUBLIC_BASE_PATH || ''}${encodeURI(talk.pdfPath)}`} 
                 download
                 className="relative inline-flex w-full items-center justify-center rounded-full bg-background px-7 py-3 text-sm font-bold text-foreground group-active:scale-[0.98] transition-all"
               >
                 <Download className="w-5 h-5 mr-3 text-[var(--color-gdg-blue)] group-hover:-translate-y-0.5 group-hover:scale-110 transition-transform duration-300" />
                 PDF Herunterladen
               </a>
             </div>
           )}
         </div>

         {talk.description && (
           <p className="mt-6 text-lg text-foreground/80 leading-relaxed max-w-4xl">
             {talk.description}
           </p>
         )}
       </header>

       {talk.pdfPath ? (
         <div className="mt-12 rounded-xl overflow-hidden border border-[var(--color-gdg-grey-200)] dark:border-[var(--color-gdg-grey-800)] bg-card shadow-lg flex flex-col" style={{ height: '75vh' }}>
            <div className="bg-[var(--color-gdg-grey-100)] dark:bg-[var(--color-gdg-grey-900)] p-3 border-b border-[var(--color-gdg-grey-200)] dark:border-[var(--color-gdg-grey-800)] flex justify-between items-center">
               <span className="text-sm font-medium text-muted">Präsentationsfolien</span>
            </div>
            <iframe 
              src={`${process.env.NEXT_PUBLIC_BASE_PATH || ''}${encodeURI(talk.pdfPath)}#toolbar=1&navpanes=0&scrollbar=1`}
              className="w-full flex-1 border-0 hidden md:block"
              title="Präsentationsfolien Preview"
            />
            {process.env.NEXT_PUBLIC_GITHUB_URL ? (
                <iframe 
                  src={`https://docs.google.com/viewer?url=${encodeURIComponent(`${process.env.NEXT_PUBLIC_GITHUB_URL}${process.env.NEXT_PUBLIC_BASE_PATH || ''}${encodeURI(talk.pdfPath)}`)}&embedded=true`}
                  className="w-full flex-1 border-0 block md:hidden bg-white"
                  title="Präsentationsfolien Mobile Preview"
                />
            ) : (
                <div className="md:hidden flex-1 flex flex-col items-center justify-center p-8 text-center bg-[var(--color-gdg-grey-50)] dark:bg-[var(--color-gdg-grey-900)]">
                     <p className="mb-4 text-muted text-sm">Die mobile Live-Vorschau für PDFs wird lokal nicht unterstützt (nur Online in GitHub Pages). Bitte öffne die PDF direkt:</p>
                     <a 
                       href={`${process.env.NEXT_PUBLIC_BASE_PATH || ''}${encodeURI(talk.pdfPath)}`} 
                       target="_blank" 
                       rel="noopener noreferrer"
                       className="text-[var(--color-gdg-blue)] underline font-medium text-sm"
                     >
                       PDF hier im Vollbild öffnen
                     </a>
                </div>
            )}
         </div>
       ) : (
         <div className="mt-12 bg-card border border-[var(--color-gdg-grey-200)] dark:border-[var(--color-gdg-grey-800)] rounded-xl py-16 text-center text-muted">
           Keine Präsentationsfolien für diesen Talk verfügbar.
         </div>
       )}
    </div>
  );
}
