"use client";

import { useState } from "react";

import { UploadCloud, CheckCircle, Loader2 } from "lucide-react";
import { useDropzone } from "react-dropzone";

export default function AdminPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { "application/pdf": [".pdf"] },
    maxFiles: 1,
    onDrop: (acceptedFiles) => setFile(acceptedFiles[0]),
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setIsSubmitting(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    if (file) {
      formData.append("file", file);
    }

    try {
      const res = await fetch("/api/talks", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Ein Fehler ist aufgetreten.");
      }

      setSuccess(true);
      (e.target as HTMLFormElement).reset();
      setFile(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="max-w-2xl mx-auto text-center py-20 bg-card rounded-xl border border-[var(--color-gdg-grey-200)] flex flex-col items-center">
        <CheckCircle className="w-16 h-16 text-[var(--color-gdg-green)] mb-6" />
        <h2 className="text-3xl font-bold mb-4">Talk erfolgreich hinzugefügt!</h2>
        <p className="text-muted mb-8 text-lg">Der Vortrag wurde lokal gespeichert und ist nun im Talks-Ordner verfügbar.</p>
        <div className="flex gap-4">
          <button onClick={() => setSuccess(false)} className="px-6 py-2 bg-[var(--color-gdg-blue)] text-white font-medium rounded-lg hover:bg-blue-600 transition-colors">
            Weiteren Talk hinzufügen
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold mb-2">Neuen Talk hinterlegen</h1>
        <p className="text-muted text-lg">Fülle das Formular aus und lade die PDF hoch, um einen neuen Vortrag anzulegen.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 bg-card p-6 md:p-8 rounded-xl border border-[var(--color-gdg-grey-200)] shadow-sm">
        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg text-sm mb-6 border border-red-200">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold">Titel *</label>
            <input name="title" required className="w-full p-2.5 rounded-lg border border-[var(--color-gdg-grey-300)] focus:border-[var(--color-gdg-blue)] focus:ring-1 focus:ring-[var(--color-gdg-blue)] outline-none transition-all" placeholder="z.B. Flutter Intro" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold">Speaker *</label>
            <input name="speaker" required className="w-full p-2.5 rounded-lg border border-[var(--color-gdg-grey-300)] focus:border-[var(--color-gdg-blue)] focus:ring-1 focus:ring-[var(--color-gdg-blue)] outline-none transition-all" placeholder="z.B. Max Mustermann" />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold">Kategorie *</label>
          <input name="category" required className="w-full p-2.5 rounded-lg border border-[var(--color-gdg-grey-300)] outline-none transition-all focus:border-[var(--color-gdg-blue)]" placeholder="z.B. App Entwicklung" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold">Sprache</label>
            <select name="language" className="w-full p-2.5 rounded-lg border border-[var(--color-gdg-grey-300)] outline-none bg-white focus:border-[var(--color-gdg-blue)]">
              <option value="DE">Deutsch (DE)</option>
              <option value="EN">Englisch (EN)</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold">Level</label>
            <select name="level" className="w-full p-2.5 rounded-lg border border-[var(--color-gdg-grey-300)] outline-none bg-white focus:border-[var(--color-gdg-blue)]">
              <option value="Anfänger">Anfänger</option>
              <option value="Fortgeschritten">Fortgeschritten</option>
              <option value="Experte">Experte</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold">Datum *</label>
            <input name="date" type="date" required className="w-full p-2.5 rounded-lg border border-[var(--color-gdg-grey-300)] outline-none transition-all focus:border-[var(--color-gdg-blue)]" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold">Event Art</label>
            <select name="event" className="w-full p-2.5 rounded-lg border border-[var(--color-gdg-grey-300)] outline-none bg-white focus:border-[var(--color-gdg-blue)]">
              <option value="GDG Official">GDG Official</option>
              <option value="GDG Supported">GDG Supported</option>
              <option value="Extern">Extern</option>
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold">Tags (kommagetrennt)</label>
          <input name="tags" className="w-full p-2.5 rounded-lg border border-[var(--color-gdg-grey-300)] outline-none transition-all focus:border-[var(--color-gdg-blue)]" placeholder="Flutter, Einführung, Dart" />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold">Beschreibung</label>
          <textarea name="description" rows={3} className="w-full p-2.5 rounded-lg border border-[var(--color-gdg-grey-300)] outline-none transition-all focus:border-[var(--color-gdg-blue)]" placeholder="Kurze Beschreibung des Vortrages..."></textarea>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold">Präsentationsfolien (PDF)</label>
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${isDragActive ? 'border-[var(--color-gdg-blue)] bg-blue-50' : 'border-[var(--color-gdg-grey-300)] hover:bg-[var(--color-gdg-grey-50)]'
              }`}
          >
            <input {...getInputProps()} />
            <UploadCloud className="w-10 h-10 mx-auto text-muted mb-4" />
            {file ? (
              <p className="font-medium text-[var(--color-gdg-blue)]">{file.name} (ausgewählt)</p>
            ) : (
              <div>
                <p className="text-sm font-medium mb-1">PDF hierher ziehen oder klicken zum Auswählen</p>
                <p className="text-xs text-muted">Maximal 1 Datei (.pdf)</p>
              </div>
            )}
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3.5 bg-[var(--color-gdg-blue)] text-white font-bold rounded-xl hover:bg-blue-600 transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center space-x-2 mt-4"
        >
          {isSubmitting ? (
            <><Loader2 className="w-5 h-5 animate-spin" /><span>Speichern...</span></>
          ) : (
            <span>Talk Hinzufügen</span>
          )}
        </button>
      </form>
    </div>
  );
}
