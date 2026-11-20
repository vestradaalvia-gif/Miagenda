import { useState } from 'react';
import { FileText, Pencil, Plus, Search, Trash2 } from 'lucide-react';
import { COURSE_MODULES, formatFriendlyDate } from '../data/initialData';
import { CourseNote } from '../types/agenda';

interface NotasViewProps {
  notes: CourseNote[];
  onAddNote: () => void;
  onEditNote: (item: CourseNote) => void;
  onDeleteNote: (item: CourseNote) => void;
}

export function NotasView({ notes, onAddNote, onEditNote, onDeleteNote }: NotasViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTopic, setSelectedTopic] = useState<string>('todos');

  const normalizedQuery = searchTerm.trim().toLowerCase();

  const filteredNotes = notes.filter((note) => {
    const matchesTopic = selectedTopic === 'todos' || note.topic === selectedTopic;
    const matchesQuery =
      !normalizedQuery ||
      note.title.toLowerCase().includes(normalizedQuery) ||
      note.content.toLowerCase().includes(normalizedQuery) ||
      note.topic.toLowerCase().includes(normalizedQuery);
    return matchesTopic && matchesQuery;
  });

  return (
    <div className="space-y-5">
      {/* Cabecera, búsqueda y filtro por tema */}
      <section className="rounded-2xl border border-slate-200 bg-white p-5 space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="font-display text-2xl font-bold text-slate-900">Notas y apuntes</h1>
            <p className="text-base text-slate-600 tabular-nums">
              {notes.length} apuntes guardados sobre Google AI Studio
            </p>
          </div>
          <button
            type="button"
            onClick={onAddNote}
            className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-xl bg-blue-700 px-5 py-3 text-base font-semibold text-white hover:bg-blue-800 active:scale-[0.99] transition-all whitespace-nowrap"
          >
            <Plus className="h-5 w-5 shrink-0" />
            <span>Nuevo apunte</span>
          </button>
        </div>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <div className="relative">
            <Search
              className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400"
              aria-hidden="true"
            />
            <input
              type="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar en tus apuntes..."
              aria-label="Buscar en tus apuntes"
              className="w-full min-h-[46px] rounded-xl border border-slate-300 bg-white pl-11 pr-4 py-2.5 text-base text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
            />
          </div>

          <select
            value={selectedTopic}
            onChange={(e) => setSelectedTopic(e.target.value)}
            aria-label="Filtrar apuntes por tema del curso"
            className="w-full min-h-[46px] rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-base text-slate-900 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
          >
            <option value="todos">Todos los temas del curso</option>
            {COURSE_MODULES.map((mod) => (
              <option key={mod} value={mod}>
                {mod}
              </option>
            ))}
          </select>
        </div>
      </section>

      {/* Lista de apuntes */}
      {filteredNotes.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center space-y-4">
          <FileText className="mx-auto h-10 w-10 text-slate-400" />
          <div className="space-y-1">
            <p className="text-lg font-semibold text-slate-800">
              {notes.length === 0
                ? 'Todavía no tienes apuntes guardados.'
                : 'No encontramos apuntes con ese filtro.'}
            </p>
            <p className="text-base text-slate-600">
              Guarda ideas clave sobre prompts, modelos Gemini o el SDK para repasar después.
            </p>
          </div>
          <button
            type="button"
            onClick={onAddNote}
            className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-xl bg-blue-700 px-5 py-3 text-base font-semibold text-white hover:bg-blue-800 transition-colors"
          >
            <Plus className="h-5 w-5" />
            <span>Crear nuevo apunte</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {filteredNotes.map((note) => (
            <article
              key={note.id}
              className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 space-y-4"
            >
              <div className="space-y-2">
                <p className="text-sm font-medium text-slate-600">
                  <span className="font-semibold text-blue-700">{note.topic}</span>
                  <span aria-hidden="true" className="mx-2 text-slate-300">·</span>
                  <span>Actualizado: {formatFriendlyDate(note.updatedAt)}</span>
                </p>
                <h2 className="font-display text-lg font-bold text-slate-900 leading-snug">
                  {note.title}
                </h2>
                <p className="text-base leading-relaxed text-slate-700 whitespace-pre-line">
                  {note.content}
                </p>
              </div>

              <div className="flex flex-wrap gap-2 border-t border-slate-100 pt-3">
                <button
                  type="button"
                  onClick={() => onEditNote(note)}
                  className="inline-flex min-h-[44px] flex-1 items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50 transition-colors"
                >
                  <Pencil className="h-4 w-4 shrink-0" />
                  <span>Editar apunte</span>
                </button>
                <button
                  type="button"
                  onClick={() => onDeleteNote(note)}
                  className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl border border-red-200 bg-white px-4 py-2 text-sm font-semibold text-red-700 hover:bg-red-50 transition-colors"
                >
                  <Trash2 className="h-4 w-4 shrink-0" />
                  <span>Eliminar</span>
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
