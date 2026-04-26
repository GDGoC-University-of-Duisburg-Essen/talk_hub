"use client";

import { useState, useEffect } from "react";

import { UploadCloud, CheckCircle, Loader2 } from "lucide-react";
import { useDropzone } from "react-dropzone";

export default function AdminPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [date, setDate] = useState("");

  const [mode, setMode] = useState<'add' | 'edit'>('add');
  const [talks, setTalks] = useState<any[]>([]);
  const [selectedTalk, setSelectedTalk] = useState<any | null>(null);
  const [editSuccessMsg, setEditSuccessMsg] = useState("");

  const isFuture = date ? new Date(date) > new Date() : false;

  useEffect(() => {
    if (mode === 'edit') {
      fetch('/api/talks').then(r => r.json()).then(data => setTalks(data)).catch(console.error);
    }
  }, [mode]);

  useEffect(() => {
    if (mode === 'edit' && selectedTalk) {
      setDate(selectedTalk.date || "");
    } else if (mode === 'add') {
      setDate("");
      setSelectedTalk(null);
    }
  }, [mode, selectedTalk]);

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

    if (mode === 'edit' && selectedTalk) {
      formData.append("originalSlug", selectedTalk.slug);
      formData.append("originalYear", selectedTalk.year.toString());
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
      if (mode === 'edit') {
        setEditSuccessMsg(`Talk "${formData.get("title")}" erfolgreich aktualisiert!`);
        fetch('/api/talks').then(r => r.json()).then(data => setTalks(data)).catch();
      } else {
        setEditSuccessMsg("Der Vortrag wurde lokal gespeichert und ist nun im Talks-Ordner verfügbar.");
      }
      (e.target as HTMLFormElement).reset();
      setFile(null);
      setDate("");
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
        <h2 className="text-3xl font-bold mb-4">
          {mode === 'edit' ? "Talk erfolgreich bearbeitet!" : "Talk erfolgreich hinzugefügt!"}
        </h2>
        <p className="text-muted mb-8 text-lg">{editSuccessMsg}</p>
        <div className="flex gap-4">
          <button onClick={() => {
            setSuccess(false);
            if (mode === 'edit') setSelectedTalk(null);
          }} className="px-6 py-2 bg-[var(--color-gdg-blue)] text-white font-medium rounded-lg hover:bg-blue-600 transition-colors">
            {mode === 'edit' ? "Weiteren Talk bearbeiten" : "Weiteren Talk hinzufügen"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      
      <div className="relative flex bg-[#F1F3F4] rounded-2xl p-1.5 w-full max-w-xs mx-auto mb-10 overflow-hidden shadow-inner border border-transparent">
        <div 
          className={`absolute top-1.5 bottom-1.5 left-1.5 right-1.5 pointer-events-none`}
        >
          <div 
            className={`h-full w-1/2 bg-white rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.12)] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
              mode === 'edit' ? 'translate-x-full' : 'translate-x-0'
            }`}
          />
        </div>
        <button 
          type="button"
          onClick={() => setMode('add')} 
          className={`relative z-10 flex-1 py-2 text-sm font-bold transition-colors duration-300 ${mode === 'add' ? 'text-[var(--color-gdg-blue)]' : 'text-[#5F6368] hover:text-[#202124]'}`}>
          Hinzufügen
        </button>
        <button 
          type="button"
          onClick={() => setMode('edit')} 
          className={`relative z-10 flex-1 py-2 text-sm font-bold transition-colors duration-300 ${mode === 'edit' ? 'text-[var(--color-gdg-blue)]' : 'text-[#5F6368] hover:text-[#202124]'}`}>
          Bearbeiten
        </button>
      </div>

      <div className="mb-8">
        <h1 className="text-3xl font-extrabold mb-2">
          {mode === 'edit' ? "Bestehenden Talk bearbeiten" : "Neuen Talk hinterlegen"}
        </h1>
        <p className="text-muted text-lg">
          {mode === 'edit' ? "Wähle einen Talk aus der Liste und passe die Details an." : "Fülle das Formular aus und lade auf Wunsch eine PDF hoch, um einen neuen Vortrag anzulegen."}
        </p>
      </div>

      {mode === 'edit' && (
        <div className="mb-6 space-y-2 bg-card p-6 rounded-xl border border-[var(--color-gdg-grey-200)] shadow-sm">
          <label className="text-sm font-semibold">Zu bearbeitender Talk *</label>
          <select 
            className="w-full p-2.5 rounded-lg border border-[var(--color-gdg-grey-300)] outline-none bg-white focus:border-[var(--color-gdg-blue)]"
            onChange={(e) => {
              const talk = talks.find(t => `${t.year}-${t.slug}` === e.target.value);
              setSelectedTalk(talk || null);
            }}
            value={selectedTalk ? `${selectedTalk.year}-${selectedTalk.slug}` : ""}
          >
            <option value="" disabled>-- Bitte wählen --</option>
            {talks.map(t => (
               <option key={`${t.year}-${t.slug}`} value={`${t.year}-${t.slug}`}>
                 {new Date(t.date).toLocaleDateString('de-DE')} - {t.title} ({t.speaker})
               </option>
            ))}
          </select>
        </div>
      )}

      {(mode === 'add' || (mode === 'edit' && selectedTalk)) && (
      <form key={mode + (selectedTalk ? selectedTalk.slug : '')} onSubmit={handleSubmit} className="space-y-6 bg-card p-6 md:p-8 rounded-xl border border-[var(--color-gdg-grey-200)] shadow-sm">
        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg text-sm mb-6 border border-red-200">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold">Titel *</label>
            <input name="title" required defaultValue={selectedTalk?.title || ""} className="w-full p-2.5 rounded-lg border border-[var(--color-gdg-grey-300)] focus:border-[var(--color-gdg-blue)] focus:ring-1 focus:ring-[var(--color-gdg-blue)] outline-none transition-all" placeholder="z.B. Flutter Intro" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold">Speaker *</label>
            <input name="speaker" required defaultValue={selectedTalk?.speaker || ""} className="w-full p-2.5 rounded-lg border border-[var(--color-gdg-grey-300)] focus:border-[var(--color-gdg-blue)] focus:ring-1 focus:ring-[var(--color-gdg-blue)] outline-none transition-all" placeholder="z.B. Max Mustermann" />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold">Kategorie *</label>
          <input name="category" required defaultValue={selectedTalk?.category || ""} className="w-full p-2.5 rounded-lg border border-[var(--color-gdg-grey-300)] outline-none transition-all focus:border-[var(--color-gdg-blue)]" placeholder="z.B. App Entwicklung" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold">Sprache</label>
            <select name="language" defaultValue={selectedTalk?.language || "DE"} className="w-full p-2.5 rounded-lg border border-[var(--color-gdg-grey-300)] outline-none bg-white focus:border-[var(--color-gdg-blue)]">
              <option value="DE">Deutsch (DE)</option>
              <option value="EN">Englisch (EN)</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold">Level</label>
            <select name="level" defaultValue={selectedTalk?.level || "Anfänger"} className="w-full p-2.5 rounded-lg border border-[var(--color-gdg-grey-300)] outline-none bg-white focus:border-[var(--color-gdg-blue)]">
              <option value="Anfänger">Anfänger</option>
              <option value="Fortgeschritten">Fortgeschritten</option>
              <option value="Experte">Experte</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold">Datum *</label>
            <input name="date" type="date" required value={date} onChange={(e) => setDate(e.target.value)} className="w-full p-2.5 rounded-lg border border-[var(--color-gdg-grey-300)] outline-none transition-all focus:border-[var(--color-gdg-blue)]" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold">Event Art</label>
            <select name="event" defaultValue={selectedTalk?.event || "GDG Official"} className="w-full p-2.5 rounded-lg border border-[var(--color-gdg-grey-300)] outline-none bg-white focus:border-[var(--color-gdg-blue)]">
              <option value="GDG Official">GDG Official</option>
              <option value="GDG Supported">GDG Supported</option>
              <option value="Extern">Extern</option>
            </select>
          </div>
        </div>

        {isFuture && (
          <div className="space-y-2">
            <label className="text-sm font-semibold">Registrierungs-Link</label>
            <input name="eventLink" type="url" defaultValue={selectedTalk?.eventLink || ""} className="w-full p-2.5 rounded-lg border border-[var(--color-gdg-grey-300)] outline-none transition-all focus:border-[var(--color-gdg-blue)]" placeholder="https://..." />
          </div>
        )}

        <div className="space-y-2">
          <label className="text-sm font-semibold">Tags (kommagetrennt)</label>
          <input name="tags" defaultValue={(selectedTalk?.tags || []).join(", ")} className="w-full p-2.5 rounded-lg border border-[var(--color-gdg-grey-300)] outline-none transition-all focus:border-[var(--color-gdg-blue)]" placeholder="Flutter, Einführung, Dart" />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold">Beschreibung</label>
          <textarea name="description" defaultValue={selectedTalk?.description || ""} rows={3} className="w-full p-2.5 rounded-lg border border-[var(--color-gdg-grey-300)] outline-none transition-all focus:border-[var(--color-gdg-blue)]" placeholder="Kurze Beschreibung des Vortrages..."></textarea>
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
            <span>{mode === 'edit' ? "Änderungen Speichern" : "Talk Hinzufügen"}</span>
          )}
        </button>
      </form>
      )}
    </div>
  );
}
