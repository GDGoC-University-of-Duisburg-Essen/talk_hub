import { getTalks, getUniqueTags } from "@/lib/talks";
import { ClientTalkList } from "@/components/ClientTalkList";

export default function Home() {
  const talks = getTalks();
  const tags = getUniqueTags(talks);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col items-center mb-12 text-center pt-8">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
          GDG{" "}
          <span className="text-[var(--color-gdg-blue)]">T</span>
          <span className="text-[var(--color-gdg-red)]">a</span>
          <span className="text-[var(--color-gdg-yellow)]">l</span>
          <span className="text-[var(--color-gdg-green)]">k</span>{" "}
          Hub
        </h1>
        <p className="text-xl text-muted max-w-2xl">
          Entdecke Präsentationen und Vorträge von unseren GDG on Campus an der Universität Duisburg-Essen.
        </p>
      </div>
      
      <ClientTalkList talks={talks} availableTags={tags} />
    </div>
  );
}
