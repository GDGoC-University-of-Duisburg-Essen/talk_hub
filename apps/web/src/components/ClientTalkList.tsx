"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { type TalkWithSlug } from "@/lib/talks";

export function ClientTalkList({ talks, availableTags }: { talks: TalkWithSlug[], availableTags: string[] }) {
  const [search, setSearch] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showFiltersMobile, setShowFiltersMobile] = useState(false);
  const [todayTimestamp, setTodayTimestamp] = useState(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today.getTime();
  });

  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const filteredTalks = useMemo(() => {
    return talks.filter(talk => {
      const matchesSearch = talk.title.toLowerCase().includes(search.toLowerCase()) ||
        talk.speaker.toLowerCase().includes(search.toLowerCase());
      const matchesTags = selectedTags.length === 0 ||
        selectedTags.every(tag => talk.tags?.includes(tag));
      return matchesSearch && matchesTags;
    });
  }, [talks, search, selectedTags]);

  const pendingTalks = useMemo(() => {
    return filteredTalks.filter(talk => {
      const talkDate = new Date(talk.date);
      talkDate.setHours(0, 0, 0, 0);
      return talkDate.getTime() > todayTimestamp;
    });
  }, [filteredTalks, todayTimestamp]);

  const nonPendingTalks = useMemo(() => {
    return filteredTalks.filter(talk => {
      const talkDate = new Date(talk.date);
      talkDate.setHours(0, 0, 0, 0);
      return talkDate.getTime() <= todayTimestamp;
    });
  }, [filteredTalks, todayTimestamp]);

  const groupedByYear = useMemo(() => {
    const groups: Record<number, TalkWithSlug[]> = {};
    for (const talk of nonPendingTalks) {
      if (!groups[talk.year]) groups[talk.year] = [];
      groups[talk.year].push(talk);
    }
    return groups;
  }, [nonPendingTalks]);

  const years = Object.keys(groupedByYear).map(Number).sort((a, b) => b - a);

  return (
    <div className="flex flex-col md:flex-row gap-8">
      {/* Sidebar Filters */}
      <aside className="w-full md:w-64 shrink-0 space-y-6">
        <div>
          <label htmlFor="search" className="block text-sm font-medium mb-2">Suchen</label>
          <input
            id="search"
            type="text"
            placeholder="Titel oder Speaker..."
            className="w-full p-2 rounded-md border border-[var(--color-gdg-grey-300)] dark:border-[var(--color-gdg-grey-700)] bg-background text-foreground"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="bg-card md:bg-transparent border border-[var(--color-gdg-grey-200)] dark:border-[var(--color-gdg-grey-800)] md:border-none p-4 md:p-0 rounded-lg">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium">
              Filtern nach Tags
              {selectedTags.length > 0 && (
                <span className="md:hidden ml-2 text-[10px] bg-[var(--color-gdg-blue)] text-white px-2 py-0.5 rounded-full">
                  {selectedTags.length}
                </span>
              )}
            </h3>
            <button
              onClick={() => setShowFiltersMobile(!showFiltersMobile)}
              className="text-xs text-[var(--color-gdg-blue)] font-medium md:hidden"
            >
              {showFiltersMobile ? "Ausblenden" : "Anzeigen"}
            </button>
          </div>
          <div className={`flex-wrap gap-2 ${showFiltersMobile ? 'flex' : 'hidden md:flex'}`}>
            {availableTags.map(tag => (
              <button
                key={tag}
                onClick={() => toggleTag(tag)}
                className={`px-3 py-1 rounded-full text-xs font-medium cursor-pointer transition-colors ${selectedTags.includes(tag)
                    ? 'bg-[var(--color-gdg-blue)] text-white'
                    : 'bg-background md:bg-card border border-[var(--color-gdg-grey-200)] dark:border-[var(--color-gdg-grey-800)] hover:bg-[var(--color-gdg-grey-100)] dark:hover:bg-[var(--color-gdg-grey-800)]'
                  }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 space-y-12">
        {pendingTalks.length === 0 && years.length === 0 ? (
          <div className="text-center py-12 text-muted">Keine Ergebnisse für deine Suche gefunden.</div>
        ) : (
          <>
            {pendingTalks.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-4">
                  Anstehende Talks
                  <div className="h-px bg-[var(--color-gdg-grey-200)] dark:bg-[var(--color-gdg-grey-700)] flex-1" />
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {pendingTalks.map(talk => (
                    <TalkCard key={talk.slug} talk={talk} isPending={true} />
                  ))}
                </div>
              </section>
            )}

            {years.length > 0 && years.map(year => (
              <TalkSection key={year} title={year.toString()} talks={groupedByYear[year]} isPending={false} />
            ))}
          </>
        )}
      </main>
    </div>
  );
}


function TalkSection({ title, talks, isPending }: { title: string, talks: TalkWithSlug[], isPending: boolean }) {
  return (
    <section key={title}>
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-4">
        {title}
        <div className="h-px bg-[var(--color-gdg-grey-200)] dark:bg-[var(--color-gdg-grey-700)] flex-1" />
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {talks.map(talk => (
          <TalkCard key={talk.slug} talk={talk} isPending={isPending} />
        ))}
      </div>
    </section>
  )
}


function TalkCard({ talk, isPending }: { talk: TalkWithSlug, isPending: boolean }) {
  return (
    <Link
      key={talk.slug}
      href={`/talks/${talk.year}/${talk.slug}`}
      className="block group h-full"
    >
      <div className="h-full rounded-xl border border-[var(--color-gdg-grey-200)] dark:border-[var(--color-gdg-grey-800)] bg-card overflow-hidden shadow-sm hover:shadow-md transition-shadow group-hover:border-[var(--color-gdg-blue)] flex flex-col">
        <div className="p-5 flex-1 flex flex-col">
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-semibold text-[var(--color-gdg-blue)] uppercase tracking-wider">{talk.category}</span>
            <div className="flex items-center gap-2">
              {isPending && (
                <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold bg-amber-500 text-white uppercase tracking-wide">Anstehend</span>
              )}
              <span className="text-xs text-muted">{talk.language}</span>
            </div>
          </div>
          <h3 className="text-lg font-bold mb-1 leading-tight group-hover:text-[var(--color-gdg-blue)] transition-colors">{talk.title}</h3>
          <p className="text-sm text-muted mb-4">{talk.speaker}</p>

          <div className="mt-auto">
            <div className="flex flex-wrap gap-1 mt-3">
              {talk.tags?.slice(0, 3).map(tag => (
                <span key={tag} className="text-[10px] px-2 py-0.5 rounded border border-[var(--color-gdg-grey-200)] dark:border-[var(--color-gdg-grey-700)] bg-background text-muted">
                  {tag}
                </span>
              ))}
              {talk.tags && talk.tags.length > 3 && (
                <span className="text-[10px] px-2 py-0.5 rounded border border-[var(--color-gdg-grey-200)] dark:border-[var(--color-gdg-grey-700)] bg-background text-muted">+{talk.tags.length - 3}</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}
