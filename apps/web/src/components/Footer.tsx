export function Footer() {
  return (
    <footer className="">
      <div className="container mx-auto flex flex-col gap-2 px-4 py-5 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
        <p></p>
        <nav className="flex items-center gap-4" aria-label="Rechtliche Links">
          <a href="/impress" className="hover:text-foreground transition-colors">
            Impressum
          </a>
          <a href="/privacy" className="hover:text-foreground transition-colors">
            Datenschutz
          </a>
          <a
            href="https://fie-due.de/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 hover:text-foreground transition-colors"
          >
            Fachschaft
            <ExternalLinkIcon />
          </a>
          <a
            href="https://github.com/GDGoC-University-of-Duisburg-Essen/talk_hub"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 hover:text-foreground transition-colors"
          >
            GitHub
            <ExternalLinkIcon />
          </a>
        </nav>
        <p></p>
      </div>
    </footer>
  )
}

function ExternalLinkIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-3.5 w-3.5"
      aria-hidden="true"
    >
      <path d="M14 3h7v7" />
      <path d="M10 14L21 3" />
      <path d="M21 14v7h-7" />
      <path d="M3 10v11h11" />
    </svg>
  );
}
